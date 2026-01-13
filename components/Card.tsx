import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem } from '../types';
import {
  ExternalLink, Heart, MessageCircle, Share2, Eye, Star, Zap,
  ChevronLeft, ChevronRight, Play
} from 'lucide-react';

interface CardProps {
  item: PortfolioItem;
  onInteraction: (message: string | null) => void;
}

// Utility to convert standard cloud links (Drive, GitHub) to direct embeddable sources
const getDirectMediaUrl = (url: string, type: 'image' | 'video') => {
  if (!url) return '';

  // 1. Handle Google Drive
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) return url;

    if (type === 'image') {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    } else {
      // For Drive videos, we use the preview link. 
      // Note: Drive preview ignores most autoplay params, but we add them just in case.
      return `https://drive.google.com/file/d/${fileId}/preview?autoplay=1&mute=1`;
    }
  }

  // 2. Handle GitHub (Converts github.com/.../blob/... to raw.githubusercontent.com/...)
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }

  return url;
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
  if (normalized.includes('view')) return <Eye size={14} className="stroke-[2.5]" />;
  if (normalized.includes('like')) return <Heart size={14} className="stroke-[2.5]" />;
  if (normalized.includes('share')) return <Share2 size={14} className="stroke-[2.5]" />;
  if (normalized.includes('comment')) return <MessageCircle size={14} className="stroke-[2.5]" />;
  if (normalized.includes('release')) return <Zap size={14} className="stroke-[2.5]" />;
  return <Star size={14} className="stroke-[2.5]" />;
};

const StatBadge: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 transition-transform hover:scale-110">
    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] flex items-center justify-center rounded-full text-black hover:bg-[#ffff00] transition-colors">
      {getStatIcon(label)}
    </div>
    <span className="font-pixel text-xs sm:text-sm font-bold text-white bg-black px-1 py-0.5 rounded mt-1 border border-white/20 whitespace-nowrap shadow-sm">
      {value}
    </span>
  </div>
);

const Card: React.FC<CardProps> = ({ item, onInteraction }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mediaList = item.media || [{ type: 'image', url: item.imageUrl }];
  const currentMedia = mediaList[activeMediaIndex];

  const brandClass = getBrandColor(item.brand);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Track Card Visibility
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  }, []);

  // Play/Pause Video on View
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || currentMedia.type !== 'video') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch((e) => console.log('Autoplay prevented:', e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [currentMedia, activeMediaIndex]);

  // Preload all images in the carousel
  useEffect(() => {
    const imageMediaItems = mediaList.filter(m => m.type === 'image');

    if (imageMediaItems.length === 0) {
      setAllImagesPreloaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageMediaItems.length;

    imageMediaItems.forEach((media) => {
      const img = new Image();
      img.src = getDirectMediaUrl(media.url, 'image');
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setAllImagesPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setAllImagesPreloaded(true);
        }
      };
    });
  }, [mediaList]);

  // Reset loading state when media changes
  useEffect(() => {
    // If images are preloaded, skip the loading state for images
    if (currentMedia.type === 'image' && allImagesPreloaded) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [activeMediaIndex, currentMedia.url, allImagesPreloaded]);

  // Auto-scroll Logic - only when all images are preloaded and visible
  useEffect(() => {
    if (mediaList.length <= 1 || isPaused || !allImagesPreloaded || !isVisible) return;

    const interval = setInterval(() => {
      setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, [mediaList.length, isPaused, allImagesPreloaded, isVisible]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!allImagesPreloaded) return; // Don't allow navigation until preloaded
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    onInteraction(`Viewing asset ${((activeMediaIndex + 1) % mediaList.length) + 1} of ${mediaList.length}`);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!allImagesPreloaded) return; // Don't allow navigation until preloaded
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    onInteraction(`Viewing asset ${((activeMediaIndex - 1 + mediaList.length) % mediaList.length) + 1} of ${mediaList.length}`);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    onInteraction(`This piece is ${item.contentStyle.toLowerCase()} and features a ${item.contentFormat.toLowerCase()} format.`);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    onInteraction(null);
  };

  const handleLinkClick = () => {
    onInteraction("Opening the Instagram link for you!");
  };

  const directUrl = getDirectMediaUrl(currentMedia.url, currentMedia.type);

  return (
    <div
      ref={cardRef}
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

      {/* Media Viewport - Dynamic aspect ratio: 3:4 for images, 9:16 for videos */}
      <div className={`relative w-full overflow-hidden border-2 border-gray-600 border-b-white border-r-white bg-black group/media ${currentMedia.type === 'video' || item.contentFormat.includes('Reel') ? 'aspect-[9/16]' : 'aspect-[3/4]'}`}>

        {/* Skeleton Loader - shimmer only, no spinner */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        {/* Render Logic */}
        <div className="w-full h-full relative">
          {currentMedia.type === 'image' ? (
            <img
              src={directUrl}
              alt={`${item.title} - ${activeMediaIndex}`}
              className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2929&auto=format&fit=crop";
                setIsLoaded(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-black">
              {currentMedia.url.includes('drive.google.com') ? (
                <iframe
                  src={directUrl}
                  className={`w-full h-full border-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  allow="autoplay"
                  onLoad={() => setIsLoaded(true)}
                ></iframe>
              ) : (
                <video
                  ref={videoRef}
                  src={directUrl}
                  className={`w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  controls
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setIsLoaded(true)}
                  onCanPlay={() => setIsLoaded(true)}
                ></video>
              )}
            </div>
          )}
        </div>

        {/* Carousel Navigation - Visible only on Hover */}
        {mediaList.length > 1 && (
          <>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <button
                onClick={handlePrev}
                className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center shadow-md hover:bg-[#d0d0d0] pointer-events-auto"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center shadow-md hover:bg-[#d0d0d0] pointer-events-auto"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Retro Carousel Indicator (Instagram Reel Style) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {mediaList.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 border border-black shadow-[1px_1px_0_rgba(255,255,255,0.5)] transition-all ${idx === activeMediaIndex
                    ? 'bg-[#00ff00] scale-125'
                    : 'bg-[#808080] opacity-60'
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Stickers & Badges - Updated text size and padding */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="relative bg-[#00ff00] border-2 border-black px-1.5 py-0.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)] transform -rotate-3 group-hover:rotate-0 transition-all duration-200">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-white opacity-40"></div>
            <span className="font-pixel text-black text-base sm:text-lg font-bold uppercase tracking-wider relative z-10">{item.contentType}</span>
          </div>
        </div>

        {item.stats && item.stats.length > 0 && (
          <div className="absolute bottom-3 right-3 flex flex-col gap-3 z-50 items-center">
            {item.stats.map((stat, index) => (
              <StatBadge key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-1.5 flex-1 flex flex-col bg-[#f0f0f0] border-x-2 border-b-2 border-transparent group-hover:border-black/10 transition-colors">
        <h4 className="font-pixel text-base leading-tight mb-1.5 text-black line-clamp-2 uppercase">
          {item.title}
        </h4>

        <div className="pt-1.5 border-t-2 border-dashed border-gray-400 flex items-center justify-between gap-2 mt-auto">
          <div className="flex gap-1.5">
            <span className="font-pixel text-[10px] sm:text-xs font-bold bg-[#ffcc00] border-2 border-black px-1 py-0.5 text-black uppercase shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all cursor-default whitespace-nowrap">
              {item.contentFormat}
            </span>
            <span className="font-pixel text-[10px] sm:text-xs font-bold bg-[#00ffff] border-2 border-black px-1 py-0.5 text-black uppercase shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all cursor-default whitespace-nowrap">
              {item.contentStyle}
            </span>
          </div>

          {item.instagramLink && (
            <a
              href={item.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-1 text-white bg-blue-800 border border-black hover:bg-blue-700 px-1.5 py-0.5 font-pixel text-[10px] sm:text-xs shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all no-underline"
            >
              <span>OPEN</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;