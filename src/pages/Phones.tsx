
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useProducts } from '@/hooks/useProducts';
import { Smartphone, Tablet, Watch } from 'lucide-react';

const Phones = () => {
  const { data: allProducts = [] } = useProducts();

  // Filter phone products
  const phoneProducts = allProducts
    .filter(product => 
      product.name.toLowerCase().includes('phone') ||
      product.name.toLowerCase().includes('iphone') ||
      product.name.toLowerCase().includes('samsung') ||
      product.name.toLowerCase().includes('mobile')
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

  const phoneCategories = [
    {
      id: 1,
      name: 'Smartphones',
      icon: Smartphone,
      description: 'Latest Android and iOS devices',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Tablets',
      icon: Tablet,
      description: 'iPads and Android tablets',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Smartwatches',
      icon: Watch,
      description: 'Apple Watch and Android wearables',
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
            <Smartphone className="inline-block w-8 h-8 mr-2 text-blue-500" />
            Mobile Devices
          </h1>
          <p className="text-xl text-gray-600">Explore the latest smartphones and mobile technology</p>
        </div>

        {/* Phone Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {phoneCategories.map((category) => (
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

        {/* Phone Products */}
        {phoneProducts.length > 0 && (
          <ProductSection
            title="📱 Featured Smartphones"
            subtitle="Latest models with cutting-edge technology"
            products={phoneProducts}
            sectionColor="blue"
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Phones;
