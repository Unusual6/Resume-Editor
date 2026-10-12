import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { useTranslation } from 'react-i18next';

const ModernTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { lang, data } = useResume();
  const { t } = useTranslation();
  const bio = data.basicInfo;
  const isZh = lang === 'zh';

  const name = isZh ? bio.name : (bio.nameEn || bio.name);
  const title = isZh ? bio.title : (bio.titleEn || bio.title);
  const address = isZh ? bio.address : (bio.addressEn || bio.address);
  const summary = isZh ? bio.summary : (bio.summaryEn || bio.summary);
  const font = isZh
    ? '"Noto Sans SC", "PingFang SC", sans-serif'
    : '"Inter", "Helvetica Neue", sans-serif';

  return (
    <div ref={ref} className="resume-a4 bg-white flex" style={{ fontFamily: font }}>
      {/* Sidebar */}
      <div className="w-[72mm] bg-gray-900 text-white flex-shrink-0 flex flex-col">
        {/* Photo */}
        {bio.photo && (
          <div className="p-6 pb-0 flex justify-center">
            <img src={bio.photo} alt="" className="w-28 h-28 rounded-full object-cover border-3 border-white/20" />
          </div>
        )}

        {/* Name & Title */}
        <div className="px-6 pt-4 pb-5">
          <h1 className="text-xl font-bold leading-tight">{name}</h1>
          <p className="text-xs text-gray-300 mt-1 font-medium tracking-wide">{title}</p>
        </div>

        {/* Contact */}
        <div className="px-6 space-y-2 text-xs text-gray-300">
          {bio.email && <p className="flex items-start gap-2"><span className="text-gray-500 mt-px">✉</span><span className="break-all">{bio.email}</span></p>}
          {bio.phone && <p className="flex items-start gap-2"><span className="text-gray-500 mt-px">☎</span><span>{bio.phone}</span></p>}
          {address && <p className="flex items-start gap-2"><span className="text-gray-500 mt-px">⌂</span><span>{address}</span></p>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="px-6 mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>{t('preview.skills')}</h2>
            <div className="space-y-2">
              {data.skills.map(skill => (
                <div key={skill.id}>
                  <p className="text-xs text-gray-200">{isZh ? skill.name : (skill.nameEn || skill.name)}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={`h-1 flex-1 rounded-full ${n <= skill.level ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {data.educations.length > 0 && (
          <div className="px-6 mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <p className="text-xs font-semibold text-gray-200">{isZh ? edu.school : (edu.schoolEn || edu.school)}</p>
                <p className="text-[10px] text-gray-400">{[isZh ? edu.degree : (edu.degreeEn || edu.degree), isZh ? edu.major : (edu.majorEn || edu.major)].filter(Boolean).join(' · ')}</p>
                <p className="text-[10px] text-gray-500">{edu.startDate} ~ {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 py-8 space-y-5">
        {summary && (
          <div>
            <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1" style={{ borderBottom: '2px solid #111827' }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-900">{isZh ? exp.company : (exp.companyEn || exp.company)}</span>
                  <span className="text-[10px] text-gray-400">{exp.startDate} ~ {exp.endDate}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{isZh ? exp.position : (exp.positionEn || exp.position)}</p>
                {(isZh ? exp.description : exp.descriptionEn) && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{isZh ? exp.description : exp.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 pb-1" style={{ borderBottom: '2px solid #111827' }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-900">{isZh ? proj.name : (proj.nameEn || proj.name)}</span>
                  <span className="text-[10px] text-gray-400">{proj.startDate} ~ {proj.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{[isZh ? proj.role : (proj.roleEn || proj.role), proj.techStack].filter(Boolean).join(' · ')}</p>
                {(isZh ? proj.description : proj.descriptionEn) && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{isZh ? proj.description : proj.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ModernTemplate;
