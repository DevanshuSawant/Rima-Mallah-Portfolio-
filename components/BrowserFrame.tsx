
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  X,
  Minus,
  Square,
  Globe
} from 'lucide-react';

interface BrowserFrameProps {
  children: React.ReactNode;
  urlPath: string;
}

const BrowserFrame: React.FC<BrowserFrameProps> = ({ children, urlPath }) => {
  const [isClosed, setIsClosed] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  if (isClosed) {
    return (
      <div className="w-full min-h-screen p-6 flex items-center justify-center bg-black">
        <div className="text-center">
            <h1 className="font-pixel text-white text-4xl mb-4">IT IS NOW SAFE TO TURN OFF YOUR COMPUTER.</h1>
            <button 
                onClick={() => setIsClosed(false)}
                className="px-4 py-2 bg-[#c0c0c0] font-pixel border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black hover:bg-[#d0d0d0]"
            >
                RESTART
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#c0c0c0] overflow-hidden">
        
        {/* Title Bar */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-white" />
            <span className="text-white font-pixel text-lg tracking-widest mt-1">RIMA_MALLAH_PORTFOLIO.EXE</span>
          </div>
          
          <div className="flex space-x-1">
            <button 
                className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-r-gray-800 border-b-gray-800 flex items-center justify-center active:border-t-gray-800 active:border-l-gray-800 active:border-r-white active:border-b-white hover:bg-[#d0d0d0]"
            >
                <Minus size={12} className="text-black" />
            </button>
            <button 
                className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-r-gray-800 border-b-gray-800 flex items-center justify-center active:border-t-gray-800 active:border-l-gray-800 active:border-r-white active:border-b-white hover:bg-[#d0d0d0]"
            >
                <Square size={10} className="text-black" />
            </button>
            <button 
                onClick={() => setIsClosed(true)}
                className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-r-gray-800 border-b-gray-800 flex items-center justify-center active:border-t-gray-800 active:border-l-gray-800 active:border-r-white active:border-b-white hover:bg-red-600 group"
            >
                <X size={14} className="text-black group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Address Bar Area */}
        <div className="bg-[#c0c0c0] px-3 py-2 border-b-2 border-gray-600 flex items-center gap-3 shrink-0">
            <div className="flex gap-1 text-gray-800">
                <button 
                    onClick={handleBack}
                    className="w-8 h-8 border-2 border-white border-r-gray-600 border-b-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white bg-[#c0c0c0] hover:bg-[#d0d0d0]"
                >
                    <ArrowLeft size={16} className="text-black" />
                </button>
                <button 
                    onClick={handleForward}
                    className="w-8 h-8 border-2 border-white border-r-gray-600 border-b-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white bg-[#c0c0c0] hover:bg-[#d0d0d0]"
                >
                    <ArrowRight size={16} className="text-black" />
                </button>
                <button 
                    onClick={handleRefresh}
                    className="w-8 h-8 border-2 border-white border-r-gray-600 border-b-gray-600 flex items-center justify-center active:border-gray-600 active:border-b-white active:border-r-white bg-[#c0c0c0] hover:bg-[#d0d0d0]"
                >
                    <RotateCcw size={16} className="text-black" />
                </button>
            </div>

            <div className="flex items-center gap-2 flex-1">
                <span className="font-pixel text-lg text-black hidden sm:inline">Address:</span>
                <div className="flex-1 bg-white border-2 border-gray-600 border-b-white border-r-white h-8 flex items-center px-2">
                    <span className="font-pixel text-lg text-black truncate">{urlPath}</span>
                </div>
            </div>
        </div>

        {/* Main Viewport */}
        <div className="flex-1 overflow-hidden relative bg-white flex flex-col border-t-2 border-gray-600">
            {children}
        </div>
        
        {/* Status Bar */}
        <div className="bg-[#c0c0c0] px-2 py-1 text-xs text-black font-pixel border-t border-white flex justify-between shrink-0">
            <span>Done</span>
            <span>My Computer</span>
        </div>
    </div>
  );
};

export default BrowserFrame;
