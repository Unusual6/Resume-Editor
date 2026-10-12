import { useRef, useCallback, useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeProvider, useResume } from './context/ResumeContext';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ResumeList from './components/ResumeList';
import LanguageSwitch from './components/LanguageSwitch';
import TranslateButton from './components/TranslateButton';
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
    <div className="flex items-center gap-2">
      <button
        onClick={() => setAutoSave(!autoSave)}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors font-mono
          ${autoSave
            ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/15'
            : 'text-dark-muted bg-dark-card hover:bg-dark-hover'
          }`}
        title={autoSave ? t('autoSave.on') : t('autoSave.off')}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${autoSave ? 'bg-emerald-400' : 'bg-dark-muted'}`} />
        {autoSave ? t('autoSave.on') : t('autoSave.off')}
      </button>
      {showSaved && lastSavedAt && (
        <span className="text-[10px] text-emerald-400/70 animate-pulse font-mono">
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
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Top bar - Claude Code style */}
      <header className="no-print flex items-center justify-between px-4 py-2 bg-dark-surface border-b border-dark-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-dark-hover transition-colors text-dark-muted hover:text-dark-text"
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
            <h1 className="text-sm font-semibold text-dark-text tracking-wide">{t('app.title')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator />
          <CloudSync />
          <TranslateButton />
          <LanguageSwitch />
          <button
            onClick={() => saveCurrentResume()}
            className="px-3 py-1 text-xs font-medium text-dark-text border border-dark-border rounded
                       hover:bg-dark-hover hover:border-dark-muted transition-colors font-mono"
          >
            {t('storage.save')}
          </button>
          <button
            onClick={exportPdf}
            className="px-3 py-1 text-xs font-medium text-dark-bg bg-primary rounded
                       hover:bg-secondary transition-colors font-mono"
          >
            {t('app.exportPdf')}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <aside className="no-print w-[220px] flex-shrink-0 border-r border-dark-border overflow-hidden bg-dark-surface">
            <ResumeList />
          </aside>
        )}

        <aside className="no-print w-[400px] flex-shrink-0 border-r border-dark-border bg-dark-bg overflow-hidden">
          <ResumeForm />
        </aside>

        <main className="flex-1 overflow-auto custom-scrollbar bg-dark-bg p-8 flex justify-center">
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
