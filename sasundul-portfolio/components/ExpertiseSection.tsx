import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import PixelBlast from './PixelBlast';

gsap.registerPlugin(ScrollTrigger);

const EXPERTISE = [
  {
    id: 0,
    number: '01',
    title: 'DESIGN',
    subtitle: 'UI/UX & Brand Aesthetics',
    description: 'Crafting clean, thoughtful layouts that balance visual aesthetics with intuitive usability. I focus on hierarchy, typography, spatial geometry, and brand identity to make digital products look and feel world-class.',
    tags: ['Figma', 'UI/UX Design', 'Wireframing', 'Design Systems', 'Design Tokens'],
    highlights: ['Pixel-Perfect Alignment', 'Modern Design Tokens', 'User Centric Workflows']
  },
  {
    id: 1,
    number: '02',
    title: 'DEVELOPMENT',
    subtitle: 'Full-Stack Architecture & Performance',
    description: 'Engineering fast, scalable, and maintainable full-stack applications with modern web stacks. From robust backends to smooth frontend user interfaces, every line of code is structured for performance.',
    tags: ['React 19', 'Next.js', 'TypeScript', 'Spring Boot', 'Tailwind CSS', 'MySQL'],
    highlights: ['High-Performance Code', 'Clean Modular Architecture', 'Responsive Across Devices']
  },
  {
    id: 2,
    number: '03',
    title: 'INTERACTIONS',
    subtitle: 'Motion, 3D & Micro-Animations',
    description: 'Bringing static interfaces to life through fluid animations, scroll-driven reveals, and 3D interactions. Creating tactile, responsive feedback that engages users and leaves a lasting impression.',
    tags: ['GSAP', 'ScrollTrigger', 'Framer Motion', 'Three.js / Canvas', 'CSS Keyframes'],
    highlights: ['60fps Smooth Motion', 'Interactive 3D Elements', 'Tactile User Feedback']
  },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  // Keep ref synchronized with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // GSAP Pinning
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      pin: true,
      start: 'top top',
      end: '+=100%',
      scrub: 0.1,
      onUpdate: (self) => {
        const progress = self.progress;
        let index = 0;
        if (progress >= 0.6) index = 2;
        else if (progress >= 0.3) index = 1;

        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index;
          setActiveIndex(index);
        }
      }
    });
  }, { scope: sectionRef });

  // 2-Notch Wheel Event Observer
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let deltaAccumulator = 0;
    let resetTimer: any = null;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isCentered = Math.abs(rect.top) < 25;

      if (!isCentered) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 5) return;

      deltaAccumulator += delta;

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        deltaAccumulator = 0;
      }, 300);

      const THRESHOLD = 1000;

      // Scrolling Down
      if (deltaAccumulator >= THRESHOLD && activeIndexRef.current < EXPERTISE.length - 1) {
        e.preventDefault();
        deltaAccumulator = 0;
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        const next = activeIndexRef.current + 1;
        activeIndexRef.current = next;
        setActiveIndex(next);
        setTimeout(() => { isAnimatingRef.current = false; }, 500);
      }
      // Scrolling Up
      else if (deltaAccumulator <= -THRESHOLD && activeIndexRef.current > 0) {
        e.preventDefault();
        deltaAccumulator = 0;
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        const prev = activeIndexRef.current - 1;
        activeIndexRef.current = prev;
        setActiveIndex(prev);
        setTimeout(() => { isAnimatingRef.current = false; }, 500);
      }
      else if (
        (deltaAccumulator > 0 && activeIndexRef.current < EXPERTISE.length - 1) ||
        (deltaAccumulator < 0 && activeIndexRef.current > 0)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const activeItem = EXPERTISE[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative min-h-screen h-screen flex flex-col justify-between py-8 px-6 md:px-16 bg-[#050505] text-white overflow-hidden"
    >
      {/* Background Ambient Pixel Blast */}
      <PixelBlast
        variant="circle"
        color="#707070"
        pixelSize={3}
        patternDensity={1.2}
        patternScale={2.0}
        liquid={true}
        liquidStrength={0.08}
        liquidRadius={1.0}
        enableRipples={true}
        rippleIntensityScale={1.2}
        rippleThickness={0.1}
        rippleSpeed={0.3}
        opacity={0.25}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-between h-full py-4">

        {/* Header bar */}
        <div className="border-b border-white/10 pb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-white/50 flex items-center gap-2 mb-1">
              <span className="w-5 h-[1.5px] bg-white/40"></span>
              Capabilities & Services
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter text-white">
              Expertise
            </h2>
          </div>

          {/* Counter */}
          <div className="hidden md:flex items-center gap-3 font-mono text-sm">
            <span className="text-white font-bold text-lg">{activeItem.number}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/40">03</span>
          </div>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">

          {/* Left Column: Service Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {EXPERTISE.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.number}
                  onClick={() => {
                    activeIndexRef.current = idx;
                    setActiveIndex(idx);
                  }}
                  className={`group text-left p-5 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${isActive
                    ? 'bg-white/10 border-white/30 shadow-[0_10px_30px_rgba(255,255,255,0.05)] backdrop-blur-xl translate-x-2'
                    : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80 hover:border-white/15'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                      {item.number}
                    </span>
                    <div>
                      <h3 className={`text-xl md:text-2xl font-display font-bold uppercase tracking-tight transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono text-white/40 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-white bg-white text-black rotate-45' : 'border-white/20 text-white/40 group-hover:border-white/50'
                    }`}>
                    <ArrowUpRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Card Viewport */}
          <div className="lg:col-span-7 relative w-full min-h-[480px] md:min-h-[520px] rounded-3xl border border-white/15 bg-black/80 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {EXPERTISE.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.number}
                  className={`exp-card-item absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all duration-500 ease-out ${isActive
                    ? 'opacity-100 scale-100 pointer-events-auto z-10 translate-y-0'
                    : 'opacity-0 scale-95 pointer-events-none z-0 translate-y-4'
                    }`}
                >
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                        {item.subtitle}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-base leading-relaxed text-white/75 font-sans mb-4">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono text-white/70 bg-white/[0.03] border border-white/10 p-2.5 rounded-xl">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0"></span>
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Stack Tags */}
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-2.5">Technologies & Tools</span>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 text-white/90 bg-white/5 border border-white/15 rounded-xl">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Progress Bar (White Line) */}
        <div className="relative z-10 w-full pt-4">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 rounded-full"
              style={{ width: `${((activeIndex + 1) / EXPERTISE.length) * 100}%` }}
            />
          </div>
        </div>

      </div>

    </section>
  );
}
