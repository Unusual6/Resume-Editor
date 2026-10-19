import { useResume } from '../context/ResumeContext';
import { useTranslation } from 'react-i18next';
import { localizeDate } from './date';
import { renderFormattedText } from './renderText';

export function useResumeData() {
  const { lang, data } = useResume();
  const { t } = useTranslation();
  const isZh = lang === 'zh';
  const bio = data.basicInfo;

  const l = (zhField: string, enField: string, obj: Record<string, any>) =>
    isZh ? obj[zhField] : (obj[enField] || obj[zhField]);

  const ld = (value: string) => localizeDate(value, lang);

  const font = isZh
    ? '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
    : '"Inter", "Helvetica Neue", Arial, sans-serif';

  const serifFont = isZh
    ? '"Noto Serif SC", "Source Han Serif SC", "STSong", serif'
    : '"Georgia", "Times New Roman", serif';

  const fk = (zhField: string, enField: string, itemId?: string) => ({
    'data-field': itemId ? `${itemId}.${isZh ? zhField : enField}` : (isZh ? zhField : enField),
  });

  return { lang, data, t, isZh, bio, l, ld, font, serifFont, renderFormattedText, fk };
}
