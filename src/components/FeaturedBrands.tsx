
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  
  // Brand logos with functional links
  const brands = [
    {
      name: 'PlayStation',
      logo: '/lovable-uploads/7ff66028-3d91-4af9-b272-7009eb87f13b.png',
      url: 'https://www.playstation.com'
    },
    {
      name: 'Hisense',
      logo: '/lovable-uploads/508f6176-c6cf-4c01-b7d4-3f1845948212.png',
      url: 'https://www.hisense.com'
    },
    {
      name: 'Huawei',
      logo: '/lovable-uploads/9b7ce684-d059-4786-961d-5409535966c0.png',
      url: 'https://www.huawei.com'
    },
    {
      name: 'DOTMAX',
      logo: '/lovable-uploads/31cc2990-e814-49fd-b920-e4280e4151c3.png',
      url: '#'
    },
    {
      name: 'Sony',
      logo: '/lovable-uploads/42647a5a-c168-4d2f-850c-28be6a222268.png',
      url: 'https://www.sony.com'
    },
    {
      name: 'Vodafone',
      logo: '/lovable-uploads/178181c8-c57d-4d92-9b14-7cc56812f0d6.png',
      url: 'https://www.vodafone.com'
    },
    {
      name: 'ASUS',
      logo: '/lovable-uploads/a5acc118-aa35-40c9-ac78-658473318864.png',
      url: 'https://www.asus.com'
    },
    {
      name: 'HP',
      logo: '/lovable-uploads/85d21b6f-21ae-4fd0-a605-97b7046873eb.png',
      url: 'https://www.hp.com'
    },
    {
      name: 'Hi',
      logo: '/lovable-uploads/fbe0a02b-d58e-4d8f-95c7-7dfbff98c3db.png',
      url: '#'
    },
    {
      name: 'LG',
      logo: '/lovable-uploads/96072f96-33db-4a2a-854f-ad95d2f76406.png',
      url: 'https://www.lg.com'
    },
    {
      name: 'Samsung',
      logo: 'https://images.unsplash.com/photo-1610792516307-4b3b2d94e5ac?w=200&h=200&fit=crop&crop=center',
      url: 'https://www.samsung.com'
    },
    {
      name: 'iPhone',
      logo: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=200&h=200&fit=crop&crop=center',
      url: 'https://www.apple.com/iphone'
    }
  ];

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
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6">
            {brands.map((brand, index) => (
              <a
                key={index}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/56x56/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
