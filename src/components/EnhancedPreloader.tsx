
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedPreloader = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();
  
  const steps = [
    'Initializing Gadget Genie...',
    'Loading product catalog...',
    'Connecting to secure servers...',
    'Optimizing your experience...',
    'Almost ready!'
  ];

  useEffect(() => {
    console.log('EnhancedPreloader mounted');
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 4 + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex flex-col items-center justify-center z-50 overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute -top-20 -right-20 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-600/40 rounded-full blur-3xl animate-pulse`} 
          style={{ animationDuration: '4s' }}
        ></div>
        <div 
          className={`absolute -bottom-20 -left-20 ${isMobile ? 'w-40 h-40' : 'w-80 h-80'} bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-700/40 rounded-full blur-3xl animate-pulse`} 
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        ></div>
        <div 
          className={`absolute top-1/3 right-1/3 ${isMobile ? 'w-30 h-30' : 'w-60 h-60'} bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-2xl animate-pulse`} 
          style={{ animationDelay: '1s', animationDuration: '6s' }}
        ></div>
        
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full animate-pulse" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: isMobile ? '40px 40px' : '60px 60px',
              animation: 'pulse 8s ease-in-out infinite'
            }}
          ></div>
        </div>

        {[...Array(isMobile ? 15 : 25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * (isMobile ? 6 : 8) + (isMobile ? 3 : 4)}px`,
              height: `${Math.random() * (isMobile ? 6 : 8) + (isMobile ? 3 : 4)}px`,
              background: `linear-gradient(45deg, ${['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#93c5fd', '#dbeafe'][Math.floor(Math.random() * 6)]}, transparent)`,
              animationDelay: `${i * 0.2}s`,
              animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Main Logo */}
      <div className={`${isMobile ? 'mb-8' : 'mb-16'} relative z-10`}>
        <div className="relative">
          <div className={`absolute ${isMobile ? '-inset-6' : '-inset-12'} border-2 border-blue-400/50 rounded-full animate-spin`} style={{ animationDuration: '8s' }}></div>
          <div className={`absolute ${isMobile ? '-inset-4' : '-inset-8'} border-2 border-blue-300/40 rounded-full animate-spin`} style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
          <div className={`absolute ${isMobile ? '-inset-2' : '-inset-4'} border border-blue-200/30 rounded-full animate-spin`} style={{ animationDuration: '4s' }}></div>
          
          <div className={`absolute inset-0 ${isMobile ? 'w-24 h-24' : 'w-40 h-40'} bg-gradient-to-br from-blue-400/60 via-blue-500/60 to-blue-600/60 rounded-3xl blur-3xl animate-pulse`}></div>
          <div className={`absolute ${isMobile ? 'inset-1' : 'inset-2'} ${isMobile ? 'w-22 h-22' : 'w-36 h-36'} bg-gradient-to-br from-blue-300/40 via-blue-500/40 to-blue-700/40 rounded-3xl blur-xl animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
          
          <div className={`relative ${isMobile ? 'w-24 h-24' : 'w-40 h-40'} bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-sm animate-bounce`}>
            <span 
              className={`text-white font-bold ${isMobile ? 'text-4xl' : 'text-7xl'} drop-shadow-2xl animate-pulse`} 
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.8)' }}
            >
              G
            </span>
            <div className={`absolute ${isMobile ? 'inset-2' : 'inset-3'} bg-gradient-to-br from-white/30 to-transparent rounded-2xl`}></div>
            <div className="absolute inset-1 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl"></div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'} relative z-10`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-bold mb-4 sm:mb-6 relative animate-pulse`}>
          <span 
            className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-100 bg-clip-text text-transparent"
            style={{ 
              textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
            }}
          >
            GadgetGenie
          </span>
          <div className={`absolute ${isMobile ? '-inset-2' : '-inset-4'} bg-gradient-to-r from-blue-300/30 via-blue-400/30 to-blue-500/30 blur-3xl animate-pulse`}></div>
        </h1>
        
        <p className={`text-blue-100 ${isMobile ? 'text-sm' : 'text-lg sm:text-xl md:text-2xl'} font-medium animate-fade-in mb-6 sm:mb-8 tracking-wide`}>
          Your Ultimate Tech Destination
        </p>
      </div>

      {/* Progress Section */}
      <div className={`w-full ${isMobile ? 'max-w-xs' : 'max-w-md'} px-4 relative z-10`}>
        <div className={`relative ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className={`w-full bg-white/20 rounded-full ${isMobile ? 'h-3' : 'h-4'} overflow-hidden backdrop-blur-md border-2 border-white/30 shadow-inner`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full relative overflow-hidden transition-all duration-500 ease-out"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-blue-200 mt-2 font-medium`}>
            <span className="truncate pr-2 animate-pulse">{steps[currentStep]}</span>
            <span className="animate-pulse flex-shrink-0">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className={`flex justify-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-gradient-to-r from-blue-300 to-blue-500 rounded-full animate-bounce shadow-lg`}
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className={`${isMobile ? 'text-sm' : 'text-xl sm:text-2xl'} text-blue-100 font-semibold animate-pulse mb-4 tracking-wide`}>
            {isMobile ? 'Preparing your tech experience' : 'Preparing your perfect tech experience'}
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
            50% { transform: translateY(-40px) rotate(180deg) scale(1.3); opacity: 1; }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 1s ease-out; }
        `}
      </style>
    </div>
  );
};

export default EnhancedPreloader;
