
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
    console.log('Initiating web payment with data:', paymentData);
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Validate payment data
      if (!paymentData.reference || !paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment data: reference and positive amount are required');
      }

      if (!paymentData.email || !paymentData.email.includes('@')) {
        throw new Error('Valid email address is required');
      }

      // Create payment using the new structure
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      console.log('Created payment object:', payment);
      console.log('Payment total:', payment.getTotal());

      const response = await paynowService.send(payment);
      console.log('Payment response:', response);
      
      if (response.success) {
        setPaymentStatus('success');
        toast({
          title: "Payment Initiated",
          description: "Redirecting to Paynow gateway...",
        });
        
        // Redirect to payment gateway
        if (response.redirectUrl) {
          console.log('Redirecting to:', response.redirectUrl);
          window.location.href = response.redirectUrl;
        } else {
          console.error('No redirect URL received');
          throw new Error('No redirect URL received from Paynow');
        }
      } else {
        setPaymentStatus('failed');
        console.error('Payment failed with error:', response.error);
        toast({
          title: "Payment Failed",
          description: response.error || "Failed to initiate payment",
          variant: "destructive"
        });
      }
      
      return response;
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An error occurred while processing payment",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed"
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
    console.log('Initiating mobile payment with data:', { paymentData, phoneNumber, method });
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Validate payment data
      if (!paymentData.reference || !paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment data: reference and positive amount are required');
      }

      if (!paymentData.email || !paymentData.email.includes('@')) {
        throw new Error('Valid email address is required');
      }

      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Valid phone number is required');
      }

      // Validate phone number format
      const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0');
      if (method === 'ecocash' && !cleanPhone.startsWith('077')) {
        throw new Error('EcoCash requires an Econet number (077)');
      }
      if (method === 'onemoney' && !cleanPhone.startsWith('071')) {
        throw new Error('OneMoney requires a NetOne number (071)');
      }

      // Create payment using the new structure
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      console.log('Created mobile payment object:', payment);
      console.log('Payment total:', payment.getTotal());

      const response = await paynowService.sendMobile(payment, phoneNumber, method);
      console.log('Mobile payment response:', response);
      
      if (response.success) {
        setPaymentStatus('success');
        toast({
          title: "Mobile Payment Initiated",
          description: response.instructions || "Check your phone for payment instructions",
          duration: 15000
        });
      } else {
        setPaymentStatus('failed');
        console.error('Mobile payment failed with error:', response.error);
        toast({
          title: "Mobile Payment Failed",
          description: response.error || "Failed to initiate mobile payment",
          variant: "destructive"
        });
      }
      
      return response;
    } catch (error) {
      console.error('Mobile payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Mobile Payment Error",
        description: error instanceof Error ? error.message : "An error occurred while processing mobile payment",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Mobile payment processing failed"
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (pollUrl: string) => {
    try {
      console.log('Checking payment status for:', pollUrl);
      const status = await paynowService.pollTransaction(pollUrl);
      console.log('Payment status result:', status);
      
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
