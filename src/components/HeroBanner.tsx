import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Full-width image banners like Takealot
  const slides = [
    {
      id: 1,
      image: "/lovable-uploads/52c3999f-568f-4f5e-a01d-1fcc63b47bbc.png",
      path: "/audio",
      alt: "Premium Audio Sale"
    },
    {
      id: 2,
      image: "/lovable-uploads/d6dc68dd-5909-4e9d-b3a5-eb760a7d932b.png",
      path: "/deals",
      alt: "Gaming Gear Sale"
    },
    {
      id: 3,
      image: "/lovable-uploads/ec6b5870-e30a-464d-bb91-870607d474b9.png",
      path: "/products",
      alt: "Shop Electronics"
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

  return (
    <div className="relative mb-4">
      <div className="relative w-full aspect-[1292/300] overflow-hidden rounded-sm bg-gray-100">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => navigate(slide.path)}
          >
            <img 
              src={slide.image} 
              alt={slide.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1292&h=300&fit=crop";
              }}
            />
          </div>
        ))}

        {/* Navigation arrows */}
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 transition-all z-10 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 transition-all z-10 shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white shadow-md' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
