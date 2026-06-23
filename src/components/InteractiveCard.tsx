import React, { useRef, useState } from "react";
import { Project } from "../types";
import { ArrowUpRight, Locate, Scale, Calendar } from "lucide-react";

interface InteractiveCardProps {
  key?: string | number;
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

export default function InteractiveCard({ project, index, onSelect }: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Math for 3D mouse tracking tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor positions relative to Center of Card (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Scale intensity (e.g., rotate up to 12 degrees max)
    setCoords({ x: relativeX * 12, y: -relativeY * 12 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      id={`project-card-${project.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        transform: `perspective(1000px) rotateY(${coords.x}deg) rotateX(${coords.y}deg) scale(${isHovered ? 1.015 : 1})`,
      }}
      className="tilt-card cursor-pointer group relative rounded-none bg-black/60 border border-white/5 overflow-hidden flex flex-col hover:border-white/30 transition-all duration-300"
    >
      {/* Immovable card glass outline */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Frame details mimicking drafting paper lines */}
      <div className="absolute top-4 left-4 text-[9px] font-mono text-white/40 tracking-[0.2em] uppercase">
        SPEC CODE: MEAREY_2026_{index + 1}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[9px] text-white/50 bg-white/5 px-2 py-0.5 border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
        {project.category.toUpperCase()}
      </div>

      {/* Hero render image */}
      <div className="w-full aspect-[3/2] overflow-hidden relative mt-10">
        <img
          src={project.image}
          alt={project.title}
          id={`project-thumbnail-${project.id}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        
        {/* Hover Vector overlay crosshairs */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none crosshair crosshair-h crosshair-v" />
      </div>

      {/* Static specs parameters at the foot of card */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#050505]/95 z-10">
        <div>
          <h3 className="font-display text-xl font-light tracking-tight text-white group-hover:text-white/90 transition-colors">
            {project.title}
          </h3>
          <p className="font-mono text-[10px] text-white/40 mt-1.5 uppercase tracking-[0.25em]">
            {project.subtitle}
          </p>
        </div>

        {/* Tech Readouts */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 my-4 py-3 text-[10px] font-mono text-white/60">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Location</span>
            <span className="flex items-center gap-1 truncate text-white/80">
              <Locate className="w-3 h-3 text-white/40 shrink-0" />
              {project.location.split(",")[0]}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Scale</span>
            <span className="flex items-center gap-1 truncate text-white/80">
              <Scale className="w-3 h-3 text-white/40 shrink-0" />
              {project.scale}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Year</span>
            <span className="flex items-center gap-1 truncate text-white/80">
              <Calendar className="w-3 h-3 text-white/40 shrink-0" />
              {project.year}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80 transition-colors tracking-widest uppercase">
            OPEN SPECIFICATIONS
          </span>
          <div className="p-2 bg-transparent border border-white/10 text-white/50 group-hover:text-white group-hover:border-white group-hover:bg-white/10 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
