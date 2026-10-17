import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#2563eb';

const ClassicTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, isZh, bio, l, ld, font, t, renderFormattedText } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Header */}
      <div className="px-10 pt-8 pb-5" style={{ borderBottom: `3px solid ${ACCENT}` }}>
        <div className="flex items-center gap-5">
          {bio.photo && (
            <img src={bio.photo} alt="" className="w-20 h-20 rounded-full object-cover flex-shrink-0" style={{ border: `2px solid ${ACCENT}20` }} />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-wide" style={{ color: '#1e293b' }}>{l('name', 'nameEn', bio)}</h1>
            <p className="text-sm mt-0.5" style={{ color: ACCENT }}>{l('title', 'titleEn', bio)}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[11px]" style={{ color: '#64748b' }}>
              {bio.email && <span>{bio.email}</span>}
              {bio.phone && <span>{bio.phone}</span>}
              {l('address', 'addressEn', bio) && <span>{l('address', 'addressEn', bio)}</span>}
            </div>
          </div>
        </div>
        {l('summary', 'summaryEn', bio) && (
          <p className="mt-3 text-xs leading-relaxed" style={{ color: '#475569' }}>{renderFormattedText(l('summary', 'summaryEn', bio))}</p>
        )}
      </div>

      <div className="px-10 py-5 space-y-5">
        {data.experiences.length > 0 && (
          <Section title={t('preview.experience')} accent={ACCENT}>
            {data.experiences.map(exp => (
              <Entry key={exp.id}
                left={l('company', 'companyEn', exp)}
                right={`${exp.startDate} ~ ${ld(exp.endDate)}`}
                sub={l('position', 'positionEn', exp)}
                desc={renderFormattedText(l('description', 'descriptionEn', exp))}
              />
            ))}
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title={t('preview.project')} accent={ACCENT}>
            {data.projects.map(proj => (
              <Entry key={proj.id}
                left={l('name', 'nameEn', proj)}
                right={`${proj.startDate} ~ ${ld(proj.endDate)}`}
                sub={[l('role', 'roleEn', proj), proj.techStack].filter(Boolean).join(' · ')}
                desc={renderFormattedText(l('description', 'descriptionEn', proj))}
              />
            ))}
          </Section>
        )}

        {data.educations.length > 0 && (
          <Section title={t('preview.education')} accent={ACCENT}>
            {data.educations.map(edu => (
              <Entry key={edu.id}
                left={l('school', 'schoolEn', edu)}
                right={`${edu.startDate} ~ ${ld(edu.endDate)}`}
                sub={[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}
                desc={renderFormattedText(l('description', 'descriptionEn', edu))}
              />
            ))}
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title={t('preview.skills')} accent={ACCENT}>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {data.skills.map(skill => (
                <span key={skill.id} className="text-xs" style={{ color: '#334155' }}>
                  {l('name', 'nameEn', skill)}
                  <span className="ml-1.5" style={{ color: ACCENT, fontSize: '10px' }}>
                    {'●'.repeat(skill.level)}{'○'.repeat(5 - skill.level)}
                  </span>
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
});

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5 pb-1" style={{ color: accent, borderBottom: `1.5px solid ${accent}20` }}>{title}</h2>
      {children}
    </div>
  );
}

function Entry({ left, right, sub, desc }: { left: string; right: string; sub: string; desc: React.ReactNode }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{left}</span>
        <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: '#94a3b8' }}>{right}</span>
      </div>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{sub}</p>}
      {desc && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{desc}</p>}
    </div>
  );
}

export default ClassicTemplate;
