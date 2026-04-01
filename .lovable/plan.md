

# App Sweep: Errors and Outdated Models

## Issues Found

### 1. Outdated/Deprecated Models (Critical)

Several edge functions use old model identifiers that should be updated:

| Function | Current Model | Issue | Recommended |
|----------|--------------|-------|-------------|
| `analyze-script` | `gpt-4o` via OpenAI direct | Deprecated model, bypasses Lovable AI gateway | `google/gemini-3-flash-preview` via gateway |
| `chat-with-analysis` | `gpt-4o-mini` via OpenAI direct | Deprecated model, bypasses Lovable AI gateway | `google/gemini-3-flash-preview` via gateway |
| `analyze-video` | `gemini-2.0-flash-exp` via Google direct | Expired experimental model, bypasses gateway | `google/gemini-2.5-flash` via Lovable AI gateway |
| `parse-document` | `gemini-2.0-flash-exp` / `gemini-1.5-*` via Google direct | Old models, bypasses gateway | `google/gemini-2.5-flash` via Lovable AI gateway |

### 2. Direct API Calls Instead of Lovable AI Gateway

Two functions call `api.openai.com` directly and two call `generativelanguage.googleapis.com` directly. All should route through `https://ai.gateway.lovable.dev/v1/chat/completions` using `LOVABLE_API_KEY`. This provides automatic key management, unified billing, and access to latest models.

### 3. Image Generation Model Updates

8 functions use `google/gemini-2.5-flash-image-preview`. The newer `google/gemini-3.1-flash-image-preview` and `google/gemini-3-pro-image-preview` are now available with better quality. Recommend upgrading image generation functions.

### 4. Text Model Updates

Functions using `google/gemini-2.5-flash` and `google/gemini-2.5-pro` can be upgraded to `google/gemini-3-flash-preview` and `google/gemini-3.1-pro-preview` respectively for improved results.

### 5. Unreachable Pages

Pages like `VideoEvaluation`, `ActorDashboard`, and `Social` exist in `src/pages/` but have no routes in `App.tsx`. These are either dead code or missing navigation.

---

## Plan

### Phase 1: Migrate Direct API Calls to Lovable AI Gateway (4 functions)

**`analyze-script/index.ts`**
- Remove `api.openai.com` call and `OPENAI_API_KEY` dependency
- Switch to Lovable AI gateway with `google/gemini-3-flash-preview`
- Keep existing prompt and JSON response format

**`chat-with-analysis/index.ts`**
- Remove `api.openai.com` call and `OPENAI_API_KEY` dependency
- Switch to Lovable AI gateway with `google/gemini-3-flash-preview`

**`analyze-video/index.ts`**
- This one is complex — it uses Gemini Files API for video upload which has no gateway equivalent
- Keep direct Gemini API for video upload/processing (requires Files API)
- Update model from `gemini-2.0-flash-exp` to `gemini-2.5-flash`

**`parse-document/index.ts`**
- Uses direct Gemini API with base64 inline data for PDFs
- Migrate to Lovable AI gateway with multimodal input
- Update model to `google/gemini-2.5-flash`

### Phase 2: Upgrade Text Models (5 functions)

Update these from older to current models:

| Function | From | To |
|----------|------|----|
| `analyze-shots` | `google/gemini-2.5-flash` | `google/gemini-3-flash-preview` |
| `analyze-style-reference` | `google/gemini-2.5-flash` | `google/gemini-3-flash-preview` |
| `contract-assistant` | `google/gemini-2.5-flash` | `google/gemini-3-flash-preview` |
| `generate-pitch-content` | `google/gemini-2.5-flash` | `google/gemini-3-flash-preview` |
| `parse-call-sheet` | `google/gemini-2.5-pro` | `google/gemini-3.1-pro-preview` |

### Phase 3: Upgrade Image Generation Models (8 functions)

Update all image generation functions from `google/gemini-2.5-flash-image-preview` to `google/gemini-3.1-flash-image-preview`:

- `generate-storyboard`
- `generate-storyboard-simple`
- `generate-single-frame`
- `generate-animatic`
- `generate-pitch-poster`
- `generate-character-portrait`
- `generate-scene-image`
- `inpaint-frame`

### Phase 4: Clean Up Dead Pages

Remove or add routes for orphaned pages: `VideoEvaluation.tsx`, `ActorDashboard.tsx`, `Social.tsx`.

---

## Technical Details

- All gateway migrations use the same endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`
- All use `LOVABLE_API_KEY` (already configured as a secret)
- `analyze-video` is the only function that must keep direct Gemini API access (video Files API has no gateway equivalent), but its model string should still be updated
- No database changes required
- No new secrets needed (can remove dependency on `OPENAI_API_KEY` and potentially `GEMINI_API_KEY` for most functions)

