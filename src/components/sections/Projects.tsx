import { useTranslation } from 'react-i18next';
import { useResume } from '../../context/ResumeContext';
import { Project } from '../../types/resume';
import SortableList from '../SortableList';

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { data, setData, reorderItems } = useResume();

  const add = () => {
    const p: Project = {
      id: `proj-${Date.now()}`,
      name: '', nameEn: '', role: '', roleEn: '',
      startDate: '', endDate: '', techStack: '',
      description: '', descriptionEn: '',
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, p] }));
  };

  const update = (id: string, field: keyof Project, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
    }));
  };

  const remove = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <span className="text-sf-muted">#</span> {t('form.project')}
        </h3>
        <button onClick={add} className="text-xs text-primary hover:text-secondary font-mono">
          + {t('form.addProject')}
        </button>
      </div>
      <SortableList
        items={data.projects}
        onReorder={(items) => reorderItems('projects', items)}
        renderItem={(proj, idx) => (
          <div className="border border-sf-border rounded p-3 space-y-2 bg-sf-card">
            <div className="flex justify-between items-center">
              <span className="text-xs text-sf-muted font-mono">#{idx + 1}</span>
              <button onClick={() => remove(proj.id)} className="text-xs text-red-400 hover:text-red-500 font-mono">
                {t('form.delete')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" placeholder={t('placeholder.projectName')}
                value={proj.name} onChange={e => update(proj.id, 'name', e.target.value)} />
              <input className="input-field" placeholder="Project Name (EN)"
                value={proj.nameEn} onChange={e => update(proj.id, 'nameEn', e.target.value)} />
              <input className="input-field" placeholder={t('placeholder.role')}
                value={proj.role} onChange={e => update(proj.id, 'role', e.target.value)} />
              <input className="input-field" placeholder="Role (EN)"
                value={proj.roleEn} onChange={e => update(proj.id, 'roleEn', e.target.value)} />
              <input className="input-field" placeholder={t('form.startDate')} type="month"
                value={proj.startDate} onChange={e => update(proj.id, 'startDate', e.target.value)} />
              <input className="input-field" placeholder={t('form.endDate')} type="month"
                value={proj.endDate} onChange={e => update(proj.id, 'endDate', e.target.value)} />
            </div>
            <input className="input-field" placeholder={t('placeholder.techStack')}
              value={proj.techStack} onChange={e => update(proj.id, 'techStack', e.target.value)} />
            <textarea className="input-field resize-none" rows={3} placeholder={t('placeholder.description')}
              value={proj.description} onChange={e => update(proj.id, 'description', e.target.value)} />
            <textarea className="input-field resize-none" rows={3} placeholder="Description (EN)"
              value={proj.descriptionEn} onChange={e => update(proj.id, 'descriptionEn', e.target.value)} />
          </div>
        )}
      />
    </div>
  );
}
