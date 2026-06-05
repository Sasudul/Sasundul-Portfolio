import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  tech: string;
  image: string;
  year?: string;
}

interface WorkShowcaseProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function WorkShowcase({ projects, onProjectClick }: WorkShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Section entrance
    gsap.fromTo('.work-heading', {
      y: 60,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      }
    });

    gsap.fromTo('.work-thumb', {
      y: 40,
      opacity: 0,
      scale: 0.9,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.work-thumbs-container',
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

  const activeProject = projects[activeIndex];

  return (
    <section ref={sectionRef} id="work" className="relative min-h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Scroll-direction-aware marquee divider */}
      <div className="py-4 overflow-hidden border-b border-white/10">
        <div className="marquee__inner" style={{ '--marquee-duration': '15s' } as any}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-6 flex-shrink-0">
              <span className="text-sm font-mono uppercase tracking-widest text-white/60 whitespace-nowrap">Work</span>
              <svg width="20" height="16" viewBox="0 0 125 95" fill="none" className="text-white/40">
                <path d="M73.6748 89.7824L116.207 47.2501L73.6748 4.71783" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
                <path d="M116.207 47.25L0.762451 47.25" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Background images */}
      <div ref={bgContainerRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 z-10" />
        {projects.map((p, i) => (
          <img
            key={p.id}
            src={p.image}
            alt=""
            className={`work__bg-image ${i === activeIndex ? 'is-active' : ''}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] px-6 py-20">
        {/* Project title */}
        <div className="text-center mb-12 work-heading">
          <h3 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white leading-none">
            {activeProject.title}
          </h3>
          <p className="text-sm font-mono uppercase tracking-widest text-white/50 mt-4">
            {activeProject.category} • {activeProject.year || '2025'}
          </p>
        </div>

        {/* Thumbnail strip */}
        <div className="work-thumbs-container flex gap-4 items-center justify-center max-w-5xl overflow-x-auto pb-4 px-4 hide-scrollbar">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              onDoubleClick={() => onProjectClick(p)}
              className={`work-thumb work__thumbnail ${i === activeIndex ? 'is-active' : ''} flex-shrink-0 w-32 h-24 md:w-44 md:h-32 rounded-xl overflow-hidden border transition-all duration-500 ${i === activeIndex ? 'border-white/40 shadow-lg shadow-white/10' : 'border-white/10'}`}
            >
              <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500" />
            </button>
          ))}
        </div>

        {/* Navigation hints */}
        <div className="flex gap-8 mt-8">
          <button onClick={goPrev} className="text-white/40 hover:text-white text-sm font-mono uppercase tracking-widest transition-colors">
            ← Prev
          </button>
          <button onClick={() => onProjectClick(activeProject)} className="text-white/60 hover:text-white text-sm font-mono uppercase tracking-widest transition-colors border border-white/20 px-6 py-2 rounded-full hover:bg-white/10">
            Explore
          </button>
          <button onClick={goNext} className="text-white/40 hover:text-white text-sm font-mono uppercase tracking-widest transition-colors">
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
