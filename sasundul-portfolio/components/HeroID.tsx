import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PROFILE_IMAGE_URL = "https://avatars.githubusercontent.com/u/158804448?s=400&u=8edbb46c2957de94b2e962060f06cccea207867c&v=4";

const TECH_BADGES = ['React.js', 'Spring Boot', 'Next.js', 'Tailwind CSS', 'Figma'];

// 3D-looking floating shapes with gradients + depth
const FLOATING_SHAPES = [
  { 
    finalX: -320, finalY: -200,  // top-left
    size: 60, shape: 'diamond', delay: 0,
    colors: ['#5BB5FF', '#2A7FD4', '#1A5FA0'],
  },
  { 
    finalX: 300, finalY: -180,  // top-right
    size: 50, shape: 'arrow3d', delay: 0.08,
    colors: ['#C0C0C0', '#808080', '#505050'],
  },
  { 
    finalX: -380, finalY: 20,   // mid-left
    size: 65, shape: 'torus', delay: 0.16,
    colors: ['#FFD700', '#C4A55A', '#8B7340'],
  },
  { 
    finalX: -280, finalY: 180,  // bottom-left
    size: 45, shape: 'cross3d', delay: 0.24,
    colors: ['#B0B0B0', '#808080', '#505050'],
  },
  { 
    finalX: 350, finalY: 50,    // mid-right
    size: 55, shape: 'sphere', delay: 0.32,
    colors: ['#A0A0FF', '#6060C0', '#303080'],
  },
  { 
    finalX: 280, finalY: 200,   // bottom-right  
    size: 55, shape: 'gem3d', delay: 0.40,
    colors: ['#5AE88A', '#3DAF50', '#2A7A38'],
  },
  {
    finalX: -150, finalY: -250, // upper mid-left
    size: 40, shape: 'cube', delay: 0.48,
    colors: ['#FF8080', '#CC4040', '#802020'],
  },
  {
    finalX: 150, finalY: -240,  // upper mid-right
    size: 48, shape: 'pyramid', delay: 0.56,
    colors: ['#FFB060', '#D08030', '#905020'],
  },
  {
    finalX: -50, finalY: 260,   // bottom center-left
    size: 42, shape: 'octahedron', delay: 0.64,
    colors: ['#80D0FF', '#4090C0', '#206080'],
  },
  {
    finalX: 80, finalY: 240,    // bottom center-right
    size: 50, shape: 'ring', delay: 0.72,
    colors: ['#D080FF', '#9040C0', '#602080'],
  },
];

// 3D SVG shapes with gradients for depth illusion
function FloatingShape3D({ shape, colors, size }: { shape: string; colors: string[]; size: number }) {
  const id = `grad-${shape}-${colors[0].replace('#', '')}`;
  
  if (shape === 'diamond') return (
    <svg viewBox="0 0 60 60" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      {/* Back face */}
      <polygon points="30,4 56,30 30,56 4,30" fill={colors[2]} opacity="0.5" />
      {/* Front face with gradient */}
      <polygon points="30,8 50,30 30,52 10,30" fill={`url(#${id})`} />
      {/* Highlight edge */}
      <polygon points="30,8 50,30 30,30" fill="white" opacity="0.15" />
      {/* Specular */}
      <ellipse cx="25" cy="22" rx="6" ry="4" fill="white" opacity="0.2" transform="rotate(-15 25 22)" />
    </svg>
  );

  if (shape === 'arrow3d') return (
    <svg viewBox="0 0 50 50" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      {/* 3D arrow body */}
      <polygon points="10,40 40,10 40,22 28,22 28,40" fill={`url(#${id})`} />
      <polygon points="40,10 40,22 28,22" fill="white" opacity="0.2" />
      {/* Shadow face */}
      <polygon points="10,40 12,42 30,42 28,40" fill={colors[2]} opacity="0.6" />
    </svg>
  );

  if (shape === 'torus') return (
    <svg viewBox="0 0 60 60" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))' }}>
      <defs>
        <radialGradient id={id} cx="40%" cy="35%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="60%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="30" cy="30" r="25" fill={`url(#${id})`} />
      {/* Inner hole - use bg-matching color */}
      <circle cx="30" cy="30" r="12" fill="var(--bg)" />
      {/* Specular highlight */}
      <ellipse cx="22" cy="22" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-25 22 22)" />
      {/* Inner shadow */}
      <circle cx="30" cy="30" r="12" fill="none" stroke={colors[2]} strokeWidth="2" opacity="0.3" />
    </svg>
  );

  if (shape === 'cross3d') return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* Vertical bar */}
      <rect x="14" y="2" width="12" height="36" rx="3" fill={`url(#${id})`} />
      {/* Horizontal bar */}
      <rect x="2" y="14" width="36" height="12" rx="3" fill={`url(#${id})`} />
      {/* Highlights */}
      <rect x="14" y="2" width="5" height="36" rx="3" fill="white" opacity="0.12" />
      <rect x="2" y="14" width="36" height="5" rx="3" fill="white" opacity="0.08" />
    </svg>
  );

  if (shape === 'sphere') return (
    <svg viewBox="0 0 50 50" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.4))' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </radialGradient>
      </defs>
      <circle cx="25" cy="25" r="22" fill={`url(#${id})`} />
      {/* Specular highlight */}
      <ellipse cx="18" cy="17" rx="7" ry="5" fill="white" opacity="0.3" transform="rotate(-20 18 17)" />
      {/* Rim light */}
      <path d="M 8 35 A 22 22 0 0 0 42 35" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
    </svg>
  );

  if (shape === 'gem3d') return (
    <svg viewBox="0 0 50 55" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 5px 14px rgba(0,0,0,0.35))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* Top crown */}
      <polygon points="25,2 45,18 5,18" fill={colors[0]} />
      <polygon points="25,2 45,18 25,18" fill="white" opacity="0.15" />
      {/* Bottom pavilion */}
      <polygon points="5,18 45,18 25,52" fill={`url(#${id})`} />
      {/* Left face */}
      <polygon points="5,18 25,52 25,18" fill={colors[2]} opacity="0.4" />
      {/* Center highlight line */}
      <line x1="25" y1="2" x2="25" y2="52" stroke="white" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );

  if (shape === 'cube') return (
    <svg viewBox="0 0 50 50" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* Top face */}
      <polygon points="25,5 45,15 25,25 5,15" fill={colors[0]} />
      <polygon points="25,5 45,15 25,25 5,15" fill="white" opacity="0.15" />
      {/* Right face */}
      <polygon points="45,15 45,35 25,45 25,25" fill={`url(#${id})`} />
      {/* Left face (darker) */}
      <polygon points="5,15 25,25 25,45 5,35" fill={colors[2]} />
    </svg>
  );

  if (shape === 'pyramid') return (
    <svg viewBox="0 0 50 55" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}>
      <defs>
        <linearGradient id={id} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* Front left face */}
      <polygon points="25,3 5,45 25,50" fill={`url(#${id})`} />
      {/* Front right face (lighter) */}
      <polygon points="25,3 45,45 25,50" fill={colors[0]} opacity="0.8" />
      <polygon points="25,3 45,45 25,50" fill="white" opacity="0.1" />
      {/* Base */}
      <polygon points="5,45 45,45 25,50" fill={colors[2]} opacity="0.6" />
    </svg>
  );

  if (shape === 'octahedron') return (
    <svg viewBox="0 0 50 50" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      {/* Top faces */}
      <polygon points="25,3 45,25 25,25" fill={colors[0]} />
      <polygon points="25,3 5,25 25,25" fill={`url(#${id})`} />
      {/* Bottom faces */}
      <polygon points="25,47 45,25 25,25" fill={colors[1]} opacity="0.8" />
      <polygon points="25,47 5,25 25,25" fill={colors[2]} opacity="0.9" />
      {/* Highlight */}
      <polygon points="25,3 45,25 25,25" fill="white" opacity="0.12" />
    </svg>
  );

  // ring
  return (
    <svg viewBox="0 0 50 50" fill="none" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      {/* 3D ring with perspective */}
      <ellipse cx="25" cy="25" rx="22" ry="10" fill="none" stroke={`url(#${id})`} strokeWidth="5" />
      {/* Top arc highlight */}
      <path d="M 5 25 A 22 10 0 0 1 45 25" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}

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

    const shapes = gsap.utils.toArray<HTMLElement>('.hero-float-icon');

    shapes.forEach((el, i) => {
      const data = FLOATING_SHAPES[i];
      if (!data) return;

      // Burst out from center with stagger
      gsap.to(el, {
        x: data.finalX,
        y: data.finalY,
        scale: 1,
        opacity: 1,
        rotation: gsap.utils.random(-15, 15),
        duration: 1.4,
        delay: data.delay,
        ease: 'back.out(1.4)',
        onComplete: () => {
          // Start continuous floating motion after arriving
          gsap.to(el, {
            x: `+=${gsap.utils.random(-60, 60)}`,
            y: `+=${gsap.utils.random(-40, 40)}`,
            rotation: `+=${gsap.utils.random(-20, 20)}`,
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
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
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating 3D shapes — positioned at center, hidden until card hover */}
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
          <FloatingShape3D colors={shape.colors} shape={shape.shape} size={shape.size} />
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

