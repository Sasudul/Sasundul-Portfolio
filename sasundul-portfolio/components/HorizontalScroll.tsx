import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SVG scribble underline
function ScribbleUnderline() {
  return (
    <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 14" fill="none" preserveAspectRatio="none">
      <path
        d="M1 7C25 3 60 1 100 5C140 9 170 4 199 8"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function HorizontalScroll() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current || !wrapperRef.current) return;

    const totalScroll = trackRef.current.scrollWidth - window.innerWidth;

    gsap.to(trackRef.current, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        pin: true,
        scrub: 1.5,
        end: () => `+=${totalScroll}`,
        invalidateOnRefresh: true,
      }
    });

    // Animate the SVG scribbles on scroll
    gsap.from('.scribble-path path', {
      strokeDashoffset: 300,
      strokeDasharray: 300,
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top center',
        end: 'center center',
        scrub: 1,
      }
    });
  }, { scope: wrapperRef });

  return (
    <section ref={wrapperRef} className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="h-screen flex items-center">
        <div ref={trackRef} className="horizontal-scroll__track pl-[50vw]">
          {/* Segment 1 */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap" style={{ color: 'var(--text)' }}>
              I craft digital experiences as a{' '}
            </h2>
          </div>

          {/* Segment 2 - Designer */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap relative" style={{ color: 'var(--text)' }}>
              <span className="relative inline-block">
                Designer,
                <span className="scribble-path"><ScribbleUnderline /></span>
              </span>
            </h2>
          </div>

          {/* Decorative icon */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <svg viewBox="0 0 60 60" className="w-16 h-16 md:w-24 md:h-24 opacity-40" style={{ color: 'var(--text)' }}>
              <polygon points="30,5 55,20 55,50 30,60 5,50 5,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="30" y1="5" x2="30" y2="60" stroke="currentColor" strokeWidth="0.5" />
              <line x1="5" y1="20" x2="55" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <line x1="55" y1="20" x2="5" y2="50" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Segment 3 - Frontend Developer */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap relative" style={{ color: 'var(--text)' }}>
              <span className="relative inline-block">
                Frontend
                <span className="scribble-path"><ScribbleUnderline /></span>
              </span>
            </h2>
          </div>

          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap" style={{ color: 'var(--text)' }}>
              Developer
            </h2>
          </div>

          {/* Segment 4 - & */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap" style={{ color: 'var(--text)' }}>&amp;</h2>
          </div>

          {/* Segment 5 - Full Stack */}
          <div className="flex items-center flex-shrink-0 mr-8">
            <h2 className="heading-hero whitespace-nowrap relative" style={{ color: 'var(--text)' }}>
              <span className="relative inline-block">
                Full Stack
                <span className="scribble-path"><ScribbleUnderline /></span>
              </span>
            </h2>
          </div>

          <div className="flex items-center flex-shrink-0 pr-[50vw]">
            <h2 className="heading-hero whitespace-nowrap" style={{ color: 'var(--text)' }}>
              Engineer.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
