import { create } from 'zustand';
import { ResumeData } from '../types/resume';

interface ResumeStore {
  resume: ResumeData;
  updateBasicInfo: (data: Partial<ResumeData>) => void;
  addEducation: (education: any) => void;
  updateEducation: (id: string, education: any) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: any) => void;
  updateExperience: (id: string, experience: any) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: any) => void;
  updateSkill: (id: string, skill: any) => void;
  removeSkill: (id: string) => void;
  loadResume: (resume: ResumeData) => void;
  resetResume: () => void;
}

const initialResume: ResumeData = {
  name: '',
  email: '',
  phone: '',
  position: '',
  summary: '',
  educations: [],
  experiences: [],
  skills: [],
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: initialResume,

  updateBasicInfo: (data) => set((state) => ({
    resume: { ...state.resume, ...data }
  })),

  addEducation: (education) => set((state) => ({
    resume: {
      ...state.resume,
      educations: [...state.resume.educations, { ...education, id: Date.now().toString() }]
    }
  })),

  updateEducation: (id, education) => set((state) => ({
    resume: {
      ...state.resume,
      educations: state.resume.educations.map(edu => 
        edu.id === id ? { ...education, id } : edu
      )
    }
  })),

  removeEducation: (id) => set((state) => ({
    resume: {
      ...state.resume,
      educations: state.resume.educations.filter(edu => edu.id !== id)
    }
  })),

  addExperience: (experience) => set((state) => ({
    resume: {
      ...state.resume,
      experiences: [...state.resume.experiences, { ...experience, id: Date.now().toString() }]
    }
  })),

  updateExperience: (id, experience) => set((state) => ({
    resume: {
      ...state.resume,
      experiences: state.resume.experiences.map(exp => 
        exp.id === id ? { ...experience, id } : exp
      )
    }
  })),

  removeExperience: (id) => set((state) => ({
    resume: {
      ...state.resume,
      experiences: state.resume.experiences.filter(exp => exp.id !== id)
    }
  })),

  addSkill: (skill) => set((state) => ({
    resume: {
      ...state.resume,
      skills: [...state.resume.skills, { ...skill, id: Date.now().toString() }]
    }
  })),

  updateSkill: (id, skill) => set((state) => ({
    resume: {
      ...state.resume,
      skills: state.resume.skills.map(s => 
        s.id === id ? { ...skill, id } : s
      )
    }
  })),

  removeSkill: (id) => set((state) => ({
    resume: {
      ...state.resume,
      skills: state.resume.skills.filter(s => s.id !== id)
    }
  })),

  loadResume: (resume) => set({ resume }),

  resetResume: () => set({ resume: initialResume }),
}));