import { useEffect, useState } from "react";
import ProductionPicker, { inputStyle, panel, primaryBtn, type Production } from "@/components/production/ProductionPicker";
import WeatherBar from "@/components/production/WeatherBar";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGE_CODES, LANGUAGES } from "@/lib/languages";
import { aiInvoke, InsufficientCreditsError } from "@/lib/aiInvoke";
import ComposePanel from "@/components/translator/ComposePanel";
import ResultView from "@/components/translator/ResultView";
import MessageHistory from "@/components/translator/MessageHistory";
import type { ProductionMessage, SourceKind } from "@/lib/translator/types";

const STEPS = [
  { n: 1, title: "Pick your production", text: "And the languages your crew speaks." },
  { n: 2, title: "Type, paste or upload", text: "A message, a safety note or a document." },
  { n: 3, title: "Translate into every language", text: "All languages at once, in one go." },
  { n: 4, title: "Copy, download or send", text: "Straight to your crew." },
];

const SetTranslator = () => {
  const [selectedProject, setSelectedProject] = useState<Production | null>(null);
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [location, setLocation] = useState("");
  const [savedLocation, setSavedLocation] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);

  useEffect(() => {
    if (!selectedProject) return;
    setLanguages(selectedProject.languages?.length ? selectedProject.languages : ["en"]);
    setLocation(selectedProject.shoot_location || "");
    setSavedLocation(selectedProject.shoot_location || "");
  }, [selectedProject]);

  const toggleLanguage = async (code: string) => {
    if (!selectedProject) return;
    const next = languages.includes(code)
      ? languages.filter((c) => c !== code)
      : [...languages, code];
    if (next.length === 0) return; // at least one required
    setLanguages(next);
    await supabase.from("breakdown_projects").update({ languages: next }).eq("id", selectedProject.id);
  };

  const saveLocation = async () => {
    if (!selectedProject) return;
    setSavingLocation(true);
    const value = location.trim();
    await supabase
      .from("breakdown_projects")
      .update({ shoot_location: value || null })
      .eq("id", selectedProject.id);
    setSavedLocation(value);
    setSavingLocation(false);
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "60vh" }}>
      <style>{`
        @media (max-width: 800px) { .st-steps { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) {
          .st-steps { grid-template-columns: 1fr !important; }
          .st-h1 { font-size: 34px !important; }
          .st-locrow { flex-direction: column !important; align-items: stretch !important; }
        }
        .st-step-num {
          width: 28px; height: 28px; border-radius: 9999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,212,170,0.12); color: #00d4aa;
          border: 1px solid rgba(0,212,170,0.4);
          font-size: 13px; font-weight: 700; flex: 0 0 auto;
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", overflowX: "hidden" }}>
        <div style={{ padding: "64px 0 36px", textAlign: "center" }}>
          <h1 className="st-h1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 52, lineHeight: 1.05, margin: 0 }}>
            Set Translator
          </h1>
          <p style={{ marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 720, margin: "16px auto 0", lineHeight: 1.65 }}>
            Write a message or upload a document once. Your whole crew gets it in their own language.
          </p>
        </div>

        <div style={{ paddingBottom: 40 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: 20,
          }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="st-steps">
            {STEPS.map((s) => (
              <div key={s.n} style={{
                borderRadius: 16, padding: 20,
                background: "linear-gradient(135deg, #071820 0%, #0a2a30 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <span className="st-step-num">{s.n}</span>
                <div>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.5 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ProductionPicker
          emptyText="Give it a name, then set the languages your crew speaks."
          onSelect={(p) => setSelectedProject(p)}
        />

        {selectedProject && (
          <>
            <div style={{ ...panel, padding: 20, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>Production languages</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
                Every message gets translated into all of these at once. At least one is required.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {LANGUAGE_CODES.map((code) => {
                  const on = languages.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleLanguage(code)}
                      aria-pressed={on}
                      style={{
                        minHeight: 44, padding: "0 14px", borderRadius: 9999,
                        border: `1px solid ${on ? "rgba(0,212,170,0.55)" : "rgba(255,255,255,0.14)"}`,
                        background: on ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
                        color: on ? "#00d4aa" : "rgba(255,255,255,0.75)",
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Inter Tight', sans-serif",
                      }}
                    >
                      {LANGUAGES[code].native}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ ...panel, padding: 20, marginBottom: 20 }}>
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, fontWeight: 700 }}>Shoot location</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
                The city you're shooting in — used for the weather line on messages and call sheets.
              </p>
              <div className="st-locrow" style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Sarajevo"
                  style={{ ...inputStyle, maxWidth: 320 }}
                />
                <button
                  onClick={saveLocation}
                  disabled={savingLocation}
                  style={{ ...primaryBtn, opacity: savingLocation ? 0.5 : 1 }}
                >
                  {savingLocation ? "Saving…" : "Save"}
                </button>
              </div>
              {savedLocation && <WeatherBar location={savedLocation} />}
            </div>

            <div style={{ ...panel, padding: 24, marginBottom: 48, textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
              Translation is coming next.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SetTranslator;
