import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import applePhonesHero from '@/assets/apple-phones-hero.png';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: "Huge Saving on",
      subtitle: "Premium Audio",
      description: "Sale up to 40% off on selected items*",
      buttonText: "Shop Now",
      image: "/lovable-uploads/52c3999f-568f-4f5e-a01d-1fcc63b47bbc.png",
      category: "audio"
    },
    {
      id: 2,
      title: "Huge Saving on",
      subtitle: "Apple iPhones",
      description: "Sale up to 35% off on selected items*",
      buttonText: "Shop Now",
      image: applePhonesHero,
      category: "apple-phones"
    },
    {
      id: 3,
      title: "Huge Saving on",
      subtitle: "Gaming Gear",
      description: "Sale up to 50% off on selected items*",
      buttonText: "Shop Now",
      image: "/lovable-uploads/d6dc68dd-5909-4e9d-b3a5-eb760a7d932b.png",
      category: "gaming"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  const handleShopNow = (slide: any) => {
    switch (slide.category) {
      case 'audio': navigate('/audio'); toast.success(`Browsing ${slide.subtitle} deals!`); break;
      case 'apple-phones': navigate('/search?q=iphone'); toast.success(`Browsing ${slide.subtitle} deals!`); break;
      case 'gaming': navigate('/deals'); toast.success(`Browsing ${slide.subtitle} deals!`); break;
      default: navigate('/deals'); toast.success("Browsing all deals!");
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-3 mb-6 shadow-sm">
      <div className="relative h-[280px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-xl">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="h-full bg-blue-700 relative overflow-hidden">
            {/* Abstract gradient shapes - like the reference */}
            <div className="absolute inset-0">
              {/* Large circle top-left */}
              <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-blue-500/40 blur-3xl" />
              {/* Circle bottom-right */}
              <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-400/30 blur-3xl" />
              {/* Mid accent */}
              <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-600/50 blur-2xl" />
              {/* Small bright accent */}
              <div className="absolute top-10 right-1/3 w-[200px] h-[200px] rounded-full bg-blue-300/20 blur-2xl" />
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-6 sm:px-10 md:px-14">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                    {/* Text Content */}
                    <div className="text-white py-8">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                        <span className="text-blue-200">{slide.title}</span>
                        <br />
                        <span className="text-white">{slide.subtitle}</span>
                      </h1>
                      <p className="text-base sm:text-lg text-blue-100/80 mb-8 max-w-md">
                        {slide.description}
                      </p>
                      <Button 
                        size="lg"
                        className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-5 text-lg font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                        onClick={() => handleShopNow(slide)}
                      >
                        {slide.buttonText}
                      </Button>
                    </div>

                    {/* Product Image */}
                    <div className="hidden lg:flex justify-center items-center">
                      <div className="relative">
                        <img 
                          src={slide.image} 
                          alt={slide.subtitle} 
                          className="w-full max-w-lg h-80 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=500&fit=crop";
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide ? 'w-8 h-3 bg-white' : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default HeroBanner;
