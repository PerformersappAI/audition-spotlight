import { routes } from "./routes.mjs";

const KEY = "b21e583b9198dbdc186057c613163131";
const HOST = "filmmakergenius.com";
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10000;

const argUrls = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const paths = argUrls.length ? argUrls : routes;
const urlList = [...new Set(paths.map((p) => (p.startsWith("http") ? p : `${BASE}${p}`)))];

console.log(`[indexnow] submitting ${urlList.length} URLs as ${HOST}`);

let failed = false;
for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
  });
  const text = await res.text().catch(() => "");
  console.log(`[indexnow] batch ${i / BATCH + 1}: ${batch.length} URLs -> HTTP ${res.status} ${res.statusText} ${text.slice(0, 300)}`);
  if (!res.ok) failed = true;
}

if (failed) process.exitCode = 1;
