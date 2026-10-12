import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import PhotoUpload from './PhotoUpload';
import EducationSection from './sections/Education';
import ExperienceSection from './sections/Experience';
import ProjectsSection from './sections/Projects';
import SkillsSection from './sections/Skills';

export default function ResumeForm() {
  const { t } = useTranslation();
  const { data, setData } = useResume();
  const bio = data.basicInfo;

  const updateBio = (field: string, value: string) => {
    setData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, [field]: value } }));
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">{t('form.basicInfo')}</h3>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" placeholder={t('placeholder.name')}
                value={bio.name} onChange={e => updateBio('name', e.target.value)} />
              <input className="input-field" placeholder="Name (EN)"
                value={bio.nameEn} onChange={e => updateBio('nameEn', e.target.value)} />
              <input className="input-field" placeholder={t('placeholder.title')}
                value={bio.title} onChange={e => updateBio('title', e.target.value)} />
              <input className="input-field" placeholder="Title (EN)"
                value={bio.titleEn} onChange={e => updateBio('titleEn', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" placeholder={t('placeholder.email')} type="email"
                value={bio.email} onChange={e => updateBio('email', e.target.value)} />
              <input className="input-field" placeholder={t('placeholder.phone')}
                value={bio.phone} onChange={e => updateBio('phone', e.target.value)} />
            </div>
            <input className="input-field" placeholder={t('placeholder.address')}
              value={bio.address} onChange={e => updateBio('address', e.target.value)} />
            <input className="input-field" placeholder="Address (EN)"
              value={bio.addressEn} onChange={e => updateBio('addressEn', e.target.value)} />
            <textarea className="input-field resize-none" rows={3} placeholder={t('placeholder.summary')}
              value={bio.summary} onChange={e => updateBio('summary', e.target.value)} />
            <textarea className="input-field resize-none" rows={3} placeholder="Summary (EN)"
              value={bio.summaryEn} onChange={e => updateBio('summaryEn', e.target.value)} />
          </div>
          <PhotoUpload />
        </div>
      </section>

      <hr className="border-gray-200" />
      <EducationSection />
      <hr className="border-gray-200" />
      <ExperienceSection />
      <hr className="border-gray-200" />
      <ProjectsSection />
      <hr className="border-gray-200" />
      <SkillsSection />
    </div>
  );
}
