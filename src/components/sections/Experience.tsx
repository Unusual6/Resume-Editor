import { useTranslation } from 'react-i18next';
import { useResume } from '../../context/ResumeContext';
import { Experience } from '../../types/resume';
import SortableList from '../SortableList';
import FormattedTextarea from '../FormattedTextarea';

export default function ExperienceSection() {
  const { t } = useTranslation();
  const { data, setData, reorderItems } = useResume();

  const add = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '', companyEn: '', position: '', positionEn: '',
      startDate: '', endDate: '', description: '', descriptionEn: '',
    };
    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const update = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const remove = (id: string) => {
    setData(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="text-sf-muted">#</span> {t('form.experience')}
        </h3>
        <button onClick={add} className="text-xs text-primary hover:text-secondary font-mono">
          + {t('form.addExperience')}
        </button>
      </div>
      <SortableList
        items={data.experiences}
        onReorder={(items) => reorderItems('experiences', items)}
        renderItem={(exp, idx) => (
          <div className="border border-sf-border rounded p-3 space-y-2 bg-sf-card">
            <div className="flex justify-between items-center">
              <span className="text-xs text-sf-muted font-mono">#{idx + 1}</span>
              <button onClick={() => remove(exp.id)} className="text-xs text-red-400 hover:text-red-500 font-mono">
                {t('form.delete')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input id={`field-${exp.id}-company`} className="input-field" placeholder={t('placeholder.company')}
                value={exp.company} onChange={e => update(exp.id, 'company', e.target.value)} />
              <input id={`field-${exp.id}-companyEn`} className="input-field" placeholder="Company (EN)"
                value={exp.companyEn} onChange={e => update(exp.id, 'companyEn', e.target.value)} />
              <input id={`field-${exp.id}-position`} className="input-field" placeholder={t('placeholder.position')}
                value={exp.position} onChange={e => update(exp.id, 'position', e.target.value)} />
              <input id={`field-${exp.id}-positionEn`} className="input-field" placeholder="Position (EN)"
                value={exp.positionEn} onChange={e => update(exp.id, 'positionEn', e.target.value)} />
              <input id={`field-${exp.id}-startDate`} className="input-field" placeholder={t('form.startDate')} type="month"
                value={exp.startDate} onChange={e => update(exp.id, 'startDate', e.target.value)} />
              <input id={`field-${exp.id}-endDate`} className="input-field" placeholder={t('form.endDate')} type="month"
                value={exp.endDate} onChange={e => update(exp.id, 'endDate', e.target.value)} />
            </div>
            <FormattedTextarea id={`field-${exp.id}-description`} value={exp.description} onChange={v => update(exp.id, 'description', v)}
              placeholder={t('placeholder.description')} rows={6} />
            <FormattedTextarea id={`field-${exp.id}-descriptionEn`} value={exp.descriptionEn} onChange={v => update(exp.id, 'descriptionEn', v)}
              placeholder="Description (EN)" rows={6} />
          </div>
        )}
      />
    </div>
  );
}
