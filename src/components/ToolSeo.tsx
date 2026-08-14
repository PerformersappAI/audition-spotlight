import Seo from "@/components/Seo";
import { toolSeo } from "@/data/toolSeo";

const SITE = "https://filmmakergenius.com";

/** Head metadata for a tool/landing route. Rendered outside the paywall gate. */
export function ToolSeo({ path }: { path: string }) {
  const entry = toolSeo[path];
  if (!entry) return null;
  return (
    <Seo
      title={entry.title}
      description={entry.description}
      canonical={`${SITE}${path}`}
      type="website"
    />
  );
}

/** Visible answer-first lead paragraph for a tool/landing route. */
export function ToolLead({ path }: { path: string }) {
  const entry = toolSeo[path];
  if (!entry) return null;
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-6">
      <p className="text-sm leading-relaxed text-muted-foreground">{entry.lead}</p>
    </div>
  );
}

export default ToolSeo;
