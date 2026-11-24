import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem } from '../types';
import { MEDIA_PREVIEWS } from '../media-previews';

const CARD_IMAGE_SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw';
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
    case 'The Small Big Idea': return 'bg-black text-white';
    case 'TRESemmé India': return 'bg-black text-white';
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
  const [loadedMediaUrl, setLoadedMediaUrl] = useState<string | null>(null);
  const [loadedPosterUrl, setLoadedPosterUrl] = useState<string | null>(null);
  const [failedMediaUrl, setFailedMediaUrl] = useState<string | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mediaList = item.media || [{ type: 'image', url: item.imageUrl }];
  const currentMedia = mediaList[activeMediaIndex];
  const directUrl = getDirectMediaUrl(currentMedia.url, currentMedia.type);
  const preview = MEDIA_PREVIEWS[currentMedia.url];
  const imageSrc = preview?.src || directUrl;
  const posterUrl = currentMedia.thumbnail || preview?.poster;
  const isLoaded = loadedMediaUrl === directUrl;
  const hasError = failedMediaUrl === directUrl;
  const hasPreview = isLoaded || (posterUrl && loadedPosterUrl === posterUrl);
  // Keep mixed-media carousels the same size while switching slides.
  const isVideoCard = item.contentFormat.includes('Reel') || mediaList[0]?.type === 'video';
  const brandClass = getBrandColor(item.brand);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const root = card.closest('#browser-content');
    // Fetch small previews shortly before a card enters the scroll viewport.
    const nearby = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        nearby.disconnect();
      }
    }, { root, rootMargin: '400px 0px' });
    // Only visible cards may request video data or autoplay.
    const visible = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15);
    }, { root, threshold: [0, 0.15] });
    nearby.observe(card);
    visible.observe(card);
    return () => { nearby.disconnect(); visible.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentMedia.type !== 'video') return;
    if (isVisible) {
      video.play().catch(() => { /* Browser controls remain available if autoplay is blocked. */ });
    } else {
      video.pause();
      // The src is removed when offscreen; load() aborts any outstanding download.
      video.load();
    }
    return () => video.pause();
  }, [isVisible, directUrl, currentMedia.type]);

  const nextMedia = mediaList[(activeMediaIndex + 1) % mediaList.length];
  const nextPreview = MEDIA_PREVIEWS[nextMedia.url];
  const nextImageSrc = nextMedia.type === 'image'
    ? nextPreview?.src || getDirectMediaUrl(nextMedia.url, 'image')
    : nextMedia.thumbnail || nextPreview?.poster;
  const nextSrcSet = nextMedia.type === 'image' ? nextPreview?.srcSet : undefined;
  useEffect(() => {
    if (!isVisible || !isLoaded || mediaList.length < 2 || !nextImageSrc) return;
    // Warm only the next slide, never every asset in every carousel.
    const image = new Image();
    image.decoding = 'async';
    image.sizes = CARD_IMAGE_SIZES;
    if (nextSrcSet) image.srcset = nextSrcSet;
    image.src = nextImageSrc;
  }, [isVisible, isLoaded, mediaList.length, nextImageSrc, nextSrcSet]);

  useEffect(() => {
    if (mediaList.length <= 1 || isPaused || !isLoaded || !isVisible || currentMedia.type === 'video') return;
    const timer = setTimeout(() => {
      setActiveMediaIndex(prev => (prev + 1) % mediaList.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeMediaIndex, mediaList.length, isPaused, isLoaded, isVisible, currentMedia.type]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMediaIndex(prev => (prev + 1) % mediaList.length);
    onInteraction(`Viewing asset ${((activeMediaIndex + 1) % mediaList.length) + 1} of ${mediaList.length}`);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveMediaIndex(prev => (prev - 1 + mediaList.length) % mediaList.length);
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

      {/* Media Viewport - Stable aspect ratio: 3:4 for image-led carousels, 9:16 for reels */}
      <div
        className={`relative w-full shrink-0 overflow-hidden border-2 border-gray-600 border-b-white border-r-white bg-black group/media ${isVideoCard ? 'aspect-[9/16]' : 'aspect-[3/4]'}`}
        style={item.mediaAspectRatio ? { aspectRatio: item.mediaAspectRatio } : undefined}
      >

        {/* Skeleton Loader - shimmer only, no spinner */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer z-10 transition-opacity duration-500 ${hasPreview || hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        {/* Render Logic */}
        <div className="w-full h-full relative">
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-pixel text-white">
              Preview unavailable. Use OPEN to view this work.
            </div>
          )}
          {currentMedia.type === 'image' ? (
            isNearViewport && <img
              key={directUrl}
              src={imageSrc}
              srcSet={preview?.srcSet}
              sizes={CARD_IMAGE_SIZES}
              alt={`${item.title} - ${activeMediaIndex}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedMediaUrl(directUrl)}
              onError={() => setFailedMediaUrl(directUrl)}
            />
          ) : (
            <div className="w-full h-full relative">
              {isNearViewport && posterUrl && (
                <img
                  key={posterUrl}
                  src={posterUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setLoadedPosterUrl(posterUrl)}
                />
              )}
              {currentMedia.url.includes('drive.google.com') ? (
                isVisible && <iframe
                  key={directUrl}
                  src={directUrl}
                  title={item.title}
                  className={`relative w-full h-full border-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  allow="autoplay"
                  loading="lazy"
                  onLoad={() => setLoadedMediaUrl(directUrl)}
                />
              ) : (
                <video
                  key={directUrl}
                  ref={videoRef}
                  src={isVisible ? directUrl : undefined}
                  className={`relative w-full h-full object-contain transition-opacity duration-300 ${isVisible && isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  controls
                  muted
                  loop
                  playsInline
                  preload="none"
                  onEmptied={() => setLoadedMediaUrl(null)}
                  onLoadedData={() => setLoadedMediaUrl(directUrl)}
                  onCanPlay={() => setLoadedMediaUrl(directUrl)}
                  onError={() => setFailedMediaUrl(directUrl)}
                />
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
                aria-label="Previous slide"
                className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center justify-center shadow-md hover:bg-[#d0d0d0] pointer-events-auto"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next slide"
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
