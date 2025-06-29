
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Mobile Banner Cards - Below other content */}
      <div className="block xl:hidden mt-8 px-4 order-last">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Mobile VIP Club Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">VIP Club</h3>
                <span className="bg-yellow-400 text-blue-800 rounded-full px-2 py-1 text-xs font-bold">VIP</span>
              </div>
            </div>
            <p className="text-sm mb-3 opacity-90">Join our exclusive membership for premium benefits!</p>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm w-full"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Weekly Deals Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Weekly Deals</h3>
                <span className="bg-green-400 text-blue-800 rounded-full px-2 py-1 text-xs font-bold">NEW</span>
              </div>
            </div>
            <p className="text-sm mb-3 opacity-90">Up to 60% off selected items!</p>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm w-full"
            >
              Explore Deals
            </Button>
          </div>
        </div>

        {/* Mobile Additional Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Audio Sale</h3>
                <span className="bg-orange-400 text-blue-800 rounded-full px-2 py-1 text-xs font-bold">HOT</span>
              </div>
            </div>
            <p className="text-sm mb-3 opacity-90">Premium headphones & speakers!</p>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm w-full"
            >
              Shop Audio
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">New Phones</h3>
                <span className="bg-yellow-400 text-blue-800 rounded-full px-2 py-1 text-xs font-bold">NEW</span>
              </div>
            </div>
            <p className="text-sm mb-3 opacity-90">Latest smartphone technology!</p>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm w-full"
            >
              View Phones
            </Button>
          </div>
        </div>
      </div>

      {/* Corner Banners - Desktop only */}
      <div className="fixed bottom-4 left-4 z-30 hidden lg:block">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Flash Sale</h4>
              <p className="text-xs opacity-90">Ends in 2h 15m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-30 hidden lg:block">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Top Rated</h4>
              <p className="text-xs opacity-90">4.8★ Products</p>
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
