// Parse uploaded scripts (.fountain, .txt, .pdf, .docx) or pasted text into
// a normalized list of dialogue lines for kokoro-js TTS.
import { parseFountain, parseFDX, type ParsedScreenplay } from "@/utils/screenplayParser";

export interface DialogueLine {
  character: string;
  text: string;
  sceneIndex: number;
}

export interface ParsedTableRead {
  title: string;
  characters: string[];
  lines: DialogueLine[];
}

const cleanText = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();

function screenplayToTableRead(parsed: ParsedScreenplay, fallbackTitle: string): ParsedTableRead {
  const lines: DialogueLine[] = [];
  parsed.scenes.forEach((scene, sceneIndex) => {
    scene.dialogue.forEach((d) => {
      const text = cleanText(d.text);
      if (text.length === 0) return;
      lines.push({
        character: d.character.trim(),
        text,
        sceneIndex,
      });
    });
  });
  const characters = Array.from(new Set(lines.map((l) => l.character)));
  return {
    title: parsed.title && parsed.title !== "Untitled Screenplay" ? parsed.title : fallbackTitle,
    characters,
    lines,
  };
}

export function parsePastedOrText(text: string, title = "Untitled Table Read"): ParsedTableRead {
  return screenplayToTableRead(parseFountain(text), title);
}

export function parseFDXText(xml: string, title = "Untitled Table Read"): ParsedTableRead {
  return screenplayToTableRead(parseFDX(xml), title);
}

export async function parseDocxFile(file: File): Promise<ParsedTableRead> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return parsePastedOrText(result.value, file.name.replace(/\.docx$/i, ""));
}

export async function parsePdfFile(file: File): Promise<ParsedTableRead> {
  // Use pdfjs-dist already in deps via other tools, fallback to FileReader text
  // Lightweight approach: read as text via pdfjs if available, else error gracefully.
  try {
    // pdfjs-dist may be installed transitively
    const pdfjs: any = await import(/* @vite-ignore */ "pdfjs-dist/build/pdf");
    const worker: any = await import(/* @vite-ignore */ "pdfjs-dist/build/pdf.worker.min?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // Group by Y position to preserve line breaks (basic)
      let lastY: number | null = null;
      let lineBuf = "";
      const out: string[] = [];
      for (const item of content.items as Array<{ str: string; transform: number[] }>) {
        const y = item.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 2) {
          out.push(lineBuf);
          lineBuf = item.str;
        } else {
          lineBuf += (lineBuf ? " " : "") + item.str;
        }
        lastY = y;
      }
      if (lineBuf) out.push(lineBuf);
      fullText += out.join("\n") + "\n\n";
    }
    return parsePastedOrText(fullText, file.name.replace(/\.pdf$/i, ""));
  } catch {
    throw new Error(
      "PDF parsing requires the pdfjs-dist library. Please paste the script text or upload a .fountain, .txt, or .docx file."
    );
  }
}

export async function parseAnyFile(file: File): Promise<ParsedTableRead> {
  const ext = file.name.toLowerCase().split(".").pop();
  const baseTitle = file.name.replace(/\.[^.]+$/, "");

  if (ext === "fdx") {
    const text = await file.text();
    return parseFDXText(text, baseTitle);
  }
  if (ext === "docx") return parseDocxFile(file);
  if (ext === "pdf") return parsePdfFile(file);

  // .fountain / .txt / unknown → treat as plain text
  const text = await file.text();
  return parsePastedOrText(text, baseTitle);
}
