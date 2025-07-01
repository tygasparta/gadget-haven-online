
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileLoadingScreen = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col items-center justify-center px-4">
      {/* Animated Logo */}
      <div className="mb-8 relative">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
          <span className="text-white font-bold text-3xl drop-shadow-lg">G</span>
        </div>
        
        {/* Pulsing rings around logo */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl animate-ping"></div>
        <div className="absolute -inset-2 w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl animate-ping animation-delay-200"></div>
      </div>

      {/* Brand Name with Gradient Animation */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-pulse">
          Gadget Genie
        </h1>
        <p className="text-gray-600 text-sm animate-fade-in">
          Your Ultimate Tech Destination
        </p>
      </div>

      {/* Loading Animation */}
      <div className="w-full max-w-xs space-y-4">
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-center text-sm text-gray-500 animate-pulse">
          Loading your shopping experience...
        </p>
      </div>

      {/* Product Cards Skeleton */}
      <div className="w-full max-w-sm mt-8 space-y-4">
        <div className="flex space-x-4">
          <Skeleton className="w-20 h-20 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <Skeleton className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <Skeleton className="h-3 w-1/4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Skeleton className="w-20 h-20 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse animation-delay-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse animation-delay-200" />
            <Skeleton className="h-3 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse animation-delay-200" />
            <Skeleton className="h-3 w-1/5 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse animation-delay-200" />
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-400 animate-fade-in">
          Preparing the best deals for you
        </p>
      </div>
    </div>
  );
};

export default MobileLoadingScreen;
