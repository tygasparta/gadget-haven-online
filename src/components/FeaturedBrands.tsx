
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedBrands = () => {
  const brands = [
    { name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop' },
    { name: 'Apple', image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=200&h=200&fit=crop' },
    { name: 'Huawei', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=200&fit=crop' },
    { name: 'Sony', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=200&fit=crop' },
    { name: 'LG', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop' },
    { name: 'Xiaomi', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=200&fit=crop' },
    { name: 'HP', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'Canon', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=200&fit=crop' }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Brands</h2>
          <p className="text-gray-600">Shop from your favorite tech brands</p>
        </div>
        <div className="flex space-x-3">
          <button className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              <img 
                src={brand.image} 
                alt={brand.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop";
                }}
              />
            </div>
            <p className="text-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {brand.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrands;
