import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  User, Package, Heart, CreditCard, MapPin, Bell, Shield, LogOut, ChevronRight, HelpCircle, Truck,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderStatusBadge from '@/components/OrderStatusBadge';

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: orders = [] } = useOrders();
  const { data: wishlistItems = [] } = useWishlist();

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const name = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'there';
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const active = orders.filter((o) => !['completed', 'delivered', 'cancelled'].includes(o.status || '')).length;

  const groups = [
    {
      title: 'Shopping',
      items: [
        { label: 'My orders', icon: Package, to: '/orders', meta: orders.length ? String(orders.length) : '' },
        { label: 'Track an order', icon: Truck, to: '/track-order' },
        { label: 'Wishlist', icon: Heart, to: '/wishlist', meta: wishlistItems.length ? String(wishlistItems.length) : '' },
      ],
    },
    {
      title: 'Account settings',
      items: [
        { label: 'Profile details', icon: User, to: '/profile' },
        { label: 'Addresses', icon: MapPin, to: '/addresses' },
        { label: 'Payment methods', icon: CreditCard, to: '/payment-methods' },
        { label: 'Notifications', icon: Bell, to: '/notifications' },
      ],
    },
    {
      title: 'Support',
      items: [{ label: 'Help centre', icon: HelpCircle, to: '/help' }],
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-8 space-y-4">
        {/* Profile */}
        <section className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          {avatar ? (
            <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground grid place-items-center text-xl font-semibold">
              {name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Hello,</p>
            <h1 className="text-lg font-bold text-foreground truncate capitalize">{name}</h1>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={() => navigate('/admin')} className="shrink-0">
              <Shield className="w-4 h-4 mr-1.5" /> Admin
            </Button>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 bg-background border border-border rounded-lg divide-x divide-border text-center">
          <Link to="/orders" className="py-3"><p className="text-lg font-bold">{orders.length}</p><p className="text-[11px] text-muted-foreground">Orders</p></Link>
          <Link to="/orders" className="py-3"><p className="text-lg font-bold">{active}</p><p className="text-[11px] text-muted-foreground">In progress</p></Link>
          <Link to="/wishlist" className="py-3"><p className="text-lg font-bold">{wishlistItems.length}</p><p className="text-[11px] text-muted-foreground">Saved</p></Link>
        </section>

        {/* Recent orders */}
        {orders.length > 0 && (
          <section className="bg-background border border-border rounded-lg">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <h2 className="text-sm font-semibold">Recent orders</h2>
              <Link to="/orders" className="text-xs font-medium text-primary">See all</Link>
            </div>
            <ul className="divide-y divide-border">
              {orders.slice(0, 3).map((o) => (
                <li key={o.id}>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">#{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · ${Number(o.total_amount).toFixed(2)}</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Menu */}
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</h2>
            <ul className="bg-background border border-border rounded-lg divide-y divide-border">
              {g.items.map((i) => (
                <li key={i.label}>
                  <Link to={i.to} className="flex items-center gap-3 px-4 h-12 hover:bg-muted/50">
                    <i.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
                    <span className="flex-1 text-sm text-foreground">{i.label}</span>
                    {'meta' in i && i.meta && <span className="text-xs text-muted-foreground">{i.meta}</span>}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <button onClick={handleLogout} className="w-full h-12 flex items-center justify-center gap-2 bg-background border border-border rounded-lg text-sm font-medium text-destructive">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
      {!isMobile && <Footer />}
    </div>
  );
};

export default Dashboard;
