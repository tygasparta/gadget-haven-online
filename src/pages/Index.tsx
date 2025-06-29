
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroBanner />
        <SideBanners />
        <PromoBanners />
        <ProductSection />
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
