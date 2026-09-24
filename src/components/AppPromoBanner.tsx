import React from 'react';
import { Apple, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import appHomeImg from '@/assets/marketing/gadget-genie-app-home.webp';
import appProductImg from '@/assets/marketing/gadget-genie-app-product.webp';

const PhoneFrame: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => (
  <div className={cn('w-40 lg:w-44 aspect-[390/844] rounded-[1.9rem] bg-background border-[6px] border-foreground shadow-xl overflow-hidden flex-shrink-0', className)}>
    <img src={src} alt={alt} width={600} height={1298} loading="lazy" className="w-full h-full object-cover object-top" />
  </div>
);

const StoreButton: React.FC<{ icon: React.ElementType; top: string; bottom: string }> = ({ icon: Icon, top, bottom }) => (
  <button
    type="button"
    className="inline-flex items-center gap-2.5 bg-foreground text-background rounded-md h-12 w-44 px-4 hover:opacity-90 transition-opacity"
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="text-left leading-tight">
      <span className="block text-[10px] opacity-80">{top}</span>
      <span className="block text-sm font-semibold">{bottom}</span>
    </span>
  </button>
);

const AppPromoBanner = () => (
  <section className="mb-12 rounded-lg overflow-hidden bg-muted/40 border border-border">
    <div className="grid md:grid-cols-2 items-center gap-8 px-6 sm:px-10 lg:px-14 pt-8 md:pt-0">
      <div className="md:py-12">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">Get the Gadget Genie app</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
          Shop Smarter On The Go
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Browse, shop, track orders and get exclusive app deals — anytime, anywhere.
        </p>
        <div className="flex flex-wrap gap-3">
          <StoreButton icon={Apple} top="Download on the" bottom="App Store" />
          <StoreButton icon={PlayCircle} top="Get it on" bottom="Google Play" />
        </div>
      </div>

      {/* Two real screenshots, staggered and anchored to the bottom edge */}
      <div className="flex justify-center items-end gap-4 h-64 md:h-80 overflow-hidden">
        <PhoneFrame src={appHomeImg} alt="Gadget Genie home screen on mobile" className="translate-y-6" />
        <PhoneFrame src={appProductImg} alt="Gadget Genie product page on mobile" className="translate-y-16" />
      </div>
    </div>
  </section>
);

export default AppPromoBanner;
