

## Fix three storyboard issues

### 1. "Visual Elements" text running together (e.g. "overhead lightingCommanding")

**Root cause:** In `supabase/functions/analyze-shots/index.ts` line 225, `visualElements` is built as a raw two-item array: `[shot.lighting, shot.emotionalTone]`. When React renders `{shot.visualElements}`, arrays are joined with **no separator**, mashing the two values together.

**Fix:** Join the values with a clean separator on the server side so the stored value is a readable string.
```ts
visualElements: [shot.lighting, shot.emotionalTone].filter(Boolean).join(" · ")
```
Also harden the frontend in `Storyboarding.tsx` (line 2938) and `SceneAnalysis.tsx` (line 739) to gracefully handle either a string or a legacy array:
```tsx
{Array.isArray(shot.visualElements) ? shot.visualElements.filter(Boolean).join(" · ") : shot.visualElements}
```
This fixes new generations and any legacy data already saved to projects.

### 2. Animatic GIF Export error: "Failed to construct 'Worker'"

**Root cause:** `src/components/storyboard/AnimaticTab.tsx` loads `gif.worker.js` from `https://cdn.jsdelivr.net/...`. Browsers block constructing a `Worker` from a cross-origin script URL, so on `filmmakergenius.com` it throws.

**Fix:** Bundle the worker locally so it's same-origin.
- Copy `gif.worker.js` (from the `gif.js` package) into `public/gif.worker.js`.
- Change the constant to:
  ```ts
  const GIF_WORKER_URL = "/gif.worker.js";
  ```
- Wrap the `new GIF(...)` call in a try/catch with a friendly toast fallback in case the worker still fails to boot, instead of the current red overlay.

### 3. "Edge function error" message

The recent edge function logs (`generate-single-frame`, `analyze-shots`, `generate-character-portrait`) all show **successful runs** with normal `shutdown` events — no failures server-side. The error you're seeing is almost certainly the **GIF worker error from issue #2** surfacing as a generic toast. Once #2 is fixed, this should disappear.

If a different edge function error pops up after the fix, the toast will now include the function name so we can pinpoint it.

### Files changed
- `supabase/functions/analyze-shots/index.ts` — join `visualElements` with " · "
- `src/pages/Storyboarding.tsx` — defensive render for `visualElements`
- `src/pages/SceneAnalysis.tsx` — defensive render for `visualElements`
- `src/components/storyboard/AnimaticTab.tsx` — switch worker to local `/gif.worker.js`, add try/catch toast
- `public/gif.worker.js` — new bundled worker file

No wizard, routing, or other tool behavior changes.

