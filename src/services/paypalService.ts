import { supabase } from '@/integrations/supabase/client';

export interface PayPalOrderData {
  amount: number;
  currency: 'USD';
  orderId: string;
}

export interface PayPalCreateOrderResponse {
  success: boolean;
  orderId?: string;
  approvalUrl?: string;
  error?: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  captureId?: string;
  status?: string;
  error?: string;
}

class PayPalService {
  async createOrder(orderData: PayPalOrderData): Promise<PayPalCreateOrderResponse> {
    try {
      console.log('Creating PayPal order:', orderData);

      const { data, error } = await supabase.functions.invoke('paypal-create-order', {
        body: orderData,
      });

      if (error) {
        console.error('PayPal create order error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('PayPal service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create PayPal order',
      };
    }
  }

  async captureOrder(paypalOrderId: string, orderDbId: string): Promise<PayPalCaptureResponse> {
    try {
      console.log('Capturing PayPal order:', { paypalOrderId, orderDbId });

      const { data, error } = await supabase.functions.invoke('paypal-capture-order', {
        body: { paypalOrderId, orderDbId },
      });

      if (error) {
        console.error('PayPal capture error:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('PayPal capture service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to capture PayPal payment',
      };
    }
  }

  validatePayment(amount: number): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (amount > 10000) {
      return { valid: false, error: 'Amount cannot exceed $10,000' };
    }

    return { valid: true };
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
}

export default PayPalService;
