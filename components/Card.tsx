import React from 'react';
import { PortfolioItem } from '../types';
import { ExternalLink } from 'lucide-react';

interface CardProps {
  item: PortfolioItem;
  onInteraction: (message: string | null) => void;
}

const getBrandColor = (brand: string) => {
    switch (brand) {
        case 'Terribly Tiny Tales': return 'bg-black text-white';
        case 'Dobara': return 'bg-purple-600 text-white';
        case 'Fingertips': return 'bg-red-700 text-white';
        case 'Juice Box': return 'bg-orange-500 text-white';
        default: return 'bg-blue-800 text-white';
    }
};

const StarburstBadge = ({ value, label }: { value: string; label: string }) => (
  <div className="absolute -top-6 -right-6 w-28 h-28 z-30 group-hover:scale-110 transition-transform duration-200 pointer-events-none select-none">
    {/* Rotating Background Star for attention */}
    <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#ffff00] drop-shadow-sm opacity-80">
             <path d="M50 0 L61 28 L90 20 L72 45 L95 70 L65 73 L50 100 L35 73 L5 70 L28 45 L10 20 L39 28 Z" />
        </svg>
    </div>
    
    {/* Main Red Badge */}
    <div className="absolute inset-0 transform rotate-12 scale-75">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[4px_4px_0_rgba(0,0,0,1)] text-[#ff3333] fill-current">
          <path d="M50 0 L63 25 L90 20 L75 45 L95 70 L65 75 L50 100 L35 75 L5 70 L25 45 L10 20 L37 25 Z" stroke="white" strokeWidth="3" />
        </svg>
    </div>

    {/* Text Layer */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-none pb-1 rotate-12">
       <span className="font-pixel text-2xl font-bold tracking-tighter drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white">{value}</span>
       <span className="font-pixel text-[10px] text-black bg-white px-1.5 py-0.5 border-2 border-black uppercase tracking-widest shadow-[2px_2px_0_rgba(0,0,0,0.5)] mt-1 transform -rotate-3">{label}</span>
    </div>
  </div>
);

const Card: React.FC<CardProps> = ({ item, onInteraction }) => {
  const brandClass = getBrandColor(item.brand);

  const handleMouseEnter = () => {
    onInteraction(`This piece is ${item.contentStyle.toLowerCase()} and features a ${item.contentFormat.toLowerCase()} format.`);
  };

  const handleMouseLeave = () => {
    onInteraction(null);
  };

  const handleLinkClick = () => {
    onInteraction("Opening the link for you!");
  };

  return (
    <div 
      className="group relative bg-[#e0e0e0] border-2 border-t-white border-l-white border-b-black border-r-black p-1 hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Eye-Catching Stats Badge */}
      {item.stats && (
          <StarburstBadge value={item.stats.value} label={item.stats.label} />
      )}

      {/* Title Bar (Mini) */}
      <div className={`px-2 py-1 flex justify-between items-center mb-1 border-b-2 border-black ${brandClass}`}>
        <span className="font-pixel text-xs truncate max-w-[80%] uppercase tracking-widest">{item.brand}.exe</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 bg-white border border-black"></div>
            <div className="w-2 h-2 bg-white border border-black"></div>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden border-2 border-gray-600 border-b-white border-r-white bg-black cursor-pointer transition-all">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
        />
        
        {/* Eye-Catching Adjective Sticker */}
        <div className="absolute top-3 left-3 z-20">
            <div className="relative bg-[#00ff00] border-2 border-black px-3 py-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-200">
                 {/* Gloss */}
                 <div className="absolute top-0 left-0 w-full h-[50%] bg-white opacity-40 pointer-events-none"></div>
                 <span className="font-pixel text-black text-sm font-bold uppercase tracking-wider relative z-10">{item.contentStyle}</span>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col bg-[#f0f0f0] border-x-2 border-b-2 border-transparent group-hover:border-black/10 transition-colors">
        
        {/* Eye-Catching Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
              <span className="font-pixel text-xs font-bold bg-[#ffcc00] border-2 border-black px-2 py-0.5 text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all cursor-default">
                {item.contentFormat}
              </span>
              <span className="font-pixel text-xs font-bold bg-[#00ffff] border-2 border-black px-2 py-0.5 text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all cursor-default">
                {item.contentType}
              </span>
        </div>

        <h3 className="font-serif-display italic text-2xl leading-none mb-2 text-black group-hover:text-blue-700 underline decoration-2 decoration-transparent group-hover:decoration-blue-700 transition-all cursor-pointer">
          {item.title}
        </h3>
        
        <p className="font-pixel text-lg text-gray-700 leading-tight mb-4 flex-1">
          {item.description}
        </p>

        <div className="pt-2 border-t-2 border-dashed border-gray-400 flex items-center justify-between font-pixel text-gray-500 mt-auto">
          <span className="bg-gray-200 px-1">{item.date}</span>
          <a 
            href={item.instagramLink} 
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="flex items-center gap-1 text-white bg-blue-800 border border-black hover:bg-blue-700 px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
          >
            <span>OPEN_LINK</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;