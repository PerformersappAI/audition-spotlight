import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Modal, ghostBtn, inputStyle, primaryBtn } from "@/components/production/ProductionPicker";

const MAX_RECIPIENTS = 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
}

interface Props {
  messageId: string;
  onClose: () => void;
  onSent: (sent: number) => void;
}

const label: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.45)",
  marginBottom: 6,
  display: "block",
};

const SendToCrewDialog = ({ messageId, onClose, onSent }: Props) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [extra, setExtra] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: string[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("cast_crew_contacts")
        .select("id, first_name, last_name, job_position, character_name, email")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      const rows: Contact[] = (data || [])
        .filter((r: any) => !!r.email)
        .map((r: any) => ({
          id: r.id as string,
          name: [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || (r.email as string),
          position: (r.job_position || r.character_name || "").trim(),
          email: String(r.email).trim(),
        }));
      setContacts(rows);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      `${c.name} ${c.position} ${c.email}`.toLowerCase().includes(q));
  }, [contacts, search]);

  const typed = useMemo(
    () => extra.split(/[\s,;]+/).map((v) => v.trim()).filter(Boolean),
    [extra],
  );
  const badTyped = typed.filter((v) => !EMAIL_RE.test(v));

  const recipients = useMemo(() => {
    const map = new Map<string, { name: string; email: string }>();
    contacts.filter((c) => picked.has(c.id)).forEach((c) => {
      map.set(c.email.toLowerCase(), { name: c.name, email: c.email });
    });
    typed.filter((v) => EMAIL_RE.test(v)).forEach((email) => {
      const key = email.toLowerCase();
      if (!map.has(key)) map.set(key, { name: "", email });
    });
    return Array.from(map.values());
  }, [contacts, picked, typed]);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allVisibleOn = filtered.length > 0 && filtered.every((c) => picked.has(c.id));
  const toggleAll = () => {
    setPicked((prev) => {
      const next = new Set(prev);
      filtered.forEach((c) => (allVisibleOn ? next.delete(c.id) : next.add(c.id)));
      return next;
    });
  };

  const send = async () => {
    if (!recipients.length) return;
    if (recipients.length > MAX_RECIPIENTS) {
      toast.error(`You can send to at most ${MAX_RECIPIENTS} people at a time.`);
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-production-message", {
        body: { message_id: messageId, recipients },
      });
      if (error) throw error;
      const sent = Number(data?.sent ?? 0);
      const failed = ((data?.results || []) as Array<{ email: string; ok: boolean }>)
        .filter((r) => !r.ok)
        .map((r) => r.email);
      setResult({ sent, failed });
      onSent(sent);
      if (sent) toast.success(`Sent to ${sent} ${sent === 1 ? "person" : "people"}`);
      else toast.error("Nothing could be sent — please check the addresses.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The message couldn't be sent.");
    } finally {
      setSending(false);
    }
  };

  if (result) {
    return (
      <Modal title="Sent to crew" onClose={onClose}>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
          Sent to {result.sent}, failed {result.failed.length}.
        </p>
        {result.failed.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 13.5, color: "#ff9d9d", lineHeight: 1.6, wordBreak: "break-all" }}>
            Couldn't deliver to: {result.failed.join(", ")}
          </div>
        )}
        <button onClick={onClose} style={{ ...primaryBtn, marginTop: 20 }}>Done</button>
      </Modal>
    );
  }

  return (
    <Modal title="Send to crew" onClose={onClose}>
      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginTop: -6 }}>
        Everyone gets the message in every language. Recipients never see each other's addresses.
      </p>

      <div style={{ marginTop: 18 }}>
        <span style={label}>From your Cast &amp; Crew List</span>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
            <Loader2 size={15} className="animate-spin" /> Loading contacts…
          </div>
        ) : contacts.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>
            No contacts with an email address yet — add emails below instead.
          </p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, role or email"
                style={{ ...inputStyle, flex: "1 1 180px" }}
              />
              <button onClick={toggleAll} style={{ ...ghostBtn, flex: "0 0 auto" }}>
                {allVisibleOn ? "Clear all" : "Select all"}
              </button>
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto", marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {filtered.map((c) => (
                <label
                  key={c.id}
                  style={{
                    display: "flex", gap: 10, alignItems: "center", minHeight: 44,
                    padding: "6px 10px", borderRadius: 10, cursor: "pointer",
                    background: picked.has(c.id) ? "rgba(0,212,170,0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${picked.has(c.id) ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={picked.has(c.id)}
                    onChange={() => toggle(c.id)}
                    style={{ width: 18, height: 18, accentColor: "#00d4aa", flex: "0 0 auto" }}
                  />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {[c.position, c.email].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </label>
              ))}
              {filtered.length === 0 && (
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)" }}>No contacts match that search.</p>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <span style={label}>Add emails (comma or space separated)</span>
        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          rows={2}
          placeholder="alex@example.com, sam@example.com"
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {badTyped.length > 0 && (
          <div style={{ color: "#ff9d9d", fontSize: 13, marginTop: 6, wordBreak: "break-all" }}>
            Not a valid address: {badTyped.join(", ")}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
        <button
          onClick={send}
          disabled={sending || recipients.length === 0}
          style={{
            ...primaryBtn,
            display: "inline-flex", alignItems: "center", gap: 8,
            opacity: sending || recipients.length === 0 ? 0.45 : 1,
          }}
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {sending ? "Sending…" : `Send to ${recipients.length}`}
        </button>
        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Mail size={13} /> Max {MAX_RECIPIENTS} recipients
        </span>
      </div>
    </Modal>
  );
};

export default SendToCrewDialog;
