export interface BasicInfo {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  email: string;
  phone: string;
  address: string;
  addressEn: string;
  summary: string;
  summaryEn: string;
  photo: string; // base64
}

export interface Education {
  id: string;
  school: string;
  schoolEn: string;
  degree: string;
  degreeEn: string;
  major: string;
  majorEn: string;
  startDate: string;
  endDate: string;
  description: string;
  descriptionEn: string;
}

export interface Experience {
  id: string;
  company: string;
  companyEn: string;
  position: string;
  positionEn: string;
  startDate: string;
  endDate: string;
  description: string;
  descriptionEn: string;
}

export interface Project {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  startDate: string;
  endDate: string;
  techStack: string;
  description: string;
  descriptionEn: string;
}

export interface Skill {
  id: string;
  name: string;
  nameEn: string;
  level: number; // 1-5
}

export interface ResumeData {
  basicInfo: BasicInfo;
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
}

export type Lang = 'zh' | 'en';

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'elegant' | 'professional' | 'creative' | 'compact';

export interface ResumeEntry {
  id: string;
  name: string;
  updatedAt: number; // timestamp
  data: ResumeData;
}
