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
  return <>
      {/* Desktop Left Side Banner */}
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

      {/* Mobile Banner Section */}
      <div className="block xl:hidden w-full px-4 space-y-4">
        {/* Main Flash Sale Banner */}
        <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50"></div>
          
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />
            FLASH SALE
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 mb-1">BIG SALE</h2>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-gray-800">70</span>
                    <span className="text-xl font-bold text-orange-500">%</span>
                    <span className="text-lg font-bold text-green-600">OFF</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Premium Electronics</p>
                  
                  {/* Better organized timeframe */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold">
                      ⏰ Ends in: 23h 45m
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                      🔥 Limited Stock
                    </div>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-3 shadow-lg rounded-xl hover:scale-105 transition-all duration-200 hidden sm:block">
                Shop Now
              </Button>
            </div>
            
            {/* Mobile Shop Button */}
            <div className="block sm:hidden mt-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold w-full py-3 shadow-lg rounded-xl">
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Grid - Better organized for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VIP Club */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-center space-y-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mx-auto w-fit">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">VIP Club</h3>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  EXCLUSIVE
                </div>
                <p className="text-sm opacity-90 mb-4">Premium benefits & early access</p>
                <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2">
                  Join VIP
                </Button>
              </div>
            </div>
          </div>

          {/* Weekly Deals */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-center space-y-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mx-auto w-fit">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Hot Deals</h3>
                <div className="bg-gradient-to-r from-orange-400 to-red-400 text-emerald-900 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  LIMITED
                </div>
                <p className="text-sm opacity-90 mb-4">Up to 60% off selected items</p>
                <Button size="sm" className="bg-white text-emerald-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2">
                  Browse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-center space-y-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mx-auto w-fit">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Audio</h3>
                <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-purple-900 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  NEW
                </div>
                <p className="text-sm opacity-90 mb-4">Premium sound experience</p>
                <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2">
                  Explore
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-center space-y-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mx-auto w-fit">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Phones</h3>
                <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-orange-900 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  LATEST
                </div>
                <p className="text-sm opacity-90 mb-4">Newest smartphone tech</p>
                <Button size="sm" className="bg-white text-orange-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2">
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Free Shipping Promo */}
        <div className="bg-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-black text-xl text-gray-800 mb-1">Free Shipping</h2>
                  <p className="text-sm text-gray-600 font-medium">On orders over $50</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                <span className="text-sm">CODE: FREE50</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Now Functional */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        
      </div>
    </>;
};
export default SideBanners;