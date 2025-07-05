
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileLoadingScreen = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        
        {/* Moving grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'slide 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: `linear-gradient(45deg, ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399'][Math.floor(Math.random() * 4)]}, transparent)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Main Logo */}
      <div className="mb-16 relative z-10">
        <div className="relative">
          {/* Outer rotating rings */}
          <div className="absolute -inset-4 border-2 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
          <div className="absolute -inset-2 border border-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
          
          {/* Pulsing background */}
          <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-cyan-500/50 via-blue-500/50 to-purple-600/50 rounded-3xl blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
          
          {/* Main logo container */}
          <div className="relative w-28 h-28 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110 animate-bounce border-2 border-white/20">
            <span className="text-white font-bold text-5xl drop-shadow-2xl animate-pulse">G</span>
            
            {/* Inner glow effect */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 w-28 h-28 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>
      </div>

      {/* Enhanced Brand Section */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-5xl font-bold mb-6 relative">
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Gadget Genie
          </span>
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-500/20 blur-2xl animate-pulse"></div>
        </h1>
        <p className="text-cyan-200 text-xl font-medium animate-fade-in mb-6">
          Your Ultimate Tech Destination
        </p>
        
        {/* Animated dots indicator */}
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <span className="text-sm text-gray-300">System Online</span>
        </div>
      </div>

      {/* Advanced Loading Animation */}
      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Multi-layer progress bars */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Loading components...</span>
              <span>87%</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-4/5 bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm mx-auto border border-white/20">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">Initializing database...</div>
          </div>
          
          <div className="relative">
            <div className="w-3/5 bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm mx-auto border border-white/20">
              <div className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">Preparing interface...</div>
          </div>
        </div>
        
        {/* Main status */}
        <div className="text-center">
          <p className="text-lg text-cyan-200 font-medium animate-pulse">
            Crafting your perfect shopping experience
          </p>
          <div className="flex justify-center mt-3">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Product Preview Cards */}
      <div className="w-full max-w-sm mt-16 space-y-4 relative z-10">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index}
            className="flex space-x-4 animate-fade-in bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-500"
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            <div className="relative">
              <Skeleton className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5 bg-gradient-to-r from-white/30 to-white/10 animate-pulse rounded-full" />
              <Skeleton className="h-3 w-3/5 bg-gradient-to-r from-white/20 to-white/5 animate-pulse rounded-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-1/4 bg-gradient-to-r from-cyan-400/40 to-purple-400/40 animate-pulse rounded-full" />
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-yellow-400/60 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with enhanced styling */}
      <div className="absolute bottom-8 text-center relative z-10">
        <div className="flex items-center justify-center space-x-3 text-cyan-200/80 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <p className="text-sm font-medium">
            Powered by cutting-edge technology
          </p>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.9s' }}></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MobileLoadingScreen;
