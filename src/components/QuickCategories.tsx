
import React from 'react';
import { Smartphone, Headphones, Laptop, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Smartphones',
      icon: Smartphone,
      count: 8,
      color: 'bg-blue-500',
      path: '/products?category=smartphones'
    },
    {
      name: 'Audio',
      icon: Headphones,
      count: 2,
      color: 'bg-purple-500',
      path: '/products?category=audio'
    },
    {
      name: 'Laptops',
      icon: Laptop,
      count: 4,
      color: 'bg-green-500',
      path: '/products?category=laptops'
    },
    {
      name: 'Cameras',
      icon: Camera,
      count: 3,
      color: 'bg-orange-500',
      path: '/products?category=cameras'
    }
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  const handleAllCategoriesClick = () => {
    navigate('/categories');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Quick Browse</h3>
        <p className="text-sm text-gray-600">Shop by category</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => handleCategoryClick(category.path)}
          >
            <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count} items</span>
            </div>
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Hot
              </div>
            )}
            {index === 2 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Hot
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        onClick={handleAllCategoriesClick}
      >
        All Categories
      </button>
    </div>
  );
};

export default QuickCategories;
