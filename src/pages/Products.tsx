import { toCardProduct } from '@/lib/productCard';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterDrawer from '../components/FilterDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Filter, X, Grid, List, Sparkles, TrendingUp } from 'lucide-react';
import { useProducts, useFeaturedProducts, useFlashSaleProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

const PAGE_SIZE = 12;
const MAX_PRICE = 2000;

const Products = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  const isMobile = useIsMobile();

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();

  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const getFilteredProducts = () => {
    if (filter === 'new-arrivals') {
      return [...allProducts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);
    } else if (filter === 'best-sellers') {
      return featuredProducts;
    } else if (filter === 'flash-sale') {
      return flashSaleProducts;
    }
    return allProducts;
  };

  const baseProducts = getFilteredProducts();

  const transformProduct = toCardProduct;

  const transformedProducts = baseProducts.map(transformProduct);

  const brands = [...new Set(transformedProducts.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(transformedProducts.map(p => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts.filter(product => {
      const price = product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const inSelectedBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const inSelectedCategories = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesCategory = !category || product.category?.toLowerCase() === category.toLowerCase();

      return inPriceRange && inSelectedBrands && inSelectedCategories && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [transformedProducts, priceRange, selectedBrands, selectedCategories, sortBy, category]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [priceRange, selectedBrands, selectedCategories, sortBy, category, filter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSortBy('name');
  };

  const getPageTitle = () => {
    if (filter === 'new-arrivals') return 'New Arrivals';
    if (filter === 'best-sellers') return 'Best Sellers';
    if (filter === 'flash-sale') return 'Flash Sale';
    if (category) return `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
    return 'All Products';
  };

  const getPageIcon = () => {
    if (filter === 'new-arrivals') return <Sparkles className="w-6 h-6 text-primary" />;
    if (filter === 'best-sellers') return <TrendingUp className="w-6 h-6 text-success" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
          <div className="h-8 w-48 rounded animate-shimmer mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            {getPageIcon()}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{getPageTitle()}</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 sm:w-48 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex bg-card border border-border rounded-lg p-1">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </Button>
            </div>

            {isMobile && (
              <Button variant="outline" onClick={() => setShowFilters(true)} className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {!isMobile && (
            <FilterDrawer
              isMobile={false}
              isOpen={false}
              onClose={() => {}}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={MAX_PRICE}
              brands={brands}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              onClear={clearFilters}
            />
          )}

          <div className="flex-1 min-w-0">
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedBrands.map((brand) => (
                  <Badge key={brand} variant="secondary" className="cursor-pointer">
                    {brand}
                    <X className="w-3 h-3 ml-1" onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))} />
                  </Badge>
                ))}
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="cursor-pointer">
                    {cat}
                    <X className="w-3 h-3 ml-1" onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                  <Badge variant="secondary" className="cursor-pointer">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X className="w-3 h-3 ml-1" onClick={() => setPriceRange([0, MAX_PRICE])} />
                  </Badge>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl">
                <div className="text-muted-foreground text-lg mb-4">No products found</div>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'
                  : 'space-y-4'
                }>
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5 px-8"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <FilterDrawer
          isMobile
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={MAX_PRICE}
          brands={brands}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onClear={clearFilters}
        />
      )}

      <Footer />
    </div>
  );
};

export default Products;
