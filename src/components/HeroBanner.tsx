
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Audio Experience",
      subtitle: "Wireless Headphones Collection",
      description: "Immerse yourself in crystal-clear sound with advanced noise cancellation technology",
      features: ["Active Noise Cancelling", "40H Battery Life", "Hi-Res Audio"],
      price: "$299",
      originalPrice: "$399",
      discount: "25% OFF",
      buttonText: "Shop Audio",
      secondaryButtonText: "View Collection",
      bgGradient: "from-purple-600 via-purple-700 to-indigo-800",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Next-Gen Smartphones",
      subtitle: "Technology Redefined",
      description: "Experience the future with cutting-edge smartphones featuring AI-powered cameras",
      features: ["5G Ultra Fast", "Pro Camera System", "All-Day Battery"],
      price: "$899",
      originalPrice: "$1199",
      discount: "Flash Deal",
      buttonText: "Shop Phones",
      secondaryButtonText: "Compare Models",
      bgGradient: "from-blue-600 via-cyan-600 to-teal-700",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Gaming Revolution",
      subtitle: "Ultimate Gaming Setup",
      description: "Elevate your gaming experience with professional-grade equipment",
      features: ["4K 120Hz Gaming", "Ray Tracing", "VRR Support"],
      price: "$499",
      originalPrice: "$599",
      discount: "Limited Time",
      buttonText: "Shop Gaming",
      secondaryButtonText: "View Specs",
      bgGradient: "from-red-600 via-pink-600 to-purple-700",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl mb-8 shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`h-full bg-gradient-to-br ${slide.bgGradient} relative overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-ping"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  {/* Enhanced badges */}
                  <div className="flex items-center mb-6">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mr-4 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      TRENDING NOW
                    </span>
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {slide.discount}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-3xl mb-6 opacity-90 font-light">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg mb-8 opacity-80 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Enhanced features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced price display */}
                  <div className="flex items-center mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div>
                      <span className="text-4xl font-bold text-white">{slide.price}</span>
                      <span className="text-xl text-white/60 line-through ml-4">{slide.originalPrice}</span>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-green-400 font-semibold">You Save</div>
                      <div className="text-green-400 text-xl font-bold">$100</div>
                    </div>
                  </div>

                  {/* Enhanced buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      {slide.buttonText}
                    </Button>
                    <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-10 py-4 rounded-xl font-semibold transition-all duration-200">
                      {slide.secondaryButtonText}
                    </Button>
                  </div>
                </div>

                {/* Enhanced product showcase */}
                <div className="hidden lg:flex justify-center items-center relative">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform scale-150 animate-pulse"></div>
                    {/* Product image */}
                    <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="max-w-lg w-full h-auto object-contain drop-shadow-2xl"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop";
                        }}
                      />
                    </div>
                    {/* Floating features */}
                    <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm font-medium">
                      <Shield className="w-5 h-5 mb-1" />
                      2 Year Warranty
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-sm font-medium">
                      <Truck className="w-5 h-5 mb-1" />
                      Free Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-20 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Enhanced dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
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
