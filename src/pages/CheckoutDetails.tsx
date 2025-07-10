
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  MapPin, 
  User, 
  ArrowLeft,
  Shield,
  Truck,
  Smartphone,
  Package
} from 'lucide-react';
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

const CheckoutDetails = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { data: cartItems = [] } = useCartItems();
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
    
    if (cartItems.length === 0) {
      navigate('/checkout');
      return;
    }
  }, [user, cartItems, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        // For cash on delivery, redirect to success page immediately
        toast({
          title: "Order Confirmed",
          description: "Your order has been confirmed for cash on delivery",
        });
        navigate(`/payment-success?order_id=${order.id}`);
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
        await initiateWebPayment(paymentData);
      } else if (paymentMethod === 'mobile') {
        // Validate phone number format before making the request
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

        await initiateMobilePayment(paymentData, phoneNumber, mobileMethod as 'ecocash' | 'onemoney');
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-6xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/checkout')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout Details</h1>
              <p className="text-gray-600">Complete your order</p>
            </div>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'}`}>
          {/* Checkout Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="web" id="web" />
                      <label htmlFor="web" className="font-medium">Web Payment (Card/Bank)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <label htmlFor="mobile" className="font-medium flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile Payment
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod" className="font-medium flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Cash on Delivery
                      </label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'mobile' && (
                    <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                      <RadioGroup value={mobileMethod} onValueChange={setMobileMethod}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ecocash" id="ecocash" />
                          <label htmlFor="ecocash">EcoCash</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="onemoney" id="onemoney" />
                          <label htmlFor="onemoney">OneMoney</label>
                        </div>
                      </RadioGroup>
                      
                      <div>
                        <Label htmlFor="phoneNumber">
                          Mobile Number * ({mobileMethod === 'ecocash' ? '077' : '071'} required)
                        </Label>
                        <Input
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder={mobileMethod === 'ecocash' ? '0771234567' : '0711234567'}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="pl-6 border-l-2 border-gray-200">
                      <p className="text-sm text-gray-600">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.products.name} × {item.quantity}</span>
                        <span>${(item.products.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                  </div>

                  {/* Payment Info */}
                  {paymentMethod === 'web' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700">Secure payment via Paynow</span>
                    </div>
                  )}

                  {paymentMethod === 'mobile' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700">Mobile payment via {mobileMethod === 'ecocash' ? 'EcoCash' : 'OneMoney'}</span>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center space-x-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span className="text-sm text-orange-700">Pay cash on delivery</span>
                    </div>
                  )}

                  {/* Shipping Info */}
                  {totalPrice >= 50 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700">FREE shipping included!</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping
                      </span>
                    </div>
                  )}

                  <Button 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      paymentMethod === 'cod' ? `Confirm Order - $${finalTotal.toFixed(2)}` : `Complete Order - $${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default CheckoutDetails;
