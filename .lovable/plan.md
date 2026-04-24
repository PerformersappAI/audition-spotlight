## Fix: Pitch Deck poster "Edge Function returned a non-2xx status code"

### Root cause
`Step3CharactersVisuals.tsx` calls `generate-pitch-poster` with:
```
{ projectTitle, genre, logline, visualStyle, template }
```
But `supabase/functions/generate-pitch-poster/index.ts` only reads `{ prompt }`. Since `prompt` is undefined, the function returns `400 "Prompt is required"` before any logs are written — which is exactly what the production logs show (no "Generating poster…" line ever appears).

### Fix
Update `supabase/functions/generate-pitch-poster/index.ts` to:
1. Accept the structured fields the client actually sends (`projectTitle`, `genre`, `logline`, `visualStyle`, `template`) — and still accept a raw `prompt` as a fallback for backward compat.
2. Build a high-quality movie-poster prompt server-side from those fields, e.g.:
   - Title: <projectTitle>
   - Genre(s): <genre joined>
   - Logline: <logline>
   - Visual style: <visualStyle>
   - Template mood: <template id mapped to descriptor like "Thriller / Noir, high-contrast indigos and charcoal">
   - Append fixed framing instructions: "vertical 2:3 movie poster, cinematic key art, dramatic lighting, no text, no logos, no watermark."
3. Validate that at least `projectTitle` (or `prompt`) is present; otherwise return a clear 400 with a useful message that the client can surface in a toast.
4. Keep the existing Lovable AI Gateway call (`google/gemini-3.1-flash-image-preview`, `modalities: ["image","text"]`) and the existing `imageUrl` extraction. Continue returning `{ imageUrl }` so the existing client code (`result?.imageUrl || result?.posterUrl || result?.url`) keeps working with no client changes.
5. Surface 429/402 as today, plus return the AI gateway's error body text in the 500 case so future debugging is easier.

### Files changed
- `supabase/functions/generate-pitch-poster/index.ts` — accept structured fields, build prompt server-side, better error reporting.

No client changes needed. No other tools touched.
