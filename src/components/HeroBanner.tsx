import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { HERO_CAMPAIGNS, HeroCampaign } from '@/config/visualAssets';
import { cn } from '@/lib/utils';

export interface BannerSlide {
  id: string;
  image: string;
  path: string;
  alt: string;
  type?: 'image' | 'video';
}

type Slide =
  | { kind: 'campaign'; campaign: HeroCampaign }
  | { kind: 'admin'; banner: BannerSlide };

const CampaignCopy = ({ campaign, dark, stacked }: { campaign: HeroCampaign; dark: boolean; stacked?: boolean }) => (
  <div className={stacked ? 'p-4 sm:p-6 pb-10 sm:pb-10' : 'max-w-md'}>
    <span className={cn('block text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase mb-1 lg:mb-3', dark ? 'text-primary-foreground/80' : 'text-primary')}>
      {campaign.label}
    </span>
    <h2 className={cn('font-extrabold leading-[1.05] tracking-tight mb-2 lg:mb-3', stacked ? 'text-2xl sm:text-3xl' : 'text-4xl xl:text-5xl', dark ? 'text-primary-foreground' : 'text-foreground')}>
      {campaign.headline}
    </h2>
    <p className={cn('text-sm xl:text-base mb-4 lg:mb-5 max-w-md', stacked && 'line-clamp-2', dark ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
      {campaign.copy}
    </p>
    <div className="flex gap-2">
      <Button asChild size={stacked ? 'default' : 'lg'} className={cn('rounded-md font-semibold', stacked && 'flex-1 sm:flex-none')}>
        <Link to={campaign.primaryCta.path}>{campaign.primaryCta.text}</Link>
      </Button>
      {campaign.secondaryCta && (
        <Button asChild size={stacked ? 'default' : 'lg'} variant="outline" className={cn('rounded-md font-semibold', stacked && 'flex-1 sm:flex-none', dark && 'bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground')}>
          <Link to={campaign.secondaryCta.path}>{campaign.secondaryCta.text}</Link>
        </Button>
      )}
    </div>
  </div>
);

const CampaignSlide = ({ campaign, eager }: { campaign: HeroCampaign; eager: boolean }) => {
  const dark = campaign.tone === 'dark';
  const loading = eager ? 'eager' : 'lazy';
  return (
    <>
      {/* Desktop (lg+): frame matches the artwork's native 3.5:1 ratio, so nothing is cropped */}
      <div className="hidden lg:block relative w-full aspect-[1792/512]">
        <img src={campaign.desktopImage} alt={campaign.alt} width={1792} height={512} loading={loading}
          className="absolute inset-0 w-full h-full object-contain" />
        <div className="absolute inset-y-0 left-0 w-[40%] flex items-center pl-16 xl:pl-20 pr-4">
          <CampaignCopy campaign={campaign} dark={dark} />
        </div>
      </div>

      {/* Tablet: full artwork at native ratio, copy below */}
      <div className="hidden sm:block lg:hidden bg-card">
        <img src={campaign.desktopImage} alt={campaign.alt} width={1792} height={512} loading={loading}
          className="w-full h-auto aspect-[1792/512] object-contain" />
        <CampaignCopy campaign={campaign} dark={false} stacked />
      </div>

      {/* Mobile: dedicated square composition, fully visible, copy below */}
      <div className="sm:hidden bg-card">
        <img src={campaign.mobileImage} alt={campaign.alt} width={1024} height={1024} loading={loading}
          className="w-full h-auto aspect-square object-contain" />
        <CampaignCopy campaign={campaign} dark={false} stacked />
      </div>
    </>
  );
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminSlides, setAdminSlides] = useState<BannerSlide[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings').select('value').eq('key', 'desktop_banners').single();
        if (!error && Array.isArray(data?.value)) {
          const banners = (data!.value as unknown as BannerSlide[]).filter(b => b?.image);
          setAdminSlides(banners.map(b => ({ ...b, type: b.type || 'image' })));
        }
      } catch { /* campaigns only */ }
    })();
  }, []);

  const slides: Slide[] = [
    ...HERO_CAMPAIGNS.map(c => ({ kind: 'campaign' as const, campaign: c })),
    ...adminSlides.map(b => ({ kind: 'admin' as const, banner: b })),
  ];

  const current = slides[currentSlide];
  const isVideo = current?.kind === 'admin' && current.banner.type === 'video';

  useEffect(() => {
    if (isVideo) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, currentSlide, isVideo]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentSlide) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
    });
  }, [currentSlide]);

  const next = () => setCurrentSlide(p => (p + 1) % slides.length);
  const prev = () => setCurrentSlide(p => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative mb-4" aria-roledescription="carousel" aria-label="Featured campaigns">
      <div className="relative w-full grid rounded-lg overflow-hidden bg-card border border-border">
        {slides.map((slide, index) => (
          <div
            key={slide.kind === 'campaign' ? slide.campaign.id : `admin-${slide.banner.id}`}
            className={cn('[grid-area:1/1] transition-opacity duration-700', index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none')}
            aria-hidden={index !== currentSlide}
          >
            {slide.kind === 'campaign' ? (
              <CampaignSlide campaign={slide.campaign} eager={index === 0} />
            ) : (
              <div className="w-full aspect-[4/5] sm:aspect-[3.5/1] bg-muted cursor-pointer" onClick={() => navigate(slide.banner.path)}>
                {slide.banner.type === 'video' ? (
                  <video
                    ref={el => { videoRefs.current[index] = el; }}
                    src={slide.banner.image}
                    muted playsInline loop={false}
                    onEnded={next}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img src={slide.banner.image} alt={slide.banner.alt} loading="lazy" className="w-full h-full object-contain" />
                )}
              </div>
            )}
          </div>
        ))}

        <button onClick={prev} aria-label="Previous slide" className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-1.5 z-10 shadow-sm border border-border">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={next} aria-label="Next slide" className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-1.5 z-10 shadow-sm border border-border">
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute bottom-4 left-4 sm:left-6 lg:left-16 xl:left-20 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={cn('h-1.5 rounded-full transition-all', index === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/25')}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
