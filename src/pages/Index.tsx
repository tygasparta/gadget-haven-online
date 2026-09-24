import React from 'react';
import Header from '@/components/Header';
import MobileHeader from '@/components/MobileHeader';
import HeroBanner from '@/components/HeroBanner';
import QuickCategories from '@/components/QuickCategories';
import TrendingCarousel from '@/components/TrendingCarousel';
import FeaturedBrands from '@/components/FeaturedBrands';
import AppPromoBanner from '@/components/AppPromoBanner';
import ProductSection from '@/components/ProductSection';
import PromoBanners from '@/components/PromoBanner';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import MobileQuickCategories from '@/components/MobileQuickCategories';
import MobileTopDeals from '@/components/MobileTopDeals';
import { useProducts, useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const { data: allProducts = [] } = useProducts();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();

  const transformProduct = (product: any) => ({
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
    stock: product.stock
  });

  const transformedFlashSale = flashSaleProducts.slice(0, 8).map(transformProduct);
  const transformedFeatured = featuredProducts.slice(0, 8).map(transformProduct);

  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)
    .map(product => ({ ...transformProduct(product), discount: "NEW" }));

  const byCategory = (key: string) =>
    allProducts
      .filter((p: any) => p.category?.toLowerCase().includes(key))
      .slice(0, 4)
      .map(transformProduct);

  const smartphoneRail = byCategory('smartphone');
  const laptopRail = byCategory('laptop');

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Header />}
      <CartSidebar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 pb-24 md:pb-6">
        <main>
          {/* Hero */}
          <HeroBanner />

          {/* Trust strip */}

          {/* Shop by category */}
          {isMobile ? (
            <div className="mb-4">
              <MobileQuickCategories />
            </div>
          ) : (
            <QuickCategories />
          )}

          {/* Flash deals */}
          {isMobile ? (
            <div className="mb-4">
              <MobileTopDeals />
            </div>
          ) : (
            transformedFlashSale.length > 0 && (
              <ProductSection
                title="Flash Deals"
                subtitle="Limited time offers"
                products={transformedFlashSale}
                variant="deal"
                viewAllPath="/deals"
              />
            )
          )}

          {/* Promotions */}
          <PromoBanners ids={['deals', 'laptops', 'gaming']} />

          {/* Trending */}
          <TrendingCarousel />

          {/* Category rails */}
          {smartphoneRail.length > 0 && (
            <ProductSection
              title="Smartphones"
              subtitle="Top picks for you"
              products={smartphoneRail}
              variant="default"
              viewAllPath="/products?category=smartphones"
            />
          )}
          {laptopRail.length > 0 && (
            <ProductSection
              title="Laptops & Computers"
              subtitle="Power through your day"
              products={laptopRail}
              variant="default"
              viewAllPath="/products?category=laptops"
            />
          )}

          {/* New arrivals */}
          {newArrivals.length > 0 && (
            <ProductSection
              title="New Arrivals"
              subtitle="Latest products"
              products={newArrivals}
              variant="new"
              viewAllPath="/products?filter=new-arrivals"
            />
          )}

          {/* Recommended for you */}
          {transformedFeatured.length > 0 && (
            <ProductSection
              title="Recommended For You"
              subtitle="Popular picks based on what shoppers love"
              products={transformedFeatured}
              variant="default"
              viewAllPath="/products?filter=best-sellers"
            />
          )}

          <PromoBanners ids={['smartphones', 'audio', 'smart-home']} />

          {/* Popular brands */}
          <FeaturedBrands />

          {/* App promo */}
          <AppPromoBanner />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
