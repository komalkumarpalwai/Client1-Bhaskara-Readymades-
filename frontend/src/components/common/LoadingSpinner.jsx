import React from 'react';
import { logo } from '../../assets/index.js';

/**
 * LoadingSpinner
 * A premium, branded loading spinner with pulsing logo/halo, shimmer ring, and subtle status message.
 */
const LoadingSpinner = ({ message = 'Loading collections...', fullScreen = false, minHeight = 'min-h-[320px]' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${fullScreen ? 'fixed inset-0 bg-white/90 backdrop-blur-md z-50' : minHeight}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-3 border-transparent border-t-amber-600 border-r-indigo-600 border-b-rose-600 animate-spin" />
        
        {/* Inner subtle pulse background ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-slate-200/60 animate-ping opacity-25 pointer-events-none" />

        {/* Center Brand Icon / Favicon badge */}
        <div className="absolute w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center overflow-hidden p-0.5">
          <img 
            src={logo} 
            alt="Bhaskara Readymades" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Text label */}
      <div className="mt-4 text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
          {message}
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          Bhaskara Readymades • Saripalli, Ganapavaram
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
