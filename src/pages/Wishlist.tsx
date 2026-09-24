
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';

const Wishlist = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: wishlistItems, isLoading: wishlistLoading } = useWishlist();
  const { data: products } = useProducts();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { mutate: addToCart } = useAddToCart();

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Get products that are in the wishlist
  const wishlistProducts = products?.filter(product => 
    wishlistItems?.some(item => item.product_id === product.id)
  ) || [];

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId: number) => {
    addToCart({ productId });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-rating fill-current' : 'text-muted-foreground/50'
        }`}
      />
    ));
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-destructive mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">{wishlistProducts.length} items saved</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save items you love to buy them later</p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                      }}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                    {product.original_price && product.original_price > product.price && (
                      <div className="absolute top-3 left-3 bg-destructive text-white px-2 py-1 rounded-full text-sm font-bold">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex">{renderStars(product.rating || 0)}</div>
                      <span className="text-sm text-muted-foreground ml-2">({product.reviews || 0})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm font-medium ${product.stock && product.stock > 0 ? 'text-success' : 'text-destructive'}`}>
                        {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        product.stock && product.stock > 0
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-muted-foreground/40 cursor-not-allowed'
                      }`}
                      disabled={!product.stock || product.stock === 0}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Desktop Only */}
      {!isMobile && <Footer />}
      
      {/* Mobile Navigation - Always visible on mobile */}
    </div>
  );
};

export default Wishlist;
