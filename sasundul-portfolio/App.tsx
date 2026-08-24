import { useState, useEffect, lazy, Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import HeroID from './components/HeroID';
import AboutSection from './components/AboutSection';
import HorizontalScroll from './components/HorizontalScroll';
import ExpertiseSection from './components/ExpertiseSection';
import WorkShowcase from './components/WorkShowcase';
import Footer from './components/Footer';
import SocialDock from './components/SocialDock';

// Lazy-load heavy overlays & preloader — zero impact on initial page bundle
const Preloader = lazy(() => import('./components/Preloader'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const CvModal = lazy(() => import('./components/CvModal'));
const AiChatbot = lazy(() => import('./components/AiChatbot'));

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: number;
  title: string;
  category: string;
  tech: string;
  image: string;
  year?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  description?: string;
}

// ========================= PROJECT DATA =========================
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "FLOODNAV",
    category: "DISASTER RESPONSE",
    tech: "React • TypeScript • Spring Boot",
    image: "/FloodNav.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "An AI-assisted disaster response routing system engineered to optimize emergency rescue navigation during flood events. Features real-time route mapping, hazard alerts, and multi-agency coordination."
  },
  {
    id: 2,
    title: "VAP CONSTRUCTION",
    category: "CONSTRUCTION PORTFOLIO",
    tech: "React.js • Tailwind CSS • Vite",
    image: "/Vap-Construction.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "A high-impact web presence for a premier construction enterprise. Built with modern micro-animations, interactive project showcases, structural engineering case studies, and responsive design."
  },
  {
    id: 3,
    title: "ZÉRIN.LK",
    category: "E-COMMERCE • BEAUTY",
    tech: "Next.js 16 • React 19 • TypeScript • Tailwind CSS",
    image: "/Zerin.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "A luxury e-commerce platform designed for premium cosmetics and skincare products. Features dynamic product filtering, seamless checkout, and high-performance server-side rendering."
  },
  {
    id: 4,
    title: "LANDSLIDE ALERT",
    category: "EARLY WARNING SYSTEM",
    tech: "HTML • C++ • IoT Sensors",
    image: "/LandSlideAlert.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "An integrated IoT early-warning system for monitoring soil displacement and moisture levels in landslide-prone regions, broadcasting instant emergency telemetry."
  },
  {
    id: 5,
    title: "FLEET TRACKING",
    category: "LOGISTICS & TELEMATICS",
    tech: "React • Node.js • Google Maps API",
    image: "/FleetTracking.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "A real-time telematics dashboard providing fleet managers live GPS tracking, route optimization, vehicle diagnostics, and driver performance analytics."
  },
  {
    id: 6,
    title: "LUNARWAY TRAVELS",
    category: "TRAVEL & TOURISM",
    tech: "React • Tailwind CSS • Node.js",
    image: "/LunarwayTravels.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "An immersive travel booking platform highlighting bespoke tour itineraries, interactive destination maps, and automated reservation management."
  },
  {
    id: 7,
    title: "MEDCONNECT",
    category: "HEALTHCARE PLATFORM",
    tech: "React • Spring Boot • MySQL",
    image: "/E-Channeling-System.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "A digital e-channeling and medical appointment platform connecting patients with specialist doctors across regional hospitals."
  },
  {
    id: 8,
    title: "PIZZAMANIA",
    category: "MOBILE APP",
    tech: "Java • SQLite • Firebase",
    image: "/Pizza-Mania.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "A full-featured mobile food ordering application with custom topping configuration, real-time order status tracking, and location-based delivery dispatch."
  },
  {
    id: 9,
    title: "NATO MINI MART",
    category: "POS & RETAIL SYSTEM",
    tech: "React • Express • MongoDB",
    image: "/NatoMiniMart.png",
    year: "2024",
    liveUrl: null,
    githubUrl: null,
    description: "A point-of-sale and inventory management software solution for retail stores, offering barcoding, stock auditing, and daily revenue reporting."
  },
  {
    id: 10,
    title: "LUMINA",
    category: "AUTOMOTIVE",
    tech: "Vue.js • Tailwind • Framer Motion",
    image: "/Lumina.png",
    year: "2025",
    liveUrl: null,
    githubUrl: null,
    description: "An interactive automotive showcase highlighting electric vehicle specifications, 3D configurator views, and futuristic design aesthetics."
  },
  {
    id: 11,
    title: "ART GALLERY",
    category: "ART WORK PORTFOLIO",
    tech: "React • TypeScript",
    image: "/Art-Gallery-01.jpeg",
    year: "2026",
    liveUrl: null,
    githubUrl: null,
    description: "A minimalist digital art gallery curated for showcasing high-resolution artwork, exhibitions, and limited-edition prints."
  }
];

// ========================= APP =========================
export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showContact, setShowContact] = useState(false);

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
    setTimeout(() => setShowPreloader(false), 50);
    ScrollTrigger.refresh();
  };

  const handleNavigate = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {/* Preloader - Only plays once per session */}
      {showPreloader && (
        <Suspense fallback={null}>
          <Preloader onComplete={handlePreloaderComplete} />
        </Suspense>
      )}

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

      {/* Overlays Lazy Loaded */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        {showContact && (
          <ContactForm onClose={() => setShowContact(false)} />
        )}
        <CvModal />
        <AiChatbot />
      </Suspense>
    </ReactLenis>
  );
}
