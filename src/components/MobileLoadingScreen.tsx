
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileLoadingScreen = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full animate-ping"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Logo with Enhanced Animation */}
      <div className="mb-12 relative z-10">
        <div className="relative">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-spin opacity-30"></div>
          
          {/* Middle Pulsing Ring */}
          <div className="absolute inset-2 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
          
          {/* Main Logo */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110 animate-bounce">
            <span className="text-white font-bold text-4xl drop-shadow-lg animate-pulse">G</span>
          </div>
          
          {/* Glowing Effect */}
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-2xl blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced Brand Section */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold mb-4 relative">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Gadget Genie
          </span>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-lg animate-pulse"></div>
        </h1>
        <p className="text-blue-200 text-lg font-medium animate-fade-in">
          Your Ultimate Tech Destination
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Loading Animation */}
      <div className="w-full max-w-xs space-y-6 relative z-10">
        {/* Animated Progress Bars */}
        <div className="space-y-4">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse transform transition-all duration-2000 origin-left scale-x-0 animate-[scale-x_2s_ease-in-out_infinite]"></div>
          </div>
          <div className="w-3/4 bg-white/10 rounded-full h-1.5 overflow-hidden backdrop-blur-sm mx-auto">
            <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse transform transition-all duration-1500 origin-left scale-x-0 animate-[scale-x_1.5s_ease-in-out_infinite_0.3s]"></div>
          </div>
        </div>
        
        <p className="text-center text-sm text-blue-200 animate-pulse font-medium">
          Preparing your shopping experience...
        </p>
      </div>

      {/* Enhanced Product Cards Skeleton */}
      <div className="w-full max-w-sm mt-12 space-y-6 relative z-10">
        {[...Array(2)].map((_, index) => (
          <div 
            key={index}
            className="flex space-x-4 animate-fade-in bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <Skeleton className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-white/20 to-white/10 animate-pulse" />
              <Skeleton className="h-3 w-1/2 bg-gradient-to-r from-white/15 to-white/5 animate-pulse" />
              <Skeleton className="h-3 w-1/4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-8 text-center relative z-10">
        <div className="flex items-center justify-center space-x-2 text-blue-200/60">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <p className="text-xs font-medium animate-fade-in">
            Loading the best tech deals for you
          </p>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
        </div>
      </div>

      {/* Custom Keyframes CSS */}
      <style jsx>{`
        @keyframes scale-x {
          0%, 100% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default MobileLoadingScreen;
