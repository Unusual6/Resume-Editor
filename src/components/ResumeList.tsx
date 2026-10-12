import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';
import TemplateSelector from './TemplateSelector';

export default function ResumeList() {
  const { t } = useTranslation();
  const {
    entries, currentId, lang,
    saveCurrentResume, createNewResume, loadResume,
    deleteResume, renameResume, duplicateResume,
  } = useResume();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitRename = () => {
    if (editingId && editName.trim()) {
      renameResume(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleSave = () => {
    saveCurrentResume();
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteResume(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="h-full flex flex-col bg-sf-surface">
      {/* Header */}
      <div className="p-3 border-b border-sf-border">
        <h2 className="text-xs font-bold text-sf-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span className="text-primary">❯</span> {t('storage.title')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-primary rounded
                       hover:bg-secondary transition-colors font-mono"
          >
            {currentId ? t('storage.save') : t('storage.saveNew')}
          </button>
          <button
            onClick={createNewResume}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-sf-text border border-sf-border rounded
                       hover:bg-sf-hover transition-colors font-mono"
          >
            {t('storage.create')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {entries.length === 0 && (
          <p className="text-xs text-sf-muted text-center py-8 font-mono">{t('storage.empty')}</p>
        )}
        {entries.map(entry => {
          const isActive = entry.id === currentId;
          return (
            <div
              key={entry.id}
              className={`group rounded border transition-colors cursor-pointer
                ${isActive
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-transparent hover:border-sf-border hover:bg-sf-card'
                }`}
            >
              <div
                className="flex items-center gap-2 p-2"
                onClick={() => loadResume(entry.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingId === entry.id ? (
                    <input
                      className="w-full px-1.5 py-0.5 text-xs border border-primary/50 rounded bg-sf-card text-sf-text focus:outline-none font-mono"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <p className={`text-xs font-medium truncate font-mono ${isActive ? 'text-primary' : 'text-sf-text'}`}>
                        {entry.name}
                      </p>
                      <p className="text-[10px] text-sf-muted mt-0.5 font-mono">
                        {formatDate(entry.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>

              <div className={`flex border-t ${isActive ? 'border-primary/20' : 'border-transparent'} ${isActive ? '' : 'opacity-0 group-hover:opacity-100 group-hover:border-sf-border'} transition-opacity`}>
                <button
                  onClick={e => { e.stopPropagation(); startRename(entry.id, entry.name); }}
                  className="flex-1 py-1 text-[10px] text-sf-muted hover:text-primary hover:bg-sf-hover transition-colors font-mono"
                  title={t('storage.rename')}
                >
                  {t('storage.rename')}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); duplicateResume(entry.id); }}
                  className="flex-1 py-1 text-[10px] text-sf-muted hover:text-primary hover:bg-sf-hover transition-colors border-l border-sf-border font-mono"
                  title={t('storage.duplicate')}
                >
                  {t('storage.duplicate')}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                  className={`flex-1 py-1 text-[10px] hover:bg-sf-hover transition-colors border-l border-sf-border font-mono
                    ${confirmDeleteId === entry.id ? 'text-red-400 font-medium' : 'text-sf-muted hover:text-red-500'}`}
                  title={t('storage.delete')}
                >
                  {confirmDeleteId === entry.id ? t('storage.confirmDelete') : t('storage.delete')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template selector */}
      <TemplateSelector />

      {/* Footer count */}
      <div className="p-2 border-t border-sf-border text-center">
        <span className="text-[10px] text-sf-muted font-mono">
          {t('storage.count', { count: entries.length })}
        </span>
      </div>
    </div>
  );
}
