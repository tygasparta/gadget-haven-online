
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone, Percent, Clock, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Left Side Long Banner - Desktop only */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer p-4 w-16 h-80 flex flex-col items-center justify-between overflow-hidden relative group">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 -right-4 w-8 h-8 bg-blue-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 -left-4 w-6 h-6 bg-orange-300 rounded-full animate-pulse"></div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 rounded-2xl"></div>

          {/* Top Section - Hot Badge */}
          <div className="flex flex-col items-center space-y-2 relative z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2.5 rounded-full animate-bounce shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center tracking-wider">HOT</span>
            </div>
          </div>

          {/* Middle Section - Main Content */}
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full shadow-lg group-hover:animate-spin">
              <Tag className="w-5 h-5 text-white" />
            </div>
            
            <div className="text-center space-y-1">
              <span className="text-2xl font-black block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">UP</span>
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center">TO</span>
            </div>

            <div className="relative">
              <span className="text-3xl font-black block text-white drop-shadow-lg">70</span>
              <span className="text-lg font-bold block text-yellow-300">%</span>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full shadow-lg animate-pulse">
              <Percent className="w-4 h-4 text-white" />
            </div>
            
            <div className="text-center">
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center text-green-300">OFF</span>
            </div>
          </div>

          {/* Bottom Section - Action */}
          <div className="flex flex-col items-center space-y-2 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-full animate-pulse shadow-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold block transform -rotate-90 whitespace-nowrap origin-center">SALE</span>
            </div>
          </div>

          {/* Decorative side strips */}
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-yellow-400 via-green-400 to-blue-400 rounded-full"></div>
          <div className="absolute right-0 top-4 bottom-4 w-1 bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-400 rounded-full"></div>
          
          {/* Hover effect glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
