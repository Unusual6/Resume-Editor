/**
 * Free translation using Lingva API (open-source Google Translate proxy).
 * No API key required, no rate limits.
 * Multiple public instances available for redundancy.
 */

// Multiple Lingva instances for fallback
const INSTANCES = [
  'https://lingva.ml/api/v1',
  'https://lingva.lunar.icu/api/v1',
  'https://translate.plausibility.cloud/api/v1',
];

interface TranslationResult {
  translatedText: string;
  success: boolean;
}

async function tryTranslate(instance: string, text: string, from: string, to: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${instance}/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(text)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.translation || null;
  } catch {
    return null;
  }
}

export async function translateText(
  text: string,
  from: 'zh' | 'en',
  to: 'zh' | 'en'
): Promise<TranslationResult> {
  if (!text || !text.trim()) {
    return { translatedText: '', success: true };
  }

  // Try each instance until one succeeds
  for (const instance of INSTANCES) {
    const result = await tryTranslate(instance, text, from, to);
    if (result) {
      return { translatedText: result, success: true };
    }
  }

  console.error('All translation instances failed');
  return { translatedText: '', success: false };
}

/**
 * Translate multiple texts in batch (sequentially to avoid rate limiting).
 */
export async function translateBatch(
  texts: string[],
  from: 'zh' | 'en',
  to: 'zh' | 'en',
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const results: string[] = [];
  const total = texts.length;

  for (let i = 0; i < texts.length; i++) {
    const result = await translateText(texts[i], from, to);
    results.push(result.success ? result.translatedText : texts[i]);
    onProgress?.(i + 1, total);
    // Small delay to avoid rate limiting
    if (i < texts.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return results;
}
