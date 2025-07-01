
import React from 'react';
import { Home, Grid3X3, Heart, User, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const MobileNavigation = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { icon: Home, label: 'Shop', path: '/', key: 'shop' },
    { icon: Grid3X3, label: 'Categories', path: '/categories', key: 'categories' },
    { icon: Heart, label: 'Saved', path: user ? '/wishlist' : '/auth', key: 'saved' },
    { icon: User, label: 'Account', path: user ? '/dashboard' : '/auth', key: 'account' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCartClick = () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Cart button with badge */}
        <button
          onClick={handleCartClick}
          className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-600 hover:text-blue-600 relative"
        >
          <ShoppingBag className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Cart</span>
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
              {cartCount}
            </Badge>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
