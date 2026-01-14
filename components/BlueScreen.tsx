
import React, { useEffect, useState } from 'react';
import bsodSound from '../media/windows-xp-critical-error-full-version.mp3';

interface BlueScreenProps {
    onRestart: () => void;
}

const BlueScreen: React.FC<BlueScreenProps> = ({ onRestart }) => {
    const [canRestart, setCanRestart] = useState(false);

    useEffect(() => {
        // Play BSOD sound
        const audio = new Audio(bsodSound);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("BSOD sound blocked:", e));

        // Add a small delay before allowing restart to prevent accidental double-clicks
        const timer = setTimeout(() => {
            setCanRestart(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!canRestart) return;

        const handleKeyPress = () => {
            onRestart();
        };

        const handleClick = () => {
            onRestart();
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleClick);
        };
    }, [canRestart, onRestart]);

    return (
        <div className="fixed inset-0 bg-[#0000AA] flex items-center justify-center font-mono text-white p-8 sm:p-16 z-[100] cursor-none select-none">
            <div className="max-w-3xl w-full space-y-8">
                <div className="text-center mb-8">
                    <span className="bg-[#AAAAAA] text-[#0000AA] px-2 font-bold">Windows</span>
                </div>

                <p className="text-lg sm:text-xl leading-relaxed">
                    A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
                    00010E36. The current application will be terminated.
                </p>

                <ul className="list-disc space-y-2 ml-8 text-base sm:text-lg">
                    <li>Press any key to terminate the current application.</li>
                    <li>Press CTRL+ALT+DEL again to restart your computer. You will
                        lose any unsaved information in all applications.</li>
                </ul>

                <p className="text-center mt-12 text-lg sm:text-xl animate-pulse">
                    Press any key to continue_
                </p>
            </div>

            {/* Scanlines overlay for retro feel */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[110] bg-[length:100%_4px,3px_100%]"></div>
        </div>
    );
};

export default BlueScreen;
