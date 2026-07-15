import type { Course, CourseChapter } from "../courseTypes";

export const producingDoc: Course = {
  slug: "how-to-produce-a-documentary",
  title: "Producing a Documentary",
  categoryLabel: "Production",
  subtitle: "A documentary is a true story you find, shape, and fight to tell — and the process is nothing like making a scripted film. This course walks you through the whole journey: finding your subject, the styles and techniques, funding, interviews, shooting, the all-important edit, the ethics of truth, and getting your film seen.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~98 min read",
  pairsWithName: "Filmmaker Toolbox",
  pairsWithUrl: "/toolbox",
  pairsWithDesc: "Run your documentary from the Filmmaker Toolbox — research notes, interview questions, shot lists, release tracking, and the evolving story outline — across the long journey from idea to finished film.",
  seoTitle: "Producing a Documentary: How to Make a Documentary Film | Filmmaker Genius",
  seoDesc: "A working filmmaker's guide to producing a documentary — finding your story, documentary techniques, funding, interviews, shooting, the edit, ethics, and distribution. 12 free chapters for documentary filmmakers.",
  learn: [
    "How to find a documentary subject and the story inside it",
    "Documentary styles and techniques, and how to fund and crew your film",
    "How to conduct a great interview and shoot vérité footage and B-roll",
    "Finding your film in the edit, the ethics of truth, and distribution",
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
    { key: "apply", label: "Module 3 — Putting It to Work" },
  ],
  chapters: [
    {
      slug: "what-is-a-documentary-film",
      num: 1,
      roman: "I",
      title: "What Makes a Documentary",
      desc: "What a documentary really is — and isn't",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "What Makes a Documentary: Truth, Story & Point of View | Filmmaker Genius",
      seoDesc: "What is a documentary film? A working filmmaker on what a documentary really is — a shaped, authored take on reality, not neutral truth — and why that understanding changes how you make one. Chapter 1 of Producing a Documentary.",
      dek: `"A documentary just shows what really happened." That's the most common misconception in nonfiction filmmaking, and letting go of it is the first real step. A documentary is not neutral, unmediated reality — it's a <em>shaped, authored take</em> on reality, built from thousands of choices about what to film, what to leave out, and how to tell it. Understanding that changes everything about how you make one.`,
      body: `<p>Let's define it properly. A documentary is a film that deals with reality — real people, real events, the actual world — rather than fiction. But the word "reality" hides the crucial subtlety: a documentary is not reality itself; it's a <em>representation</em> of reality, made by a filmmaker who chooses where to point the camera, what to include, whom to interview, how to order the material, what music to lay under it, and where to cut. Every one of those choices shapes the meaning. Two filmmakers can point their cameras at exactly the same real event and produce two completely different, both "true," documentaries. This isn't a flaw or a form of dishonesty — it's the fundamental nature of the medium. A documentary is an <strong>authored, subjective take on the real world</strong>, and the sooner you accept that you're not a neutral window onto truth but an author making a truthful argument, the sooner you can make a documentary that's actually about something.</p>

<h2>What a documentary really is</h2>

<p>The core truths of the form:</p>

<ul class="spec-list">
  <li><b>It deals with the real.</b> Real people, events, and the actual world — not scripted fiction with actors. That's the line between documentary and drama.</li>
  <li><b>But it's shaped, not neutral.</b> Every documentary is built from choices — framing, selection, structure, edit — that create meaning. There is no such thing as an unauthored, purely objective documentary.</li>
  <li><b>It has a point of view.</b> The best docs are <em>about</em> something — they make an argument, explore a question, or express a perspective. A pile of true footage with no viewpoint isn't a film, it's raw material.</li>
  <li><b>It's still a story.</b> Documentaries use the tools of storytelling — character, tension, arc, revelation — applied to real material. You're finding and telling a story, not just recording events.</li>
  <li><b>Truth is a responsibility, not an alibi.</b> "It's a documentary, it's true" doesn't excuse shaping the material dishonestly. Because you're authoring, you carry an ethical duty to be fair and honest (Chapter 10).</li>
  <li><b>The genre is enormous.</b> Vérité, interview films, essay films, nature docs, true crime, personal films, archival histories — "documentary" spans a vast range of forms and approaches (Chapter 3).</li>
</ul>

<h2>You are an author, not a window</h2>

<p>The single mindset shift that makes someone a documentary filmmaker rather than a person with a camera pointed at reality is this: <strong>you are the author of a truthful film, not a neutral window onto the truth — and embracing that authorship is what lets you make a film that means something.</strong> Beginners often approach documentary passively, imagining their job is to simply capture what happens and let the truth "speak for itself." But truth doesn't speak for itself; footage of real events, unshaped, is usually shapeless and dull, and the meaning only emerges when a filmmaker finds the story, the argument, the point of view within it. This is liberating rather than limiting, because it means a documentary is a genuinely <em>creative</em> act: you get to decide what your film is about, what question it asks, what it wants the audience to feel and think, and then you use all the choices available to you — who you film, how, and how you assemble it — to make that meaning land. It also comes with the responsibility we'll return to throughout this course: because you're shaping reality, you owe it to your subjects and your audience to shape it <em>honestly</em> — to be fair, to not distort, to represent people truthfully even as you author your take. The great documentaries hold both of these at once: a strong, clear authorial point of view <em>and</em> a deep respect for the truth of what they're filming. That balance — authored but honest, subjective but fair — is the essence of the form, and it's the standard this whole course works toward. So don't think of your documentary as a recording of reality. Think of it as a truthful film you are going to author out of reality: you'll find a subject and the story inside it (Chapter 2), choose a style and technique to tell it (Chapter 3), and then research, fund, shoot, and edit your way to a finished film that says something true about the world. Once you see yourself as the author rather than the window, everything else in this course is craft in service of that authorship. Let's begin where every documentary begins — with finding your subject and the story hiding inside it.</p>

<div class="pullquote">Truth doesn't speak for itself. A documentary is an authored, subjective take on the real world — you're not a neutral window onto the truth, you're the author of a truthful film.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>My first documentary failed because I thought my job was to just capture what happened and let it "speak for itself." I came back with hours of true, real footage and no film, because I hadn't decided what it was <em>about</em>. The moment I stopped seeing myself as a neutral recorder and started seeing myself as an author — someone making a truthful argument out of reality — the film appeared. I chose the question, the point of view, the story I was finding in the material. Documentary isn't stenography; it's authorship with a duty to the truth. Decide what your film means, then honor the reality while you say it.</p>
</div>`,
      takeaways: [
        "A documentary deals with reality but is not neutral — it's a shaped, authored representation built from thousands of choices.",
        "The best docs have a point of view and tell a story — footage without a viewpoint is raw material, not a film.",
        "You're the author of a truthful film, not a window onto truth — embracing that authorship is what makes a film mean something.",
        "With authorship comes responsibility — shape reality honestly and fairly. The form is authored but honest, subjective but fair.",
      ],
    },
    {
      slug: "finding-a-documentary-subject",
      num: 2,
      roman: "II",
      title: "Finding Your Subject & Story",
      desc: "Finding a subject, and the story hiding inside it",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Finding Your Documentary Subject & Story | Filmmaker Genius",
      seoDesc: "How to find a documentary subject and the story inside it — what makes a filmable subject, access and character, and the difference between a topic and a story. A working filmmaker's guide. Chapter 2 of Producing a Documentary.",
      dek: `Every documentary begins with a subject — but a subject is not yet a film. "Bees are dying" is a topic; a beekeeper fighting to save her last hive is a story. Learning to see the difference, and to find the story hiding inside a subject, is the most important creative skill in documentary. Here's how to find a subject worth years of your life, and the story inside it.`,
      body: `<p>The most important distinction in documentary is between a <strong>topic</strong> and a <strong>story</strong>, and confusing them is why so many documentaries feel like homework. A topic is a subject area — climate change, jazz, homelessness, a war. A story is a specific human thread with characters, tension, stakes, and an arc <em>within</em> that topic — a particular person wanting a particular thing and struggling to get it. Audiences don't fall in love with topics; they fall in love with stories, with people they care about facing real conflict. So the job at this stage isn't just to pick an interesting subject; it's to find, inside that subject, a story you can actually follow — a character, a journey, a question with stakes. And because a documentary can consume years of your life, you want to choose a subject and story you're genuinely obsessed with, because that obsession is what will carry you through the long, hard middle when the film fights you.</p>

<h2>What makes a documentary subject filmable</h2>

<p>Assess a potential subject against these:</p>

<ul class="spec-list">
  <li><b>Is there a story, not just a topic?</b> Can you find a specific human thread — a character wanting something, facing conflict, with stakes and a possible arc — inside the subject? If it's just "an important issue," keep digging for the story.</li>
  <li><b>Is there a compelling character?</b> Documentaries live on people the audience connects with. A vivid, real, watchable person at the center is often worth more than a fascinating issue with no one to follow.</li>
  <li><b>Do you have access?</b> Can you actually film this — get to the people, the places, the events? A great story you can't access isn't a film. Access is as important as the story itself.</li>
  <li><b>Is something happening (or about to)?</b> Unfolding events, a deadline, a change, a struggle with an outcome you can film in real time gives you drama. A static situation is harder to make cinematic.</li>
  <li><b>Are you obsessed with it?</b> Docs take years. Pick something you care about so deeply you'll still be fighting for it when it gets hard — your passion is the fuel that finishes the film.</li>
  <li><b>Does it say something?</b> The best subjects let you explore a bigger idea or truth through the specific story — the particular becomes universal.</li>
</ul>

<h2>Find the story inside the subject</h2>

<p>Here's the creative work that separates a documentary that grips from one that informs and bores: <strong>you find a subject you care about, and then you hunt within it for the story — the specific people, conflict, and stakes that will carry an audience through your film.</strong> This is a search, and it's often the hardest and most important part of development. You might start with a broad interest ("I want to make a film about the fishing industry's collapse") and then dig until you find the human story that <em>embodies</em> it — one family's boat, one captain's last season, one town's fight to survive. That specific story, told well, will illuminate the whole subject far more powerfully than a broad survey of the issue, because the audience experiences the big theme through people they've come to care about. The classic documentary wisdom is that <em>the particular is universal</em>: the more specific and personal your story, the more universally it lands. So resist the temptation to make "the definitive film about X." Instead, find the small, specific, human story that lets the audience feel X. Look for character above all — a real person who is vivid, watchable, and going through something, ideally someone with a want and an obstacle. Look for a situation that will <em>change</em> over the time you can film it, because change is drama. And look for access, because a story you can't get into is not a story you can tell. It's also worth being honest that this stage takes patience and often false starts — you may develop a subject for months before realizing the story isn't there, or discover a much better story than the one you started with. That's normal; the search for the right story is real work, not a failure. And through it all, weigh your own obsession heavily, because the practical reality is that documentaries are marathons, frequently years long, with funding struggles and access problems and edits that break your heart, and the thing that gets you to the finish line is a deep, personal need to tell <em>this</em> story. Choose a subject and a story you can't not make. Find the specific human thread inside it. Confirm you can access it and that something's happening. Do that, and you've laid the foundation everything else in this course builds on — because with the right subject and story, the film has a chance; with the wrong one, no amount of craft will save it. Next, we look at the different styles and techniques you can use to tell that story.</p>

<div class="pullquote">"Bees are dying" is a topic; a beekeeper fighting to save her last hive is a story. Audiences fall in love with stories and people, never with topics.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>My best documentary started as a film "about" a whole social issue and went nowhere for months — because a topic isn't a film. It only came alive when I found one family living the issue, with a real want, a real obstacle, and something unfolding I could film. Suddenly the big subject had a face and a heartbeat, and the audience could feel the theme through people they cared about. Now the first question I ask of any idea is: where's the story, who's the character, and can I film it? And the second is: do I care about this enough to spend years on it? If the answer to both isn't yes, I keep looking.</p>
</div>`,
      takeaways: [
        "A topic is a subject area; a story is a specific human thread with character, conflict, and stakes inside it — audiences love stories, not topics.",
        "Assess subjects for a real story, a compelling character, access, something unfolding, and whether it says something bigger.",
        "Find the specific human story inside the subject — the particular is universal; the small personal story illuminates the big theme.",
        "Choose something you're obsessed with — docs are years-long marathons, and your passion is what carries the film to the finish.",
      ],
    },
    {
      slug: "documentary-filmmaking-techniques",
      num: 3,
      roman: "III",
      title: "Documentary Styles & Techniques",
      desc: "Vérité, interview-driven, essay — the documentary modes",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Documentary Styles & Filmmaking Techniques | Filmmaker Genius",
      seoDesc: "Documentary filmmaking techniques and styles — vérité, interview-driven, essay, observational, and participatory modes — and how to choose the right approach for your story. A working filmmaker's guide. Chapter 3 of Producing a Documentary.",
      dek: `"Documentary" isn't one thing — it's a family of very different approaches, from fly-on-the-wall vérité to talking-head interviews to poetic essay films. Each style tells the truth in its own way and asks different things of you as a filmmaker. Knowing the main modes, and choosing the right one for your story, is a foundational creative decision that shapes everything that follows.`,
      body: `<p>Beginners often imagine there's one "documentary" way to make a film — usually the talking-head-plus-narration style they've seen on TV. In reality, documentary is an enormous, flexible form with several distinct <strong>modes</strong>, each with its own relationship to truth, to the subject, and to the audience. A fly-on-the-wall observational film that never interviews anyone and a heavily narrated essay film built from archive footage are both documentaries, but they're almost opposite crafts. Understanding the main styles matters for two reasons: first, so you can borrow techniques from across the whole tradition rather than defaulting to one look; and second, so you can consciously <em>choose</em> the approach that best serves your particular story — because the right style makes a film sing, and the wrong one fights it.</p>

<h2>The main documentary modes</h2>

<p>The major approaches you can draw from:</p>

<ul class="spec-list">
  <li><b>Observational / vérité.</b> Fly-on-the-wall — the camera observes life unfolding with minimal intervention, no narration, no interviews. It aims to let reality play out and the audience to feel present. Demands patience and access (Chapter 8).</li>
  <li><b>Interview-driven / expository.</b> Built on interviews and often narration that explains and argues. The most common informational style — great for conveying ideas, history, and multiple perspectives (Chapter 7).</li>
  <li><b>Participatory.</b> The filmmaker is present and interacts with the subjects on camera — asking, provoking, participating. The film acknowledges the maker's role rather than hiding it.</li>
  <li><b>Essay / poetic.</b> A personal, argumentative, or lyrical film that uses image, sound, and voice to explore an idea or feeling, often loosely structured and author-forward. Freer and more experimental.</li>
  <li><b>Archival / historical.</b> Built largely from existing footage, photos, and documents, often with narration and interviews, to tell a story from the past. Rights and research are central (Chapters 4, 11).</li>
  <li><b>Hybrid and mixed.</b> Most real documentaries blend modes — an observational film with a few interviews, an essay film with vérité sequences. You mix the tools to serve the story.</li>
</ul>

<h2>Choose the style that serves the story</h2>

<p>Here's how to think about it as a filmmaker: <strong>the style isn't a matter of taste or fashion — it's a decision about how best to tell <em>your</em> specific story, driven by what your story is and what you can access.</strong> Each mode is a different tool with different strengths, and the right choice flows from the material. If your story is an unfolding event you have deep access to and the drama lives in watching it happen, observational vérité may be perfect — you can capture life in real time and let the audience feel present. If your story is about ideas, history, or multiple viewpoints that need explaining, an interview-driven approach will serve you better, because interviews and narration can convey information and argument that pure observation can't. If your story is deeply personal or you the filmmaker are part of it, participatory or essay approaches let you bring your own voice in honestly. If your story is historical, you'll lean on archival material and the research and rights work that entails. And in practice, you'll almost certainly <em>blend</em> modes, because most great documentaries are hybrids — an observational spine with a few key interviews, an essayistic voice threading through vérité footage. The practical guidance is to let the story lead: rather than deciding "I want to make a vérité film" and forcing your subject into it, ask "what does this story need to be told truthfully and powerfully?" and let that answer choose your approach. It's also wise to know the demands of each mode before you commit, because they ask very different things of you — vérité demands enormous patience, time, and access and gives you little control; interview-driven work demands strong interviewing and a clear thesis; archival demands research and rights budgets. Choosing a style you can't actually execute (a vérité film you don't have the access or time for, an archival film you can't afford the footage rights for) is a common and painful mistake. So match the style not just to the story but to your real resources. And remember that within your chosen approach, you have the whole documentary toolkit to draw from — you're not locked into one look. Get this decision right and everything downstream — how you shoot, who you interview, how you edit — has a clear north star; get it wrong and you'll fight your own film. With your subject, story, and style chosen, the next chapter turns to the unglamorous but essential work that turns an idea into a real project: research and development.</p>

<div class="pullquote">The style isn't a matter of taste — it's a decision about how best to tell your specific story. Let the story choose the approach, not the other way around.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once tried to force a story into vérité because I loved the observational style — but I didn't have the access or the years it needed, and the film starved. The story actually wanted interviews and a clear argument, and the moment I switched approaches, it came alive. Lesson learned: I now choose the style from the story and my real resources, not from what look I'm in love with. Ask what the story needs to be told truthfully and powerfully, be honest about what you can actually pull off, and mix the modes freely. The style serves the story, never your ego about the style.</p>
</div>`,
      takeaways: [
        "Documentary is a family of modes — observational/vérité, interview-driven, participatory, essay, and archival — each a different craft.",
        "Each mode has its own relationship to truth and its own demands; most real docs blend several to serve the story.",
        "Choose the style from what your story needs and what you can access — let the story lead, not a look you're in love with.",
        "Know each mode's demands and match the approach to your real resources — the right style makes a film sing, the wrong one fights it.",
      ],
    },
    {
      slug: "documentary-research-and-development",
      num: 4,
      roman: "IV",
      title: "Research & Development",
      desc: "Research, access, and developing the project",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Documentary Research & Development: Turning an Idea Into a Project | Filmmaker Genius",
      seoDesc: "Documentary research and development — deep research, building access and trust, the treatment and pitch, and developing your idea into a real project. A working filmmaker's guide. Chapter 4 of Producing a Documentary.",
      dek: `Before you shoot a frame, you develop the project — and this unglamorous phase is where documentaries are quietly won or lost. Deep research makes you an expert on your subject, building access and trust opens the doors you'll need, and a strong treatment turns your idea into something people will fund. Here's how to develop a documentary from a spark into a real, fundable project.`,
      body: `<p>Development is the bridge between "I have an idea" and "I'm making a film," and it's where the professionals separate from the amateurs. Two things happen in this phase, and both are essential. First, <strong>research</strong>: you go deep on your subject until you know it better than almost anyone — the facts, the history, the people, the existing coverage, the nuances. This makes your film accurate and credible, reveals the real story (often different from what you first imagined), and, crucially, makes you someone your subjects and funders can trust. Second, <strong>development of the project itself</strong>: you build the access and relationships you'll need to actually film, and you package your idea into a treatment and pitch that can attract funding and collaborators. Skipping or rushing this phase is one of the most common reasons documentaries collapse — filmmakers who start shooting before they've done the research and secured the access often find the film falls apart underneath them.</p>

<h2>The work of development</h2>

<p>What developing a documentary actually involves:</p>

<ul class="spec-list">
  <li><b>Deep research.</b> Read everything, watch everything, talk to experts and people close to the subject. Become the expert. Research reveals the real story and protects you from getting facts wrong.</li>
  <li><b>Build access.</b> Identify who and what you need to film, and start building the relationships and permissions to get there. Access is everything — a story you can't film isn't a film (Chapter 2).</li>
  <li><b>Earn trust.</b> Your subjects are letting you into their lives. Trust is built slowly, through honesty, respect, and time — and it's the foundation of everything you'll capture. Rushing or betraying trust ends films.</li>
  <li><b>Write the treatment.</b> A treatment is the document that describes your film — the story, characters, style, and why it matters — and it's your key tool for attracting funding and collaborators (Chapter 5).</li>
  <li><b>Test with a shoot.</b> Often you shoot a small amount early — a "sizzle" or teaser — both to test whether the film works and to show funders what it will be. Development and early production overlap.</li>
  <li><b>Stay open to the real story.</b> Research and early access usually reveal that the actual story is different (and often better) than your first idea. Let the material reshape your plan — rigidity kills docs.</li>
</ul>

<h2>Trust and access are the real foundation</h2>

<p>Of everything in development, the most important — and the most often underestimated — is the human work of <strong>building access and trust with the people your film depends on.</strong> A documentary lives or dies on getting into rooms, lives, and moments that matter, and you only get there when the people involved trust you enough to let you in. This trust is not a formality you secure with a signed release; it's a real human relationship built over time through honesty about what you're doing, respect for your subjects, reliability, and genuine care. Documentary filmmakers often spend months or years earning the trust that lets them capture the intimate, revealing, true moments that make a great film — and they know that this trust is sacred, because betraying it doesn't just end one film, it can harm real people and close doors forever. This has practical consequences for development. You invest in relationships before you need them; you're transparent with your subjects about your intentions and your film's point of view; you show up, follow through, and treat people as collaborators in telling a true story rather than material to be extracted. And you recognize that access can be fragile — a subject can withdraw, a door can close — so you nurture these relationships continuously, not just at the start. There's also a strategic layer: the research you do makes you credible and trustworthy in the eyes of subjects and funders alike, because a filmmaker who deeply understands the subject earns respect that a dilettante never will. So research and relationship-building reinforce each other — the deeper your knowledge, the more people trust you with access; the more access you have, the richer your understanding. Together they form the foundation that the entire film is built on. And through it all, hold the humility to let the real story emerge: development almost always reveals that the film you'll actually make is different from the one you imagined, because reality is more surprising than your assumptions, and the filmmakers who stay rigid to their original idea miss the better film in front of them. So develop your project seriously before you commit to production: go deep on the research until you're the expert, build the access and trust the film requires, write a treatment that captures it, and stay open to the real story reshaping your plan. Do this well and you head into production with knowledge, relationships, and a clear vision — the three things that give a documentary a real chance. Skip it, and you're likely to find the film dissolving underneath you when you need it most. With the project developed, the next chapter tackles the challenge that stops more documentaries than any other: funding.</p>

<div class="pullquote">A documentary lives or dies on access — and access lives or dies on trust. That trust is a real human relationship, built slowly, and it's sacred: betray it and you don't just lose a film, you harm real people.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The best footage in any doc I've made came from moments people only let me film because they trusted me — trust I'd spent months earning by being honest, showing up, and treating them as collaborators, not content. I've also watched films die because a filmmaker rushed the access or, worse, betrayed a subject's trust for a "better" scene, and the doors slammed shut. Development taught me that research makes you credible and relationships make you trusted, and those two things are the real foundation. Go deep, earn the trust, and stay humble enough to let the true story emerge — it's almost always better than the one you planned.</p>
</div>`,
      takeaways: [
        "Development bridges idea and film — deep research makes you the expert and reveals the real story; skipping it collapses documentaries.",
        "Build access and earn trust — the film depends on getting into rooms and moments, which only trust unlocks, and write a treatment to attract funding.",
        "Trust is a real, slowly-built human relationship and it's sacred — betraying it harms real people and ends films.",
        "Stay open — development usually reveals the real story is different and better than your first idea; let the material reshape the plan.",
      ],
    },
    {
      slug: "how-to-fund-a-documentary",
      num: 5,
      roman: "V",
      title: "Funding Your Documentary",
      desc: "Grants, crowdfunding, and paying for a doc",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "How to Fund a Documentary: Grants, Crowdfunding & More | Filmmaker Genius",
      seoDesc: "How to fund a documentary — grants, crowdfunding, broadcasters and streamers, sponsors, and self-funding — plus the treatment and trailer that win money. A working filmmaker's guide. Chapter 5 of Producing a Documentary.",
      dek: `Funding stops more documentaries than any other single obstacle. Docs rarely have a clear commercial path, so the money is pieced together from grants, crowdfunding, broadcasters, sponsors, and often your own pocket — usually all at once. Here's the map of how documentaries actually get paid for, and the tools you need to win the money.`,
      body: `
<p>Here's the honest reality: documentaries are hard to fund, and figuring out the money is one of the biggest challenges of the whole endeavor. Unlike a commercial feature with a clear path to box-office returns, most documentaries don't have an obvious way to make money back, which makes traditional investment difficult. So documentary funding is usually a <em>patchwork</em> — you assemble the budget from multiple sources, each contributing a piece, rather than landing one big check. Grants, crowdfunding, a broadcaster or streamer, a sponsor or foundation aligned with your subject, and frequently your own money and deferred labor all combine to get the film made. This patchwork approach is normal, and the filmmakers who succeed are the ones who understand the landscape of sources, tailor their pitch to each, and are relentless and resourceful about stitching the money together. The other key truth: to raise money you need <strong>proof</strong> — a strong treatment and, above all, a compelling teaser or trailer that shows funders what the film will be.</p>

<h2>Where documentary money comes from</h2>

<p>The main funding sources, usually combined:</p>

<ul class="spec-list">
  <li><b>Grants.</b> Foundations, arts councils, film funds, and organizations tied to your subject offer grants for documentaries — often the backbone of indie doc funding. Researching and applying to the right grants is a core skill.</li>
  <li><b>Crowdfunding.</b> Platforms let you raise money directly from an audience who believes in your film. Great for early funds and building a community around the project — but it's a serious campaign, not a magic button.</li>
  <li><b>Broadcasters &amp; streamers.</b> TV channels, streaming services, and documentary strands commission or acquire films. A pre-sale or commission can fund production, but access is competitive and usually needs a track record or strong package.</li>
  <li><b>Sponsors, foundations &amp; NGOs.</b> Organizations aligned with your subject may fund a film that advances a cause they care about — powerful for issue-driven docs, with care to protect editorial independence.</li>
  <li><b>Investors &amp; impact funds.</b> Some docs attract investment or impact capital, especially those with a distribution path or a social mission. Rarer, but real for the right project.</li>
  <li><b>Self-funding &amp; deferral.</b> Many docs start (and some finish) on the filmmaker's own money, credit, and unpaid labor. Common reality — but budget your own sustainability, don't ruin yourself.</li>
</ul>

<h2>Win the money with proof and persistence</h2>

<p>Two things determine whether you actually raise the money, beyond having a good idea. The first is <strong>proof that the film will be good</strong>, because funders don't fund ideas, they fund evidence. Your two key tools are a strong <em>treatment</em> (the document from Chapter 4 that describes the story, characters, style, and why the film matters) and — most powerful of all — a compelling <em>teaser or trailer</em> shot from a little early footage. Funders and audiences respond far more to a few minutes of actual film that captures the tone, the characters, and the promise than to any amount of description, so investing in a strong sizzle reel early is often the single best fundraising move you can make. It shows you can execute, it makes the film feel real, and it lets people fall in love with your subjects. The second determinant is <strong>persistence and resourcefulness</strong>, because documentary funding is a long, patchwork grind of many applications, pitches, and rejections. You'll apply to many grants and win a few; you'll pitch many broadcasters and hear no from most; you'll run a crowdfunding campaign that takes weeks of hustle. The filmmakers who get funded aren't usually the ones with one brilliant source, but the ones who patiently stitch together five or six partial ones and refuse to quit through the rejections. This has practical implications: you research funding sources as seriously as you research your subject, you tailor each pitch to what that particular funder cares about, you build the relationships (many funders back people they know and trust), and you treat fundraising as an ongoing part of the job across the film's whole life, not a one-time task. It's also wise to be strategic about <em>when</em> you need money — development funds, production funds, and post/finishing funds often come from different sources, and you fundraise in stages rather than trying to raise everything at once. And through all of it, protect your editorial independence: money can come with strings, especially from sponsors and cause-driven funders, and part of the job is accepting support without letting a funder dictate the truth of your film (a theme that connects to the ethics of Chapter 10). Funding a documentary is genuinely hard, and it's okay to find it the least fun part of the process — but it's the part that determines whether the film exists at all, so approach it with the same seriousness and creativity you bring to the filmmaking. Make a compelling teaser, research and tailor your pitches, stitch the patchwork together, and persist through the rejections, and you can find the money to make your film. With funding underway, the next chapter turns to the practical business of actually shooting it — the crew and gear a documentary needs.</p>

<div class="pullquote">Funders don't fund ideas, they fund evidence. A few minutes of actual film that captures your subjects is worth more than any amount of description — the teaser is your best fundraising tool.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>Documentary funding is a patchwork grind, and I've made peace with that. The film that finally got made came together from a grant, a crowdfunding campaign, a small broadcaster pre-sale, and a chunk of my own money — five sources, none of them the whole thing, all of them stitched together over more than a year of applications and rejections. What unlocked most of it was a three-minute teaser I scraped together early; the moment funders could <em>see</em> the film and feel the characters, doors opened that no written pitch had budged. Make the proof, tailor every ask, and don't quit through the no's. The film exists because I out-lasted the rejections.</p>
</div>
`,
      takeaways: [
        "Documentaries are hard to fund and rarely land one big check — the money is a patchwork of grants, crowdfunding, broadcasters, sponsors, and self-funding.",
        "Funders fund evidence — a strong treatment and, above all, a compelling teaser or trailer are your key tools to win money.",
        "Success comes from persistence and resourcefulness — research and tailor pitches, build relationships, fundraise in stages, and outlast the rejections.",
        "Protect your editorial independence — accept support without letting a funder dictate the truth of your film.",
      ],
    },
    {
      slug: "documentary-crew-and-equipment",
      num: 6,
      roman: "VI",
      title: "The Crew & Gear",
      desc: "The small doc crew and the gear you actually need",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "The Documentary Crew & Equipment You Actually Need | Filmmaker Genius",
      seoDesc: "The documentary crew and gear that matters — the small nimble team, the key roles, and why sound and a run-and-gun kit beat a big camera. A working filmmaker's guide. Chapter 6 of Producing a Documentary.",
      dek: `A documentary crew is the opposite of a film crew: small, nimble, and often just a person or two. The whole game is to be unobtrusive enough that real life keeps happening in front of you. That principle — small and invisible over big and impressive — drives every decision about who you bring and what gear you carry. Here's the crew and kit a doc actually needs.`,
      body: `
<p>The defining principle of documentary production is <strong>be small and unobtrusive</strong>, because a documentary depends on real life happening naturally in front of the camera, and real life stops happening the moment you roll in with a big crew, big lights, and big gear. A ten-person unit turns a real moment into a production; a single filmmaker with a small camera can disappear into the background and capture the truth. So a documentary crew is tiny — sometimes just you, often a director/shooter plus a sound recordist, occasionally a slightly bigger team for a bigger production. And the gear follows the same logic: you want a nimble, run-and-gun kit that lets you move fast, shoot in any conditions, and stay invisible, rather than the heavy cinema package a scripted film uses. This is genuinely liberating for the low-budget filmmaker, because documentary is one of the few forms where a very small operation is not a compromise but often the <em>correct</em> approach — small is a feature, not a bug.</p>

<h2>The small doc crew and kit</h2>

<p>What a documentary actually needs:</p>

<ul class="spec-list">
  <li><b>Director / shooter.</b> Often the same person — the one who knows the story, builds the relationships, and operates the camera. On docs, the director is frequently right there with the camera, which keeps the unit tiny and the subjects comfortable.</li>
  <li><b>Sound recordist.</b> The most valuable second person on most docs, because sound is critical and hard to do well while also shooting. Good documentary sound is often the difference between usable and unusable footage (see the Production Sound course).</li>
  <li><b>A producer.</b> Handling logistics, access, releases, and the endless coordination — sometimes the same person, sometimes a dedicated partner. The producer keeps the long campaign on track.</li>
  <li><b>A run-and-gun camera.</b> A capable, portable camera you can operate solo and move fast with — mirrorless, a doc-oriented camcorder, even a phone. Nimbleness and low light beat cinema-camera specs for most docs.</li>
  <li><b>Great sound gear.</b> A good mic (shotgun and/or lavs), a recorder, and headphones — invest here, because audiences forgive imperfect image far more than bad sound, especially with interviews and vérité.</li>
  <li><b>The invisible kit.</b> Minimal lighting (or available light), a monopod or gimbal for mobility, plenty of batteries and cards, and a small bag. Everything chosen so you can move, react, and stay unobtrusive.</li>
</ul>

<h2>Small and nimble beats big and impressive</h2>

<p>The through-line of this chapter, and a genuine advantage for anyone making a documentary on a budget, is that <strong>a small, nimble, unobtrusive operation isn't just cheaper — it usually produces better documentary, because it lets reality unfold naturally.</strong> This is one of the places where documentary's constraints and its virtues align perfectly. The scripted-film instinct is that more crew and more gear equal higher production value, but in documentary the opposite is often true: the bigger your footprint, the more you distort the very reality you're trying to capture. People behave differently when a big crew is watching; intimate moments don't happen with lights and a boom in the room; access is easier to get and keep when you're one quiet person rather than an intimidating unit. So the professional documentary approach is to strip down to the minimum that lets you capture the story well — usually a director/shooter and a sound person — and to choose gear for mobility, low-light capability, and invisibility rather than for spec-sheet impressiveness. This has real practical benefits beyond aesthetics: a tiny crew is cheaper (crucial given the funding realities of Chapter 5), faster to move, able to react to unpredictable real events, and welcome in places a big unit would be turned away from. The two places <em>not</em> to skimp are sound and the relationships: invest in good audio gear and, ideally, a dedicated sound person, because documentary audio is uniquely demanding and audiences won't forgive bad sound; and remember that the most important "equipment" you bring is the trust and access you built in development (Chapter 4), which no camera can substitute for. It's also worth noting that the right kit depends on your style (Chapter 3): a vérité film needs maximum mobility and stealth, an interview-driven film needs a more considered setup for the interviews (Chapter 7) plus a run-and-gun kit for B-roll, an archival film needs less field gear at all. Match the crew and gear to the style and the story. But whatever your approach, resist the temptation to over-crew and over-gear; the documentary filmmaker's superpower is the ability to be small enough that the truth keeps happening in front of the lens. Embrace the small operation, invest in sound, protect your access, and choose every piece of gear to serve invisibility and mobility. Do that, and you'll be equipped to capture real life as it actually happens — which is the whole point. Next, we tackle the single most important shooting skill in most documentaries: the interview.</p>

<div class="pullquote">A ten-person unit turns a real moment into a production; one filmmaker with a small camera disappears and captures the truth. In documentary, small is a feature, not a bug.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The most intimate footage I've ever captured happened because I was one quiet person with a small camera and a sound recordist, not a crew. The moment a big unit rolls in with lights, real life stops and performance begins — people stiffen, intimacy vanishes, and access dries up. So I keep my documentary footprint tiny on purpose: it's cheaper, faster, more welcome, and it lets the truth keep happening. The only places I spend real money are sound and the trust I've built with the people I'm filming. Small and invisible isn't the budget version of documentary — it's often the best version.</p>
</div>
`,
      takeaways: [
        "A documentary crew is tiny — often a director/shooter plus a sound recordist — because a big footprint stops real life from happening.",
        "Gear is nimble and run-and-gun — a portable camera, great sound kit, minimal lighting — chosen for mobility and invisibility, not spec-sheet impressiveness.",
        "Don't skimp on sound or relationships — invest in audio, and remember your trust and access are the most important \"equipment.\"",
        "Small and nimble usually makes better documentary — it's cheaper, faster, more welcome, and lets reality unfold naturally.",
      ],
    },
    {
      slug: "documentary-interview-techniques",
      num: 7,
      roman: "VII",
      title: "The Documentary Interview",
      desc: "The heart of most docs — getting real answers",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "The Documentary Interview: How to Get Real Answers | Filmmaker Genius",
      seoDesc: "Documentary interview techniques — building trust, asking open questions, listening, the silence, and getting real, emotional, story-driven answers on camera. A working filmmaker's guide. Chapter 7 of Producing a Documentary.",
      dek: `The interview is the beating heart of most documentaries — and doing it well is a real, learnable skill that has almost nothing to do with your list of questions. A great documentary interview is a conversation built on trust, where you ask less and listen more, and where the truest, most emotional answers come in the moments you didn't plan. Here's how to get them.`,
      body: `
<p>The single biggest misconception about documentary interviewing is that it's about asking good questions. It isn't — it's about creating the conditions for someone to tell you the truth, and then <em>listening</em> well enough to follow it. A prepared list of questions is a safety net, not a script; the best material almost never comes from your planned questions but from where the conversation wanders, from the follow-up you asked because you were actually listening, and from the silence you let sit until the person filled it with something real. A documentary interview is really a <strong>trusting conversation</strong> in which your job is to make the subject comfortable, ask open questions that invite story rather than yes/no answers, listen with total attention, and get out of the way so the person can be honest and human on camera. Master that, and your interviews will yield the emotional, revealing, story-driving material that makes a documentary land. Rely on your question list and interrupt with the next question, and you'll get flat, guarded, useless answers.</p>

<h2>How to conduct a great interview</h2>

<p>The techniques that get real answers:</p>

<ul class="spec-list">
  <li><b>Build trust and comfort first.</b> Spend time before you roll, be warm and human, explain what you're doing, and put the person at ease. A relaxed subject who trusts you tells the truth; a nervous one performs. This starts long before the interview (Chapter 4).</li>
  <li><b>Ask open questions.</b> "Tell me about the day it happened" invites a story; "Were you scared?" invites "yes." Ask questions that open up narrative and feeling, not ones that can be answered in a word.</li>
  <li><b>Listen more than you talk.</b> The interview is about them, not your questions. Listen so fully that your best questions become spontaneous follow-ups to what they just said. Real listening is the whole skill.</li>
  <li><b>Use the silence.</b> When someone finishes, wait. The pause is uncomfortable, and people fill it — often with the deeper, truer, more emotional thing they were holding back. Don't rush to the next question.</li>
  <li><b>Have them restate the question.</b> Because you usually cut your own voice, ask them to answer in complete statements ("The day the factory closed, I..." not "It was awful"), so the answer stands alone in the edit.</li>
  <li><b>Go for the story and the feeling.</b> Ask for specific memories, moments, and emotions, not opinions and summaries. "What did you see when you walked in?" beats "How did you feel about the situation?"</li>
</ul>

<h2>Ask less, listen more, and honor the person</h2>

<p>If you take one principle from this chapter, make it this: <strong>the quality of a documentary interview is determined far more by how you listen than by what you ask.</strong> Beginners over-prepare their questions and then, anxious to get through the list, half-listen while planning their next question — and they miss the gold, because the gold is almost always in the response to the question they didn't plan, the one that only occurred to them because they were truly hearing what the person said. So prepare your questions thoroughly, then set the list aside and be present. Follow the person where they go. When they touch something real, lean in and ask more about <em>that</em>, not about item seven on your list. Let silences breathe. Ask "why" and "tell me more" and "what was that like." Treat the interview as a conversation you're genuinely having, not a checklist you're completing, and the person will feel the difference and open up. This connects to everything else in this course: the interview only works because of the trust you built in development (Chapter 4), and that trust carries an ethical weight — the person is being vulnerable with you, often telling you painful or private things, and you owe them respect for that vulnerability both in the room and later in the edit (Chapter 10). Never manipulate someone into a moment they'll regret, never betray the trust that got you the honesty, and remember that a real person's dignity matters more than any powerful soundbite. There's also craft in the mechanics: think about where you place the person and camera (an interview setup is one of the few "designed" moments in an otherwise run-and-gun doc), get clean sound above all, and have them answer in self-contained statements since your voice usually disappears in the cut. But the mechanics serve the human core, which is a person telling you the truth because they trust you and you're truly listening. Get the trust, ask open questions, listen with everything you have, use the silence, and honor the person's vulnerability, and your interviews will give you the emotional, honest, story-carrying material that is the heart of most documentaries. Rush it, over-question it, or treat the subject as a soundbite machine, and you'll get nothing worth keeping. Next, we move from the controlled interview to capturing life as it actually happens — vérité and B-roll.</p>

<div class="pullquote">A documentary interview isn't about your questions — it's about creating the conditions for the truth and listening well enough to follow it. Ask less, listen more, and use the silence.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The most powerful thing anyone ever said on camera for me came after I stopped asking questions. I'd finished my list, and instead of moving on I just stayed silent and let the pause sit. She filled it — with the real, painful, true thing she'd been circling the whole interview. If I'd rushed to my next question, I'd have missed it. That taught me the whole craft: prepare, then set the list down and <em>listen</em>. Follow the person, not the plan. Let the silence do the work. And honor what they give you, because they're being vulnerable and trusting you with it. Ask less, listen more, protect their trust — that's the documentary interview.</p>
</div>
`,
      takeaways: [
        "A great interview isn't about your questions — it's a trusting conversation where you create the conditions for the truth and follow it.",
        "Build trust and comfort, ask open story-driven questions, and have subjects answer in complete statements for the edit.",
        "Listen far more than you ask, and use the silence — the truest, most emotional answers come in the pause and the unplanned follow-up.",
        "Honor the person's vulnerability — protect the trust that got you the honesty, in the room and later in the edit.",
      ],
    },
    {
      slug: "shooting-documentary-footage",
      num: 8,
      roman: "VIII",
      title: "Shooting Vérité & B-Roll",
      desc: "Shooting vérité, B-roll, and life as it happens",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "Shooting a Documentary: Vérité, B-Roll & Capturing Real Life | Filmmaker Genius",
      seoDesc: "How to shoot documentary footage — vérité shooting, capturing real moments, gathering B-roll, coverage, and being ready for life as it happens. A working filmmaker's field guide. Chapter 8 of Producing a Documentary.",
      dek: `Away from the controlled interview, documentary shooting is about being ready when life happens — filming real moments as they unfold, and gathering the B-roll that gives your story a world. You can't reshoot a real moment, so the whole game is preparation, presence, and getting more coverage than you think you'll ever need.`,
      body: `
<p>The interview is the one moment in a documentary you get to control. Almost everything else is life happening in front of your lens, whether you're ready or not — and the defining truth of documentary shooting is that <strong>you can't reshoot a real moment</strong>. When the thing you came for finally happens, you get one take, live, and either you captured it or you didn't. That single fact drives every practical decision: you keep the camera close and ready, you roll early and roll long, you stay unobtrusive so people forget you're there and behave naturally, and you gather far more coverage — angles, B-roll, texture — than you think you'll ever use, because in the edit you'll be desperate for it. Documentary shooting isn't about perfect, planned frames; it's about presence, readiness, and volume. Come home with too much, not too little.</p>

<h2>How to shoot for real</h2>

<p>The habits that get you the footage:</p>

<ul class="spec-list">
  <li><b>Be ready before it happens.</b> Batteries charged, cards formatted, camera on and close. The real moment won't wait for you to set up. If you're fumbling, it's gone.</li>
  <li><b>Roll early, roll long.</b> Start before you think you need to and don't cut too soon — the best moment often comes right before or right after the "main" event. Tape is cheap; the moment is priceless.</li>
  <li><b>Be a fly on the wall.</b> Stay small, quiet, and unobtrusive so people relax and forget the camera. The more you disappear, the more natural and true the footage.</li>
  <li><b>Gather B-roll obsessively.</b> Hands, faces, rooms, streets, details, the world around your subject. B-roll is what lets you cut, cover edits, set scenes, and give the film texture. You always need more.</li>
  <li><b>Shoot for the edit.</b> Get wides, mediums, and close-ups of the same thing; hold shots longer than feels natural; grab cutaways. Give your editor (probably you) options and room to cut.</li>
  <li><b>Sound is still king.</b> Even in run-and-gun, protect your audio — a wireless lav, a shotgun, headphones on. Great footage with bad sound is unusable (Chapter 6).</li>
</ul>

<h2>Presence, readiness, and coverage</h2>

<p>Everything about shooting a documentary well comes down to three things: being <strong>present</strong> so you're actually there when it happens, being <strong>ready</strong> so you can capture it the instant it does, and gathering enough <strong>coverage</strong> that you can shape it later. Presence means putting in the time — a lot of documentary is showing up and waiting, being around long enough that the important moments happen while you're there and the people are comfortable enough to be real in front of you. Readiness means the discipline of always being one second from rolling: camera on, exposure roughly set, sound live, positioned where the action will be — because the difference between a great documentary and a frustrated one is often whether the camera was rolling when the thing happened. And coverage is the insurance you buy against the edit: every extra angle, every held B-roll shot, every cutaway is a problem you're solving for future-you, who will be sitting in the edit trying to make a scene work and will bless or curse you depending on what you shot. This is the flip side of the vérité modes from Chapter 3 — the observational, fly-on-the-wall approach lives or dies on this shooting discipline. Beginners under-shoot: they film the obvious main event and stop, and then in the edit they have no way in, no way out, no texture, nothing to cut to. Experienced documentary shooters over-shoot on purpose: they roll before and after, they grab the incidental moments, they hoover up B-roll of everything, and they come home with a huge amount of material — because you can always cut down, but you can never conjure a moment you didn't capture. So keep the camera close and ready, stay small so people forget you, roll early and long, protect your sound, and gather far more coverage and B-roll than seems reasonable. Do that and you'll walk into the edit with everything you need. Under-shoot and you'll walk in trapped. Speaking of the edit — that's where the film is actually made, and it's next.</p>

<div class="pullquote">You can't reshoot a real moment. The whole game is presence, readiness, and coverage — roll early, roll long, gather far more than you think you'll need, because you can always cut down but never conjure a moment you missed.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The moment I still kick myself over was one I wasn't rolling for. I'd cut the camera thinking the scene was done — and that's exactly when the real thing happened, right in front of me, gone forever. Ever since, my rule is simple: roll early, roll long, and when you think you're done, stay on it a beat more. I come home from every shoot with way too much footage and a pile of B-roll I grabbed "just in case," and every single time in the edit I'm grateful for it. You can cut down all day. You cannot go back and film a real moment that already passed.</p>
</div>
`,
      takeaways: [
        "You can't reshoot a real moment — stay ready, camera close and live, so you capture it the instant it happens.",
        "Roll early and roll long, and be a fly on the wall so people relax and behave naturally.",
        "Gather B-roll and coverage obsessively — wides, details, cutaways — because you can cut down but never conjure a missed moment.",
        "Protect your sound even in run-and-gun — great footage with bad audio is unusable.",
      ],
    },
    {
      slug: "editing-a-documentary",
      num: 9,
      roman: "IX",
      title: "Finding the Story in the Edit",
      desc: "Where a documentary is truly written — the cut",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Editing a Documentary: Finding the Story in the Footage | Filmmaker Genius",
      seoDesc: "How to edit a documentary — finding the story in the footage, the paper edit, structure, the assembly, and the long road from hours of material to a finished film. A working filmmaker's guide. Chapter 9 of Producing a Documentary.",
      dek: `In documentary, the film is truly written in the edit. You arrive with hours — sometimes hundreds of hours — of footage and no script, and your job is to find the story hiding inside it. This is the longest, hardest, and most important stage of the whole process, and it's where a pile of moments becomes a film.`,
      body: `
<p>Here's the thing nobody tells you until you're in it: a documentary isn't shot, it's <strong>found</strong> — and it's found in the edit. A fiction film is written, then shot to match the script; a documentary is shot first, and only then, in the edit, do you discover what story you actually have. You sit down with hours of interviews and vérité and B-roll, no script to follow, and you have to build a film out of it, deciding what the story is, whose it is, where it starts and ends, and which of your thousand moments earn their place. This is by far the longest and hardest stage — editing a documentary takes far more time than shooting it, often many months — and it's where the film is genuinely made. Come in expecting the footage to assemble itself and you'll drown. Come in ready to search patiently for the story, to watch everything, to try structures, to kill your favorite moments when they don't serve the whole, and you'll find the film that was hiding in your material all along.</p>

<h2>How to edit a documentary</h2>

<p>The process that turns footage into a film:</p>

<ul class="spec-list">
  <li><b>Watch and log everything.</b> Go through all your footage and note what you have — the strong moments, the key soundbites, the B-roll. You can't build with material you can't find. This is tedious and non-negotiable.</li>
  <li><b>Transcribe your interviews.</b> Read them as text. Your story often reveals itself on the page, and you'll edit interviews far faster by working from transcripts than by scrubbing footage.</li>
  <li><b>Do a paper edit.</b> Before touching the timeline, rough out the story on paper — the beats, the order, the arc — using your best soundbites and moments. Find the structure before you build it.</li>
  <li><b>Build the assembly, then cut it down.</b> Lay in everything that might belong (a long, messy first assembly), then ruthlessly shape and shorten it into a rough cut, then a fine cut.</li>
  <li><b>Find the story and the arc.</b> Ask what the film is really about and whose journey it follows. Structure around a character or a question with change over time, not just a topic.</li>
  <li><b>Screen it and be willing to change everything.</b> Show rough cuts to trusted people, watch where they lose interest, and re-cut without ego. Kill your darlings — the beautiful moment that doesn't serve the story has to go.</li>
</ul>

<h2>The story is in there — go find it</h2>

<p>The mental shift that makes a documentary editor is accepting that your job is <strong>discovery, not assembly</strong>. You're not putting together a film you already designed; you're excavating a film you don't yet fully understand out of a mountain of raw material, and that takes patience, humility, and a lot of time. Start by knowing your footage cold — watch it all, log it, transcribe the interviews — because you cannot find a story in material you haven't fully absorbed. Then work on paper first: the paper edit, roughing out the arc and order and best beats before you ever build a timeline, is the single most valuable habit in documentary editing, because it lets you find the structure cheaply, in text, instead of expensively, in the edit. From there you build a big loose assembly and carve it down through rough and fine cuts, always asking the two questions that matter — what is this film really about, and whose story is it — and structuring around change over time, a person or a question that moves, rather than a static subject. And you have to stay willing to throw things away: your favorite shot, your funniest moment, the scene that cost you the most to get, all of it is expendable if it doesn't serve the whole, and learning to kill your darlings is what separates a tight film from a self-indulgent one. Screen your cuts for honest people, watch where they drift, and re-cut without protecting your ego. This is also where the ethics of the whole project come home to roost, because in the edit you have enormous power to shape how real people come across — you can make someone a hero or a villain with your cuts — and you owe it to your subjects to represent them truthfully, which is exactly what the next chapter is about. But first, internalize this: the film is not in your footage yet, it's hiding in it, and the edit is the long, patient, sometimes brutal work of finding it. Log everything, transcribe, paper-edit, assemble, cut down, screen, and re-cut with an open hand — and the film that was buried in all those hours will finally stand up. Rush it or fall in love with your own footage, and it never will.</p>

<div class="pullquote">A documentary isn't shot, it's found — and it's found in the edit. Your job is discovery, not assembly: log everything, paper-edit first, and be willing to kill every darling that doesn't serve the story.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>My first documentary edit nearly broke me. I had a hard drive full of gorgeous footage and no idea what the film was, and I kept trying to force in the shots I loved most — and it stayed a mess for weeks. What saved it was stepping away from the timeline and doing a paper edit: I printed the transcripts, found the actual story on the page, and realized my three favorite scenes didn't belong in it at all. Cutting them hurt. But that's when the film finally worked. Now I always find the story on paper first, and I hold every beautiful shot loosely, because the story is the only thing the audience will care about.</p>
</div>
`,
      takeaways: [
        "A documentary is found in the edit — your job is discovery, not assembly, and it's the longest, hardest stage.",
        "Watch and log everything, transcribe your interviews, and do a paper edit before you touch the timeline.",
        "Structure around a character or question that changes over time — build a loose assembly, then cut down to a fine cut.",
        "Screen your cuts, kill your darlings, and re-cut without ego — the beautiful moment that doesn't serve the story has to go.",
      ],
    },
    {
      slug: "documentary-ethics",
      num: 10,
      roman: "X",
      title: "Ethics & Truth",
      desc: "Truth, fairness, and your duty to your subjects",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Documentary Ethics: Your Responsibility to Real People | Filmmaker Genius",
      seoDesc: "Documentary ethics — your responsibility to the real people in your film, informed consent, honest representation, power, and the line you don't cross. A working filmmaker's guide. Chapter 10 of Producing a Documentary.",
      dek: `Documentary is the one form of filmmaking where your "characters" are real people whose real lives you can change. That gives you power — over how they're seen, over what they reveal, over their reputation — and with that power comes a responsibility you can never put down. This is the chapter about the line you don't cross.`,
      body: `
<p>Everything in this course has been building to a responsibility most beginners underestimate: in a documentary, <strong>your subjects are real people, and your film can change their lives</strong>. A fiction director can do anything to a character because the character isn't real. You can't, because yours is. The person who trusted you with their story will have to live in the world after your film comes out — with their neighbors, their family, their employer, their own sense of dignity — and how you represent them can help them or harm them in ways that outlast the film entirely. That reality creates a real and permanent power imbalance: you control the camera, the questions, and above all the edit, and they don't. Documentary ethics is simply the discipline of using that power responsibly — being honest with the people in your film, honest about them in the cut, and never treating a human being as raw material for a better scene. There is no certificate that makes you ethical; it's a set of choices you make over and over, and it matters more than any technique in this course.</p>

<h2>The responsibilities you carry</h2>

<p>What it means to do right by your subjects:</p>

<ul class="spec-list">
  <li><b>Get real, informed consent.</b> Make sure people genuinely understand what they're participating in, how they might be portrayed, and where the film could end up — not just that they signed a release. Consent is understanding, not a signature.</li>
  <li><b>Represent people truthfully.</b> The edit gives you the power to make anyone a hero or a villain. Use it to show people as they actually are, not as the most dramatic version that serves your story.</li>
  <li><b>Respect the power imbalance.</b> You hold the camera and the final cut; they don't. Be especially careful with vulnerable people, and never exploit someone's trust, hardship, or naivety for a stronger film.</li>
  <li><b>Do no needless harm.</b> Consider the real-world consequences of what you reveal. Sometimes protecting a subject — a name withheld, a scene cut, a face obscured — matters more than the footage.</li>
  <li><b>Be honest with your audience too.</b> Don't fake events, stage "reality," fabricate timelines, or manipulate footage to imply something untrue. Your credibility and the form's rest on it.</li>
  <li><b>Keep your word.</b> If you promised a subject something — a chance to see a cut, a topic off-limits, anonymity — honor it. The trust that got you the film obligates you.</li>
</ul>

<h2>Power, trust, and the line you don't cross</h2>

<p>The heart of documentary ethics is a single uncomfortable truth: you have <strong>power over the real people in your film, and they have very little over you</strong>. They gave you access, told you private things, let you into hard moments — usually because they trusted you — and in return you hold the camera and, most decisively, the edit, where you can shape how the whole world sees them. That imbalance means the ethics aren't optional or occasional; they run through every stage of this course. It's why the trust you build in development and interviewing (Chapters 4 and 7) is sacred rather than just useful — it was given, and it can be betrayed. It's why the enormous shaping power of the edit (Chapter 9) is a moral instrument and not only a creative one — the same cut that finds your story can also distort a real person, and you're responsible for which one it does. And it's why "did I get a great scene" is never the only question; "did I treat this person fairly and truthfully" always sits beside it. Practically, that means genuine informed consent rather than a signature you rushed someone through, truthful representation rather than the most dramatic cut, real care for vulnerable subjects, a willingness to withhold or cut material when revealing it would cause needless harm, honesty with your audience about what's real, and keeping the promises you made to get the film. None of this is about being timid — you can and should make tough, honest, even critical films about difficult subjects, and truthful filmmaking sometimes means showing people things they'd rather not see. Ethics doesn't mean flattering everyone; it means being fair and honest and refusing to exploit. The line you don't cross is using a real person's trust or vulnerability to make them into something they aren't, or causing them harm you could have avoided, for the sake of your film. Hold that line and you can make bold, truthful documentaries with a clear conscience and subjects who'd work with you again. Cross it and you may get a better scene, but you'll have done real damage to a real person who trusted you — and no film is worth that. Next, we cover the practical side of protecting yourself and your subjects: releases, rights, and the legal groundwork.</p>

<div class="pullquote">Your subjects are real people, and your film can change their lives. You hold the camera and the final cut; they don't. Documentary ethics is the discipline of using that power honestly — and never crossing the line into exploitation.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once had footage of a subject at his lowest — raw, dramatic, exactly the kind of moment that "makes" a scene. And I cut it. Not because I had to, but because using it would have exposed something he'd shared in a moment of trust, in a way that could have hurt him for years, and it wasn't essential to the story. He never even knew the choice existed. That's the part of this work nobody applauds: the scenes you don't use, the names you withhold, the promises you keep when no one's watching. The camera gives you power over real people. What you do with that power when it costs you something is the whole measure of you as a documentarian.</p>
</div>
`,
      takeaways: [
        "Your subjects are real people and your film can change their lives — that responsibility outweighs any single scene.",
        "Get genuine informed consent, represent people truthfully, and respect the power imbalance you hold over them.",
        "Be honest with your audience too — don't fake events or manipulate footage to imply something untrue.",
        "The line you don't cross: using trust or vulnerability to distort a real person, or causing avoidable harm for your film.",
      ],
    },
    {
      slug: "documentary-releases-and-rights",
      num: 11,
      roman: "XI",
      title: "Legal, Releases & Rights",
      desc: "Releases, archival rights, music, and fair use",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Documentary Releases, Rights & Music: The Legal Groundwork | Filmmaker Genius",
      seoDesc: "Documentary releases and rights — appearance releases, location and archival clearances, music licensing, fair use, and E&O insurance. The legal groundwork that lets your film be seen. A working filmmaker's guide. Chapter 11 of Producing a Documentary.",
      dek: `The unglamorous paperwork that decides whether your finished film can ever be seen. Appearance releases, location and archival clearances, and music rights aren't a formality — a single uncleared song or missing signature can legally block your documentary from distribution. Handle the rights, and your film is free to travel.`,
      body: `
<p>This is the least exciting chapter in the course and one of the most important, because <strong>the rights you fail to clear can quietly kill your film</strong>. You can make something brilliant, moving, and true, and still find it can never legally be shown — because a subject never signed a release, because a song plays on a radio in the background of a key scene, because a clip of a TV broadcast is woven through your best sequence, and you don't have permission for any of it. Distributors, festivals, and broadcasters will not touch a film they can't verify is legally clean, and "I'll deal with it later" has stranded more finished documentaries than bad editing ever has. The good news is that rights are entirely manageable if you handle them deliberately: get appearance releases as you shoot, clear your locations and any archival material, license your music properly (or use tracks that are actually cleared), understand the real limits of "fair use," and consider errors-and-omissions insurance when you're heading to distribution. Do the paperwork, and your film is free to go anywhere.</p>

<h2>The rights you have to clear</h2>

<p>The paperwork that keeps your film legal:</p>

<ul class="spec-list">
  <li><b>Appearance releases.</b> Get people who appear in your film to sign a release granting you the right to use their image and words. Collect them at the time of filming — chasing signatures years later is a nightmare, and one holdout can block a scene.</li>
  <li><b>Location releases.</b> Filming on private property? Get written permission to shoot there and use the footage. Public spaces are usually fine, but private locations can object later.</li>
  <li><b>Archival &amp; footage clearances.</b> Any photos, film clips, TV news, or third-party footage you didn't shoot must be licensed from whoever owns it. Archival can be expensive and slow — budget time and money for it.</li>
  <li><b>Music licensing.</b> You generally need two rights for a song: the composition (publishing) and the specific recording (master). Popular music is costly; production libraries, cleared catalogs, and original scores are affordable alternatives.</li>
  <li><b>Know the limits of fair use.</b> Fair use is real but narrow, fact-specific, and often misunderstood. Don't assume it covers you — for anything meaningful, get qualified advice rather than guessing.</li>
  <li><b>E&amp;O insurance for distribution.</b> Errors-and-omissions insurance certifies your film is clear of legal claims and is typically required by distributors and broadcasters. It's the final gate to a real release.</li>
</ul>

<h2>Clear it as you go, not at the end</h2>

<p>The single habit that saves documentary filmmakers the most pain is treating rights as something you handle <strong>continuously, from day one</strong>, not a cleanup task you postpone to the end. Every principle here rewards the person who did the paperwork in the moment: appearance releases are trivial to collect when the person is standing right in front of you and impossible to collect two years later when they've moved, changed their mind, or vanished; location permission is easy to get before you shoot and awkward to get after; music and archival costs are survivable when you know them going in and catastrophic when they ambush you in the final cut. The filmmakers who get burned are almost always the ones who said "we'll sort the rights out later," shot with uncleared music baked into their favorite scenes, never got a signature from a key subject, and then discovered at the finish line that their film was legally unshowable and enormously expensive or simply impossible to fix. So build rights into your process: carry release forms and get them signed on every shoot day, track who and what still needs clearing, choose music you can actually afford and license (or commission an original score, which also makes your film distinctive), assume archival will cost real time and money, and don't lean on a vague notion of fair use — it's narrow and fact-specific, and worth real legal advice when anything important rides on it. As you approach distribution, expect to need E&amp;O insurance, which is the industry's way of certifying your film is clean and is generally non-negotiable for broadcasters and distributors. This connects directly to the ethics of the previous chapter — releases are partly where consent becomes concrete and documented — and it sets up the final chapter, distribution, because a film with its rights in order is a film that can actually be sold, screened, and seen, while a film with rights problems is a film that stays on your hard drive no matter how good it is. It's not glamorous work. But clearing your rights as you go is what turns a finished edit into a film the world is allowed to watch. Next, we get it in front of an audience.</p>

<div class="pullquote">The rights you fail to clear can quietly kill your film. Get releases at the moment of filming, license your music properly, and handle clearances as you go — a great documentary nobody can legally show is just a hard drive.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I watched a friend's documentary — genuinely great — get stuck for a year because of one song. It was playing in a café in the background of a pivotal scene, licensing the track was wildly out of budget, and re-cutting around it meant losing the emotional heart of the film. All of it avoidable if someone had thought about music rights on the day. Ever since, my rule is boring and absolute: releases get signed on the shoot, before we move on, and I never fall in love with music I haven't cleared. Do the unglamorous paperwork while it's cheap and easy, or pay for it later when it's neither.</p>
</div>
`,
      takeaways: [
        "Uncleared rights can legally block your finished film — distributors won't touch a film they can't verify is clean.",
        "Collect appearance and location releases at the moment of filming, not years later.",
        "License music properly (composition and master) and budget real time and money for archival clearances.",
        "Fair use is narrow — get advice, and expect to need E&O insurance to reach distribution.",
      ],
    },
    {
      slug: "documentary-distribution",
      num: 12,
      roman: "XII",
      title: "Distribution & Getting It Seen",
      desc: "Festivals, streamers, and getting your film seen",
      time: "7 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Documentary Distribution: How to Get Your Film Seen | Filmmaker Genius",
      seoDesc: "Documentary distribution — festivals, sales agents, streaming and VOD, educational and self-distribution, and building an audience so your finished film actually gets seen. A working filmmaker's guide. Chapter 12 of Producing a Documentary.",
      dek: `A documentary that no one watches isn't finished — it's just stored. This final chapter is about the last, often longest push: getting your film in front of an audience through festivals, sales agents, streaming, educational sales, and self-distribution. Making the film is half the job. Getting it seen is the other half.`,
      body: `
<p>You've found your subject, funded it, shot it, cut it, and cleared it — and now you face the truth that too many first-time documentarians never plan for: <strong>a finished film that no one sees isn't really finished at all</strong>. Distribution is not an afterthought that happens automatically once the film is good; it's a whole second job, often as long and as demanding as making the film, and the documentaries that reach audiences are rarely the "best" ones — they're the ones whose makers actively pushed them out into the world. The good news is there have never been more paths to an audience: the festival circuit, sales agents and distributors, streaming and video-on-demand, educational and community sales, and full self-distribution. Most films use a mix. Your job is to think about who your film is for and how to reach them — ideally before you finish, not after — and then to do the unglamorous, persistent work of getting it in front of them. Make the film, then fight to get it seen.</p>

<h2>Paths to an audience</h2>

<p>The main routes for getting your documentary out:</p>

<ul class="spec-list">
  <li><b>Film festivals.</b> Still the classic launch for documentaries — premieres, press, awards, and the place buyers and programmers discover films. Research which festivals fit your film, and target strategically rather than blanketing everything.</li>
  <li><b>Sales agents &amp; distributors.</b> A good sales agent or distributor can place your film with broadcasters, streamers, and territories you could never reach alone — taking a cut in exchange for access and deal-making.</li>
  <li><b>Streaming &amp; VOD.</b> Platforms from the big streamers to transactional and ad-supported VOD. Some you pitch and license to; others (like posting to a paid platform) you can go direct. Reach is huge; competition is fierce.</li>
  <li><b>Educational &amp; community sales.</b> Universities, schools, libraries, and organizations pay real money for documentaries on relevant subjects — an underrated, durable revenue stream, especially for issue-driven films.</li>
  <li><b>Self-distribution.</b> Direct to your audience — screenings, your own site, VOD, impact campaigns. More work and more control, and increasingly viable when you've built a following.</li>
  <li><b>Build an audience early.</b> Start connecting with the community around your subject before the film is done. An existing audience makes every distribution path easier and is often what convinces gatekeepers to say yes.</li>
</ul>

<h2>Make the film, then fight to get it seen</h2>

<p>The mindset shift that completes your journey as a documentary producer is understanding that <strong>distribution is part of the job, not something that happens to you after the job is done</strong>. The romantic version — you make something great and the world finds it — almost never happens; the real version is that films find audiences because their makers relentlessly work to connect them, and a brilliant documentary sitting on a hard drive reaches no one. This is where the whole course pays off, and it's worth seeing how the pieces connect: the audience you started building back in development and funding (Chapter 5) is the same audience you now distribute to; the clean rights from the previous chapter are what allow every one of these paths to happen at all; and the clear, focused story you found in the edit is what makes festivals program it and buyers want it. Practically, think early about who your film is for and which paths fit — a personal artistic doc lives on the festival circuit and in self-distribution, an issue film thrives in educational and community and impact screenings, a broadly appealing subject aims at streamers and a sales agent — and remember that most films combine several routes over time. Be strategic rather than scattershot with festivals, understand what a sales agent does and doesn't do before you sign, treat educational and community sales as the real revenue they can be, and don't discount self-distribution now that the tools to reach an audience directly are in everyone's hands. Above all, keep building and nurturing the audience around your subject, because an engaged community is the single biggest asset a documentary can have — it fills festival screenings, it convinces distributors, and it's there waiting when the film comes out. And that closes the loop of this entire course: you set out to tell a true story about the real world, and distribution is where that story finally does its work — where real people watch it, are moved by it, and maybe see something differently because of what you made. Making the film was half the job. Getting it seen is the other half, and now you know both. Go make something true — and then go make sure the world gets to see it.</p>

<div class="pullquote">A finished film that no one sees isn't really finished. Distribution is a whole second job — the documentaries that reach audiences aren't the best ones, they're the ones whose makers fought to get them seen.</div>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The hardest lesson of my first documentary wasn't shooting or cutting it — it was that finishing the film felt like the finish line, and it wasn't even close. I thought a good film would find its audience on its own. It didn't. The films of mine that got seen were the ones I hustled for: the festival strategy, the emails to programmers, the community screenings, the audience I'd been building around the subject the whole time. Making it is the part everyone dreams about. Getting it seen is the part that separates a film people watch from a file nobody opens. Do both, and you're a documentary producer.</p>
</div>
`,
      takeaways: [
        "A film no one sees isn't finished — distribution is a whole second job, not something that happens automatically.",
        "Know your paths: festivals, sales agents, streaming/VOD, educational and community sales, and self-distribution — most films mix several.",
        "Think about who your film is for and which routes fit before you finish, not after.",
        "Build and nurture the audience around your subject early — an engaged community is a documentary's biggest asset.",
      ],
    },
  ],
};
