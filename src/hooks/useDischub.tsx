
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DischubService from '@/services/dischubService';
import { supabase } from '@/integrations/supabase/client';

interface DischubPaymentData {
  order_id: string;
  amount: number;
  currency: 'USD' | 'ZWG';
  additionalInfo?: string;
}

const useDischub = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate numeric order ID for Dischub
  const generateNumericOrderId = (orderDbId: string) => {
    // Convert UUID to numeric by taking timestamp + random numbers
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`;
  };

  const initiateDischubPayment = async (paymentData: DischubPaymentData, orderDbId?: string) => {
    setIsProcessing(true);
    
    try {
      console.log('=== STARTING DISCHUB PAYMENT ===');
      console.log('Dischub payment data:', paymentData);
      console.log('Order DB ID:', orderDbId);
      
      const dischubService = new DischubService();
      
      // Validate payment
      const validation = dischubService.validatePayment(paymentData.amount, paymentData.currency);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate numeric order ID for Dischub
      const numericOrderId = generateNumericOrderId(orderDbId || '');
      console.log('Generated numeric order ID:', numericOrderId);

      // Save initial payment record with both IDs
      if (orderDbId) {
        const paymentRecord = {
          order_id: orderDbId,
          payment_reference: numericOrderId, // Use numeric ID as payment reference
          amount: paymentData.amount,
          status: 'pending' as const,
          payment_method: 'dischub'
        };
        
        await supabase.from('payment_records').insert([paymentRecord]);
      }

      // Create payment order with numeric ID
      const response = await dischubService.createPaymentOrder({
        order_id: numericOrderId, // Use numeric ID
        amount: paymentData.amount,
        currency: paymentData.currency,
        notify_url: `${window.location.origin}/api/dischub/webhook`
      });
      
      console.log('=== DISCHUB PAYMENT RESPONSE ===', response);
      
      if (response.success && response.redirectUrl) {
        toast({
          title: "Redirecting to Dischub",
          description: "Please complete your payment on the Dischub platform",
        });
        
        // Redirect to Dischub payment page
        window.location.href = response.redirectUrl;
        return response;
      } else {
        throw new Error(response.error || 'Payment initiation failed');
      }
    } catch (error: any) {
      console.error('Dischub payment failed:', error.message);
      toast({
        title: "Payment Failed",
        description: error.message || 'Failed to initiate Dischub payment',
        variant: "destructive"
      });
      
      // Navigate to payment success page with error for testing
      navigate(`/payment/success?error=${encodeURIComponent(error.message)}&reference=${paymentData.order_id}`);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initiateDischubPayment,
    isProcessing
  };
};

export default useDischub;
