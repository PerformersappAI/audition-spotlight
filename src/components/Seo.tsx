import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: string;
  jsonLd?: object | object[];
}

const DEFAULT_IMAGE = "https://filmmakergenius.com/og-image.jpg";
const SITE_NAME = "Filmmaker Genius";
const BRAND_SUFFIXES = [
  " | Filmmaker Genius",
  " — Filmmaker Genius Academy",
  " — Filmmaker Genius",
];
const TITLE_MAX = 60;
const DESC_MAX = 160;
const DESC_SOFT = 148;

function normalizeTitle(raw: string): string {
  const t = (raw || "").trim();
  if (!t || t.length <= TITLE_MAX) return t;
  for (const suffix of BRAND_SUFFIXES) {
    if (t.endsWith(suffix)) {
      const stripped = t.slice(0, -suffix.length).trim().replace(/[—\-|]\s*$/, "").trim();
      if (stripped.length > 0) return stripped;
    }
  }
  return t;
}

function clampDescription(raw: string): string {
  const d = (raw || "").trim();
  if (d.length <= DESC_MAX) return d;
  const slice = d.slice(0, DESC_SOFT);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s.,;:!?—-]+$/, "") + "…";
}

export default function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "article",
  jsonLd,
}: SeoProps) {
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const finalTitle = normalizeTitle(title);
  const finalDesc = clampDescription(description);
  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={image} />

      {ldArray.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
