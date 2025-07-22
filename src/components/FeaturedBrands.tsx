
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturedBrands = () => {
  const isMobile = useIsMobile();
  
  // Brand logos with functional links - Samsung and Apple removed
  const brands = [
    {
      name: 'PlayStation',
      logo: '/lovable-uploads/7ff66028-3d91-4af9-b272-7009eb87f13b.png',
      url: '/products?brand=playstation'
    },
    {
      name: 'Hisense',
      logo: '/lovable-uploads/508f6176-c6cf-4c01-b7d4-3f1845948212.png',
      url: '/products?brand=hisense'
    },
    {
      name: 'Huawei',
      logo: '/lovable-uploads/9b7ce684-d059-4786-961d-5409535966c0.png',
      url: '/products?brand=huawei'
    },
    {
      name: 'DOTMAX',
      logo: '/lovable-uploads/31cc2990-e814-49fd-b920-e4280e4151c3.png',
      url: '/products?brand=dotmax'
    },
    {
      name: 'Sony',
      logo: '/lovable-uploads/42647a5a-c168-4d2f-850c-28be6a222268.png',
      url: '/products?brand=sony'
    },
    {
      name: 'Vodafone',
      logo: '/lovable-uploads/178181c8-c57d-4d92-9b14-7cc56812f0d6.png',
      url: '/products?brand=vodafone'
    },
    {
      name: 'ASUS',
      logo: '/lovable-uploads/a5acc118-aa35-40c9-ac78-658473318864.png',
      url: '/products?brand=asus'
    },
    {
      name: 'HP',
      logo: '/lovable-uploads/85d21b6f-21ae-4fd0-a605-97b7046873eb.png',
      url: '/products?brand=hp'
    },
    {
      name: 'Hi',
      logo: '/lovable-uploads/fbe0a02b-d58e-4d8f-95c7-7dfbff98c3db.png',
      url: '/products?brand=hi'
    },
    {
      name: 'LG',
      logo: '/lovable-uploads/96072f96-33db-4a2a-854f-ad95d2f76406.png',
      url: '/products?brand=lg'
    }
  ];

  return (
    <div className="w-full py-6 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Trusted Brands
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Shop from the world's leading technology brands
        </p>
      </div>
      
      <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm">
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
                <CarouselItem key={index} className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <a
                    href={brand.url}
                    className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 h-full"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm border border-gray-100">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain p-2 sm:p-3"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/128x128/e5e7eb/6b7280?text=${brand.name.charAt(0)}`;
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 mt-2 sm:mt-3 group-hover:text-gray-900 transition-colors text-center">
                      {brand.name}
                    </span>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedBrands;
