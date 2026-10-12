import { forwardRef } from 'react';
import { useResumeData } from '../utils/useResumeData';

const ACCENT = '#6b7280';

const MinimalTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { data, bio, l, ld, font, t } = useResumeData();

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      <div className="px-12 pt-12 pb-5 text-center">
        {bio.photo && (
          <div className="flex justify-center mb-3">
            <img src={bio.photo} alt="" className="w-18 h-18 rounded-full object-cover" style={{ width: 72, height: 72 }} />
          </div>
        )}
        <h1 className="text-2xl font-light tracking-[0.15em]" style={{ color: '#1f2937' }}>{l('name', 'nameEn', bio)}</h1>
        <p className="text-[11px] mt-1.5 tracking-widest" style={{ color: '#9ca3af' }}>{l('title', 'titleEn', bio)}</p>
        <div className="flex items-center justify-center gap-3 mt-2.5 text-[10px]" style={{ color: '#9ca3af' }}>
          {bio.email && <span>{bio.email}</span>}
          {bio.phone && <><span style={{ color: '#d1d5db' }}>·</span><span>{bio.phone}</span></>}
          {l('address', 'addressEn', bio) && <><span style={{ color: '#d1d5db' }}>·</span><span>{l('address', 'addressEn', bio)}</span></>}
        </div>
        <div className="mx-12 mt-5"><div className="h-px" style={{ background: '#e5e7eb' }} /></div>
      </div>

      <div className="px-12 pb-8 space-y-5">
        {l('summary', 'summaryEn', bio) && (
          <p className="text-xs leading-loose text-center" style={{ color: '#6b7280' }}>{l('summary', 'summaryEn', bio)}</p>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: '#9ca3af' }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm" style={{ color: '#1f2937' }}>{l('company', 'companyEn', exp)}</span>
                  <span className="text-[10px]" style={{ color: '#c0c4ca' }}>{exp.startDate} — {ld(exp.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{l('position', 'positionEn', exp)}</p>
                {l('description', 'descriptionEn', exp) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{l('description', 'descriptionEn', exp)}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: '#9ca3af' }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm" style={{ color: '#1f2937' }}>{l('name', 'nameEn', proj)}</span>
                  <span className="text-[10px]" style={{ color: '#c0c4ca' }}>{proj.startDate} — {ld(proj.endDate)}</span>
                </div>
                {proj.techStack && <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{proj.techStack}</p>}
                {l('description', 'descriptionEn', proj) && <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{l('description', 'descriptionEn', proj)}</p>}
              </div>
            ))}
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: '#9ca3af' }}>{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-2.5 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm" style={{ color: '#1f2937' }}>{l('school', 'schoolEn', edu)}</span>
                  <span className="text-[10px]" style={{ color: '#c0c4ca' }}>{edu.startDate} — {ld(edu.endDate)}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{[l('degree', 'degreeEn', edu), l('major', 'majorEn', edu)].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] mb-3" style={{ color: '#9ca3af' }}>{t('preview.skills')}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {data.skills.map(skill => (
                <span key={skill.id} className="text-xs" style={{ color: '#4b5563' }}>{l('name', 'nameEn', skill)}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MinimalTemplate;
