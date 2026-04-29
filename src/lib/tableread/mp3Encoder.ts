// Encode 24kHz mono Float32 PCM → MP3 Blob using @breezystack/lamejs (pure JS).
import lamejs from "@breezystack/lamejs";

export function encodePcmToMp3(
  pcm: Float32Array,
  sampleRate = 24000,
  kbps = 96
): Blob {
  // Convert Float32 [-1,1] → Int16
  const samples = new Int16Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  const encoder = new lamejs.Mp3Encoder(1, sampleRate, kbps);
  const blockSize = 1152;
  const mp3Data: Uint8Array[] = [];

  for (let i = 0; i < samples.length; i += blockSize) {
    const chunk = samples.subarray(i, i + blockSize);
    const buf = encoder.encodeBuffer(chunk);
    if (buf.length > 0) mp3Data.push(buf);
  }
  const end = encoder.flush();
  if (end.length > 0) mp3Data.push(end);

  return new Blob(mp3Data, { type: "audio/mpeg" });
}

// Concatenate Float32Arrays separated by silence gaps (in seconds).
export function concatPcmWithGaps(
  segments: { pcm: Float32Array; gapAfterSec: number }[],
  sampleRate = 24000
): Float32Array {
  let total = 0;
  for (const s of segments) {
    total += s.pcm.length + Math.floor(s.gapAfterSec * sampleRate);
  }
  const out = new Float32Array(total);
  let offset = 0;
  for (const s of segments) {
    out.set(s.pcm, offset);
    offset += s.pcm.length;
    offset += Math.floor(s.gapAfterSec * sampleRate); // zeros = silence
  }
  return out;
}
