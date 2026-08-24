import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

const COUNTER_DURATION = 3.0;

// 2. IMAGE_STEP_FREQUENCY: How many number increments pass before switching images.
//    - 1 = switch image on EVERY number (0, 1, 2, 3...) [Fastest]
//    - 3 = switch image every 3 numbers (0, 3, 6, 9...) [Medium]
//    - 5 = switch image every 5 numbers (0, 5, 10, 15...) [Paced]
const IMAGE_STEP_FREQUENCY = 4;

const IMAGES = [
  '/Art-Gallery-01.jpeg',
  '/Zerin.png',
  '/Vap-Construction.png',
  '/FloodNav.png',
  '/LandSlideAlert.png',
  '/FleetTracking.png',
  '/LunarwayTravels.png',
  '/E-Channeling-System.png',
  '/Pizza-Mania.png',
  '/NatoMiniMart.png',
  '/Lumina.png',
];

const NAME = "CODE BY SASUNDUL®";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const topImgRef = useRef<HTMLImageElement>(null);
  const bottomImgRef = useRef<HTMLImageElement>(null);
  const activeImgRef = useRef(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // Preload all project & hero images during 2-second black screen buffer
  useEffect(() => {
    const ALL_PRELOAD_IMAGES = [
      ...IMAGES,
      '/image.png',
      '/shapes/shape1.png',
      '/shapes/shape2.png',
      '/shapes/Shape3.png',
      '/shapes/shape4.png',
      '/shapes/shape5.png',
      '/shapes/shape6.png',
    ];

    let isMounted = true;

    const loadPromises = ALL_PRELOAD_IMAGES.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        }
      });
    });

    const bufferTimer = new Promise(resolve => setTimeout(resolve, 2000));

    Promise.all([...loadPromises, bufferTimer]).then(() => {
      if (isMounted) {
        setIsBuffering(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Render identical top/bottom content for gateway clip-path split
  const renderContent = (isTop: boolean) => (
    <div className="preloader-content">
      {/* Images Container */}
      <div className={`preloader-images preloader-images-${isTop ? 'top' : 'bottom'}`}>
        <img
          ref={isTop ? topImgRef : bottomImgRef}
          src={IMAGES[0]}
          className="preloader-img"
          alt=""
        />
      </div>

      {/* Name Reveal */}
      <div className={`preloader-name-container preloader-name-${isTop ? 'top' : 'bottom'}`}>
        {NAME.split('').map((char, i) => (
          <span key={i} className="preloader-char-wrap">
            <span className={`preloader-char preloader-char-anim ${char === '®' ? 'preloader-char-reg' : ''}`}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </div>

      {/* Counter Number */}
      <div className={`preloader-counter preloader-counter-${isTop ? 'top' : 'bottom'}`}>
        00
      </div>
    </div>
  );

  useGSAP(() => {
    if (isBuffering || !wrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        onComplete();
      }
    });

    const topCounter = wrapperRef.current.querySelector('.preloader-counter-top');
    const bottomCounter = wrapperRef.current.querySelector('.preloader-counter-bottom');

    // Counter Object: 0 to 100
    const counterObj = { val: 0 };
    let lastVal = -1;

    tl.to(counterObj, {
      val: 100,
      duration: COUNTER_DURATION,
      ease: "power1.inOut",
      onUpdate: () => {
        const currentVal = Math.floor(counterObj.val);
        if (currentVal !== lastVal) {
          lastVal = currentVal;

          // Update Counter Text (00 to 100)
          const formattedVal = currentVal < 10 ? `0${currentVal}` : currentVal.toString();
          if (topCounter) topCounter.innerHTML = formattedVal;
          if (bottomCounter) bottomCounter.innerHTML = formattedVal;

          // Image change frequency calculation based on IMAGE_STEP_FREQUENCY
          const stepIndex = Math.floor(currentVal / IMAGE_STEP_FREQUENCY);
          const nextImgIdx = stepIndex % IMAGES.length;

          if (nextImgIdx !== activeImgRef.current) {
            activeImgRef.current = nextImgIdx;
            const newSrc = IMAGES[nextImgIdx];
            if (topImgRef.current) topImgRef.current.src = newSrc;
            if (bottomImgRef.current) bottomImgRef.current.src = newSrc;
          }
        }
      }
    }, 0);

    // --- Phase 2: Collapse Counter & Images ---
    tl.to('.preloader-images', {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, ">");

    tl.to('.preloader-counter', {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "<");

    // --- Phase 3: Name Reveal ---
    const topChars = gsap.utils.toArray('.preloader-name-top .preloader-char-anim');
    const bottomChars = gsap.utils.toArray('.preloader-name-bottom .preloader-char-anim');

    tl.to(topChars, {
      y: '0%',
      duration: 0.7,
      stagger: 0.035,
      ease: "expo.out"
    }, "+=0.05");

    tl.to(bottomChars, {
      y: '0%',
      duration: 0.7,
      stagger: 0.035,
      ease: "expo.out"
    }, "<");

    // Hold briefly to read the name
    tl.to({}, { duration: 0.5 });

    // --- Phase 4: Gateway Split ---
    tl.to('.preloader-top', {
      yPercent: -100,
      duration: 1.1,
      ease: "expo.inOut"
    });
    tl.to('.preloader-bottom', {
      yPercent: 100,
      duration: 1.1,
      ease: "expo.inOut"
    }, "<");

  }, { scope: wrapperRef, dependencies: [isBuffering] });

  if (isComplete) return null;

  return (
    <div ref={wrapperRef} className="preloader-wrapper">
      {/* 2-Second Pitch-Black Image Preloading Buffer */}
      {isBuffering && (
        <div className="fixed inset-0 bg-[#000000] z-[999999] flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
        </div>
      )}

      {/* Top Half Slice */}
      <div className="preloader-half preloader-top">
        {renderContent(true)}
      </div>
      {/* Bottom Half Slice */}
      <div className="preloader-half preloader-bottom">
        {renderContent(false)}
      </div>
    </div>
  );
}
