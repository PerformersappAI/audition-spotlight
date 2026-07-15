import type { Course } from "../courseTypes";

// Per-course dynamic imports. Vite statically analyzes this map and emits
// one chunk per course, so a visitor reading a single chapter downloads
// only that ONE course's body content — not all 62.
//
// Do NOT statically import course modules from this file, and do NOT import
// "@/data/courses" (the eager registry) from any client-reachable module.
// The eager registry is only for SSR / build tooling (routes-manifest,
// scripts/routes.mjs, scripts/generate-llms.mjs).
const loaders: Record<string, () => Promise<Course>> = {
  "adapting-source-material": () => import("./adaptingSource").then((m) => m.adaptingSource),
  "ai-in-post-production": () => import("./aiPost").then((m) => m.aiPost),
  "ai-script-writing": () => import("./aiScript").then((m) => m.aiScript),
  "ai-tools-for-filmmakers": () => import("./aiTools").then((m) => m.aiTools),
  "brand-partnerships-for-films": () => import("./brandPartnerships").then((m) => m.brandPartnerships),
  "camera-and-lighting-basics": () => import("./cameraLighting").then((m) => m.cameraLighting),
  "casting-for-indie-films": () => import("./casting").then((m) => m.casting),
  "color-grading-for-film": () => import("./colorGrading").then((m) => m.colorGrading),
  "copyright-for-filmmakers": () => import("./copyrightIP").then((m) => m.copyrightIP),
  "costume-design-for-film": () => import("./wardrobe").then((m) => m.wardrobe),
  "directing-actors": () => import("./directingActors").then((m) => m.directingActors),
  "directing-non-actors": () => import("./nonActors").then((m) => m.nonActors),
  "diy-film-distribution": () => import("./diyDistribution").then((m) => m.diyDistribution),
  "documentary-script-writing": () => import("./docWriting").then((m) => m.docWriting),
  "drone-cinematography": () => import("./droneCinematography").then((m) => m.droneCinematography),
  "film-budgeting-and-scheduling": () => import("./budgetingScheduling").then((m) => m.budgetingScheduling),
  "film-business-plan": () => import("./businessPlan").then((m) => m.businessPlan),
  "film-crowdfunding": () => import("./crowdfunding").then((m) => m.crowdfunding),
  "film-distribution-contracts": () => import("./distributionContracts").then((m) => m.distributionContracts),
  "film-editing-workflow": () => import("./editingWorkflow").then((m) => m.editingWorkflow),
  "film-festival-strategy": () => import("./festivalStrategy").then((m) => m.festivalStrategy),
  "film-location-scouting": () => import("./locationScouting").then((m) => m.locationScouting),
  "film-markets-explained": () => import("./filmMarkets").then((m) => m.filmMarkets),
  "film-permits-and-releases": () => import("./permitsReleases").then((m) => m.permitsReleases),
  "film-production-accounting": () => import("./filmAccounting").then((m) => m.filmAccounting),
  "film-production-insurance": () => import("./insuranceLegal").then((m) => m.insuranceLegal),
  "film-script-breakdown": () => import("./scriptBreakdown").then((m) => m.scriptBreakdown),
  "film-set-safety": () => import("./onSetSafety").then((m) => m.onSetSafety),
  "grants-for-filmmakers": () => import("./grants").then((m) => m.grants),
  "hiring-department-heads": () => import("./departmentHeads").then((m) => m.departmentHeads),
  "how-to-build-an-epk": () => import("./epk").then((m) => m.epk),
  "how-to-film-action-scenes": () => import("./stuntCoordination").then((m) => m.stuntCoordination),
  "how-to-find-investors-for-a-film": () => import("./pitchingInvestors").then((m) => m.pitchingInvestors),
  "how-to-make-a-dcp": () => import("./dcpDelivery").then((m) => m.dcpDelivery),
  "how-to-make-a-film-trailer": () => import("./filmTrailer").then((m) => m.filmTrailer),
  "how-to-make-a-film-website": () => import("./filmWebsite").then((m) => m.filmWebsite),
  "how-to-pitch-to-streamers": () => import("./pitchingStreamers").then((m) => m.pitchingStreamers),
  "how-to-produce-a-documentary": () => import("./producingDoc").then((m) => m.producingDoc),
  "how-to-produce-a-short-film": () => import("./producingShort").then((m) => m.producingShort),
  "how-to-rewrite-a-screenplay": () => import("./rewrite").then((m) => m.rewrite),
  "how-to-start-a-production-company": () => import("./productionCompany").then((m) => m.productionCompany),
  "how-to-storyboard-a-film": () => import("./storyboarding").then((m) => m.storyboarding),
  "how-to-write-a-logline": () => import("./loglinePitch").then((m) => m.loglinePitch),
  "how-to-write-a-screenplay": () => import("./screenplay101").then((m) => m.screenplay101),
  "how-to-write-a-short-film-script": () => import("./shortFilm").then((m) => m.shortFilm),
  "indie-filmmaking-career": () => import("./indieCareer").then((m) => m.indieCareer),
  "international-film-sales": () => import("./internationalSales").then((m) => m.internationalSales),
  "music-licensing-for-films": () => import("./musicLicensing").then((m) => m.musicLicensing),
  "production-design-on-a-budget": () => import("./productionDesign").then((m) => m.productionDesign),
  "production-sound-recording": () => import("./soundRecording").then((m) => m.soundRecording),
  "sag-aftra-for-filmmakers": () => import("./sagAftra").then((m) => m.sagAftra),
  "screenplay-act-structure": () => import("./storyStructure").then((m) => m.storyStructure),
  "shot-list-filmmaking": () => import("./shotList").then((m) => m.shotList),
  "smartphone-filmmaking": () => import("./iphoneFilmmaking").then((m) => m.iphoneFilmmaking),
  "social-media-marketing-for-films": () => import("./socialMarketing").then((m) => m.socialMarketing),
  "sound-design-for-film": () => import("./soundDesign").then((m) => m.soundDesign),
  "streaming-revenue-models": () => import("./vodModels").then((m) => m.vodModels),
  "vfx-on-a-budget": () => import("./vfx").then((m) => m.vfx),
  "virtual-production": () => import("./virtualProduction").then((m) => m.virtualProduction),
  "what-does-a-film-producer-do": () => import("./producing101").then((m) => m.producing101),
  "working-with-a-film-composer": () => import("./composer").then((m) => m.composer),
  "working-with-child-actors": () => import("./childActors").then((m) => m.childActors),
};

const cache: Record<string, Course> = {};

/** Sync accessor — returns the course if it's already been loaded, else undefined. */
export function getCourse(slug: string): Course | undefined {
  return cache[slug];
}

/**
 * Load a course by slug and populate the cache. Idempotent.
 * Called by the SSR entry (before renderToString) and by the client entry
 * (before hydration/render) so the CourseChapter / CoursePage components
 * always have their data synchronously available on first render.
 */
export async function loadCourse(slug: string): Promise<Course | undefined> {
  if (cache[slug]) return cache[slug];
  const load = loaders[slug];
  if (!load) return undefined;
  const c = await load();
  cache[slug] = c;
  return c;
}

/** Slug list — useful for build tooling that wants to enumerate without loading. */
export const courseSlugs = Object.keys(loaders);
