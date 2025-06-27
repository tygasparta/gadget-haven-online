import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{
    id: 1,
    title: "FLASH SALE",
    subtitle: "PREMIUM AUDIO",
    description: "Save up to 40%",
    details: "Crystal-clear sound with advanced noise cancellation",
    price: "$299",
    originalPrice: "$499",
    discount: "40% OFF",
    buttonText: "Shop Now",
    validUntil: "Valid 27 June Only",
    bgGradient: "from-purple-500 via-purple-600 to-indigo-700",
    image: "/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png"
  }, {
    id: 2,
    title: "FLASH SALE",
    subtitle: "SMARTPHONES",
    description: "Save up to 35%",
    details: "Latest 5G technology with AI-powered cameras",
    price: "$899",
    originalPrice: "$1399",
    discount: "35% OFF",
    buttonText: "Shop Now",
    validUntil: "Valid Today Only",
    bgGradient: "from-blue-500 via-cyan-600 to-teal-700",
    image: "/lovable-uploads/b38403c0-7408-4a79-bc6c-e23ef6f347bb.png"
  }, {
    id: 3,
    title: "FLASH SALE",
    subtitle: "GAMING GEAR",
    description: "Save up to 50%",
    details: "Professional gaming equipment for ultimate performance",
    price: "$499",
    originalPrice: "$999",
    discount: "50% OFF",
    buttonText: "Shop Now",
    validUntil: "Limited Time Only",
    bgGradient: "from-red-500 via-pink-600 to-purple-700",
    image: "/lovable-uploads/ec24a873-3717-4a20-b741-b2588778cbd8.png"
  }];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };
  return (
    <div className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden rounded-2xl mb-8 shadow-xl">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgGradient} relative overflow-hidden`}>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-16 sm:w-32 h-16 sm:h-32 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 sm:bottom-12 right-6 sm:right-12 w-12 sm:w-20 h-12 sm:h-20 bg-white rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-8 sm:w-16 h-8 sm:h-16 bg-white rounded-full animate-ping"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
                <div className="text-white text-center lg:text-left">
                  {/* Flash Sale Badge */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mb-3 sm:mb-4">
                    <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-0 sm:mr-4 flex items-center animate-pulse">
                      <Zap className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                      {slide.title}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                      {slide.discount}
                    </span>
                  </div>
                  
                  {/* Main Title */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                    {slide.subtitle}
                  </h1>
                  
                  {/* Save Amount */}
                  <h2 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 font-bold text-yellow-300">
                    {slide.description}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm sm:text-base mb-2 sm:mb-3 opacity-90 leading-relaxed px-4 lg:px-0">
                    {slide.details}
                  </p>

                  {/* Price Display */}
                  <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-white">{slide.price}</span>
                    <span className="text-sm sm:text-base text-white/60 line-through ml-2 sm:ml-3">{slide.originalPrice}</span>
                  </div>

                  {/* Action Button & Validity */}
                  <div className="flex flex-col items-center lg:items-start gap-2 sm:gap-4">
                    <Button className="bg-white text-black hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      {slide.buttonText}
                    </Button>
                    <div className="text-yellow-300 text-xs sm:text-sm font-semibold">
                      {slide.validUntil}
                    </div>
                  </div>
                </div>

                {/* Product Image - Hidden on small screens, visible on lg+ */}
                <div className="hidden lg:flex justify-center items-center relative">
                  <div className="relative w-full max-w-sm">
                    <div className="relative transform hover:scale-105 transition-transform duration-500">
                      <img 
                        src={slide.image} 
                        alt={slide.subtitle} 
                        className="w-full h-40 sm:h-48 md:h-56 object-contain drop-shadow-2xl" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=400&fit=crop";
                        }} 
                      />
                      
                      {/* Floating elements */}
                      <div className="absolute -top-2 -right-2 bg-green-500/80 backdrop-blur-sm text-white rounded-full p-2 shadow-lg animate-bounce">
                        <Shield className="w-3 sm:w-4 h-3 sm:h-4" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-full p-2 shadow-lg animate-pulse">
                        <Truck className="w-3 sm:w-4 h-3 sm:h-4" />
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-6 sm:w-8 h-6 sm:h-8 bg-yellow-400/20 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-4 -right-4 w-4 sm:w-6 h-4 sm:h-6 bg-pink-400/20 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons - Responsive sizing */}
      <button 
        onClick={prevSlide} 
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-1.5 sm:p-2 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
      </button>

      {/* Dots indicator - Responsive sizing */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-white' 
                : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
