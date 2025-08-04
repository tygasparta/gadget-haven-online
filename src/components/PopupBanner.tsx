
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Zap, Smartphone, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PopupBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show banner after 3 seconds, but only if user hasn't dismissed it before
    const hasSeenBanner = localStorage.getItem('gadgetgenie-banner-dismissed');
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('gadgetgenie-banner-dismissed', 'true');
  };

  const handleShopNow = () => {
    navigate('/products');
    handleClose();
  };

  const handleDealsClick = () => {
    navigate('/deals');
    handleClose();
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/${category}`);
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes modalSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes backdropFadeIn {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          100% {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .modal-backdrop {
          animation: backdropFadeIn 0.5s ease-out;
        }
        
        .modal-content {
          animation: modalSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6);
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        
        .card-hover-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/60 modal-backdrop z-[100] flex items-center justify-center p-4">
        <Card className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-2xl modal-content overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl float-animation"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl float-animation" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full blur-xl float-animation" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 group"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
          </button>

          {/* Desktop Layout */}
          <div className="hidden md:flex relative z-10">
            {/* Left Side - Content */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-4 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg pulse-animation">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <h1 className="text-2xl font-bold shimmer-text">
                    GadgetGenie
                  </h1>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Tech Magic
                  <span className="block text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Awaits You! ✨
                  </span>
                </h2>

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Discover cutting-edge gadgets, exclusive deals, and the latest tech innovations. Your next favorite device is just a click away!
                </p>

                {/* Enhanced Feature Highlights */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Flash Deals</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Latest Phones</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    <Headphones className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Premium Audio</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleShopNow}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <ShoppingCart className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Shop Now</span>
                  </Button>
                  <Button
                    onClick={handleDealsClick}
                    variant="outline"
                    className="border-2 border-purple-200 hover:border-purple-300 px-8 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105 group"
                  >
                    <span className="group-hover:animate-pulse">View Deals</span>
                  </Button>
                </div>

                {/* Quick Category Links */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleCategoryClick('phones')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-all duration-300 hover:scale-105"
                  >
                    Phones
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    onClick={() => handleCategoryClick('audio')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-all duration-300 hover:scale-105"
                  >
                    Audio
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    onClick={() => handleCategoryClick('deals')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-all duration-300 hover:scale-105"
                  >
                    Flash Sales
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Gadget Images */}
            <div className="flex-1 relative p-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg card-hover-effect">
                    <img 
                      src="/lovable-uploads/aea86624-8458-49d3-bd4a-0d1a09221adb.png" 
                      alt="Smartphones" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-2 text-center">Smartphones</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg card-hover-effect">
                    <img 
                      src="/lovable-uploads/ec6b5870-e30a-464d-bb91-870607d474b9.png" 
                      alt="Audio & Headphones" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-2 text-center">Audio & Headphones</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg card-hover-effect">
                    <img 
                      src="/lovable-uploads/5a5bc428-37ca-4936-812a-0aac4ff01635.png" 
                      alt="Laptops & Computers" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-2 text-center">Laptops & Computers</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg card-hover-effect">
                    <img 
                      src="/lovable-uploads/17dd886e-e0ec-4816-a1fe-c6282cbd2a03.png" 
                      alt="Gaming" 
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <p className="text-sm font-medium text-gray-700 mt-2 text-center">Gaming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Layout */}
          <div className="md:hidden p-6 relative z-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg pulse-animation">
                  <span className="text-white font-bold">G</span>
                </div>
                <h1 className="text-xl font-bold shimmer-text">
                  GadgetGenie
                </h1>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Tech Magic Awaits! ✨
              </h2>

              <p className="text-gray-600 mb-6">
                Discover cutting-edge gadgets and exclusive deals on your favorite tech!
              </p>
            </div>

            {/* Enhanced Mobile Gadget Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md card-hover-effect">
                <img 
                  src="/lovable-uploads/aea86624-8458-49d3-bd4a-0d1a09221adb.png" 
                  alt="Smartphones" 
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs font-medium text-gray-700 mt-2 text-center">Smartphones</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md card-hover-effect">
                <img 
                  src="/lovable-uploads/17dd886e-e0ec-4816-a1fe-c6282cbd2a03.png" 
                  alt="Gaming" 
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs font-medium text-gray-700 mt-2 text-center">Gaming</p>
              </div>
            </div>

            {/* Enhanced Mobile Feature Highlights */}
            <div className="flex justify-center gap-2 mb-6">
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-300">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700">Flash Deals</span>
              </div>
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-300">
                <Smartphone className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">New Arrivals</span>
              </div>
            </div>

            {/* Enhanced Mobile Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleShopNow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <ShoppingCart className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Shop Now</span>
              </Button>
              <Button
                onClick={handleDealsClick}
                variant="outline"
                className="w-full border-2 border-purple-200 hover:border-purple-300 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              >
                View Deals
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default PopupBanner;
