export interface WhoAmI {
  name: string;
  role: string;
  bio: string;
  location: string;
  yearsOfExperience: number;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  icon: string;
}

export interface Skills {
  frameworks: Skill[];
  languages: Skill[];
  databases: Skill[];
  tools: Skill[];
}

export interface Language {
  name: string;
  level: string;
  icon: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface ProjectMedia {
  type: 'images' | 'video';
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  status: string;
  github: string;
  demo?: string;
  features: string[];
  media: ProjectMedia;
}

export interface Social {
  platform: string;
  url: string;
  username: string;
  icon: string;
}

export interface CommandOption {
  flag: string;
  description: string;
}

export interface CommandInfo {
  description: string;
  usage: string;
  options?: CommandOption[];
  example?: string;
}

export interface PortfolioData {
  whoami: WhoAmI;
  skills: Skills;
  languages: Language[];
  experience: Experience[];
  projects: Project[];
  social: Social[];
  commands: Record<string, CommandInfo>;
}
