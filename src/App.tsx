import { useState, useEffect, useRef } from "react";
import { PROJECTS, ARCHITECT_PROFILE } from "./data/portfolioData";
import { Project } from "./types";
import ThreeBackground from "./components/ThreeBackground";
import Navigation from "./components/Navigation";
import InteractiveCard from "./components/InteractiveCard";
import ProjectDetailsModal from "./components/ProjectDetailsModal";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import { ChevronDown, Database, Cpu, LayoutGrid, Layers, ArrowRight, CornerDownRight } from "lucide-react";
import { gsap } from "gsap";

export default function App() {
  const [selectedSection, setSelectedSection] = useState<string>("hero");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const root = document.getElementById("main-portfolio-root");
    if (root) {
      if (theme === "light") {
        root.classList.add("light");
        document.documentElement.classList.add("light");
      } else {
        root.classList.remove("light");
        document.documentElement.classList.remove("light");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Mouse Follower Orb State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });

  // GSAP animations on initial mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("#main-nav-bar", 
        { y: -100, opacity: 0 },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          ease: "power3.out"
        }
      );
      gsap.fromTo("#hero-explore-button",
        { y: 40, opacity: 0 },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          ease: "power3.out",
          delay: 0.6
        }
      );
      gsap.fromTo("#hero-schedule-button",
        { y: 40, opacity: 0 },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          ease: "power3.out",
          delay: 0.8
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // 1. Mouse Follower Effect with lag-inertia
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentXRef = useRef(window.innerWidth / 2);
  const currentYRef = useRef(window.innerHeight / 2);
  const initializedRef = useRef(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (!initializedRef.current) {
        currentXRef.current = e.clientX;
        currentYRef.current = e.clientY;
        initializedRef.current = true;
      }
    };

    window.addEventListener("mousemove", handleMouse);

    // Follower inertia lag loop using frame-request
    let animFrame: number;

    const followLoop = () => {
      // Interpolate dotPos coordinates towards cursor positions with 12% factor
      currentXRef.current += (mouseRef.current.x - currentXRef.current) * 0.12;
      currentYRef.current += (mouseRef.current.y - currentYRef.current) * 0.12;
      setDotPos({ x: currentXRef.current, y: currentYRef.current });
      animFrame = requestAnimationFrame(followLoop);
    };
    animFrame = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 2. Intersection Observer to track scroll positions and light active nav nodes
  useEffect(() => {
    const sections = ["hero", "projects", "about", "consultation", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // triggers when section dominates middle of viewport
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelectedSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Jump to specific element
  const navigateToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setSelectedSection(sectionId);
    }
  };

  // Filter projects list
  const filteredProjects = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  const filterCategories = ["All", "Architecture", "3D Modeling", "Parametric"];

  return (
    <div className="relative min-h-screen bg-[#050505] text-zinc-100 selection:bg-white/20 selection:text-white" id="main-portfolio-root">
      
      {/* 4. MOUSE FOLLOWER (Differential inversion orb for luxury look) */}
      <div 
        className="hidden md:block cursor-follower" 
        style={{ left: `${dotPos.x}px`, top: `${dotPos.y}px` }} 
      />
      <div 
        className="hidden md:block cursor-follower-dot" 
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} 
      />

      {/* 5. IMMERSIVE GL CANVAS BACKGROUND (Three.js wireframe spatial elements) */}
      <ThreeBackground />

      {/* 6. STATIC BLUEPRINT FRAME */}
      <div className="absolute inset-0 sleek-grid opacity-[0.03] pointer-events-none z-0" />

      {/* 7. SCROLL NAVIGATION HEADER */}
      <Navigation currentSection={selectedSection} onNavigate={navigateToSection} theme={theme} onToggleTheme={toggleTheme} />

      {/* ==================== 00 / INDEX SECTION ==================== */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center px-6 md:px-12 pt-28 pb-16 overflow-hidden"
      >
        {/* Real-time background imagery mask */}
        <div id="hero-imagery-mask" className="absolute inset-0 w-full h-full z-0 overflow-hidden opacity-50">
          <img
            src="/assets/images/hero_structure_1782226835498.jpg"
            alt="Minimalist Twilight Brutalist Structure"
            className="w-full h-full object-cover scale-105 filter blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/70 to-[#050505]" />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Main big statement */}
          <div className="lg:col-span-8 flex flex-col gap-6 items-start">
            
            <div className="flex items-center gap-2 px-3.5 py-1 bg-white/[0.02] border border-white/10 rounded-none text-[10px] font-mono tracking-widest text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>ADDIS EXPERIMENTAL ARCHITECTURE LAB</span>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
                SPEC ARCHIVE // BY {ARCHITECT_PROFILE.name.toUpperCase()}
              </span>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7.5xl font-extrabold text-white tracking-tight leading-[0.95] mt-2">
                ALGORITHMIC <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-450 via-white to-zinc-550">
                  MATERIALITY
                </span>
              </h1>
            </div>

            <p className="font-sans text-lg md:text-xl text-white/60 max-w-xl font-light leading-relaxed">
              {ARCHITECT_PROFILE.tagline} Shaping concrete masses and carbon envelopes with digital generative solvers.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 font-mono text-xs">
              <button
                onClick={() => navigateToSection("projects")}
                id="hero-explore-button"
                className="px-8 py-4 rounded-none bg-zinc-900 border border-white/20 text-white hover:bg-white hover:text-black hover:border-white font-mono tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
              >
                <span>EXPLORE ARCHIVE [01]</span>
                <ArrowRight className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateToSection("consultation")}
                id="hero-schedule-button"
                className="px-8 py-4 rounded-none bg-black border border-white/10 text-white/60 hover:text-white hover:border-white/30 tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>BOOK BRIEF SESSION [03]</span>
              </button>
            </div>
            
          </div>

          {/* Core Spec Readout sidebar */}
          <div className="lg:col-span-4 bg-black/40 border border-white/5 rounded-none p-6 relative flex flex-col gap-6">
            <span className="absolute top-0 right-10 transform -translate-y-1/2 bg-black border border-white/10 font-mono text-[9px] tracking-widest text-white/40 px-2.5 py-0.5 rounded-none">
              ADDIS_SPEC_DRAFT
            </span>

            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">OFFICIAL CODE</span>
              <span className="font-display text-lg font-light text-white mt-0.5">SIA_400_MEAREY</span>
            </div>

            {/* Simulated server logs */}
            <div className="flex flex-col gap-3 font-mono text-[10px] text-white/65 bg-[#0a0a0a] p-4 rounded-none border border-white/5">
              <div className="flex justify-between">
                <span className="text-white/30 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-white/20" /> WebGL Render Core:</span>
                <span className="text-white">ACTIVATED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30 flex items-center gap-1"><Database className="w-3.5 h-3.5 text-white/20" /> Latency Pipeline:</span>
                <span className="text-white font-medium">GSAP Dynamic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30 flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-white/20" /> Geometry Solvers:</span>
                <span className="text-white font-medium">RhinoCommon</span>
              </div>
            </div>

            {/* Mini prompt statement */}
            <div className="border-t border-white/5 pt-4 flex flex-col gap-1.5">
              <span className="font-mono text-[8px] text-white/30 uppercase">Interactive specs note:</span>
              <p className="text-[11px] leading-relaxed text-white/50 font-light">
                You can zoom or rotate spec shapes in the active webgl canvases within individual project models below.
              </p>
            </div>
          </div>

        </div>

        {/* Scroll downstream indicator */}
        <button
          onClick={() => navigateToSection("projects")}
          id="scroll-down-button"
          aria-label="Scroll to Portfolio"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <span className="font-mono text-[9px] tracking-widest uppercase">PORTFOLIO INDEX</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-white/40" />
        </button>
      </section>

      {/* ==================== 01 / PORTFOLIO CATALOG SECTION ==================== */}
      <section 
        id="projects" 
        className="relative py-24 px-6 md:px-12 border-b border-white/5 bg-[#050505] overflow-hidden"
      >
        <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Head */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="font-mono text-xs tracking-[0.35em] text-white/50 uppercase">SECTION 01 / SPEC ARCHIVE</span>
              </div>
              <h2 className="font-display text-3.5xl md:text-5xl font-light tracking-tight text-white mb-2">GENERATIVE BUILDINGS & SCHEMAS</h2>
              <div className="h-[1px] w-20 bg-white/30" />
            </div>

            {/* Filter Toggle Controls */}
            <div className="flex flex-wrap gap-2 font-mono text-xs" id="project-filters">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-none transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-white border-white text-black font-semibold"
                      : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat === "All" ? "ALL" : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Projects grid representation */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" 
            id="projects-container-grid"
          >
            {filteredProjects.map((p, index) => (
              <InteractiveCard
                key={p.id}
                project={p}
                index={index}
                onSelect={(selected) => setSelectedProject(selected)}
              />
            ))}
          </div>

          {/* Quick statement on 3D Specs */}
          <div className="mt-12 bg-black/60 rounded-none border border-white/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40">
            <span className="flex items-center gap-2 font-light"><LayoutGrid className="w-4 h-4 text-white/30 shrink-0" /> SHOWING {filteredProjects.length} OUT OF {PROJECTS.length} SPECTRAL SPEC RECORDS.</span>
            <span className="font-light">DATA ENHANCED VIA THREE.JS AND WEBGL</span>
          </div>

        </div>
      </section>

      {/* ==================== 02 / ABOUT SECTION ==================== */}
      <AboutSection />

      {/* ==================== 04 / CONTACT SECTION ==================== */}
      <ContactSection />

      {/* ==================== DETAILED SPEC MODAL OVERLAY ==================== */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-black border-t border-white/10 py-12 px-6 md:px-12 font-mono text-xs text-white/40 relative overflow-hidden">
        {/* Backdrop visual elements */}
        <div className="absolute right-10 bottom-6 transform rotate-12 opacity-5 font-display text-8xl font-black text-white pointer-events-none uppercase">
          MEAREY 2026
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-white font-display text-sm tracking-widest uppercase mb-1">ELORA MEAREY</span>
            <span className="font-light">COMPUTATIONAL ARCHITECTURE & 3D FABRICATIONS</span>
          </div>

          <div className="flex items-center gap-6 text-[10px]" id="socials-footer">
            <a href="#projects" className="hover:text-white hover:underline underline-offset-4 decoration-white/20 transition-all uppercase">ARCHIVE</a>
            <a href="#about" className="hover:text-white hover:underline underline-offset-4 decoration-white/20 transition-all uppercase">BIO & CAPABILITIES</a>
            <a href="#consultation" className="hover:text-white hover:underline underline-offset-4 decoration-white/20 transition-all uppercase">CO-DESIGN CELL</a>
          </div>

          <div>
            <span className="font-light">© 2026 STUDIO MEAREY // ALL SPECTRAL CODES PERSISTED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
