
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const MobileTopDeals = () => {
  const { data: products = [] } = useProducts();
  const { user } = useAuthContext();
  const { mutate: addToCart } = useAddToCart();
  const navigate = useNavigate();

  const topDeals = products
    .filter(product => product.is_flash_sale || product.discount_percentage > 0)
    .slice(0, 4);

  const handleAddToCart = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    addToCart({ productId });
  };

  const handleProductClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to product:', productId);
    navigate(`/product/${productId}`);
  };

  const handleSeeAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/deals');
  };

  if (topDeals.length === 0) return null;

  return (
    <div className="md:hidden bg-white rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Top Deals</h3>
        <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700" onClick={handleSeeAll}>
          See all
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {topDeals.map((product) => (
          <div 
            key={product.id} 
            className="bg-gray-50 rounded-xl p-3 relative cursor-pointer hover:shadow-md transition-shadow"
            onClick={(e) => handleProductClick(product.id, e)}
          >
            {product.discount_percentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-destructive text-white text-xs px-2 py-1 rounded-full z-10">
                {product.discount_percentage}% OFF
              </Badge>
            )}
            
            <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"; }}
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-sky-600 transition-colors"
                onClick={(e) => handleProductClick(product.id, e)}>
                {product.name}
              </h4>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-rating fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-sky-600">${product.price}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xs text-gray-500 line-through">${product.original_price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTopDeals;
