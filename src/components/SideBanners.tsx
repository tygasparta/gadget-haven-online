
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Banner */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white p-4 rounded-r-2xl shadow-2xl w-16 hover:w-48 transition-all duration-300 group overflow-hidden">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="bg-white/20 p-3 rounded-full group-hover:animate-bounce">
              <Gift className="w-6 h-6" />
            </div>
            
            {/* Content - Hidden until hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <h3 className="font-bold text-lg mb-2">Weekly Deals</h3>
              <p className="text-sm mb-4 leading-relaxed">Get up to 60% off on selected items every week!</p>
              <Button 
                size="sm" 
                className="bg-white text-purple-600 hover:bg-gray-100 text-xs px-3 py-1"
              >
                Explore
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-purple-800 rounded-full p-1 text-xs font-bold animate-pulse">
              NEW
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Banner */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <div className="bg-gradient-to-b from-orange-500 to-red-600 text-white p-4 rounded-l-2xl shadow-2xl w-16 hover:w-48 transition-all duration-300 group overflow-hidden">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="bg-white/20 p-3 rounded-full group-hover:animate-pulse">
              <Crown className="w-6 h-6" />
            </div>
            
            {/* Content - Hidden until hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <h3 className="font-bold text-lg mb-2">VIP Club</h3>
              <p className="text-sm mb-4 leading-relaxed">Join our exclusive membership for premium benefits!</p>
              <Button 
                size="sm" 
                className="bg-white text-orange-600 hover:bg-gray-100 text-xs px-3 py-1"
              >
                Join Now
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 bg-yellow-400 text-orange-800 rounded-full p-1 text-xs font-bold animate-bounce">
              VIP
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Corner Banner */}
      <div className="fixed bottom-4 left-4 z-10 hidden lg:block">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full group-hover:animate-spin">
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full group-hover:animate-pulse">
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
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer animate-bounce">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
