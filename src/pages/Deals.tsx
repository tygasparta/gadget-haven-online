
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useFlashSaleProducts, useFeaturedProducts } from '@/hooks/useProducts';
import { Tag, Clock, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Deals = () => {
  const { data: flashSaleProducts = [] } = useFlashSaleProducts();
  const { data: featuredProducts = [] } = useFeaturedProducts();
  const isMobile = useIsMobile();

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

  const transformedFlashSale = flashSaleProducts.map(transformProduct);
  const transformedFeatured = featuredProducts.map(transformProduct);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Tag className="inline-block w-8 h-8 mr-2 text-destructive" />
            Amazing Deals
          </h1>
          <p className="text-xl text-gray-600">Don't miss out on these incredible offers!</p>
        </div>

        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg">
            <Zap className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Flash Sales</h3>
            <p className="text-destructive-foreground/90">Limited time offers with huge discounts</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg">
            <Clock className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Daily Deals</h3>
            <p className="text-primary-foreground/90">New deals updated every 24 hours</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg">
            <Tag className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Best Offers</h3>
            <p className="text-success-foreground/90">Hand-picked deals with maximum savings</p>
          </div>
        </div>

        {/* Flash Sale Products */}
        {transformedFlashSale.length > 0 && (
          <div className="mb-12">
            <ProductSection
              title="⚡ Flash Sale - Limited Time!"
              subtitle="Hurry up! These deals won't last long"
              products={transformedFlashSale}
              variant="deal"
              showViewAll={false}
            />
          </div>
        )}

        {/* Featured Deals */}
        {transformedFeatured.length > 0 && (
          <div className="mb-12">
            <ProductSection
              title="🔥 Featured Deals"
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
