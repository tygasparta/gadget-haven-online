
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Tag, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Professional Banner - Desktop only - Increased Height */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-8 w-32 h-[500px] flex flex-col items-center justify-between overflow-hidden relative group border border-gray-100">
          {/* Gradient Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
          
          {/* Main Content */}
          <div className="flex flex-col items-center space-y-8 relative z-10 h-full justify-center">
            {/* Top Icon with Pulse Effect */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl shadow-lg animate-pulse">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            
            {/* Save Text */}
            <div className="text-center">
              <span className="text-sm font-bold text-blue-600 tracking-wider uppercase">SAVE UP TO</span>
            </div>
            
            {/* Main Percentage - Larger and Bolder */}
            <div className="text-center">
              <div className="relative">
                <span className="text-6xl font-black text-gray-800">70</span>
                <span className="text-2xl font-bold text-orange-500 absolute -top-2 -right-2">%</span>
              </div>
              <span className="text-lg font-bold text-green-600 tracking-wide">OFF</span>
            </div>

            {/* Flash Sale Badge */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            {/* Flash Sale Text */}
            <div className="text-center">
              <span className="text-sm font-bold text-red-600 tracking-wider uppercase">FLASH</span>
              <br />
              <span className="text-sm font-bold text-red-600 tracking-wider uppercase">SALE</span>
            </div>

            {/* Limited Time */}
            <div className="text-center">
              <span className="text-xs font-medium text-gray-600 uppercase">Limited Time</span>
            </div>

            {/* Bottom Decorative Icon */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Mobile Banner Section - Increased Height */}
      <div className="block xl:hidden w-full">
        {/* Mobile Hero Banner - Increased Height */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden border border-gray-100 min-h-[200px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50"></div>
            
            {/* Flash Sale Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
              <Zap className="w-4 h-4" />
              FLASH SALE
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-2xl shadow-lg">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">BIG SALE</h2>
                    <div className="flex items-baseline space-x-3">
                      <span className="text-5xl font-black text-gray-800">70</span>
                      <span className="text-2xl font-bold text-orange-500">%</span>
                      <span className="text-xl font-bold text-green-600">OFF</span>
                    </div>
                    <p className="text-base text-gray-600 mt-2 font-medium">Premium Electronics</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-10 py-5 shadow-lg rounded-xl hover:scale-105 transition-all duration-200"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Feature Grid - 2x2 Layout - Increased Height */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* VIP Club */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg min-h-[180px]">
              <div className="text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mx-auto w-fit">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">VIP Club</h3>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 rounded-full px-4 py-2 text-sm font-bold mb-4">
                    EXCLUSIVE
                  </div>
                  <p className="text-sm opacity-90 mb-5">Premium benefits & early access</p>
                  <Button 
                    size="sm" 
                    className="bg-white text-purple-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2"
                  >
                    Join VIP
                  </Button>
                </div>
              </div>
            </div>

            {/* Weekly Deals */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 rounded-2xl shadow-lg min-h-[180px]">
              <div className="text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mx-auto w-fit">
                  <Gift className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">Hot Deals</h3>
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 text-emerald-900 rounded-full px-4 py-2 text-sm font-bold mb-4">
                    LIMITED
                  </div>
                  <p className="text-sm opacity-90 mb-5">Up to 60% off selected items</p>
                  <Button 
                    size="sm" 
                    className="bg-white text-emerald-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2"
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Cards - Increased Height */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg min-h-[180px]">
              <div className="text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mx-auto w-fit">
                  <Headphones className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">Audio</h3>
                  <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-purple-900 rounded-full px-4 py-2 text-sm font-bold mb-4">
                    NEW
                  </div>
                  <p className="text-sm opacity-90 mb-5">Premium sound experience</p>
                  <Button 
                    size="sm" 
                    className="bg-white text-purple-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg min-h-[180px]">
              <div className="text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mx-auto w-fit">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">Phones</h3>
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-orange-900 rounded-full px-4 py-2 text-sm font-bold mb-4">
                    LATEST
                  </div>
                  <p className="text-sm opacity-90 mb-5">Newest smartphone tech</p>
                  <Button 
                    size="sm" 
                    className="bg-white text-orange-600 hover:bg-gray-100 text-sm w-full font-semibold rounded-lg py-2"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Promo Banner - Increased Height */}
        <div className="px-4 mb-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-gray-100 min-h-[120px]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 rounded-2xl shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-2xl text-gray-800 mb-2">Free Shipping</h2>
                  <p className="text-base text-gray-600 font-medium">On orders over $50</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg">
                  <span className="text-base">CODE: FREE50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Enhanced */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 cursor-pointer border-4 border-white">
          <ShoppingBag className="w-7 h-7" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
