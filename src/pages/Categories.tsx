
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Grid3X3, Smartphone, Headphones, Laptop, Watch, Camera } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      icon: Smartphone,
      count: 45,
      description: 'Latest smartphones and accessories',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Audio',
      icon: Headphones,
      count: 32,
      description: 'Headphones, speakers, and audio gear',
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Laptops',
      icon: Laptop,
      count: 28,
      description: 'Laptops and computing devices',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Wearables',
      icon: Watch,
      count: 18,
      description: 'Smartwatches and fitness trackers',
      color: 'bg-red-500'
    },
    {
      id: 5,
      name: 'Cameras',
      icon: Camera,
      count: 25,
      description: 'Digital cameras and photography gear',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-gray-600">Explore our wide range of tech products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-3">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.count} products</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
