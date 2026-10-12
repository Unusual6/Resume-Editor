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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 mb-2">{t('storage.title')}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-primary rounded-md
                       hover:bg-secondary transition-colors"
          >
            {currentId ? t('storage.save') : t('storage.saveNew')}
          </button>
          <button
            onClick={createNewResume}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-primary border border-primary rounded-md
                       hover:bg-primary/5 transition-colors"
          >
            {t('storage.create')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {entries.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8">{t('storage.empty')}</p>
        )}
        {entries.map(entry => {
          const isActive = entry.id === currentId;
          return (
            <div
              key={entry.id}
              className={`group rounded-lg border transition-colors cursor-pointer
                ${isActive
                  ? 'border-accent bg-accent/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
            >
              {/* Main row */}
              <div
                className="flex items-center gap-2 p-2"
                onClick={() => loadResume(entry.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingId === entry.id ? (
                    <input
                      className="w-full px-1.5 py-0.5 text-xs border border-accent rounded focus:outline-none"
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
                      <p className={`text-xs font-medium truncate ${isActive ? 'text-accent' : 'text-gray-700'}`}>
                        {entry.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {formatDate(entry.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
                {/* Active indicator */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
              </div>

              {/* Action buttons */}
              <div className={`flex border-t border-gray-100 ${isActive ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button
                  onClick={e => { e.stopPropagation(); startRename(entry.id, entry.name); }}
                  className="flex-1 py-1 text-[10px] text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors"
                  title={t('storage.rename')}
                >
                  {t('storage.rename')}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); duplicateResume(entry.id); }}
                  className="flex-1 py-1 text-[10px] text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors border-l border-gray-100"
                  title={t('storage.duplicate')}
                >
                  {t('storage.duplicate')}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}
                  className={`flex-1 py-1 text-[10px] hover:bg-gray-50 transition-colors border-l border-gray-100
                    ${confirmDeleteId === entry.id ? 'text-red-600 font-medium' : 'text-gray-500 hover:text-red-500'}`}
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
      <div className="p-2 border-t border-gray-100 text-center">
        <span className="text-[10px] text-gray-400">
          {t('storage.count', { count: entries.length })}
        </span>
      </div>
    </div>
  );
}
