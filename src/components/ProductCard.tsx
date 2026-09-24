import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
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
    <div className="bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200 group relative overflow-hidden flex flex-col">
      {discountPercentage > 0 ? (
        <span className="absolute top-2.5 left-2.5 z-10 bg-destructive text-destructive-foreground text-[11px] font-semibold leading-none px-1.5 py-1 rounded-[3px]">
          -{discountPercentage}%
        </span>
      ) : product.discount === 'NEW' ? (
        <span className="absolute top-2.5 left-2.5 z-10 bg-foreground text-background text-[10px] font-semibold uppercase tracking-[0.04em] leading-none px-1.5 py-1 rounded-[3px]">
          New
        </span>
      ) : null}

      <button
        onClick={handleAddToWishlist}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-background/90 hover:bg-background transition-colors"
      >
        <Heart
          className={`w-[18px] h-[18px] ${isInWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
          strokeWidth={1.5}
        />
      </button>

      <div className="aspect-square bg-background relative overflow-hidden cursor-pointer" onClick={handleProductClick}>
        {imageLoading ? (
          <div className="w-full h-full animate-shimmer" />
        ) : (
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-[1.03] transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
            }}
          />
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 border-t border-border">
        {product.brand && <p className="text-[11px] uppercase tracking-[0.04em] text-muted-foreground mb-1">{product.brand}</p>}
        <h3
          className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
          onClick={handleProductClick}
          title={product.name}
        >
          {product.name}
        </h3>

        {(product.reviews ?? 0) > 0 ? (
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 text-rating fill-current" strokeWidth={1.5} />
          <span className="text-xs font-medium text-foreground">{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1.5">No reviews yet</p>
        )}

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-foreground">${product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>

        <p className={`text-xs mt-1 ${stockLabel?.tone ?? 'text-success'}`}>{stockLabel?.text ?? 'In stock'}</p>

        {showAddToCart && (
          <Button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            disabled={product.stock !== undefined && product.stock <= 0}
            className="w-full mt-3 font-semibold rounded-md"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" strokeWidth={1.75} />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
