
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileLoadingScreen = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-600/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/40 via-blue-600/30 to-blue-700/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full animate-pulse" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '60px 60px',
              animation: 'pulse 8s ease-in-out infinite'
            }}
          ></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              background: `linear-gradient(45deg, ${['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#dbeafe', '#1d4ed8'][Math.floor(Math.random() * 6)]}, transparent)`,
              animationDelay: `${i * 0.3}s`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Main Logo */}
      <div className="mb-20 relative z-10">
        <div className="relative">
          <div className="absolute -inset-8 border-2 border-blue-400/50 rounded-full animate-spin opacity-80" style={{ animationDuration: '12s' }}></div>
          <div className="absolute -inset-6 border-2 border-blue-300/40 rounded-full animate-spin opacity-60" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
          <div className="absolute -inset-4 border border-blue-200/30 rounded-full animate-spin opacity-40" style={{ animationDuration: '8s' }}></div>
          
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-400/60 via-blue-500/60 to-blue-600/60 rounded-3xl blur-2xl animate-pulse" style={{ animationDuration: '2s' }}></div>
          
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce border-4 border-white/30 backdrop-blur-sm">
            <span className="text-white font-bold text-6xl drop-shadow-2xl animate-pulse" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}>G</span>
            <div className="absolute inset-3 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 w-32 h-32 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-300 rounded-full animate-ping shadow-lg" style={{ boxShadow: '0 0 10px #93c5fd' }}></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 0 10px #60a5fa' }}></div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping shadow-lg" style={{ animationDelay: '2s', boxShadow: '0 0 10px #3b82f6' }}></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-200 rounded-full animate-ping shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 0 10px #bfdbfe' }}></div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="text-center mb-20 relative z-10">
        <h1 className="text-6xl font-bold mb-8 relative">
          <span 
            className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-100 bg-clip-text text-transparent animate-pulse"
            style={{ 
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
            }}
          >
            GadgetGenie
          </span>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/30 via-blue-400/30 to-blue-500/30 blur-3xl animate-pulse"></div>
        </h1>
        
        <p className="text-blue-100 text-2xl font-medium animate-fade-in mb-8 tracking-wide">
          Your Ultimate Tech Destination
        </p>
        
        <div className="flex justify-center space-x-3 mb-6">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full animate-bounce shadow-lg"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)'
              }}
            />
          ))}
        </div>

        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 shadow-2xl">
          <div className="relative">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <span className="text-lg text-gray-200 font-semibold tracking-wide">System Online & Optimized</span>
        </div>
      </div>

      {/* Loading Animation */}
      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="space-y-6">
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-md border-2 border-white/30 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full relative overflow-hidden"
                style={{ animation: 'loading-bar 3s ease-in-out infinite', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-blue-200 mt-2 font-medium">
              <span>Loading core components...</span>
              <span className="animate-pulse">92%</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-4/5 bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-md mx-auto border border-white/30">
              <div 
                className="h-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded-full relative overflow-hidden"
                style={{ animation: 'loading-bar 4s ease-in-out infinite 0.5s' }}
              ></div>
            </div>
            <div className="text-center text-sm text-blue-200 mt-2 font-medium">Initializing secure database connection...</div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-2xl text-blue-100 font-semibold animate-pulse mb-4 tracking-wide">
            Crafting your perfect tech shopping experience
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full animate-bounce shadow-lg"
                  style={{ animationDelay: `${i * 0.2}s`, boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Preview Cards */}
      <div className="w-full max-w-md mt-20 space-y-6 relative z-10">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index}
            className="flex space-x-5 animate-fade-in bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 shadow-2xl"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <div className="relative">
              <Skeleton className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/40 to-blue-700/40 animate-pulse border border-white/20" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-5/6 bg-gradient-to-r from-white/40 to-white/20 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-4/6 bg-gradient-to-r from-white/30 to-white/10 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-1/3 bg-gradient-to-r from-blue-400/50 to-blue-600/50 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center relative z-10">
        <div className="flex items-center justify-center space-x-4 text-blue-100/90 bg-black/30 backdrop-blur-lg px-8 py-4 rounded-full border-2 border-white/20 shadow-2xl">
          <p className="text-lg font-semibold tracking-wide">
            Powered by next-generation technology
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
            50% { transform: translateY(-30px) rotate(180deg) scale(1.2); opacity: 1; }
          }
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default MobileLoadingScreen;
