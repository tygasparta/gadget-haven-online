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

// Video banners live on Lovable's own asset host (/__l5e/assets-v1/...), which
// isn't reachable outside Lovable's hosting — so the default carousel uses the
// static images that actually ship in public/banners/ instead. Admin-configured
// banners (admin_settings.desktop_banners) still take priority when present.
const DEFAULT_SLIDES: BannerSlide[] = [
  { id: '1', image: '/banners/phones-banner.jpg', path: '/phones', alt: 'Latest Smartphones', type: 'image' },
  { id: '2', image: '/banners/audio-banner.jpg', path: '/audio', alt: 'Premium Audio Collection', type: 'image' },
  { id: '3', image: '/banners/electronics-banner.jpg', path: '/deals', alt: 'Electronics Mega Deals', type: 'image' },
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
      <div className="relative w-full aspect-[1920/544] overflow-hidden rounded-sm bg-muted">
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
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 transition-all z-10 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 transition-all z-10 shadow-sm"
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
