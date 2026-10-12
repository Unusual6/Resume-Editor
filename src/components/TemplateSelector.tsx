import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import type { TemplateType } from '../types/resume';

const templates: { key: TemplateType; label: string; labelEn: string; color: string; desc: string; descEn: string }[] = [
  { key: 'classic', label: '经典', labelEn: 'Classic', color: '#1a365d', desc: '深蓝主色调，传统专业', descEn: 'Navy blue, professional' },
  { key: 'modern', label: '现代', labelEn: 'Modern', color: '#111827', desc: '深色侧栏，双栏布局', descEn: 'Dark sidebar, two-column' },
  { key: 'minimal', label: '极简', labelEn: 'Minimal', color: '#9ca3af', desc: '大量留白，居中排版', descEn: 'Whitespace, centered' },
  { key: 'elegant', label: '典雅', labelEn: 'Elegant', color: '#b8860b', desc: '金色点缀，深色侧栏', descEn: 'Gold accents, elegant' },
];

export default function TemplateSelector() {
  const { t } = useTranslation();
  const { template, setTemplate } = useResume();

  return (
    <div className="p-3 border-b border-gray-200 bg-white">
      <h3 className="text-xs font-bold text-gray-600 mb-2">{t('template.title')}</h3>
      <div className="grid grid-cols-4 gap-1.5">
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
              <div className="w-full aspect-[3/4] rounded-sm overflow-hidden mb-1 border border-gray-200"
                style={{ background: '#fff' }}>
                {/* Simulate template look */}
                {tp.key === 'classic' && (
                  <div className="h-full flex flex-col">
                    <div className="h-3" style={{ background: tp.color }} />
                    <div className="flex-1 px-1 pt-1 space-y-0.5">
                      <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                )}
                {tp.key === 'modern' && (
                  <div className="h-full flex">
                    <div className="w-1/3 h-full" style={{ background: tp.color }} />
                    <div className="flex-1 px-1 pt-1 space-y-0.5">
                      <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                )}
                {tp.key === 'minimal' && (
                  <div className="h-full flex flex-col items-center justify-center px-2">
                    <div className="h-0.5 bg-gray-300 rounded w-1/2 mb-1" />
                    <div className="h-px bg-gray-200 w-full mb-1" />
                    <div className="h-0.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-0.5 bg-gray-100 rounded w-1/2 mt-0.5" />
                  </div>
                )}
                {tp.key === 'elegant' && (
                  <div className="h-full flex">
                    <div className="w-0.5 h-full" style={{ background: tp.color }} />
                    <div className="w-1/3 h-full" style={{ background: '#1a1a2e' }} />
                    <div className="flex-1 px-1 pt-1 space-y-0.5">
                      <div className="h-0.5 rounded w-3/4" style={{ background: tp.color, opacity: 0.4 }} />
                      <div className="h-0.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-0.5 bg-gray-100 rounded w-2/3" />
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
