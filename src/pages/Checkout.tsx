
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  User, 
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Star,
  Shield,
  Truck
} from 'lucide-react';
import { useCartItems, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductColorSelector from '@/components/ProductColorSelector';
import OneClickCheckout from '@/components/OneClickCheckout';
import ProductComparison from '@/components/ProductComparison';
import ShippingMethodSection from '@/components/checkout/ShippingMethodSection';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = !isMobile && window.innerWidth < 1024;
  const { data: cartItems = [] } = useCartItems();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [showComparison, setShowComparison] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'shipping' | 'collection'>('collection');

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart.mutate(id);
  };

  const handleColorSelect = (itemId: string, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [itemId]: color
    }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSavings = () => {
    return cartItems.reduce((savings, item) => {
      const originalPrice = item.products.original_price || item.products.price;
      return savings + ((originalPrice - item.products.price) * item.quantity);
    }, 0);
  };

  const getShippingCost = () => {
    return shippingMethod === 'shipping' ? 5.00 : 0;
  };

  const getTaxAmount = () => {
    return getTotalPrice() * 0.02; // 2% tax
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const savings = getSavings();
  const shipping = getShippingCost();
  const tax = getTaxAmount();
  const finalTotal = totalPrice + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className={`max-w-2xl mx-auto px-4 py-16 text-center ${isMobile ? 'pb-20' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground/30" />
            <h1 className="text-3xl font-bold text-foreground">Your cart is empty</h1>
            <p className="text-muted-foreground">Start shopping to add items to your cart</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90"
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Shopping Cart</h1>
            <Badge className="bg-primary/10 text-primary">
              {totalItems} items
            </Badge>
          </div>
        )}

        {/* Desktop/Tablet Header */}
        {!isMobile && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <div>
                <h1 className={`font-bold text-foreground ${isTablet ? 'text-2xl' : 'text-3xl'}`}>
                  Shopping Cart
                </h1>
                <p className="text-muted-foreground">{totalItems} items in your cart</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowComparison(!showComparison)}
              >
                Compare Products
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {/* Product Comparison */}
        {showComparison && <ProductComparison />}

        {/* One-Click Checkout */}
        <OneClickCheckout />

        {/* Shipping Method Selection */}
        <ShippingMethodSection 
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
        />

        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Cart Items */}
          <div className={isMobile ? 'order-1' : isTablet ? 'order-1' : 'lg:col-span-2'}>
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Your Items</span>
                  {savings > 0 && (
                    <Badge className="bg-success/10 text-success">
                      Save ${savings.toFixed(2)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col space-y-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={item.products.image}
                            alt={item.products.name}
                            className={`object-cover rounded-lg ${isMobile ? 'w-20 h-20' : isTablet ? 'w-24 h-24' : 'w-28 h-28'}`}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                            }}
                          />
                          {item.products.original_price && item.products.original_price > item.products.price && (
                            <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                              Sale
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{item.products.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-primary">${item.products.price}</span>
                            {item.products.original_price && item.products.original_price > item.products.price && (
                              <span className="text-muted-foreground line-through text-sm">${item.products.original_price}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted-foreground/10"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted-foreground/10"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Color Selection */}
                      {item.products.colors && Array.isArray(item.products.colors) && item.products.colors.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          <ProductColorSelector
                            colors={item.products.colors}
                            selectedColor={selectedColors[item.id] || null}
                            onColorSelect={(color) => handleColorSelect(item.id, color)}
                            size={isMobile ? 'sm' : 'md'}
                            showSelectedName={true}
                            className="w-full"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className={isMobile ? 'order-2' : ''}>
            <Card className="sticky top-4 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-success">
                      <span>You Save</span>
                      <span className="font-medium">-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className={`${shipping === 0 ? 'bg-success/10 border-success/20' : 'bg-primary/10 border-primary/20'} border rounded-lg p-3 flex items-center space-x-2`}>
                  <Truck className={`w-5 h-5 ${shipping === 0 ? 'text-success' : 'text-primary'}`} />
                  <span className={`text-sm font-medium ${shipping === 0 ? 'text-success' : 'text-primary'}`}>
                    {shipping === 0 ? '🎉 FREE collection at shop!' : `$5.00 delivery to your address`}
                  </span>
                </div>

                {/* Security Badge */}
                <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Secure checkout guaranteed</span>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/checkout/details')}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
