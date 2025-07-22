
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

class PaynowService {
  private paynow: Paynow;
  public resultUrl: string;
  public returnUrl: string;

  constructor() {
    // These will be retrieved from Supabase Edge Function
    // The edge function has access to the secure credentials
    this.paynow = new Paynow('', ''); // Placeholder - will be set via edge function
    
    // Set return and result URLs
    this.resultUrl = `${window.location.origin}/api/paynow/webhook`;
    this.returnUrl = `${window.location.origin}/payment/success`;
    
    this.paynow.resultUrl = this.resultUrl;
    this.paynow.returnUrl = this.returnUrl;
  }

  // Create a payment with reference and optional email
  createPayment(reference: string, email?: string) {
    const payment = this.paynow.createPayment(reference, email || '');
    return payment;
  }

  // Send web-based payment via edge function
  async send(payment: any): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment via edge function:', payment);
      
      const { data, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'web',
          reference: payment.reference,
          email: payment.email,
          items: payment.items,
          returnUrl: this.returnUrl,
          resultUrl: this.resultUrl
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          error: error.message || 'Payment initiation failed'
        };
      }

      console.log('Paynow web response:', data);

      if (data.success) {
        return {
          success: true,
          redirectUrl: data.redirectUrl,
          pollUrl: data.pollUrl,
          reference: payment.reference
        };
      } else {
        return {
          success: false,
          error: data.error || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow web payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Send mobile-based payment via edge function
  async sendMobile(payment: any, phoneNumber: string, method: 'ecocash' | 'onemoney'): Promise<PaynowResponse> {
    try {
      console.log('Sending mobile payment via edge function:', { payment, phoneNumber, method });
      
      const { data, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'mobile',
          method: method,
          reference: payment.reference,
          email: payment.email,
          items: payment.items,
          phoneNumber: phoneNumber,
          returnUrl: this.returnUrl,
          resultUrl: this.resultUrl
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          error: error.message || 'Mobile payment initiation failed'
        };
      }

      console.log('Paynow mobile response:', data);

      if (data.success) {
        return {
          success: true,
          pollUrl: data.pollUrl,
          reference: payment.reference,
          instructions: data.instructions || `Please check your ${method} for payment instructions`
        };
      } else {
        return {
          success: false,
          error: data.error || 'Mobile payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow mobile payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Poll transaction status via edge function
  async pollTransaction(pollUrl: string): Promise<{
    status: string;
    paid: () => boolean;
    reference?: string;
    amount?: number;
  }> {
    try {
      console.log('Polling transaction via edge function:', pollUrl);
      
      const { data, error } = await supabase.functions.invoke('paynow-payment', {
        body: {
          type: 'poll',
          pollUrl: pollUrl
        }
      });

      if (error) {
        console.error('Poll error:', error);
        return {
          status: 'Error',
          paid: () => false
        };
      }

      console.log('Poll response:', data);

      return {
        status: data.status || 'Unknown',
        paid: () => data.paid || false,
        reference: data.reference,
        amount: data.amount ? parseFloat(data.amount) : undefined
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        status: 'Error',
        paid: () => false
      };
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
export type { PaynowPaymentData, PaynowResponse };
