
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Bell, Check, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Successfully subscribed!",
      description: "Welcome to our newsletter. Check your email for exclusive deals!",
    });
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white my-8">
        <CardContent className="p-6 md:p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Check className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Welcome to the VIP List!</h3>
            <p className="text-white/90">
              You're now subscribed to our exclusive newsletter. Get ready for amazing deals!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden relative my-8">
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>
      <CardContent className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <Badge className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold flex items-center gap-1">
                <Gift className="w-4 h-4" />
                EXCLUSIVE OFFER
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-sm">
                LIMITED TIME
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              Get 15% Off Your First Order
            </h2>
            <p className="text-lg font-semibold text-yellow-300 mb-3">
              Join our newsletter for exclusive deals & early access
            </p>
            <ul className="text-white/90 text-sm mb-4 space-y-1 max-w-md">
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Exclusive discounts and flash sales
              </li>
              <li className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-400" />
                First access to new product launches
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Weekly tech tips and recommendations
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 backdrop-blur-sm h-12"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 h-12 rounded-xl whitespace-nowrap"
                >
                  Get 15% Off
                </Button>
              </div>
              <p className="text-xs text-white/70 text-center">
                By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterBanner;
