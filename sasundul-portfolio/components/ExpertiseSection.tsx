import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXPERTISE = [
  {
    number: '01',
    title: 'Design',
    description: 'Crafting clean, thoughtful layouts that balance aesthetics and usability. Creating visual harmony, clear hierarchy, and engaging compositions that bring ideas to life.',
    tags: ['Figma', 'UI/UX'],
  },
  {
    number: '02',
    title: 'Development',
    description: 'Building fast, responsive, and maintainable web applications using modern technologies. From concept to deployment, ensuring every line of code contributes to performance and precision.',
    tags: ['React', 'Next.js', 'Spring Boot', 'Tailwind CSS'],
  },
  {
    number: '03',
    title: 'Interactions',
    description: 'Transforming static designs into dynamic experiences through motion and animation. Creating interactions that feel natural, intuitive, and memorable using GSAP and modern animation tools.',
    tags: ['GSAP', 'Framer Motion', 'CSS Animations'],
  },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Staggered entrance for expertise items
    gsap.fromTo('.expertise-item-anim', {
      y: 60,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
      }
    });

    // Heading reveal
    gsap.fromTo('.expertise-heading', {
      y: 40,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6 md:px-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left - Sticky */}
          <div className="md:sticky md:top-32 md:self-start">
            <h2 className="expertise-heading text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter" style={{ color: 'var(--text)' }}>
              Expertise
            </h2>
            <div className="h-4" />
            <p className="expertise-heading text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              A focused approach to design, development, and interaction  bringing ideas to life through thoughtful visuals, clean code, and meaningful motion.
            </p>
          </div>

          {/* Right - Scrolling expertise items */}
          <div className="flex flex-col gap-6 md:gap-8">
            {EXPERTISE.map((item, idx) => (
              <div key={idx} className="expertise__item expertise-item-anim bg-[#0a0a0a] text-[#f1f1f1] rounded-xl p-8 md:p-10 shadow-lg">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-sm font-mono uppercase tracking-widest text-white/50">
                      {item.number}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight mt-2 text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-white/70">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono uppercase tracking-widest px-3 py-1 text-white/50 border border-white/10 rounded-sm">
                        [ {tag} ]
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
