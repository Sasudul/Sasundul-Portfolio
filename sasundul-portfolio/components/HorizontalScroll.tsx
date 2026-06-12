import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Split text into individual letters with alternating reveal direction ─── */
function SplitLetters({ text, startIndex = 0 }: { text: string; startIndex?: number }) {
  return (
    <>
      {text.split('').map((char, i) => {
        // Preserve word spacing correctly
        if (char === ' ') return <span key={i} className="inline-block w-[0.25em]">&nbsp;</span>;
        const from = (startIndex + i) % 2 === 0 ? 'up' : 'down';
        return (
          <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
            <span className="h-word inline-block" data-from={from}>
              {char}
            </span>
          </span>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   VINE SVG DECORATIONS
   Delicate, organic vines with green stems, small leaves,
   purple accent curls and flower dots. Positioned inline
   with the text so they scroll together.
   ═══════════════════════════════════════════════════════════ */
/* ─────────────────────────────────────────────
   HERO "I"
   Two vines bloom out of the letter on section
   entry — before the horizontal scroll starts.
───────────────────────────────────────────── */
const G = '#4CAF50';
const GM = '#81C784';
const GD = '#388E3C';
const P = '#9C27B0';
const PD = '#7B1FA2';

function Leaf({ cx, cy, angle, fill, s, op = 1 }: { cx: number, cy: number, angle: number, fill: string, s: number, op?: number }) {
  return (
    <path
      className="hero-leaf"
      d={`M ${cx} ${cy} C ${cx - s / 2} ${cy - s} ${cx + s / 2} ${cy - s} ${cx} ${cy - s * 1.5} C ${cx + s / 2} ${cy - s / 2} ${cx + s / 2} ${cy} ${cx} ${cy}`}
      fill={fill}
      opacity={op}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  );
}

function Dot({ cx, cy, r, fill }: { cx: number, cy: number, r: number, fill: string }) {
  return <circle className="hero-dot" cx={cx} cy={cy} r={r} fill={fill} />;
}

function HeroI() {
  return (
    <span
      className="hero-i relative inline-block flex-shrink-0"
      style={{ marginRight: '0.2em' }}
    >
      <span className="heading-hero" style={{ color: 'var(--text, #0d0d0d)' }}>I</span>
      <svg
        className="absolute pointer-events-none z-[2]"
        style={{ top: '-60%', left: '-95%', width: '290%', height: '220%', overflow: 'visible' }}
        viewBox="0 0 100 100"
        fill="none"
      >
        {/* left vine climbing up */}
        <path
          className="hero-stem"
          d="M 50 88 C 36 72 18 76 16 58 C 14 40 28 30 20 18 C 14 8 4 10 6 2"
          stroke={G} strokeWidth="1.7" strokeLinecap="round"
        />
        <path className="hero-stem" d="M 18 54 C 10 50 4 54 2 46" stroke={GM} strokeWidth="1.1" strokeLinecap="round" />

        <Leaf cx={18} cy={64} angle={-140} fill={G} s={9} />
        <Leaf cx={19} cy={36} angle={-160} fill={GM} s={8} op={0.85} />
        <Leaf cx={8} cy={12} angle={-120} fill={GM} s={7} op={0.7} />
        <Dot cx={2} cy={46} r={2.8} fill={GD} />
        <Dot cx={5} cy={20} r={2.2} fill={GD} />

        {/* right vine dropping down */}
        <path
          className="hero-stem"
          d="M 50 12 C 64 28 80 24 82 42 C 84 58 70 68 80 82 C 86 92 96 88 94 98"
          stroke={P} strokeWidth="1.7" strokeLinecap="round"
        />
        <path className="hero-stem" d="M 82 46 C 90 50 96 46 98 54" stroke={P} strokeWidth="1.1" strokeLinecap="round" />

        <Leaf cx={82} cy={36} angle={40} fill={P} s={9} />
        <Leaf cx={76} cy={68} angle={20} fill={P} s={8} op={0.85} />
        <Leaf cx={92} cy={92} angle={60} fill={P} s={7} op={0.7} />
        <Dot cx={98} cy={54} r={2.8} fill={PD} />
        <Dot cx={96} cy={78} r={2.2} fill={PD} />
      </svg>
    </span>
  );
}

function IntroVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-[0]" style={{ top: '-80%', left: '-20%', width: '150%', height: '260%', overflow: 'visible', filter: 'blur(1.5px)' }} viewBox="0 0 600 200" fill="none">
        <defs>
          <linearGradient id="vine-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop stopColor="#4CAF50" />
            <stop offset="1" stopColor="#9C27B0" />
          </linearGradient>
        </defs>
        {/* DNA Helix 1 (Background) */}
        <path className="vine-stem opacity-0" d="M -50 100 C 50 0, 150 0, 250 100 C 350 200, 450 200, 550 100 C 600 50, 650 50, 700 100" stroke="url(#vine-gradient)" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>
      <svg className="absolute pointer-events-none z-[20]" style={{ top: '-80%', left: '-20%', width: '150%', height: '260%', overflow: 'visible', filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.9))' }} viewBox="0 0 600 200" fill="none">
        {/* DNA Helix 2 (Foreground) */}
        <path className="vine-stem opacity-0" d="M -50 100 C 50 200, 150 200, 250 100 C 350 0, 450 0, 550 100 C 600 150, 650 150, 700 100" stroke="url(#vine-gradient)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </>
  );
}

function DesignerVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-[0]" style={{ top: '-100%', left: '-30%', width: '180%', height: '300%', overflow: 'visible', filter: 'blur(1.5px)' }} viewBox="0 0 500 200" fill="none">
        <path className="vine-stem opacity-0" d="M -50 100 C 50 -20, 150 -20, 250 100 C 350 220, 450 220, 550 100" stroke="url(#vine-gradient)" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>
      <svg className="absolute pointer-events-none z-[20]" style={{ top: '-100%', left: '-30%', width: '180%', height: '300%', overflow: 'visible', filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.9))' }} viewBox="0 0 500 200" fill="none">
        <path className="vine-stem opacity-0" d="M -50 100 C 50 220, 150 220, 250 100 C 350 -20, 450 -20, 550 100" stroke="url(#vine-gradient)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </>
  );
}

function DeveloperVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-[0]" style={{ top: '-90%', left: '-20%', width: '160%', height: '280%', overflow: 'visible', filter: 'blur(1.5px)' }} viewBox="0 0 700 200" fill="none">
        <path className="vine-stem opacity-0" d="M -50 100 C 100 0, 250 0, 400 100 C 550 200, 700 200, 850 100" stroke="url(#vine-gradient)" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>
      <svg className="absolute pointer-events-none z-[20]" style={{ top: '-90%', left: '-20%', width: '160%', height: '280%', overflow: 'visible', filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.9))' }} viewBox="0 0 700 200" fill="none">
        <path className="vine-stem opacity-0" d="M -50 100 C 100 200, 250 200, 400 100 C 550 0, 700 0, 850 100" stroke="url(#vine-gradient)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </>
  );
}

function WebflowVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-[0]" style={{ top: '-110%', left: '-40%', width: '200%', height: '320%', overflow: 'visible', filter: 'blur(1.5px)' }} viewBox="0 0 600 200" fill="none">
        <path className="vine-stem opacity-0" d="M -100 100 C 0 -50, 200 -50, 300 100 C 400 250, 600 250, 700 100" stroke="url(#vine-gradient)" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
      </svg>
      <svg className="absolute pointer-events-none z-[20]" style={{ top: '-110%', left: '-40%', width: '200%', height: '320%', overflow: 'visible', filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.9))' }} viewBox="0 0 600 200" fill="none">
        <path className="vine-stem opacity-0" d="M -100 100 C 0 250, 200 250, 300 100 C 400 -50, 600 -50, 700 100" stroke="url(#vine-gradient)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   HORIZONTAL SCROLL SECTION
   ═══════════════════════════════════════════════════════════ */

export default function HorizontalScroll() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    // ── Master horizontal scroll tween ──
    const scrollTween = gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        scrub: 1,
        end: `+=${totalScroll}`,
      }
    });

    // ── Letter reveals — alternating from up/down ──
    // Uses containerAnimation so triggers fire based on
    // horizontal position within the moving track
    gsap.utils.toArray<HTMLElement>('.h-word').forEach((letter) => {
      const dir = letter.dataset.from === 'up' ? -120 : 120;
      gsap.fromTo(letter,
        { yPercent: dir, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: letter,
            containerAnimation: scrollTween,
            start: 'left 95%', // Wait until it's really on screen
            end: 'left 60%',
            scrub: true,
          }
        }
      );
    });

    // ── Vine stems — draw with strokeDashoffset ──
    gsap.utils.toArray<SVGPathElement>('.vine-stem').forEach((path) => {
      const vineWrap = path.closest('.vine-wrap');
      if (!vineWrap) return;
      const len = path.getTotalLength();
      // Add extra length to array/offset to guarantee the line is 100% hidden at the start
      gsap.set(path, { strokeDasharray: len + 10, strokeDashoffset: len + 10, opacity: 1 });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: vineWrap,
          containerAnimation: scrollTween,
          start: 'left 90%', // Start drawing exactly as the word enters the screen
          end: 'right 60%', // Finish drawing exactly as the last letter finishes its animation
          scrub: true,
        }
      });
    });

    // ── Hero "I" initial bloom ──
    gsap.utils.toArray<SVGPathElement>('.hero-stem').forEach(path => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    gsap.to('.hero-stem', {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 60%',
      }
    });

    gsap.fromTo('.hero-leaf, .hero-dot',
      { scale: 0, transformOrigin: 'center' },
      {
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 60%',
        }
      }
    );

  }, { scope: wrapperRef });

  return (
    <section
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
      data-lenis-prevent
    >
      <div className="h-screen flex items-center">
        <div ref={trackRef} className="horizontal-scroll__track">

          {/* Leading viewport padding */}
          <div className="flex-shrink-0 w-[90vw]" />

          {/* ── I CRAFT DIGITAL EXPERIENCES, with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <HeroI />
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
              <SplitLetters text="  CRAFT DIGITAL EXPERIENCES" startIndex={1} />
            </span>
            <IntroVine />
          </span>

          {/* ── AS A ── */}
          <span className="heading-hero relative z-10 flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
            <SplitLetters text="AS A" startIndex={27} />
          </span>

          {/* ── DESIGNER, with vine ── */}
          <span className="relative inline-block vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
              <SplitLetters text="DESIGNER," startIndex={31} />
            </span>
            <DesignerVine />
          </span>

          {/* ── FRONTEND DEVELOPER with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
              <SplitLetters text="FRONTEND DEVELOPER" startIndex={40} />
            </span>
            <DeveloperVine />
          </span>

          {/* ── & ── */}
          <span className="heading-hero relative z-10 flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
            <SplitLetters text="&" startIndex={58} />
          </span>

          {/* ── WEBFLOW EXPERT. with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)', textShadow: '0px 10px 15px rgba(0,0,0,0.8)' }}>
              <SplitLetters text="BACKEND EXPERT." startIndex={59} />
            </span>
            <WebflowVine />
          </span>

          {/* Trailing viewport padding */}
          <div className="flex-shrink-0 w-[80vw]" />

        </div>
      </div>
    </section>
  );
}
