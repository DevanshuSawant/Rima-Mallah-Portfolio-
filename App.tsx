
import React, { useState, useMemo, useRef, useEffect } from 'react';
import BrowserFrame from './components/BrowserFrame';
import Card from './components/Card';
import Clippy from './components/Clippy';
import CuratorWindow from './components/CuratorWindow';
import LoadingScreen from './components/LoadingScreen';
import { SectionType, TabId, TabConfig, SectionConfig } from './types';
import { SECTIONS, PORTFOLIO_ITEMS } from './constants';
import { X, Instagram, Linkedin, Mail, Send, FileText, Layout, Plus } from 'lucide-react';

const App: React.FC = () => {
  // App State
  const [activeSectionId, setActiveSectionId] = useState<SectionType>(SectionType.TYPE);
  const [activeTabId, setActiveTabId] = useState<TabId>(SECTIONS[0].tabs[0].id);
  const [activeSubFilter, setActiveSubFilter] = useState<string>('All');
  
  // Fake window states
  const [showProfile, setShowProfile] = useState(true);
  const [showSocials, setShowSocials] = useState(true);
  const [isComputerOff, setIsComputerOff] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  
  // Clippy Interaction State
  const [clippyMessage, setClippyMessage] = useState<string | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Refs for scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sound Effect Hook for Clicks
  useEffect(() => {
    const playClickSound = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // "More Clicky" Sound Synthesis
        // Sharper attack with higher frequency triangle wave to simulate a mechanical click
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.08);
      } catch (error) {
        // Silent failure if audio is blocked or not supported
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
       const target = e.target as HTMLElement;
       // Play sound if clicking a button, link, or interactive element
       if (
           target.closest('button') || 
           target.closest('a') || 
           target.closest('input') || 
           target.closest('textarea') || 
           target.closest('[role="button"]') ||
           (target.closest('.cursor-pointer') && !target.closest('.pointer-events-none'))
       ) {
           playClickSound();
       }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Startup Sound Function
  const playStartupSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Master volume
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.2;
        masterGain.connect(ctx.destination);

        // Windows-like Ethereal Swell Notes (Pentatonic-ish)
        // Frequencies: C4, E4, G4, A4, C5, E5 + Deep Bass C3
        const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
        
        // Play the swelling chord
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Mix sine and triangle for a "glassy but full" tone
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            // Envelope: Slow attack, long decay
            gain.gain.setValueAtTime(0, now);
            // Stagger attacks slightly
            const attackTime = now + 0.1 + (i * 0.15);
            gain.gain.linearRampToValueAtTime(0.2, attackTime);
            gain.gain.exponentialRampToValueAtTime(0.001, attackTime + 5);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now);
            osc.stop(now + 6);
        });

        // Add Bass for depth
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(130.81, now); // C3
        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.4, now + 1);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 6);
        bassOsc.connect(bassGain);
        bassGain.connect(masterGain);
        bassOsc.start(now);
        bassOsc.stop(now + 6);

    } catch (e) {
        console.warn("Audio playback blocked or failed:", e);
    }
  };

  // Boot Effect Timer
  useEffect(() => {
    if (isBooting) {
        const timer = setTimeout(() => {
            setIsBooting(false);
        }, 4000);
        return () => clearTimeout(timer);
    }
  }, [isBooting]);

  // Derived Data
  const activeSection = SECTIONS.find(s => s.id === activeSectionId) as SectionConfig;
  const activeTab = activeSection.tabs.find(t => t.id === activeTabId) as TabConfig;

  // Handlers
  const scrollToContent = () => {
    // Small timeout to allow render to complete before scrolling
    setTimeout(() => {
        if (contentRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const element = contentRef.current;
            
            // Get positions relative to viewport
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            // Calculate the current scroll position + difference relative to container top
            const currentScrollTop = container.scrollTop;
            const relativeOffset = elementRect.top - containerRect.top;
            
            // Scroll to the element with some padding (20px)
            container.scrollTo({ 
                top: currentScrollTop + relativeOffset - 20, 
                behavior: 'smooth' 
            });
        }
    }, 50);
  };

  const handleSectionChange = (sectionId: SectionType) => {
    setActiveSectionId(sectionId);
    const newSection = SECTIONS.find(s => s.id === sectionId);
    if (newSection && newSection.tabs.length > 0) {
      setActiveTabId(newSection.tabs[0].id);
      setActiveSubFilter('All');
    }
    scrollToContent();
  };

  const handleTabChange = (tabId: TabId) => {
    setActiveTabId(tabId);
    setActiveSubFilter('All');
    scrollToContent();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Portfolio Inquiry from ${contactForm.name}`;
    const body = `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`;
    // Using a placeholder email since we don't have a backend
    window.location.href = `mailto:hello@rimamallah.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setClippyMessage("Opening your email client to send this!");
    setTimeout(() => setClippyMessage(null), 3000);
  };

  // Filter Items
  const filteredItems = useMemo(() => {
    let items = PORTFOLIO_ITEMS;
    
    // Level 1: Filter by Main Tab Logic
    switch (activeTabId) {
        // Content Types
        case TabId.EDITORIAL:
            items = items.filter(i => i.contentType === 'Editorial');
            break;
        case TabId.SOCIAL:
            items = items.filter(i => i.contentType === 'Social');
            break;
        case TabId.PROMOTIONAL:
            items = items.filter(i => i.contentType === 'Promotional');
            break;
        
        // Content Formats
        case TabId.MUSINGS:
            items = items.filter(i => 
                i.contentFormat.includes('Musing') || 
                i.contentStyle.includes('Musing') || 
                i.contentFormat.includes('Storytelling')
            );
            break;
        case TabId.REELS:
            items = items.filter(i => i.contentFormat.includes('Reel') || i.contentFormat.includes('Video') || i.contentFormat.includes('Audio') || i.contentFormat.includes('Vox Pop'));
            break;
        case TabId.CAROUSELS:
            items = items.filter(i => i.contentFormat.includes('Carousel') || i.contentFormat.includes('Infographic') || i.contentFormat.includes('Thread') || i.contentFormat.includes('Dump'));
            break;
        case TabId.SCRIPTS:
             items = items.filter(i => i.contentFormat.includes('Script'));
             break;
    }

    // Level 2: Sub Filters (if active)
    if (activeSubFilter !== 'All') {
        // Smart match: Checks both Format and Style for the keyword
        items = items.filter(i => 
            i.contentFormat.includes(activeSubFilter) || 
            i.contentStyle.includes(activeSubFilter)
        );
    }

    return items;
  }, [activeTabId, activeSubFilter]);

  if (isBooting) {
    return <LoadingScreen />;
  }

  const urlDisplay = `www.rima-mallah.com/${activeSectionId.toLowerCase().replace(' ', '-')}/${activeTab?.label.toLowerCase().replace(' ', '_')}.html`;

  return (
    <>
    <BrowserFrame 
        urlPath={urlDisplay} 
        isClosed={isComputerOff}
        onClose={() => setIsComputerOff(true)}
        onRestart={() => {
            playStartupSound();
            setIsComputerOff(false);
            setIsBooting(true);
        }}
        tabs={
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full px-2 py-3 gap-6 bg-[#c0c0c0]">
                {/* View Toggle Group */}
                <div className="flex border-2 border-gray-600 border-b-white border-r-white bg-[#c0c0c0] p-[2px]">
                    <button 
                        onClick={() => handleSectionChange(SectionType.TYPE)}
                        className={`px-4 py-1 font-pixel text-lg uppercase leading-none transition-none ${
                            activeSectionId === SectionType.TYPE 
                            ? 'bg-[#000080] text-white' 
                            : 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]'
                        }`}
                    >
                        BY TYPE
                    </button>
                    <button 
                        onClick={() => handleSectionChange(SectionType.FORMAT)}
                        className={`px-4 py-1 font-pixel text-lg uppercase leading-none transition-none ${
                            activeSectionId === SectionType.FORMAT 
                            ? 'bg-[#000080] text-white' 
                            : 'bg-[#c0c0c0] text-black hover:bg-[#d0d0d0]'
                        }`}
                    >
                        BY FORMAT
                    </button>
                </div>

                {/* Tabs Group */}
                <div className="flex flex-wrap gap-2">
                    {activeSection.tabs.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`
                                    px-4 py-1 font-pixel text-lg uppercase leading-none
                                    border-2 transition-none
                                    ${isActive 
                                        ? 'bg-white text-black border-gray-600 border-b-white border-r-white' 
                                        : 'bg-[#c0c0c0] text-black border-white border-b-black border-r-black hover:bg-[#d0d0d0] active:border-t-black active:border-l-black active:border-r-white active:border-b-white'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        }
    >
      
      {/* Main Content Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-scroll overflow-x-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-white p-4 sm:p-8 relative retro-scrollbar"
      >
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-12 sm:mb-16 relative z-10">
            
            {/* Header Title */}
            <div className="mb-6 sm:mb-8">
                 <h1 className="font-pixel text-5xl sm:text-6xl md:text-7xl leading-none text-black mb-2">
                    portfolio!
                 </h1>
                 <div className="h-1 w-16 sm:w-24 bg-blue-600"></div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* Center Column: Bio & Profile Image */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Bio & Skills Column */}
                        <div className="flex-1">
                            <div className="space-y-2">
                                <h2 className="font-serif-display italic text-3xl sm:text-4xl md:text-5xl text-[#000080]">
                                    Rima Mallah
                                </h2>
                                <p className="font-pixel text-lg sm:text-xl text-gray-600">
                                    // Content Strategist & Writer
                                </p>
                                
                                <div className="font-serif text-base sm:text-lg leading-relaxed text-gray-800 bg-white/50 backdrop-blur-sm p-4 border border-gray-200 mt-4">
                                    Hello! I'm Rima. I specialize in crafting narratives that stick. Whether it's the polished storytelling of <strong>TTT</strong>, the unhinged relatability of <strong>Dobara</strong>, or the intellectual analysis of <strong>Fingertips</strong>, I adapt my voice to build communities.
                                </div>
                            </div>

                            {/* Skills Row */}
                            <div className="mt-6">
                                <h3 className="font-serif-display text-blue-800 text-lg sm:text-xl border-b border-blue-800 inline-block mb-3">TOOLS & SKILLS</h3>
                                <div className="flex gap-2 sm:gap-3 flex-wrap">
                                    {['Ps', 'Ai', 'Pr', 'Wp', 'Id'].map((skill, i) => (
                                        <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[2px_2px_5px_rgba(0,0,0,0.1)] flex items-center justify-center font-bold text-[10px] sm:text-xs text-gray-700 border border-white">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                         {/* Right Sidebar: Profile Window & Socials */}
                        <div className="shrink-0 w-full md:w-96 flex flex-col gap-6 md:-mt-20 relative z-20">
                            {/* Profile Window */}
                            {showProfile && (
                                <div className="w-full bg-[#c0c0c0] border-2 border-white border-b-black border-r-black shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] transform rotate-0 sm:rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <div className="bg-[#000080] px-2 py-1 flex justify-between items-center">
                                        <span className="text-white font-pixel text-sm">MEET-RIMA.JPG</span>
                                        <button 
                                            onClick={() => setShowProfile(false)} 
                                            className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center border border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-red-600 group"
                                        >
                                            <X size={12} className="text-black group-hover:text-white" />
                                        </button>
                                    </div>
                                    <div className="p-1">
                                        <div className="border-2 border-gray-600 border-b-white border-r-white bg-white p-2">
                                            <img 
                                                src="https://picsum.photos/600/600?random=100" 
                                                alt="Rima Profile" 
                                                className="w-full h-auto aspect-video object-cover filter contrast-125 sepia-[0.2]"
                                            />
                                            <div className="mt-2 text-center font-serif-display italic text-gray-500 text-sm">
                                                "Capturing the moment."
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Socials Window */}
                            {showSocials && (
                                <div className="w-full md:w-64 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black shadow-lg transform md:-translate-x-24 md:-translate-y-4 md:-rotate-1 hover:rotate-0 transition-transform duration-300 hover:z-30 relative">
                                    <div className="bg-[#000080] px-2 py-1 flex justify-between items-center">
                                        <span className="text-white font-pixel">SOCIALS.EXE</span>
                                        <button 
                                            onClick={() => setShowSocials(false)} 
                                            className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center border border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-red-600 group"
                                        >
                                            <X size={12} className="text-black group-hover:text-white" />
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-3 font-pixel text-lg">
                                        <a 
                                            href="https://www.instagram.com/rirachaaa/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Instagram size={18} /> 
                                            <span>@rirachaaa</span>
                                        </a>
                                        <a 
                                            href="https://www.linkedin.com/in/rimamallah/" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Linkedin size={18} /> 
                                            <span>/in/rimamallah</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-300 border-dashed my-6 sm:my-8"></div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto scroll-mt-24" ref={contentRef}>
             <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4 sm:gap-0">
                <div>
                     <h3 className="font-pixel text-2xl sm:text-3xl bg-black text-white px-2 inline-block mb-1">
                        DIR: \{activeSectionId.toUpperCase()}\{activeTab?.label.toUpperCase()}
                    </h3>
                    {activeTab?.subFilters && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {activeTab.subFilters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveSubFilter(filter)}
                                    className={`
                                        px-2 sm:px-3 py-1 font-pixel text-base sm:text-lg border-2 
                                        ${activeSubFilter === filter 
                                            ? 'bg-blue-800 text-white border-black shadow-[2px_2px_0_0_#000]' 
                                            : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
             </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-20">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <Card 
                            key={item.id} 
                            item={item} 
                            onInteraction={setClippyMessage}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center font-pixel text-2xl text-gray-400 border-2 border-dashed border-gray-300">
                        <p>FOLDER IS EMPTY...</p>
                    </div>
                )}
            </div>
        </div>

        {/* Contact Section */}
        <div className="border-t-2 border-gray-300 border-dashed my-8 sm:my-12"></div>
        
        <div id="contact-section" className="max-w-4xl mx-auto pb-20">
            <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
                 <h2 className="font-pixel text-3xl sm:text-4xl mb-2 text-black">LET'S TALK</h2>
                 <p className="font-serif text-gray-600 italic text-lg sm:text-xl">"Because every great story starts with a hello."</p>
            </div>

            <div className="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black shadow-[8px_8px_0_0_rgba(0,0,0,0.2)]">
                {/* Window Header */}
                <div className="bg-[#000080] px-2 py-1 flex justify-between items-center select-none">
                    <div className="flex items-center gap-2 text-white">
                        <Mail size={16} />
                        <span className="font-pixel tracking-wider text-sm">COMPOSE_MESSAGE.EXE</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                            <span className="block w-2 h-0.5 bg-black"></span>
                        </button>
                        <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                             <div className="w-2 h-2 border border-black border-t-2"></div>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleContactSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="font-pixel text-sm font-bold text-black">FROM_NAME:</label>
                            <input 
                                required
                                type="text" 
                                value={contactForm.name}
                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                className="w-full p-2 font-pixel text-lg text-black border-2 border-gray-600 border-b-white border-r-white bg-white focus:outline-none focus:bg-[#ffffcc] transition-colors placeholder-gray-500"
                                placeholder="Guest User"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="font-pixel text-sm font-bold text-black">RETURN_ADDR:</label>
                            <input 
                                required
                                type="email" 
                                value={contactForm.email}
                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                className="w-full p-2 font-pixel text-lg text-black border-2 border-gray-600 border-b-white border-r-white bg-white focus:outline-none focus:bg-[#ffffcc] transition-colors placeholder-gray-500"
                                placeholder="email@example.com"
                            />
                        </div>
                     </div>

                     <div className="space-y-1">
                        <label className="font-pixel text-sm font-bold text-black">MESSAGE_BODY:</label>
                        <textarea 
                            required
                            rows={6} 
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            className="w-full p-2 font-sans text-base text-black border-2 border-gray-600 border-b-white border-r-white bg-white focus:outline-none focus:bg-[#ffffcc] transition-colors resize-y placeholder-gray-500"
                            placeholder="Type your message here..."
                        ></textarea>
                     </div>

                     {/* Toolbar / Actions */}
                     <div className="flex flex-col sm:flex-row justify-between items-center pt-2 mt-2 border-t border-gray-400 border-dashed gap-4 sm:gap-0">
                        <div className="font-pixel text-xs text-gray-600 hidden sm:block">
                            READY TO SEND...
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto justify-end">
                            <a 
                                href="https://ig.me/m/rirachaaa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#c0c0c0] font-pixel text-base sm:text-lg font-bold border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:translate-y-1 hover:bg-[#d0d0d0] transition-all text-black no-underline justify-center flex-1 sm:flex-none"
                            >
                                <Instagram size={16} />
                                <span className="uppercase">INSTA_DM</span>
                            </a>
                            <button 
                                type="submit"
                                className="flex items-center gap-2 px-3 sm:px-6 py-2 bg-[#c0c0c0] font-pixel text-base sm:text-lg font-bold border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:translate-y-1 hover:bg-[#d0d0d0] transition-all justify-center flex-1 sm:flex-none"
                            >
                                <Send size={16} className="text-black" />
                                <span className="text-black">SEND_MAIL</span>
                            </button>
                        </div>
                     </div>
                </form>
            </div>
        </div>

      </div>

      {/* Clippy Helper */}
      <Clippy 
        activeTab={activeTab?.label} 
        overrideMessage={clippyMessage} 
      />
      
    </BrowserFrame>
    </>
  );
};

export default App;
