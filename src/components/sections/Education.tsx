import { useTranslation } from 'react-i18next';
import { useResume } from '../../context/ResumeContext';
import { Education } from '../../types/resume';
import SortableList from '../SortableList';
import FormattedTextarea from '../FormattedTextarea';

export default function EducationSection() {
  const { t } = useTranslation();
  const { data, setData, reorderItems } = useResume();

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: '', schoolEn: '', degree: '', degreeEn: '',
      major: '', majorEn: '', startDate: '', endDate: '',
      description: '', descriptionEn: '',
    };
    setData(prev => ({ ...prev, educations: [...prev.educations, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.filter(e => e.id !== id),
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="text-sf-muted">#</span> {t('form.education')}
        </h3>
        <button onClick={addEducation} className="text-xs text-primary hover:text-secondary font-mono">
          + {t('form.addEducation')}
        </button>
      </div>
      <SortableList
        items={data.educations}
        onReorder={(items) => reorderItems('educations', items)}
        renderItem={(edu, idx) => (
          <div className="border border-sf-border rounded p-3 space-y-2 bg-sf-card">
            <div className="flex justify-between items-center">
              <span className="text-xs text-sf-muted font-mono">#{idx + 1}</span>
              <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-400 hover:text-red-500 font-mono">
                {t('form.delete')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" placeholder={t('placeholder.school')}
                value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
              <input className="input-field" placeholder="School (EN)"
                value={edu.schoolEn} onChange={e => updateEducation(edu.id, 'schoolEn', e.target.value)} />
              <input className="input-field" placeholder={t('placeholder.degree')}
                value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
              <input className="input-field" placeholder="Degree (EN)"
                value={edu.degreeEn} onChange={e => updateEducation(edu.id, 'degreeEn', e.target.value)} />
              <input className="input-field" placeholder={t('placeholder.major')}
                value={edu.major} onChange={e => updateEducation(edu.id, 'major', e.target.value)} />
              <input className="input-field" placeholder="Major (EN)"
                value={edu.majorEn} onChange={e => updateEducation(edu.id, 'majorEn', e.target.value)} />
              <input className="input-field" placeholder={t('form.startDate')} type="month"
                value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
              <input className="input-field" placeholder={t('form.endDate')} type="month"
                value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
            </div>
            <FormattedTextarea value={edu.description} onChange={v => updateEducation(edu.id, 'description', v)}
              placeholder={t('placeholder.description')} rows={4} />
            <FormattedTextarea value={edu.descriptionEn} onChange={v => updateEducation(edu.id, 'descriptionEn', v)}
              placeholder="Description (EN)" rows={4} />
          </div>
        )}
      />
    </div>
  );
}
