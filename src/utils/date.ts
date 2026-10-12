import { Lang } from '../types/resume';

/**
 * Localize a date string for display.
 * Handles Chinese-specific values like "至今" → "Present" when in English mode.
 */
export function localizeDate(value: string, lang: Lang): string {
  if (!value) return '';
  if (lang === 'en') {
    return value.replace('至今', 'Present');
  }
  return value;
}
