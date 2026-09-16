import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, FileSpreadsheet, FileText, Loader2, Plus, Table } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ghostBtn, panel, primaryBtn } from "@/components/production/ProductionPicker";
import { EXPENSE_FIELDS, toExpense, type Expense } from "@/lib/expenses/types";
import { removeExpenseFolder, signExpensePaths } from "@/lib/expenses/files";
import { SCENE_FIELDS, ITEM_FIELDS, DEPARTMENTS, type BreakdownScene, type BreakdownItem } from "@/components/breakdown/types";
import { exportExpensesToCSV, exportExpensesToPDF, exportExpensesToXLSX, type ExpenseExportInput } from "@/utils/exportExpenses";
import ExpenseSummary from "./ExpenseSummary";
import ExpenseFilters, { EMPTY_FILTERS, type ExpenseFilterState } from "./ExpenseFilters";
import ExpenseList, { type LinkedItemInfo } from "./ExpenseList";
import ExpenseDialog, { type BreakdownItemOption } from "./ExpenseDialog";
import FileLightbox from "./FileLightbox";

interface Props {
  projectId: string;
  productionTitle: string;
  company: string | null;
  defaultCurrency: string;
  /** Name recorded on approvals/rejections and defaulted as the submitter. */
  actorName: string;
}

const FILTER_KEYS: (keyof ExpenseFilterState)[] = ["q", "status", "department", "payment", "from", "to"];

const nextInvoiceNumber = (expenses: Expense[]) => {
  let max = 0;
  expenses.forEach((e) => {
    const match = /(\d+)\s*$/.exec(e.invoice_number || "");
    if (match) max = Math.max(max, Number(match[1]));
  });
  return `INV-${String(max + 1).padStart(3, "0")}`;
};

const ExpenseWorkspace = ({ projectId, productionTitle, company, defaultCurrency, actorName }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [linkedItems, setLinkedItems] = useState<Record<string, LinkedItemInfo>>({});
  const [itemOptions, setItemOptions] = useState<BreakdownItemOption[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialogFor, setDialogFor] = useState<Expense | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewer, setViewer] = useState<{ url: string; isPdf: boolean; title: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [exporting, setExporting] = useState<"xlsx" | "csv" | "pdf" | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo<ExpenseFilterState>(() => ({
    q: searchParams.get("q") || "",
    status: searchParams.get("status") || "",
    department: searchParams.get("dept") || "",
    payment: searchParams.get("pay") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
  }), [searchParams]);

  const setFilters = useCallback((next: Partial<ExpenseFilterState>) => {
    const params = new URLSearchParams(searchParams);
    const map: Record<keyof ExpenseFilterState, string> = {
      q: "q", status: "status", department: "dept", payment: "pay", from: "from", to: "to",
    };
    (Object.keys(next) as (keyof ExpenseFilterState)[]).forEach((key) => {
      const value = next[key];
      if (value) params.set(map[key], value);
      else params.delete(map[key]);
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((k) => params.delete(k === "department" ? "dept" : k === "payment" ? "pay" : k));
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("production_expenses")
      .select(EXPENSE_FIELDS)
      .eq("project_id", projectId)
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error("Could not load the expenses.");
    const rows = (data || []).map((r) => toExpense(r as Record<string, unknown>));
    setExpenses(rows);
    setLoading(false);

    const paths = rows.flatMap((r) => [r.receipt_path, r.item_photo_path]).filter((p): p is string => !!p);
    if (paths.length) setSignedUrls(await signExpensePaths(paths));
    else setSignedUrls({});
  }, [projectId]);

  const loadBreakdown = useCallback(async () => {
    if (!projectId) return;
    const [{ data: scenes }, { data: items }] = await Promise.all([
      supabase.from("breakdown_scenes").select(SCENE_FIELDS).eq("project_id", projectId).order("sort_order"),
      supabase.from("breakdown_items").select(ITEM_FIELDS).eq("project_id", projectId).order("sort_order"),
    ]);
    const sceneList = (scenes || []) as BreakdownScene[];
    const sceneName = (id: string) => {
      const s = sceneList.find((x) => x.id === id);
      if (!s) return "Scene";
      return s.scene_number ? `Scene ${s.scene_number}` : s.label || "Untitled scene";
    };
    const deptName = (key: string) => DEPARTMENTS.find((d) => d.key === key)?.label || key;
    const options: BreakdownItemOption[] = ((items || []) as BreakdownItem[]).map((i) => ({
      id: i.id,
      scene: sceneName(i.scene_id),
      department: deptName(i.department),
      text: i.text,
    }));
    setItemOptions(options);
    const map: Record<string, LinkedItemInfo> = {};
    options.forEach((o) => { map[o.id] = { scene: o.scene, department: o.department, text: o.text }; });
    setLinkedItems(map);
  }, [projectId]);

  useEffect(() => { load(); loadBreakdown(); }, [load, loadBreakdown]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return expenses.filter((e) => {
      if (filters.status && e.status !== filters.status) return false;
      if (filters.department && e.department !== filters.department) return false;
      if (filters.payment && e.payment_method !== filters.payment) return false;
      if (filters.from && e.expense_date < filters.from) return false;
      if (filters.to && e.expense_date > filters.to) return false;
      if (q) {
        const haystack = [e.vendor, e.description, e.notes, e.submitted_by_name, e.invoice_number]
          .filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const setStatus = async (expense: Expense, status: string, note?: string | null) => {
    setBusyId(expense.id);
    const patch = {
      status,
      status_note: note ?? null,
      decided_by_name: status === "pending" ? null : actorName,
      decided_at: status === "pending" ? null : new Date().toISOString(),
    };
    const { error } = await supabase.from("production_expenses").update(patch).eq("id", expense.id);
    setBusyId(null);
    if (error) { toast.error("Could not update that expense."); return; }
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? { ...e, ...patch } : e)));
  };

  const remove = async (expense: Expense) => {
    setBusyId(expense.id);
    try {
      await removeExpenseFolder(expense.project_id, expense.id);
      const { error } = await supabase.from("production_expenses").delete().eq("id", expense.id);
      if (error) throw new Error(error.message);
      setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
      toast.success("Expense deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete that expense.");
    } finally {
      setBusyId(null);
    }
  };

  const onSaved = (saved: Expense) => {
    setExpenses((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...prev];
    });
  };

  useEffect(() => {
    const missing = expenses
      .flatMap((e) => [e.receipt_path, e.item_photo_path])
      .filter((p): p is string => !!p && !signedUrls[p]);
    if (!missing.length) return;
    let cancelled = false;
    signExpensePaths(missing).then((map) => { if (!cancelled) setSignedUrls((prev) => ({ ...prev, ...map })); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses]);

  const exportInput = useCallback((): ExpenseExportInput => ({
    productionTitle,
    company,
    expenses: filtered,
    filters,
    linkedItems,
    signedUrls,
    includeImages,
  }), [productionTitle, company, filtered, filters, linkedItems, signedUrls, includeImages]);

  const runExport = async (kind: "xlsx" | "csv" | "pdf") => {
    if (!filtered.length) { toast.error("There is nothing to export with these filters."); return; }
    setMenuOpen(false);
    setExporting(kind);
    try {
      const input = exportInput();
      if (kind === "xlsx") exportExpensesToXLSX(input);
      else if (kind === "csv") exportExpensesToCSV(input);
      else await exportExpensesToPDF(input);
      toast.success(kind === "pdf" ? "Expense report downloaded." : "Export downloaded.");
    } catch (err) {
      console.error("expense export failed", err);
      toast.error(err instanceof Error ? err.message : "Could not build that export.");
    } finally {
      setExporting(null);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);


  return (
    <div style={{ paddingBottom: 56 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, margin: 0 }}>Expenses</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            disabled
            title="Coming in the next step"
            style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.45, cursor: "not-allowed" }}
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => { setDialogFor(null); setDialogOpen(true); }}
            style={{ ...primaryBtn, display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Plus size={16} /> Add expense
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ ...panel, padding: 24, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading expenses…
        </div>
      ) : (
        <>
          <ExpenseSummary expenses={filtered} defaultCurrency={defaultCurrency} />
          <ExpenseFilters value={filters} onChange={setFilters} onReset={resetFilters} />
          <ExpenseList
            expenses={filtered}
            signedUrls={signedUrls}
            linkedItems={linkedItems}
            busyId={busyId}
            onSetStatus={setStatus}
            onEdit={(e) => { setDialogFor(e); setDialogOpen(true); }}
            onDelete={remove}
            onOpenFile={(url, isPdfFile, title) => setViewer({ url, isPdf: isPdfFile, title })}
          />
        </>
      )}

      {dialogOpen && (
        <ExpenseDialog
          projectId={projectId}
          company={company}
          defaultCurrency={defaultCurrency}
          actorName={actorName}
          itemOptions={itemOptions}
          nextInvoiceNumber={nextInvoiceNumber(expenses)}
          existing={dialogFor}
          onClose={() => { setDialogOpen(false); setDialogFor(null); }}
          onSaved={onSaved}
        />
      )}

      {viewer && (
        <FileLightbox url={viewer.url} isPdf={viewer.isPdf} title={viewer.title} onClose={() => setViewer(null)} />
      )}
    </div>
  );
};

export default ExpenseWorkspace;
