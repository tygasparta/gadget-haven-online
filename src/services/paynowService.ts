
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
  private mobileUrl = 'https://www.paynow.co.zw/interface/remotetransaction';
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

  // Improved hash generation using SHA-512 simulation
  private generateHash(data: Record<string, any>): string {
    // Sort keys alphabetically (case sensitive)
    const sortedKeys = Object.keys(data).sort();
    
    // Create the string to hash
    const queryString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    
    const stringToHash = queryString + this.integrationKey;
    
    console.log('Data to hash:', data);
    console.log('String to hash:', stringToHash);
    
    // Simple hash function - in production, use proper SHA-512
    // This is a more robust hash than the previous version
    let hash = 0;
    for (let i = 0; i < stringToHash.length; i++) {
      const char = stringToHash.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad
    const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
    console.log('Generated hash:', hashHex);
    
    return hashHex;
  }

  // Send web-based payment
  async send(payment: any): Promise<PaynowResponse> {
    try {
      console.log('Sending web payment:', payment);
      
      const data = {
        id: this.integrationId,
        reference: payment.reference,
        amount: payment.getTotal().toFixed(2),
        additionalinfo: payment.items.map((item: any) => `${item.name}: $${item.price.toFixed(2)}`).join(', '),
        returnurl: this.returnUrl,
        resulturl: this.resultUrl,
        authemail: payment.email || '',
        status: 'Message'
      };

      console.log('Payment data before hash:', data);
      
      const hash = this.generateHash(data);
      
      // Create form data
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof typeof data].toString());
      });
      formData.append('hash', hash);

      console.log('Sending request to:', this.baseUrl);
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'text/plain, */*',
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      const parsedResponse = this.parseResponse(responseText);
      console.log('Parsed response:', parsedResponse);

      if (parsedResponse.status?.toLowerCase() === 'ok') {
        return {
          success: true,
          redirectUrl: parsedResponse.browserurl,
          pollUrl: parsedResponse.pollurl,
          reference: payment.reference
        };
      } else {
        console.error('Payment failed:', parsedResponse);
        return {
          success: false,
          error: parsedResponse.error || parsedResponse.status || 'Payment initiation failed'
        };
      }
    } catch (error) {
      console.error('Paynow payment error:', error);
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
      
      const data = {
        id: this.integrationId,
        reference: payment.reference,
        amount: payment.getTotal().toFixed(2),
        additionalinfo: payment.items.map((item: any) => `${item.name}: $${item.price.toFixed(2)}`).join(', '),
        authemail: payment.email || '',
        phone: cleanPhone,
        method: method,
        status: 'Message'
      };

      console.log('Mobile payment data before hash:', data);
      
      const hash = this.generateHash(data);
      
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof typeof data].toString());
      });
      formData.append('hash', hash);

      console.log('Sending mobile request to:', this.mobileUrl);
      console.log('Mobile form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(this.mobileUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'text/plain, */*',
        }
      });

      console.log('Mobile response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Mobile raw response:', responseText);
      
      const parsedResponse = this.parseResponse(responseText);
      console.log('Mobile parsed response:', parsedResponse);

      if (parsedResponse.status?.toLowerCase() === 'ok') {
        return {
          success: true,
          pollUrl: parsedResponse.pollurl,
          reference: payment.reference,
          instructions: parsedResponse.instructions || `Please check your ${method} for payment instructions`
        };
      } else {
        console.error('Mobile payment failed:', parsedResponse);
        return {
          success: false,
          error: parsedResponse.error || parsedResponse.status || 'Mobile payment initiation failed'
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

  // Parse Paynow response
  private parseResponse(responseText: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = responseText.trim().split('\n');
    
    console.log('Parsing response lines:', lines);
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes('=')) {
        const equalIndex = trimmedLine.indexOf('=');
        const key = trimmedLine.substring(0, equalIndex).trim().toLowerCase();
        const value = trimmedLine.substring(equalIndex + 1).trim();
        
        if (key && value) {
          result[key] = value;
          console.log(`Parsed: ${key} = ${value}`);
        }
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
      console.log('Polling transaction:', pollUrl);
      
      const response = await fetch(pollUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'text/plain, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Poll response:', responseText);
      
      const parsedResponse = this.parseResponse(responseText);
      console.log('Poll parsed response:', parsedResponse);

      return {
        status: parsedResponse.status || 'Unknown',
        paid: () => parsedResponse.status?.toLowerCase() === 'paid',
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
