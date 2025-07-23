
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
import useDischub from '@/hooks/useDischub';
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
  const { initiateDischubPayment, isProcessing: isDischubProcessing } = useDischub();
  
  const [paymentMethod, setPaymentMethod] = useState('dischub');
  const [dischubCurrency, setDischubCurrency] = useState<'USD' | 'ZWG'>('USD');
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

  const handleDischubPayment = async (currency: 'USD' | 'ZWG') => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order in database first
      const orderData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: 'pending',
        payment_method: 'dischub',
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

      console.log('Order created successfully:', order.id);

      // Prepare payment data for Dischub
      const paymentData = {
        order_id: `ORDER-${order.id}`,
        amount: finalTotal,
        currency: currency,
        additionalInfo: `Order for ${cartItems.length} items`
      };

      await initiateDischubPayment(paymentData, order.id);

    } catch (error: any) {
      console.error('Dischub checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout",
        variant: "destructive"
      });
    }
  };

  const handleCashOnDelivery = async () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: 'confirmed',
        payment_method: 'cash_on_delivery',
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

      console.log('COD Order created successfully:', order.id);

      toast({
        title: "Order Confirmed",
        description: "Your order has been confirmed for cash on delivery",
      });
      
      navigate(`/payment/success?reference=ORDER-${order.id}&order_id=${order.id}`);

    } catch (error: any) {
      console.error('COD checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (paymentMethod === 'dischub') {
      await handleDischubPayment(dischubCurrency);
    } else if (paymentMethod === 'cod') {
      await handleCashOnDelivery();
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
              mobileMethod=""
              setMobileMethod={() => {}}
              phoneNumber=""
              setPhoneNumber={() => {}}
              dischubCurrency={dischubCurrency}
              setDischubCurrency={setDischubCurrency}
              totalAmount={finalTotal}
              onInitiateDischubPayment={handleDischubPayment}
              isDischubProcessing={isDischubProcessing}
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
              mobileMethod=""
              isProcessing={isDischubProcessing}
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
