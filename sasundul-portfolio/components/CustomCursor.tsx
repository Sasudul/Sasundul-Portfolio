import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const xTo = gsap.quickTo(dotRef.current, 'x', { duration: 0.15, ease: 'power3' });
    const yTo = gsap.quickTo(dotRef.current, 'y', { duration: 0.15, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const interactiveSelector = 'a, button, [role="button"], .cursor-pointer, input, textarea, .work__thumbnail';

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest(interactiveSelector)) {
        gsap.to(dotRef.current, { scale: 3, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest(interactiveSelector)) {
        gsap.to(dotRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="custom-cursor fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      style={{ background: 'var(--text)' }}
    />
  );
}
