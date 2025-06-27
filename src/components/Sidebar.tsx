
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const categories = [
    { name: 'Smartphones', icon: '📱', items: ['iPhone', 'Samsung', 'Huawei', 'Xiaomi'] },
    { name: 'Laptops & Computers', icon: '💻', items: ['MacBooks', 'Gaming Laptops', 'Desktops'] },
    { name: 'Audio & Headphones', icon: '🎧', items: ['Wireless', 'Gaming', 'Studio'] },
    { name: 'Gaming', icon: '🎮', items: ['Consoles', 'Games', 'Accessories'] },
    { name: 'Electronics', icon: '⚡', items: ['TVs', 'Cameras', 'Tablets'] },
    { name: 'Power & Cables', icon: '🔌', items: ['Power Banks', 'Chargers', 'Cables'] },
    { name: 'Smart Home', icon: '🏠', items: ['Security', 'Lighting', 'Appliances'] },
    { name: 'Cameras', icon: '📷', items: ['DSLR', 'Action Cams', 'Lenses'] }
  ];

  return (
    <div className="w-64 bg-white shadow-sm hidden lg:block">
      <div className="p-4">
        <h3 className="font-semibold text-blue-900 mb-4">Shop by Department</h3>
        <nav className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Flash Deals Sidebar */}
      <div className="mx-4 mb-4 bg-red-500 rounded-lg p-4 text-white">
        <h4 className="font-bold mb-2">Flash Deals</h4>
        <p className="text-sm mb-3">Up to 50% off selected items</p>
        <button className="bg-white text-red-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
          Shop Now
        </button>
      </div>

      {/* New Arrivals Sidebar */}
      <div className="mx-4 bg-blue-500 rounded-lg p-4 text-white">
        <h4 className="font-bold mb-2">New Arrivals</h4>
        <p className="text-sm mb-3">Latest tech products</p>
        <button className="bg-white text-blue-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
