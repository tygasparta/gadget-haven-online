
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Filter, SlidersHorizontal, X, Grid, List, Sparkles, TrendingUp } from 'lucide-react';
import { useProducts, useFeaturedProducts, useFlashSaleProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from '../components/MobileNavigation';

const Products = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const category = searchParams.get('category');
  const isMobile = useIsMobile();
  
  const { data: allProducts = [], isLoading } = useProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get products based on filter
  const getFilteredProducts = () => {
    if (filter === 'new-arrivals') {
      return allProducts
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
    discount: product.discount_percentage > 0 ? `${product.discount_percentage}% OFF` : undefined,
    isFlash: product.is_flash_sale,
    countdownTimer: product.is_flash_sale ? "02:15:23" : undefined,
    isNew: filter === 'new-arrivals'
  });

  const transformedProducts = baseProducts.map(transformProduct);

  // Get unique brands and categories for filters
  const brands = [...new Set(transformedProducts.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(transformedProducts.map(p => p.category).filter(Boolean))];

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = transformedProducts.filter(product => {
      const price = product.price;
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const inSelectedBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const inSelectedCategories = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesCategory = !category || product.category?.toLowerCase() === category.toLowerCase();
      
      return inPriceRange && inSelectedBrands && inSelectedCategories && matchesCategory;
    });

    // Sort products
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

  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSortBy('name');
  };

  const getPageTitle = () => {
    if (filter === 'new-arrivals') return 'New Arrivals';
    if (filter === 'best-sellers') return 'Best Sellers';
    if (filter === 'flash-sale') return 'Flash Sale';
    if (category) return `${category} Products`;
    return 'All Products';
  };

  const getPageIcon = () => {
    if (filter === 'new-arrivals') return <Sparkles className="w-6 h-6 text-blue-600" />;
    if (filter === 'best-sellers') return <TrendingUp className="w-6 h-6 text-green-600" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        {!isMobile && <Footer />}
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            {getPageIcon()}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`w-80 flex-shrink-0 ${isMobile && !showFilters ? 'hidden' : ''} ${isMobile ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
            {isMobile && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    min={0}
                    step={50}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <Separator />

                {/* Brands */}
                {brands.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Brands</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                              }
                            }}
                          />
                          <label
                            htmlFor={`brand-${brand}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${cat}`}
                            checked={selectedCategories.includes(cat)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, cat]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== cat));
                              }
                            }}
                          />
                          <label
                            htmlFor={`category-${cat}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1 min-w-0">
            {/* Active Filters */}
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map((brand) => (
                    <Badge key={brand} variant="secondary" className="cursor-pointer">
                      {brand}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                      />
                    </Badge>
                  ))}
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="cursor-pointer">
                      {cat}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                      />
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <Badge variant="secondary" className="cursor-pointer">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => setPriceRange([0, 2000])}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found</div>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default Products;
