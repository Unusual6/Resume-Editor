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

// Debounced preview - only re-renders after typing stops
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
        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors
          ${autoSave
            ? 'text-green-600 bg-green-50 hover:bg-green-100'
            : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
          }`}
        title={autoSave ? (t('autoSave.on') || '自动保存已开启') : (t('autoSave.off') || '自动保存已关闭')}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${autoSave ? 'bg-green-500' : 'bg-gray-300'}`} />
        {autoSave ? (t('autoSave.on') || '自动保存') : (t('autoSave.off') || '手动保存')}
      </button>
      {showSaved && lastSavedAt && (
        <span className="text-[10px] text-green-500 animate-pulse">
          {t('autoSave.savedAt') || '已保存'} {formatTime(lastSavedAt)}
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
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="no-print flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
            title={sidebarOpen ? (t('storage.hideList') || '隐藏列表') : (t('storage.showList') || '显示列表')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              )}
            </svg>
          </button>
          <h1 className="text-lg font-bold text-primary">{t('app.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <AutoSaveIndicator />
          <TranslateButton />
          <LanguageSwitch />
          <button
            onClick={() => saveCurrentResume()}
            className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md
                       hover:bg-primary/5 transition-colors"
          >
            {t('storage.save')}
          </button>
          <button
            onClick={exportPdf}
            className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-md
                       hover:bg-secondary transition-colors shadow-sm"
          >
            {t('app.exportPdf')}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Resume list sidebar */}
        {sidebarOpen && (
          <aside className="no-print w-[220px] flex-shrink-0 border-r border-gray-200 overflow-hidden">
            <ResumeList />
          </aside>
        )}

        {/* Editor form */}
        <aside className="no-print w-[400px] flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-hidden">
          <ResumeForm />
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-auto custom-scrollbar bg-gray-100 p-8 flex justify-center">
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
