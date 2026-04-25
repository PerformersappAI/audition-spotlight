Fix the visual bugs the user reported on the Pitch Deck Preview without changing data, AI logic, or exports. All edits in `src/pages/PitchDeckPreview.tsx`.

## Slide-by-slide fixes

**Page 1 — Cover**
- Hero image is stretched: it's currently `object-fit: cover` but a portrait poster gets cropped weirdly when paired with a title on top. Switch behavior so when `data.posterImage` exists it renders as a contained portrait card on the right (max-height with `object-fit: contain`, dark backdrop), with the title block on the left — i.e. a proper "one-sheet" cover layout. When only a 16:9 AI still exists, keep the full-bleed cover.
- Title + logline collision: add a real gap (margin-top: 36–40px on logline, larger line-height, and clamp the title to 2 lines).
- Logline length: enforce a soft cap. Truncate the displayed logline at ~12 words with an ellipsis (display only — do not mutate stored data). Helper: `clampWords(str, 12)`.

**Page 2 — Story**
- Image stretched: the right column uses `object-fit: cover` inside a flex cell with no fixed aspect ratio, so a horizontal still gets squeezed into a tall column. Wrap the image in a square (1:1) frame centered in the cell — Instagram-style — with `object-fit: cover` on a real square box. Vertically center it.
- Text cut off mid-sentence: replace the hard `maxHeight: 520px; overflow: hidden` clip with sentence-aware truncation. Compute how many sentences fit (target ~60 words / ~3 short paragraphs), append "…" cleanly. If synopsis exceeds the budget, cut at a sentence boundary, never mid-sentence.

**Page 3 — Pull Quote**
- Caption "From the Synopsis" → replace with the movie title in small caps: `{data.projectTitle?.toUpperCase()}` (fallback "Untitled").

**Page 6 — text cut off top and bottom (The World / North Star)**
- Both `slide-northstar` and `slide-world` use `maxHeight: 520px; overflow: hidden` which clips mid-paragraph and, combined with vertical centering, can hide the top and bottom. Apply the same sentence-aware truncation used on Story, and remove vertical centering for World (already top-anchored — keep). For North Star, anchor content to the top with padding instead of centering when text exceeds one paragraph, so it never clips at the top.

**Page 7 — Characters (poster cropping head off)**
- Portrait cards use `aspect-ratio: 3/4` with `object-fit: cover`, which crops a tall poster from the center cutting off heads. Change to `object-fit: contain` against a dark `CARD` background with `object-position: top center` fallback for `cover`. Concretely: use `object-fit: contain` + neutral dark backdrop so the full portrait is visible (letterboxed), preserving the card frame.

**Page 8 — Visual Style (stretched poster + leftover text box)**
- Poster stretched: full-bleed `object-fit: cover` warps a portrait poster. Switch this slide's image treatment to a contained portrait on the right (matching the Cover one-sheet treatment), with the text panel on the left in its own column — no overlap.
- "Random box of text" / overlap: the current layout positions the text panel absolutely over the image. Convert to a 2-column grid (text left, contained poster right) so nothing overlaps and no orphan caption appears. Drop the `PlateCaption` overlay on this slide.

**Page 9 — Empty slide**
- This is rendering a section whose data is empty (likely Comparables, Episodes, Production, or Market when only one field is present and the column ends up blank). Tighten all conditional renders so a slide only mounts when it has meaningful content:
  - Comparables: require `comparables.length && comparables.some(c => c.title)`.
  - Episodes: require `episodes.length && episodes.some(e => e.title || e.logline)`.
  - Market: require `primaryDemographic || secondaryAudience || (targetPlatforms?.length) || distributionPlan`.
  - Production: require at least one truthy row.
  - Team: require `teamMembers.some(m => m.name || m.role)`.

## Shared helpers to add

```ts
// Word-boundary clamp for display
const clampWords = (s: string, n: number) =>
  (s?.split(/\s+/) ?? []).length > n
    ? s.split(/\s+/).slice(0, n).join(" ") + "…"
    : s ?? "";

// Sentence-aware truncation by approximate word budget
const truncateSentences = (s: string, maxWords: number) => {
  const sentences = s.match(/[^.!?]+[.!?]+/g) ?? [s];
  const out: string[] = [];
  let count = 0;
  for (const sent of sentences) {
    const w = sent.trim().split(/\s+/).length;
    if (count + w > maxWords) break;
    out.push(sent.trim());
    count += w;
  }
  return out.length ? out.join(" ") : sentences[0]?.trim().slice(0, maxWords * 6) + "…";
};
```

## Out of scope
- No changes to AI generation, data model, exports (PDF/PPTX), or the editor.
- No new slide types added or removed.
- No color/typography overhaul beyond what's needed to fix layout bugs.
