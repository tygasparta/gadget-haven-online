import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';
import SearchAutocomplete from './SearchAutocomplete';

const MobileHeader = () => {
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  const navigate = useNavigate();
  const [focusSearchSignal, setFocusSearchSignal] = useState(0);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleFocusSearch = () => {
      searchWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFocusSearchSignal((n) => n + 1);
    };
    window.addEventListener('focusSearch', handleFocusSearch);
    return () => window.removeEventListener('focusSearch', handleFocusSearch);
  }, []);

  const handleCartClick = () => {
    window.dispatchEvent(new Event('openCart'));
  };

  return (
    <div className="md:hidden">
      <div className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link to="/" className="flex items-center">
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-bold text-xs">G</span>
            </div>
            <h1 className="text-base font-bold text-primary">GadgetGenie</h1>
          </Link>

          <div className="flex items-center space-x-1">
            {user ? (
              <button onClick={() => navigate('/wishlist')} className="p-2 text-muted-foreground">
                <Heart className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="p-2 text-muted-foreground">
                <User className="w-5 h-5" />
              </button>
            )}

            <button onClick={handleCartClick} className="p-2 text-muted-foreground relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold animate-badge-pop">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar always visible */}
        <div ref={searchWrapperRef} className="px-3 pb-2.5">
          <SearchAutocomplete variant="mobile" autoFocus={focusSearchSignal} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
