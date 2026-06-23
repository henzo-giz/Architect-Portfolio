export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "Architecture" | "3D Modeling" | "Research" | "Parametric";
  year: string;
  location: string;
  scale: string;
  materials: string[];
  description: string;
  image: string;
  threeDType: "pavilion" | "tower" | "observatory" | "canopy";
  color: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface TechnicalSkill {
  name: string;
  category: "CAD & BIM" | "Parametric & Scripting" | "Rendering & Visualization" | "Realtime & Engine";
  level: number; // 0-100 percentage
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  date: string;
  timeSlot: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
