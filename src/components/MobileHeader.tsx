
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';

const MobileHeader = () => {
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden">
      {/* Main Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 transform group-hover:scale-110 transition-all duration-300 shadow-lg animate-pulse hover:animate-none">
              <span className="text-white font-bold text-sm drop-shadow-lg">G</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GadgetGenie
            </h1>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/wishlist')}
                className="p-2"
              >
                <Heart className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="p-2"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="p-2 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="px-4 pb-3 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2 bg-white border-gray-200 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit" 
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
