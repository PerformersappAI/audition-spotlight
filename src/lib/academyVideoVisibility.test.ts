import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  academyVideoPages,
  isAcademyVideoVisible,
} from "./academyVideoVisibility";

test("no Academy video slot is visible while the allowlist is empty", () => {
  assert.equal(academyVideoPages.size, 0);
  assert.equal(isAcademyVideoVisible("/academy/lesson-planning"), false);
  assert.equal(
    isAcademyVideoVisible("/academy/lesson-planning/scene-breakdown"),
    false,
  );
});

test("one page can be restored on its own", () => {
  const enabled = new Set(["/academy/lesson-planning/scene-breakdown"]);

  assert.equal(
    isAcademyVideoVisible("/academy/lesson-planning/scene-breakdown", enabled),
    true,
  );
  // Siblings and the course overview stay hidden.
  assert.equal(isAcademyVideoVisible("/academy/lesson-planning", enabled), false);
  assert.equal(
    isAcademyVideoVisible("/academy/lesson-planning/shot-list", enabled),
    false,
  );
});

test("a trailing slash does not change which page is visible", () => {
  const enabled = new Set(["/academy/lesson-planning"]);

  assert.equal(isAcademyVideoVisible("/academy/lesson-planning/", enabled), true);
  assert.equal(
    isAcademyVideoVisible("/academy/lesson-planning//", enabled),
    false,
  );
});
