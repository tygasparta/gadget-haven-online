import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useCartItems, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductColorSelector from '@/components/ProductColorSelector';
import ProductComparison from '@/components/ProductComparison';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';

const FALLBACK = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
const money = (n: number) => `$${n.toFixed(2)}`;

const Checkout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: cartItems = [], isLoading } = useCartItems();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [showComparison, setShowComparison] = useState(false);

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const subtotal = cartItems.reduce((t, i) => t + i.products.price * i.quantity, 0);
  const totalItems = cartItems.reduce((t, i) => t + i.quantity, 0);
  const savings = cartItems.reduce((s, i) => s + ((i.products.original_price || i.products.price) - i.products.price) * i.quantity, 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;

  const setQty = (id: string, q: number) => {
    if (q < 1) return;
    updateCartItem.mutate({ id, quantity: q });
  };

  const TopBar = (
    <div className="flex items-center gap-2 mb-4">
      <button onClick={() => navigate(-1)} aria-label="Back" className="h-10 w-10 -ml-2 grid place-items-center rounded-md hover:bg-muted">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg md:text-2xl font-bold text-foreground">Cart</h1>
        <p className="text-xs md:text-sm text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
      </div>
      {!isMobile && cartItems.length > 1 && (
        <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>Compare</Button>
      )}
    </div>
  );

  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-6">
          {TopBar}
          <div className="text-center py-16 border border-border rounded-lg">
            <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse deals and categories to find something you like.</p>
            <div className="mt-6 flex gap-2 justify-center">
              <Button onClick={() => navigate('/')}>Start shopping</Button>
              <Button variant="outline" onClick={() => navigate('/deals')}>View deals</Button>
            </div>
          </div>
        </div>
        {!isMobile && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8 pb-32 md:pb-8">
        {TopBar}
        <div className="mb-5 bg-background border border-border rounded-lg p-3">
          <CheckoutStepper steps={['Cart', 'Delivery & Payment', 'Confirmation']} currentStep={0} />
        </div>
        {showComparison && <ProductComparison />}

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 bg-background border border-border rounded-lg divide-y divide-border">
            {cartItems.map((item) => {
              const onSale = !!item.products.original_price && item.products.original_price > item.products.price;
              return (
                <article key={item.id} className="p-3 md:p-4">
                  <div className="flex gap-3">
                    <Link to={`/product/${item.products.id}`} className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md border border-border bg-background p-1.5">
                      <img
                        src={item.products.image || FALLBACK}
                        alt={item.products.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.src = FALLBACK; }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.products.id}`} className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {item.products.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-base font-bold text-foreground">{money(item.products.price)}</span>
                        {onSale && <span className="text-xs text-muted-foreground line-through">{money(item.products.original_price!)}</span>}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-md h-9">
                          <button aria-label="Decrease" className="w-9 h-full grid place-items-center disabled:opacity-40" disabled={item.quantity <= 1} onClick={() => setQty(item.id, item.quantity - 1)}>
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button aria-label="Increase" className="w-9 h-full grid place-items-center" onClick={() => setQty(item.id, item.quantity + 1)}>
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart.mutate(item.id)} className="h-9 px-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  {Array.isArray(item.products.colors) && item.products.colors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <ProductColorSelector
                        colors={item.products.colors}
                        selectedColor={selectedColors[item.id] || null}
                        onColorSelect={(c) => setSelectedColors((p) => ({ ...p, [item.id]: c }))}
                        size="sm"
                        showSelectedName
                        className="w-full"
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <aside className="space-y-3">
            <div className="bg-background border border-border rounded-lg p-4 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold mb-3">Order summary</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal ({totalItems})</dt><dd>{money(subtotal)}</dd></div>
                {savings > 0 && <div className="flex justify-between text-success"><dt>You save</dt><dd>-{money(savings)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted-foreground">Tax (2%)</dt><dd>{money(tax)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="text-muted-foreground">Chosen next</dd></div>
                <div className="flex justify-between pt-2 border-t border-border text-base font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
              </dl>
              <Button className="w-full mt-4 h-11 hidden md:flex" onClick={() => navigate('/checkout/details')}>Proceed to checkout</Button>
            </div>
            <ul className="bg-background border border-border rounded-lg p-4 space-y-3 text-sm">
              <li className="flex gap-3"><Truck className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={1.75} /><span><b className="font-medium">Free collection</b> at our shop, or $5.00 home delivery</span></li>
              <li className="flex gap-3"><ShieldCheck className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={1.75} /><span>Secure payment with PesePay or PayPal</span></li>
              <li className="flex gap-3"><RotateCcw className="w-[18px] h-[18px] text-primary shrink-0" strokeWidth={1.75} /><span>Easy returns on eligible items</span></li>
            </ul>
          </aside>
        </div>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border safe-area-pb">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Total</p>
            <p className="text-lg font-bold leading-tight">{money(total)}</p>
          </div>
          <Button className="flex-1 h-11" onClick={() => navigate('/checkout/details')}>Checkout</Button>
        </div>
      </div>

      {!isMobile && <Footer />}
    </div>
  );
};

export default Checkout;
