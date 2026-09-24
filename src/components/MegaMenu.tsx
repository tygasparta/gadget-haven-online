import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone, Laptop, Headphones, Gamepad2, Zap, Cable, Home as HomeIcon, Camera,
  ChevronRight, Flame, Sparkles
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

interface CategoryGroup {
  name: string;
  icon: React.ElementType;
  path: string;
  items: { name: string; path: string }[];
}

const categories: CategoryGroup[] = [
  {
    name: 'Smartphones', icon: Smartphone, path: '/products?category=smartphones',
    items: [
      { name: 'iPhone', path: '/products?category=smartphones&brand=apple' },
      { name: 'Samsung', path: '/products?category=smartphones&brand=samsung' },
      { name: 'Huawei', path: '/products?category=smartphones&brand=huawei' },
      { name: 'Xiaomi', path: '/products?category=smartphones&brand=xiaomi' },
      { name: 'All Smartphones', path: '/products?category=smartphones' },
    ],
  },
  {
    name: 'Laptops & Computers', icon: Laptop, path: '/products?category=laptops',
    items: [
      { name: 'MacBooks', path: '/products?category=laptops&brand=apple' },
      { name: 'Gaming Laptops', path: '/products?category=laptops&type=gaming' },
      { name: 'Desktops', path: '/products?category=computers' },
      { name: 'Monitors', path: '/products?category=monitors' },
      { name: 'All Laptops', path: '/products?category=laptops' },
    ],
  },
  {
    name: 'Audio & Headphones', icon: Headphones, path: '/products?category=audio',
    items: [
      { name: 'Wireless Earbuds', path: '/products?category=audio&type=wireless' },
      { name: 'Gaming Headsets', path: '/products?category=audio&type=gaming' },
      { name: 'Studio Headphones', path: '/products?category=audio&type=studio' },
      { name: 'Speakers', path: '/products?category=audio&type=speakers' },
      { name: 'All Audio', path: '/products?category=audio' },
    ],
  },
  {
    name: 'Gaming', icon: Gamepad2, path: '/products?category=gaming',
    items: [
      { name: 'Consoles', path: '/products?category=gaming&type=consoles' },
      { name: 'Games', path: '/products?category=gaming&type=games' },
      { name: 'Gaming Accessories', path: '/products?category=gaming&type=accessories' },
      { name: 'All Gaming', path: '/products?category=gaming' },
    ],
  },
  {
    name: 'Cameras', icon: Camera, path: '/products?category=cameras',
    items: [
      { name: 'DSLR', path: '/products?category=cameras&type=dslr' },
      { name: 'Action Cams', path: '/products?category=cameras&type=action' },
      { name: 'Lenses', path: '/products?category=cameras&type=lenses' },
      { name: 'All Cameras', path: '/products?category=cameras' },
    ],
  },
  {
    name: 'Smart Home', icon: HomeIcon, path: '/products?category=smart-home',
    items: [
      { name: 'Security', path: '/products?category=smart-home&type=security' },
      { name: 'Lighting', path: '/products?category=smart-home&type=lighting' },
      { name: 'Appliances', path: '/products?category=smart-home&type=appliances' },
      { name: 'All Smart Home', path: '/products?category=smart-home' },
    ],
  },
  {
    name: 'Power & Cables', icon: Cable, path: '/products?category=accessories',
    items: [
      { name: 'Power Banks', path: '/products?category=accessories&type=power-banks' },
      { name: 'Chargers', path: '/products?category=accessories&type=chargers' },
      { name: 'Cables', path: '/products?category=accessories&type=cables' },
      { name: 'All Accessories', path: '/products?category=accessories' },
    ],
  },
  {
    name: 'Electronics', icon: Zap, path: '/products?category=electronics',
    items: [
      { name: 'TVs', path: '/products?category=electronics&type=tv' },
      { name: 'Tablets', path: '/products?category=electronics&type=tablets' },
      { name: 'All Electronics', path: '/products?category=electronics' },
    ],
  },
];

// Maps a category query-param value to the substring used to match it against
// real product.category values (which don't always match the param verbatim).
const CATEGORY_MATCH_KEYS: Record<string, string> = {
  smartphones: 'smartphone',
  laptops: 'laptop',
  computers: 'computer',
  monitors: 'monitor',
  audio: 'audio',
  gaming: 'gaming',
  cameras: 'camera',
  'smart-home': 'smart home',
  accessories: 'accessor',
  electronics: 'electronic',
};

function parsePathFilters(path: string) {
  const query = path.split('?')[1] ?? '';
  const params = new URLSearchParams(query);
  const category = params.get('category');
  const brand = params.get('brand');
  return { category, brand };
}

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: products = [] } = useProducts();

  const findImage = useMemo(() => {
    const cache = new Map<string, string | undefined>();
    return (path: string) => {
      if (cache.has(path)) return cache.get(path);
      const { category, brand } = parsePathFilters(path);
      const matchKey = category ? (CATEGORY_MATCH_KEYS[category] ?? category.replace('-', ' ')) : null;
      const match = products.find((p) => {
        if (!p.image) return false;
        const categoryOk = !matchKey || p.category?.toLowerCase().includes(matchKey);
        const brandOk = !brand || p.brand?.toLowerCase().includes(brand.toLowerCase());
        return categoryOk && brandOk;
      });
      const image = match?.image;
      cache.set(path, image);
      return image;
    };
  }, [products]);

  if (!open) return null;

  const active = categories[activeIndex];

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 hidden md:block animate-scale-in"
      style={{ transformOrigin: 'top center' }}
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-popover text-popover-foreground border border-border rounded-b-lg shadow-lg overflow-hidden flex">
          {/* Department list */}
          <div className="w-64 flex-shrink-0 bg-muted/40 border-r border-border py-2">
            {categories.map((cat, i) => {
              const image = findImage(cat.path);
              return (
                <button
                  key={cat.name}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => go(cat.path)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                    i === activeIndex
                      ? 'bg-background text-primary font-medium'
                      : 'text-foreground hover:bg-background/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <cat.icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </span>
                    {cat.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Active department detail */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-4">
              <active.icon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-base">{active.name}</h3>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {active.items.map((item) => {
                const image = findImage(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => go(item.path)}
                    className="flex flex-col items-center text-center gap-2 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                  >
                    <span className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <active.icon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors leading-tight">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-border flex items-center gap-3">
              <button
                onClick={() => go('/deals')}
                className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:opacity-80 transition-opacity"
              >
                <Flame className="w-3.5 h-3.5" />
                Fire Sale Deals
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => go('/categories?featured=new')}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                New Arrivals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
export { categories as megaMenuCategories };
