import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ArrowLeft, Package, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrders } from '@/hooks/useOrders';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderStatusBadge from '@/components/OrderStatusBadge';

const FALLBACK = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'In progress' },
  { key: 'done', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];
const DONE = ['completed', 'delivered'];
const CANCELLED = ['cancelled', 'failed'];

const Address = ({ label, a }: { label: string; a: any }) => {
  if (!a || typeof a !== 'object') return null;
  const name = a.name || [a.firstName, a.lastName].filter(Boolean).join(' ');
  const street = a.street || a.address;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</h4>
      <p className="text-sm">{name}</p>
      {street && <p className="text-sm text-muted-foreground">{street}</p>}
      <p className="text-sm text-muted-foreground">{[a.city, a.zipCode, a.country].filter(Boolean).join(', ')}</p>
      {a.phone && <p className="text-sm text-muted-foreground">{a.phone}</p>}
    </div>
  );
};

const Orders = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: orders = [], isLoading, isFetching, refetch } = useOrders();
  const [selected, setSelected] = React.useState<any>(null);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const filtered = orders.filter((o) => {
    const s = o.status || 'pending';
    if (filter === 'done') return DONE.includes(s);
    if (filter === 'cancelled') return CANCELLED.includes(s);
    if (filter === 'active') return !DONE.includes(s) && !CANCELLED.includes(s);
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate('/dashboard')} aria-label="Back" className="h-10 w-10 -ml-2 grid place-items-center rounded-md hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg md:text-2xl font-bold text-foreground">My orders</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{orders.length} total</p>
          </div>
          <button onClick={() => refetch()} aria-label="Refresh" className="h-10 w-10 grid place-items-center rounded-md hover:bg-muted">
            <RefreshCw className={`w-[18px] h-[18px] ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex gap-5 border-b border-border mb-4 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`pb-2 text-sm whitespace-nowrap border-b-2 -mb-px ${filter === f.key ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-background border border-border rounded-lg">
            <Package className="w-10 h-10 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold">{orders.length ? 'No orders here' : 'No orders yet'}</h2>
            <p className="text-sm text-muted-foreground mt-1">Orders you place will show up here.</p>
            <Button className="mt-6" onClick={() => navigate('/')}>Start shopping</Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((o) => {
              const items = o.order_items || [];
              const count = items.reduce((t: number, i: any) => t + i.quantity, 0);
              return (
                <li key={o.id} className="bg-background border border-border rounded-lg">
                  <button onClick={() => setSelected(o)} className="w-full text-left p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">#{o.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {items.slice(0, 4).map((i: any, idx: number) => (
                        <div key={idx} className="w-12 h-12 rounded-md border border-border p-1 bg-background">
                          <img src={i.products?.image || FALLBACK} alt={i.products?.name || ''} loading="lazy" className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.src = FALLBACK; }} />
                        </div>
                      ))}
                      {items.length > 4 && <span className="text-xs text-muted-foreground">+{items.length - 4}</span>}
                      <ChevronRight className="ml-auto w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{count} {count === 1 ? 'item' : 'items'}</span>
                      <span className="font-bold">${Number(o.total_amount).toFixed(2)}</span>
                    </div>
                  </button>
                  <div className="flex border-t border-border divide-x divide-border">
                    <button onClick={() => navigate(`/track-order?orderId=${o.id}`)} className="flex-1 h-11 text-sm font-medium text-primary">Track order</button>
                    {o.status === 'pending' && (
                      <button onClick={() => navigate('/contact')} className="flex-1 h-11 text-sm text-muted-foreground">Need help?</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent side={isMobile ? 'bottom' : 'right'} className={`overflow-y-auto ${isMobile ? 'max-h-[88vh] rounded-t-xl' : 'w-full sm:max-w-md'}`}>
          {selected && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>Order #{selected.id.slice(-8).toUpperCase()}</SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <OrderStatusBadge status={selected.status} />
                <span>Placed {new Date(selected.created_at).toLocaleString()}</span>
              </div>

              <ul className="mt-4 divide-y divide-border border-y border-border">
                {(selected.order_items || []).map((i: any) => (
                  <li key={i.id} className="flex gap-3 py-3">
                    <div className="w-14 h-14 shrink-0 rounded-md border border-border p-1">
                      <img src={i.products?.image || FALLBACK} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{i.products?.name || 'Product'}</p>
                      <p className="text-xs text-muted-foreground">Qty {i.quantity} × ${Number(i.price).toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-medium">${(Number(i.price) * i.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Payment</dt><dd className="capitalize">{selected.payment_method || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{selected.shipping_method === 'shipping' ? 'Home delivery' : 'Collect at shop'}</dd></div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><dt>Total</dt><dd>${Number(selected.total_amount).toFixed(2)}</dd></div>
              </dl>

              <div className="mt-5 space-y-4">
                <Address label="Delivery address" a={selected.shipping_address} />
                <Address label="Billing address" a={selected.billing_address} />
              </div>

              <Button className="w-full h-11 mt-6" onClick={() => navigate(`/track-order?orderId=${selected.id}`)}>Track this order</Button>
            </>
          )}
        </SheetContent>
      </Sheet>

      {!isMobile && <Footer />}
    </div>
  );
};

export default Orders;
