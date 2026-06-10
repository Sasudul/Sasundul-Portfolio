import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PROFILE_IMAGE_URL = "https://avatars.githubusercontent.com/u/158804448?s=400&u=8edbb46c2957de94b2e962060f06cccea207867c&v=4";

const TECH_BADGES = ['React.js', 'Spring Boot', 'Next.js', 'Tailwind CSS', 'Figma'];

// 6 image shapes — positioned: shape1 top-left → shape6 bottom-right
const FLOATING_SHAPES = [
  { src: '/shapes/shape1.png', finalX: -350, finalY: -220, size: 140, delay: 0 },
  { src: '/shapes/shape2.png', finalX: 320, finalY: -200, size: 120, delay: 0.08 },
  { src: '/shapes/Shape3.png', finalX: -380, finalY: 40, size: 110, delay: 0.16 },
  { src: '/shapes/shape4.png', finalX: 360, finalY: 50, size: 120, delay: 0.24 },
  { src: '/shapes/shape5.png', finalX: -300, finalY: 220, size: 110, delay: 0.32 },
  { src: '/shapes/shape6.png', finalX: 300, finalY: 230, size: 140, delay: 0.40 },
];

// Barcode generator
function Barcode() {
  const bars = [];
  for (let i = 0; i < 40; i++) {
    const w = Math.random() > 0.5 ? 3 : 2;
    const h = 24 + Math.random() * 12;
    bars.push(<span key={i} className="id-card__barcode-bar" style={{ width: w, height: h }} />);
  }
  return <div className="flex gap-[1px] justify-center">{bars}</div>;
}

export default function HeroID() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shapesReleasedRef = useRef(false);
  const floatingTweensRef = useRef<gsap.core.Tween[]>([]);

  useGSAP(() => {
    // Card entrance
    gsap.from(cardRef.current, {
      y: 80,
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.2,
    });

    // Continuous card float
    gsap.to(cardRef.current, {
      y: -10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Initialize all shapes: hidden at center of card
    gsap.set('.hero-float-icon', {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotation: 0,
    });
  }, { scope: sectionRef });

  const releaseShapes = useCallback(() => {
    if (shapesReleasedRef.current) return;
    shapesReleasedRef.current = true;

    // Kill any retract tweens that might be running
    floatingTweensRef.current.forEach(t => t.kill());
    floatingTweensRef.current = [];

    const shapes = gsap.utils.toArray<HTMLElement>('.hero-float-icon');

    shapes.forEach((el, i) => {
      const data = FLOATING_SHAPES[i];
      if (!data) return;

      // Random offset so they don't all go to the exact same spot
      const randomOffsetX = gsap.utils.random(-40, 40);
      const randomOffsetY = gsap.utils.random(-30, 30);

      // Burst out from center with stagger
      gsap.to(el, {
        x: data.finalX + randomOffsetX,
        y: data.finalY + randomOffsetY,
        scale: 1,
        opacity: 1,
        rotation: gsap.utils.random(-25, 25),
        duration: 1.2,
        delay: data.delay,
        ease: 'back.out(1.2)',
        onComplete: () => {
          // Start continuous bouncing / floating motion
          const floatX = gsap.to(el, {
            x: `+=${gsap.utils.random(-80, 80)}`,
            y: `+=${gsap.utils.random(-60, 60)}`,
            rotation: `+=${gsap.utils.random(-30, 30)}`,
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
          floatingTweensRef.current.push(floatX);
        }
      });
    });
  }, []);

  const retractShapes = useCallback(() => {
    if (!shapesReleasedRef.current) return;
    shapesReleasedRef.current = false;

    // Kill all floating tweens
    floatingTweensRef.current.forEach(t => t.kill());
    floatingTweensRef.current = [];

    const shapes = gsap.utils.toArray<HTMLElement>('.hero-float-icon');

    shapes.forEach((el, i) => {
      const data = FLOATING_SHAPES[i];
      if (!data) return;

      // Smoothly retract back to center (behind the card)
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotation: 0,
        duration: 0.8,
        delay: i * 0.04,
        ease: 'power3.in',
      });
    });
  }, []);

  // Mouse parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      x: xPos * 30,
      y: -10 + yPos * 20,
      rotateY: xPos * 8,
      rotateX: -yPos * 8,
      duration: 1,
      ease: 'power3.out',
      transformPerspective: 1200,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      x: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    });

    // Retract shapes when cursor leaves the hero section
    retractShapes();
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating image shapes — positioned at center, hidden until card hover */}
      {FLOATING_SHAPES.map((shape, i) => (
        <div
          key={i}
          className="hero-float-icon"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 5,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        >
          <img
            src={shape.src}
            alt=""
            width={shape.size}
            height={shape.size}
            style={{
              width: shape.size,
              height: shape.size,
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
            }}
          />
        </div>
      ))}

      {/* ID Card */}
      <div
        ref={cardRef}
        className="id-card relative z-10"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseEnter={releaseShapes}
      >
        {/* Notch */}
        <div className="id-card__notch" />

        {/* Photo */}
        <div className="id-card__photo-frame">
          <img
            src={PROFILE_IMAGE_URL}
            alt="Sasundul Wanasinghe"
            className="w-full h-full object-cover"
          />
          {/* HELLO sticker */}
          <div className="absolute bottom-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest shadow-md -rotate-3">
            HELLO
          </div>
        </div>

        {/* Name */}
        <h2 className="id-card__title text-2xl font-display font-bold uppercase tracking-tight mt-2">
          Sasundul Wanasinghe
        </h2>
        <p className="id-card__subtitle text-xs font-mono uppercase tracking-widest mt-1">
          [ Designer / Developer ]
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {TECH_BADGES.map(tech => (
            <span key={tech} className="id-card__badge text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border">
              {tech}
            </span>
          ))}
        </div>

        {/* Dashed separator */}
        <div className="id-card__separator border-t border-dashed mt-4 pt-3">
          <Barcode />
        </div>

        {/* Footer */}
        <div className="id-card__footer flex justify-between items-center mt-3 text-[9px] font-mono uppercase tracking-widest">
          <span>CODE BY SASUNDUL©</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}
