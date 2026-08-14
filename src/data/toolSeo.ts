export interface ToolSeoEntry {
  /** Rendered <title> — aim for 50-60 chars including the brand suffix. */
  title: string;
  /** Unique meta description, 140-160 chars, written from the page's real content. */
  description: string;
  /** Answer-first lead: 2-3 sentences that directly answer the page's core filmmaker question. */
  lead: string;
}

/**
 * Per-route SEO copy for the tool and landing pages.
 * Keyed by pathname. Titles and descriptions here must stay unique.
 */
export const toolSeo: Record<string, ToolSeoEntry> = {
  "/toolbox": {
    title: "Indie Film Production Tools | Filmmaker Genius",
    description:
      "Every indie film tool in one place: script analysis, storyboards, shot lists, call sheets, pitch decks, funding briefs and distribution prep, grouped by phase.",
    lead:
      "Every indie film needs the same handful of documents: a script breakdown, a shot list, a call sheet, a pitch deck, a funding brief and a deliverables checklist. The Toolbox generates all of them from your own script and project details, so you skip the blank page. Pick the phase you are in below — pre-production, production, post, release or distribution — and open the tool that matches today's problem.",
  },
  "/launch": {
    title: "Film Marketing & Distribution Launch | Filmmaker Genius",
    description:
      "Launch your finished film: build a marketing campaign in a box, then match the film to the streaming, festival and AVOD homes most likely to license it.",
    lead:
      "Launching an indie film comes down to two decisions: how you market it and where it lives. Start with Marketing in a Box to build the trailer beats, poster, synopsis and social kit buyers and audiences expect, then run the Green Light Engine to shortlist the platforms that actually license films at your budget and genre. Do both before you submit anywhere — a film with a package outperforms a film with only a link.",
  },
  "/movie-in-a-box": {
    title: "Story Structure Templates for Screenwriters | Filmmaker Genius",
    description:
      "Pick a proven story structure — three-act, Save the Cat, Hero's Journey, sequence method — and build your film beat by beat with prompts for every beat.",
    lead:
      "The fastest way to outline a film is to start from a structure that already works, then fill in its beats with your story. Choose a template below — three-act, Save the Cat, the Hero's Journey or the sequence method — and Movie in a Box walks you beat by beat, explaining what each beat has to accomplish before you write it. You end with an outline you can take straight into a first draft.",
  },
  "/green-light-engine": {
    title: "Where to Distribute Your Indie Film | Filmmaker Genius",
    description:
      "Match your indie film to the right home: Tier 1 streamers, curated platforms, low-barrier AVOD and FAST channels, and identity-driven niche services.",
    lead:
      "There is no single streaming buyer for an indie film — there are tiers, and your budget, cast and genre decide which tier will even read your email. The Green Light Engine sorts platforms into Tier 1 majors, curated mid-tier services, low-barrier AVOD/FAST channels and niche identity-driven audiences, with the realistic terms and expectations for each. Start at the tier that matches your film, not the one that matches your ambition.",
  },
  "/recut": {
    title: "Turn Your Film Into Vertical Shorts | Filmmaker Genius",
    description:
      "Recut reframes your finished feature or short into native 9:16 vertical episodes, so a film that already played can find a second, mobile-first audience.",
    lead:
      "A finished film that has already toured festivals can earn a second audience as vertical shorts. Recut takes your existing cut, reframes it to native 9:16 and breaks it into short episodic chapters with hooks in the first three seconds. You approve every cut before publishing, so the vertical version still looks like your film.",
  },
  "/crew-hire": {
    title: "Hire Film Crew & Find Paid Crew Work | Filmmaker Genius",
    description:
      "Post a paid crew call or find work on indie productions — camera, sound, grip, electric, art, and production roles, with rates and dates stated up front.",
    lead:
      "Hiring crew for an indie shoot works best when the post states role, dates, rate and location up front — vague calls get vague applicants. Post a crew call here and it goes out to camera, sound, grip, electric, art and production people looking for paid indie work. If you are crew, browse open calls and apply directly to the production.",
  },
  "/marketing": {
    title: "Film Marketing in a Box: Trailer, Poster, Kit | Filmmaker Genius",
    description:
      "Build the marketing package every indie film needs: trailer beats, poster and key art, one-line and long synopsis, press notes, and a social launch kit.",
    lead:
      "Marketing an indie film means assembling one package and reusing it everywhere: a trailer cut to three beats, key art that reads at thumbnail size, a one-line and a paragraph synopsis, press notes with your bio and credits, and a social kit of stills and clips. Build that package before your first festival submission or platform pitch, because programmers and buyers judge the package first. Everything below produces those assets from your film's own material.",
  },
  "/script-analysis": {
    title: "AI Script Analysis & Coverage Report | Filmmaker Genius",
    description:
      "Upload a screenplay and get structural coverage: act breaks, character arcs, emotional beats, pacing problems, and notes in a named director's style.",
    lead:
      "Script coverage answers one question: does the story work on the page before you spend money shooting it. Paste or upload your screenplay and this tool maps act breaks, character arcs, emotional beats and pacing dips, then flags the scenes that stall. You can also request the notes in the sensibility of a specific director to pressure-test tone.",
  },
  "/scene-analysis": {
    title: "Scene Breakdown & Shot List Generator | Filmmaker Genius",
    description:
      "Paste one scene and get a working shot list: coverage plan, camera angles, character beats, and per-shot durations you can hand to your crew on the day.",
    lead:
      "A shot list is built scene by scene: read the scene for its dramatic turn, decide the coverage that reveals that turn, then order the shots for the day. Paste a single scene here and you get a numbered shot list with angles, characters in frame, key visual elements and estimated durations. Edit any shot, then export the list as a PDF your AD and DP can shoot from.",
  },
  "/storyboarding": {
    title: "AI Storyboard Generator for Filmmakers | Filmmaker Genius",
    description:
      "Turn a scene into a storyboard: automatic shot breakdown, consistent character and style references, frame-by-frame images, and PDF or animatic export.",
    lead:
      "Storyboarding starts with a shot breakdown, not with drawing — decide the shots, then visualize them. This tool splits your scene into shots, holds your characters and art style consistent across every frame, and generates each panel so the boards read as one film. Export the finished boards as a PDF or play them back as a timed animatic.",
  },
  "/call-sheet": {
    title: "How to Make a Film Call Sheet | Filmmaker Genius",
    description:
      "A call sheet lists date, crew call, shooting call, scenes, cast times, locations, weather and hospital. Build one here, or upload last one to auto-fill.",
    lead:
      "A call sheet is the one-page contract for a shoot day: production and date, general crew call and shooting call, the scenes and pages to be shot, per-person cast and crew times, locations with parking, meal breaks, weather, and the nearest hospital. Fill in the fields below and export a professional PDF, or upload an existing call sheet and let the parser pre-fill it for you. Send it the night before, and put the day's advance schedule at the bottom.",
  },
  "/pitch-deck": {
    title: "How to Make a Film Pitch Deck | Filmmaker Genius",
    description:
      "A film pitch deck needs logline, synopsis, tone, characters, visual style, comparables, market and team. Build all eight sections and export a PDF deck.",
    lead:
      "A film pitch deck is eight things in order: title and logline, synopsis, director's vision and tone, key characters, visual style, comparable titles with their results, the market and audience, and the team. This builder walks each section, drafts the copy from your logline, and generates poster and mood imagery so the deck looks financed before it is. Export as a PDF you can attach to an investor or sales agent email.",
  },
  "/contract-assistant": {
    title: "SAG-AFTRA Low Budget Agreement Guide | Filmmaker Genius",
    description:
      "Find which SAG-AFTRA agreement fits your film — Short Project, Ultra Low, Modified Low, Low Budget — with rate tiers, thresholds and paperwork explained.",
    lead:
      "SAG-AFTRA sorts indie films into budget tiers, and your budget and runtime decide which agreement you can sign: Short Project, Student, Ultra Low Budget, Modified Low Budget or Low Budget, each with its own day rate, cast requirements and paperwork. Enter your budget, runtime, cast size and locations and this assistant explains the tier you fall into and what signing it obliges you to do. It is educational guidance only — confirm terms with SAG-AFTRA and a production attorney before you sign.",
  },
  "/funding-strategy": {
    title: "How to Fund a Short or Indie Film | Filmmaker Genius",
    description:
      "Build a funding plan from real sources: equity, grants, tax incentives, crowdfunding, brand tie-ins and pre-sales — then export an investor-ready brief.",
    lead:
      "Indie films are almost never funded from one source: a realistic plan stacks equity from private investors, soft money from grants and regional tax incentives, crowdfunding, in-kind support and, where possible, pre-sales. Answer the questions below about budget, genre, territory and attachments and this tool assembles the stack that fits your project, with the ask and use-of-funds spelled out. Export it as a funding brief you can send to investors or attach to a grant application.",
  },
  "/distribution-readiness": {
    title: "Film Deliverables & Distribution Checklist | Filmmaker Genius",
    description:
      "Check whether your film is deliverable-ready: masters, closed captions, M&E stems, E&O insurance, chain of title, artwork and platform-specific specs.",
    lead:
      "A distributor cannot release a film without its deliverables: a spec-compliant master, closed captions and subtitles, M&E and stems, chain of title, E&O insurance, artwork and metadata. This ten-step assessment walks each requirement, scores your readiness and hard-stops on the items that will block a release outright. Export the report as a PDF checklist for your post supervisor and sales agent.",
  },
  "/table-read": {
    title: "AI Table Read for Your Screenplay | Filmmaker Genius",
    description:
      "Hear your script performed: upload a screenplay, cast a distinct voice per character, and generate a scene-by-scene table read you can share as audio.",
    lead:
      "A table read exists to catch what silent reading hides — unsayable lines, scenes that run long, characters who all sound the same. Upload your screenplay, assign a distinct voice to each character, and this tool performs the script scene by scene as sharable audio. Listen for the places you skip ahead; those are the cuts.",
  },
};

export const toolSeoPaths = Object.keys(toolSeo);
