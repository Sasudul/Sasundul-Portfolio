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

const leafGreen = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEOUlEQVR4nO1YS4gcVRSt+Dcq+IuiRAdN1701Q2KE1oASdSPGD2qIED8L8RdURHSnC3VwowsREYdA97090WhUinTd2x0/0SSM4EIFPwvRhRJREzGgRhOQYKJpuT09Pa97qrunU9WjA3XgbYpX977zPued+zwvQ4YMGTJkyNAbJYiuY5Sxkl9e7s1XFILyOQT6F6PWCOUAoz7gzUcUoXKzkWhpoFsZFb35BEZ9YgaR+uro3wxSpqCyhkbC09v/K+SrC8eXyHnkRysI5UZGvacI+hCDPGaNUO6vfx/ePDRXRN6cXgnZE0eqQex3Qt1JqD8yyJ+d+sX/K58T6ONjI+HJAyNCIJ9NJSwG0e2MehOhfNXPQGfdQPbYStW82oLUiTDKd00ivlxh3yxREWUVgZQYdVfX2Qb9tU4cdIJBtzBKyKCbGOVdAvkmnpBuCheHJ6ZLBGTvVIJxlGVxfV4JojPs8FMgeWvWz9SukC8c2yt+IRctYZSnCWR/21b9cMPQxAkpEtGDztYCb0BYf2H5LFslbiWzMbUEhLKvGdiPhr0BIvTCoxmVXDIlX+9MJTih7G4GDqLLOvYLJF/05eKk+UavmjiGULY5AvBDKluMQL+cniG5pVM/Rn2bUX4p5cJFSXMWRqrnN1xEQzCiB9NQrXA6oDzZsR/I6sYMfmSHP2leQn3BmcAdaazIU44sVrv1ZZRXG4R/sps8yZYoQPVSJ+/BDUNy6pHGmhxcEF3jrMj+bpIajoTHMejr7h3CIC+zr7fZduknb82rLWDQ3xyhWZGIyIu5d45v0XiQ1b3+sYG7F6kzET8TSMXsiA3MVKprHNQv+snbp9/SrbOdAJNOu9i6WJK9ZjzZ13WMesrMvLKjKcMg9yYmUoJoZYu2Q7Syn//N4TLqIwT6Qd01xxP7ww54ESoXTP1nZtLJuTYxkUbQj51V+XQ29iMOJs+M8rDF6OCED5jNN6/V5qIvSYVIAeVyQjnsSOKzSWNyUF7KIC9NVaBt9mSnKzKp+i5CKTozd5hA7ksj7vjwFp9Qos4OWl7z0sTGi947ya1FGvs9tRqeUO+OXZ2gssZLG3ZwW/zX5DYbs9I2jfiEckfMuXnDGwRKOR2ZUVCBfMu+3pAsbrjIVaq2+MnvkTgw6rlxymPqZrPab4VHvlwfd4nydPu61wV6xLBLj0GeYZBDMYT2EehmezmxW3z9srdO6yDFdxHq9hjV2h5z6G8dCJHmgPzy8sl6vPvjQp0cyu66tHZ6aQE5ZORHvdGjCPT7dnLeXKDhWMmtKvtqIO+7z7IE+lxbn3+KufLiOSFTJ5SvLrSDTyjPM+onZj+6ENhlqse+Xtkeh6By7Yz+vq7z/kvQ0srZNtvmEEq+Xm23eq8CrADVM+dMigcNspfLlu3Xvbj736IE8qh7Ruy92JuvKKKsqj98J60SM2TIkCFDBq8z/gV0WnmApR4nxQAAAABJRU5ErkJggg==";
const leafPurple = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELElEQVR4nO1YS4gcZRDu9W1U8BVF8YGIiqIoRBeU6F5Mdrarpqt6pX3kEJ/xgYje9KAuXvQg4sFcVERRozJsV/WOb01IwIMKPg6iByWiiWLAZwISTDQj1bOPf2e7ZzLpntWF/qAv3f9f9X/911/11e95FSpUqFChQoXeQOExUFoPcXixt1QxGoengNJfqNxCpd0ofKe3FFEXpjYJ5xF+J0iC87ylBBR+cAER5RYo/Y1KsS88vroRHb9gXhOXkdLpIDyMSnUQvgXj8G5Qut8eVLrD3vuT42cuChEQfm128cI7skhNf/sdlbaC8DYQ/jNvXM7cz1D4gagRHT04IkqfzjisC98ASRCA8Jf9LLQPQjtsp7yWN1Q+EeFvnXC6Mn3Z8oZAaRSVnkOl7V0Xp/RLSlx4Myi9jkoNEN6ASm+j0tc5hDZEjejIUomg8G8zDsaULsoaw8In2OEH5RX22DjLdiuevv3QXvZrwmeD0iMgvKvjB3ww8vyNR5RHRGnPLBHhc70BIYzDk9q7xO7OvFiaAxTeOWPYFz7fGyCiRnQwCD87j0wSrC3FOAr/4NSPy/PGWUj5SpcU9TeyeeQQFH7f2ZXvSwkxVPpi7g/RNbnjhN8E4Z9rjWh5YZ9NPCNVEXNk7iqDSMM5gA91GcfTYz60w1/Yr/CTjt9NXgkGH3b+TLPrWKWXpsf9aJW8SEhgHF7mRMIeUjr2QG21DQqvdojs6pZSo0Z0GCi94tYQVHoB4vB6C5e+HLe8IVT61fE9XIhI7a3a4fNzPHGvObZwt5A6c39C4SmTI7Ywy1Ld7KDw5/347UtvmfLd7x+QBGutsOVW/rTYUgzC64IkOGaBX6VNs/JI6dbCRFB4ZccCVvYz3xQuCN8LSlvaqjmLGP1hB7w+VT9rloiJyTmdd21hItNkPnIcf7I/8iMLlp59pXvMRg6h3SbzTWu5KnosCS4thYivdAUK73MO8mNFbUIcXohKT811oPMIbXWTTNm66xknvPah0m1l2IXJ8XNQWPJVNL3slYlV7646yu1F0ngvsYfHJLg5a3esC/XKhh3cefqrTWi9tbZl2EelNRk78qo3CARJcEFnQwXC3/hxCEXsWiIAJ1N1kCleR7IQJMGpmZknzW60pt8OD5T87CLKM0S+6lVADxhW9FDpURTem0FoJwhPpjcnwsPwBhy3YH4jWl5XugmEN3bOh4x3qHSdN0jYDWS7H+9xwWBNWnq+0tuW7JsW4b1GfmJi4iBU+q6TnLcYMMWadnhOV9nPA0rvudeyIPx4x/d/anF42qKQSQk1cZkdfFB6ApU+TuVHfuxvt6znJ8FVnXb8OKxlhNw6779Efap+sv1tUwiQBFdbVe/VgGETT1y0VDxogPC2jh3p2tz9bwFK97lnxO6LvaUKUBpNL7+LdokVKlSoUKGCl49/AeefJbD5CiTqAAAAAElFTkSuQmCC";

function Leaf({ type, x, y, angle }: { type: 'green'|'purple', x:number, y:number, angle:number }) {
  return (
    <image 
      href={type === 'green' ? leafGreen : leafPurple} 
      x={x - 12} 
      y={y - 12} 
      width="24" 
      height="24" 
      transform={`rotate(${angle} ${x} ${y})`} 
      className="vine-leaf" 
    />
  );
}

function IntroVine() {
  return (
    <svg className="absolute pointer-events-none z-[2]" style={{ top: '-80%', left: '-20%', width: '150%', height: '260%', overflow: 'visible' }} viewBox="0 0 600 200" fill="none">
      <defs>
        <linearGradient id="vine-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop stopColor="#4CAF50"/>
          <stop offset="1" stopColor="#9C27B0"/>
        </linearGradient>
      </defs>
      <path className="vine-stem" d="M -50 150 C 100 300, 200 -100, 300 100 C 400 300, 500 -100, 650 150" stroke="url(#vine-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <Leaf type="green" x={60} y={120} angle={-45} />
      <Leaf type="purple" x={150} y={100} angle={45} />
      <Leaf type="green" x={240} y={40} angle={-30} />
      <Leaf type="purple" x={350} y={150} angle={60} />
      <Leaf type="green" x={450} y={100} angle={-60} />
      <Leaf type="purple" x={540} y={50} angle={30} />
    </svg>
  );
}

function DesignerVine() {
  return (
    <svg className="absolute pointer-events-none z-[2]" style={{ top: '-100%', left: '-30%', width: '180%', height: '300%', overflow: 'visible' }} viewBox="0 0 500 200" fill="none">
      <path className="vine-stem" d="M -50 50 C 100 -100, 200 300, 350 100 C 450 -50, 500 100, 550 50" stroke="url(#vine-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <Leaf type="purple" x={50} y={30} angle={-60} />
      <Leaf type="green" x={140} y={120} angle={45} />
      <Leaf type="purple" x={250} y={180} angle={75} />
      <Leaf type="green" x={350} y={100} angle={-45} />
      <Leaf type="purple" x={450} y={50} angle={30} />
    </svg>
  );
}

function DeveloperVine() {
  return (
    <svg className="absolute pointer-events-none z-[2]" style={{ top: '-90%', left: '-20%', width: '160%', height: '280%', overflow: 'visible' }} viewBox="0 0 700 200" fill="none">
      <path className="vine-stem" d="M -50 100 Q 100 -100, 250 100 T 550 100 T 750 100" stroke="url(#vine-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <Leaf type="green" x={100} y={30} angle={-30} />
      <Leaf type="purple" x={250} y={100} angle={45} />
      <Leaf type="green" x={400} y={170} angle={120} />
      <Leaf type="purple" x={550} y={100} angle={-45} />
      <Leaf type="green" x={650} y={50} angle={-60} />
    </svg>
  );
}

function WebflowVine() {
  return (
    <svg className="absolute pointer-events-none z-[2]" style={{ top: '-110%', left: '-40%', width: '200%', height: '320%', overflow: 'visible' }} viewBox="0 0 600 200" fill="none">
      <path className="vine-stem" d="M -100 200 C 100 -100, 300 300, 500 0 C 600 -100, 650 100, 700 200" stroke="url(#vine-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <Leaf type="purple" x={50} y={100} angle={-45} />
      <Leaf type="green" x={180} y={100} angle={45} />
      <Leaf type="purple" x={350} y={150} angle={-80} />
      <Leaf type="green" x={480} y={20} angle={30} />
      <Leaf type="purple" x={580} y={-30} angle={-45} />
    </svg>
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
            start: 'left 88%',
            end: 'left 55%',
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
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: vineWrap,
          containerAnimation: scrollTween,
          start: 'left 78%',
          end: 'left 22%',
          scrub: true,
        }
      });
    });

    // ── Vine leaves — scale in with bounce ──
    gsap.utils.toArray<SVGElement>('.vine-leaf').forEach((leaf) => {
      const vineWrap = leaf.closest('.vine-wrap');
      if (!vineWrap) return;
      gsap.fromTo(leaf,
        { scale: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          ease: 'back.out(2.5)',
          scrollTrigger: {
            trigger: vineWrap,
            containerAnimation: scrollTween,
            start: 'left 58%',
            end: 'left 32%',
            scrub: true,
          }
        }
      );
    });

    // ── Purple dots — pop in after leaves ──
    gsap.utils.toArray<SVGElement>('.vine-dot').forEach((dot) => {
      const vineWrap = dot.closest('.vine-wrap');
      if (!vineWrap) return;
      gsap.fromTo(dot,
        { scale: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          ease: 'back.out(4)',
          scrollTrigger: {
            trigger: vineWrap,
            containerAnimation: scrollTween,
            start: 'left 48%',
            end: 'left 28%',
            scrub: true,
          }
        }
      );
    });

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
          <div className="flex-shrink-0 w-[50vw]" />

          {/* ── I CRAFT DIGITAL EXPERIENCES, with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero" style={{ color: 'var(--text)' }}>
              <SplitLetters text="I CRAFT DIGITAL EXPERIENCES" />
            </span>
            <IntroVine />
          </span>

          {/* ── AS A ── */}
          <span className="heading-hero flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)' }}>
            <SplitLetters text="AS A" startIndex={27} />
          </span>

          {/* ── DESIGNER, with vine ── */}
          <span className="relative inline-block vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero" style={{ color: 'var(--text)' }}>
              <SplitLetters text="DESIGNER," startIndex={31} />
            </span>
            <DesignerVine />
          </span>

          {/* ── FRONTEND DEVELOPER with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em] mr-[0.5em]">
            <span className="heading-hero" style={{ color: 'var(--text)' }}>
              <SplitLetters text="FRONTEND DEVELOPER" startIndex={40} />
            </span>
            <DeveloperVine />
          </span>

          {/* ── & ── */}
          <span className="heading-hero flex-shrink-0 mx-[0.12em] mr-[0.5em]" style={{ color: 'var(--text)' }}>
            <SplitLetters text="&" startIndex={58} />
          </span>

          {/* ── WEBFLOW EXPERT. with vine ── */}
          <span className="relative inline-flex items-baseline vine-wrap flex-shrink-0 mx-[0.12em]">
            <span className="heading-hero" style={{ color: 'var(--text)' }}>
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
