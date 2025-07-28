
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNavigation from '../components/MobileNavigation';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid3X3, Smartphone, Headphones, Laptop, Watch, Camera, Gamepad2, Tv, Zap } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      icon: Smartphone,
      count: 45,
      description: 'Latest smartphones and accessories',
      color: 'bg-blue-500',
      category: 'phones'
    },
    {
      id: 2,
      name: 'Audio',
      icon: Headphones,
      count: 32,
      description: 'Headphones, speakers, and audio gear',
      color: 'bg-green-500',
      category: 'audio'
    },
    {
      id: 3,
      name: 'Laptops',
      icon: Laptop,
      count: 28,
      description: 'Laptops and computing devices',
      color: 'bg-purple-500',
      category: 'laptops'
    },
    {
      id: 4,
      name: 'Wearables',
      icon: Watch,
      count: 18,
      description: 'Smartwatches and fitness trackers',
      color: 'bg-red-500',
      category: 'wearables'
    },
    {
      id: 5,
      name: 'Cameras',
      icon: Camera,
      count: 25,
      description: 'Digital cameras and photography gear',
      color: 'bg-yellow-500',
      category: 'cameras'
    },
    {
      id: 6,
      name: 'Gaming',
      icon: Gamepad2,
      count: 35,
      description: 'Gaming consoles and accessories',
      color: 'bg-indigo-500',
      category: 'gaming'
    },
    {
      id: 7,
      name: 'TV & Home',
      icon: Tv,
      count: 22,
      description: 'Smart TVs and home entertainment',
      color: 'bg-pink-500',
      category: 'tv-home'
    },
    {
      id: 8,
      name: 'Electronics',
      icon: Zap,
      count: 40,
      description: 'Power banks, cables, and accessories',
      color: 'bg-orange-500',
      category: 'electronics'
    }
  ];

  const handleCategoryClick = (category: any) => {
    navigate(`/products?category=${category.category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className={`max-w-7xl mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-gray-600">Explore our wide range of tech products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer transform hover:-translate-y-1 hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{category.name}</h3>
              <p className="text-gray-600 mb-3 text-center text-sm">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.count} products</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/deals')}
            >
              <h3 className="text-2xl font-bold mb-2">Flash Deals</h3>
              <p className="mb-4">Up to 50% off on selected items</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Deals
              </button>
            </div>
            <div 
              className="relative bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/new-arrivals')}
            >
              <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
              <p className="mb-4">Latest tech products just landed</p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Explore New
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Desktop Only */}
      {!isMobile && <Footer />}
      
      {/* Mobile Navigation - Always visible on mobile */}
      <MobileNavigation />
    </div>
  );
};

export default Categories;
