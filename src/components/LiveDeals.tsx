
import React, { useState, useEffect } from 'react';
import { Clock, Zap, Gift, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useFlashSaleProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const LiveDeals = () => {
  const navigate = useNavigate();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { addToCart } = useCart();
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

  // Create deals based on flash sale products or default deals
  const createDealsFromProducts = () => {
    if (flashSaleProducts.length === 0) {
      return [
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
    }

    return flashSaleProducts.slice(0, 2).map((product, index) => ({
      title: index === 0 ? "Flash Sale" : "Daily Deal",
      discount: `${product.discount_percentage || 50}% OFF`,
      claimed: Math.floor(Math.random() * 150) + 50,
      total: 200,
      icon: index === 0 ? Zap : Gift,
      color: index === 0 ? "from-red-500 to-pink-500" : "from-blue-500 to-purple-500",
      productId: product.id,
      product: product
    }));
  };

  const deals = createDealsFromProducts();

  const handleGrabDeal = async (deal: any) => {
    if (deal.product) {
      try {
        await addToCart(deal.product, 1);
        toast.success(`${deal.product.name} added to cart!`, {
          description: `You saved ${deal.discount} on this deal!`
        });
      } catch (error) {
        toast.error("Failed to add item to cart");
        console.error("Error adding to cart:", error);
      }
    } else {
      // Navigate to deals page for generic deals
      navigate('/deals');
      toast.info("Redirecting to deals page...");
    }
  };

  const handleViewAllDeals = () => {
    navigate('/deals');
  };

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
                  {deal.product && (
                    <p className="text-xs text-gray-600 truncate">{deal.product.name}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Claimed</span>
                  <span>{deal.claimed}/{deal.total}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
                onClick={() => handleGrabDeal(deal)}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {deal.product ? "Add to Cart" : "Grab Deal"}
              </Button>
            </div>
          );
        })}
      </div>

      <Button 
        className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        onClick={handleViewAllDeals}
      >
        View All Live Deals
      </Button>
    </div>
  );
};

export default LiveDeals;
