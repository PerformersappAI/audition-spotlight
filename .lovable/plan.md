## Goal

Use the three uploaded references as the **editorial training ground** for the Pitch Deck Maker so every generated deck mirrors the structure, tone, and craftsmanship of professional industry decks (SBS Scripted, Micah Haley's "north star" framework, and the canonical 10-slide taxonomy).

This is **not** a visual redesign — that was the previous pass. This pass upgrades **what the deck contains, in what order, and how the AI writes it.**

---

## What changes

### 1. Canonical slide order (industry standard)

Reorder both the in-app preview and PDF export to follow the merged SBS + Haley + 10-slide structure:

```text
1.  Cover / Title  — Title, format (e.g. "8 x 30 min drama"), logline, poster
2.  North Star     — Why this story, why now, what's unique (NEW)
3.  Synopsis       — One-page series/film summary
4.  Tone & Style   — Sensory + visual impression, genre cues
5.  World / Setting — Location as character (NEW dedicated slide)
6.  Characters     — Portraits + arcs (internal + external goal)
7.  Visual Style / Moodboard
8.  Episode Breakdown (TV only) OR Story Structure (Feature) (NEW)
9.  Comparables    — Posters + "why similar"
10. Target Audience + Market
11. Team
12. Production / Budget
13. Distribution Strategy
14. The Ask + Contact
```

### 2. New editor fields (Step 2 + Step 4)

- **North Star** (Step 2): "Why are you the only person who can tell this story?" + "What's unique/fresh about it?"
- **Character internal vs. external goal** (Step 3): split the existing description field — every character gets `externalGoal` and `internalWound` per SBS guidance ("they cannot achieve their external goal until their internal goal is resolved")
- **Episode breakdown** (Step 2, conditional on `tv_series`/`mini_series`): per-episode logline list
- **World/Setting** (Step 2): dedicated short prompt — "Why must this story be set here?"

All new fields are optional so existing drafts keep working.

### 3. AI prompt overhaul (`generate-pitch-content` edge function)

Rewrite the system prompt to teach the model the SBS + Haley craft rules directly:

- "A pitch deck is a FINAL document, not preliminary — write it like finished marketing copy"
- "Carry the tone of the genre — comedy = funny copy, horror = evoke dread"
- "Every character needs an internal wound + external goal; they cannot resolve the external until the internal heals"
- "The location is a character — explain why this story can only happen here"
- "North Star: why this story, why you, why now"
- Output JSON now includes: `northStar`, `worldSetting`, `episodes[]`, `character.externalGoal`, `character.internalWound`

### 4. Copy quality guardrails

- Synopsis/vision/audience text: enforce **3–5 sentence paragraphs** at generation time (not just split at render) so the source data is clean
- Logline: hard cap 30 words, single sentence, must include protagonist + want + obstacle
- Format string auto-built from project type + episode count (e.g. "8 × 30 min drama") on cover slide
- Section labels rendered consistently in small-caps gold across all slides

### 5. New "Pitch Health" check (lightweight)

Above the Generate button in Step 4, show a small checklist driven by the SBS essentials:

- ✅/⚠️ Strong hook & inciting incident in synopsis
- ✅/⚠️ Each character has goal + wound
- ✅/⚠️ Logline ≤ 30 words
- ✅/⚠️ At least 2 comparables with posters
- ✅/⚠️ Tone & style filled

Purely informational — never blocks generation.

---

## Files touched

- `src/pages/PitchDeckMaker.tsx` — extend `PitchDeckData` (northStar, worldSetting, episodes, character goals)
- `src/components/pitchdeck/Step2Story.tsx` — add North Star + World + conditional episode list fields
- `src/components/pitchdeck/Step3CharactersVisuals.tsx` — split character description into wound/goal
- `src/components/pitchdeck/Step4MarketTeam.tsx` — add Pitch Health checklist panel
- `src/pages/PitchDeckPreview.tsx` — add North Star, World, Episodes slides; reorder
- `src/utils/exportPitchDeckToPDF.ts` — same new slides + reordering, consistent gold section labels
- `supabase/functions/generate-pitch-content/index.ts` — rewrite system prompt with SBS/Haley rules; expand JSON schema

---

## Out of scope (intentionally)

- No new external API integrations
- No re-skin of existing slides (the visual pass is already done)
- No changes to poster/portrait generation (already updated for celebrity safety)
- No changes to TMDB comparables fetcher

---

Ready to implement on approval.