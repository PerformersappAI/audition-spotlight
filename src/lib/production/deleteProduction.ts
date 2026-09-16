import { supabase } from "@/integrations/supabase/client";

/** Buckets that store files under a "<project_id>/…" prefix. */
const PROJECT_BUCKETS = ["breakdown-photos", "expense-receipts"] as const;

const PAGE = 100;

/** List every object path under a prefix, walking nested folders and paging. */
async function listAll(bucket: string, prefix: string): Promise<string[]> {
  const paths: string[] = [];
  const queue = [prefix];

  while (queue.length) {
    const folder = queue.shift() as string;
    let offset = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, { limit: PAGE, offset });
      if (error) throw new Error(`Couldn't read stored files: ${error.message}`);
      const rows = data || [];
      for (const row of rows) {
        const full = `${folder}/${row.name}`;
        // Supabase returns folders as rows without an id / metadata.
        if (row.id) paths.push(full);
        else queue.push(full);
      }
      if (rows.length < PAGE) break;
      offset += PAGE;
    }
  }
  return paths;
}

async function purgeBucket(bucket: string, projectId: string) {
  const paths = await listAll(bucket, projectId);
  for (let i = 0; i < paths.length; i += PAGE) {
    const { error } = await supabase.storage.from(bucket).remove(paths.slice(i, i + PAGE));
    if (error) throw new Error(`Couldn't remove stored files: ${error.message}`);
  }
}

/**
 * Permanently delete a production: its stored files first, then the
 * breakdown_projects row (child rows cascade). Cast & crew forms linked to the
 * production are kept and moved back to the general list.
 * Throws with a readable message if any step fails.
 */
export async function deleteProduction(projectId: string) {
  for (const bucket of PROJECT_BUCKETS) {
    await purgeBucket(bucket, projectId);
  }

  const { error: formError } = await supabase
    .from("cast_crew_forms")
    .update({ project_id: null })
    .eq("project_id", projectId);
  if (formError) throw new Error(`Couldn't detach your cast & crew list: ${formError.message}`);

  const { error } = await supabase.from("breakdown_projects").delete().eq("id", projectId);
  if (error) throw new Error(`The production couldn't be deleted: ${error.message}`);
}
