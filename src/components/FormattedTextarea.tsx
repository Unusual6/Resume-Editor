import { useRef, useCallback, useLayoutEffect } from 'react';
import { toggleBold, toggleBullets } from '../utils/textFormat';
import type { TextEdit } from '../utils/textFormat';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}

interface PendingRestore extends TextEdit {
  scrollTop: number;
  hosts: Array<{ el: HTMLElement; scrollTop: number }>;
}

export default function FormattedTextarea({ value, onChange, placeholder, rows = 5, id }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // Caret + scroll offsets to restore once React has committed the new value
  const pending = useRef<PendingRestore | null>(null);

  // Runs after the DOM is mutated but before paint, so rewriting the value never
  // lets the browser scroll the caret (always at the end of the edit) into view.
  useLayoutEffect(() => {
    const restore = pending.current;
    if (!restore) return;
    // Always drop it, so a caret position is never replayed onto a later edit
    pending.current = null;
    const el = ref.current;
    if (!el || restore.value !== value) return;
    el.focus({ preventScroll: true });
    el.setSelectionRange(restore.start, restore.end);
    el.scrollTop = restore.scrollTop;
    for (const { el: host, scrollTop } of restore.hosts) host.scrollTop = scrollTop;
  }, [value]);

  const update = useCallback((edit: TextEdit) => {
    const el = ref.current;
    if (!el) {
      onChange(edit.value);
      return;
    }
    if (edit.value === value) {
      // Nothing changed: only take the caret back from the toolbar button
      el.focus({ preventScroll: true });
      el.setSelectionRange(edit.start, edit.end);
      return;
    }
    const hosts: PendingRestore['hosts'] = [];
    for (let host = el.parentElement; host; host = host.parentElement) {
      if (host.scrollHeight > host.clientHeight) hosts.push({ el: host, scrollTop: host.scrollTop });
    }
    pending.current = { ...edit, scrollTop: el.scrollTop, hosts };
    onChange(edit.value);
  }, [onChange, value]);

  const handleBold = () => {
    const el = ref.current;
    if (!el) return;
    update(toggleBold(value, el.selectionStart, el.selectionEnd));
  };

  const handleBullet = () => {
    const el = ref.current;
    if (!el) return;
    update(toggleBullets(value, el.selectionStart, el.selectionEnd));
  };

  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
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
          onMouseDown={e => e.preventDefault()}
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
        id={id}
        className="input-field resize-none"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
