
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Wireless Headphones",
      subtitle: "Studio-Quality Sound Experience",
      description: "Immerse yourself in crystal-clear audio with active noise cancellation",
      features: ["Noise Cancelling", "40H Battery", "Premium Sound"],
      price: "$299",
      originalPrice: "$399",
      discount: "25% OFF",
      buttonText: "Shop Audio",
      secondaryButtonText: "View Details",
      bgGradient: "from-purple-600 to-blue-600",
      image: "/lovable-uploads/d81d319e-54ab-4282-9501-5d174d3ddc41.png"
    },
    {
      id: 2,
      title: "Latest Smartphone Collection",
      subtitle: "Next Generation Technology",
      description: "Discover cutting-edge smartphones with advanced features",
      features: ["5G Ready", "Pro Camera", "Fast Charging"],
      price: "$899",
      originalPrice: "$1199",
      discount: "NEW",
      buttonText: "Shop Phones",
      secondaryButtonText: "Compare Models",
      bgGradient: "from-blue-600 to-cyan-600",
      image: "/lovable-uploads/e04ef79b-7e6b-483d-898a-d1e0e1f2a36f.png"
    },
    {
      id: 3,
      title: "Gaming & Entertainment",
      subtitle: "Ultimate Gaming Experience",
      description: "Top gaming consoles and accessories for every gamer",
      features: ["4K Gaming", "Ray Tracing", "120Hz Display"],
      price: "$499",
      originalPrice: "$599",
      discount: "17% OFF",
      buttonText: "Shop Gaming",
      secondaryButtonText: "View Console",
      bgGradient: "from-red-600 to-purple-600",
      image: "/lovable-uploads/03f13398-33a0-4ca0-ae90-922ddc6089fb.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-xl mb-8">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgGradient} relative overflow-hidden`}>
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <div className="flex items-center mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                      TRENDING
                    </span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {slide.discount}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 opacity-90">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg mb-6 opacity-80">
                    {slide.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {slide.features.map((feature, idx) => (
                      <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-6">
                    <span className="text-3xl font-bold text-white">{slide.price}</span>
                    <span className="text-lg text-white/60 line-through ml-3">{slide.originalPrice}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold">
                      {slide.buttonText}
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3">
                      {slide.secondaryButtonText}
                    </Button>
                  </div>
                </div>

                {/* Product Image */}
                <div className="hidden lg:flex justify-center items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl transform scale-150"></div>
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="relative z-10 max-w-md w-full h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
