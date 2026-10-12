/**
 * Free translation using MyMemory API (no API key required).
 * Supports CORS from browser.
 * Limit: ~5000 chars/day for anonymous users.
 */

const API_URL = 'https://api.mymemory.translated.net/get';

interface TranslationResult {
  translatedText: string;
  success: boolean;
}

export async function translateText(
  text: string,
  from: 'zh' | 'en',
  to: 'zh' | 'en'
): Promise<TranslationResult> {
  if (!text || !text.trim()) {
    return { translatedText: '', success: true };
  }

  const langPair = `${from}|${to}`;

  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return {
        translatedText: data.responseData.translatedText,
        success: true,
      };
    }

    // Fallback: try matches
    if (data.matches && data.matches.length > 0) {
      const best = data.matches.reduce((a: any, b: any) =>
        (b.quality || 0) > (a.quality || 0) ? b : a
      );
      return {
        translatedText: best.translation || '',
        success: true,
      };
    }

    return { translatedText: '', success: false };
  } catch (error) {
    console.error('Translation error:', error);
    return { translatedText: '', success: false };
  }
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
