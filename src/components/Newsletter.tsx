
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift, Bell } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 mb-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-ping"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay in the Loop!
          </h2>
          <p className="text-blue-100 mb-2 text-xl">
            Get exclusive deals, early access to sales, and the latest tech news
          </p>
          <p className="text-blue-200 text-sm">
            Join over 50,000+ tech enthusiasts who never miss a deal
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Gift className="w-6 h-6 text-white mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Exclusive Deals</h3>
            <p className="text-blue-200 text-sm">Members-only discounts up to 70% off</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Bell className="w-6 h-6 text-white mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Early Access</h3>
            <p className="text-blue-200 text-sm">Be first to know about flash sales</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Mail className="w-6 h-6 text-white mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Weekly Updates</h3>
            <p className="text-blue-200 text-sm">Latest tech news and product launches</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3 p-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border-0 py-4 px-6 text-gray-700 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-white/50"
              required
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-blue-200 text-xs mt-3">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
