import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PromoAsset, PROMO_ASSETS } from '@/config/visualAssets';
import { cn } from '@/lib/utils';

export const PromoBanner: React.FC<{ promo: PromoAsset }> = ({ promo }) => {
  const dark = promo.tone === 'dark';
  return (
    <Link
      to={promo.cta.path}
      className="group relative block aspect-[2/1] overflow-hidden rounded-lg border border-border bg-muted"
    >
      <img
        src={promo.image}
        alt={promo.alt}
        width={1280}
        height={640}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="relative h-full w-[55%] flex flex-col justify-center p-4 sm:p-5 lg:p-6">
        <span className={cn('text-[10px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase mb-1', dark ? 'text-primary-foreground/80' : 'text-primary')}>
          {promo.label}
        </span>
        <h3 className={cn('text-lg sm:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight', dark ? 'text-primary-foreground' : 'text-foreground')}>
          {promo.headline}
        </h3>
        <p className={cn('text-xs sm:text-sm mt-1 mb-3 line-clamp-1 md:hidden xl:block', dark ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
          {promo.copy}
        </p>
        <Button size="sm" className="self-start font-semibold pointer-events-none mt-2 md:mt-3 xl:mt-0">{promo.cta.text}</Button>
      </div>
    </Link>
  );
};

const PromoBanners: React.FC<{ ids?: string[] }> = ({ ids }) => {
  const promos = ids ? PROMO_ASSETS.filter(p => ids.includes(p.id)) : PROMO_ASSETS;
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12" aria-label="Promotions">
      {promos.map(p => <PromoBanner key={p.id} promo={p} />)}
    </section>
  );
};

export default PromoBanners;
