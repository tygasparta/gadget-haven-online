
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
      name: 'DOOMAX',
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
    },
    {
      name: 'Hisense',
      logo: '/lovable-uploads/13f14634-a87f-479a-9c94-2f51dbc3dff8.png',
      color: 'from-blue-600 to-teal-600'
    },
    {
      name: 'TCL',
      logo: '/lovable-uploads/68b8d5b7-a7be-46cf-ad6f-92731e8b8313.png',
      color: 'from-red-600 to-orange-600'
    },
    {
      name: 'LG',
      logo: '/lovable-uploads/ab88f90b-e334-4aab-a573-cbf5ac3bd7a0.png',
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'Sony',
      logo: '/lovable-uploads/ba315e55-1352-462f-a934-e9ab4ebb1f24.png',
      color: 'from-black to-gray-800'
    },
    {
      name: 'Canon',
      logo: '/lovable-uploads/b4327d38-07c3-4648-977f-e881ea91d4fb.png',
      color: 'from-red-600 to-black'
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
    <div className="mb-8 sm:mb-16 px-2 sm:px-4 lg:px-0 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-2xl sm:rounded-3xl -z-10"></div>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-10 relative px-2 sm:px-0">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <Award className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl animate-pulse">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-800 mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trusted Brands
          </h2>
          <p className="text-xs sm:text-sm lg:text-lg text-gray-600 font-medium">
            Discover premium technology from world-class manufacturers
          </p>
          <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2">
            <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="h-0.5 sm:h-1 w-3 sm:w-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Navigation Controls - More Mobile Friendly */}
        <div className="flex space-x-2 sm:space-x-3 justify-center sm:justify-end">
          <button 
            className="group p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button 
            className="group p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" 
            onClick={nextSlide} 
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Brands Grid - Enhanced Mobile Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {getCurrentBrands().map((brand, index) => (
          <div 
            key={`${brand.name}-${currentIndex}-${index}`} 
            onClick={() => handleBrandClick(brand.name)}
            className="group bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-transparent p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105"
          >
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl sm:rounded-2xl lg:rounded-3xl`}></div>
            
            {/* Brand logo container */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center overflow-hidden relative p-2 sm:p-3 lg:p-4">
                <img 
                  src={brand.logo} 
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 max-w-full max-h-full"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load image for ${brand.name}:`, brand.logo);
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center w-full h-full text-gray-700 font-bold text-xs sm:text-sm lg:text-base';
                    fallback.textContent = brand.name;
                    target.parentNode?.appendChild(fallback);
                  }}
                />
                
                {/* Overlay gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg sm:rounded-xl lg:rounded-2xl`}></div>
              </div>
              
              {/* Hover effect indicator */}
              <div className="absolute top-1 sm:top-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${brand.color} animate-pulse`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination dots - Mobile Optimized */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12 space-x-2 sm:space-x-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-6 sm:w-8 h-2 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-600 scale-110 shadow-lg' 
                  : 'w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
      
      {/* Floating elements decoration - Adjusted for mobile */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-1 sm:w-2 h-1 sm:h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/2 right-4 sm:right-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
    </div>
  );
};

export default FeaturedBrands;
