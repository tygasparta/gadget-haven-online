
import React from 'react';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const MobileNavigation = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const accountPath = user ? '/dashboard' : '/auth';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  const handleSearchClick = () => {
    window.dispatchEvent(new Event('focusSearch'));
  };

  const isSearchActive = location.pathname.startsWith('/search');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-[50] shadow-lg h-16 safe-area-pb">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/60" />

      <div className="flex items-center justify-around px-2 h-full relative">
        <Link
          to="/"
          className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-colors duration-200 group ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isActive('/') && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
          <Home className="w-5 h-5 mb-0.5" />
          <span className={`text-[11px] ${isActive('/') ? 'font-semibold' : 'font-medium'}`}>Home</span>
        </Link>

        <button
          onClick={handleSearchClick}
          className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-colors duration-200 ${
            isSearchActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isSearchActive && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
          <Search className="w-5 h-5 mb-0.5" />
          <span className={`text-[11px] ${isSearchActive ? 'font-semibold' : 'font-medium'}`}>Search</span>
        </button>

        <Link
          to={user ? '/wishlist' : '/auth'}
          className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-colors duration-200 ${
            isActive('/wishlist') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isActive('/wishlist') && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
          <Heart className="w-5 h-5 mb-0.5" />
          <span className={`text-[11px] ${isActive('/wishlist') ? 'font-semibold' : 'font-medium'}`}>Wishlist</span>
        </Link>

        <button
          onClick={handleCartClick}
          className="relative flex flex-col items-center py-2 px-2 rounded-xl transition-colors duration-200 text-muted-foreground hover:text-foreground"
        >
          <div className="relative mb-0.5">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] px-1 py-0 rounded-full min-w-4 h-4 flex items-center justify-center font-bold animate-badge-pop">
                {cartCount}
              </Badge>
            )}
          </div>
          <span className="text-[11px] font-medium">Cart</span>
        </button>

        <Link
          to={accountPath}
          className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-colors duration-200 ${
            isActive(accountPath) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isActive(accountPath) && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
          <User className="w-5 h-5 mb-0.5" />
          <span className={`text-[11px] ${isActive(accountPath) ? 'font-semibold' : 'font-medium'}`}>Account</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
