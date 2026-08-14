import { useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { libraryDocs } from "@/data/libraryDocs";

const BASE = "https://filmmakergenius.com";

/**
 * Injects a unique <title> / meta description / canonical for each public
 * document library page. Rendered once inside GlobalLayout.
 */
export default function LibraryDocSeo() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/library") {
    return (
      <Seo
        title="Film Production Document Library"
        description="Free fillable film production templates and agreements: deal memos, releases, call sheets, budgets, festival and delivery paperwork."
        canonical={`${BASE}/library`}
        type="website"
      />
    );
  }

  const doc = libraryDocs.find((d) => d.path === path);
  if (!doc) return null;

  return (
    <Seo
      title={`${doc.title} Template | Filmmaker Genius`}
      description={`${doc.description}. Free fillable ${doc.title} template — edit online and download a professional PDF.`}
      canonical={`${BASE}${doc.path}`}
      type="article"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: doc.title,
        description: doc.description,
        url: `${BASE}${doc.path}`,
      }}
    />
  );
}
