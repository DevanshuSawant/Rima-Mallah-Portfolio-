
import React, { useState } from 'react';
import { PortfolioItem } from '../types';
import { 
  ExternalLink, Heart, MessageCircle, Share2, Eye, Star, Zap, 
  FolderOpen, ChevronLeft, ChevronRight, Play 
} from 'lucide-react';

interface CardProps {
  item: PortfolioItem;
  onInteraction: (message: string | null) => void;
}

// Utility to convert a standard Google Drive view link to a direct embeddable source
const getDirectMediaUrl = (url: string, type: 'image' | 'video') => {
  if (!url.includes('drive.google.com')) return url;

  // Extract ID using regex
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const fileId = match ? match[1] : null;

  if (!fileId) return url;

  if (type === 'image') {
    // Direct image display URL for Google Drive
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } else {
    // Embed URL for video playback within iframe
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
};

const getBrandColor = (brand: string) => {
    switch (brand) {
        case 'Terribly Tiny Tales': return 'bg-black text-white';
        case 'Dobara': return 'bg-purple-600 text-white';
        case 'Fingertips': return 'bg-red-700 text-white';
        case 'Juice Box': return 'bg-orange-500 text-white';
        default: return 'bg-blue-800 text-white';
    }
};

const getStatIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('view')) return <Eye size={18} className="stroke-[2.5]" />;
  if (normalized.includes('like')) return <Heart size={18} className="stroke-[2.5]" />;
  if (normalized.includes('share')) return <Share2 size={18} className="stroke-[2.5]" />;
  if (normalized.includes('comment')) return <MessageCircle size={18} className="stroke-[2.5]" />;
  if (normalized.includes('release')) return <Zap size={18} className="stroke-[2.5]" />;
  return <Star size={18} className="stroke-[2.5]" />;
};

const StatBadge: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 filter drop-shadow-md transition-transform hover:scale-110">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] flex items-center justify-center rounded-full text-black hover:bg-[#ffff00] transition-colors">
      {getStatIcon(label)}
    </div>
    <span className="font-pixel text-[10px] sm:text-xs font-bold text-white bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-sm mt-1 border border-white/20">
        {value}
    </span>
  </div>
);

const Card: React.FC<CardProps> = ({ item, onInteraction }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const mediaList = item.media || [{ type: 'image', url: item.imageUrl }];
  const currentMedia = mediaList[activeMediaIndex];
  
  const brandClass = getBrandColor(item.brand);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    onInteraction(`Viewing asset ${((activeMediaIndex + 1) % mediaList.length) + 1} of ${mediaList.length}`);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    onInteraction(`Viewing asset ${((activeMediaIndex - 1 + mediaList.length) % mediaList.length) + 1} of ${mediaList.length}`);
  };

  const handleMouseEnter = () => {
    onInteraction(`This piece is ${item.contentStyle.toLowerCase()} and features a ${item.contentFormat.toLowerCase()} format.`);
  };

  const handleMouseLeave = () => {
    onInteraction(null);
  };

  const handleLinkClick = (isDrive: boolean = false) => {
    onInteraction(isDrive ? "Opening the asset folder for you!" : "Opening the Instagram link for you!");
  };

  const directUrl = getDirectMediaUrl(currentMedia.url, currentMedia.type);

  return (
    <div 
      className="group relative bg-[#e0e0e0] border-2 border-t-white border-l-white border-b-black border-r-black p-1 hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Header (Mini) */}
      <div className={`px-2 py-1 flex justify-between items-center mb-1 border-b-2 border-black ${brandClass}`}>
        <span className="font-pixel text-xs truncate max-w-[80%] uppercase tracking-widest">{item.brand}.exe</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 bg-white border border-black"></div>
            <div className="w-2 h-2 bg-white border border-black"></div>
        </div>
      </div>

      {/* Media Viewport */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-gray-600 border-b-white border-r-white bg-black group/media">
        
        {/* Render Logic */}
        <div className="w-full h-full relative">
            {currentMedia.type === 'image' ? (
                <img 
                    src={directUrl} 
                    alt={`${item.title} - ${activeMediaIndex}`} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                    onError={(e) => {
                        // Fallback if direct link fails
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2929&auto=format&fit=crop";
                    }}
                />
            ) : (
                <div className="w-full h-full bg-black">
                   {currentMedia.url.includes('drive.google.com') ? (
                       <iframe 
                          src={directUrl} 
                          className="w-full h-full border-0" 
                          allow="autoplay"
                       ></iframe>
                   ) : (
                       <video 
                          src={currentMedia.url} 
                          className="w-full h-full object-cover" 
                          controls
                       ></video>
                   )}
                </div>
            )}
        </div>

        {/* Carousel Navigation */}
        {mediaList.length > 1 && (
            <>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-40">
                    <button 
                        onClick={handlePrev}
                        className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center shadow-md hover:bg-[#d0d0d0]"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center shadow-md hover:bg-[#d0d0d0]"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="absolute bottom-3 left-3 z-30">
                    <div className="bg-black/80 text-[#00ff00] font-pixel text-[10px] px-2 py-0.5 rounded-sm border border-[#00ff00]/30 backdrop-blur-sm">
                        ASSET: {activeMediaIndex + 1}/{mediaList.length}
                    </div>
                </div>
            </>
        )}
        
        {/* Stickers & Badges */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <div className="relative bg-[#00ff00] border-2 border-black px-3 py-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-3 group-hover:rotate-0 transition-all duration-200">
                 <div className="absolute top-0 left-0 w-full h-[50%] bg-white opacity-40"></div>
                 <span className="font-pixel text-black text-sm font-bold uppercase tracking-wider relative z-10">{item.contentType}</span>
            </div>
        </div>

        {item.stats && item.stats.length > 0 && (
            <div className="absolute bottom-3 right-3 flex flex-col gap-3 z-30 items-end">
                {item.stats.map((stat, index) => (
                    <StatBadge key={index} value={stat.value} label={stat.label} />
                ))}
            </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 flex-1 flex flex-col bg-[#f0f0f0] border-x-2 border-b-2 border-transparent group-hover:border-black/10 transition-colors">
        <h4 className="font-pixel text-lg leading-none mb-2 text-black line-clamp-2 uppercase">
          {item.title}
        </h4>

        <div className="flex justify-between items-start mb-3">
              <span className="font-pixel text-[10px] font-bold bg-[#ffcc00] border-2 border-black px-2 py-0.5 text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all cursor-default">
                {item.contentFormat}
              </span>
              <span className="font-pixel text-[10px] font-bold bg-[#00ffff] border-2 border-black px-2 py-0.5 text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all cursor-default">
                {item.contentStyle}
              </span>
        </div>
        
        <div className="pt-2 border-t-2 border-dashed border-gray-400 flex flex-col gap-2 mt-auto">
          <div className="flex items-center justify-between font-pixel text-gray-500 text-xs">
            <span className="bg-gray-200 px-1">{item.date}</span>
          </div>
          
          <div className="flex gap-2">
            {item.instagramLink && (
              <a 
                href={item.instagramLink} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(false)}
                className="flex-1 flex items-center justify-center gap-1 text-white bg-blue-800 border border-black hover:bg-blue-700 px-2 py-1 font-pixel text-xs shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
              >
                <span>OPEN_LINK</span>
                <ExternalLink size={10} />
              </a>
            )}
            
            {item.driveLink && (
              <a 
                href={item.driveLink} 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(true)}
                className="flex-1 flex items-center justify-center gap-1 text-black bg-[#ffdb58] border border-black hover:bg-[#ffd700] px-2 py-1 font-pixel text-xs shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all"
              >
                <span>VIEW_ASSETS</span>
                <FolderOpen size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
