import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MobileHeader from '@/components/MobileHeader';
import Sidebar from '@/components/Sidebar';
import HeroBanner from '@/components/HeroBanner';
import FeaturedBrands from '@/components/FeaturedBrands';
import ProductSection from '@/components/ProductSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import MobileQuickCategories from '@/components/MobileQuickCategories';
import MobileTopDeals from '@/components/MobileTopDeals';
import { useProducts, useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { storeSettings } = useStoreSettings();
  const isMobile = useIsMobile();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { data: flashSaleProducts = [], isLoading: flashLoading } = useFlashSaleProducts();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();

  const transformProduct = (product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    discount: product.discount_percentage > 0 ? `${product.discount_percentage}% OFF` : undefined,
    isFlash: product.is_flash_sale,
    countdownTimer: product.is_flash_sale ? "02:15:23" : undefined
  });

  const transformedFlashSale = flashSaleProducts.slice(0, 6).map(transformProduct);
  const transformedFeatured = featuredProducts.slice(0, 6).map(transformProduct);
  
  const newArrivals = allProducts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6)
    .map(product => ({
      ...transformProduct(product),
      discount: "NEW"
    }));

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {isMobile ? <MobileHeader /> : <Header />}
        <CartSidebar />
        
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 pb-20 md:pb-6">
          <div className="flex gap-4">
            {/* Sidebar - Desktop only */}
            {!isMobile && (
              <div className="hidden xl:block w-64 flex-shrink-0">
                <Sidebar />
              </div>
            )}
            
            <main className="flex-1 min-w-0">
              {/* Hero Banner */}
              {!isMobile && <HeroBanner />}
              
              {/* Mobile components */}
              <div className="md:hidden space-y-4 mt-2">
                <MobileQuickCategories />
                <MobileTopDeals />
              </div>

              <FeaturedBrands />

              {/* Quick action buttons */}
              <div className="flex gap-3 mb-4">
                <button 
                  onClick={() => navigate('/products')} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-sm font-medium text-sm transition-colors"
                >
                  Shop All Products
                </button>
                <button 
                  onClick={() => navigate('/deals')} 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-sm font-medium text-sm transition-colors"
                >
                  🔥 Fire Sale
                </button>
              </div>
              
              {transformedFlashSale.length > 0 && (
                <ProductSection
                  title="Flash Sale ⚡"
                  subtitle="Limited time offers"
                  products={transformedFlashSale}
                  sectionColor="red"
                />
              )}
              
              {newArrivals.length > 0 && (
                <ProductSection
                  title="New Arrivals"
                  subtitle="Latest products"
                  products={newArrivals}
                  sectionColor="blue"
                />
              )}
              
              {transformedFeatured.length > 0 && (
                <ProductSection
                  title="Best Sellers 🔥"
                  subtitle="Most popular this month"
                  products={transformedFeatured}
                  sectionColor="green"
                />
              )}
            </main>
          </div>
        </div>

        {!isMobile && <Newsletter />}
        {!isMobile && <Footer />}
        <MobileNavigation />
      </div>
    </>
  );
};

export default Index;
