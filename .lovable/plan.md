# Table Read — Browser TTS Audiobook (kokoro-js)

Replace the current 5-step placeholder at `/table-read` with a fully working 4-step flow that uses **kokoro-js** in the browser (WASM, no API key) to generate a downloadable MP3 audiobook of a screenplay table read. Persist results in a new `table_reads` Supabase table.

## What gets built

### 1. Database (migration)
New table `public.table_reads`:
- `id` uuid pk default `gen_random_uuid()`
- `user_id` uuid not null (auth.uid())
- `title` text not null
- `audio_url` text (storage path in `table-reads` bucket)
- `character_count` int default 0
- `line_count` int default 0
- `is_public` boolean default false
- `created_at` timestamptz default now()

RLS:
- Owner: full CRUD on own rows
- Public read when `is_public = true` (for share links)

Storage: new public bucket `table-reads` for MP3 files, with insert/update/delete policies scoped to `auth.uid()` folder prefix.

### 2. Pages & components

Replace `src/pages/TableRead.tsx` with a 4-step wizard (keeps current pink/dark theme):

```
Upload → Cast → Generate → Player
```

New components in `src/components/tableread/`:
- `ScriptUploader.tsx` (already exists — extend to also accept `.txt`, `.docx`, and a "Paste text" textarea fallback)
- `CastVoiceAssigner.tsx` — one card per character with voice `<Select>`. Voice options:
  - American Female: `af_heart`, `af_bella`, `af_nicole`, `af_sarah`, `af_sky`
  - American Male: `am_adam`, `am_michael`, `am_fenrir`, `am_liam`
  - British Female: `bf_emma`, `bf_isabella`, `bf_alice`
  - British Male: `bm_george`, `bm_lewis`, `bm_daniel`
  - Auto-suggest based on character name heuristics; allow per-character preview ("Hello, I am NAME").
- `GenerationProgress.tsx` — progress bar showing "Line X of Y", current character, current dialogue snippet, cancel button.
- `AudioPlayer.tsx` — `<audio>` controls, Download MP3, Copy share link (only enabled when `is_public`), toggle public/private, save title.

### 3. TTS pipeline (`src/lib/tableread/tts.ts`)

- `bun add kokoro-js`
- Load model once via `KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "wasm" })` inside a Web Worker (`src/workers/kokoroWorker.ts`) so the UI stays responsive.
- For each dialogue line in script order:
  1. Worker calls `tts.generate(text, { voice })` → returns `RawAudio` (Float32 PCM @ 24kHz).
  2. Push PCM into an array on the main thread.
- After all lines: concatenate Float32Arrays with short silence gaps (~300ms) between lines and ~600ms between scenes.
- Encode the merged PCM to MP3 in-browser using `@breezystack/lamejs` (`bun add @breezystack/lamejs`) at 96 kbps mono. Result is a `Blob`.
- Upload the blob to Supabase storage (`table-reads/{user_id}/{id}.mp3`), insert a row in `table_reads`, then advance to Player.

### 4. Parsing extension

Extend `src/utils/screenplayParser.ts` to also support:
- `.txt` plain text (treat as Fountain — already does)
- `.docx` via `mammoth` (`bun add mammoth`) → extract raw text → run through Fountain parser
- `.pdf` already supported through existing `parse-document` edge function pattern; reuse for PDF uploads
- Pasted text: feed directly into `parseFountain`

The dialogue list passed to TTS = `parsed.scenes.flatMap(s => s.dialogue.map(d => ({ character: d.character, text: d.text })))`.

### 5. Navigation

Add **Table Read** link in `src/components/TopNavigation.tsx` (under the "About" or as a new top-level item) and ensure it appears in `ToolboxHome.tsx` (already linked there — keep).

## Technical details

- **Why Worker**: kokoro-js model is ~80MB and inference is CPU-heavy; running on main thread freezes UI.
- **Model caching**: Transformers.js (kokoro-js dependency) caches the model in IndexedDB after first load (~30s first time, instant after).
- **Memory**: For long scripts we stream chunks from worker to main thread and free intermediate buffers; never hold all RawAudio objects at once — convert each to Int16 PCM and append to a growing buffer.
- **MP3 encoder**: lamejs is pure JS, ~50KB, no WASM required. Mono 24kHz → 24kHz MP3 keeps file size small (~20KB/sec).
- **Cancel**: Worker terminates on user cancel; partial buffer discarded.
- **Share link**: `/table-read/shared/:id` (new sub-route) reads from `table_reads` where `is_public = true` and plays the audio.
- **No external AI APIs** — kokoro-js + lamejs only, all client-side.

## File summary

Created:
- `supabase/migrations/<ts>_table_reads.sql` (table + RLS + storage bucket + policies)
- `src/components/tableread/CastVoiceAssigner.tsx`
- `src/components/tableread/GenerationProgress.tsx`
- `src/components/tableread/AudioPlayer.tsx`
- `src/lib/tableread/tts.ts`
- `src/lib/tableread/mp3Encoder.ts`
- `src/workers/kokoroWorker.ts`
- `src/pages/TableReadShared.tsx` (public share view)

Edited:
- `src/pages/TableRead.tsx` (4-step wizard, wires everything)
- `src/components/tableread/ScriptUploader.tsx` (add paste, .txt, .docx, .pdf)
- `src/utils/screenplayParser.ts` (docx/pdf hooks)
- `src/App.tsx` (add `/table-read/shared/:id` route)
- `src/components/TopNavigation.tsx` (add Table Read link)
- `package.json` (kokoro-js, @breezystack/lamejs, mammoth)

## Out of scope

- Background music, sound effects, scene transitions audio
- Multi-language voices (kokoro supports more, sticking to your list)
- Re-generating individual lines after MP3 is built (would need re-encode)
