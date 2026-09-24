import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Eye, Zap, Truck, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    stock?: number;
  };
  /** Only Flash Deal cards show Add to Cart */
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCart = false }) => {
  const { mutate: addToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistItems } = useWishlist();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [productImage, setProductImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  const isInWishlist = wishlistItems?.some(item => item.product_id === product.id) || false;

  useEffect(() => {
    loadProductImage();
  }, [product.id, product.image]);

  const loadProductImage = async () => {
    try {
      setImageLoading(true);
      console.log('Loading image for product:', product.id);
      
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
          if (product.image && product.image.includes('http')) {
            console.log('Using product image URL:', product.image);
            setProductImage(product.image);
          } else {
            console.log('No images found, using placeholder');
            setProductImage('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop');
          }
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
          i < Math.floor(rating) ? 'text-rating fill-current' : 'text-muted'
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

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      navigate('/auth');
      return;
    }
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const stockLabel = (() => {
    if (product.stock === undefined) return null;
    if (product.stock <= 0) return { text: 'Out of stock', tone: 'text-destructive' };
    if (product.stock <= 5) return { text: `Only ${product.stock} left`, tone: 'text-warning' };
    return { text: 'In stock', tone: 'text-success' };
  })();

  return (
    <div className="bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group relative overflow-hidden transform hover:-translate-y-1">
      {/* Enhanced discount badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10">
          {product.isFlash ? (
            <div className="flex flex-col space-y-1">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm animate-badge-pop">
                <Zap className="w-3 h-3 mr-1" />
                FLASH
              </div>
              <span className="bg-gradient-to-r from-success to-success/80 text-success-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                {product.discount}
              </span>
            </div>
          ) : product.discount === "NEW" ? (
            <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm animate-badge-pop">
              {product.discount}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-warning to-warning/80 text-warning-foreground px-2 py-1 rounded-full text-xs font-bold shadow-sm animate-badge-pop">
              {product.discount}
            </span>
          )}
        </div>
      )}

      {/* Quick action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button
          onClick={handleAddToWishlist}
          className={`rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 ${
            isInWishlist
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background/90 backdrop-blur-sm hover:bg-background text-muted-foreground hover:text-destructive'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={handleQuickView}
          className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-background hover:scale-110 transition-all duration-200"
        >
          <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </button>
      </div>

      {/* Product image */}
      <div
        className="aspect-square bg-muted/40 relative overflow-hidden rounded-t-xl cursor-pointer"
        onClick={handleProductClick}
      >
        {imageLoading ? (
          <div className="w-full h-full animate-shimmer" />
        ) : (
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.log('Image failed to load, using fallback:', productImage);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
            }}
            onLoad={() => {
              console.log('Successfully loaded product image:', productImage);
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Product info */}
      <div className="p-5">
        <h3
          className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors text-sm leading-relaxed cursor-pointer"
          onClick={handleProductClick}
          title={product.name}
        >
          {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-2 font-medium h-4">{product.brand ?? ' '}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{product.rating}/5</span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            {discountPercentage > 0 && (
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
                Save {discountPercentage}%
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              <span className="text-xs text-success font-medium">You save ${product.originalPrice - product.price}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
          <span className={`flex items-center gap-1 font-medium ${stockLabel?.tone ?? 'text-success'}`}>
            {stockLabel?.text === 'Out of stock' ? <PackageX className="w-3.5 h-3.5" /> : null}
            {stockLabel?.text ?? 'In stock'}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Truck className="w-3.5 h-3.5" />
            Delivery available
          </span>
        </div>
        {showAddToCart && (
          <Button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            disabled={product.stock !== undefined && product.stock <= 0}
            className="w-full mt-3 font-semibold"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
