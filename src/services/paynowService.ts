
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
  private baseUrl = 'https://www.paynow.co.zw/interface/initiatetransaction';
  private integrationId: string;
  private integrationKey: string;
  public resultUrl: string;
  public returnUrl: string;

  constructor(integrationId: string, integrationKey: string) {
    this.integrationId = integrationId;
    this.integrationKey = integrationKey;
    this.resultUrl = `${window.location.origin}/api/paynow/update`;
    this.returnUrl = `${window.location.origin}/payment-success`;
  }

  // Create a payment with reference and optional email
  createPayment(reference: string, email?: string) {
    return {
      reference,
      email,
      items: [] as Array<{ name: string; price: number }>,
      add: function(name: string, price: number) {
        this.items.push({ name, price });
        return this;
      },
      getTotal: function() {
        return this.items.reduce((total, item) => total + item.price, 0);
      }
    };
  }

  // Generate hash for security using SHA-256 equivalent
  private generateHash(data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort();
    const concatenated = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const hashString = concatenated + this.integrationKey;
    
    // Simple hash function - in production, use proper SHA-512
    return btoa(hashString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
  }

  // Send web-based payment
  async send(payment: any): Promise<PaynowResponse> {
    try {
      const data = {
        id: this.integrationId,
        reference: payment.reference,
        amount: payment.getTotal(),
        additionalinfo: payment.items.map((item: any) => `${item.name}: $${item.price}`).join(', '),
        returnurl: this.returnUrl,
        resulturl: this.resultUrl,
        authemail: payment.email || '',
        status: 'Message'
      };

      const hash = this.generateHash(data);
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof typeof data].toString());
      });
      formData.append('hash', hash);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      const parsedResponse = this.parseResponse(responseText);

      if (parsedResponse.status === 'Ok') {
        return {
          success: true,
          redirectUrl: parsedResponse.browserurl,
          pollUrl: parsedResponse.pollurl,
          reference: payment.reference
        };
      } else {
        return {
          success: false,
          error: parsedResponse.error || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow payment error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  // Send mobile-based payment (EcoCash/OneMoney)
  async sendMobile(payment: any, phoneNumber: string, method: 'ecocash' | 'onemoney'): Promise<PaynowResponse> {
    try {
      const data = {
        id: this.integrationId,
        reference: payment.reference,
        amount: payment.getTotal(),
        additionalinfo: payment.items.map((item: any) => `${item.name}: $${item.price}`).join(', '),
        authemail: payment.email || '',
        phone: phoneNumber,
        method: method,
        status: 'Message'
      };

      const hash = this.generateHash(data);
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof typeof data].toString());
      });
      formData.append('hash', hash);

      const response = await fetch('https://www.paynow.co.zw/interface/remotetransaction', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      const parsedResponse = this.parseResponse(responseText);

      if (parsedResponse.status === 'Ok') {
        return {
          success: true,
          pollUrl: parsedResponse.pollurl,
          reference: payment.reference,
          instructions: parsedResponse.instructions || `Please check your ${method} for payment instructions`
        };
      } else {
        return {
          success: false,
          error: parsedResponse.error || 'Mobile payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow mobile payment error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  // Parse Paynow response
  private parseResponse(responseText: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = responseText.split('\n');
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        result[key.toLowerCase()] = value;
      }
    });
    
    return result;
  }

  // Poll transaction status
  async pollTransaction(pollUrl: string): Promise<{
    status: string;
    paid: () => boolean;
    reference?: string;
    amount?: number;
  }> {
    try {
      const response = await fetch(pollUrl);
      const responseText = await response.text();
      const parsedResponse = this.parseResponse(responseText);

      return {
        status: parsedResponse.status || 'Unknown',
        paid: () => parsedResponse.status === 'Paid',
        reference: parsedResponse.reference,
        amount: parsedResponse.amount ? parseFloat(parsedResponse.amount) : undefined
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
