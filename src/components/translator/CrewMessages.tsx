import { useEffect, useMemo, useState } from "react";
import { Copy, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { ghostBtn, inputStyle, panel, primaryBtn } from "@/components/production/ProductionPicker";
import WeatherBar from "@/components/production/WeatherBar";
import { timeAgo } from "@/components/breakdown/timeAgo";
import { LANGUAGES } from "@/lib/languages";
import { crewMessageApi } from "@/lib/translator/crew";
import {
  messageSubjects,
  messageTranslations,
  RTL_LANGUAGES,
  type ProductionMessage,
} from "@/lib/translator/types";
import type { CrewIdentity } from "@/lib/breakdown/adapter";

const MAX_TEXT = 5000;

const native = (code: string) => LANGUAGES[code]?.native || code;

interface Props {
  token: string;
  identity: CrewIdentity;
  languages: string[];
  shootLocation?: string | null;
  messages: ProductionMessage[];
  loading: boolean;
  hasMore: boolean;
  preferredLanguage: string | null;
  onLoadMore: () => void;
  onPosted: () => void;
}

const copy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  } catch {
    toast.error("Could not copy — please select the text instead.");
  }
};

const MessageCard = ({
  message,
  readLanguage,
}: {
  message: ProductionMessage;
  readLanguage: string;
}) => {
  const [showAll, setShowAll] = useState(false);
  const subjects = messageSubjects(message);
  const translations = messageTranslations(message);

  const chosen = useMemo(() => {
    if (readLanguage === message.source_language) {
      return { code: message.source_language, subject: message.subject || "", text: message.source_text, fallback: false };
    }
    const hit = translations.find((t) => t.code === readLanguage);
    if (hit) return { code: hit.code, subject: subjects[hit.code] || "", text: hit.text, fallback: false };
    return {
      code: message.source_language,
      subject: message.subject || "",
      text: message.source_text,
      fallback: true,
    };
  }, [message, readLanguage, subjects, translations]);

  const all = [
    {
      code: message.source_language,
      heading: `${native(message.source_language)} — Original`,
      subject: message.subject || "",
      text: message.source_text,
    },
    ...translations.map((t) => ({
      code: t.code,
      heading: `${native(t.code)} — ${LANGUAGES[t.code]?.name || t.code}`,
      subject: subjects[t.code] || "",
      text: t.text,
    })),
  ];

  return (
    <div style={{ ...panel, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>
          {timeAgo(message.created_at)} · from {message.created_by_name}
          {chosen.fallback && (
            <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.6)" }}>
              Original ({native(message.source_language)})
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => copy(`${chosen.subject ? `${chosen.subject}\n\n` : ""}${chosen.text}`)}
            style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Copy size={15} /> Copy
          </button>
          {translations.length > 0 && (
            <button onClick={() => setShowAll((v) => !v)} style={ghostBtn}>
              {showAll ? "Hide languages" : "Show all languages"}
            </button>
          )}
        </div>
      </div>

      {!showAll ? (
        <div dir={RTL_LANGUAGES.has(chosen.code) ? "rtl" : "ltr"} style={{ marginTop: 12 }}>
          {chosen.subject && (
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{chosen.subject}</div>
          )}
          <div style={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.85)" }}>
            {chosen.text}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 16 }}>
          {all.map((section) => (
            <div key={section.code} dir={RTL_LANGUAGES.has(section.code) ? "rtl" : "ltr"}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4aa", marginBottom: 6 }}>{section.heading}</div>
              {section.subject && (
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6, color: "#fff" }}>{section.subject}</div>
              )}
              <div style={{ whiteSpace: "pre-wrap", fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
                {section.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CrewMessages = ({
  token,
  identity,
  languages,
  shootLocation,
  messages,
  loading,
  hasMore,
  preferredLanguage,
  onLoadMore,
  onPosted,
}: Props) => {
  const api = useMemo(() => crewMessageApi(token, identity), [token, identity]);

  const initialLanguage = useMemo(() => {
    const stored = readStoredLanguage(token);
    if (stored && languages.includes(stored)) return stored;
    if (preferredLanguage && languages.includes(preferredLanguage)) return preferredLanguage;
    const browser = (navigator.language || "").slice(0, 2).toLowerCase();
    if (browser && languages.includes(browser)) return browser;
    return languages[0] || messages[0]?.source_language || "en";
  }, [token, languages, preferredLanguage, messages]);

  const [readLanguage, setReadLanguage] = useState(initialLanguage);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setReadLanguage((current) => (languages.includes(current) ? current : initialLanguage));
  }, [initialLanguage, languages]);

  const changeLanguage = async (code: string) => {
    setReadLanguage(code);
    storeLanguage(token, code);
    try {
      await api.setLanguage(code);
    } catch { /* the local choice still applies */ }
  };

  const post = async () => {
    const value = text.trim();
    if (value.length < 2) return;
    setPosting(true);
    try {
      const res = await api.post(subject.trim(), value.slice(0, MAX_TEXT));
      setSubject("");
      setText("");
      onPosted();
      toast.success(
        res.translated
          ? "Posted and translated for the crew"
          : "Posted in your own language — translation wasn't available",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The message couldn't be posted.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
      {shootLocation && (
        <div style={{ ...panel, padding: 16 }}>
          <WeatherBar location={shootLocation} />
        </div>
      )}

      <div style={{ ...panel, padding: 18 }}>
        <label htmlFor="crew-read-lang" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 }}>
          Read in
        </label>
        <select
          id="crew-read-lang"
          value={readLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          style={{ ...inputStyle, maxWidth: 260 }}
        >
          {languages.map((code) => (
            <option key={code} value={code} style={{ background: "#10101b" }}>{native(code)}</option>
          ))}
        </select>
      </div>

      <div style={{ ...panel, padding: 18 }}>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>Write a message</div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
          Everyone on this link gets it in their own language.
        </p>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
          maxLength={300}
          style={{ ...inputStyle, marginTop: 12 }}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
          rows={4}
          placeholder="Type your message…"
          style={{ ...inputStyle, marginTop: 10, resize: "vertical", lineHeight: 1.6 }}
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginTop: 12 }}>
          <button
            onClick={post}
            disabled={posting || text.trim().length < 2}
            style={{
              ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 8,
              opacity: posting || text.trim().length < 2 ? 0.45 : 1,
            }}
          >
            {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {posting ? "Posting…" : "Translate & post (for everyone)"}
          </button>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>
            {text.length.toLocaleString()} / {MAX_TEXT.toLocaleString()}
          </span>
        </div>
      </div>

      {loading && messages.length === 0 ? (
        <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading messages…
        </div>
      ) : messages.length === 0 ? (
        <div style={{ ...panel, padding: 24, color: "rgba(255,255,255,0.55)", fontSize: 14.5 }}>
          No messages yet. Anything the production office sends will show up here.
        </div>
      ) : (
        <>
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} readLanguage={readLanguage} />
          ))}
          {hasMore && (
            <button onClick={onLoadMore} style={ghostBtn}>Load older messages</button>
          )}
        </>
      )}
    </div>
  );
};

export default CrewMessages;
