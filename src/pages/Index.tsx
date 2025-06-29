
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductSection from '@/components/ProductSection';
import FeaturedBrands from '@/components/FeaturedBrands';
import Newsletter from '@/components/Newsletter';
import SideBanners from '@/components/SideBanners';
import PromoBanners from '@/components/PromoBanners';
import NewsletterBanner from '@/components/NewsletterBanner';
import CartSidebar from '@/components/CartSidebar';
import { useProducts, useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: allProducts = [] } = useProducts();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroBanner />
        <SideBanners />
        <PromoBanners />
        
        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <ProductSection 
            title="Flash Sale ⚡"
            subtitle="Limited time offers - grab them while they last!"
            products={flashSaleProducts.slice(0, 4)}
            sectionColor="blue"
          />
        )}
        
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <ProductSection 
            title="Featured Products"
            subtitle="Handpicked items just for you"
            products={featuredProducts.slice(0, 4)}
            sectionColor="green"
          />
        )}
        
        {/* All Products Section */}
        {allProducts.length > 0 && (
          <ProductSection 
            title="All Products"
            subtitle="Discover our complete collection"
            products={allProducts.slice(0, 8)}
            sectionColor="blue"
          />
        )}
        
        <NewsletterBanner />
        <FeaturedBrands />
        <Newsletter />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Index;
