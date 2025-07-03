
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Wishlist = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Mock wishlist data - in a real app, this would come from a database
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 1199,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 1250,
      inStock: true
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      price: 2499,
      originalPrice: 2699,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 890,
      inStock: true
    },
    {
      id: 3,
      name: 'AirPods Pro',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 2100,
      inStock: false
    }
  ]);

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{wishlistItems.length} items saved</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to buy them later</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
                      }}
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    {item.originalPrice > item.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex">{renderStars(item.rating)}</div>
                      <span className="text-sm text-gray-500 ml-2">({item.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm font-medium ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        item.inStock 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
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
      <MobileNavigation />
    </div>
  );
};

export default Wishlist;
