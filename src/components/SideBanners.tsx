
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
        <div className="bg-white text-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer p-4 w-24 h-[400px] flex flex-col items-center justify-between overflow-hidden relative group border border-border">
          <div className="flex flex-col items-center space-y-4 relative z-10 h-full justify-center">
            <div className="bg-primary p-2 rounded-xl shadow-lg animate-pulse">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            
            <div className="text-center">
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">SAVE</span>
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">UP TO</span>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <span className="text-4xl font-black text-foreground">70</span>
                <span className="text-lg font-bold text-primary absolute -top-1 -right-1">%</span>
              </div>
              <span className="text-sm font-bold text-primary">OFF</span>
            </div>

            <div className="bg-primary p-2 rounded-xl shadow-lg">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">FLASH</span>
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">SALE</span>
            </div>

            <div className="text-center">
              <span className="text-xs font-medium text-muted-foreground uppercase block">Limited</span>
              <span className="text-xs font-medium text-muted-foreground uppercase block">Time</span>
            </div>

            <div className="bg-primary p-2 rounded-xl shadow-lg">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBanners;
