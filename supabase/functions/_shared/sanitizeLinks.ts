/**
 * Link allow-list sanitizer for blog post bodies.
 *
 * Handles both HTML <a href="...">TEXT</a> and Markdown [TEXT](URL).
 *
 * Rules:
 *  - Own-site link (relative path, or absolute on filmmakergenius.com / any subdomain):
 *    keep only if homepage or the path matches a real router route. Otherwise strip
 *    the link and keep the visible text.
 *  - Approved sibling homepages (howtoselftape.com, gotauditions.com, onsetreport.com): keep.
 *  - Any other external domain: keep untouched.
 *
 * NOTE: this logic is duplicated in supabase/functions/ingest-article/index.ts
 * (edge runtime can't import from src/). Keep both in sync.
 */

const OWN_HOST_SUFFIX = "filmmakergenius.com";

const APPROVED_SIBLING_HOSTS = [
  "howtoselftape.com",
  "gotauditions.com",
  "onsetreport.com",
];

/** Route patterns from src/App.tsx (":param" segments match any single segment). */
export const APP_ROUTES: string[] = [
  "/",
  "/welcome",
  "/auth",
  "/dashboard",
  "/actor",
  "/actor/profile",
  "/crew",
  "/crew-hire",
  "/create-audition",
  "/auditions",
  "/audition/:id",
  "/upload-auditions",
  "/scene-analysis",
  "/script-analysis",
  "/storyboarding",
  "/storyboarding/pricing",
  "/call-sheet",
  "/create-project",
  "/create-festival",
  "/applications",
  "/festivals",
  "/calendar",
  "/filmmaker",
  "/admin-login",
  "/admin",
  "/admin/users",
  "/admin/auditions",
  "/admin/projects",
  "/admin/festivals",
  "/admin/applications",
  "/admin/credits",
  "/admin/credit-usage",
  "/admin/courses",
  "/admin/quizzes",
  "/admin/quiz-analytics",
  "/admin/homepage",
  "/admin/blog",
  "/toolbox",
  "/toolbox/pre-production",
  "/toolbox/production",
  "/toolbox/post-production",
  "/toolbox/film-release",
  "/toolbox/distribution",
  "/submit",
  "/library",
  "/consulting",
  "/membership",
  "/training",
  "/training/:courseId",
  "/training/my-learning",
  "/training/certifications",
  "/verify-certificate/:certificateNumber",
  "/contract-assistant",
  "/funding-strategy",
  "/contract-filler",
  "/pitch-deck",
  "/pitch-deck/preview",
  "/distribution-readiness",
  "/table-read",
  "/table-read/shared/:id",
  "/video-evaluation",
  "/actor-dashboard",
  "/social",
  "/animatic/:projectId",
  "/blog",
  "/blog/:slug",
  "/academy",
  "/academy/education",
  "/academy/education-modules",
  "/academy/roberts-filmmaking",
  "/academy/roberts-filmmaking/:chapterId",
  "/academy/aggregators",
  "/academy/distributors",
  "/academy/vod",
  "/academy/aggregators/:slug",
  "/academy/distributors/:slug",
  "/academy/vod/:slug",
  "/green-light-engine",
  "/green-light-engine/niche",
  "/green-light-engine/niche/:slug",
  "/green-light-engine/:tier",
  "/academy/:courseSlug",
  "/academy/:courseSlug/:chapterSlug",
  "/about",
  "/contact",
  "/faq",
  "/pricing",
  "/privacy",
  "/terms",
  "/recut",
  "/launch",
  "/marketing",
  "/refill",
];

const normalizePath = (p: string) => {
  let path = (p || "").split("#")[0].split("?")[0].trim();
  if (!path) return "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
};

const matchesRoute = (path: string) => {
  const segs = path.split("/").filter(Boolean);
  return APP_ROUTES.some((route) => {
    const rSegs = route.split("/").filter(Boolean);
    if (rSegs.length !== segs.length) return false;
    return rSegs.every((rs, i) => rs.startsWith(":") || rs === segs[i]);
  });
};

const isOwnHost = (host: string) =>
  host === OWN_HOST_SUFFIX || host.endsWith(`.${OWN_HOST_SUFFIX}`);

const isApprovedSiblingHomepage = (host: string, path: string) =>
  APPROVED_SIBLING_HOSTS.some((h) => host === h || host === `www.${h}`) &&
  (path === "/" || path === "");

/** Returns true when the link should be kept as a link. */
export function isAllowedLink(rawUrl: string): boolean {
  const url = (rawUrl || "").trim();
  if (!url) return false;

  // Non-http schemes we leave alone (mailto:, tel:, etc.)
  if (/^(mailto:|tel:|sms:)/i.test(url)) return true;
  // Bare anchors / query-only links stay on the current page.
  if (url.startsWith("#") || url.startsWith("?")) return true;

  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith("//");
  if (!isAbsolute) {
    const path = normalizePath(url);
    return path === "/" || matchesRoute(path);
  }

  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
  } catch {
    return false;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = normalizePath(parsed.pathname);

  if (isOwnHost(host)) return path === "/" || matchesRoute(path);
  if (isApprovedSiblingHomepage(host, parsed.pathname)) return true;

  // Any other real external site: keep.
  return true;
}

/** Strip disallowed links from Markdown + HTML text, preserving visible text. */
export function sanitizeLinks(text: string): string {
  if (!text) return text;
  let out = text;

  // Markdown: [TEXT](URL "optional title") — skip images (![...](...)).
  out = out.replace(
    /(!?)\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g,
    (match, bang, label, url) => {
      if (bang) return match; // image
      return isAllowedLink(url) ? match : label;
    },
  );

  // HTML anchors
  out = out.replace(
    /<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi,
    (match, _q, dq, sq, bare, inner) => {
      const url = dq ?? sq ?? bare ?? "";
      return isAllowedLink(url) ? match : inner;
    },
  );

  return out;
}
