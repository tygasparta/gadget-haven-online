import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
export interface BannerSlide {
  id: string;
  image: string;
  path: string;
  alt: string;
  type?: 'image' | 'video';
}

const DEFAULT_SLIDES: BannerSlide[] = [
  { id: '1', image: '/__l5e/assets-v1/1ddfd330-aa3a-46d4-9c59-06521289b21b/audio-banner.mp4', path: '/audio', alt: 'Premium Audio Collection', type: 'video' },
  { id: '2', image: '/__l5e/assets-v1/49b13230-6457-4e0c-8052-33852a23853f/phones-banner.mp4', path: '/phones', alt: 'Latest Smartphones', type: 'video' },
  { id: '3', image: '/__l5e/assets-v1/24a7bc0e-1b19-4688-83f5-3754dbde12fc/electronics-banner.mp4', path: '/deals', alt: 'Electronics Mega Deals', type: 'video' },
  { id: '4', image: '/__l5e/assets-v1/02a68c7d-85c8-45e1-877b-7b6a98d9d5d0/samsung-banner.mp4', path: '/search?q=samsung', alt: 'Samsung Galaxy Smartphones', type: 'video' },
  { id: '5', image: '/__l5e/assets-v1/e83e639f-7a88-4242-9627-a47f9835665b/iphone-banner.mp4', path: '/search?q=iphone', alt: 'Apple iPhone Collection', type: 'video' },
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
            setSlides(banners.map(b => ({ ...b, type: b.type || 'image' })));
          }
        }
      } catch (e) {
        // Use defaults on error
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance for image slides; video slides advance on ended
  useEffect(() => {
    const current = slides[currentSlide];
    if (current?.type === 'video') return; // video controls its own advancement

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides, currentSlide]);

  // Play/pause videos based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentSlide) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentSlide]);

  const handleVideoEnded = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

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
            {slide.type === 'video' ? (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={slide.image}
                muted
                playsInline
                loop={false}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={slide.image} 
                alt={slide.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1292&h=300&fit=crop";
                }}
              />
            )}
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
