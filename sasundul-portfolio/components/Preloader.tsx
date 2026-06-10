import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './Preloader.css';

const IMAGES = [
  '/Art-Gallery-01.jpeg',
  '/Lumina-1.jpeg',
  '/NexMart -1.png',
  '/E-channeling-System-1.jpeg',
  '/Vap-Construction-1.jpeg',
];

const NAME = "CODE BY SASUNDUL®";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Render the exact same content twice. The CSS clip-path on the parent halves
  // will slice the content perfectly down the middle.
  const renderContent = (isTop: boolean) => (
    <div className="preloader-content">
      {/* Phase 1 & 2: Flash Images */}
      <div className={`preloader-images preloader-images-${isTop ? 'top' : 'bottom'}`}>
        {IMAGES.map((src, i) => (
          <img key={i} src={src} className="preloader-img" alt="" />
        ))}
      </div>

      {/* Phase 3: Name Reveal */}
      <div className={`preloader-name-container preloader-name-${isTop ? 'top' : 'bottom'}`}>
        {NAME.split('').map((char, i) => (
          <span key={i} className="preloader-char-wrap">
            <span className={`preloader-char preloader-char-anim ${char === '®' ? 'preloader-char-reg' : ''}`}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </div>

      {/* Phase 1 & 2: Counter */}
      <div className={`preloader-counter preloader-counter-${isTop ? 'top' : 'bottom'}`}>
        0
      </div>
    </div>
  );

  useGSAP(() => {
    if (!wrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        onComplete();
      }
    });

    const topImages = gsap.utils.toArray<HTMLElement>('.preloader-images-top .preloader-img');
    const bottomImages = gsap.utils.toArray<HTMLElement>('.preloader-images-bottom .preloader-img');
    const topCounter = wrapperRef.current.querySelector('.preloader-counter-top');
    const bottomCounter = wrapperRef.current.querySelector('.preloader-counter-bottom');

    // --- Phase 1: Cinematic Zoom-Fade Sequence ---
    const inDuration = 0.8;
    const stayTime = 0.2; // brief moment fully visible before the next crossfade starts
    const stepTime = inDuration + stayTime;
    const outDuration = 0.8; 
    const totalImageTime = (IMAGES.length - 1) * stepTime + inDuration;

    // Set initial state for all images
    gsap.set([...topImages, ...bottomImages], { opacity: 0, scale: 0.85 });

    IMAGES.forEach((_, i) => {
      const startTime = i * stepTime;

      // Incoming Image: fade in and scale up to 1
      tl.to([topImages[i], bottomImages[i]], {
        opacity: 1,
        scale: 1,
        duration: inDuration,
        ease: "power2.out"
      }, startTime);

      // Outgoing Image: fade out and continue scaling up to 1.1
      // (This starts exactly when the next image starts fading in)
      if (i < IMAGES.length - 1) {
        tl.to([topImages[i], bottomImages[i]], {
          opacity: 0,
          scale: 1.1,
          duration: outDuration,
          ease: "power2.out"
        }, startTime + stepTime);
      }
    });

    // Smooth Counter (matches the exact duration of the image sequence)
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: totalImageTime + 0.2, // matched to images
      ease: "power2.inOut",
      onUpdate: () => {
        const currentVal = Math.floor(counterObj.val);
        if (topCounter) topCounter.innerHTML = currentVal.toString();
        if (bottomCounter) bottomCounter.innerHTML = currentVal.toString();
      }
    }, 0); // start exactly at timeline 0

    // --- Phase 2: The Elegant Collapse ---
    tl.to('.preloader-images', {
      scale: 0,
      opacity: 0,
      duration: 1.2, // much gentler, deliberate collapse
      ease: "expo.inOut"
    }, ">"); // starts after counter reaches 100

    tl.to('.preloader-counter', {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "<"); // animate simultaneously with images

    // --- Phase 3: The Name Reveal ---
    const topChars = gsap.utils.toArray('.preloader-name-top .preloader-char-anim');
    const bottomChars = gsap.utils.toArray('.preloader-name-bottom .preloader-char-anim');

    // Both halves need identical staggers to stay in sync
    tl.to(topChars, {
      y: '0%',
      duration: 0.8,
      stagger: 0.04,
      ease: "expo.out"
    }, "+=0.1"); // slight delay after collapse

    tl.to(bottomChars, {
      y: '0%',
      duration: 0.8,
      stagger: 0.04,
      ease: "expo.out"
    }, "<");

    // Hold briefly to let the user read the name
    tl.to({}, { duration: 0.6 });

    // --- Phase 4: The Gateway Split ---
    tl.to('.preloader-top', {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut"
    });
    tl.to('.preloader-bottom', {
      yPercent: 100,
      duration: 1.2,
      ease: "expo.inOut"
    }, "<");

  }, { scope: wrapperRef });

  if (isComplete) return null;

  return (
    <div ref={wrapperRef} className="preloader-wrapper">
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
