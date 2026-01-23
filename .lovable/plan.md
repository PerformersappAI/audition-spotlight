

# Table Read Audiobook Generator

## Overview
A comprehensive tool that transforms screenplays into professional audiobook-style recordings. Filmmakers can upload their scripts (FDX, Fountain, or PDF), assign AI voices to characters, generate dialogue audio, edit with background music and sound effects, and export a polished MP3 suitable for distribution to investors, distributors, or platforms like YouTube/Spotify.

## Pricing Model
- **Flat fee per script**: $49-99 per full screenplay Table Read
- Integration with Stripe for one-time payments
- Create a dedicated Stripe product/price for Table Read generation

## Key Features
- Upload screenplays up to 250 pages (FDX, Fountain, PDF with OCR)
- Extract characters and dialogue automatically
- Assign from 25+ ElevenLabs voices per character
- Toggle between dialogue-only or full narration mode
- Basic timeline editor for music/SFX placement
- Export to MP3 (320kbps) with optional chapter markers

---

## Database Schema

### New Tables

**table_read_projects**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| title | text | Project title (from screenplay or user input) |
| screenplay_text | text | Raw screenplay content |
| parsed_data | jsonb | Parsed scenes, characters, dialogue |
| character_voices | jsonb | Map of character names to voice IDs |
| narration_mode | text | 'dialogue_only' or 'full_narration' |
| generation_status | text | 'draft', 'generating', 'completed', 'error' |
| generation_progress | integer | Percentage complete (0-100) |
| audio_segments | jsonb | Array of generated audio segment metadata |
| timeline_data | jsonb | Editor timeline: music tracks, SFX, positions |
| final_audio_url | text | URL to exported MP3 in storage |
| payment_id | text | Stripe payment ID if paid |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**table_read_payments**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key |
| project_id | uuid | Foreign key to table_read_projects |
| stripe_session_id | text | Checkout session ID |
| stripe_payment_intent | text | Payment intent ID |
| amount_cents | integer | Amount paid |
| status | text | 'pending', 'completed', 'failed' |
| created_at | timestamptz | |

---

## Architecture Components

### 1. Frontend Pages

**src/pages/TableRead.tsx** (Main Tool Page)
- Step-based wizard interface (similar to Funding Strategy)
- Steps: Upload Script > Assign Voices > Generate > Edit > Export

**src/pages/TableReadPayment.tsx**
- Payment success/cancel handling page

### 2. Frontend Components

**src/components/tableread/ScriptUploader.tsx**
- Drag-and-drop for .fdx, .fountain, .pdf files
- Uses existing `screenplayParser.ts` for FDX/Fountain
- Uses existing `useOCRUpload` hook for PDF processing
- Progress indicator for large files
- Preview of extracted characters

**src/components/tableread/VoiceAssignmentPanel.tsx**
- List all extracted characters with dialogue count
- Dropdown to select ElevenLabs voice per character
- "Play Sample" button to preview each voice
- Narrator voice selection for action/description
- Toggle: "Dialogue Only" vs "Full Narration"

**src/components/tableread/GenerationProgress.tsx**
- Scene-by-scene generation progress
- Current line being generated
- Estimated time remaining
- Pause/Resume capability
- Error recovery for failed segments

**src/components/tableread/AudioTimeline.tsx**
- Horizontal scrollable timeline
- Dialogue track (read-only, shows segments)
- Music track (add/remove background music)
- SFX track (add/remove sound effects)
- Volume sliders per track
- Playback head with play/pause
- Zoom in/out controls

**src/components/tableread/MusicLibrary.tsx**
- Preset music moods: Tense, Romantic, Action, Comedy, Horror, Drama
- Uses ElevenLabs Music Generation API or royalty-free library
- Preview and add to timeline

**src/components/tableread/SFXLibrary.tsx**
- Common sound effects categories: Doors, Weather, Ambient, Impacts
- Uses ElevenLabs Sound Effects API
- Search and filter functionality

**src/components/tableread/ExportPanel.tsx**
- MP3 quality selector (128kbps, 192kbps, 320kbps)
- Chapter markers toggle (one per scene)
- Download button
- Share link generation
- Metadata editor (title, author, description)

### 3. Edge Functions

**supabase/functions/table-read-tts/index.ts**
Core TTS generation function:
```text
Input: { characterName, voiceId, dialogueText, projectId, segmentIndex }
Output: { audioUrl, duration, segmentId }

- Calls ElevenLabs TTS API with voice settings
- Stores audio in Supabase Storage
- Updates project generation progress
- Handles request stitching for long dialogues
- Error handling for rate limits
```

**supabase/functions/table-read-batch-generate/index.ts**
Batch generation orchestrator:
```text
Input: { projectId }
Output: { status, totalSegments, completedSegments }

- Processes all dialogue lines in sequence
- Manages concurrent requests (max 3)
- Updates progress in database
- Implements retry logic
- Sends completion notification
```

**supabase/functions/table-read-sfx/index.ts**
Sound effects generation:
```text
Input: { prompt, duration }
Output: { audioUrl }

- Calls ElevenLabs Sound Effects API
- Stores in Supabase Storage
- Returns URL for timeline placement
```

**supabase/functions/table-read-music/index.ts**
Background music generation:
```text
Input: { mood, duration }
Output: { audioUrl }

- Calls ElevenLabs Music API
- Generates mood-appropriate background music
- Stores in Supabase Storage
```

**supabase/functions/table-read-export/index.ts**
Final audio mixdown:
```text
Input: { projectId, quality, includeChapters }
Output: { mp3Url, duration, fileSize }

- Fetches all audio segments
- Applies timeline mixing (dialogue + music + SFX)
- Encodes to MP3
- Adds ID3 tags and chapter markers
- Stores final file in Supabase Storage
```

**supabase/functions/create-table-read-payment/index.ts**
Stripe payment integration:
```text
Input: { projectId }
Output: { checkoutUrl }

- Creates Stripe Checkout session
- mode: "payment" (one-time)
- Links to project for verification
```

### 4. Storage Buckets

**table-read-audio** (Private)
- Generated dialogue segments
- Music/SFX files
- Final exported MP3s
- Organized by user_id/project_id/

---

## User Flow

```text
1. UPLOAD
   User uploads screenplay file
   ↓
   Parser extracts characters + dialogue
   ↓
   Preview: "Found 12 characters, 847 dialogue lines"

2. VOICES
   User assigns voices to each character
   ↓
   Narrator voice selection (if full narration)
   ↓
   Toggle narration mode

3. PAYMENT
   Show estimated generation time
   ↓
   "Generate Table Read - $XX"
   ↓
   Stripe Checkout
   ↓
   Return to generation

4. GENERATE
   Background batch processing
   ↓
   Real-time progress updates
   ↓
   Scene-by-scene completion

5. EDIT
   Timeline view of all audio
   ↓
   Add background music by scene
   ↓
   Add sound effects at specific points
   ↓
   Adjust volumes

6. EXPORT
   Select MP3 quality
   ↓
   Enable chapter markers
   ↓
   Download or get share link
```

---

## ElevenLabs Voice Library

### Pre-configured Voices (No user setup needed)

| Voice Name | Voice ID | Best For |
|------------|----------|----------|
| Roger | CwhRBWXzGAHq8TQ4Fs17 | Mature male lead |
| Sarah | EXAVITQu4vr4xnSDxMaL | Professional female |
| Laura | FGY2WhTYpPnrIDTdsKH5 | Young female |
| Charlie | IKne3meq5aSn9XLyUdCD | Casual male |
| George | JBFqnCBsd6RMkjVDRZzb | British male |
| Callum | N2lVS1w4EtoT3dr4eOWO | Scottish accent |
| River | SAz9YHcvj6GT2YYXdXww | Neutral narrator |
| Liam | TX3LPaxmHKxFdv7VOQHJ | Young male |
| Alice | Xb7hH8MSUJpSbSDYk0k2 | Warm female |
| Matilda | XrExE9yKIg1WjnnlVkGX | Expressive female |
| Will | bIHbv24MWmeRgasZH58o | Deep male |
| Jessica | cgSgspJ2msm6clMCkdW9 | Clear female |
| Eric | cjVigY5qzO86Huf0OWal | Confident male |
| Chris | iP95p4xoKVk53GoZ742B | Friendly male |
| Brian | nPczCjzI2devNBz1zQrb | Authoritative narrator |
| Daniel | onwK4e9ZLuTAKqWW03F9 | Versatile male |
| Lily | pFZP5JQG7iQjIQuC4Bku | Soft female |
| Bill | pqHfZKP75CvOlQylNhV4 | Narrative voice |

---

## Cost Structure

### ElevenLabs API Costs
- TTS: ~$0.30 per 1,000 characters (at Scale tier)
- Average screenplay: 150,000 characters ≈ $45
- Music generation: ~$0.05 per track
- SFX generation: ~$0.02 per effect

### Suggested Pricing
| Tier | Price | Includes |
|------|-------|----------|
| Standard | $49 | Dialogue only, 3 music tracks, 10 SFX |
| Full | $79 | Full narration, 10 music tracks, 30 SFX |
| Premium | $99 | Full narration, unlimited music/SFX, priority |

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/TableRead.tsx` | Create | Main tool page with wizard steps |
| `src/pages/TableReadPayment.tsx` | Create | Payment success/cancel handling |
| `src/components/tableread/ScriptUploader.tsx` | Create | File upload with parsing |
| `src/components/tableread/VoiceAssignmentPanel.tsx` | Create | Character-to-voice mapping |
| `src/components/tableread/GenerationProgress.tsx` | Create | Real-time progress display |
| `src/components/tableread/AudioTimeline.tsx` | Create | Timeline editor component |
| `src/components/tableread/MusicLibrary.tsx` | Create | Music selection panel |
| `src/components/tableread/SFXLibrary.tsx` | Create | Sound effects panel |
| `src/components/tableread/ExportPanel.tsx` | Create | Export options UI |
| `supabase/functions/table-read-tts/index.ts` | Create | Core TTS generation |
| `supabase/functions/table-read-batch-generate/index.ts` | Create | Batch orchestrator |
| `supabase/functions/table-read-sfx/index.ts` | Create | Sound effects API |
| `supabase/functions/table-read-music/index.ts` | Create | Music generation API |
| `supabase/functions/table-read-export/index.ts` | Create | MP3 mixdown |
| `supabase/functions/create-table-read-payment/index.ts` | Create | Stripe payment |
| `src/hooks/useTableRead.ts` | Create | State management hook |
| `src/App.tsx` | Modify | Add routes |
| `supabase/config.toml` | Modify | Register new functions |

---

## Implementation Phases

### Phase 1: Core Upload & Parsing (Week 1)
- Database schema migration
- ScriptUploader component
- Extend screenplay parser for large files
- Character extraction preview

### Phase 2: Voice Assignment & TTS (Week 2)
- VoiceAssignmentPanel component
- ElevenLabs connector setup
- table-read-tts edge function
- Single dialogue line generation

### Phase 3: Batch Generation (Week 3)
- table-read-batch-generate edge function
- GenerationProgress component
- Progress tracking in database
- Error handling and retry logic

### Phase 4: Audio Timeline Editor (Week 4)
- AudioTimeline component
- MusicLibrary and SFXLibrary
- table-read-music and table-read-sfx functions
- Drag-and-drop placement

### Phase 5: Export & Payment (Week 5)
- table-read-export function
- MP3 encoding with chapters
- Stripe payment integration
- ExportPanel component

### Phase 6: Polish & Testing (Week 6)
- End-to-end testing
- Performance optimization
- UI/UX refinements
- Documentation

---

## Technical Considerations

### Handling Large Scripts
- Process in chunks (scene-by-scene)
- Store progress to allow resume
- Background job pattern with polling

### Audio Storage
- Segment files: ~100-500KB each
- Full screenplay: ~100-300MB total
- Use Supabase Storage with proper cleanup policies

### Timeline Editor
- Consider using a library like `wavesurfer.js` for waveform display
- Or build simplified version with CSS-based timeline
- Store positions as percentages for responsive design

### Request Stitching
- For long dialogue lines (>5000 chars)
- Use ElevenLabs' `previous_text` and `next_text` for natural flow
- Critical for monologues

---

## Secrets Required

| Secret | Purpose |
|--------|---------|
| ELEVENLABS_API_KEY | TTS, Music, SFX generation |
| STRIPE_SECRET_KEY | Already configured |

**Note**: ElevenLabs connector is available in the workspace - will need to be linked to the project.

