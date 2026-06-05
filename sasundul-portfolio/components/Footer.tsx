import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WhatsApp = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width={size} height={size}>
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
);

interface FooterProps {
  onContactClick: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.footer-reveal', {
      y: 50,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} id="contact" className="relative overflow-hidden" style={{ background: 'var(--footer-bg)', color: 'var(--footer-text)' }}>
      {/* Main CTA */}
      <div className="py-32 md:py-48 px-6 md:px-12 text-center">
        <h2 className="footer-reveal text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-none">
          Let's Work Together
        </h2>

        <div className="h-12" />

        {/* Animated Contact Button */}
        <button
          onClick={onContactClick}
          className="footer-reveal btn-animated inline-flex items-center h-12 gap-0 border rounded-full overflow-hidden group"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <div className="btn-animated__text-wrap px-8">
            <span className="btn-animated__text text-sm font-mono uppercase tracking-widest text-white">Contact</span>
            <span className="btn-animated__text btn-animated__text--duplicate text-sm font-mono uppercase tracking-widest text-white">Contact</span>
          </div>
          <div className="relative w-12 h-full border-l flex items-center justify-center overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            <div className="btn-animated__arrow-bg" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative z-10 text-white transition-transform duration-500 group-hover:rotate-45">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        <div className="h-12" />

        {/* Footer nav links */}
        <div className="footer-reveal flex gap-8 justify-center text-sm font-mono uppercase tracking-widest">
          <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link text-white/60 hover:text-white transition-colors">Home</button>
          <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link text-white/60 hover:text-white transition-colors">Work</button>
          <button onClick={onContactClick} className="footer-link text-white/60 hover:text-white transition-colors">Contact</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <span className="text-xs font-mono text-white/40 uppercase">{new Date().getFullYear()} © Edition</span>
        <div className="flex gap-6">
          <a href="https://www.linkedin.com/in/sasundul/" target="_blank" rel="noopener noreferrer" className="footer-link text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/Sasudul" target="_blank" rel="noopener noreferrer" className="footer-link text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors">GitHub</a>
          <a href="https://wa.me/+94740629020" target="_blank" rel="noopener noreferrer" className="footer-link text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>

      {/* Infinite marquee */}
      <div className="border-t overflow-hidden py-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="marquee__inner" style={{ '--marquee-duration': '25s' } as any}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 flex-shrink-0">
              <span className="text-xs font-mono uppercase tracking-widest text-white/30 whitespace-nowrap">Code by Sasundul</span>
              <svg width="12" height="10" viewBox="0 0 125 95" fill="none" className="text-white/20">
                <path d="M73.6748 89.7824L116.207 47.2501L73.6748 4.71783" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
                <path d="M116.207 47.25L0.762451 47.25" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
