import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headset, PackageCheck, BadgeCheck } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Fast & Reliable Delivery', subtitle: 'Across Zimbabwe' },
  { icon: ShieldCheck, title: 'Genuine Products', subtitle: '100% authentic' },
  { icon: CreditCard, title: 'Secure Payments', subtitle: 'Multiple options' },
  { icon: Headset, title: 'Customer Support', subtitle: "We're here to help" },
  { icon: PackageCheck, title: 'Easy Returns', subtitle: 'Hassle-free returns' },
  { icon: BadgeCheck, title: 'Official Warranty', subtitle: 'Peace of mind' },
];

const TrustStrip = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm mb-6 sm:mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-2.5 px-4 py-4">
            <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight truncate">{item.title}</p>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustStrip;
