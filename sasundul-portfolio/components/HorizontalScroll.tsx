import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

function SplitLetters({ text, startIndex = 0 }: { text: string; startIndex?: number }) {
  return (
    <>
      {text.split('').map((char, i) => {
        // Preserve word spacing correctly
        if (char === ' ') return <span key={i} className="inline-block w-[0.25em]">&nbsp;</span>;
        const from = (startIndex + i) % 2 === 0 ? 'up' : 'down';
        return (
          <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
            <span className="h-word inline-block" data-from={from} style={{ color: 'var(--text)' }}>
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
          stroke={G} strokeWidth="4.5" strokeLinecap="round"
        />
        <path className="hero-stem" d="M 18 54 C 10 50 4 54 2 46" stroke={GM} strokeWidth="2.2" strokeLinecap="round" />

        <Leaf cx={18} cy={64} angle={-140} fill={G} s={11} />
        <Leaf cx={19} cy={36} angle={-160} fill={GM} s={10} op={0.9} />
        <Leaf cx={8} cy={12} angle={-120} fill={GM} s={9} op={0.8} />
        <Dot cx={2} cy={46} r={3.5} fill={GD} />
        <Dot cx={5} cy={20} r={3} fill={GD} />

        {/* right vine dropping down */}
        <path
          className="hero-stem"
          d="M 50 12 C 64 28 80 24 82 42 C 84 58 70 68 80 82 C 86 92 96 88 94 98"
          stroke={P} strokeWidth="3.5" strokeLinecap="round"
        />
        <path className="hero-stem" d="M 82 46 C 90 50 96 46 98 54" stroke={P} strokeWidth="2.2" strokeLinecap="round" />

        <Leaf cx={82} cy={36} angle={40} fill={P} s={11} />
        <Leaf cx={76} cy={68} angle={20} fill={P} s={10} op={0.9} />
        <Leaf cx={92} cy={92} angle={60} fill={P} s={9} op={0.8} />
        <Dot cx={98} cy={54} r={3.5} fill={PD} />
        <Dot cx={96} cy={78} r={3} fill={PD} />
      </svg>
    </span>
  );
}

function IntroVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-0" style={{ top: '-40%', left: '-10%', width: '130%', height: '180%', overflow: 'visible', opacity: 0.85 }} viewBox="0 0 600 200" fill="none">
        <defs>
          <linearGradient id="vine-gradient-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="50%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#9C27B0" />
          </linearGradient>
        </defs>
        <path className="vine-stem" d="M -20 160 C 80 40, 180 180, 280 60 C 380 -40, 480 140, 580 40" stroke="url(#vine-gradient-1)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

function DesignerVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-0" style={{ top: '-40%', left: '-15%', width: '140%', height: '180%', overflow: 'visible', opacity: 0.85 }} viewBox="0 0 500 200" fill="none">
        <defs>
          <linearGradient id="vine-gradient-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#AB47BC" />
          </linearGradient>
        </defs>
        <path className="vine-stem" d="M -30 40 C 70 170, 170 10, 270 150 C 370 290, 470 30, 530 140" stroke="url(#vine-gradient-2)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

function DeveloperVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-0" style={{ top: '-40%', left: '-10%', width: '130%', height: '180%', overflow: 'visible', opacity: 0.85 }} viewBox="0 0 700 200" fill="none">
        <defs>
          <linearGradient id="vine-gradient-3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#7B1FA2" />
          </linearGradient>
        </defs>
        <path className="vine-stem" d="M -40 140 C 90 20, 220 180, 360 40 C 480 -60, 600 160, 720 50" stroke="url(#vine-gradient-3)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

function WebflowVine() {
  return (
    <>
      <svg className="absolute pointer-events-none z-0" style={{ top: '-40%', left: '-15%', width: '140%', height: '180%', overflow: 'visible', opacity: 0.85 }} viewBox="0 0 600 200" fill="none">
        <defs>
          <linearGradient id="vine-gradient-4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#66BB6A" />
            <stop offset="100%" stopColor="#8E24AA" />
          </linearGradient>
        </defs>
        <path className="vine-stem" d="M -50 60 C 60 180, 180 20, 300 160 C 420 280, 540 40, 640 140" stroke="url(#vine-gradient-4)" strokeWidth="4.5" strokeLinecap="round" />
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
    >
      <div className="h-screen flex items-center">
        <div ref={trackRef} className="horizontal-scroll__track">

          {/* Leading viewport padding */}
          <div className="flex-shrink-0 w-[90vw]" />

          {/* ── I CRAFT DIGITAL EXPERIENCES, with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <HeroI />
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)' }}>
              <SplitLetters text="  CRAFT DIGITAL EXPERIENCES" startIndex={1} />
            </span>
            <IntroVine />
          </span>

          {/* ── AS A ── */}
          <span className="heading-hero relative z-10 flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)' }}>
            <SplitLetters text="AS A" startIndex={27} />
          </span>

          {/* ── DESIGNER, with vine ── */}
          <span className="relative inline-block vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)' }}>
              <SplitLetters text="DESIGNER," startIndex={31} />
            </span>
            <DesignerVine />
          </span>

          {/* ── FRONTEND DEVELOPER with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)' }}>
              <SplitLetters text="FRONTEND DEVELOPER" startIndex={40} />
            </span>
            <DeveloperVine />
          </span>

          {/* ── & ── */}
          <span className="heading-hero relative z-10 flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)' }}>
            <SplitLetters text="&" startIndex={58} />
          </span>

          {/* ── WEBFLOW EXPERT. with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em]">
            <span className="heading-hero relative z-10" style={{ color: 'var(--text)' }}>
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
