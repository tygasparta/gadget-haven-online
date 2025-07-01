
import React from 'react';
import { TrendingUp, Star, Timer, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const TrendingCarousel = () => {
  const trendingProducts = [
    {
      id: 1,
      name: "AirPods Pro 2nd Gen",
      price: "$249",
      originalPrice: "$279",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
      trend: "+23%",
      rating: 4.8,
      category: "Audio"
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: "$999",
      originalPrice: "$1199",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      trend: "+18%",
      rating: 4.9,
      category: "Smartphones"
    },
    {
      id: 3,
      name: "MacBook Air M3",
      price: "$1099",
      originalPrice: "$1299",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      trend: "+15%",
      rating: 4.7,
      category: "Laptops"
    },
    {
      id: 4,
      name: "Samsung Galaxy Watch",
      price: "$199",
      originalPrice: "$249",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      trend: "+12%",
      rating: 4.6,
      category: "Wearables"
    }
  ];

  return (
    <div className="w-full mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-500 p-2 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Trending Now 📈</h2>
            <p className="text-gray-600">Most searched products this week</p>
          </div>
        </div>
        <Button variant="outline" className="hidden sm:flex border-green-200 hover:bg-green-50">
          View All Trends
        </Button>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {trendingProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                <div className="relative mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {product.trend}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {product.category}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-gray-800">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full mt-2 bg-green-500 hover:bg-green-600">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default TrendingCarousel;
