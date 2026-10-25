import { expect, test } from "bun:test";

import {
  academyVideoPages,
  isAcademyVideoVisible,
} from "./academyVideoVisibility";

test("no Academy video slot is visible while the allowlist is empty", () => {
  expect(academyVideoPages.size).toBe(0);
  expect(isAcademyVideoVisible("/academy/lesson-planning")).toBe(false);
  expect(
    isAcademyVideoVisible("/academy/lesson-planning/scene-breakdown"),
  ).toBe(false);
});

test("one page can be restored on its own", () => {
  const enabled = new Set(["/academy/lesson-planning/scene-breakdown"]);

  expect(
    isAcademyVideoVisible("/academy/lesson-planning/scene-breakdown", enabled),
  ).toBe(true);
  // Siblings and the course overview stay hidden.
  expect(isAcademyVideoVisible("/academy/lesson-planning", enabled)).toBe(false);
  expect(
    isAcademyVideoVisible("/academy/lesson-planning/shot-list", enabled),
  ).toBe(false);
});

test("a trailing slash does not change which page is visible", () => {
  const enabled = new Set(["/academy/lesson-planning"]);

  expect(isAcademyVideoVisible("/academy/lesson-planning/", enabled)).toBe(true);
  expect(isAcademyVideoVisible("/academy/lesson-planning//", enabled)).toBe(false);
});
