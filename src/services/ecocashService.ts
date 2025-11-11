import { supabase } from '@/integrations/supabase/client';

export interface EcoCashPaymentData {
  amount: number;
  description: string;
  orderId: string;
  currency?: 'USD' | 'ZWL';
}

export interface EcoCashResponse {
  success: boolean;
  reference?: string;
  redirectUrl?: string;
  pollUrl?: string;
  instructions?: string;
  error?: string;
}

class EcoCashService {
  async createPaymentOrder(
    paymentData: EcoCashPaymentData
  ): Promise<EcoCashResponse> {
    try {
      console.log('Creating EcoCash payment order:', paymentData);

      const { data, error } = await supabase.functions.invoke('ecocash-payment', {
        body: paymentData,
      });

      if (error) {
        console.error('EcoCash payment error:', error);
        return {
          success: false,
          error: error.message || 'Failed to create payment order',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Payment creation failed',
        };
      }

      return {
        success: true,
        reference: data.reference,
        redirectUrl: data.redirectUrl,
        pollUrl: data.pollUrl,
        instructions: data.instructions,
      };
    } catch (error: any) {
      console.error('Error creating EcoCash payment:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  validatePayment(
    amount: number,
    currency: 'USD' | 'ZWL' = 'USD'
  ): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (currency === 'USD' && amount < 1) {
      return { valid: false, error: 'Minimum amount for USD is $1.00' };
    }

    if (amount > 10000) {
      return { valid: false, error: 'Amount exceeds maximum limit' };
    }

    return { valid: true };
  }

  formatCurrency(amount: number, currency: 'USD' | 'ZWL' = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  getSupportedCurrencies() {
    return [
      { code: 'USD' as const, name: 'US Dollar', symbol: '$' },
      { code: 'ZWL' as const, name: 'Zimbabwean Dollar', symbol: 'Z$' },
    ];
  }
}

export default EcoCashService;
