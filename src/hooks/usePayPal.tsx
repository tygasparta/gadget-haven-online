import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PayPalService from '@/services/paypalService';

interface PayPalPaymentData {
  orderId: string;
  amount: number;
  currency: 'USD';
}

export const usePayPal = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const paypalService = new PayPalService();

  const initiatePayPalPayment = async (
    paymentData: PayPalPaymentData,
    orderDbId?: string
  ) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Initiating PayPal payment:', paymentData);
      
      // Validate payment data
      const validation = paypalService.validatePayment(paymentData.amount);
      if (!validation.valid) {
        toast({
          title: "Payment Error",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      // Save payment record to database
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payment_records')
        .insert([{
          amount: paymentData.amount,
          payment_method: 'paypal',
          payment_reference: `PAYPAL_PENDING_${Date.now()}`,
          status: 'pending',
          ...(orderDbId ? { order_id: orderDbId } : {})
        }])
        .select()
        .single();

      if (paymentError) {
        console.error('Error saving payment record:', paymentError);
        throw new Error('Failed to create payment record');
      }

      console.log('Payment record created:', paymentRecord.id);

      // Create PayPal order
      const response = await paypalService.createOrder(paymentData);

      if (!response.success || !response.approvalUrl) {
        throw new Error(response.error || 'Failed to create PayPal order');
      }

      console.log('PayPal order created successfully:', response.orderId);

      // Update payment record with PayPal order ID
      await supabase
        .from('payment_records')
        .update({
          payment_reference: response.orderId,
        })
        .eq('id', paymentRecord.id);

      toast({
        title: "Redirecting to PayPal",
        description: "You'll be redirected to complete your payment...",
      });

      // Redirect to PayPal
      window.location.href = response.approvalUrl;

    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment initiation failed",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const capturePayPalPayment = async (paypalOrderId: string, orderDbId: string) => {
    try {
      const response = await paypalService.captureOrder(paypalOrderId, orderDbId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to capture payment');
      }

      return response;
    } catch (error) {
      console.error('PayPal capture error:', error);
      throw error;
    }
  };

  return {
    initiatePayPalPayment,
    capturePayPalPayment,
    isProcessing
  };
};

export default usePayPal;
