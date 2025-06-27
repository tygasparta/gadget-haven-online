
import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
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
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Discount badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 z-10">
          {product.isFlash ? (
            <div className="flex flex-col space-y-1">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                FLASH
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                {product.discount}
              </span>
            </div>
          ) : (
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
              {product.discount}
            </span>
          )}
        </div>
      )}

      {/* Wishlist button */}
      <button className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
      </button>

      {/* Product image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-3">
          <span className="text-xl font-bold text-blue-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Countdown timer for flash sales */}
        {product.countdownTimer && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-500 font-medium">Ends in:</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-mono">
                {product.countdownTimer}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div className="bg-red-500 h-1 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Add to cart button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
