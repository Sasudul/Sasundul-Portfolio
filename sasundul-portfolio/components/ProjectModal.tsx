import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X, ArrowUpRight, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  tech: string;
  image: string;
}

export default function ProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Prevent scroll on body
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
    .fromTo(containerRef.current, {
      y: '100%',
      opacity: 0,
    }, {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      ease: 'power4.out'
    }, "-=0.3")
    .from('.modal-element', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=0.4");

    return () => {
      document.body.style.overflow = "";
    }
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(containerRef.current, {
      y: '100%',
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in'
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, "-=0.2");
  };

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-black/95 flex items-end md:items-center justify-center backdrop-blur-xl opacity-0 overflow-y-auto overflow-x-hidden pt-20 pb-0 md:py-10 px-0 md:px-6 cursor-auto"
    >
      <div 
        className="fixed inset-0 cursor-pointer"
        onClick={handleClose}
      ></div>
      
      <div 
        ref={containerRef}
        className="relative w-full max-w-6xl bg-[#0a0a0a] md:border border-white/10 md:rounded-[40px] rounded-t-[40px] shadow-[0_0_80px_rgba(168,144,255,0.1)] z-10 flex flex-col md:flex-row overflow-hidden min-h-[80vh] md:min-h-0"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all hover:rotate-90 z-50 backdrop-blur-md border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image / Media */}
        <div className="w-full md:w-1/2 relative bg-[#111] min-h-[300px] md:min-h-full modal-element flex-shrink-0 overflow-hidden flex items-center justify-center">
          <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 scale-125" />
          <img src={project.image} alt={project.title} className="relative z-10 w-full h-full object-contain p-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#0a0a0a] relative z-10">
          <div className="modal-element">
            <div className="text-white/60 text-xs uppercase font-bold tracking-widest mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-white/40"></span>
              {project.category}
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white mb-6 leading-[0.85]">{project.title}</h2>
          </div>

          <div className="modal-element mb-12">
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed font-sans">
              A comprehensive deep-dive into {project.title}. Designed with an emphasis on seamless user experience, high-performance architecture, and elegant visual aesthetics.
            </p>
          </div>

          <div className="modal-element grid grid-cols-2 gap-8 mb-12 border-y border-white/10 py-8">
            <div>
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.split('•').map(t => (
                   <span key={t} className="text-xs text-white uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">{t.trim()}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Role</h4>
              <p className="text-white font-mono text-sm uppercase">Lead Developer / Designer</p>
            </div>
          </div>

          <div className="modal-element flex flex-wrap gap-4 mt-auto">
            <a href="#" className="flex-1 py-5 bg-[#f1f1f1] text-black uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center gap-4 rounded-full">
              Live Preview <ArrowUpRight size={20} />
            </a>
            <a href="#" className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
