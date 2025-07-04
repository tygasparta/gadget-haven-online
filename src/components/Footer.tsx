
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 border-t border-gray-700">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              {/* Animated Logo */}
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-pulse">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                {/* Glowing effect */}
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Rotating ring */}
                <div className="absolute inset-0 w-10 h-10 border-2 border-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 animate-spin transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Gadget Genie
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted destination for the latest tech gadgets, electronics, and innovative solutions. Quality products, competitive prices, exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Help Centre', 'Careers', 'Press'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns', 'Warranty', 'Track Order', 'Payment Methods'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal & Connect</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility', 'Sell With Us'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2024 Gadget Genie. All rights reserved. | Built with ❤️ for tech enthusiasts
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Powered by</span>
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-md flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 animate-pulse">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <div className="absolute inset-0 w-6 h-6 bg-gradient-to-br from-green-500/50 to-blue-500/50 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xs text-gray-500">Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
