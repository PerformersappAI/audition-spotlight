import type { Course } from "../courseTypes";

export const adaptingSource: Course = {
  slug: "adapting-source-material",
  title: "Adapting Source Material for the Screen",
  categoryLabel: "Development & Writing",
  subtitle:
    "The book, the article, the true story you can't stop thinking about — this is how you turn it into a screenplay. Optioning the rights, choosing what to cut, translating prose into pictures, and staying faithful without staying stuck. Written from the set by a working filmmaker.",
  level: "Intermediate",
  chapterCount: "12 Chapters",
  readTime: "~105 min read",
  pairsWithName: "Filmmaker Toolbox",
  pairsWithUrl: "/toolbox",
  pairsWithDesc:
    "Break down your source material, outline the adaptation, and draft your script in one place. The Toolbox turns the messy work of adaptation — beat-mapping a novel, tracking what you cut — into a clear, structured workflow.",
  seoTitle: "How to Adapt a Book into a Screenplay: Free Adaptation Course | Filmmaker Genius",
  seoDesc:
    "A free, chapter-by-chapter course on adapting source material for the screen — how to option a book, choose what to cut, translate prose to visuals, and adapt novels, short stories, and true stories into a screenplay.",
  learn: [
    "How to option or secure the film rights to a book, article, or true story",
    "What to cut and what to keep when compressing a 400-page novel into 110 pages",
    "How to translate interior prose and voice-over into visual, dramatic scenes",
    "How to adapt true stories, short stories, and IP — and stay faithful without staying stuck",
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
    { key: "apply", label: "Module 3 — Special Cases & Delivery" },
  ],
  chapters: [
    {
      slug: "book-to-film-adaptation",
      num: 1,
      roman: "I",
      title: "Why Adapt Source Material",
      desc: "Why adaptation is one of the surest paths into the industry",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Some of the best films ever made started as somebody else's book, article, or true story. Before we learn how to adapt, it's worth understanding why adaptation is one of the smartest moves a filmmaker can make.`,
      seoTitle: "Book-to-Film Adaptation: Why Adapt Source Material | Filmmaker Genius",
      seoDesc:
        "Why adaptation is one of the surest paths into the film industry — how book-to-film adaptation lowers risk, attracts talent and finance, and gives a new filmmaker a built-in audience. Chapter 1 of Adapting Source Material for the Screen.",
      body: `
    <p>Look at any list of the most acclaimed films of the last century and you'll notice something: a huge share of them are adaptations. <em>The Godfather</em> was a novel. <em>Schindler's List</em> was a book. <em>Jaws</em>, <em>No Country for Old Men</em>, <em>The Shawshank Redemption</em>, <em>Little Women</em>, <em>Call Me by Your Name</em>, most of the films that sweep awards season — all of them began as somebody else's pages. Adaptation isn't a lesser form of screenwriting or a shortcut for people who "can't come up with their own ideas." It's a discipline as old as cinema, and for a new filmmaker, it's one of the most strategic ways to break in.</p>

    <h2>Why adaptation is a smart move</h2>

    <p>A <strong>book-to-film adaptation</strong> starts you from a position most original screenplays never reach: a story that has already proven it works. Someone wrote it, an editor believed in it, and — if it was published or read — an audience responded to it. That head start creates real, practical advantages:</p>

    <ul class="spec-list">
      <li><b>The story is battle-tested.</b> The characters, the world, and the emotional arc have already connected with readers. You're not guessing whether the premise lands — you have evidence.</li>
      <li><b>It de-risks the project for money and talent.</b> Financiers and actors are more comfortable backing a story with a track record. "It's based on the bestselling novel" opens doors that "it's my original idea" often can't.</li>
      <li><b>There may be a built-in audience.</b> Fans of the book are a marketing gift — a group already primed to want the movie.</li>
      <li><b>You learn structure by reverse-engineering.</b> Adapting forces you to study why a story works and rebuild it in a new form — one of the fastest ways to grow as a writer.</li>
    </ul>

    <p>None of this means adaptation is <em>easy.</em> Turning a 400-page novel into a 110-page screenplay is a brutal act of compression and reinvention — that's what this whole course is about. But you're building on a foundation instead of pouring one from scratch, and that's a genuine advantage.</p>

    <div class="pullquote">Adaptation isn't borrowing someone else's idea. It's translating a story from one language — prose — into another: pictures, sound, and time.</div>

    <h2>What adaptation really is</h2>

    <p>Here's the mindset shift that separates good adapters from frustrated ones: your job is <em>not</em> to transcribe the book onto the screen. A novel and a film are different languages. Prose can live inside a character's head for pages; film has to show us. A book can span decades in a paragraph; a movie has two hours. Adaptation is an act of <em>translation and transformation</em> — keeping the soul of the source while rebuilding its body for a completely different medium. The films that fail are usually the ones too afraid to change anything; the ones that soar understand what to protect and what to let go.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The most freeing thing anyone ever told me about adapting was this: the book already exists, and it's safe. Nothing you do to your screenplay erases it. That means you're allowed to cut a beloved subplot, combine three characters into one, or move the ending — not to disrespect the source, but to serve the film. Readers who want the book still have the book. Your job is to make the <em>movie</em> as good as the book was, in the movie's own language.</p>
    </div>

    <p>Over the next eleven chapters, we'll go from choosing the right source and locking down the rights, through the craft of cutting, finding the spine, and translating prose to the screen, all the way to the special cases — true stories, short stories, and IP — and the pitfalls that trap most first-time adapters. It starts with the single most important decision you'll make: <em>what</em> to adapt. That's next.</p>
`,
      takeaways: [
        "A huge share of the most acclaimed films are adaptations — it's a serious discipline, not a shortcut.",
        "Adapting starts you from a proven story, which de-risks the project for finance and talent and can bring a built-in audience.",
        "Adaptation is translation, not transcription — keep the soul of the source, rebuild the body for film.",
        "The book still exists — you're free to cut and change in service of the movie.",
      ],
    },
    {
      slug: "how-to-choose-a-book-to-adapt",
      num: 2,
      roman: "II",
      title: "Choosing the Right Source",
      desc: "How to spot a book or story that will actually work as a film",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `The single most important decision in any adaptation happens before you write a word: what to adapt. Pick the wrong book and no amount of craft will save you. Here's how to choose one that will actually work as a film.`,
      seoTitle: "How to Choose a Book to Adapt into a Film | Filmmaker Genius",
      seoDesc:
        "How to choose the right book or story to adapt into a film — the traits that make source material cinematic, the red flags to avoid, and why the best novel is rarely the best adaptation. Chapter 2 of Adapting Source Material for the Screen.",
      body: `
    <p>Here's a truth that surprises new writers: <strong>the best novel is often the worst adaptation.</strong> The books we treasure most are frequently treasured <em>because</em> of things film can't do — dense interior thought, lyrical prose, a narrator's voice, sprawling timelines. Meanwhile, some of the greatest films come from modest, even pulpy source material that gave the filmmaker room to build. So the question isn't "what's the best book?" It's "what book will make the best <em>movie</em>?" Those are very different questions, and learning to tell them apart is the whole game in this chapter.</p>

    <h2>What makes source material cinematic</h2>

    <p>When you're evaluating a book, story, or article as a potential film, look past whether you loved reading it and ask whether it has the raw ingredients a movie needs:</p>

    <ul class="spec-list">
      <li><b>A strong central character with a clear want.</b> Film runs on active protagonists pursuing a goal. If the source has a compelling character chasing something, you're halfway there.</li>
      <li><b>External, visual conflict.</b> Stories where the drama <em>happens</em> — decisions, confrontations, action — adapt far better than ones where everything happens inside a character's head.</li>
      <li><b>A containable scope.</b> A tight timeframe and a manageable number of characters and locations translate cleanly. Multi-generational epics can work, but they're a steeper climb.</li>
      <li><b>A great concept or hook.</b> A premise you can say in a sentence — the thing that makes someone lean in — is worth more than beautiful prose.</li>
      <li><b>Emotional stakes.</b> Something the audience will care about winning or losing. Craft can't manufacture a reason to care; the source should already have one.</li>
    </ul>

    <p>Notice what's <em>not</em> on that list: prestige, prize-winning prose, or your personal love of the book. Those are wonderful, but they don't predict a good film. A slim thriller with a killer hook may adapt better than a beloved 800-page literary masterpiece.</p>

    <div class="pullquote">Don't ask "is this a great book?" Ask "is there a great movie hiding inside it?" Sometimes the answer is yes precisely because the book left room to build.</div>

    <h2>Red flags to watch for</h2>

    <p>Some sources fight you at every turn. None of these are automatic disqualifiers — great filmmakers have beaten all of them — but go in with your eyes open:</p>

    <ul class="spec-list">
      <li><b>The magic is in the language.</b> If what you love is the <em>writing</em> — the voice, the sentences — that's the one thing you can't put on screen.</li>
      <li><b>It's mostly internal.</b> Books built on thought, memory, and reflection with little external action require heavy invention to dramatize.</li>
      <li><b>Sprawl.</b> Dozens of characters, decades of time, continents of setting — adaptable, but you'll be cutting to the bone.</li>
      <li><b>Plot-light.</b> Some beloved books are about mood and texture more than story. Beautiful to read, hard to structure into two hours.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My rule of thumb: I look for the source that gives me a strong spine and a lot of freedom. A perfect novel is intimidating — every change feels like vandalism, and fans will hunt you for it. But a flawed, fascinating book with a great engine and loose execution? That's a gift. You get a proven hook <em>and</em> the room to fix what didn't work. Some of the best films exist because a filmmaker saw the movie the book <em>could</em> have been.</p>
    </div>

    <p>One more practical filter, which we'll go deep on next: can you actually get the rights? The most cinematic book in the world is useless to you if the film rights are locked up or unaffordable. Availability is part of "the right source." Once you've found a story that's both cinematic and gettable, the next step is locking it down — legally. That's Chapter III.</p>
`,
      takeaways: [
        "The best book isn't the best adaptation — ask what makes the best movie, not the best read.",
        "Cinematic sources have an active protagonist, external conflict, containable scope, a strong hook, and real stakes.",
        "Red flags: the magic is in the language, the story is mostly internal, or it sprawls across too much time and cast.",
        "A flawed book with a great engine often beats a perfect one — it gives you a hook and the freedom to build.",
      ],
    },
    {
      slug: "how-to-get-film-rights-to-a-book",
      num: 3,
      roman: "III",
      title: "Securing the Rights & Options",
      desc: "Options, rights, and public domain — securing the legal green light",
      time: "10 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `You found the perfect book. Before you write a page, one legal question decides everything: do you have the right to adapt it? Here's how film rights and option agreements actually work.`,
      seoTitle: "How to Get Film Rights to a Book: Options & Rights Explained | Filmmaker Genius",
      seoDesc:
        "How to get the film rights to a book — what an option agreement is, how much rights cost, life rights and public domain, and the legal steps to secure source material before you adapt. Chapter 3 of Adapting Source Material for the Screen.",
      body: `
    <p>This is the least glamorous chapter in the course and one of the most important, because it's where dreams quietly die. Every year, writers pour months into adapting a book they have no legal right to touch — a screenplay they can never sell, produce, or even show around without risking a lawsuit. If someone else wrote it, someone owns the film rights, and <strong>you need permission before you adapt.</strong> The good news: getting that permission is often more achievable, and more affordable, than new filmmakers assume.</p>

    <h2>What "film rights" actually are</h2>

    <p>When an author writes a book, copyright gives them a bundle of rights — including the <em>right to make a film based on it.</em> To adapt legally, you need the author (or whoever controls the rights) to grant you that specific right. You're not buying the book; you're licensing the ability to turn it into a movie. That's usually done not by purchasing the rights outright, but through a far cheaper instrument: an <strong>option</strong>.</p>

    <h2>The option agreement</h2>

    <p>An <strong>option agreement</strong> is the workhorse of adaptation. Instead of buying the film rights (which can be expensive), you pay the rights-holder a smaller fee for the <em>exclusive right to buy</em> those rights within a set window — typically 12 to 18 months. During that window, you're the only one who can develop the project: write the script, attach talent, raise money. If you set the film up, you exercise the option and pay the pre-agreed purchase price. If the window closes and you haven't, the rights revert to the author and you walk away, out only the option fee.</p>

    <ul class="spec-list">
      <li><b>Option fee.</b> What you pay upfront for the exclusive window. For indie/first-time filmmakers this can range from a token sum (even $1 with the right relationship) to a few thousand dollars.</li>
      <li><b>Option period.</b> How long you have — often 12–18 months, frequently with a renewal option for an added fee.</li>
      <li><b>Purchase price.</b> The pre-negotiated amount you pay <em>if</em> the film gets made, often expressed as a percentage of the budget.</li>
      <li><b>Rights granted.</b> Exactly what you can do — film, and often TV, streaming, and related rights. Specifics matter; this is where a lawyer earns their fee.</li>
    </ul>

    <p>The beauty of the option for a low-budget filmmaker is leverage: for a modest, sometimes tiny fee, you lock up a proven story long enough to build the project — without gambling the full purchase price up front.</p>

    <div class="pullquote">You don't have to be rich to option a book. You have to be the person the author trusts to make the film they'd be proud of. Passion and a plan often beat a big check.</div>

    <h2>Other paths to rights</h2>

    <ul class="spec-list">
      <li><b>Public domain.</b> Works old enough that copyright has expired are free for anyone to adapt — no permission, no fee. This is why classic novels get remade endlessly. Rules vary by country and change over time, so confirm a specific work's status before you rely on it.</li>
      <li><b>Life rights.</b> Adapting a real person's story? You don't strictly "need" life rights to depict public facts, but securing them buys cooperation, access to private detail, and protection against disputes. (More on true stories in Chapter IX.)</li>
      <li><b>Direct approach.</b> For a lesser-known book or self-published author, you can often reach the writer directly or through their publisher/agent. Many authors are thrilled a filmmaker cares — a heartfelt approach goes a long way.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Two hard-won rules. First: get it in writing, always — a handshake or a friendly email is not a rights agreement, and "we're basically family" has ended more projects than any studio ever did. Second: for anything beyond a clearly public-domain work, use an entertainment lawyer for the option agreement. It feels like a splurge when you're broke, but a badly written option can cost you the whole film later. This chapter makes you conversant, not your own attorney.</p>
    </div>

    <p>Once the rights are locked and legal, the fun begins — and it starts with how you <em>read</em> the source. Not as a fan, but as an adapter hunting for the movie inside it. That's Chapter IV.</p>
`,
      takeaways: [
        "If someone else wrote it, someone owns the film rights — you need permission before you adapt.",
        "An option lets you pay a smaller fee for an exclusive window to develop the project, with a purchase price due only if it's made.",
        "Public-domain works are free to adapt; life rights buy cooperation and protection for true stories.",
        "Get everything in writing and use an entertainment lawyer for the option — a bad agreement can cost you the film.",
      ],
    },
    {
      slug: "how-to-read-a-book-for-adaptation",
      num: 4,
      roman: "IV",
      title: "Reading Like an Adapter",
      desc: "Reading your source like a screenwriter, not a fan",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `You've read the book for pleasure. Now you have to read it again — completely differently. The adapter's read isn't about enjoying the story; it's about finding the movie inside it.`,
      seoTitle: "How to Read a Book for Adaptation | Filmmaker Genius",
      seoDesc:
        "How to read a book for adaptation — the active, screenwriter's read that maps scenes, marks what's cinematic, and finds the movie hiding inside the prose. Chapter 4 of Adapting Source Material for the Screen.",
      body: `
    <p>There are two kinds of reading. The first is the one you did when you fell in love with the book — immersive, emotional, carried along by the current. The second is the one that starts now: cold, analytical, pen in hand. Before you can adapt a source, you have to <em>see</em> it clearly — its bones, its engine, the handful of scenes that are the real movie and the hundred pages that aren't. This chapter is about that second read: the adapter's read.</p>

    <h2>Read for structure, not story</h2>

    <p>On your working read, you're not asking "what happens next?" — you already know. You're reverse-engineering the book like a mechanic pulling apart an engine. As you go, map it:</p>

    <ul class="spec-list">
      <li><b>The spine.</b> Whose story is this, really? What do they want, and what stands in the way? Write it as a single sentence you can return to.</li>
      <li><b>The major turns.</b> Mark the events that change the direction of the story. These are your future act breaks and set pieces.</li>
      <li><b>The essential scenes.</b> Which moments <em>must</em> survive to any version of this film? Flag the handful that are non-negotiable.</li>
      <li><b>The engine.</b> What keeps the pages turning — a mystery, a countdown, a relationship, a chase? That's what has to keep the audience in their seats too.</li>
    </ul>

    <p>By the end, you should be able to describe the book's structure without the book — a skeleton you can hold in one hand. That skeleton, not the full text, is what you'll actually adapt.</p>

    <div class="pullquote">On the first read you're a passenger. On the adapter's read you're the mechanic — you pull the engine apart to see what's actually driving it.</div>

    <h2>Mark what's cinematic — and what isn't</h2>

    <p>As you read, keep two running lists. In one, collect the <strong>gold</strong>: the vivid, visual, dramatic moments that will play beautifully on screen — a confrontation, a reveal, an image you can already see. In the other, flag the <strong>problems</strong>: the long interior passages, the info delivered in narration, the chapters where nothing external happens. You're not solving them yet. You're building a map of where the movie is strong and where you'll have to invent, compress, or dramatize. That map is worth more than any outline you could write from memory.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When I do an adapter's read, I annotate everything and I keep a separate running document I call the "movie inside the book." Every time I hit a scene that <em>is</em> the film — one I can picture, hear, feel — I copy it there. When I'm done, that document is usually a fraction of the book's length, and it's shockingly close to the actual spine of my screenplay. The book gave me a hundred rooms; this pass tells me which dozen the movie lives in.</p>
    </div>

    <p>Notice how much of adaptation happens <em>before</em> you write "FADE IN." You choose the source, secure it, and read it like a builder surveying a site. With that map in hand, you're ready for the hardest, most defining act of adaptation: deciding what to cut and what to keep. That's Chapter V, and the start of Module 2 — the core craft.</p>
`,
      takeaways: [
        "The adapter's read is analytical, not immersive — read to find the movie, not to enjoy the story.",
        "Map the spine, the major turns, the essential scenes, and the engine that keeps pages turning.",
        "Keep two lists: the cinematic gold, and the interior/expository passages you'll have to dramatize.",
        "Build a \"movie inside the book\" — the fraction of scenes that are the real film's spine.",
      ],
    },
    {
      slug: "what-to-cut-when-adapting-a-book",
      num: 5,
      roman: "V",
      title: "What to Cut, What to Keep",
      desc: "Compressing a 400-page book into 110 pages — what stays, what goes",
      time: "10 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `A 400-page novel holds far more story than two hours of film can. Adaptation is, above all, an act of ruthless compression — and knowing what to protect while you cut is the heart of the craft.`,
      seoTitle: "What to Cut When Adapting a Book into a Screenplay | Filmmaker Genius",
      seoDesc:
        "How to decide what to cut and what to keep when adapting a book into a screenplay — compressing subplots, combining characters, and protecting the story's essential moments. Chapter 5 of Adapting Source Material for the Screen.",
      body: `
    <p>Here's the math that scares every new adapter: a typical novel runs 90,000 words or more, and a feature screenplay runs about 20,000. You are going to lose most of the book. Not trim it — <em>lose</em> it. Subplots, minor characters, entire chapters you loved will not survive, and that's not failure; that's the job. The films that go wrong are almost always the ones that tried to keep everything and ended up a rushed, shapeless highlight reel. The ones that soar had the courage to cut deep and protect what mattered.</p>

    <h2>Start from the spine, not the book</h2>

    <p>The mistake is to open the novel at page one and start "translating." Instead, work from the spine you found in your adapter's read: whose story is this, what do they want, and what's in the way. Then judge <em>everything</em> in the book against that spine. The question for every subplot, character, and scene is simple and merciless: <strong>does this serve the central story I'm telling?</strong> If yes, it's a candidate to keep. If no — however beautiful — it goes.</p>

    <ul class="spec-list">
      <li><b>Keep what drives the spine.</b> Scenes that advance the protagonist's pursuit, raise the stakes, or deepen the central relationship.</li>
      <li><b>Keep the iconic moments.</b> The handful of scenes readers will expect and the marketing will sell. Betray these at your peril.</li>
      <li><b>Cut the detours.</b> Subplots that don't feed the main line, no matter how rich, are the first to go.</li>
      <li><b>Cut the duplicates.</b> Novels often make the same point in three scenes. Film makes it once, well.</li>
    </ul>

    <h2>Compress with combination</h2>

    <p>Cutting isn't only deletion — it's <em>consolidation.</em> Two of the adapter's most powerful tools:</p>

    <ul class="spec-list">
      <li><b>Combine characters.</b> Three of the protagonist's friends who each serve a small function can often become one vivid character who does all three jobs. Fewer people, deeper impact, less screen time spent introducing everyone.</li>
      <li><b>Collapse events.</b> A realization the book reaches over five chapters can happen in one decisive scene. Merge beats so a single moment does the work of many pages.</li>
    </ul>

    <p>Done well, combination doesn't feel like loss — it feels like focus. The film gets tighter, the characters get sharper, and the audience never misses what you removed because they never knew it was there.</p>

    <div class="pullquote">Adaptation isn't about how much of the book you can keep. It's about how little you can keep and still have it feel like the book.</div>

    <h2>Protect the soul, not the plot</h2>

    <p>Here's the subtle part. What you must protect isn't the <em>plot</em> — it's the <em>soul</em>: the feeling, theme, and central relationship that made the book matter. You can change events, cut characters, and rearrange the timeline, and audiences will forgive all of it — <em>if</em> the film still feels like the book felt. Fans don't riot because a scene is missing; they riot because the movie lost the <em>spirit</em> of the thing they loved. Cut freely, but guard that spirit with your life.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When I'm agonizing over a cut, I ask one question: "If this were gone, would the film still be <em>the same story</em>?" If yes, it goes, even if it's my favorite chapter. Early on I kept a gorgeous subplot out of love and it bloated the whole middle — the movie limped. I finally cut it and the film snapped into focus. Nobody who saw it ever knew that subplot existed. That's the lesson: your love for a scene is not evidence it belongs.</p>
    </div>

    <p>Once you've decided what survives, a related question emerges — of everything you're keeping, what is the <em>one line</em> that holds it together? That's finding the spine, and it's next.</p>
`,
      takeaways: [
        "You'll lose most of the book — deep cutting is the job, not a failure.",
        "Judge every element against the spine: does it serve the central story? If not, it goes.",
        "Compress by combining characters and collapsing events — consolidation reads as focus, not loss.",
        "Protect the soul, not the plot — audiences forgive changed events, not a lost spirit.",
      ],
    },
    {
      slug: "adapting-a-novel-into-a-screenplay",
      num: 6,
      roman: "VI",
      title: "Finding the Spine",
      desc: "Finding the one story spine that turns a novel into a movie",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `A novel can follow ten characters across twenty years. A film needs one dramatic through-line to hang everything on. Finding that spine is the move that turns a book into a movie.`,
      seoTitle: "Adapting a Novel into a Screenplay: Finding the Spine | Filmmaker Genius",
      seoDesc:
        "How to adapt a novel into a screenplay by finding its spine — the single dramatic through-line that turns a sprawling book into a two-hour film with one protagonist, one want, one arc. Chapter 6 of Adapting Source Material for the Screen.",
      body: `
    <p>In the last chapter you cut. Now you build — and everything you build hangs on one thing: the <strong>spine</strong>. When you're <em>adapting a novel into a screenplay</em>, the spine is the single dramatic through-line that carries the audience from FADE IN to FADE OUT: one protagonist, one central want, one escalating obstacle. A book can afford to wander because a reader can put it down and pick it up. A film cannot; it holds an audience captive in the dark for two hours, and the spine is the taut wire that keeps them leaning forward.</p>

    <h2>What the spine actually is</h2>

    <p>The spine is your story reduced to its irreducible dramatic core. Try to state it in a single sentence: <em>a [character] wants [goal] but faces [obstacle], and must [action or change].</em> That sentence is your compass. Once you have it, every scene in your screenplay has a job: to advance, complicate, or pay off that through-line. If a scene doesn't touch the spine, it's either doing another job you haven't identified — or it doesn't belong.</p>

    <ul class="spec-list">
      <li><b>One protagonist.</b> Novels love ensembles; films want a lead we ride with. Pick whose journey <em>is</em> the movie, even if the book split its attention.</li>
      <li><b>One central want.</b> The engine that pulls the story forward. Everything else orbits it.</li>
      <li><b>One escalating obstacle.</b> The force that makes the want hard to get, rising through the acts.</li>
      <li><b>One arc.</b> How the protagonist is different at the end — the internal change the plot exists to produce.</li>
    </ul>

    <h2>Choosing the spine when the book has many</h2>

    <p>Rich novels often contain several possible spines. A sweeping family saga could become the mother's story, the son's story, or the story of the house itself — each a completely different film. This is a decision, not a discovery, and it's one of the most creative choices you'll make. Pick the through-line that is most dramatic, most visual, and most <em>you</em> — the version of this story you're burning to tell. Then commit. Half the failed adaptations out there are books that were never forced to choose, so they tried to be all their spines at once and became none of them.</p>

    <div class="pullquote">A novel can have five stories running at once. A film has one story — and four other things that had better serve it.</div>

    <h2>Let subplots feed the spine</h2>

    <p>Choosing one spine doesn't mean throwing everything else away. The secondary threads you kept in Chapter V now get a new job: to <em>feed</em> the spine. A subplot earns its place by deepening the protagonist's want, raising the stakes, or dramatizing the theme from another angle. Reframe every surviving thread around the central line — a romance becomes the thing the hero risks, a rivalry becomes the obstacle's human face. When subplots serve the spine, the film feels rich and unified instead of scattered.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I write my spine sentence on an index card and tape it above my monitor before I outline a single scene. Every time the adaptation starts to sprawl — and it always does, because the book keeps whispering "but don't forget this part" — I look up at the card and ask whether what I'm writing serves that one line. It's astonishing how often the answer is no, and how much better the script gets when I cut the beautiful thing that didn't. The card is the whole movie in one sentence. Protect it.</p>
    </div>

    <p>With a spine chosen and your kept material orbiting it, you're ready for the most hands-on craft in the whole course: actually turning prose — description, thought, and telling — into visual, dramatic scenes. That's Chapter VII, and it's the money moment of adaptation.</p>
`,
      takeaways: [
        "The spine is the single dramatic through-line: one protagonist, one want, one escalating obstacle, one arc.",
        "State it in one sentence and use it as your compass — every scene must serve it.",
        "When a novel has many possible spines, choosing one is a creative decision — pick the most dramatic and commit.",
        "Reframe surviving subplots to feed the spine, and the film reads as unified rather than scattered.",
      ],
    },
    {
      slug: "how-to-adapt-a-book-into-a-screenplay",
      num: 7,
      roman: "VII",
      title: "Translating Prose to the Screen",
      desc: "The core craft — turning prose into visual, dramatic scenes",
      time: "11 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `This is the beating heart of adaptation: taking sentences a reader hears in their head and rebuilding them as things an audience sees and hears. Master this, and you can adapt anything.`,
      seoTitle: "How to Adapt a Book into a Screenplay: Prose to Screen | Filmmaker Genius",
      seoDesc:
        "How to adapt a book into a screenplay — the core craft of turning prose, description, and interior thought into visual, dramatic, present-tense scenes. With a before-and-after example. Chapter 7 of Adapting Source Material for the Screen.",
      body: `
    <p>Everything so far — choosing, securing, cutting, finding the spine — has been preparation. This is the act itself. <strong>Adapting a book into a screenplay</strong> comes down to one repeated move: taking prose, which can tell you anything directly, and rebuilding it as cinema, which can only <em>show</em> and <em>let you hear</em>. A novel can write "she had never forgiven her father." A film has to make you watch her not forgive him. Learn to make that conversion, scene by scene, and you can adapt any source on earth.</p>

    <h2>The golden rule: dramatize, don't narrate</h2>

    <p>Prose narrates. It summarizes years in a sentence, explains motives outright, and lives comfortably inside a character's skull. Film dramatizes: it stages a specific moment, in a specific place, where behavior reveals what prose would simply state. Your constant job as an adapter is to convert <em>telling</em> into <em>showing</em> — to find, for every important piece of information in the book, the <em>scene</em> that lets the audience discover it for themselves.</p>

    <div class="adapt-ex">
      <div class="adapt-col before">
        <div class="adapt-tag">In the novel (prose)</div>
        <p class="adapt-prose">Eleanor had always been the responsible one. Even as a child she'd counted the grocery money twice, and she carried that same wary care into everything — every friendship, every love, every risk she talked herself out of taking.</p>
      </div>
      <div class="adapt-col after">
        <div class="adapt-tag">On the screen (scene)</div>
        <div class="adapt-script">INT. CORNER STORE - DAY

ELEANOR (9) sets crumpled bills on
the counter. Counts them. Then counts
them again. Slides one back into her
sock — just in case.

Behind her, her little brother reaches
for candy. She catches his wrist
without even looking.</div>
      </div>
    </div>

    <p>Same information — Eleanor's wary, over-responsible nature — but the film makes you <em>infer</em> it from behavior. That's the whole craft in miniature: don't transcribe the sentence, stage the moment that proves it.</p>

    <h2>Turning description into image and action</h2>

    <p>A novel can spend a page on a house's history and mood. In a screenplay, you get a few lines of visual scene description and, more powerfully, you let the <em>action</em> carry the mood. Instead of writing that a marriage is cold, show the couple eating in silence at opposite ends of a long table. Instead of describing a town as forgotten, open on a faded sign and a single flickering light. Pick the two or three concrete images that <em>imply</em> everything the prose explained, and trust the audience to feel the rest.</p>

    <div class="pullquote">The reader was told. The audience must be shown, and then trusted to understand. Adaptation is an act of faith in your viewer.</div>

    <h2>Converting dialogue and inner thought</h2>

    <p>Two special cases trip up nearly every first-time adapter:</p>

    <ul class="spec-list">
      <li><b>Book dialogue rarely plays as-is.</b> Novelists write speech to be read; it's often long, formal, or on-the-nose. Screen dialogue is compressed, oblique, and does several jobs at once. Keep the intent and the best lines, but rewrite for the ear — cut, sharpen, and let subtext carry weight.</li>
      <li><b>Interior thought has to be externalized.</b> The single hardest problem in adaptation is that so much of a novel happens inside heads. You can't film a thought. You convert it — into action, into a look, into a line of dialogue, into a choice the character makes. (This is so central it gets its own chapter next.)</li>
    </ul>

    <h2>Write in the present, active voice of film</h2>

    <p>Finally, remember the grammar of the form. A screenplay is written in the present tense — everything happens <em>now</em>, in front of us. It's lean: only what we can see and hear goes on the page. And it's active: characters <em>do</em> things. As you convert each passage, keep asking, "What does the camera actually see here? What do we hear?" If your answer is "we understand that she feels…," you haven't adapted it yet — you've just copied the prose. Push until the feeling lives in something visible.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My desk trick for this whole chapter: I take a passage from the book and physically ask, "If I handed this to a cinematographer and an actor, what would they shoot?" Prose like "he was consumed by guilt" gives them nothing. So I keep pushing until I've written something they can actually make — he can't meet anyone's eyes, he scrubs a clean pan for the third time, he flinches when the phone rings. The moment my page gives a crew something concrete to do, I've finally translated it. Until then, I'm still just reading the book out loud.</p>
    </div>

    <p>The thorniest version of this problem — a character's private inner world, memory, and the temptation of voice-over — is big enough to need its own chapter. That's Chapter VIII: interiority and voice-over.</p>
`,
      takeaways: [
        "The core move is dramatize, don't narrate — find the scene that lets the audience discover what prose would just state.",
        "Convert description into a few concrete images and let action carry mood; trust the viewer to infer the rest.",
        "Rewrite book dialogue for the ear, and externalize interior thought into action, looks, and choices.",
        "Ask of every passage, \"What does the camera see and hear?\" If the answer is \"we understand she feels…,\" keep going.",
      ],
    },
    {
      slug: "adapting-internal-monologue-to-film",
      num: 8,
      roman: "VIII",
      title: "Interiority & Voice-Over",
      desc: "Handling internal monologue, memory, and voice-over",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `The deepest problem in adaptation: novels live inside people's heads, and you can't film a thought. Here's how to externalize a character's inner world — and how to use voice-over without leaning on it.`,
      seoTitle: "Adapting Internal Monologue to Film: Interiority & Voice-Over | Filmmaker Genius",
      seoDesc:
        "How to adapt internal monologue to film — externalizing a character's thoughts, memory, and inner life into action and image, and using voice-over well instead of as a crutch. Chapter 8 of Adapting Source Material for the Screen.",
      body: `
    <p>Ask any screenwriter what makes adaptation hard and they'll say the same thing: prose can go inside a character's head, and film can't. A novel can give you a hundred pages of what someone thinks, remembers, fears, and secretly wants — the entire private interior that often <em>is</em> the book. Film has no direct line to that inner world. So <strong>adapting internal monologue to film</strong> becomes the defining craft problem of the whole discipline, and how you solve it separates flat, talky adaptations from ones that feel alive.</p>

    <h2>Externalize: turn thought into behavior</h2>

    <p>The primary tool is <em>externalization</em> — converting inner states into things the camera can see. A thought becomes an action, an object, a glance, a choice. You already met this idea in Chapter VII; here it becomes a discipline you apply to a character's entire inner life:</p>

    <ul class="spec-list">
      <li><b>Thought → action.</b> "She was furious but wouldn't show it" becomes her calmly, deliberately washing a glass until it squeaks — then setting it down a half-inch too hard.</li>
      <li><b>Memory → behavior in the present.</b> Instead of narrating a character's trauma, show how it makes them flinch, avoid, or over-prepare now.</li>
      <li><b>Desire → pursuit.</b> A secret longing becomes a look held too long, a detour past someone's window, a lie about where they were.</li>
      <li><b>Inner conflict → external choice.</b> Give the character a decision that <em>forces</em> the private struggle into the open, where we can watch them choose.</li>
    </ul>

    <p>Great actors are your allies here. A single well-directed reaction can carry what took the novelist a paragraph of interiority — but only if you've built the scene so the feeling has somewhere to show.</p>

    <div class="pullquote">You can't film a thought. But you can film a person trying not to have one — and that's often more powerful than the thought itself.</div>

    <h2>Other tools for the inner world</h2>

    <ul class="spec-list">
      <li><b>Visual metaphor and imagery.</b> A recurring image, a color, a place can carry an emotional undercurrent the prose stated outright.</li>
      <li><b>Symbolic objects.</b> Give an inner theme a physical anchor — a ring, a photograph, a childhood toy — and let what the character does with it speak.</li>
      <li><b>Dream, fantasy, or memory sequences.</b> Used sparingly, brief subjective flashes can show us inside a head without narration. Sparingly is the word.</li>
      <li><b>Confidants and dialogue.</b> Sometimes a character can voice part of their inner life to another person — but rewrite it as real, oblique conversation, not a therapy monologue.</li>
    </ul>

    <h2>The voice-over question</h2>

    <p>Which brings us to the most debated tool in adaptation: <strong>voice-over</strong>. It's tempting — it lets you lift the book's narration straight onto the soundtrack. Sometimes it's the right call: when the narrator's voice <em>is</em> the point (wit, irony, a distinctive perspective), voice-over can be glorious and define the film. But used as a crutch — to explain what the images should be showing — it's the mark of an adaptation that gave up. The test is simple:</p>

    <ul class="spec-list">
      <li><b>Good voice-over adds a layer</b> the pictures can't — irony, distance, a second meaning, a voice we love being with.</li>
      <li><b>Bad voice-over duplicates</b> what we already see, telling us what to feel instead of letting us feel it.</li>
    </ul>

    <p>If your voice-over could be deleted and the scene would still play, it's probably a crutch. If deleting it removes something essential and irreplaceable, it's earning its place.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My rule: I ban myself from voice-over on the first pass. Forcing myself to externalize everything makes the script dramatically stronger, because I have to <em>stage</em> the inner life instead of narrating it. Then, only if a scene still can't breathe without the narrator's specific voice, I add voice-over back — deliberately, as a choice, not a bandage. Nine times out of ten I never bring it back, and the film is better for it. The tenth time, it becomes the soul of the movie.</p>
    </div>

    <p>That completes the core craft — you can now cut, find the spine, and turn any prose, even a character's private thoughts, into cinema. Module 3 takes you into the special cases where the rules bend: true stories, short stories and IP, the faithfulness question, and the pitfalls to dodge. Next: adapting true stories and biopics.</p>
`,
      takeaways: [
        "You can't film a thought — externalize inner life into action, behavior, choices, and reactions.",
        "Use visual metaphor, symbolic objects, and sparing memory sequences to carry emotion without narration.",
        "Voice-over is great when the narrator's voice adds a layer the images can't — bad when it just duplicates them.",
        "Try banning voice-over on the first pass; add it back only if a scene truly can't live without it.",
      ],
    },
    {
      slug: "based-on-a-true-story-screenplay",
      num: 9,
      roman: "IX",
      title: "Adapting True Stories & Biopics",
      desc: "Based on a true story — biopics, rights, and dramatic license",
      time: "10 min",
      moduleKey: "apply",
      kicker: "Special Cases",
      dek: `"Based on a true story" is one of the most powerful lines in film marketing — and one of the trickiest to earn. Real life doesn't come pre-shaped into three acts, and real people can push back. Here's how to do it right.`,
      seoTitle: "Based on a True Story: Adapting True Stories & Biopics | Filmmaker Genius",
      seoDesc:
        "How to write a based-on-a-true-story screenplay — structuring real events, life rights and legal safety, dramatic license, and turning a messy true story into a shaped biopic. Chapter 9 of Adapting Source Material for the Screen.",
      body: `
    <p>Adapting a true story is its own strange craft. Instead of a novelist's shaped narrative, your source is <em>reality</em> — a biography, a news article, a historical event, a person's life — and reality is gloriously, inconveniently unstructured. It has no act breaks, no clean protagonist, no tidy ending, and it comes with something no novel does: real human beings who can be hurt by how you portray them, and who may have legal standing to object. A <strong>based-on-a-true-story screenplay</strong> asks you to be part dramatist, part journalist, and part diplomat.</p>

    <h2>Finding the story inside the facts</h2>

    <p>A whole life is not a movie. The first job is to find the <em>story</em> inside the biography — the same spine-hunt from Chapter VI, applied to real events. You are not obligated to cover someone's entire existence; the best biopics zero in on a defining stretch, a single struggle, or one revealing relationship.</p>

    <ul class="spec-list">
      <li><b>Choose a window, not a whole life.</b> The few years or the single event where this person's story reaches its dramatic peak.</li>
      <li><b>Find the want and the obstacle.</b> Real people had goals and faced resistance — that's your engine. Frame the facts around it.</li>
      <li><b>Pick a theme.</b> What is this true story <em>about</em>? Ambition, forgiveness, injustice? The theme tells you which facts matter and which to drop.</li>
      <li><b>Accept that you'll compress.</b> Timelines get tightened, minor figures combined, scattered events merged into one — the tools from Module 2 apply to reality too.</li>
    </ul>

    <h2>Dramatic license — and its limits</h2>

    <p>"Based on a true story" is not a documentary. Audiences understand that filmmakers compress time, invent connective dialogue, and combine minor characters to shape a watchable film — that's <em>dramatic license</em>, and it's expected. The art is using it to reveal a deeper truth, not to distort the essential one. Change the seating chart of a dinner; don't change who betrayed whom if that's the point of the story. The ethical compass: <strong>stay true to the spirit and the material facts, even as you reshape the details.</strong> Where a story touches living people, real harm, or contested history, that responsibility gets heavier.</p>

    <div class="pullquote">Dramatic license lets you rearrange the furniture of a true story. It does not let you lie about what happened in the room.</div>

    <h2>Rights, life rights, and legal safety</h2>

    <p>This is where true stories get legally serious, and where you protect yourself and your film:</p>

    <ul class="spec-list">
      <li><b>Life rights.</b> You often don't strictly need them to depict genuinely public facts, but securing them buys cooperation, private detail, and a shield against disputes. For a living subject or their family, they're usually worth pursuing.</li>
      <li><b>Defamation and privacy.</b> Portraying a real, living person in a false and damaging way — or exposing private facts — can carry real legal risk. Depicting public figures and public events has more latitude than private individuals, but the lines are fact-specific.</li>
      <li><b>Underlying works.</b> If your true story comes <em>through</em> a book or article (a magazine piece, a biography), you may need those rights too — the author shaped that telling.</li>
      <li><b>Get legal counsel.</b> True-story projects are commonly vetted by lawyers before production. This chapter makes you aware of the landmines; an entertainment attorney helps you walk through the field.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The thing I keep front of mind on a true story: somewhere out there is the real person, or the people who loved them, and one day they'll watch this. That doesn't mean flattery — honest films portray flaws. It means care. I ask whether I'd be able to defend every major choice to their face as fair and truthful in spirit. If a change is just lazy or sensational, it goes. If it reveals something true more clearly, it earns its place. That test keeps me both dramatically bold and ethically honest.</p>
    </div>

    <p>True stories are the biggest of the special cases, but not the only one. Sometimes your source is tiny — a short story, a magazine article — and the challenge flips from cutting to <em>expanding</em>. Sometimes it's a game or other IP with its own rules. That's Chapter X.</p>
`,
      takeaways: [
        "A whole life isn't a movie — find the story inside the facts: a window, a want, an obstacle, a theme.",
        "Dramatic license lets you compress and shape details, but stay true to the spirit and material facts.",
        "Life rights buy cooperation and protection; defamation and privacy are real risks with living, private people.",
        "Get legal counsel on true-story projects — and ask if you could defend every major choice to the real people.",
      ],
    },
    {
      slug: "adapting-a-short-story-into-a-film",
      num: 10,
      roman: "X",
      title: "Short Stories, Articles & IP",
      desc: "Expanding short stories and articles; adapting games and IP",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Special Cases",
      dek: `Not every source is a fat novel you have to trim. Sometimes it's a twelve-page short story or a magazine article, and the whole challenge flips: now you have to build <em>out</em>. Plus a word on adapting games and other IP.`,
      seoTitle: "Adapting a Short Story into a Film (Plus Articles & IP) | Filmmaker Genius",
      seoDesc:
        "How to adapt a short story into a film — expanding rather than cutting, building out characters and world, and adapting magazine articles, games, and other IP. Chapter 10 of Adapting Source Material for the Screen.",
      body: `
    <p>Everything in Module 2 assumed your problem was <em>too much</em> material. But some of the greatest films come from sources with the opposite problem — a short story, a single magazine article, a comic panel — where there isn't nearly enough to fill two hours. Some landmark films grew from a handful of pages. <strong>Adapting a short story into a film</strong> is a completely different discipline from adapting a novel: instead of the surgeon's scalpel, you need the architect's blueprint. You're not trimming a story down; you're building one up.</p>

    <h2>Expanding a short story</h2>

    <p>A short story usually gives you a brilliant core — a premise, a character, an image, a twist — but stops there. Your job is to expand it into a full dramatic structure without betraying what made the original sing:</p>

    <ul class="spec-list">
      <li><b>Protect the core.</b> Identify the one thing that makes the story unforgettable — the concept or the ending — and build everything to serve it.</li>
      <li><b>Build the world outward.</b> The story implies a life around its moment. Invent the before and after, the wider setting, the surrounding characters the story only hinted at.</li>
      <li><b>Deepen the characters.</b> Short fiction often sketches; film needs fully drawn people. Give them histories, wants, and relationships the page didn't have room for.</li>
      <li><b>Add structure and subplot.</b> A single incident may need an act built around it — a rising complication, a secondary thread — to carry feature length. Invent responsibly, in the story's spirit.</li>
    </ul>

    <p>The danger here isn't butchery, it's <em>padding</em> — bloating a perfect small story with filler that dilutes it. Every addition must feel like it was always implied by the original, a natural expansion rather than a bolted-on subplot.</p>

    <div class="pullquote">Adapting a novel, you ask "what can I lose?" Adapting a short story, you ask "what can I grow?" — and the answer must always feel native to the seed.</div>

    <h2>Adapting articles and non-fiction</h2>

    <p>Magazine articles and long-form journalism have become goldmines for film — a single reported piece can hold a whole movie. But an article is information, not story. Adapting one blends the true-story craft from Chapter IX with the expansion craft above: you find the human narrative inside the reporting, choose a protagonist, dramatize events the article merely summarized, and invent connective scenes and dialogue to make it play. And because it's factual and often about real people, the rights, defamation, and life-rights considerations from the last chapter apply in full.</p>

    <h2>Games, comics, and other IP</h2>

    <p>Adapting a video game, comic, or other property brings its own puzzles. These sources are often rich in <em>world</em> and character but thin or non-linear in <em>plot</em> — a game is an experience, not a three-act story. The move is usually to keep the beloved world, tone, and iconic elements fans expect, then build a focused, original dramatic spine <em>inside</em> that world rather than trying to film the source beat-for-beat. And because established IP is almost always owned by a company, the rights are typically controlled and negotiated at a corporate level — very different from optioning a novel from its author.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When I expand a short source, I use a test I call "the seed check." For every new scene, character, or subplot I invent, I ask: does this <em>grow from</em> the original, or is it just something I bolted on to hit ninety minutes? If it grows from the seed — the story's core idea — it belongs. If it's filler, the audience feels the sag even if they can't name it. A great short story is a seed, not a hole to fill. Your job is to grow the tree it always contained.</p>
    </div>

    <p>You've now handled every kind of source — long, short, true, and IP. That raises the question that hangs over all of them, and over every adaptation ever made: how faithful should you be to the original, and when should you make it your own? That's Chapter XI.</p>
`,
      takeaways: [
        "Adapting a short story flips the job — you build out, not cut down.",
        "Protect the core, then expand world, characters, and structure so additions feel native to the original.",
        "Articles blend true-story and expansion craft — find the human narrative and mind the rights.",
        "For games and IP, keep the beloved world but build an original dramatic spine inside it.",
      ],
    },
    {
      slug: "faithful-vs-loose-adaptation",
      num: 11,
      roman: "XI",
      title: "Faithful vs. Making It Yours",
      desc: "How faithful to be — and when to make it your own",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Special Cases",
      dek: `The eternal adaptation question: how close do you stay to the source? Slavish faithfulness can kill a film; wild reinvention can betray it. The answer isn't a rule — it's a judgment, and here's how to make it.`,
      seoTitle: "Faithful vs. Loose Adaptation: How Faithful Should You Be? | Filmmaker Genius",
      seoDesc:
        "Faithful vs. loose adaptation — how faithful to be to the source, when to make it your own, and how to honor the spirit of a book while serving the film. Chapter 11 of Adapting Source Material for the Screen.",
      body: `
    <p>Every adapter eventually stands at the same crossroads. Behind you is a source people love; in front of you is a film that needs to be its own living thing. Lean too far toward <em>faithfulness</em> and you risk a stiff, reverent transcription that plays like a book on legs. Lean too far toward <em>reinvention</em> and you risk betraying the very thing that made anyone care. The <strong>faithful vs. loose adaptation</strong> question has no universal answer — but it does have a reliable compass, and learning to read it is the mark of a mature adapter.</p>

    <h2>The spectrum of adaptation</h2>

    <p>Adaptations live on a wide spectrum, and all of it is legitimate:</p>

    <ul class="spec-list">
      <li><b>Faithful.</b> Hews closely to the source's plot, characters, and tone. Works beautifully when the book is already dramatic and beloved for its story.</li>
      <li><b>Loose.</b> Keeps the premise, characters, or spirit but freely reshapes plot and structure for the screen. Most successful adaptations live here.</li>
      <li><b>Radical / re-imagining.</b> Takes a core idea or theme and builds something largely new — a modern retelling, a shift in setting or point of view.</li>
    </ul>

    <p>No point on this spectrum is "correct." A tight thriller may demand faithfulness; a sprawling, flawed novel may beg for radical reinvention. The right position depends on the source, your vision, and what will make the best <em>film</em>.</p>

    <div class="pullquote">Faithfulness to the letter is easy and often lifeless. Faithfulness to the spirit is hard and almost always what people actually loved.</div>

    <h2>The compass: honor the spirit, serve the film</h2>

    <p>Here's the principle that resolves the tension. Your obligation isn't to the source's <em>plot points</em> — it's to its <em>spirit</em>: the emotional core, the theme, the essential experience that made it matter. You can change events, characters, and endings freely, <em>provided</em> the film still delivers that essential experience. That's why a "loose" adaptation can feel more faithful than a slavish one: it kept the soul even as it changed the body. And it's why a scene-perfect transcription can feel like a betrayal — it kept every event and lost the reason anyone cared.</p>

    <p>So run every change through two questions: <strong>Does this serve the film?</strong> And <strong>does it honor the spirit of the source?</strong> A change that does both is a gift. A change that does neither is vandalism. And when the two collide — when serving the film means departing from the source — the film usually wins, because a faithful adaptation nobody enjoys serves no one, least of all the book you love.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Early on I was so afraid of "getting it wrong" that I clung to the book like a life raft, and the script came out airless — technically faithful, dramatically dead. A mentor asked me one question that changed how I work: "What did you <em>feel</em> reading it?" Not what happened — what I felt. Once I chased that feeling instead of the plot, I started cutting and changing boldly, and the script finally came alive. Protect the feeling, spend the plot. That's the whole balance.</p>
    </div>

    <p>Make it yours — but keep its soul. That's the balance every good adaptation strikes. There's one chapter left, and it's the safety net: the classic traps that catch first-time adapters, and how to sidestep every one. That's Chapter XII, the finale.</p>
`,
      takeaways: [
        "Adaptations range from faithful to loose to radical — every point on the spectrum is legitimate.",
        "Your obligation is to the spirit, not the plot points — keep the soul, and you can change the body freely.",
        "Run every change through two questions: does it serve the film, and does it honor the spirit?",
        "When film and source collide, the film usually wins — a faithful adaptation nobody enjoys serves no one.",
      ],
    },
    {
      slug: "adaptation-mistakes-to-avoid",
      num: 12,
      roman: "XII",
      title: "Common Adaptation Pitfalls",
      desc: "The classic adaptation traps — and how to avoid them",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Special Cases",
      dek: `Almost every failed adaptation fails in one of a few predictable ways. Know these traps in advance and you can steer around every one of them. Consider this your pre-flight checklist.`,
      seoTitle: "Common Adaptation Mistakes to Avoid | Filmmaker Genius",
      seoDesc:
        "The most common adaptation mistakes to avoid — cramming in too much, staying too faithful, keeping interiority as voice-over, and losing the spine. The pitfalls that trap first-time adapters, and how to sidestep them. Chapter 12, the finale of Adapting Source Material for the Screen.",
      body: `
    <p>You now have every tool this course can give you. This final chapter is the safety net — the classic <strong>adaptation mistakes</strong> that sink first-time adapters, gathered in one place so you can spot them in your own draft before anyone else does. Every one of these is really the same lesson from a different angle: <em>you're making a film, not preserving a book.</em> Keep that at the center and you'll dodge most of the traps below on instinct.</p>

    <h2>The seven deadly adaptation traps</h2>

    <ul class="spec-list">
      <li><b>Cramming in too much.</b> The most common failure by far. Terrified to cut, you keep every subplot and character, and the film becomes a breathless highlight reel that rushes through events without ever landing one. Cure: commit to the spine and cut without mercy (Chapters V–VI).</li>
      <li><b>Being too faithful.</b> Reverent, scene-for-scene transcription that plays stiff and lifeless because it served the book's structure instead of the film's. Cure: honor the spirit, not the letter (Chapter XI).</li>
      <li><b>Leaving the story on the page.</b> Interior thoughts, themes, and motivations that stay <em>told</em> — often dumped into voice-over — instead of being dramatized. Cure: externalize everything (Chapters VII–VIII).</li>
      <li><b>Losing the spine.</b> Trying to keep the novel's multiple storylines, so the film has no clear protagonist or through-line and feels like it's about everything and nothing. Cure: choose one spine and make subplots serve it (Chapter VI).</li>
      <li><b>Betraying the soul.</b> Changing the one thing fans actually loved — the tone, the ending's meaning, the central relationship — while keeping trivial details. Cure: identify and protect the emotional core above all else.</li>
      <li><b>Fear of change.</b> Refusing to invent or depart even when the film desperately needs it, out of loyalty to the source. Cure: remember the book still exists; your job is a great movie (Chapters I & XI).</li>
      <li><b>Ignoring the legal groundwork.</b> Writing a full adaptation you have no right to sell, or mishandling a true story's rights and defamation risks. Cure: secure the rights first, get counsel for true stories (Chapters III & IX).</li>
    </ul>

    <div class="pullquote">Nearly every bad adaptation is a good book that the filmmaker was too afraid to turn into a movie. Respect the source by making something that lives on its own.</div>

    <h2>The self-check before you call it done</h2>

    <p>Before you send your adaptation out, run it against a simple gut-check that catches most of the traps at once:</p>

    <ul class="spec-list">
      <li><b>Does it work as a film to someone who never read the source?</b> The ultimate test. If it only makes sense to fans, you've made a companion piece, not a movie.</li>
      <li><b>Can you state the spine in one sentence?</b> If not, you probably kept too much.</li>
      <li><b>Is the inner life visible?</b> Scan for anything that's still just <em>told</em> — thought, theme, motive — and dramatize it.</li>
      <li><b>Does it still feel like the source felt?</b> Different events, same soul. If a fan would feel what they felt reading it, you nailed the hardest part.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My final ritual on any adaptation: I hand the script to someone who has <em>never</em> touched the source material and I watch their face while they read. Fans will forgive gaps by filling them in from memory; a fresh reader can't, so every hole, every "wait, why does that matter?" shows up instantly. If the film grips someone who's never heard of the book, it'll grip everyone. If it only works for people holding the novel in their heads, I'm not done — and that's the most useful, most humbling test I know.</p>
    </div>

    <p>That's the whole craft — choosing, securing, cutting, finding the spine, translating prose to the screen, handling the special cases, and steering around the traps. You have everything you need to take a story you love and make it live in a new form. Now go find your source, and get to work.</p>
`,
      takeaways: [
        "The big traps: cramming in too much, being too faithful, leaving story on the page, and losing the spine.",
        "Don't betray the soul or fear necessary change — and never skip the legal groundwork.",
        "Every trap is the same lesson: you're making a film, not preserving a book.",
        "The ultimate test: does it work for someone who never read the source?",
      ],
    },
  ],
};
