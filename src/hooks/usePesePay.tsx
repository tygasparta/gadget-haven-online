import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PesePayService from '@/services/pesepayService';

interface PesePayPaymentData {
  amount: number;
  currencyCode: string;
  reasonForPayment: string;
  orderDbId: string;
}

export const usePesePay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const pesepayService = new PesePayService();

  const initiatePesePayPayment = async (paymentData: PesePayPaymentData) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      console.log('Initiating PesePay payment:', paymentData);

      const validation = pesepayService.validatePayment(paymentData.amount);
      if (!validation.valid) {
        toast({
          title: "Payment Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      const response = await pesepayService.initiatePayment(paymentData);

      if (!response.success || !response.redirectUrl) {
        throw new Error(response.error || 'Failed to initiate PesePay payment');
      }

      console.log('PesePay payment initiated:', response.referenceNumber);

      toast({
        title: "Redirecting to PesePay",
        description: "You'll be redirected to complete your payment...",
      });

      // Redirect to PesePay payment page
      window.location.href = response.redirectUrl;
    } catch (error) {
      console.error('PesePay payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment initiation failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (referenceNumber: string) => {
    try {
      return await pesepayService.checkStatus(referenceNumber);
    } catch (error) {
      console.error('PesePay status check error:', error);
      throw error;
    }
  };

  return {
    initiatePesePayPayment,
    checkPaymentStatus,
    isProcessing,
  };
};

export default usePesePay;
