
import { useState } from 'react';
import PaynowService, { PaynowPaymentData, PaynowResponse } from '@/services/paynowService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const usePaynow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  // Initialize Paynow service with credentials from Supabase secrets
  const getPaynowService = async () => {
    try {
      console.log('Getting Paynow credentials from Supabase...');
      // Get credentials from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-paynow-credentials');
      
      if (error) {
        console.error('Failed to get Paynow credentials:', error);
        // Fallback to default credentials for testing
        console.log('Using fallback credentials');
        return new PaynowService();
      }
      
      console.log('Successfully retrieved credentials from Supabase');
      return new PaynowService(data?.integrationId, data?.integrationKey);
    } catch (error) {
      console.error('Error initializing Paynow service:', error);
      // Fallback to default credentials
      console.log('Using fallback credentials due to error');
      return new PaynowService();
    }
  };

  const initiateWebPayment = async (paymentData: PaynowPaymentData): Promise<PaynowResponse> => {
    console.log('=== STARTING WEB PAYMENT ===');
    console.log('Web payment data:', paymentData);
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

      console.log('Getting Paynow service...');
      const paynowService = await getPaynowService();

      // Create payment using the official SDK
      console.log('Creating payment...');
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      console.log('Payment object created, now sending...');
      const response = await paynowService.send(payment);
      console.log('=== WEB PAYMENT RESPONSE ===', response);
      
      if (response && response.success) {
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
        const errorMsg = response?.error || 'Payment initiation failed';
        console.error('Web payment failed:', errorMsg);
        toast({
          title: "Payment Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
      
      return response || { success: false, error: 'No response received' };
    } catch (error) {
      console.error('=== WEB PAYMENT ERROR ===', error);
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing payment";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        success: false,
        error: errorMessage
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
    console.log('=== STARTING MOBILE PAYMENT ===');
    console.log('Mobile payment data:', { paymentData, phoneNumber, method });
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

      console.log('Getting Paynow service...');
      const paynowService = await getPaynowService();

      // Create payment using the official SDK
      console.log('Creating mobile payment...');
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Items', paymentData.amount);

      console.log('Mobile payment object created, now sending...');
      const response = await paynowService.sendMobile(payment, phoneNumber, method);
      console.log('=== MOBILE PAYMENT RESPONSE ===', response);
      
      if (response && response.success) {
        setPaymentStatus('success');
        toast({
          title: "Mobile Payment Initiated",
          description: response.instructions || "Check your phone for payment instructions",
          duration: 15000
        });
      } else {
        setPaymentStatus('failed');
        const errorMsg = response?.error || 'Mobile payment initiation failed';
        console.error('Mobile payment failed:', errorMsg);
        toast({
          title: "Mobile Payment Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
      
      return response || { success: false, error: 'No response received' };
    } catch (error) {
      console.error('=== MOBILE PAYMENT ERROR ===', error);
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing mobile payment";
      toast({
        title: "Mobile Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (pollUrl: string) => {
    try {
      console.log('Checking payment status for:', pollUrl);
      const paynowService = await getPaynowService();
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
    setPaymentStatus
  };
};

export default usePaynow;
