export interface ResumeData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
  summary?: string;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
}

export interface Education {
  id?: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  id?: string;
  category: string;
  skillName: string;
  level?: number;
}