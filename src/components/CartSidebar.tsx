
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Sparkles, Gift, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartItems, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [celebrateAdd, setCelebrateAdd] = useState(false);
  const { data: cartItems = [] } = useCartItems();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const updateQuantity = (id: string, newQuantity: number) => {
    updateCartItem.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart.mutate(id);
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

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Listen for cart open state from header
  useEffect(() => {
    const handleCartOpen = () => {
      setIsCartOpen(true);
      setCelebrateAdd(true);
      setTimeout(() => setCelebrateAdd(false), 1000);
    };
    window.addEventListener('openCart', handleCartOpen);
    return () => window.removeEventListener('openCart', handleCartOpen);
  }, []);

  // Animate cart items count
  const itemsCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const savings = getSavings();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`fixed right-0 top-0 h-full ${isMobile ? 'w-full' : 'w-96'} bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 flex flex-col border-l border-gray-200`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${isMobile ? 'p-4' : 'p-6'} border-b bg-white`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              {celebrateAdd && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
              )}
            </div>
            <div>
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>Shopping Cart</h2>
              {itemsCount > 0 && (
                <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 mt-1">
                  {itemsCount} item{itemsCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Savings Banner */}
        {savings > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white ${isMobile ? 'p-2 mx-3 mt-3' : 'p-3 mx-4 mt-4'} rounded-lg flex items-center space-x-2`}
          >
            <Gift className="w-5 h-5" />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>You're saving ${savings.toFixed(2)}!</span>
          </motion.div>
        )}

        {/* Cart Items */}
        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-6'} ${isMobile ? 'pb-24' : ''}`}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
                <div>
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 mt-2`}>
                    {!user ? "Please log in to save items to your cart" : "Start shopping to add items!"}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Shopping
                </Button>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <div className={`space-y-${isMobile ? '3' : '4'}`}>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-${isMobile ? '3' : '4'} ${isMobile ? 'p-3' : 'p-4'} bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.products.image}
                        alt={item.products.name}
                        className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} object-cover rounded-lg`}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                        }}
                      />
                      {item.products.original_price && item.products.original_price > item.products.price && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          Sale
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'} text-gray-800 truncate leading-tight`}>
                        {item.products.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className={`text-blue-600 font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
                          ${item.products.price}
                        </p>
                        {item.products.original_price && item.products.original_price > item.products.price && (
                          <p className={`text-gray-400 line-through ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            ${item.products.original_price}
                          </p>
                        )}
                      </div>
                      
                      <div className={`flex items-center justify-between ${isMobile ? 'mt-2' : 'mt-3'}`}>
                        <div className={`flex items-center space-x-${isMobile ? '1' : '2'} bg-gray-100 rounded-lg p-1`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} hover:bg-gray-200`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          </Button>
                          <span className={`${isMobile ? 'w-6 text-xs' : 'w-8 text-sm'} text-center font-medium`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} hover:bg-gray-200`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-red-500 hover:text-red-700 hover:bg-red-50`}
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`border-t bg-white ${isMobile ? 'p-4 pb-20' : 'p-6'} space-y-4`}
          >
            {/* Order Summary */}
            <div className="space-y-2">
              <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                <span>Subtotal ({itemsCount} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-green-600`}>
                  <span>You Save</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>Total:</span>
                <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-blue-600`}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free Shipping Banner */}
            {totalPrice >= 50 ? (
              <div className={`bg-green-50 border border-green-200 rounded-lg ${isMobile ? 'p-2' : 'p-3'} flex items-center space-x-2`}>
                <Heart className="w-4 h-4 text-green-600" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-700 font-medium`}>
                  You qualify for FREE shipping!
                </span>
              </div>
            ) : (
              <div className={`bg-blue-50 border border-blue-200 rounded-lg ${isMobile ? 'p-2' : 'p-3'} flex items-center space-x-2`}>
                <Star className="w-4 h-4 text-blue-600" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700`}>
                  Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping
                </span>
              </div>
            )}

            <Button 
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ${isMobile ? 'py-2.5 text-sm' : 'py-3'} font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
              onClick={handleCheckout}
            >
              Proceed to Checkout • ${totalPrice.toFixed(2)}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CartSidebar;
