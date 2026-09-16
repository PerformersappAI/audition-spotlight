import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { inputStyle, panel, primaryBtn } from "@/components/production/ProductionPicker";
import { PDFUploadProgress } from "@/components/PDFUploadProgress";
import { useOCRUpload } from "@/hooks/useOCRUpload";
import { LANGUAGE_CODES, LANGUAGES, languageLabel } from "@/lib/languages";
import { isSpreadsheetFile, spreadsheetToText } from "@/lib/translator/spreadsheet";
import type { SourceKind } from "@/lib/translator/types";

const MAX_CHARS = 20000;

interface Props {
  /** Target languages of the production. */
  languages: string[];
  translating: boolean;
  error?: string;
  onTranslate: (payload: { subject: string; sourceLanguage: string; text: string; sourceKind: SourceKind }) => void;
}

const ComposePanel = ({ languages, translating, error, onTranslate }: Props) => {
  const [subject, setSubject] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [text, setText] = useState("");
  const [sourceKind, setSourceKind] = useState<SourceKind>("text");
  const [fileError, setFileError] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);
  const { processFile, isProcessing, currentStage, elapsedTime, progress, currentFileName, currentFileSize } =
    useOCRUpload();

  const targets = languages.filter((c) => sourceLanguage === "auto" || c !== sourceLanguage);
  const canTranslate = text.trim().length >= 2 && targets.length > 0 && !translating && !isProcessing;

  const applyText = (value: string, kind: SourceKind) => {
    setText(value.slice(0, MAX_CHARS));
    setSourceKind(kind);
  };

  const handleFile = async (file: File) => {
    setFileError("");
    const name = file.name.toLowerCase();
    if (name.endsWith(".txt") || file.type === "text/plain") {
      applyText(await file.text(), "text");
      return;
    }
    if (isSpreadsheetFile(file)) {
      try {
        applyText(await spreadsheetToText(file), "spreadsheet");
      } catch (e) {
        setFileError(e instanceof Error ? e.message : "Could not read that spreadsheet.");
      }
      return;
    }
    const kind: SourceKind = file.type === "application/pdf" || name.endsWith(".pdf") ? "pdf" : "image";
    processFile(
      file,
      (result: { text?: string }) => {
        if (result?.text) applyText(result.text, kind);
      },
      (msg: string) => setFileError(msg),
    );
  };

  return (
    <div style={{ ...panel, padding: 20, marginBottom: 20 }}>
      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>New message</div>

      <div className="st-composerow" style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
            Subject (optional)
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Call time change"
            style={inputStyle}
          />
        </div>
        <div style={{ flex: "0 1 240px", minWidth: 0 }}>
          <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>From</label>
          <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} style={inputStyle}>
            <option value="auto" style={{ background: "#10101b" }}>Detect automatically</option>
            {LANGUAGE_CODES.map((code) => (
              <option key={code} value={code} style={{ background: "#10101b" }}>
                {languageLabel(code)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.xlsx,.xls,image/*,application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isProcessing}
          style={{
            minHeight: 44, padding: "0 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.05)", color: "#fff",
            border: "1px dashed rgba(255,255,255,0.22)", fontWeight: 600, fontSize: 15,
            cursor: "pointer", fontFamily: "'Inter Tight', sans-serif",
            display: "inline-flex", alignItems: "center", gap: 8,
            opacity: isProcessing ? 0.5 : 1,
          }}
        >
          <Upload size={16} /> Upload a document — PDF, photo, or spreadsheet
        </button>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
          PDFs and photos are read with AI (1 extra credit). Spreadsheets and text files are read on your device.
        </div>
      </div>

      {isProcessing && (
        <div style={{ marginTop: 14 }}>
          <PDFUploadProgress
            fileName={currentFileName}
            fileSize={currentFileSize}
            stage={currentStage === "idle" ? "reading" : currentStage}
            elapsedTime={elapsedTime}
            progress={progress}
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
          Type or paste your message
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={8}
          placeholder={"Call time tomorrow moves to 06:30 at the main location.\nPlease be on time — scene 12A."}
          style={{
            ...inputStyle,
            minHeight: 160,
            maxHeight: "60vh",
            resize: "vertical",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>
            Source: {sourceKind === "text" ? "typed or pasted" : sourceKind}
          </span>
          <span style={{ fontSize: 12.5, color: text.length >= MAX_CHARS ? "#ff9d9d" : "rgba(255,255,255,0.4)" }}>
            {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>It will produce:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {targets.length === 0 ? (
            <span style={{ fontSize: 13.5, color: "#ff9d9d" }}>
              Add another production language above to translate into.
            </span>
          ) : (
            targets.map((code) => (
              <span
                key={code}
                style={{
                  padding: "6px 12px", borderRadius: 9999, fontSize: 13.5, fontWeight: 600,
                  border: "1px solid rgba(0,212,170,0.4)", background: "rgba(0,212,170,0.12)", color: "#00d4aa",
                }}
              >
                {LANGUAGES[code]?.native || code}
              </span>
            ))
          )}
        </div>
      </div>

      {(error || fileError) && (
        <div style={{ color: "#ff9d9d", fontSize: 14, marginTop: 14 }}>{error || fileError}</div>
      )}

      <button
        onClick={() => onTranslate({ subject: subject.trim(), sourceLanguage, text, sourceKind })}
        disabled={!canTranslate}
        style={{
          ...primaryBtn,
          marginTop: 18,
          opacity: canTranslate ? 1 : 0.45,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}
      >
        {translating ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Translating…
          </>
        ) : (
          `Translate into ${targets.length} language${targets.length === 1 ? "" : "s"} (1 credit)`
        )}
      </button>
    </div>
  );
};

export default ComposePanel;
