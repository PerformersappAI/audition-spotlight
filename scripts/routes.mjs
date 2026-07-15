import { robertsChapters } from "../src/data/robertsChapters.ts";
import { gleTiers } from "../src/data/gleTiers.ts";
import { gleNiche } from "../src/data/gleNiche.ts";
import { monetizationHubs } from "../src/data/monetizationHubs.ts";
import { monetizationSub } from "../src/data/monetizationSub.ts";
import { allCourses } from "../src/data/courses/index.ts";

const set = new Set();

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/pricing",
  "/membership",
  "/toolbox",
  "/recut",
  "/crew-hire",
  "/blog",
  "/privacy",
  "/terms",
  "/academy",
  "/academy/education",
  "/academy/roberts-filmmaking",
  "/green-light-engine",
  "/green-light-engine/niche",
];
staticRoutes.forEach((r) => set.add(r));

for (const key of Object.keys(robertsChapters)) set.add(`/academy/roberts-filmmaking/${key}`);
for (const key of Object.keys(gleTiers)) set.add(`/green-light-engine/${key}`);
for (const key of Object.keys(gleNiche)) set.add(`/green-light-engine/niche/${key}`);
for (const key of Object.keys(monetizationHubs)) set.add(`/academy/${key}`);
for (const key of Object.keys(monetizationSub)) {
  // keys are "group/slug"
  set.add(`/academy/${key}`);
}
for (const course of allCourses) {
  set.add(`/academy/${course.slug}`);
  if (Array.isArray(course.chapters)) {
    for (const ch of course.chapters) {
      if (ch?.slug) set.add(`/academy/${course.slug}/${ch.slug}`);
    }
  }
}

export const routes = [...set];
