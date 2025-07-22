
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
  private async savePaymentRecord(paymentData: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    try {
      console.log('Saving payment record:', paymentData);
      
      const { data, error } = await supabase
        .from('payment_records')
        .insert([{
          order_id: paymentData.order_id || null,
          payment_reference: paymentData.payment_reference,
          amount: paymentData.amount,
          status: paymentData.status,
          payment_method: paymentData.payment_method,
          poll_url: paymentData.poll_url || null,
          redirect_url: paymentData.redirect_url || null,
          instructions: paymentData.instructions || null
        }])
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
  private async updatePaymentRecord(paymentReference: string, updates: Partial<Omit<PaymentRecord, 'id' | 'created_at'>>): Promise<boolean> {
    try {
      console.log('Updating payment record:', paymentReference, updates);
      
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('payment_records')
        .update(updateData)
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

  // Send web-based payment via Supabase Edge Function to avoid CORS
  async send(payment: any, orderId?: string): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment via Edge Function:', payment);
      
      // Save initial payment record
      const paymentRecord = {
        order_id: orderId,
        payment_reference: payment.reference,
        amount: payment.total,
        status: 'pending' as const,
        payment_method: 'paynow_web'
      };
      
      await this.savePaymentRecord(paymentRecord);

      // Call Supabase Edge Function to handle Paynow API
      const { data: response, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'web',
          payment: {
            reference: payment.reference,
            email: payment.email,
            items: payment.items || [{ name: 'Order Items', amount: payment.total }],
            returnUrl: this.returnUrl,
            resultUrl: this.resultUrl
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        return {
          success: false,
          error: error.message || 'Payment initiation failed'
        };
      }

      console.log('Edge function response:', response);

      if (response?.success) {
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
        return {
          success: false,
          error: response?.error || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Payment error:', error);
      await this.updatePaymentRecord(payment.reference, { status: 'failed' });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Send mobile-based payment via Supabase Edge Function
  async sendMobile(payment: any, phoneNumber: string, method: 'ecocash' | 'onemoney', orderId?: string): Promise<PaynowResponse> {
    try {
      console.log('Sending mobile payment via Edge Function:', { payment, phoneNumber, method });
      
      // Save initial payment record
      const paymentRecord = {
        order_id: orderId,
        payment_reference: payment.reference,
        amount: payment.total,
        status: 'pending' as const,
        payment_method: `paynow_${method}`
      };
      
      await this.savePaymentRecord(paymentRecord);
      
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0');
      console.log('Cleaned phone number:', cleanPhone);
      
      // Call Supabase Edge Function to handle Paynow API
      const { data: response, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'mobile',
          payment: {
            reference: payment.reference,
            email: payment.email,
            items: payment.items || [{ name: 'Order Items', amount: payment.total }],
            phone: cleanPhone,
            method: method
          }
        }
      });

      if (error) {
        console.error('Mobile edge function error:', error);
        await this.updatePaymentRecord(payment.reference, { status: 'failed' });
        return {
          success: false,
          error: error.message || 'Mobile payment initiation failed'
        };
      }

      console.log('Mobile edge function response:', response);

      if (response?.success) {
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
        return {
          success: false,
          error: response?.error || 'Mobile payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Mobile payment error:', error);
      await this.updatePaymentRecord(payment.reference, { status: 'failed' });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mobile payment network error occurred'
      };
    }
  }

  // Poll transaction status via Edge Function
  async pollTransaction(pollUrl: string): Promise<{
    status: string;
    paid: () => boolean;
    reference?: string;
    amount?: number;
  }> {
    try {
      console.log('Polling transaction via Edge Function:', pollUrl);
      
      const { data: response, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'poll',
          pollUrl: pollUrl
        }
      });

      if (error) {
        console.error('Poll edge function error:', error);
        return {
          status: 'Error',
          paid: () => false
        };
      }

      console.log('Poll response:', response);

      // Update payment record based on status
      if (response?.reference) {
        const paymentStatus = response.paid ? 'paid' : 'pending';
        await this.updatePaymentRecord(response.reference, { 
          status: paymentStatus as 'paid' | 'pending' 
        });

        // If payment is successful, update the associated order
        if (response.paid) {
          await this.updateOrderOnPaymentSuccess(response.reference);
        }
      }

      return {
        status: response?.status || 'Unknown',
        paid: () => response?.paid === true,
        reference: response?.reference,
        amount: response?.amount ? parseFloat(response.amount.toString()) : undefined
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
        .from('payment_records')
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
