
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useProducts } from '@/hooks/useProducts';
import { Headphones, Speaker, Mic } from 'lucide-react';

const Audio = () => {
  const { data: allProducts = [] } = useProducts();

  // Filter audio products (you can adjust this logic based on your product categories)
  const audioProducts = allProducts
    .filter(product => 
      product.name.toLowerCase().includes('headphone') ||
      product.name.toLowerCase().includes('speaker') ||
      product.name.toLowerCase().includes('audio') ||
      product.name.toLowerCase().includes('earphone') ||
      product.name.toLowerCase().includes('wireless')
    )
    .slice(0, 8)
    .map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      discount: product.discount_percentage > 0 ? `${product.discount_percentage}% OFF` : undefined,
    }));

  const audioCategories = [
    {
      id: 1,
      name: 'Headphones',
      icon: Headphones,
      description: 'Over-ear, on-ear, and in-ear headphones',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Speakers',
      icon: Speaker,
      description: 'Bluetooth speakers and sound systems',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Microphones',
      icon: Mic,
      description: 'Professional and gaming microphones',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Headphones className="inline-block w-8 h-8 mr-2 text-blue-500" />
            Audio Equipment
          </h1>
          <p className="text-xl text-gray-600">Discover premium audio gear for every need</p>
        </div>

        {/* Audio Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {audioCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Audio Products */}
        {audioProducts.length > 0 && (
          <ProductSection
            title="🎵 Featured Audio Products"
            subtitle="Premium sound quality for music lovers"
            products={audioProducts}
            sectionColor="blue"
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Audio;
