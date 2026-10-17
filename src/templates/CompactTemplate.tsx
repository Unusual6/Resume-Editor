import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#0369a1';

const CompactTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, bio, l, ld, font, t, renderFormattedText } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Header - compact two-row */}
      <div className="px-8 pt-6 pb-3" style={{ borderBottom: `2px solid ${ACCENT}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {bio.photo && (
              <img src={bio.photo} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            )}
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#0c4a6e' }}>{l('name', 'nameEn', bio)}</h1>
              <p className="text-xs" style={{ color: ACCENT }}>{l('title', 'titleEn', bio)}</p>
            </div>
          </div>
          <div className="text-right text-[10px]" style={{ color: '#64748b' }}>
            {bio.email && <p>{bio.email}</p>}
            {bio.phone && <p>{bio.phone}</p>}
            {l('address', 'addressEn', bio) && <p>{l('address', 'addressEn', bio)}</p>}
          </div>
        </div>
        {l('summary', 'summaryEn', bio) && (
          <p className="mt-2 text-[11px] leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('summary', 'summaryEn', bio))}</p>
        )}
      </div>

      {/* Two-column body */}
      <div className="flex px-8 py-4 gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-4">
          {data.experiences.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('preview.experience')}</h2>
              {data.experiences.map(exp => (
                <div key={exp.id} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold" style={{ color: '#1e293b' }}>{l('company', 'companyEn', exp)}</span>
                    <span className="text-[9px]" style={{ color: '#94a3b8' }}>{exp.startDate}~{ld(exp.endDate)}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: '#64748b' }}>{l('position', 'positionEn', exp)}</p>
                  {l('description', 'descriptionEn', exp) && <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('description', 'descriptionEn', exp))}</p>}
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('preview.project')}</h2>
              {data.projects.map(proj => (
                <div key={proj.id} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold" style={{ color: '#1e293b' }}>{l('name', 'nameEn', proj)}</span>
                    <span className="text-[9px]" style={{ color: '#94a3b8' }}>{proj.startDate}~{ld(proj.endDate)}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: '#64748b' }}>{[l('role', 'roleEn', proj), proj.techStack].filter(Boolean).join(' · ')}</p>
                  {l('description', 'descriptionEn', proj) && <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('description', 'descriptionEn', proj))}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="w-[55mm] space-y-4">
          {data.educations.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('preview.education')}</h2>
              {data.educations.map(edu => (
                <div key={edu.id} className="mb-2 last:mb-0">
                  <p className="text-xs font-semibold" style={{ color: '#1e293b' }}>{l('school', 'schoolEn', edu)}</p>
                  <p className="text-[10px]" style={{ color: '#64748b' }}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
                  <p className="text-[9px]" style={{ color: '#94a3b8' }}>{edu.startDate} ~ {ld(edu.endDate)}</p>
                </div>
              ))}
            </div>
          )}

          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('preview.skills')}</h2>
              <div className="space-y-1">
                {data.skills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: '#334155' }}>{l('name', 'nameEn', skill)}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="w-1.5 h-1.5 rounded-full" style={{ background: n <= skill.level ? ACCENT : `${ACCENT}20` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CompactTemplate;
