import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck, Clock } from 'lucide-react';
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
    bgGradient: "from-purple-600 via-blue-600 to-indigo-700",
    image: "/lovable-uploads/52c3999f-568f-4f5e-a01d-1fcc63b47bbc.png",
    category: "audio"
  }, {
    id: 2,
    title: "FLASH SALE",
    subtitle: "SMARTPHONES",
    description: "Save up to 35%",
    details: "Latest 5G technology with AI-powered cameras",
    price: "$1400",
    originalPrice: "$1899",
    discount: "35% OFF",
    buttonText: "Shop Now",
    validUntil: "Valid Today Only",
    bgGradient: "from-blue-600 via-cyan-600 to-teal-700",
    image: "/lovable-uploads/bae4b565-9009-41ae-a0c1-684ecd3ec585.png",
    category: "phones"
  }, {
    id: 3,
    title: "FLASH SALE",
    subtitle: "GAMING GEAR",
    description: "Save up to 50%",
    details: "Professional gaming equipment for ultimate performance",
    price: "$500",
    originalPrice: "$1000",
    discount: "50% OFF",
    buttonText: "Shop Now",
    validUntil: "Limited Time Only",
    bgGradient: "from-red-600 via-pink-600 to-purple-700",
    image: "/lovable-uploads/d6dc68dd-5909-4e9d-b3a5-eb760a7d932b.png",
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
    <div className="relative h-[280px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-2xl mb-6 shadow-2xl">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`h-full bg-gradient-to-br ${slide.bgGradient} relative overflow-hidden`}>
            {/* Modern geometric background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rotate-45"></div>
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="w-full px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center h-full">
                    
                    {/* Content Section */}
                    <div className="text-white text-center lg:text-left py-6">
                      {/* Badge Section - More Organized */}
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                        <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          {slide.title}
                        </div>
                        <div className="bg-white/25 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/30">
                          {slide.discount}
                        </div>
                        <div className="bg-green-500/80 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Limited
                        </div>
                      </div>
                      
                      {/* Typography - Better Hierarchy */}
                      <div className="space-y-3 mb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
                          {slide.subtitle}
                        </h1>
                        
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-md">
                          {slide.description}
                        </h2>
                        
                        <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                          {slide.details}
                        </p>
                      </div>

                      {/* Price Section - Clean Layout */}
                      <div className="mb-6">
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                          <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">
                            {slide.price}
                          </span>
                          <div className="text-left">
                            {slide.originalPrice && (
                              <div className="text-sm text-white/60 line-through">
                                {slide.originalPrice}
                              </div>
                            )}
                            <div className="text-xs text-green-300 font-semibold bg-green-500/20 px-2 py-1 rounded-full">
                              Save ${slide.originalPrice ? (parseInt(slide.originalPrice.replace('$', '')) - parseInt(slide.price.replace('$', ''))) : 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Section - Enhanced */}
                      <div className="space-y-4">
                        <Button 
                          size="lg"
                          className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[180px]"
                          onClick={() => handleShopNow(slide)}
                        >
                          {slide.buttonText}
                        </Button>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-300">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {slide.validUntil}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Image Section - Enlarged Images */}
                    <div className="hidden lg:flex justify-center items-center relative">
                      <div className="relative w-full max-w-lg">
                        <div className="relative transform hover:scale-105 transition-transform duration-500">
                          <img 
                            src={slide.image} 
                            alt={slide.subtitle} 
                            className="w-full h-80 object-contain drop-shadow-2xl" 
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=500&fit=crop";
                            }} 
                          />
                          
                          {/* Floating badges */}
                          <div className="absolute -top-4 -right-4 bg-green-500/90 backdrop-blur-sm text-white rounded-full p-3 shadow-lg animate-bounce">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div className="absolute -bottom-4 -left-4 bg-blue-500/90 backdrop-blur-sm text-white rounded-full p-3 shadow-lg animate-pulse">
                            <Truck className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation - Better Mobile Design */}
      <button 
        onClick={prevSlide} 
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110 shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots - More Accessible */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-lg ${
              index === currentSlide 
                ? 'w-8 h-3 bg-white' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
