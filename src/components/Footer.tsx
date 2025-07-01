
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Star, Award, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative z-10">
        {/* Trust Indicators */}
        <div className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Truck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Free Delivery</div>
                  <div className="text-xs text-gray-400">Orders over $50</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-400">100% Protected</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Best Quality</div>
                  <div className="text-xs text-gray-400">Guaranteed</div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm">24/7 Support</div>
                  <div className="text-xs text-gray-400">Always Here</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Enhanced Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                  <span className="text-white font-bold text-xl drop-shadow-lg">G</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Gadget Genie
                  </h3>
                  <p className="text-sm text-gray-400">
                    Your Ultimate Tech Destination
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Gadget Genie is Zimbabwe's premier destination for smartphones, electronics, and home appliances. 
                We offer the latest technology at competitive prices with fast, reliable delivery nationwide.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>+263719337910</span>
                </div>
                <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>info@gadgetgenie.org</span>
                </div>
                <div className="flex items-center hover:text-blue-400 transition-colors duration-300 cursor-pointer group">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>Harare, Zimbabwe</span>
                </div>
              </div>
            </div>

            {/* Shop Section */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div>
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  { name: 'Daily Deals', path: '/deals' },
                  { name: 'Flash Sales', path: '/deals' },
                  { name: 'New Arrivals', path: '/categories' },
                  { name: 'Smartphones', path: '/phones' },
                  { name: 'Electronics', path: '/categories' },
                  { name: 'Audio & Headphones', path: '/audio' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className="hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></div>
                Customer Service
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  { name: 'Help Centre', path: '/help-centre' },
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'Track Order', path: '/track-order' },
                  { name: 'Returns & Refunds', path: '/returns' },
                  { name: 'Shipping Info', path: '/shipping-info' },
                  { name: 'Warranty', path: '/warranty' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className="hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Social */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                Company
              </h4>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {[
                  { name: 'About Us', path: '/about-us' },
                  { name: 'Careers', path: '/careers' },
                  { name: 'Sell with Us', path: '/sell-with-us' },
                  { name: 'Press & Media', path: '/press' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className="hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></div>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div>
                <h5 className="font-bold mb-4 text-white">Follow Us</h5>
                <div className="flex space-x-3">
                  {[
                    { Icon: Facebook, color: 'hover:bg-blue-600', iconColor: 'text-blue-400' },
                    { Icon: Twitter, color: 'hover:bg-blue-400', iconColor: 'text-blue-400' },
                    { Icon: Instagram, color: 'hover:bg-pink-600', iconColor: 'text-pink-400' },
                    { Icon: Youtube, color: 'hover:bg-red-600', iconColor: 'text-red-400' }
                  ].map(({ Icon, color, iconColor }, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className={`bg-gray-800 p-3 rounded-xl ${color} transition-all duration-300 hover:scale-110 transform shadow-lg hover:shadow-xl`}
                    >
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-sm text-gray-400">
                © 2025 Gadget Genie Inc. All rights reserved.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">Secure payments:</span>
                  <div className="flex space-x-2">
                    {[
                      { name: 'VISA', color: 'text-blue-400' },
                      { name: 'PayPal', color: 'text-blue-400' },
                      { name: 'Stripe', color: 'text-purple-400' },
                      { name: 'Apple Pay', color: 'text-gray-400' },
                      { name: 'EcoCash', color: 'text-green-400' },
                      { name: 'InnBucks', color: 'text-orange-400' }
                    ].map((payment, index) => (
                      <span 
                        key={index}
                        className={`bg-gray-800/80 px-3 py-1.5 rounded-lg text-xs font-semibold ${payment.color} hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600`}
                      >
                        {payment.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex flex-wrap justify-center space-x-6 text-xs text-gray-500">
                {[
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Service', path: '/terms-of-service' },
                  { name: 'Cookie Policy', path: '/cookie-policy' },
                  { name: 'Accessibility', path: '/accessibility' }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path} 
                    className="hover:text-gray-300 transition-colors duration-300 hover:underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
