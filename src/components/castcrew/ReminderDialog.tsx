import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Modal, inputStyle, primaryBtn, ghostBtn } from "@/components/production/ProductionPicker";
import {
  CastCrewForm,
  CastCrewReminder,
  isValidEmail,
  shareLinkFor,
} from "@/lib/castcrew/types";

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

const defaultMessage = (production: string) =>
  `We're putting together the cast & crew list for ${production}. Please add your details using the link below — it takes about a minute.`;

interface Props {
  form: CastCrewForm;
  onClose: () => void;
  onResult: (message: string, ok: boolean) => void;
}

const ReminderDialog = ({ form, onClose, onResult }: Props) => {
  const production = form.production_name?.trim() || "our production";
  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState(defaultMessage(production));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<CastCrewReminder[]>([]);

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from("cast_crew_reminders")
      .select("id, email, name, sent_at")
      .eq("form_id", form.id)
      .order("sent_at", { ascending: false })
      .limit(50);
    setHistory((data ?? []) as CastCrewReminder[]);
  }, [form.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const parsed = emails
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const valid = [...new Set(parsed.filter(isValidEmail))].slice(0, 50);
  const invalidCount = parsed.length - valid.length;

  const send = async () => {
    if (valid.length === 0) {
      setError("Add at least one valid email address.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("cast-crew-email", {
        body: {
          action: "remind",
          form_id: form.id,
          message: message.trim(),
          recipients: valid.map((email) => ({
            email,
            name: valid.length === 1 ? name.trim() || null : null,
          })),
        },
      });
      if (fnError) throw fnError;
      const result = data as {
        sent?: number;
        results?: { email: string; sent: boolean; reason?: string }[];
      };
      const skipped = (result?.results ?? []).filter((r) => !r.sent);
      onResult(
        `Reminder sent to ${result?.sent ?? 0} ${result?.sent === 1 ? "person" : "people"}` +
          (skipped.length ? `; ${skipped.length} skipped (${skipped[0].reason}).` : "."),
        true,
      );
      setEmails("");
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reminders.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal title="Send reminder" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "64vh", overflowY: "auto" }}>
        <div>
          <label style={label}>Name (optional, for a single person)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Maya" />
        </div>
        <div>
          <label style={label}>Email addresses (comma or space separated, max 50)</label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            rows={3}
            placeholder="maya@example.com, sam@example.com"
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {valid.length} ready{invalidCount > 0 ? ` · ${invalidCount} not a valid email` : ""}
          </div>
        </div>
        <div>
          <label style={label}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            Each person gets their own email with a button to {shareLinkFor(form.slug)}
          </div>
        </div>
        {error && <div style={{ color: "#ff9d9d", fontSize: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={send}
            disabled={sending || valid.length === 0}
            style={{ ...primaryBtn, opacity: sending || valid.length === 0 ? 0.45 : 1 }}
          >
            {sending ? "Sending…" : `Send to ${valid.length || 0}`}
          </button>
          <button onClick={onClose} style={ghostBtn}>Close</button>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Reminder history
          </div>
          {history.length === 0 ? (
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              No reminders sent for this list yet.
            </p>
          ) : (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {history.map((r) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.name ? `${r.name} · ` : ""}{r.email}
                  </span>
                  <span style={{ flex: "0 0 auto", color: "rgba(255,255,255,0.3)" }}>
                    {new Date(r.sent_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReminderDialog;
