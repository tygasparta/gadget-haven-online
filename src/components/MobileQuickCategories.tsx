import React from 'react';
import { CATEGORY_ASSETS } from '@/config/visualAssets';
import CategoryCard from './CategoryCard';

const MobileQuickCategories = () => (
  <div className="md:hidden bg-card border border-border rounded-lg p-3">
    <h3 className="text-base font-bold text-foreground mb-3">Categories</h3>
    <div className="flex gap-2.5 overflow-x-auto snap-x pb-1 -mx-1 px-1 [scrollbar-width:none]">
      {CATEGORY_ASSETS.map(c => (
        <div key={c.name} className="snap-start shrink-0 w-[27%]">
          <CategoryCard name={c.name} image={c.image} path={c.path} compact />
        </div>
      ))}
    </div>
  </div>
);

export default MobileQuickCategories;
