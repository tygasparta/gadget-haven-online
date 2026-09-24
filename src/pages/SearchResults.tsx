
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterDrawer from '../components/FilterDrawer';
import { useProducts } from '@/hooks/useProducts';
import { Filter, Grid, List, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

const MAX_PRICE = 2000;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: allProducts = [], isLoading } = useProducts();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const searchProductsWithScore = (q: string) => {
    if (!q) return [];
    const searchLower = q.toLowerCase().trim();
    const searchTerms = searchLower.split(' ').filter(term => term.length > 0);

    return allProducts.map(product => {
      let score = 0;
      const productName = product.name.toLowerCase();
      const productDescription = product.description?.toLowerCase() || '';
      const productCategory = product.category?.toLowerCase() || '';
      const productBrand = product.brand?.toLowerCase() || '';
      const productTags = product.tags?.map(tag => tag.toLowerCase()) || [];

      if (productName === searchLower) score += 100;
      if (searchTerms.length >= 2) {
        const brandMatch = searchTerms.some(term => productBrand.includes(term));
        const categoryMatch = searchTerms.some(term =>
          productCategory.includes(term) || productDescription.includes(term) || productTags.some(tag => tag.includes(term))
        );
        if (brandMatch && categoryMatch) score += 80;
      }
      if (productName.startsWith(searchLower)) score += 70;
      if (searchTerms.every(term => productName.includes(term))) score += 60;
      if (productBrand === searchLower) score += 50;
      if (productBrand.startsWith(searchLower)) score += 45;
      if (productCategory === searchLower) score += 40;
      searchTerms.forEach(term => {
        if (productName.includes(term)) score += 15;
        if (productBrand.includes(term)) score += 12;
        if (productCategory.includes(term)) score += 10;
        if (productDescription.includes(term)) score += 8;
        if (productTags.some(tag => tag.includes(term))) score += 6;
      });
      if (productName.includes(searchLower)) score += 25;
      if (productDescription.includes(searchLower)) score += 15;
      if (productTags.some(tag => tag.includes(searchLower))) score += 20;

      return { product, score };
    }).filter(item => item.score > 0);
  };

  const scoredProducts = searchProductsWithScore(query);

  const transformProduct = (product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    discount: product.discount_percentage > 0 ? `${product.discount_percentage}% OFF` : undefined,
    isFlash: product.is_flash_sale,
    countdownTimer: product.is_flash_sale ? "02:15:23" : undefined,
    _score: 0,
  });

  const brands = [...new Set(scoredProducts.map(({ product }) => product.brand).filter(Boolean))];
  const categories = [...new Set(scoredProducts.map(({ product }) => product.category).filter(Boolean))];

  const filteredScored = useMemo(() => {
    return scoredProducts.filter(({ product }) => {
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const inBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const inCategories = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return inPriceRange && inBrands && inCategories;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoredProducts, priceRange, selectedBrands, selectedCategories]);

  const sortedProducts = [...filteredScored].sort((a, b) => {
    if (sortBy === 'relevance') {
      if (a.score !== b.score) return b.score - a.score;
      return a.product.name.localeCompare(b.product.name);
    }
    switch (sortBy) {
      case 'price-low': return a.product.price - b.product.price;
      case 'price-high': return b.product.price - a.product.price;
      case 'rating': return (b.product.rating || 0) - (a.product.rating || 0);
      case 'name': return a.product.name.localeCompare(b.product.name);
      default: return b.score - a.score;
    }
  }).map(item => transformProduct(item.product));

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setSelectedBrands([]);
    setSelectedCategories([]);
  };

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) setSearchParams({ q: searchTerm.trim() });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  useEffect(() => { setSearchTerm(query); }, [query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
          <div className="h-8 w-64 rounded animate-shimmer mb-6" />
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
        <div className="mb-6">
          <form onSubmit={handleNewSearch} className="relative mb-4 max-w-2xl">
            <Input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-4 pr-24 py-3 border-border focus-visible:ring-1 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
              {searchTerm && (
                <Button type="button" variant="ghost" size="sm" onClick={clearSearch} className="p-2">
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button type="submit" size="sm" className="px-4 bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {query && (
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Search Results</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>Showing results for</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">"{query}"</span>
                <span>•</span>
                <span className="font-medium">{sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found</span>
              </div>
            </div>
          )}
        </div>

        {query && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort by Relevance</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              {isMobile && (
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              )}
              <div className="hidden sm:flex bg-card border border-border rounded-lg p-1">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {!query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Start searching</h3>
            <p className="text-muted-foreground">Enter a search term above to find products</p>
          </div>
        ) : (
          <div className="flex gap-6 lg:gap-8">
            {!isMobile && sortedProducts.length > 0 && (
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
              {sortedProducts.length > 0 ? (
                <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">We couldn't find any products matching "{query}"</p>
                  <div className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto text-left">
                    <p>Try:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Checking your spelling</li>
                      <li>Using different keywords</li>
                      <li>Searching for product categories like "smartphone", "headphones", or "tablet"</li>
                      <li>Searching by brand names like "Apple", "Samsung", or "Huawei"</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isMobile && query && (
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

export default SearchResults;
