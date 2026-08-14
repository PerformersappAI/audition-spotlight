import { useCallback, useEffect, useState } from "react";
import Seo from "@/components/Seo";
import ToolTopBar from "@/components/ToolTopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  castCrewReportBase64,
  exportCastCrewReportToPDF,
  reportFileName,
} from "@/utils/exportCastCrewReportToPDF";


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

const cardStyle: React.CSSProperties = {
  background: "#0d0d1a",
  border: "1px solid #1e1e35",
  borderRadius: 20,
  padding: 28,
  marginBottom: 24,
};

interface CastCrewForm {
  id: string;
  slug: string;
  production_name: string | null;
  notify_email: string;
}

interface CastCrewContact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  job_position: string | null;
  other_role: string | null;
  character_name: string | null;
  actor_type: string | null;
  notes: string | null;
  created_at: string;
}

const makeSlug = () => {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
};

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

export default function ContactCastCrew() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<CastCrewForm | null>(null);
  const [contacts, setContacts] = useState<CastCrewContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [productionName, setProductionName] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadContacts = useCallback(async (formId: string) => {
    const { data } = await supabase
      .from("cast_crew_contacts")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: false });
    setContacts((data ?? []) as CastCrewContact[]);
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      setLoading(true);
      const { data: existing } = await supabase
        .from("cast_crew_forms")
        .select("id, slug, production_name, notify_email")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      let row = existing as CastCrewForm | null;

      if (!row) {
        const { data: created, error } = await supabase
          .from("cast_crew_forms")
          .insert({
            owner_user_id: user.id,
            slug: makeSlug(),
            notify_email: user.email ?? "",
          })
          .select("id, slug, production_name, notify_email")
          .single();
        if (error) {
          toast({ title: "Could not create your form", description: error.message, variant: "destructive" });
          if (active) setLoading(false);
          return;
        }
        row = created as CastCrewForm;
      }

      if (!active) return;
      setForm(row);
      setNotifyEmail(row.notify_email ?? "");
      setProductionName(row.production_name ?? "");
      await loadContacts(row.id);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user, loadContacts, toast]);

  const shareUrl = form ? `https://filmmakergenius.com/f/${form.slug}` : "";

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Select the link and copy it manually." });
    }
  };

  const saveSettings = async () => {
    if (!form) return;
    if (!notifyEmail.trim()) {
      toast({ title: "Notification email required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("cast_crew_forms")
      .update({
        notify_email: notifyEmail.trim(),
        production_name: productionName.trim() || null,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved", description: "Your form settings are updated." });
  };

  const exportCsv = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Phone",
      "Email",
      "Instagram",
      "Job / Position",
      "Specified Role",
      "Character Name",
      "Type",
      "Notes",
      "Submitted",
    ];
    const rows = contacts.map((c) =>
      [
        c.first_name,
        c.last_name,
        c.phone,
        c.email,
        c.instagram_handle,
        c.job_position,
        c.other_role,
        c.character_name,
        c.actor_type,
        c.notes,
        new Date(c.created_at).toLocaleString(),
      ]
        .map(csvCell)
        .join(","),
    );
    const csv = [headers.map(csvCell).join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cast-crew-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    exportCastCrewReportToPDF({ productionName, contacts });
    toast({ title: "Report downloaded", description: "Your cast & crew contact sheet PDF is ready." });
  };

  const emailPdf = async () => {
    if (!form) return;
    setEmailing(true);
    try {
      const pdfBase64 = castCrewReportBase64({ productionName, contacts });
      const { data, error } = await supabase.functions.invoke("send-cast-crew-report", {
        body: {
          formId: form.id,
          pdfBase64,
          fileName: reportFileName(productionName),
          contactCount: contacts.length,
        },
      });
      if (error) throw error;
      toast({
        title: "Report emailed",
        description: `Sent to ${(data as { sentTo?: string })?.sentTo ?? notifyEmail}.`,
      });
    } catch (err) {
      toast({
        title: "Could not email the report",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setEmailing(false);
    }
  };


  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Contact Cast & Crew — Filmmaker Genius"
        description="Collect cast and crew contact details with your own shareable production form and email notifications."
        canonical="https://filmmakergenius.com/contact-cast-crew"
      />
      <ToolTopBar />
      <style>{`
        .ccc-input:focus { border-color: rgba(0,212,170,0.5) !important; }
        .ccc-btn:hover { filter: brightness(1.08); }
        .ccc-two { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .ccc-two { grid-template-columns: 1fr 1fr; } }
        .ccc-h1 { font-size: 34px; }
        @media (min-width: 640px) { .ccc-h1 { font-size: 44px; } }
      `}</style>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 className="ccc-h1" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
          Contact <span style={{ color: TEAL }}>Cast &amp; Crew</span>
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 620 }}>
          Share one link with your cast and crew. Every submission lands in your private list and gets emailed to you.
        </p>

        {loading ? (
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: TEAL, borderTopColor: "transparent" }} />
          </div>
        ) : !form ? (
          <div style={{ ...cardStyle, marginTop: 32 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>We couldn't load your form. Please refresh the page.</p>
          </div>
        ) : (
          <>
            <div style={{ ...cardStyle, marginTop: 32 }}>
              <label style={labelStyle}>Your shareable form link</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input readOnly className="ccc-input" style={{ ...inputBase, flex: "1 1 260px" }} value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
                <button
                  type="button"
                  className="ccc-btn"
                  onClick={copyLink}
                  style={{
                    height: 46,
                    padding: "0 22px",
                    borderRadius: 10,
                    background: TEAL,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                Anyone with this link can submit their details. No login needed on their end.
              </p>
            </div>

            <div style={cardStyle}>
              <div className="ccc-two">
                <div>
                  <label style={labelStyle}>Send notifications to</label>
                  <input
                    type="email"
                    className="ccc-input"
                    style={inputBase}
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Production name (optional)</label>
                  <input
                    className="ccc-input"
                    style={inputBase}
                    value={productionName}
                    onChange={(e) => setProductionName(e.target.value)}
                    placeholder="e.g. Midnight Reel"
                  />
                </div>
              </div>
              <button
                type="button"
                className="ccc-btn"
                onClick={saveSettings}
                disabled={saving}
                style={{
                  marginTop: 18,
                  height: 46,
                  padding: "0 24px",
                  borderRadius: 10,
                  background: "rgba(0,212,170,0.12)",
                  border: "1px solid rgba(0,212,170,0.35)",
                  color: TEAL,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: saving ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {saving ? "Saving…" : "Save settings"}
              </button>
            </div>

            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: 0, fontWeight: 700 }}>
                  Collected contacts{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, fontFamily: "inherit" }}>({contacts.length})</span>
                </h2>
                <button
                  type="button"
                  className="ccc-btn"
                  onClick={exportCsv}
                  disabled={contacts.length === 0}
                  style={{
                    height: 42,
                    padding: "0 20px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid #1e1e35",
                    color: contacts.length === 0 ? "rgba(255,255,255,0.25)" : "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: contacts.length === 0 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Export CSV
                </button>
              </div>

              {contacts.length === 0 ? (
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  No submissions yet. Share your link above and they'll show up here.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {contacts.map((c) => (
                    <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e35", borderRadius: 14, padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>
                          {c.first_name} {c.last_name}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: TEAL }}>
                        {c.job_position === "Other" && c.other_role ? c.other_role : c.job_position}
                        {c.character_name ? ` · ${c.character_name}` : ""}
                        {c.actor_type ? ` · ${c.actor_type}` : ""}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                        {c.email && <div>{c.email}</div>}
                        {c.phone && <div>{c.phone}</div>}
                        {c.instagram_handle && <div>{c.instagram_handle}</div>}
                        {c.notes && <div style={{ marginTop: 8, color: "rgba(255,255,255,0.45)" }}>{c.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
