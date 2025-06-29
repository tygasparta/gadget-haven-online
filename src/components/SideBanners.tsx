
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Long Banner - Desktop only */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-8 w-20 h-96 flex flex-col items-center justify-center overflow-hidden relative group">
          {/* Main Content - Centered */}
          <div className="flex flex-col items-center space-y-6 relative z-10">
            {/* Sale Badge */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full shadow-lg">
              <Percent className="w-6 h-6 text-white" />
            </div>
            
            {/* Main Offer */}
            <div className="text-center space-y-3">
              <span className="text-sm font-bold text-yellow-300 block tracking-wider">UP TO</span>
              <div className="relative">
                <span className="text-5xl font-black block text-white drop-shadow-lg">70</span>
                <span className="text-2xl font-bold block text-yellow-300 -mt-2">%</span>
              </div>
              <span className="text-sm font-bold text-green-300 block tracking-wider">OFF</span>
            </div>

            {/* Flash Sale Indicator */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full shadow-lg animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>

            {/* Sale Text */}
            <div className="text-center">
              <span className="text-sm font-bold text-purple-300 tracking-wider">FLASH SALE</span>
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Mobile Banner Section - Organized */}
      <div className="block xl:hidden w-full">
        {/* Mobile Flash Sale Banner - Top Priority */}
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-red-800 px-3 py-1 rounded-bl-xl">
              <span className="text-xs font-bold">LIMITED TIME</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full animate-pulse">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Flash Sale</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black">70%</span>
                    <span className="text-lg font-bold text-yellow-300">OFF</span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-red-600 hover:bg-gray-100 font-bold px-4 py-2"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Feature Cards Grid */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* VIP Club Banner */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">VIP Club</h3>
                  <span className="bg-yellow-400 text-blue-800 rounded-full px-2 py-1 text-xs font-bold">EXCLUSIVE</span>
                  <p className="text-xs mt-1 opacity-90">Premium benefits</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-xs w-full py-1 h-7"
                >
                  Join
                </Button>
              </div>
            </div>

            {/* Weekly Deals Banner */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Weekly Deals</h3>
                  <span className="bg-orange-400 text-green-800 rounded-full px-2 py-1 text-xs font-bold">HOT</span>
                  <p className="text-xs mt-1 opacity-90">Up to 60% off</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-green-600 hover:bg-gray-100 text-xs w-full py-1 h-7"
                >
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Quick Access */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Audio Sale</h3>
                  <span className="bg-pink-400 text-purple-800 rounded-full px-2 py-1 text-xs font-bold">NEW</span>
                  <p className="text-xs mt-1 opacity-90">Premium sound</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-purple-600 hover:bg-gray-100 text-xs w-full py-1 h-7"
                >
                  Browse
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-4 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">New Phones</h3>
                  <span className="bg-yellow-400 text-orange-800 rounded-full px-2 py-1 text-xs font-bold">LATEST</span>
                  <p className="text-xs mt-1 opacity-90">Latest tech</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-orange-600 hover:bg-gray-100 text-xs w-full py-1 h-7"
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Special Offer Banner */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Special Offer</h2>
                  <p className="text-sm opacity-90">Free shipping on all orders</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold">CODE: FREE50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-30 lg:hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer animate-bounce">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
