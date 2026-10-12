import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { ResumeData, Lang, ResumeEntry, TemplateType } from '../types/resume';

const STORAGE_KEY = 'resume-entries';
const CURRENT_KEY = 'resume-current-id';
const PHOTO_DB = 'resume-photos';
const AUTO_SAVE_KEY = 'resume-auto-save';
const AUTO_SAVE_DELAY = 1500; // ms

const emptyData: ResumeData = {
  basicInfo: {
    name: '', nameEn: '', title: '', titleEn: '',
    email: '', phone: '', address: '', addressEn: '',
    summary: '', summaryEn: '', photo: '',
  },
  educations: [],
  experiences: [],
  projects: [],
  skills: [],
};

const defaultData: ResumeData = {
  basicInfo: {
    name: '张三',
    nameEn: 'Zhang San',
    title: '高级前端工程师',
    titleEn: 'Senior Frontend Engineer',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    address: '北京市朝阳区',
    addressEn: 'Chaoyang, Beijing',
    summary: '拥有5年前端开发经验，精通React、TypeScript等现代前端技术栈。热衷于构建高性能、可维护的Web应用，具备良好的团队协作能力和技术领导力。',
    summaryEn: '5+ years of frontend development experience, proficient in React, TypeScript and modern frontend tech stacks. Passionate about building high-performance, maintainable web applications with strong teamwork and technical leadership.',
    photo: '',
  },
  educations: [
    {
      id: 'edu-1',
      school: '北京大学', schoolEn: 'Peking University',
      degree: '本科', degreeEn: 'Bachelor',
      major: '计算机科学', majorEn: 'Computer Science',
      startDate: '2015-09', endDate: '2019-06',
      description: 'GPA 3.8/4.0，获国家奖学金',
      descriptionEn: 'GPA 3.8/4.0, National Scholarship',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: '字节跳动', companyEn: 'ByteDance',
      position: '高级前端工程师', positionEn: 'Senior Frontend Engineer',
      startDate: '2021-03', endDate: '至今',
      description: '负责核心业务系统前端架构设计与开发，主导前端性能优化项目，将页面加载速度提升40%。',
      descriptionEn: 'Responsible for frontend architecture design of core business systems, led frontend performance optimization, improving page load speed by 40%.',
    },
    {
      id: 'exp-2',
      company: '阿里巴巴', companyEn: 'Alibaba',
      position: '前端工程师', positionEn: 'Frontend Engineer',
      startDate: '2019-07', endDate: '2021-02',
      description: '参与电商平台前端开发，使用React + TypeScript构建高质量的用户界面。',
      descriptionEn: 'Participated in e-commerce platform frontend development, building high-quality UIs with React + TypeScript.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: '企业管理后台', nameEn: 'Enterprise Admin Dashboard',
      role: '前端负责人', roleEn: 'Frontend Lead',
      startDate: '2022-01', endDate: '2023-06',
      techStack: 'React, TypeScript, Ant Design, ECharts',
      description: '从零搭建企业级管理后台，支持权限管理、数据可视化、工作流等核心功能模块。',
      descriptionEn: 'Built enterprise admin dashboard from scratch, supporting permission management, data visualization, workflow and other core modules.',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'React / Next.js', nameEn: 'React / Next.js', level: 5 },
    { id: 'skill-2', name: 'TypeScript', nameEn: 'TypeScript', level: 5 },
    { id: 'skill-3', name: 'Node.js', nameEn: 'Node.js', level: 4 },
    { id: 'skill-4', name: 'Tailwind CSS', nameEn: 'Tailwind CSS', level: 4 },
    { id: 'skill-5', name: 'Python', nameEn: 'Python', level: 3 },
  ],
};

// --- IndexedDB photo helpers ---
function openPhotoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTO_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('photos');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePhotoToDB(id: string, base64: string) {
  const db = await openPhotoDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    tx.objectStore('photos').put(base64, id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function loadPhotoFromDB(id: string): Promise<string | null> {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readonly');
    const req = tx.objectStore('photos').get(id);
    req.onsuccess = () => { db.close(); resolve(req.result ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deletePhotoFromDB(id: string) {
  const db = await openPhotoDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    tx.objectStore('photos').delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

// --- Storage helpers ---
function loadEntries(): ResumeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveEntries(entries: ResumeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadCurrentId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

function saveCurrentId(id: string) {
  localStorage.setItem(CURRENT_KEY, id);
}

// Migrate old single-resume format
function migrateOldData(entries: ResumeEntry[]): ResumeEntry[] {
  try {
    const old = localStorage.getItem('resume-data');
    if (old && entries.length === 0) {
      const data: ResumeData = JSON.parse(old);
      if (data.basicInfo?.name || data.basicInfo?.nameEn) {
        const entry: ResumeEntry = {
          id: `resume-${Date.now()}`,
          name: data.basicInfo.name || data.basicInfo.nameEn || 'Resume',
          updatedAt: Date.now(),
          data,
        };
        localStorage.removeItem('resume-data');
        return [entry];
      }
    }
  } catch { /* ignore */ }
  return entries;
}

function genId() {
  return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// --- Context ---
interface ResumeContextType {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  lang: Lang;
  setLang: (lang: Lang) => void;
  template: TemplateType;
  setTemplate: (t: TemplateType) => void;
  // Multi-resume management
  entries: ResumeEntry[];
  currentId: string | null;
  saveCurrentResume: (name?: string) => void;
  createNewResume: () => void;
  loadResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  duplicateResume: (id: string) => void;
  restoreEntries: (newEntries: ResumeEntry[]) => void;
  // Auto-save
  autoSave: boolean;
  setAutoSave: (v: boolean) => void;
  lastSavedAt: number | null;
  // Reorder
  reorderItems: <K extends 'educations' | 'experiences' | 'projects' | 'skills'>(key: K, newOrder: ResumeData[K]) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ResumeEntry[]>(() => {
    const loaded = loadEntries();
    return migrateOldData(loaded);
  });
  const [currentId, setCurrentId] = useState<string | null>(() => {
    return loadCurrentId();
  });
  const [data, setData] = useState<ResumeData>(() => {
    const loaded = loadEntries();
    const migrated = migrateOldData(loaded);
    const id = loadCurrentId();
    const entry = migrated.find(e => e.id === id);
    return entry ? entry.data : (migrated.length > 0 ? migrated[0].data : defaultData);
  });
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('resume-lang') as Lang) || 'zh';
  });
  const [template, setTemplate] = useState<TemplateType>(() => {
    return (localStorage.getItem('resume-template') as TemplateType) || 'classic';
  });

  const [autoSave, setAutoSave] = useState<boolean>(() => {
    return localStorage.getItem(AUTO_SAVE_KEY) !== 'false';
  });
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist entries
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  // Persist current id
  useEffect(() => {
    if (currentId) saveCurrentId(currentId);
  }, [currentId]);

  // Persist lang
  useEffect(() => {
    localStorage.setItem('resume-lang', lang);
  }, [lang]);

  // Persist template
  useEffect(() => {
    localStorage.setItem('resume-template', template);
  }, [template]);

  // Persist autoSave preference
  useEffect(() => {
    localStorage.setItem(AUTO_SAVE_KEY, String(autoSave));
  }, [autoSave]);

  // Auto-save: debounce persist current resume when data changes
  useEffect(() => {
    if (!autoSave || !currentId) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setEntries(prev => prev.map(e =>
        e.id === currentId
          ? { ...e, name: data.basicInfo.name || data.basicInfo.nameEn || 'Untitled', updatedAt: Date.now(), data: { ...data } }
          : e
      ));
      setLastSavedAt(Date.now());
    }, AUTO_SAVE_DELAY);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [autoSave, currentId, data]);

  const reorderItems = useCallback(<K extends 'educations' | 'experiences' | 'projects' | 'skills'>(key: K, newOrder: ResumeData[K]) => {
    setData(prev => ({ ...prev, [key]: newOrder }));
  }, []);

  const saveCurrentResume = useCallback((name?: string) => {
    const resumeName = name || data.basicInfo.name || data.basicInfo.nameEn || 'Untitled';
    if (currentId) {
      setEntries(prev => prev.map(e =>
        e.id === currentId
          ? { ...e, name: resumeName, updatedAt: Date.now(), data: { ...data } }
          : e
      ));
    } else {
      const newId = genId();
      const newEntry: ResumeEntry = {
        id: newId,
        name: resumeName,
        updatedAt: Date.now(),
        data: { ...data },
      };
      setEntries(prev => [newEntry, ...prev]);
      setCurrentId(newId);
    }
  }, [currentId, data]);

  const createNewResume = useCallback(() => {
    const newId = genId();
    const newEntry: ResumeEntry = {
      id: newId,
      name: lang === 'zh' ? '新简历' : 'New Resume',
      updatedAt: Date.now(),
      data: JSON.parse(JSON.stringify(emptyData)),
    };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentId(newId);
    setData(newEntry.data);
  }, [lang]);

  const loadResume = useCallback((id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setCurrentId(id);
      setData(entry.data);
    }
  }, [entries]);

  const deleteResume = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      if (currentId === id) {
        if (next.length > 0) {
          setCurrentId(next[0].id);
          setData(next[0].data);
        } else {
          setCurrentId(null);
          setData(defaultData);
        }
      }
      return next;
    });
  }, [currentId]);

  const renameResume = useCallback((id: string, name: string) => {
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, name, updatedAt: Date.now() } : e
    ));
  }, []);

  const duplicateResume = useCallback((id: string) => {
    const source = entries.find(e => e.id === id);
    if (!source) return;
    const newId = genId();
    const newEntry: ResumeEntry = {
      id: newId,
      name: `${source.name} (copy)`,
      updatedAt: Date.now(),
      data: JSON.parse(JSON.stringify(source.data)),
    };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentId(newId);
    setData(newEntry.data);
  }, [entries]);

  const restoreEntries = useCallback((newEntries: ResumeEntry[]) => {
    setEntries(newEntries);
    if (newEntries.length > 0) {
      setCurrentId(newEntries[0].id);
      setData(newEntries[0].data);
    } else {
      setCurrentId(null);
      setData(defaultData);
    }
  }, []);

  return (
    <ResumeContext.Provider value={{
      data, setData, lang, setLang, template, setTemplate,
      entries, currentId,
      saveCurrentResume, createNewResume, loadResume,
      deleteResume, renameResume, duplicateResume, restoreEntries,
      autoSave, setAutoSave, lastSavedAt,
      reorderItems,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
