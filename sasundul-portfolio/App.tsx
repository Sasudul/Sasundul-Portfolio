import { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import HeroID from './components/HeroID';
import AboutSection from './components/AboutSection';
import HorizontalScroll from './components/HorizontalScroll';
import ExpertiseSection from './components/ExpertiseSection';
import WorkShowcase from './components/WorkShowcase';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ContactForm from './components/ContactForm';

gsap.registerPlugin(ScrollTrigger);

// ========================= PROJECT DATA =========================
export const PROJECTS = [
  {
    id: 1,
    title: "FLOODNAV",
    category: "DISASTER RESPONSE",
    tech: "React • TypeScript • Spring Boot",
    image: "/FloodNav-1.png",
    year: "2025",
  },
  {
    id: 2,
    title: "VAP CONSTRUCTION",
    category: "PORTFOLIO",
    tech: "React.js • Tailwind CSS",
    image: "/Vap-Construction-1.jpeg",
    year: "2025",
  },
  {
    id: 3,
    title: "BUDGETLY",
    category: "PERSONAL FINANCE",
    tech: "Expense Tracking • Budgeting",
    image: "/Budgetly-1.jpeg",
    year: "2024",
  },
  {
    id: 4,
    title: "PIZZAMANIA",
    category: "MOBILE APP",
    tech: "Java • SQLite • Firebase",
    image: "/Pizza-Mania-1.jpeg",
    year: "2024",
  },
  {
    id: 5,
    title: "MEDCONNECT",
    category: "HEALTHCARE",
    tech: "React • Spring Boot • MySQL",
    image: "/E-channeling-System-1.jpeg",
    year: "2024",
  },
  {
    id: 6,
    title: "LUMINA",
    category: "AUTOMOTIVE",
    tech: "Vue.js • Tailwind • Framer Motion",
    image: "/Lumina-1.jpeg",
    year: "2024",
  },
  {
    id: 7,
    title: "NEXMART",
    category: "SALES MANAGEMENT",
    tech: "Java Swing • MySQL",
    image: "/NexMart -1.png",
    year: "2023",
  },
  {
    id: 8,
    title: "HOTELX",
    category: "HOSPITALITY",
    tech: "Java Swing • MySQL",
    image: "/Art-Gallery-01.jpeg",
    year: "2023",
  }
];

// ========================= APP =========================
export default function App() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showContact, setShowContact] = useState(false);

  // Check if preloader needs to play
  useEffect(() => {
    const played = sessionStorage.getItem('preloaderPlayed');
    if (!played) {
      setShowPreloader(true);
      setPreloaderDone(false);
    }
  }, []);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
    // Small delay before removing preloader from DOM
    setTimeout(() => setShowPreloader(false), 100);
    ScrollTrigger.refresh();
  };

  const handleNavigate = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {/* Preloader */}
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation
        isOpen={navOpen}
        onToggle={() => setNavOpen(!navOpen)}
        theme={theme}
        onThemeToggle={toggleTheme}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      {preloaderDone && (
        <main>
          <HeroID />
          <AboutSection />
          <HorizontalScroll />
          <ExpertiseSection />
          <WorkShowcase
            projects={PROJECTS}
            onProjectClick={(p) => setSelectedProject(p)}
          />
          <Footer onContactClick={() => setShowContact(true)} />
        </main>
      )}

      {/* Overlays */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {showContact && (
        <ContactForm onClose={() => setShowContact(false)} />
      )}
    </ReactLenis>
  );
}
