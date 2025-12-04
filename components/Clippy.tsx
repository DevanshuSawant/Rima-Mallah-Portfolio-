import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ClippyProps {
  activeTab?: string;
  overrideMessage?: string | null;
}

const Clippy: React.FC<ClippyProps> = ({ activeTab, overrideMessage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("Hi! I'm Clippy. I can help you explore Rima's portfolio.");
  const [isTalking, setIsTalking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasGreetedRef = useRef(false);

  const speak = (text: string, duration?: number) => {
    // Clear any existing timeout to prevent state conflicts
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }

    setMessage(text);
    setIsTalking(true);

    if (duration) {
        timeoutRef.current = setTimeout(() => setIsTalking(false), duration);
    }
  };

  // Handle Interaction Overrides (Hover, Click)
  useEffect(() => {
    if (overrideMessage) {
        // Speak without timeout (stays while hovering)
        speak(overrideMessage);
    } else {
        // Stop talking immediately when hover ends
        setIsTalking(false);
    }
  }, [overrideMessage]);

  // Handle Tab Changes
  useEffect(() => {
    // If an interaction is active (e.g. hovering), do not interrupt with tab message
    if (overrideMessage) return;

    // Check if this is the very first render/greeting
    if (!hasGreetedRef.current) {
        speak("Hi there! Welcome to Rima's Portfolio. I'm here to help you navigate!", 5000);
        hasGreetedRef.current = true;
        return; 
    }

    let msg = "Welcome! Click around to see Rima's work.";
    
    if (activeTab === 'Editorial') {
        msg = "Editorial pieces! This is where the deep, meaningful storytelling lives.";
    } else if (activeTab === 'Social') {
        msg = "Social Media! Short, snappy, and designed to stop the scroll.";
    } else if (activeTab === 'Promotional') {
        msg = "Promotional content that sells without sounding like a sales pitch.";
    } else if (activeTab === 'Musings') {
        msg = "Musings are perfect for late-night thoughts and poetic vibes.";
    } else if (activeTab === 'Reels') {
        msg = "Video content is king! Check out these scripts and visual directions.";
    } else if (activeTab === 'Carousels') {
        msg = "Swipe left! Carousels are great for step-by-step storytelling.";
    } else if (activeTab === 'Scripts') {
        msg = "Scripts! The backbone of great video content.";
    }

    speak(msg, 3000);
    
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeTab]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end animate-bounce-slight">
      
      {/* Speech Bubble */}
      {(isTalking || overrideMessage) && (
          <div className="relative bg-[#ffffcc] text-black border border-black p-3 mb-2 rounded-lg shadow-md max-w-[200px] font-pixel text-lg leading-tight">
            {message}
            <button 
                onClick={() => setIsVisible(false)} 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center border border-black text-xs hover:bg-red-600"
            >
                <X size={10} />
            </button>
            {/* Tail */}
            <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-[#ffffcc] border-r border-b border-black transform rotate-45"></div>
          </div>
      )}

      {/* Clippy GIF Character */}
      <div 
        className="w-24 h-24 sm:w-32 sm:h-32 transition-transform hover:scale-110 cursor-pointer" 
        onClick={() => {
          speak("Need help? Just click the tabs above to filter the work!", 4000);
        }}
      >
        <img 
            src="https://media.tenor.com/Tmu1IbKTtosAAAAi/clippy.gif" 
            alt="Clippy" 
            className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default Clippy;