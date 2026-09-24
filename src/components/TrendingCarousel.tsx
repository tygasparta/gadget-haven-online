import React, { useMemo } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const TrendingCarousel = () => {
  const { data: products = [] } = useProducts();

  const trending = useMemo(
    () =>
      [...products]
        .filter((p: any) => p.image)
        .sort((a: any, b: any) => (b.reviews ?? 0) - (a.reviews ?? 0) || (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 4),
    [products]
  );

  if (trending.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between gap-4 mb-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Trending Now</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Popular with shoppers this week</p>
        </div>
        <Link to="/products?trending=true" className="flex items-center text-sm font-medium text-primary hover:underline whitespace-nowrap">
          View all
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {trending.map((product: any, index) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
          >
            <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold text-muted-foreground bg-background/90 px-1.5 py-0.5 rounded-[3px] z-10 tabular-nums">
              #{index + 1}
            </span>
            <div className="aspect-square bg-background overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain p-3 group-hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
              {(product.reviews ?? 0) > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-rating fill-current" strokeWidth={1.5} />
                  <span className="text-xs text-muted-foreground">{Number(product.rating).toFixed(1)} ({product.reviews})</span>
                </div>
              )}
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-base font-bold text-foreground">${product.price}</span>
                {product.original_price > product.price && (
                  <span className="text-xs text-muted-foreground line-through">${product.original_price}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingCarousel;
