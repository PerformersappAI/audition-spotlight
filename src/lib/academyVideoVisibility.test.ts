import { describe, expect, test } from "bun:test";
import { academyVideoPages, isAcademyVideoVisible } from "./academyVideoVisibility";

describe("Academy video visibility", () => {
  test("unavailable videos are hidden by default", () => {
    expect(academyVideoPages.size).toBe(0);
    expect(isAcademyVideoVisible("/academy/screenwriting")).toBe(false);
    expect(isAcademyVideoVisible("/academy/screenwriting/structure")).toBe(false);
    expect(isAcademyVideoVisible("/academy/roberts-filmmaking/chapter-1")).toBe(false);
  });

  test("restoring one lesson does not restore other lessons or its course", () => {
    const enabledPages = new Set(["/academy/screenwriting/structure"]);
    expect(isAcademyVideoVisible("/academy/screenwriting/structure", enabledPages)).toBe(true);
    expect(isAcademyVideoVisible("/academy/screenwriting/structure/", enabledPages)).toBe(true);
    expect(isAcademyVideoVisible("/academy/screenwriting/dialogue", enabledPages)).toBe(false);
    expect(isAcademyVideoVisible("/academy/screenwriting", enabledPages)).toBe(false);
    expect(isAcademyVideoVisible("/academy/roberts-filmmaking/chapter-1", enabledPages)).toBe(false);
  });
});