
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedBrands = () => {
  const brands = [
    { name: 'Samsung', image: '/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png' },
    { name: 'Apple', image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png' },
    { name: 'Huawei', image: '/lovable-uploads/30057c3b-ae96-41a4-bfa6-1aeb58d94099.png' },
    { name: 'Sony', image: '/lovable-uploads/d81d319e-54ab-4282-9501-5d174d3ddc41.png' },
    { name: 'LG', image: '/lovable-uploads/7a8cf411-d2ed-4aba-9754-9c2c6fcc6c92.png' },
    { name: 'Xiaomi', image: '/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png' },
    { name: 'HP', image: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png' },
    { name: 'Canon', image: '/lovable-uploads/30057c3b-ae96-41a4-bfa6-1aeb58d94099.png' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Brands</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full border hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full border hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
              <img 
                src={brand.image} 
                alt={brand.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-700">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrands;
