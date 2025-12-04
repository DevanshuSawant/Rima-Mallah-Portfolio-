import React, { useState } from 'react';
import { X, Sparkles, Loader, Play } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `**TASK:**
You are a Data Extraction Engine. Your ONLY purpose is to convert raw text inputs into a structured Markdown Table.

**INPUT FORMAT:**
The user will provide text blocks containing:
- "IG LINK:"
- "Copy:"
- "Description:"
- "Content Type:"
- "Content Format:"
- "Content Style:"

**PROCESSING RULES:**
1.  **Post Title:** Analyze the "Copy" or "Description" and generate a short, catchy title (max 5 words).
2.  **Categories:** Extract the exact values provided by the user for "Content Type", "Content Format", and "Content Style". Do not change them.
3.  **Link:** Extract the exact URL from "IG LINK".

**OUTPUT FORMAT:**
Output a single Markdown table. Do not speak. Do not add intro text. Use this exact header:

| Post Title | Content Type | Content Format | Content Style | Instagram Link |
| :--- | :--- | :--- | :--- | :--- |
| [Generated Title] | [Extracted Type] | [Extracted Format] | [Extracted Style] | [Extracted URL] |`;

interface CuratorWindowProps {
  onClose: () => void;
}

const CuratorWindow: React.FC<CuratorWindowProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[][] | null>(null);

  const handleRun = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResults(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        contents: inputText,
      });

      const text = response.text || '';
      
      // Basic Markdown Table Parse
      const lines = text.split('\n');
      const tableRows = lines
        .map(line => line.trim())
        .filter(line => line.startsWith('|') && !line.includes('---')) // Filter data rows
        .map(line => {
             // split by pipe, ignore first/last empty from split usually
             const cells = line.split('|');
             // Markdown tables usually have empty string at start/end if pipe is at start/end
             // Filter empty strings and trim
             return cells.map(c => c.trim()).filter(c => c !== '');
        });

      if (tableRows.length > 0) {
          setResults(tableRows);
      } else {
          setResults([["Error", "Could not parse table structure", "Raw Output:", text, ""]]);
      }

    } catch (error) {
      console.error(error);
      setResults([["Error", "API Call Failed", "Check Console", "", ""]]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl bg-[#c0c0c0] shadow-[10px_10px_0_0_rgba(0,0,0,0.5)] border-2 border-white border-r-gray-600 border-b-gray-600 flex flex-col max-h-[90vh]">
        
        {/* Title Bar */}
        <div className="bg-[#800080] px-2 py-1 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-white" />
            <span className="text-white font-pixel text-lg tracking-widest mt-1">AI_DATA_EXTRACTOR.EXE</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 bg-[#c0c0c0] border-t border-l border-white border-r-gray-800 border-b-gray-800 flex items-center justify-center active:border-t-gray-800 active:border-l-gray-800 active:border-r-white active:border-b-white">
            <X size={14} className="text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full overflow-hidden gap-4">
          
          {/* Input Area */}
          <div className="flex-1 flex flex-col gap-2 min-h-[150px]">
             <label className="font-pixel text-lg">INPUT: PASTE CONTENT LIST</label>
             <textarea 
                className="flex-1 w-full p-2 font-mono text-sm border-2 border-gray-600 border-b-white border-r-white bg-white resize-none focus:outline-none"
                placeholder={`Example Input:

Post 1:
IG LINK: https://www.instagram.com/p/Example...
Copy: "This is the caption..."
Description: A storytelling carousel about weekends.
Content Type: Editorial
Content Format: Static Musing
Content Style: Reassuring`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
             />
          </div>

          {/* Action Bar */}
          <div className="flex justify-end">
            <button 
                onClick={handleRun}
                disabled={isLoading || !inputText}
                className="flex items-center gap-2 px-6 py-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black active:border-t-black active:border-l-black active:translate-y-1 disabled:opacity-50 font-pixel text-xl hover:bg-[#d0d0d0] transition-colors"
            >
                {isLoading ? <Loader className="animate-spin" size={20} /> : <Play size={20} />}
                <span>EXTRACT_DATA</span>
            </button>
          </div>

          {/* Results Area */}
          {results && (
             <div className="flex-[2] flex flex-col gap-2 overflow-hidden border-2 border-white border-l-gray-600 border-t-gray-600 p-2 bg-gray-100">
                <div className="overflow-auto h-full bg-white border border-gray-400">
                    <table className="w-full text-left border-collapse font-pixel text-lg">
                        <thead className="bg-[#000080] text-white sticky top-0">
                            <tr>
                                <th className="p-2 border border-gray-400">Title</th>
                                <th className="p-2 border border-gray-400">Type</th>
                                <th className="p-2 border border-gray-400">Format</th>
                                <th className="p-2 border border-gray-400">Style</th>
                                <th className="p-2 border border-gray-400">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, i) => {
                                // Skip if it's the header row repeated in output
                                if (row[0] === 'Post Title' && row[1] === 'Content Type') return null;
                                
                                return (
                                  <tr key={i} className="even:bg-gray-100 hover:bg-yellow-100">
                                      {row.map((cell, j) => (
                                          <td key={j} className="p-2 border border-gray-300 truncate max-w-[200px]" title={cell}>{cell}</td>
                                      ))}
                                  </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
          )}

        </div>
        
        {/* Status Bar */}
        <div className="bg-[#c0c0c0] px-2 py-1 text-xs font-pixel border-t border-white flex justify-between">
             <span>{results ? 'EXTRACTION COMPLETE' : 'READY FOR INPUT...'}</span>
             <span>GEMINI-2.5-FLASH</span>
        </div>

      </div>
    </div>
  );
};

export default CuratorWindow;