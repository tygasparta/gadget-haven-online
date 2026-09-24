import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headset, Undo2, BadgeCheck } from 'lucide-react';

const items = [
  { icon: CreditCard, title: 'Secure Payments', subtitle: 'Safe & encrypted' },
  { icon: ShieldCheck, title: 'Genuine Products', subtitle: '100% authentic' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Across Zimbabwe' },
  { icon: Undo2, title: 'Easy Returns', subtitle: 'Hassle-free returns' },
  { icon: BadgeCheck, title: 'Official Warranty', subtitle: 'Peace of mind' },
  { icon: Headset, title: 'Customer Support', subtitle: "We're here to help" },
];

const TrustStrip = () => (
  <div className="border-y border-border mb-10">
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x divide-border">
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-2.5 px-3 lg:px-4 py-3.5">
          <item.icon className="w-[18px] h-[18px] text-foreground/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground leading-tight truncate mt-0.5">{item.subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default TrustStrip;
