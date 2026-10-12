import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '../utils/date';

const ClassicTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const { lang, data } = useResume();
  const { t } = useTranslation();
  const bio = data.basicInfo;
  const isZh = lang === 'zh';

  const name = isZh ? bio.name : (bio.nameEn || bio.name);
  const title = isZh ? bio.title : (bio.titleEn || bio.title);
  const address = isZh ? bio.address : (bio.addressEn || bio.address);
  const summary = isZh ? bio.summary : (bio.summaryEn || bio.summary);
  const font = isZh
    ? '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
    : '"Inter", "Helvetica Neue", Arial, sans-serif';

  return (
    <div ref={ref} className="resume-a4 bg-white" style={{ fontFamily: font }}>
      {/* Header */}
      <div className="flex items-start gap-5 px-10 pt-8 pb-5" style={{ borderBottom: '2px solid #1a365d' }}>
        {bio.photo && (
          <img src={bio.photo} alt="" className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-2 border-primary" />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-primary tracking-wide">{name}</h1>
          <p className="text-base text-secondary mt-1 font-medium">{title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            {bio.email && <span>✉ {bio.email}</span>}
            {bio.phone && <span>☎ {bio.phone}</span>}
            {address && <span>⌂ {address}</span>}
          </div>
          {summary && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{summary}</p>}
        </div>
      </div>

      <div className="px-10 py-5 space-y-5">
        {data.educations.length > 0 && (
          <Section title={t('preview.education')}>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-800">{isZh ? edu.school : (edu.schoolEn || edu.school)}</span>
                  <span className="text-xs text-gray-400">{edu.startDate} ~ {localizeDate(edu.endDate, lang)}</span>
                </div>
                <p className="text-xs text-gray-500">{[isZh ? edu.degree : (edu.degreeEn || edu.degree), isZh ? edu.major : (edu.majorEn || edu.major)].filter(Boolean).join(' · ')}</p>
                {(isZh ? edu.description : edu.descriptionEn) && <p className="text-xs text-gray-600 mt-1">{isZh ? edu.description : edu.descriptionEn}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.experiences.length > 0 && (
          <Section title={t('preview.experience')}>
            {data.experiences.map(exp => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-800">{isZh ? exp.company : (exp.companyEn || exp.company)}</span>
                  <span className="text-xs text-gray-400">{exp.startDate} ~ {localizeDate(exp.endDate, lang)}</span>
                </div>
                <p className="text-xs text-gray-500">{isZh ? exp.position : (exp.positionEn || exp.position)}</p>
                {(isZh ? exp.description : exp.descriptionEn) && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{isZh ? exp.description : exp.descriptionEn}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title={t('preview.project')}>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-800">{isZh ? proj.name : (proj.nameEn || proj.name)}</span>
                  <span className="text-xs text-gray-400">{proj.startDate} ~ {localizeDate(proj.endDate, lang)}</span>
                </div>
                <p className="text-xs text-gray-500">{[isZh ? proj.role : (proj.roleEn || proj.role), proj.techStack].filter(Boolean).join(' · ')}</p>
                {(isZh ? proj.description : proj.descriptionEn) && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{isZh ? proj.description : proj.descriptionEn}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title={t('preview.skills')}>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-700">{isZh ? skill.name : (skill.nameEn || skill.name)}</span>
                  <span className="text-xs text-amber-500">{'★'.repeat(skill.level)}{'☆'.repeat(5 - skill.level)}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2 pb-1" style={{ borderBottom: '1px solid #e2e8f0' }}>{title}</h2>
      {children}
    </div>
  );
}

export default ClassicTemplate;
