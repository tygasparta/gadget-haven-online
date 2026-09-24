import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Heart, Star, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';

const FALLBACK = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';

const Wishlist = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: wishlistItems, isLoading } = useWishlist();
  const { data: products } = useProducts();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { mutate: addToCart, isPending } = useAddToCart();

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const items = products?.filter((p) => wishlistItems?.some((w) => w.product_id === p.id)) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} aria-label="Back" className="h-10 w-10 -ml-2 grid place-items-center rounded-md hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-foreground">Wishlist</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg">
            <Heart className="w-10 h-10 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-semibold">Nothing saved yet</h2>
            <p className="text-sm text-muted-foreground mt-1">Tap the heart on any product to keep it here.</p>
            <Button className="mt-6" onClick={() => navigate('/categories')}>Browse categories</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((p) => {
              const inStock = !!p.stock && p.stock > 0;
              const discount = p.original_price && p.original_price > p.price
                ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;
              return (
                <article key={p.id} className="flex flex-col border border-border rounded-lg overflow-hidden bg-background">
                  <div className="relative aspect-square bg-background p-3">
                    <Link to={`/product/${p.id}`}>
                      <img src={p.image || FALLBACK} alt={p.name} loading="lazy" className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.src = FALLBACK; }} />
                    </Link>
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[11px] font-semibold px-1.5 py-0.5 rounded-sm">-{discount}%</span>
                    )}
                    <button onClick={() => removeFromWishlist(p.id)} aria-label="Remove from wishlist"
                      className="absolute top-1.5 right-1.5 h-8 w-8 grid place-items-center rounded-full bg-background border border-border text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col p-3 pt-0">
                    <Link to={`/product/${p.id}`} className="text-sm text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">{p.name}</Link>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      {p.reviews ? (<><Star className="w-3.5 h-3.5 fill-rating text-rating" />{Number(p.rating || 0).toFixed(1)} ({p.reviews})</>) : 'No reviews yet'}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base font-bold">${p.price}</span>
                      {discount > 0 && <span className="text-xs text-muted-foreground line-through">${p.original_price}</span>}
                    </div>
                    <p className={`text-xs mt-0.5 ${inStock ? 'text-success' : 'text-destructive'}`}>{inStock ? 'In stock' : 'Out of stock'}</p>
                    <Button size="sm" className="mt-2 h-9 w-full" variant={inStock ? 'default' : 'outline'} disabled={!inStock || isPending}
                      onClick={() => addToCart({ productId: p.id })}>
                      {inStock ? 'Move to cart' : 'Unavailable'}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      {!isMobile && <Footer />}
    </div>
  );
};

export default Wishlist;
