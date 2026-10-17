import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#0891b2';
const SIDEBAR_BG = '#f0fdfa';

const ModernTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, isZh, bio, l, ld, font, t, renderFormattedText } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white flex" style={{ fontFamily: font }}>
      {/* Sidebar - light color */}
      <div className="w-[70mm] flex-shrink-0 flex flex-col" style={{ background: SIDEBAR_BG }}>
        <div className="px-5 pt-7 pb-4">
          {bio.photo && (
            <div className="flex justify-center mb-4">
              <img src={bio.photo} alt="" className="w-24 h-24 rounded-full object-cover" style={{ border: `2px solid ${ACCENT}30` }} />
            </div>
          )}
          <h1 className="text-xl font-bold" style={{ color: '#134e4a' }}>{l('name', 'nameEn', bio)}</h1>
          <p className="text-xs mt-0.5" style={{ color: ACCENT }}>{l('title', 'titleEn', bio)}</p>
        </div>

        <div className="px-5 space-y-1.5 text-[11px]" style={{ color: '#4b7c78' }}>
          {bio.email && <p>{bio.email}</p>}
          {bio.phone && <p>{bio.phone}</p>}
          {l('address', 'addressEn', bio) && <p>{l('address', 'addressEn', bio)}</p>}
        </div>

        {data.skills.length > 0 && (
          <div className="px-5 mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.skills')}</h2>
            <div className="space-y-1.5">
              {data.skills.map(skill => (
                <div key={skill.id}>
                  <p className="text-[11px]" style={{ color: '#1e3a3a' }}>{l('name', 'nameEn', skill)}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className="h-1 flex-1 rounded-full" style={{ background: n <= skill.level ? ACCENT : `${ACCENT}20` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div className="px-5 mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-2.5 last:mb-0">
                <p className="text-[11px] font-semibold" style={{ color: '#134e4a' }}>{l('school', 'schoolEn', edu)}</p>
                <p className="text-[10px]" style={{ color: '#5f8f8b' }}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
                <p className="text-[10px]" style={{ color: '#85b0ad' }}>{edu.startDate} ~ {ld(edu.endDate)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-7 py-7 space-y-5">
        {l('summary', 'summaryEn', bio) && (
          <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('summary', 'summaryEn', bio))}</p>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `1.5px solid ${ACCENT}25` }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{l('company', 'companyEn', exp)}</span>
                  <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: '#94a3b8' }}>{exp.startDate} ~ {ld(exp.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{l('position', 'positionEn', exp)}</p>
                {l('description', 'descriptionEn', exp) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('description', 'descriptionEn', exp))}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `1.5px solid ${ACCENT}25` }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{l('name', 'nameEn', proj)}</span>
                  <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: '#94a3b8' }}>{proj.startDate} ~ {ld(proj.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{[l('role', 'roleEn', proj), proj.techStack].filter(Boolean).join(' · ')}</p>
                {l('description', 'descriptionEn', proj) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('description', 'descriptionEn', proj))}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ModernTemplate;
