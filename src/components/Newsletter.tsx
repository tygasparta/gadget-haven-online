
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift, Bell, Zap, Users, Star, Shield, Truck, Heart } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 lg:py-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-blue-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mb-6 shadow-xl">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Join Our <span className="text-blue-600">Tech Community</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-2 max-w-2xl mx-auto">
            Get exclusive deals, early access to sales, and the latest tech insights
          </p>
          
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
            <Users className="w-5 h-5" />
            <span className="text-sm md:text-base">Join 50,000+ satisfied customers</span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Exclusive Deals</h3>
            <p className="text-gray-600 text-sm">Get up to 70% off on member-only flash sales and special promotions</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Early Access</h3>
            <p className="text-gray-600 text-sm">Be the first to shop new arrivals and limited-time flash sales</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="bg-gradient-to-br from-blue-700 to-blue-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Tech Insights</h3>
            <p className="text-gray-600 text-sm">Weekly tech news, product reviews, and buying guides</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">VIP Perks</h3>
            <p className="text-gray-600 text-sm">Free shipping, extended warranties, and priority support</p>
          </div>
        </div>

        {/* Newsletter Signup Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Subscribe Now
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              <span>100% secure. No spam. Unsubscribe anytime.</span>
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60">
          <div className="flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Secure & Safe</span>
          </div>
          <div className="flex items-center justify-center">
            <Truck className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Fast Delivery</span>
          </div>
          <div className="flex items-center justify-center">
            <Star className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Top Rated</span>
          </div>
          <div className="flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Loved by 50K+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
