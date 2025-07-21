
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  
  // Empty brands array - all brands removed
  const brands: any[] = [];

  return (
    <div className="w-full py-4 sm:py-6">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Trusted Brands
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Shop from the world's leading technology brands
        </p>
      </div>
      
      <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {brands.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">
                No brands available at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
              {brands.map((brand, index) => (
                <a
                  key={index}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/48x48/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
