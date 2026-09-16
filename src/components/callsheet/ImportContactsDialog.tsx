import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Users } from "lucide-react";
import {
  CONTACT_FIELDS,
  FORM_FIELDS,
  contactName,
  contactRole,
  isCastMember,
  type CastCrewContact,
  type CastCrewForm,
} from "@/lib/castcrew/types";

type Filter = "all" | "cast" | "crew";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which section the user is importing into — sets the default filter. */
  mode: "cast" | "crew";
  onImport: (contacts: CastCrewContact[]) => void;
}

const ImportContactsDialog = ({ open, onOpenChange, mode, onImport }: Props) => {
  const [forms, setForms] = useState<CastCrewForm[]>([]);
  const [formId, setFormId] = useState<string>("");
  const [contacts, setContacts] = useState<CastCrewContact[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>(mode);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    setFilter(mode);
    setSearch("");
    setSelected({});
    let live = true;
    setLoadingForms(true);
    (async () => {
      const { data, error } = await supabase
        .from("cast_crew_forms")
        .select(FORM_FIELDS)
        .order("created_at", { ascending: false });
      if (!live) return;
      setLoadingForms(false);
      if (error) {
        toast({ title: "Could not load your lists", description: error.message, variant: "destructive" });
        return;
      }
      const rows = (data || []) as CastCrewForm[];
      setForms(rows);
      setFormId(rows[0]?.id || "");
    })();
    return () => {
      live = false;
    };
  }, [open, mode]);

  useEffect(() => {
    if (!open || !formId) {
      setContacts([]);
      return;
    }
    let live = true;
    setLoadingContacts(true);
    setSelected({});
    (async () => {
      const { data, error } = await supabase
        .from("cast_crew_contacts")
        .select(CONTACT_FIELDS)
        .eq("form_id", formId)
        .order("created_at", { ascending: false });
      if (!live) return;
      setLoadingContacts(false);
      if (error) {
        toast({ title: "Could not load contacts", description: error.message, variant: "destructive" });
        return;
      }
      setContacts((data || []) as CastCrewContact[]);
    })();
    return () => {
      live = false;
    };
  }, [open, formId]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter === "cast" && !isCastMember(c)) return false;
      if (filter === "crew" && isCastMember(c)) return false;
      if (!q) return true;
      return [contactName(c), c.email, c.phone, contactRole(c), c.character_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [contacts, filter, search]);

  const allShownSelected = visible.length > 0 && visible.every((c) => selected[c.id]);
  const chosen = visible.filter((c) => selected[c.id]);

  const toggleAll = () => {
    const next = { ...selected };
    visible.forEach((c) => {
      next[c.id] = !allShownSelected;
    });
    setSelected(next);
  };

  const formLabel = (f: CastCrewForm) => f.production_name || (f.project_id ? "Untitled production" : "General list");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import from Cast &amp; Crew List
          </DialogTitle>
          <DialogDescription>
            Pick a list, choose people, and they are added to this call sheet. Call times stay empty for you to fill.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>List</Label>
            {loadingForms ? (
              <p className="text-sm text-muted-foreground">Loading your lists…</p>
            ) : forms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no cast &amp; crew lists yet. Create one in the Cast &amp; Crew List tool first.
              </p>
            ) : (
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {formLabel(f)}
                  </option>
                ))}
              </select>
            )}
          </div>

          {forms.length > 0 && (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search name, email, phone, position…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  {(["all", "cast", "crew"] as Filter[]).map((f) => (
                    <Button
                      key={f}
                      type="button"
                      size="sm"
                      variant={filter === f ? "default" : "outline"}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "All" : f === "cast" ? "Cast" : "Crew"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Button type="button" size="sm" variant="ghost" onClick={toggleAll} disabled={visible.length === 0}>
                  {allShownSelected ? "Clear all" : "Select all"}
                </Button>
                <span className="text-muted-foreground">{chosen.length} selected</span>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-border p-2">
                {loadingContacts ? (
                  <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts…
                  </div>
                ) : visible.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">No matching people on this list.</p>
                ) : (
                  visible.map((c) => (
                    <label
                      key={c.id}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted/40"
                    >
                      <Checkbox
                        checked={Boolean(selected[c.id])}
                        onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [c.id]: Boolean(v) }))}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{contactName(c)}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {[contactRole(c), c.character_name, c.email, c.phone].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={chosen.length === 0}
            onClick={() => {
              onImport(chosen);
              onOpenChange(false);
            }}
          >
            Import {chosen.length || ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsDialog;
