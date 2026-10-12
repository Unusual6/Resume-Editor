import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#0f766e';

const ProfessionalTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, bio, l, ld, font, t } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Left accent bar */}
      <div className="h-full absolute left-0 top-0 w-[4px]" style={{ background: ACCENT }} />

      <div className="pl-6">
        {/* Header */}
        <div className="pr-10 pt-8 pb-4" style={{ borderBottom: `1px solid #e2e8f0` }}>
          <div className="flex items-center gap-5">
            {bio.photo && (
              <img src={bio.photo} alt="" className="w-18 h-18 rounded-lg object-cover flex-shrink-0" style={{ width: 68, height: 68 }} />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>{l('name', 'nameEn', bio)}</h1>
              <p className="text-sm mt-0.5" style={{ color: ACCENT }}>{l('title', 'titleEn', bio)}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[11px]" style={{ color: '#64748b' }}>
                {bio.email && <span>{bio.email}</span>}
                {bio.phone && <span>{bio.phone}</span>}
                {l('address', 'addressEn', bio) && <span>{l('address', 'addressEn', bio)}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="pr-10 py-5 space-y-5">
          {l('summary', 'summaryEn', bio) && (
            <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{l('summary', 'summaryEn', bio)}</p>
          )}

          {data.experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: ACCENT }}>{t('preview.experience')}</h2>
              {data.experiences.map(exp => (
                <div key={exp.id} className="mb-2.5 last:mb-0 pl-3" style={{ borderLeft: `2px solid ${ACCENT}20` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{l('company', 'companyEn', exp)}</span>
                    <span className="text-[10px]" style={{ color: '#94a3b8' }}>{exp.startDate} ~ {ld(exp.endDate)}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{l('position', 'positionEn', exp)}</p>
                  {l('description', 'descriptionEn', exp) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{l('description', 'descriptionEn', exp)}</p>}
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: ACCENT }}>{t('preview.project')}</h2>
              {data.projects.map(proj => (
                <div key={proj.id} className="mb-2.5 last:mb-0 pl-3" style={{ borderLeft: `2px solid ${ACCENT}20` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{l('name', 'nameEn', proj)}</span>
                    <span className="text-[10px]" style={{ color: '#94a3b8' }}>{proj.startDate} ~ {ld(proj.endDate)}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{[l('role', 'roleEn', proj), proj.techStack].filter(Boolean).join(' · ')}</p>
                  {l('description', 'descriptionEn', proj) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{l('description', 'descriptionEn', proj)}</p>}
                </div>
              ))}
            </div>
          )}

          {data.educations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: ACCENT }}>{t('preview.education')}</h2>
              {data.educations.map(edu => (
                <div key={edu.id} className="mb-2.5 last:mb-0 pl-3" style={{ borderLeft: `2px solid ${ACCENT}20` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{l('school', 'schoolEn', edu)}</span>
                    <span className="text-[10px]" style={{ color: '#94a3b8' }}>{edu.startDate} ~ {ld(edu.endDate)}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: ACCENT }}>{t('preview.skills')}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {data.skills.map(skill => (
                  <span key={skill.id} className="text-xs px-2 py-0.5 rounded" style={{ color: ACCENT, background: `${ACCENT}10` }}>
                    {l('name', 'nameEn', skill)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProfessionalTemplate;
