
import { useState } from 'react';
import PaynowService, { PaynowPaymentData, PaynowResponse } from '@/services/paynowService';
import { useToast } from '@/hooks/use-toast';

const usePaynow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  // Initialize Paynow service with your actual credentials
  const paynowService = new PaynowService('21058', 'ece6db09-1654-4bcf-8494-ac98155f41e7');

  const initiateWebPayment = async (paymentData: PaynowPaymentData): Promise<PaynowResponse> => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Create payment using the new structure
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      const response = await paynowService.send(payment);
      
      if (response.success) {
        setPaymentStatus('success');
        toast({
          title: "Payment Initiated",
          description: "Redirecting to Paynow gateway...",
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

  const initiateMobilePayment = async (
    paymentData: PaynowPaymentData, 
    phoneNumber: string, 
    method: 'ecocash' | 'onemoney'
  ): Promise<PaynowResponse> => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Create payment using the new structure
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      const response = await paynowService.sendMobile(payment, phoneNumber, method);
      
      if (response.success) {
        setPaymentStatus('success');
        toast({
          title: "Mobile Payment Initiated",
          description: response.instructions || "Check your phone for payment instructions",
          duration: 10000
        });
      } else {
        setPaymentStatus('failed');
        toast({
          title: "Mobile Payment Failed",
          description: response.error || "Failed to initiate mobile payment",
          variant: "destructive"
        });
      }
      
      return response;
    } catch (error) {
      setPaymentStatus('failed');
      toast({
        title: "Mobile Payment Error",
        description: "An error occurred while processing mobile payment",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: "Mobile payment processing failed"
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (pollUrl: string) => {
    try {
      const status = await paynowService.pollTransaction(pollUrl);
      return {
        status: status.status,
        paid: status.paid(),
        reference: status.reference,
        amount: status.amount
      };
    } catch (error) {
      console.error('Payment status check failed:', error);
      return {
        status: 'Error',
        paid: false
      };
    }
  };

  // Legacy method for backward compatibility
  const initiatePayment = initiateWebPayment;

  return {
    initiatePayment,
    initiateWebPayment,
    initiateMobilePayment,
    checkPaymentStatus,
    isProcessing,
    paymentStatus,
    setPaymentStatus,
    paynowService
  };
};

export default usePaynow;
