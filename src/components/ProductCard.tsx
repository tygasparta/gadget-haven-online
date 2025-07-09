
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    brand?: string;
    discount?: string;
    isFlash?: boolean;
    countdownTimer?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { mutate: addToCart } = useAddToCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    loadProductImage();
  }, [product.id, product.image]);

  const loadProductImage = async () => {
    try {
      setImageLoading(true);
      console.log('Loading image for product:', product.id, 'with image filename:', product.image);
      
      // First, try to load from product-images bucket using the filename
      if (product.image && !product.image.includes('http')) {
        // If product.image is just a filename, construct the full URL from product-images bucket
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(product.image);
        
        if (data?.publicUrl) {
          console.log('Using product-images bucket URL:', data.publicUrl);
          setProductImage(data.publicUrl);
          return;
        }
      }
      
      // If product.image is already a full URL, use it directly
      if (product.image && product.image.includes('http')) {
        console.log('Using direct URL:', product.image);
        setProductImage(product.image);
        return;
      }
      
      // Fallback: try to get from gallery for this product
      const { data: galleryData, error } = await supabase
        .from('product_galleries')
        .select('image_url')
        .eq('product_id', product.id)
        .eq('is_main', true)
        .single();

      if (!error && galleryData?.image_url) {
        console.log('Found main gallery image:', galleryData.image_url);
        setProductImage(galleryData.image_url);
      } else {
        // Final fallback: try first gallery image
        const { data: firstImage, error: firstError } = await supabase
          .from('product_galleries')
          .select('image_url')
          .eq('product_id', product.id)
          .order('display_order')
          .limit(1)
          .single();

        if (!firstError && firstImage?.image_url) {
          console.log('Found first gallery image:', firstImage.image_url);
          setProductImage(firstImage.image_url);
        } else {
          // Use generic placeholder as last resort
          console.log('No images found, using placeholder');
          setProductImage('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop');
        }
      }
    } catch (error) {
      console.error('Error loading product image:', error);
      setProductImage('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop');
    } finally {
      setImageLoading(false);
    }
  };

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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({ productId: product.id });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group relative overflow-hidden transform hover:-translate-y-1">
      {/* Enhanced discount badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10">
          {product.isFlash ? (
            <div className="flex flex-col space-y-1">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                FLASH
              </div>
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                {product.discount}
              </span>
            </div>
          ) : product.discount === "NEW" ? (
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.discount}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.discount}
            </span>
          )}
        </div>
      )}

      {/* Quick action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
          <Heart className="w-4 h-4 text-gray-600 hover:text-blue-500" />
        </button>
        <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
          <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
        </button>
      </div>

      {/* Product image with enhanced styling */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-xl">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.log('Image failed to load, using fallback:', productImage);
              // Use a generic placeholder for failed images
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
            }}
            onLoad={() => {
              console.log('Successfully loaded product image:', productImage);
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Enhanced product info */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-relaxed">
          {product.name}
        </h3>
        
        {/* Brand display */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2 font-medium">
            {product.brand}
          </p>
        )}

        {/* Enhanced rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {product.rating}/5
          </span>
        </div>

        {/* Enhanced price with savings */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {discountPercentage > 0 && (
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Save {discountPercentage}%
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-xs text-green-600 font-medium">
                You save ${product.originalPrice - product.price}
              </span>
            </div>
          )}
        </div>

        {/* Compact countdown timer */}
        {product.countdownTimer && (
          <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-blue-600 font-medium flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Sale Ends:
              </span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono font-bold">
                {product.countdownTimer}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Enhanced add to cart button */}
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
