
import React, { useMemo } from 'react';
import { Smartphone, Headphones, Laptop, Watch, Camera, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';

const categories = [
  { icon: Smartphone, label: 'Phones', path: '/products?category=smartphones', matchKey: 'smartphone' },
  { icon: Headphones, label: 'Audio', path: '/products?category=audio', matchKey: 'audio' },
  { icon: Laptop, label: 'Laptops', path: '/products?category=laptops', matchKey: 'laptop' },
  { icon: Watch, label: 'Watches', path: '/products?category=wearables', matchKey: 'watch' },
  { icon: Camera, label: 'Cameras', path: '/products?category=cameras', matchKey: 'camera' },
  { icon: Gamepad2, label: 'Gaming', path: '/products?category=gaming', matchKey: 'gaming' },
];

const MobileQuickCategories = () => {
  const { data: products = [] } = useProducts();

  const categoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    for (const category of categories) {
      const match = products.find(
        (p) => p.category?.toLowerCase().includes(category.matchKey) && p.image
      );
      if (match) map[category.label] = match.image;
    }
    return map;
  }, [products]);

  return (
    <div className="md:hidden bg-card border border-border rounded-2xl shadow-sm p-4">
      <h3 className="text-base font-bold text-foreground mb-3">Categories</h3>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => {
          const image = categoryImages[category.label];
          return (
            <Link
              key={category.label}
              to={category.path}
              className="flex flex-col items-center overflow-hidden rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
            >
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={category.label}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-foreground text-center py-2">{category.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileQuickCategories;
