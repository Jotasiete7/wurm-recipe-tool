import { useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Language } from '../types';

interface LogSearchOptions {
  term: string;
  lang: Language;
  recipeId?: string;
  recipeName?: string;
  found: boolean;
}

/**
 * Fire-and-forget insert to search_logs.
 * Never throws — logging must never break the main app.
 */
async function logSearch(opts: LogSearchOptions) {
  if (opts.term.trim().length < 3) return;
  try {
    await supabase.from('search_logs').insert({
      term: opts.term.trim().toLowerCase(),
      recipe_id: opts.recipeId ?? null,
      recipe_name: opts.recipeName ?? null,
      lang: opts.lang,
      found: opts.found,
    });
  } catch {
    // Silently ignore — logging must never break the app
  }
}

/**
 * Hook that debounces the search term and logs it to Supabase.
 *
 * - Logs when recipes ARE found (found=true, top result id/name stored).
 * - Logs when NOTHING is found (found=false) — tells us what recipes the
 *   community wants but doesn't exist yet (zero-results insight).
 *
 * @param searchTerm  Current search input value
 * @param totalResults  Number of matching recipes (0 = zero-result search)
 * @param lang  Current UI language
 * @param topResultId  ID of the first/top recipe result (optional)
 * @param topResultName  Name of the first/top recipe result (optional)
 * @param debounceMs  How long to wait after last keystroke before logging (default 800ms)
 */
export function useSearchLogger(
  searchTerm: string,
  totalResults: number,
  lang: Language,
  topResultId?: string,
  topResultName?: string,
  debounceMs = 800
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTerm.trim().length < 3) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      logSearch({
        term: searchTerm,
        lang,
        recipeId: totalResults > 0 ? topResultId : undefined,
        recipeName: totalResults > 0 ? topResultName : undefined,
        found: totalResults > 0,
      });
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchTerm, totalResults, lang, topResultId, topResultName, debounceMs]);
}
