
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
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [] } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroBanner />
        <SideBanners />
        <PromoBanners />
        <ProductSection title="Featured Products" products={products} />
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
