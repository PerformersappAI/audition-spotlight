import type { Course, CourseChapter } from "../courseTypes";

const chapters: CourseChapter[] = [
  {
    slug: "ai-screenwriting",
    num: 1,
    roman: "I",
    title: "Can AI Write Your Screenplay?",
    desc: "The honest answer — and the better question to ask",
    time: "9 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Everyone asks this question, and everyone asking it is asking the wrong one. Here's the honest answer about AI screenwriting from someone who writes for a living — and the better question this whole course is built around.`,
    seoTitle: "AI Screenwriting: Can AI Actually Write Your Screenplay? | Filmmaker Genius",
    seoDesc: "AI screenwriting, answered honestly by a working filmmaker — what AI can actually do for your screenplay, what it can't, and the development jobs where it genuinely earns its keep. Chapter 1 of AI-Assisted Script Development.",
    body: `<p>Let me answer the question in the title before we go anywhere else, because you deserve a straight answer and most of what's written about AI screenwriting won't give you one. Can AI write your screenplay? <strong>Technically, yes.</strong> Ask ChatGPT or Claude for ninety pages and you'll get something screenplay-shaped: sluglines in the right place, dialogue under character names, a beginning, a middle, an end. It will be formatted correctly. It will be structurally competent. And it will be dead on the page.</p>

<p>I've read these scripts. Producers I know have read stacks of them, because people are already submitting them. They all have the same quality — a kind of smooth, frictionless averageness. The characters want things for reasons that are explained rather than felt. The dialogue sounds like dialogue from other movies. Nothing surprises you, because the machine is built to predict the most likely next thing, and <em>the most likely next thing is the definition of a cliché</em>. A screenplay lives or dies on the moments a reader didn't see coming. AI, by its nature, is a machine for producing the moments everyone saw coming.</p>

<p>So if the question is "can AI replace me as a writer," the answer is no — not because the technology is weak, but because the one thing a script sells is the one thing AI doesn't have. Which brings us to the question that actually matters.</p>

<h2>The better question: what can AI do <em>for</em> your screenplay?</h2>

<p>Screenwriting isn't one job. It's a dozen jobs wearing a trench coat — and most of them aren't the sacred part. There's brainstorming, research, loglines, synopses, treatments, outlines, structure passes, dialogue polishes, reading your own pages with fresh eyes you don't have, and producing coverage-style feedback before anyone important sees the draft. AI is genuinely useful at almost all of the support jobs, and this course walks through them one at a time. Here's the honest split:</p>

<ul class="spec-list">
  <li><b>Brainstorming volume</b> — twenty premise variations, ten titles, fifteen ways into a scene. Cheap, fast, and you keep the one that sparks. (Chapter 5.)</li>
  <li><b>Development paperwork</b> — compressing your outline into loglines, synopses, and treatment drafts you then rewrite in your voice. (Chapter 6.)</li>
  <li><b>Structure and outlining</b> — pressure-testing your beats, spotting the sagging second act, mapping alternatives. (Chapter 7.)</li>
  <li><b>A tireless first reader</b> — coverage-style notes, dialogue read-backs, "where did you get bored" passes at two in the morning. (Later modules.)</li>
  <li><b>The one thing it can't do</b> — have a point of view. Your obsessions, your wounds, your specific way of seeing people: that's the product. Everything above exists to serve it.</li>
</ul>

<p>Notice the shape of that list. Every legitimate use is <strong>AI reacting to something you made</strong> — your premise, your outline, your pages. The moment the direction flips and you're reacting to something it made, you've handed over the wheel, and the script starts drifting toward the middle of the road where all the generated scripts live.</p>

<div class="pullquote">AI can't write your screenplay. It can make you the writer who finishes one — faster, with fewer blind spots, and with your voice intact.</div>

<h2>The two ways writers get this wrong</h2>

<p>I watch writers lose this game from both ends. The first group <strong>dismisses AI entirely</strong> — it's a plagiarism machine, it's beneath the craft, real writers don't. I respect the instinct, but these writers are turning down a free development department. They're spending three weeks on a synopsis their competitor drafted in an afternoon and spent the saved time making the actual script better. The purity feels good; the finished-script count tells a different story.</p>

<p>The second group <strong>lets it ghostwrite</strong>. They prompt their way to a full draft, do a light polish, and genuinely can't see that the result is generic — because it's <em>their</em> premise, so it feels personal to them. It doesn't feel personal to anyone else. Readers can smell it, and more importantly, the writer never did the thinking that makes a script worth making. They saved themselves the only part that was worth anything.</p>

<p>The writers who win sit in the middle: they treat AI like a sharp, well-read, slightly literal-minded development assistant. It works for them. It never writes for them. That's the whole philosophy of this course, and every chapter that follows is a specific, practical application of it — starting next chapter with the most misunderstood tool in the space, the script generator.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>A writer I know ran an experiment: she asked an AI to write a scene from her outline, then wrote the same scene herself. The AI version was clean, correct, and forgettable. Hers had a moment where a character lies badly and everyone at the table pretends not to notice — a thing she'd watched her own family do for years. No model was ever going to generate that, because it never sat at her family's table. That gap is your career.</p>
</div>

<p>Next chapter: what AI movie script generators actually are, what they're legitimately for, and the one thing you should never do with their output.</p>`,
    takeaways: [
      "AI can produce a screenplay-shaped document — competent, generic, and dead on the page, because it's built to predict the expected.",
      "The right question isn't \"can AI write it\" but \"what can AI do FOR it\" — brainstorming, treatments, outlines, dialogue reads, and coverage.",
      "Every legitimate use has AI reacting to your material, never the other way around.",
      "Writers who dismiss AI entirely and writers who let it ghostwrite both lose — the winning position is a sharp assistant that works for you.",
    ],
  },
  {
    slug: "ai-movie-script-generator",
    num: 2,
    roman: "II",
    title: "Script Generators, Demystified",
    desc: "What script generators are actually for (hint: not scripts)",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Type a premise, get pages. The most searched-for tool in AI screenwriting is also the most misused. Here's what a script generator is genuinely good for, and the one thing you must never do with what it spits out.`,
    seoTitle: "AI Movie Script Generators: What They're Actually For | Filmmaker Genius",
    seoDesc: "What an AI movie script generator actually is, the legitimate uses working writers get out of one — placeholder scenes, structure tests, speed drafts — and the one trap to never fall into. Chapter 2 of AI-Assisted Script Development.",
    body: `<p>Search for an <strong>AI movie script generator</strong> and you'll find dozens of them — free web tools, paid apps, and every chat assistant wearing a generator costume. They all do the same essential thing: you give them a premise, a genre, maybe some character names, and they hand back formatted screenplay pages. Sluglines, action lines, dialogue, the works. The demo feels like magic. The output, as we established last chapter, reads like the average of every script ever posted online — because that's literally what it is.</p>

<p>So is the whole category junk? No. It's a tool with a narrow, real job that almost nobody uses it for, because the marketing promises the wrong thing. The marketing says "write your movie." The actual value is closer to "generate scaffolding you'll tear down later." Let me show you the difference.</p>

<h2>What a generator is, and the flavors it comes in</h2>

<p>Under the hood, a dedicated generator and a chat assistant like ChatGPT or Claude are the same species. The generator wraps a language model in a form: genre dropdown, tone slider, page count. That form is a convenience and a cage — you get speed, you lose control. A chat assistant does everything the generator does, but lets you feed it <em>your</em> outline, <em>your</em> character voices, and <em>your</em> notes, then push back on what comes out. The free single-purpose generators are fine for a five-minute experiment; the moment you're doing real development work, the conversation beats the vending machine. Everything in this course assumes you're working in the conversation.</p>

<p>Now — the legitimate uses. There are real ones, and I use several myself:</p>

<ul class="spec-list">
  <li><b>Placeholder scenes to test structure</b> — you know a scene must exist ("they argue, she leaves") but writing it now would break your outlining momentum. Generate a stand-in, keep moving, replace it when you write for real.</li>
  <li><b>Reading your outline as pages</b> — generating a rough scene from your beats is a fast way to feel whether the structure plays, before you've invested a week writing it properly.</li>
  <li><b>Format and parody exercises</b> — learning what a cold open or a montage sequence looks like on the page, or generating a deliberately terrible genre parody to see the clichés laid bare. Genuinely instructive.</li>
  <li><b>Speed-drafting material you will fully rewrite</b> — a vomit draft of a scene you're stuck on, used the way some writers use "write it badly first." Every line gets replaced; the blank page doesn't.</li>
</ul>

<p>Notice the common thread: in every legitimate use, <strong>the generated pages are disposable</strong>. They're scaffolding, sketch, crash-test dummy. They exist to be replaced by your writing, faster than the blank page would have allowed.</p>

<div class="pullquote">A script generator is a scaffolding machine. The building is still yours to build — and scaffolding was never meant to be lived in.</div>

<h2>The trap, and the practical file-format note</h2>

<p>Here's the trap, stated as plainly as I can: <strong>never submit generated pages anywhere.</strong> Not to a contest, not to a producer, not to a fellowship, not quietly folded into a draft you're calling yours. Readers who see hundreds of scripts a year clock generated writing fast — the over-explained motivation, the dialogue that answers itself, the eerie absence of anything specific. Beyond getting caught, there are harder problems: many contests and buyers now ask about AI use directly, and purely machine-generated pages sit in genuine copyright limbo — a mess we unpack fully in Chapter 4. The short version: pages you didn't write aren't an asset. They're a liability with margins.</p>

<p>One practical note before we move on, because it'll save you an hour of cursing: generator output rarely pastes cleanly into screenwriting software. The fix is <strong>Fountain</strong> — the plain-text screenplay format. Ask ChatGPT or Claude to output any screenplay material "in Fountain format," and you get a clean text file that Final Draft and most modern screenwriting apps import correctly, with sluglines, character cues, and dialogue all landing where they should. Make it a habit; it turns AI output from a formatting chore into a drop-in scaffold.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once generated a placeholder version of a diner scene I was dreading — two characters, one secret, bad coffee. The generated scene was flat, but reading it told me something valuable: the scene was flat <em>structurally</em>. No amount of good dialogue was going to fix a scene where nobody had leverage. I cut it from the outline entirely and gave the secret to a different scene. The generator never wrote a usable line, and it still earned its keep that day.</p>
</div>

<p>So generators have a job: fast, disposable scaffolding. But the real workhorse of AI-assisted development is the ongoing conversation — and next chapter we set that up properly: a working ChatGPT (or Claude) writing-room workflow, including the prompt patterns that actually make your pages better.</p>`,
    takeaways: [
      "Dedicated generators and chat assistants are the same technology — the chat version wins for real work because you can feed it your material and push back.",
      "Legitimate uses: placeholder scenes, structure tests, format exercises, and vomit drafts you'll fully rewrite — always disposable scaffolding.",
      "Never submit generated pages anywhere — readers spot them, disclosure questions are becoming standard, and the copyright status is a genuine liability.",
      "Ask for output in Fountain format so it imports cleanly into Final Draft and other screenwriting software.",
    ],
  },
  {
    slug: "chatgpt-for-screenwriting",
    num: 3,
    roman: "III",
    title: "ChatGPT for Screenwriting",
    desc: "Prompts, projects, and guardrails for a real writing room",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Most writers open a fresh chat, type "help me with my script," and get mush back. The difference between mush and a real writing-room partner is setup. Here's the working configuration I actually use — and the five prompt patterns that earn their keep.`,
    seoTitle: "ChatGPT for Screenwriting: The Working Setup | Filmmaker Genius",
    seoDesc: "How to set up ChatGPT for screenwriting like a working writer — one project per script, context that sticks, the five prompt patterns that make pages better, and the guardrails that keep the writing yours. Chapter 3 of AI-Assisted Script Development.",
    body: `<p>Everything I said in the first two chapters about AI's limits stays true. But limits and uselessness are different things, and used with a little discipline, ChatGPT — or Claude, everything here applies to both — becomes something genuinely rare for a writer working alone: <strong>a development partner that never gets tired of your script.</strong> Not a writer. A partner. The setup below is how you keep it on the right side of that line.</p>

<p>The first rule is organizational, and it's the one everyone skips: <strong>one project per script.</strong> Both ChatGPT and Claude let you group conversations into a project with shared files and instructions. Make one for each screenplay. Drop in your logline, your character bios, your outline, and your latest pages as they exist. Now every conversation starts already knowing your story — you're not re-explaining your protagonist for the fortieth time, and the feedback you get is about <em>your</em> script instead of scripts in general. This one habit is the difference between a writing-room and a fortune-teller's booth.</p>

<h2>The five prompt patterns that actually work</h2>

<p>Once the room is set up, what you say in it matters more than any tool choice. After a couple of years of doing this on real projects, almost everything useful I do reduces to five patterns:</p>

<ul class="spec-list">
  <li><b>1. Ask for questions, not answers.</b> "Ask me ten hard questions about this outline that a skeptical producer would ask." The questions expose your soft spots; answering them is writing.</li>
  <li><b>2. Ask for ten options, never one.</b> One suggestion invites you to accept it. Ten force you to judge — and your taste, choosing and rejecting, is doing the authorship.</li>
  <li><b>3. Ask it to argue against your choice.</b> "I'm killing this character in act two. Make the strongest case that I shouldn't." If the case is weak, proceed with confidence. If it's strong, you just saved a rewrite.</li>
  <li><b>4. Ask it to interrogate your scene, not write one.</b> Paste your pages and ask: where does the tension drop, who's driving, what does each character want and hide? Notes on your writing, not replacement writing.</li>
  <li><b>5. Ask for the reader's experience.</b> "Describe what a first-time reader feels page by page through this sequence." It's a cold read on demand — imperfect, but available at 2 a.m.</li>
</ul>

<p>See what all five have in common? <strong>The AI never generates story; it generates pressure.</strong> Questions, options, counterarguments, diagnostics. You stay the writer; it plays the room.</p>

<div class="pullquote">Never ask it to write the scene first. Ask it to interrogate yours. The order is the whole game.</div>

<h2>Guardrails, and a word about privacy</h2>

<p>That pullquote is the guardrail that matters most, so let me spell it out. If you're stuck on a scene and your first move is "write this scene for me," the machine's version now occupies the space where your version was going to grow. You'll anchor on it — its rhythm, its shape, its choices — even while rewriting it. But if your first move is "here's what I have, ask me what's wrong with it," you stay the author and the machine stays the assistant. Generated placeholder scenes have their place, as we covered last chapter — but only <em>after</em> your own thinking has happened, never instead of it.</p>

<p>Two more guardrails. First, <strong>never accept a note without a reason.</strong> If it says the second act sags, ask where and why. Sometimes the explanation is sharp; sometimes it collapses under one follow-up question, and that tells you the note was pattern-matching, not reading. Second, <strong>keep your drafting outside the chat.</strong> Write in Final Draft, or in plain-text Fountain, and bring pages to the AI the way you'd bring them to a trusted reader. The chat is the room. It is not the page.</p>

<p>Finally, privacy — worth thirty seconds of your attention because your script is an unproduced, unregistered asset. Consumer AI chats may be used to train future models unless you turn that off; both ChatGPT and Claude offer settings or account tiers that keep your inputs out of training. Check them before you upload a full draft, and consider registering your script with the U.S. Copyright Office or the WGA registry before sharing it widely — a habit that predates AI and still holds. I keep my most sensitive material — the twist, the ending, anything I'd be sick to see paraphrased somewhere — described in general terms rather than pasted verbatim. Probably overcautious. Cheap insurance.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The single most useful prompt I've ever run: I pasted a confrontation scene I'd rewritten six times and asked, "What does each character in this scene want, based only on what's on the page?" The answer came back wrong for my lead — and that was the gift. Her want was in my head, not in her lines. If a careful reading machine couldn't find it, no exhausted producer at 11 p.m. was going to. I fixed two lines. The scene finally worked.</p>
</div>

<p>You now have a working room. Next chapter we deal with the questions hanging over it: whose pages are these legally, why AI prose is average by design, and the rules — credit, copyright, disclosure — that keep your script sellable.</p>`,
    takeaways: [
      "One project per script, loaded with your logline, bios, outline, and pages — context is what turns generic advice into notes on your story.",
      "The five patterns: ask for questions, ask for ten options, ask it to argue against you, ask it to interrogate your scene, ask for the reader's experience.",
      "Never ask it to write the scene first — its version will colonize the space where yours was going to grow.",
      "Check training-data settings before uploading unproduced scripts, and keep the actual drafting in your screenwriting software, not the chat.",
    ],
  },
  {
    slug: "can-ai-write-a-movie-script",
    num: 4,
    roman: "IV",
    title: "Voice, Ownership & the Rules",
    desc: "Why AI prose is average by design — and who owns the pages",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    dek: `Two questions decide whether AI helps your career or quietly wrecks it: does the script still sound like you, and do you still legally own it? Here's the craft answer, the copyright answer, and the rules of the road as they stand.`,
    seoTitle: "Can AI Write a Movie Script You Own? Voice & Rights | Filmmaker Genius",
    seoDesc: "Why AI prose is average by design, why purely AI-generated pages generally can't be copyrighted, how WGA rules treat AI use, and the disclosure habits that keep your screenplay sellable. Chapter 4 of AI-Assisted Script Development.",
    body: `<p>Before we move into the craft chapters, we need to have the uncomfortable conversation — the one about voice and ownership. Skip it and everything that follows can hurt you. Sit through it once and you're inoculated for the rest of the course.</p>

<p>Start with voice, because it explains everything else. <strong>AI prose is average by design.</strong> That's not an insult; it's the architecture. A language model is trained on everything — every produced script, every forum post, every novel — and when it writes, it produces the statistically likely output. It converges on the middle of everything it has read. The middle is competent. The middle is also, by definition, what everyone has already seen. And here's the part that should reorganize how you think about your own writing: <em>your weird is your value.</em> The strange rhythm in your dialogue, the obsession you can't stop writing about, the specific wrong way your characters apologize — the parts of your writing that deviate from average are the only parts a buyer can't get anywhere else. Every time you let AI smooth a scene, you should hear a cash register running in reverse.</p>

<h2>Ownership: the human authorship problem</h2>

<p>Now the legal side, and I'll be direct. Under U.S. copyright law as it currently stands, <strong>copyright protects human authorship</strong>. The Copyright Office has been consistent on this: material generated entirely by a machine, with no meaningful human creative contribution, generally can't be copyrighted — no matter how clever your prompt was. Your human-written work assisted by AI is protectable; the purely machine-made portions are not.</p>

<p>Sit with what that means for a screenwriter. When you sell a script, what you're actually selling is a bundle of rights. If chunks of your script were generated wholesale, those chunks may be rights you don't hold — which means you may not fully own the thing you're selling. Studio and distributor legal departments run chain-of-title review on everything, and "portions of this screenplay may not be copyrightable" is exactly the kind of sentence that stalls a deal. This is the hard, practical reason behind the rule I gave you in Chapter 2: generated pages are scaffolding, never product.</p>

<p>Here are the working rules that keep your pages yours:</p>

<ul class="spec-list">
  <li><b>You type the pages.</b> Every line in the draft passed through your hands and your judgment. AI suggested, questioned, and pressured — you wrote.</li>
  <li><b>Generated text never survives to the final draft.</b> Placeholders get fully rewritten, not lightly polished. Rewording a machine's scene is not the same as writing yours.</li>
  <li><b>Keep your development trail.</b> Outlines, notebooks, dated drafts. If anyone ever asks who wrote this, you can show the work — the same habit that has always protected writers.</li>
  <li><b>Disclose when asked, honestly.</b> Contests, fellowships, and producers increasingly ask about AI use. "I used AI for brainstorming and feedback; every page is my writing" is a clean, true answer if you've followed the rules above.</li>
</ul>

<div class="pullquote">The model converges on the middle. Your career lives at the edges — and so does your copyright.</div>

<h2>The WGA frame, disclosure, and one disclaimer</h2>

<p>If you're aiming at union work, the Writers Guild addressed AI in its 2023 agreement, and the frame is actually writer-friendly: <strong>AI can't be credited as a writer</strong>, AI-generated material isn't treated as "literary material" or "source material" that undercuts your credit or pay, and — importantly — <strong>using AI as a tool doesn't disqualify you from writing credit</strong>. A company also can't force you to use it. The details have edges and the agreement evolves, so if you're working under WGA jurisdiction, read the current agreement rather than a paraphrase from a course page — including this one.</p>

<p>On disclosure more broadly: norms are still forming, and my advice is to stay ahead of them. If a contest or producer asks about AI use, answer plainly. If a contract has an AI representation clause — and more of them do every year — read it before signing, because you're warranting something about how you work. The writers who get burned won't be the ones who used AI thoughtfully; they'll be the ones who used it carelessly and fudged the question afterward. Your reputation is a longer asset than any single script.</p>

<p>And the disclaimer that matters: <strong>none of this is legal advice.</strong> I'm a filmmaker reporting the landscape as I navigate it, and the landscape is actively shifting — rulings, guidance, and guild agreements will keep moving after this page is published. When real money or real rights are on the table, an entertainment lawyer is not a luxury. It's part of the budget.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>A producer friend now asks every writer the same first question about AI: not "did you use it" but "walk me through how." The writers with a clean answer — brainstorming, notes, feedback, my fingers on every page — get a nod and the conversation moves on. The writers who get cagey are the ones she slows down on. The lesson isn't to hide the tools. It's to work in a way you'd be comfortable describing out loud.</p>
</div>

<p>Foundations done. You know what AI can't do, what it's for, how to set it up, and how to keep the pages yours. Now we put it to work — starting next chapter with the most purely fun application in the toolkit: brainstorming and idea development.</p>`,
    takeaways: [
      "AI converges on the average of everything it has read — your deviations from average are exactly what buyers pay for.",
      "Purely AI-generated material generally can't be copyrighted under the human-authorship rule — a real chain-of-title problem when selling a script.",
      "The WGA frame: AI can't take writing credit, and using it as a tool doesn't cost you yours — but check the current agreement yourself.",
      "Type every page, rewrite every placeholder, keep your development trail, disclose honestly — and get an entertainment lawyer when real stakes arrive.",
    ],
  },
  {
    slug: "ai-story-brainstorming",
    num: 5,
    roman: "V",
    title: "Brainstorming & Idea Development",
    desc: "A sparring partner for ideas — premises, what-ifs, and worlds",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `This is the one place in the whole pipeline where I let AI run loud and messy. A sparring partner that never gets tired, never gets precious, and throws a hundred punches so you can find the two worth keeping.`,
    seoTitle: "AI Story Brainstorming: A Sparring Partner for Ideas | Filmmaker Genius",
    seoDesc: "The sparring-partner method for AI story brainstorming — premise variations, what-ifs, stress-testing your idea, and the volume-then-taste workflow where generating twenty and keeping one is the actual writing. Chapter 5 of AI-Assisted Script Development.",
    body: `<p>Welcome to Core Craft. For four chapters I've been telling you where to keep AI on a leash. Brainstorming is where you let it off — because at the idea stage, nothing is precious yet, nothing is on the page yet, and the failure mode of a bad suggestion is that you ignore it. This is the lowest-risk, highest-energy use of AI in the entire development process, and the method that makes it work is simple: <strong>treat it like a sparring partner, not an oracle.</strong></p>

<p>A sparring partner doesn't tell you what to do. It throws things at you and watches what you do with them. In practice, that looks like sitting down with a half-formed notion — "something about a repo man," "two sisters and a funeral" — and making the machine hit you with premises, what-ifs, and world questions until something makes you sit up. You're not looking for a good idea in its output. You're looking for the output that makes <em>your</em> idea show up. Those are different events, and the second one is the only one that matters.</p>

<h2>Volume, then taste</h2>

<p>Here's the engine underneath all of it: <strong>generate twenty, keep one.</strong> AI's real gift to a brainstorming writer isn't quality — it's volume without fatigue. A human writing partner gets tired around variation seven and starts defending their favorites. The machine will give you twenty premises, then twenty more, with no ego in the game. Most will be mediocre. A few will be bad in instructive ways. And occasionally one contains a live wire — usually not the whole premise, just a phrase, a collision, a corner of it.</p>

<p>The part nobody tells you: <strong>the keeping is the writing.</strong> When you read twenty variations and your gut snags on one, your taste — the accumulated judgment of every film you've loved and every scene that's ever embarrassed you — is doing authorship. The machine supplied noise; you supplied the signal detector. That's why this doesn't compromise your voice the way generated pages do: nothing survives the brainstorm except what your judgment pulled out of the pile.</p>

<p>Here are the exercises I actually run, in the project we set up in Chapter 3:</p>

<ul class="spec-list">
  <li><b>The twenty-premise sweep</b> — give it your seed idea and ask for twenty distinct premises: different genres, different protagonists, different scales. Read fast, mark what snags.</li>
  <li><b>The what-if cascade</b> — take your favorite and ask for fifteen "what if" complications: what if she's lying, what if it's twenty years later, what if the town knows. Escalations, reversals, inversions.</li>
  <li><b>World questions</b> — "Ask me thirty questions about how this world works that I haven't thought about." Answering ten of them in your own head is a morning of real development.</li>
  <li><b>The stress test</b> — make it interrogate the premise like a bored executive: who's the antagonist, why now, why this person and not anyone else? If the premise survives, outline it. If it doesn't, you just saved six months.</li>
  <li><b>The collision drill</b> — feed it two unrelated obsessions of yours and ask for ten stories that need both. Forced marriages of your own material — this one punches above its weight.</li>
</ul>

<div class="pullquote">Generate twenty, keep one. The keeping is the writing — your taste is the author in the room.</div>

<h2>Mine your own life first</h2>

<p>One warning before you fall in love with this workflow. Remember what the machine is: a remix engine. <strong>AI recombines what already exists; it cannot supply what doesn't.</strong> If you start every project from a machine brainstorm, every project starts from the existing pile — other people's movies, reshuffled. The premises will feel familiar because they are, at the molecular level, familiar.</p>

<p>So the discipline is order of operations: <em>your life first, the machine second.</em> Before you open a chat, spend an hour with a notebook on the raw material only you have — the jobs you've worked, the funerals you've sat through, the argument in your family that never resolves, the thing you saw at nineteen you've never told anyone. That material is not in any training set. Bring <strong>that</strong> to the sparring session as the seed, and now the machine is remixing <em>you</em> — stress-testing and complicating something that already has a heartbeat. The difference in the output is not subtle. A premise with your fingerprints plus machine pressure beats a machine premise with your light polish every single time.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>My best brainstorming session ever started with the worst output. I asked for twenty takes on a heist premise and all twenty were dull — but number fourteen put the heist at a wedding, which was wrong, and its wrongness annoyed me into realizing what the story actually was: not a heist at all, but a family that treats every gathering like a job. The machine never had the idea. It irritated the idea out of me. That's the sparring partner working exactly as intended.</p>
</div>

<p>So you've got a premise with a pulse. Next chapter, we turn it into the paperwork that sells it — loglines, synopses, and treatments, and how AI helps you build all three without sanding your voice off them.</p>`,
    takeaways: [
      "Brainstorming is the lowest-risk place to let AI run loud — nothing is on the page yet, so a bad suggestion costs nothing.",
      "Volume then taste: generate twenty, keep one — and the keeping is the authorship.",
      "Stress-test every premise early: who's the antagonist, why now, why this person and not anyone else.",
      "Mine your own life before you open the chat — AI remixes what exists; only you supply what doesn't.",
    ],
  },
  {
    slug: "ai-screenplay-treatment",
    num: 6,
    roman: "VI",
    title: "Loglines, Synopses & Treatments",
    desc: "Loglines, synopses, and the treatment draft that used to take weeks",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `Nobody reads your script first. They read the paperwork — one sentence, one page, then maybe ten. AI is genuinely good at compressing your story into all three lengths. It's genuinely dangerous at the part that makes them sell.`,
    seoTitle: "Screenplay Treatments with AI: Loglines, Synopses & Treatment Drafts | Filmmaker Genius",
    seoDesc: "The paperwork trilogy — logline, synopsis, treatment — with a worked screenplay treatment example, target lengths for each, and how to use AI to compress your outline without sanding your voice off the documents that sell it. Chapter 6 of AI-Assisted Script Development.",
    body: `<p>Here's a truth that took me too long to accept: your screenplay's first three readers never read the screenplay. They read a sentence, and if the sentence works, a page, and if the page works, maybe ten pages of prose. Only then does anyone open the script. I call this the <strong>paperwork trilogy</strong> — logline, synopsis, treatment — and it's the most compression-heavy, least glamorous writing in the business. It's also the development job where AI assistance pays off fastest, because compression is a mechanical skill and machines are good at mechanics. The catch comes at the end, and it's a big one. Hold that thought.</p>

<p>First, know the three documents cold:</p>

<ul class="spec-list">
  <li><b>Logline — one or two sentences (about 25–50 words).</b> Protagonist, want, obstacle, stakes. Its only job is to make someone say "tell me more."</li>
  <li><b>Synopsis — half a page to one page.</b> The whole story including the ending, in clean present-tense prose. Its job is to prove the premise actually becomes a movie.</li>
  <li><b>Treatment — roughly 3 to 10 pages for a feature.</b> The film told as a story: acts, major sequences, key turns, the emotional ride. Its job is to make a reader feel like they watched the movie.</li>
</ul>

<h2>The compression workflow</h2>

<p>The workflow runs on one principle: <strong>your outline is the source; AI is the compressor.</strong> Feed your full outline into the script's project — the one we built in Chapter 3 — and ask for each document at its target length. Ask for five loglines, not one, emphasizing different angles: the relationship, the ticking clock, the irony. Ask for a one-page synopsis, then interrogate it — what did it cut that you consider essential? Its choices about what survives compression are a diagnostic in themselves; when the machine drops a subplot without the story collapsing, that's worth knowing before a producer notices the same thing.</p>

<p>Loglines get a special test I use on every project: <strong>make the AI pitch it back.</strong> Give it your logline cold — in a fresh conversation with no context — and ask: "Based only on this logline, what movie do you imagine? What genre, what tone, what's the poster?" If the machine imagines a different film than yours, so will everyone in the room. That's a fixable problem, and it's much cheaper to fix at the logline stage than in a pitch meeting.</p>

<p>Since this chapter rides on everyone hunting for a screenplay treatment example, here's the structural pattern of a working treatment paragraph — one story beat, told like the movie feels:</p>

<p><em>MAYA, 34, repossesses cars for the bank that repossessed her childhood home — she's good at it, and she hates that she's good at it. When a routine job puts her late father's Impala on her list, sold twice since the foreclosure, she breaks her own first rule: never look in the glove box. Inside is a letter in her father's handwriting, addressed to her, dated the week he died. She doesn't return the car. Now the bank is hunting its own repo agent, and Maya is driving stolen property across three states to find out why her father knew she'd come looking.</em></p>

<p>Look at the mechanics: character introduced with a contradiction, not a résumé. Present tense. A turn inside the paragraph. Concrete images — the glove box, the handwriting — instead of summary phrases like "she discovers a secret." And it ends leaning forward into the next beat. That's a treatment doing its one job: <strong>reading like the movie feels</strong>, not like a book report about it. String fifteen to twenty-five of those paragraphs across three acts and you have a feature treatment.</p>

<div class="pullquote">A treatment isn't a summary of the movie. It's the movie, performed in prose. That performance is the sale.</div>

<h2>The catch: these documents sell voice</h2>

<p>Now the warning I promised. AI will produce a clean draft of all three documents, and the treatment draft will be smooth, professional — and voiceless. Remember Chapter 4: the machine converges on the middle. But here's what makes this trilogy different from a placeholder scene: <strong>a reader takes the paperwork as a sample of your writing.</strong> A logline, a synopsis, a treatment — these are auditions. If the prose is generic, the reader concludes the script is generic, and never opens it to find out they're wrong.</p>

<p>So the rule is absolute: <strong>the AI draft is never the final draft.</strong> Use the machine for structure — what survives compression, what order the beats land in, where the act breaks fall in prose. Then rewrite every sentence in your own hand, the way you'd punch up dialogue: sharper verbs, your rhythm, the specific details only you know. The compression is mechanical and delegable. The performance is not. In my experience the rewrite takes a third of the time writing from scratch would have — the machine did the arithmetic; you do the music.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once sent out an AI-compressed synopsis with maybe ten minutes of polish on it, because I was tired and it read "fine." The note that came back: "Story seems solid — writing feels flat. Is the script like this?" The script was not like this. But I'd made a reader ask the question, and that read was gone forever. Now the paperwork gets rewritten to the same standard as page one of the script — because to a reader, it is page one of the script.</p>
</div>

<p>You've got a premise, and now the paperwork to pitch it. Next chapter we build the load-bearing document underneath all of it — the outline — and how to use AI for structure passes without letting it flatten your story into formula.</p>`,
    takeaways: [
      "The paperwork trilogy: logline (1–2 sentences), synopsis (half to one page), treatment (3–10 pages) — each with one specific job.",
      "Your outline is the source, AI is the compressor — and what it chooses to cut is a diagnostic on your story.",
      "Test loglines by having AI pitch them back cold — if it imagines a different movie, so will the room.",
      "A treatment must read like the movie feels — and because readers treat the paperwork as a writing sample, every AI draft gets rewritten in your voice.",
    ],
  },
  {
    slug: "ai-script-outline",
    num: 7,
    roman: "VII",
    title: "Outlining & Structure Passes",
    desc: "Beat sheets, scene lists, and structure passes with an AI assist",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `A beat sheet the AI wrote for you is worthless — you'll abandon it by page 30 because it was never yours. But an outline the AI helped you interrogate? That's a load-bearing document. Here's the difference, and the workflow.`,
    seoTitle: "AI Script Outlines: Beat Sheets & Structure Passes | Filmmaker Genius",
    seoDesc: "How to build an AI script outline the right way — beat sheets by interrogation, not generation, plus the structure-pass workflow that finds dropped tension and missing midpoints while every decision stays yours. Chapter 7 of AI-Assisted Script Development.",
    body: `<p>Every writer I know has a drawer full of brilliant first acts. The outline is what separates the drawer scripts from the finished ones — and outlining is exactly where the AI temptation is strongest. Type your premise into ChatGPT or Claude, ask for a beat sheet, and thirty seconds later you're holding a perfectly shaped, perfectly hollow structure. It hits every textbook beat. It also belongs to nobody, which is why you'll stall out the moment the drafting gets hard. You can't fight for a story you didn't build.</p>

<p>So here's the rule that governs this whole chapter: <strong>the AI never writes your beats — it interrogates them.</strong> You bring the premise, the characters, and the ugly first stab at structure. The machine's job is to ask you the questions a good development exec would ask, and to hold up a mirror when the outline you wrote isn't the outline you think you wrote.</p>

<h2>Premise to beat sheet: interrogation, not generation</h2>

<p>Start with the premise you sharpened back in the logline chapter, and write your own beat sheet first — twenty to forty beats, one line each, as rough as you like. Then bring the AI in, but flip the usual direction: instead of asking it for answers, ask it to ask <em>you</em> questions. "Here's my premise and my beats. Ask me the ten hardest questions about this story before I draft it." What does she actually want versus what does she need? Why doesn't he just leave in act one? What does the antagonist do while your hero is busy? Answering those questions in your own words builds structure the way generation never will — because every answer is a decision, and the decisions are yours.</p>

<p>Once the beats feel honest, use the AI for the mechanical passes it's genuinely good at: reformat the beat sheet into a numbered scene list, mark where it thinks the act breaks fall, and flag any beat that's an event in the world versus a change in a character. When its read of your act breaks doesn't match yours, don't assume the machine is wrong — assume the page isn't saying what you meant yet. That gap is the single most useful thing an outline pass can show you.</p>

<div class="pullquote">AI flags the problem. You fix it. The moment those two jobs swap, it stops being your script.</div>

<h2>The structure pass</h2>

<p>A structure pass is simple to run and brutal to receive. Paste your full outline into ChatGPT or Claude and ask targeted questions — one at a time, not as a wish list, because you'll get sharper answers when the model is doing one job. These are the questions I run on every outline before I open Final Draft or start a Fountain file:</p>

<ul class="spec-list">
  <li><b>Where does tension drop?</b> Ask it to rank the stretches where a reader's attention would drift, and to say why.</li>
  <li><b>Which scenes are doing the same job?</b> If two scenes deliver the same information or the same emotional turn, one of them is dead weight.</li>
  <li><b>What's missing before the midpoint?</b> Ask what setup the second half depends on that the first half never plants.</li>
  <li><b>Does every scene turn?</b> Have it flag any beat where nothing changes — no new information, no shift in power, no decision.</li>
  <li><b>Where do the acts actually break?</b> Compare its read to your intention; the mismatch is your revision map.</li>
  <li><b>What does the antagonist do off-screen?</b> If the AI can't answer from your outline, neither can an audience.</li>
</ul>

<p>Then comes the part no tool can do: deciding. Treat every answer as a flag, not a verdict. Some flags you'll act on immediately. Some you'll reject — and rejecting a note is a craft act too, because a wrong note usually means your intention isn't legible on the page yet. Either way, <strong>you make the call and you make the fix.</strong> The AI can tell you the second act sags; only you know whether the fix is a new complication, a cut, or a character finally telling the truth.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>On a feature I was rewriting, I ran the "which scenes repeat a job" question on my outline and got an answer that stung: three separate scenes existed to prove the lead didn't trust his brother. I'd have defended each one in a meeting. Seeing them listed together, I cut two, folded the best moment into the third, and the whole first act got faster. The note took thirty seconds to generate. The decision — which two to kill — took me an evening, and that's the correct ratio.</p>
</div>

<p>With a structure that can hold weight, we move to the layer everyone actually notices: next chapter is dialogue — how to use AI as a line-reader without ever letting it become your line-writer.</p>`,
    takeaways: [
      "Write your own beat sheet first — then use AI to interrogate it, never to generate it.",
      "Ask the AI to ask you questions; every answer you write is a structural decision you own.",
      "The structure pass runs one question at a time: dropped tension, repeated jobs, missing setup, scenes that don't turn.",
      "Every AI note is a flag, not a verdict — the diagnosis can be automated, the cure never is.",
    ],
  },
  {
    slug: "ai-dialogue-writing",
    num: 8,
    roman: "VIII",
    title: "Dialogue Passes",
    desc: "AI as line-reader, not line-writer — alternatives, reads, and cuts",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    dek: `Dialogue is where AI is most tempting and most dangerous — generated lines all sound like the same person, and that person isn't in your movie. So we flip the job: the machine reads your lines, and you keep writing them.`,
    seoTitle: "AI Dialogue Writing: Line Reads, Alternatives & Cuts | Filmmaker Genius",
    seoDesc: "AI dialogue writing done right — use the machine as a line-reader, not a line-writer. The alternatives drill, on-the-nose detection, hearing clunk out loud, and the trim pass that makes every scene tighter. Chapter 8 of AI-Assisted Script Development.",
    body: `<p>I can spot AI-generated dialogue from across the room, and so can every actor I've ever handed pages to. It's grammatical, it's balanced, everyone finishes their sentences, and everyone sounds like the same articulate nobody. Real people interrupt, dodge, repeat themselves, and say "fine" when they mean the opposite. That texture comes from you knowing your characters — it does not come out of ChatGPT or Claude, and this chapter is not going to pretend otherwise.</p>

<p>What the machine <em>can</em> be is the most patient line-reader you've ever worked with. It will read your scene two hundred times without sighing. It will tell you which speech nobody can say in one breath, which exchange states its subtext out loud, and which four lines are doing the work of ten. <strong>AI as line-reader, never line-writer.</strong> Hold that line and dialogue passes become the fastest part of your rewrite.</p>

<h2>The alternatives drill and the table read</h2>

<p>Here's the one exception to "never let it write," and it's a controlled burn. When a line is flat and you know it's flat, ask for <strong>ten versions</strong> — angrier, funnier, shorter, more evasive, in the character's voice as you describe it. Then don't use any of them. The ten alternatives aren't candidates; they're a map of the obvious. Once you've seen the ten lines anyone could write, the eleventh — the one you write yourself, after closing the laptop — comes out sharper, because now you know what it has to beat. Writers have done this with trusted readers for a century; the machine just makes it instant.</p>

<p>The second drill is the table read. Paste a scene and ask the AI to read it aloud — most chat tools can voice it now, and even having it walk through the scene line by line in text works. You're listening for clunk: the sentence that trips, the speech that runs three lines past its point, the exchange where two characters politely take turns instead of colliding. Dialogue is written for the ear, and this is the cheapest way to hear yours before an actor does.</p>

<div class="pullquote">Ask for ten versions of the line. Then close the laptop and write the eleventh yourself.</div>

<h2>On-the-nose detection and the trim</h2>

<p>The most valuable dialogue question I've ever put to an AI is this: <em>"For each character in this scene, what are they hiding — and does the dialogue say it out loud?"</em> That's the on-the-nose detector. When the answer comes back "she's hiding her guilt, and in line 14 she says 'I feel so guilty,'" you've found the exact spot where your scene stopped trusting the audience. The fix — a look, a deflection, a subject change — is yours to write. The machine only points.</p>

<p>Then trim. Dialogue survives on what's cut: the entrance line, the exit line, the second half of any speech that made its point in the first half. Run these drills on every dialogue scene before you call a draft done:</p>

<ul class="spec-list">
  <li><b>The alternatives drill</b> — ten AI versions of the weak line, then write the eleventh yourself. The ten define what to beat.</li>
  <li><b>The table read</b> — have the AI read the scene aloud and flag lines that trip, speeches that run long, rhythms that flatten.</li>
  <li><b>The subtext check</b> — "what is each character hiding, and does the dialogue say it out loud?" Every yes is a rewrite target.</li>
  <li><b>The interchangeability test</b> — strip the character names and ask if it can tell who's speaking. If it can't, your voices have merged.</li>
  <li><b>The trim pass</b> — ask which lines can be cut with the meaning intact, then cut more than it suggests.</li>
</ul>

<p>Notice that every drill ends with you making the change in your own draft — in Final Draft, in a Fountain file, wherever you write. Never paste the AI's phrasing back into the script. The point of the pass is that <strong>the voice on the page stays yours</strong>, just tighter.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>We lost most of a morning once because a scene's big speech read beautifully and spoke terribly — the actor kept stalling on a sentence with three clauses stacked like dishes. We rewrote it on the tailgate of a grip truck while the light went. Now I run every talky scene through the table-read drill the week before we shoot, and I've caught that exact kind of clunk sitting at my kitchen table instead of burning golden hour on it.</p>
</div>

<p>Your structure holds and your dialogue snaps. Next chapter we zoom back out and put the whole draft on the table: how to get coverage-grade notes from AI before a single human reads it — and why humans still get the last word.</p>`,
    takeaways: [
      "AI is a line-reader, not a line-writer — generated dialogue all sounds like the same nobody.",
      "The alternatives drill maps the obvious: ten machine versions, then you write the eleventh.",
      "The subtext check — \"what is each character hiding, and does the dialogue say it?\" — is your on-the-nose detector.",
      "Dialogue survives on what's cut; run the trim pass, then cut more than the machine suggests.",
    ],
  },
  {
    slug: "ai-screenplay-coverage",
    num: 9,
    roman: "IX",
    title: "AI Script Coverage & Feedback",
    desc: "Coverage-grade notes on your draft before any human reads it",
    time: "9 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `Coverage used to mean paying a stranger and waiting weeks to learn your second act sags. AI screenplay coverage gets you the sag report tonight — if you know how to ask, how to double-check the machine against itself, and where its notes stop being worth anything.`,
    seoTitle: "AI Screenplay Coverage: Notes Before Any Human Reads It | Filmmaker Genius",
    seoDesc: "AI screenplay coverage explained by a working filmmaker — how to get coverage-grade notes from AI before any human reads your script, the prompt sequence that works, how to triangulate two reads, and what machine coverage will always miss. Chapter 9 of AI-Assisted Script Development.",
    body: `<p>If you've never been through the traditional coverage mill, here's the shape of it. A reader — usually an assistant or a freelancer buried under a stack of scripts — reads yours and produces a report: a logline, a one-page synopsis, comments on premise, structure, character, and dialogue, and a verdict at the bottom that decides your fate in one word — <strong>pass, consider, or recommend</strong>. Paid coverage services sell you the same document. Either way it costs real money, and the turnaround is measured in weeks, which means most writers get one round of professional notes per draft when the draft actually needed five.</p>

<p>AI changes the economics completely. ChatGPT or Claude will produce a coverage-grade read of your script in minutes, for free, as many times as you can stand to hear it. The catch is that a lazy prompt gets you a lazy report — vague praise, hedged criticism, a synopsis that just retells the plot. Getting <em>useful</em> AI screenplay coverage is a technique, and the technique is what this chapter is for.</p>

<h2>Getting coverage-grade notes from a machine</h2>

<p>The single biggest mistake is asking for everything at once. "Give me notes on my script" produces mush. Instead, run the read as a sequence — the same way a good reader's brain actually works through a script. Frame the role first ("you are a script reader preparing a coverage report for a producer; be specific and be honest — a polite pass helps no one"), then work down this ladder, one prompt at a time:</p>

<ul class="spec-list">
  <li><b>1. The reader's report</b> — logline, one-page synopsis, top three strengths, top three weaknesses, and a pass / consider / recommend with reasons.</li>
  <li><b>2. Premise alone</b> — is the central idea distinct, and does the script deliver the promise of that premise?</li>
  <li><b>3. Structure alone</b> — where do the acts break, where does momentum stall, what setup pays off and what doesn't.</li>
  <li><b>4. Character alone</b> — who wants what, who changes, who exists only to serve the plot.</li>
  <li><b>5. Dialogue alone</b> — voice distinction, on-the-nose lines, scenes that run long.</li>
  <li><b>6. Market questions</b> — what films this sits beside, what it would take to produce, who the audience is. Hold these answers loosest of all.</li>
  <li><b>7. The second read</b> — new conversation, different framing, compare. Keep the notes that survive both.</li>
</ul>

<p>That last step is the one most writers skip and the one that matters most: <strong>triangulate.</strong> Run the whole sequence again in a fresh conversation with a different persona — a skeptical studio reader the first time, a champion-hunting indie producer the second. The overlap between the two reports is your real note list. AI reads have a mood; two reads cancel the mood out.</p>

<div class="pullquote">If a note shows up in both reads, it's real. If it only shows up in one, it's an opinion.</div>

<h2>What AI coverage misses — and why humans still get the last word</h2>

<p>Now the honest part. AI coverage is pattern-matching against everything ever written about screenwriting, and that makes it reliably good at spotting structural sag, thin characters, and talky scenes. But it has no <strong>taste</strong> — it can't tell you the difference between a script that's competent and a script that's alive, because aliveness is exactly the thing that deviates from the patterns. It has no read on <strong>market timing</strong> — what buyers are exhausted by this year, what a particular producer just lost money on. And it can't be a <strong>champion</strong>. Scripts don't get made because a report said "recommend"; they get made because a human read it at midnight and couldn't stop thinking about it. No machine will ever walk your script into a room.</p>

<p>So use AI coverage for what it is: the drafts-two-through-five reader, the one who catches everything fixable before you spend your human capital. Your trusted readers, your paid coverage if you buy it, your producer contacts — save them for the draft that's earned them. Their attention is the scarcest resource in your career. AI's whole job here is to make sure you never waste it on a problem a machine could have caught for free.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>I once handed a draft to a producer friend a week before it was ready, because I was excited and impatient. Her notes were kind, accurate, and identical to what an AI coverage pass would have told me for nothing — and I never got her fresh eyes back for the draft that mattered. That mistake is the whole reason this chapter exists. Machines first, humans last. You only get one first read per human.</p>
</div>

<p>Coverage gives you a reader's verdict. Next chapter we go colder and more precise: script analysis by the numbers — scene lengths, ratios, and page-presence — and how to find exactly where the draft sags without sanding off what makes it yours.</p>`,
    takeaways: [
      "Traditional coverage — logline, synopsis, comments, pass/consider/recommend — costs real money and weeks; AI gets you coverage-grade notes tonight.",
      "Run the read as a sequence: reader's report first, then premise, structure, character, dialogue, and market as separate passes.",
      "Triangulate: two reads with different framings, and only the overlapping notes make your fix list.",
      "AI coverage has no taste, no market timing, and can't champion a script — save your human readers for the draft that's earned them.",
    ],
  },
  {
    slug: "ai-screenplay-analysis",
    num: 10,
    roman: "X",
    title: "AI Script Analysis",
    desc: "Beats, pacing, and structure — reading your script by the numbers",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `Coverage tells you how the script feels. Analysis tells you what the script is — scene by scene, page by page, in numbers that don't care about your feelings. Here's the quantitative read, and the one rule that keeps it from flattening your movie.`,
    seoTitle: "AI Screenplay Analysis: Beats, Pacing & Structure by the Numbers | Filmmaker Genius",
    seoDesc: "AI screenplay analysis for working writers — the quantitative read: scene lengths, dialogue-to-action ratio, character page-presence, and where your acts actually break. Analysis tells you where; craft tells you what. Chapter 10 of AI-Assisted Script Development.",
    body: `<p>Every writer carries a mental map of their script, and every writer's map is wrong. You think your first act is lean because you remember it as lean. You think your lead is on every page because she's on every page of your imagination. The draft itself — the actual pages — tells a different story, and until AI came along, seeing that story meant a weekend with index cards and a highlighter. Now you can paste a script into ChatGPT or Claude and get the honest map in minutes. That's AI screenplay analysis: not opinions, measurements.</p>

<p>This is a different tool than the coverage from last chapter, and it's worth keeping them separate in your head. Coverage is a reader's judgment. Analysis is a survey crew — it walks the property and reports the terrain. <strong>Analysis tells you where. Craft tells you what to do about it.</strong> Confuse the two and you end up taking rewrite orders from a measuring tape.</p>

<h2>The script by the numbers</h2>

<p>A clean export helps here — Fountain files are ideal because they're plain text, and a Final Draft export to text works fine too. Then ask for the quantitative read. These are the measurements that have actually changed my drafts:</p>

<ul class="spec-list">
  <li><b>Scene lengths</b> — every scene, longest to shortest. Three five-page scenes in a row is a pacing fact, whatever the writing quality.</li>
  <li><b>Dialogue-to-action ratio</b> — overall and scene by scene. Watch for the stretch where the movie quietly becomes a radio play.</li>
  <li><b>Character page-presence</b> — first appearance, last appearance, and the longest gap for each principal. Vanishing acts hide here.</li>
  <li><b>Actual act breaks vs. intended ones</b> — ask where the story turns on the page, then compare to where you meant it to turn.</li>
  <li><b>Scene-purpose tagging</b> — have it label each scene: advances plot, reveals character, both, or neither. The "neither" list is your cut list's first draft.</li>
  <li><b>Location and time-of-day spread</b> — a bonus for your producer brain: repetition here is a budget note as much as a story note.</li>
</ul>

<p>The single most revealing item on that list is the act-break comparison. When the AI reads your act two as starting eight pages after you think it starts, that's not a machine error — that's eight pages where your protagonist has decided something in your head but not on the page. I've never run that comparison on a draft, mine or anyone's, without learning something uncomfortable.</p>

<div class="pullquote">Analysis tells you where. Craft tells you what. Never let the measuring tape hold the pen.</div>

<h2>Finding the sag — and leaving the good weirdness alone</h2>

<p>Where do the numbers point? Act two. It's always act two. The sag shows up in the data before you'd ever admit it in a read: scene lengths creep up, the dialogue ratio climbs, the antagonist's page-presence drops off a cliff, and somewhere around the middle you find a run of scenes tagged "reveals character" with nothing tagged "advances plot" for ten pages. That cluster of symptoms is the sag, located with an accuracy no gut-read can match. What the numbers <em>can't</em> tell you is the cure — whether those ten pages need a complication, a compression, or a scene where somebody finally does the thing they've been avoiding. That decision is the job. It's your job. The analysis just tells you which pages to have the argument about.</p>

<p>And one warning, because this is where quantitative thinking turns toxic: <strong>do not sand off intentional irregularity.</strong> Some of the best scripts ever written have a seven-page dialogue scene sitting dead center, or a first act that's all texture, or a lead who disappears for twenty pages so their absence can do the work. If an "anomaly" in your numbers is a choice — if you can say out loud what it's doing for the story — keep it and defend it. Analysis serves the story, not the average. A script that measures perfectly normal is usually a script nobody remembers.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>A director I was cutting for swore his thriller's midsection was tight — he'd rewritten it four times and could recite it. We ran the page-presence numbers and his villain was absent for a huge stretch of the second act. Not underused. Absent. Four human passes had missed it because every individual scene read fine; the pattern only existed across thirty pages. One new villain scene, placed where the gap was widest, and the whole back half started ticking. The numbers found in five minutes what four rewrites couldn't.</p>
</div>

<p>You now have judgment (coverage) and measurement (analysis). Next chapter we bolt everything together into the engine that actually produces finished screenplays: the rewrite loop — draft to notes to passes and around again, on a stack that costs nothing.</p>`,
    takeaways: [
      "Analysis is measurement, not judgment — scene lengths, dialogue ratio, page-presence, and where the acts actually break.",
      "The act-break comparison — where you think it turns vs. where the page says it turns — is the highest-value question you can ask.",
      "The act-two sag shows up in the numbers before you'll admit it in a read; the numbers locate it, your craft cures it.",
      "Never sand off intentional irregularity — analysis serves the story, not the average.",
    ],
  },
  {
    slug: "ai-script-writing-free",
    num: 11,
    roman: "XI",
    title: "The Rewrite Loop",
    desc: "A free-tools workflow from notes to next draft, on repeat",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `Everything this course has taught you snaps together into one repeatable engine: you draft, the machine reads, you decide, you rewrite, you go again. It runs entirely on free tools — the only thing it costs is attention.`,
    seoTitle: "Free AI Script Writing Workflow: The Rewrite Loop | Filmmaker Genius",
    seoDesc: "A complete free AI script writing workflow — the rewrite loop: you draft, AI gives coverage, you sort the notes, run structure and dialogue passes, and go again. Version discipline, exit signals, and a stack that costs nothing but attention. Chapter 11 of AI-Assisted Script Development.",
    body: `<p>Screenplays aren't written; they're rewritten. Every writer has heard that line, and most of us nod along while secretly hoping our first draft is the exception. It never is. What separates working writers from aspiring ones isn't talent at drafting — it's stamina at rewriting, and stamina is exactly what the old process punished. One round of real notes per draft, weeks between them, momentum dead on arrival. The loop in this chapter fixes that. It's every technique from this course arranged into a cycle you can run in a week, on free tiers, alone at your desk.</p>

<p>Here's the whole system. Notice who does the writing at every single step — that part never changes:</p>

<ul class="spec-list">
  <li><b>1. Draft</b> — you, alone, no AI in the room. Fast and ugly is fine; the loop feeds on finished drafts, not perfect ones.</li>
  <li><b>2. AI coverage</b> — run the full coverage sequence from Chapter 9, both framings, and keep only the overlapping notes.</li>
  <li><b>3. Sort the notes</b> — three piles: <b>agree</b> (fix it), <b>disagree</b> (write one sentence saying why, then drop it), <b>test</b> (not sure — probe it with follow-up questions before deciding).</li>
  <li><b>4. Structure pass</b> — the Chapter 7 questions: dropped tension, repeated jobs, missing setup, scenes that don't turn.</li>
  <li><b>5. Dialogue pass</b> — the Chapter 8 drills: table read, subtext check, trim. Your phrasing only, never pasted from the machine.</li>
  <li><b>6. Save as a new dated draft — and go again</b> — back to step 2 with fresh pages.</li>
</ul>

<h2>Version discipline: the boring habit that saves scripts</h2>

<p>The loop generates drafts fast, and that speed will destroy your script if you're sloppy with versions. Two rules, non-negotiable. <strong>Never overwrite. Date everything.</strong> Every trip around the loop ends with a save-as — a filename with the date and a pass number on it — and the old draft stays exactly where it was, untouched. This isn't just tidiness. Rewriting with AI notes in your ear, you will sometimes take a wrong turn: flatten a scene that was working, fix a "problem" that was actually the movie. When that happens — and it will — the previous draft is your undo button. I keep a folder per project, drafts stacked chronologically, and I've reached back two versions to rescue a scene more times than I can count. Whether you work in Final Draft or plain Fountain files, the discipline is identical: the loop moves forward, the archive never moves at all. As a bonus, that dated stack is proof of your process — a complete record showing your hands on every draft, which matters more every year.</p>

<div class="pullquote">When the notes start contradicting each other, the draft isn't broken. It's done. Time for humans.</div>

<h2>Knowing when to get out</h2>

<p>Every loop needs an exit, and this one announces itself if you're listening. Early rounds, the notes converge — coverage, structure, and dialogue passes all point at the same broken things, and every fix visibly tightens the script. Then, somewhere around the fourth or fifth trip, the signal changes: this round says the opening is slow, last round said it was rushed; one pass wants more of a character the previous pass wanted cut. <strong>Contradiction is the finish line.</strong> It means the draft no longer has objective problems a pattern-reader can find — only choices, and choices are beyond the machine's jurisdiction. Looping past that point doesn't polish the script; it erodes it, sanding your voice toward the average one nudge at a time. Stop. Export the PDF. Send it to the human readers you've been saving since Chapter 9 — this is the draft that's earned them.</p>

<p>And take a second to notice what you just did. ChatGPT or Claude on the free tier, Fountain files that cost nothing, or the Final Draft you already own — a development process that used to require money and gatekeepers, run from a kitchen table. A free stack costs nothing but attention. Attention is the one thing you were always going to have to pay anyway.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The first script I ran through this loop had been "almost done" for two years — which meant I reread it every few months, winced, and put it away. Six weeks of loop passes, one round per week after shooting days, and it was genuinely finished: not perfect, done. The difference wasn't that the notes were brilliant. It's that they were <em>there</em> — every week, on demand, for free — so the rewrite never got the chance to stall. Momentum, it turns out, was the thing I'd been paying for all along.</p>
</div>

<p>You now have the complete engine. One chapter left — and it's the one that looks up from the desk: what all of this means for your career, your credits, and the future of the people who write movies.</p>`,
    takeaways: [
      "The loop: you draft → AI coverage → sort notes into agree/disagree/test → structure pass → dialogue pass → new dated draft → repeat.",
      "Version discipline is non-negotiable: never overwrite, date every draft — the archive is your undo button and your proof of process.",
      "Exit when the notes start contradicting each other — that's the sign the draft is done and ready for human readers.",
      "The whole engine runs on free tiers and plain text — a free stack costs nothing but attention.",
    ],
  },
  {
    slug: "ai-in-screenwriting",
    num: 12,
    roman: "XII",
    title: "The Writer's Future with AI",
    desc: "AI in screenwriting's future — disclosure, credits, and your career",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    dek: `Last chapter. Time to look up from the desk and answer the questions everyone in this business is quietly asking: what happens to writers now, what do you tell contests and producers, and what actually wins from here.`,
    seoTitle: "AI in Screenwriting: The Writer's Future | Filmmaker Genius",
    seoDesc: "AI in screenwriting, honestly assessed — what the flood of competent-generic scripts means for your voice, where disclosure norms are settling with contests and producers, the credit question, and why finished human drafts are the whole game. The final chapter of AI-Assisted Script Development.",
    body: `<p>Every conversation I have about AI in screenwriting eventually arrives at the same nervous question, asked in a lowered voice like it's a diagnosis: <em>"So... are we done?"</em> Writers asked it about talkies, about television, about the spec-market crash. And I understand the fear this time feels different — the machine appears to do the actual thing, the writing. But you've just spent eleven chapters learning exactly what it does and doesn't do, so you already know the honest answer: the machine produces competent text on demand, and <strong>competent has never once been the job.</strong> The job is making someone feel something they didn't expect, in a way only you would have thought to do it.</p>

<p>Here's what the flood actually changes. The number of finished, formatted, structurally sound screenplays in circulation is going up — way up — because the floor just rose. Anyone can now produce a script that <em>reads</em> professional. Which means the readers, producers, and contest judges wading through that flood are developing a new allergy: they can smell generic faster than ever, because they see it all day. A script that sounds like everything else is now invisible. A script that could only have come from one specific human is the rarest thing on the pile. <strong>The flood of competent-generic raises the price of a distinct voice.</strong> Everything this course taught you — AI flags, you fix; the machine reads, you write — was engineered to protect exactly that asset.</p>

<h2>Disclosure, credit, and telling the truth</h2>

<p>The practical questions, plainly. Contests and fellowships increasingly ask whether AI was used in your submission, and producers are starting to ask during development. The norm is still settling, but it's settling somewhere sensible: <strong>assistance is fine; generation gets disclosed.</strong> Using AI the way this course teaches — coverage, analysis, interrogation, line-reading — is the same category as getting notes from a trusted reader, and nobody has ever disclosed their smart friend. Submitting machine-generated pages as your own writing is a different act entirely, and the writers who blur that line are borrowing against a reputation they'll need later. When anyone asks, answer honestly and specifically. "I wrote every word; I used AI for feedback and analysis" is a strong, true answer — and your dated draft archive from last chapter backs it up.</p>

<p>On credit: the writers' union fought hard on this ground, and the broad shape of what it won matters even if you're not a member yet. In general terms — AI can't be credited as a writer, AI-generated material can't be used to undercut a writer's credit or compensation, and a writer can't be forced to use it. The details will keep evolving, but the principle underneath them is the one to internalize for your own career, union or not: <strong>authorship belongs to humans.</strong> Run your own writing life by that rule and every disclosure form becomes easy to fill out.</p>

<div class="pullquote">The writers who win won't be the ones who used AI or the ones who refused it. They'll be the ones who finished.</div>

<h2>The long game: more swings</h2>

<p>So where does that leave you, specifically? Here's the working writer's code for the next decade, as best I can see it from here:</p>

<ul class="spec-list">
  <li><b>Write every word yourself</b> — the machine reads, interrogates, and measures; it never drafts your pages.</li>
  <li><b>Disclose honestly when asked</b> — assistance is nothing to hide, and generation is nothing to hide behind.</li>
  <li><b>Keep your dated drafts</b> — your archive is your provenance, proof of a human hand on every version.</li>
  <li><b>Use the loop to finish more</b> — the real gift of these tools is velocity: more drafts done, more scripts out the door.</li>
  <li><b>Protect the weird</b> — the irregular, personal, unaverage choices are the only part of your work that can't be flooded.</li>
</ul>

<p>And that fourth item is the whole ballgame, so let me land on it. Careers in this business have always been won on at-bats. The writer with four finished, rewritten scripts gets more chances than the writer with one eternal almost-done draft — more contests entered, more queries sent, more scripts to hand over when someone finally says "what else you got?" What AI genuinely changes is the cost of a swing. The rewrite loop turns a years-long polish into a season's work, which means the same career now holds two or three times the at-bats it used to. <strong>Output of finished, rewritten, human scripts is the entire game</strong> — and you now own a machine shop for finishing them.</p>

<div class="callout">
  <div class="callout-label">◆ From the set</div>
  <p>The best writer I know isn't the most talented one I know — she's the one with a drawer that has no unfinished scripts in it. Everything gets done, gets rewritten, goes out. When a director I was shooting with lost his project's script two months before a window closed, she had something ready and right. That's the whole career mechanism, witnessed firsthand: the finished script in the drawer beats the brilliant one in your head, every single time. AI just made her faster. It made the drawer deeper. It didn't write a word of it.</p>
</div>

<p>That's the course. You came in asking whether AI can write your screenplay, and you're leaving with the real answer: it can't — but it can read, interrogate, measure, and pressure-test your writing until the script is the best version of the thing only you could make. The voice stays yours. Now go finish something.</p>`,
    takeaways: [
      "The flood of competent-generic scripts makes a distinct human voice more valuable, not less — protect the weird.",
      "Disclosure norms are settling toward \"assistance fine, generation disclosed\" — answer honestly and specifically, always.",
      "The union line, in broad strokes: AI can't be credited as a writer and can't undercut a writer's credit or pay — authorship belongs to humans.",
      "Careers are won on at-bats: use AI to finish more drafts and take more swings — finished, rewritten, human scripts are the whole game.",
    ],
  },
];

export const aiScript: Course = {
  slug: "ai-script-writing",
  title: "AI-Assisted Script Development",
  categoryLabel: "AI & Technology",
  subtitle: "AI can't write your screenplay — but used right, it can make yours better, faster. A working filmmaker's honest system for AI in development: brainstorming, treatments, dialogue passes, coverage, and analysis, with your voice doing the writing.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~100 min read",
  pairsWithName: "Scene Analysis",
  pairsWithUrl: "https://filmmakergenius.com/scene-analysis",
  pairsWithDesc: "Everything Module 3 teaches, built into one tool — Scene Analysis reads your script and returns beat-by-beat structure, character, and pacing notes. Coverage-grade feedback on your draft, in minutes.",
  seoTitle: "AI Script Writing: Develop Your Screenplay with AI (Free Course) | Filmmaker Genius",
  seoDesc: "AI script writing done right — a working filmmaker's 12-chapter course on using AI for story development, treatments, coverage, and script analysis without flattening your voice. ChatGPT workflows, generators, and the rules that keep the pages yours.",
  learn: [
    "Use AI for brainstorming, treatments, and outlines — without losing your voice",
    "Build a real ChatGPT screenwriting setup — prompts, projects, and guardrails",
    "Get coverage-grade feedback and script analysis from AI before humans see it",
    "Know the ownership, WGA, and disclosure rules that keep the pages yours",
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
  chapters,
};

export default aiScript;
