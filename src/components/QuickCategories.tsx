
import React from 'react';
import { Smartphone, Headphones, Laptop, Camera, Watch, Gamepad2, Tablet, Speaker } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QuickCategories = () => {
  const categories = [
    { name: "Smartphones", icon: Smartphone, count: 245, color: "bg-blue-500", popular: true },
    { name: "Audio", icon: Headphones, count: 189, color: "bg-purple-500", popular: false },
    { name: "Laptops", icon: Laptop, count: 156, color: "bg-green-500", popular: true },
    { name: "Cameras", icon: Camera, count: 98, color: "bg-orange-500", popular: false },
    { name: "Watches", icon: Watch, count: 134, color: "bg-pink-500", popular: false },
    { name: "Gaming", icon: Gamepad2, count: 87, color: "bg-red-500", popular: true },
    { name: "Tablets", icon: Tablet, count: 76, color: "bg-indigo-500", popular: false },
    { name: "Speakers", icon: Speaker, count: 65, color: "bg-teal-500", popular: false }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Quick Browse</h3>
          <p className="text-sm text-gray-600">Shop by category</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          All Categories
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            {category.popular && (
              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1">
                Hot
              </Badge>
            )}
            
            <div className="text-center">
              <div className={`${category.color} p-3 rounded-xl mx-auto w-fit mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1">{category.name}</h4>
              <p className="text-xs text-gray-500">{category.count} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickCategories;
