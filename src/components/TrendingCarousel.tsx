
import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrendingCarousel = () => {
  const navigate = useNavigate();

  const trendingProducts = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro',
      price: 1200,
      originalPrice: 1299,
      rating: 4.5,
      discount: '+25%',
      image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png'
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G',
      price: 449,
      originalPrice: 549,
      rating: 4.5,
      discount: '+20%',
      image: '/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png'
    },
    {
      id: 3,
      name: 'JBL Charge 5 Speaker',
      price: 179,
      originalPrice: 199,
      rating: 4.5,
      discount: '+15%',
      image: '/lovable-uploads/0ddc703b-d046-4e1d-8c7d-8a5624da50a7.png'
    }
  ];

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllClick = () => {
    navigate('/products?trending=true');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Trending Now</h3>
            <p className="text-sm text-gray-600">Most searched products</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {trendingProducts.map((product, index) => (
          <div 
            key={product.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{product.rating}</span>
                <span className="text-xs text-green-600 font-medium">{product.discount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-blue-600">${product.price}</span>
                <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
        onClick={handleViewAllClick}
      >
        View All Trending
      </button>
    </div>
  );
};

export default TrendingCarousel;
