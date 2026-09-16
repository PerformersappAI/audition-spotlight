import { useState } from "react";
import { Copy, Download, FileText, Loader2, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { ghostBtn, panel, primaryBtn } from "@/components/production/ProductionPicker";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import {
  messageSubjects,
  messageTranslations,
  RTL_LANGUAGES,
  type ProductionMessage,
} from "@/lib/translator/types";
import {
  allLanguagesText,
  downloadMessagePDF,
  downloadMessageText,
} from "@/lib/translator/exportMessage";

interface Props {
  message: ProductionMessage;
  productionTitle: string;
  shootLocation?: string | null;
  onNewMessage: () => void;
}

const copy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Could not copy — please select the text instead.");
  }
};

const Card = ({
  code,
  heading,
  subject,
  text,
}: {
  code: string;
  heading: string;
  subject?: string;
  text: string;
}) => {
  const rtl = RTL_LANGUAGES.has(code);
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${subject ? `${subject}\n\n` : ""}${text}`)}`;
  return (
    <div style={{ ...panel, padding: 18, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, color: "#00d4aa" }}>
          {heading}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => copy(`${subject ? `${subject}\n\n` : ""}${text}`, heading)}
            style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Copy size={15} /> Copy
          </button>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", lineHeight: "44px" }}
          >
            <MessageCircle size={15} /> Share on WhatsApp
          </a>
        </div>
      </div>
      <div dir={rtl ? "rtl" : "ltr"} style={{ marginTop: 12 }}>
        {subject && (
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{subject}</div>
        )}
        <div style={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.85)" }}>
          {text}
        </div>
      </div>
    </div>
  );
};

const ResultView = ({ message, productionTitle, shootLocation, onNewMessage }: Props) => {
  const [busy, setBusy] = useState<"txt" | "pdf" | null>(null);
  const subjects = messageSubjects(message);
  const translations = messageTranslations(message);

  const run = async (kind: "txt" | "pdf") => {
    setBusy(kind);
    try {
      const input = { message, productionTitle, shootLocation };
      if (kind === "txt") await downloadMessageText(input);
      else await downloadMessagePDF(input);
      toast.success(kind === "txt" ? "Text file downloaded" : "PDF downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button
          onClick={() => copy(allLanguagesText(message), "All languages")}
          style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Copy size={15} /> Copy all
        </button>
        <button
          onClick={() => run("txt")}
          disabled={busy !== null}
          style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6, opacity: busy ? 0.5 : 1 }}
        >
          {busy === "txt" ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />} Download .txt
        </button>
        <button
          onClick={() => run("pdf")}
          disabled={busy !== null}
          style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 6, opacity: busy ? 0.5 : 1 }}
        >
          {busy === "pdf" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} Download PDF
        </button>
        <button onClick={onNewMessage} style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> New message
        </button>
      </div>

      <Card
        code={message.source_language}
        heading={`${LANGUAGES[message.source_language]?.native || message.source_language} — Original`}
        subject={message.subject || undefined}
        text={message.source_text}
      />

      {translations.map(({ code, text }) => (
        <Card
          key={code}
          code={code}
          heading={`${LANGUAGES[code]?.native || code} — ${LANGUAGES[code]?.name || languageLabel(code)}`}
          subject={subjects[code]}
          text={text}
        />
      ))}
    </div>
  );
};

export default ResultView;
