
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Filter, Grid, List, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: allProducts = [], isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState(query);

  // Enhanced search function with scoring
  const searchProductsWithScore = (query: string) => {
    if (!query) return [];
    
    const searchLower = query.toLowerCase().trim();
    const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
    
    return allProducts.map(product => {
      let score = 0;
      const productName = product.name.toLowerCase();
      const productDescription = product.description?.toLowerCase() || '';
      const productCategory = product.category?.toLowerCase() || '';
      const productBrand = product.brand?.toLowerCase() || '';
      const productTags = product.tags?.map(tag => tag.toLowerCase()) || [];
      
      // Exact product name match (highest score)
      if (productName === searchLower) {
        score += 100;
      }
      
      // Exact brand + category/description keyword match
      if (searchTerms.length >= 2) {
        const brandMatch = searchTerms.some(term => productBrand.includes(term));
        const categoryMatch = searchTerms.some(term => 
          productCategory.includes(term) || 
          productDescription.includes(term) ||
          productTags.some(tag => tag.includes(term))
        );
        if (brandMatch && categoryMatch) {
          score += 80;
        }
      }
      
      // Product name starts with search term
      if (productName.startsWith(searchLower)) {
        score += 70;
      }
      
      // All search terms found in product name
      if (searchTerms.every(term => productName.includes(term))) {
        score += 60;
      }
      
      // Brand exact match
      if (productBrand === searchLower) {
        score += 50;
      }
      
      // Brand starts with search term
      if (productBrand.startsWith(searchLower)) {
        score += 45;
      }
      
      // Category exact match
      if (productCategory === searchLower) {
        score += 40;
      }
      
      // Multiple term matches across name, brand, category
      searchTerms.forEach(term => {
        if (productName.includes(term)) score += 15;
        if (productBrand.includes(term)) score += 12;
        if (productCategory.includes(term)) score += 10;
        if (productDescription.includes(term)) score += 8;
        if (productTags.some(tag => tag.includes(term))) score += 6;
      });
      
      // Partial matches in name
      if (productName.includes(searchLower)) {
        score += 25;
      }
      
      // Partial matches in description
      if (productDescription.includes(searchLower)) {
        score += 15;
      }
      
      // Tag matches
      if (productTags.some(tag => tag.includes(searchLower))) {
        score += 20;
      }
      
      return { product, score };
    }).filter(item => item.score > 0);
  };

  // Get filtered and scored products
  const scoredProducts = searchProductsWithScore(query);
  
  // Sort by score first, then by other criteria
  const sortedProducts = [...scoredProducts].sort((a, b) => {
    if (sortBy === 'relevance') {
      if (a.score !== b.score) return b.score - a.score;
      return a.product.name.localeCompare(b.product.name);
    }
    
    // For other sort options, sort by the selected criteria
    switch (sortBy) {
      case 'price-low':
        return a.product.price - b.product.price;
      case 'price-high':
        return b.product.price - a.product.price;
      case 'rating':
        return (b.product.rating || 0) - (a.product.rating || 0);
      case 'name':
        return a.product.name.localeCompare(b.product.name);
      default:
        return b.score - a.score;
    }
  }).map(item => item.product);

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

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
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <form onSubmit={handleNewSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="p-2 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button type="submit" size="sm" className="px-4 bg-blue-500 hover:bg-blue-600">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {query && (
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Search Results
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>Showing results for</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  "{query}"
                </span>
                <span>•</span>
                <span className="font-medium">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        {query && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">Sort by Relevance</option>
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
        )}

        {/* Results */}
        {!query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start searching</h3>
            <p className="text-gray-500">
              Enter a search term above to find products
            </p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product) => (
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Searching for product categories like "smartphone", "headphones", or "tablet"</li>
                <li>Searching by brand names like "Apple", "Samsung", or "Huawei"</li>
                <li>Try combining brand and product type like "Samsung phone" or "Hisense TV"</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
