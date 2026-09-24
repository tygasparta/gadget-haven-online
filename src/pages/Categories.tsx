import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_ASSETS, HERO_CAMPAIGNS, PROMO_ASSETS } from '@/config/visualAssets';
import { useCategoryCounts } from '@/components/QuickCategories';
import { cn } from '@/lib/utils';

const DESCRIPTIONS: Record<string, string> = {
  'Smartphones': 'Latest smartphones and devices',
  'Laptops & Computers': 'Laptops, desktops and peripherals',
  'Gaming': 'Consoles, controllers and headsets',
  'Accessories': 'Cases, cables and everyday essentials',
  'Audio': 'Headphones, earbuds and speakers',
  'Smart TVs': 'Smart TVs and home entertainment',
  'Smart Home': 'Cameras, speakers and smart lighting',
  'Cameras': 'Mirrorless, compact and lenses',
  'Tablets': 'Tablets and styluses',
  'Monitors': 'Displays for work and play',
  'Networking': 'Routers, mesh Wi-Fi and more',
  'Wearables': 'Smartwatches and fitness trackers',
  'Storage': 'SSDs, flash drives and memory cards',
  'Power & Charging': 'Power banks, chargers and adapters',
};

const NAV: { label: string; names: string[] | null }[] = [
  { label: 'All Categories', names: null },
  { label: 'Smartphones', names: ['Smartphones'] },
  { label: 'Computers', names: ['Laptops & Computers', 'Monitors', 'Tablets'] },
  { label: 'Gaming', names: ['Gaming'] },
  { label: 'Audio', names: ['Audio'] },
  { label: 'TV & Home', names: ['Smart TVs', 'Smart Home'] },
  { label: 'Cameras', names: ['Cameras'] },
  { label: 'Wearables', names: ['Wearables'] },
  { label: 'Accessories', names: ['Accessories', 'Power & Charging', 'Storage'] },
  { label: 'Networking', names: ['Networking'] },
];

const byName = (n: string) => CATEGORY_ASSETS.find(c => c.name === n)!;
const promo = (id: string) => PROMO_ASSETS.find(p => p.id === id)!;

const CategoryTile = ({ name, count, compact }: { name: string; count?: number; compact?: boolean }) => {
  const c = byName(name);
  return (
    <Link
      to={c.path}
      className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="aspect-[4/3] bg-muted/40 overflow-hidden">
        <img
          src={c.image}
          alt={`${name} at Gadget Genie`}
          width={800}
          height={800}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className={cn('flex flex-col flex-1', compact ? 'p-3' : 'p-3 sm:p-4')}>
        <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">{name}</h3>
        {!compact && <p className="hidden sm:block text-sm text-muted-foreground mt-1 line-clamp-1">{DESCRIPTIONS[name]}</p>}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">
            {count === undefined ? '' : `${count} ${count === 1 ? 'product' : 'products'}`}
          </span>
          <span className="flex items-center gap-1 font-medium text-primary">
            <span className="hidden sm:inline">Explore</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeatureSection = ({
  label, headline, copy, image, alt, cta, path, names, counts, reverse,
}: {
  label: string; headline: string; copy: string; image: string; alt: string; cta: string; path: string;
  names: string[]; counts: Record<string, number>; reverse?: boolean;
}) => (
  <section className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
    <Link to={path} className={cn('block rounded-lg overflow-hidden border border-border bg-muted/40', reverse && 'lg:order-2')}>
      <img src={image} alt={alt} width={1280} height={640} loading="lazy" className="w-full h-auto aspect-[2/1] object-contain" />
    </Link>
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary mb-2">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">{headline}</h2>
      <p className="text-muted-foreground mb-5 max-w-md">{copy}</p>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {names.map(n => <CategoryTile key={n} name={n} count={counts[n]} compact />)}
      </div>
      <Link to={path} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
        {cta} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

const Categories = () => {
  const counts = useCategoryCounts();
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const hero = HERO_CAMPAIGNS.find(h => h.id === 'digital-life')!;

  const visible = useMemo(() => {
    const names = NAV[active].names;
    const q = query.trim().toLowerCase();
    return CATEGORY_ASSETS.filter(c =>
      (!names || names.includes(c.name)) &&
      (!q || c.name.toLowerCase().includes(q) || (DESCRIPTIONS[c.name] ?? '').toLowerCase().includes(q))
    );
  }, [active, query]);

  const popular = useMemo(
    () => [...CATEGORY_ASSETS].sort((a, b) => (counts[b.name] ?? 0) - (counts[a.name] ?? 0)).slice(0, 6),
    [counts]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 pb-24 md:pb-16">
        {/* Breadcrumb + intro */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground pt-5 mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Categories</span>
        </nav>

        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary mb-2">Shop by category</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Explore Technology Built For Your Life</h1>
          <p className="text-muted-foreground">Discover smartphones, computers, gaming, audio, smart home technology and accessories.</p>
        </div>

        {/* Featured hero — desktop uses native-ratio artwork, mobile a dedicated square composition */}
        <section className="mb-10 rounded-lg overflow-hidden border border-border bg-card">
          <div className="hidden lg:block relative aspect-[1792/608]">
            <img src={hero.desktopImage} alt={hero.alt} width={1792} height={608} className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-y-0 left-0 w-[40%] flex items-center pl-14">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary mb-3">Explore the world of technology</p>
                <h2 className="text-4xl font-extrabold tracking-tight leading-[1.05] text-foreground mb-3">Everything You Need.<br />All In One Place.</h2>
                <p className="text-muted-foreground mb-5 max-w-sm">Discover the latest gadgets, electronics and accessories from Gadget Genie.</p>
                <Button asChild size="lg" className="rounded-md font-semibold"><Link to="/products">Explore All Products</Link></Button>
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <img src={hero.mobileImage} alt={hero.alt} width={1024} height={1024} className="w-full h-auto aspect-square sm:aspect-[16/9] object-contain bg-muted/40" />
            <div className="p-5">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-primary mb-1">Explore technology</p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Everything You Need. All In One Place.</h2>
              <p className="text-sm text-muted-foreground mb-4">Discover the latest gadgets, electronics and accessories.</p>
              <Button asChild className="w-full sm:w-auto font-semibold"><Link to="/products">Explore All Products</Link></Button>
            </div>
          </div>
        </section>

        {/* Category navigation + search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border mb-6">
          <div className="flex-1 flex gap-6 overflow-x-auto scrollbar-hide -mb-px">
            {NAV.map((n, i) => (
              <button
                key={n.label}
                onClick={() => setActive(i)}
                className={cn(
                  'whitespace-nowrap py-3 text-sm border-b-2 transition-colors',
                  i === active ? 'border-primary text-foreground font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="relative md:w-60 mb-3 md:mb-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search categories..." className="pl-9 h-9 text-sm" aria-label="Search categories" />
          </div>
        </div>

        {/* Main grid */}
        <section className="mb-16">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Shop by Category</h2>
          {visible.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {visible.map(c => <CategoryTile key={c.name} name={c.name} count={counts[c.name]} />)}
            </div>
          ) : (
            <p className="text-muted-foreground py-10 text-center">No categories match "{query}".</p>
          )}
        </section>

        {/* Merchandising sections */}
        <div className="space-y-16 mb-16">
          <FeatureSection
            label="Smartphones" headline="Latest Devices. Better Possibilities."
            copy="Flagships and everyday favourites from the brands you trust."
            image={promo('smartphones').image} alt={promo('smartphones').alt}
            cta="Shop Smartphones" path="/products?category=smartphones"
            names={['Smartphones', 'Wearables', 'Power & Charging']} counts={counts}
          />
          <FeatureSection
            label="Computing" headline="Work. Create. Play."
            copy="Laptops, desktops, monitors and the accessories that complete your setup."
            image={promo('laptops').image} alt={promo('laptops').alt}
            cta="Explore Computing" path="/products?category=laptops"
            names={['Laptops & Computers', 'Monitors', 'Accessories']} counts={counts} reverse
          />
          <FeatureSection
            label="Gaming" headline="Level Up Your Setup"
            copy="Consoles, controllers, gaming headsets, gaming laptops and monitors."
            image={promo('gaming').image} alt={promo('gaming').alt}
            cta="Explore Gaming" path="/products?category=gaming"
            names={['Gaming', 'Audio', 'Monitors']} counts={counts}
          />
        </div>

        {/* Popular categories */}
        <section>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Popular Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {popular.map(c => <CategoryTile key={c.name} name={c.name} count={counts[c.name]} compact />)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
