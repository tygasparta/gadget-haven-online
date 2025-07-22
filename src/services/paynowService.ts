
import { Paynow } from 'paynow';

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

  constructor(integrationId?: string, integrationKey?: string) {
    // Use provided credentials or fallback to defaults for development
    const id = integrationId || '21058';
    const key = integrationKey || 'ece6db09-1654-4bcf-8494-ac98155f41e7';
    
    // Initialize Paynow with credentials
    this.paynow = new Paynow(id, key);
    
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

  // Send web-based payment
  async send(payment: any): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment:', payment);
      
      const response = await this.paynow.send(payment);
      console.log('Paynow web response:', response);

      if (response.success) {
        return {
          success: true,
          redirectUrl: response.redirectUrl,
          pollUrl: response.pollUrl,
          reference: payment.reference
        };
      } else {
        console.error('Web payment failed:', response.error);
        return {
          success: false,
          error: response.error || 'Payment initiation failed'
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

  // Send mobile-based payment (EcoCash/OneMoney)
  async sendMobile(payment: any, phoneNumber: string, method: 'ecocash' | 'onemoney'): Promise<PaynowResponse> {
    try {
      console.log('Sending mobile payment:', { payment, phoneNumber, method });
      
      // Clean phone number (remove spaces, ensure proper format)
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0');
      
      let response;
      if (method === 'ecocash') {
        // Use the correct method for EcoCash
        response = await this.paynow.sendMobile(payment, cleanPhone, 'ecocash');
      } else if (method === 'onemoney') {
        // Use the correct method for OneMoney
        response = await this.paynow.sendMobile(payment, cleanPhone, 'onemoney');
      } else {
        throw new Error(`Unsupported mobile method: ${method}`);
      }

      console.log('Paynow mobile response:', response);

      if (response.success) {
        return {
          success: true,
          pollUrl: response.pollUrl,
          reference: payment.reference,
          instructions: response.instructions || `Please check your ${method} for payment instructions`
        };
      } else {
        console.error('Mobile payment failed:', response.error);
        return {
          success: false,
          error: response.error || 'Mobile payment initiation failed'
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

      return {
        status: status.status || 'Unknown',
        paid: () => status.paid,
        reference: status.reference,
        amount: status.amount ? parseFloat(status.amount) : undefined
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
