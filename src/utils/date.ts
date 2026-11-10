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

/** The two columns of a period; either side can be empty */
export interface DateRangeParts {
  from: string;
  to: string;
}

/**
 * Split a period for display. An end date that was never picked means the role is still
 * current — the usual resume convention — so the right column falls back to the present
 * label; a start date can never be "present", so that value is dropped rather than shown.
 */
export function splitDateRange(start: string, end: string, lang: Lang): DateRangeParts {
  const rawStart = start.trim();
  const rawEnd = end.trim();
  const from = PRESENT_WORDS.includes(rawStart) ? '' : localizeDate(rawStart, lang);
  const to = rawEnd ? localizeDate(rawEnd, lang) : (from ? PRESENT[lang] : '');
  return { from, to };
}
