import React from 'react';
import { Apple, PlayCircle } from 'lucide-react';
import appHomeImg from '@/assets/marketing/gadget-genie-app-home.webp';
import appProductImg from '@/assets/marketing/gadget-genie-app-product.webp';

const PhoneFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="w-32 sm:w-36 aspect-[390/844] rounded-[1.75rem] bg-background border-[6px] border-foreground shadow-xl overflow-hidden flex-shrink-0">
    <img src={src} alt={alt} width={600} height={1298} loading="lazy" className="w-full h-full object-cover object-top" />
  </div>
);

const AppPromoBanner = () => {

  return (
    <div className="mb-12 grid grid-cols-1">
      {/* Get the app */}
      <div className="rounded-lg overflow-hidden bg-muted/40 border border-border">
        <div className="flex items-center gap-6 px-6 sm:px-8 py-8 h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">Get the Gadget Genie app</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              Shop Smarter<br />On The Go
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Browse, shop, track orders and get exclusive app deals — anytime, anywhere.
            </p>
            <div className="flex flex-col xs:flex-row gap-2">
              <button className="flex items-center gap-2 bg-foreground text-background rounded-lg px-3.5 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
                <Apple className="w-4 h-4" />
                <span className="text-left leading-tight">Download on the<br /><span className="text-[11px] font-semibold">App Store</span></span>
              </button>
              <button className="flex items-center gap-2 bg-foreground text-background rounded-lg px-3.5 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
                <PlayCircle className="w-4 h-4" />
                <span className="text-left leading-tight">GET IT ON<br /><span className="text-[11px] font-semibold">Google Play</span></span>
              </button>
            </div>
          </div>
          <div className="hidden sm:flex flex-shrink-0 items-end gap-2 -mr-2">
            <PhoneFrame src={appHomeImg} alt="Gadget Genie home screen on mobile" />
            <PhoneFrame src={appProductImg} alt="Gadget Genie product page on mobile" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AppPromoBanner;
