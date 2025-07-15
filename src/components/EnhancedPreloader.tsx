
import React, { useEffect, useState } from 'react';

const EnhancedPreloader = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    'Initializing Gadget Genie...',
    'Loading product catalog...',
    'Connecting to secure servers...',
    'Optimizing your experience...',
    'Almost ready!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with enhanced gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-purple-600/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/40 via-pink-500/30 to-red-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        
        {/* Moving grid pattern */}
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

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: `linear-gradient(45deg, ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][Math.floor(Math.random() * 6)]}, transparent)`,
              animationDelay: `${i * 0.2}s`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Main Logo with Enhanced Animation */}
      <div className="mb-16 relative z-10">
        <div className="relative">
          {/* Multiple rotating rings */}
          <div className="absolute -inset-12 border-2 border-cyan-400/50 rounded-full animate-spin" style={{ animationDuration: '15s' }}></div>
          <div className="absolute -inset-8 border-2 border-purple-400/40 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
          <div className="absolute -inset-4 border border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
          
          {/* Pulsing background layers */}
          <div className="absolute inset-0 w-40 h-40 bg-gradient-to-br from-cyan-400/60 via-blue-500/60 to-purple-600/60 rounded-3xl blur-3xl animate-pulse" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-2 w-36 h-36 bg-gradient-to-br from-purple-400/40 via-pink-500/40 to-cyan-500/40 rounded-3xl blur-xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          
          {/* Main logo container */}
          <div className="relative w-40 h-40 bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl transform animate-bounce border-4 border-white/30 backdrop-blur-sm">
            <span className="text-white font-bold text-7xl drop-shadow-2xl animate-pulse" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}>G</span>
            
            {/* Inner glow effects */}
            <div className="absolute inset-3 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
            <div className="absolute inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl"></div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 w-40 h-40 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-ping shadow-lg" style={{ boxShadow: '0 0 15px #22d3ee' }}></div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 0 15px #a855f7' }}></div>
            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-pink-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '2s', boxShadow: '0 0 15px #f472b6' }}></div>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full animate-ping shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 0 15px #3b82f6' }}></div>
          </div>
        </div>
      </div>

      {/* Enhanced Brand Section */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 relative">
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
        </h1>
        
        <p className="text-cyan-100 text-lg sm:text-xl md:text-2xl font-medium animate-fade-in mb-8 tracking-wide">
          Your Ultimate Tech Destination
        </p>
      </div>

      {/* Enhanced Progress Section */}
      <div className="w-full max-w-md px-4 relative z-10">
        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-md border-2 border-white/30 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative overflow-hidden transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-cyan-200 mt-2 font-medium">
            <span>{steps[currentStep]}</span>
            <span className="animate-pulse">{progress}%</span>
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
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

        {/* Status Message */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl text-cyan-100 font-semibold animate-pulse mb-4 tracking-wide">
            Preparing your perfect tech experience
          </p>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center relative z-10">
        <div className="flex items-center justify-center space-x-4 text-cyan-100/90 bg-black/30 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/20 shadow-2xl">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-sm sm:text-base font-semibold tracking-wide">
            Powered by cutting-edge technology
          </p>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: `${(i + 3) * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes float-particle {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg) scale(1); 
              opacity: 0.6;
            }
            50% { 
              transform: translateY(-40px) rotate(180deg) scale(1.3); 
              opacity: 1;
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default EnhancedPreloader;
