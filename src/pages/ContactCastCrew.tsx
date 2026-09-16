import { useCallback, useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import ToolTopBar from "@/components/ToolTopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ProductionPicker, {
  Production,
  ghostBtn,
  inputStyle,
  panel,
  primaryBtn,
} from "@/components/production/ProductionPicker";
import ContactEditDialog from "@/components/castcrew/ContactEditDialog";
import ReminderDialog from "@/components/castcrew/ReminderDialog";
import {
  CONTACT_FIELDS,
  CastCrewContact,
  CastCrewForm,
  FORM_FIELDS,
  JOB_OPTIONS,
  contactName,
  contactRole,
  isCastMember,
  shareLinkFor,
} from "@/lib/castcrew/types";
import {
  castCrewReportBase64,
  exportCastCrewReportToPDF,
  reportFileName,
} from "@/utils/exportCastCrewReportToPDF";

const TEAL = "#00d4aa";

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
  padding: 24,
  marginBottom: 20,
};

const chip = (active: boolean): React.CSSProperties => ({
  minHeight: 40,
  padding: "0 14px",
  borderRadius: 999,
  border: `1px solid ${active ? "rgba(0,212,170,0.45)" : "rgba(255,255,255,0.14)"}`,
  background: active ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.04)",
  color: active ? TEAL : "rgba(255,255,255,0.7)",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
});

const makeSlug = () => {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
};

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

type SortKey = "newest" | "name" | "position";
type TypeFilter = "all" | "cast" | "crew";

export default function ContactCastCrew() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [production, setProduction] = useState<Production | null>(null);
  const [useGeneral, setUseGeneral] = useState(false);
  const [generalForm, setGeneralForm] = useState<CastCrewForm | null>(null);
  const [form, setForm] = useState<CastCrewForm | null>(null);
  const [contacts, setContacts] = useState<CastCrewContact[]>([]);
  const [loading, setLoading] = useState(true);

  const [notifyEmail, setNotifyEmail] = useState("");
  const [productionName, setProductionName] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<string[]>([]);

  const [editing, setEditing] = useState<CastCrewContact | null>(null);
  const [showReminder, setShowReminder] = useState(false);

  const loadContacts = useCallback(async (formId: string) => {
    const { data } = await supabase
      .from("cast_crew_contacts")
      .select(CONTACT_FIELDS)
      .eq("form_id", formId)
      .order("created_at", { ascending: false });
    setContacts((data ?? []) as CastCrewContact[]);
    setSelected([]);
  }, []);

  /** Load the pre-upgrade "General list" (project_id null), if any. */
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("cast_crew_forms")
        .select(FORM_FIELDS)
        .eq("owner_user_id", user.id)
        .is("project_id", null)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (active) setGeneralForm((data as CastCrewForm | null) ?? null);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  /** Resolve the form for the current selection (production, or the general list). */
  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      setLoading(true);

      // General list mode
      if (useGeneral || !production) {
        if (!useGeneral && !production) {
          if (active) {
            setForm(null);
            setContacts([]);
            setLoading(false);
          }
          return;
        }
        let row = generalForm;
        if (!row) {
          const { data: created, error } = await supabase
            .from("cast_crew_forms")
            .insert({
              owner_user_id: user.id,
              slug: makeSlug(),
              notify_email: user.email ?? "",
            })
            .select(FORM_FIELDS)
            .single();
          if (error) {
            toast({ title: "Could not create your list", description: error.message, variant: "destructive" });
            if (active) setLoading(false);
            return;
          }
          row = created as CastCrewForm;
          if (active) setGeneralForm(row);
        }
        if (!active) return;
        setForm(row);
        setNotifyEmail(row.notify_email ?? "");
        setProductionName(row.production_name ?? "");
        setAutoConfirm(row.auto_confirm ?? false);
        await loadContacts(row.id);
        if (active) setLoading(false);
        return;
      }

      // Per-production form
      const { data: existing } = await supabase
        .from("cast_crew_forms")
        .select(FORM_FIELDS)
        .eq("owner_user_id", user.id)
        .eq("project_id", production.id)
        .maybeSingle();

      let row = existing as CastCrewForm | null;

      if (!row) {
        const { data: created, error } = await supabase
          .from("cast_crew_forms")
          .insert({
            owner_user_id: user.id,
            slug: makeSlug(),
            notify_email: user.email ?? "",
            production_name: production.title,
            project_id: production.id,
          })
          .select(FORM_FIELDS)
          .single();
        if (error) {
          toast({ title: "Could not create this production's list", description: error.message, variant: "destructive" });
          if (active) setLoading(false);
          return;
        }
        row = created as CastCrewForm;
      }

      if (!active) return;
      setForm(row);
      setNotifyEmail(row.notify_email ?? "");
      setProductionName(row.production_name ?? production.title);
      setAutoConfirm(row.auto_confirm ?? false);
      await loadContacts(row.id);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, production?.id, useGeneral, generalForm?.id]);

  const shareUrl = form ? shareLinkFor(form.slug) : "";

  const shareText = `Please add your details to the ${productionName || "production"} cast & crew list: ${shareUrl}`;

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

  const nativeShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Cast & Crew List", text: shareText, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
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
        auto_confirm: autoConfirm,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setForm({ ...form, notify_email: notifyEmail.trim(), production_name: productionName.trim() || null, auto_confirm: autoConfirm });
    toast({ title: "Saved", description: "Your list settings are updated." });
  };

  /* ------------------------------------------------------------- filtering */
  const positions = useMemo(
    () => [...new Set(contacts.map((c) => c.job_position).filter(Boolean) as string[])].sort(),
    [contacts],
  );

  const duplicateEmails = useMemo(() => {
    const counts = new Map<string, number>();
    contacts.forEach((c) => {
      const e = (c.email || "").toLowerCase().trim();
      if (e) counts.set(e, (counts.get(e) ?? 0) + 1);
    });
    return new Set([...counts.entries()].filter(([, n]) => n > 1).map(([e]) => e));
  }, [contacts]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = contacts.filter((c) => {
      if (positionFilter !== "all" && c.job_position !== positionFilter) return false;
      if (typeFilter === "cast" && !isCastMember(c)) return false;
      if (typeFilter === "crew" && isCastMember(c)) return false;
      if (!q) return true;
      return [
        contactName(c),
        c.email,
        c.phone,
        c.job_position,
        c.other_role,
        c.character_name,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return contactName(a).localeCompare(contactName(b));
      if (sort === "position") return contactRole(a).localeCompare(contactRole(b));
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [contacts, search, positionFilter, typeFilter, sort]);

  const castCount = contacts.filter(isCastMember).length;
  const crewCount = contacts.length - castCount;

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const allVisibleSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id));

  /* ---------------------------------------------------------------- actions */
  const saveContact = async (id: string, patch: Partial<CastCrewContact>) => {
    const { error } = await supabase.from("cast_crew_contacts").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    toast({ title: "Contact updated" });
  };

  const deleteContacts = async (ids: string[]) => {
    if (ids.length === 0) return;
    const question =
      ids.length === 1
        ? "Delete this contact? This can't be undone."
        : `Delete ${ids.length} contacts? This can't be undone.`;
    if (!window.confirm(question)) return;
    setBusy(true);
    const { error } = await supabase.from("cast_crew_contacts").delete().in("id", ids);
    setBusy(false);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
    setSelected((prev) => prev.filter((x) => !ids.includes(x)));
    toast({ title: ids.length === 1 ? "Contact deleted" : `${ids.length} contacts deleted` });
  };

  const sendConfirmations = async (ids: string[]) => {
    if (ids.length === 0) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("cast-crew-email", {
        body: { action: "confirm", contact_ids: ids.slice(0, 100) },
      });
      if (error) throw error;
      const result = data as { sent?: number; results?: { id: string; sent: boolean; reason?: string }[] };
      const sentIds = (result?.results ?? []).filter((r) => r.sent).map((r) => r.id);
      const now = new Date().toISOString();
      setContacts((prev) =>
        prev.map((c) => (sentIds.includes(c.id) ? { ...c, confirmation_sent_at: now } : c)),
      );
      const failed = (result?.results ?? []).filter((r) => !r.sent);
      toast({
        title: `"Got it" sent to ${result?.sent ?? 0}`,
        description: failed.length ? `${failed.length} skipped (${failed[0].reason}).` : undefined,
      });
    } catch (err) {
      toast({
        title: "Could not send the emails",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------------------------------------------- exports */
  const buildCsv = (rows: CastCrewContact[]) => {
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
      "Cast or Crew",
      "Notes",
      "Internal Note",
      "Confirmation Sent",
      "Submitted",
    ];
    const body = rows.map((c) =>
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
        isCastMember(c) ? "Cast" : "Crew",
        c.notes,
        c.notes_internal,
        c.confirmation_sent_at ? new Date(c.confirmation_sent_at).toLocaleString() : "",
        new Date(c.created_at).toLocaleString(),
      ]
        .map(csvCell)
        .join(","),
    );
    return [headers.map(csvCell).join(","), ...body].join("\n");
  };

  const exportCsv = (rows: CastCrewContact[]) => {
    if (rows.length === 0) return;
    const url = URL.createObjectURL(new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cast-crew-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    setBusy(true);
    try {
      await exportCastCrewReportToPDF({ productionName, contacts });
      toast({ title: "Master sheet downloaded", description: "Your Cast & Crew List PDF is ready." });
    } finally {
      setBusy(false);
    }
  };

  const emailPdf = async () => {
    if (!form) return;
    setEmailing(true);
    try {
      const pdfBase64 = await castCrewReportBase64({ productionName, contacts });
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
        title: "List emailed",
        description: `Sent to ${(data as { sentTo?: string })?.sentTo ?? notifyEmail}.`,
      });
    } catch (err) {
      toast({
        title: "Could not email the list",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setEmailing(false);
    }
  };

  /* ------------------------------------------------------------------- view */
  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh" }}>
      <Seo
        title="Cast & Crew Contact List for Film Productions | Filmmaker Genius"
        description="Collect and manage every cast and crew contact for your production with one shareable link, confirmation emails, reminders and a printable master sheet."
        canonical="https://filmmakergenius.com/contact-cast-crew"
      />
      <ToolTopBar />
      <style>{`
        .ccc-input:focus { border-color: rgba(0,212,170,0.5) !important; }
        .ccc-btn:hover { filter: brightness(1.08); }
        .ccc-two { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .ccc-two { grid-template-columns: 1fr 1fr; } }
        .ccc-h1 { font-size: 32px; }
        @media (min-width: 640px) { .ccc-h1 { font-size: 44px; } }
      `}</style>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "40px 16px 96px" }}>
        <h1 className="ccc-h1" style={{ fontFamily: "'Fraunces', serif", lineHeight: 1.1, margin: 0, fontWeight: 700 }}>
          Cast &amp; <span style={{ color: TEAL }}>Crew List</span>
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 640 }}>
          One shareable link per production. Every submission lands in your private list, emailed to you, ready to
          confirm, remind and print.
        </p>

        <div style={{ marginTop: 28 }}>
          <ProductionPicker
            emptyTitle="Create your first production"
            emptyText="Each production gets its own cast & crew list and link."
            onSelect={setProduction}
            extraControls={
              generalForm ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" style={chip(!useGeneral)} onClick={() => setUseGeneral(false)}>
                    Production list
                  </button>
                  <button type="button" style={chip(useGeneral)} onClick={() => setUseGeneral(true)}>
                    General list
                  </button>
                </div>
              ) : undefined
            }
          />
        </div>

        {loading ? (
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: TEAL, borderTopColor: "transparent" }} />
          </div>
        ) : !form ? (
          <div style={{ ...cardStyle, marginTop: 8 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>
              Pick a production above (or create one) to start its cast &amp; crew list.
            </p>
          </div>
        ) : (
          <>
            <div style={cardStyle}>
              <label style={labelStyle}>Your shareable form link</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input readOnly className="ccc-input" style={{ ...inputStyle, flex: "1 1 240px" }} value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
                <button type="button" className="ccc-btn" onClick={copyLink} style={primaryBtn}>
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a
                  className="ccc-btn"
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                >
                  WhatsApp
                </a>
                <a
                  className="ccc-btn"
                  href={`sms:?&body=${encodeURIComponent(shareText)}`}
                  style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                >
                  SMS
                </a>
                <a
                  className="ccc-btn"
                  href={`mailto:?subject=${encodeURIComponent(`${productionName || "Production"} — cast & crew list`)}&body=${encodeURIComponent(shareText)}`}
                  style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                >
                  Email
                </a>
                <button type="button" className="ccc-btn" onClick={nativeShare} style={ghostBtn}>
                  Share…
                </button>
                <button type="button" className="ccc-btn" onClick={() => setShowReminder(true)} style={ghostBtn}>
                  Send reminder
                </button>
              </div>
              <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                Anyone with this link can submit their details. No login needed on their end.
              </p>
            </div>

            <div style={cardStyle}>
              <div className="ccc-two">
                <div>
                  <label style={labelStyle}>Notify me at</label>
                  <input
                    type="email"
                    className="ccc-input"
                    style={inputStyle}
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Production name</label>
                  <input
                    className="ccc-input"
                    style={inputStyle}
                    value={productionName}
                    onChange={(e) => setProductionName(e.target.value)}
                    placeholder="e.g. Midnight Reel"
                  />
                </div>
              </div>
              <label style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoConfirm}
                  onChange={(e) => setAutoConfirm(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: TEAL }}
                />
                Automatically email a "got it" confirmation to people who submit
              </label>
              <button
                type="button"
                className="ccc-btn"
                onClick={saveSettings}
                disabled={saving}
                style={{ ...ghostBtn, marginTop: 18, color: TEAL, borderColor: "rgba(0,212,170,0.35)", background: "rgba(0,212,170,0.12)" }}
              >
                {saving ? "Saving…" : "Save settings"}
              </button>
            </div>

            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: 0, fontWeight: 700 }}>
                  Contacts{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 15, fontFamily: "inherit" }}>
                    ({castCount} cast · {crewCount} crew)
                  </span>
                </h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" className="ccc-btn" onClick={downloadPdf} disabled={contacts.length === 0 || busy} style={{ ...primaryBtn, opacity: contacts.length === 0 ? 0.4 : 1 }}>
                    Master sheet PDF
                  </button>
                  <button type="button" className="ccc-btn" onClick={emailPdf} disabled={contacts.length === 0 || emailing} style={{ ...ghostBtn, opacity: contacts.length === 0 ? 0.4 : 1 }}>
                    {emailing ? "Sending…" : "Email me the list"}
                  </button>
                  <button type="button" className="ccc-btn" onClick={() => exportCsv(contacts)} disabled={contacts.length === 0} style={{ ...ghostBtn, opacity: contacts.length === 0 ? 0.4 : 1 }}>
                    Export CSV
                  </button>
                </div>
              </div>

              {contacts.length > 0 && (
                <>
                  <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                    <input
                      className="ccc-input"
                      style={inputStyle}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, phone, position, character"
                    />
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} style={{ ...inputStyle, maxWidth: 240 }}>
                        <option value="all" style={{ background: "#10101b" }}>All positions</option>
                        {positions.map((p) => (
                          <option key={p} value={p} style={{ background: "#10101b" }}>{p}</option>
                        ))}
                      </select>
                      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)} style={{ ...inputStyle, maxWidth: 180 }}>
                        <option value="all" style={{ background: "#10101b" }}>Cast &amp; crew</option>
                        <option value="cast" style={{ background: "#10101b" }}>Cast only</option>
                        <option value="crew" style={{ background: "#10101b" }}>Crew only</option>
                      </select>
                      <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={{ ...inputStyle, maxWidth: 180 }}>
                        <option value="newest" style={{ background: "#10101b" }}>Newest first</option>
                        <option value="name" style={{ background: "#10101b" }}>By name</option>
                        <option value="position" style={{ background: "#10101b" }}>By position</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                    <button
                      type="button"
                      style={chip(allVisibleSelected)}
                      onClick={() => setSelected(allVisibleSelected ? [] : visible.map((c) => c.id))}
                    >
                      {allVisibleSelected ? "Clear selection" : `Select all (${visible.length})`}
                    </button>
                    {selected.length > 0 && (
                      <>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{selected.length} selected</span>
                        <button type="button" style={chip(false)} disabled={busy} onClick={() => sendConfirmations(selected)}>
                          Send "got it"
                        </button>
                        <button type="button" style={chip(false)} onClick={() => exportCsv(contacts.filter((c) => selected.includes(c.id)))}>
                          Export selection
                        </button>
                        <button type="button" style={{ ...chip(false), color: "#ff9d9d", borderColor: "rgba(255,120,120,0.35)" }} disabled={busy} onClick={() => deleteContacts(selected)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {contacts.length === 0 ? (
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  No submissions yet. Share your link above and they'll show up here.
                </p>
              ) : visible.length === 0 ? (
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)" }}>No contacts match those filters.</p>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {visible.map((c) => {
                    const dupe = c.email && duplicateEmails.has(c.email.toLowerCase().trim());
                    const cast = isCastMember(c);
                    return (
                      <div key={c.id} style={{ ...panel, padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", minWidth: 0 }}>
                            <input
                              type="checkbox"
                              checked={selected.includes(c.id)}
                              onChange={() => toggleSelect(c.id)}
                              style={{ width: 18, height: 18, marginTop: 3, accentColor: TEAL }}
                            />
                            <span style={{ minWidth: 0 }}>
                              <span style={{ fontSize: 16, fontWeight: 700 }}>{contactName(c)}</span>
                              <span style={{ display: "block", marginTop: 4, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: TEAL }}>
                                {contactRole(c)}
                                {c.character_name ? ` · ${c.character_name}` : ""}
                                {c.actor_type ? ` · ${c.actor_type}` : ""}
                              </span>
                            </span>
                          </label>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", fontSize: 11 }}>
                            <span style={{ padding: "4px 10px", borderRadius: 999, background: cast ? "rgba(0,212,170,0.14)" : "rgba(255,255,255,0.06)", color: cast ? TEAL : "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                              {cast ? "Cast" : "Crew"}
                            </span>
                            {dupe && (
                              <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(255,190,80,0.14)", color: "#ffbe50", fontWeight: 700 }}>
                                Duplicate
                              </span>
                            )}
                            {c.confirmation_sent_at && (
                              <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                                Got it sent {new Date(c.confirmation_sent_at).toLocaleDateString()}
                              </span>
                            )}
                            <span style={{ color: "rgba(255,255,255,0.3)" }}>{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
                          {c.email && (
                            <div><a href={`mailto:${c.email}`} style={{ color: "rgba(255,255,255,0.75)" }}>{c.email}</a></div>
                          )}
                          {c.phone && (
                            <div><a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} style={{ color: "rgba(255,255,255,0.75)" }}>{c.phone}</a></div>
                          )}
                          {c.instagram_handle && (
                            <div>
                              <a
                                href={`https://instagram.com/${c.instagram_handle.replace(/^@/, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                              >
                                {c.instagram_handle}
                              </a>
                            </div>
                          )}
                          {c.notes && <div style={{ marginTop: 8, color: "rgba(255,255,255,0.45)", whiteSpace: "pre-wrap" }}>{c.notes}</div>}
                          {c.notes_internal && (
                            <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(255,190,80,0.08)", color: "#ffd28a", whiteSpace: "pre-wrap", fontSize: 13 }}>
                              Internal: {c.notes_internal}
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" style={chip(false)} onClick={() => setEditing(c)}>View / Edit</button>
                          <button type="button" style={chip(false)} disabled={busy} onClick={() => sendConfirmations([c.id])}>
                            Send "got it"
                          </button>
                          <button
                            type="button"
                            style={{ ...chip(false), color: "#ff9d9d", borderColor: "rgba(255,120,120,0.35)" }}
                            disabled={busy}
                            onClick={() => deleteContacts([c.id])}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {editing && (
        <ContactEditDialog
          contact={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => saveContact(editing.id, patch)}
        />
      )}

      {showReminder && form && (
        <ReminderDialog
          form={form}
          onClose={() => setShowReminder(false)}
          onResult={(message, ok) =>
            toast({ title: ok ? "Reminders sent" : "Reminder problem", description: message, variant: ok ? undefined : "destructive" })
          }
        />
      )}
    </div>
  );
}
