
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const categories = [
    { 
      name: 'Smartphones', 
      icon: '📱', 
      items: [
        { name: 'iPhone', path: '/phones?brand=apple' },
        { name: 'Samsung', path: '/phones?brand=samsung' },
        { name: 'Huawei', path: '/phones?brand=huawei' },
        { name: 'Xiaomi', path: '/phones?brand=xiaomi' }
      ],
      path: '/phones'
    },
    { 
      name: 'Laptops & Computers', 
      icon: '💻', 
      items: [
        { name: 'MacBooks', path: '/categories?category=laptops&brand=apple' },
        { name: 'Gaming Laptops', path: '/categories?category=laptops&type=gaming' },
        { name: 'Desktops', path: '/categories?category=computers' }
      ],
      path: '/categories?category=laptops'
    },
    { 
      name: 'Audio & Headphones', 
      icon: '🎧', 
      items: [
        { name: 'Wireless', path: '/audio?type=wireless' },
        { name: 'Gaming', path: '/audio?type=gaming' },
        { name: 'Studio', path: '/audio?type=studio' }
      ],
      path: '/audio'
    },
    { 
      name: 'Gaming', 
      icon: '🎮', 
      items: [
        { name: 'Consoles', path: '/categories?category=gaming&type=consoles' },
        { name: 'Games', path: '/categories?category=gaming&type=games' },
        { name: 'Accessories', path: '/categories?category=gaming&type=accessories' }
      ],
      path: '/categories?category=gaming'
    },
    { 
      name: 'Electronics', 
      icon: '⚡', 
      items: [
        { name: 'TVs', path: '/categories?category=electronics&type=tv' },
        { name: 'Cameras', path: '/categories?category=electronics&type=cameras' },
        { name: 'Tablets', path: '/categories?category=electronics&type=tablets' }
      ],
      path: '/categories?category=electronics'
    },
    { 
      name: 'Power & Cables', 
      icon: '🔌', 
      items: [
        { name: 'Power Banks', path: '/categories?category=accessories&type=power-banks' },
        { name: 'Chargers', path: '/categories?category=accessories&type=chargers' },
        { name: 'Cables', path: '/categories?category=accessories&type=cables' }
      ],
      path: '/categories?category=accessories'
    },
    { 
      name: 'Smart Home', 
      icon: '🏠', 
      items: [
        { name: 'Security', path: '/categories?category=smart-home&type=security' },
        { name: 'Lighting', path: '/categories?category=smart-home&type=lighting' },
        { name: 'Appliances', path: '/categories?category=smart-home&type=appliances' }
      ],
      path: '/categories?category=smart-home'
    },
    { 
      name: 'Cameras', 
      icon: '📷', 
      items: [
        { name: 'DSLR', path: '/categories?category=cameras&type=dslr' },
        { name: 'Action Cams', path: '/categories?category=cameras&type=action' },
        { name: 'Lenses', path: '/categories?category=cameras&type=lenses' }
      ],
      path: '/categories?category=cameras'
    }
  ];

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCategoryClick = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleSubItemClick = (path: string) => {
    console.log('Navigating to sub-item:', path);
    navigate(path);
  };

  return (
    <div className="w-64 bg-white shadow-sm hidden lg:block">
      <div className="p-4">
        <h3 className="font-semibold text-blue-900 mb-4">Shop by Department</h3>
        <nav className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="group">
              <div 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleCategory(index)}
              >
                <div 
                  className="flex items-center flex-1 hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category.path);
                  }}
                >
                  <span className="text-lg mr-3">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{category.name}</span>
                </div>
                {expandedCategories.includes(index) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                )}
              </div>
              
              {/* Subcategories */}
              {expandedCategories.includes(index) && (
                <div className="ml-6 mt-2 space-y-1 animate-fade-in">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                      onClick={() => handleSubItemClick(item.path)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Flash Deals Sidebar */}
      <div className="mx-4 mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
        <h4 className="font-bold mb-2">Flash Deals</h4>
        <p className="text-sm mb-3 opacity-90">Up to 50% off selected items</p>
        <button 
          className="bg-white text-red-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors w-full"
          onClick={() => navigate('/deals')}
        >
          Shop Now
        </button>
      </div>

      {/* New Arrivals Sidebar */}
      <div className="mx-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
        <h4 className="font-bold mb-2">New Arrivals</h4>
        <p className="text-sm mb-3 opacity-90">Latest tech products</p>
        <button 
          className="bg-white text-blue-500 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition-colors w-full"
          onClick={() => navigate('/categories?featured=new')}
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
