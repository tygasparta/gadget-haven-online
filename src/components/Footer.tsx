
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="hidden md:block bg-gradient-to-r from-slate-900 to-sky-950 text-white py-12 border-t border-sky-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-sky-300">
                GadgetGenie
              </h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted destination for the latest tech gadgets, electronics, and innovative solutions. Quality products, competitive prices, exceptional service.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Help Centre', path: '/help' },
                { name: 'Careers', path: '/careers' },
                { name: 'Press', path: '/press' }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2">
              {[
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns', path: '/returns' },
                { name: 'Warranty', path: '/warranty' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Payment Methods', path: '/payment-methods' }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal & Connect</h4>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' },
                { name: 'Accessibility', path: '/accessibility' },
                { name: 'Sell With Us', path: '/sell' }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.path} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-sky-700 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-white/70">© 2025 GadgetGenie. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
