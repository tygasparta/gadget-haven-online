import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BannerSlide {
  id: string;
  image: string;
  path: string;
  alt: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  { id: '1', image: '/banners/audio-banner.jpg', path: '/audio', alt: 'Premium Audio Collection' },
  { id: '2', image: '/banners/phones-banner.jpg', path: '/phones', alt: 'Latest Smartphones' },
  { id: '3', image: '/banners/electronics-banner.jpg', path: '/deals', alt: 'Electronics Mega Deals' },
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'desktop_banners')
          .single();

        if (!error && data?.value) {
          const banners = data.value as unknown as BannerSlide[];
          if (Array.isArray(banners) && banners.length > 0) {
            setSlides(banners);
          }
        }
      } catch (e) {
        // Use defaults on error
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative mb-4">
      <div className="relative w-full aspect-[1920/544] overflow-hidden rounded-sm bg-gray-100">
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
