import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Menu, ChevronLeft, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartItems } from '@/hooks/useCart';
import SearchAutocomplete from './SearchAutocomplete';
import SideMenu from './SideMenu';

const ROOT_PATHS = ['/', '/categories', '/deals', '/dashboard', '/profile', '/auth'];

const MobileHeader = () => {
  const { data: cartItems = [] } = useCartItems();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusSearchSignal, setFocusSearchSignal] = useState(0);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const isRoot = ROOT_PATHS.includes(pathname);
  const showSearch = pathname === '/' || pathname.startsWith('/search') || pathname.startsWith('/products');
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleFocusSearch = () => {
      searchWrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFocusSearchSignal((n) => n + 1);
    };
    window.addEventListener('focusSearch', handleFocusSearch);
    return () => window.removeEventListener('focusSearch', handleFocusSearch);
  }, []);

  return (
    <header className="md:hidden sticky top-0 z-50 bg-background border-b border-border safe-area-pt">
      <div className="flex items-center gap-1 h-14 px-2">
        {isRoot ? (
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="h-10 w-10 grid place-items-center text-foreground">
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>
        ) : (
          <button onClick={() => navigate(-1)} aria-label="Go back" className="h-10 w-10 grid place-items-center text-foreground">
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
        )}

        <Link to="/" className="flex-1 min-w-0 leading-none">
          <span className="block text-[17px] font-bold tracking-tight text-foreground">
            Gadget <span className="text-primary">Genie</span>
          </span>
          <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground mt-1 truncate">
            Tech for a smarter tomorrow
          </span>
        </Link>

        {!showSearch && (
          <button onClick={() => navigate('/search')} aria-label="Search" className="h-10 w-10 grid place-items-center text-foreground">
            <Search className="w-5 h-5" strokeWidth={1.75} />
          </button>
        )}
        <button
          onClick={() => window.dispatchEvent(new Event('openCart'))}
          aria-label={`Cart, ${cartCount} items`}
          className="relative h-10 w-10 grid place-items-center text-foreground"
        >
          <ShoppingCart className="w-5 h-5" strokeWidth={1.75} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {showSearch && (
        <div ref={searchWrapperRef} className="px-3 pb-3">
          <SearchAutocomplete variant="mobile" autoFocus={focusSearchSignal} />
        </div>
      )}

      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  );
};

export default MobileHeader;
