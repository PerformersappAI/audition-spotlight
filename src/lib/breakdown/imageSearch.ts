export interface ImageResult {
  id: string;
  thumb: string;
  full: string;
  title?: string;
}

const openverse = async (q: string, signal: AbortSignal): Promise<ImageResult[]> => {
  const res = await fetch(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=12`,
    { signal },
  );
  if (!res.ok) throw new Error("openverse failed");
  const json = await res.json();
  const results = Array.isArray(json?.results) ? json.results : [];
  return results
    .map((r: any, i: number) => ({
      id: String(r.id ?? i),
      thumb: r.thumbnail || r.url,
      full: r.url || r.thumbnail,
      title: r.title,
    }))
    .filter((r: ImageResult) => !!r.thumb && !!r.full);
};

const wikimedia = async (q: string, signal: AbortSignal): Promise<ImageResult[]> => {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=12` +
    `&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("wikimedia failed");
  const json = await res.json();
  const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
  return (pages as any[])
    .map((p) => {
      const info = p?.imageinfo?.[0];
      if (!info) return null;
      return {
        id: String(p.pageid),
        thumb: info.thumburl || info.url,
        full: info.url || info.thumburl,
        title: p.title,
      } as ImageResult;
    })
    .filter((r): r is ImageResult => !!r && !!r.thumb && !!r.full);
};

/** Openverse first, Wikimedia Commons as fallback. Throws on abort. */
export const searchReferenceImages = async (q: string, signal: AbortSignal): Promise<ImageResult[]> => {
  try {
    const primary = await openverse(q, signal);
    if (primary.length) return primary;
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
  }
  return wikimedia(q, signal);
};
