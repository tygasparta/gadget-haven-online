
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
    
    console.log('Initializing Paynow with ID:', id);
    
    // Initialize Paynow with credentials
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

  // Send web-based payment
  async send(payment: any): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment with payment object:', payment);
      
      const response = await this.paynow.send(payment);
      console.log('Raw Paynow web response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'No response');

      // The Paynow SDK might return different response formats
      if (!response) {
        console.error('No response received from Paynow');
        return {
          success: false,
          error: 'No response received from payment gateway'
        };
      }

      // Check if it's a successful response based on common Paynow response patterns
      let isSuccess = false;
      let redirectUrl = '';
      let pollUrl = '';
      let errorMessage = '';

      // Handle different possible response formats
      if (typeof response === 'object') {
        // Check for success indicators
        isSuccess = response.success === true || 
                   response.success === 'true' || 
                   response.status === 'Ok' ||
                   response.status === 'ok' ||
                   (response.browserurl && response.browserurl.length > 0) ||
                   (response.redirecturl && response.redirecturl.length > 0);

        // Extract redirect URL from various possible properties
        redirectUrl = response.browserurl || 
                     response.redirecturl || 
                     response.redirectUrl || 
                     response.redirect_url || 
                     '';

        // Extract poll URL
        pollUrl = response.pollurl || 
                 response.pollUrl || 
                 response.poll_url || 
                 '';

        // Extract error message
        errorMessage = response.error || 
                      response.message || 
                      response.statusmessage ||
                      '';
      }

      console.log('Parsed response:', { isSuccess, redirectUrl, pollUrl, errorMessage });

      if (isSuccess && redirectUrl) {
        return {
          success: true,
          redirectUrl: redirectUrl,
          pollUrl: pollUrl,
          reference: payment.reference || response.reference
        };
      } else {
        console.error('Web payment failed:', { response, errorMessage });
        return {
          success: false,
          error: errorMessage || 'Payment initiation failed - please check your Paynow credentials'
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
      console.log('Cleaned phone number:', cleanPhone);
      
      let response;
      if (method === 'ecocash') {
        console.log('Calling sendMobile for EcoCash...');
        response = await this.paynow.sendMobile(payment, cleanPhone, 'ecocash');
      } else if (method === 'onemoney') {
        console.log('Calling sendMobile for OneMoney...');
        response = await this.paynow.sendMobile(payment, cleanPhone, 'onemoney');
      } else {
        throw new Error(`Unsupported mobile method: ${method}`);
      }

      console.log('Raw Paynow mobile response:', response);
      console.log('Mobile response type:', typeof response);
      console.log('Mobile response keys:', response ? Object.keys(response) : 'No response');

      if (!response) {
        console.error('No mobile response received from Paynow');
        return {
          success: false,
          error: 'No response received from mobile payment gateway'
        };
      }

      // Handle mobile response formats
      let isSuccess = false;
      let pollUrl = '';
      let instructions = '';
      let errorMessage = '';

      if (typeof response === 'object') {
        // Check for success indicators
        isSuccess = response.success === true || 
                   response.success === 'true' || 
                   response.status === 'Ok' ||
                   response.status === 'ok' ||
                   (response.pollurl && response.pollurl.length > 0) ||
                   (response.poll_url && response.poll_url.length > 0);

        // Extract poll URL
        pollUrl = response.pollurl || 
                 response.pollUrl || 
                 response.poll_url || 
                 '';

        // Extract instructions
        instructions = response.instructions || 
                      response.message || 
                      response.statusmessage ||
                      `Please check your ${method} for payment instructions`;

        // Extract error message
        errorMessage = response.error || 
                      response.message || 
                      response.statusmessage ||
                      '';
      }

      console.log('Parsed mobile response:', { isSuccess, pollUrl, instructions, errorMessage });

      if (isSuccess) {
        return {
          success: true,
          pollUrl: pollUrl,
          reference: payment.reference || response.reference,
          instructions: instructions
        };
      } else {
        console.error('Mobile payment failed:', { response, errorMessage });
        return {
          success: false,
          error: errorMessage || 'Mobile payment initiation failed - please check your credentials and phone number'
        };
      }
    } catch (error) {
      console.error('Paynow mobile payment error:', error);
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

      return {
        status: status?.status || 'Unknown',
        paid: () => status?.paid === true || status?.paid === 'true',
        reference: status?.reference,
        amount: status?.amount ? parseFloat(status.amount) : undefined
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
