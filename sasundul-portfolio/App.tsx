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
import CvModal from './components/CvModal';
import SocialDock from './components/SocialDock';

gsap.registerPlugin(ScrollTrigger);

// ========================= PROJECT DATA =========================
export const PROJECTS = [
  {
    id: 3,
    title: "ZÉRIN.LK",
    category: "E-COMMERCE • BEAUTY",
    tech: "Next.js 16 • React 19 • TypeScript • Tailwind CSS",
    image: "/Zerin.png",
    year: "2025",
  },
  {
    id: 2,
    title: "VAP CONSTRUCTION",
    category: "CONSTRUCTION PORTFOILIO",
    tech: "React.js • Tailwind CSS • Vite",
    image: "/Vap-Construction.png",
    year: "2025",
  },
  {
    id: 1,
    title: "FLOODNAV",
    category: "DISASTER RESPONSE",
    tech: "React • TypeScript • Spring Boot",
    image: "/FloodNav.png",
    year: "2025",
  },
  {
    id: 4,
    title: "LANDSLIDE ALERT",
    category: "EARLY WARNING SYSTEM",
    tech: "HTML • C++ • IoT Sensors",
    image: "/LandSlideAlert.png",
    year: "2025",
  },
  {
    id: 5,
    title: "FLEET TRACKING",
    category: "LOGISTICS & TELEMATICS",
    tech: "React • Node.js • Google Maps API",
    image: "/FleetTracking.png",
    year: "2025",
  },
  {
    id: 6,
    title: "LUNARWAY TRAVELS",
    category: "TRAVEL & TOURISM",
    tech: "React • Tailwind CSS • Node.js",
    image: "/LunarwayTravels.png",
    year: "2025",
  },
  {
    id: 7,
    title: "MEDCONNECT",
    category: "HEALTHCARE PLATFORM",
    tech: "React • Spring Boot • MySQL",
    image: "/E-Channeling-System.png",
    year: "2025",
  },
  {
    id: 8,
    title: "PIZZAMANIA",
    category: "MOBILE APP",
    tech: "Java • SQLite • Firebase",
    image: "/Pizza-Mania.png",
    year: "2025",
  },
  {
    id: 9,
    title: "NATO MINI MART",
    category: "POS & RETAIL SYSTEM",
    tech: "React • Express • MongoDB",
    image: "/NatoMiniMart.png",
    year: "2024",
  },
  {
    id: 10,
    title: "LUMINA",
    category: "AUTOMOTIVE",
    tech: "Vue.js • Tailwind • Framer Motion",
    image: "/Lumina.png",
    year: "2025",
  },
  {
    id: 11,
    title: "ART GALLERY",
    category: "ART WORK PORTFOLIO",
    tech: "React • TypeScript ",
    image: "/Art-Gallery-01.jpeg",
    year: "2026",
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
    // Force preloader to always play for now so you can see the new animation
    // const played = sessionStorage.getItem('preloaderPlayed');
    // if (!played) {
    setShowPreloader(true);
    setPreloaderDone(false);
    // }
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
    sessionStorage.setItem('preloaderPlayed', 'true');
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

      {/* Floating Left Social Dock */}
      <SocialDock onContactClick={() => setShowContact(true)} />

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
      <CvModal />
    </ReactLenis>
  );
}
