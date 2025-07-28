
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Brand logos with functional links - now including Samsung and Apple
  const brands = [
    {
      name: 'Samsung',
      logo: '/lovable-uploads/5aef0a9d-04f9-41d0-8d6e-15968139f07b.png',
      brandKey: 'samsung'
    },
    {
      name: 'Apple',
      logo: '/lovable-uploads/87d49910-7e5d-4ce7-9245-d001dd8e7926.png',
      brandKey: 'apple'
    },
    {
      name: 'PlayStation',
      logo: '/lovable-uploads/7ff66028-3d91-4af9-b272-7009eb87f13b.png',
      brandKey: 'playstation'
    },
    {
      name: 'Hisense',
      logo: '/lovable-uploads/508f6176-c6cf-4c01-b7d4-3f1845948212.png',
      brandKey: 'hisense'
    },
    {
      name: 'Huawei',
      logo: '/lovable-uploads/9b7ce684-d059-4786-961d-5409535966c0.png',
      brandKey: 'huawei'
    },
    {
      name: 'DOTMAX',
      logo: '/lovable-uploads/31cc2990-e814-49fd-b920-e4280e4151c3.png',
      brandKey: 'dotmax'
    },
    {
      name: 'Sony',
      logo: '/lovable-uploads/42647a5a-c168-4d2f-850c-28be6a222268.png',
      brandKey: 'sony'
    },
    {
      name: 'Vodafone',
      logo: '/lovable-uploads/178181c8-c57d-4d92-9b14-7cc56812f0d6.png',
      brandKey: 'vodafone'
    },
    {
      name: 'ASUS',
      logo: '/lovable-uploads/a5acc118-aa35-40c9-ac78-658473318864.png',
      brandKey: 'asus'
    },
    {
      name: 'HP',
      logo: '/lovable-uploads/85d21b6f-21ae-4fd0-a605-97b7046873eb.png',
      brandKey: 'hp'
    },
    {
      name: 'LG',
      logo: '/lovable-uploads/96072f96-33db-4a2a-854f-ad95d2f76406.png',
      brandKey: 'lg'
    }
  ];

  const handleBrandClick = (brandKey: string) => {
    navigate(`/products?brand=${brandKey}`);
  };

  return (
    <div className="w-full py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <div className="relative inline-block">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-fade-in animation-delay-200 relative">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Trusted Brands
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-sm -z-10 animate-pulse"></div>
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 animate-fade-in animation-delay-400">
          Shop from the world's leading technology brands
        </p>
      </div>
      
      <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm animate-fade-in animation-delay-400 hover:shadow-lg transition-all duration-500">
        <CardContent className="p-6 sm:p-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {brands.map((brand, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 animate-fade-in"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <button
                    onClick={() => handleBrandClick(brand.brandKey)}
                    className="group flex items-center justify-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 h-full transform hover:scale-105 w-full"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-lg">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain p-2 sm:p-3 transition-all duration-300 group-hover:brightness-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/128x128/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                        }}
                      />
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12 hover:scale-110 transition-transform duration-200" />
            <CarouselNext className="hidden sm:flex -right-12 hover:scale-110 transition-transform duration-200" />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
