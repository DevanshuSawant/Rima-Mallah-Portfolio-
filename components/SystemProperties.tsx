
import React from 'react';
import { X } from 'lucide-react';

interface SystemPropertiesProps {
    onClose: () => void;
}

const SystemProperties: React.FC<SystemPropertiesProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            ></div>

            <div className="w-full max-w-md bg-[#c0c0c0] border-2 border-white border-b-black border-r-black shadow-xl relative z-10 flex flex-col">
                {/* Title Bar */}
                <div className="bg-[#000080] px-2 py-1 flex justify-between items-center select-none">
                    <span className="text-white font-pixel text-sm">System Properties</span>
                    <button
                        onClick={onClose}
                        className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center border border-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-red-600 group"
                    >
                        <X size={12} className="text-black group-hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="bg-white border-2 border-gray-600 border-b-white border-r-white p-4 h-full">
                        <div className="flex gap-4 mb-6">
                            <div className="w-16 h-16 shrink-0 relative">
                                {/* Computer Icon */}
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <path d="M10 10 L90 10 L90 70 L10 70 Z" fill="#e0e0e0" stroke="#000" strokeWidth="2" />
                                    <path d="M15 15 L85 15 L85 65 L15 65 Z" fill="#008080" />
                                    <path d="M20 70 L20 80 L80 80 L80 70" fill="none" stroke="#000" strokeWidth="2" />
                                    <path d="M10 80 L90 80 L90 90 L10 90 Z" fill="#e0e0e0" stroke="#000" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="space-y-1 font-pixel text-sm">
                                <p className="font-bold">System:</p>
                                <p>Microsoft Windows 98</p>
                                <p>Second Edition</p>
                                <p>4.10.2222 A</p>
                            </div>
                        </div>

                        <div className="space-y-1 font-pixel text-sm mb-6">
                            <p className="font-bold">Registered to:</p>
                            <p>Rima Mallah</p>
                            <p>Content Strategist</p>
                            <p>12345-OEM-0000789-12345</p>
                        </div>

                        <div className="space-y-1 font-pixel text-sm">
                            <p className="font-bold">Computer:</p>
                            <p>GenuineIntel</p>
                            <p>Pentium(r) III Processor</p>
                            <p>128.0MB RAM</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-1 bg-[#c0c0c0] font-pixel text-sm border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black hover:bg-[#d0d0d0]"
                        >
                            OK
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-1 bg-[#c0c0c0] font-pixel text-sm border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black hover:bg-[#d0d0d0]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemProperties;
