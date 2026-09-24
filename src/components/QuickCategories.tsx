import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORY_ASSETS } from '@/config/visualAssets';
import CategoryCard from './CategoryCard';

export const useCategoryCounts = () => {
  const { data: products = [] } = useProducts();
  return useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORY_ASSETS) {
      map[c.name] = products.filter((p: any) => {
        const cat = p.category?.toLowerCase() ?? '';
        return c.matchKeys.some(k => cat.includes(k));
      }).length;
    }
    return map;
  }, [products]);
};

const QuickCategories = () => {
  const counts = useCategoryCounts();

  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-foreground">Shop by Category</h2>
        <Link to="/categories" className="text-sm font-medium text-primary hover:opacity-80">View all →</Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {CATEGORY_ASSETS.map(c => (
          <CategoryCard key={c.name} name={c.name} image={c.image} path={c.path} count={counts[c.name]} />
        ))}
      </div>
    </section>
  );
};

export default QuickCategories;
