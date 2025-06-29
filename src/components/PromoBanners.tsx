
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Gift, 
  Crown, 
  Star, 
  Truck, 
  Shield, 
  Headphones, 
  Smartphone, 
  Laptop,
  Watch,
  Percent,
  Tag,
  TrendingUp,
  Award,
  Target,
  Sparkles
} from 'lucide-react';

const PromoBanners = () => {
  return (
    <div className="space-y-6 my-8">
      {/* Flash Sale Banner */}
      <Card className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
        </div>
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Badge className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold animate-pulse">
                  <Zap className="w-4 h-4 mr-1" />
                  FLASH SALE
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-sm">
                  24H ONLY
                </Badge>
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-2">UP TO 70% OFF</h2>
              <p className="text-lg md:text-xl font-semibold text-yellow-300 mb-3">
                Premium Electronics & Gadgets
              </p>
              <p className="text-white/90 mb-4 max-w-md">
                Don't miss out on our biggest sale of the year! Limited stock available.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl">
                  Shop Now
                </Button>
                <div className="text-yellow-300 text-sm font-semibold">
                  ⏰ Ends in: 23h 45m 12s
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-2">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gaming Gear */}
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white overflow-hidden relative group hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Laptop className="w-8 h-8" />
              </div>
              <Badge className="bg-green-500 text-white">50% OFF</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Gaming Gear</h3>
            <p className="text-white/80 text-sm mb-4">Professional gaming equipment for ultimate performance</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">From $299</span>
              <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Equipment */}
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white overflow-hidden relative group hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Headphones className="w-8 h-8" />
              </div>
              <Badge className="bg-yellow-500 text-black">40% OFF</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Premium Audio</h3>
            <p className="text-white/80 text-sm mb-4">Crystal-clear sound with advanced noise cancellation</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">From $199</span>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smart Watches */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white overflow-hidden relative group hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Watch className="w-8 h-8" />
              </div>
              <Badge className="bg-orange-500 text-white">NEW</Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Watches</h3>
            <p className="text-white/80 text-sm mb-4">Latest fitness tracking with health monitoring</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">From $399</span>
              <Button size="sm" className="bg-white text-green-600 hover:bg-gray-100">
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Features Banner */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Free Shipping</h4>
                <p className="text-sm text-gray-400">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Secure Payment</h4>
                <p className="text-sm text-gray-400">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">Quality Guaranteed</h4>
                <p className="text-sm text-gray-400">Premium products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-gray-400">Always here to help</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Membership Banner */}
      <Card className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-4 right-4 w-24 h-24 bg-black/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-black/10 rounded-full animate-bounce"></div>
        </div>
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Crown className="w-6 h-6" />
                <Badge className="bg-black text-yellow-400 px-3 py-1 text-sm font-bold">
                  VIP EXCLUSIVE
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-2">Join VIP Club</h2>
              <p className="text-lg font-semibold mb-3">
                Get exclusive deals, early access & premium support
              </p>
              <ul className="text-black/80 text-sm mb-4 space-y-1">
                <li>• Extra 10% off on all purchases</li>
                <li>• Priority customer support</li>
                <li>• Early access to new products</li>
                <li>• Free express shipping</li>
              </ul>
              <Button size="lg" className="bg-black text-yellow-400 hover:bg-gray-800 font-bold px-8 py-3 rounded-xl">
                <Crown className="w-5 h-5 mr-2" />
                Join VIP Club
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 bg-black/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-black" />
                </div>
                <div className="absolute -top-2 -right-2 bg-black text-yellow-400 rounded-full p-2">
                  <Crown className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoBanners;
