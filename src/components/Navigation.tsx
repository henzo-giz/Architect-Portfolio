import { useState, useEffect } from "react";
import { Menu, X, Globe, User, MapPin, Sun, Moon } from "lucide-react";

interface NavigationProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navigation({ currentSection, onNavigate, theme, onToggleTheme }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState("");

  // Update Addis Ababa Time representing local context of physical studio
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Addis_Ababa",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "hero", label: "00 / INDEX" },
    { id: "projects", label: "01 / PORTFOLIO" },
    { id: "about", label: "02 / ABOUT & STATS" },
    { id: "consultation", label: "03 / CONSULTATION" },
    { id: "contact", label: "04 / CONTACT" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        id="main-nav-bar"
        className="fixed top-0 left-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 px-6 py-6 md:px-12 flex justify-between items-center md:grid md:grid-cols-[1fr_auto_1fr] transition-all duration-300 gap-4"
      >
        {/* Left Brand Area */}
        <div 
          onClick={() => handleLinkClick("hero")}
          className="cursor-pointer flex flex-col items-start gap-1 justify-self-start col-span-1"
          id="nav-brand-group"
        >
          <span className="text-xs tracking-[0.4em] font-light uppercase text-white transition-colors">
            E. Mearey
          </span>
          <span className="text-[9px] tracking-[0.3em] font-light uppercase text-white/40 hidden sm:inline">
            Architect / 3D Spec
          </span>
        </div>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center justify-self-center col-span-1 gap-6 lg:gap-10 text-[10px] tracking-[0.3em] uppercase font-medium" id="desktop-nav-links">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={`transition-all duration-300 relative py-1 hover:text-white ${
                  isActive ? "text-white" : "text-white/40"
                }`}
              >
                {item.label.replace(/^\d+\s*\/\s*/, "")}
                <span 
                  className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-350 ${
                    isActive ? "w-full" : "w-0 hover:w-full"
                  }`} 
                />
              </button>
            );
          })}
        </div>

        {/* Right Status Panel (Sleek Time Telemetry) */}
        <div className="hidden md:flex items-center justify-self-end col-span-1 gap-4 lg:gap-6 font-mono text-[9px] tracking-widest text-white/40 border-l border-white/15 pl-4 lg:pl-6" id="nav-telemetry">
          <div className="hidden lg:flex items-center gap-2">
            <MapPin className="w-3 h-3 text-white/60" />
            <span>ADDIS ABABA, ET</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-white/45 animate-spin" style={{ animationDuration: "12s" }} />
            <span>ADD: <span className="text-white/80 font-medium">{time || "00:00:00"}</span></span>
          </div>
          
          <button 
            onClick={onToggleTheme}
            aria-label="Toggle Theme Mode"
            className="p-1 border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all text-white/60 hover:text-white cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile Actions Container (Includes Theme Toggle + Menu Hamburger) */}
        <div className="md:hidden flex items-center gap-2.5">
          <button 
            onClick={onToggleTheme}
            aria-label="Toggle Theme Mode"
            className="p-1.5 border border-white/10 bg-black/40 text-white/75 hover:text-white bg-zinc-950 transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
            className="p-1.5 border border-white/10 bg-black/50 hover:bg-zinc-900 text-white transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white/60" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay Menu */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-0 w-full h-full z-45 bg-[#050505]/98 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

        <div className="flex flex-col items-center gap-8 z-10 w-full px-6">
          <div className="text-center mb-4">
            <span className="text-xs tracking-[0.4em] font-light uppercase text-white/80">STUDIO MEAREY</span>
            <p className="font-mono text-[9px] text-white/40 mt-2 uppercase tracking-widest">Addis Spec Sheet v4.1</p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm" id="mobile-links-container">
            {navItems.map((item, idx) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`w-full py-4 text-center border font-mono text-xs tracking-widest transition-all duration-300 ${
                    isActive 
                      ? "bg-white/10 border-white/30 text-white font-medium" 
                      : "bg-transparent border-white/5 hover:border-white/20 text-white/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 mt-8 font-mono text-[10px] text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-white/40" />
              <span>Bole Sub City, Road 05, Addis Ababa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] animate-pulse" />
              <span className="tracking-widest">SYSTEM: ACTIVE ({time || "00:00:00"})</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
