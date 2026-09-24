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

const CampaignSlide = ({ campaign, eager }: { campaign: HeroCampaign; eager: boolean }) => {
  const dark = campaign.tone === 'dark';
  return (
    <>
      {/* Desktop / tablet: photo fills the frame, copy sits on the clean left */}
      <div className="hidden sm:block absolute inset-0">
        <img
          src={campaign.desktopImage}
          alt={campaign.alt}
          width={1792}
          height={608}
          loading={eager ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-y-0 left-0 w-[48%] flex items-center pl-8 md:pl-12 lg:pl-16 pr-4">
          <div className="max-w-md">
            <span className={cn('inline-block text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase mb-2 md:mb-3', dark ? 'text-primary-foreground/80' : 'text-primary')}>
              {campaign.label}
            </span>
            <h2 className={cn('text-2xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight mb-2 md:mb-3', dark ? 'text-primary-foreground' : 'text-foreground')}>
              {campaign.headline}
            </h2>
            <p className={cn('hidden md:block text-sm lg:text-base mb-5 max-w-sm', dark ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
              {campaign.copy}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
              <Button asChild size="lg" className="rounded-md font-semibold">
                <Link to={campaign.primaryCta.path}>{campaign.primaryCta.text}</Link>
              </Button>
              {campaign.secondaryCta && (
                <Button asChild size="lg" variant="outline" className={cn('rounded-md font-semibold hidden md:inline-flex', dark && 'bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:text-primary-foreground')}>
                  <Link to={campaign.secondaryCta.path}>{campaign.secondaryCta.text}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: separate square composition, copy below so nothing is cropped */}
      <div className="sm:hidden flex flex-col h-full bg-card">
        <img
          src={campaign.mobileImage}
          alt={campaign.alt}
          width={1024}
          height={1024}
          loading={eager ? 'eager' : 'lazy'}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="p-4 pb-9">
          <span className="block text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-1">{campaign.label}</span>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground mb-1">{campaign.headline}</h2>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.copy}</p>
          <div className="flex gap-2">
            <Button asChild className="flex-1 font-semibold">
              <Link to={campaign.primaryCta.path}>{campaign.primaryCta.text}</Link>
            </Button>
            {campaign.secondaryCta && (
              <Button asChild variant="outline" className="flex-1 font-semibold">
                <Link to={campaign.secondaryCta.path}>{campaign.secondaryCta.text}</Link>
              </Button>
            )}
          </div>
        </div>
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
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/1] lg:aspect-[3.5/1] overflow-hidden rounded-lg bg-muted border border-border">
        {slides.map((slide, index) => (
          <div
            key={slide.kind === 'campaign' ? slide.campaign.id : `admin-${slide.banner.id}`}
            className={cn('absolute inset-0 transition-opacity duration-700', index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none')}
            aria-hidden={index !== currentSlide}
          >
            {slide.kind === 'campaign' ? (
              <CampaignSlide campaign={slide.campaign} eager={index === 0} />
            ) : (
              <div className="w-full h-full cursor-pointer" onClick={() => navigate(slide.banner.path)}>
                {slide.banner.type === 'video' ? (
                  <video
                    ref={el => { videoRefs.current[index] = el; }}
                    src={slide.banner.image}
                    muted playsInline loop={false}
                    onEnded={next}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={slide.banner.image} alt={slide.banner.alt} loading="lazy" className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>
        ))}

        <button onClick={prev} aria-label="Previous slide" className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-2 z-10 shadow-sm border border-border">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} aria-label="Next slide" className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full p-2 z-10 shadow-sm border border-border">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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
