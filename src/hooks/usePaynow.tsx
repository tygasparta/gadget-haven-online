
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PaynowService from '@/services/paynowService';

interface PaymentData {
  reference: string;
  amount: number;
  email: string;
  additionalInfo?: string;
}

const usePaynow = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const initiateWebPayment = async (paymentData: PaymentData, orderId?: string) => {
    setIsProcessing(true);
    
    try {
      console.log('=== STARTING WEB PAYMENT ===');
      console.log('Web payment data:', paymentData);
      console.log('Order ID:', orderId);
      
      const paynowService = new PaynowService();
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Order Payment', paymentData.amount);
      
      console.log('Payment object created, now sending...');
      const response = await paynowService.send(payment, orderId);
      
      console.log('=== WEB PAYMENT RESPONSE ===', response);
      
      if (response.success && response.redirectUrl) {
        toast({
          title: "Redirecting to Payment Gateway",
          description: "Please complete your payment on the Paynow website",
        });
        
        // Redirect to Paynow
        window.location.href = response.redirectUrl;
        return response;
      } else {
        throw new Error(response.error || 'Payment initiation failed');
      }
    } catch (error: any) {
      console.error('Web payment failed:', error.message);
      toast({
        title: "Payment Failed",
        description: error.message || 'Failed to initiate web payment',
        variant: "destructive"
      });
      
      // Navigate to payment success page with error for testing
      navigate(`/payment/success?error=${encodeURIComponent(error.message)}&reference=${paymentData.reference}`);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateMobilePayment = async (
    paymentData: PaymentData, 
    phoneNumber: string, 
    method: 'ecocash' | 'onemoney',
    orderId?: string
  ) => {
    setIsProcessing(true);
    
    try {
      console.log('=== STARTING MOBILE PAYMENT ===');
      console.log('Mobile payment data:', paymentData);
      
      const paynowService = new PaynowService();
      const payment = paynowService.createPayment(paymentData.reference, paymentData.email);
      payment.add(paymentData.additionalInfo || 'Mobile Order Payment', paymentData.amount);
      
      console.log('Mobile payment object created, now sending...');
      const response = await paynowService.sendMobile(payment, phoneNumber, method, orderId);
      
      console.log('=== MOBILE PAYMENT RESPONSE ===', response);
      
      if (response.success) {
        toast({
          title: "Mobile Payment Initiated",
          description: response.instructions || `Please check your ${method === 'ecocash' ? 'EcoCash' : 'OneMoney'} for payment instructions`,
        });
        
        // Navigate to success page
        navigate(`/payment/success?reference=${paymentData.reference}&mobile=true&method=${method}`);
        return response;
      } else {
        throw new Error(response.error || 'Mobile payment initiation failed');
      }
    } catch (error: any) {
      console.error('Mobile payment failed:', error.message);
      toast({
        title: "Mobile Payment Failed",
        description: error.message || 'Failed to initiate mobile payment',
        variant: "destructive"
      });
      
      // Navigate to payment success page with error for testing
      navigate(`/payment/success?error=${encodeURIComponent(error.message)}&reference=${paymentData.reference}`);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initiateWebPayment,
    initiateMobilePayment,
    isProcessing
  };
};

export default usePaynow;
