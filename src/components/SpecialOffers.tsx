
import React from 'react';
import { Gift, Percent, Truck, Shield, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SpecialOffers = () => {
  const offers = [
    {
      icon: Gift,
      title: "New Customer",
      subtitle: "15% OFF",
      description: "First order discount",
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      code: "WELCOME15"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "Orders $50+",
      description: "No delivery fees",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      code: "FREE50"
    },
    {
      icon: Users,
      title: "Refer Friends",
      subtitle: "Get $25",
      description: "For each referral",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      code: "REFER25"
    }
  ];

  const benefits = [
    { icon: Shield, text: "2-Year Warranty" },
    { icon: CreditCard, text: "Secure Payment" },
    { icon: Truck, text: "Fast Delivery" },
    { icon: Percent, text: "Price Match" }
  ];

  return (
    <div className="space-y-6">
      {/* Special Offers */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Special Offers</h3>
            <p className="text-sm text-gray-600">Exclusive deals for you</p>
          </div>
        </div>

        <div className="space-y-3">
          {offers.map((offer, index) => (
            <div key={index} className={`bg-gradient-to-r ${offer.bgColor} rounded-xl p-4 border border-gray-100`}>
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-r ${offer.color} p-2 rounded-lg`}>
                  <offer.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-gray-800">{offer.title}</h4>
                    <Badge className="bg-orange-500 text-white text-xs px-2 py-0">
                      {offer.subtitle}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{offer.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="bg-white px-2 py-1 rounded text-xs font-mono border">
                      {offer.code}
                    </code>
                    <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Why Choose Us?</h3>
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <benefit.icon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
