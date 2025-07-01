
import React, { useState, useEffect } from 'react';
import { Clock, Zap, Gift, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const LiveDeals = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      title: "Flash Sale",
      discount: "70% OFF",
      claimed: 156,
      total: 200,
      icon: Zap,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Daily Deal",
      discount: "50% OFF",
      claimed: 89,
      total: 150,
      icon: Gift,
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg animate-pulse">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Live Deals</h3>
          <p className="text-sm text-gray-600">Limited time offers</p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 mb-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">Deals end in:</p>
          <div className="flex justify-center gap-2">
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg">
              <span className="font-bold text-lg">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <p className="text-xs">HRS</p>
            </div>
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg">
              <span className="font-bold text-lg">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <p className="text-xs">MIN</p>
            </div>
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg">
              <span className="font-bold text-lg">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <p className="text-xs">SEC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="space-y-3">
        {deals.map((deal, index) => {
          const progress = (deal.claimed / deal.total) * 100;
          return (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`bg-gradient-to-r ${deal.color} p-2 rounded-lg`}>
                  <deal.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{deal.title}</h4>
                  <span className="text-lg font-bold text-red-600">{deal.discount}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Claimed</span>
                  <span>{deal.claimed}/{deal.total}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Button size="sm" className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Grab Deal
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveDeals;
