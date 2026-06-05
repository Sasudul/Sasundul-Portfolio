import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ProjectModal from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  tech: string;
  image: string;
}

interface ProjectsPageProps {
  projects: Project[];
  onBack: () => void;
}

export default function ProjectsPage({ projects, onBack }: ProjectsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useGSAP(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline();

    tl.from('.proj-header', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
    .from('.proj-grid-item', {
      y: 150,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power3.out',
    }, "-=0.5");

    const items = gsap.utils.toArray('.proj-grid-item');
    items.forEach((item: any) => {
      gsap.fromTo(item.querySelector('.proj-img-wrap'),
        { scale: 0.8, opacity: 0, rotationX: 10 },
        {
          scale: 1, opacity: 1, rotationX: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "center center",
            scrub: 1
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#f1f1f1] py-32 px-6 md:px-12 relative z-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-4 text-[#f1f1f1] hover:text-[#a890ff] uppercase tracking-widest font-bold text-lg mb-16 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform duration-300" />
          Back to Portfolio
        </button>

        {/* Header */}
        <div className="proj-header overflow-hidden mb-24 border-b border-white/10 pb-12">
          <h1 className="text-6xl md:text-[8vw] font-display font-bold uppercase tracking-tighter leading-none">
            All <span className="text-outline">Projects</span>
          </h1>
          <p className="text-gray-400 mt-6 max-w-xl font-mono text-sm uppercase">An extensive archive of design engineering, robust full-stack solutions, and digital explorations.</p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 items-start">
          {projects.map((p) => (
            <div key={p.id} className="proj-grid-item group h-full flex flex-col">
              {/* Click to expand case study */}
              <div 
                onClick={() => setSelectedProject(p)}
                className="proj-img-wrap overflow-hidden rounded-3xl aspect-[4/3] bg-[#141414] mb-8 relative border border-white/10 shadow-xl hover:shadow-[#a890ff]/10 hover:border-[#a890ff]/30 transition-all duration-500 cursor-pointer flex items-center justify-center p-4 group-hover:bg-[#1a1a1a]"
              >
                {/* Image is styled to cover nicely but respect bounds */}
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] rounded-2xl" 
                />
                
                {/* Hover Visual hint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">Click to Expand</span>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <div className="text-[#a890ff] text-xs uppercase font-bold tracking-widest mb-4 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#a890ff]"></span>
                  {p.category}
                </div>
                <h3 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4 group-hover:text-[#a890ff] transition-colors">{p.title}</h3>
                <p className="text-gray-400 font-mono text-xs uppercase mb-8 mt-auto">{p.tech}</p>
                
                <button className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest w-fit border-b border-transparent group-hover:border-[#f1f1f1] transition-all pb-1 cursor-pointer">
                  Explore Project <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Premium Case Study Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
