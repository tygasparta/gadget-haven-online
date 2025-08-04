
import React, { useState, useEffect } from 'react';
import EnhancedPreloader from '../components/EnhancedPreloader';
import Header from '../components/Header';
import MobileHeader from '../components/MobileHeader';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import FeaturedBrands from '../components/FeaturedBrands';
import ProductSection from '../components/ProductSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SideBanners from '../components/SideBanners';
import CartSidebar from '../components/CartSidebar';
import TrendingCarousel from '../components/TrendingCarousel';
import LiveDeals from '../components/LiveDeals';
import QuickCategories from '../components/QuickCategories';
import CustomerReviews from '../components/CustomerReviews';
import SpecialOffers from '../components/SpecialOffers';
import MobileNavigation from '../components/MobileNavigation';
import MobileQuickCategories from '../components/MobileQuickCategories';
import MobileTopDeals from '../components/MobileTopDeals';
import TabletOptimizedBanners from '../components/TabletOptimizedBanners';
import { useProducts, useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const isMobile = useIsMobile();
  const isTablet = !isMobile && window.innerWidth < 1024;
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { data: flashSaleProducts = [], isLoading: flashLoading } = useFlashSaleProducts();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Transform products to match the expected format
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

  const transformedFlashSale = flashSaleProducts.slice(0, 4).map(transformProduct);
  const transformedFeatured = featuredProducts.slice(0, 4).map(transformProduct);
  
  // Get new arrivals (latest products)
  const newArrivals = allProducts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map(product => ({
      ...transformProduct(product),
      discount: "NEW"
    }));

  if (showPreloader) {
    return <EnhancedPreloader />;
  }

  return (
    <>
      {/* SEO structured data for homepage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "GadgetGenie - Home",
          "description": "Shop the latest electronics, smartphones, and gadgets at GadgetGenie. Flash sales, new arrivals, and best sellers available now.",
          "url": "https://gadgetgenie.com/",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": transformedFlashSale.map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "USD"
              }
            }))
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative animate-fade-in">
        {/* Conditional Header */}
        {isMobile ? <MobileHeader /> : <Header />}
        <CartSidebar />
        
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
          {/* Tablet Optimized Banners */}
          {isTablet && <TabletOptimizedBanners />}
          
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Desktop Only */}
            <div className="hidden xl:block xl:w-80 2xl:w-96 flex-shrink-0">
              <div className="space-y-6 lg:space-y-8">
                <Sidebar />
                <TrendingCarousel />
                <LiveDeals />
                <QuickCategories />
                <CustomerReviews />
                <SpecialOffers />
              </div>
            </div>
            
            <main className="flex-1 min-w-0 w-full">
              <div className="w-full space-y-6 lg:space-y-8">
                {/* Hero Banner - Desktop Only */}
                {!isMobile && !isTablet && (
                  <div className="mb-8 lg:mb-12">
                    <HeroBanner />
                  </div>
                )}
                
                {/* Mobile-specific components */}
                <div className="md:hidden space-y-6 mt-6">
                  <MobileQuickCategories />
                  <MobileTopDeals />
                </div>
                
                <div className="mb-8 lg:mb-12">
                  <FeaturedBrands />
                </div>
                
                {transformedFlashSale.length > 0 && (
                  <div className="w-full mb-8 lg:mb-12">
                    <ProductSection
                      title="Flash Sale ⚡"
                      subtitle="Limited time offers. Grab your deal now!"
                      products={transformedFlashSale}
                      sectionColor="red"
                    />
                  </div>
                )}
                
                {newArrivals.length > 0 && (
                  <div className="w-full mb-8 lg:mb-12">
                    <ProductSection
                      title="New Arrivals 🆕"
                      subtitle="Discover the latest tech arrivals in our store."
                      products={newArrivals}
                      sectionColor="blue"
                    />
                  </div>
                )}
                
                {transformedFeatured.length > 0 && (
                  <div className="w-full mb-8 lg:mb-12">
                    <ProductSection
                      title="Best Sellers 🔥"
                      subtitle="Most popular products this month"
                      products={transformedFeatured}
                      sectionColor="green"
                    />
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Newsletter - Desktop Only */}
        {!isMobile && (
          <div className="mt-12 lg:mt-16">
            <Newsletter />
          </div>
        )}
        
        {/* Footer - Desktop Only */}
        {!isMobile && (
          <div className="mt-8 lg:mt-12">
            <Footer />
          </div>
        )}
        
        {/* Mobile Navigation - Always visible on mobile */}
        <MobileNavigation />
      </div>
    </>
  );
};

export default Index;
