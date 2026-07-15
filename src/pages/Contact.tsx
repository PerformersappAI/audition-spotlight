import { useState } from "react";

import Seo from "@/components/Seo";

const TEAL = "#00d4aa";
const TEAL_HOVER = "#00f0c0";

const inputStyle: React.CSSProperties = {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function QrPlaceholder() {
  return (
    <div style={{
      width: 120, height: 120, background: "#fff",
      borderRadius: 8, padding: 8, boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%", height: "100%",
        backgroundImage: `repeating-linear-gradient(0deg, #000 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 12px)`,
        backgroundSize: "12px 12px",
        opacity: 0.85,
        borderRadius: 2,
      }} />
    </div>
  );
}

export default function Contact() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks! We'll get back to you within 24 hours.");
    setFirst(""); setLast(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Contact Filmmaker Genius — Support, Sales & Feedback"
        description="Get in touch with the Filmmaker Genius team for product support, partnership questions, feature requests, and press inquiries."
        canonical="https://filmmakergenius.com/contact"
      />
      <style>{`
        .contact-h1 { font-size: 52px; }
        @media (min-width: 640px) { .contact-h1 { font-size: 68px; } }
        .contact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .contact-cards { grid-template-columns: 1fr; } }
        .contact-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .contact-name-row { grid-template-columns: 1fr; } }
        .contact-card:hover { border-color: rgba(0,212,170,0.35) !important; }
        .contact-qr:hover { border-color: rgba(0,212,170,0.3) !important; }
        .contact-input:focus { border-color: rgba(0,212,170,0.5) !important; }
        .contact-btn-teal:hover { background: ${TEAL_HOVER} !important; }
        .contact-btn-outline:hover { background: rgba(0,212,170,0.1) !important; }
      `}</style>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", padding: "72px 24px 56px", borderBottom: "1px solid #1e1e35", textAlign: "center" }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500, filter: "blur(80px)", opacity: 0.13,
          background: "radial-gradient(ellipse at center, rgba(0,212,170,0.6) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <h1 className="contact-h1" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
            Contact <span style={{ color: TEAL }}>Us</span>
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Have questions about our tools or membership? Need technical support? Want to discuss your project? We're here to help.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section style={{ maxWidth: 760, margin: "64px auto 0", padding: "0 24px" }}>
        <div className="contact-cards">
          {[
            { icon: "✉️", h: "Email Support", sub: "Get help via email within 24 hours", value: "sal@filmmakergenius.com", btn: "Send Email", href: "mailto:sal@filmmakergenius.com" },
            { icon: "📞", h: "Phone Support", sub: "Talk to our team during business hours", value: "702-481-5829", btn: "Call Now", href: "tel:7024815829" },
          ].map((c) => (
            <div key={c.h} className="contact-card" style={{
              background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 20, padding: 36,
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              transition: "border-color 0.2s",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 16,
              }}>{c.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{c.h}</h2>
              <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{c.sub}</div>
              <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: TEAL }}>{c.value}</div>
              <a href={c.href} className="contact-btn-teal" style={{
                marginTop: 20, width: "100%", height: 44, borderRadius: 10,
                background: TEAL, color: "#000", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", transition: "background 0.2s",
              }}>{c.btn}</a>
            </div>
          ))}
        </div>
      </section>

      {/* QR SECTION */}
      <section style={{ maxWidth: 560, margin: "72px auto 0", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, margin: 0, fontWeight: 700 }}>
          Scan to <span style={{ color: TEAL }}>Connect</span>
        </h2>
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Visit Our Website", sub: "filmmakergenius.com" },
            { label: "Follow Us", sub: "Social media placeholder" },
          ].map((q) => (
            <div key={q.label} className="contact-qr" style={{
              background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: 24,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              transition: "border-color 0.2s",
            }}>
              <QrPlaceholder />
              <div style={{ fontSize: 14, fontWeight: 700 }}>{q.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{q.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MESSAGE FORM */}
      <section style={{ maxWidth: 680, margin: "72px auto 0", padding: "0 24px" }}>
        <form onSubmit={submit} style={{
          background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 20, padding: 40,
        }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: 0, textAlign: "center", fontWeight: 700 }}>Send us a Message</h2>
          <div style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 6, marginBottom: 28 }}>
            We'll get back to you within 24 hours
          </div>

          <div className="contact-name-row" style={{ marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input className="contact-input" style={inputStyle} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Jane" />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input className="contact-input" style={inputStyle} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Smith" />
            </div>
          </div>

          <Field label="Email">
            <input type="email" className="contact-input" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
          </Field>
          <Field label="Subject">
            <input className="contact-input" style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help you?" />
          </Field>
          <Field label="Message">
            <textarea
              className="contact-input"
              style={{ ...inputStyle, minHeight: 130, resize: "vertical" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your inquiry..."
            />
          </Field>

          <button
            type="submit"
            className="contact-btn-teal"
            style={{
              width: "100%", height: 50, borderRadius: 12,
              background: TEAL, color: "#000", fontWeight: 700, fontSize: 15,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              marginTop: 4, transition: "background 0.2s",
            }}
          >Send Message</button>
        </form>
      </section>

    </div>
  );
}
