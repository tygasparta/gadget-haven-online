import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

type SectionVariant = 'default' | 'deal' | 'new' | 'trending';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  showViewAll?: boolean;
  variant?: SectionVariant;
  viewAllPath?: string;
}

/** Section-level countdown to the end of the current day (deals refresh daily). */
const useEndOfDayCountdown = () => {
  const calc = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0'));
  };
  const [parts, setParts] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setParts(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return parts;
};

const Countdown = () => {
  const [h, m, s] = useEndOfDayCountdown();
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Ends in</span>
      <span className="flex items-center gap-1 font-semibold tabular-nums text-foreground" aria-label={`${h} hours ${m} minutes ${s} seconds`}>
        {[h, m, s].map((v, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-muted-foreground">:</span>}
            <span className="bg-foreground text-background rounded-[4px] px-1.5 py-0.5 text-xs min-w-[26px] text-center">{v}</span>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  showViewAll = true,
  variant = 'default',
  viewAllPath,
}) => {
  const isDeal = variant === 'deal';

  return (
    <section className="mb-12 w-full">
      <div className="flex items-end justify-between gap-4 mb-4 pb-3 border-b border-border">
        <div className="min-w-0">
          {isDeal && (
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-destructive mb-1">
              <Zap className="w-3 h-3" strokeWidth={2} />
              Limited time
            </span>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{title}</h2>
          {!isDeal && subtitle && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{subtitle}</p>}
          {isDeal && <div className="mt-1.5"><Countdown /></div>}
        </div>
        {showViewAll && (
          <Link
            to={viewAllPath ?? '/products'}
            className="flex items-center text-sm font-medium text-primary hover:underline whitespace-nowrap flex-shrink-0"
          >
            View all
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showAddToCart={isDeal} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
