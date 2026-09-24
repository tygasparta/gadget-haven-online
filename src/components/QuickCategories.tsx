
import React, { useMemo } from 'react';
import { Smartphone, Headphones, Laptop, Camera, Gamepad2, Home as HomeIcon, Cable, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';

const categories = [
  { name: 'Smartphones', icon: Smartphone, path: '/products?category=smartphones', matchKey: 'smartphone' },
  { name: 'Laptops', icon: Laptop, path: '/products?category=laptops', matchKey: 'laptop' },
  { name: 'Audio', icon: Headphones, path: '/products?category=audio', matchKey: 'audio' },
  { name: 'Gaming', icon: Gamepad2, path: '/products?category=gaming', matchKey: 'gaming' },
  { name: 'Cameras', icon: Camera, path: '/products?category=cameras', matchKey: 'camera' },
  { name: 'Smart Home', icon: HomeIcon, path: '/products?category=smart-home', matchKey: 'smart home' },
  { name: 'Accessories', icon: Cable, path: '/products?category=accessories', matchKey: 'accessor' },
  { name: 'Electronics', icon: Zap, path: '/products?category=electronics', matchKey: 'electronic' },
];

const QuickCategories = () => {
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  const categoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    for (const category of categories) {
      const match = products.find(
        (p) => p.category?.toLowerCase().includes(category.matchKey) && p.image
      );
      if (match) map[category.name] = match.image;
    }
    return map;
  }, [products]);

  return (
    <div className="mb-8 sm:mb-16">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-foreground">Shop by Category</h2>
        <button
          onClick={() => navigate('/categories')}
          className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((category) => {
          const image = categoryImages[category.name];
          return (
            <button
              key={category.name}
              onClick={() => navigate(category.path)}
              className="flex flex-col overflow-hidden rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group text-left"
            >
              <div className="aspect-square w-full bg-muted/40 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-200">
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight px-2 py-2.5">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickCategories;
