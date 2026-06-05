import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        sessionStorage.setItem('preloaderPlayed', 'true');
        onComplete();
      }
    });

    // Rolling counter animation
    tl.to('.preloader__digit--1', {
      y: '-50%',
      duration: 1.5,
      ease: 'power2.inOut',
    })
    .to('.preloader__digit--2', {
      y: '-90.909%', // 10 out of 11 positions  
      duration: 2,
      ease: 'power2.inOut',
    }, 0)
    .to('.preloader__digit--3', {
      y: '-95.238%', // 20 out of 21 positions
      duration: 2.5,
      ease: 'power2.inOut',
    }, 0)

    // Heading characters stagger in
    .fromTo('.preloader__char', {
      y: 100,
      opacity: 0,
      rotateX: -90,
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: 'power4.out',
    }, 0.5)

    // Pause to let it breathe
    .to({}, { duration: 0.3 })

    // Heading chars exit
    .to('.preloader__char', {
      y: -80,
      opacity: 0,
      stagger: 0.02,
      duration: 0.5,
      ease: 'power3.in',
    })

    // Counter fade
    .to('.preloader__counter', {
      opacity: 0,
      y: 10,
      duration: 0.3,
    }, '-=0.4')

    // Split curtains
    .to('.preloader__half--top', {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
    })
    .to('.preloader__half--bottom', {
      yPercent: 100,
      duration: 1,
      ease: 'power4.inOut',
    }, '<');

  }, { scope: containerRef });

  const headingText = "CODE BY SASUNDUL©";

  return (
    <div ref={containerRef} className="preloader">
      {/* Curtains */}
      <div className="preloader__half preloader__half--top"></div>
      <div className="preloader__half preloader__half--bottom"></div>

      {/* Heading */}
      <div className="preloader__heading">
        <h2 className="heading-display flex overflow-hidden">
          {headingText.split('').map((char, i) => (
            <span key={i} className="preloader__char inline-block" style={char === ' ' ? { width: '0.3em' } : {}}>
              {char}
            </span>
          ))}
        </h2>
      </div>

      {/* Rolling Counter */}
      <div className="preloader__counter flex">
        {/* Hundreds digit: 0 → 1 */}
        <div className="overflow-hidden h-[1.5em] leading-[1.5em]">
          <div className="preloader__digit--1">
            <div>0</div>
            <div>1</div>
          </div>
        </div>
        {/* Tens digit: 0 → 0 (cycles 0-9 then 0) */}
        <div className="overflow-hidden h-[1.5em] leading-[1.5em]">
          <div className="preloader__digit--2">
            {[0,1,2,3,4,5,6,7,8,9,0].map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>
        </div>
        {/* Units digit: 0 → 0 (cycles 0-9 twice then 0) */}
        <div className="overflow-hidden h-[1.5em] leading-[1.5em]">
          <div className="preloader__digit--3">
            {[0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0].map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
