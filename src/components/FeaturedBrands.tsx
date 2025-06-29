
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const brands = [
    { name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop' },
    { name: 'Apple', image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=200&h=200&fit=crop' },
    { name: 'Huawei', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=200&fit=crop' },
    { name: 'Sony', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=200&fit=crop' },
    { name: 'LG', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop' },
    { name: 'Xiaomi', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=200&fit=crop' },
    { name: 'HP', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'Canon', image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=200&fit=crop' },
    { name: 'Dell', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'Microsoft', image: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=200&h=200&fit=crop' },
    { name: 'Google', image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=200&fit=crop' },
    { name: 'OnePlus', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
    { name: 'Lenovo', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'Asus', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b99f0f?w=200&h=200&fit=crop' },
    { name: 'Acer', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'JBL', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=200&fit=crop' },
    { name: 'Bose', image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=200&fit=crop' },
    { name: 'Beats', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop' },
    { name: 'Anker', image: 'https://images.unsplash.com/photo-1609592806689-60c84bdb98d0?w=200&h=200&fit=crop' },
    { name: 'Logitech', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop' }
  ];

  const itemsPerPage = isMobile ? 4 : 8;
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
    <div className="mb-8 sm:mb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Featured Brands</h2>
          <p className="text-sm sm:text-base text-gray-600">Shop from your favorite tech brands</p>
        </div>
        <div className="flex space-x-2 sm:space-x-3 justify-center sm:justify-end">
          <button 
            className="p-2 sm:p-3 rounded-full bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 sm:p-3 rounded-full bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile: 4 columns (2x2), Desktop: 8 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
        {getCurrentBrands().map((brand, index) => (
          <div
            key={`${currentIndex}-${index}`}
            className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-100 p-3 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-md sm:rounded-lg mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
              <img 
                src={brand.image} 
                alt={brand.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-md sm:rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop";
                }}
              />
            </div>
            <p className="text-center text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors truncate">
              {brand.name}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedBrands;
