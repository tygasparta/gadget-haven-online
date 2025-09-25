interface PesePayPaymentData {
  amount: number;
  currencyCode: 'USD' | 'ZWL';
  merchantReference: string;
  reasonForPayment: string;
  resultUrl: string;
  returnUrl: string;
  customerPhone?: string;
  customerEmail?: string;
}

interface PesePayResponse {
  success: boolean;
  redirectUrl?: string;
  referenceNumber?: string;
  pollUrl?: string;
  error?: string;
}

interface PesePayStatusResponse {
  success: boolean;
  transactionStatus?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

class PesePayService {
  private baseUrl = 'https://api.pesepay.com/api/payments-engine/v1';

  async createPaymentOrder(paymentData: PesePayPaymentData): Promise<PesePayResponse> {
    try {
      const response = await fetch('/api/functions/v1/pesepay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('PesePay payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkPaymentStatus(referenceNumber: string): Promise<PesePayStatusResponse> {
    try {
      const response = await fetch(`/api/functions/v1/pesepay-status?referenceNumber=${referenceNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('PesePay status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  validatePayment(amount: number, currency: 'USD' | 'ZWL'): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than zero' };
    }

    const maxAmounts = {
      USD: 10000,
      ZWL: 1000000
    };

    if (amount > maxAmounts[currency]) {
      return { 
        valid: false, 
        error: `Amount cannot exceed ${this.formatCurrency(maxAmounts[currency], currency)}` 
      };
    }

    return { valid: true };
  }

  formatCurrency(amount: number, currency: 'USD' | 'ZWL'): string {
    const symbols = {
      USD: '$',
      ZWL: 'ZWL'
    };

    return `${symbols[currency]}${amount.toFixed(2)}`;
  }

  getSupportedCurrencies(): Array<{ code: 'USD' | 'ZWL'; name: string; symbol: string }> {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'ZWL' }
    ];
  }

  generateMerchantReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PESEPAY-${timestamp}-${random}`;
  }
}

export default PesePayService;
export type { PesePayPaymentData, PesePayResponse, PesePayStatusResponse };