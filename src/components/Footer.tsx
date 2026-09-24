
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp, CheckCircle2, Apple, PlayCircle } from 'lucide-react';

const shopLinks = [
  { name: 'All Categories', path: '/categories' },
  { name: 'Smartphones', path: '/products?category=smartphones' },
  { name: 'Laptops & Computers', path: '/products?category=laptops' },
  { name: 'Gaming', path: '/products?category=gaming' },
  { name: 'Accessories', path: '/products?category=accessories' },
  { name: 'Audio', path: '/products?category=audio' },
  { name: 'Cameras', path: '/products?category=cameras' },
  { name: 'Smart Home', path: '/products?category=smart-home' },
  { name: 'New Arrivals', path: '/categories?featured=new' },
  { name: 'Deals', path: '/deals' },
];

const serviceLinks = [
  { name: 'Track Your Order', path: '/track-order' },
  { name: 'Delivery Information', path: '/shipping' },
  { name: 'Returns & Refunds', path: '/returns' },
  { name: 'Warranty Information', path: '/warranty' },
  { name: 'Help Centre', path: '/help' },
  { name: 'Contact Us', path: '/contact' },
];

const aboutLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Sell With Us', path: '/sell' },
  { name: 'Careers', path: '/careers' },
  { name: 'Press', path: '/press' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Accessibility', path: '/accessibility' },
  { name: 'Sitemap', path: '/sitemap.xml' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X (Twitter)' },
  { icon: Youtube, label: 'YouTube' },
];

const paymentMethods = ['Visa', 'Mastercard', 'EcoCash', 'telecash', 'ZimSwitch'];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-sky-950 text-white pt-10 pb-24 md:py-12 border-t border-sky-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-sky-300 leading-tight">Gadget Genie</h3>
                <p className="text-[10px] text-white/50 tracking-wide">TECH FOR A SMARTER TOMORROW</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Your trusted destination for the latest tech gadgets and electronics in Zimbabwe. Genuine products, fast delivery.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white">Customer Service</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white">About Gadget Genie</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold mb-3 text-white">Newsletter</h4>
            <p className="text-white/70 text-sm mb-3">Get the latest deals, new arrivals and exclusive offers.</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sky-300 text-sm bg-white/10 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-5">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-sky-400"
                  required
                />
                <Button type="submit" size="sm" className="h-9 bg-sky-600 hover:bg-sky-500 flex-shrink-0">
                  Subscribe
                </Button>
              </form>
            )}

            <h4 className="text-sm font-semibold mb-2 text-white">Download Our App</h4>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-xs transition-colors w-fit">
                <Apple className="w-3.5 h-3.5" />
                App Store
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-xs transition-colors w-fit">
                <PlayCircle className="w-3.5 h-3.5" />
                Google Play
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-sky-800/60 mb-6" />

        <div className="mb-6">
          <p className="text-xs text-white/50 mb-2.5">We Accept Secure Payments</p>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span key={method} className="bg-white/10 border border-white/10 rounded px-2.5 py-1 text-xs font-semibold text-white/80">
                {method}
              </span>
            ))}
          </div>
        </div>

        <Separator className="bg-sky-800/60 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 mb-6">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>We deliver across Zimbabwe — Harare, Bulawayo, Mutare, Gweru &amp; more</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Proudly Zimbabwean</span>
          </div>
        </div>

        <Separator className="bg-sky-800/60 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-white/60">© 2025 Gadget Genie. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-500 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
