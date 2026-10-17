import { useRef, useCallback, useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeProvider, useResume } from './context/ResumeContext';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ResumeList from './components/ResumeList';
import LanguageSwitch from './components/LanguageSwitch';
import CloudSync from './components/CloudSync';

const MemoizedPreview = memo(ResumePreview);

function AutoSaveIndicator() {
  const { t } = useTranslation();
  const { autoSave, setAutoSave, lastSavedAt } = useResume();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastSavedAt) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSavedAt]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        onClick={() => setAutoSave(!autoSave)}
        className={`flex items-center gap-1.5 py-1 text-xs rounded transition-colors font-mono flex-shrink-0
          ${autoSave
            ? 'text-green-700 bg-green-50 hover:bg-green-500/15'
            : 'text-sf-muted bg-sf-card hover:bg-sf-hover'
          }`}
        title={autoSave ? t('autoSave.on') : t('autoSave.off')}
        style={{ width: '80px' }}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${autoSave ? 'bg-green-500' : 'bg-dark-muted'}`} />
        <span className="truncate">{autoSave ? t('autoSave.on') : t('autoSave.off')}</span>
      </button>
      {showSaved && lastSavedAt && (
        <span className="text-[10px] text-green-700/70 animate-pulse font-mono whitespace-nowrap">
          {t('autoSave.savedAt')} {formatTime(lastSavedAt)}
        </span>
      )}
    </div>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { data, saveCurrentResume } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const exportPdf = useCallback(async () => {
    const el = previewRef.current;
    if (!el) return;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const name = data.basicInfo.name || data.basicInfo.nameEn || 'resume';
    pdf.save(`${name}_resume.pdf`);
  }, [data.basicInfo.name, data.basicInfo.nameEn]);

  return (
    <div className="h-screen flex flex-col bg-sf-bg">
      {/* Top bar - Claude Code style */}
      <header className="no-print flex items-center justify-between px-4 py-2 bg-sf-surface border-b border-sf-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-sf-hover transition-colors text-sf-muted hover:text-sf-text"
            title={sidebarOpen ? t('storage.hideList') : t('storage.showList')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-sm">❯</span>
            <h1 className="text-sm font-semibold text-sf-text tracking-wide">{t('app.title')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator />
          <CloudSync />
          <LanguageSwitch />
          <button
            onClick={() => saveCurrentResume()}
            className="py-1 text-xs font-medium text-sf-text border border-sf-border rounded
                       hover:bg-sf-hover hover:border-sf-muted transition-colors font-mono flex-shrink-0"
            style={{ width: '56px' }}
          >
            <span className="block truncate text-center">{t('storage.save')}</span>
          </button>
          <button
            onClick={exportPdf}
            className="py-1 text-xs font-medium text-white bg-primary rounded
                       hover:bg-secondary transition-colors font-mono flex-shrink-0"
            style={{ width: '88px' }}
          >
            <span className="block truncate text-center">{t('app.exportPdf')}</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <aside className="no-print w-[220px] flex-shrink-0 border-r border-sf-border overflow-hidden bg-sf-surface">
            <ResumeList />
          </aside>
        )}

        <aside className="no-print w-[400px] flex-shrink-0 border-r border-sf-border bg-sf-bg overflow-hidden">
          <ResumeForm />
        </aside>

        <main className="flex-1 overflow-auto custom-scrollbar bg-sf-bg p-8 flex justify-center">
          <div className="transform origin-top" style={{ maxWidth: '210mm' }}>
            <MemoizedPreview ref={previewRef} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
