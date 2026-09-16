import { supabase } from "@/integrations/supabase/client";
import { EXPENSE_BUCKET } from "./types";

export const MAX_PDF_BYTES = 10 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const extForMime = (mime: string) => EXT_BY_MIME[mime.toLowerCase()] || "bin";

export const isPdf = (mime: string | null | undefined) =>
  (mime || "").toLowerCase() === "application/pdf";

export const pathIsPdf = (path: string | null | undefined) => /\.pdf$/i.test(path || "");

/** Upload one blob to "<projectId>/<expenseId>/<uuid>.<ext>" and return its storage path. */
export const uploadExpenseFile = async (
  projectId: string,
  expenseId: string,
  blob: Blob,
  mime: string,
): Promise<string> => {
  const path = `${projectId}/${expenseId}/${crypto.randomUUID()}.${extForMime(mime)}`;
  const { error } = await supabase.storage
    .from(EXPENSE_BUCKET)
    .upload(path, blob, { contentType: mime, upsert: false });
  if (error) throw new Error(error.message);
  return path;
};

export const removeExpenseFiles = async (paths: (string | null | undefined)[]) => {
  const list = paths.filter((p): p is string => !!p);
  if (!list.length) return;
  await supabase.storage.from(EXPENSE_BUCKET).remove(list);
};

/** Remove every stored object under an expense's folder. */
export const removeExpenseFolder = async (projectId: string, expenseId: string) => {
  const prefix = `${projectId}/${expenseId}`;
  const { data } = await supabase.storage.from(EXPENSE_BUCKET).list(prefix);
  const paths = (data || []).map((f) => `${prefix}/${f.name}`);
  if (paths.length) await supabase.storage.from(EXPENSE_BUCKET).remove(paths);
};

/** Batch signed URLs (1 hour). */
export const signExpensePaths = async (paths: string[]): Promise<Record<string, string>> => {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (!unique.length) return {};
  const { data } = await supabase.storage.from(EXPENSE_BUCKET).createSignedUrls(unique, 3600);
  const map: Record<string, string> = {};
  (data || []).forEach((entry) => {
    if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
  });
  return map;
};

export const fileToBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma === -1 ? result : result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
