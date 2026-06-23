import { Project, Experience, TechnicalSkill } from "../types";

export const ARCHITECT_PROFILE = {
  name: "Elora Mearey",
  role: "Computational Architect & 3D Artist",
  studio: "Elora Mearey",
  tagline: "Exploring the intersections of heavy materiality, algorithmic structures, and atmospheric light.",
  bio: "Elora Mearey is an Addis Ababa-based architectural designer and computational artist. Over the past six years, her work has spanned modular raw concrete pavilions, sprawling kinetic installations, and parametric skyscrapers. Blending rigorous building science with advanced real-time 3D rendering engines, she views digital modeling not merely as representation, but as a space of active material research and speculation.",
  email: "elora@studiomearey.com",
  phone: "+251 94 139 1059",
  address: "Lebu, Road 05, Addis Ababa, Ethiopia",
  latLng: { lat: 9.0227, lng: 38.7468 } // Addis Ababa
};

export const PROJECTS: Project[] = [
  {
    id: "maison-du-beton",
    title: "Maison du Béton",
    subtitle: "Modular Pavilion Research",
    category: "Architecture",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    scale: "250 m²",
    materials: ["Casted Raw Concrete", "Sandblasted Structural Steel", "Frameless Ultra-clear Glass"],
    description: "An open gallery pavilion exploring the architectural capabilities of modular glass-fiber reinforced concrete. The design employs sweeping circular voids, sculptural spiral staircases, and tall lightwells that cast moving sundials of amber light across concrete surfaces. The building functions as an experimental acoustic and light incubator, letting shadows serve as organic internal partition walls.",
    image: "/assets/images/project_concrete_1782226852608.jpg",
    threeDType: "pavilion",
    color: "#7c7c7c"
  },
  {
    id: "spiro-helix-tower",
    title: "Spiro Helix Tower",
    subtitle: "Parametric Biological Skyscraper",
    category: "Parametric",
    year: "2026",
    location: "Addis Ababa, Ethiopia",
    scale: "84,000 m²",
    materials: ["Cross-Laminated Timber (CLT) Louvers", "Photovoltaic Smart Glass", "Recycled Titanium Mesh"],
    description: "Spiro Helix is a parametric bio-mimetic mixed-use tower concept that adapts its spiraling skeletal louvers to maximize passive solar shading. The structure employs deep-nested wooden louvers that twist along a parabolic curve, housing vertical urban gardens and micro-climates that cool passing winds. The digital form was developed using custom Grasshopper algorithms that calculate localized heat-load indexes in real time.",
    image: "/assets/images/project_helix_1782226864419.jpg",
    threeDType: "tower",
    color: "#a4805c"
  },
  {
    id: "arctic-oculus",
    title: "Arctic Oculus",
    subtitle: "Glass Coastline Observatory",
    category: "Architecture",
    year: "2024",
    location: "Addis Ababa, Ethiopia",
    scale: "180 m²",
    materials: ["Thermal Double-Skin Smart Glass", "Corrosion-resistant Carbon Steel", "Local Granite Anchors"],
    description: "Perched on a rugged obsidian arctic cliff, Arctic Oculus is a research cabin and stellar observatory designed to withstand sub-zero wind loads. Its crystalline geometry is anchored directly into deep granite beds. A double-insulated heated shell ensures absolute thermal retention, with integrated solar tracking filters that maximize daylighting during winter seasons and block glare during the continuous summer sun.",
    image: "/assets/images/project_observatory_1782226880410.jpg",
    threeDType: "observatory",
    color: "#4a6c82"
  },
  {
    id: "symbiosis-canopy",
    title: "Symbiosis Canopy",
    subtitle: "Kinetic Lattice Installation",
    category: "3D Modeling",
    year: "2025",
    location: "Addis Ababa, Ethiopia",
    scale: "680 m²",
    materials: ["Steam-bent White Oak Lattice", "Biodegradable Tensile Membrane", "Brass Friction Hinges"],
    description: "Designed for a major public square, this parametric timber canopy replicates micro-shading patterns found in broadleaf forest canopies. The timber grid was simulated in real-time using custom physical particle systems, optimizing the bending limit of local white oak planks. Shafts of morning light filter through the complex mesh, offering respite from intense summer heat.",
    image: "/assets/images/project_kinetic_1782226895863.jpg",
    threeDType: "canopy",
    color: "#bf9368"
  }
];

export const WORK_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Computation Specialist",
    organization: "Atelier parametric-mesh",
    period: "2024 - Present",
    description: "Pioneered computational design pipelines using Grasshopper and RhinoCommon. Developed real-time generative solvers for façade optimization, shaving off 18% steel weight on structural framing projects."
  },
  {
    id: "exp-2",
    role: "3D Modeler & Visualization Lead",
    organization: "Morpho-Logic Architects",
    period: "2022 - 2024",
    description: "Led the visualization and asset modeling for landmark civic centers. Crafted high-fidelity 3D assets in Blender and Unreal Engine 5, combining real-time lighting with precise architectural BIM telemetry."
  },
  {
    id: "exp-3",
    role: "Architectural Intern",
    organization: "Studio Kengo & Partners",
    period: "2020 - 2022",
    description: "Drafted structural schemas for timber-mesh pavilions, assisted with physical wood model assembly, and managed site rendering documentation."
  }
];

export const TECHNICAL_SKILLS: TechnicalSkill[] = [
  { name: "Autodesk Revit & BIM", category: "CAD & BIM", level: 90 },
  { name: "Rhinoceros 3D", category: "CAD & BIM", level: 95 },
  { name: "Grasshopper 3D", category: "Parametric & Scripting", level: 98 },
  { name: "Python (RhinoCommon)", category: "Parametric & Scripting", level: 80 },
  { name: "Blender & SubD modeling", category: "Rendering & Visualization", level: 92 },
  { name: "Chaos V-Ray / Corona", category: "Rendering & Visualization", level: 88 },
  { name: "Unreal Engine 5 & Niagara", category: "Realtime & Engine", level: 85 },
  { name: "Three.js / WebGL / Shaders", category: "Realtime & Engine", level: 75 }
];
