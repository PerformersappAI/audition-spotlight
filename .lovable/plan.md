

## Storyboard Image Model — Current Status & Options

### What you have right now

All 5 storyboard-related edge functions use **`google/gemini-3.1-flash-image-preview`** (a.k.a. **Nano Banana 2**) via the Lovable AI Gateway:

- `generate-storyboard`
- `generate-storyboard-simple`
- `generate-single-frame`
- `generate-scene-image`
- `inpaint-frame`

This is **the latest and best** image model currently available through Lovable AI Gateway (as of today). It's Google's newest, supports multimodal reference images for character/style consistency (which your tool relies on per your memory), and handles inpainting.

### Your question: switch to ChatGPT's image model?

OpenAI's image model is **`gpt-image-1`** (the engine behind ChatGPT's image creation). Honest comparison for your use case:

| Factor | Nano Banana 2 (current) | gpt-image-1 |
|---|---|---|
| Quality | Excellent, photoreal + stylized | Excellent, slightly stronger at text-in-image |
| **Character consistency across frames** | **Strong** (multimodal reference input) | Weaker without fine-tuning |
| **Inpainting / frame editing** | Supported | Supported (mask-based) |
| Cost per image | ~$0.039 | ~$0.04–0.19 (tiered by quality) |
| Available in Lovable Gateway | ✅ Yes | ❌ No — would need direct OpenAI key |

**Verdict on switching to OpenAI**: Not recommended. You'd lose character consistency (the thing that makes a storyboard hang together), pay more, and have to manage a second API key. Nano Banana 2 is genuinely the right tool for storyboards.

### Your question: open-source / cheaper alternative?

Three real options ranked by realism for your stack:

1. **Stable Diffusion XL / SDXL Turbo via Replicate** — ~$0.003–0.01/image (5–10× cheaper). Open weights. Tradeoff: weaker character consistency, no native multimodal reference, would need ControlNet + IP-Adapter setup to come close to what you have today. Significant rebuild.

2. **FLUX.1 [schnell] via Replicate or fal.ai** — ~$0.003/image. Best open-source quality right now, near-Gemini realism. Same consistency limitation. Moderate rebuild.

3. **Self-host SDXL on your Hostinger VPS (187.77.199.100)** — Effectively $0/image after setup. Requires GPU VPS upgrade (Hostinger's cheapest GPU plan is ~$50–80/mo), Dockerized ComfyUI or Automatic1111, and you'd be the sysadmin. **Only worth it if you're generating 5,000+ images/month.**

### My recommendation (no code changes needed today)

**Stay on Nano Banana 2.** It's the latest, it's already wired up correctly, and switching would degrade the storyboard's signature feature (consistent characters across frames).

**Where to actually save money** (the real cost lever, per our earlier conversation):

- **Workflow optimization** — scene selector + shot list approval before any images render. That cuts 60–80% of wasted generations. Bigger savings than any model swap.
- **Bypass Lovable Gateway markup** — call Google Gemini directly with your own `GOOGLE_API_KEY` for the same Nano Banana 2 model. Saves ~20–30% per image. Requires reformatting the API calls (different request/response shape than the OpenAI-compatible gateway).

### What I propose as the next concrete step

Pick one:

- **Option A (recommended):** Build the **scene selector + shot list approval** workflow on top of the existing storyboard tool. Preserves all your current features (frame editing, manual control). Biggest cost cut.
- **Option B:** Migrate the 5 storyboard edge functions to **call Google Gemini directly** (bypass Lovable Gateway). Same model, ~25% cheaper per image. Requires rewriting request/response handling in each function.
- **Option C:** Do both — A first, then B.

No code changes will be made until you pick a direction.

