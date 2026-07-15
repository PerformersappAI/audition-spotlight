const chapters = [
  {
    slug: "ai-post-production",
    num: 1,
    roman: "I",
    title: "What AI Changes in Post",
    desc: "The post pipeline, mapped — and where AI actually saves days",
    time: "9 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `While everyone argues about text-to-video, the real AI revolution has been happening quietly in the edit bay. Here's the post pipeline mapped end to end — where AI genuinely saves you days, and the one place it can't follow you.`,
    seoTitle: "AI Post-Production: What Actually Changes in the Edit | Filmmaker Genius",
    seoDesc: "AI post-production explained by a working filmmaker — where AI actually saves days in the edit pipeline (transcription, selects, cleanup, first-pass color, captions) and the one thing it never touches: the rhythm of the cut. Chapter 1 of AI in Post-Production.",
    body: `<p>The loud half of the AI conversation is about generation — footage from prompts, actors who don't exist, the end of cameras. The quiet half is where the actual money is: <strong>post-production</strong>. Nobody makes a keynote out of auto-transcription. But I've never once had a generated clip save my week, and transcription has saved dozens of them. Post is where AI stopped being a demo and started being a coworker.</p>

<p>This course is about that quiet half. And I want to plant the thesis in chapter one, because everything else hangs off it: <strong>AI in post doesn't cut your film — it kills the drudge work around the cut.</strong> The logging, the syncing, the searching, the first-pass grunt labor that used to eat the first two weeks of every edit. The taste — what stays, what goes, how long a shot breathes — stays exactly where it's always been. With you.</p>

<h2>The pipeline, mapped</h2>

<p>Post-production is a pipeline, and AI doesn't help every stage equally. Walk it end to end — <em>ingest, assembly, the cut, sound, color, delivery</em> — and mark where the machine actually earns its keep:</p>

<ul class="spec-list">
  <li><b>Ingest &amp; logging</b> — the biggest win in the whole pipeline. Auto-transcription makes every clip searchable by what was said; days of logging becomes an overnight batch job.</li>
  <li><b>Assembly</b> — AI selects and rough-cut assists flag usable takes and stack them in story order, turning a footage mountain into a first draft you can react to.</li>
  <li><b>The cut</b> — this is where the assists thin out, on purpose. Pace, rhythm, performance, what the scene means — no tool touches it, and we'll spend a whole chapter on why.</li>
  <li><b>Sound</b> — dialogue isolators and noise cleanup rescue location audio that would once have meant an ADR session or a killed scene.</li>
  <li><b>Color</b> — first-pass balancing and shot matching get every clip into the same neighborhood, so your grading time goes to the look instead of the fixing.</li>
  <li><b>Delivery</b> — captions, subtitles, and aspect-ratio reframes for every platform, generated in minutes instead of hand-built over a weekend.</li>
</ul>

<p>Add it up and the pattern is obvious: AI is strongest at the <em>front</em> and <em>back</em> of post — the preparation before the creative work and the packaging after it. The middle, where the film actually gets made, is still a person in a chair making calls.</p>

<div class="pullquote">AI doesn't shorten the edit. It shortens everything standing between you and the edit.</div>

<h2>What it doesn't touch</h2>

<p>Here's the part the marketing never says out loud. The cut — the actual rhythm of shot against shot — is a judgment about feeling, and the tools have no access to feeling. An algorithm can tell you which take had clean audio and no blinks. It cannot tell you that the flawed take, the one where the actor's voice cracks, is the one that makes the scene. It can trim silences; it can't know that a particular silence <em>is</em> the scene.</p>

<p>That's not a limitation to mourn. It's the best news in this course. The parts of post that were always the job — taste, rhythm, meaning — remain yours. The parts that were never really the job — scrubbing, logging, syncing, exporting nine aspect ratios — are the parts being automated away. If you love editing and hate the chores around editing, this is the era you've been waiting for. Tools like DaVinci Resolve and Premiere Pro have already folded transcription and speech-based editing right into the timeline, which tells you where the whole industry is headed: the drudge work dissolves into the software, and the chair stays occupied.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>On a doc I cut a couple of years back, we shot forty-plus hours of interviews. Old workflow: two weeks of an assistant logging tape before anyone creative touched a frame. This time we transcribed everything on day one and searched the footage like a document — "find where she talks about her father" took four seconds instead of an afternoon. The film didn't get better because a machine cut it. It got better because I spent those two reclaimed weeks actually cutting.</p>
</div>

<p>Next chapter, we build your stack — the six jobs an AI post toolkit actually needs to do, and why most of them are already hiding inside the editor you own.</p>`,
    takeaways: [
      "Post is the quiet AI revolution — less glamorous than generation, far more useful on a real project today.",
      "The pipeline runs ingest → assembly → cut → sound → color → delivery; AI saves real days at the front and back of it.",
      "The five big wins: transcription, selects, audio cleanup, first-pass color, and captions/reframing for delivery.",
      "The rhythm of the cut stays human — AI kills the drudge work around the edit, not the judgment inside it."
    ]
  },
  {
    slug: "ai-video-editing-tools",
    num: 2,
    roman: "II",
    title: "The AI Post Stack",
    desc: "Transcription, edit, color, audio — the tools by job, not hype",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Stop collecting tools and start covering jobs. There are six jobs an AI post stack needs to do — and most of them are already sitting inside the editor you own, waiting for you to notice.`,
    seoTitle: "AI Video Editing Tools: Building Your Post Stack | Filmmaker Genius",
    seoDesc: "How to build an AI post-production stack by job, not brand — transcription, selects, color, audio cleanup, upscaling, and captions — and why most of it already lives inside Resolve and Premiere. Chapter 2 of AI in Post-Production.",
    body: `<p>Every month somebody sends me a list titled something like "37 AI tools every editor needs." Nobody needs 37 tools. Tool lists organized by brand go stale in a quarter, and they train you to shop instead of think. So here's the reframe that will outlast every product launch between now and whenever you read this: <strong>organize your stack by job, not by brand.</strong> The jobs don't change. The logos do.</p>

<p>When a new tool crosses your feed, the question isn't "is this cool?" It's "which job does this do, and is it better than what's already doing that job for me?" Most of the time the honest answer is no — because, as we'll get to, the job is probably already covered by software you own.</p>

<h2>The six jobs</h2>

<p>Strip away the marketing and an AI post stack has to cover exactly six jobs:</p>

<ul class="spec-list">
  <li><b>Transcription &amp; text-based editing</b> — turn every clip into searchable, cuttable text. The gateway job; everything else in this course leans on it.</li>
  <li><b>Selects &amp; assembly</b> — flag usable takes, group them by scene, and stack a first assembly you can react to instead of starting from a blank timeline.</li>
  <li><b>Color first-pass</b> — auto-balance and shot-match clips so the timeline starts consistent, saving your grading hours for the actual look.</li>
  <li><b>Audio cleanup</b> — dialogue isolation, noise reduction, hum removal. The job that rescues location sound you thought was dead.</li>
  <li><b>Upscaling &amp; restoration</b> — AI upscalers and restoration passes for archival footage, cropped-in shots, or mixed-resolution projects.</li>
  <li><b>Captions &amp; reframing</b> — subtitles, burn-ins, and aspect-ratio reframes for delivery to every platform your film has to live on.</li>
</ul>

<p>That's the whole map. Any tool anyone ever pitches you slots into one of those six boxes — and if it doesn't, it's probably a solution hunting for a problem.</p>

<div class="pullquote">You don't need more tools. You need six jobs covered — and half of them are already covered by the editor you own.</div>

<h2>Check what you own before you subscribe</h2>

<p>Here's the part that saves you real money: <strong>most of this stack now lives inside the NLEs you already have.</strong> DaVinci Resolve ships with transcription, audio cleanup tools, and machine-assisted color features built in — and its free version is famously generous. Premiere Pro has folded in transcription, text-based editing, and auto-captions as standard timeline features. Five years ago each of those jobs was a separate subscription; today they're menu items. So before you give a startup your card number, open the software you own and check whether the job is already sitting under a menu you've never clicked.</p>

<p>The corollary for anyone on a short film or a spec project: <em>free tiers will carry you.</em> Between Resolve's free version, trials, and the free allowances on standalone tools, you can cover all six jobs on a short without spending anything. Subscriptions make sense when you're cutting constantly and a paid tier saves you hours every week — that's a working-editor decision, not a day-one decision. Build the habit on free tools first; upgrade when the bottleneck is real and you can name it.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>An editor I work with kept a spreadsheet of AI subscriptions — at one point she was paying for four different tools. When we actually audited it against the six jobs, two of them were doing the same job as each other, and a third duplicated something Premiere had added natively that year. She cut down to one paid tool plus what her NLE already did, and her workflow got faster, not slower — fewer round-trips between apps. Audit by job, and the stack shrinks itself.</p>
</div>

<p>Next chapter is the unglamorous one that saves your film: how to run all of these tools without ever putting your original footage at risk.</p>`,
    takeaways: [
      "Organize your stack by job, not brand — the six jobs outlast every product launch.",
      "The six: transcription/text-editing, selects/assembly, color first-pass, audio cleanup, upscaling/restoration, captions/reframing.",
      "Check Resolve and Premiere before subscribing to anything — much of the stack is already built into the NLE you own.",
      "Free tiers cover a short film; pay for a tool only when you can name the bottleneck it removes."
    ]
  },
  {
    slug: "ai-post-production-workflow",
    num: 3,
    roman: "III",
    title: "Protecting the Master",
    desc: "Non-destructive workflow: AI touches copies, never originals",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `AI tools fail in weird, silent ways — artifacts, hallucinated detail, color that drifts a little more with every pass. The only defense is a workflow where nothing the AI touches is ever the only copy. Here's the iron rule and the folder discipline that enforces it.`,
    seoTitle: "AI Post Workflow: Non-Destructive Editing & Protecting Your Master | Filmmaker Genius",
    seoDesc: "The iron rule of AI post-production: process copies, never originals. Folder discipline, version naming, 3-2-1 backups, and why you should think twice before uploading unreleased footage to cloud AI tools. Chapter 3 of AI in Post-Production.",
    body: `<p>This is the least exciting chapter in the course, and it's the one I'd make mandatory if I could. Because here's the thing about AI tools that nobody puts in the demo reel: <strong>they fail weird.</strong> A traditional filter fails loudly — wrong settings, obvious result, undo. AI tools fail quietly. An upscaler invents texture on a face that was never there. A dialogue isolator eats the room tone that made the scene feel real. A color pass drifts your skin tones two clicks warm and you don't notice until the festival screening. The failure shows up late, subtly, and sometimes permanently.</p>

<p>So before we run a single AI process in this course, we install the iron rule: <strong>AI processes copies. Never originals. Ever.</strong> Your camera masters are the negative. No tool — no matter how good, how expensive, how "non-destructive" the marketing claims — ever gets write access to the negative. Everything AI touches is a duplicate you can throw away without a second thought.</p>

<h2>The rules, in order</h2>

<p>The iron rule turns into a working system with a handful of habits. Here they are, in the order they save you:</p>

<ul class="spec-list">
  <li><b>Originals are read-only.</b> Camera masters go into an <em>originals</em> folder the day you ingest, and nothing writes to that folder again — you, your NLE, or any AI tool.</li>
  <li><b>Four folders, always.</b> <em>Originals / working / AI-processed / exports.</em> Every file in the project lives in exactly one, and AI output never lands anywhere but its own folder.</li>
  <li><b>Name versions so the process is visible.</b> Something like <em>scene04_t03_denoise_v2</em> tells you what was done and how many times. "final_final_REAL" tells you nothing at 2 a.m.</li>
  <li><b>Keep the rollback path alive.</b> Every AI-processed file must trace back to an untouched source in one step. If you can't roll back, you don't have a workflow — you have a gamble.</li>
  <li><b>Back up 3-2-1.</b> Three copies of the originals, on two different types of storage, one of them off-site. AI didn't invent this rule; it just raised the stakes on breaking it.</li>
  <li><b>Think before you upload.</b> Cloud AI tools mean your unreleased footage is leaving your machine. Read what the service does with uploads before your rough cut lives on someone else's server.</li>
</ul>

<p>None of this is glamorous. All of it is the difference between "the tool ruined a copy" and "the tool ruined the film."</p>

<div class="pullquote">A good AI workflow is one where the worst thing any tool can destroy is a duplicate.</div>

<h2>Why rollback is the whole game</h2>

<p>Here's the deeper reason for the folder discipline. AI processing is <em>generative</em> at its core — even the cleanup tools work by predicting what "should" be there. Most of the time the prediction is right. Sometimes it's confidently wrong: hallucinated detail on a license plate, a smoothed face that reads uncanny on a big screen, a "cleaned" dialogue track that lost the breath before the line. You often can't judge these failures until you see the shot in context, days or weeks later. Rollback is what lets you change your mind at no cost. Version naming is what lets you find your way back. The folder structure is what makes both automatic instead of heroic.</p>

<p>And a word on privacy, because it's now part of workflow: an unreleased film is confidential material. Before you drag footage into any cloud tool, ask the boring questions — where is this stored, who can see it, is it used for training, can I delete it? For most projects the convenience wins and that's fine. But make it a decision, not an accident. A festival premiere with a "world premiere" requirement, a client NDA, an actor who hasn't approved a scene — all of these can be quietly violated by an upload you didn't think about. Local tools, including everything built into DaVinci Resolve and Premiere Pro, sidestep the question entirely.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>A colleague ran an AI denoiser over his interview footage during ingest — directly over the source files, to "save drive space." Three weeks later, deep in the edit, he noticed the denoiser had been smearing fine detail on faces all along. Every frame. The untouched originals were gone. He finished the film with the smeared footage, and only he and I knew, and it drove him quietly insane for two years. One folder named <em>originals</em> would have saved him. Buy the extra drive.</p>
</div>

<p>Foundation set: you know what AI changes, what your stack looks like, and how to run it without risking the negative. Next chapter is the one that ties the whole course together — where automation ends and taste begins.</p>`,
    takeaways: [
      "The iron rule: AI processes copies, never originals — your camera masters are the negative and stay read-only.",
      "Four folders enforce it: originals / working / AI-processed / exports, with version names that show what was done.",
      "AI fails quietly — artifacts, hallucinated detail, drifted color — so a one-step rollback path is non-negotiable.",
      "Back up 3-2-1, and treat every cloud upload of unreleased footage as a decision, not a default."
    ]
  },
  {
    slug: "ai-editing-vs-human-editing",
    num: 4,
    roman: "IV",
    title: "The Taste Rule",
    desc: "What to automate, what to never hand over — the editor's line",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Every AI decision in the edit comes down to one question: is this labor or judgment? Labor gets automated without guilt. Judgment never leaves your chair. Here's the line, drawn as precisely as I can draw it.`,
    seoTitle: "AI Editing vs Human Editing: The Taste Rule | Filmmaker Genius",
    seoDesc: "Where automation ends and judgment begins in the edit — what to hand to AI (transcription, sync, logging, technical fixes) and what to never hand over (performance, pace, the pause, the ending). Chapter 4 of AI in Post-Production.",
    body: `<p>Somewhere in the middle of every conversation about AI editing, someone asks the real question: "Okay, but where's the line?" Here's mine, and it's the spine of this entire course. Every task in post is either <strong>labor</strong> or <strong>judgment</strong>. Labor is anything where a correct answer exists: is this clip in sync, what words were spoken, does this shot match that shot's exposure. Judgment is anything where the answer depends on what the film is trying to make someone feel. Labor gets automated the moment a tool can do it. Judgment never gets handed over — not because of principle, but because the tools are genuinely bad at it, and I'll show you why.</p>

<p>The taste rule sounds obvious written down. In practice, the tools blur it constantly — an assembly assist that also trims your pauses, a "smart cut" that decides pacing for you. So let's draw the line item by item.</p>

<h2>Automate this. Never that.</h2>

<ul class="spec-list">
  <li><b>Automate: transcription and logging.</b> There is a correct transcript. Let the machine type it.</li>
  <li><b>Automate: sync, grouping, and organization.</b> Matching audio to picture and sorting takes by scene is arithmetic wearing a media browser.</li>
  <li><b>Automate: technical fixes and exports.</b> Noise floors, format conversions, caption files, platform deliverables — correct answers exist for all of them.</li>
  <li><b>Never: shot selection for performance.</b> Which take is <em>alive</em> is not a measurable property. It's the job.</li>
  <li><b>Never: the length of a pause.</b> A trimmed silence and a devastating silence look identical to an algorithm.</li>
  <li><b>Never: what to cut for pace — and never the ending.</b> Pace is a promise you're making to the audience, and the ending is the whole reason the film exists.</li>
</ul>

<p>Notice the pattern. Everything on the automate side has a verifiable right answer. Everything on the never side is a bet about human feeling. The moment you can't say what "correct" would even mean, you've crossed into judgment — and the machine is now guessing on your behalf.</p>

<div class="pullquote">AI edits feel competent and dead for the same reason: they optimize toward average, and average is the one thing your film can't afford to be.</div>

<h2>Why AI cuts feel dead</h2>

<p>Here's the honest mechanics of it. When an AI assembles a scene, it's drawing on patterns — what cuts usually look like, how long shots usually hold, where scenes usually start. The result is a cut that resembles the statistical center of every cut it has seen. That's why AI edits have a specific, recognizable quality: nothing is wrong, and nothing is <em>true</em>. Competent and dead. The take it picks is the clean one, not the cracked one. The pause it leaves is the average pause, not the one that lets a line land. Films work by deviating from the expected at exactly the right moments — and deviation from average is, by definition, the thing an average-seeking system edits out.</p>

<p>So has the editor's job changed? Read any honest description of it — choose the performance, control the rhythm, protect the story, know what the audience feels at every second — and notice that none of those line items has moved an inch. <strong>The job description hasn't changed. The tools around it have.</strong> What's changed is how much of your week goes to the job versus the chores orbiting it. Editors who understand that are about to do the best work of their lives, because the drudge work that used to eat half the schedule is evaporating. Editors who hand the judgment over too will ship films that feel like nobody made them.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once let an auto-edit feature take a pass at a short scene as an experiment — a two-hander, quiet, all subtext. The result was flawless and unwatchable. Every cut landed on the line, every pause was trimmed to nothing, and the scene's whole meaning — what the characters weren't saying — had been edited out as dead air. That was the day the taste rule stopped being a theory for me. The machine had removed the silence because it couldn't hear what the silence was doing.</p>
</div>

<p>That's the foundation module complete. Next we get our hands dirty with the single most useful AI skill in post: transcription, and the strange new craft of cutting video like a document.</p>`,
    takeaways: [
      "The taste rule: if a correct answer exists, it's labor — automate it. If the answer depends on feeling, it's judgment — keep it.",
      "Automate transcription, sync, logging, technical fixes, and exports without guilt.",
      "Never hand over performance selection, the length of a pause, pacing decisions, or the ending.",
      "AI cuts optimize toward average — competent and dead. The editor's job description hasn't changed; the tools around it have."
    ]
  },
  {
    slug: "text-based-video-editing",
    num: 5,
    roman: "V",
    title: "Transcription & the Text-Based Edit",
    desc: "Cut interviews and dialogue scenes like editing a document",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `Transcription is the gateway AI skill — the one that makes every other assist in this course possible. Learn it and your footage becomes a searchable document you can cut by deleting words. Here's where that superpower shines, and exactly where it falls on its face.`,
    seoTitle: "Text-Based Video Editing: Cut Dialogue Like a Document | Filmmaker Genius",
    seoDesc: "Transcription is the gateway AI skill in post — make every clip searchable, then cut interviews and dialogue by deleting words in a transcript. Where text-based editing shines, where it fails, and the day-one workflow. Chapter 5 of AI in Post-Production.",
    body: `<p>If you learn exactly one thing from this course, learn this chapter. Transcription is the gateway AI skill of post-production — the unglamorous one that everything else stands on. The moment your footage is transcribed, every clip becomes <strong>searchable by what was said in it</strong>. Think about what that means on a real project: you don't scrub for the moment your subject mentioned her father, you type "father" and you're there. Your media browser becomes a search engine for your own movie.</p>

<p>And transcription unlocks the strangest, most useful new craft in modern editing: <strong>text-based editing</strong>. Both DaVinci Resolve and Premiere Pro now do this natively — the transcript appears next to your timeline, and when you delete a sentence in the text, the corresponding video disappears from the cut. You are editing footage the way you edit a document. The first time you watch a paragraph deletion ripple through a timeline, something in your brain permanently rearranges.</p>

<h2>The day-one workflow</h2>

<p>Here's the habit that makes it all work — and the discipline is entirely front-loaded:</p>

<ul class="spec-list">
  <li><b>Transcribe everything on ingest, day one.</b> Not when you need it — before you need it. It's a batch job; run it overnight while the cards are backing up.</li>
  <li><b>Skim and correct the transcripts.</b> Fix names, jargon, and mangled phrases now, while the shoot is fresh — a wrong word in the transcript is a moment you'll never find again by search.</li>
  <li><b>Read before you watch.</b> Reading interviews is many times faster than watching them; highlight the transcript like a script and you've built a paper edit before touching a timeline.</li>
  <li><b>Cut the radio edit in text.</b> Assemble the story by keeping and deleting sentences — structure first, judged by ear, story logic only.</li>
  <li><b>Then switch to the timeline.</b> Refine every cut point by eye and ear: reactions, breaths, b-roll, rhythm. The text got you to a draft; the timeline makes it a film.</li>
</ul>

<p>That last step is not optional, and it's where the honest part of this chapter lives.</p>

<div class="pullquote">Text-based editing cuts what people said. It's deaf and blind to everything they did — and half of every film is what people did.</div>

<h2>Where it shines, where it fails</h2>

<p>Text-based editing shines wherever the content <em>is</em> the words: documentaries, interviews, dialogue-driven scenes, corporate and educational work, podcasts with cameras. For a doc editor it's close to a superpower — the paper edit, that decades-old documentary tradition of structuring a film on the page, now snaps directly into a working timeline instead of living in a binder. Dialogue assemblies that took a week happen in an afternoon.</p>

<p>And it fails, hard, wherever the content isn't words. Action. Visual comedy. A reaction shot — the cutaway to the person <em>listening</em>, which is frequently the most important shot in the scene and appears nowhere in any transcript. Cut a conversation purely in text and you'll get a competent radio edit wearing pictures: every line present, every look missing. The transcript also can't hear performance — it renders the flat read and the devastating read as identical sentences. So use text-based editing for what it is: the fastest structural tool ever handed to an editor, and a completely untrustworthy finishing tool. Structure in text, finish on the timeline, always.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>First doc I cut with day-one transcription, the director called mid-edit: "Didn't somebody mention the flood at the old house?" Old workflow, that's an afternoon of scrubbing three interviews on a maybe. I typed "flood," found it in eight seconds — buried in an answer to an unrelated question, in an interview neither of us remembered it from. It became the opening line of the film. That moment exists because the search existed.</p>
</div>

<p>Once everything is transcribed and searchable, the next move is obvious: let the machine take the first pass at the whole mountain. Next chapter — AI selects and the rough cut you treat as a draft, never a decision.</p>`,
    takeaways: [
      "Transcription is the gateway AI skill — transcribe everything on ingest, day one, and your footage becomes searchable.",
      "Text-based editing — cutting by deleting words in a transcript — is built into Resolve and Premiere today.",
      "It shines on docs, interviews, and dialogue assemblies; it fails on action, reactions, and anything visual.",
      "Structure in text, finish on the timeline — the transcript gets you a draft, never a film."
    ]
  },
  {
    slug: "ai-rough-cut",
    num: 6,
    roman: "VI",
    title: "AI Rough Cuts & Selects",
    desc: "From a mountain of footage to a first assembly, fast",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `You have hours of footage and one evening of real attention. AI selects exist to spend that attention where it counts — but only if you treat the machine's first assembly as a sketch to rewrite, never a cut to accept.`,
    seoTitle: "AI Rough Cuts: From Footage Mountain to First Assembly | Filmmaker Genius",
    seoDesc: "How AI-assisted selects turn hours of footage into a first assembly — flagging usable takes, grouping by scene, surfacing best audio — and why the AI rough cut is a sketch you rewrite, never a cut you accept. Chapter 6 of AI in Post-Production.",
    body: `<p>Let's name the real enemy of every low-budget edit. It isn't talent and it isn't software — it's the ratio between how much footage you shot and how much attention you actually have. Call it the selects problem: hours of material, and maybe one good evening of genuine, awake, taste-making focus before life intrudes. Traditionally you spent that precious attention on triage — watching everything once just to find out what you had. Which means your freshest eyes, the ones seeing the footage the way an audience will, got burned on the most mechanical task in the entire edit.</p>

<p>AI-assisted selects exist to fix exactly that ratio. The machine watches everything so your first real viewing happens at the level of <em>candidates</em>, not chaos. That's the whole pitch — not that the AI edits your film, but that it absorbs the triage.</p>

<h2>From mountain to assembly</h2>

<p>Here's the working sequence, whether you're using a dedicated assist or building it from the transcription workflow in the last chapter:</p>

<ul class="spec-list">
  <li><b>Ingest and transcribe everything.</b> Day one, per Chapter 5 — selects tools are only as good as the searchable footage underneath them.</li>
  <li><b>Let the AI flag usable takes.</b> Complete lines, no interruptions, clean audio — the machine strips out the obvious dead material before you spend a minute of attention.</li>
  <li><b>Group by scene and line.</b> Every reading of the same moment stacked side by side, so comparing take 2 against take 7 takes seconds instead of scrubbing.</li>
  <li><b>Surface the best-audio takes.</b> Let the tool rank for clean dialogue — a genuinely mechanical judgment — while you stay focused on performance.</li>
  <li><b>Build the first assembly.</b> Selects laid in story order: long, baggy, and watchable. A sketch of the film, hours after the footage landed.</li>
  <li><b>Keep a "kills" bin.</b> Everything the AI rejected goes in a bin you skim before locking any scene — because the machine is wrong about your best take often enough to check.</li>
</ul>

<p>That last item is a rule, not a suggestion. The AI ranks takes by measurable cleanliness — audio clarity, completeness, technical polish. Your best take is frequently the messy one: the overlap, the flubbed-then-recovered line, the reading where something real happened through the noise. Those live in the kills bin. Skim it. Every project, it hands you back at least one moment you'd have lost.</p>

<div class="pullquote">The AI assembly is a first draft written by someone who has never met you. Useful — but you rewrite every line.</div>

<h2>A sketch, not a cut</h2>

<p>So how do you hold an AI rough cut in your head? The same way a novelist holds a first draft: it exists to be rewritten, and its whole value is that it exists <em>at all</em>. A blank timeline is paralyzing; a bad assembly is legible. You watch it and instantly know things — this scene starts too early, that take is wrong, the middle sags — that you could not have known while staring at bins. Reacting is faster and truer than generating from nothing. That's the psychology the AI assembly exploits, and it's legitimate.</p>

<p>The failure mode is treating the assembly as a cut that needs trimming rather than a sketch that needs rewriting. The difference is posture. Trimming accepts the machine's structure and shaves it; rewriting keeps your hand on every decision — reordering scenes, swapping takes from the kills bin, restoring the pauses the machine deemed dead air. Remember the taste rule from Chapter 4: the assembly is labor, and labor is exactly what we automate. Everything after the assembly is judgment, and the judgment starts the moment you press play. The machine got you to the starting line days early. Now the actual edit begins — and it's all yours.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>On a recent short we ran AI selects overnight after the last shooting day. Next morning there was an assembly waiting — clumsy, baggy, at least twice as long as the film wanted to be. And still it changed everything: the director and I spent that first fresh-eyed morning arguing about structure instead of hunting through bins. One scene got rebuilt entirely from takes the machine had killed — the "unusable" overlapping-dialogue takes turned out to be the scene. The assembly earned us the week. The kills bin saved the film.</p>
</div>

<p>Assembly in hand, structure emerging — the next job is making it all look like one film. Next chapter: AI color, and why the machine's pass is a first pass, never the grade.</p>`,
    takeaways: [
      "The selects problem is an attention ratio — AI triage lets your freshest eyes start at candidates, not chaos.",
      "The sequence: transcribe, flag usable takes, group by scene and line, rank by audio, assemble in story order.",
      "Treat the AI assembly as a first draft you rewrite — never a cut you trim.",
      "Keep a kills bin and skim it before locking any scene — the machine is wrong about your best take often enough to check."
    ]
  },
  {
    slug: "ai-color-grading",
    num: 7,
    roman: "VII",
    title: "AI Color: First Pass, Not Final Grade",
    desc: "Shot matching and balance by AI — the look stays yours",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `AI color tools can balance a whole timeline and match every shot in a scene before you've poured your coffee. What they can't do is decide what your film should feel like. That split — machine balance, human grade — is the whole chapter.`,
    seoTitle: "AI Color Grading: First Pass, Not Final Grade | Filmmaker Genius",
    seoDesc: "What AI color tools actually do well — shot matching, balance, exposure normalization — and why the grade itself stays a human storytelling decision. Chapter 7 of AI in Post-Production.",
    body: `<p>Here's a confession from every low-budget timeline I've ever opened: the footage doesn't match. The A-cam and B-cam disagree about what skin looks like. The light shifted between the morning and afternoon halves of the scene. Somebody bumped the white balance after lunch and nobody noticed until picture lock. Before you can even <em>think</em> about a look, someone has to spend hours making shot 14 sit next to shot 15 without the audience flinching. That someone used to be you, one node at a time. Now it mostly doesn't have to be.</p>

<p>The AI color features built into DaVinci Resolve and Premiere Pro — and they're built in now, not bolted on — are genuinely good at exactly this unglamorous layer. <strong>They're a first pass, and you should treat them as nothing more.</strong> Because the moment you let a machine make the last color decision on your film, you've handed away one of the most powerful storytelling tools you own.</p>

<h2>What the machine does well — and what the grade actually is</h2>

<p>Let's give AI its due. Shot matching across a scene — analyzing one reference shot and conforming the rest to it — is tedious, semi-mechanical work, and the tools do it fast and mostly right. Balance and exposure normalization across a whole timeline gets you to a neutral, consistent starting point in minutes. Some tools will even suggest LUTs or starting looks based on what they see in your footage. All of that is real, and all of it used to eat days.</p>

<p>But none of that is the grade. The grade is a storytelling decision: how warm the kitchen feels before the fight and how cold it feels after, how much contrast the third act carries compared to the first, whether your film's world is inviting or hostile. That contrast arc across a whole film — mood bending scene by scene in service of the story — is something no tool can infer, because it lives in your intentions, not in your pixels. It stays human because it <em>is</em> the authorship. Here's the workflow that keeps both halves in their lane:</p>

<ul class="spec-list">
  <li><b>1 · Neutralize first.</b> Run the AI balance pass across the timeline — exposure evened out, white balance corrected, everything to a clean neutral base.</li>
  <li><b>2 · Match the scene.</b> Use AI shot matching within each scene so cuts stop flickering between setups. Pick your best shot as the reference; conform the rest to it.</li>
  <li><b>3 · Verify on scopes.</b> Skim every scene and check the scopes. The tools get skin tones and mixed lighting wrong often enough that a human sanity pass is non-negotiable.</li>
  <li><b>4 · Grade on top.</b> Now do the human work: the look, the mood, the contrast arc. Build it as a separate layer or node above the balance so you can adjust either independently.</li>
  <li><b>5 · Watch it as a film.</b> Play whole reels down, not shot by shot. The grade has to tell the story across time — that's a judgment only a viewer can make, and you're the first one.</li>
</ul>

<p>Notice the shape of that list: the machine does steps one and two, and you do everything that touches meaning. That's the pattern for this entire course, and color is where it's clearest.</p>

<div class="pullquote">The balance pass makes your footage consistent. The grade makes it yours. Automate the first. Guard the second.</div>

<h2>The preset trap</h2>

<p>A warning, because I see this on every festival screener block: the "graded look" presets — teal-and-orange everything, crushed blacks, that same lifted-haze filmic wash — are turning indie films into one long indistinguishable reel. When an AI tool suggests a look, it's suggesting the statistical average of looks it has seen. By definition, that's the least distinctive choice available to you. Use the suggestion as a conversation starter if you like, then argue with it. Your film earned its own answer.</p>

<p>One scope note: this chapter is about where AI fits into color, not about color craft itself. Reading scopes, secondaries, skin tones, building a look from nothing — that's a full discipline, and we teach it properly in the <strong>Color Grading for Filmmakers</strong> course here in the Academy. If the grade excites you (it should), go deep there. What you'll find is that the AI balance pass makes that course <em>more</em> useful, not less — you get to spend your hours on the creative layer instead of the janitorial one.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>On a short I cut last year, we shot a dinner scene across two evenings and the practicals were swapped between them — nobody caught it. The AI match pass got the two nights close enough to cut in about twenty minutes, which would have been an afternoon of manual matching. But its idea of "matched" pushed everyone's skin toward the tablecloth. Two minutes of human correction on the reference fixed the whole scene. That ratio — machine does the volume, human does the judgment — is the honest picture of AI color right now.</p>
</div>

<p>Next chapter: the other half of finishing, and honestly the bigger rescue story — what AI can do for your production audio, and the scenes it will save you from re-recording.</p>`,
    takeaways: [
      "AI color is strongest at the mechanical layer: shot matching, exposure and balance normalization, and starting-point suggestions.",
      "The grade is a storytelling decision — mood, and the contrast arc across the film — and it stays human because it is the authorship.",
      "Workflow: AI balance pass first, verify on scopes, then build your grade as a separate layer on top.",
      `Preset "graded looks" are the statistical average of everyone else's films — start from them if you must, but never end there.`
    ]
  },
  {
    slug: "ai-audio-cleanup",
    num: 8,
    roman: "VIII",
    title: "AI Audio Post",
    desc: "Dialogue isolation and noise removal that rescue whole scenes",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `Audiences forgive soft focus. They never forgive bad sound. AI dialogue isolation is the single biggest rescue tool in indie post right now — this chapter covers what it saves, where it breaks, and why audio is the one place I tell people to spend money.`,
    seoTitle: "AI Audio Cleanup: Dialogue Isolation & Noise Removal | Filmmaker Genius",
    seoDesc: "Dialogue isolation, noise removal, de-reverb, and mix prep — how AI audio tools rescue indie production sound, where they fail, and why audio is the one place to spend money. Chapter 8 of AI in Post-Production.",
    body: `<p>Every indie filmmaker has the scene. The performance is the best take of the day — and under it there's a bus, or a refrigerator hum you swore you'd unplugged, or wind hitting the lav like a drum solo. For most of film history, that scene had two fates: live with the noise, or drag your actor into a booth months later for ADR and pray they can find the performance again. They usually can't. ADR dialogue on an indie budget almost always sounds like what it is.</p>

<p>AI dialogue isolation changed that math more than any other single tool in this course. <strong>Modern voice-separation models can pull spoken dialogue away from traffic, hum, rain, HVAC, and wind</strong> — not by carving out frequencies the way old noise reduction did, but by learning what a human voice is and rebuilding the signal around it. The dialogue isolation built into DaVinci Resolve and Premiere Pro, and the dedicated dialogue-isolator category beyond them, will rescue scenes you had written off. I've watched it un-cancel ADR sessions. That's money and morale saved in the same click.</p>

<h2>The cleanup pass, in order</h2>

<p>Audio cleanup works best as a deliberate sequence, not a panic button you hit on the worst clip. Here's the pass I run on every project once picture is locked (or close):</p>

<ul class="spec-list">
  <li><b>1 · Isolate dialogue.</b> Run voice isolation on the production tracks that need it — and only those. Clean tracks should stay untouched; every pass of processing costs something.</li>
  <li><b>2 · De-reverb.</b> If you shot in a boomy room, reduce the reflections next. Dry dialogue is flexible dialogue — you can always add space back in the mix; you can't easily remove it later.</li>
  <li><b>3 · A/B against the original.</b> Every processed clip, toggled against the raw take, on decent headphones. This step is not optional, for reasons below.</li>
  <li><b>4 · Level match.</b> Bring all dialogue to a consistent conversational level across the film so no one rides the volume knob. AI loudness tools do this fast; your ears confirm it.</li>
  <li><b>5 · Prep the mix.</b> Split dialogue, music, and effects to their own organized tracks. Whether you mix it yourself or hand it off, clean stems are the difference between a mix and a mess.</li>
</ul>

<p>For documentary and interview work, add one more tool to the kit: transcript-based cleanup. Because your edit is already tied to a transcript (Chapter 5), removing filler words — the ums, the false starts, the "sort ofs" — becomes a text edit. Used gently, it tightens an interview beautifully. Used greedily, it makes a human being sound like a text-to-speech engine. Cut the stumbles that add nothing; keep the ones that make the person a person.</p>

<div class="pullquote">Heavily processed dialogue sounds processed. The A/B toggle against the original take is the most important button in this chapter.</div>

<h2>Limits, and where the money goes</h2>

<p>Now the honest part. Push these tools hard and the voice starts to thin out — a slightly underwater, swirly quality engineers call artifacts and audiences call "something's off," even when they can't name it. A voice stripped of all room tone can also feel weirdly disembodied, floating in front of the picture instead of living inside it. The fix is restraint: process at the lowest strength that solves the problem, and always compare against the original before committing. Sometimes fifty percent of the noise gone is the right answer, because a hundred percent kills the take with it.</p>

<p>And here's my one spending recommendation in this whole course. I've told you the free and built-in tools are enough almost everywhere — rough cuts, transcription, captions. Audio is the exception. <strong>If you're going to spend money anywhere in post, spend it on sound</strong> — better cleanup tools, or a few hours of a real dialogue editor's time on your hardest scenes. Sound is half the experience of your film and the half audiences judge subconsciously and mercilessly. A great mix makes a modest picture feel expensive. The reverse is never true.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>We once lost a location's quiet hours and had to shoot a whispered breakup scene next to a loading dock. The sound recordist looked ill. Two years ago that scene was ADR, full stop — and the take we loved, the one with the crack in her voice, would have died in the booth. Dialogue isolation pulled the scene out nearly clean. Nearly: on the widest shot the processing thinned her whisper, so we cheated that line onto a closer take's audio. The tool saved the scene; the A/B check saved the tool from itself.</p>
</div>

<p>Next chapter we move from sound rescue to picture rescue — upscaling, denoising, and restoration, and the crucial skill of knowing when footage can be saved and when it's telling you to reshoot.</p>`,
    takeaways: [
      "AI dialogue isolation is indie post's biggest rescue tool — it saves performances that would otherwise die in an ADR booth.",
      "Run cleanup as a sequence: isolate, de-reverb, A/B, level match, then prep clean stems for the mix.",
      "Heavily processed dialogue sounds processed — use the lowest strength that works, and always A/B against the original take.",
      "If you spend money anywhere in post, spend it on sound — it's the half of your film audiences judge without mercy."
    ]
  },
  {
    slug: "ai-video-upscaling",
    num: 9,
    roman: "IX",
    title: "Upscaling, Restoration & Repair",
    desc: "Rescuing soft, noisy, shaky, or damaged footage",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `AI upscaling doesn't recover detail — it invents plausible detail. Once you understand that one sentence, you know when to trust it, when to check it frame by frame, and when the honest answer is to reshoot.`,
    seoTitle: "AI Video Upscaling & Restoration: Rescuing Footage | Filmmaker Genius",
    seoDesc: "What AI upscaling really does, the rescue jobs it's good for — archival to 4K, punch-ins, denoising, stabilization — the face-hallucination problem, and when to reshoot instead. Chapter 9 of AI in Post-Production.",
    body: `<p>Let's start by killing a myth, because everything else in this chapter depends on it. When an AI upscaler turns your 1080p shot into 4K, it is not "recovering" resolution that was hiding in the file. That information was never captured. What the model does is study the pixels you have and <em>invent plausible new ones</em> — texture, edges, detail that statistically belongs there based on millions of images it learned from. Usually the invention is convincing. Sometimes it's fiction. Knowing that's what you're getting is the difference between using these tools and being used by them.</p>

<p>With that understood, AI upscalers and restoration tools have become a legitimate part of the finishing kit — and for indie filmmakers, they're often the difference between a compromise and a rescue. <strong>The skill isn't running the tool. The skill is knowing which jobs it does honestly.</strong></p>

<h2>The rescue jobs, ranked by reliability</h2>

<p>Not all rescues are equal. Here's how the common ones stack up in my experience, from "trust it" to "watch it like a hawk":</p>

<ul class="spec-list">
  <li><b>Denoising underexposed footage — most reliable.</b> Night scenes and available-light interiors shot at high ISO clean up remarkably well, because the tool is removing garbage rather than inventing detail. Denoise before you grade, not after.</li>
  <li><b>Stabilization — very reliable.</b> Modern AI stabilization salvages handheld shots that would once have been unusable. Watch the frame edges for warping and accept the slight crop it costs you.</li>
  <li><b>Archival 1080p (or worse) into a 4K timeline — reliable with review.</b> The classic doc-and-flashback use case. Old interview tapes and legacy footage upscale well enough to intercut, and restoration passes can reduce compression artifacts and damage on truly old material.</li>
  <li><b>Crop punch-ins — situational.</b> Punching into a wide to fake a medium shot works if the source is clean and the move is modest. Push past roughly a third of the frame and the invented texture starts to show.</li>
  <li><b>Faces in close-up — least reliable.</b> The hallucination problem lives here. Upscalers redraw eyes, teeth, and skin texture, and a subtly wrong face reads as deeply wrong to an audience. More below.</li>
</ul>

<p>Both DaVinci Resolve and Premiere Pro now carry pieces of this kit natively — super-scale, denoise, stabilization — and the dedicated AI-upscaler category goes further for heavy restoration work. Whatever you use, the workflow rule is the same: upscale and repair on <em>copies</em>, keep your originals untouched, and compare before committing the render.</p>

<div class="pullquote">An upscaler doesn't find detail. It makes detail up. Your job is to check whether it made up the truth.</div>

<h2>Faces, archival, and the reshoot question</h2>

<p>The face problem deserves its own paragraph because it's where these tools quietly betray you. On a landscape or a brick wall, invented texture is harmless — nobody knows what that exact brick looked like. On a human face, everyone knows. Audiences are hardwired for faces, and when an upscaler subtly redraws a jawline or gives an actor glassy, repainted eyes, viewers feel it before they can articulate it. So the rule is absolute: <strong>any upscaled or restored shot featuring a face in close-up gets checked frame by frame at full resolution.</strong> Not scrubbed. Stepped through. It's tedious, and it has saved me from shipping some genuinely cursed frames.</p>

<p>For documentary work, restoration is less a rescue than a superpower — old family footage, degraded archival tape, damaged prints can be cleaned, stabilized, and upscaled into material that sits comfortably in a modern timeline. Just keep an ethics footnote in mind: when the tool invents detail in historical material, you're presenting a reconstruction, not a record. For most storytelling uses that's fine; for evidentiary or journalistic claims, disclose it. And finally, know when to stop rescuing. If a shot needs upscaling, denoising, stabilization, <em>and</em> a punch-in to work, the footage is telling you something. When a reshoot costs an afternoon and a favor, an honest reshoot beats a heroic rescue every single time. Save the heroics for shots you genuinely cannot get again.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>On a doc project we upscaled an interview from an old consumer camcorder tape — the subject had passed away, so reshooting was never an option. Wide shots came out beautifully; the tape looked ten years newer. Then we checked the one close-up frame by frame and found the tool had subtly rebuilt his teeth into someone else's smile. We used the wide, kept the close-up at native resolution, and softened the cut with a slow push-in. Nobody watching ever noticed. That's the job: use the invention where it lies harmlessly, and refuse it where it lies about a person.</p>
</div>

<p>Next chapter, we leave rescue work behind and get to the finish line: captions, reframing, and the deliverables pass that turns one master into everything the world needs from your film.</p>`,
    takeaways: [
      "Upscaling invents plausible detail — it never recovers detail that wasn't captured. Judge every result with that in mind.",
      "Most reliable rescues: denoising and stabilization. Reliable with review: archival upscales. Watch closely: punch-ins and anything with faces.",
      "Faces in close-up get checked frame by frame at full resolution — hallucinated features read as wrong even when viewers can't say why.",
      "If a shot needs three rescues stacked on top of each other, reshoot it. Save the heroics for footage you can never get again."
    ]
  },
  {
    slug: "ai-captions-and-reframing",
    num: 10,
    roman: "X",
    title: "Captions, Reframing & Deliverables",
    desc: "Subtitles, vertical reframes, and every export in one pass",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `The film isn't done when the film is done. Festivals want subtitles, platforms want captions, social wants vertical — and AI turns that mountain of deliverables into a single afternoon pass. Here's how, and where you still have to look.`,
    seoTitle: "AI Captions & Auto-Reframing: Deliverables in One Pass | Filmmaker Genius",
    seoDesc: "AI captions from your transcript, auto-reframing 16:9 masters for vertical and square, export presets, and the deliverables-checklist mindset that gets your film everywhere it needs to go. Chapter 10 of AI in Post-Production.",
    body: `<p>Nobody warns you about the second post-production. You lock picture, finish the mix, sit back — and then discover the film needs subtitles for the festival, captions for accessibility, a vertical cut for social, a square cut for the other social, three trailers' worth of clips, and an export in whatever codec this week's platform demands. Five years ago this was days of grind or a line item you couldn't afford. Today it's an afternoon — <em>if</em> you run it as one deliberate pass instead of a month of one-off panics.</p>

<p>The foundation is something you already built in Chapter 5: your transcript. Because AI transcription tied every spoken word to a timecode, <strong>captions and subtitles are now generated, not typed.</strong> DaVinci Resolve and Premiere Pro both create timed captions from your audio directly, and export them as sidecar files or burn them in. Festival screeners increasingly expect subtitles. Accessibility isn't optional — deaf and hard-of-hearing viewers are your audience too. And on social, most viewers watch with the sound off, which means on those platforms your captions <em>are</em> your dialogue track. One transcript feeds all three.</p>

<h2>The one-pass deliverables workflow</h2>

<p>Here's the pass I run once picture and mix are locked. Do it in this order and nothing gets forgotten:</p>

<ul class="spec-list">
  <li><b>1 · Generate captions from the locked cut.</b> Auto-generate, then human-proof the entire file. AI reliably mangles names, places, and technical jargon — the exact words that make you look careless when they're wrong.</li>
  <li><b>2 · Export caption formats per destination.</b> Sidecar subtitle files for festivals and platforms that want them; styled burn-ins only where the destination demands it. Keep the clean master caption-free.</li>
  <li><b>3 · Auto-reframe for vertical and square.</b> Let the AI subject-tracker do the first pass on your 16:9 master, then review every single shot. More on this below.</li>
  <li><b>4 · Run your export presets.</b> Build a preset per destination once — festival master, streaming upload, social variants — and reuse them forever. Presets are how you stop re-solving solved problems at 2 a.m.</li>
  <li><b>5 · Check everything off a written list.</b> Every destination, every file, every spec, ticked on an actual checklist. Memory is not a deliverables strategy.</li>
</ul>

<p>Step 3 deserves its warning label. Auto-reframing — the AI that pans a crop window around your 16:9 frame to track your subject for vertical — is genuinely good on singles and mediums, where there's one obvious subject to follow. On wides, <strong>the tracker loses the plot</strong>: two characters split the frame and it dithers between them, or it fixates on whoever's moving instead of whoever's talking. Composition was your decision at 16:9; it's still your decision at 9:16. Review every shot, and hand-keyframe the ones the machine got wrong.</p>

<div class="pullquote">The algorithm doesn't know who the scene is about. It knows who's moving. Those are not the same thing.</div>

<h2>The checklist mindset — and the marketing bridge</h2>

<p>The deeper lesson of this chapter isn't any single tool; it's a mindset shift. Treat deliverables as a <em>defined, finite pass</em> with a written checklist, not a trickle of requests you handle as they arrive. The moment a festival emails asking for a different subtitle format, you want to be regenerating from your transcript in minutes, not rebuilding from scratch. This checklist thinking scales all the way up to professional delivery — DCPs, audio configurations, technical QC — and when your film is headed for real screens, the <strong>DCP &amp; Delivery</strong> course in the Academy covers that end of the pipeline properly. Consider this chapter the on-ramp.</p>

<p>And notice what you're holding when the pass is done: a captioned master, verticals, squares, and a folder of clean clips. That's not just delivery — that's a marketing arsenal. The same transcript-driven tools that cut your film will pull quotable moments and cutdowns at a scale that used to require a social team. Promotion stops being a second production and becomes an extension of the finish. That bridge — from finished film to films people actually see — is where AI quietly does some of its best work for independent filmmakers.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>A director I know auto-captioned her festival screener and shipped it without proofing. The film got in — and the programmer's congratulations email gently noted that her own lead character's name was spelled three different ways across ninety minutes. The AI had guessed phonetically, differently each time, and no human had read the file. Ten minutes of proofreading would have caught it. Auto-generate everything; proof-read everything. Both halves are the workflow.</p>
</div>

<p>Next chapter: the invisible fixes — AI object removal and shot cleanup, the tools that erase the boom pole, the logo you couldn't clear, and the stranger who wandered through your best take.</p>`,
    takeaways: [
      "Your transcript is the engine: captions and subtitles for festivals, accessibility, and social all generate from it — then get human-proofed, especially names and technical terms.",
      "Auto-reframing handles singles well and loses the plot on wides — review every shot and keyframe the ones the tracker gets wrong.",
      "Run deliverables as one deliberate pass against a written checklist, with reusable export presets per destination.",
      "The finished deliverables folder is also your marketing arsenal — cutdowns and clips at scale flow from the same transcript-driven tools."
    ]
  },
  {
    slug: "ai-vfx-cleanup",
    num: 11,
    roman: "XI",
    title: "AI Cleanup & Removal",
    desc: "Boom poles, logos, and background strangers — gone",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `The boom dipped into frame. A stranger walked through the back of your best take. There's a logo on the fridge your lawyer won't love. AI object removal makes these fixes accessible for the first time — when you know which shots it can actually handle.`,
    seoTitle: "AI Object Removal & Shot Cleanup for Filmmakers | Filmmaker Genius",
    seoDesc: "Boom poles, uncleared logos, background strangers, crew reflections — how AI object removal works inside modern NLEs, when it holds up, when it smears, and why it doubles as a clearance tool. Chapter 11 of AI in Post-Production.",
    body: `<p>Every finished film is hiding a list of things that were in the frame and aren't anymore. Big productions have always had this power — armies of paint artists erasing rigs, signs, and continuity sins one frame at a time. What's new is that a meaningful slice of that work now lives inside the tools you already own. Object removal in modern NLEs — Resolve's magic-mask-and-patch style tools, Premiere's AI-assisted fills, and the plugin ecosystem around them — has turned "we can't afford to fix that" into "give me twenty minutes and I'll tell you."</p>

<p>The list of candidates is always the same on an indie film: <strong>the boom pole</strong> that dipped into your one perfect take; <strong>the logo or trademark</strong> on a shirt, a fridge, a storefront that nobody cleared; <strong>the stranger</strong> who wandered through the background of your public-location shot and never signed a release; <strong>the crew reflection</strong> in a window, a mirror, a car door that four people checked and nobody saw. None of these are creative problems. All of them are distribution problems — and that's exactly the kind of problem this chapter solves.</p>

<h2>How it works — and what removes cleanly</h2>

<p>In practice, every AI removal follows the same three beats: <em>mask</em> the object (the AI helps you select it, often from a rough scribble), <em>track</em> the mask so it follows the object through the shot, and <em>fill</em> the hole with plausible background — synthesized from surrounding frames and the model's learned sense of what belongs there. That last word, "plausible," should sound familiar from the upscaling chapter. The fill is an invention, and how well the invention holds depends almost entirely on what's behind and around the object. Here's the honest field guide:</p>

<ul class="spec-list">
  <li><b>Removes cleanly: small objects on static shots.</b> A logo on a mug, a sign on a wall, a boom tip against the ceiling in a locked-off frame. The background barely changes, the fill has everything it needs. Near-invisible results.</li>
  <li><b>Removes well: steady, simple backgrounds.</b> Objects against sky, plain walls, pavement, or grass — even with modest camera movement — fill convincingly because the invented texture has nothing complicated to match.</li>
  <li><b>Gets risky: fast motion and motion blur.</b> The mask trails the object, edges shimmer, and the fill drags. Sometimes usable, always needs frame-by-frame review.</li>
  <li><b>Smears: hair, water, smoke, and complex motion.</b> Anything wispy or translucent crossing the removal area defeats the fill. If your uncleared logo passes behind your actor's hair, that's a paint job or a crop, not a click.</li>
  <li><b>Forget it: large objects that dominate the frame.</b> The tool would be inventing most of your shot. At that point you're not cleaning a shot — you're generating one, and it will look like it.</li>
</ul>

<p>The workflow discipline is the same as everywhere in this course: work on copies, review every removal at full resolution and full speed — smears that are invisible frame-by-frame can crawl in motion — and when a removal won't hold, remember the older tricks still work. A slight punch-in crops the boom out. A cutaway hides the stranger. Not every fix has to be a fill.</p>

<div class="pullquote">The fill is only as good as what's behind the thing you're removing. Static and simple, it's magic. Moving and complex, it's smear.</div>

<h2>The clearance upside — and the on-set discipline</h2>

<p>Here's the underrated part: AI removal is a <strong>legal tool</strong> as much as a cosmetic one. Distributors and E&amp;O insurers care about uncleared trademarks and unreleased faces, and indie films have historically handled this with expensive paint-outs, ugly blurs, or quiet prayer. Now a fridge logo or a background face can often be removed for the cost of an afternoon. When you're doing clearance-driven cleanup, keep a simple log of what you removed and where — your distributor's deliverables paperwork will ask, and "here's the list" is a much better answer than a shrug. (The usual disclaimer: I'm a filmmaker, not a lawyer — for real clearance questions, ask a real one.)</p>

<p>And one piece of set discipline, because this chapter shouldn't make you sloppy: <em>the cheapest removal is the one you never need.</em> AI cleanup has a quiet cost — render time, review time, and a small tax on image quality in the fixed region. On set, it's still faster to move the mug, turn the shirt inside out, or ask the background stranger to sign a release than to fix any of it in post. The right use of these tools is rescuing the shot you couldn't control — not excusing the twenty you could have.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>We shot a café scene with a beautiful window behind the actors — and in every take, there I am, faintly reflected in the glass, directing with my arms like an air-traffic controller. Nobody caught it until the edit. The removal tool erased me cleanly from the two static shots in about half an hour. On the slow push-in, my ghost smeared across the glass like a haunting, so we timed the cut to leave that angle early. One scene, both lessons: the tool saved what it could, and the edit saved the rest.</p>
</div>

<p>One chapter left. Time to put every tool from this course into a single workflow — a real film, ingest to delivery, with the human cut protected in the middle of it.</p>`,
    takeaways: [
      "Every AI removal is mask, track, fill — and the fill is invented, so its quality depends on what surrounds the object.",
      "Small objects on static, simple backgrounds remove cleanly; motion, hair, water, and frame-dominating objects smear or fail.",
      "Removal is a clearance tool: uncleared logos and unreleased background faces can now be fixed affordably — log what you remove for delivery paperwork.",
      "The cheapest removal is the one you never need — flag it on set instead of fixing it in post whenever you have the choice."
    ]
  },
  {
    slug: "ai-video-editing-workflow",
    num: 12,
    roman: "XII",
    title: "The AI-Assisted Finish",
    desc: "A real AI-assisted post workflow, from ingest to delivery",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `Twelve chapters of tools mean nothing until they're one workflow. So let's finish a real short film together — ingest to delivery — and see exactly where the machines carry the weight and where you do. Spoiler: the part that's still yours is the point.`,
    seoTitle: "The AI-Assisted Post Workflow: Ingest to Delivery | Filmmaker Genius",
    seoDesc: "The whole course as one workflow on a real short film — ingest, transcription, AI assembly, the protected human cut, audio and color passes, cleanup, and delivery. Chapter 12 of AI in Post-Production.",
    body: `<p>Picture the moment every chapter in this course has been building toward: the shoot wrapped last night, and there's a drive on your desk with a short film trapped inside it. Twelve chapters ago, what stood between that drive and a finished film was months of grind. Now let's walk what actually happens — the whole course compressed into one honest workflow, with every tool in its place and one section of the calendar fenced off with barbed wire.</p>

<p><strong>Day one is machine day.</strong> Ingest the footage with a real folder structure, back it up twice before you so much as scrub a clip, and set transcription running on everything with spoken words. By tonight, your entire shoot is searchable text — the foundation that captions, text-based editing, and cutdowns will all draw from later. None of this needs your creativity. All of it needs your discipline. Do it while the coffee's still working.</p>

<h2>The workflow, start to finish</h2>

<p>From there, the whole finish runs in a sequence you now know chapter by chapter:</p>

<ul class="spec-list">
  <li><b>1 · Ingest, transcribe, back up (day one).</b> Organized media, two backups, transcripts running overnight. Boring, foundational, non-negotiable.</li>
  <li><b>2 · Selects and AI assembly (days two–three).</b> Let the tools flag usable takes and build the first assembly from your script or outline. It will be wrong in interesting ways — that's its job. You now have something to react to instead of a blank timeline.</li>
  <li><b>3 · The human cut (most of the calendar).</b> Rough cut to fine cut to locked picture. Rhythm, performance, what the film is actually about. Protect this time ferociously — more below.</li>
  <li><b>4 · Audio cleanup pass.</b> Dialogue isolation on the scenes that need it, de-reverb, level match, stems prepped — every processed clip A/B'd against the original.</li>
  <li><b>5 · AI color balance, then the grade.</b> Machine normalizes exposure and matches shots; you build the look and the contrast arc on top. First pass, not final grade.</li>
  <li><b>6 · Cleanup shots.</b> The boom dip, the reflection, the logo legal flagged — masked, tracked, filled, and reviewed at full speed and resolution.</li>
  <li><b>7 · Captions, reframes, exports, checklist.</b> Captions generated and human-proofed, verticals reviewed shot by shot, presets run, every deliverable ticked off a written list.</li>
</ul>

<p>Look at the calendar that workflow produces, because it's the quiet headline of this course: steps one, two, and four through seven — the parts that used to devour indie post — now take days. Step three still takes weeks. <strong>AI compressed everything except the cut.</strong> And the trap I've watched real filmmakers fall into is spending the saved time everywhere except there — polishing deliverables, re-running the grade, fiddling with cleanup — while the actual film gets the same rushed attention it always did. The entire point of the compression is to hand those weeks to the cut. Fence off that time. Nothing about the machine's speed obligates you to hurry the one part that was never the machine's to do.</p>

<div class="pullquote">AI compressed everything except the part that makes the film yours. That's not a limitation. That's the whole point.</div>

<h2>Where this leaves you</h2>

<p>Back in the first module I gave you this course's thesis: AI in post kills the drudge work around the cut, and taste stays human. Twelve chapters later you've seen it hold everywhere — in transcription and selects, in the balance pass under the grade, in the isolation under the mix, in the fill under the frame. Every tool, without exception, turned out to be the same shape: a machine handling volume so a human can handle judgment. Nothing we covered decides what your film means. Everything we covered gets you to that decision faster and less exhausted.</p>

<p>So here's your graduation assignment, and I mean it literally: take the shortest project you have — a scene, a spec, three minutes of anything — and run this exact workflow on it start to finish, this month. The tools will change names by next year; the workflow's shape will not. And the filmmakers who thrive in what's coming won't be the ones with the best subscriptions. They'll be the ones who used all this recovered time to develop the one asset no model can generate: a point of view. Go finish something. That was always the assignment.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The last short I finished this way, I kept a diary out of curiosity. Machine work — ingest, transcripts, assembly, cleanup, captions, exports — came to about six days scattered across the schedule. The cut took five weeks, same as it ever would have. But those five weeks were different: no dread, no 2 a.m. logging sessions, no energy burned on anything but the film itself. I wasn't a faster editor. I was a fresher one. That's the real gift buried in this whole course — the machines don't just save time, they save the version of you that shows up to the timeline.</p>
</div>

<p>That's the course. The tools are on your machine, the workflow is on this page, and the drive on your desk isn't going to finish itself. I'll see you in the next course — and better yet, I'll see your film.</p>`,
    takeaways: [
      "The full workflow: ingest and transcribe, AI selects and assembly, the human cut, audio cleanup, balance then grade, cleanup shots, deliverables checklist.",
      "AI compressed every stage except the cut — so give the saved weeks to the cut, and protect that time ferociously.",
      "Every tool in this course is the same shape: machines handle volume, humans handle judgment. Nothing here decides what your film means.",
      "Graduation assignment: run this workflow on your shortest project this month. The tools will change; the shape — and your point of view — are what last."
    ]
  }
];
const aiPost = {
  slug: "ai-in-post-production",
  title: "AI in Post-Production",
  categoryLabel: "AI & Technology",
  subtitle: "Post is where AI quietly earns its keep — not by cutting your film, but by killing the drudge work around the cut. Transcription editing, rough-cut assists, color first-passes, audio cleanup, upscaling, and captions: the working filmmaker's guide to finishing faster.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~95 min read",
  pairsWithName: "Recut",
  pairsWithUrl: "/toolbox",
  pairsWithDesc: "Recut is this course in tool form — an AI edit assistant that pulls selects from your footage, builds a first assembly, and preps cutdowns, ready to polish in your own editor.",
  seoTitle: "AI in Post-Production: Edit, Color & Sound with AI (Free Course) | Filmmaker Genius",
  seoDesc: "AI in post-production, explained by a working filmmaker — text-based editing, AI rough cuts, color first-passes, audio cleanup, upscaling, and captions. A free 12-chapter course on finishing your film faster without losing the craft.",
  learn: [
    "Build an AI post stack — transcription, edit assists, color, and audio cleanup",
    "Cut faster with text-based editing and AI selects — without losing the rhythm",
    "Use AI color and audio tools as the first pass — never the final say",
    "Rescue footage with upscaling, restoration, and cleanup — at indie cost"
  ],
  mosaic: [
    "INT. FILM SET<br>- DAY<br><br>Crew settles.",
    "ROLL SOUND",
    "SCENE 42",
    "CUT TO:<br><br>EXT. BACKLOT<br>- NIGHT",
    "Take 1 of 3",
    "ACTION."
  ],
  modules: [
    { key: "foundations", label: "Module 1 — Foundations" },
    { key: "core", label: "Module 2 — Core Craft" },
    { key: "apply", label: "Module 3 — Putting It to Work" }
  ],
  chapters
};
export {
  aiPost
};
