import React from 'react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Shop',
    links: [
      { name: 'Smartphones', path: '/products?category=smartphones' },
      { name: 'Laptops', path: '/products?category=laptops' },
      { name: 'Gaming', path: '/products?category=gaming' },
      { name: 'Deals', path: '/deals' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Track Order', path: '/track-order' },
      { name: 'Delivery', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
      { name: 'Contact Us', path: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Terms', path: '/terms' },
      { name: 'Privacy', path: '/privacy' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-muted/40 border-t border-border pt-10 pb-24 md:pb-10">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">G</span>
            </div>
            <span className="text-lg font-bold text-primary">Gadget Genie</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Genuine gadgets and electronics, delivered across Zimbabwe.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-foreground mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Gadget Genie. All rights reserved.</span>
        <span>Secure payments via PesePay and PayPal</span>
      </div>
    </div>
  </footer>
);

export default Footer;
