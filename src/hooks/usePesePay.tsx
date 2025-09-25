import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PesePayService from '@/services/pesePayService';

interface PesePayPaymentData {
  orderId: string;
  amount: number;
  currency: 'USD' | 'ZWL';
  customerPhone?: string;
  customerEmail?: string;
}

export const usePesePay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const pesePayService = new PesePayService();

  const generateNumericOrderId = (orderDbId: string): string => {
    const hash = orderDbId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash).toString().padStart(10, '0');
  };

  const initiatePesePayPayment = async (
    paymentData: PesePayPaymentData,
    orderDbId?: string
  ) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Initiating PesePay payment:', paymentData);
      
      // Validate payment data
      const validation = pesePayService.validatePayment(paymentData.amount, paymentData.currency);
      if (!validation.valid) {
        toast({
          title: "Payment Error",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      // Generate merchant reference
      const merchantReference = pesePayService.generateMerchantReference();
      
      // Save payment record to database
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payment_records')
        .insert({
          order_id: orderDbId || null,
          amount: paymentData.amount,
          payment_method: 'pesepay',
          payment_reference: merchantReference,
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Error saving payment record:', paymentError);
        throw new Error('Failed to create payment record');
      }

      console.log('Payment record created:', paymentRecord.id);

      // Prepare API request data
      const apiData = {
        amount: paymentData.amount,
        currencyCode: paymentData.currency,
        merchantReference: merchantReference,
        reasonForPayment: `Order Payment - ${paymentData.orderId}`,
        resultUrl: `${window.location.origin}/payment-success?reference=${merchantReference}`,
        returnUrl: `${window.location.origin}/payment-success?reference=${merchantReference}`,
        customerPhone: paymentData.customerPhone,
        customerEmail: paymentData.customerEmail
      };

      // Call edge function to create payment
      const { data, error } = await supabase.functions.invoke('pesepay-payment', {
        body: apiData
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Payment initiation failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      console.log('PesePay payment initiated successfully');

      // Update payment record with redirect URL and poll URL
      await supabase
        .from('payment_records')
        .update({
          redirect_url: data.redirectUrl,
          poll_url: data.pollUrl
        })
        .eq('id', paymentRecord.id);

      toast({
        title: "Payment Initiated",
        description: "Redirecting to PesePay payment gateway...",
      });

      // Redirect to PesePay
      window.location.href = data.redirectUrl;

    } catch (error) {
      console.error('PesePay payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment initiation failed",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initiatePesePayPayment,
    isProcessing
  };
};

export default usePesePay;