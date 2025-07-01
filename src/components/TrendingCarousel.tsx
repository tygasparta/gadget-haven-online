
import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '@/hooks/useProducts';

const TrendingCarousel = () => {
  const navigate = useNavigate();
  const { data: featuredProducts = [] } = useFeaturedProducts();

  // Transform featured products to trending format, taking top 3
  const trendingProducts = featuredProducts.slice(0, 3).map((product, index) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price || product.price + 50,
    image: product.image,
    rating: product.rating || 4.5,
    reviews: product.reviews || 100,
    trend: `+${25 - index * 5}%`
  }));

  const handleProductClick = (productId: number) => {
    // Navigate to product detail page (you can implement this route later)
    console.log(`Navigate to product ${productId}`);
  };

  const handleViewAllTrending = () => {
    navigate('/deals');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Trending Now</h3>
          <p className="text-sm text-gray-600">Most searched products</p>
        </div>
      </div>

      <div className="space-y-4">
        {trendingProducts.length > 0 ? (
          trendingProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop";
                  }}
                />
                <Badge className="absolute -top-1 -left-1 bg-orange-500 text-white text-xs px-1 py-0 min-w-5 h-5">
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h4>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{product.rating}</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
                    {product.trend}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-blue-600 text-sm">${product.price}</span>
                  <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Loading trending products...</p>
          </div>
        )}
      </div>

      <Button 
        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        onClick={handleViewAllTrending}
      >
        View All Trending
      </Button>
    </div>
  );
};

export default TrendingCarousel;
