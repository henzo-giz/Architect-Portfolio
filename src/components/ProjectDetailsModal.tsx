import { Project } from "../types";
import { X, MapPin, Scale, Calendar, Hammer, Cpu, Layers } from "lucide-react";
import PortfolioViewer3D from "./PortfolioViewer3D";

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <div
      id="project-details-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in"
    >
      {/* Sleek background grid */}
      <div className="sleek-grid absolute inset-0 opacity-10 pointer-events-none" />

      {/* Main Container */}
      <div 
        className="relative w-full max-w-6xl rounded-none bg-[#050505] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        id="modal-specs-box"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          id="close-modal-button"
          aria-label="Close Project Modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-none bg-black border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body - Split View Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: Photorealistic Render Photo */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="rounded-none overflow-hidden border border-white/10 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  id="modal-main-image"
                  className="w-full object-cover aspect-[4/3]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black border border-white/10 text-[8.5px] tracking-widest font-mono text-white/60 px-2.5 py-1">
                  RENDERED SPEC
                </div>
              </div>

              {/* Physical specifications panel */}
              <div className="bg-black/40 border border-white/5 rounded-none p-4 flex flex-col gap-3 font-mono text-xs text-white/65">
                <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">PROJECT METRICS</span>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/30" /> Site Location</span>
                  <span className="text-white font-light">{project.location}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-white/30" /> Scale Size</span>
                  <span className="text-white font-light">{project.scale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/30" /> Target Year</span>
                  <span className="text-white font-light">{project.year}</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Parametric Specs and Descriptions */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Headings */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{project.category} SPECIFICATION</span>
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: project.color }} />
                </div>
                <h2 className="font-display text-2xl md:text-3.5xl font-light tracking-tight text-white uppercase">{project.title}</h2>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-1">{project.subtitle}</p>
              </div>

              {/* Real Description */}
              <div className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60 font-light">
                <p>{project.description}</p>
              </div>

              {/* Grid: 3D Computational Model + Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Embedded WebGL 3D model */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-white/40 text-[9px] tracking-widest font-mono">
                    <Cpu className="w-4 h-4 text-white/30" />
                    <span>computational spec (3d)</span>
                  </div>
                  <PortfolioViewer3D 
                    threeDType={project.threeDType} 
                    color={project.color} 
                    className="flex-1 min-h-[220px]"
                  />
                </div>

                {/* Materials List */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-white/40 text-[9px] tracking-widest font-mono">
                    <Hammer className="w-4 h-4 text-white/30" />
                    <span>material composition</span>
                  </div>
                  <div className="flex-1 rounded-none border border-white/5 bg-black/40 p-4 flex flex-col gap-2">
                    {project.materials.map((mat, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 text-xs font-mono text-white/60 bg-zinc-950/60 py-2.5 px-3 rounded-none border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-white/30 shrink-0" />
                        <span>{mat}</span>
                      </div>
                    ))}
                    <div className="mt-auto pt-2 text-[9px] font-mono text-white/20 text-center uppercase tracking-widest">
                      SYSTEM COMPLIANT
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Modal Foot */}
        <div className="border-t border-white/10 bg-black px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 font-mono text-[9px] tracking-wider text-white/40">
          <span>PORTFOLIO COMPILED ACCORDING TO SWISS ARCHITECTURAL STANDARDS (SIA)</span>
          <span>© STUDIO MEAREY 2026</span>
        </div>
      </div>
    </div>
  );
}
