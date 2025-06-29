
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Long Banner - Desktop only */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-6 w-20 h-96 flex flex-col items-center justify-between overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-8 right-4 w-6 h-6 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/3 right-2 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute bottom-1/3 left-2 w-3 h-3 bg-white rounded-full"></div>
          </div>

          {/* Top Section */}
          <div className="flex flex-col items-center space-y-4 relative z-10">
            <div className="bg-yellow-400 p-3 rounded-full animate-bounce">
              <Percent className="w-6 h-6 text-blue-800" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xs mb-1 transform -rotate-90 whitespace-nowrap origin-center">MEGA</h3>
              <h3 className="font-bold text-xs transform -rotate-90 whitespace-nowrap origin-center">DEALS</h3>
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <div className="bg-green-400 p-2 rounded-full">
              <Star className="w-4 h-4 text-blue-800" />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold block">70%</span>
              <span className="text-xs font-medium block transform -rotate-90 whitespace-nowrap origin-center mt-2">OFF</span>
            </div>
            <div className="bg-orange-400 p-2 rounded-full">
              <Clock className="w-4 h-4 text-blue-800" />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center space-y-2 relative z-10">
            <div className="bg-red-400 p-2 rounded-full animate-pulse">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center">LIMITED</span>
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center mt-1">TIME</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-orange-400"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400"></div>
        </div>
      </div>

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
