import { supabase } from '@/integrations/supabase/client';

export interface PesePayInitiateData {
  amount: number;
  currencyCode: string;
  reasonForPayment: string;
  orderDbId: string;
}

export interface PesePayInitiateResponse {
  success: boolean;
  redirectUrl?: string;
  referenceNumber?: string;
  pollUrl?: string;
  error?: string;
}

export interface PesePayStatusResponse {
  success: boolean;
  status?: string;
  data?: any;
  error?: string;
}

class PesePayService {
  async initiatePayment(data: PesePayInitiateData): Promise<PesePayInitiateResponse> {
    try {
      console.log('Initiating PesePay payment:', data);

      const { data: responseData, error } = await supabase.functions.invoke('pesepay-initiate', {
        body: data,
      });

      if (error) {
        console.error('PesePay initiate error:', error);
        throw new Error(error.message);
      }

      return responseData;
    } catch (error) {
      console.error('PesePay service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate PesePay payment',
      };
    }
  }

  async checkStatus(referenceNumber: string): Promise<PesePayStatusResponse> {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('pesepay-check-status', {
        body: { referenceNumber },
      });

      if (error) {
        throw new Error(error.message);
      }

      return responseData;
    } catch (error) {
      console.error('PesePay status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check payment status',
      };
    }
  }

  validatePayment(amount: number): { valid: boolean; error?: string } {
    if (amount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    return { valid: true };
  }
}

export default PesePayService;
