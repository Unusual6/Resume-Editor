import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#7c3aed';
const HEADER_BG = 'linear-gradient(135deg, #ede9fe 0%, #f0f9ff 100%)';

const CreativeTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, isZh, bio, l, ld, font, t, renderFormattedText, fk } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Header with gradient */}
      <div className="px-10 pt-8 pb-5" style={{ background: HEADER_BG }}>
        <div className="flex items-center gap-5">
          {bio.photo && (
            <img src={bio.photo} alt="" className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" style={{ border: `2px solid ${ACCENT}25` }} />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: '#1e1b4b' }} {...fk('name', 'nameEn')}>{l('name', 'nameEn', bio)}</h1>
            <p className="text-sm mt-0.5" style={{ color: ACCENT }} {...fk('title', 'titleEn')}>{l('title', 'titleEn', bio)}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[11px]" style={{ color: '#6366f1' }}>
              {bio.email && <span data-field="email">{bio.email}</span>}
              {bio.phone && <span data-field="phone">{bio.phone}</span>}
              {l('address', 'addressEn', bio) && <span data-field={isZh ? 'address' : 'addressEn'}>{l('address', 'addressEn', bio)}</span>}
            </div>
          </div>
        </div>
        {l('summary', 'summaryEn', bio) && (
          <p className="mt-3 text-xs leading-relaxed" style={{ color: '#4338ca' }} {...fk('summary', 'summaryEn')}>{renderFormattedText(l('summary', 'summaryEn', bio))}</p>
        )}
      </div>

      <div className="px-10 py-5 space-y-5">
        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}15` }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }} {...fk('company', 'companyEn', exp.id)}>{l('company', 'companyEn', exp)}</span>
                  <span className="text-[10px]" style={{ color: '#a5b4fc' }}>{exp.startDate} ~ {ld(exp.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#7c3aed' }} {...fk('position', 'positionEn', exp.id)}>{l('position', 'positionEn', exp)}</p>
                {l('description', 'descriptionEn', exp) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }} {...fk('description', 'descriptionEn', exp.id)}>{renderFormattedText(l('description', 'descriptionEn', exp))}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}15` }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }} {...fk('name', 'nameEn', proj.id)}>{l('name', 'nameEn', proj)}</span>
                  <span className="text-[10px]" style={{ color: '#a5b4fc' }}>{proj.startDate} ~ {ld(proj.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#7c3aed' }} {...fk('role', 'roleEn', proj.id)}>{[l('role', 'roleEn', proj), proj.techStack].filter(Boolean).join(' · ')}</p>
                {l('description', 'descriptionEn', proj) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }} {...fk('description', 'descriptionEn', proj.id)}>{renderFormattedText(l('description', 'descriptionEn', proj))}</p>}
              </div>
            ))}
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}15` }}>{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-2.5 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }} {...fk('school', 'schoolEn', edu.id)}>{l('school', 'schoolEn', edu)}</span>
                  <span className="text-[10px]" style={{ color: '#a5b4fc' }}>{edu.startDate} ~ {ld(edu.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#6366f1' }} {...fk('degree', 'degreeEn', edu.id)}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `2px solid ${ACCENT}15` }}>{t('preview.skills')}</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map(skill => (
                <span key={skill.id} className="text-[11px] px-2.5 py-0.5 rounded-full" style={{ color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }} {...fk('name', 'nameEn', skill.id)}>
                  {l('name', 'nameEn', skill)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default CreativeTemplate;
