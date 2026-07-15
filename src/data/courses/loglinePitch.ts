import type { Course } from "../courseTypes";

export const loglinePitch: Course = {
  slug: "how-to-write-a-logline",
  title: "Writing the Logline & Pitch Document",
  categoryLabel: "Development & Writing",
  subtitle:
    "Your logline is the first thing anyone reads — and often the only thing. Learn to distill your movie into one irresistible sentence, then build it into a pitch package that actually gets your film made.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~95 min read",
  pairsWithName: "Pitch Deck Maker",
  pairsWithUrl: "https://filmmakergenius.com/pitch-deck",
  pairsWithDesc:
    "Turn your logline and story into a professional pitch deck. The Pitch Deck Maker builds the visual package financiers and producers expect — title, logline, synopsis, look, and comps — in minutes.",
  seoTitle: "How to Write a Logline & Pitch Your Movie: Free Course | Filmmaker Genius",
  seoDesc:
    "Learn how to write a logline and build a pitch that sells your film — free. A 12-chapter course on the logline formula, the one-sheet, synopsis, pitch deck, and the verbal pitch, taught by a working filmmaker.",
  learn: [
    "Distill any story into one sharp, sellable logline",
    "Avoid the vague, flat mistakes that sink most loglines",
    "Build a full pitch package — the one-sheet, synopsis, and pitch deck",
    "Pitch your film out loud and tailor it to any buyer in the room",
  ],
  mosaic: [
    `INT. FILM SET<br>- DAY<br><br>Crew settles.`,
    `ROLL SOUND`,
    `SCENE 42`,
    `CUT TO:<br><br>EXT. BACKLOT<br>- NIGHT`,
    `Take 1 of 3`,
    `ACTION.`,
  ],
  modules: [
    { key: "foundations", label: "Module 1 — Foundations" },
    { key: "core", label: "Module 2 — Core Craft" },
    { key: "apply", label: "Module 3 — Putting It to Work" },
  ],
  chapters: [
    {
      slug: "what-is-a-logline",
      num: 1,
      roman: "I",
      title: "What Is a Logline?",
      desc: "The one-sentence version of your movie — and why it matters",
      time: "7 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `It's one sentence — and it may be the most important thing you ever write about your film. Before you can craft a great logline, you have to understand exactly what it is and what it's for.`,
      seoTitle: "What Is a Logline? The One-Sentence Pitch, Explained | Filmmaker Genius",
      seoDesc:
        "What a logline is, why it's the most important sentence you'll write, and how it differs from a tagline or synopsis. Chapter 1 of Writing the Logline & Pitch Document.",
      body: `
    <p>I've watched a producer decide the fate of a script in the time it took to read one sentence. Not a page, not a scene — the logline at the top of the query. If it grabbed her, she read on. If it didn't, the script went unopened. That's the brutal, beautiful power of the logline: it's the gate every project has to pass through, and most never make it because the writer never learned to build one. This whole course exists to fix that, and it starts with knowing precisely what a logline is.</p>

    <h2>The one-sentence version of your movie</h2>

    <p>A <strong>logline is a single sentence — usually 25 to 40 words — that captures the essence of your story: who it's about, what they're trying to do, and what stands in their way.</strong> It's not a summary of the plot, and it's not a mood piece. It's a compressed hook designed to make a listener instantly understand the movie and want to see it. Done right, someone hears your logline and can already picture the film in their head.</p>

    <p>Think of the classic example: <em>"When a great white shark terrorizes a beach town, a water-phobic sheriff must hunt it down before it kills again."</em> In one breath you know the world, the hero, the problem, the irony, and the stakes. That's a logline doing its job.</p>

    <div class="pullquote">A logline isn't marketing you add at the end. It's a test you run at the beginning — if you can't say your movie in one sentence, you may not yet understand it.</div>

    <h2>What a logline is <em>not</em></h2>

    <p>Loglines get confused with their cousins. Keeping them straight matters, because each does a different job:</p>

    <ul class="spec-list">
      <li><b>Not a tagline.</b> A tagline is ad copy — <em>"In space, no one can hear you scream."</em> Evocative, but it doesn't tell you the story. A logline informs; a tagline seduces.</li>
      <li><b>Not a synopsis.</b> A synopsis is a paragraph (or a page) that walks through the plot. A logline is one sentence that captures the hook without the details.</li>
      <li><b>Not a theme.</b> "A film about grief" is a subject, not a logline. A logline needs a character, a goal, and conflict — a story, not a topic.</li>
    </ul>

    <h2>Why it's the most valuable sentence you'll write</h2>

    <p>The logline works this hard because it lives everywhere. It's the first line of your query letter, the hook on your pitch deck, the answer to "so what's it about?" at every party and every meeting. It's what a producer repeats to their financing partner when you're not in the room — which means your logline has to be not just clear, but <em>repeatable.</em> And it's a creative tool as much as a sales one: the discipline of compressing your film into one sentence forces you to find its true center. Writers who can't write their logline often discover their story has two ideas fighting each other, or no clear engine at all. The logline is where you find out.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>In the film business, the logline is the currency of the first conversation. Executives, agents, and financiers think and speak in loglines — it's how projects get described up the chain of decision-makers. A strong one can travel a company in an afternoon; a weak one stops your film at the front desk. Long before anyone reads your script or sees a frame, your logline is out there doing the selling for you. Make it undeniable.</p>
    </div>

    <p>Now you know what a logline is and why it carries so much weight. In the next chapter we make it buildable: the formula that turns any story into a working logline, piece by piece.</p>
`,
      takeaways: [
        "A logline is one 25–40 word sentence: who it's about, what they want, and what's in the way.",
        "It's a hook, not a summary — the reader should picture the movie instantly.",
        "It's not a tagline, a synopsis, or a theme — it needs a character, goal, and conflict.",
        "It's the currency of the first conversation — make it clear, repeatable, and undeniable.",
      ],
    },
    {
      slug: "logline-formula",
      num: 2,
      roman: "II",
      title: "The Logline Formula",
      desc: "Protagonist, goal, conflict, stakes — the shape that works",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `A great logline can feel like magic, but it's really engineering. Underneath almost every one is the same set of parts — and once you can see them, you can build a logline for any story.`,
      seoTitle: "The Logline Formula: A Template That Actually Works | Filmmaker Genius",
      seoDesc:
        "The logline formula — protagonist, inciting incident, goal, and stakes — and a fill-in template you can use on any story. Chapter 2 of Writing the Logline & Pitch Document.",
      body: `
    <p>When I was starting out, I treated loglines like poetry — something you either had a knack for or didn't. Then a mentor showed me they're closer to a recipe. There are ingredients, and there's an order, and if you include the right parts, you get something that works nearly every time. You'll break the formula later, once it's instinct — but learning it first is how you stop guessing.</p>

    <h2>The four essential ingredients</h2>

    <p>Almost every strong logline contains four things. Miss one and the sentence goes soft:</p>

    <ul class="spec-list">
      <li><b>The protagonist</b> — described by identity, not name. Not "Sarah," but "a grieving detective," "a teenage runaway," "a washed-up boxer." One vivid adjective does a lot of work.</li>
      <li><b>The inciting incident</b> — the event that launches the story. The thing that happens to force everything into motion.</li>
      <li><b>The goal</b> — what the protagonist is now desperately trying to do. The engine of the film.</li>
      <li><b>The stakes / opposition</b> — what happens if they fail, or the force standing in their way. Without stakes, no one cares.</li>
    </ul>

    <h2>A template you can fill in</h2>

    <p>Here's the workhorse structure. It's not the only shape, but it's the one that reliably contains all four ingredients:</p>

    <div class="formula-box">
      <em>When</em> [inciting incident], <em>a</em> [protagonist with a defining trait] <em>must</em> [goal] <em>before / or</em> [stakes].
    </div>

    <p>Plug in <em>Jaws</em>: "When a great white shark terrorizes a beach town, a water-phobic sheriff must hunt it down before it kills again." Every slot is filled, and the sentence sells the movie. Try it on your own story — even a clunky first fill-in will show you instantly whether your four ingredients are actually there.</p>

    <h2>The secret ingredient: irony</h2>

    <p>The formula gets you a functional logline. What lifts it to <em>compelling</em> is <strong>irony</strong> — a built-in tension or contradiction that makes the premise crackle. The sheriff who has to face a shark is <em>afraid of water.</em> The assassin is <em>afraid of blood.</em> The wedding planner <em>can't find love.</em> That friction is what makes a listener lean in, because it promises conflict baked right into the character. When you build your logline, hunt for the irony in your premise and put it front and center. If there's no inherent tension, that's often a sign the premise itself needs more heat.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The formula does double duty as a diagnostic. If you sit down to fill in the template and can't find a clear goal, or the stakes feel fuzzy, or there's no irony anywhere — that's not a logline problem, it's a <em>story</em> problem the logline just exposed. I've rescued more than one script by writing its logline early, hitting a blank slot, and realizing the screenplay had the same hole. Build the logline before you finish the script and it'll tell you where the weak spots are.</p>
    </div>

    <p>You now have a repeatable way to build a logline from parts. But a formula on its own can feel mechanical — the real learning comes from seeing it in the wild. Next chapter: great loglines dissected, so you can feel exactly what separates the ones that sell from the ones that stall.</p>
`,
      takeaways: [
        "Nearly every strong logline has four parts: protagonist, inciting incident, goal, and stakes.",
        "Use the template: \"When [event], a [protagonist] must [goal] before [stakes].\"",
        "Describe the protagonist by identity and one vivid trait, never by name.",
        "Irony is the secret ingredient — and a blank slot in the formula reveals a hole in your story.",
      ],
    },
    {
      slug: "logline-examples",
      num: 3,
      roman: "III",
      title: "Logline Examples That Work",
      desc: "Great loglines dissected, and what makes them land",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `A formula tells you the parts; examples show you the music. Let's dissect a handful of loglines across genres and see exactly why each one makes you want to watch the movie.`,
      seoTitle: "Logline Examples That Work: Great Loglines Dissected | Filmmaker Genius",
      seoDesc:
        "Real logline examples across genres, broken down piece by piece so you can see exactly what makes a logline sell. Chapter 3 of Writing the Logline & Pitch Document.",
      body: `
    <p>You can study the formula all day, but nothing teaches loglines like taking apart ones that work. Below are loglines for films you know, written in the standard form, with the machinery exposed. Read each one and notice how quickly you can picture the movie — and then notice <em>why.</em> These aren't the official marketing loglines; they're the clean, functional versions a writer would pitch.</p>

    <h2>Five loglines, dissected</h2>

    <div class="ex-card">
      <div class="ex-log">"When a great white shark begins killing swimmers off a beach town, the water-phobic police chief must hunt it down before it destroys the summer season — and the town."</div>
      <div class="ex-why"><b>Why it works:</b> The irony is doing the heavy lifting — a man afraid of water has to go into the water. Clear protagonist, clear threat, escalating stakes (people, then the town). You see the whole movie.</div>
    </div>

    <div class="ex-card">
      <div class="ex-log">"A hacker discovers that reality is a computer simulation and must choose whether to join a rebellion to free humanity from the machines that enslave it."</div>
      <div class="ex-why"><b>Why it works:</b> A high-concept hook ("reality is a simulation") plus a clear choice with world-sized stakes. The premise itself is the sell — it promises a world you've never seen.</div>
    </div>

    <div class="ex-card">
      <div class="ex-log">"After his son is captured by a diver, a timid, overprotective clownfish must cross the entire ocean to rescue him — facing every fear he has along the way."</div>
      <div class="ex-why"><b>Why it works:</b> Emotional engine (a father saving his son) fused with a character flaw that the journey will cure (timid → brave). The goal is simple and the stakes are the highest kind: family.</div>
    </div>

    <div class="ex-card">
      <div class="ex-log">"A New York cop caught in the wrong place must single-handedly stop a team of thieves who have taken his wife and dozens of others hostage in an office tower."</div>
      <div class="ex-why"><b>Why it works:</b> Contained, visual, and urgent — one man, one building, a ticking situation. Personal stakes (his wife) raise it above a generic action premise.</div>
    </div>

    <div class="ex-card">
      <div class="ex-log">"A young Black man visits his white girlfriend's family for the weekend and slowly realizes their unsettling hospitality hides a sinister plan he may not survive."</div>
      <div class="ex-why"><b>Why it works:</b> A relatable, dread-soaked situation with a killer hook and rising menace. The stakes (survival) and the "what is really going on here?" question pull you straight in.</div>
    </div>

    <h2>What they all share</h2>

    <p>Read them back to back and the pattern jumps out. Every one has a protagonist you can picture, a clear goal, real stakes, and — crucially — a hook or irony that makes the premise <em>specific.</em> None of them explain the plot; they promise an experience. And every one could be said out loud in a single breath and remembered afterward. That last point matters more than any: these loglines are <strong>repeatable.</strong></p>

    <div class="pullquote">Notice what's missing from every example: names, backstory, subplots, and adjectives that don't earn their place. A great logline is defined as much by what it leaves out as what it includes.</div>

    <p>Study loglines for films in <em>your</em> genre the same way — write out the clean version and mark the four ingredients and the hook. You'll build an ear for what works, and start hearing when your own logline is missing a part.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A useful pro habit: keep a running file of loglines you admire, written in your own words. When you're stuck on your own, this "swipe file" shows you moves you can borrow — how a thriller states its clock, how a drama front-loads emotion, how a comedy signals its tone. You're not copying stories; you're learning the <em>shapes</em> that sell them. Every working writer I know has some version of this file.</p>
    </div>

    <p>You've now seen what right looks like. Just as valuable is knowing what wrong looks like — because most loglines fail in a handful of predictable ways. Next chapter: the common logline mistakes, and how to catch them in your own.</p>
`,
      takeaways: [
        "Great loglines make you picture the movie instantly — study why, across genres.",
        "They all carry a clear protagonist, goal, stakes, and a specific hook or irony.",
        "They promise an experience — they don't summarize the plot — and they're repeatable in one breath.",
        "Keep a swipe file of admired loglines in your own words to learn the shapes that sell.",
      ],
    },
    {
      slug: "logline-mistakes",
      num: 4,
      roman: "IV",
      title: "Common Logline Mistakes",
      desc: "The traps that make a logline vague, flat, or confusing",
      time: "7 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Most loglines fail in the same handful of ways. The good news: once you can name the traps, you can spot them in your own logline in seconds — and fix them just as fast.`,
      seoTitle: "Common Logline Mistakes (And How to Fix Them) | Filmmaker Genius",
      seoDesc:
        "The most common logline mistakes — vague, crowded, no stakes, naming characters — and how to catch and fix each one in your own logline. Chapter 4 of Writing the Logline & Pitch Document.",
      body: `
    <p>I've read thousands of loglines, and the failures are remarkably consistent. They don't fail in a thousand creative ways — they fail in about eight predictable ones. That's actually great news, because it means you can run your logline against a checklist and catch the problems yourself before anyone else does. Here are the traps, and the fix for each.</p>

    <h2>The eight most common mistakes</h2>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It's too vague</div>
      <p>"A man goes on a journey of self-discovery." No specific goal, no conflict, no movie. <span class="fix">Fix:</span> add a concrete external goal and a clear obstacle — something we can see happening.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It's too crowded</div>
      <p>Three subplots, five characters, and a run-on sentence nobody can follow. <span class="fix">Fix:</span> strip it to the single spine — one protagonist, one goal, one central conflict.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It names characters</div>
      <p>"When Dave meets Karen, they must help Mr. Fisk…" — we don't know who these people are. <span class="fix">Fix:</span> replace names with identities: "a burned-out paramedic," "a ruthless landlord."</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It has no stakes</div>
      <p>We know what the hero wants but not what happens if they fail — so we don't care. <span class="fix">Fix:</span> spell out the cost of failure, or the ticking clock, right in the sentence.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> The protagonist is passive</div>
      <p>Things happen <em>to</em> the hero, but they never chase anything. <span class="fix">Fix:</span> give them an active goal — a verb they're driving, not just a situation they're enduring.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> There's no hook or irony</div>
      <p>Everything's technically present, but it's flat — nothing makes it <em>this</em> movie. <span class="fix">Fix:</span> find the built-in contradiction or fresh angle and put it front and center.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It gives away the ending</div>
      <p>"…and finally defeats the villain and saves the town." Now there's no question left to pull us in. <span class="fix">Fix:</span> pose the question; don't answer it. End on the tension, not the resolution.</p>
    </div>

    <div class="mistake">
      <div class="m-name"><span class="x">✕</span> It's just too long</div>
      <p>Sixty words, three clauses, and the reader's lost by the end. <span class="fix">Fix:</span> cut to one sentence, 25–40 words. If you can't say it in a breath, it isn't done.</p>
    </div>

    <div class="pullquote">A logline usually fails not because the story is bad, but because the writer tried to fit the whole story into it. The skill is knowing what to leave out.</div>

    <h2>The self-edit pass</h2>

    <p>When you finish a logline, run it against this quick gauntlet: Can I picture the protagonist? Is there a clear, active goal? Are the stakes obvious? Is there a hook or irony? Did I avoid names and plot spoilers? Can I say it in one breath? If any answer is "no," you've found your fix. Then do the ultimate test — say it out loud to someone and watch their face. A logline that works produces a spark; a logline that fails produces a polite "…okay." Trust the face, not your own attachment to the words.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Producers and readers have seen these same mistakes ten thousand times, which is why a clean logline stands out so sharply — it signals a writer who knows the craft. A vague or bloated logline does the opposite: it tells a busy executive, before they've read a page, that the script probably has the same problems. Fixing your logline isn't just about the sentence; it's about the first impression that decides whether your script gets read at all.</p>
    </div>

    <p>That completes the logline foundations — you can now define it, build it, recognize what works, and dodge what doesn't. But a logline is only the front door. In Module 2 we walk through it and build the full pitch, starting with how to expand that one sentence into a pitch that sells.</p>
`,
      takeaways: [
        "Loglines fail in predictable ways: vague, crowded, named characters, no stakes, passive hero, no hook, spoiled ending, too long.",
        "Most failures come from cramming the whole story in — the skill is leaving things out.",
        "Run the self-edit gauntlet, then say it aloud and read the listener's face.",
        "A clean logline signals a skilled writer — and decides whether your script gets read.",
      ],
    },
    {
      slug: "film-pitch",
      num: 5,
      roman: "V",
      title: "From Logline to Pitch",
      desc: "Expanding one sentence into a pitch that sells",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `The logline gets you in the door. The pitch is the argument you make once you're inside — the case for why this film should exist, and why now, and why you're the one to make it.`,
      seoTitle: "From Logline to Pitch: Building the Film Pitch | Filmmaker Genius",
      seoDesc:
        "How to expand a one-sentence logline into a full film pitch — the hook, synopsis, tone, comps, and the 'why now, why you' that sells a project. Chapter 5 of Writing the Logline & Pitch Document.",
      body: `
    <p>Once your logline hooks someone, they lean in and ask a bigger question — not "what's it about?" but "why should I make this?" Answering that is the pitch. And here's the mental shift that changed everything for me: a pitch isn't a description of your movie. It's an <em>argument</em> for it. Every element you add is a piece of evidence for the same verdict — that this film is worth someone's money, time, and belief.</p>

    <h2>A pitch is an argument, not a summary</h2>

    <p>Amateur pitches describe: "It's about a guy who… and then… and then…" Professional pitches persuade: they make a case. That case has a claim (this film will work) and evidence (here's why). Once you see the pitch as a structured argument, you stop rambling through plot and start assembling the specific pieces that convince a buyer. The logline is your headline; the rest of the pitch is the body of the argument.</p>

    <div class="pullquote">Nobody funds a plot summary. They fund a conviction — that this story, told this way, by this filmmaker, will find an audience. Your pitch exists to build that conviction.</div>

    <h2>What a full pitch contains</h2>

    <p>Whether it's spoken in a room or written in a document, a complete pitch usually assembles these building blocks. We'll dedicate full chapters to the key ones, but here's the whole shape:</p>

    <ul class="spec-list">
      <li><b>The logline</b> — your one-sentence hook, delivered first. Everything else expands from it.</li>
      <li><b>The hook / what makes it special</b> — the single most compelling, marketable thing about the film. Lead with your strongest card.</li>
      <li><b>The synopsis</b> — a brief walk through the story: setup, the turn, and the emotional payoff, without drowning in plot.</li>
      <li><b>Tone &amp; genre</b> — what the film <em>feels</em> like, often via comparisons ("it's <em>X</em> meets <em>Y</em>").</li>
      <li><b>Why now</b> — why this story is timely, resonant, or commercial <em>today.</em></li>
      <li><b>Why you</b> — your connection to the material and your ability to deliver it. Buyers invest in filmmakers, not just scripts.</li>
      <li><b>The audience &amp; comps</b> — who this is for, and comparable films that found that audience and made money.</li>
    </ul>

    <p>Not every pitch uses every element every time — a two-minute verbal pitch is leaner than a written package. But knowing the full toolkit lets you choose the right pieces for the moment.</p>

    <h2>Comparables: the shorthand of the business</h2>

    <p>One element deserves a flag now because beginners underuse it: <strong>comps.</strong> Saying "it's <em>Get Out</em> meets <em>Parasite</em>" does enormous work in a handful of words — it communicates tone, audience, and commercial track record instantly, in a language buyers already speak. Good comps are recent, successful, and genuinely similar in feel (not just "also a thriller"). They tell a financier "films like this make money" without you having to argue it. Pick two that frame your project the way you want it seen.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Here's the part beginners resist: in a pitch, "why you" can matter as much as "what it is." Producers are betting on a person to shepherd millions of dollars and years of work. Your passion for the material, your relevant experience, even a proof-of-concept short — these de-risk the bet. When two projects have equally good loglines, the one attached to a filmmaker who clearly <em>has</em> to make it, and can, is the one that gets the yes. Pitch the film, but also pitch yourself.</p>
    </div>

    <p>You now understand what a pitch is and the pieces it's built from. The rest of this module builds each key piece in depth — starting with the document that has to do the most with the least: the one-sheet, the single page that decides whether your project gets read.</p>
`,
      takeaways: [
        "A pitch is an argument for your film, not a summary of it — assemble evidence, not plot.",
        "The full toolkit: logline, hook, synopsis, tone/genre, why now, why you, audience & comps.",
        "Comps (\"X meets Y\") communicate tone, audience, and commercial appeal in a few words.",
        "Pitch yourself too — buyers invest in filmmakers who clearly have to (and can) make it.",
      ],
    },
    {
      slug: "film-one-sheet",
      num: 6,
      roman: "VI",
      title: "The One-Sheet",
      desc: "The single page that gets your project read",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `One page. That's all you get to convince a busy stranger your film is worth their attention. The one-sheet is the workhorse of the pitch — and knowing what goes on it (and what doesn't) is a skill of its own.`,
      seoTitle: "The Film One-Sheet: The One Page That Gets You Read | Filmmaker Genius",
      seoDesc:
        "How to build a film one-sheet (one-pager) — title, logline, synopsis, comps, and the why-now/why-you that packages your project on a single page. Chapter 6 of Writing the Logline & Pitch Document.",
      body: `
    <p>The one-sheet — sometimes called a one-pager — is the single most useful document you'll build for your project. It's what you attach to an email, hand across a table, or leave behind after a meeting. It's the whole pitch, compressed onto one page a decision-maker can absorb in ninety seconds. And because it's so short, every word has to fight for its spot. A great one-sheet is a feat of editing as much as writing.</p>

    <h2>What it's for</h2>

    <p>The one-sheet has a very specific job: <strong>get someone to want to read your script.</strong> It's not the script, not the full pitch deck, not the treatment — it's the appetizer that makes them ask for the meal. A producer's inbox is full; your one-sheet has seconds to earn a "send me the script." Judge every choice on it by that single goal.</p>

    <h2>What goes on it</h2>

    <p>A clean one-sheet has a predictable anatomy. Include these, in roughly this order:</p>

    <ul class="spec-list">
      <li><b>Title &amp; key info</b> — the film's title, prominently, with genre, format (feature/short), and estimated length or budget tier if relevant.</li>
      <li><b>The logline</b> — front and center, right under the title. Your one-sentence hook does the first work.</li>
      <li><b>A short synopsis</b> — one tight paragraph (150–200 words) covering the setup, the turn, and the emotional stakes. Enough to intrigue, not to spoil.</li>
      <li><b>Tone &amp; comps</b> — a line on the feel, and one or two comparable films to place it in the market.</li>
      <li><b>Why this, why now, why you</b> — a sentence or two on what makes the project special and timely, and your connection to it.</li>
      <li><b>Contact info</b> — your name, email, and phone. Make it effortless to say yes.</li>
    </ul>

    <p>Optionally, a single evocative image or a rough poster can anchor the page and sell tone at a glance — but only if it genuinely elevates. A bad image hurts more than no image.</p>

    <div class="pullquote">The one-sheet is a filter you build for yourself. If your project can't be made compelling on one page, that's not a formatting problem — it's a signal to sharpen the project.</div>

    <h2>The discipline of one page</h2>

    <p>The hardest part isn't what to put on the one-sheet — it's what to leave off. There's no room for subplots, character backstories, or the clever thing that happens in act two. The constraint forces ruthless prioritization: what are the two or three things that make someone <em>need</em> to read this? Lead with those. Keep the design clean and readable — generous white space, clear hierarchy, professional type. A cluttered, tiny-font one-sheet screams amateur before a word is read; a clean one signals a filmmaker who respects the reader's time.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The one-sheet does quiet work you never see. It gets forwarded. A producer who likes it emails it to a financing partner; an exec drops it in a coverage folder; an agent passes it to a colleague. Because it's one clean page, it travels effortlessly through the exact rooms where your film gets decided — often without you present. That's why polish matters so much: your one-sheet is frequently the version of your project that other people meet first.</p>
    </div>

    <p>The one-sheet gives buyers the whole project at a glance. When they want more of the story, they reach for the next document up — the synopsis, and its longer cousin, the treatment. That's next.</p>
`,
      takeaways: [
        "The one-sheet's only job is to make someone want to read your script.",
        "Include title, logline, a tight synopsis, tone/comps, why-now/why-you, and contact info.",
        "The skill is leaving things off — lead with the two or three things that make it a must-read.",
        "Keep it clean and professional — it travels through rooms without you, so polish matters.",
      ],
    },
    {
      slug: "how-to-write-a-film-synopsis",
      num: 7,
      roman: "VII",
      title: "The Synopsis & Treatment",
      desc: "Telling your whole story in a page — or ten",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `When a reader wants more than a logline but isn't ready for a whole script, these two documents fill the gap — the synopsis tells your story in a page, the treatment in ten. Knowing when to use each is the craft.`,
      seoTitle: "How to Write a Film Synopsis & Treatment | Filmmaker Genius",
      seoDesc:
        "How to write a film synopsis and a treatment — the difference between them, how long each should be, and how to tell your whole story in prose that sells. Chapter 7 of Writing the Logline & Pitch Document.",
      body: `
    <p>Between "here's my one sentence" and "here's my 100-page script" sits a spectrum of story documents, and two of them do most of the work: the synopsis and the treatment. New writers often confuse them or skip them entirely, then wonder why a producer went cold. These documents are how the industry samples your story before committing to the full read — get them right and you keep the conversation alive.</p>

    <h2>The synopsis: your story in a page</h2>

    <p>A <strong>synopsis is a brief prose summary of your entire story</strong> — typically one paragraph to one page. Written in present tense, it walks through the film's arc: the setup, the major turns, and the resolution. Its job isn't to entertain like the script; it's to prove your story <em>works</em> — that it has a clear structure, escalating conflict, and a satisfying end. A few rules:</p>

    <ul class="spec-list">
      <li><b>Present tense, third person.</b> "A young detective discovers…" — the standard voice for all story documents.</li>
      <li><b>Hit the beats, skip the branches.</b> Cover the main story spine; leave out minor subplots and background.</li>
      <li><b>Reveal the ending.</b> Unlike marketing copy, a pitch synopsis <em>tells</em> the buyer how it ends — they need to know the story lands.</li>
      <li><b>Follow the emotion.</b> Track not just what happens but what it means for your protagonist. Plot plus feeling.</li>
    </ul>

    <p>The synopsis is what goes on your one-sheet (in its shortest form) and what a producer reads when they're intrigued but not yet sold. Nail it and you buy yourself the next step.</p>

    <div class="pullquote">A synopsis proves the story works; a treatment shows how it feels. One is the blueprint, the other is the walk-through.</div>

    <h2>The treatment: your story in prose</h2>

    <p>A <strong>treatment is a longer prose version of the film</strong> — anywhere from two or three pages to ten or more — that tells the whole story scene by scene, or sequence by sequence, in engaging present-tense prose. Where a synopsis is efficient, a treatment is <em>immersive</em>: it conveys tone, key moments, even flavors of dialogue, so the reader experiences the film in miniature. It's often what a writer develops before a full script (to test the story), and what a producer requests when they're seriously considering a project and want to feel it before greenlighting a screenplay.</p>

    <p>The craft of a treatment is making prose that reads like the movie plays — vivid, propulsive, tonally true. A dry, mechanical "and then, and then" treatment kills interest; one that captures the film's energy makes a reader want to see it made.</p>

    <h2>Which one, when?</h2>

    <p>Choosing the right document is part of pitching well:</p>

    <ul class="spec-list">
      <li><b>Logline</b> → first contact, the hook.</li>
      <li><b>Short synopsis</b> → on the one-sheet, or a first "tell me more."</li>
      <li><b>Full synopsis (one page)</b> → when a reader wants the whole arc quickly.</li>
      <li><b>Treatment</b> → serious interest, or a co-writer/producer who wants to feel the film before the script exists.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Treatments earn their keep long before anyone else reads them: they're one of the best tools for testing your own story cheaply. Writing your film as a tight treatment — before you spend months on a screenplay — exposes structural problems fast and lets collaborators weigh in while changes are still easy. Many pros won't start a script until the treatment sings. Think of it as the pitch document that doubles as your own quality-control pass.</p>
    </div>

    <p>You can now tell your story at any length a buyer needs. But the modern pitch increasingly lives in a more visual form — the one that packages your logline, synopsis, tone, and look into slides. Next: the pitch deck.</p>
`,
      takeaways: [
        "A synopsis is a brief present-tense summary (a paragraph to a page) that proves the story works.",
        "In a pitch synopsis, reveal the ending — buyers need to know the story lands.",
        "A treatment is a longer, immersive prose version that conveys tone and key moments.",
        "Match the document to the moment — and use a treatment to pressure-test your story cheaply.",
      ],
    },
    {
      slug: "film-pitch-deck",
      num: 8,
      roman: "VIII",
      title: "The Pitch Deck",
      desc: "The visual pitch that packages your film",
      time: "10 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `Everything you've built — the logline, the synopsis, the tone — comes together here, in the visual document that most producers now expect. Learn the slides that matter and the order that sells.`,
      seoTitle: "How to Make a Film Pitch Deck: Slides That Sell Your Movie | Filmmaker Genius",
      seoDesc:
        "How to build a film pitch deck — the slide-by-slide anatomy of a pitch that packages your logline, synopsis, tone, look, and team into a document producers take seriously. Chapter 8 of Writing the Logline & Pitch Document.",
      body: `
    <p>The pitch deck is where the modern pitch lives. A generation ago you sold a film with a phone call and a lunch; today, producers, financiers, and streamers increasingly expect a visual document they can flip through and forward — a lookbook that shows them the film, not just tells them about it. A great deck combines everything you've built so far with imagery that makes buyers <em>feel</em> the movie. It's the difference between "interesting idea" and "I can see this."</p>

    <h2>The anatomy of a deck</h2>

    <p>Pitch decks vary, but a strong one moves through a reliable sequence. Each slide has one job; don't crowd them.</p>

    <ul class="spec-list">
      <li><b>Title / cover</b> — the film's title, a striking key image, and your logline. Sets tone in one glance.</li>
      <li><b>Logline slide</b> — the hook on its own, given room to land.</li>
      <li><b>Synopsis</b> — the story in a tight paragraph or two, present tense.</li>
      <li><b>Tone &amp; look</b> — a mood board of images (film stills, photography, palette) that convey the visual world.</li>
      <li><b>Characters</b> — your key roles with a line each, sometimes with casting ideas or reference faces.</li>
      <li><b>Comparables</b> — one or two films/shows that place yours in the market ("<em>Whiplash</em> meets <em>Black Swan</em>").</li>
      <li><b>Why this, why now</b> — the timeliness and the reason this film matters.</li>
      <li><b>The team</b> — you and key collaborators, with relevant credits.</li>
      <li><b>The ask / contact</b> — what you're seeking (financing, a producer, a distributor) and how to reach you.</li>
    </ul>

    <p>Not every deck needs every slide, and order can flex — but this spine works. Keep text minimal; the deck supports your pitch, it doesn't replace you. Big images, few words, ruthless clarity.</p>

    <div class="pullquote">A pitch deck's job isn't to explain your film. It's to make the reader see it so clearly they start casting it in their head.</div>

    <h2>Design is part of the pitch</h2>

    <p>How the deck looks <em>is</em> content. A clean, cinematic, well-typeset deck signals a filmmaker with vision and taste; a cluttered clip-art deck undercuts even a great story. You don't need to be a graphic designer — you need consistency (one type family, a coherent palette), strong imagery, and generous space. The tone of the design should match the tone of the film: a horror deck and a rom-com deck should not look the same.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The deck is the piece of your pitch most likely to travel without you. It gets emailed, forwarded, dropped into a financier's shared folder, opened on a phone between meetings. That's exactly why it has to stand on its own — self-explanatory, beautiful, and short enough to finish. When I build a deck I ask one question of every slide: <em>if a stranger flipped past this in ten seconds, would they still get it?</em> If not, it's too busy.</p>
    </div>

    <p>That completes the written toolkit — logline, one-sheet, synopsis, treatment, and deck. But at some point a human being asks, "So what's your movie about?" and you have to answer out loud. Module 3 is about putting all of this to work in the room. Next: the verbal pitch.</p>
`,
      takeaways: [
        "The pitch deck is the visual document most buyers now expect — it shows the film, not just tells it.",
        "A strong deck moves through cover, logline, synopsis, tone/look, characters, comps, why-now, team, and ask.",
        "Big images, few words — the deck supports your pitch, it doesn't replace you.",
        "Design is content: a clean, cinematic deck signals vision; make it self-explanatory so it travels without you.",
      ],
    },
    {
      slug: "how-to-pitch-a-movie",
      num: 9,
      roman: "IX",
      title: "The Verbal Pitch",
      desc: "How to pitch your movie out loud, in the room",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      dek: `Sooner or later someone leans forward and says, "So, tell me about your movie." Everything you've written now has to live in your mouth — clear, confident, and human. Here's how to pitch out loud.`,
      seoTitle: "How to Pitch a Movie: Nailing the Verbal Pitch | Filmmaker Genius",
      seoDesc:
        "How to pitch a movie out loud — structuring the verbal pitch, opening with the hook, handling nerves, and leaving room for a conversation. Chapter 9 of Writing the Logline & Pitch Document.",
      body: `
    <p>You can have the sharpest logline and the most beautiful deck in town, but at some point a person is going to look you in the eye and ask what your movie is about — in a meeting, at a festival bar, in an elevator, on a Zoom. The verbal pitch is where the written work becomes a performance, and where a lot of good projects fall apart because the filmmaker rambles. The good news: everything you built in this course is your script for this moment. You just have to deliver it like a human being, not a robot reciting a synopsis.</p>

    <h2>Structure a verbal pitch</h2>

    <p>A strong spoken pitch has a shape. Aim for two minutes if they give you the room, thirty seconds if they don't:</p>

    <ul class="spec-list">
      <li><b>The hook.</b> Open with your logline, or a single provocative line. Grab them in the first sentence.</li>
      <li><b>The story.</b> Walk the arc — protagonist, their want, the obstacle, the escalation, the stakes. Present tense, told like you're excited about it.</li>
      <li><b>The world &amp; tone.</b> A comp or two, a sense of the feel. "It plays like <em>Whiplash</em> but in a kitchen."</li>
      <li><b>Why you.</b> A sentence on why you're the one to make it — your connection, your track record, your urgency.</li>
      <li><b>The turn to them.</b> Land, then open the floor: "That's the film — I'd love to hear what you think." Invite the conversation.</li>
    </ul>

    <p>The biggest mistake is trying to tell the <em>whole</em> plot. You're not narrating the movie; you're making them want to read it. Give the spine and the feeling, then stop talking.</p>

    <div class="pullquote">A pitch isn't a monologue you survive — it's a conversation you start. The best ones end with the other person asking questions, not you still talking.</div>

    <h2>Deliver it like a person</h2>

    <p>Rehearse until you know it cold, then loosen up so it doesn't <em>sound</em> rehearsed. Memorize the beats, not a word-for-word script — you want to be able to adjust to the room, drop a point if they're short on time, expand if they lean in. Your enthusiasm is contagious; if you're bored telling it, they'll be bored hearing it. Slow down, breathe, and remember that they <em>want</em> you to be good — a buyer in a pitch meeting is hoping the next thing they hear is a hit.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Nerves are normal — even people who pitch for a living get them. Two things help me every time. First, I open with the line I'm most sure of, so the first words out are strong and I settle. Second, I remember the person across the table isn't a judge, they're a collaborator I haven't met yet; I'm not begging, I'm offering them something good. Reframing it from "audition" to "invitation" takes the shake out of my voice faster than anything else.</p>
    </div>

    <p>Have your short and long versions ready, and know which to use. But not every buyer wants the same pitch — a studio exec, a private financier, and a festival programmer are listening for different things. Tailoring the pitch to the room is next.</p>
`,
      takeaways: [
        "Structure the spoken pitch: hook, story spine, world/tone, why-you, then turn it over to them.",
        "Don't tell the whole plot — give the spine and the feeling, then stop and invite conversation.",
        "Memorize the beats, not a word-for-word script, so you can adapt to the room.",
        "Reframe nerves: you're not auditioning, you're offering a collaborator something good.",
      ],
    },
    {
      slug: "pitching-a-film-to-producers",
      num: 10,
      roman: "X",
      title: "Pitching to Different Buyers",
      desc: "Tailoring the pitch to producers, financiers, and studios",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      dek: `A producer, a private financier, a studio exec, a streamer, and a festival programmer are all "buyers" — but they want wildly different things. The same film, pitched five ways.`,
      seoTitle: "Pitching a Film to Producers, Financiers & Studios | Filmmaker Genius",
      seoDesc:
        "How to tailor your movie pitch to different buyers — producers, financiers, studios, streamers, and festival programmers each listen for different things. Chapter 10 of Writing the Logline & Pitch Document.",
      body: `
    <p>Here's something no one tells you early on: "selling your film" isn't one conversation, it's a dozen different conversations with people who care about completely different things. The story doesn't change — but what you <em>emphasize</em> should. Walk into a financier's office leading with your artistic vision and you'll lose them; open with box-office comps in front of a festival programmer and you'll do the same. Knowing who's across the table, and what keeps them up at night, is half of pitching well.</p>

    <h2>Know what each buyer wants</h2>

    <ul class="spec-list">
      <li><b>The producer</b> wants a film they can actually get made — a strong story, a clear vision, and a filmmaker they can work with. Lead with the story and why you're the one to tell it.</li>
      <li><b>The financier / investor</b> wants to understand the return. Emphasize the market, comps, budget realism, and any elements that de-risk it (attached talent, a proven genre, presales potential).</li>
      <li><b>The studio / production company exec</b> thinks in slates and audiences. Show how your film fits what they make, who it's for, and why it's commercial <em>and</em> distinct.</li>
      <li><b>The streamer</b> thinks in subscribers and hooks. Lead with the concept's pull — the thing that makes someone stop scrolling — and its four-quadrant or niche-audience appeal.</li>
      <li><b>The festival programmer</b> wants artistry, voice, and cultural relevance. Emphasize what's fresh, urgent, and distinctly yours — the reasons an audience should discover it.</li>
    </ul>

    <p>Same logline, same story spine — but the second sentence changes depending on who's listening. Do your homework before every meeting: what has this person made or funded? What are they hungry for right now? A pitch that shows you understand <em>their</em> business lands twice as hard.</p>

    <div class="pullquote">You're not changing your film to please the room. You're choosing which true thing about it to say first.</div>

    <h2>Match the project to the buyer</h2>

    <p>Tailoring also means aiming at the right door. A tiny, personal indie drama is a hard sell to a big commercial studio and a natural fit for a festival-focused producer or a specialty label; a high-concept genre piece may light up a streamer but bore an arthouse programmer. Part of the craft is <em>targeting</em> — spending your pitches on the buyers whose appetite actually matches your project, rather than pitching everyone the same way and wondering why it's not landing.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Before any meeting, I write one sentence at the top of my notes: "This person makes money / makes their name by ______." Filling that blank forces me to pitch to their actual incentive, not mine. A financier who backs genre films on tight budgets doesn't need my speech about theme — they need to hear "contained location, proven genre, castable lead." Same movie, their language. Speaking someone's language isn't selling out; it's respect.</p>
    </div>

    <p>You now know how to pitch in person and how to read the room. But most careers don't start with a meeting — they start with an email to someone who's never heard of you. Cold outreach and the query letter are next.</p>
`,
      takeaways: [
        "The story stays the same — what you emphasize changes with who's listening.",
        "Producers want story and vision; financiers want return; execs want fit; streamers want hooks; programmers want voice.",
        "Do your homework — a pitch that speaks to the buyer's business lands twice as hard.",
        "Target the right door: match your project to buyers whose appetite actually fits it.",
      ],
    },
    {
      slug: "film-query-letter",
      num: 11,
      roman: "XI",
      title: "The Query Letter & Cold Outreach",
      desc: "Getting a stranger to say yes to reading your script",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      dek: `Most doors in this business open with an email to someone who's never heard of you. The query letter is the pitch that has to earn a reply — short, sharp, and impossible to ignore.`,
      seoTitle: "Film Query Letter & Cold Outreach: Getting Read by Strangers | Filmmaker Genius",
      seoDesc:
        "How to write a film query letter and cold outreach email that gets your script requested — subject line, the hook, credentials, and the ask. Chapter 11 of Writing the Logline & Pitch Document.",
      body: `
    <p>Not everyone has an agent or a warm intro. Most writers and filmmakers start by reaching out cold — to a manager, an agent, a producer, a production company — with an email that has to do a lot of work in very little space. That email is the <strong>query letter</strong>, and it's a discipline of its own. It's the logline and the one-sheet compressed into something a busy stranger will actually read on their phone, and it lives or dies on the first two sentences.</p>

    <h2>What a query letter has to do</h2>

    <p>A query's only goal is to get a "yes, send me the script." It is not the place for your life story or the full plot. Keep it to a few short paragraphs and make every line earn its place:</p>

    <ul class="spec-list">
      <li><b>A subject line that isn't spam.</b> Clear and specific — title, genre, and a hint of the hook. It has to survive the inbox scan.</li>
      <li><b>A one-line reason you're writing to <em>them.</em></b> Reference a film they made or represent. Show it's not a mass blast.</li>
      <li><b>The logline.</b> Your sharpest sentence, front and center.</li>
      <li><b>A tiny bit more.</b> A line or two of stakes or tone, plus a comp if it helps.</li>
      <li><b>A brief credential.</b> One line on who you are — relevant wins, festivals, or simply an honest, professional note if you're new.</li>
      <li><b>The ask.</b> "May I send you the script?" Simple, direct, easy to say yes to.</li>
    </ul>

    <div class="letter-box">
      <div class="lb-label">A query, in miniature</div>
      <p class="lb-sub">Subject: Query — DEEP END (contained thriller, feature)</p>
      <p>Dear [Name], I admired your work on [their film] — its blend of tension and heart is exactly the space my script lives in.</p>
      <p>DEEP END is a contained thriller: <em>when a night-shift lifeguard realizes the drowning man she just saved is the stalker she's been hiding from, she has one pool, one hour, and no one to call.</em></p>
      <p>It plays like <em>Fall</em> meets <em>Wait Until Dark</em> — one location, escalating dread, a woman forced to outthink a predator. I'm a [festival]-selected filmmaker with two shorts on the circuit.</p>
      <p>May I send you the script? Thank you for your time. — [Your name, contact]</p>
    </div>

    <p>That's the whole thing — under 120 words, and it tells the reader exactly what they're getting and why they should care. Notice it never explains the ending or the subplots; it sells the <em>read</em>, not the movie.</p>

    <div class="pullquote">A query letter isn't judged on how much it says. It's judged on how fast a tired person can decide they want more.</div>

    <h2>Cold outreach that doesn't feel cold</h2>

    <p>The difference between an email that gets deleted and one that gets a reply is usually <em>specificity.</em> Do the work to find the right person, spell their name right, and reference something real about what they do. Personalization signals you're a professional who did their homework, not someone spraying the same letter at a hundred addresses. Keep it warm, brief, and respectful of their time — and never attach the script uninvited; let them ask for it.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Rejection and silence are the baseline here, not the exception — even great queries get ignored most of the time, because inboxes are brutal and timing is luck. The pros treat it as a numbers-and-craft game: sharpen the letter, send a lot of them, follow up once politely, and don't take the quiet personally. The writers who break through aren't the ones who never got rejected. They're the ones who kept sending a better letter.</p>
    </div>

    <p>You've now got the whole kit — logline, one-sheet, synopsis, treatment, deck, verbal pitch, buyer targeting, and the query. The last piece is the one that makes all of them better over time: testing your pitch and refining it based on how real people respond. That's next, and it's the final chapter.</p>
`,
      takeaways: [
        "A query letter's only job is to earn a \"send me the script\" — keep it to a few short paragraphs.",
        "Include a specific subject line, a personal reason you're writing them, the logline, a credential, and a clear ask.",
        "Personalize every email and never attach the script uninvited — let them ask for it.",
        "Silence is the baseline — sharpen the letter, send many, follow up once, and don't take it personally.",
      ],
    },
    {
      slug: "how-to-refine-your-pitch",
      num: 12,
      roman: "XII",
      title: "Testing & Refining Your Pitch",
      desc: "Sharpening every version until it lands",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      dek: `A pitch is never finished — it's tuned. The best loglines and decks in the business got that way by being tested on real people and rewritten based on what actually landed.`,
      seoTitle: "How to Refine Your Pitch: Testing a Logline That Works | Filmmaker Genius",
      seoDesc:
        "How to test and refine your movie pitch — reading real reactions, A/B testing your logline, spotting the confusion, and iterating until it lands every time. Chapter 12, the finale of Writing the Logline & Pitch Document.",
      body: `
    <p>Here's the truth that separates writers who eventually break through from writers who stall: a pitch is not something you write once and defend forever. It's something you <em>test.</em> Every time you say your logline out loud, every time someone reads your one-sheet, you're getting data — and the writers who pay attention to that data end up with pitches that land, while everyone else keeps repeating the version that confuses people. This final chapter is about turning your pitch into a living thing you sharpen over time.</p>

    <h2>Read the reactions, not the words</h2>

    <p>The most valuable feedback you'll ever get isn't what people <em>say</em> about your pitch — it's what their face does while you deliver it. Pitch your movie to friends, other filmmakers, anyone who'll listen, and watch closely:</p>

    <ul class="spec-list">
      <li><b>Where do they lean in?</b> That's your hook working. Protect it.</li>
      <li><b>Where do they go blank or ask "wait, who?"</b> That's confusion — a line that needs fixing.</li>
      <li><b>What do they repeat back?</b> If they retell your movie to someone else, the words they use are your best marketing. If they retell it <em>wrong,</em> your pitch pointed them wrong.</li>
      <li><b>What questions do they ask?</b> Recurring questions reveal what your pitch left out — or what it should have led with.</li>
    </ul>

    <p>The single best test of a logline: tell it to someone, wait a day, and ask them to describe your movie back to you. What survives is your real pitch. What they forgot or garbled is what to rewrite.</p>

    <div class="pullquote">You're not looking for people to say "I love it." You're looking for the exact moment their attention flickers — because that's the line costing you the sale.</div>

    <h2>Iterate like it's a draft</h2>

    <p>Treat your logline and pitch the way you treat a script: as something you revise. Write three versions of your logline and try them on different people — you'll quickly feel which one gets the spark. Cut the line that always draws a blank. Move the reveal that always gets the gasp earlier. A/B test your subject lines and your opening sentence the way marketers test headlines, because that's exactly what they are. Small changes — one stronger verb, one clearer stake — often flip a pitch from "hmm" to "oh, I want to see that."</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Every good pitch I've ever given was version ten, not version one. My first logline for a film is always too clever, too vague, or too in-love with a detail nobody else cares about. It only gets sharp after I've watched a dozen people react to it and cut everything that didn't earn a response. So don't guard your first draft — spend it. Say it out loud, badly, early, and often. The pitch that gets you the meeting is the one you were willing to rewrite ten times.</p>
    </div>

    <p>And that's the whole discipline: package your story clearly, put it in front of people, watch what lands, and refine. Do that consistently and your pitch stops being the thing you dread and becomes the thing that opens doors. You've now got every tool to do it.</p>
`,
      takeaways: [
        "A pitch is tested, not just written — every delivery is data on what lands.",
        "Watch reactions, not just words: note where people lean in, go blank, and what they repeat back.",
        "Best logline test: have someone describe your movie back a day later — what survives is your real pitch.",
        "Iterate like a draft — write multiple versions, cut what draws blanks, and keep what earns a reaction.",
      ],
    },
  ],
};
