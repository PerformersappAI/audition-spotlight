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

export async function parsePdfFile(_file: File): Promise<ParsedTableRead> {
  throw new Error(
    "PDF upload isn't supported here yet — please paste the script text or upload a .fountain, .txt, or .docx file."
  );
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
