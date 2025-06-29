
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const brands = [
    { 
      name: 'Samsung', 
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop&crop=center',
      description: 'Innovation & Quality',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Apple', 
      image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=300&h=300&fit=crop&crop=center',
      description: 'Premium Design',
      color: 'from-gray-700 to-gray-800'
    },
    { 
      name: 'Sony', 
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=300&fit=crop&crop=center',
      description: 'Audio Excellence',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'LG', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop&crop=center',
      description: 'Smart Living',
      color: 'from-red-500 to-red-600'
    },
    { 
      name: 'Dell', 
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&crop=center',
      description: 'Computing Power',
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      name: 'HP', 
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b99f0f?w=300&h=300&fit=crop&crop=center',
      description: 'Professional Tech',
      color: 'from-teal-500 to-cyan-600'
    },
    { 
      name: 'Canon', 
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop&crop=center',
      description: 'Imaging Pioneer',
      color: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Microsoft', 
      image: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=300&h=300&fit=crop&crop=center',
      description: 'Software Giant',
      color: 'from-green-500 to-blue-500'
    },
    { 
      name: 'Google', 
      image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=300&h=300&fit=crop&crop=center',
      description: 'Search & AI',
      color: 'from-yellow-400 to-red-500'
    },
    { 
      name: 'Lenovo', 
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop&crop=center',
      description: 'ThinkPad Legacy',
      color: 'from-gray-600 to-gray-700'
    },
    { 
      name: 'Asus', 
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop&crop=center',
      description: 'Gaming Beast',
      color: 'from-orange-600 to-yellow-500'
    },
    { 
      name: 'JBL', 
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&crop=center',
      description: 'Sound Revolution',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Bose', 
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop&crop=center',
      description: 'Premium Audio',
      color: 'from-gray-800 to-black'
    },
    { 
      name: 'Beats', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
      description: 'Music Lifestyle',
      color: 'from-red-600 to-pink-600'
    },
    { 
      name: 'Anker', 
      image: 'https://images.unsplash.com/photo-1609592806689-60c84bdb98d0?w=300&h=300&fit=crop&crop=center',
      description: 'Power Solutions',
      color: 'from-blue-500 to-teal-500'
    },
    { 
      name: 'Logitech', 
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center',
      description: 'Gaming Gear',
      color: 'from-blue-600 to-purple-600'
    }
  ];

  const itemsPerPage = isMobile ? 2 : 6;
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentBrands = () => {
    const start = currentIndex * itemsPerPage;
    return brands.slice(start, start + itemsPerPage);
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
            key={`${currentIndex}-${index}`}
            className="group bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 hover:border-transparent p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden transform hover:-translate-y-2 hover:scale-105"
          >
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`}></div>
            
            {/* Brand image container */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl sm:rounded-2xl filter group-hover:brightness-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop";
                  }}
                />
                
                {/* Overlay gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl sm:rounded-2xl`}></div>
              </div>
              
              {/* Brand info */}
              <div className="text-center relative z-10">
                <h3 className="text-sm sm:text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors mb-1">
                  {brand.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors font-medium">
                  {brand.description}
                </p>
              </div>
              
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
