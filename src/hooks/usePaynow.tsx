
import { useState } from 'react';
import PaynowService, { PaynowPaymentData, PaynowResponse } from '@/services/paynowService';
import { useToast } from '@/hooks/use-toast';

const usePaynow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  // Initialize Paynow service with credentials
  const paynowService = new PaynowService(
    process.env.REACT_APP_PAYNOW_INTEGRATION_ID || 'your-integration-id',
    process.env.REACT_APP_PAYNOW_INTEGRATION_KEY || 'your-integration-key'
  );

  const initiatePayment = async (paymentData: PaynowPaymentData): Promise<PaynowResponse> => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const response = await paynowService.initiatePayment(paymentData);
      
      if (response.success) {
        setPaymentStatus('success');
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment gateway...",
        });
        
        // Redirect to payment gateway
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
      } else {
        setPaymentStatus('failed');
        toast({
          title: "Payment Failed",
          description: response.error || "Failed to initiate payment",
          variant: "destructive"
        });
      }
      
      return response;
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: "An error occurred while processing payment",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: "Payment processing failed"
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (pollUrl: string) => {
    try {
      const status = await paynowService.checkPaymentStatus(pollUrl);
      return status;
    } catch (error) {
      console.error('Payment status check failed:', error);
      return {
        status: 'Error',
        paid: false
      };
    }
  };

  return {
    initiatePayment,
    checkPaymentStatus,
    isProcessing,
    paymentStatus,
    setPaymentStatus
  };
};

export default usePaynow;
