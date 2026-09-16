/** The crew member's "Read in" language, remembered per share link on this device. */
const langKey = (token: string) => `fg_crew_lang_${token}`;

export const readStoredLanguage = (token: string): string | null => {
  try {
    return localStorage.getItem(langKey(token));
  } catch {
    return null;
  }
};

export const storeLanguage = (token: string, code: string) => {
  try {
    localStorage.setItem(langKey(token), code);
  } catch { /* private browsing — the in-memory choice still applies */ }
};
