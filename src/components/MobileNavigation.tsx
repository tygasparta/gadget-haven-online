import React from 'react';
import { Home, LayoutGrid, Tag, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartItems } from '@/hooks/useCart';

const HIDDEN = ['/admin', '/checkout', '/product/'];

const MobileNavigation = () => {
  const { pathname } = useLocation();
  const { user } = useAuthContext();
  const { data: cartItems = [] } = useCartItems();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (HIDDEN.some((p) => pathname.startsWith(p))) return null;

  const accountPath = user ? '/dashboard' : '/auth';
  const items = [
    { label: 'Home', to: '/', icon: Home, active: pathname === '/' },
    { label: 'Categories', to: '/categories', icon: LayoutGrid, active: pathname.startsWith('/categories') || pathname.startsWith('/products') },
    { label: 'Deals', to: '/deals', icon: Tag, active: pathname.startsWith('/deals') },
  ];
  const accountActive = ['/dashboard', '/profile', '/auth', '/orders', '/wishlist', '/addresses'].some((p) => pathname.startsWith(p));

  const cls = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-1 h-full text-[11px] ${active ? 'text-primary font-semibold' : 'text-muted-foreground font-medium'}`;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border safe-area-pb" aria-label="Main">
      <div className="flex h-16">
        {items.map((i) => (
          <Link key={i.label} to={i.to} className={cls(i.active)} aria-current={i.active ? 'page' : undefined}>
            <i.icon className="w-[22px] h-[22px]" strokeWidth={i.active ? 2.1 : 1.75} />
            {i.label}
          </Link>
        ))}
        <button onClick={() => window.dispatchEvent(new Event('openCart'))} className={cls(false)}>
          <span className="relative">
            <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center">
                {cartCount}
              </span>
            )}
          </span>
          Cart
        </button>
        <Link to={accountPath} className={cls(accountActive)}>
          <User className="w-[22px] h-[22px]" strokeWidth={accountActive ? 2.1 : 1.75} />
          Account
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
