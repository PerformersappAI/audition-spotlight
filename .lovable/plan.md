

## Generate PDF: App Audit & Action Items

I'll create a downloadable PDF report you can use as a checklist to work through everything we found in the app sweep.

### What the PDF will contain

**1. Cover page**
- Title: "Filmmaker Genius — App Audit Report"
- Date, project name, published URLs

**2. Executive summary**
- Overall health: Green (AI stack modern, site live)
- Open items: 3 minor model bumps, 1 DNS fix, 1 Supabase security setting

**3. AI / LLM inventory** (table)
- All 24 edge functions listed with: function name, current model, gateway vs direct, status (✅ current / ⚠️ bump recommended)
- Highlights `analyze-video` as intentionally direct (Files API requirement)
- Flags `ai-parse-shot-prompt`, `parse-audition-notice`, `parse-document` as one generation behind

**4. Third-party integrations** (table)
- Stripe (SDK 18.5.0, API 2025-08-27.basil) — ✅ current
- Resend (email) — ✅ current
- Murf AI (GEN2 TTS) — ✅ current
- Supabase (Lovable Cloud) — ✅ current
- Lovable AI Gateway — ✅ current

**5. Action items checklist** (with checkboxes)
- [ ] Bump 3 parser functions to `gemini-3-flash-preview`
- [ ] Add `www` A record in GoDaddy → `185.158.133.1`
- [ ] Add `www.filmmakergenius.com` in Lovable domain settings
- [ ] Enable leaked password protection in Supabase Auth
- [ ] (Optional) Decide whether to wire up or remove orphan pages: `VideoEvaluation`, `ActorDashboard`, `Social`

**6. Hosting & domain reference**
- Frontend: Lovable hosting (Cloudflare edge)
- Backend: Lovable Cloud / Supabase project `bwrzcaxpiyhnidwjpapt`
- Domain: GoDaddy → A record `185.158.133.1`, `_lovable` TXT verified
- Custom SMTP: Resend on `smtp.resend.com:465`

**7. Notes & disclaimers**
- Animatic Generator intentionally disabled (cost)
- All AI tools route through Lovable AI Gateway except `analyze-video`

### How I'll build it

- Python + ReportLab (Platypus) for clean tables and checkboxes
- US Letter, 1" margins, Helvetica
- Output: `/mnt/documents/filmmaker-genius-audit.pdf`
- Visual QA via `pdftoppm` → inspect each page → fix issues → re-verify
- Deliver via `<lov-artifact>` tag

No code changes to the app itself — this is a one-off document generation task.

