
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import QuickCategories from "@/components/QuickCategories";
import TrendingCarousel from "@/components/TrendingCarousel";
import ProductSection from "@/components/ProductSection";
import SpecialOffers from "@/components/SpecialOffers";
import Newsletter from "@/components/Newsletter";
import LiveDeals from "@/components/LiveDeals";
import FeaturedBrands from "@/components/FeaturedBrands";
import CustomerReviews from "@/components/CustomerReviews";
import EnhancedPreloader from "@/components/EnhancedPreloader";
import MobileNavigation from "@/components/MobileNavigation";
import MobileHeader from "@/components/MobileHeader";
import MobileQuickCategories from "@/components/MobileQuickCategories";
import MobileTopDeals from "@/components/MobileTopDeals";
import TabletOptimizedBanners from "@/components/TabletOptimizedBanners";
import PaymentTest from "@/components/PaymentTest";
import { useIsMobile } from "@/hooks/use-mobile";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string;
  category: string | null;
  brand: string | null;
  rating: number;
  reviews: number;
  stock: number;
  is_featured: boolean;
  is_flash_sale: boolean;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <EnhancedPreloader />;
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Header />}
      
      <main className="relative">
        <HeroBanner />
        
        {isMobile ? <MobileQuickCategories /> : <QuickCategories />}
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Payment Test Section - Only show in development */}
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-yellow-800">Payment Testing</h2>
            <PaymentTest />
          </div>
          
          <TrendingCarousel />
          
          {isMobile ? <MobileTopDeals /> : <LiveDeals />}
          
          <TabletOptimizedBanners />
          
          <ProductSection 
            title="Latest Products" 
            products={products.slice(0, 8)} 
          />
          
          <SpecialOffers />
          
          <ProductSection 
            title="Featured Products" 
            products={products.slice(4, 12)} 
          />
          
          <FeaturedBrands />
          
          <CustomerReviews />
          
          <Newsletter />
        </div>
      </main>
      
      {!isMobile && <Footer />}
      <MobileNavigation />
    </div>
  );
};

export default Index;
