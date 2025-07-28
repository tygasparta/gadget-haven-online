
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
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  const { data: allProducts = [], isLoading, error } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    console.log('=== Products Page Debug Info ===');
    console.log('All products loaded:', allProducts.length);
    console.log('Brand filter from URL:', brandFilter);
    console.log('Category filter from URL:', categoryFilter);
    console.log('Search query from URL:', searchQuery);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
    
    if (allProducts.length > 0) {
      console.log('Sample products:', allProducts.slice(0, 3).map(p => ({ 
        id: p.id, 
        name: p.name, 
        brand: p.brand 
      })));
    }
    
    // Get all unique brands from products
    const availableBrands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));
    console.log('Available brands in database:', availableBrands);
    
    let filtered = [...allProducts];

    // Apply brand filter with case-insensitive comparison
    if (brandFilter) {
      console.log('Filtering by brand:', brandFilter);
      const brandLower = brandFilter.toLowerCase();
      filtered = filtered.filter(product => {
        const productBrand = product.brand?.toLowerCase();
        const matches = productBrand === brandLower;
        if (matches) {
          console.log('Product matches brand filter:', product.name, 'brand:', product.brand);
        }
        return matches;
      });
      console.log('Products after brand filter:', filtered.length);
    }

    // Apply category filter with case-insensitive comparison
    if (categoryFilter) {
      console.log('Filtering by category:', categoryFilter);
      const categoryLower = categoryFilter.toLowerCase();
      filtered = filtered.filter(product => {
        const productCategory = product.category?.toLowerCase();
        const matches = productCategory === categoryLower;
        if (matches) {
          console.log('Product matches category filter:', product.name, 'category:', product.category);
        }
        return matches;
      });
      console.log('Products after category filter:', filtered.length);
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
      console.log('Products after search filter:', filtered.length);
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

    console.log('Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [allProducts, brandFilter, categoryFilter, searchQuery, sortBy]);

  const getPageTitle = () => {
    if (categoryFilter) {
      return `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products`;
    }
    if (brandFilter) {
      return `${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)} Products`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Products';
  };

  const getPageDescription = () => {
    if (categoryFilter) {
      return `Discover ${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} products and accessories`;
    }
    if (brandFilter) {
      return `Discover ${brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1)} products and accessories`;
    }
    if (searchQuery) {
      return `${filteredProducts.length} products found`;
    }
    return `${filteredProducts.length} products found`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading products</h3>
            <p className="text-gray-500">{error.message}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                {brandFilter ? (
                  <>We couldn't find any products for the brand "{brandFilter}"</>
                ) : searchQuery ? (
                  <>No products match your search "{searchQuery}"</>
                ) : (
                  <>No products match your criteria</>
                )}
              </p>
              {brandFilter && (
                <p className="text-sm text-gray-400 mb-4">
                  This could mean there are no products with the brand "{brandFilter}" in our database.
                </p>
              )}
            </div>
            
            {/* Show available brands when filtering by brand */}
            {brandFilter && allProducts.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-800 mb-2">Available Brands:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))).map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show message when no products exist in database */}
            {allProducts.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mt-4">
                <h4 className="font-semibold text-red-800 mb-2">No products in database</h4>
                <p className="text-red-600 text-sm">
                  There are no products currently available in the database. Please contact support or check back later.
                </p>
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
