export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 1600;
const QUALITY = 0.82;

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];

const extLooksHeic = (name: string) => /\.(heic|heif)$/i.test(name);

export class ImageError extends Error {}

/** Validate + downscale to max 1600px on the long edge, re-encoded as JPEG q0.82. */
export const prepareImage = async (file: File): Promise<Blob> => {
  const type = (file.type || "").toLowerCase();
  const isImage = ALLOWED.includes(type) || (!type && extLooksHeic(file.name));
  if (!isImage) {
    throw new ImageError("That file isn't a supported image. Please use a JPG, PNG or WEBP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageError("That image is larger than 15 MB. Please use a smaller photo.");
  }

  let bitmapWidth = 0;
  let bitmapHeight = 0;
  let source: ImageBitmap | HTMLImageElement;

  try {
    if (typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(file);
      source = bmp;
      bitmapWidth = bmp.width;
      bitmapHeight = bmp.height;
    } else {
      const url = URL.createObjectURL(file);
      try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = () => reject(new Error("decode failed"));
          el.src = url;
        });
        source = img;
        bitmapWidth = img.naturalWidth;
        bitmapHeight = img.naturalHeight;
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  } catch {
    if (type.includes("heic") || type.includes("heif") || extLooksHeic(file.name)) {
      throw new ImageError("This phone photo (HEIC) can't be read by your browser. Please save it as a JPG or PNG and try again.");
    }
    throw new ImageError("That image couldn't be opened. Please try a different file.");
  }

  if (!bitmapWidth || !bitmapHeight) {
    throw new ImageError("That image couldn't be read. Please try a different file.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmapWidth, bitmapHeight));
  const w = Math.max(1, Math.round(bitmapWidth * scale));
  const h = Math.max(1, Math.round(bitmapHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("Your browser couldn't process that image.");
  ctx.drawImage(source as CanvasImageSource, 0, 0, w, h);
  if ("close" in source && typeof (source as ImageBitmap).close === "function") (source as ImageBitmap).close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (!blob) throw new ImageError("Your browser couldn't process that image.");
  return blob;
};
