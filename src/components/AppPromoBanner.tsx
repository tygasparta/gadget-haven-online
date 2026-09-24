import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, PlayCircle, ArrowRight, Search, Flame, Truck } from 'lucide-react';

const PhoneMockup: React.FC<{ variant: 'home' | 'orders' }> = ({ variant }) => (
  <div className="w-32 sm:w-36 h-64 sm:h-72 rounded-[1.75rem] bg-background border-[6px] border-foreground/90 shadow-xl overflow-hidden flex-shrink-0 relative">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-foreground/90 rounded-b-lg z-10" />
    <div className="p-2.5 pt-4 h-full bg-muted/30 flex flex-col gap-2 text-[6px]">
      <div className="flex items-center gap-1 bg-primary text-primary-foreground rounded px-1.5 py-1 font-semibold">
        <span>Gadget Genie</span>
      </div>
      {variant === 'home' ? (
        <>
          <div className="flex items-center gap-1 bg-card border border-border rounded px-1.5 py-1 text-muted-foreground">
            <Search className="w-2 h-2" />
            Search for gadgets...
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['Phones', 'Laptops', 'Gaming', 'Audio'].map((label) => (
              <div key={label} className="bg-card border border-border rounded p-1 flex flex-col items-center gap-0.5">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span className="text-foreground/70 leading-none">{label}</span>
              </div>
            ))}
          </div>
          <div className="bg-primary text-primary-foreground rounded p-1.5 flex-1 flex flex-col justify-center gap-0.5">
            <span className="font-bold">Mega Deals</span>
            <span className="opacity-80">Up to 50% Off</span>
            <div className="bg-background text-primary rounded px-1.5 py-0.5 w-fit mt-0.5 font-medium">Shop Now</div>
          </div>
          <div className="flex items-center gap-1 text-destructive font-medium">
            <Flame className="w-2 h-2" />
            Flash Deals
            <span className="ml-auto tabular-nums">06:23:45</span>
          </div>
        </>
      ) : (
        <>
          <div className="bg-card border border-border rounded p-1 flex items-center justify-between text-foreground/70">
            <span>My Orders</span>
            <span className="text-primary">All</span>
          </div>
          <div className="flex gap-1 text-[5px]">
            {['Pending', 'Shipped', 'Delivered'].map((s) => (
              <span key={s} className="bg-muted rounded px-1 py-0.5 text-foreground/60">{s}</span>
            ))}
          </div>
          <div className="bg-card border border-border rounded p-1.5 flex flex-col gap-1">
            <span className="text-foreground/80 font-medium">Samsung A56 5G</span>
            <span className="flex items-center gap-1 text-success">
              <Truck className="w-2 h-2" />
              Out for Delivery
            </span>
            <div className="bg-primary/10 text-primary rounded px-1.5 py-0.5 w-fit font-medium">Track Order</div>
          </div>
          <div className="bg-card border border-border rounded p-1.5 flex flex-col gap-1">
            <span className="text-foreground/80 font-medium">HP 15.6" Laptop</span>
            <span className="text-success">Delivered</span>
          </div>
        </>
      )}
    </div>
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
            <PhoneMockup variant="home" />
            <PhoneMockup variant="orders" />
          </div>
        </div>
      </div>

      {/* Sell with us */}
      <div className="rounded-lg overflow-hidden relative bg-foreground text-background">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=60')" }}
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
