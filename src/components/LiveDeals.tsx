
import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveDeals = () => {
  const navigate = useNavigate();

  const deals = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro',
      discount: '2% OFF',
      price: 1200,
      originalPrice: 1299,
      image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png'
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G',
      discount: '50% OFF',
      price: 449,
      originalPrice: 899,
      image: '/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png'
    }
  ];

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
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center mr-3">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Live Deals</h3>
            <p className="text-sm text-gray-600">Limited time offers</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {deals.map(deal => (
          <div 
            key={deal.id}
            className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDealClick(deal.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-sky-600">Flash Sale</span>
                  <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-xs font-medium">
                    {deal.discount}
                  </span>
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">{deal.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-sky-600">${deal.price}</span>
                  <span className="text-xs text-gray-400 line-through">${deal.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-4 bg-sky-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-sky-700 transition-colors"
        onClick={handleViewAllDeals}
      >
        View All Live Deals
      </button>
    </div>
  );
};

export default LiveDeals;
