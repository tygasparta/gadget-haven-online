
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import FeaturedBrands from '../components/FeaturedBrands';
import ProductSection from '../components/ProductSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SideBanners from '../components/SideBanners';

const Index = () => {
  // Enhanced product data with relevant stock images
  const flashSaleProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra 256GB",
      price: 899,
      originalPrice: 1199,
      rating: 4.5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      discount: "25% OFF",
      isFlash: true,
      countdownTimer: "02:15:23"
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Headphones",
      price: 279,
      originalPrice: 349,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      discount: "20% OFF",
      isFlash: true,
      countdownTimer: "02:15:23"
    },
    {
      id: 3,
      name: "Anker PowerCore 20000mAh",
      price: 45,
      originalPrice: 65,
      rating: 4.6,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1609592806689-60c84bdb98d0?w=400&h=400&fit=crop",
      discount: "31% OFF",
      isFlash: true,
      countdownTimer: "02:15:23"
    },
    {
      id: 4,
      name: "MacBook Air M2 13-inch",
      price: 999,
      originalPrice: 1199,
      rating: 4.7,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      discount: "17% OFF",
      isFlash: true,
      countdownTimer: "02:15:23"
    }
  ];

  const newArrivals = [
    {
      id: 5,
      name: "iPhone 15 Pro Max 512GB",
      price: 1399,
      rating: 4.8,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      discount: "NEW"
    },
    {
      id: 6,
      name: "Samsung 65\" QLED 4K Smart TV",
      price: 1299,
      rating: 4.6,
      reviews: 23,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      discount: "NEW"
    },
    {
      id: 7,
      name: "AirPods Pro 2nd Generation",
      price: 249,
      rating: 4.7,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
      discount: "NEW"
    },
    {
      id: 8,
      name: "PlayStation 5 Slim Console",
      price: 499,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
      discount: "NEW"
    }
  ];

  const bestSellers = [
    {
      id: 9,
      name: "iPad Air 10.9-inch",
      price: 599,
      originalPrice: 699,
      rating: 4.5,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      discount: "14% OFF"
    },
    {
      id: 10,
      name: "Nintendo Switch OLED",
      price: 349,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: 11,
      name: "Canon EOS R6 Mark II",
      price: 2499,
      originalPrice: 2799,
      rating: 4.9,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
      discount: "11% OFF"
    },
    {
      id: 12,
      name: "Dell XPS 13 Laptop",
      price: 1299,
      originalPrice: 1499,
      rating: 4.6,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      discount: "13% OFF"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative">
      <Header />
      
      {/* Side Banners */}
      <SideBanners />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          
          <main className="flex-1 w-full">
            <HeroBanner />
            <FeaturedBrands />
            
            <ProductSection
              title="Flash Sale ⚡"
              subtitle="Limited time offers. Grab your deal now!"
              products={flashSaleProducts}
              sectionColor="red"
            />
            
            <ProductSection
              title="New Arrivals 🆕"
              subtitle="Discover the latest tech arrivals in our store."
              products={newArrivals}
              sectionColor="blue"
            />
            
            <ProductSection
              title="Best Sellers 🔥"
              subtitle="Most popular products this month"
              products={bestSellers}
              sectionColor="green"
            />
          </main>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
