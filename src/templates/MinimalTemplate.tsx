import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { useTranslation } from 'react-i18next';

const MinimalTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
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
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Header - centered, minimal */}
      <div className="px-12 pt-12 pb-6 text-center">
        {bio.photo && (
          <div className="flex justify-center mb-4">
            <img src={bio.photo} alt="" className="w-20 h-20 rounded-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">{name}</h1>
        <p className="text-xs text-gray-400 mt-2 tracking-widest">{title}</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-400">
          {bio.email && <span>{bio.email}</span>}
          {bio.phone && <><span className="text-gray-200">|</span><span>{bio.phone}</span></>}
          {address && <><span className="text-gray-200">|</span><span>{address}</span></>}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-12">
        <div className="h-px bg-gray-200" />
      </div>

      {/* Summary */}
      {summary && (
        <div className="px-12 pt-5 pb-2">
          <p className="text-xs text-gray-500 leading-loose text-center italic">{summary}</p>
        </div>
      )}

      <div className="px-12 py-4 space-y-5">
        {/* Experience */}
        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-4">{t('preview.experience')}</h2>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900">{isZh ? exp.company : (exp.companyEn || exp.company)}</span>
                  <span className="text-[10px] text-gray-300">{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{isZh ? exp.position : (exp.positionEn || exp.position)}</p>
                {(isZh ? exp.description : exp.descriptionEn) && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{isZh ? exp.description : exp.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-4">{t('preview.project')}</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900">{isZh ? proj.name : (proj.nameEn || proj.name)}</span>
                  <span className="text-[10px] text-gray-300">{proj.startDate} — {proj.endDate}</span>
                </div>
                {proj.techStack && <p className="text-[10px] text-gray-400 mt-0.5">{proj.techStack}</p>}
                {(isZh ? proj.description : proj.descriptionEn) && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{isZh ? proj.description : proj.descriptionEn}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.educations.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-4">{t('preview.education')}</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900">{isZh ? edu.school : (edu.schoolEn || edu.school)}</span>
                  <span className="text-[10px] text-gray-300">{edu.startDate} — {edu.endDate}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{[isZh ? edu.degree : (edu.degreeEn || edu.degree), isZh ? edu.major : (edu.majorEn || edu.major)].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.3em] mb-4">{t('preview.skills')}</h2>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.skills.map(skill => (
                <span key={skill.id} className="text-xs text-gray-600">{isZh ? skill.name : (skill.nameEn || skill.name)}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MinimalTemplate;
