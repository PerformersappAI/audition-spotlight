// Shared translation prompt + gateway call used by translate-message (owner)
// and breakdown-crew's message_post (crew). Behaviour must stay identical for both.

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", de: "German", bs: "Bosnian", hr: "Croatian", sr: "Serbian",
  es: "Spanish", fr: "French", it: "Italian", pt: "Portuguese", nl: "Dutch",
  pl: "Polish", cs: "Czech", hu: "Hungarian", ro: "Romanian", tr: "Turkish",
  el: "Greek", ru: "Russian", uk: "Ukrainian", ar: "Arabic", he: "Hebrew",
  hi: "Hindi", zh: "Chinese", ja: "Japanese", ko: "Korean", sv: "Swedish",
  no: "Norwegian", da: "Danish", fi: "Finnish",
};

export const LANGUAGE_NATIVE: Record<string, string> = {
  en: "English", de: "Deutsch", bs: "Bosanski", hr: "Hrvatski", sr: "Srpski",
  es: "Español", fr: "Français", it: "Italiano", pt: "Português", nl: "Nederlands",
  pl: "Polski", cs: "Čeština", hu: "Magyar", ro: "Română", tr: "Türkçe",
  el: "Ελληνικά", ru: "Русский", uk: "Українська", ar: "العربية", he: "עברית",
  hi: "हिन्दी", zh: "中文", ja: "日本語", ko: "한국어", sv: "Svenska",
  no: "Norsk", da: "Dansk", fi: "Suomi",
};

export const RTL_LANGUAGES = new Set(["ar", "he"]);

export const MAX_TARGETS = 8;
export const MAX_TEXT = 20000;
export const MAX_SUBJECT = 300;

export function systemPrompt(targets: string[]): string {
  const list = targets.map((c) => `${c} (${LANGUAGE_NAMES[c] || c})`).join(", ");
  return `You are a professional translator for an international film production crew. Translate the user's message into each of these languages: ${list}. Rules: keep names, times, dates, addresses, phone numbers, scene numbers and location names exactly as written; keep film-set terminology accurate (call time, wrap, lunch, company move, first team, holding, etc.) using the terms crews use in each language; preserve line breaks, lists and paragraph structure; use the polite, professional register that is customary for workplace instructions in each target language (e.g. formal 'you' where the language distinguishes it); do not add notes or explanations. Also identify the source language. Return ONLY JSON: {"detected_language": "<ISO 639-1 code>", "translations": {"<code>": "<translated text>", ...}}. If the subject is provided, translate it too as {"subject_translations": {"<code>": "..."}}.`;
}

export function extractJson(raw: string): Record<string, unknown> | null {
  let content = (raw || "").trim();
  if (content.startsWith("```json")) content = content.slice(7);
  else if (content.startsWith("```")) content = content.slice(3);
  if (content.endsWith("```")) content = content.slice(0, -3);
  content = content.trim();
  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");
  if (first !== -1 && last > first) content = content.slice(first, last + 1);
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export interface TranslateResult {
  detected: string;
  translations: Record<string, string>;
  subjects: Record<string, string>;
  usage: { prompt_tokens?: number; completion_tokens?: number };
}

async function callGateway(
  apiKey: string,
  targets: string[],
  subject: string | null,
  text: string,
  sourceLanguage: string,
): Promise<{ result: TranslateResult | null; status: number }> {
  const userParts = [
    sourceLanguage === "auto"
      ? "The source language is unknown — detect it."
      : `The source language is ${sourceLanguage} (${LANGUAGE_NAMES[sourceLanguage] || sourceLanguage}).`,
    subject ? `SUBJECT:\n${subject}` : "",
    `MESSAGE:\n${text}`,
  ].filter(Boolean);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt(targets) },
        { role: "user", content: userParts.join("\n\n") },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Lovable AI error:", response.status, errorText);
    return { result: null, status: response.status };
  }

  const data = await response.json();
  const parsed = extractJson(data.choices?.[0]?.message?.content || "");
  if (!parsed) return { result: null, status: 502 };

  const rawTranslations = (parsed.translations || {}) as Record<string, unknown>;
  const rawSubjects = (parsed.subject_translations || {}) as Record<string, unknown>;
  const translations: Record<string, string> = {};
  const subjects: Record<string, string> = {};
  for (const code of targets) {
    const value = rawTranslations[code];
    if (typeof value === "string" && value.trim()) translations[code] = value;
    const sub = rawSubjects[code];
    if (subject && typeof sub === "string" && sub.trim()) subjects[code] = sub.trim();
  }

  const detectedRaw = typeof parsed.detected_language === "string"
    ? parsed.detected_language.trim().toLowerCase()
    : "";
  const detected = LANGUAGE_NAMES[detectedRaw]
    ? detectedRaw
    : sourceLanguage === "auto" ? "" : sourceLanguage;

  return { result: { detected, translations, subjects, usage: data.usage || {} }, status: 200 };
}

/**
 * One attempt, then a single retry when the language set comes back incomplete.
 * `status` carries the last gateway status so callers can map 429/402 themselves.
 */
export async function translateWithRetry(
  apiKey: string,
  targets: string[],
  subject: string | null,
  text: string,
  sourceLanguage: string,
): Promise<{ result: TranslateResult | null; status: number }> {
  let lastStatus = 502;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const call = await callGateway(apiKey, targets, subject, text, sourceLanguage);
    lastStatus = call.status;
    if (call.status === 429 || call.status === 402) return { result: null, status: call.status };
    if (call.result) {
      const detected = call.result.detected || sourceLanguage;
      const required = targets.filter((c) => c !== detected);
      if (required.every((c) => !!call.result!.translations[c])) {
        return { result: call.result, status: 200 };
      }
      console.error("incomplete translation set", {
        attempt,
        got: Object.keys(call.result.translations),
      });
    }
  }
  return { result: null, status: lastStatus };
}

/** Builds the stored `translations` jsonb (targets minus the source, plus `_subjects`). */
export function buildTranslationsColumn(
  result: TranslateResult,
  storedSource: string,
): Record<string, unknown> {
  const translations: Record<string, unknown> = {};
  for (const [code, value] of Object.entries(result.translations)) {
    if (code === storedSource) continue;
    translations[code] = value;
  }
  const subjects: Record<string, string> = {};
  for (const [code, value] of Object.entries(result.subjects)) {
    if (code === storedSource) continue;
    subjects[code] = value;
  }
  if (Object.keys(subjects).length) translations._subjects = subjects;
  return translations;
}

/** The production's configured languages, filtered to codes we know. */
export function productionLanguages(raw: unknown): string[] {
  return (Array.isArray(raw) ? raw : [])
    .filter((c: unknown): c is string => typeof c === "string" && !!LANGUAGE_NAMES[c]);
}
