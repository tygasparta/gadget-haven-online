
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [searchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');
  const searchQuery = searchParams.get('q');
  const { data: allProducts = [], isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    console.log('All products:', allProducts);
    console.log('Brand filter:', brandFilter);
    console.log('Search query:', searchQuery);
    
    let filtered = allProducts;

    // Apply brand filter with case-insensitive comparison
    if (brandFilter) {
      console.log('Filtering by brand:', brandFilter);
      filtered = filtered.filter(product => {
        const productBrand = product.brand?.toLowerCase();
        const filterBrand = brandFilter.toLowerCase();
        console.log('Product brand:', productBrand, 'Filter brand:', filterBrand);
        return productBrand === filterBrand;
      });
      console.log('Filtered products by brand:', filtered);
    }

    // Apply search filter if there's a search term from URL
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
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

    console.log('Final filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [allProducts, searchParams, sortBy, brandFilter, searchQuery]);

  const getPageTitle = () => {
    if (brandFilter) {
      return `${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)} Products`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Products';
  };

  const getPageDescription = () => {
    if (brandFilter) {
      return `Discover ${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)} products and accessories`;
    }
    if (searchQuery) {
      return `${filteredProducts.length} products found`;
    }
    return `${filteredProducts.length} products found`;
  };

  // Debug info section (only shown in development)
  const DebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
        <p className="text-sm text-yellow-700">Total products: {allProducts.length}</p>
        <p className="text-sm text-yellow-700">Brand filter: {brandFilter || 'None'}</p>
        <p className="text-sm text-yellow-700">Filtered products: {filteredProducts.length}</p>
        <p className="text-sm text-yellow-700">Available brands: {Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))).join(', ')}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Debug Info - only in development */}
        <DebugInfo />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600">
            {getPageDescription()}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.original_price,
                  rating: product.rating,
                  reviews: product.reviews,
                  image: product.image,
                  brand: product.brand,
                  discount: product.discount_percentage > 0 ? `${product.discount_percentage}% OFF` : undefined,
                  isFlash: product.is_flash_sale,
                  countdownTimer: product.is_flash_sale ? "02:15:23" : undefined
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {brandFilter ? `No products found for "${brandFilter}"` : 
               searchQuery ? `No products match "${searchQuery}"` : 
               "No products match your criteria"}
            </p>
            {brandFilter && (
              <div className="text-sm text-gray-400">
                <p>Available brands: {Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))).join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
