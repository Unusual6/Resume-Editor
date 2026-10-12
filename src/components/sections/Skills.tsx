import { useTranslation } from 'react-i18next';
import { useResume } from '../../context/ResumeContext';
import { Skill } from '../../types/resume';
import SortableList from '../SortableList';

export default function SkillsSection() {
  const { t } = useTranslation();
  const { data, setData, reorderItems } = useResume();

  const add = () => {
    const s: Skill = { id: `skill-${Date.now()}`, name: '', nameEn: '', level: 3 };
    setData(prev => ({ ...prev, skills: [...prev.skills, s] }));
  };

  const update = (id: string, field: keyof Skill, value: string | number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const remove = (id: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{t('form.skill')}</h3>
        <button onClick={add} className="text-xs text-accent hover:underline">+ {t('form.addSkill')}</button>
      </div>
      <SortableList
        items={data.skills}
        onReorder={(items) => reorderItems('skills', items)}
        renderItem={(skill) => (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
            <input className="input-field flex-1" placeholder={t('placeholder.skillName')}
              value={skill.name} onChange={e => update(skill.id, 'name', e.target.value)} />
            <input className="input-field flex-1" placeholder="Name (EN)"
              value={skill.nameEn} onChange={e => update(skill.id, 'nameEn', e.target.value)} />
            <select className="input-field w-20" value={skill.level}
              onChange={e => update(skill.id, 'level', Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>
              ))}
            </select>
            <button onClick={() => remove(skill.id)} className="text-xs text-red-400 hover:text-red-600 px-1">
              {t('form.delete')}
            </button>
          </div>
        )}
      />
    </div>
  );
}
