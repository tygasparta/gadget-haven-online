
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  
  const brands = [
    {
      name: 'Apple',
      logo: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Samsung',
      logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Sony',
      logo: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Google',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'HP',
      logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Dell',
      logo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop&crop=center'
    },
    {
      name: 'Lenovo',
      logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop&crop=center'
    }
  ];

  // Determine logo size based on device
  const getLogoSize = () => {
    if (isMobile) return 'w-16 h-16'; // Mobile: smaller
    return 'w-12 h-12 md:w-16 md:h-16'; // Tablet: reduced size, Desktop: normal
  };

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
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className={`${getLogoSize()} rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/64x64/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
