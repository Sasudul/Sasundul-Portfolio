import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SocialDockProps {
  onContactClick?: () => void;
}

export default function SocialDock({ onContactClick }: SocialDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}
    >
      {/* Main Glass Dock Panel */}
      <div className="relative bg-[#1c1c24]/60 dark:bg-[#0a0a10]/70 backdrop-blur-3xl backdrop-saturate-200 border border-l-0 border-white/25 rounded-r-2xl py-3 px-2 flex flex-col items-center gap-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.35)]">
        
        {/* Seamless Glass Collapse Handle on the Right Side */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute left-full top-1/2 -translate-y-1/2 w-4.5 h-8 bg-[#1c1c24]/60 dark:bg-[#0a0a10]/70 backdrop-blur-3xl backdrop-saturate-200 border border-l-0 border-white/25 text-white/80 hover:text-white rounded-r-lg shadow-[4px_0_12px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-200 hover:w-5.5 hover:text-cyan-400 group focus:outline-none cursor-pointer"
          aria-label={isCollapsed ? "Expand social links" : "Collapse social links"}
          title={isCollapsed ? "Expand social links" : "Collapse side panel"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:scale-110" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:scale-110" />
          )}
        </button>

        {/* WhatsApp Icon */}
        <a 
          href="https://wa.me/+94740629020" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative w-10 h-10 rounded-[13px] bg-gradient-to-b from-[#2be672] to-[#1eb857] border border-white/35 flex items-center justify-center text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_6px_16px_rgba(37,211,102,0.35)] hover:scale-110 hover:translate-x-1 transition-all duration-200 ease-out overflow-hidden"
          aria-label="WhatsApp"
        >
          {/* Top Gloss Sheen */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-[13px]" />
          <svg className="w-5 h-5 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] z-10" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-black/85 backdrop-blur-xl border border-white/20 text-white text-xs font-mono rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap shadow-2xl z-50">
            WhatsApp
          </span>
        </a>

        {/* LinkedIn Icon */}
        <a 
          href="https://www.linkedin.com/in/sasundul/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative w-10 h-10 rounded-[13px] bg-gradient-to-b from-[#0c78e4] to-[#0753a8] border border-white/35 flex items-center justify-center text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_6px_16px_rgba(10,102,194,0.35)] hover:scale-110 hover:translate-x-1 transition-all duration-200 ease-out overflow-hidden"
          aria-label="LinkedIn"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-[13px]" />
          <svg className="w-5 h-5 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] z-10" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-black/85 backdrop-blur-xl border border-white/20 text-white text-xs font-mono rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap shadow-2xl z-50">
            LinkedIn
          </span>
        </a>

        {/* GitHub Icon */}
        <a 
          href="https://github.com/Sasudul" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative w-10 h-10 rounded-[13px] bg-gradient-to-b from-[#2a2a30] to-[#121215] border border-white/30 flex items-center justify-center text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.5)] hover:scale-110 hover:translate-x-1 transition-all duration-200 ease-out overflow-hidden"
          aria-label="GitHub"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none rounded-[13px]" />
          <svg className="w-5 h-5 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-10" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-black/85 backdrop-blur-xl border border-white/20 text-white text-xs font-mono rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap shadow-2xl z-50">
            GitHub
          </span>
        </a>

        {/* Gmail Icon */}
        <button
          onClick={onContactClick}
          className="group relative w-10 h-10 rounded-[13px] bg-gradient-to-b from-[#ffffff] to-[#ebebf0] border border-white/40 flex items-center justify-center shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),0_6px_16px_rgba(255,255,255,0.2)] hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer overflow-hidden"
          aria-label="Email Me"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent pointer-events-none rounded-[13px]" />
          <svg className="w-5.5 h-5.5 z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" viewBox="0 0 24 24" fill="none">
            <path d="M22.5 6.75V17.25C22.5 18.4926 21.4926 19.5 20.25 19.5H17.25V11.25L12 15L6.75 11.25V19.5H3.75C2.50736 19.5 1.5 18.4926 1.5 17.25V6.75C1.5 5.50736 2.50736 4.5 3.75 4.5H4.875L12 9.75L19.125 4.5H20.25C21.4926 4.5 22.5 5.50736 22.5 6.75Z" fill="#EA4335"/>
            <path d="M17.25 19.5H20.25C21.4926 19.5 22.5 18.4926 22.5 17.25V6.75L17.25 10.875V19.5Z" fill="#4285F4"/>
            <path d="M1.5 6.75V17.25C1.5 18.4926 2.50736 19.5 3.75 19.5H6.75V10.875L1.5 6.75Z" fill="#34A853"/>
            <path d="M17.25 4.5L12 8.25L6.75 4.5H3.75C2.71607 4.5 1.84883 5.19515 1.5843 6.13605L6.75 10.125L12 13.875L17.25 10.125L22.4157 6.13605C22.1512 5.19515 21.2839 4.5 20.25 4.5H17.25Z" fill="#FBBC05"/>
            <path d="M17.25 4.5H20.25C21.4926 4.5 22.5 5.50736 22.5 6.75V7.125L17.25 10.875V4.5Z" fill="#C5221F"/>
          </svg>
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-black/85 backdrop-blur-xl border border-white/20 text-white text-xs font-mono rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap shadow-2xl z-50">
            Email Me
          </span>
        </button>

      </div>
    </aside>
  );
}
