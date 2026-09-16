export interface LanguageInfo {
  /** English name of the language. */
  name: string;
  /** Native name, as crew would recognise it. */
  native: string;
}

/** Languages a production can work in, keyed by ISO 639-1 code. */
export const LANGUAGES: Record<string, LanguageInfo> = {
  en: { name: "English", native: "English" },
  de: { name: "German", native: "Deutsch" },
  bs: { name: "Bosnian", native: "Bosanski" },
  hr: { name: "Croatian", native: "Hrvatski" },
  sr: { name: "Serbian", native: "Srpski" },
  es: { name: "Spanish", native: "Español" },
  fr: { name: "French", native: "Français" },
  it: { name: "Italian", native: "Italiano" },
  pt: { name: "Portuguese", native: "Português" },
  nl: { name: "Dutch", native: "Nederlands" },
  pl: { name: "Polish", native: "Polski" },
  cs: { name: "Czech", native: "Čeština" },
  hu: { name: "Hungarian", native: "Magyar" },
  ro: { name: "Romanian", native: "Română" },
  tr: { name: "Turkish", native: "Türkçe" },
  el: { name: "Greek", native: "Ελληνικά" },
  ru: { name: "Russian", native: "Русский" },
  uk: { name: "Ukrainian", native: "Українська" },
  ar: { name: "Arabic", native: "العربية" },
  he: { name: "Hebrew", native: "עברית" },
  hi: { name: "Hindi", native: "हिन्दी" },
  zh: { name: "Chinese", native: "中文" },
  ja: { name: "Japanese", native: "日本語" },
  ko: { name: "Korean", native: "한국어" },
  sv: { name: "Swedish", native: "Svenska" },
  no: { name: "Norwegian", native: "Norsk" },
  da: { name: "Danish", native: "Dansk" },
  fi: { name: "Finnish", native: "Suomi" },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES);

/** "German (Deutsch)" — or the raw code when unknown. */
export function languageLabel(code: string): string {
  const info = LANGUAGES[code];
  if (!info) return code;
  return info.name === info.native ? info.name : `${info.name} (${info.native})`;
}
