import { Lang } from '../types/resume';

/** What a `type="month"` input stores */
const MONTH_RE = /^\d{4}-\d{2}$/;

/** "Still here" label per language */
const PRESENT: Record<Lang, string> = { zh: '至今', en: 'Present' };

/** Accepted spellings of "still here", including the text older data saved directly */
const PRESENT_WORDS = ['至今', 'Present', 'present'];

/**
 * Value safe to hand to a `type="month"` input. Anything else (free text such as "至今",
 * or an empty end date meaning "still here") would be rejected by the browser and logged
 * as a format violation, so it reads as "nothing picked".
 */
export function monthInputValue(value: string): string {
  return MONTH_RE.test(value) ? value : '';
}

/**
 * Localize a date string for display.
 * Handles Chinese-specific values like "至今" → "Present" when in English mode.
 */
export function localizeDate(value: string, lang: Lang): string {
  if (!value) return '';
  if (lang === 'en') {
    return value.replace('至今', PRESENT.en);
  }
  return value;
}

/**
 * Render a period as "2021-03 ~ 至今". An end date that was never picked means the role is
 * still current — the usual resume convention — so it shows the "present" label instead of
 * leaving a dangling separator; a start date can never be "present" and is dropped.
 */
export function formatDateRange(start: string, end: string, lang: Lang, sep = ' ~ '): string {
  const rawStart = start.trim();
  const rawEnd = end.trim();
  const from = PRESENT_WORDS.includes(rawStart) ? '' : localizeDate(rawStart, lang);
  const to = rawEnd ? localizeDate(rawEnd, lang) : (from ? PRESENT[lang] : '');
  if (!from) return to;
  return to ? `${from}${sep}${to}` : from;
}
