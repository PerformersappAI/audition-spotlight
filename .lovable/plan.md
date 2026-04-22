

## Model Bump: `gemini-2.5-flash` → `google/gemini-3-flash-preview`

### Scope
Update the three utility parsing edge functions from `google/gemini-2.5-flash` to `google/gemini-3-flash-preview`. Skip `analyze-video` (it uses the Gemini Files API directly, not Lovable Gateway—correct as-is).

### Files to Modify

**1. `supabase/functions/ai-parse-shot-prompt/index.ts`**
- Line 125: Change model from `'google/gemini-2.5-flash'` to `'google/gemini-3-flash-preview'`

**2. `supabase/functions/parse-document/index.ts`**
- Line 106: Change model from `'google/gemini-2.5-flash'` to `'google/gemini-3-flash-preview'`
- Line 178: Update `modelUsed` return value from `'google/gemini-2.5-flash'` to `'google/gemini-3-flash-preview'`

**3. `supabase/functions/parse-audition-notice/index.ts`**
- Line 101: Change model from `'google/gemini-2.5-flash'` to `'google/gemini-3-flash-preview'`

### Deployment
After editing, deploy the updated edge functions:
- `ai-parse-shot-prompt`
- `parse-document`
- `parse-audition-notice`

### Excluded (Intentionally Kept As-Is)
- `analyze-video` — Uses Gemini Files API directly for video processing. Cannot route through Lovable Gateway.

