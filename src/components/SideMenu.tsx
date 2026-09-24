import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, LayoutGrid, Tag, Sparkles, Smartphone, Laptop, Gamepad2, Headphones, Watch,
  Package, Heart, MapPin, HelpCircle, LogOut, LogIn, ChevronRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAuthContext } from '@/contexts/AuthContext';

const shop = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'All Categories', to: '/categories', icon: LayoutGrid },
  { label: 'Deals', to: '/deals', icon: Tag },
  { label: 'New Arrivals', to: '/products?filter=new-arrivals', icon: Sparkles },
  { label: 'Smartphones', to: '/products?category=smartphones', icon: Smartphone },
  { label: 'Laptops', to: '/products?category=laptops', icon: Laptop },
  { label: 'Gaming', to: '/products?category=gaming', icon: Gamepad2 },
  { label: 'Audio', to: '/products?category=audio', icon: Headphones },
  { label: 'Wearables', to: '/products?category=wearables', icon: Watch },
];

const account = [
  { label: 'My Orders', to: '/orders', icon: Package },
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Addresses', to: '/addresses', icon: MapPin },
  { label: 'Help Centre', to: '/help', icon: HelpCircle },
];

const Row = ({ item, onClick }: { item: typeof shop[number]; onClick: () => void }) => (
  <Link to={item.to} onClick={onClick} className="flex items-center gap-3 h-11 px-5 text-sm text-foreground active:bg-muted">
    <item.icon className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.75} />
    <span className="flex-1">{item.label}</span>
    <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
  </Link>
);

const SideMenu = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const close = () => onOpenChange(false);
  const name = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[86vw] max-w-[340px] p-0 overflow-y-auto">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="px-5 pt-6 pb-5 border-b border-border safe-area-pt">
          <p className="text-lg font-bold tracking-tight">Gadget <span className="text-primary">Genie</span></p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Tech for a smarter tomorrow</p>
          {user ? (
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-semibold uppercase">
                {name?.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link to="/auth" onClick={close} className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium">
              <LogIn className="w-4 h-4" /> Sign in
            </Link>
          )}
        </div>
        <nav className="py-2">
          <p className="px-5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shop</p>
          {shop.map((i) => <Row key={i.label} item={i} onClick={close} />)}
          <p className="px-5 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
          {account.map((i) => <Row key={i.label} item={i} onClick={close} />)}
          {user && (
            <button
              onClick={async () => { close(); await signOut(); navigate('/'); }}
              className="flex items-center gap-3 h-11 px-5 w-full text-sm text-destructive"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} /> Sign out
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
