

# Storyboarding — Detailed Breakdown Flow Polish

Build on the existing scene-selector + shot-list foundation. Add a clear 3-step flow, richer per-shot fields, credit confirmation, and a downloadable shot list. Quick Storyboard remains untouched.

## Step Indicator (top of Detailed Breakdown only)

```text
[1 Select Scenes] ─── [2 Review Shot List] ─── [3 Generate]
```

State derived from existing flags: `extractedScenes` set → step 1; `selectedProject` with shots & no images → step 2; images generating/present → step 3. Hidden when no script in progress.

## Step 1 — Scene Selector (enhance existing `SceneSelector.tsx`)

Already implemented. Small additions only:
- Tip line under header: "Selecting fewer scenes = fewer credits used."
- Show "X of Y scenes selected" counter (already present — keep).
- Default selection switches from "all" to "all" still, but Min 1 required (already enforced).
- Auto-save the selected scene-number set to `localStorage` keyed by script hash so navigating away preserves it.

## Step 2 — Shot List Review (enhance existing shot-list editor in `Storyboarding.tsx`)

The existing inline shot editor already lets users edit description, camera angle, characters, etc. Add two structured dropdowns and a credit estimator above it.

Per-shot row gains:
- **Shot Type** dropdown — Wide, Medium, Close-Up, Over-the-Shoulder, POV, Two-Shot, Insert. Maps to `shot.shotType`.
- **Camera Movement** dropdown — Static, Pan, Tilt, Dolly In, Dolly Out, Handheld, Crane. New field `shot.cameraMovement`.
- Action Summary capped at 120 chars with live counter.
- Location field pre-filled from the originating scene.

Above the list:
- "Step 2: Review Shot List" heading
- Live credit estimator: `shots.length × CREDITS_PER_FRAME` (read from existing credit constant). Updates as shots are added/removed.
- "← Back to Scene Selector" returns user to step 1 with prior selection intact.
- "Approve & Generate Storyboard →" replaces current generate trigger.
- "Download Shot List (PDF)" button — exports current shot list (scene #, location, action, shot type, camera movement, dialogue) using existing `jspdf` already imported.

Mobile: shot rows stack vertically (already responsive — verify and tighten).

Auto-save: debounced write of edited shots to the existing `storyboard_projects` row via `updateProject` so edits survive navigation.

## Step 3 — Generation Gate

Clicking "Approve & Generate":
1. Opens an `AlertDialog`: "This will use **N credits** to generate **N frames**. Continue?" with Cancel / Generate buttons.
2. On confirm, calls existing image-generation path. Per-frame prompts now include `shotType`, `cameraMovement`, `location`, and `action` so the visual matches the approved shot list.

No image calls fire before this confirmation.

## Preserved (no changes)

- Quick Storyboard button + `generate-storyboard-simple` flow
- Art style picker, custom style prompt, style reference image upload
- Aspect ratio selector
- Character definitions manager
- Per-frame edit / regenerate / inpaint after generation

## Out of Scope (deferred)

The user's "five suggestions" list — character extraction, saved templates, named projects panel, etc. — are explicitly future work. Only #1 (credit estimator dialog) and #2 (shot list PDF) are included in this pass because they're cheap and directly tied to the gate.

## Technical Details

**Files touched:**
- `src/pages/Storyboarding.tsx` — add `StepIndicator` render, dropdowns in shot editor, credit dialog, PDF button, `cameraMovement` state, debounced auto-save, pass new fields to image-gen body.
- `src/components/storyboard/SceneSelector.tsx` — add tip line, localStorage persistence of selection.
- `src/components/storyboard/StepIndicator.tsx` — new tiny component (3 pills, current step highlighted).
- `src/components/storyboard/ShotListPDF.ts` — new util wrapping `jsPDF` to render the shot list table.
- `src/components/storyboard/ShotEditor.tsx` *(if not already extracted)* — otherwise edit the inline editor block in `Storyboarding.tsx`.

**Data shape addition:**
```ts
interface Shot {
  // existing fields…
  shotType?: "Wide" | "Medium" | "Close-Up" | "Over-the-Shoulder" | "POV" | "Two-Shot" | "Insert";
  cameraMovement?: "Static" | "Pan" | "Tilt" | "Dolly In" | "Dolly Out" | "Handheld" | "Crane";
}
```
No DB migration needed — `shots` is `jsonb` on `storyboard_projects`.

**Image-gen prompt change:** prepend `"[${shotType}, ${cameraMovement}] at ${location}. ${action}. "` to the existing description sent to `generate-single-frame` / `generate-storyboard`. Backwards-safe — fields default to empty strings if missing.

**Credit estimator source:** reuse existing `useCredits` hook to read `CREDITS_PER_FRAME` (or hardcoded fallback if not exposed) — TBD on first read of the hook during implementation.

**Auto-save:** `useEffect` watching `selectedProject.shots`, debounced 800ms, calls `updateProject(id, { shots })`.

