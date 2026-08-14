/**
 * Shared authorship helpers for Filmmaker Genius Academy content pages.
 *
 * Provides:
 *  - AUTHOR / PUBLISHER schema.org blocks
 *  - academyJsonLd(): builds an Article / Course / LearningResource node
 *  - <AcademyByline />: the matching visible "By Will Roberts — updated <date>" line
 *
 * Keep the JSON-LD author and the visible byline in sync by using both together.
 */

export const ACADEMY_AUTHOR = {
  "@type": "Person",
  name: "Will Roberts",
  url: "https://filmmakergenius.com/about",
} as const;

export const ACADEMY_PUBLISHER = {
  "@type": "Organization",
  name: "Filmmaker Genius",
  url: "https://filmmakergenius.com",
  logo: {
    "@type": "ImageObject",
    url: "https://filmmakergenius.com/og-image.jpg",
  },
} as const;

/** Fallback publication date for academy content that carries no explicit date. */
export const ACADEMY_PUBLISHED = "2025-09-01";
/** Last content review pass across the academy. Static so SSR and hydration match. */
export const ACADEMY_MODIFIED = "2026-08-14";

export type AcademySchemaType = "Article" | "Course" | "LearningResource";

interface AcademyJsonLdOptions {
  type?: AcademySchemaType;
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  /** Optional parent course / collection this page belongs to. */
  isPartOf?: { name: string; url: string; type?: string };
  /** Extra schema properties merged into the node (e.g. hasCourseInstance). */
  extra?: Record<string, unknown>;
}

export function academyJsonLd({
  type = "Article",
  headline,
  description,
  url,
  datePublished = ACADEMY_PUBLISHED,
  dateModified = ACADEMY_MODIFIED,
  isPartOf,
  extra,
}: AcademyJsonLdOptions): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    name: headline,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: ACADEMY_AUTHOR,
    creator: ACADEMY_AUTHOR,
    publisher: ACADEMY_PUBLISHER,
    datePublished,
    dateModified,
    inLanguage: "en",
  };

  if (type === "Course") {
    node.provider = ACADEMY_PUBLISHER;
  }

  if (isPartOf) {
    node.isPartOf = {
      "@type": isPartOf.type || "Course",
      name: isPartOf.name,
      url: isPartOf.url,
    };
  }

  return extra ? { ...node, ...extra } : node;
}

export function formatAcademyDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface AcademyBylineProps {
  /** ISO date (YYYY-MM-DD) shown as the "updated" date. */
  updated?: string;
  /** Visual variant: dark academy pages (default) or Tailwind-token pages. */
  variant?: "inline" | "tokens";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Visible author credit that mirrors the JSON-LD author/dateModified.
 */
export function AcademyByline({
  updated = ACADEMY_MODIFIED,
  variant = "inline",
  className,
  style,
}: AcademyBylineProps) {
  const label = (
    <>
      By{" "}
      <a
        href="/about"
        rel="author"
        style={
          variant === "inline"
            ? { color: "inherit", textDecoration: "none", fontWeight: 600 }
            : undefined
        }
        className={variant === "tokens" ? "font-semibold text-foreground/80 no-underline hover:underline" : undefined}
      >
        Will Roberts
      </a>{" "}
      — updated {formatAcademyDate(updated)}
    </>
  );

  if (variant === "tokens") {
    return (
      <p className={className ?? "mt-3 text-xs text-foreground/50"} style={style}>
        {label}
      </p>
    );
  }

  return (
    <p
      className={className}
      style={{
        margin: "14px 0 0",
        fontSize: 13,
        color: "rgba(255,255,255,0.45)",
        ...style,
      }}
    >
      {label}
    </p>
  );
}
