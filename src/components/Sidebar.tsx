import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const categories = [
    { name: 'Smartphones', path: '/products?category=smartphones', items: [
      { name: 'iPhone', path: '/products?category=smartphones&brand=apple' },
      { name: 'Samsung', path: '/products?category=smartphones&brand=samsung' },
      { name: 'Huawei', path: '/products?category=smartphones&brand=huawei' },
      { name: 'Xiaomi', path: '/products?category=smartphones&brand=xiaomi' }
    ]},
    { name: 'Laptops & Computers', path: '/products?category=laptops', items: [
      { name: 'MacBooks', path: '/products?category=laptops&brand=apple' },
      { name: 'Gaming Laptops', path: '/products?category=laptops&type=gaming' },
      { name: 'Desktops', path: '/products?category=computers' }
    ]},
    { name: 'Audio & Headphones', path: '/products?category=audio', items: [
      { name: 'Wireless', path: '/products?category=audio&type=wireless' },
      { name: 'Gaming', path: '/products?category=audio&type=gaming' },
      { name: 'Studio', path: '/products?category=audio&type=studio' }
    ]},
    { name: 'Gaming', path: '/products?category=gaming', items: [
      { name: 'Consoles', path: '/products?category=gaming&type=consoles' },
      { name: 'Games', path: '/products?category=gaming&type=games' },
      { name: 'Accessories', path: '/products?category=gaming&type=accessories' }
    ]},
    { name: 'Electronics', path: '/products?category=electronics', items: [
      { name: 'TVs', path: '/products?category=electronics&type=tv' },
      { name: 'Cameras', path: '/products?category=electronics&type=cameras' },
      { name: 'Tablets', path: '/products?category=electronics&type=tablets' }
    ]},
    { name: 'Power & Cables', path: '/products?category=accessories', items: [
      { name: 'Power Banks', path: '/products?category=accessories&type=power-banks' },
      { name: 'Chargers', path: '/products?category=accessories&type=chargers' },
      { name: 'Cables', path: '/products?category=accessories&type=cables' }
    ]},
    { name: 'Smart Home', path: '/products?category=smart-home', items: [
      { name: 'Security', path: '/products?category=smart-home&type=security' },
      { name: 'Lighting', path: '/products?category=smart-home&type=lighting' },
      { name: 'Appliances', path: '/products?category=smart-home&type=appliances' }
    ]},
    { name: 'Cameras', path: '/products?category=cameras', items: [
      { name: 'DSLR', path: '/products?category=cameras&type=dslr' },
      { name: 'Action Cams', path: '/products?category=cameras&type=action' },
      { name: 'Lenses', path: '/products?category=cameras&type=lenses' }
    ]}
  ];

  const toggleCategory = (index: number) => {
    setExpandedCategories(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-sm hidden lg:block">
      {/* Blue header - Takealot style */}
      <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-sm">
        <h3 className="font-semibold text-sm">Shop by Department</h3>
      </div>
      
      <nav className="py-1">
        {categories.map((category, index) => (
          <div key={index}>
            <div 
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => toggleCategory(index)}
            >
              <span 
                className="text-sm text-gray-700 hover:text-primary transition-colors flex-1"
                onClick={(e) => { e.stopPropagation(); navigate(category.path); }}
              >
                {category.name}
              </span>
              {expandedCategories.includes(index) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            {expandedCategories.includes(index) && (
              <div className="bg-gray-50 py-1">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="text-sm text-gray-600 hover:text-primary cursor-pointer py-2 px-8 hover:bg-gray-100 transition-colors"
                    onClick={() => navigate(item.path)}
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
  );
};

export default Sidebar;
