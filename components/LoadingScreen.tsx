
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 font-sans select-none cursor-wait">
        
        <div className="flex flex-col items-center mb-16 scale-75 sm:scale-100">
            <div className="flex items-start gap-4">
                {/* Logo SVG (Windows Flag Approximation) */}
                <div className="w-20 h-20 relative">
                     <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                        <path d="M46 43 L46 5 C29 5 11 10 3 13 L3 43 Z" fill="#f25022" />
                        <path d="M52 43 L52 7 C64 7 85 11 95 13 L95 43 Z" fill="#7fba00" />
                        <path d="M46 49 L46 87 C29 89 11 85 3 83 L3 49 Z" fill="#00a4ef" />
                        <path d="M52 49 L52 85 C64 84 85 87 95 89 L95 49 Z" fill="#ffb900" />
                     </svg>
                </div>
                
                {/* Text */}
                <div className="flex flex-col text-white">
                    <span className="text-xl font-medium leading-none opacity-90 relative top-1">Content Strategist</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold tracking-tight leading-none">Rima</span>
                        <sup className="text-4xl font-bold text-[#f25022] top-[-0.6em]">Mallah</sup>
                    </div>
                    <span className="text-xl font-light tracking-[0.15em] pl-1 mt-1 opacity-90 border-l-2 border-[#f25022] leading-none ml-1 px-2">
                        Portfolio Edition
                    </span> 
                </div>
            </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-64 h-[18px] border-[2px] border-[#b2b2b2] rounded-[4px] p-[2px] overflow-hidden bg-black box-border">
            {/* Moving Blocks */}
            <div className="absolute top-[2px] bottom-[2px] w-auto flex gap-[2px] animate-xp-loading">
                <div className="w-[10px] h-full bg-gradient-to-b from-[#2d4d94] via-[#5b85d9] to-[#2d4d94] rounded-[1px] shadow-[0_0_2px_rgba(255,255,255,0.4)]"></div>
                <div className="w-[10px] h-full bg-gradient-to-b from-[#2d4d94] via-[#5b85d9] to-[#2d4d94] rounded-[1px] shadow-[0_0_2px_rgba(255,255,255,0.4)]"></div>
                <div className="w-[10px] h-full bg-gradient-to-b from-[#2d4d94] via-[#5b85d9] to-[#2d4d94] rounded-[1px] shadow-[0_0_2px_rgba(255,255,255,0.4)]"></div>
            </div>
        </div>

        {/* Copyright Footer */}
        <div className="absolute left-0 w-full px-12 flex justify-between items-end" style={{ bottom: 'max(3rem, env(safe-area-inset-bottom, 0px) + 1rem)' }}>
            <span className="text-white/80 text-sm font-medium">Copyright © Rima Mallah</span>
            <span className="text-white font-bold text-lg italic tracking-tight opacity-80">Rima Mallah</span>
        </div>
    </div>
  );
};

export default LoadingScreen;
