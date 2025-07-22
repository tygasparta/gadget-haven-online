
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
import usePaynow from '@/hooks/usePaynow';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ContactInformationSection from '@/components/checkout/ContactInformationSection';
import ShippingAddressSection from '@/components/checkout/ShippingAddressSection';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import OrderSummarySection from '@/components/checkout/OrderSummarySection';

const CheckoutDetails = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { data: cartItems = [], isLoading } = useCartItems();
  const { initiateWebPayment, initiateMobilePayment, isProcessing } = usePaynow();
  
  const [paymentMethod, setPaymentMethod] = useState('web');
  const [mobileMethod, setMobileMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Zimbabwe'
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isLoading && cartItems.length === 0) {
      navigate('/checkout');
      return;
    }
  }, [user, cartItems, navigate, isLoading]);

  // Show loading while cart is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user || cartItems.length === 0) return null;

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'mobile' && !phoneNumber) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter your mobile number for mobile payment",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order in database first
      const orderData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        payment_method: paymentMethod === 'web' ? 'paynow_web' : paymentMethod === 'mobile' ? `paynow_${mobileMethod}` : 'cash_on_delivery',
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billing_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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

      // Handle different payment methods
      if (paymentMethod === 'cod') {
        toast({
          title: "Order Confirmed",
          description: "Your order has been confirmed for cash on delivery",
        });
        navigate(`/payment/success?reference=ORDER-${order.id}&order_id=${order.id}`);
        return;
      }

      // Prepare payment data for Paynow
      const paymentData = {
        reference: `ORDER-${order.id}`,
        amount: finalTotal,
        email: formData.email,
        additionalInfo: `Order for ${cartItems.length} items`
      };

      if (paymentMethod === 'web') {
        const response = await initiateWebPayment(paymentData);
        if (!response.success) {
          navigate(`/payment/success?reference=ORDER-${order.id}&order_id=${order.id}`);
        }
      } else if (paymentMethod === 'mobile') {
        const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0');
        
        if (mobileMethod === 'ecocash' && !cleanPhone.startsWith('077')) {
          toast({
            title: "Invalid Phone Number",
            description: "EcoCash requires an Econet number starting with 077",
            variant: "destructive"
          });
          return;
        }
        
        if (mobileMethod === 'onemoney' && !cleanPhone.startsWith('071')) {
          toast({
            title: "Invalid Phone Number", 
            description: "OneMoney requires a NetOne number starting with 071",
            variant: "destructive"
          });
          return;
        }

        const response = await initiateMobilePayment(paymentData, phoneNumber, mobileMethod as 'ecocash' | 'onemoney');
        setTimeout(() => {
          navigate(`/payment/success?reference=ORDER-${order.id}&order_id=${order.id}`);
        }, 3000);
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Enhanced Header */}
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
          {/* Form Sections */}
          <div className={`${isMobile ? '' : 'col-span-3'} space-y-6`}>
            <ContactInformationSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <ShippingAddressSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <PaymentMethodSection 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              mobileMethod={mobileMethod}
              setMobileMethod={setMobileMethod}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          </div>

          {/* Order Summary */}
          <div className={`${isMobile ? '' : 'col-span-2'}`}>
            <OrderSummarySection 
              cartItems={cartItems}
              totalPrice={totalPrice}
              shipping={shipping}
              tax={tax}
              finalTotal={finalTotal}
              paymentMethod={paymentMethod}
              mobileMethod={mobileMethod}
              isProcessing={isProcessing}
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
