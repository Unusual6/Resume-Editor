import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import type { TemplateType } from '../types/resume';

const templates: { key: TemplateType; color: string; sidebar?: boolean; desc: string; descEn: string }[] = [
  { key: 'classic', color: '#2563eb', desc: '蓝色主色调，单栏专业', descEn: 'Blue accent, single-column' },
  { key: 'modern', color: '#0891b2', sidebar: true, desc: '浅青侧栏，双栏布局', descEn: 'Light teal sidebar' },
  { key: 'minimal', color: '#9ca3af', desc: '居中留白，极简排版', descEn: 'Centered, whitespace' },
  { key: 'elegant', color: '#7c6f64', sidebar: true, desc: '暖色侧栏，衬线字体', descEn: 'Warm sidebar, serif' },
  { key: 'professional', color: '#0f766e', desc: '左侧竖线，企业风格', descEn: 'Left accent bar, corporate' },
  { key: 'creative', color: '#7c3aed', desc: '渐变头部，胶囊标签', descEn: 'Gradient header, creative' },
  { key: 'compact', color: '#0369a1', desc: '双栏紧凑，信息密度高', descEn: 'Two-column, space-efficient' },
];

export default function TemplateSelector() {
  const { t } = useTranslation();
  const { template, setTemplate } = useResume();

  return (
    <div className="p-3 border-b border-gray-200 bg-white">
      <h3 className="text-xs font-bold text-gray-600 mb-2">{t('template.title')}</h3>
      <div className="grid grid-cols-4 gap-1.5 justify-items-center">
        {templates.map(tp => {
          const isActive = template === tp.key;
          return (
            <button
              key={tp.key}
              onClick={() => setTemplate(tp.key)}
              className={`relative flex flex-col items-center rounded-md p-1.5 transition-all
                ${isActive ? 'ring-2 ring-accent shadow-sm' : 'hover:bg-gray-50 border border-gray-100'}`}
            >
              {/* Mini preview */}
              <div className="w-full aspect-[3/4] rounded-sm overflow-hidden mb-1 border border-gray-200 bg-white">
                {tp.sidebar ? (
                  <div className="h-full flex">
                    <div className="w-1/3 h-full" style={{ background: `${tp.color}12` }} />
                    <div className="flex-1 px-1 pt-1.5 space-y-0.5">
                      <div className="h-0.5 rounded w-3/4" style={{ background: `${tp.color}30` }} />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-50 rounded w-2/3" />
                    </div>
                  </div>
                ) : tp.key === 'creative' ? (
                  <div className="h-full flex flex-col">
                    <div className="h-3" style={{ background: `linear-gradient(135deg, ${tp.color}15, ${tp.color}08)` }} />
                    <div className="flex-1 px-1.5 pt-1 space-y-0.5">
                      <div className="h-0.5 rounded w-3/4" style={{ background: `${tp.color}25` }} />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-50 rounded w-2/3" />
                    </div>
                  </div>
                ) : tp.key === 'compact' ? (
                  <div className="h-full flex flex-col">
                    <div className="h-2.5" style={{ borderBottom: `1.5px solid ${tp.color}` }}>
                      <div className="h-0.5 rounded w-1/3 mx-1 mt-1" style={{ background: `${tp.color}40` }} />
                    </div>
                    <div className="flex flex-1 px-1 pt-1 gap-0.5">
                      <div className="flex-1 space-y-0.5">
                        <div className="h-0.5 bg-gray-100 rounded w-full" />
                        <div className="h-0.5 bg-gray-50 rounded w-3/4" />
                      </div>
                      <div className="w-1/3 space-y-0.5">
                        <div className="h-0.5 bg-gray-100 rounded w-full" />
                        <div className="h-0.5 bg-gray-50 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ) : tp.key === 'professional' ? (
                  <div className="h-full flex">
                    <div className="w-0.5 h-full" style={{ background: tp.color }} />
                    <div className="flex-1 px-1.5 pt-1.5 space-y-0.5">
                      <div className="h-0.5 rounded w-3/4" style={{ background: `${tp.color}30` }} />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-50 rounded w-2/3" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="h-1.5" style={{ background: tp.key === 'minimal' ? undefined : `${tp.color}20` }}>
                      {tp.key === 'minimal' && <div className="h-0.5 rounded w-1/2 mx-auto mt-0.5 bg-gray-200" />}
                    </div>
                    <div className="flex-1 px-1.5 pt-1 space-y-0.5">
                      <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-50 rounded w-2/3" />
                    </div>
                  </div>
                )}
              </div>
              <span className={`text-[9px] leading-tight ${isActive ? 'text-accent font-semibold' : 'text-gray-500'}`}>
                {t('template.' + tp.key)}
              </span>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
