
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Tag, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Professional Banner - Desktop only */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-gradient-to-b from-slate-800 via-slate-900 to-black text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-6 w-24 h-80 flex flex-col items-center justify-center overflow-hidden relative group border border-slate-700">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent opacity-60"></div>
          
          {/* Main Content */}
          <div className="flex flex-col items-center space-y-4 relative z-10">
            {/* Top Icon */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            
            {/* Sale Badge */}
            <div className="text-center">
              <span className="text-xs font-medium text-blue-300 tracking-wide">SAVE UP TO</span>
            </div>
            
            {/* Main Offer */}
            <div className="text-center space-y-1">
              <div className="relative">
                <span className="text-4xl font-black text-white drop-shadow-lg">70</span>
                <span className="text-lg font-bold text-yellow-400 -ml-1">%</span>
              </div>
              <span className="text-xs font-semibold text-green-400 tracking-wide">OFF</span>
            </div>

            {/* Flash Sale Indicator */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>

            {/* Sale Text */}
            <div className="text-center">
              <span className="text-xs font-semibold text-orange-300 tracking-wide">FLASH SALE</span>
            </div>

            {/* Bottom Icon */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Professional Hover Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Border Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        </div>
      </div>

      {/* Mobile Banner Section - Professional Layout */}
      <div className="block xl:hidden w-full">
        {/* Mobile Flash Sale Banner - Premium Design */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent"></div>
            
            {/* Limited Time Badge */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                LIMITED TIME
              </span>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Flash Sale</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-black text-yellow-400">70%</span>
                    <span className="text-lg font-bold text-green-400">OFF</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">Premium tech products</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-3 shadow-lg"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Feature Cards - Professional Grid */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* VIP Club Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-5 rounded-xl shadow-lg border border-blue-500/20">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">VIP Club</h3>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 rounded-full px-3 py-1 text-xs font-bold shadow-sm">EXCLUSIVE</span>
                  <p className="text-xs mt-2 opacity-90">Premium member benefits</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-sm w-full py-2 font-semibold"
                >
                  Join Now
                </Button>
              </div>
            </div>

            {/* Weekly Deals Banner */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-5 rounded-xl shadow-lg border border-green-500/20">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">Weekly Deals</h3>
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 text-green-900 rounded-full px-3 py-1 text-xs font-bold shadow-sm">HOT</span>
                  <p className="text-xs mt-2 opacity-90">Up to 60% savings</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-green-600 hover:bg-gray-100 text-sm w-full py-2 font-semibold"
                >
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Cards - Enhanced */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-5 rounded-xl shadow-lg border border-purple-500/20">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">Audio Sale</h3>
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-purple-900 rounded-full px-3 py-1 text-xs font-bold shadow-sm">NEW</span>
                  <p className="text-xs mt-2 opacity-90">Premium sound gear</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-purple-600 hover:bg-gray-100 text-sm w-full py-2 font-semibold"
                >
                  Browse
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white p-5 rounded-xl shadow-lg border border-orange-500/20">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">New Phones</h3>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 rounded-full px-3 py-1 text-xs font-bold shadow-sm">LATEST</span>
                  <p className="text-xs mt-2 opacity-90">Latest technology</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white text-orange-600 hover:bg-gray-100 text-sm w-full py-2 font-semibold"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Special Offer Banner - Premium */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-1">Special Offer</h2>
                  <p className="text-sm text-gray-300">Free shipping on all orders over $50</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                  <span className="text-sm">CODE: FREE50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button - Enhanced */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
