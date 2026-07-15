import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { routes } from "./routes.mjs";

const DIST = resolve("dist");
const SERVER = resolve("dist-server");
const BASE_URL = "https://filmmakergenius.com";

const template = readFileSync(resolve(DIST, "index.html"), "utf-8");
const { render } = await import(pathToFileURL(resolve(SERVER, "entry-server.js")).href);

function helmetToHead(helmet) {
  if (!helmet) return "";
  const parts = [
    helmet.title?.toString() ?? "",
    helmet.meta?.toString() ?? "",
    helmet.link?.toString() ?? "",
    helmet.script?.toString() ?? "",
  ];
  return parts.filter(Boolean).join("\n    ");
}

function stripTemplateHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");
}

function writeRouteFile(route, html) {
  let outPath;
  if (route === "/") outPath = resolve(DIST, "index.html");
  else outPath = resolve(DIST, "." + route, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}

let ok = 0;
let fallback = 0;
const failed = [];

for (const route of routes) {
  try {
    const { html, helmet } = await render(route);
    const headExtra = helmetToHead(helmet);
    const helmetHasTitle = !!(helmet && helmet.title?.toString().includes("<title"));
    let out = template;
    if (helmetHasTitle) out = stripTemplateHead(out);
    out = out.replace("</head>", `    ${headExtra}\n  </head>`);
    out = out.replace(
      /<div id="root">[\s\S]*?<\/div>/,
      `<div id="root">${html}</div>`
    );
    writeRouteFile(route, out);
    ok++;
  } catch (err) {
    console.error(`[prerender] FAIL ${route}:`, err?.message || err);
    writeRouteFile(route, template);
    fallback++;
    failed.push(route);
  }
}

// sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${BASE_URL}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  )
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(resolve(DIST, "sitemap.xml"), sitemap);

console.log(`[prerender] done: ${ok} ok, ${fallback} fallback, ${routes.length} total`);
if (failed.length) console.log("[prerender] fallback routes:", failed);
