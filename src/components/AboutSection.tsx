import { useState } from "react";
import { ARCHITECT_PROFILE, WORK_EXPERIENCE, TECHNICAL_SKILLS } from "../data/portfolioData";
import { Briefcase, Cpu, Award, Zap, ChevronRight } from "lucide-react";

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const skillCategories = ["All", "CAD & BIM", "Parametric & Scripting", "Rendering & Visualization", "Realtime & Engine"];

  const filteredSkills = activeCategory === "All"
    ? TECHNICAL_SKILLS
    : TECHNICAL_SKILLS.filter(s => s.category === activeCategory);

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 bg-[#050505] border-b border-white/5 overflow-hidden">
      <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="font-mono text-xs tracking-[0.35em] text-white/50 uppercase">SECTION 02 / ABOUT THE ARCHITECT</span>
          </div>
          <h2 className="font-display text-3.5xl md:text-5xl font-light tracking-tight text-white mb-2">BIO & CORE CAPABILITIES</h2>
          <div className="h-[1px] w-20 bg-white/30" />
        </div>

        {/* Top: Bio and Map location details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Biography Text block */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">[ RESEARCH PHILOSOPHY ]</span>
            <p className="font-serif text-xl md:text-2xl text-white/80 italic font-light leading-relaxed">
              &ldquo;Buildings are not stiff, static compositions in glass and brick. They are <span className="text-white underline decoration-white/30 decoration-1 underline-offset-4 font-normal">dynamic physical processes</span> that evolve with daylight, ambient pressure, wind loads, and thermal gradients.&rdquo;
            </p>
            <p className="text-white/60 leading-relaxed text-sm font-light">
              {ARCHITECT_PROFILE.bio}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono text-xs">
              <div className="p-4 bg-white/[0.02] rounded-none border border-white/5 flex flex-col gap-1.5">
                <span className="text-white/30 uppercase text-[8px] tracking-widest">computational core</span>
                <span className="text-white font-light flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-white/50" /> Algorithmic Form
                </span>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-none border border-white/5 flex flex-col gap-1.5">
                <span className="text-white/30 uppercase text-[8px] tracking-widest">construction focus</span>
                <span className="text-white font-light flex items-center gap-2">
                  <Award className="w-4 h-4 text-white/50" /> Heavy Materiality
                </span>
              </div>
            </div>
          </div>

          {/* Swiss Studio Coordinate Details */}
          <div className="lg:col-span-5 bg-black/40 border border-white/5 rounded-none p-6 relative flex flex-col gap-5">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-white/10 border border-white/20 text-white font-mono text-[9px] px-2 py-0.5 rounded-none tracking-widest uppercase">
              STUDIO LOC
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">OFFICE HEADQUARTERS</span>
              <span className="font-display text-xl font-light text-white mt-1">{ARCHITECT_PROFILE.studio}</span>
              <span className="text-white/60 text-xs mt-1 font-light">{ARCHITECT_PROFILE.address}</span>
            </div>

            {/* Custom Interactive Mini Map Frame representing Addis Ababa coordinates */}
            <div className="relative w-full aspect-[16/9] bg-[#050505] border border-white/5 rounded-none overflow-hidden group">
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  title="Google Map of Addis Ababa Studio"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=9.0080090026326,38.78336647806467&t=m&z=15&output=embed&iwloc=near"
                  className="w-full h-full grayscale opacity-80 dark:invert contrast-[1.1] hover:grayscale-0 dark:hover:invert-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] tracking-widest font-mono text-white/40 border-t border-white/5 pt-4">
              <span>MAPPED LOC: ADDIS ABABA</span>
              <span>SCALE: 1 : 5,000</span>
            </div>
          </div>

        </div>

        {/* Center Section: Work Experience and Level bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Work Chronology */}
          <div className="flex flex-col gap-6" id="about-chronology">
            <h3 className="font-display text-xl md:text-2xl font-light tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-white/40" />
              CHRONOLOGY
            </h3>

            <div className="flex flex-col gap-5 border-l border-white/5 pl-4">
              {WORK_EXPERIENCE.map((exp) => (
                <div 
                  key={exp.id} 
                  id={`experience-row-${exp.id}`}
                  className="relative group pb-4 border-b border-white/5 last:border-0"
                >
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-none border border-black bg-white/20 group-hover:bg-white transition-colors" />

                  <span className="font-mono text-[9px] tracking-widest text-white/40 block mb-1">{exp.period}</span>
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mt-1">
                    <h4 className="font-display text-base font-light text-white group-hover:text-white/90 transition-colors uppercase tracking-wide">{exp.role}</h4>
                    <span className="font-mono text-[10px] tracking-wider text-white/40">{exp.organization.toUpperCase()}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-2 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills index */}
          <div className="flex flex-col gap-6" id="about-skills-index">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="font-display text-xl md:text-2xl font-light tracking-tight text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-white/40" />
                DRAFTING SKILLSET
              </h3>

              {/* Categorization chips */}
              <div className="flex flex-wrap gap-1.5">
                {skillCategories.slice(0, 3).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 text-[9px] font-mono tracking-wider transition-colors border cursor-pointer ${
                      (activeCategory === cat || (cat === "All" && activeCategory === "All"))
                        ? "bg-white border-white text-black font-semibold"
                        : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/25"
                    }`}
                  >
                    {cat === "All" ? "ALL" : cat.split(" ")[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale layout bars */}
            <div className="flex flex-col gap-5 rounded-none bg-black/60 border border-white/5 p-6 md:p-8" id="skill-bars-list">
              {filteredSkills.map((skill) => (
                <div key={skill.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white/90 font-light flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                      {skill.name}
                    </span>
                    <span className="text-white/80">{skill.level}%</span>
                  </div>

                  {/* Meter Track Container */}
                  <div className="h-1.5 w-full bg-white/5 border border-white/5 relative flex items-center">
                    {/* Tick separators to simulate architectural rulers */}
                    <div className="absolute inset-0 flex justify-between px-2 text-[5px] text-white/10 pointer-events-none font-mono">
                      <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                      <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                    </div>

                    {/* Progress Fill bar */}
                    <div 
                      className="h-full bg-gradient-to-r from-white/40 to-white transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-white/30 block self-end uppercase tracking-[0.1em]">
                    SYS LEVEL // CATEGORY: {skill.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
