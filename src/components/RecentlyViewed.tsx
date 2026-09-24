import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';

const STORAGE_KEY = 'gg_recently_viewed';
const MAX_ITEMS = 8;

export function recordProductView(productId: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];
    const updated = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function getRecentlyViewedIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface RecentlyViewedProps {
  excludeId?: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ excludeId }) => {
  const { data: allProducts = [] } = useProducts();
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewedIds());
  }, [excludeId]);

  const viewed = ids
    .filter((id) => id !== excludeId)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      rating: p.rating,
      reviews: p.reviews,
      image: p.image,
      brand: p.brand,
      stock: p.stock,
      discount: p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : undefined,
      isFlash: p.is_flash_sale,
    }));

  if (viewed.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {viewed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
