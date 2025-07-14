import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
const FeaturedBrands = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const brands = [{
    name: 'Samsung',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
    color: 'from-blue-500 to-blue-600'
  }, {
    name: 'Apple',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
    color: 'from-gray-700 to-gray-800'
  }, {
    name: 'Sony',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png',
    color: 'from-purple-500 to-purple-600'
  }, {
    name: 'LG',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/LG-Logo.png',
    color: 'from-red-500 to-red-600'
  }, {
    name: 'Dell',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Dell-Logo.png',
    color: 'from-blue-600 to-indigo-600'
  }, {
    name: 'HP',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/HP-Logo.png',
    color: 'from-teal-500 to-cyan-600'
  }, {
    name: 'Canon',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Canon-Logo.png',
    color: 'from-orange-500 to-red-500'
  }, {
    name: 'Microsoft',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png',
    color: 'from-green-500 to-blue-500'
  }, {
    name: 'Google',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Google-Logo.png',
    color: 'from-yellow-400 to-red-500'
  }, {
    name: 'Lenovo',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Lenovo-Logo.png',
    color: 'from-gray-600 to-gray-700'
  }, {
    name: 'Asus',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Asus-Logo.png',
    color: 'from-orange-600 to-yellow-500'
  }, {
    name: 'JBL',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/JBL-Logo.png',
    color: 'from-orange-500 to-orange-600'
  }, {
    name: 'Bose',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Bose-Logo.png',
    color: 'from-gray-800 to-black'
  }, {
    name: 'Beats',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Beats-Logo.png',
    color: 'from-red-600 to-pink-600'
  }, {
    name: 'Anker',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Anker-Logo.png',
    color: 'from-blue-500 to-teal-500'
  }, {
    name: 'Logitech',
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Logitech-Logo.png',
    color: 'from-blue-600 to-purple-600'
  }, {
    name: 'DEFY',
    logo: '/lovable-uploads/ab88f90b-e334-4aab-a573-cbf5ac3bd7a0.png',
    color: 'from-red-500 to-red-600'
  }, {
    name: 'Hi',
    logo: '/lovable-uploads/b4327d38-07c3-4648-977f-e881ea91d4fb.png',
    color: 'from-teal-500 to-green-600'
  }, {
    name: 'Huawei',
    logo: '/lovable-uploads/68b8d5b7-a7be-46cf-ad6f-92731e8b8313.png',
    color: 'from-red-600 to-pink-600'
  }, {
    name: 'DOMAX',
    logo: '/lovable-uploads/eb0219a5-d68a-4b69-8055-172b2f5982d5.png',
    color: 'from-blue-600 to-indigo-700'
  }, {
    name: 'Xiaomi',
    logo: '/lovable-uploads/13f14634-a87f-479a-9c94-2f51dbc3dff8.png',
    color: 'from-orange-500 to-orange-600'
  }, {
    name: 'RE/MAX',
    logo: '/lovable-uploads/ba315e55-1352-462f-a934-e9ab4ebb1f24.png',
    color: 'from-red-500 to-blue-500'
  }];
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
    // Navigate to a filtered products page by brand
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };
  return <div className="mb-8 sm:mb-16 px-2 sm:px-0 relative">
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
          <button className="group p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
          <button className="group p-3 sm:p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-1" onClick={nextSlide} disabled={currentIndex === totalPages - 1}>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {getCurrentBrands().map((brand, index) => <div key={`${currentIndex}-${index}`} onClick={() => handleBrandClick(brand.name)} className="group bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 hover:border-transparent p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden transform hover:-translate-y-2 hover:scale-105">
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`}></div>
            
            {/* Brand logo container */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden relative p-4">
                
                
                {/* Overlay gradient on hover */}
                
              </div>
              
              {/* Hover effect indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${brand.color} animate-pulse`}></div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Enhanced Pagination dots */}
      {totalPages > 1 && <div className="flex justify-center mt-8 sm:mt-12 space-x-3">
          {Array.from({
        length: totalPages
      }).map((_, index) => <button key={index} className={`transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-600 scale-110 shadow-lg' : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'}`} onClick={() => setCurrentIndex(index)} />)}
        </div>}
      
      {/* Floating elements decoration */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
    </div>;
};
export default FeaturedBrands;