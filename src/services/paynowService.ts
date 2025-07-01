
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
}

class PaynowService {
  private baseUrl = 'https://www.paynow.co.zw/interface/initiatetransaction';
  private integrationId: string;
  private integrationKey: string;

  constructor(integrationId: string, integrationKey: string) {
    this.integrationId = integrationId;
    this.integrationKey = integrationKey;
  }

  // Generate hash for security
  private generateHash(data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort();
    const concatenated = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    const hashString = concatenated + this.integrationKey;
    
    // Simple hash function - in production, use proper SHA-512
    return btoa(hashString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
  }

  // Initiate payment
  async initiatePayment(paymentData: PaynowPaymentData): Promise<PaynowResponse> {
    try {
      const data = {
        id: this.integrationId,
        reference: paymentData.reference,
        amount: paymentData.amount,
        additionalinfo: paymentData.additionalInfo || '',
        returnurl: paymentData.returnUrl || window.location.origin + '/payment-success',
        resulturl: paymentData.resultUrl || window.location.origin + '/api/paynow-callback',
        authemail: paymentData.email,
        authphone: paymentData.phone || '',
        status: 'Message'
      };

      // Generate hash
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
          reference: paymentData.reference
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

  // Check payment status
  async checkPaymentStatus(pollUrl: string): Promise<{
    status: string;
    paid: boolean;
    reference?: string;
    amount?: number;
  }> {
    try {
      const response = await fetch(pollUrl);
      const responseText = await response.text();
      const parsedResponse = this.parseResponse(responseText);

      return {
        status: parsedResponse.status || 'Unknown',
        paid: parsedResponse.status === 'Paid',
        reference: parsedResponse.reference,
        amount: parsedResponse.amount ? parseFloat(parsedResponse.amount) : undefined
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        status: 'Error',
        paid: false
      };
    }
  }
}

export default PaynowService;
export type { PaynowPaymentData, PaynowResponse };
