// Main-thread TTS client wrapping a single shared kokoro Web Worker.
// Used both for line-by-line audiobook generation and short voice previews.

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (v: { pcm: Float32Array; sampleRate: number }) => void; reject: (e: Error) => void }>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("../../workers/kokoroWorker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e: MessageEvent) => {
    const msg = e.data as
      | { type: "ready" }
      | { type: "chunk"; id: number; pcm: Float32Array; sampleRate: number }
      | { type: "error"; id?: number; error: string };
    if (msg.type === "chunk") {
      const p = pending.get(msg.id);
      if (p) { pending.delete(msg.id); p.resolve({ pcm: msg.pcm, sampleRate: msg.sampleRate }); }
    } else if (msg.type === "error" && msg.id != null) {
      const p = pending.get(msg.id);
      if (p) { pending.delete(msg.id); p.reject(new Error(msg.error)); }
    }
  };
  return worker;
}

export function initTTS(onProgress?: (msg: string) => void): Promise<void> {
  if (initPromise) return initPromise;
  const w = ensureWorker();
  onProgress?.("Loading voice model (one-time, ~80MB)…");
  initPromise = new Promise<void>((resolve, reject) => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (msg?.type === "ready") {
        w.removeEventListener("message", handler);
        resolve();
      } else if (msg?.type === "error" && msg.id == null) {
        w.removeEventListener("message", handler);
        reject(new Error(msg.error));
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({ type: "init" });
  });
  return initPromise;
}

export function generateLine(text: string, voice: string): Promise<{ pcm: Float32Array; sampleRate: number }> {
  const w = ensureWorker();
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ type: "generate", id, text, voice });
  });
}

export function terminateTTS() {
  worker?.terminate();
  worker = null;
  initPromise = null;
  pending.clear();
}

// Quick browser playback for voice previews (no MP3 encode).
export async function previewLine(text: string, voice: string): Promise<void> {
  await initTTS();
  const { pcm, sampleRate } = await generateLine(text, voice);
  const ctx = new AudioContext({ sampleRate });
  const buf = ctx.createBuffer(1, pcm.length, sampleRate);
  buf.copyToChannel(pcm as unknown as Float32Array, 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
  await new Promise<void>((r) => { src.onended = () => r(); });
  ctx.close();
}
