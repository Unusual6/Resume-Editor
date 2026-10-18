import { useRef, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function FormattedTextarea({ value, onChange, placeholder, rows = 5 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const update = useCallback((before: string, after: string, newCursorPos?: number) => {
    onChange(before + after);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      if (newCursorPos !== undefined) {
        el.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  }, [onChange]);

  const handleBold = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);

    if (selected) {
      // Toggle bold on selection
      if (selected.startsWith('**') && selected.endsWith('**')) {
        update(before, selected.slice(2, -2) + after, start + selected.length - 4);
      } else {
        update(before, `**${selected}**` + after, start + selected.length + 4);
      }
    } else {
      // Insert placeholder
      update(before, '****' + after, start + 2);
    }
  };

  const handleBullet = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    // Find the range of lines to toggle
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const before = value.slice(0, lineStart);
    const after = value.slice(lineEnd);
    const lines = value.slice(lineStart, lineEnd).split('\n');

    // Toggle: if all lines have bullets, remove them; otherwise add to all
    const allBulleted = lines.every(l => l.startsWith('• '));
    const newLines = lines.map(l => allBulleted ? l.replace(/^• /, '') : `• ${l}`);
    const newText = newLines.join('\n');

    update(before, newText + after, lineStart + newText.length);
  };

  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          onClick={handleBold}
          className="w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold
                     text-sf-muted border border-sf-border hover:bg-primary/15 hover:text-primary
                     hover:border-primary/40 transition-colors"
          title="加粗: 选中文字后点击，或用 **文字** 语法"
        >
          B
        </button>
        <button
          type="button"
          onClick={handleBullet}
          className="w-6 h-6 flex items-center justify-center rounded text-sm
                     text-sf-muted border border-sf-border hover:bg-primary/15 hover:text-primary
                     hover:border-primary/40 transition-colors"
          title="圆点列表: 为当前行/选中行添加/移除圆点"
        >
          •
        </button>
      </div>
      <textarea
        ref={ref}
        className="input-field resize-none"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
