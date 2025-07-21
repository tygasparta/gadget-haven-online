
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const brands = [
    {
      name: 'Apple',
      logo: '/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png',
      searchTerm: 'Apple'
    },
    {
      name: 'Samsung',
      logo: '/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png',
      searchTerm: 'Samsung'
    },
    {
      name: 'Sony',
      logo: '/lovable-uploads/0ddc703b-d046-4e1d-8c7d-8a5624da50a7.png',
      searchTerm: 'Sony'
    },
    {
      name: 'Microsoft',
      logo: '/lovable-uploads/13f14634-a87f-479a-9c94-2f51dbc3dff8.png',
      searchTerm: 'Microsoft'
    },
    {
      name: 'Google',
      logo: '/lovable-uploads/30057c3b-ae96-41a4-bfa6-1aeb58d94099.png',
      searchTerm: 'Google'
    },
    {
      name: 'HP',
      logo: '/lovable-uploads/36d3d9dc-ec5c-4454-b604-f7c66ecef7b5.png',
      searchTerm: 'HP'
    },
    {
      name: 'Dell',
      logo: '/lovable-uploads/4ce167d6-100c-409a-8a50-a2306b6d912b.png',
      searchTerm: 'Dell'
    },
    {
      name: 'Lenovo',
      logo: '/lovable-uploads/5fbe7e2c-8754-4920-96d1-0157a744cc23.png',
      searchTerm: 'Lenovo'
    }
  ];

  // Determine logo size based on device
  const getLogoSize = () => {
    if (isMobile) return 'w-12 h-12'; // Mobile: smaller
    return 'w-10 h-10 md:w-12 md:h-12'; // Tablet: reduced size, Desktop: normal
  };

  const handleBrandClick = (brand: { name: string; searchTerm: string }) => {
    // Navigate to products page with brand filter
    navigate(`/products?brand=${encodeURIComponent(brand.searchTerm)}`);
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
              <button
                key={index}
                onClick={() => handleBrandClick(brand)}
                className="group flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className={`${getLogoSize()} rounded-lg bg-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm`}>
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/48x48/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
