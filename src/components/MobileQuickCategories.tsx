
import React from 'react';
import { Smartphone, Headphones, Laptop, Watch, Camera, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileQuickCategories = () => {
  const categories = [
    { icon: Smartphone, label: 'Phones', path: '/phones', color: 'from-blue-500 to-blue-600' },
    { icon: Headphones, label: 'Audio', path: '/audio', color: 'from-purple-500 to-purple-600' },
    { icon: Laptop, label: 'Laptops', path: '/categories', color: 'from-green-500 to-green-600' },
    { icon: Watch, label: 'Watches', path: '/categories', color: 'from-orange-500 to-orange-600' },
    { icon: Camera, label: 'Cameras', path: '/categories', color: 'from-pink-500 to-pink-600' },
    { icon: Gamepad2, label: 'Gaming', path: '/categories', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="md:hidden bg-white rounded-2xl shadow-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.label}
            to={category.path}
            className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} mb-2`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{category.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileQuickCategories;
