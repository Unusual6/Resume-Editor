import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#7c6f64';
const SIDEBAR_BG = '#faf8f5';

const ElegantTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, isZh, bio, l, ld, serifFont, t, renderFormattedText, fk } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white flex" style={{ fontFamily: serifFont }}>
      {/* Sidebar - warm light */}
      <div className="w-[68mm] flex-shrink-0 flex flex-col" style={{ background: SIDEBAR_BG, borderRight: `1px solid #e8e2da` }}>
        <div className="px-5 pt-7 pb-4">
          {bio.photo && (
            <div className="flex justify-center mb-3">
              <img src={bio.photo} alt="" className="w-24 h-24 rounded-lg object-cover" style={{ border: `2px solid ${ACCENT}30` }} />
            </div>
          )}
          <h1 className="text-lg font-bold" style={{ color: '#3d3530' }} {...fk('name', 'nameEn')}>{l('name', 'nameEn', bio)}</h1>
          <p className="text-xs mt-0.5 italic" style={{ color: ACCENT }} {...fk('title', 'titleEn')}>{l('title', 'titleEn', bio)}</p>
        </div>

        <div className="px-5 space-y-1 text-[11px]" style={{ color: '#7a7068' }}>
          {bio.email && <p data-field="email">{bio.email}</p>}
          {bio.phone && <p data-field="phone">{bio.phone}</p>}
          {l('address', 'addressEn', bio) && <p data-field={isZh ? 'address' : 'addressEn'}>{l('address', 'addressEn', bio)}</p>}
        </div>

        {data.skills.length > 0 && (
          <div className="px-5 mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.skills')}</h2>
            <div className="space-y-1.5">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: '#3d3530' }} {...fk('name', 'nameEn', skill.id)}>{l('name', 'nameEn', skill)}</span>
                  <span style={{ color: ACCENT, fontSize: 9 }}>{'◆'.repeat(skill.level)}{'◇'.repeat(5 - skill.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div className="px-5 mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-2.5 last:mb-0">
                <p className="text-[11px] font-semibold" style={{ color: '#3d3530' }} {...fk('school', 'schoolEn', edu.id)}>{l('school', 'schoolEn', edu)}</p>
                <p className="text-[10px]" style={{ color: '#8a8078' }} {...fk('degree', 'degreeEn', edu.id)}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
                <p className="text-[10px]" style={{ color: '#a89e94' }}>{edu.startDate} — {ld(edu.endDate)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-7 py-7 space-y-5">
        {l('summary', 'summaryEn', bio) && (
          <p className="text-xs leading-loose italic" style={{ color: '#6b6259' }} {...fk('summary', 'summaryEn')}>{renderFormattedText(l('summary', 'summaryEn', bio))}</p>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#2d2722' }} {...fk('company', 'companyEn', exp.id)}>{l('company', 'companyEn', exp)}</span>
                  <span className="text-[10px]" style={{ color: '#a89e94' }}>{exp.startDate} — {ld(exp.endDate)}</span>
                </div>
                <p className="text-[11px] italic mt-0.5" style={{ color: ACCENT }} {...fk('position', 'positionEn', exp.id)}>{l('position', 'positionEn', exp)}</p>
                {l('description', 'descriptionEn', exp) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#5a534b' }} {...fk('description', 'descriptionEn', exp.id)}>{renderFormattedText(l('description', 'descriptionEn', exp))}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: ACCENT, borderBottom: `1px solid ${ACCENT}25` }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: '#2d2722' }} {...fk('name', 'nameEn', proj.id)}>{l('name', 'nameEn', proj)}</span>
                  <span className="text-[10px]" style={{ color: '#a89e94' }}>{proj.startDate} — {ld(proj.endDate)}</span>
                </div>
                {proj.techStack && <p className="text-[10px] mt-0.5" style={{ color: '#8a8078' }} {...fk('techStack', 'techStack', proj.id)}>{proj.techStack}</p>}
                {l('description', 'descriptionEn', proj) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#5a534b' }} {...fk('description', 'descriptionEn', proj.id)}>{renderFormattedText(l('description', 'descriptionEn', proj))}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ElegantTemplate;
