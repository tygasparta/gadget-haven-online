import React from 'react';
import sellPhoneImg from '@/assets/promotions/gadget-genie-sell-with-us-phone.jpg';
import { useNavigate } from 'react-router-dom';
import { Apple, PlayCircle, ArrowRight } from 'lucide-react';
import appHomeImg from '@/assets/marketing/gadget-genie-app-home.webp';
import appProductImg from '@/assets/marketing/gadget-genie-app-product.webp';

const PhoneFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="w-32 sm:w-36 aspect-[390/844] rounded-[1.75rem] bg-background border-[6px] border-foreground shadow-xl overflow-hidden flex-shrink-0">
    <img src={src} alt={alt} width={600} height={1298} loading="lazy" className="w-full h-full object-cover object-top" />
  </div>
);

const AppPromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

      {/* Sell with us */}
      <div className="rounded-lg overflow-hidden relative bg-foreground text-background">
        <img
          src={sellPhoneImg}
          alt="Seller managing their Gadget Genie store on a smartphone"
          width={1280}
          height={768}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="relative z-10 px-6 sm:px-8 py-8 h-full flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase mb-2">Sell with us</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            Grow Your Business<br />with Gadget Genie
          </h2>
          <p className="text-background/70 text-sm mb-6 max-w-sm">
            Reach thousands of customers across Zimbabwe. List your products, manage your store and grow your sales.
          </p>
          <button
            onClick={() => navigate('/sell')}
            className="flex items-center gap-2 bg-background text-foreground rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-background/90 transition-colors w-fit"
          >
            Start Selling
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPromoBanner;
