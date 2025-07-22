
import { Paynow } from 'paynow';
import { supabase } from '@/integrations/supabase/client';

interface PaynowPaymentData {
  reference: string;
  amount: number;
  email: string;
  phone?: string;
  additionalInfo?: string;
  returnUrl?: string;
  resultUrl?: string;
}

interface PaynowResponse {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  reference?: string;
  error?: string;
  instructions?: string;
}

interface PaymentRecord {
  id?: string;
  order_id?: string;
  payment_reference: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  payment_method: string;
  poll_url?: string;
  redirect_url?: string;
  instructions?: string;
  created_at?: string;
  updated_at?: string;
}

class PaynowService {
  private paynow: Paynow;
  public resultUrl: string;
  public returnUrl: string;

  constructor(integrationId?: string, integrationKey?: string) {
    // Use provided credentials or fallback to defaults for development
    const id = integrationId || '21058';
    const key = integrationKey || 'ece6db09-1654-4bcf-8494-ac98155f41e7';
    
    console.log('Initializing Paynow with ID:', id);
    
    // Initialize Paynow with credentials using correct constructor
    this.paynow = new Paynow(id, key);
    
    // Set return and result URLs
    this.resultUrl = `${window.location.origin}/api/paynow/webhook`;
    this.returnUrl = `${window.location.origin}/payment/success`;
    
    this.paynow.resultUrl = this.resultUrl;
    this.paynow.returnUrl = this.returnUrl;

    console.log('Paynow initialized with URLs:', {
      resultUrl: this.resultUrl,
      returnUrl: this.returnUrl
    });
  }

  // Create a payment with reference and optional email
  createPayment(reference: string, email?: string) {
    const payment = this.paynow.createPayment(reference, email || '');
    console.log('Created payment:', { reference, email });
    return payment;
  }

  // Save payment record to database
  private async savePaymentRecord(paymentData: PaymentRecord): Promise<string | null> {
    try {
      console.log('Saving payment record:', paymentData);
      
      const { data, error } = await supabase
        .from('payment_records' as any)
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        console.error('Error saving payment record:', error);
        return null;
      }

      console.log('Payment record saved:', data);
      return data?.id || null;
    } catch (error) {
      console.error('Exception saving payment record:', error);
      return null;
    }
  }

  // Update payment record status
  private async updatePaymentRecord(paymentReference: string, updates: Partial<PaymentRecord>): Promise<boolean> {
    try {
      console.log('Updating payment record:', paymentReference, updates);
      
      const { error } = await supabase
        .from('payment_records' as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', paymentReference);

      if (error) {
        console.error('Error updating payment record:', error);
        return false;
      }

      console.log('Payment record updated successfully');
      return true;
    } catch (error) {
      console.error('Exception updating payment record:', error);
      return false;
    }
  }

  // Send web-based payment
  async send(payment: any, orderId?: string): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment with payment object:', payment);
      
      // Save initial payment record
      const paymentRecord: PaymentRecord = {
        order_id: orderId,
        payment_reference: payment.reference,
        amount: payment.total,
        status: 'pending',
        payment_method: 'paynow_web'
      };
      
      const recordId = await this.savePaymentRecord(paymentRecord);
      
      const response = await this.paynow.send(payment);
      console.log('Raw Paynow web response:', response);

      if (!response) {
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        return {
          success: false,
          error: 'No response received from payment gateway'
        };
      }

      // Handle the response based on Paynow SDK documentation
      if (response.success) {
        // Update payment record with response data
        await this.updatePaymentRecord(payment.reference, {
          status: 'pending',
          poll_url: response.pollUrl,
          redirect_url: response.redirectUrl
        });

        return {
          success: true,
          redirectUrl: response.redirectUrl,
          pollUrl: response.pollUrl,
          reference: response.reference || payment.reference
        };
      } else {
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        console.error('Web payment failed:', response.error);
        return {
          success: false,
          error: response.error || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow web payment error:', error);
      await this.updatePaymentRecord(payment.reference, { status: 'failed' });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Send mobile-based payment (EcoCash/OneMoney)
  async sendMobile(payment: any, phoneNumber: string, method: 'ecocash' | 'onemoney', orderId?: string): Promise<PaynowResponse> {
    try {
      console.log('Sending mobile payment:', { payment, phoneNumber, method });
      
      // Save initial payment record
      const paymentRecord: PaymentRecord = {
        order_id: orderId,
        payment_reference: payment.reference,
        amount: payment.total,
        status: 'pending',
        payment_method: `paynow_${method}`
      };
      
      await this.savePaymentRecord(paymentRecord);
      
      // Clean phone number (remove spaces, ensure proper format)
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0');
      console.log('Cleaned phone number:', cleanPhone);
      
      const response = await this.paynow.sendMobile(payment, cleanPhone, method);
      console.log('Raw Paynow mobile response:', response);

      if (!response) {
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        return {
          success: false,
          error: 'No response received from mobile payment gateway'
        };
      }

      // Handle mobile response based on Paynow SDK documentation
      if (response.success) {
        // Update payment record with response data
        await this.updatePaymentRecord(payment.reference, {
          status: 'pending',
          poll_url: response.pollUrl,
          instructions: response.instructions
        });

        return {
          success: true,
          pollUrl: response.pollUrl,
          reference: response.reference || payment.reference,
          instructions: response.instructions
        };
      } else {
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        console.error('Mobile payment failed:', response.error);
        return {
          success: false,
          error: response.error || 'Mobile payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow mobile payment error:', error);
      await this.updatePaymentRecord(payment.reference, { status: 'failed' });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mobile payment network error occurred'
      };
    }
  }

  // Poll transaction status
  async pollTransaction(pollUrl: string): Promise<{
    status: string;
    paid: () => boolean;
    reference?: string;
    amount?: number;
  }> {
    try {
      console.log('Polling transaction:', pollUrl);
      
      const status = await this.paynow.pollTransaction(pollUrl);
      console.log('Poll response:', status);

      // Update payment record based on status
      if (status?.reference) {
        const paymentStatus = status.paid() ? 'paid' : 'pending';
        await this.updatePaymentRecord(status.reference, { 
          status: paymentStatus as 'paid' | 'pending' 
        });

        // If payment is successful, update the associated order
        if (status.paid()) {
          await this.updateOrderOnPaymentSuccess(status.reference);
        }
      }

      return {
        status: status?.status || 'Unknown',
        paid: () => status?.paid() === true,
        reference: status?.reference,
        amount: status?.amount ? parseFloat(status.amount.toString()) : undefined
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        status: 'Error',
        paid: () => false
      };
    }
  }

  // Update order status when payment is successful
  private async updateOrderOnPaymentSuccess(paymentReference: string): Promise<void> {
    try {
      // Extract order ID from payment reference
      const orderIdMatch = paymentReference.match(/ORDER-(.+)/);
      if (orderIdMatch) {
        const orderId = orderIdMatch[1];
        
        console.log('Updating order status for successful payment:', orderId);
        
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            payment_reference: paymentReference,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
        } else {
          console.log('Order status updated to confirmed');
        }
      }
    } catch (error) {
      console.error('Exception updating order on payment success:', error);
    }
  }

  // Get payment record by reference
  async getPaymentRecord(paymentReference: string): Promise<PaymentRecord | null> {
    try {
      const { data, error } = await supabase
        .from('payment_records' as any)
        .select('*')
        .eq('payment_reference', paymentReference)
        .single();

      if (error) {
        console.error('Error fetching payment record:', error);
        return null;
      }

      return data as PaymentRecord;
    } catch (error) {
      console.error('Exception fetching payment record:', error);
      return null;
    }
  }

  // Legacy method for backward compatibility
  async initiatePayment(paymentData: PaynowPaymentData): Promise<PaynowResponse> {
    const payment = this.createPayment(paymentData.reference, paymentData.email);
    payment.add(paymentData.additionalInfo || 'Order', paymentData.amount);
    
    return this.send(payment);
  }

  // Legacy method for backward compatibility
  async checkPaymentStatus(pollUrl: string): Promise<{
    status: string;
    paid: boolean;
    reference?: string;
    amount?: number;
  }> {
    const result = await this.pollTransaction(pollUrl);
    return {
      status: result.status,
      paid: result.paid(),
      reference: result.reference,
      amount: result.amount
    };
  }
}

export default PaynowService;
export type { PaynowPaymentData, PaynowResponse, PaymentRecord };
