import { useRef, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

/**
 * Textarea with bold/bullet helpers. The inline field grows with its content and can be
 * opened full screen; both states reuse this instance, so the caret/scroll fix and the
 * formatting logic apply to whichever size is showing.
 */
export default function FormattedTextarea({ value, onChange, placeholder, rows = 5, id }: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLTextAreaElement>(null);
  // Caret + scroll offsets to restore once React has committed the new value
  const pending = useRef<PendingRestore | null>(null);
  const [expanded, setExpanded] = useState(false);
  // Selection to carry into the full-screen editor
  const keepSelection = useRef<[number, number] | null>(null);

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

  // Long text should be readable at once instead of hiding behind a tiny inner scrollbar
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const fit = () => {
      el.style.height = 'auto';
      const cap = Math.round(window.innerHeight * 0.7);
      el.style.height = `${Math.min(el.scrollHeight, cap)}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [value, expanded]);

  // In full screen the field fills the panel instead of hugging its content
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !expanded) return;
    el.style.height = '';
    // Resizing swaps the DOM node, so put the caret back where the reader left it
    const [start, end] = keepSelection.current ?? [el.value.length, el.value.length];
    keepSelection.current = null;
    el.focus({ preventScroll: true });
    el.setSelectionRange(Math.min(start, el.value.length), Math.min(end, el.value.length));
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const toggleStyle =
    "w-6 h-6 flex items-center justify-center rounded text-sf-muted border border-sf-border " +
    "hover:bg-primary/15 hover:text-primary hover:border-primary/40 transition-colors";

  const content = (
    <>
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={handleBold}
          className={`${toggleStyle} text-[11px] font-bold`}
          title="加粗: 选中文字后点击，或用 **文字** 语法"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={handleBullet}
          className={`${toggleStyle} text-sm`}
          title="圆点列表: 为当前行/选中行添加/移除圆点"
        >
          •
        </button>
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            const el = ref.current;
            if (el) keepSelection.current = [el.selectionStart, el.selectionEnd];
            setExpanded(v => !v);
          }}
          className={`${toggleStyle} ml-auto text-[11px]`}
          title={expanded ? t('form.collapseEditor') : t('form.expandEditor')}
          aria-label={expanded ? t('form.collapseEditor') : t('form.expandEditor')}
        >
          {expanded ? '✕' : '⤢'}
        </button>
      </div>
      <textarea
        ref={ref}
        id={id}
        className={`input-field resize-none ${expanded ? 'flex-1 min-h-0 text-sm leading-relaxed' : ''}`}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {expanded && (
        <p className="mt-2 text-[10px] font-mono text-sf-muted">
          {t('form.editorShortcut')}
        </p>
      )}
    </>
  );

  if (!expanded) return <div>{content}</div>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 sm:p-8"
      onMouseDown={e => { if (e.target === e.currentTarget) setExpanded(false); }}
    >
      {/* Reading width is capped: a full-screen column of text is harder to follow */}
      <div className="flex h-full w-full max-w-3xl flex-col rounded-lg border border-sf-border
                     bg-sf-surface p-4 shadow-2xl">
        {content}
      </div>
    </div>
  );
}
