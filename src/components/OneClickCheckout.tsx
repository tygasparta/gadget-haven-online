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
  const { data: cartItems = [], refetch: refetchCart } = useCartItems();
  const { data: addresses = [] } = useAddresses();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('OneClickCheckout - User:', user?.id);
  console.log('OneClickCheckout - Cart items:', cartItems.length);
  console.log('OneClickCheckout - Addresses:', addresses.length);

  const defaultAddress = addresses.find(addr => addr.isdefault) || addresses[0];
  
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const getTaxAmount = () => {
    return getSubtotal() * 0.02; // 2% tax
  };

  const getTotalPrice = () => {
    return getSubtotal() + getTaxAmount();
  };

  const totalPrice = getTotalPrice();
  const shipping = 0; // One-click checkout defaults to collection (free)
  const finalTotal = totalPrice + shipping;

  const handleOneClickCheckout = async () => {
    console.log('OneClickCheckout - Starting checkout process');
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }

    if (!defaultAddress) {
      toast({
        title: "No delivery address",
        description: "Please add a delivery address in your account settings",
        variant: "destructive"
      });
      navigate('/addresses');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('OneClickCheckout - Creating order with data:', {
        user_id: user.id,
        total_amount: finalTotal,
        cart_items_count: cartItems.length
      });

      // Create order in database with cash on delivery (collection method)
      const orderData = {
        user_id: user.id,
        total_amount: finalTotal,
        status: 'confirmed',
        payment_method: 'cash_on_delivery',
        shipping_method: 'collection', // One-click checkout defaults to collection
        shipping_address: null, // No shipping address needed for collection
        billing_address: {
          name: defaultAddress.name || 'Default Address',
          line1: defaultAddress.line1,
          line2: defaultAddress.line2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipcode: defaultAddress.zipcode,
          country: defaultAddress.country || 'Zimbabwe'
        }
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('OneClickCheckout - Order creation error:', orderError);
        throw orderError;
      }

      console.log('OneClickCheckout - Order created successfully:', order);

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price
      }));

      console.log('OneClickCheckout - Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('OneClickCheckout - Order items creation error:', itemsError);
        throw itemsError;
      }

      console.log('OneClickCheckout - Order items created successfully');

      // Clear cart
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearCartError) {
        console.error('OneClickCheckout - Cart clearing error:', clearCartError);
        // Don't throw error here as order is already created
      } else {
        console.log('OneClickCheckout - Cart cleared successfully');
        // Refetch cart data to update UI
        refetchCart();
      }

      toast({
        title: "Order Placed Successfully!",
        description: "Your order is confirmed for collection at our shop. Pay when you collect.",
      });
      
      // Navigate to success page - fix the URL path
      navigate(`/payment-success?reference=ORDER-${order.id}&order_id=${order.id}`);

    } catch (error: any) {
      console.error('OneClickCheckout - Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process one-click checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't show if user is not authenticated
  if (!user) {
    return (
      <Card className="mb-6 border-2 border-warning/20 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <Zap className="w-12 h-12 mx-auto text-warning" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Quick Checkout Available</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Log in to enable one-click checkout with cash on delivery
              </p>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-warning hover:bg-warning/90 text-white"
            >
              Log In for Quick Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Zap className="w-5 h-5" />
          <span>One-Click Checkout</span>
          <Badge className="bg-primary/10 text-primary">Express</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-3 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{cartItems.length} items</span>
            </span>
            <span className="text-lg font-bold text-primary">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Default Address - Updated for Collection */}
        {defaultAddress ? (
          <div className="bg-white rounded-lg p-3 border border-primary/10">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Collect at Shop:</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Shop Collection (FREE)</p>
              <p>123 Main Street, City Center</p>
              <p className="text-success text-xs mt-1">Ready in 2-3 business days</p>
            </div>
          </div>
        ) : (
          <div className="bg-success/10 rounded-lg p-3 border border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Shop Collection Available</span>
            </div>
            <p className="text-xs text-success">Collect your order from our shop - no shipping fees!</p>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-3 border border-primary/10">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Cash on Delivery</span>
            <Badge variant="outline" className="text-xs">Default</Badge>
          </div>
        </div>

        {true ? (
          <Button 
            onClick={handleOneClickCheckout}
            disabled={isProcessing}
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
                <span>Order Now - Collect at Shop (FREE)</span>
              </div>
            )}
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/addresses')}
            className="w-full bg-warning hover:bg-warning/90 text-white py-3 font-semibold rounded-xl"
          >
            Add Delivery Address
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OneClickCheckout;
