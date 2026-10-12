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
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300
                 hover:bg-gray-100 transition-colors bg-white"
    >
      {t('app.switchLang')}
    </button>
  );
}
