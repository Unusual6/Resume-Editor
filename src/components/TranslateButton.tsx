import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import { translateBatch } from '../utils/translate';
import type { ResumeData } from '../types/resume';

export default function TranslateButton() {
  const { t } = useTranslation();
  const { data, setData, lang } = useResume();
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const extractFields = useCallback((d: ResumeData, sourceLang: 'zh' | 'en') => {
    const fields: { path: string; value: string }[] = [];
    const bio = d.basicInfo;

    if (sourceLang === 'zh') {
      if (bio.name) fields.push({ path: 'basicInfo.nameEn', value: bio.name });
      if (bio.title) fields.push({ path: 'basicInfo.titleEn', value: bio.title });
      if (bio.address) fields.push({ path: 'basicInfo.addressEn', value: bio.address });
      if (bio.summary) fields.push({ path: 'basicInfo.summaryEn', value: bio.summary });
    } else {
      if (bio.nameEn) fields.push({ path: 'basicInfo.name', value: bio.nameEn });
      if (bio.titleEn) fields.push({ path: 'basicInfo.title', value: bio.titleEn });
      if (bio.addressEn) fields.push({ path: 'basicInfo.address', value: bio.addressEn });
      if (bio.summaryEn) fields.push({ path: 'basicInfo.summary', value: bio.summaryEn });
    }

    d.educations.forEach((edu, i) => {
      if (sourceLang === 'zh') {
        if (edu.school) fields.push({ path: `educations[${i}].schoolEn`, value: edu.school });
        if (edu.degree) fields.push({ path: `educations[${i}].degreeEn`, value: edu.degree });
        if (edu.major) fields.push({ path: `educations[${i}].majorEn`, value: edu.major });
        if (edu.description) fields.push({ path: `educations[${i}].descriptionEn`, value: edu.description });
      } else {
        if (edu.schoolEn) fields.push({ path: `educations[${i}].school`, value: edu.schoolEn });
        if (edu.degreeEn) fields.push({ path: `educations[${i}].degree`, value: edu.degreeEn });
        if (edu.majorEn) fields.push({ path: `educations[${i}].major`, value: edu.majorEn });
        if (edu.descriptionEn) fields.push({ path: `educations[${i}].description`, value: edu.descriptionEn });
      }
    });

    d.experiences.forEach((exp, i) => {
      if (sourceLang === 'zh') {
        if (exp.company) fields.push({ path: `experiences[${i}].companyEn`, value: exp.company });
        if (exp.position) fields.push({ path: `experiences[${i}].positionEn`, value: exp.position });
        if (exp.description) fields.push({ path: `experiences[${i}].descriptionEn`, value: exp.description });
      } else {
        if (exp.companyEn) fields.push({ path: `experiences[${i}].company`, value: exp.companyEn });
        if (exp.positionEn) fields.push({ path: `experiences[${i}].position`, value: exp.positionEn });
        if (exp.descriptionEn) fields.push({ path: `experiences[${i}].description`, value: exp.descriptionEn });
      }
    });

    d.projects.forEach((proj, i) => {
      if (sourceLang === 'zh') {
        if (proj.name) fields.push({ path: `projects[${i}].nameEn`, value: proj.name });
        if (proj.role) fields.push({ path: `projects[${i}].roleEn`, value: proj.role });
        if (proj.description) fields.push({ path: `projects[${i}].descriptionEn`, value: proj.description });
      } else {
        if (proj.nameEn) fields.push({ path: `projects[${i}].name`, value: proj.nameEn });
        if (proj.roleEn) fields.push({ path: `projects[${i}].role`, value: proj.roleEn });
        if (proj.descriptionEn) fields.push({ path: `projects[${i}].description`, value: proj.descriptionEn });
      }
    });

    d.skills.forEach((skill, i) => {
      if (sourceLang === 'zh') {
        if (skill.name) fields.push({ path: `skills[${i}].nameEn`, value: skill.name });
      } else {
        if (skill.nameEn) fields.push({ path: `skills[${i}].name`, value: skill.nameEn });
      }
    });

    return fields;
  }, []);

  const applyTranslations = useCallback((
    fields: { path: string; value: string }[],
    translations: string[]
  ) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ResumeData;
      fields.forEach((field, i) => {
        const translated = translations[i];
        if (!translated) return;
        const match = field.path.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
        if (match) {
          const [, arrayKey, indexStr, prop] = match;
          const arr = next[arrayKey as keyof ResumeData] as any[];
          if (arr && arr[Number(indexStr)]) {
            arr[Number(indexStr)][prop] = translated;
          }
        } else {
          const [obj, prop] = field.path.split('.');
          (next as any)[obj][prop] = translated;
        }
      });
      return next;
    });
  }, [setData]);

  const handleTranslate = async () => {
    const sourceLang = lang;
    const targetLang = lang === 'zh' ? 'en' : 'zh';
    const fields = extractFields(data, sourceLang);
    if (fields.length === 0) return;

    setTranslating(true);
    setProgress({ current: 0, total: fields.length });

    try {
      const texts = fields.map(f => f.value);
      const translations = await translateBatch(texts, sourceLang, targetLang, (current, total) => {
        setProgress({ current, total });
      });
      applyTranslations(fields, translations);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTranslating(false);
    }
  };

  const targetLang = lang === 'zh' ? 'EN' : '中文';

  return (
    <button
      onClick={handleTranslate}
      disabled={translating}
      className={`py-1 text-xs font-medium rounded transition-colors font-mono flex-shrink-0
        ${translating
          ? 'bg-amber-500/20 text-amber-400 cursor-wait border border-amber-500/30'
          : 'text-primary border border-primary/30 hover:bg-primary/10'
        }`}
      title={t('translate.hint')}
      style={{ width: '120px' }}
    >
      <span className="block truncate text-center">
        {translating
          ? `${t('translate.translating')} ${progress.current}/${progress.total}`
          : `${t('translate.button')} → ${targetLang}`
        }
      </span>
    </button>
  );
}
