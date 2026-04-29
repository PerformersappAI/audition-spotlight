// Web Worker that runs kokoro-js TTS off the main thread.
// Receives { type: 'init' } to load the model, then { type: 'generate', id, text, voice }
// for each line. Posts back progress and Float32Array PCM (24kHz mono).

/// <reference lib="webworker" />
import { KokoroTTS } from "kokoro-js";

let ttsPromise: Promise<KokoroTTS> | null = null;

const getTTS = () => {
  if (!ttsPromise) {
    ttsPromise = KokoroTTS.from_pretrained(
      "onnx-community/Kokoro-82M-v1.0-ONNX",
      { dtype: "q8", device: "wasm" }
    );
  }
  return ttsPromise;
};

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data as
    | { type: "init" }
    | { type: "generate"; id: number; text: string; voice: string };

  try {
    if (msg.type === "init") {
      await getTTS();
      (self as unknown as Worker).postMessage({ type: "ready" });
      return;
    }

    if (msg.type === "generate") {
      const tts = await getTTS();
      const audio = await tts.generate(msg.text, { voice: msg.voice as never });
      // audio.audio is Float32Array, audio.sampling_rate is 24000
      const pcm = audio.audio as Float32Array;
      const sampleRate = (audio as unknown as { sampling_rate: number }).sampling_rate || 24000;
      // Transfer the PCM buffer to avoid copy
      (self as unknown as Worker).postMessage(
        { type: "chunk", id: msg.id, pcm, sampleRate },
        [pcm.buffer]
      );
    }
  } catch (err) {
    (self as unknown as Worker).postMessage({
      type: "error",
      id: (msg as { id?: number }).id,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export {};
