
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Animated Company Info */}
          <div>
            <div className="flex items-center mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-2xl animate-pulse hover:animate-none cursor-pointer">
                <span className="text-white font-bold text-lg drop-shadow-lg">G</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  Gadget Genie
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Your Ultimate Tech Destination
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Gadget Genie is Zimbabwe's premier destination for smartphones, electronics, and home appliances. 
              We offer the latest technology at competitive prices with fast, reliable delivery nationwide.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span>+263719337910</span>
              </div>
              <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span>info@gadgetgenie.org</span>
              </div>
              <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/deals" className="hover:text-white transition-colors">Daily Deals</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Flash Sales</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/phones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/audio" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/help-centre" className="hover:text-white transition-colors">Help Centre</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping-info" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/sell-with-us" className="hover:text-white transition-colors">Sell with Us</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press & Media</Link></li>
            </ul>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-3 text-white">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 p-2 rounded hover:bg-blue-600 transition-colors hover:scale-110 transform duration-200">
                  <Facebook className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded hover:bg-blue-400 transition-colors hover:scale-110 transform duration-200">
                  <Twitter className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded hover:bg-pink-600 transition-colors hover:scale-110 transform duration-200">
                  <Instagram className="w-5 h-5 text-pink-400" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded hover:bg-red-600 transition-colors hover:scale-110 transform duration-200">
                  <Youtube className="w-5 h-5 text-red-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Gadget Genie Inc. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Secure payments:</span>
              <div className="flex space-x-2">
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-blue-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">VISA</span>
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-blue-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">PayPal</span>
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-purple-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">Stripe</span>
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">Apple Pay</span>
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-green-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">EcoCash</span>
                <span className="bg-gray-800 px-3 py-1 rounded text-xs text-orange-400 font-semibold hover:bg-gray-700 transition-colors cursor-pointer">InnBucks</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap justify-center space-x-6 text-xs text-gray-500">
              <Link to="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-gray-300">Cookie Policy</Link>
              <Link to="/accessibility" className="hover:text-gray-300">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
