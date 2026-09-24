import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_ASSETS, BrandAsset } from '@/config/visualAssets';

const BrandTile = ({ brand }: { brand: BrandAsset }) => {
  const [failed, setFailed] = useState(false);
  const showLogo = brand.slug && !failed;
  return (
    <Link
      to={`/products?brand=${brand.brandKey}`}
      className="group flex items-center justify-center h-20 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
      aria-label={`Shop ${brand.name}`}
    >
      {showLogo ? (
        <img
          src={`https://cdn.simpleicons.org/${brand.slug}/6b7280`}
          alt={`${brand.name} logo`}
          loading="lazy"
          width={96}
          height={32}
          onError={() => setFailed(true)}
          className="h-7 w-auto max-w-[70%] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <span className="text-base font-extrabold tracking-wide uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {brand.name}
        </span>
      )}
    </Link>
  );
};

const FeaturedBrands = () => (
  <section className="w-full mb-8 sm:mb-12">
    <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4">Popular Brands</h2>
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
      {BRAND_ASSETS.map(b => <BrandTile key={b.name} brand={b} />)}
    </div>
  </section>
);

export default FeaturedBrands;
