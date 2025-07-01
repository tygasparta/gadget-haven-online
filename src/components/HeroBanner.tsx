
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HeroBanner = () => {
  const navigate = useNavigate();
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
    image: "/lovable-uploads/0d190627-ad58-4879-a433-67b3012a1faf.png",
    category: "audio"
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
    image: "/lovable-uploads/b38403c0-7408-4a79-bc6c-e23ef6f347bb.png",
    category: "phones"
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
    image: "/lovable-uploads/ec24a873-3717-4a20-b741-b2588778cbd8.png",
    category: "gaming"
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

  const handleShopNow = (slide: any) => {
    // Navigate based on the slide category
    switch (slide.category) {
      case 'audio':
        navigate('/audio');
        toast.success(`Browsing ${slide.subtitle} deals!`);
        break;
      case 'phones':
        navigate('/phones');
        toast.success(`Browsing ${slide.subtitle} deals!`);
        break;
      case 'gaming':
        navigate('/deals');
        toast.success(`Browsing ${slide.subtitle} deals!`);
        break;
      default:
        navigate('/deals');
        toast.success("Browsing all deals!");
    }
  };

  return (
    <div className="relative h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden rounded-2xl mb-6 sm:mb-8 shadow-xl">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgGradient} relative overflow-hidden`}>
            {/* Enhanced background pattern for mobile */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 sm:w-16 h-8 sm:h-16 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 w-6 sm:w-12 h-6 sm:h-12 bg-white rounded-full animate-bounce"></div>
              <div className="absolute top-1/3 left-1/3 w-4 sm:w-8 h-4 sm:h-8 bg-white rounded-full animate-ping"></div>
            </div>

            {/* Enhanced mobile-first content layout */}
            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-3 sm:px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full">
                    
                    {/* Left content - Enhanced mobile layout */}
                    <div className="text-white text-center lg:text-left py-4 sm:py-6">
                      {/* Mobile-optimized badges */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-yellow-400 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center animate-pulse shadow-lg">
                            <Zap className="w-3 h-3 mr-1" />
                            {slide.title}
                          </span>
                          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {slide.discount}
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced mobile typography */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                          {slide.subtitle}
                        </h1>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg">
                          {slide.description}
                        </h2>
                        
                        <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-md mx-auto lg:mx-0 px-2 lg:px-0">
                          {slide.details}
                        </p>
                      </div>

                      {/* Enhanced mobile price display */}
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-2">
                          <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
                            {slide.price}
                          </span>
                          <div className="flex flex-col items-start">
                            {slide.originalPrice && (
                              <span className="text-sm sm:text-base text-white/70 line-through">
                                {slide.originalPrice}
                              </span>
                            )}
                            <span className="text-xs sm:text-sm text-green-300 font-semibold bg-green-500/20 px-2 py-1 rounded-full">
                              Save ${slide.originalPrice ? (parseInt(slide.originalPrice.replace('$', '')) - parseInt(slide.price.replace('$', ''))) : 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced mobile CTA section */}
                      <div className="space-y-3 sm:space-y-4">
                        <Button 
                          size="lg"
                          className="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto min-w-[160px]"
                          onClick={() => handleShopNow(slide)}
                        >
                          {slide.buttonText}
                        </Button>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-300">
                          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                          <span className="text-xs sm:text-sm font-semibold">
                            {slide.validUntil}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Enhanced mobile image display */}
                    <div className="hidden lg:flex justify-center items-center relative">
                      <div className="relative w-full max-w-md">
                        <div className="relative transform hover:scale-105 transition-transform duration-500">
                          <img 
                            src={slide.image} 
                            alt={slide.subtitle} 
                            className="w-full h-48 sm:h-56 md:h-64 object-contain drop-shadow-2xl" 
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=400&fit=crop";
                            }} 
                          />
                          
                          {/* Enhanced floating badges */}
                          <div className="absolute -top-2 -right-2 bg-green-500/90 backdrop-blur-sm text-white rounded-full p-2 shadow-lg animate-bounce">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div className="absolute -bottom-2 -left-2 bg-blue-500/90 backdrop-blur-sm text-white rounded-full p-2 shadow-lg animate-pulse">
                            <Truck className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Enhanced decorative elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/30 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400/30 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced mobile navigation */}
      <button 
        onClick={prevSlide} 
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 sm:p-3 transition-all duration-200 z-20 hover:scale-110 shadow-lg"
      >
        <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 sm:p-3 transition-all duration-200 z-20 hover:scale-110 shadow-lg"
      >
        <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
      </button>

      {/* Enhanced mobile dots indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-lg ${
              index === currentSlide 
                ? 'w-6 sm:w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
