import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { Project } from '../App';

interface WorkShowcaseProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function WorkShowcase({ projects, onProjectClick }: WorkShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.work-showcase-title', {
      y: 30,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      }
    });

    gsap.fromTo('.work-showcase-card', {
      y: 50,
      opacity: 0,
      scale: 0.96,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.work-showcase-card',
        start: 'top 80%',
      }
    });
  }, { scope: sectionRef });

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const goNext = () => goTo((activeIndex + 1) % projects.length);
  const goPrev = () => goTo((activeIndex - 1 + projects.length) % projects.length);

  // Enable Keyboard Left & Right Arrow Key Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, projects.length]);

  const activeProject = projects[activeIndex];

  return (
    <section ref={sectionRef} id="work" className="relative min-h-screen py-10 px-4 md:px-12 flex flex-col justify-between overflow-hidden bg-[#050505] text-white">
      {/* Scroll-direction-aware marquee divider */}
      <div className="w-full py-3 overflow-hidden border-b border-white/10 mb-4">
        <div className="marquee__inner" style={{ '--marquee-duration': '18s' } as any}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-6 flex-shrink-0">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50 whitespace-nowrap">Featured Case Studies</span>
              <svg width="16" height="12" viewBox="0 0 125 95" fill="none" className="text-white/30">
                <path d="M73.6748 89.7824L116.207 47.2501L73.6748 4.71783" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
                <path d="M116.207 47.25L0.762451 47.25" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Ambient Blur Background (Fills screen edge-to-edge with project brand glow) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {projects.map((p, i) => (
          <img
            key={`ambient-${p.id}`}
            src={p.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover filter blur-[100px] scale-125 transition-opacity duration-1000 ${i === activeIndex ? 'opacity-35' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-[#050505]/90" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center gap-4 my-auto">
        
        {/* Header Information Bar */}
        <div className="work-showcase-title flex flex-col md:flex-row items-center justify-between w-full gap-4 px-2">
          <div>
            <div className="text-white/60 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
              <span className="w-6 h-[2px] bg-white/40"></span>
              Project {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} • {activeProject.category}
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white">
              {activeProject.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest hidden md:inline-block">{activeProject.tech}</span>
            <button
              onClick={() => onProjectClick(activeProject)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-5 py-2.5 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              Explore Project <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Central Full Mockup Presentation Card (100% Uncropped, Crisp View) */}
        <div 
          onClick={() => onProjectClick(activeProject)}
          className="work-showcase-card group relative w-full max-w-6xl aspect-[16/9] max-h-[62vh] rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md cursor-pointer transition-all duration-500 hover:border-white/40 hover:shadow-[0_25px_80px_rgba(255,255,255,0.08)] flex items-center justify-center p-2 md:p-4"
        >
          {projects.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.title}
              className={`w-full h-full object-contain transition-all duration-700 rounded-xl ${i === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-98 absolute inset-0'}`}
            />
          ))}

          {/* Hover Hint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
            <span className="text-xs font-bold uppercase tracking-widest text-white bg-black/60 border border-white/20 px-5 py-2 rounded-full backdrop-blur-md shadow-lg">
              Click to Open Full View
            </span>
          </div>
        </div>

        {/* Display Thumbnail Roll (11 Thumbnails) */}
        <div className="w-full flex items-center justify-center overflow-x-auto pb-2 pt-1 hide-scrollbar px-2">
          <div className="flex items-center gap-3">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 w-20 h-14 md:w-28 md:h-18 rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer ${i === activeIndex ? 'border-white ring-2 ring-white/30 scale-105 opacity-100 shadow-lg shadow-white/10' : 'border-white/10 opacity-40 hover:opacity-80'}`}
              >
                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Bar below Display Roll: ← PREV | EXPLORE | NEXT → */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mt-2">
          <button 
            onClick={goPrev} 
            className="text-white/60 hover:text-white text-xs md:text-sm font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer group py-2"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span> PREV
          </button>
          
          <button 
            onClick={() => onProjectClick(activeProject)} 
            className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/80 hover:text-white border border-white/20 hover:border-white/50 hover:bg-white/10 px-8 py-2.5 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer shadow-sm"
          >
            EXPLORE
          </button>
          
          <button 
            onClick={goNext} 
            className="text-white/60 hover:text-white text-xs md:text-sm font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer group py-2"
          >
            NEXT <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
