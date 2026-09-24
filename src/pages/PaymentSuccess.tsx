import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Package, Truck, CreditCard, Home, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useQueryClient } from '@tanstack/react-query';
import { useGmailSystem } from '@/hooks/useGmailSystem';

type PaymentStatus = 'polling' | 'success' | 'failed' | 'pending' | 'error';

const MAX_POLLS = 20;
const POLL_INTERVAL = 5000;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { clearCart } = useCart();
  const queryClient = useQueryClient();
  const { sendOrderConfirmation } = useGmailSystem();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('polling');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasToastedRef = useRef(false);
  const hasProcessedSuccessRef = useRef(false);

  const sessionId = searchParams.get('session_id');
  const provider = searchParams.get('provider');
  const returnedOrderId = searchParams.get('order_id');
  const paypalToken = searchParams.get('token');
  const reference = searchParams.get('reference') || searchParams.get('referenceNumber') ||
    (provider === 'pesepay' ? sessionStorage.getItem('gg_pesepay_ref') : null);
  const paypalCapturedRef = useRef(false);

  const clearCartItems = useCallback(async () => {
    if (!user) return;
    try {
      // Clear from Supabase
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      // Clear local cart context
      clearCart();
      // Invalidate cart query cache
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      console.log('Cart cleared after successful payment');
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [user, clearCart, queryClient]);

  const sendConfirmationEmail = useCallback(async (order: any) => {
    if (!user?.email) return;
    try {
      sendOrderConfirmation({
        id: order?.id || reference || 'N/A',
        total_amount: order?.total_amount || 0,
        created_at: new Date().toISOString(),
        email: user.email,
      });
      console.log('Order confirmation email queued');
    } catch (err) {
      console.error('Failed to send order confirmation email:', err);
    }
  }, [user, reference, sendOrderConfirmation]);

  const handlePaymentSuccess = useCallback(async (order: any) => {
    if (hasProcessedSuccessRef.current) return;
    hasProcessedSuccessRef.current = true;

    // Clear cart and send email in parallel
    await Promise.all([
      clearCartItems(),
      sendConfirmationEmail(order),
    ]);
  }, [clearCartItems, sendConfirmationEmail]);

  const checkPesePayStatus = useCallback(async (ref: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('pesepay-check-status', {
        body: { referenceNumber: ref },
      });

      if (error) {
        console.error('PesePay status check error:', error);
        return false;
      }

      console.log('PesePay status response:', data);

      const txnStatus = data?.status?.toUpperCase?.() || data?.transactionStatus?.toUpperCase?.();

      if (txnStatus === 'SUCCESS' || txnStatus === 'PAID' || txnStatus === 'COMPLETED') {
        setPaymentStatus('success');
        const details = data?.orderDetails || data?.data || null;
        setOrderDetails(details);
        if (!hasToastedRef.current) {
          hasToastedRef.current = true;
          toast({ title: "Payment Confirmed!", description: "Your order has been processed successfully." });
        }
        // Trigger post-success actions
        handlePaymentSuccess(details);
        return true;
      } else if (txnStatus === 'FAILED' || txnStatus === 'CANCELLED' || txnStatus === 'DECLINED') {
        setPaymentStatus('failed');
        if (!hasToastedRef.current) {
          hasToastedRef.current = true;
          toast({ title: "Payment Failed", description: "Your payment was not successful. Please try again.", variant: "destructive" });
        }
        return true;
      }

      return false;
    } catch (err) {
      console.error('Status poll error:', err);
      return false;
    }
  }, [toast, handlePaymentSuccess]);

  const verifySessionPayment = useCallback(async () => {
    if (!sessionId) return;
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', { body: { sessionId } });
      if (error) throw error;
      if (data?.success) {
        setPaymentStatus('success');
        setOrderDetails(data.order);
        toast({ title: "Payment Confirmed!", description: "Your order has been processed successfully." });
        handlePaymentSuccess(data.order);
      } else {
        setPaymentStatus('failed');
        toast({ title: "Payment Verification Failed", description: "Please contact support if you were charged.", variant: "destructive" });
      }
    } catch {
      setPaymentStatus('error');
      toast({ title: "Verification Error", description: "There was an issue verifying your payment.", variant: "destructive" });
    }
  }, [sessionId, toast, handlePaymentSuccess]);

  useEffect(() => {
    if (sessionId) {
      verifySessionPayment();
      return;
    }

    if (provider === 'paypal' && paypalToken && returnedOrderId) {
      if (paypalCapturedRef.current) return;
      paypalCapturedRef.current = true;
      (async () => {
        const { data, error } = await supabase.functions.invoke('paypal-capture-order', {
          body: { paypalOrderId: paypalToken, orderDbId: returnedOrderId },
        });
        if (error || !data?.success) {
          setPaymentStatus('failed');
          toast({ title: "Payment Failed", description: data?.error || error?.message || "PayPal could not complete the payment.", variant: "destructive" });
          return;
        }
        const { data: order } = await supabase.from('orders').select('*').eq('id', returnedOrderId).maybeSingle();
        setOrderDetails(order);
        setPaymentStatus('success');
        toast({ title: "Payment Confirmed!", description: "Your order has been processed successfully." });
        handlePaymentSuccess(order);
      })();
      return;
    }

    if (reference) {
      let currentPoll = 0;

      const poll = async () => {
        currentPoll++;
        setPollCount(currentPoll);

        const done = await checkPesePayStatus(reference);
        if (done || currentPoll >= MAX_POLLS) {
          if (!done && currentPoll >= MAX_POLLS) {
            setPaymentStatus('pending');
          }
          return;
        }

        pollRef.current = setTimeout(poll, POLL_INTERVAL);
      };

      poll();

      return () => {
        if (pollRef.current) clearTimeout(pollRef.current);
      };
    }

    setPaymentStatus('pending');
  }, [sessionId, reference, verifySessionPayment, checkPesePayStatus]);

  const handleRetryCheck = async () => {
    if (!reference) return;
    setPaymentStatus('polling');
    setPollCount(0);
    hasToastedRef.current = false;
    hasProcessedSuccessRef.current = false;
    const done = await checkPesePayStatus(reference);
    if (!done) setPaymentStatus('pending');
  };

  const statusConfig = {
    polling: {
      icon: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
      bgColor: 'bg-accent',
      title: 'Verifying Payment...',
      subtitle: `Checking payment status (attempt ${pollCount}/${MAX_POLLS})`,
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-success" />,
      bgColor: 'bg-success/10',
      title: 'Payment Successful!',
      subtitle: 'Thank you for your order. We\'re processing it now.',
    },
    failed: {
      icon: <XCircle className="w-12 h-12 text-destructive" />,
      bgColor: 'bg-destructive/10',
      title: 'Payment Failed',
      subtitle: 'Your payment was not successful. Please try again or contact support.',
    },
    pending: {
      icon: <Clock className="w-12 h-12 text-warning" />,
      bgColor: 'bg-warning/10',
      title: 'Payment Pending',
      subtitle: 'We\'re still waiting for confirmation. This may take a few minutes.',
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-destructive" />,
      bgColor: 'bg-destructive/10',
      title: 'Verification Error',
      subtitle: 'There was an issue verifying your payment. Please contact support.',
    },
  };

  const current = statusConfig[paymentStatus];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className={`max-w-4xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 ${current.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {current.icon}
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{current.title}</h1>
            <p className="text-muted-foreground">{current.subtitle}</p>
            {reference && (
              <div className="mt-4 inline-block bg-accent px-4 py-2 rounded-lg">
                <span className="text-accent-foreground font-medium">Reference: {reference}</span>
              </div>
            )}
          </div>

          {/* Polling progress bar */}
          {paymentStatus === 'polling' && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(pollCount / MAX_POLLS) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Checking every {POLL_INTERVAL / 1000} seconds...
              </p>
            </div>
          )}

          {/* Retry button for pending/failed */}
          {(paymentStatus === 'pending' || paymentStatus === 'failed') && reference && (
            <div className="text-center mb-8">
              <Button onClick={handleRetryCheck} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Check Again
              </Button>
            </div>
          )}

          {/* Order Details */}
          {orderDetails && paymentStatus === 'success' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Order Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Total</p>
                    <p className="text-lg font-semibold">${orderDetails.total_amount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="text-lg font-semibold flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{orderDetails.payment_method || 'PesePay'}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps (only on success) */}
          {paymentStatus === 'success' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>What happens next?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Order Confirmation', desc: "You'll receive an email confirmation shortly with your order details." },
                    { step: '2', title: 'Processing', desc: "We'll prepare your items for shipment within 1-2 business days." },
                    { step: '3', title: 'Shipping', desc: "Your order will be shipped and you'll receive tracking information." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm font-medium">{step}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{title}</h3>
                        <p className="text-muted-foreground text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/orders')}
              className="flex-1"
            >
              <Package className="w-4 h-4 mr-2" />
              View Order Status
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </motion.div>
      </div>

      {!isMobile && <Footer />}
    </div>
  );
};

export default PaymentSuccess;
