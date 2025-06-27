
import React from 'react';
import { Gift, Zap, Trophy, ShoppingBag, Star, Crown, Headphones, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SideBanners = () => {
  return (
    <>
      {/* Desktop Side Banners - Hidden on mobile */}
      <div className="hidden xl:block">
        {/* Left Side Banner */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-10">
          <div className="group perspective-1000">
            <div className="relative w-64 h-80 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 rounded-r-2xl shadow-2xl backface-hidden">
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Gift className="w-8 h-8" />
                  </div>
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
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 rounded-full p-2 text-xs font-bold">
                    NEW
                  </div>
                </div>
              </div>
              
              {/* Back Side */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 rounded-r-2xl shadow-2xl backface-hidden rotate-y-180">
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-xl mb-3">Audio Sale</h3>
                    <p className="text-sm mb-4 leading-relaxed opacity-90">Premium headphones & speakers at amazing prices!</p>
                    <Button 
                      size="sm" 
                      className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-4 py-2"
                    >
                      Shop Audio
                    </Button>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-400 text-blue-800 rounded-full p-2 text-xs font-bold">
                    HOT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Banner */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10">
          <div className="group perspective-1000">
            <div className="relative w-64 h-80 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 text-white p-6 rounded-l-2xl shadow-2xl backface-hidden">
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Crown className="w-8 h-8" />
                  </div>
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
                  <div className="absolute -top-2 -left-2 bg-yellow-400 text-blue-800 rounded-full p-2 text-xs font-bold">
                    VIP
                  </div>
                </div>
              </div>
              
              {/* Back Side */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 rounded-l-2xl shadow-2xl backface-hidden rotate-y-180">
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-xl mb-3">New Phones</h3>
                    <p className="text-sm mb-4 leading-relaxed opacity-90">Latest smartphones with cutting-edge technology!</p>
                    <Button 
                      size="sm" 
                      className="bg-white text-blue-600 hover:bg-gray-100 text-sm px-4 py-2"
                    >
                      View Phones
                    </Button>
                  </div>
                  <div className="absolute -top-2 -left-2 bg-orange-400 text-blue-800 rounded-full p-2 text-xs font-bold">
                    NEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner Cards - Displayed below other content */}
      <div className="block xl:hidden mt-8 px-4">
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
          {/* Audio Sale Banner */}
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

          {/* New Phones Banner */}
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

      {/* Corner Banners - Responsive positioning */}
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

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-10 lg:hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer animate-bounce">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </>
  );
};

export default SideBanners;
