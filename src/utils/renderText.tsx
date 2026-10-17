import type { ReactNode } from 'react';

/** Render text with **bold** markdown and line breaks */
export function renderFormattedText(text: string): ReactNode {
  if (!text) return null;
  const parts: ReactNode[] = [];
  const lines = text.split('\n');
  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) parts.push(<br key={`br-${lineIdx}`} />);
    const segments = line.split(/(\*\*[^*]+\*\*)/g);
    segments.forEach((seg, segIdx) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        parts.push(<strong key={`${lineIdx}-${segIdx}`}>{seg.slice(2, -2)}</strong>);
      } else if (seg) {
        parts.push(seg);
      }
    });
  });
  return <>{parts}</>;
}
