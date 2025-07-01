
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Tag, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

const SideBanners = () => {
  const {
    items: cartItems,
    isCartOpen,
    setIsCartOpen
  } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {/* Desktop Left Side Banner - Desktop Only */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-6 w-28 h-[480px] flex flex-col items-center justify-between overflow-hidden relative group border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
          
          <div className="flex flex-col items-center space-y-6 relative z-10 h-full justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg animate-pulse">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            
            <div className="text-center">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">SAVE UP TO</span>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <span className="text-5xl font-black text-gray-800">70</span>
                <span className="text-xl font-bold text-orange-500 absolute -top-1 -right-1">%</span>
              </div>
              <span className="text-base font-bold text-green-600">OFF</span>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">FLASH</span>
              <br />
              <span className="text-xs font-bold text-red-600 tracking-wider uppercase">SALE</span>
            </div>

            <div className="text-center">
              <span className="text-xs font-medium text-gray-600 uppercase">Limited Time</span>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </>
  );
};

export default SideBanners;
