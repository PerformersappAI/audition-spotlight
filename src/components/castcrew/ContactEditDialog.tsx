import { useState } from "react";
import { Modal, inputStyle, primaryBtn, ghostBtn } from "@/components/production/ProductionPicker";
import {
  ACTOR_TYPES,
  CastCrewContact,
  JOB_OPTIONS,
  isValidEmail,
} from "@/lib/castcrew/types";

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

interface Props {
  contact: CastCrewContact;
  onClose: () => void;
  onSave: (patch: Partial<CastCrewContact>) => Promise<void>;
}

const ContactEditDialog = ({ contact, onClose, onSave }: Props) => {
  const [first, setFirst] = useState(contact.first_name ?? "");
  const [last, setLast] = useState(contact.last_name ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [instagram, setInstagram] = useState(contact.instagram_handle ?? "");
  const [job, setJob] = useState(contact.job_position ?? "");
  const [otherRole, setOtherRole] = useState(contact.other_role ?? "");
  const [character, setCharacter] = useState(contact.character_name ?? "");
  const [actorType, setActorType] = useState(contact.actor_type ?? "");
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [internal, setInternal] = useState(contact.notes_internal ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isOther = job === "Other";
  const isCastRole = job === "Actor" || job === "Background / Extra";

  const save = async () => {
    if (!first.trim() || !last.trim() || !phone.trim() || !email.trim() || !job) {
      setError("Name, phone, email and position are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("That email address doesn't look right.");
      return;
    }
    if (isOther && !otherRole.trim()) {
      setError("Please specify the role.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        first_name: first.trim(),
        last_name: last.trim(),
        phone: phone.trim(),
        email: email.trim(),
        instagram_handle: instagram.trim() || null,
        job_position: job,
        other_role: isOther ? otherRole.trim() : null,
        character_name: isCastRole ? character.trim() || null : character.trim() || null,
        actor_type: isCastRole ? actorType || null : actorType || null,
        notes: notes.trim() || null,
        notes_internal: internal.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Contact details" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "62vh", overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>First name</label>
            <input value={first} onChange={(e) => setFirst(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label}>Last name</label>
            <input value={last} onChange={(e) => setLast(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={label}>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={label}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={label}>Instagram (optional)</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={label}>Job / Position</label>
          <select value={job} onChange={(e) => setJob(e.target.value)} style={inputStyle}>
            <option value="" style={{ background: "#10101b" }}>Choose…</option>
            {JOB_OPTIONS.map((o) => (
              <option key={o} value={o} style={{ background: "#10101b" }}>{o}</option>
            ))}
          </select>
        </div>
        {isOther && (
          <div>
            <label style={label}>Specified role</label>
            <input value={otherRole} onChange={(e) => setOtherRole(e.target.value)} style={inputStyle} />
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>Character name</label>
            <input value={character} onChange={(e) => setCharacter(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={label}>Type</label>
            <select value={actorType} onChange={(e) => setActorType(e.target.value)} style={inputStyle}>
              <option value="" style={{ background: "#10101b" }}>—</option>
              {ACTOR_TYPES.map((t) => (
                <option key={t} value={t} style={{ background: "#10101b" }}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label style={label}>Notes (they wrote these)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        <div>
          <label style={label}>Internal note (only you see this)</label>
          <textarea
            value={internal}
            onChange={(e) => setInternal(e.target.value)}
            rows={3}
            placeholder="e.g. confirmed for day 3, needs travel"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
        {error && <div style={{ color: "#ff9d9d", fontSize: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={save} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.5 : 1 }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button onClick={onClose} style={ghostBtn}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactEditDialog;
