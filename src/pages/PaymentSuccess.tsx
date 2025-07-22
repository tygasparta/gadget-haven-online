
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const isTest = searchParams.get('test') === 'true';
  const isMobile = searchParams.get('mobile') === 'true';
  const method = searchParams.get('method');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      console.log('PaymentSuccess: Starting payment status check', {
        reference,
        orderId,
        error,
        isTest,
        isMobile,
        method,
        user: user?.id
      });

      // Handle error case first
      if (error) {
        console.log('PaymentSuccess: Error parameter found:', error);
        setPaymentStatus('failed');
        setPaymentDetails({ error: decodeURIComponent(error) });
        return;
      }

      // Handle missing reference
      if (!reference) {
        console.log('PaymentSuccess: No payment reference found');
        setPaymentStatus('failed');
        setPaymentDetails({ error: 'No payment reference found' });
        return;
      }

      try {
        // If this is a test payment, simulate success
        if (isTest) {
          console.log('PaymentSuccess: Processing test payment');
          setPaymentStatus('success');
          setPaymentDetails({ 
            reference,
            amount: 53.19,
            message: 'Test payment completed successfully'
          });
          
          // Clear cart if payment is successful and user exists
          if (user) {
            console.log('PaymentSuccess: Clearing cart for test payment');
            await supabase.from('cart_items').delete().eq('user_id', user.id);
          }
          return;
        }

        // Try to get payment record from database
        console.log('PaymentSuccess: Fetching payment record from database');
        const { data: paymentRecord, error: dbError } = await supabase
          .from('payment_records')
          .select('*')
          .eq('payment_reference', reference)
          .maybeSingle();
        
        if (dbError) {
          console.error('PaymentSuccess: Database error:', dbError);
          setPaymentStatus('failed');
          setPaymentDetails({ error: 'Failed to verify payment status' });
          return;
        }

        console.log('PaymentSuccess: Payment record found:', paymentRecord);

        if (paymentRecord) {
          setPaymentDetails(paymentRecord);
          
          // Set status based on payment record
          switch (paymentRecord.status) {
            case 'paid':
              setPaymentStatus('success');
              // Clear cart if payment is successful
              if (user) {
                console.log('PaymentSuccess: Clearing cart for successful payment');
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
        } else {
          // No payment record found - show pending status
          console.log('PaymentSuccess: No payment record found, showing pending status');
          setPaymentStatus('pending');
          setPaymentDetails({ 
            reference, 
            message: 'Payment verification in progress. Please check back shortly.' 
          });
        }
      } catch (error) {
        console.error('PaymentSuccess: Error checking payment status:', error);
        setPaymentStatus('failed');
        setPaymentDetails({ error: 'Failed to verify payment status' });
      }
    };

    checkPaymentStatus();
  }, [reference, error, user, isTest]);

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
        return isTest ? 'Test Payment Successful!' : 'Payment Successful!';
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
        if (isTest) {
          return 'This was a test payment and has been processed successfully. In production, this would be a real transaction.';
        }
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

  // Show loading state while checking payment status
  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Checking Payment Status...</h2>
            <p className="text-gray-600 text-center">Please wait while we verify your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

          {isTest && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">⚠️ Test Mode</p>
              <p className="text-xs text-blue-600">This is a development environment. No real payment was processed.</p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
