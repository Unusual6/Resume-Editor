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
      className="py-1 text-xs font-medium rounded border border-sf-border
                 hover:bg-sf-hover hover:border-sf-muted transition-colors text-sf-text font-mono
                 w-[52px] flex items-center justify-center flex-shrink-0"
    >
      {t('app.switchLang')}
    </button>
  );
}
