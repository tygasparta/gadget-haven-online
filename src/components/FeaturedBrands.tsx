import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

const FeaturedBrands = () => {
  const navigate = useNavigate();
  
  const brands = [
    { name: 'Samsung', logo: '/lovable-uploads/5aef0a9d-04f9-41d0-8d6e-15968139f07b.png', brandKey: 'samsung' },
    { name: 'Apple', logo: '/lovable-uploads/87d49910-7e5d-4ce7-9245-d001dd8e7926.png', brandKey: 'apple' },
    { name: 'PlayStation', logo: '/lovable-uploads/7ff66028-3d91-4af9-b272-7009eb87f13b.png', brandKey: 'playstation' },
    { name: 'Hisense', logo: '/lovable-uploads/508f6176-c6cf-4c01-b7d4-3f1845948212.png', brandKey: 'hisense' },
    { name: 'Huawei', logo: '/lovable-uploads/9b7ce684-d059-4786-961d-5409535966c0.png', brandKey: 'huawei' },
    { name: 'DOTMAX', logo: '/lovable-uploads/31cc2990-e814-49fd-b920-e4280e4151c3.png', brandKey: 'dotmax' },
    { name: 'Sony', logo: '/lovable-uploads/42647a5a-c168-4d2f-850c-28be6a222268.png', brandKey: 'sony' },
    { name: 'ASUS', logo: '/lovable-uploads/a5acc118-aa35-40c9-ac78-658473318864.png', brandKey: 'asus' },
    { name: 'HP', logo: '/lovable-uploads/85d21b6f-21ae-4fd0-a605-97b7046873eb.png', brandKey: 'hp' },
    { name: 'LG', logo: '/lovable-uploads/96072f96-33db-4a2a-854f-ad95d2f76406.png', brandKey: 'lg' }
  ];

  return (
    <div className="w-full mb-8 sm:mb-16">
      <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Popular Brands</h2>

      <div className="relative bg-card border border-border rounded-xl p-4 sm:p-6">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2">
            {brands.map((brand, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                <button
                  onClick={() => navigate(`/products?brand=${brand.brandKey}`)}
                  className="flex items-center justify-center p-3 rounded-lg hover:bg-muted/60 transition-colors w-full"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/120x48/f3f4f6/9ca3af?text=${brand.name}`;
                    }}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 w-8 h-8" />
          <CarouselNext className="hidden sm:flex -right-4 w-8 h-8" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedBrands;
