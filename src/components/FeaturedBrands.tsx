
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const brands = [
    {
      name: 'Apple',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
      color: 'from-gray-700 to-gray-800'
    },
    {
      name: 'Samsung',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'DEFY',
      logo: '/lovable-uploads/5fbe7e2c-8754-4920-96d1-0157a744cc23.png',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Hi',
      logo: '/lovable-uploads/36d3d9dc-ec5c-4454-b604-f7c66ecef7b5.png',
      color: 'from-teal-500 to-green-600'
    },
    {
      name: 'Huawei',
      logo: '/lovable-uploads/9ac02366-1460-483d-8d88-8a4b7ed51e34.png',
      color: 'from-red-600 to-pink-600'
    },
    {
      name: 'DOMAX',
      logo: '/lovable-uploads/0ddc703b-d046-4e1d-8c7d-8a5624da50a7.png',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      name: 'Xiaomi',
      logo: '/lovable-uploads/4ce167d6-100c-409a-8a50-a2306b6d912b.png',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'RE/MAX',
      logo: '/lovable-uploads/dd2d5951-1fe9-46d4-8784-0df3aaea7805.png',
      color: 'from-red-500 to-blue-500'
    }
  ];

  const itemsPerPage = isMobile ? 2 : 6;
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentBrands = () => {
    const start = currentIndex * itemsPerPage;
    return brands.slice(start, start + itemsPerPage);
  };

  const handleBrandClick = (brandName: string) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="mb-8 sm:mb-16 px-2 sm:px-0 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl -z-10"></div>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 relative">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trusted Brands
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 font-medium">
            Discover premium technology from world-class manufacturers
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="h-1 w-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex space-x-3 justify-center sm:justify-end">
          <button 
            className="group p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button 
            className="group p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" 
            onClick={nextSlide} 
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {getCurrentBrands().map((brand, index) => (
          <div 
            key={`${brand.name}-${currentIndex}-${index}`} 
            onClick={() => handleBrandClick(brand.name)}
            className="group bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 hover:border-transparent p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden transform hover:-translate-y-2 hover:scale-105"
          >
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`}></div>
            
            {/* Brand logo container */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden relative p-2 sm:p-4">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 max-w-full max-h-full"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load image for ${brand.name}:`, brand.logo);
                    // Fallback: show brand name as text
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center w-full h-full text-gray-700 font-bold text-sm sm:text-base';
                    fallback.textContent = brand.name;
                    target.parentNode?.appendChild(fallback);
                  }}
                />
                
                {/* Overlay gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-2xl`}></div>
              </div>
              
              {/* Brand name */}
              <h3 className="text-center text-sm sm:text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                {brand.name}
              </h3>
              
              {/* Hover effect indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${brand.color} animate-pulse`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 sm:mt-12 space-x-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-600 scale-110 shadow-lg' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
      
      {/* Floating elements decoration */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
    </div>
  );
};

export default FeaturedBrands;
