import type { Course } from "../courseTypes";

export const scriptBreakdown: Course = {
  slug: "film-script-breakdown",
  title: "Script Breakdown Fundamentals",
  categoryLabel: "Pre-Production",
  subtitle: "Before a film can be scheduled, budgeted, or shot, someone has to take the script apart — scene by scene, element by element. The breakdown is where a screenplay becomes a plan for production. Learn to read a script like an assistant director. Taught from the set by a working filmmaker.",
  level: "Intermediate",
  chapterCount: "12 Chapters",
  readTime: "~105 min read",
  pairsWithName: "Scene Analysis",
  pairsWithUrl: "https://filmmakergenius.com/scene-analysis",
  pairsWithDesc: "The Scene Analysis tool reads your script scene by scene and surfaces the elements in each one — cast, props, locations, and more — giving you a head start on a full breakdown instead of marking every page by hand.",
  seoTitle: "How to Break Down a Script: Free Script Breakdown Course | Filmmaker Genius",
  seoDesc: "A free, chapter-by-chapter course on script breakdown — locking a script, measuring scenes in eighths, color codes, breakdown sheets, elements, the production board, scheduling, and day out of days.",
  learn: [
    "How to lock a script and measure every scene in eighths of a page",
    "The standard color codes and how to mark up a script for every element",
    "How to fill out breakdown sheets for cast, extras, props, wardrobe, and more",
    "How the breakdown drives the production board, the schedule, and day out of days",
  ],
  mosaic: [
    "INT. FILM SET<br>- DAY<br><br>Crew settles.",
    "ROLL SOUND",
    "SCENE 42",
    "CUT TO:<br><br>EXT. BACKLOT<br>- NIGHT",
    "Take 1 of 3",
    "ACTION.",
  ],
  modules: [
    { key: "foundations", label: "Module 1 — Foundations" },
    { key: "core", label: "Module 2 — Core Craft" },
    { key: "apply", label: "Module 3 — Scheduling & Delivery" },
  ],
  chapters: [
    {
      slug: "what-is-a-script-breakdown",
      num: 1,
      roman: "I",
      title: "What Is a Script Breakdown?",
      desc: "How a script becomes a plan for production",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `A screenplay tells a story. A breakdown turns that story into a to-do list for an entire film crew. It's the hinge between writing and producing — and it's where a movie actually becomes makeable.`,
      seoTitle: "What Is a Script Breakdown? (And Why It Matters) | Filmmaker Genius",
      seoDesc: "What is a script breakdown — how a locked screenplay is taken apart scene by scene into production elements, why it's the foundation of scheduling and budgeting, and who does it. Chapter 1 of Script Breakdown Fundamentals.",
      body: `
    <p>Everything you've learned about writing a screenplay produces one thing: a story on paper. But you can't shoot a story — you shoot <em>scenes,</em> with actors, props, locations, cameras, and a hundred moving parts that all have to be organized, scheduled, and paid for. The bridge between the finished script and the working film set is the <strong>script breakdown</strong>: the process of going through the screenplay scene by scene and identifying every physical and logistical element needed to shoot it. It's the first real act of production, and it's the foundation everything else is built on.</p>

    <h2>What a breakdown actually is</h2>

    <p>A script breakdown is a systematic <em>disassembly</em> of the screenplay into its production components. You read each scene not as a reader or a critic, but as a planner asking: <em>what do we need to make this?</em> Every answer gets recorded. A single scene might break down into:</p>

    <ul class="spec-list">
      <li><b>Cast</b> — which speaking characters appear.</li>
      <li><b>Background / extras</b> — the crowd, the diners, the pedestrians.</li>
      <li><b>Props</b> — the gun, the letter, the birthday cake.</li>
      <li><b>Wardrobe, makeup, hair</b> — the bloodstained shirt, the wedding dress.</li>
      <li><b>Vehicles, animals, stunts, special effects</b> — anything that needs special arranging.</li>
      <li><b>Location, time of day, and length</b> — where, when, and how much screen time.</li>
    </ul>

    <p>Do that for every scene in the script, and you've transformed a 100-page story into a complete, organized inventory of everything the production must gather, schedule, and budget. That inventory is the breakdown.</p>

    <div class="pullquote">A screenplay is written to be read. A breakdown is written to be <em>built.</em> One is the story; the other is the blueprint for making it real.</div>

    <h2>Why it's the foundation of production</h2>

    <p>The breakdown isn't busywork — it's the source document that everything downstream depends on. Nothing in production can be planned properly without it:</p>

    <ul class="spec-list">
      <li><b>The schedule</b> is built from the breakdown — you can't decide what to shoot when until you know what each scene requires.</li>
      <li><b>The budget</b> flows from the breakdown — every element is a potential cost, and you can't price a film you haven't itemized.</li>
      <li><b>Every department</b> works from it — props, wardrobe, locations, and casting all pull their to-do lists from the breakdown.</li>
      <li><b>Nothing gets forgotten</b> — the discipline of the breakdown is what stops you from arriving on set without the one prop the whole scene depends on.</li>
    </ul>

    <p>Get the breakdown right and production runs on rails. Get it wrong — miss elements, misjudge scene lengths — and the errors cascade into an impossible schedule and a blown budget. This is why the breakdown is one of the most respected skills in production.</p>

    <h2>Who does it</h2>

    <p>On a professional film, the <strong>first assistant director (1st AD)</strong> and often a dedicated production manager or line producer own the breakdown — it's the AD's signature craft. On smaller and independent productions, the director, producer, or a producer-director hyphenate does it themselves. Either way, learning to break down a script teaches you to see a screenplay the way the whole crew does: not as a story, but as a plan. Even as a writer or director, understanding the breakdown makes you dramatically better at knowing what your script will actually cost and take to shoot.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first time I broke down my own script, it changed how I <em>wrote.</em> Suddenly I could see that the "quick little scene" on page 40 needed a vintage car, three extras, a rainstorm, and a night shoot — half a day and a chunk of budget for eight seconds of screen time. The breakdown is where fantasy meets reality. Every filmmaker should learn it, because it's the skill that tells you the difference between the movie you imagined and the movie you can actually afford to make.</p>
    </div>

    <p>Before you can break a script down, though, it has to hold still — page numbers and scene numbers have to be fixed so everyone's referring to the same thing. That's called locking the script, and it's the first practical step. It's next.</p>
`,
      takeaways: [
        "A script breakdown disassembles the screenplay scene by scene into every element needed to shoot it.",
        "Each scene yields cast, extras, props, wardrobe, vehicles, effects, location, time, and length.",
        "The breakdown is the foundation of the schedule and budget, and every department works from it.",
        "The 1st AD or producer usually owns it — learning it teaches you to see a script the way the whole crew does.",
      ],
    },
    {
      slug: "how-to-lock-a-script",
      num: 2,
      roman: "II",
      title: "Locking the Script",
      desc: "Locking pages and scene numbers before you break down",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Once a whole crew starts working from a script, the pages can't shift under their feet. Locking the script freezes the numbering so everyone — from the AD to the caterer — is on the exact same page.`,
      seoTitle: "How to Lock a Script: Locked Pages & Scene Numbers | Filmmaker Genius",
      seoDesc: "How to lock a script for production — what a locked script means, locked page and scene numbers, A-pages and revision colors, and why locking has to happen before you break down. Chapter 2 of Script Breakdown Fundamentals.",
      body: `
    <p>Imagine you've broken down the whole script, built a schedule, and told fifty crew members that the big fight is "Scene 42 on page 55." Then the writer adds a paragraph to page 10 — and now every page number after it shifts, and "Scene 42" isn't on page 55 anymore. Chaos. Call sheets are wrong, the schedule is wrong, everyone's confused. That's the problem <strong>locking the script</strong> solves. Before you break anything down, you freeze the script's numbering so it stays stable no matter what changes later. It's an unglamorous but absolutely essential step.</p>

    <h2>What "locking" means</h2>

    <p>A <strong>locked script</strong> is a version that's been declared the official production draft, with its page numbers and scene numbers <em>fixed permanently.</em> From the moment of lock, those numbers never change again, even when the script is revised. Locking does two things:</p>

    <ul class="spec-list">
      <li><b>Locks the scene numbers.</b> Every scene gets a permanent number (Scene 1, Scene 2, Scene 3…). Once locked, Scene 42 is always Scene 42, forever. This is what the breakdown, schedule, and call sheets all reference.</li>
      <li><b>Locks the page numbers.</b> Page 55 stays page 55. Everyone flipping to a page sees the same content, so references never drift.</li>
    </ul>

    <p>Locking usually happens once the script is finished enough to go into prep — after the creative rewrites are essentially done. It's the formal handoff from "we're still writing this" to "we're making this."</p>

    <div class="pullquote">Before lock, the script belongs to the writer. After lock, it belongs to the production — and its numbers become a shared language nobody is allowed to change.</div>

    <h2>Handling changes after the lock: A-pages and revisions</h2>

    <p>But scripts <em>do</em> keep changing during production — lines get cut, scenes get added. If the numbers are frozen, how do you insert new material? The industry has an elegant system that lets the script evolve without ever renumbering:</p>

    <ul class="spec-list">
      <li><b>A-pages (and A-scenes).</b> Need to add a page between 55 and 56? It becomes page <em>55A.</em> A new scene between 42 and 43 becomes <em>Scene 42A.</em> The surrounding numbers never move — you just insert lettered ones.</li>
      <li><b>Revision colors.</b> Each round of changes is printed on a different colored paper in a standard order (white, then blue, pink, yellow, green, and so on). At a glance, anyone can see which pages are the newest revision.</li>
      <li><b>Revision marks.</b> An asterisk in the margin flags exactly which lines changed on a revised page, so crew don't have to re-read the whole thing.</li>
    </ul>

    <p>This is why you'll hear "shoot off the blue pages" or "that's on page 22A" on a set — it's the language of a locked script staying organized while it evolves.</p>

    <h2>Why it has to come first</h2>

    <p>Locking is step one of the breakdown for a simple reason: the breakdown records information <em>against scene numbers.</em> "Scene 42 needs a vintage car" is only useful if Scene 42 will always be Scene 42. If you broke down an unlocked script and the numbers later shifted, your entire breakdown — and everything built on it — would point to the wrong scenes. So: lock first, break down second. On a small production you may be doing both yourself, but the discipline is the same — freeze the numbering before you start itemizing.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>On my early no-budget shoots I skipped locking because it felt like studio bureaucracy — and I paid for it every time. I'd renumber a script mid-prep and suddenly my breakdown notes and my schedule didn't match, and I'd waste a morning untangling which "Scene 12" was which. The day I started properly locking scripts, even on tiny productions, that whole class of confusion vanished. Lock the script. It costs you ten minutes and saves you a dozen headaches you won't see coming.</p>
    </div>

    <p>With a locked script in hand, you can start measuring it — and the first measurement is scene <em>length,</em> counted in a peculiar but powerful unit the whole industry uses: eighths of a page. That's next.</p>
`,
      takeaways: [
        "Locking freezes a script's page and scene numbers permanently so a whole crew shares one stable reference.",
        "After lock, Scene 42 is always Scene 42 and page 55 is always page 55 — even through revisions.",
        "Changes are handled with A-pages/A-scenes, revision colors, and margin marks — never renumbering.",
        "Lock first, break down second — the breakdown records everything against stable scene numbers.",
      ],
    },
    {
      slug: "script-breakdown-eighths",
      num: 3,
      roman: "III",
      title: "The Eighths System",
      desc: "Measuring every scene in eighths of a page",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Ask a filmmaker how long a scene is and they won't say "half a page." They'll say "four-eighths." Measuring scenes in eighths of a page is one of the oldest, oddest, and most useful conventions in production.`,
      seoTitle: "Script Breakdown Eighths: Measuring Scene Length | Filmmaker Genius",
      seoDesc: "How the eighths system works in a script breakdown — measuring every scene in eighths of a page, why film uses eighths, how to count them, and how page count converts to screen time and schedule. Chapter 3 of Script Breakdown Fundamentals.",
      body: `
    <p>To plan a shoot, you have to know how <em>much</em> of the script each scene represents — because a scene's length is a rough proxy for how long it'll take to shoot and how much of a day it'll eat. The film industry measures scene length in a specific unit: <strong>eighths of a page.</strong> Every page of a properly formatted screenplay is treated as if it's divided into eight equal horizontal strips, and each scene is measured by how many of those eighths it fills. It sounds fussy, but it's a shared standard that lets everyone talk about length in the same precise language.</p>

    <h2>How the eighths system works</h2>

    <div class="eighths-wrap">
      <div class="page-strip" aria-hidden="true">
        <div class="eighth filled">1/8</div>
        <div class="eighth filled">2/8</div>
        <div class="eighth filled">3/8</div>
        <div class="eighth">4/8</div>
        <div class="eighth">5/8</div>
        <div class="eighth">6/8</div>
        <div class="eighth">7/8</div>
        <div class="eighth">8/8</div>
      </div>
      <div class="eighths-note">
        <p>Picture one script page split into <b>8 equal strips</b>. A scene that fills three of them is <b>"3/8"</b> — three-eighths of a page.</p>
        <p>A full page is <b>8/8</b> (written as <b>1</b>). A page and a half is <b>1 4/8</b>. Anything shorter than one strip still counts as a minimum of <b>1/8</b>.</p>
      </div>
    </div>

    <p>So a short exchange might be 2/8, a medium scene 5/8, a long scene 1 3/8 (a page and three-eighths). The convention: a scene is never recorded as less than 1/8, even if it's a single line — every scene takes <em>some</em> time to set up and shoot, so it gets a floor of one-eighth.</p>

    <div class="pullquote">Eighths turn a vague "it's a short scene" into a hard number you can schedule, total, and budget. Precision is the whole point.</div>

    <h2>Why eighths, and why they matter</h2>

    <p>Why eight and not tenths or halves? Tradition, mostly — the convention predates computers, when ADs literally measured pages with a ruler, and eighths divided a page into strips that were easy to eyeball. But the reason it <em>survives</em> is that scene length drives everything about a day's work:</p>

    <ul class="spec-list">
      <li><b>Estimating shoot time.</b> A rough rule of thumb is that a crew shoots only a handful of pages per day. Knowing a day's scenes total, say, 4 6/8 pages tells you if the day is realistic or overloaded.</li>
      <li><b>Balancing the schedule.</b> When you total the eighths for each shooting day, you can see at a glance which days are too heavy and rebalance them.</li>
      <li><b>Approximating screen time.</b> The old "one page ≈ one minute of screen time" rule is loose, but eighths give a usable estimate of runtime and pacing.</li>
      <li><b>A common language.</b> Everyone — AD, producer, director — refers to the same numbers, so "that's a 6/8 scene" means the same thing to the whole team.</li>
    </ul>

    <h2>How to count them</h2>

    <p>Measuring eighths is straightforward once the script is locked. For each scene, look at how much vertical space it occupies on the page and estimate to the nearest eighth. If a scene runs across a page break, you add the eighths from each page together (2/8 at the bottom of one page + 3/8 at the top of the next = 5/8). You total all the eighths in the script and it should roughly equal your page count — a useful check. Screenwriting and scheduling software now counts eighths automatically, but understanding the manual method is what lets you sanity-check the numbers and know what they mean.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Eighths are the reality check that saves your schedule. Early on I'd look at a day and think "six scenes, no problem" — until I added up the eighths and realized those six scenes were nine pages, an impossible day. Now the eighths total is the first thing I look at for any shooting day, because it's the honest number. Scene <em>count</em> lies to you; eighths don't. When a director asks for "just one more scene" in a day, I check the eighths before I answer.</p>
    </div>

    <p>You can now measure how <em>big</em> each scene is. Next you'll learn how to identify <em>what's in</em> each scene — the categories of production elements, and the standard color code the whole industry uses to mark them. That's Chapter IV.</p>
`,
      takeaways: [
        "The industry measures scene length in eighths of a page — each page is treated as eight equal strips.",
        "A full page is 8/8 (written as 1); every scene counts as a minimum of 1/8.",
        "Eighths drive shoot-time estimates, schedule balancing, and rough screen time — and give everyone one language.",
        "Total the eighths per shooting day to see honestly whether a day is realistic — scene count alone lies.",
      ],
    },
    {
      slug: "script-breakdown-color-codes",
      num: 4,
      roman: "IV",
      title: "Elements & Color Codes",
      desc: "The standard breakdown elements and their color codes",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Every producible thing in a scene falls into a category — cast, props, wardrobe, stunts, and more. The industry gives each category a color, turning a marked-up script into a map anyone can read at a glance.`,
      seoTitle: "Script Breakdown Color Codes & Elements | Filmmaker Genius",
      seoDesc: "The standard script breakdown color codes and element categories — cast, extras, stunts, props, wardrobe, vehicles, special effects, and more — and how the color system organizes a breakdown. Chapter 4 of Script Breakdown Fundamentals.",
      body: `
    <p>When you break down a scene, you're not just listing random things — you're sorting everything into standard <strong>element categories.</strong> Each department cares about a different category: wardrobe wants the costume list, props wants the props, casting wants the cast. To keep it all organized, the industry assigns each category a <strong>color,</strong> and when you mark up a script, you underline or highlight each element in its category's color. The result is a script that visually shows, at a glance, everything each department needs — a color-coded map of the production.</p>

    <h2>The standard element categories</h2>

    <p>Breakdown categories are remarkably consistent across the industry. The main ones:</p>

    <ul class="spec-list">
      <li><b>Cast</b> — speaking roles / principal characters.</li>
      <li><b>Background &amp; extras</b> — atmosphere, silent bits, the crowd.</li>
      <li><b>Stunts</b> — anything requiring a stunt performer or coordinator.</li>
      <li><b>Props</b> — objects an actor handles or that are essential to the action.</li>
      <li><b>Wardrobe</b> — costumes and clothing.</li>
      <li><b>Makeup &amp; hair</b> — special looks, aging, wounds, wigs.</li>
      <li><b>Vehicles &amp; animals</b> — picture cars, horses, dogs, anything living or driving.</li>
      <li><b>Special effects &amp; VFX</b> — practical effects on set and visual effects in post.</li>
      <li><b>Special equipment</b> — cranes, drones, underwater rigs, and other non-standard gear.</li>
      <li><b>Sound &amp; music</b> — source music, playback, special sound needs.</li>
      <li><b>Set dressing</b> — furniture and décor that fill the space (vs. props actors touch).</li>
    </ul>

    <h2>The color code</h2>

    <p>Each category gets a color so it pops out on the marked page. A widely used set looks like this:</p>

    <div class="legend">
      <div class="legend-row"><span class="swatch" style="background:#e5484d;"></span><span class="legend-el">Cast</span><span class="legend-desc">Speaking / principal roles — red</span></div>
      <div class="legend-row"><span class="swatch" style="background:#f5c518;"></span><span class="legend-el">Background</span><span class="legend-desc">Atmosphere &amp; silent extras — yellow</span></div>
      <div class="legend-row"><span class="swatch" style="background:#f2711c;"></span><span class="legend-el">Stunts</span><span class="legend-desc">Stunt performers &amp; coordination — orange</span></div>
      <div class="legend-row"><span class="swatch" style="background:#2f7ed8;"></span><span class="legend-el">Special Effects</span><span class="legend-desc">Practical FX on set — blue</span></div>
      <div class="legend-row"><span class="swatch" style="background:#8b5cf6;"></span><span class="legend-el">Props</span><span class="legend-desc">Objects actors handle — purple</span></div>
      <div class="legend-row"><span class="swatch" style="background:#ec4899;"></span><span class="legend-el">Vehicles / Animals</span><span class="legend-desc">Picture cars &amp; livestock — pink</span></div>
      <div class="legend-row"><span class="swatch" style="background:#22a06b;"></span><span class="legend-el">Wardrobe</span><span class="legend-desc">Costumes &amp; clothing — green (often circled)</span></div>
      <div class="legend-row"><span class="swatch" style="background:#8a6d3b;"></span><span class="legend-el">Makeup / Hair</span><span class="legend-desc">Special looks &amp; effects — brown / asterisk</span></div>
    </div>

    <p><em>One important caveat:</em> exact colors are <strong>not universal.</strong> They vary a little between different manuals, software defaults, and productions — one show's "props purple" is another's violet, and some assign extra categories their own hues. So always confirm the <em>key</em> (the legend) for your specific production. What <em>is</em> universal is the <em>idea:</em> consistent categories, each with a consistent color, so the whole team reads the same map.</p>

    <div class="pullquote">The colors aren't decoration — they're a filing system on the page. Purple means "props department, this is yours," and everyone knows it without reading a word.</div>

    <h2>Why the system works</h2>

    <ul class="spec-list">
      <li><b>Speed.</b> A marked page instantly shows what's in a scene — the props person scans for purple, ignores everything else.</li>
      <li><b>Nothing slips through.</b> Categorizing forces you to consider every department for every scene, so the gun (prop), the blood (makeup), and the getaway car (vehicle) all get caught.</li>
      <li><b>It feeds the breakdown sheet.</b> Each colored element gets transferred to the matching field on the scene's breakdown sheet, which we'll build in Module 2.</li>
      <li><b>It's a shared language.</b> Any crew member from any production understands the system, so a marked script communicates instantly.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The categories matter more than the exact colors, so don't get paralyzed memorizing whether props are "purple" or "violet." What matters is the <em>discipline</em> of running every scene through the full list of categories — cast, extras, stunts, props, wardrobe, makeup, vehicles, effects, equipment, sound. That checklist is what catches the element you'd otherwise forget until you're on set without it. Pick a consistent key, put it on the front page of your script, and never deviate from it for that production. Consistency beats "correctness" every time.</p>
    </div>

    <p>You now know the two things you measure — how big a scene is (eighths) and what's in it (color-coded elements). That completes the foundations. In Module 2 you'll actually do the work: reading the script and marking up every element, page by page. Marking up the script is next.</p>
`,
      takeaways: [
        "Every producible thing sorts into a standard category: cast, extras, stunts, props, wardrobe, makeup, vehicles, effects, and more.",
        "Each category gets a color, turning a marked script into a map every department can read at a glance.",
        "Exact colors vary by manual, software, and production — always confirm your production's key; the idea is what's universal.",
        "Running every scene through the full category checklist is what stops elements from being forgotten.",
      ],
    },
    {
      slug: "how-to-mark-up-a-script",
      num: 5,
      roman: "V",
      title: "Marking Up the Script",
      desc: "Reading and tagging every element on the page",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `Now the actual work begins. You go through the locked script scene by scene, colored pens or highlighters in hand, tagging every element that has to be produced. This is where a story becomes a production inventory.`,
      seoTitle: "How to Mark Up a Script for a Breakdown | Filmmaker Genius",
      seoDesc: "How to mark up a script for a breakdown — reading scene by scene, tagging every element in its color, working department by department, and the discipline that catches everything. Chapter 5 of Script Breakdown Fundamentals.",
      body: `
    <p>With the script locked, eighths understood, and the color code chosen, you're ready to <strong>mark up the script.</strong> This is the hands-on heart of the breakdown: reading every scene as a producer and physically tagging — underlining, highlighting, or circling — each element in its category's color. When you're done, you'll have a rainbow-colored script where every producible thing is flagged and sorted. Those marks become the raw data for the breakdown sheets in the next chapter. Here's how to do it methodically so nothing slips through.</p>

    <h2>What a marked page looks like</h2>

    <p>Take a simple scene and tag it. Cast in red, props in purple, wardrobe in green, vehicles in pink, background in yellow:</p>

    <div class="script-sample">
      <div class="sl">42&nbsp;&nbsp;INT. DINER — NIGHT</div>
      <mark class="m-cast">MAYA</mark> slides into a booth, still in her <mark class="m-ward">wet raincoat</mark>. A few <mark class="m-bg">late-night diners</mark> nurse coffee. She sets a <mark class="m-prop">battered briefcase</mark> on the table and slides a <mark class="m-prop">manila envelope</mark> across to <mark class="m-cast">DELACROIX</mark>. Through the window, his <mark class="m-veh">black sedan</mark> idles at the curb.
      <div class="sample-legend">
        <span><i style="background:#ffb3b5;"></i>Cast</span>
        <span><i style="background:#d7bdf5;"></i>Props</span>
        <span><i style="background:#a9e4c4;"></i>Wardrobe</span>
        <span><i style="background:#ffc0dd;"></i>Vehicles</span>
        <span><i style="background:#ffe89a;"></i>Background</span>
      </div>
    </div>

    <p>One short paragraph, and already the scene has yielded two cast, one wardrobe item, two props, a vehicle, and background — plus its location (interior diner), time (night), and length in eighths. That's the breakdown, happening one tag at a time.</p>

    <div class="pullquote">Marking up is reading with a different question. Not "what happens?" but "what has to physically exist for this to be filmed?" Every answer gets a color.</div>

    <h2>Work scene by scene, category by category</h2>

    <p>The discipline that catches everything is to be systematic. For each scene:</p>

    <ul class="spec-list">
      <li><b>Read it once for understanding.</b> Get the whole scene in your head before you start tagging.</li>
      <li><b>Then pass through by category.</b> Rather than tagging in reading order, sweep the scene once for cast, once for props, once for wardrobe, and so on. Hunting one category at a time is how you avoid missing things.</li>
      <li><b>Tag every element in its color.</b> Underline or highlight the exact word — "briefcase," "raincoat," "sedan."</li>
      <li><b>Note the invisibles.</b> Some elements aren't stated outright. "She fires the gun" implies a prop gun, blanks, possibly an armorer and hearing protection. Read <em>between</em> the lines.</li>
      <li><b>Record scene data.</b> Location, INT/EXT, day/night, and the scene's length in eighths.</li>
    </ul>

    <h2>Read between the lines</h2>

    <p>The hardest part of marking up is catching what the script <em>implies</em> but doesn't say. A screenplay is written for story, not production, so it rarely spells out logistics. "They eat dinner" means a set-dressed table, food (prop and possibly a food stylist), and plates. "He speeds away" means a picture car, maybe a stunt driver, maybe a permit for the street. "It's snowing" means a special effect. The experienced breakdown artist reads every line asking "what does this quietly require?" — because the elements you miss are the ones that blow up the shoot day.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My rule for marking up: go slow and go category-by-category, never trusting a single read. I sweep a scene once looking <em>only</em> for props, then again <em>only</em> for wardrobe, and so on down the list. It feels tedious, but it's the opposite of tedious in its payoff — that method is what catches the coffee cup, the wedding ring, the bloodstain, the thing that a single read glides right over. A breakdown lives or dies on completeness, and completeness comes from a boring, disciplined, one-category-at-a-time pass. Do it slow now so you're not improvising on set.</p>
    </div>

    <p>Your script is now fully marked — a color-coded map of everything the production needs. The next step is to transfer those marks off the script and onto an organized form for each scene: the breakdown sheet. That's next.</p>
`,
      takeaways: [
        "Marking up means reading each scene as a producer and tagging every element in its category's color.",
        "Be systematic: read once for understanding, then sweep the scene one category at a time.",
        "Read between the lines — catch the elements the script implies but never states outright.",
        "Record each scene's location, INT/EXT, day/night, and length in eighths alongside the elements.",
      ],
    },
    {
      slug: "breakdown-sheet",
      num: 6,
      roman: "VI",
      title: "The Breakdown Sheet",
      desc: "Filling out one breakdown sheet per scene",
      time: "10 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `All those colored marks on the script have to go somewhere organized. That somewhere is the breakdown sheet — one form per scene that becomes the master record every department and every schedule is built from.`,
      seoTitle: "The Breakdown Sheet: One Sheet Per Scene | Filmmaker Genius",
      seoDesc: "What a breakdown sheet is and how to fill one out — the header, elements, and one sheet per scene that turns a marked-up script into organized production data. With an annotated example. Chapter 6 of Script Breakdown Fundamentals.",
      body: `
    <p>A marked-up script is a great start, but you can't schedule from a rainbow of underlines scattered across 100 pages. You need the information <em>extracted</em> and <em>organized</em> — and that's the job of the <strong>breakdown sheet.</strong> It's a standardized form, and the rule is simple: <em>one breakdown sheet per scene.</em> Each sheet gathers everything about that one scene — its header info and every element you tagged — into labeled boxes. Do a sheet for every scene, and you've converted your marked script into a clean, structured database of the entire production.</p>

    <h2>What's on a breakdown sheet</h2>

    <p>A breakdown sheet has two parts: a <strong>header</strong> with the scene's core facts, and a set of <strong>element boxes</strong>, one per category, where you list what you tagged.</p>

    <div class="bd-sheet" aria-hidden="true">
      <div class="bd-title"><span>Breakdown Sheet</span><span>"Deep End" — Sheet #42</span></div>
      <div class="bd-hdr">
        <div class="cell"><span class="lab">Scene #</span><span class="val">42</span></div>
        <div class="cell"><span class="lab">Int / Ext</span><span class="val">INT</span></div>
        <div class="cell"><span class="lab">Day / Night</span><span class="val">NIGHT</span></div>
        <div class="cell"><span class="lab">Pages</span><span class="val">6/8</span></div>
      </div>
      <div class="bd-hdr" style="grid-template-columns:2fr 1fr;">
        <div class="cell"><span class="lab">Location / Set</span><span class="val">Diner</span></div>
        <div class="cell"><span class="lab">Description</span><span class="val">Maya hands off the envelope</span></div>
      </div>
      <div class="bd-grid">
        <div class="bd-box"><div class="bl bl-cast">Cast</div><div class="bv">Maya, Delacroix</div></div>
        <div class="bd-box"><div class="bl bl-bg">Background / Extras</div><div class="bv">4 late-night diners</div></div>
        <div class="bd-box"><div class="bl bl-prop">Props</div><div class="bv">Battered briefcase, manila envelope, coffee cups</div></div>
        <div class="bd-box"><div class="bl bl-ward">Wardrobe</div><div class="bv">Maya's wet raincoat</div></div>
        <div class="bd-box"><div class="bl bl-veh">Vehicles</div><div class="bv">Delacroix's black sedan (picture car)</div></div>
        <div class="bd-box"><div class="bl bl-mk">Makeup / Hair</div><div class="bv">Rain-soaked look for Maya</div></div>
      </div>
    </div>

    <p>Every field on the sheet maps directly to the marks on your script. The red words become the Cast box, the purple words become the Props box, and so on. You're not inventing anything — you're transcribing your color-coded page into an organized form.</p>

    <div class="pullquote">The marked script is where you find the elements. The breakdown sheet is where you store them. One scene, one sheet, no exceptions.</div>

    <h2>The header: the scene's identity</h2>

    <p>The header captures the facts that determine <em>when and where</em> a scene can be shot — which makes it the raw material for scheduling:</p>

    <ul class="spec-list">
      <li><b>Scene number</b> — from the locked script, the sheet's permanent ID.</li>
      <li><b>INT/EXT</b> — interior or exterior (huge for scheduling around weather and daylight).</li>
      <li><b>Day/Night</b> — when it's set, which dictates lighting and shoot timing.</li>
      <li><b>Location / set</b> — where it happens; scenes at the same location get grouped later.</li>
      <li><b>Page length in eighths</b> — how much of a shoot day it represents.</li>
      <li><b>A one-line description</b> — "Maya hands off the envelope" — so anyone knows the scene at a glance.</li>
    </ul>

    <h2>The element boxes: the scene's needs</h2>

    <p>Below the header, one labeled box per category holds the actual lists — cast, background, props, wardrobe, makeup, vehicles, stunts, effects, and the rest. This is the part each department eventually reads: the props master flips through every sheet and pulls the Props box; wardrobe pulls the Wardrobe box. Because it's one consistent form repeated for every scene, the information is instantly findable no matter who's looking or what they need.</p>

    <h2>Why one sheet per scene matters</h2>

    <p>The one-sheet-per-scene rule is what makes the whole system flexible. Because each scene's data lives on its own card, you can <em>shuffle</em> those cards into any order without losing information — which is exactly what scheduling is. Software today stores each breakdown sheet as a digital record you can sort, filter, and rearrange, but it's the same principle the industry has used with paper for decades. Get one clean, complete sheet per scene and everything downstream — the board, the schedule, the budget — falls into place.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The breakdown sheet is the single most valuable document I produce in prep, because <em>everyone</em> ends up using it. When wardrobe asks what Maya wears in the diner, I don't reread the script — I pull sheet 42. When the producer asks how many scenes need the black sedan, I filter the sheets. The completed set of breakdown sheets <em>is</em> the production's memory. Spend the time to make each one accurate and complete, because every schedule, budget, and call sheet for the rest of the shoot is built on top of it.</p>
    </div>

    <p>You've now got a sheet for every scene. But some categories have their own conventions and pitfalls worth a closer look — starting with the people. How to break down cast, extras, and stunts is next.</p>
`,
      takeaways: [
        "A breakdown sheet organizes everything about one scene — one sheet per scene, no exceptions.",
        "It has a header (scene #, INT/EXT, day/night, location, pages, description) and one element box per category.",
        "Each field maps straight from your marked script — you transcribe the color-coded elements into labeled boxes.",
        "One sheet per scene lets you shuffle scenes freely — the basis of the board, the schedule, and the budget.",
      ],
    },
    {
      slug: "script-breakdown-cast-and-extras",
      num: 7,
      roman: "VII",
      title: "Cast, Extras & Stunts",
      desc: "Numbering cast and counting extras and stunts",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `People are the most expensive and most complicated thing to schedule on a film. Getting the human elements right — numbering the cast, counting the extras, flagging the stunts — is where a breakdown earns its keep.`,
      seoTitle: "Script Breakdown: Cast, Extras & Stunts | Filmmaker Genius",
      seoDesc: "How to break down the people in a script — numbering cast, counting background and extras, flagging stunts, and why the human elements drive the budget more than anything else. Chapter 7 of Script Breakdown Fundamentals.",
      body: `
    <p>The element categories aren't all equal. The <em>people</em> categories — cast, background, and stunts — are the ones that most shape your schedule and budget, because human beings have call times, meal breaks, union rules, and daily rates. A prop sits in a truck until you need it; an actor has to be booked, scheduled, fed, and paid whether the day runs smoothly or not. That's why the breakdown treats the human elements with special care, and why this chapter zooms in on them.</p>

    <h2>Cast: number them</h2>

    <p>The <strong>cast</strong> category covers speaking roles and principal characters. The key discipline here is that each cast member gets a <em>permanent number</em> — a cast ID used across the whole production. The lead might be #1, the antagonist #2, and so on. Why numbers instead of just names?</p>

    <ul class="spec-list">
      <li><b>They track an actor across every scene.</b> On the schedule and the day-out-of-days (Chapter XI), "Cast #1" instantly shows every day that actor works.</li>
      <li><b>They drive availability planning.</b> You can see at a glance which scenes need which actors, so you shoot an actor's scenes together and don't pay them to sit idle.</li>
      <li><b>They're compact.</b> On a crowded board or schedule, "1, 4, 7" is far cleaner than three full names.</li>
    </ul>

    <p>So as you build your breakdown sheets, assign every speaking character a number and use it consistently. The cast list with its numbers becomes one of your most-referenced production documents.</p>

    <div class="pullquote">Props cost money once. People cost money every day they're on the clock. That's why the breakdown counts them most carefully of all.</div>

    <h2>Background &amp; extras: count them</h2>

    <p>The <strong>background</strong> (or atmosphere/extras) category is about <em>numbers,</em> not names — you're estimating how many non-speaking people fill each scene. "A busy restaurant" might be 20 background; "a packed stadium" is a different budget line entirely. Precision matters because extras cost money per head per day, and someone has to cast, wardrobe, feed, and manage all of them.</p>

    <ul class="spec-list">
      <li><b>Estimate a realistic count</b> for each scene ("15 diners," "6 pedestrians") rather than a vague "crowd."</li>
      <li><b>Watch the difference between silent extras and "silent bits"</b> — a background performer who does a small featured action (reacting, handing something over) may be a higher category and cost than pure atmosphere.</li>
      <li><b>Flag the big crowd scenes early</b> — they drive location, budget, and logistics far more than the script's word count suggests.</li>
    </ul>

    <h2>Stunts: flag them, always</h2>

    <p>The <strong>stunts</strong> category is small but critical, because it's about safety as much as budget. Anything that could injure a performer — a fight, a fall, a car chase, a fire, even a "simple" trip-and-fall — should be flagged as a stunt so it gets a stunt coordinator, proper planning, and safety measures. New filmmakers routinely under-flag this, treating an action beat as no big deal. On a professional set, if there's <em>any</em> risk, it's a stunt, full stop. The breakdown is where that gets caught, so the right people and precautions are in place long before the camera rolls.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Two hard-won habits. First, I number my cast on day one of the breakdown and never renumber — that number follows the actor through the whole schedule, and it's the backbone of planning their days. Second, I flag anything remotely risky as a stunt, even if the director insists "it's nothing." A performer stepping off a low wall is nothing — until someone lands wrong. The breakdown is where you build in safety by <em>naming</em> the risk early, so it gets a professional and a plan instead of an improvised "we'll just do it." When in doubt, flag it.</p>
    </div>

    <p>People handled, you turn to the things: the objects, costumes, and vehicles that fill out a scene. Props, wardrobe, and special elements — and the fuzzy lines between them — are next.</p>
`,
      takeaways: [
        "The people categories drive schedule and budget most, because performers have call times, rates, and rules.",
        "Give every speaking cast member a permanent number and use it consistently to track them across the schedule.",
        "Estimate realistic extra counts per scene, and mind the difference between pure atmosphere and featured \"silent bits.\"",
        "Flag anything risky as a stunt — the breakdown is where safety and a stunt coordinator get built in early.",
      ],
    },
    {
      slug: "script-breakdown-elements",
      num: 8,
      roman: "VIII",
      title: "Props, Wardrobe & Special Elements",
      desc: "Props, wardrobe, vehicles, and special elements",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `The physical world of the film — every object, costume, car, and effect — has to be caught, categorized, and often distinguished from its lookalikes. The lines between these categories are where breakdowns get sloppy.`,
      seoTitle: "Script Breakdown Elements: Props, Wardrobe & Special Elements | Filmmaker Genius",
      seoDesc: "How to break down props, wardrobe, vehicles, and special elements — the difference between a prop and set dressing, wardrobe continuity, and flagging effects and special equipment early. Chapter 8 of Script Breakdown Fundamentals.",
      body: `
    <p>After the people come the <em>things.</em> Props, wardrobe, vehicles, effects, and special equipment make up the physical world of every scene, and each has its own department waiting to receive your lists. The trick with these categories isn't finding the obvious items — it's drawing the right lines <em>between</em> categories and catching the elements the script only implies. Get the categories confused and departments end up double-covering or missing things; get them clean and every department knows exactly what's theirs.</p>

    <h2>Props vs. set dressing</h2>

    <p>The most common category confusion in any breakdown is <strong>props versus set dressing</strong>, and the rule is simple:</p>

    <ul class="spec-list">
      <li><b>A prop</b> is an object a character <em>handles or uses</em> — the coffee cup she drinks from, the gun he fires, the letter she reads.</li>
      <li><b>Set dressing</b> is what <em>fills the space</em> but nobody interacts with — the paintings on the wall, the couch in the background, the books on the shelf.</li>
    </ul>

    <p>The same object can flip categories: a lamp sitting on a desk is set dressing; the moment an actor picks it up and swings it, it becomes a prop. Why does it matter? Different departments, different handling. Props are managed by the props master and often need multiples, tracking, and continuity; set dressing is handled by the art department and stays put. Miscategorize, and the object either gets forgotten or shows up in two budgets.</p>

    <div class="pullquote">If an actor touches it, it's a prop. If it just sits there, it's set dressing. The moment a character picks something up, it changes departments.</div>

    <h2>Wardrobe and continuity</h2>

    <p><strong>Wardrobe</strong> is more than a costume list — it carries a hidden dimension the breakdown has to respect: <em>continuity.</em> Because films shoot out of order, the same "day" in the story may be shot across weeks, and a character has to wear the same outfit — often in the same condition — every time. So wardrobe breakdown isn't just "Maya: raincoat"; it's tracking which <em>story day</em> each scene belongs to, so wardrobe (and makeup) can match. A character who gets a bloodstain in scene 30 must have it in every later-shot scene set after that moment. The breakdown flags these needs; the wardrobe and script-supervision departments manage them. Also watch for multiples — a shirt that gets torn or soaked may need several identical copies.</p>

    <h2>Vehicles, animals, and the special categories</h2>

    <ul class="spec-list">
      <li><b>Vehicles &amp; animals</b> — "picture" cars (seen on camera) and any live animals. Both need wranglers, prep, insurance, and lead time; a horse or a period car can drive a whole day's logistics.</li>
      <li><b>Special effects</b> — practical, on-set effects (rain, fire, smoke, squibs) that need an effects team and safety planning, distinct from VFX added in post.</li>
      <li><b>Special equipment</b> — anything beyond a standard camera package: cranes, drones, underwater housings, car mounts, steadicam. Flagging these early protects the schedule and budget.</li>
      <li><b>Sound &amp; music</b> — source music playing in a scene, live playback for a dance number, or anything needing rights or special recording.</li>
    </ul>

    <h2>Catch the implied elements</h2>

    <p>As with the people categories, the elements that hurt you are the ones the script doesn't spell out. "A rainy night" is a special effect (rain towers) <em>and</em> a wardrobe note (everyone's wet) <em>and</em> a continuity issue. "He checks his watch" is a prop <em>and</em> a continuity item (which watch, on which day). "The dog barks" is an animal, a wrangler, and prep time. Every category has these hidden requirements, and the breakdown is where a careful eye catches them before they become an on-set emergency.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The category that bites low-budget filmmakers hardest is the humble prop-vs-continuity trap. On one shoot we shot a scene where a character smokes a cigarette down to the filter, then shot the "same moment" reverse angle three days later — with a fresh full cigarette. It's on screen forever now. That's not a props failure, it's a <em>breakdown</em> failure: nobody flagged the continuity of a consumable prop. When you break down props and wardrobe, always ask "does this change during the scene, and will we match it later?" Consumables, damage, and wetness are the classic traps.</p>
    </div>

    <p>You've now broken down every category — people and things, stated and implied — into complete breakdown sheets. That's the whole breakdown. Module 3 turns that breakdown into a plan you can actually shoot: the production board, the schedule, and the budget. The production board is next.</p>
`,
      takeaways: [
        "A prop is anything an actor handles; set dressing just fills the space — an object flips categories when it's picked up.",
        "Wardrobe carries continuity — track story days and condition, and flag multiples for damaged or consumable items.",
        "Flag vehicles, animals, special effects, special equipment, and source music early — they drive logistics and budget.",
        "Catch implied elements — \"a rainy night\" or \"he checks his watch\" hides effects, wardrobe, props, and continuity.",
      ],
    },
    {
      slug: "film-production-board",
      num: 9,
      roman: "IX",
      title: "The Production Board",
      desc: "Turning breakdown sheets into a stripboard",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Scheduling & Delivery",
      dek: `Now your breakdown becomes something you can shuffle. Each scene turns into a strip, all the strips go on a board, and by sliding them around you build the shooting order of the entire film.`,
      seoTitle: "The Production Board (Stripboard) Explained | Filmmaker Genius",
      seoDesc: "What a film production board (stripboard) is and how it works — one strip per scene, colored for day and night, and how the board turns breakdown sheets into a shooting order. Chapter 9 of Script Breakdown Fundamentals.",
      body: `
    <p>You have a breakdown sheet for every scene. But scenes in a film are almost never shot in script order — you shoot out of sequence to be efficient, grouping scenes by location, cast, and time of day. To plan that jigsaw, the industry uses the <strong>production board</strong>, also called the <strong>stripboard.</strong> Each scene becomes a thin vertical <em>strip</em> summarizing its key breakdown info, and all the strips sit side by side on a board. Because strips can slide left and right, you can rearrange the entire shooting order just by moving them around — which is exactly how a schedule gets built.</p>

    <h2>What a strip is</h2>

    <p>Each strip is a compressed version of a scene's breakdown sheet — just enough to schedule by:</p>

    <ul class="spec-list">
      <li><b>Scene number</b> and a one-line description.</li>
      <li><b>INT/EXT and Day/Night</b> — often shown by the strip's <em>color.</em></li>
      <li><b>Location / set.</b></li>
      <li><b>Page length in eighths.</b></li>
      <li><b>Cast numbers</b> — which actors (by their number) are in the scene.</li>
    </ul>

    <div class="stripboard" aria-hidden="true">
      <div class="strip day"><span class="s-num">42</span><span class="s-body">INT DINER · Handoff · 1,2</span><span class="s-len">6/8</span></div>
      <div class="strip day"><span class="s-num">17</span><span class="s-body">INT DINER · Argument · 1,3</span><span class="s-len">1 2/8</span></div>
      <div class="strip board-div"><span class="s-body">END DAY 1</span><span class="s-len">·</span></div>
      <div class="strip night"><span class="s-num">08</span><span class="s-body">EXT ALLEY · Chase · 1,4</span><span class="s-len">4/8</span></div>
      <div class="strip night"><span class="s-num">23</span><span class="s-body">EXT ALLEY · Escape · 1</span><span class="s-len">3/8</span></div>
      <div class="strip board-div"><span class="s-body">END DAY 2</span><span class="s-len">·</span></div>
      <div class="strip day"><span class="s-num">31</span><span class="s-body">INT OFFICE · Meeting · 2,5</span><span class="s-len">7/8</span></div>
    </div>
    <div class="strip-legend">
      <span><i style="background:#f5efab;"></i>Day</span>
      <span><i style="background:#2e3a55;"></i>Night</span>
      <span><i style="background:#1a1a1a;"></i>Day break</span>
    </div>

    <p>Notice scenes 42 and 17 — both at the diner — sit together even though they're far apart in the script. That's the whole point: the board lets you <em>group</em> scenes for efficiency, then insert a black "end of day" divider to mark where each shooting day stops.</p>

    <div class="pullquote">The script's order tells the story. The board's order shoots the movie. Turning one into the other, efficiently, is the entire job of scheduling.</div>

    <h2>Why colors and strips</h2>

    <p>The strip system is genius in its simplicity, and it's survived from physical cardboard boards into every scheduling app:</p>

    <ul class="spec-list">
      <li><b>Color tells you the shoot condition at a glance.</b> A common scheme: white for interior day, yellow for exterior day, blue for interior night, green for exterior night. Scan the board and you instantly see your day/night and in/out mix.</li>
      <li><b>Strips are movable.</b> Physically (or digitally) sliding strips lets you test different orders without rewriting anything — the flexibility that makes scheduling possible.</li>
      <li><b>Everything's visible at once.</b> The whole film laid out in strips shows the shape of the shoot — where the heavy days are, where an actor clusters, where you're bouncing between locations.</li>
      <li><b>Day dividers structure it.</b> Black divider strips break the board into shooting days, so the board <em>is</em> the schedule in visual form.</li>
    </ul>

    <p>Historically these were literal cardboard strips in a wooden or metal frame (the "production board"). Today software like scheduling programs does it digitally, but the logic — and the language of "strips" and "boards" — is identical.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first time I saw a full stripboard laid out, the whole shoot suddenly made <em>sense</em> in a way the script never showed me. I could see that my lead was in forty of forty-five strips (so their availability drove everything), that I had three night exteriors bunched badly, and that two locations were scattered across the board when they should've been grouped. The board turns an abstract pile of breakdown sheets into a picture you can <em>read</em> — and rearrange. Learn to see the shoot in strips and scheduling stops being guesswork.</p>
    </div>

    <p>The board gives you the pieces and the freedom to move them. Next you'll learn the actual <em>logic</em> of arranging them — the principles that turn a jumble of strips into an efficient, shootable schedule. Scheduling from the breakdown is next.</p>
`,
      takeaways: [
        "The production board (stripboard) turns each scene into a movable strip you rearrange to build the shooting order.",
        "Each strip carries scene #, description, INT/EXT, day/night, location, page length, and cast numbers.",
        "Strip color shows the shoot condition (interior/exterior, day/night) at a glance; black dividers mark shooting days.",
        "Because strips move freely, the board lets you group scenes for efficiency — the same logic in cardboard or software.",
      ],
    },
    {
      slug: "how-to-schedule-a-film-shoot",
      num: 10,
      roman: "X",
      title: "Scheduling from the Breakdown",
      desc: "Ordering the strips into an efficient shooting schedule",
      time: "10 min",
      moduleKey: "apply",
      kicker: "Scheduling & Delivery",
      dek: `A board full of strips is potential; a <em>schedule</em> is a plan. This is the logic that turns one into the other — the principles that decide which scenes to shoot together, and in what order.`,
      seoTitle: "How to Schedule a Film Shoot from the Breakdown | Filmmaker Genius",
      seoDesc: "How to schedule a film shoot from the breakdown — grouping by location, cast, and day/night, respecting the constraints, and ordering strips into an efficient shooting schedule. Chapter 10 of Script Breakdown Fundamentals.",
      body: `
    <p>Scheduling is the art of arranging your strips into the most <em>efficient</em> order to shoot — because time on a film set is the single most expensive resource there is. Every minute the crew stands around while a location is changed or an actor is fetched is money burning. So you don't shoot in story order; you shoot in the order that wastes the least time. The breakdown gave you all the information you need to do this well — location, cast, day/night, and length are right there on every strip. Now you use it. Here's the logic of <strong>how to schedule a film shoot.</strong></p>

    <h2>The prime directive: group by location</h2>

    <p>The single biggest efficiency in scheduling is to shoot everything at one location before moving to the next. Moving a whole film crew — the "company move" — eats hours and money. So the first rule of scheduling is <strong>group all scenes at the same location together,</strong> regardless of where they fall in the story. If scenes 3, 42, and 88 all happen in the diner, you shoot them back-to-back on the same day (or days), then strike and move on. Your board's grouped strips become location blocks.</p>

    <div class="pullquote">You are not scheduling scenes in the order the audience will see them. You are scheduling them in the order that keeps the crew moving and the money from bleeding.</div>

    <h2>The other big levers</h2>

    <p>Within and across location groups, you balance several competing factors:</p>

    <ul class="spec-list">
      <li><b>Cast availability &amp; efficiency.</b> Shoot an actor's scenes together so you're not paying them to sit idle for days — or worse, bringing them back for a single shot. Cast numbers on the strips make this visible; a lead who's in everything anchors the whole schedule.</li>
      <li><b>Day vs. night.</b> You can't shoot day-exterior and night-exterior scenes at the same time. Group by time of day, and remember that flipping the crew from days to nights ("split days" or turnarounds) costs rest time and energy.</li>
      <li><b>Interior vs. exterior &amp; weather.</b> Exteriors depend on daylight and weather, so schedule them where you have flexibility and keep <em>cover sets</em> — interior scenes you can duck into if it rains.</li>
      <li><b>Page count per day.</b> Total the eighths for each day (Chapter III) and keep days realistic. Overloaded days blow the schedule; underloaded days waste money.</li>
      <li><b>Special needs.</b> Stunts, effects, big crowds, child actors, animals, and special equipment all have constraints — extra prep, limited hours, availability — that pull scenes to particular days.</li>
    </ul>

    <h2>Work within the constraints</h2>

    <p>Scheduling is really constrained optimization: you're solving a puzzle where every strip has requirements and you're fitting them into a fixed number of days and a fixed budget. Some constraints are hard (an actor is only available two weeks; a location is only free on weekends; the sun sets when it sets). Others are soft preferences (it'd be nice to shoot the emotional climax late in the schedule when the actors have settled in). Good scheduling honors the hard constraints absolutely and optimizes the soft ones as much as possible. There's rarely one "correct" schedule — there's the best one you can build given everything pulling against you.</p>

    <h2>From board to documents</h2>

    <p>Once the strips are ordered into days, the schedule produces the documents the whole shoot runs on: the <strong>one-line schedule</strong> (a compact list of what shoots each day), which in turn feeds the daily <strong>call sheets</strong> (who and what is needed, and when, each shooting day). Every one of those documents traces straight back to the breakdown. The chain is unbroken: script → breakdown sheets → strips → schedule → call sheet. That's why a sloppy breakdown wrecks everything downstream, and a clean one makes the whole shoot run.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My scheduling mantra is "group location, group cast, respect the light." Get those three right and you've solved eighty percent of the puzzle. The mistake I see new filmmakers make is scheduling by story order because it "feels" logical — and then paying for six company moves they could have avoided, or dragging an actor back for one line. Trust the board. Slide the strips until the diner scenes are together, the lead's days are packed, and the exteriors sit where the daylight is. The efficient schedule almost never looks like the script, and that's exactly the point.</p>
    </div>

    <p>The schedule tells you <em>when</em> everything shoots. There's one more layer that turns all of this into money and a crucial hiring document — the day-out-of-days, and how the whole breakdown feeds the budget. That's next.</p>
`,
      takeaways: [
        "You schedule for efficiency, not story order — set time is the most expensive resource on a film.",
        "Group by location first to avoid costly company moves, then balance cast, day/night, weather, and page count.",
        "Honor hard constraints absolutely (availability, daylight) and optimize soft preferences as much as you can.",
        "The schedule feeds the one-line and the call sheets — an unbroken chain from script to breakdown to set.",
      ],
    },
    {
      slug: "day-out-of-days",
      num: 11,
      roman: "XI",
      title: "Day Out of Days & Budgeting",
      desc: "Day out of days, and how the breakdown feeds the budget",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Scheduling & Delivery",
      dek: `The last documents the breakdown produces are the ones that cost real money. The day out of days tells you exactly how many days each actor works — and the breakdown, element by element, becomes the budget itself.`,
      seoTitle: "Day Out of Days & Budgeting from the Breakdown | Filmmaker Genius",
      seoDesc: "What a day out of days (DOOD) is and how the script breakdown feeds the budget — tracking each cast member's work days, and how every breakdown element becomes a line in the budget. Chapter 11 of Script Breakdown Fundamentals.",
      body: `
    <p>Once the schedule exists, two things fall out of it that turn the whole exercise into dollars: the <strong>day out of days</strong> and the <strong>budget.</strong> The day out of days (usually abbreviated <em>DOOD</em>) is a grid that tracks which days each cast member is needed — the key to hiring and paying actors correctly. And the budget is where every element you tagged in the breakdown finally becomes a number. This chapter connects the breakdown to the money, which is, ultimately, what the whole process was for.</p>

    <h2>The day out of days (DOOD)</h2>

    <p>A DOOD is a table: cast members down the side, shooting days across the top. For each actor, it marks the days they work and, crucially, their <em>first</em> and <em>last</em> day. The industry uses standard codes — commonly <strong>SW</strong> (Start Work), <strong>W</strong> (Work), <strong>H</strong> (Hold — not shooting but still booked and paid), and <strong>WF</strong> or <strong>F</strong> (Work Finish / Finish, their last day).</p>

    <div class="dood" aria-hidden="true">
      <table>
        <tr><th class="lft">Cast</th><th>D1</th><th>D2</th><th>D3</th><th>D4</th><th>D5</th><th>Total</th></tr>
        <tr><td class="lft">#1 Maya</td><td class="sw">SW</td><td class="wk">W</td><td class="wk">W</td><td class="wk">W</td><td class="fn">WF</td><td>5</td></tr>
        <tr><td class="lft">#2 Delacroix</td><td class="sw">SW</td><td class="hd">—</td><td class="wk">W</td><td class="fn">WF</td><td class="hd">—</td><td>3</td></tr>
        <tr><td class="lft">#3 Reyes</td><td class="hd">—</td><td class="sw">SW</td><td class="fn">WF</td><td class="hd">—</td><td class="hd">—</td><td>2</td></tr>
      </table>
    </div>

    <p>Read across Delacroix's row: he starts day 1, isn't needed day 2, works day 3, and finishes day 4. That gap on day 2 matters — do you pay him to <em>hold</em> (stay available) or release him and risk him being unavailable? The DOOD makes those decisions visible, which is exactly why it exists:</p>

    <ul class="spec-list">
      <li><b>It's how you pay actors right.</b> Total work days per actor drives their fee, and the start/finish dates define their booking window.</li>
      <li><b>It exposes inefficiency.</b> An actor with scattered work days and long holds is costing money — a nudge to rearrange the schedule and cluster their days.</li>
      <li><b>It's a hiring and availability document.</b> You know exactly when each actor must be available, so you can book them and plan around conflicts.</li>
    </ul>

    <p>And the DOOD is built directly from your cast numbers and schedule — those numbers you assigned back in Chapter VII are what make this grid possible.</p>

    <div class="pullquote">The day out of days is where the schedule turns into a payroll. Every "W" and every "H" is money — and clustering an actor's days is the difference between a lean budget and a bloated one.</div>

    <h2>From breakdown to budget</h2>

    <p>Here's the payoff of the entire course: <strong>every element you identified in the breakdown is a potential line in the budget.</strong> The breakdown is, in a real sense, the itemized list the budget prices out. Walk the categories:</p>

    <ul class="spec-list">
      <li><b>Cast</b> → the DOOD work days × each actor's rate.</li>
      <li><b>Background</b> → extra counts × day rate × the days they're needed.</li>
      <li><b>Props, wardrobe, set dressing</b> → purchase, rental, and build costs, item by item.</li>
      <li><b>Vehicles, animals</b> → rentals, wranglers, insurance.</li>
      <li><b>Stunts &amp; effects</b> → coordinators, performers, materials, safety.</li>
      <li><b>Special equipment</b> → crane, drone, and rig rentals for the days they appear.</li>
      <li><b>Shooting days</b> → the schedule's day count × the daily cost of running the whole crew, which is usually the biggest number of all.</li>
    </ul>

    <p>This is why an accurate breakdown is worth so much: it's the difference between a budget grounded in what the film <em>actually</em> requires and a wishful guess. Miss elements in the breakdown and they're missing from the budget — which means you find out you can't afford them on set, which is the worst possible time.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>This is the moment the breakdown pays for itself. When a financier or producer asks "why does this cost what it costs?", I don't hand them a vibe — I hand them the breakdown. Every dollar traces to an element on a sheet: this many cast days, these props, this many nights, this crane for two days. A breakdown-backed budget is <em>defensible</em>, and it's honest — it tells you early whether your script is affordable, while you can still make changes on the page instead of painful cuts on the day. The breakdown isn't paperwork. It's the truth about what your movie costs.</p>
    </div>

    <p>You've now followed the breakdown all the way to the money. The last chapter steps back to the practical realities — the software that does this work today, and the common mistakes that wreck a breakdown — so you can do it cleanly on your own productions. That's the finale.</p>
`,
      takeaways: [
        "The day out of days tracks each actor's work days with codes like SW (start), W (work), H (hold), and WF (finish).",
        "It drives how actors are paid and booked, and exposes expensive scattered work days and long holds.",
        "Every breakdown element is a potential budget line — cast, extras, props, vehicles, stunts, equipment, and shooting days.",
        "An accurate breakdown makes a defensible, honest budget — miss an element and it's missing from the money too.",
      ],
    },
    {
      slug: "script-breakdown-mistakes",
      num: 12,
      roman: "XII",
      title: "Software & Common Mistakes",
      desc: "Software, and the traps that ruin a breakdown",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Scheduling & Delivery",
      dek: `Modern software does much of the mechanical work of a breakdown — but it can't think for you. This finale covers the tools, and the handful of mistakes that sink a breakdown no matter what program you use.`,
      seoTitle: "Script Breakdown Software & Common Mistakes to Avoid | Filmmaker Genius",
      seoDesc: "Script breakdown software and the common mistakes that wreck a breakdown — missed elements, misjudged scene lengths, prop-vs-dressing confusion, and skipping the read-between-the-lines pass. The finale of Script Breakdown Fundamentals.",
      body: `
    <p>You've learned the breakdown the way it was taught for decades — marking scripts, filling sheets, moving strips — because understanding the <em>logic</em> is what makes you good at it. But in practice, most breakdowns today are done in software, and knowing the tools (and their limits) is part of the craft. This finale covers what the software does, and then gathers the <strong>common breakdown mistakes</strong> that wreck a production no matter how good your program is — your checklist for doing this cleanly on your own films.</p>

    <h2>The software</h2>

    <p>Dedicated scheduling and breakdown programs — the long-standing industry standard is Movie Magic Scheduling, alongside newer cloud tools like StudioBinder, Yamdu, and others — automate the mechanical parts of everything in this course:</p>

    <ul class="spec-list">
      <li><b>Digital breakdown sheets</b> — you tag elements on an imported script and the software builds a sheet per scene.</li>
      <li><b>Automatic eighths and page counts</b> — measured for you, and totaled per day.</li>
      <li><b>Drag-and-drop stripboards</b> — the physical board, now virtual; reorder days by dragging strips.</li>
      <li><b>Auto-generated DOOD, one-lines, and reports</b> — the downstream documents build themselves from your data.</li>
    </ul>

    <p>The software is a huge time-saver, and you should absolutely use it. But here's the essential truth: <strong>the program organizes information; it doesn't understand your film.</strong> It can't decide that "he speeds away" needs a stunt driver, or that a lamp became a prop the moment an actor swung it, or that a "rainy night" implies wet wardrobe and continuity. Those judgments are yours. The software is only as good as the breakdown <em>you</em> put into it — which is exactly why you learned to think it through by hand.</p>

    <div class="pullquote">Software counts your eighths and shuffles your strips. It will never read between the lines for you. The thinking is the job — the program just does the filing.</div>

    <h2>The common mistakes that wreck a breakdown</h2>

    <ul class="spec-list">
      <li><b>Missing elements.</b> The number-one failure — the prop, the extra, the effect nobody tagged, discovered on set when it's too late. Cure: the disciplined, category-by-category read (Chapter V).</li>
      <li><b>Ignoring the implied.</b> Only tagging what's spelled out and missing what the script quietly requires. Cure: read between every line — "what does this need that it doesn't say?" (Chapters V &amp; VIII).</li>
      <li><b>Misjudging scene length.</b> Sloppy eighths that make days look shootable when they aren't. Cure: measure honestly and total the eighths per day (Chapter III).</li>
      <li><b>Prop-vs-dressing (and category) confusion.</b> Miscategorizing so items get double-covered or dropped between departments. Cure: apply the clean category rules (Chapter VIII).</li>
      <li><b>Breaking down an unlocked script.</b> Numbers shift and the whole breakdown points at the wrong scenes. Cure: lock first, always (Chapter II).</li>
      <li><b>Forgetting continuity.</b> Missing wardrobe/makeup state and consumable props across out-of-order shooting. Cure: track story days and condition (Chapter VIII).</li>
      <li><b>Under-flagging stunts &amp; safety.</b> Treating risky action as "no big deal." Cure: if there's any risk, it's a stunt (Chapter VII).</li>
      <li><b>Trusting the software blindly.</b> Assuming the program caught everything. Cure: the tool files; you think.</li>
    </ul>

    <h2>The mindset that prevents them</h2>

    <p>Nearly every mistake above comes down to one thing: <em>completeness through discipline.</em> A great breakdown isn't clever — it's <strong>thorough.</strong> It comes from a slow, systematic, category-by-category pass where you refuse to trust a single read and you keep asking what each line quietly requires. The reward for that discipline is enormous: a schedule that holds, a budget you can defend, and a shoot where the thing you need is already on the truck. Do it carefully now, in the quiet of prep, so you're never scrambling for it in the chaos of the day.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I've done breakdowns by hand on paper and in every major program, and the software never once saved me from my own laziness — it just made a sloppy breakdown faster. The breakdowns that made my shoots run smoothly were the thorough ones, tool or no tool. So learn the software, use the software, let it do the filing and the math. But do the <em>thinking</em> yourself, slowly, one category at a time. The breakdown is the foundation the whole film stands on. Build it carefully, and everything above it holds.</p>
    </div>

    <p>That's the whole craft — from a locked script all the way to a schedule, a day-out-of-days, and a defensible budget. You can now read a screenplay the way a producer does: not as a story, but as a plan. Go break one down.</p>
`,
      takeaways: [
        "Breakdown software automates sheets, eighths, stripboards, and reports — use it, but it can't understand your film.",
        "The big mistakes: missing or implied elements, sloppy eighths, category confusion, and breaking down an unlocked script.",
        "Also fatal: forgotten continuity, under-flagged stunts, and trusting the software blindly.",
        "The cure for all of them is the same — completeness through slow, disciplined, category-by-category thinking.",
      ],
    },
  ],
};
