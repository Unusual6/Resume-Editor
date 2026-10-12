import { useTranslation } from 'react-i18next';
import { useResume } from '../context/ResumeContext';

export default function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const { lang, setLang } = useResume();

  const toggle = () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    setLang(next);
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="px-2.5 py-1 text-xs font-medium rounded border border-dark-border
                 hover:bg-dark-hover hover:border-dark-muted transition-colors text-dark-text font-mono"
    >
      {t('app.switchLang')}
    </button>
  );
}
