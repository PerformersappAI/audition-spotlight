import type { Course } from "../courseTypes";

export const rewrite: Course = {
  slug: "how-to-rewrite-a-screenplay",
  title: "The Rewrite: Developing Through Drafts",
  categoryLabel: "Development & Writing",
  subtitle: `"Writing is rewriting." Your first draft was just you telling yourself the story — now the real work begins. Gain distance, diagnose what's broken, rebuild structure and character, cut your darlings, and take it all the way to a finished script. Written from the set by a working filmmaker.`,
  level: "Intermediate",
  chapterCount: "12 Chapters",
  readTime: "~110 min read",
  pairsWithName: "Table Read",
  pairsWithUrl: "https://filmmakergenius.com/table-read",
  pairsWithDesc: `Hear your script out loud without gathering a cast. The Table Read tool gives your pages voices so you can catch clunky dialogue, dead scenes, and pacing problems the eye skips right over — the fastest way to find what a rewrite needs to fix.`,
  seoTitle: "How to Rewrite a Screenplay: The Rewrite Course (Free) | Filmmaker Genius",
  seoDesc: "A free, chapter-by-chapter course on rewriting a screenplay — gaining distance, diagnosing story problems, structural and character passes, cutting darlings, table reads, and knowing when your script is done.",
  learn: [
    "How to gain distance and read your own script like a stranger would",
    "How to diagnose story problems and get past the \"something's off\" feeling",
    "How to run focused passes — structure, character, scene, dialogue — instead of flailing",
    "How to use feedback and table reads, and how to know when a script is finally done",
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
    { key: "apply", label: "Module 3 — Polish & Delivery" },
  ],
  chapters: [
    {
      slug: "writing-a-second-draft",
      num: 1,
      roman: "I",
      title: "The First Draft Is Just the Start",
      desc: "Why the first draft is just you telling yourself the story",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Finishing a first draft feels like the end. It isn't — it's the starting line. Understanding why is the mindset shift that separates writers who finish scripts from writers who finish <em>good</em> ones.`,
      seoTitle: "Writing a Second Draft: The First Draft Is Just the Start | Filmmaker Genius",
      seoDesc: "Why the first draft is just the beginning and how to approach writing a second draft of a screenplay — the mindset shift from creating to rewriting, and why writing is really rewriting. Chapter 1 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>Typing FADE OUT on a first draft is one of the great feelings in a writer's life — and one of the most misleading. Because here's the secret every working screenwriter knows and every beginner has to learn the hard way: <strong>the first draft isn't the movie. It's the raw material for the movie.</strong> The old saying "writing is rewriting" isn't a motivational poster; it's a literal description of the job. First drafts are supposed to be flawed. Your job now isn't to have written a great script — it's to <em>rewrite</em> your way to one. This whole course is about how.</p>

    <h2>What a first draft really is</h2>

    <p>A useful way to think about it, borrowed from novelists: <em>the first draft is just you telling yourself the story.</em> You're discovering what happens, who these people are, and what the thing is even about. That process is messy by nature — you can't outrun clunky dialogue, saggy middles, and half-formed characters while you're still figuring out the story itself. The <em>second</em> draft, and every one after, is where you tell the story to the <em>audience</em> — shaped, sharpened, and built to land.</p>

    <ul class="spec-list">
      <li><b>Draft one is for you.</b> Get the story down, discover it, finish it. Done beats perfect.</li>
      <li><b>Draft two is for the story.</b> Fix what's broken structurally and dramatically now that you can see the whole shape.</li>
      <li><b>Later drafts are for the audience.</b> Polish, sharpen, and refine so it plays for someone who isn't in your head.</li>
    </ul>

    <p>Knowing this frees you. You don't have to be ashamed of a rough first draft — a rough first draft is a <em>completed</em> first draft, which puts you ahead of almost everyone. The magic was never going to happen on draft one. It happens now.</p>

    <div class="pullquote">The first draft is you telling yourself the story. Every draft after is you telling it to the audience. Rewriting is the bridge between the two.</div>

    <h2>The mindset shift: from creator to editor</h2>

    <p>Rewriting uses a different part of your brain than drafting. Drafting is generative, intuitive, forward-charging — you silence the critic and create. Rewriting is analytical, ruthless, and cool-headed — you <em>become</em> the critic. The single biggest reason rewrites go wrong is that writers try to do both at once, or never switch modes at all: they tinker endlessly with word choice while a giant structural crack goes unfixed, or they defend every choice they made instead of judging it honestly. To rewrite well, you have to take off the creator's hat and put on the editor's.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The hardest lesson of my writing life was learning to <em>love</em> the rewrite instead of dreading it. For years I treated draft one like a delivery and the notes like an insult. Then a mentor told me: "Nobody writes a good script. They rewrite a bad one into a good one." It changed everything. Now the finished first draft is the moment I get <em>excited</em> — because the story exists, and I finally have something to sculpt. The clay is on the table. This course is how you sculpt it.</p>
    </div>

    <p>Before you can fix a draft, though, you have to be able to <em>see</em> it clearly — and right after finishing, you can't. You're too close, too in love, too sick of it. The next chapter is about gaining the distance to read your own work like a stranger would. That's where the real rewrite begins.</p>
`,
      takeaways: [
        "The first draft is raw material, not the finished movie — \"writing is rewriting\" is literal.",
        "Draft one is you telling yourself the story; later drafts tell it to the audience.",
        "A rough finished draft is a win — the magic was always going to happen in the rewrite.",
        "Rewriting means switching from creator mode to editor mode — analytical, honest, and ruthless.",
      ],
    },
    {
      slug: "how-to-edit-your-own-screenplay",
      num: 2,
      roman: "II",
      title: "Reading Your Own Work",
      desc: "Gaining distance and reading your own pages like a stranger",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `You can't fix what you can't see — and right after finishing, you can't see your script at all. This chapter is about how to edit your own screenplay by gaining the distance to read it like a stranger.`,
      seoTitle: "How to Edit Your Own Screenplay: Reading With Distance | Filmmaker Genius",
      seoDesc: "How to edit your own screenplay — gaining distance, reading your own pages like a stranger, the full-read pass, and the tricks that let you see your script objectively. Chapter 2 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>The hardest thing about editing your own script is that you already know it too well. You remember what you <em>meant</em>, so you read that meaning onto the page even when the words don't earn it. You know the character's whole backstory, so a flat scene feels rich to you. You've read the opening forty times, so you can't tell if it grabs a stranger. The single most important skill in self-editing isn't a technique — it's <strong>distance</strong>: the ability to step outside your own head and read the script as it actually is, not as you imagine it.</p>

    <h2>Put it in a drawer</h2>

    <p>The oldest trick in the book is the best one: <em>finish the draft, then don't look at it.</em> Give it time — a couple of weeks if you can, longer if you can afford it. The gap lets the memory of what you <em>intended</em> fade, so that when you come back, you read what you actually <em>wrote.</em> Scenes you were sure were brilliant will suddenly look thin; problems you couldn't see will jump off the page. That distance is worth more than any notes app. If you're on a deadline and can't wait weeks, even a few days and a hard mental reset helps.</p>

    <div class="pullquote">You wrote the script from the inside. You have to rewrite it from the outside. Distance is how you get from one to the other.</div>

    <h2>Read it like a reader, not a writer</h2>

    <p>When you return, do a <strong>full read in one sitting</strong> — no stopping to fix things. This is crucial. If you start tinkering with dialogue on page 3, you'll never experience the script the way an audience does, and you'll miss the big-picture problems that only reveal themselves in the flow. Read it start to finish like you would a stranger's script, and just <em>notice.</em> Where did you get bored? Where were you confused? Where did your attention drift? Mark those moments lightly and keep going. The goal of this first read is diagnosis, not surgery.</p>

    <ul class="spec-list">
      <li><b>Read the whole thing straight through.</b> Resist all urge to edit as you go.</li>
      <li><b>Track your own attention.</b> Boredom and confusion are data — the exact spots that need work.</li>
      <li><b>Note the feeling, not the fix.</b> "Sags here," "lost me," "don't care yet." You'll solve them later.</li>
      <li><b>Watch for the gap.</b> Where does what's <em>on the page</em> differ from what's <em>in your head?</em> That gap is your rewrite.</li>
    </ul>

    <h2>Tricks to see it fresh</h2>

    <p>Beyond time, there are ways to jolt yourself into seeing the script anew — to break the familiarity that hides its flaws:</p>

    <ul class="spec-list">
      <li><b>Change the format.</b> Read it on paper instead of screen, or change the font. A different look makes your brain read more carefully.</li>
      <li><b>Read it out loud.</b> Your ear catches clunky dialogue and dead rhythm your eye skips right over. (More on this with table reads later.)</li>
      <li><b>Read specific passes.</b> Later you'll read once just for one character, once just for structure — but the first read is the whole thing, whole.</li>
      <li><b>Imagine it's someone else's.</b> Pretend a stranger sent you this script for notes. You'd be honest with them; be that honest with yourself.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I keep a "finished" folder and a rule: nothing comes out of it for two weeks, minimum. During that time I deliberately start something else so my brain lets go. When I finally reopen a script, I read it on my phone, in a coffee shop, like it's a stranger's — and it's almost embarrassing how differently it reads. Lines I'd have defended to the death two weeks ago now make me wince. That wince is gold. It's my own objectivity finally showing up, and it only ever arrives with distance.</p>
    </div>

    <p>Now you can see the script clearly. But "this scene sags" or "I got bored" isn't yet something you can fix — it's a symptom. The next chapter is about diagnosis: turning that vague "something's off" into a specific, nameable story problem you can actually solve.</p>
`,
      takeaways: [
        "The hardest part of self-editing is distance — you read your intentions onto the page instead of the words.",
        "Put the draft away for a couple of weeks so the memory of what you meant fades.",
        "Do a full read in one sitting without fixing anything — track where you get bored, confused, or lost.",
        "Jolt yourself into fresh eyes: change the format, read aloud, and pretend it's a stranger's script.",
      ],
    },
    {
      slug: "screenplay-story-problems",
      num: 3,
      roman: "III",
      title: "Diagnosing Story Problems",
      desc: "Turning \"something's off\" into a specific, fixable diagnosis",
      time: "10 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `"Something's off, but I don't know what." Every rewrite starts here. The skill that separates a productive rewrite from months of flailing is diagnosis — turning a vague feeling into a specific, fixable problem.`,
      seoTitle: "Diagnosing Screenplay Story Problems | Filmmaker Genius",
      seoDesc: "How to diagnose screenplay story problems — turning a vague 'something's off' into a specific, fixable diagnosis. Symptoms vs. root causes, the usual suspects, and how to find what's really broken. Chapter 3 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>In the last chapter you did a full read and marked where the script lost you. Now comes the crucial move that most writers skip: figuring out <em>why.</em> The great danger of rewriting is treating symptoms instead of causes — endlessly polishing dialogue in a scene that's boring because the <em>story</em> underneath it has no tension. You can rewrite that scene fifty times and it'll still be dead, because the problem was never the scene. <strong>Diagnosis</strong> is the art of tracing a symptom back to its root, so you fix the actual disease instead of rearranging its symptoms.</p>

    <h2>Symptoms vs. root causes</h2>

    <p>Think like a doctor. The place where you got bored is a <em>symptom</em>, not the diagnosis. The real problem is almost always upstream of where you feel it. A saggy middle is usually caused by a weak central conflict established in act one. A climax that doesn't land is usually caused by stakes that were never raised high enough earlier. Learn to ask, every time you feel a problem: <em>"What earlier choice is causing this?"</em></p>

    <div class="diag-box">
      <div class="diag-head"><span>The symptom you feel</span><span></span><span>The root cause to check</span></div>
      <div class="diag-row"><div class="diag-sym">"The middle drags."</div><div class="diag-arrow">→</div><div class="diag-cause">Weak central conflict or an unclear goal — nothing is driving the hero forward.</div></div>
      <div class="diag-row"><div class="diag-sym">"I don't care about the hero."</div><div class="diag-arrow">→</div><div class="diag-cause">No clear want, no stakes, or we never saw a reason to root for them.</div></div>
      <div class="diag-row"><div class="diag-sym">"The ending falls flat."</div><div class="diag-arrow">→</div><div class="diag-cause">Stakes never escalated, or the hero doesn't drive the climax through their own choice.</div></div>
      <div class="diag-row"><div class="diag-sym">"A scene feels boring."</div><div class="diag-arrow">→</div><div class="diag-cause">No conflict or change in the scene — nobody wants anything, nothing shifts.</div></div>
      <div class="diag-row"><div class="diag-sym">"It feels predictable."</div><div class="diag-arrow">→</div><div class="diag-cause">Characters take the obvious path; no reversals, no hard choices, no surprise.</div></div>
      <div class="diag-row"><div class="diag-sym">"The dialogue is flat."</div><div class="diag-arrow">→</div><div class="diag-cause">Often not a dialogue problem — the <em>scene</em> has no tension for dialogue to express.</div></div>
    </div>

    <p>Notice how many "small" symptoms trace back to a few big causes: unclear goals, missing stakes, no escalation, scenes without conflict. Fix the cause and a dozen symptoms clear up at once.</p>

    <div class="pullquote">Amateurs rewrite the scene where they got bored. Professionals rewrite the earlier choice that made that scene boring. Treat the disease, not the symptom.</div>

    <h2>The usual suspects</h2>

    <p>Most story problems fall into a handful of categories. When something's off, interrogate these first:</p>

    <ul class="spec-list">
      <li><b>Goal &amp; motivation.</b> Is it crystal clear what the protagonist wants and why? Vague goals make everything downstream mushy.</li>
      <li><b>Conflict &amp; stakes.</b> Is something real on the line, and does it escalate? Low or flat stakes are the number-one cause of boredom.</li>
      <li><b>Structure &amp; pacing.</b> Do the acts turn at the right places? Does the story keep moving, or stall?</li>
      <li><b>Character.</b> Do they feel real, want something, and change? Are their choices driving the plot, or are they passive passengers?</li>
      <li><b>Clarity.</b> Is the audience ever confused about who, what, or why? Confusion kills engagement instantly.</li>
      <li><b>Theme &amp; point.</b> Does the story add up to something? Is it about anything beneath the plot?</li>
    </ul>

    <h2>Make a rewrite plan, not a to-do list</h2>

    <p>Once you've diagnosed the real problems, resist the urge to open the script and start fiddling. Instead, write them down as a <em>prioritized plan</em> — biggest, most structural problems first, cosmetic ones last. There's an order to a good rewrite (it's the whole shape of this course): fix the bones before the skin. If you polish dialogue in act two before you've solved the act-two structure, you'll just have to throw that polished dialogue away when the scene gets cut. Diagnose everything first, prioritize, <em>then</em> rewrite.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My rule when a scene feels wrong: I don't touch that scene first. I go looking <em>upstream.</em> Nine times out of ten the boring scene on page 55 is boring because of a decision I made on page 15 — the hero's goal is fuzzy, or I never put anything real at stake. I fix page 15, and page 55 comes alive without my ever rewriting it. Early in my career I'd sand the same scene for days and wonder why it never improved. It never improved because I was treating a symptom. Learn to look upstream and you'll save yourself months.</p>
    </div>

    <p>You can now name what's actually broken and in what order to fix it — but the sharpest diagnosis of all often comes from someone <em>else's</em> eyes. The next chapter is about getting feedback, and reading notes without either ignoring them or blindly obeying them.</p>
`,
      takeaways: [
        "Rewriting well starts with diagnosis — turn \"something's off\" into a specific, nameable problem.",
        "The spot where you feel a problem is a symptom; the root cause is almost always upstream.",
        "Check the usual suspects first: goal/motivation, conflict/stakes, structure, character, clarity, and theme.",
        "Diagnose everything and prioritize before you rewrite — fix the bones before the skin.",
      ],
    },
    {
      slug: "how-to-get-feedback-on-a-screenplay",
      num: 4,
      roman: "IV",
      title: "Getting & Reading Feedback",
      desc: "Getting notes and reading them without losing your mind",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Other people can see what you can't. But notes are dangerous too — follow the wrong ones and you'll rewrite a good script into a worse one. Here's how to get useful feedback and read it wisely.`,
      seoTitle: "How to Get Feedback on a Screenplay (and Read Notes) | Filmmaker Genius",
      seoDesc: "How to get feedback on a screenplay and read script notes — who to ask, what to ask them, the golden rule of interpreting notes, and how to tell a real problem from a bad solution. Chapter 4 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>No matter how well you learn to read your own work, you will always have blind spots — the whole point of distance is that you can never fully get outside your own head. That's why feedback is essential: a fresh reader experiences your script the way an audience will, and can feel problems you've gone numb to. But feedback is a double-edged tool. Good notes, well interpreted, can transform a script. Bad notes, blindly followed, can wreck one. Learning <strong>how to get feedback on a screenplay</strong> — and, just as importantly, how to <em>read</em> that feedback — is a skill in itself.</p>

    <h2>Who to ask (and who not to)</h2>

    <p>Not all readers are equal. The best feedback comes from people who can be honest and have some sense of story.</p>

    <ul class="spec-list">
      <li><b>Trusted, honest readers.</b> You need people who'll tell you the truth, not just praise you. A friend who loves everything you write is worthless as a note-giver.</li>
      <li><b>A few readers, not a mob.</b> Three or four thoughtful readers beat twenty. Too many voices create noise and contradiction.</li>
      <li><b>Some who know story, some who don't.</b> Writers and filmmakers catch craft issues; "civilian" readers tell you honestly where they got bored or confused — which is gold.</li>
      <li><b>Not your mom.</b> Unless your mom is brutally honest, love makes a bad critic. Choose readers who can separate you from the work.</li>
    </ul>

    <h2>Ask the right questions</h2>

    <p>Vague requests get vague notes. "What did you think?" invites "It was good!" Instead, direct your readers toward useful, specific reactions:</p>

    <ul class="spec-list">
      <li><b>Where did you get bored or check out?</b> The single most valuable question you can ask.</li>
      <li><b>Where were you confused?</b> Confusion is a clear, fixable signal.</li>
      <li><b>Who did you care about — and when did you start?</b> Tells you if your hero is landing.</li>
      <li><b>What did you think it was about?</b> Reveals whether your theme is coming through.</li>
      <li><b>What do you remember a day later?</b> What sticks is what's working; what evaporates may not be earning its place.</li>
    </ul>

    <div class="pullquote">When people tell you something is wrong, they are almost always right. When they tell you how to fix it, they are almost always wrong.</div>

    <h2>The golden rule of notes</h2>

    <p>That pullquote — a famous piece of Hollywood wisdom, often attributed to Neil Gaiman — is the single most important thing to understand about feedback. Readers are <em>excellent</em> at telling you <em>where</em> something isn't working (the symptom) and <em>terrible</em> at telling you how to fix it (the cure). So separate the two. When a note says "I think you should give the villain a dog to make him likable," don't argue about the dog — ask <em>what problem the dog is trying to solve.</em> Usually the reader felt the villain was flat or one-note. <em>That's</em> the real note. The dog is just their guess at a fix, and your fix will probably be better. Trust the diagnosis, distrust the prescription.</p>

    <h2>Look for patterns, then decide</h2>

    <p>You are still the author. Feedback informs your rewrite; it doesn't dictate it. The way to use notes wisely:</p>

    <ul class="spec-list">
      <li><b>Hunt for consensus.</b> If one person trips on something, maybe it's them. If three people trip on the same spot, it's the script. Patterns are truth.</li>
      <li><b>Translate every note into a problem.</b> Ignore the suggested fixes; write down the underlying issues each note points to.</li>
      <li><b>Weigh it against your vision.</b> A note that would make the script "better" but not <em>your</em> film can be respectfully set aside. Serve the story you're trying to tell.</li>
      <li><b>Sit with the sting.</b> The notes that make you defensive are often the true ones. Feel the flinch, then get curious about why.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My process for reading notes: I read them all, feel insulted for about a day, then read them again once my ego has calmed down. The second read is the useful one. I ignore every proposed solution and just collect the <em>problems</em> — the where and the what. Then I look for anything two or more readers hit independently; that's my rewrite list. The suggestions I almost never take, because I know my story better than they do. But the problems? The problems are a gift, and the sharper they sting, the more likely they're real.</p>
    </div>

    <p>That completes your foundation: you can gain distance, diagnose problems, and gather outside eyes. Now you have a clear, prioritized list of what's broken. It's time to actually fix it — starting with the biggest, most important pass of all: the structural rewrite. That's Module 2.</p>
`,
      takeaways: [
        "Feedback catches blind spots you can never fully escape — but choose honest, story-literate readers, and only a few.",
        "Ask specific questions: where did you get bored, confused, or start caring — and what stuck a day later?",
        "The golden rule: readers are right about what's wrong, usually wrong about how to fix it — trust the diagnosis, not the prescription.",
        "Look for patterns across readers, translate notes into problems, and weigh everything against your own vision.",
      ],
    },
    {
      slug: "structural-rewrite",
      num: 5,
      roman: "V",
      title: "The Structural Rewrite",
      desc: "The big pass — fixing the bones before the polish",
      time: "10 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `This is the big one. Before you fix a single line of dialogue, you fix the bones — the structure that holds the whole story up. Get this pass right and everything else gets easier.`,
      seoTitle: "The Structural Rewrite: Fixing a Screenplay's Bones | Filmmaker Genius",
      seoDesc: "How to do a structural rewrite of a screenplay — fixing the bones before the polish, working from a new outline, and rebuilding acts, turning points, and pacing. Chapter 5 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>Here's the principle that governs the order of every good rewrite: <strong>you fix a script from the biggest problems down to the smallest.</strong> Structure first, then character, then scene and dialogue, then polish. Skip that order and you waste enormous effort — there's no point perfecting the dialogue in a scene you're about to delete because act two is broken. The <em>structural rewrite</em> is the foundation pass, where you rebuild the load-bearing walls of the story. It's the hardest, scariest, and most important rewrite you'll do, and it's why we do it first.</p>

    <h2>What "structure" means in a rewrite</h2>

    <p>Structure is the sequence and shape of your story — the order of events and how they build. When you diagnosed your script, most of your biggest problems were probably structural even if they didn't feel that way: the saggy middle, the flat ending, the hero you didn't care about. In this pass you're checking and rebuilding the skeleton:</p>

    <ul class="spec-list">
      <li><b>The engine.</b> Is the central conflict and the protagonist's goal strong and clear enough to drive a whole movie? If not, nothing downstream will work.</li>
      <li><b>The turning points.</b> Do your act breaks land in the right places and actually <em>turn</em> the story? Weak act breaks make a script feel shapeless.</li>
      <li><b>Escalation.</b> Does each act raise the stakes and tighten the screws? A story that doesn't escalate drags no matter how good the scenes are.</li>
      <li><b>The midpoint and momentum.</b> Is there a strong shift at the center that recharges act two? Saggy middles almost always die here.</li>
      <li><b>The climax.</b> Does the ending pay off everything, and does the hero drive it through their own choice?</li>
    </ul>

    <div class="pullquote">Fix the foundation before you paint the walls. A beautifully written scene in the wrong place is just a beautiful problem.</div>

    <h2>Work from a new outline, not the script</h2>

    <p>The pro move for a structural rewrite is to step <em>away</em> from the screenplay pages and work at the outline level first. Break your existing draft down into a list of scenes or beats — index cards, a beat sheet, a board — so you can see the whole architecture at a glance. Then rebuild <em>that</em>, not the prose:</p>

    <ul class="spec-list">
      <li><b>Reverse-outline what you have.</b> One line per scene: what happens, whose scene it is, what changes. Now you can see the real shape.</li>
      <li><b>Spot the structural failures.</b> Scenes that don't advance the story, acts that don't turn, stretches with no escalation.</li>
      <li><b>Rebuild the outline.</b> Reorder, cut, and add beats until the <em>skeleton</em> works — before touching a page of script.</li>
      <li><b>Then execute in the pages.</b> With a sound new outline, rewrite the script to match it — cutting scenes, writing new ones, resequencing.</li>
    </ul>

    <p>Working at the outline level is faster, braver, and clearer. It's much easier to move an index card than to rewrite forty pages, and it lets you make big structural decisions without getting seduced by nice lines you don't want to lose.</p>

    <h2>Be willing to demolish</h2>

    <p>The structural rewrite demands courage, because the fixes are big: cutting characters, collapsing three scenes into one, moving your climax, sometimes rebuilding whole acts. New writers resist this — it feels like destroying work. But a structural problem can't be patched with small tweaks; it has to be <em>rebuilt.</em> The writers who level up are the ones willing to tear down a load-bearing wall when the house needs it. Save your old draft, so nothing is ever truly lost, and then rebuild without fear.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Every real rewrite I've done started with me printing the script, reading it once, then <em>closing it</em> and rebuilding the whole thing on index cards on my floor. On cards, I'll happily throw out a scene I'd never have deleted inside the document, because on a card it's just a sentence — not forty minutes of writing I'm attached to. I get the architecture right on the floor first. Only when the cards tell a story that works do I go back into the pages. It feels slower. It's dramatically faster, because I'm never polishing something I'm about to cut.</p>
    </div>

    <p>With the bones rebuilt and the story finally standing up straight, you can move to the next layer: the people who live inside that structure. The character pass is next.</p>
`,
      takeaways: [
        "Rewrite from biggest problems to smallest — structure first, polish last.",
        "Check the engine, turning points, escalation, midpoint, and climax — most big problems are structural.",
        "Work from a new outline or index cards first — rebuild the skeleton before touching the pages.",
        "Be willing to demolish — cut and rebuild fearlessly, and always keep your old draft.",
      ],
    },
    {
      slug: "how-to-rewrite-characters",
      num: 6,
      roman: "VI",
      title: "The Character Pass",
      desc: "Deepening character, arc, and motivation in a dedicated pass",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `With the structure sound, you turn to the people who live inside it. A dedicated character pass — reading the script one character at a time — is how you turn functional roles into unforgettable people.`,
      seoTitle: "How to Rewrite Characters: The Character Pass | Filmmaker Genius",
      seoDesc: "How to rewrite characters in a screenplay — the dedicated character pass for deepening want, motivation, arc, and voice, reading the script one character at a time, and making everyone active. Chapter 6 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>People don't leave a movie theater talking about structure. They talk about <em>characters</em> — the person they fell for, feared, or couldn't stop thinking about. In your first draft, though, you were often too busy wrangling plot to fully realize the people living inside it, so many of them ended up as functional roles: the mentor who mentors, the villain who's evil because the plot needs one. The character pass is a dedicated rewrite where you stop worrying about plot mechanics and focus entirely on making your people real, active, and unforgettable. Knowing <strong>how to rewrite characters</strong> is often the difference between a script that works and one that lands.</p>

    <h2>Read the script one character at a time</h2>

    <p>The signature technique of the character pass is to read your entire screenplay <em>through the eyes of a single character</em> — then do it again for the next one. When you read for just one person, following only their journey, their gaps and inconsistencies jump out in a way they never do on a normal read:</p>

    <ul class="spec-list">
      <li><b>Track their arc.</b> Do they change across the film? Is that change earned by what happens to them, or does it just appear because the ending needs it?</li>
      <li><b>Check their motivation.</b> Does every action make sense for <em>this</em> person? Or do they sometimes do things only because the plot demands it?</li>
      <li><b>Follow their want.</b> Is it clear what they're after in every scene? Characters without wants go passive and flat.</li>
      <li><b>Feel their consistency.</b> Do they feel like one coherent person, or does their behavior lurch to serve different scenes?</li>
    </ul>

    <p>This one-character-at-a-time read is tedious and it is worth it. It's the single most effective character tool a rewriter has — even actors do a version of it, reading the whole script only for their role.</p>

    <div class="pullquote">Plot is what happens. Character is why we care that it happens. The rewrite is where you make sure we care.</div>

    <h2>What to deepen</h2>

    <ul class="spec-list">
      <li><b>Want and need.</b> Sharpen the external goal (want) and the internal lesson (need). The gap between them is where arc lives.</li>
      <li><b>Make them active.</b> The most common character fix in any rewrite: turn a passive protagonist into one who <em>drives</em> the story through their own choices. Things shouldn't just happen <em>to</em> your hero.</li>
      <li><b>Contradiction and flaw.</b> Real people contain contradictions; give characters a flaw, a blind spot, an inner conflict. Perfect characters are boring.</li>
      <li><b>Specificity.</b> Replace generic traits with specific, telling detail — the exact habit, fear, or history that makes them <em>this</em> person and no one else.</li>
      <li><b>Distinct voices.</b> Each major character should sound unmistakably like themselves. (You'll sharpen this further in the dialogue pass.)</li>
    </ul>

    <h2>Fix the supporting cast too</h2>

    <p>The character pass isn't only for your lead. Weak supporting characters drag down a whole film. In this pass, check that every secondary character has a reason to exist and a life of their own — even a small one. The classic fix is <em>combination:</em> if two minor characters each do a little, merge them into one who does a lot and matters more. And make sure your antagonist is as carefully built as your hero — a great villain has understandable motivation and is often the most memorable person in the movie. A protagonist is only as compelling as the opposition they face.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Whenever a script of mine feels "fine but forgettable," it's almost always a character problem, not a plot problem — and the fix is almost always the same: my protagonist is too passive. They're reacting, being pushed around by events, waiting for the plot to happen to them. So in my character pass I hunt for every moment where my hero is a passenger and I hand them the wheel — I make them <em>decide,</em> <em>choose,</em> <em>act,</em> even wrongly. The second the protagonist starts driving, a flat script comes to life. Passive heroes are the number-one killer of scripts that are "almost there."</p>
    </div>

    <p>Your people are now real, active, and driving the story. The next pass zooms in tighter — to the level of the individual scene and the words the characters actually say. The scene and dialogue pass is next.</p>
`,
      takeaways: [
        "Audiences remember characters, not structure — the character pass makes your people real and active.",
        "Read the script one character at a time to expose gaps in arc, motivation, want, and consistency.",
        "Deepen want vs. need, add flaw and contradiction, get specific, and make the protagonist drive the story.",
        "Fix the supporting cast and antagonist too — combine weak minor roles and build a villain as carefully as the hero.",
      ],
    },
    {
      slug: "rewriting-dialogue",
      num: 7,
      roman: "VII",
      title: "The Scene & Dialogue Pass",
      desc: "Sharpening scenes and rewriting dialogue for impact",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `Structure sound, characters alive — now you zoom in. This pass sharpens every scene and rewrites the dialogue until it crackles, using subtext, economy, and a distinct voice for everyone.`,
      seoTitle: "Rewriting Dialogue: The Scene & Dialogue Pass | Filmmaker Genius",
      seoDesc: "How to rewrite dialogue and sharpen scenes in a screenplay — cutting on-the-nose lines, using subtext, entering late and leaving early, and giving each character a distinct voice. Chapter 7 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>Now that the story stands up and the people are alive, you work at the scene level — polishing each individual scene and, above all, the dialogue. This is the pass most beginners <em>start</em> with, and that's the mistake: brilliant dialogue in a broken structure is wasted, which is why it comes fourth, not first. But done in the right order — after structure and character — the scene and dialogue pass is where a solid script becomes a <em>sharp</em> one. This is where the writing starts to sing.</p>

    <h2>Make every scene earn its place</h2>

    <p>Go through the script scene by scene and interrogate each one. A scene that isn't pulling its weight is either cut or rebuilt:</p>

    <ul class="spec-list">
      <li><b>Does it have a purpose?</b> Every scene should advance the story <em>and</em> reveal character — ideally both. A scene that does neither is dead weight.</li>
      <li><b>Is there conflict or tension?</b> Even quiet scenes need some friction, an unmet want, a question in the air. Conflict-free scenes go flat.</li>
      <li><b>Does something change?</b> A scene should end in a different place than it started — a shift in power, information, or emotion.</li>
      <li><b>Enter late, leave early.</b> Start each scene as deep into the action as possible and cut out the moment its point is made. Trim the hellos and goodbyes.</li>
    </ul>

    <h2>Rewriting dialogue: the big fixes</h2>

    <p>Most first-draft dialogue suffers from the same handful of problems. Hunt them down:</p>

    <ul class="spec-list">
      <li><b>On-the-nose lines.</b> Characters saying exactly what they think and feel. Real people rarely do. Replace directness with <em>subtext</em> — let them talk around it.</li>
      <li><b>Exposition dumps.</b> Information delivered in unnatural speeches. Break it up, hide it in conflict, or cut it. If two characters both know something, they won't explain it to each other for the audience's benefit.</li>
      <li><b>Everyone sounds the same.</b> If you can swap two characters' lines without noticing, their voices aren't distinct. Give each a rhythm, vocabulary, and way of speaking that's theirs alone.</li>
      <li><b>Too long.</b> Screen dialogue is lean. Cut lines in half, then see if you can cut them again. White space is your friend.</li>
    </ul>

    <div class="qa-box">
      <div class="qa-row"><div class="qa-tag no">On-the-nose</div><div class="qa-txt">"I'm angry at you because you forgot my birthday and it made me feel unimportant."</div></div>
      <div class="qa-row"><div class="qa-tag yes">Subtext</div><div class="qa-txt">"No, it's fine. It's just a birthday." (She keeps washing the dish that's already clean.)</div></div>
    </div>

    <p>See how the second version says <em>more</em> by saying less? The audience does the work of understanding, and that's what makes dialogue feel alive.</p>

    <div class="pullquote">Great dialogue isn't about what characters say. It's about what they can't quite say — and what they're really doing while they talk.</div>

    <h2>Use your ear</h2>

    <p>Dialogue is written to be <em>heard,</em> so you have to hear it. Read every line out loud, or run the whole script as a table read. Your ear catches what your eye glides past: the clunky rhythm, the tongue-twister, the line no human would ever say, the speech that goes on three beats too long. If you stumble reading it aloud, an actor will too. This is the pass where reading out loud stops being optional — it's the single most reliable dialogue tool there is, which is exactly why it gets its own chapter next.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My favorite dialogue trick in a rewrite: I go through and delete the first line and the last line of half my scenes. The first line is usually throat-clearing ("Hey, come in, sit down") and the last is usually the character explaining the point I just watched them make. Cut both, and the scene starts in the middle of heat and ends on a punch. Then for the lines that remain, I ask, "What is this person <em>really</em> saying, and can I make them say it sideways instead?" On-the-nose out, subtext in. That two-step — trim the edges, bury the meaning — fixes eighty percent of flat dialogue.</p>
    </div>

    <p>The writing is sharp now — but you may still be holding onto things the script would be better without: a dazzling scene that doesn't fit, a beloved line that slows the pace. The next chapter is about the hardest cut of all: killing your darlings.</p>
`,
      takeaways: [
        "Do the scene and dialogue pass fourth — after structure and character, not first.",
        "Make every scene earn its place: purpose, conflict, and change — enter late and leave early.",
        "Fix the big dialogue problems: on-the-nose lines, exposition dumps, same-sounding voices, and length.",
        "Use subtext — let characters talk around what they mean — and always read the dialogue out loud.",
      ],
    },
    {
      slug: "killing-your-darlings",
      num: 8,
      roman: "VIII",
      title: "Killing Your Darlings",
      desc: "Cutting what you love for the good of the whole",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `The most famous piece of writing advice ever given, and the most painful to follow. Your "darlings" are the parts you love most — and sometimes they're exactly what's holding your script back.`,
      seoTitle: "Killing Your Darlings: Cutting for Pace in a Rewrite | Filmmaker Genius",
      seoDesc: "What 'kill your darlings' really means and how to do it — cutting the scenes, lines, and jokes you love for the good of the whole script, spotting darlings, and cutting for pace without regret. Chapter 8 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>"Kill your darlings." You've heard it, and it's brutal because it's true. A <strong>darling</strong> is any piece of your script you love for its own sake — a dazzling scene, a clever line, a joke that kills, a beautiful image, a whole character — that isn't actually serving the story. We get so attached to these that we bend the entire script around protecting them, and a script contorted to save its darlings is a weaker script. This chapter is about the discipline of cutting what you love for the good of the whole, and cutting for pace so your movie moves.</p>

    <h2>What the advice really means</h2>

    <p>People misread "kill your darlings" as "delete everything good." It means the opposite of that. It means: <em>don't let your love for a piece blind you to whether it belongs.</em> The test isn't "is this good?" — it's "does this serve the story?" A brilliant scene that stalls your momentum, confuses your throughline, or exists only because you're proud of it is a darling, no matter how good it is on its own. The greatness of the piece is exactly what makes it dangerous, because greatness is what you refuse to cut.</p>

    <div class="pullquote">The test of a darling isn't whether it's good. It's whether the script would be better without it. Sometimes your best writing is what's in the way.</div>

    <h2>How to spot a darling</h2>

    <ul class="spec-list">
      <li><b>You've defended it more than once.</b> If you keep justifying why a scene "has to stay," it's probably a darling. The script is telling you something.</li>
      <li><b>It survives every cut untouched.</b> The one scene you'd never dream of touching deserves the hardest look, precisely because you won't look at it.</li>
      <li><b>You built around it.</b> If plot logic bends to keep a moment in, the moment is running the story instead of serving it.</li>
      <li><b>It's the reason you started.</b> Sometimes the original spark — the image or line the whole idea grew from — no longer fits the film the script became. That's the hardest darling of all.</li>
    </ul>

    <h2>Cutting for pace</h2>

    <p>Killing darlings is also how you fix pace. Most scripts are too long and too slow, and the cuts that tighten them are usually the beloved, "unnecessary but wonderful" bits — the extra scene of great banter, the lovely but static montage, the subplot you adore that doesn't feed the main line. When you feel a stretch dragging, look first at what you're most attached to in it. Ruthless trimming almost always makes a film faster, sharper, and better. Audiences never miss the darling you cut, because they never knew it existed — they only feel the tighter, stronger film that's left.</p>

    <h2>Make the pain bearable</h2>

    <p>The reason writers won't cut is fear of loss. So remove the loss:</p>

    <ul class="spec-list">
      <li><b>Keep a "cuts" file.</b> Never delete a darling into the void — move it to a graveyard document. It still exists; it's just not in <em>this</em> script. The knife hurts less when nothing truly dies.</li>
      <li><b>It might live again.</b> A great cut scene or line can find a home in another project. Nothing good is ever wasted; it's just waiting.</li>
      <li><b>Cut, then read.</b> Remove the darling and read the sequence without it. Nine times out of ten it flows better, and the proof silences the grief.</li>
      <li><b>Serve the whole.</b> Remember what you're serving — not this scene, but the entire film. Your loyalty belongs to the movie, not to any single moment in it.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I have a graveyard file for every script — pages of scenes and lines I loved and cut. It's the only reason I can cut at all. When a darling has to go, I don't delete it; I move it there, tell myself it's safe, and keep working. And here's the thing: I almost never go back for them. Once the script is tighter without them, I stop missing them entirely. A couple of times a "dead" line found its way into a different film years later, better than ever. Nothing good is wasted. But the script in front of you only gets better when you're brave enough to let the darlings go.</p>
    </div>

    <p>Your script is now structurally sound, richly charactered, sharply written, and lean. The heavy lifting of the rewrite is done. Module 3 is about the finishing work — hearing it out loud, the final polish, and knowing when to stop. The table read is next.</p>
`,
      takeaways: [
        "A darling is anything you love that isn't serving the story — its greatness is what makes it dangerous.",
        "The test isn't \"is it good?\" but \"would the script be better without it?\"",
        "Spot darlings by what you keep defending, never cut, or bend the plot to protect — and cut for pace.",
        "Keep a cuts file so nothing truly dies — then cut, read without it, and serve the whole film.",
      ],
    },
    {
      slug: "screenplay-table-read",
      num: 9,
      roman: "IX",
      title: "The Table Read",
      desc: "Hearing your script out loud — the ultimate diagnostic",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Polish & Delivery",
      dek: `Your script has been living in your head as words on a page. A table read turns it into something you <em>hear</em> — and hearing it is the single most revealing test a screenplay can undergo.`,
      seoTitle: "The Screenplay Table Read: Hearing Your Script Out Loud | Filmmaker Genius",
      seoDesc: "How to run a screenplay table read — why hearing your script out loud is the ultimate diagnostic, how to cast and run a read, and how to take notes from it. Chapter 9 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>Here's a strange truth about screenwriting: a script is written to be <em>performed,</em> but you write it in silence, reading it in your own head, in your own voice, filling every gap with what you meant. That's why a <strong>table read</strong> — hearing your screenplay read aloud by other people — is the most powerful diagnostic tool in the whole rewrite process. The moment other voices speak your words, the script stops being a private idea and becomes a real, external thing with real problems you can finally hear. Pros do table reads for exactly this reason, and so should you.</p>

    <h2>Why hearing it changes everything</h2>

    <p>When someone else reads your dialogue, you lose your unfair advantages all at once. You can no longer smooth over a clunky line with the perfect delivery in your head. You can't fill a dead moment with your own imagination. You experience the script closer to how an audience will — as something coming <em>at</em> you, in time, out of your control. And your ear catches a whole category of problems your eye never will:</p>

    <ul class="spec-list">
      <li><b>Clunky, unsayable dialogue.</b> Lines that look fine but trip the tongue. If a reader stumbles, an actor will too.</li>
      <li><b>On-the-nose and fake speech.</b> Dialogue that rings false is impossible to miss out loud.</li>
      <li><b>Pacing and dead air.</b> You <em>feel</em> where the energy drops, where a scene runs long, where things drag.</li>
      <li><b>Length.</b> A read gives you a real runtime — and reveals whether your "110-page" script actually plays like two and a half hours.</li>
      <li><b>What lands.</b> Do the jokes get laughs? Does the emotional beat hit? Live reactions don't lie.</li>
    </ul>

    <div class="pullquote">You can fool your eye. You cannot fool your ear. A table read is the moment your script stops being what you meant and becomes what you actually wrote.</div>

    <h2>How to run one</h2>

    <ul class="spec-list">
      <li><b>Cast the parts.</b> Get people to read each role — actor friends are ideal, but anyone willing works. One person can read stage directions.</li>
      <li><b>Don't perform it yourself.</b> As the writer, you should <em>listen,</em> not read a part. You need your full attention on the script, not your lines.</li>
      <li><b>Read it straight through.</b> No stopping to fix or explain. Experience the whole thing in one flow, like a movie.</li>
      <li><b>Record it.</b> Audio or video. You'll catch far more on a second listen, when you're not also managing the room.</li>
      <li><b>Watch the listeners.</b> If anyone's just observing, watch <em>them</em> — where they lean in, laugh, check their phone. Their attention is a live map of your pacing.</li>
    </ul>

    <p>No group handy? A read-aloud still works solo — or use a tool that voices the parts for you, which gets you most of the benefit without gathering a cast.</p>

    <h2>Taking notes from a read</h2>

    <p>During the read, resist the urge to fix anything — just <em>mark</em> where something goes wrong. Every stumble, every dead patch, every laugh that doesn't come, every place your own attention drifts: note it and keep going. Afterward, you'll have a map of exactly which scenes and lines need work. And if you had listeners, ask them the same sharp questions from the feedback chapter — where they got bored, confused, or checked out. The table read plus those questions is the most efficient diagnostic session you'll ever run. Then take that map back into another pass.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first table read of anything I write is always humbling, and I've learned to <em>want</em> that humbling. Lines I was proud of die in the room. A scene I thought was tight goes on forever when I have to sit through it in real time. And the jokes — you find out very fast which jokes are actually funny and which were only funny to me. It stings for an hour and then it's the best rewrite fuel there is, because now I'm not guessing what's wrong. I <em>heard</em> it. I mark every wince and every dead spot, and that list becomes my next draft.</p>
    </div>

    <p>Armed with what you heard, you do another pass — and eventually you reach the final, line-level pass that makes everything gleam. The polish pass is next.</p>
`,
      takeaways: [
        "A table read is the most powerful diagnostic a screenplay has — hearing it removes all your unfair advantages.",
        "Your ear catches what your eye can't: clunky lines, fake speech, dead pacing, true length, and what lands.",
        "Run it right: cast the parts, don't read yourself, go straight through, record it, and watch the listeners.",
        "Mark every stumble and dead spot without fixing, then take that map into your next pass.",
      ],
    },
    {
      slug: "script-polish",
      num: 10,
      roman: "X",
      title: "The Polish Pass",
      desc: "The final line-level pass that makes it shine",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Polish & Delivery",
      dek: `The story works, the characters live, the dialogue sings. Now comes the pass that separates an amateur script from a professional one: the line-level polish that makes every page a pleasure to read.`,
      seoTitle: "The Polish Pass: The Final Line-Level Script Polish | Filmmaker Genius",
      seoDesc: "How to do a script polish — the final line-level pass that sharpens scene description, tightens action lines, fixes formatting and typos, and makes a screenplay read like a professional. Chapter 10 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>The <strong>polish</strong> is the last pass, and it's the one that operates at the smallest scale — not story, not character, not even whole scenes, but the individual word, line, and page. By now the hard structural work is done. This is about craft at the sentence level: making the script <em>read</em> beautifully, because a screenplay isn't just a story — it's a document that a producer, an actor, or a contest reader is going to <em>read</em>, and how it reads on the page is how they judge it. A clean, propulsive, professional-feeling script signals a professional writer before anyone reaches the plot.</p>

    <h2>Sharpen the scene description</h2>

    <p>Dialogue got its pass earlier; the polish is where you finally attack the <em>action lines</em> — the description that isn't dialogue. This is often what separates scripts that read like a pro wrote them from scripts that read like homework:</p>

    <ul class="spec-list">
      <li><b>Cut the clutter.</b> Trim every action line to its essence. "He slowly and carefully walks over to the door and then opens it" becomes "He opens the door." Lean description reads fast.</li>
      <li><b>Write for the read.</b> Description should be vivid and active, using strong verbs and concrete images — evoke the movie in the reader's head without over-directing.</li>
      <li><b>Keep it visual and present.</b> Only what we can see and hear, in present tense. Cut anything the camera can't capture ("she remembers her childhood").</li>
      <li><b>Use white space.</b> Break dense blocks into short, punchy paragraphs. A page that <em>looks</em> readable invites the read; a wall of text repels it.</li>
    </ul>

    <div class="pullquote">Your script gets read before it gets made. On the page, how it reads is the whole movie — so make every line a pleasure to move through.</div>

    <h2>The professional checklist</h2>

    <p>The polish is also where you make the script clean and correct, because sloppiness screams amateur and gives a reader an easy reason to stop:</p>

    <ul class="spec-list">
      <li><b>Formatting.</b> Standard, correct, consistent screenplay format throughout. Errors here undercut everything — the format should be invisible.</li>
      <li><b>Typos &amp; grammar.</b> Proofread carefully. A script riddled with typos tells a reader you didn't care, so why should they?</li>
      <li><b>Consistency.</b> Character names, spellings, times of day, and details all consistent from page one to the end.</li>
      <li><b>Page count &amp; pacing on the page.</b> Confirm the length is appropriate and that no scene visually overstays its welcome.</li>
      <li><b>Scene headings &amp; transitions.</b> Clean, correct, and only where they earn their place.</li>
    </ul>

    <h2>Don't reopen the big questions</h2>

    <p>A crucial discipline of the polish pass: <em>stay at the polish level.</em> This is not the time to rethink your ending or rebuild a character — if you find a genuine structural problem now, note it, but don't let "polishing" become an excuse to tear the whole thing open again and never finish. The polish is a finishing pass, not a fresh rewrite. If the earlier passes did their job, what's left really is just making good work shine. Sand and wax the furniture; don't rebuild the chair.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The polish is my favorite pass, because it's the one where the script finally starts to feel <em>professional</em> in my hands. I read it purely as a reader now — for flow, for cleanness, for the pleasure of the page — and I hunt the tiny frictions: the clunky action line, the stray typo, the paragraph that's three lines too long. None of it changes the story, but together it's the difference between a script that reads like a movie you can't put down and one a tired reader sets aside on page ten. Producers and contest readers decide fast. The polish is how you earn their attention all the way to FADE OUT.</p>
    </div>

    <p>Your script is now polished to a professional shine. Which raises the question every writer eventually has to face — and often gets wrong in both directions: how do you know when it's actually <em>done?</em> Knowing when to stop is next.</p>
`,
      takeaways: [
        "The polish is the final line-level pass — how the script reads on the page is how it gets judged.",
        "Sharpen action lines: cut clutter, use strong verbs and concrete images, stay visual, and use white space.",
        "Run the professional checklist: formatting, typos, consistency, page count, and clean headings.",
        "Stay at the polish level — don't reopen big story questions; this is a finishing pass, not a new rewrite.",
      ],
    },
    {
      slug: "when-is-a-screenplay-finished",
      num: 11,
      roman: "XI",
      title: "Knowing When You're Done",
      desc: "How to tell \"done\" from \"I'm just afraid to stop\"",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Polish & Delivery",
      dek: `A script is never truly "finished" — it's abandoned at the right moment. Knowing when that moment has come, and having the courage to stop and send it out, is a skill as real as any rewrite.`,
      seoTitle: "When Is a Screenplay Finished? Knowing When to Stop | Filmmaker Genius",
      seoDesc: "How to know when a screenplay is finished — telling real 'done' from fear of stopping, the signs a script is ready, the danger of over-rewriting, and when to send it out. Chapter 11 of The Rewrite: Developing Through Drafts.",
      body: `
    <p>There's a famous line, often credited to Leonardo da Vinci and to Paul Valéry: <em>"A work of art is never finished, only abandoned."</em> It's especially true of screenplays. You could rewrite forever — there's always another line to tweak, another beat to reconsider. So the real question isn't "is it perfect?" (it never will be) but "is it <em>done enough</em> — ready to go out into the world?" And here's the twist that catches writers on both sides: some quit too early, sending out a first draft they mistake for finished, while others never stop, rewriting a good script into the ground because they're afraid to let it go. Knowing which trap is yours is half the battle.</p>

    <h2>The signs a script is ready</h2>

    <p>You'll rarely feel certain, but these signals point to genuine done-ness:</p>

    <ul class="spec-list">
      <li><b>Your changes are getting tiny — and reversible.</b> When you're swapping a word, then swapping it back next session, you're not improving it anymore. You're fidgeting.</li>
      <li><b>Fresh readers stop finding real problems.</b> New readers report that it works and enjoy it, without flagging the big issues earlier drafts had. The notes have shrunk to taste.</li>
      <li><b>You've addressed the pattern notes.</b> Every problem multiple people independently raised has been solved. What remains are one-off opinions, which you're allowed to overrule.</li>
      <li><b>It delivers what it promised.</b> The script does what you set out to do — the story lands, the feeling connects. It's the film you meant to write.</li>
      <li><b>You're changing, not improving.</b> The surest sign. When new versions are merely <em>different</em> rather than <em>better,</em> stop.</li>
    </ul>

    <div class="pullquote">A script is never finished, only abandoned. Your job isn't to make it perfect — it's to make it good, and then have the courage to let it go do its work.</div>

    <h2>The danger of over-rewriting</h2>

    <p>Endless rewriting is real, and it's usually fear in disguise — as long as the script is "in progress," it can't be rejected. But a script that never ships helps no one, and there's a genuine craft danger too: you can rewrite the <em>life</em> out of a script. Over-polished, over-workshopped pages can lose the spark, the roughness, the voice that made them alive. Rewriting has diminishing returns; past a certain point you're not deepening the work, you're sanding off its edges. If you catch yourself endlessly revising with no clear problem to solve, that's not craft — that's avoidance, and it's time to stop.</p>

    <h2>Set a finish line</h2>

    <p>The practical antidote to both traps is a <em>deadline.</em> Decide in advance what "done" looks like — a number of drafts, a date, a final round of reads — and honor it. A festival deadline, a contest, a producer expecting pages, or simply a date you set and tell someone about: external commitments force the healthy decision to release. Perfection is not on the table; a strong, finished, professional script that actually goes out into the world is. Ship it, then start the next one — because the writers who build careers are the ones who <em>finish</em> and move on.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My personal test for "done" is embarrassingly simple: when I open the file to work and I'm just moving commas around and changing lines back to what they were two drafts ago, I'm finished — I'm fidgeting, not writing. Early on I held scripts for years, "perfecting" them, terrified to send them out. They didn't get better; they got safer and duller, and worse, they never got read. The scripts that changed my career weren't perfect. They were <em>good, finished, and sent.</em> A great script on your hard drive does nothing. Let it go and write the next one.</p>
    </div>

    <p>You now know how to take a first draft all the way to a finished, professional screenplay — and when to stop. One chapter remains: the common rewriting mistakes that trip writers up along the way, gathered in one place as your final checklist. That's the finale.</p>
`,
      takeaways: [
        "A script is never perfect, only done enough to go out — some writers stop too early, others never stop.",
        "Signs it's ready: tiny reversible changes, fresh readers finding no real problems, and pattern notes all addressed.",
        "Beware over-rewriting — endless revision is often fear, and it can sand the life out of a script.",
        "Set a finish line and honor it — a good, finished, sent script beats a perfect one on your hard drive.",
      ],
    },
    {
      slug: "screenplay-rewriting-mistakes",
      num: 12,
      roman: "XII",
      title: "Common Rewriting Mistakes",
      desc: "The traps that stall or ruin a rewrite",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Polish & Delivery",
      dek: `Most rewrites go wrong in the same predictable ways. Here they are in one place — your final checklist — so you can catch each one in your own process before it stalls or sinks your script.`,
      seoTitle: "Common Screenplay Rewriting Mistakes to Avoid | Filmmaker Genius",
      seoDesc: "The most common screenplay rewriting mistakes — polishing before fixing structure, treating symptoms, obeying every note, endless tinkering, and losing the original spark. The traps that stall a rewrite, and how to avoid them. Chapter 12, the finale of The Rewrite: Developing Through Drafts.",
      body: `
    <p>You now have the whole toolkit — distance, diagnosis, feedback, and the ordered passes that carry a script from rough first draft to finished screenplay. This final chapter collects the <strong>rewriting mistakes</strong> that trip up nearly every writer, so you can spot them in your own process before they cost you months or a good script. The good news, as with every craft, is that almost all of them come from a few root errors — and once you can name them, you can dodge them. Consider this your rewrite checklist.</p>

    <h2>The traps that sink a rewrite</h2>

    <ul class="spec-list">
      <li><b>Polishing before fixing structure.</b> The most common mistake — sanding dialogue while the story is broken underneath. Cure: fix biggest problems first, structure before polish (Chapter V).</li>
      <li><b>Treating symptoms, not causes.</b> Endlessly rewriting the boring scene instead of the earlier choice that made it boring. Cure: diagnose the root, which is almost always upstream (Chapter III).</li>
      <li><b>Rewriting with no plan.</b> Opening the script and tinkering aimlessly. Cure: diagnose everything, prioritize, then execute in order.</li>
      <li><b>Obeying every note.</b> Blindly following feedback and rewriting a good script into a worse one. Cure: trust the diagnosis, distrust the prescription; look for patterns (Chapter IV).</li>
      <li><b>Never gaining distance.</b> Rewriting the moment you finish, unable to see the script clearly. Cure: put it in a drawer, then read like a stranger (Chapter II).</li>
      <li><b>Protecting your darlings.</b> Bending the whole script to save a scene or line you love. Cure: cut what doesn't serve the story; keep a graveyard file (Chapter VIII).</li>
      <li><b>Passive protagonist.</b> Leaving a hero who reacts instead of driving. Cure: in the character pass, hand them the wheel (Chapter VI).</li>
      <li><b>Over-rewriting.</b> Revising forever out of fear, sanding the life out of the script. Cure: recognize "done," set a finish line, and ship it (Chapter XI).</li>
    </ul>

    <div class="pullquote">Nearly every failed rewrite is a good script that the writer either fixed in the wrong order — or never had the courage to finish.</div>

    <h2>The habits that prevent them</h2>

    <p>Almost all of those mistakes are avoided by internalizing two things this course kept returning to. First: <em>work in the right order.</em> Distance → diagnosis → structure → character → scene &amp; dialogue → cut → hear it → polish → stop. That sequence isn't arbitrary; it's what stops you from wasting effort on work you'll throw away. Second: <em>stay honest and stay flexible.</em> Read your own work truthfully, hear what feedback is really telling you, follow the better idea even when it means demolition — and then know when to let go. Order plus honesty is the whole discipline.</p>

    <h2>The rewrite self-check</h2>

    <ul class="spec-list">
      <li><b>Am I fixing the biggest problem available, or hiding in a small one?</b> Always work top-down.</li>
      <li><b>Is this a symptom or a cause?</b> Trace it upstream before you rewrite.</li>
      <li><b>Does my protagonist drive the story?</b> If they're passive, that's your first fix.</li>
      <li><b>Am I protecting anything the script would be better without?</b> Find the darling and cut it.</li>
      <li><b>Have I heard it out loud?</b> Read or table-read before you call a pass done.</li>
      <li><b>Am I improving it, or just changing it?</b> If it's just different, you're finished — send it out.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I've made every mistake on this list, most of them more than once — polished a doomed act for a week, followed a note straight off a cliff, clung to a script for two years too scared to send it. That's the real takeaway: you won't avoid these because you're a genius. You'll avoid them because you learned to <em>catch</em> yourself in the act. Work in order. Be honest about what's broken. Cut what you love when it's in the way. Hear it out loud. And when it's good, let it go and write the next one. Do that, and your scripts will get better every single draft.</p>
    </div>

    <p>That's the whole craft of the rewrite — from the raw first draft to a finished, professional screenplay made with skill and courage. Writing is rewriting, and now you know how. Go turn your draft into the film it was always meant to be.</p>
`,
      takeaways: [
        "The big traps: polishing before fixing structure, treating symptoms, obeying every note, and protecting darlings.",
        "Watch for a passive protagonist, no rewrite plan, no distance, and endless over-rewriting.",
        "Two habits prevent most of them: work in the right order, and stay honest and flexible.",
        "Self-check: fix the biggest problem, trace causes, make the hero active, cut darlings, hear it, and know when to stop.",
      ],
    },
  ],
};
