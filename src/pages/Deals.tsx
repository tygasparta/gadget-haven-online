import { toCardProduct } from '@/lib/productCard';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

const Deals = () => {
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const isMobile = useIsMobile();

  // Transform products to match the expected format
  const transformProduct = toCardProduct;

  const transformedFlashSale = flashSaleProducts.map(transformProduct);
  const transformedFeatured = featuredProducts.map(transformProduct);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-5 sm:mb-8 pb-4 border-b border-border">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-destructive mb-1">Deals</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Today's Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">Flash sales and hand-picked offers, refreshed daily.</p>
        </div>

        {/* Flash Sale Products */}
        {transformedFlashSale.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <ProductSection
              title="Flash Deals"
              subtitle="Hurry up! These deals won't last long"
              products={transformedFlashSale}
              variant="deal"
              showViewAll={false}
            />
          </div>
        )}

        {/* Featured Deals */}
        {transformedFeatured.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <ProductSection
              title="Featured Deals"
              subtitle="Our most popular discounted items"
              products={transformedFeatured}
              variant="default"
              showViewAll={false}
            />
          </div>
        )}
      </div>

      {!isMobile && <Footer />}
    </div>
  );
};

export default Deals;
