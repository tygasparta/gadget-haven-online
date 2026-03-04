import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';

const MobileHeader = () => {
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link to="/" className="flex items-center">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-bold text-xs">G</span>
            </div>
            <h1 className="text-base font-bold text-primary">GadgetGenie</h1>
          </Link>

          <div className="flex items-center space-x-1">
            {user ? (
              <button onClick={() => navigate('/wishlist')} className="p-2 text-gray-600">
                <Heart className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="p-2 text-gray-600">
                <User className="w-5 h-5" />
              </button>
            )}
            
            <button onClick={handleCartClick} className="p-2 text-gray-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar always visible */}
        <div className="px-3 pb-2.5">
          <form onSubmit={handleSearch} className="relative flex">
            <Input
              type="text"
              placeholder="Search for products, brands..."
              className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-l-sm rounded-r-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="submit" 
              size="sm"
              className="rounded-l-none rounded-r-sm px-3 bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
