import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Word-by-word reveal
    const words = gsap.utils.toArray<HTMLElement>('.about-word');
    gsap.fromTo(words, {
      opacity: 0.15,
    }, {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 1,
      }
    });
  }, { scope: sectionRef });

  const text = "Creates impactful digital experiences through design and full-stack development, evolving from a foundation in design into specialized React, Spring Boot, and modern frontend solutions that transform wireframes into refined, performance-driven experiences.";

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-3xl lg:text-4xl font-sans font-medium leading-relaxed tracking-tight" style={{ color: 'var(--text)' }}>
          {text.split(' ').map((word, i) => (
            <span key={i} className="about-word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
