
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import FeaturedBrands from '../components/FeaturedBrands';
import ProductSection from '../components/ProductSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SideBanners from '../components/SideBanners';
import CartSidebar from '../components/CartSidebar';
import { useProducts, useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: allProducts = [] } = useProducts();
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative">
      <Header />
      <CartSidebar />
      
      {/* Side Banners */}
      <SideBanners />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          
          <main className="flex-1 w-full">
            <HeroBanner />
            <FeaturedBrands />
            
            {transformedFlashSale.length > 0 && (
              <ProductSection
                title="Flash Sale ⚡"
                subtitle="Limited time offers. Grab your deal now!"
                products={transformedFlashSale}
                sectionColor="red"
              />
            )}
            
            {newArrivals.length > 0 && (
              <ProductSection
                title="New Arrivals 🆕"
                subtitle="Discover the latest tech arrivals in our store."
                products={newArrivals}
                sectionColor="blue"
              />
            )}
            
            {transformedFeatured.length > 0 && (
              <ProductSection
                title="Best Sellers 🔥"
                subtitle="Most popular products this month"
                products={transformedFeatured}
                sectionColor="green"
              />
            )}
          </main>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
