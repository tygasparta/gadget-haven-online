import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCartItems } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavigation from '@/components/MobileNavigation';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout details...</p>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading checkout: {cartError.message}</p>
            <Button onClick={() => navigate('/checkout')} className="bg-blue-600 hover:bg-blue-700">
              Back to Cart
            </Button>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-lg border-0"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/checkout')}
              className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Checkout Details
              </h1>
              <p className="text-gray-500 mt-1">Complete your order securely</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Step 2 of 3</span>
          </div>
        </motion.div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-5 gap-8'}`}>
          <div className={`${isMobile ? '' : 'col-span-3'} space-y-6`}>
            <ContactInformationSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <ShippingMethodSection 
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
            />
            
            {shippingMethod === 'shipping' && (
              <ShippingAddressSection 
                formData={formData}
                setFormData={setFormData}
              />
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

          <div className={`${isMobile ? '' : 'col-span-2'}`}>
            <OrderSummarySection 
              cartItems={cartItems}
              subtotal={getSubtotal()}
              tax={getTaxAmount()}
              shipping={shipping}
              finalTotal={finalTotal}
              paymentMethod={paymentMethod}
              mobileMethod=""
              isProcessing={isPesePayProcessing || isPayPalProcessing}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default CheckoutDetails;
