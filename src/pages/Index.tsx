
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import HeroBanner from '../components/HeroBanner';
import FeaturedBrands from '../components/FeaturedBrands';
import ProductSection from '../components/ProductSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Index = () => {
  // Sample product data
  const flashSaleProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra 256GB",
      price: 899,
      originalPrice: 1199,
      rating: 4.5,
      reviews: 124,
      image: "/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png",
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
      image: "/lovable-uploads/d81d319e-54ab-4282-9501-5d174d3ddc41.png",
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
      image: "/lovable-uploads/30057c3b-ae96-41a4-bfa6-1aeb58d94099.png",
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
      image: "/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png",
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
      image: "/lovable-uploads/7a8cf411-d2ed-4aba-9754-9c2c6fcc6c92.png",
      discount: "NEW"
    },
    {
      id: 6,
      name: "Samsung 65\" QLED 4K Smart TV",
      price: 1299,
      rating: 4.6,
      reviews: 23,
      image: "/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png",
      discount: "NEW"
    },
    {
      id: 7,
      name: "AirPods Pro 2nd Generation",
      price: 249,
      rating: 4.7,
      reviews: 78,
      image: "/lovable-uploads/d81d319e-54ab-4282-9501-5d174d3ddc41.png",
      discount: "NEW"
    },
    {
      id: 8,
      name: "PlayStation 5 Slim Console",
      price: 499,
      rating: 4.9,
      reviews: 156,
      image: "/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png",
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
      image: "/lovable-uploads/30057c3b-ae96-41a4-bfa6-1aeb58d94099.png",
      discount: "14% OFF"
    },
    {
      id: 10,
      name: "Nintendo Switch OLED",
      price: 349,
      rating: 4.8,
      reviews: 234,
      image: "/lovable-uploads/7a8cf411-d2ed-4aba-9754-9c2c6fcc6c92.png"
    },
    {
      id: 11,
      name: "Canon EOS R6 Mark II",
      price: 2499,
      originalPrice: 2799,
      rating: 4.9,
      reviews: 45,
      image: "/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png",
      discount: "11% OFF"
    },
    {
      id: 12,
      name: "Dell XPS 13 Laptop",
      price: 1299,
      originalPrice: 1499,
      rating: 4.6,
      reviews: 67,
      image: "/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png",
      discount: "13% OFF"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          
          <main className="flex-1">
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
