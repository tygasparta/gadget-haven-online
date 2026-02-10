
import React, { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToCart } from '@/hooks/useCart';

const LiveDeals = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { mutate: addToCart } = useAddToCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 42,
    seconds: 29
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
      id: 1,
      name: 'Apple iPhone 15 Pro',
      discount: '2% OFF',
      claimed: 96,
      total: 200,
      price: 1200,
      originalPrice: 1299,
      image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png'
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G',
      discount: '50% OFF',
      claimed: 65,
      total: 200,
      price: 449,
      originalPrice: 899,
      image: '/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png'
    }
  ];

  const handleAddToCart = (dealId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    addToCart({ productId: dealId });
    console.log('Added deal to cart:', dealId);
  };

  const handleDealClick = (dealId: number) => {
    navigate(`/product/${dealId}`);
  };

  const handleViewAllDeals = () => {
    navigate('/deals');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Live Deals</h3>
            <p className="text-sm text-gray-600">Limited time offers</p>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Deals end in:</p>
        <div className="flex space-x-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
            <div className="text-xs opacity-75">HRS</div>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
            <div className="text-xs opacity-75">MIN</div>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
            <div className="text-xs opacity-75">SEC</div>
          </div>
        </div>
      </div>

      {/* Deals */}
      <div className="space-y-4">
        {deals.map(deal => (
          <div 
            key={deal.id}
            className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDealClick(deal.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-blue-600">Flash Sale</span>
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
                    {deal.discount}
                  </span>
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">{deal.name}</h4>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Claimed</span>
                    <span>{deal.claimed}/{deal.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(deal.claimed / deal.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
                  onClick={(e) => handleAddToCart(deal.id, e)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-4 bg-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        onClick={handleViewAllDeals}
      >
        View All Live Deals
      </button>
    </div>
  );
};

export default LiveDeals;
