
import React from 'react';
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MobileProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: string;
  isFlash?: boolean;
  countdownTimer?: string;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  discount,
  isFlash,
  countdownTimer
}) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist.`
    });
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Navigating to product:', id);
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative">
      {/* Product Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFlash && (
            <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
              <Zap className="w-3 h-3 mr-1" />
              FLASH
            </Badge>
          )}
          {discount && (
            <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-bold">
              {discount}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-lg"
          onClick={handleWishlist}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </Button>

      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleProductClick}
        >
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileProductCard;
