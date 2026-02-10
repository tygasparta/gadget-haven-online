
import React from 'react';
import { Zap, Crown, Timer, Tag, Percent, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TabletOptimizedBanners = () => {
  return (
    <div className="hidden md:block lg:hidden">
      {/* Tablet Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-6 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <Badge className="bg-blue-500 text-white animate-pulse">
                FLASH SALE
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Mega Tech Sale
            </h1>
            <p className="text-blue-100 text-sm mb-4">
              Up to 70% off on premium electronics
            </p>
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              Shop Now
            </Button>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">70%</div>
              <div className="text-sm">OFF</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Dual Banners */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden">
          <Crown className="w-6 h-6 mb-2" />
          <h3 className="font-bold mb-1">Premium Collection</h3>
          <p className="text-xs mb-3 opacity-90">Exclusive luxury tech</p>
          <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
            Explore
          </Button>
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-4 text-white relative overflow-hidden">
          <Timer className="w-6 h-6 mb-2" />
          <h3 className="font-bold mb-1">Limited Time</h3>
          <p className="text-xs mb-3 opacity-90">Ends in 23:59:45</p>
          <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50">
            Hurry Up
          </Button>
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Tablet Categories Quick Access */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-blue-600" />
          Quick Categories
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'Smartphones', icon: '📱', color: 'bg-blue-50 text-blue-700' },
            { name: 'Laptops', icon: '💻', color: 'bg-blue-100 text-blue-800' },
            { name: 'Audio', icon: '🎧', color: 'bg-blue-50 text-blue-700' },
            { name: 'Gaming', icon: '🎮', color: 'bg-blue-100 text-blue-800' }
          ].map((category) => (
            <div key={category.name} className={`${category.color} rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform`}>
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet Special Deals */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Percent className="w-5 h-5" />
              <span className="text-sm font-medium">Special Deals</span>
            </div>
            <h3 className="text-lg font-bold">Daily Discounts</h3>
            <p className="text-sm opacity-90">New deals every day</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-3">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabletOptimizedBanners;
