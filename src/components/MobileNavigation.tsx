
import React from 'react';
import { Home, Grid3X3, Heart, User, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import { useUserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/badge';

const MobileNavigation = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const { isAdmin } = useUserRole();
  const { data: cartItems = [] } = useCartItems();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const accountPath = user ? '/dashboard' : '/auth';

  const navItems = [
    { icon: Home, label: 'Shop', path: '/', key: 'shop' },
    { icon: Grid3X3, label: 'Categories', path: '/categories', key: 'categories' },
    { icon: Heart, label: 'Saved', path: user ? '/wishlist' : '/auth', key: 'saved' },
    { icon: User, label: 'Account', path: accountPath, key: 'account' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-blue-100 z-[50] shadow-2xl h-16">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700"></div>
      
      <div className="flex items-center justify-around py-1 px-2 h-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 via-transparent to-transparent pointer-events-none"></div>
        
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-110 group ${
              isActive(item.path)
                ? 'text-blue-600 bg-blue-50 shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {isActive(item.path) && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
            )}
            
            <div className={`relative mb-1 p-1 rounded-lg transition-all duration-300 ${
              isActive(item.path) 
                ? 'bg-blue-600 shadow-lg' 
                : 'group-hover:bg-gray-100'
            }`}>
              <item.icon className={`w-4 h-4 transition-all duration-300 ${
                isActive(item.path) ? 'text-white' : 'text-current'
              }`} />
              
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-blue-600 rounded-xl animate-ping opacity-30"></div>
              )}
            </div>
            
            <span className={`text-xs font-medium transition-all duration-300 ${
              isActive(item.path) ? 'font-bold' : 'group-hover:font-semibold'
            }`}>
              {item.label}
            </span>
          </Link>
        ))}
        
        <button
          onClick={handleCartClick}
          className="relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-110 text-gray-600 hover:text-gray-800 hover:bg-gray-50 group"
        >
          <div className="relative mb-1 p-1 rounded-lg transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg">
            <ShoppingBag className="w-4 h-4 transition-all duration-300 group-hover:text-white" />
            
            {cartCount > 0 && (
              <>
                <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse text-[10px]">
                  {cartCount}
                </Badge>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30"></div>
              </>
            )}
          </div>
          
          <span className="text-xs font-medium transition-all duration-300 group-hover:font-semibold">
            Cart
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
