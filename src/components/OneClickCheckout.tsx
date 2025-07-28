
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartItems } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, MapPin, Zap, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const OneClickCheckout: React.FC = () => {
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  const { data: addresses = [] } = useAddresses();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultAddress = addresses.find(addr => addr.isdefault) || addresses[0];
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const handleOneClickCheckout = async () => {
    if (!user || !defaultAddress || cartItems.length === 0) {
      toast({
        title: "Cannot proceed",
        description: "Please ensure you have items in cart and a default address set",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order in database with cash on delivery
      const orderData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: 'confirmed',
        payment_method: 'cash_on_delivery',
        shipping_address: {
          name: defaultAddress.name,
          line1: defaultAddress.line1,
          line2: defaultAddress.line2,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipcode: defaultAddress.zipcode,
          country: defaultAddress.country
        },
        billing_address: {
          name: defaultAddress.name,
          line1: defaultAddress.line1,
          line2: defaultAddress.line2,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipcode: defaultAddress.zipcode,
          country: defaultAddress.country
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

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed. Pay cash on delivery.",
      });
      
      navigate(`/order-success?reference=ORDER-${order.id}&order_id=${order.id}`);

    } catch (error: any) {
      console.error('One-click checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process one-click checkout",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-blue-700">
          <Zap className="w-5 h-5" />
          <span>One-Click Checkout</span>
          <Badge className="bg-blue-100 text-blue-800">Express</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">{cartItems.length} items</span>
            </span>
            <span className="text-lg font-bold text-blue-600">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Default Address */}
        {defaultAddress && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Ship to:</span>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{defaultAddress.name}</p>
              <p>{defaultAddress.line1}</p>
              <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipcode}</p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Cash on Delivery</span>
            <Badge variant="outline" className="text-xs">Default</Badge>
          </div>
        </div>

        <Button 
          onClick={handleOneClickCheckout}
          disabled={isProcessing || !defaultAddress}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Order Now - Cash on Delivery</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OneClickCheckout;
