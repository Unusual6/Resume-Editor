import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** A4 height in CSS pixels (96dpi) — the browser paginates on exactly this grid */
const PAGE_HEIGHT_PX = (297 / 25.4) * 96;
/** A sheet that is exactly one page tall must not count as two because of rounding */
const EPSILON_PX = 1;

/**
 * The preview is one continuous sheet of paper, so nothing reveals where the printed
 * pages split — content past 297mm silently becomes a second page. This overlays the
 * page boundaries and the resulting page count while editing.
 */
export default function PageBreakGuides() {
  const { t } = useTranslation();
  const hostRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ pages: 1, scale: 1 });

  useEffect(() => {
    // Measure the wrapper rather than the resume element: it stays the same node when
    // the template changes, and its height follows the sheet
    const sheet = hostRef.current?.parentElement;
    if (!sheet) return;
    const measure = () => {
      const height = sheet.offsetHeight;
      const scale = height ? sheet.getBoundingClientRect().height / height : 1;
      setLayout({
        pages: Math.max(1, Math.ceil((height - EPSILON_PX) / PAGE_HEIGHT_PX)),
        scale,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  const { pages, scale } = layout;

  return (
    <div ref={hostRef} className="no-print pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: pages - 1 }, (_, i) => (
        <div key={i} className="absolute left-0 right-0" style={{ top: (i + 1) * PAGE_HEIGHT_PX * scale }}>
          <div className="border-t-2 border-dashed border-primary/70" />
          <span
            className="pointer-events-auto absolute right-0 -top-2.5 px-1.5 rounded bg-primary/85 text-white
                       text-[10px] font-mono cursor-help"
            title={t('preview.pageBreakHint')}
          >
            {t('preview.pageStart', { page: i + 2 })}
          </span>
        </div>
      ))}
      {pages > 1 && (
        <span className="absolute -bottom-6 right-0 text-[10px] font-mono text-sf-muted">
          {t('preview.pageCount', { count: pages })}
        </span>
      )}
    </div>
  );
}
