import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '../utils/date';

const ElegantTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { lang, data } = useResume();
  const { t } = useTranslation();
  const bio = data.basicInfo;
  const isZh = lang === 'zh';

  const name = isZh ? bio.name : (bio.nameEn || bio.name);
  const title = isZh ? bio.title : (bio.titleEn || bio.title);
  const address = isZh ? bio.address : (bio.addressEn || bio.address);
  const summary = isZh ? bio.summary : (bio.summaryEn || bio.summary);
  const font = isZh
    ? '"Noto Sans SC", "PingFang SC", serif'
    : '"Georgia", "Times New Roman", serif';

  const gold = '#b8860b';
  const darkBg = '#1a1a2e';

  return (
    <div ref={ref} className="resume-a4 bg-white flex" style={{ fontFamily: font }}>
      {/* Left accent bar */}
      <div className="w-[2mm] flex-shrink-0" style={{ background: gold }} />

      {/* Sidebar */}
      <div className="w-[68mm] flex-shrink-0 flex flex-col" style={{ background: darkBg }}>
        {/* Photo */}
        {bio.photo && (
          <div className="p-5 pt-8 flex justify-center">
            <div className="w-28 h-28 rounded-lg overflow-hidden" style={{ border: `2px solid ${gold}` }}>
              <img src={bio.photo} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="px-5 mt-4 space-y-2.5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: gold }}>Contact</h3>
          {bio.email && <p className="text-[11px] text-gray-300 break-all">{bio.email}</p>}
          {bio.phone && <p className="text-[11px] text-gray-300">{bio.phone}</p>}
          {address && <p className="text-[11px] text-gray-300">{address}</p>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="px-5 mt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: gold }}>{t('preview.skills')}</h3>
            <div className="space-y-2">
              {data.skills.map(skill => (
                <div key={skill.id}>
                  <p className="text-[11px] text-gray-300">{isZh ? skill.name : (skill.nameEn || skill.name)}</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className="w-2 h-2 rounded-full" style={{ background: n <= skill.level ? gold : 'rgba(255,255,255,0.15)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.educations.length > 0 && (
          <div className="px-5 mt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: gold }}>{t('preview.education')}</h3>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <p className="text-[11px] font-semibold text-gray-200">{isZh ? edu.school : (edu.schoolEn || edu.school)}</p>
                <p className="text-[10px] text-gray-400">{[isZh ? edu.degree : (edu.degreeEn || edu.degree), isZh ? edu.major : (edu.majorEn || edu.major)].filter(Boolean).join(' · ')}</p>
                <p className="text-[10px] text-gray-500">{edu.startDate} — {localizeDate(edu.endDate, lang)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 px-8 py-8">
        {/* Name & Title */}
        <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${gold}` }}>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">{name}</h1>
          <p className="text-sm mt-1" style={{ color: gold }}>{title}</p>
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-xs text-gray-600 leading-loose mb-5 italic">{summary}</p>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1" style={{ color: gold, borderBottom: '1px solid #e5e7eb' }}>{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">{isZh ? exp.company : (exp.companyEn || exp.company)}</span>
                  <span className="text-[10px] text-gray-400">{exp.startDate} — {localizeDate(exp.endDate, lang)}</span>
                </div>
                <p className="text-xs italic mt-0.5" style={{ color: gold }}>{isZh ? exp.position : (exp.positionEn || exp.position)}</p>
                {(isZh ? exp.description : exp.descriptionEn) && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{isZh ? exp.description : exp.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 pb-1" style={{ color: gold, borderBottom: '1px solid #e5e7eb' }}>{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">{isZh ? proj.name : (proj.nameEn || proj.name)}</span>
                  <span className="text-[10px] text-gray-400">{proj.startDate} — {localizeDate(proj.endDate, lang)}</span>
                </div>
                {proj.techStack && <p className="text-[10px] text-gray-500 mt-0.5">{proj.techStack}</p>}
                {(isZh ? proj.description : proj.descriptionEn) && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{isZh ? proj.description : proj.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ElegantTemplate;
