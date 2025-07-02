
import React from 'react';
import { Home, Grid3X3, Heart, User, ShoppingBag, Star, Zap } from 'lucide-react';
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

  const navItems = [
    { 
      icon: Home, 
      label: 'Shop', 
      path: '/', 
      key: 'shop',
      gradient: 'from-blue-500 to-purple-600',
      activeColor: 'text-blue-600 bg-blue-50'
    },
    { 
      icon: Grid3X3, 
      label: 'Categories', 
      path: '/categories', 
      key: 'categories',
      gradient: 'from-green-500 to-emerald-600',
      activeColor: 'text-green-600 bg-green-50'
    },
    { 
      icon: Heart, 
      label: 'Saved', 
      path: user ? '/wishlist' : '/auth', 
      key: 'saved',
      gradient: 'from-pink-500 to-rose-600',
      activeColor: 'text-pink-600 bg-pink-50'
    },
    { 
      icon: User, 
      label: 'Account', 
      path: user ? (isAdmin ? '/admin' : '/dashboard') : '/auth', 
      key: 'account',
      gradient: isAdmin ? 'from-red-500 to-pink-600' : 'from-purple-500 to-indigo-600',
      activeColor: isAdmin ? 'text-red-600 bg-red-50' : 'text-purple-600 bg-purple-50'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-[999] shadow-2xl h-16">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center justify-around py-1 px-2 h-full relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 via-transparent to-transparent pointer-events-none"></div>
        
        {navItems.map((item, index) => (
          <Link
            key={item.key}
            to={item.path}
            className={`relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-110 group ${
              isActive(item.path)
                ? `${item.activeColor} shadow-lg scale-105`
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {/* Active indicator */}
            {isActive(item.path) && (
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r ${item.gradient} rounded-full`}></div>
            )}
            
            {/* Icon container with gradient background for active state */}
            <div className={`relative mb-1 p-1 rounded-lg transition-all duration-300 ${
              isActive(item.path) 
                ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                : 'group-hover:bg-gray-100'
            }`}>
              <item.icon className={`w-4 h-4 transition-all duration-300 ${
                isActive(item.path) ? 'text-white' : 'text-current'
              }`} />
              
              {/* Pulse effect for active items */}
              {isActive(item.path) && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl animate-ping opacity-30`}></div>
              )}
            </div>
            
            <span className={`text-xs font-medium transition-all duration-300 ${
              isActive(item.path) ? 'font-bold' : 'group-hover:font-semibold'
            }`}>
              {item.label}
            </span>
            
            {/* Animated underline */}
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r ${item.gradient} transition-all duration-300 ${
              isActive(item.path) ? 'w-8' : 'w-0 group-hover:w-6'
            } rounded-full`}></div>
          </Link>
        ))}
        
        {/* Enhanced Cart button with special styling */}
        <button
          onClick={handleCartClick}
          className="relative flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-110 text-gray-600 hover:text-gray-800 hover:bg-gray-50 group"
        >
          {/* Special cart icon container */}
          <div className="relative mb-1 p-1 rounded-lg transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-600 group-hover:shadow-lg">
            <ShoppingBag className="w-4 h-4 transition-all duration-300 group-hover:text-white" />
            
            {/* Cart badge with enhanced styling */}
            {cartCount > 0 && (
              <>
                <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-4 h-4 flex items-center justify-center font-bold shadow-lg animate-pulse text-[10px]">
                  {cartCount}
                </Badge>
                {/* Pulsing ring effect */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-30"></div>
              </>
            )}
          </div>
          
          <span className="text-xs font-medium transition-all duration-300 group-hover:font-semibold">
            Cart
          </span>
          
          {/* Special cart glow effect when items present */}
          {cartCount > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-2xl animate-pulse"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
