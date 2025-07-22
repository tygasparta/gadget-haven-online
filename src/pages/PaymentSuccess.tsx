
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PaynowService from '@/services/paynowService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  const reference = searchParams.get('reference');
  const orderId = searchParams.get('order_id');
  const error = searchParams.get('error');
  const isMobile = searchParams.get('mobile') === 'true';
  const method = searchParams.get('method');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (error) {
        setPaymentStatus('failed');
        setPaymentDetails({ error: decodeURIComponent(error) });
        return;
      }

      if (!reference) {
        setPaymentStatus('failed');
        setPaymentDetails({ error: 'No payment reference found' });
        return;
      }

      try {
        // Try to get payment record from database
        const paynowService = new PaynowService();
        const paymentRecord = await paynowService.getPaymentRecord(reference);
        
        if (paymentRecord) {
          setPaymentDetails(paymentRecord);
          
          // If we have a poll URL, check the actual payment status
          if (paymentRecord.poll_url && paymentRecord.status === 'pending') {
            const statusResponse = await paynowService.pollTransaction(paymentRecord.poll_url);
            
            if (statusResponse.paid()) {
              setPaymentStatus('success');
              // Clear cart if payment is successful
              if (user) {
                await supabase.from('cart_items').delete().eq('user_id', user.id);
              }
            } else if (statusResponse.status === 'Cancelled' || statusResponse.status === 'Failed') {
              setPaymentStatus('failed');
            } else {
              setPaymentStatus('pending');
            }
          } else {
            // Set status based on payment record
            switch (paymentRecord.status) {
              case 'paid':
                setPaymentStatus('success');
                if (user) {
                  await supabase.from('cart_items').delete().eq('user_id', user.id);
                }
                break;
              case 'failed':
              case 'cancelled':
                setPaymentStatus('failed');
                break;
              default:
                setPaymentStatus('pending');
            }
          }
        } else {
          // No payment record found, might be a test or error
          setPaymentStatus('pending');
          setPaymentDetails({ 
            reference, 
            message: 'Payment record not found. This might be a test payment.' 
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
        setPaymentDetails({ error: 'Failed to verify payment status' });
      }
    };

    checkPaymentStatus();
  }, [reference, error, user]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return isMobile ? 'Mobile Payment Initiated' : 'Payment Pending';
      default:
        return 'Checking Payment Status...';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Your payment has been processed successfully. Your order is confirmed!';
      case 'failed':
        return paymentDetails?.error || 'Your payment could not be processed. Please try again.';
      case 'pending':
        if (isMobile) {
          return `Please check your ${method === 'ecocash' ? 'EcoCash' : 'OneMoney'} app to complete the payment.`;
        }
        return 'Your payment is being processed. Please wait for confirmation.';
      default:
        return 'Please wait while we verify your payment status...';
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          {getStatusIcon()}
          <CardTitle className="text-2xl font-bold">
            {getStatusTitle()}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {getStatusMessage()}
          </p>
          
          {reference && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Payment Reference</p>
              <p className="font-mono text-sm font-medium">{reference}</p>
            </div>
          )}
          
          {paymentDetails?.amount && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">${paymentDetails.amount.toFixed(2)}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            {paymentStatus === 'success' && (
              <>
                <Button onClick={handleViewOrders} className="w-full">
                  View My Orders
                </Button>
                <Button onClick={handleReturnHome} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </>
            )}
            
            {paymentStatus === 'failed' && (
              <>
                <Button onClick={handleRetryPayment} className="w-full">
                  Try Again
                </Button>
                <Button onClick={handleReturnHome} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </>
            )}
            
            {paymentStatus === 'pending' && (
              <>
                <Button onClick={handleViewOrders} variant="outline" className="w-full">
                  Check Order Status
                </Button>
                <Button onClick={handleReturnHome} variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </>
            )}
            
            {paymentStatus === 'loading' && (
              <Button disabled className="w-full">
                Checking Status...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
