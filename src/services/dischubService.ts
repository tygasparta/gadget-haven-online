
import { supabase } from '@/integrations/supabase/client';

interface DischubPaymentData {
  order_id: string;
  amount: number;
  currency: 'USD' | 'ZWG';
  recipient: string;
  api_key: string;
  notify_url: string;
}

interface DischubResponse {
  status: 'success' | 'error';
  message: string;
  response_code: number;
}

interface DischubWebhookPayload {
  transaction_id: number;
  order_id: string;
  reference: string;
  status: 'success' | 'failed';
  currency: string;
  amount: string;
  timestamp: string;
}

class DischubService {
  private apiUrl = 'https://dischub.co.zw/api/orders/create/';
  
  constructor() {
    console.log('DischubService initialized');
  }

  // Create payment order via Edge Function
  async createPaymentOrder(paymentData: Omit<DischubPaymentData, 'api_key' | 'recipient'>): Promise<{
    success: boolean;
    redirectUrl?: string;
    error?: string;
  }> {
    try {
      console.log('Creating Dischub payment order:', paymentData);
      
      const { data, error } = await supabase.functions.invoke('dischub-payment', {
        body: {
          type: 'create_order',
          ...paymentData
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          error: error.message || 'Failed to create payment order'
        };
      }

      console.log('Dischub response:', data);

      if (data?.status === 'success') {
        // Generate redirect URL for Dischub payment
        const redirectUrl = `https://dischub.co.zw/api/make/payment/to/${data.recipient}/${paymentData.order_id}`;
        
        return {
          success: true,
          redirectUrl
        };
      } else {
        return {
          success: false,
          error: data?.message || 'Payment order creation failed'
        };
      }
    } catch (error) {
      console.error('Dischub payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  // Validate currency and amount limits
  validatePayment(amount: number, currency: 'USD' | 'ZWG'): { valid: boolean; error?: string } {
    if (currency === 'USD' && amount > 480) {
      return { valid: false, error: 'USD amount exceeds maximum limit of $480.00' };
    }
    
    if (currency === 'ZWG' && amount > 7000) {
      return { valid: false, error: 'ZWG amount exceeds maximum limit of ZWG 7,000.00' };
    }
    
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than zero' };
    }
    
    return { valid: true };
  }

  // Format currency for display
  formatCurrency(amount: number, currency: 'USD' | 'ZWG'): string {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    } else {
      return `ZWG ${amount.toFixed(2)}`;
    }
  }

  // Get supported currencies
  getSupportedCurrencies(): Array<{ code: 'USD' | 'ZWG'; name: string; symbol: string }> {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'ZWG', name: 'Zimbabwe Gold', symbol: 'ZWG' }
    ];
  }
}

export default DischubService;
export type { DischubPaymentData, DischubResponse, DischubWebhookPayload };
