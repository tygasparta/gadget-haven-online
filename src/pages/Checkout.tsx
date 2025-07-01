import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck, Shield, Banknote, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import { useCartItems } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import usePaynow from '@/hooks/usePaynow';

const Checkout = () => {
  const { data: cartItems = [] } = useCartItems();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiateWebPayment, initiateMobilePayment, isProcessing: paynowProcessing } = usePaynow();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [mobileMethod, setMobileMethod] = useState<'ecocash' | 'onemoney'>('ecocash');
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Zimbabwe',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const handlePaynowWebPayment = async (orderId: string) => {
    const paymentData = {
      reference: `ORD-${orderId}`,
      amount: getTotalPrice(),
      email: formData.email,
      phone: formData.phone,
      additionalInfo: `Order ${orderId} - Gadget Genie`,
      returnUrl: `${window.location.origin}/order-success`,
      resultUrl: `${window.location.origin}/api/paynow-callback`
    };

    const response = await initiateWebPayment(paymentData);
    return response.success;
  };

  const handlePaynowMobilePayment = async (orderId: string) => {
    if (!formData.phone) {
      toast({
        title: "Phone Number Required",
        description: "Please provide your phone number for mobile payment",
        variant: "destructive"
      });
      return false;
    }

    const paymentData = {
      reference: `ORD-${orderId}`,
      amount: getTotalPrice(),
      email: formData.email,
      phone: formData.phone,
      additionalInfo: `Order ${orderId} - Gadget Genie`
    };

    const response = await initiateMobilePayment(paymentData, formData.phone, mobileMethod);
    return response.success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          status: paymentMethod === 'pay_on_delivery' ? 'pending' : 'confirmed',
          payment_method: paymentMethod,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          },
          billing_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          }
        })
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

      // Handle payment based on method
      if (paymentMethod === 'paynow_web') {
        const paymentSuccess = await handlePaynowWebPayment(order.id);
        if (!paymentSuccess) {
          throw new Error('Paynow web payment failed');
        }
        return; // Paynow will handle the redirect
      }

      if (paymentMethod === 'paynow_mobile') {
        const paymentSuccess = await handlePaynowMobilePayment(order.id);
        if (!paymentSuccess) {
          throw new Error('Paynow mobile payment failed');
        }
        // For mobile payments, we stay on the page and show instructions
        toast({
          title: "Payment Instructions Sent",
          description: "Please check your phone and follow the payment instructions",
          duration: 15000
        });
        return;
      }

      // Clear cart after successful order (for non-Paynow payments)
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) throw clearCartError;

      const successMessage = paymentMethod === 'pay_on_delivery' 
        ? "Your order has been placed! You'll pay when your items are delivered."
        : "Your order has been placed successfully.";

      toast({
        title: "Order Confirmed!",
        description: successMessage
      });
      
      navigate('/order-success', { 
        state: { 
          orderId: order.id, 
          total: getTotalPrice(),
          paymentMethod: paymentMethod
        } 
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Order Failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+263 77 123 4567"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <Label htmlFor="credit_card" className="font-medium">Credit Card</Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="paynow_web" id="paynow_web" />
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="paynow_web" className="font-medium">Paynow (Web)</Label>
                        <p className="text-sm text-gray-500">Pay via Paynow website</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="paynow_mobile" id="paynow_mobile" />
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <div>
                        <Label htmlFor="paynow_mobile" className="font-medium">Mobile Money</Label>
                        <p className="text-sm text-gray-500">EcoCash or OneMoney</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="pay_on_delivery" className="font-medium">Pay on Delivery</Label>
                        <p className="text-sm text-gray-500">Pay with cash when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paynow_web' && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Paynow Web Payment</span>
                    </div>
                    <p className="text-sm text-green-700">
                      You'll be redirected to Paynow to complete your payment using:
                    </p>
                    <ul className="list-disc list-inside text-sm text-green-700 mt-2 space-y-1">
                      <li>EcoCash</li>
                      <li>OneMoney</li>
                      <li>Telecash</li>
                      <li>Bank Transfer</li>
                      <li>Visa/Mastercard</li>
                    </ul>
                  </div>
                )}

                {paymentMethod === 'paynow_mobile' && (
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Mobile Money Payment</span>
                    </div>
                    <p className="text-sm text-purple-700 mb-3">
                      Choose your mobile money provider:
                    </p>
                    <RadioGroup
                      value={mobileMethod}
                      onValueChange={(value) => setMobileMethod(value as 'ecocash' | 'onemoney')}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ecocash" id="ecocash" />
                        <Label htmlFor="ecocash" className="text-sm">EcoCash (Econet)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="onemoney" id="onemoney" />
                        <Label htmlFor="onemoney" className="text-sm">OneMoney (NetOne)</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-purple-600 mt-2">
                      Payment instructions will be sent to your phone
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.products.image}
                        alt={item.products.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.products.name}</h3>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.products.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5" />
                <span>Secure checkout & delivery</span>
              </div>
              {paymentMethod === 'pay_on_delivery' && (
                <div className="flex items-center space-x-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <Banknote className="w-5 h-5" />
                  <span>No online payment required - pay when delivered</span>
                </div>
              )}
              {paymentMethod === 'paynow_web' && (
                <div className="flex items-center space-x-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                  <span>Secure local payment via Paynow</span>
                </div>
              )}
              {paymentMethod === 'paynow_mobile' && (
                <div className="flex items-center space-x-3 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                  <span>Direct mobile money payment</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={isProcessing || paynowProcessing}
              >
                {isProcessing || paynowProcessing ? 'Processing...' : 
                 paymentMethod === 'pay_on_delivery' 
                   ? `Place Order - Pay $${getTotalPrice().toFixed(2)} on Delivery`
                   : paymentMethod === 'paynow_web'
                   ? `Pay $${getTotalPrice().toFixed(2)} with Paynow`
                   : paymentMethod === 'paynow_mobile'
                   ? `Pay $${getTotalPrice().toFixed(2)} with ${mobileMethod.toUpperCase()}`
                   : `Complete Order - $${getTotalPrice().toFixed(2)}`
                }
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
