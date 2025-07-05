
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileLoadingScreen = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs with enhanced gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-purple-600/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/40 via-pink-500/30 to-red-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-teal-400/25 to-cyan-500/25 rounded-full blur-xl" style={{ animation: 'pulse 3s ease-in-out infinite alternate' }}></div>
        
        {/* Enhanced moving grid pattern */}
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

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/6 w-4 h-4 bg-cyan-400/60 transform rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 right-1/5 w-6 h-6 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-3/4 w-3 h-12 bg-pink-400/50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Enhanced Animated Particles */}
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
              background: `linear-gradient(45deg, ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][Math.floor(Math.random() * 6)]}, transparent)`,
              animationDelay: `${i * 0.3}s`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Ultra Enhanced Main Logo */}
      <div className="mb-20 relative z-10">
        <div className="relative">
          {/* Multiple rotating rings */}
          <div className="absolute -inset-8 border-2 border-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 rounded-full animate-spin opacity-80" style={{ animationDuration: '12s' }}></div>
          <div className="absolute -inset-6 border-2 border-gradient-to-r from-purple-300 via-pink-400 to-cyan-400 rounded-full animate-spin opacity-60" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
          <div className="absolute -inset-4 border border-gradient-to-r from-pink-300 via-purple-400 to-blue-400 rounded-full animate-spin opacity-40" style={{ animationDuration: '8s' }}></div>
          
          {/* Enhanced pulsing background with multiple layers */}
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-cyan-400/60 via-blue-500/60 to-purple-600/60 rounded-3xl blur-2xl animate-pulse" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-2 w-28 h-28 bg-gradient-to-br from-purple-400/40 via-pink-500/40 to-cyan-500/40 rounded-3xl blur-xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          
          {/* Main logo container with enhanced styling */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110 animate-bounce border-4 border-white/30 backdrop-blur-sm">
            <span className="text-white font-bold text-6xl drop-shadow-2xl animate-pulse" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}>G</span>
            
            {/* Enhanced inner glow effects */}
            <div className="absolute inset-3 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
            <div className="absolute inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl"></div>
          </div>
          
          {/* Enhanced orbiting dots with trails */}
          <div className="absolute inset-0 w-32 h-32 animate-spin" style={{ animationDuration: '6s' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-lg" style={{ boxShadow: '0 0 10px #22d3ee' }}></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 0 10px #a855f7' }}></div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '2s', boxShadow: '0 0 10px #f472b6' }}></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 0 10px #3b82f6' }}></div>
          </div>

          {/* Corner accent elements */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -top-4 -right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute -bottom-4 -left-4 w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        </div>
      </div>

      {/* Ultra Enhanced Brand Section */}
      <div className="text-center mb-20 relative z-10">
        <h1 className="text-6xl font-bold mb-8 relative">
          <span 
            className="bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-400 bg-clip-text text-transparent animate-pulse"
            style={{ 
              textShadow: '0 0 30px rgba(34, 211, 238, 0.5)',
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
            }}
          >
            Gadget Genie
          </span>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300/30 via-blue-400/30 to-purple-500/30 blur-3xl animate-pulse"></div>
          
          {/* Floating accent marks */}
          <div className="absolute -top-2 -left-2 text-yellow-400 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute -top-2 -right-2 text-pink-400 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>⚡</div>
        </h1>
        
        <p className="text-cyan-100 text-2xl font-medium animate-fade-in mb-8 tracking-wide">
          Your Ultimate Tech Destination
        </p>
        
        {/* Enhanced animated dots indicator with wave effect */}
        <div className="flex justify-center space-x-3 mb-6">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-cyan-300 to-purple-400 rounded-full animate-bounce shadow-lg"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                boxShadow: `0 0 15px ${['#22d3ee', '#3b82f6', '#8b5cf6', '#d946ef', '#f97316', '#eab308', '#22c55e'][i]}`
              }}
            />
          ))}
        </div>

        {/* Enhanced status indicator */}
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 shadow-2xl">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-lg text-gray-200 font-semibold tracking-wide">System Online & Optimized</span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Ultra Advanced Loading Animation */}
      <div className="w-full max-w-md space-y-10 relative z-10">
        {/* Multi-layer progress bars with enhanced styling */}
        <div className="space-y-6">
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-md border-2 border-white/30 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative overflow-hidden"
                style={{ 
                  animation: 'loading-bar 3s ease-in-out infinite',
                  boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-cyan-200 mt-2 font-medium">
              <span>Loading core components...</span>
              <span className="animate-pulse">92%</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-4/5 bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-md mx-auto border border-white/30">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 rounded-full relative overflow-hidden"
                style={{ animation: 'loading-bar 4s ease-in-out infinite 0.5s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <div className="text-center text-sm text-purple-200 mt-2 font-medium">Initializing secure database connection...</div>
          </div>
          
          <div className="relative">
            <div className="w-3/5 bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-md mx-auto border border-white/30">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 rounded-full relative overflow-hidden"
                style={{ animation: 'loading-bar 5s ease-in-out infinite 1s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            <div className="text-center text-sm text-pink-200 mt-2 font-medium">Crafting perfect user interface...</div>
          </div>
        </div>
        
        {/* Enhanced main status */}
        <div className="text-center">
          <p className="text-2xl text-cyan-100 font-semibold animate-pulse mb-4 tracking-wide">
            Crafting your perfect tech shopping experience
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-cyan-300 to-purple-400 rounded-full animate-bounce shadow-lg"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Product Preview Cards */}
      <div className="w-full max-w-md mt-20 space-y-6 relative z-10">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index}
            className="flex space-x-5 animate-fade-in bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-700 hover:scale-105"
            style={{ 
              animationDelay: `${index * 0.3}s`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <div className="relative">
              <Skeleton className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-purple-500/40 animate-pulse border border-white/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-5/6 bg-gradient-to-r from-white/40 to-white/20 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-4/6 bg-gradient-to-r from-white/30 to-white/10 animate-pulse rounded-full" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-1/3 bg-gradient-to-r from-cyan-400/50 to-purple-400/50 animate-pulse rounded-full" />
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-yellow-400/80 rounded-full animate-ping" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ultra Enhanced Footer */}
      <div className="absolute bottom-8 text-center relative z-10">
        <div className="flex items-center justify-center space-x-4 text-cyan-100/90 bg-black/30 backdrop-blur-lg px-8 py-4 rounded-full border-2 border-white/20 shadow-2xl">
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-lg font-semibold tracking-wide">
            Powered by next-generation technology
          </p>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: `${(i + 4) * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles using Tailwind's style approach */}
      <style>
        {`
          @keyframes float-particle {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg) scale(1); 
              opacity: 0.6;
            }
            50% { 
              transform: translateY(-30px) rotate(180deg) scale(1.2); 
              opacity: 1;
            }
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
