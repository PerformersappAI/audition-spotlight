import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

const TEAL = "#00d4aa";

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid #1e1e35",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14,
  color: "#fff",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.35)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 8,
};

const JOB_OPTIONS = [
  "Director",
  "Producer",
  "Executive Producer",
  "1st Assistant Director",
  "2nd Assistant Director",
  "Director of Photography",
  "Camera Operator",
  "1st AC",
  "Gaffer",
  "Key Grip",
  "Sound Mixer",
  "Boom Operator",
  "Production Designer",
  "Art Director",
  "Makeup Artist",
  "Hair Stylist",
  "Costume / Wardrobe",
  "Actor",
  "Background / Extra",
  "Production Assistant",
  "Other",
];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: TEAL, marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function PublicCastCrewForm() {
  const { slug } = useParams<{ slug: string }>();
  const [productionName, setProductionName] = useState<string | null>(null);
  const [formMissing, setFormMissing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [job, setJob] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [type, setType] = useState("Principal");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActorLike = job === "Actor" || job === "Background / Extra";
  const isOther = job === "Other";

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      const { data, error: fnError } = await supabase.functions.invoke(
        "submit-cast-crew-contact",
        { body: { slug, lookup_only: true, website: "" } },
      );
      // The lookup is best-effort; the form still works without a production name.
      if (!active) return;
      if (fnError) return;
      const name = (data as any)?.production_name;
      if (name) setProductionName(name);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) return;

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !job) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isOther && !otherRole.trim()) {
      setError("Please specify your role.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "submit-cast-crew-contact",
        {
          body: {
            slug,
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            instagram_handle: instagram || null,
            job_position: job,
            other_role: isOther ? otherRole : null,
            character_name: isActorLike ? characterName || null : null,
            actor_type: isActorLike ? type : null,
            notes: notes || null,
            website: honeypot,
          },
        },
      );

      if (fnError || (data as any)?.error) {
        if ((data as any)?.error === "Form not found") {
          setFormMissing(true);
          return;
        }
        setError("Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Cast & Crew Contact Form — Filmmaker Genius"
        description="Join the production list. Share your contact info, role, and availability for cast and crew opportunities."
        canonical={`https://filmmakergenius.com/f/${slug ?? ""}`}
      />
      <style>{`
        .ccc-h1 { font-size: 40px; }
        @media (min-width: 640px) { .ccc-h1 { font-size: 52px; } }
        .ccc-input:focus { border-color: rgba(0,212,170,0.5) !important; }
        .ccc-btn:hover { background: #00f0c0 !important; }
        .ccc-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 18px; }
        @media (min-width: 560px) { .ccc-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <section style={{ position: "relative", overflow: "hidden", padding: "72px 24px 40px", textAlign: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 500,
            filter: "blur(80px)",
            opacity: 0.13,
            background: "radial-gradient(ellipse at center, rgba(0,212,170,0.6) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          {productionName && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, marginBottom: 12 }}>
              {productionName}
            </div>
          )}
          <h1 className="ccc-h1" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
            Cast &amp; Crew <span style={{ color: TEAL }}>Contact Form</span>
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Add yourself to the production list. Tell us who you are, what you do, and how to reach you.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 680, margin: "0 auto 96px", padding: "0 24px" }}>
        {formMissing ? (
          <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: "32px 24px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: 0 }}>This form isn't available.</h2>
            <p style={{ marginTop: 10, color: "rgba(255,255,255,0.5)" }}>
              Double-check the link with the production you're contacting.
            </p>
          </div>
        ) : submitted ? (
          <div
            style={{
              background: "rgba(0,212,170,0.08)",
              border: "1px solid rgba(0,212,170,0.25)",
              borderRadius: 16,
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 42, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: 0, fontWeight: 700 }}>You're on the list.</h2>
            <p style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              Thank you! Your information has been added to the production list.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 20, padding: 32 }}>
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 20,
                  fontSize: 14,
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            <div className="ccc-grid">
              <div>
                <label style={labelStyle}>First Name<span style={{ color: TEAL, marginLeft: 4 }}>*</span></label>
                <input className="ccc-input" style={inputBase} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
              </div>
              <div>
                <label style={labelStyle}>Last Name<span style={{ color: TEAL, marginLeft: 4 }}>*</span></label>
                <input className="ccc-input" style={inputBase} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
              </div>
            </div>

            <Field label="Phone Number" required>
              <input type="tel" className="ccc-input" style={inputBase} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
            </Field>

            <Field label="Email Address" required>
              <input type="email" className="ccc-input" style={inputBase} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </Field>

            <Field label="Instagram Handle">
              <input className="ccc-input" style={inputBase} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" />
            </Field>

            <Field label="Job / Position on the Film" required>
              <select
                className="ccc-input"
                style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
                value={job}
                onChange={(e) => setJob(e.target.value)}
              >
                <option value="" disabled style={{ background: "#0d0d1a", color: "#fff" }}>
                  Select a role
                </option>
                {JOB_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ background: "#0d0d1a", color: "#fff" }}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>

            {isOther && (
              <Field label="Please specify your role" required>
                <input className="ccc-input" style={inputBase} value={otherRole} onChange={(e) => setOtherRole(e.target.value)} placeholder="e.g. Drone Operator" />
              </Field>
            )}

            {isActorLike && (
              <div
                style={{
                  background: "rgba(0,212,170,0.05)",
                  border: "1px solid rgba(0,212,170,0.15)",
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 18,
                }}
              >
                <Field label="Character / Role Name">
                  <input className="ccc-input" style={inputBase} value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="e.g. Detective Miller" />
                </Field>
                <Field label="Type">
                  <select
                    className="ccc-input"
                    style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Principal" style={{ background: "#0d0d1a", color: "#fff" }}>Principal</option>
                    <option value="Background / Extra" style={{ background: "#0d0d1a", color: "#fff" }}>Background / Extra</option>
                  </select>
                </Field>
              </div>
            )}

            <Field label="Notes / Additional Comments">
              <textarea
                className="ccc-input"
                style={{ ...inputBase, minHeight: 120, resize: "vertical" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Availability, gear you bring, union status, links to reels, etc."
              />
            </Field>

            {/* Honeypot */}
            <div style={{ display: "none" }} aria-hidden="true">
              <label>Do not fill this field</label>
              <input type="text" tabIndex={-1} autoComplete="off" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <button
              type="submit"
              className="ccc-btn"
              disabled={submitting}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 12,
                background: TEAL,
                color: "#000",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.7 : 1,
                fontFamily: "inherit",
                marginTop: 8,
                transition: "background 0.2s",
              }}
            >
              {submitting ? "Submitting…" : "Join Production List"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
