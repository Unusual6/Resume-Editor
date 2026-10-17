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
    <div className="h-full overflow-y-auto custom-scrollbar p-5 space-y-5">
      {/* Basic Info */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="text-sf-muted">#</span> {t('form.basicInfo')}
        </h3>
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
            <textarea className="input-field resize-none" rows={5} placeholder={t('placeholder.summary')}
              value={bio.summary} onChange={e => updateBio('summary', e.target.value)} />
            <textarea className="input-field resize-none" rows={5} placeholder="Summary (EN)"
              value={bio.summaryEn} onChange={e => updateBio('summaryEn', e.target.value)} />
          </div>
          <PhotoUpload />
        </div>
      </section>

      <div className="border-t border-sf-border" />
      <EducationSection />
      <div className="border-t border-sf-border" />
      <ExperienceSection />
      <div className="border-t border-sf-border" />
      <ProjectsSection />
      <div className="border-t border-sf-border" />
      <SkillsSection />
    </div>
  );
}
