
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Banner */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 rounded-r-2xl shadow-2xl w-64 overflow-hidden">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="w-8 h-8" />
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="font-bold text-xl mb-3">Weekly Deals</h3>
              <p className="text-sm mb-4 leading-relaxed opacity-90">Get up to 60% off on selected items every week!</p>
              <Button 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-4 py-2"
              >
                Explore Deals
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 rounded-full p-2 text-xs font-bold">
              NEW
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Banner */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <div className="bg-gradient-to-b from-blue-500 to-blue-700 text-white p-6 rounded-l-2xl shadow-2xl w-64 overflow-hidden">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="bg-white/20 p-3 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className="font-bold text-xl mb-3">VIP Club</h3>
              <p className="text-sm mb-4 leading-relaxed opacity-90">Join our exclusive membership for premium benefits!</p>
              <Button 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-4 py-2"
              >
                Join Now
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 bg-yellow-400 text-blue-800 rounded-full p-2 text-xs font-bold">
              VIP
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Corner Banner */}
      <div className="fixed bottom-4 left-4 z-10 hidden lg:block">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Flash Sale</h4>
              <p className="text-xs opacity-90">Ends in 2h 15m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Corner Banner */}
      <div className="fixed bottom-4 right-4 z-10 hidden lg:block">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Top Rated</h4>
              <p className="text-xs opacity-90">4.8★ Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-10 lg:hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer animate-bounce">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
