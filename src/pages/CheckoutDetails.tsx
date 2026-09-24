import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCartItems } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { usePayPal } from '@/hooks/usePayPal';
import { usePesePay } from '@/hooks/usePesePay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ContactInformationSection from '@/components/checkout/ContactInformationSection';
import ShippingAddressSection from '@/components/checkout/ShippingAddressSection';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import ShippingMethodSection from '@/components/checkout/ShippingMethodSection';
import OrderSummarySection from '@/components/checkout/OrderSummarySection';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';

const CHECKOUT_STEPS = ['Cart', 'Delivery & Payment', 'Confirmation'];

const CheckoutDetails = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { data: cartItems = [], isLoading: cartLoading, error: cartError } = useCartItems();
  const { initiatePayPalPayment, isProcessing: isPayPalProcessing } = usePayPal();
  const { initiatePesePayPayment, isProcessing: isPesePayProcessing } = usePesePay();
  
  const [paymentMethod, setPaymentMethod] = useState('pesepay');
  const [shippingMethod, setShippingMethod] = useState<'shipping' | 'collection'>('collection');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Zimbabwe'
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    if (!cartLoading && !user) {
      navigate('/auth');
    }
  }, [user, cartLoading, navigate]);

  useEffect(() => {
    if (!cartLoading && user && cartItems.length === 0) {
      navigate('/checkout');
    }
  }, [cartLoading, user, cartItems, navigate]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const getTaxAmount = () => getSubtotal() * 0.02;

  const getTotalPrice = () => getSubtotal() + getTaxAmount();

  const getShippingCost = () => (shippingMethod === 'shipping' ? 5.00 : 0);

  const totalPrice = getTotalPrice();
  const shipping = getShippingCost();
  const finalTotal = totalPrice + shipping;

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name",
        variant: "destructive"
      });
      return false;
    }
    if (shippingMethod === 'shipping' && (!formData.address || !formData.city)) {
      toast({
        title: "Missing Information",
        description: "Please fill in your shipping address",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const createOrder = async (paymentMethodName: string) => {
    const orderData = {
      user_id: user!.id,
      total_amount: finalTotal,
      status: 'pending',
      payment_method: paymentMethodName,
      shipping_method: shippingMethod,
      shipping_address: shippingMethod === 'shipping' ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country
      } : null,
      billing_address: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address || 'Shop Collection',
        city: formData.city || 'Shop Location',
        zipCode: formData.zipCode || '00000',
        country: formData.country
      }
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  };

  const handlePesePayPayment = async () => {
    if (!validateForm() || !user) return;

    try {
      const order = await createOrder('pesepay');
      
      await initiatePesePayPayment({
        amount: finalTotal,
        currencyCode: 'USD',
        reasonForPayment: `GadgetGenie Order #${order.id} - ${cartItems.length} item(s)`,
        orderDbId: order.id,
      });
    } catch (error: any) {
      console.error('PesePay checkout error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handlePayPalPayment = async () => {
    if (!validateForm() || !user) return;

    try {
      const order = await createOrder('paypal');

      await initiatePayPalPayment({
        orderId: order.id,
        amount: finalTotal,
        currency: 'USD'
      }, order.id);
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (paymentMethod === 'pesepay') {
      await handlePesePayPayment();
    } else if (paymentMethod === 'paypal') {
      await handlePayPalPayment();
    }
  };

  if (cartLoading) {
    return (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading checkout details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading checkout: {cartError.message}</p>
            <Button onClick={() => navigate('/checkout')}>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isProcessing = isPesePayProcessing || isPayPalProcessing;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8 pb-32 md:pb-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate('/checkout')} aria-label="Back to cart" className="h-10 w-10 -ml-2 grid place-items-center rounded-md hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Delivery and payment</p>
          </div>
        </div>
        <div className="mb-5 bg-background border border-border rounded-lg p-3">
          <CheckoutStepper steps={CHECKOUT_STEPS} currentStep={1} />
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <ContactInformationSection formData={formData} setFormData={setFormData} />
            <ShippingMethodSection shippingMethod={shippingMethod} setShippingMethod={setShippingMethod} />
            {shippingMethod === 'shipping' && (
              <ShippingAddressSection formData={formData} setFormData={setFormData} />
            )}
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              totalAmount={finalTotal}
              onInitiatePesePayPayment={handlePesePayPayment}
              isPesePayProcessing={isPesePayProcessing}
              onInitiatePayPalPayment={handlePayPalPayment}
              isPayPalProcessing={isPayPalProcessing}
            />
          </div>
          <div className="lg:col-span-2">
            <OrderSummarySection
              cartItems={cartItems}
              subtotal={getSubtotal()}
              tax={getTaxAmount()}
              shipping={shipping}
              finalTotal={finalTotal}
              paymentMethod={paymentMethod}
              mobileMethod=""
              isProcessing={isProcessing}
              onSubmit={handleSubmit}
              hideAction={isMobile}
            />
          </div>
        </form>
      </div>

      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border safe-area-pb">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Total</p>
              <p className="text-lg font-bold leading-tight">${finalTotal.toFixed(2)}</p>
            </div>
            <Button className="flex-1 h-11" disabled={isProcessing} onClick={() => handleSubmit()}>
              {isProcessing ? 'Processing…' : `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'PesePay'}`}
            </Button>
          </div>
        </div>
      )}

      {!isMobile && <Footer />}
    </div>
  );
};

export default CheckoutDetails;
