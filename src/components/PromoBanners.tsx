
import React from 'react';
import { Gift, Zap, Shield, Truck, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoBanners = () => {
  return (
    <div className="w-full space-y-6 mb-8">
      {/* Main Promo Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Gift className="w-6 h-6" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">MEGA DEAL</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">Summer Tech Festival</h2>
            <p className="text-lg opacity-90 mb-4">Get up to 60% off on premium electronics + Free shipping on orders over $75</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                Shop Festival Deals
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                View All Offers
              </Button>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-6xl font-black opacity-20">60%</div>
            <div className="text-2xl font-bold">OFF</div>
            <div className="text-sm opacity-75 mt-2">Limited Time Only</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
          <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Free Express Delivery</h3>
          <p className="text-sm text-gray-600">On orders over $50 • Same day delivery available</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
          <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">2-Year Warranty</h3>
          <p className="text-sm text-gray-600">Extended warranty on all products • Hassle-free returns</p>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
          <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
          <p className="text-sm text-gray-600">Expert tech support • Live chat available</p>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;
