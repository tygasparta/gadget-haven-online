import React from 'react';
import { MapPin, Truck } from 'lucide-react';

interface ShippingMethodSectionProps {
  shippingMethod: 'shipping' | 'collection';
  setShippingMethod: (method: 'shipping' | 'collection') => void;
}

const OPTIONS = [
  { value: 'collection' as const, title: 'Collect at shop', note: 'Ready in 2–3 business days', price: 'Free', icon: MapPin },
  { value: 'shipping' as const, title: 'Home delivery', note: '3–5 business days, tracked', price: '$5.00', icon: Truck },
];

const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({ shippingMethod, setShippingMethod }) => (
  <section className="bg-background border border-border rounded-lg p-4">
    <h2 className="text-sm font-semibold mb-3">Delivery method</h2>
    <div role="radiogroup" className="space-y-2">
      {OPTIONS.map((o) => {
        const active = shippingMethod === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setShippingMethod(o.value)}
            className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
          >
            <span className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${active ? 'border-primary' : 'border-muted-foreground/50'}`}>
              {active && <span className="w-2 h-2 rounded-full bg-primary" />}
            </span>
            <o.icon className="w-[18px] h-[18px] text-muted-foreground shrink-0" strokeWidth={1.75} />
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground">{o.title}</span>
              <span className="block text-xs text-muted-foreground">{o.note}</span>
            </span>
            <span className={`text-sm font-semibold ${o.price === 'Free' ? 'text-success' : 'text-foreground'}`}>{o.price}</span>
          </button>
        );
      })}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">
      {shippingMethod === 'collection'
        ? "Bring a valid ID when collecting. We'll let you know when your order is ready."
        : 'Deliveries run 9 AM – 6 PM. A signature is required on arrival.'}
    </p>
  </section>
);

export default ShippingMethodSection;
