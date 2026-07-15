import type { Course } from "../courseTypes";

export const storyboarding: Course = {
  slug: "how-to-storyboard-a-film",
  title: "Storyboarding for Filmmakers",
  categoryLabel: "Pre-Production",
  subtitle: "A storyboard is your film drawn before it's shot — the plan that turns a script into images and saves you time, money, and panic on set. You don't need to be an artist. Learn to see your movie shot by shot. Taught from the set by a working filmmaker.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~100 min read",
  pairsWithName: "Storyboard Generator",
  pairsWithUrl: "https://filmmakergenius.com/storyboarding",
  pairsWithDesc: "Can't draw a stick figure? The Storyboard Generator turns your scene descriptions into frames — shot by shot — so you get a real, shareable board without ever picking up a pencil.",
  seoTitle: "How to Storyboard a Film: Free Storyboarding Course | Filmmaker Genius",
  seoDesc: "A free, chapter-by-chapter storyboarding course for filmmakers — what a storyboard is, shot types, how to draw a board (even if you can't draw), composition, camera movement, sequencing, shot lists, animatics, and software.",
  learn: [
    "What a storyboard is, the shot types, and how to read a script for its images",
    "How to draw a usable board even if you can't draw — stick figures and boxes",
    "Composition, camera movement arrows, and sequencing a scene shot by shot",
    "Shot lists, action storyboards, animatics, and the software that speeds it all up",
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
    { key: "apply", label: "Module 3 — From Board to Set" },
  ],
  chapters: [
    {
      slug: "what-is-a-storyboard",
      num: 1,
      roman: "I",
      title: "What Is a Storyboard?",
      desc: "Your film, drawn before it's shot",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `Before a single frame is filmed, great directors have already "seen" their movie — on paper. A storyboard is that vision made visible: your film drawn shot by shot, like a comic strip of the movie you're about to make.`,
      seoTitle: "What Is a Storyboard? A Filmmaker's Guide | Filmmaker Genius",
      seoDesc: "What is a storyboard — the shot-by-shot visual plan of a film, how it works as a comic-strip of your movie, what goes in each panel, and where it fits in production. Chapter 1 of Storyboarding for Filmmakers.",
      body: `
    <p>A <strong>storyboard</strong> is a sequence of drawings that shows, panel by panel, what each shot of your film will look like. Think of it as a comic-book version of your movie: each frame is one shot, laid out in order, so you can <em>see</em> the whole scene before you ever set up a camera. It's the bridge between the script's words and the finished film's images — the moment your movie stops being a story you read and becomes a movie you can look at. And it's been part of filmmaking for a century, from Disney's animation department (where the storyboard was invented) to nearly every big-budget film today.</p>

    <div class="sb-row">
      <div class="sb-panel">
        <div class="sb-frame"><svg viewBox="0 0 100 56"><rect class="soft" x="6" y="6" width="88" height="44" rx="2"/><circle class="stroke" cx="50" cy="26" r="7"/><line class="stroke" x1="50" y1="33" x2="50" y2="44"/></svg></div>
        <div class="sb-cap"><span>Panel 1</span><b>WIDE</b></div>
      </div>
      <div class="sb-panel">
        <div class="sb-frame"><svg viewBox="0 0 100 56"><rect class="soft" x="6" y="6" width="88" height="44" rx="2"/><circle class="stroke" cx="50" cy="24" r="12"/><line class="stroke" x1="50" y1="36" x2="50" y2="48"/></svg></div>
        <div class="sb-cap"><span>Panel 2</span><b>MEDIUM</b></div>
      </div>
      <div class="sb-panel">
        <div class="sb-frame"><svg viewBox="0 0 100 56"><rect class="soft" x="6" y="6" width="88" height="44" rx="2"/><circle class="stroke" cx="50" cy="30" r="20"/></svg></div>
        <div class="sb-cap"><span>Panel 3</span><b>CLOSE-UP</b></div>
      </div>
    </div>

    <p>Three panels, three shots — a wide, then in to a medium, then a close-up. Even in this crude form you can already <em>feel</em> the edit: the scene pushing closer as it builds. That's the magic of a storyboard — it lets you direct the movie in your head, on paper, where changes are free.</p>

    <h2>What goes in each panel</h2>

    <p>A storyboard panel isn't just a doodle — it captures the key decisions of a shot:</p>

    <ul class="spec-list">
      <li><b>The framing.</b> How much we see — wide, medium, close — and where the subject sits in the frame.</li>
      <li><b>The composition.</b> What's in the shot and where: characters, key objects, background, foreground.</li>
      <li><b>The angle.</b> Where the camera is — high, low, eye level, over a shoulder.</li>
      <li><b>The movement.</b> Arrows showing how the camera or the subject moves during the shot.</li>
      <li><b>Notes.</b> A caption with the shot number, a line of action or dialogue, and any technical notes.</li>
    </ul>

    <p>String enough panels together and you have a visual blueprint of the entire film — every shot, in order, with its framing and movement decided in advance.</p>

    <div class="pullquote">A screenplay tells you what happens. A storyboard shows you how it will look. It's the first time your film exists as pictures instead of words.</div>

    <h2>Where it fits — and what it's not</h2>

    <p>The storyboard lives in <em>pre-production,</em> after the script is done and before you shoot. It sits alongside its cousin the shot list (Chapter IX) and feeds directly into how you'll direct and edit. But be clear on what a storyboard is <em>not:</em></p>

    <ul class="spec-list">
      <li><b>Not fine art.</b> A storyboard is a <em>communication tool,</em> not a gallery piece. Rough is fine — clear is what matters. (You truly don't need to draw well; that's Chapter V.)</li>
      <li><b>Not a straitjacket.</b> It's a plan, not a prison. On set you'll adapt — but a plan you can deviate from beats no plan at all.</li>
      <li><b>Not only for big movies.</b> It's arguably <em>more</em> valuable on a low-budget shoot, where every wasted hour hurts most.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The thing that finally made storyboarding click for me: it's the cheapest place in the entire filmmaking process to make mistakes. Rethinking a shot on a piece of paper costs you thirty seconds and an eraser. Rethinking it on set costs you an hour of a paid crew standing around — or worse, you discover the problem in the edit when it's too late to fix. The storyboard is where you get to be wrong for free. That's why even directors who "hate planning" learn to love it: it moves the hard thinking to the one place it's still cheap.</p>
    </div>

    <p>So a storyboard is your film, drawn in advance — a visual plan that lets you make and remake creative decisions before they cost anything. In the next chapter we'll look at exactly <em>why</em> that's so powerful, and everything storyboarding does for a production. Why storyboard is next.</p>
`,
      takeaways: [
        "A storyboard is a shot-by-shot sequence of drawings — a comic-strip version of your film.",
        "Each panel captures framing, composition, angle, movement, and notes for one shot.",
        "It's a pre-production communication tool — rough is fine, and you don't need to draw well.",
        "The storyboard is the cheapest place to make mistakes — you get to be wrong for free, on paper.",
      ],
    },
    {
      slug: "benefits-of-storyboarding",
      num: 2,
      roman: "II",
      title: "Why Storyboard?",
      desc: "Why boarding saves time, money, and panic on set",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `"We'll figure it out on the day" is the most expensive sentence in filmmaking. A storyboard is how you figure it out <em>before</em> the day — when solving problems is free instead of costing a whole crew's time.`,
      seoTitle: "Benefits of Storyboarding: Why Storyboard a Film | Filmmaker Genius",
      seoDesc: "The benefits of storyboarding — how a storyboard saves time and money on set, aligns the crew, catches problems early, and makes you a better director. Chapter 2 of Storyboarding for Filmmakers.",
      body: `
    <p>Storyboarding takes time, and when you're eager to shoot, it's tempting to skip it and "wing it" on set. Resist that temptation — because the <strong>benefits of storyboarding</strong> pay for the effort many times over. A storyboard doesn't just help you draw pretty pictures; it fundamentally changes how efficiently and confidently you can make your film. Once you understand everything it does, you'll never want to walk onto a set without one.</p>

    <h2>It saves time and money on set</h2>

    <p>This is the big one, and it's why studios have boarded films for a century. When you arrive on set already knowing every shot — the framing, the angle, the movement — you don't waste precious, expensive crew time <em>deciding.</em> You set up, you shoot, you move on. Without a board, you're inventing coverage on the fly while dozens of paid people wait, the light changes, and the day slips away. Boarding front-loads all that thinking into the one place it's free:</p>

    <ul class="spec-list">
      <li><b>Fewer setups, less indecision.</b> You know exactly what you need, so you don't over-shoot or waste time hunting for the shot.</li>
      <li><b>Faster days.</b> A prepared crew moves fast; an improvising one crawls.</li>
      <li><b>You only build what you'll use.</b> Knowing your shots means you only light, dress, and rig what the camera will actually see.</li>
    </ul>

    <div class="pullquote">Every problem you solve on paper is a problem you don't solve on set — where it costs a hundred times as much in time, money, and stress.</div>

    <h2>It gets everyone on the same page — literally</h2>

    <p>A film is made by a lot of people, and they all have to share <em>one</em> vision. Words are ambiguous ("a dramatic angle" means something different to everyone); a picture isn't. The storyboard is a shared visual reference that aligns the whole team:</p>

    <ul class="spec-list">
      <li><b>The cinematographer</b> sees the framing and can plan lenses, lighting, and camera moves.</li>
      <li><b>The AD</b> can schedule and plan the day around the actual shots.</li>
      <li><b>Production designer, props, and effects</b> know exactly what's in frame and what isn't.</li>
      <li><b>Actors</b> understand the coverage and how the scene is built.</li>
      <li><b>Producers and clients</b> can see and approve the plan before money is spent.</li>
    </ul>

    <p>Instead of a dozen people imagining a dozen different movies, everyone's looking at the <em>same</em> movie. That alignment prevents the on-set arguments and misunderstandings that eat time and morale.</p>

    <h2>It catches problems early — and makes you a better director</h2>

    <p>Storyboarding forces you to think each scene through shot by shot, which surfaces problems while they're still cheap to fix: a jump in eyelines, a piece of geometry that won't cut together, an action you can't cover from one position, a shot that needs a piece of equipment you didn't budget for. You find these on paper, in prep, not on set with the clock running. And beyond logistics, the act of boarding <em>is</em> directing — it's where you make your real visual choices, experiment with how a scene builds, and discover the strongest way to tell it. Directors who board come to set knowing what they want, and that confidence flows through the whole crew.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Here's the counterintuitive truth: boarding doesn't kill spontaneity — it <em>protects</em> it. When I've boarded a scene, I walk on set with my shots locked, which means I'm free to actually watch the actors, notice the magic happening in the moment, and grab the unplanned shot, because I'm not burning my brain deciding basic coverage. The director who "wings it" is too busy panicking about the next setup to see anything. A plan doesn't trap you. It frees you to be present. That's the real gift of the storyboard.</p>
    </div>

    <p>So you storyboard to save time and money, to align the crew, to catch problems early, and to direct with confidence. Now that you know <em>why,</em> we start the <em>how</em> — beginning with the raw material every board is built from: your script. Reading a script for its images is next.</p>
`,
      takeaways: [
        "Storyboarding saves time and money by front-loading shot decisions into prep, where they're free.",
        "It aligns the whole crew around one shared visual vision — a picture beats ambiguous words.",
        "Thinking shot by shot catches eyeline, geometry, and coverage problems while they're still cheap to fix.",
        "Boarding is directing — and a locked plan frees you to be present and spontaneous on set.",
      ],
    },
    {
      slug: "how-to-storyboard-a-script",
      num: 3,
      roman: "III",
      title: "From Script to Shots",
      desc: "Reading a script for its images, shot by shot",
      time: "9 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `A storyboard starts as words. Before you can draw a single panel, you have to look at a page of script and decide: how many shots is this, and what does each one see? That translation is the real skill.`,
      seoTitle: "How to Storyboard a Script: From Words to Shots | Filmmaker Genius",
      seoDesc: "How to storyboard a script — reading a screenplay for its images, breaking a scene into shots, deciding how many shots you need, and where one shot becomes the next. Chapter 3 of Storyboarding for Filmmakers.",
      body: `
    <p>A screenplay describes <em>what happens</em>, not <em>how it's shot.</em> "She walks into the room and sees the letter" is one line of script — but it could be one shot or five, filmed a dozen different ways. Turning that sentence into a specific set of panels is the act of <strong>storyboarding a script,</strong> and it comes down to a skill directors call <em>coverage:</em> deciding how to break a moment into shots. Before you draw anything, you make these decisions on the page.</p>

    <h2>Read for the visuals, not the story</h2>

    <p>You already know the story — now read the scene again with a different question: <em>what does the camera see, moment to moment?</em> Go through the scene and identify the visual beats — the distinct things the audience needs to look at as the scene unfolds. Take this line:</p>

    <div class="script-sample">
      <div class="sl">INT. APARTMENT — NIGHT</div>
      MAYA enters, shaking off the rain. <span class="shotmark">[she sees it]</span> Across the room, a single letter sits on the table. <span class="shotmark">[the letter]</span> She crosses to it, slowly. <span class="shotmark">[her approach]</span> Her hand hovers, then picks it up. <span class="shotmark">[insert: hand + letter]</span> Her face falls. <span class="shotmark">[her reaction]</span>
    </div>

    <p>One line of action, and you can already feel five potential shots: Maya entering (wide), what she sees (her POV or a wide of the letter), her approach (medium, moving), the letter in her hand (close insert), and her reaction (close-up). Reading for visuals means spotting those beats — the natural places where the audience's attention shifts and a new shot wants to begin.</p>

    <div class="pullquote">The script gives you the moments. Coverage is deciding how many shots each moment needs, and what each one should see. That's where storytelling in pictures begins.</div>

    <h2>How many shots does a scene need?</h2>

    <p>There's no fixed answer — it depends on the scene's pace, emotion, and importance. But a few guiding principles:</p>

    <ul class="spec-list">
      <li><b>Every scene needs enough coverage to cut.</b> At minimum you usually want a wide (to establish the space) and closer shots (to see faces and details). One locked-off wide for a whole dialogue scene will feel flat.</li>
      <li><b>Cut on a change.</b> A new shot earns its place when something shifts — a new subject, a beat of emotion, a movement, a reveal. If nothing changes, you probably don't need a new shot.</li>
      <li><b>More shots = more emphasis and pace.</b> Cutting quickly between many shots raises energy; holding on fewer, longer shots slows things down and builds intimacy. The <em>number</em> of shots is a storytelling choice, not just logistics.</li>
      <li><b>Serve the moment, not your ego.</b> A quiet conversation may need only a handful of shots; a chase may need dozens. Match the coverage to what the scene is actually doing.</li>
    </ul>

    <h2>Think in shots, then panels</h2>

    <p>The workflow is: break the scene into a numbered list of shots first (this is essentially the shot list, Chapter IX), <em>then</em> draw a panel for each. Don't try to draw and decide coverage at the same time — separate the thinking ("what are my shots?") from the drawing ("what does shot 3 look like?"). Once you have your list — Shot 1: wide, Maya enters; Shot 2: the letter; Shot 3: her approach; and so on — you have the skeleton of the board. Every panel you draw from here answers to a shot on that list.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When I read a scene to board it, I literally put a little mark in the margin every time I feel the audience's eye <em>wanting</em> to move — to a new face, a key object, a reaction. Those marks become my shots. It sounds simple, but it retrains how you read: you stop following the story and start following the <em>camera.</em> The best storyboard artists and directors have this almost as a reflex — they can't read a scene without unconsciously cutting it into shots. That instinct is what this whole module is building in you.</p>
    </div>

    <p>You can now turn a page of script into a list of shots. But to describe each shot precisely — and draw it — you need the vocabulary of framing: wide, medium, close, and the rest. The language of shots is next.</p>
`,
      takeaways: [
        "A script describes what happens; storyboarding is deciding how to break each moment into shots (coverage).",
        "Read the scene for visual beats — the natural places the audience's attention shifts and a new shot begins.",
        "Cut on a change; the number of shots is a storytelling choice that controls pace, emphasis, and energy.",
        "Break the scene into a numbered shot list first, then draw a panel for each — separate deciding from drawing.",
      ],
    },
    {
      slug: "storyboard-shot-types",
      num: 4,
      roman: "IV",
      title: "The Language of Shots",
      desc: "Wide, medium, close — the language of shots",
      time: "10 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      dek: `"Wide," "medium," "close-up" — these aren't just camera settings, they're words in a language. Every framing sends the audience a different emotional signal. Learn the vocabulary and you can speak in pictures.`,
      seoTitle: "Storyboard Shot Types: The Language of Shots | Filmmaker Genius",
      seoDesc: "The storyboard shot types every filmmaker needs — wide, medium, close-up, extreme close-up, over-the-shoulder, POV — plus camera angles, and how framing tells the story. Chapter 4 of Storyboarding for Filmmakers.",
      body: `
    <p>To describe your shots — on a shot list, to your cinematographer, or in your own head — you need a shared vocabulary. The <strong>shot types</strong> are the basic words of that language, and they're defined mostly by <em>how much of the subject the frame includes.</em> The tighter the frame, the more intense and intimate the shot. Learning these terms does two things: it lets you communicate precisely, and it teaches you that framing is a storytelling <em>choice</em>, not a default.</p>

    <h2>The core shot sizes</h2>

    <div class="shots-grid">
      <div class="shot-cell">
        <div class="shot-fr"><svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMax meet"><circle class="fig" cx="50" cy="45" r="4"/><line class="fig" x1="50" y1="49" x2="50" y2="62"/><line class="fig" x1="44" y1="54" x2="56" y2="54"/><line class="fig" x1="50" y1="62" x2="45" y2="72"/><line class="fig" x1="50" y1="62" x2="55" y2="72"/></svg></div>
        <div class="shot-lab"><b>Wide / Long</b><span>Full body + space</span></div>
      </div>
      <div class="shot-cell">
        <div class="shot-fr"><svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMax meet"><circle class="fig" cx="50" cy="30" r="9"/><path class="fig" d="M35 75 Q35 46 50 46 Q65 46 65 75"/></svg></div>
        <div class="shot-lab"><b>Medium</b><span>Waist up</span></div>
      </div>
      <div class="shot-cell">
        <div class="shot-fr"><svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMax meet"><circle class="fig" cx="50" cy="34" r="22"/><path class="fig" d="M20 75 Q22 56 50 56 Q78 56 80 75"/></svg></div>
        <div class="shot-lab"><b>Close-Up</b><span>The face</span></div>
      </div>
      <div class="shot-cell">
        <div class="shot-fr"><svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMax meet"><ellipse class="fig" cx="50" cy="40" rx="40" ry="34"/><circle class="fig" cx="38" cy="34" r="5"/><circle class="fig" cx="62" cy="34" r="5"/></svg></div>
        <div class="shot-lab"><b>Extreme CU</b><span>Eyes / detail</span></div>
      </div>
    </div>

    <ul class="spec-list">
      <li><b>Wide / Long shot (WS/LS).</b> Shows the subject in their full environment. Establishes <em>where</em> we are and how figures relate to the space. Feels observational, epic, or isolating.</li>
      <li><b>Medium shot (MS).</b> Roughly waist-up. The "conversation" shot — close enough to read expression, wide enough to see gesture. The workhorse of most scenes.</li>
      <li><b>Close-up (CU).</b> Fills the frame with the face. This is where emotion lives — we're right there with the character. Use it for your most important beats.</li>
      <li><b>Extreme close-up (ECU).</b> Just the eyes, or a single detail (a trembling hand, a key, a trigger). Intense, urgent, revealing. Powerful because it's rare.</li>
    </ul>

    <h2>The relational shots</h2>

    <p>Beyond size, some shots are defined by <em>perspective</em> — where the camera stands relative to the characters:</p>

    <ul class="spec-list">
      <li><b>Over-the-shoulder (OTS).</b> Shot from behind one character's shoulder onto another. The backbone of dialogue — it puts us in the conversation and shows who's talking to whom.</li>
      <li><b>Point of view (POV).</b> What a character sees, as if through their eyes. Puts the audience directly in their experience.</li>
      <li><b>Two-shot.</b> Two characters in one frame — shows their relationship and physical dynamic in a single image.</li>
      <li><b>Insert.</b> A close shot of an object or detail (the letter, the phone screen) cut into the scene to make sure the audience catches it.</li>
    </ul>

    <h2>And the angle</h2>

    <p>Framing answers "how much"; the <em>angle</em> answers "from where," and it carries its own meaning:</p>

    <ul class="spec-list">
      <li><b>Eye level</b> — neutral, natural, the default.</li>
      <li><b>Low angle</b> (looking up) — makes the subject powerful, dominant, or heroic.</li>
      <li><b>High angle</b> (looking down) — makes the subject small, weak, or vulnerable.</li>
      <li><b>Dutch / canted</b> (tilted) — unease, tension, disorientation.</li>
    </ul>

    <div class="pullquote">A close-up on a low angle says something completely different from a wide shot on a high angle. Every framing choice is a sentence in the language your camera speaks.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The mistake beginners make is treating shot size as a technical decision — "I'll get a wide and a couple of close-ups" — instead of an <em>emotional</em> one. The right question isn't "what coverage do I need?" but "how close do I want the audience to feel <em>right now?</em>" Pull back and they observe; push in and they empathize; go to an extreme close-up and they can't escape. When you board, choose each framing for what you want the audience to <em>feel</em> at that beat. That's the difference between coverage and storytelling.</p>
    </div>

    <p>You now know how to break a script into shots and how to name and choose each one. That completes your foundation. In Module 2, we finally pick up the pencil — starting with the most liberating lesson in the course: how to draw a storyboard even if you can't draw. That's next.</p>
`,
      takeaways: [
        "Shot sizes run wide → medium → close-up → extreme close-up — the tighter the frame, the more intimate and intense.",
        "Relational shots (OTS, POV, two-shot, insert) are defined by perspective, not just size.",
        "Angle adds meaning: low = powerful, high = weak, dutch = unease, eye level = neutral.",
        "Choose each framing for what you want the audience to feel — it's an emotional choice, not a technical one.",
      ],
    },
    {
      slug: "how-to-draw-a-storyboard",
      num: 5,
      roman: "V",
      title: "How to Draw a Storyboard",
      desc: "You don't need to draw — stick figures and boxes work",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `Here's the secret that unlocks storyboarding for everyone: <em>you don't need to be able to draw.</em> Stick figures and boxes communicate everything a shot needs. Clarity, not artistry, is the whole game.`,
      seoTitle: "How to Draw a Storyboard (Even If You Can't Draw) | Filmmaker Genius",
      seoDesc: "How to draw a storyboard even if you can't draw — stick figures, boxes and arrows, the storyboard template, and why clarity beats artistry. Chapter 5 of Storyboarding for Filmmakers.",
      body: `
    <p>The number-one reason filmmakers avoid storyboarding is a myth: "I can't draw." Let's kill it right now. A storyboard is not an illustration — it's <em>information.</em> Its only job is to communicate the framing, composition, and movement of a shot clearly enough that you (and your crew) understand it. A stick figure does that perfectly. A crude box for a table, a circle for a head, an arrow for a move — that's a professional-grade storyboard. Some of the most useful boards ever drawn on real film sets look like a child made them, and they worked flawlessly. Here's how to draw one.</p>

    <h2>The whole visual vocabulary</h2>

    <p>You can board any shot in the world with about five marks:</p>

    <ul class="spec-list">
      <li><b>The frame.</b> A box in the aspect ratio of your film (roughly 16:9). Everything happens inside it — that's what the camera sees.</li>
      <li><b>Stick figures for people.</b> A circle head, a line body, a few limbs. Their <em>size and position in the frame</em> is what matters — that's your shot size and composition.</li>
      <li><b>Simple shapes for objects and sets.</b> A rectangle is a table, a door, a car. A horizon line is the ground. Label anything unclear with a word.</li>
      <li><b>Arrows for movement.</b> One arrow for how the camera moves, another (a different style) for how the subject moves. (Full arrow language is Chapter VII.)</li>
      <li><b>A caption.</b> Under each panel: shot number, shot type ("WS," "CU"), a line of action, and any note.</li>
    </ul>

    <div class="draw-panel">
      <div class="draw-frame"><svg viewBox="0 0 100 56">
        <rect class="box" x="10" y="40" width="34" height="10"/>
        <circle class="fig" cx="66" cy="20" r="6"/>
        <line class="fig" x1="66" y1="26" x2="66" y2="40"/>
        <line class="fig" x1="60" y1="31" x2="72" y2="31"/>
        <line class="fig" x1="66" y1="40" x2="61" y2="50"/>
        <line class="fig" x1="66" y1="40" x2="71" y2="50"/>
        <path class="arrow" d="M78 30 L58 30"/><path class="arrow" d="M62 26 L58 30 L62 34"/>
      </svg></div>
      <div class="draw-cap"><span>Sh 3 · MS — Maya crosses to the table</span><b>→ she moves left</b></div>
    </div>

    <p>That took ten seconds and no talent. A table, a stick figure, an arrow, a caption — and anyone can read exactly what this shot is: a medium shot of a character crossing left toward a table. That's all a panel ever has to do.</p>

    <div class="pullquote">A storyboard is judged by one question: can someone else look at it and understand the shot? If yes, it's a great storyboard — no matter how ugly it is.</div>

    <h2>Use a template</h2>

    <p>Don't draw your frames freehand — work on a <strong>storyboard template:</strong> a page pre-printed with several empty boxes in your film's aspect ratio, each with a space beneath for the caption. Templates keep your frames consistent, save time, and make the board easy to read as a sequence. You can print one, use a notebook, or work in software. Consistent frames matter because the storyboard is read as a <em>flow</em> — panel to panel — and uniform boxes let the eye move smoothly through the sequence.</p>

    <h2>What actually matters in the drawing</h2>

    <p>Since artistry is off the table, focus your effort on the things that carry real information:</p>

    <ul class="spec-list">
      <li><b>Framing &amp; size.</b> How big is the figure in the box? That's your shot size — get it right.</li>
      <li><b>Composition.</b> Where in the frame are things placed — left, right, foreground, background? (Chapter VI.)</li>
      <li><b>Eyelines &amp; direction.</b> Which way are people looking and facing? A tiny arrow or a dot for a nose fixes this.</li>
      <li><b>Movement.</b> Arrows showing the change during the shot.</li>
      <li><b>Clarity over detail.</b> If a panel is confusing, add a word. A label ("KITCHEN," "gun on table") beats a fussy drawing every time.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I have boarded entire films with stick figures, and no cinematographer ever once said "your drawings are bad." They said "got it" and set up the shot. Because the board isn't there to impress — it's there to <em>communicate.</em> The moment you let go of "I can't draw," storyboarding becomes available to you, and it's one of the highest-value skills a filmmaker can have. If you can draw a box and a stick figure, you can storyboard. And if you truly can't face even that, the tools now draw the panels for you — but the <em>thinking</em>, deciding your shots, is still yours, and it's the part that matters.</p>
    </div>

    <p>You can now draw a clear panel for any shot. Next we go a level deeper — from "what's in the frame" to "where in the frame," and how arranging things well makes a shot feel intentional and strong. Composing the frame is next.</p>
`,
      takeaways: [
        "You don't need to draw well — a storyboard is information, not illustration.",
        "You can board any shot with a frame box, stick figures, simple shapes, arrows, and a caption.",
        "Work on a template for consistent frames — the board is read as a flowing sequence.",
        "Put your effort into framing, composition, eyelines, and movement — clarity over detail, and label when unclear.",
      ],
    },
    {
      slug: "storyboard-composition",
      num: 6,
      roman: "VI",
      title: "Composing the Frame",
      desc: "Framing, angle, and what to put where in the frame",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `Knowing the shot size tells you how much to include. Composition tells you where to <em>put</em> it. A few simple principles turn a flat, centered panel into an image that feels intentional and alive.`,
      seoTitle: "Storyboard Composition: Composing the Frame | Filmmaker Genius",
      seoDesc: "Storyboard composition — the rule of thirds, headroom and lead room, foreground and depth, and balance, so every panel you draw feels intentional and strong. Chapter 6 of Storyboarding for Filmmakers.",
      body: `
    <p>Two directors can shoot the same shot size of the same subject and get completely different images — because of <strong>composition:</strong> how the elements are arranged <em>within</em> the frame. Composition is what makes a shot feel deliberate instead of accidental, dynamic instead of dead. And here's the good news for storyboarding: composition is exactly the kind of thing a rough panel captures perfectly, because it's about <em>placement,</em> not drawing skill. A stick figure in the right spot beats a beautiful figure dead-center. Let's cover the handful of principles that matter most.</p>

    <h2>The rule of thirds</h2>

    <p>The most famous compositional guide, and the most useful. Imagine the frame divided into thirds by two vertical and two horizontal lines — like a tic-tac-toe grid. Placing your key subject <em>on</em> those lines, or on one of the four points where they cross, is more dynamic and pleasing than dead-centering it.</p>

    <div class="thirds">
      <div class="thirds-frame"><svg viewBox="0 0 96 54">
        <line class="grid" x1="32" y1="0" x2="32" y2="54"/><line class="grid" x1="64" y1="0" x2="64" y2="54"/>
        <line class="grid" x1="0" y1="18" x2="96" y2="18"/><line class="grid" x1="0" y1="36" x2="96" y2="36"/>
        <circle class="node" cx="32" cy="18" r="2.2"/><circle class="node" cx="64" cy="18" r="2.2"/><circle class="node" cx="32" cy="36" r="2.2"/><circle class="node" cx="64" cy="36" r="2.2"/>
        <circle class="fig" cx="64" cy="20" r="5"/><line class="fig" x1="64" y1="25" x2="64" y2="40"/><line class="fig" x1="59" y1="30" x2="69" y2="30"/>
      </svg></div>
      <div class="thirds-cap">Subject placed on the right-third line, eyes near the upper-right <b>power point</b> — not centered.</div>
    </div>

    <p>Notice the figure's eyes land near an intersection. That's the instinct to build: put what matters — usually a character's eyes — on or near a thirds line, and leave the rest of the frame to breathe.</p>

    <h2>Headroom and lead room</h2>

    <ul class="spec-list">
      <li><b>Headroom.</b> The space above a subject's head. Too much makes them look small and lost in the frame; too little feels cramped and cuts them off. Aim for a comfortable margin — and note that tighter shots need <em>less</em> headroom.</li>
      <li><b>Lead room (nose/look room).</b> Leave space in the direction a subject faces or moves. A character looking screen-right wants room on the right to "look into." Crowding them against the edge they face feels wrong and tense — useful when you <em>want</em> tension, jarring when you don't.</li>
    </ul>

    <div class="pullquote">Where you place a figure in the frame is a decision about power, comfort, and attention. Centered isn't neutral — it's just one choice, and usually the least interesting one.</div>

    <h2>Foreground, depth, and layers</h2>

    <p>A frame isn't flat — it has <em>depth,</em> and using it makes an image richer and more three-dimensional. Think in three planes: <strong>foreground, midground, background.</strong> Putting something in the foreground (a doorway, an out-of-focus shoulder, an object) frames the subject and creates a sense of space and place. Even in a rough storyboard, indicating a foreground element — a shape at the bottom or edge of the panel — tells your cinematographer you want depth, and instantly makes the shot feel more cinematic. Layers turn a flat drawing into a world.</p>

    <h2>Balance, lines, and the eye</h2>

    <ul class="spec-list">
      <li><b>Balance.</b> Distribute visual weight across the frame so it doesn't feel lopsided — unless a deliberate imbalance creates unease you want.</li>
      <li><b>Leading lines.</b> Roads, hallways, edges, and glances naturally draw the eye. Point them at your subject to guide attention.</li>
      <li><b>Framing within the frame.</b> Doorways, windows, and arches around a subject focus attention and add depth.</li>
      <li><b>Negative space.</b> Empty areas aren't wasted — they give the eye rest and can make a lone subject feel isolated or small.</li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Composition is where the storyboard quietly does its most important work, because it forces you to make these choices <em>in advance</em> instead of discovering them by accident on set. When I board, I ask of every panel: where are the eyes, which way is the lead room, is there a foreground layer, and is the frame balanced the way I want? Answering those on paper means I arrive on set with intentional images instead of centered snapshots. And because it's all about placement, my ugly little stick figures capture it just as well as a beautiful drawing would. Composition is the most learnable, highest-impact skill in this whole course.</p>
    </div>

    <p>Your panels now have strong, intentional composition. But a single frame only shows one instant — and shots often <em>move.</em> Next you'll learn to show camera and subject motion inside a still panel, using the language of arrows. Camera movement and arrows is next.</p>
`,
      takeaways: [
        "Composition is about placement, which rough panels capture perfectly — a stick figure in the right spot beats a centered masterpiece.",
        "Use the rule of thirds — place key subjects (and eyes) on the lines or intersection points, not dead center.",
        "Mind headroom and lead room — leave space in the direction a subject faces or moves.",
        "Build depth with foreground/midground/background layers, and guide the eye with balance, lines, and negative space.",
      ],
    },
    {
      slug: "storyboard-arrows-and-symbols",
      num: 7,
      roman: "VII",
      title: "Camera Movement & Arrows",
      desc: "Showing camera and subject movement with arrows",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `A shot isn't always frozen — the camera pans, pushes in, cranes up; the subject walks, turns, runs. A storyboard shows all that motion inside a still frame with one simple, universal tool: the arrow.`,
      seoTitle: "Storyboard Arrows & Symbols: Showing Camera Movement | Filmmaker Genius",
      seoDesc: "Storyboard arrows and symbols — how to show camera movement (pan, tilt, dolly, zoom) and subject movement in a still panel, and the standard notation storyboards use. Chapter 7 of Storyboarding for Filmmakers.",
      body: `
    <p>A storyboard panel is a single frozen image, but film moves — so how do you show a camera pushing in, or a character running across frame, in one still drawing? The answer is a small, standardized set of <strong>arrows and symbols.</strong> Once you know them, you can pack an entire moving shot into one panel, and any crew member can read exactly what the camera and the subjects are meant to do. This notation is nearly universal, so learning it lets you read professional boards and write your own.</p>

    <h2>Two kinds of movement, two kinds of arrows</h2>

    <p>The single most important distinction: is it the <em>camera</em> moving, or the <em>subject?</em> Storyboards keep these visually separate so there's no confusion — one common convention is a bold or colored arrow for camera moves and a thinner arrow for subject moves. Whatever style you choose, be consistent and add a note if there's any doubt.</p>

    <div class="arrow-legend">
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><circle class="fig" cx="35" cy="26" r="6"/><line class="fig" x1="35" y1="32" x2="35" y2="46"/><path class="cam" d="M20 54 H74"/><path class="cam" d="M68 49 L74 54 L68 59"/></svg></div>
        <div class="arrow-lab"><b>Pan →</b><span>Camera pivots L↔R</span></div>
      </div>
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><rect class="fig" x="30" y="20" width="40" height="26" rx="2"/><path class="cam" d="M50 56 V16"/><path class="cam" d="M45 22 L50 16 L55 22"/></svg></div>
        <div class="arrow-lab"><b>Tilt ↑</b><span>Camera pivots up/down</span></div>
      </div>
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><circle class="fig" cx="50" cy="28" r="8"/><line class="fig" x1="50" y1="36" x2="50" y2="50"/><rect class="cam" x="22" y="12" width="56" height="38" rx="2"/><path class="cam" d="M40 44 L50 50 L60 44"/><path class="cam" d="M40 18 L50 12 L60 18"/></svg></div>
        <div class="arrow-lab"><b>Push in / Zoom</b><span>Frame tightens on subject</span></div>
      </div>
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><circle class="fig" cx="30" cy="26" r="6"/><line class="fig" x1="30" y1="32" x2="30" y2="46"/><path class="cam" d="M46 30 H80" stroke-dasharray="0"/><path class="cam" d="M74 25 L80 30 L74 35"/><text x="52" y="20" fill="#ffd24a" font-size="9" font-family="monospace">DOLLY</text></svg></div>
        <div class="arrow-lab"><b>Dolly / Track</b><span>Whole camera travels</span></div>
      </div>
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><circle class="subj" cx="26" cy="24" r="6"/><line class="subj" x1="26" y1="30" x2="26" y2="44"/><path class="subj" d="M40 34 H78"/><path class="subj" d="M72 29 L78 34 L72 39"/></svg></div>
        <div class="arrow-lab"><b>Subject moves</b><span>Character walks in frame</span></div>
      </div>
      <div class="arrow-cell">
        <div class="arrow-fr"><svg viewBox="0 0 100 62"><circle class="fig" cx="50" cy="26" r="7"/><line class="fig" x1="50" y1="33" x2="50" y2="47"/><path class="cam" d="M30 54 Q50 40 70 54"/><path class="cam" d="M64 50 L70 54 L64 58"/></svg></div>
        <div class="arrow-lab"><b>Crane / Boom</b><span>Camera rises or arcs</span></div>
      </div>
    </div>

    <h2>The core moves to know</h2>

    <ul class="spec-list">
      <li><b>Pan</b> — the camera pivots left or right on a fixed point. Horizontal arrow across the frame.</li>
      <li><b>Tilt</b> — the camera pivots up or down. Vertical arrow.</li>
      <li><b>Dolly / track</b> — the whole camera physically moves (forward, back, or alongside). An arrow, usually labeled, showing the travel.</li>
      <li><b>Zoom / push-in</b> — the framing tightens (zoom optically, push-in physically). Often shown by a smaller box drawn inside the frame with arrows pointing inward, marking where the shot ends.</li>
      <li><b>Crane / boom</b> — the camera rises, drops, or sweeps through space. A curved or vertical arrow.</li>
      <li><b>Subject movement</b> — a character or object moving through frame. A separate-style arrow tracing their path.</li>
    </ul>

    <h2>Show the start and the end</h2>

    <p>For a moving shot, the clearest panels show <em>where the shot begins and where it ends.</em> A common technique for a push-in or a reframing move: draw the starting frame, then draw a second box inside it (or a second panel) showing the ending frame, with an arrow indicating the move between them. For a character crossing, you might sketch them at the start position and again where they end, joined by an arrow. When a move is complex — a long developing shot — don't force it into one panel; use two or three panels to show the beginning, middle, and end of the move. Clarity always wins over cleverness.</p>

    <div class="pullquote">An arrow is a verb. It turns a frozen drawing into a shot that moves — and tells the whole crew, in one glance, what the camera is about to do.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The one rule I never break with arrows: <em>never leave a move ambiguous.</em> If a panel could be read two ways — is the camera pushing in, or is the actor walking toward it? — I add a label. "PUSH IN," "MAYA EXITS L," "CRANE UP." Five seconds of writing saves a five-minute argument on set. Storyboards fail not when the drawing is ugly but when the <em>movement</em> is unclear, because that's the part words on a script never captured in the first place. Make your motion unmistakable and your board becomes bulletproof.</p>
    </div>

    <p>You can now draw, compose, and animate a single panel. The final craft skill is stringing panels together so the whole scene <em>reads</em> as a continuous, coherent piece of film — the flow and the rules that keep it from falling apart. Sequencing and continuity is next.</p>
`,
      takeaways: [
        "Arrows show movement in a still panel — keep camera-move arrows and subject-move arrows visually distinct.",
        "Learn the core moves: pan, tilt, dolly/track, zoom/push-in, crane/boom, and subject movement.",
        "Show the start and end of a move — inner boxes, a second position, or extra panels for complex moves.",
        "Never leave a move ambiguous — a quick label beats an on-set argument every time.",
      ],
    },
    {
      slug: "how-to-storyboard-a-scene",
      num: 8,
      roman: "VIII",
      title: "Sequencing & Continuity",
      desc: "Sequencing a scene and keeping it continuous",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      dek: `A great panel is worthless if it doesn't cut to the next one. Storyboarding a whole scene means thinking about flow — and following the rules that keep an audience oriented instead of confused.`,
      seoTitle: "How to Storyboard a Scene: Sequencing & Continuity | Filmmaker Genius",
      seoDesc: "How to storyboard a scene as a sequence — the 180-degree rule, eyeline and screen direction, matching action across cuts, and making panels flow like an edit. Chapter 8 of Storyboarding for Filmmakers.",
      body: `
    <p>So far you've been drawing single shots. But a scene is a <em>sequence</em> — panels that will be cut together — and the storyboard's real magic is that it lets you <strong>pre-edit the scene on paper.</strong> Flip through your panels and you're watching a rough cut of the movie before you've shot a frame. This is where you discover whether your shots actually flow, or whether they clash and confuse. And it's where a handful of filmmaking rules — especially the famous 180-degree rule — become essential, because breaking them accidentally is the fastest way to disorient an audience.</p>

    <h2>Board the scene, then "play" it</h2>

    <p>Once you've drawn all the panels for a scene, read them in order as if you're the audience watching the edit. This flip-through is a superpower:</p>

    <ul class="spec-list">
      <li><b>Feel the rhythm.</b> Does the scene build? Are there too many similar shots in a row? Does a key moment get the close-up it deserves?</li>
      <li><b>Check that shots cut together.</b> Does each panel flow into the next, or does a jump feel jarring?</li>
      <li><b>Spot the gaps.</b> Is there a shot you're missing to make a transition work? Better to find it now than in the edit.</li>
    </ul>

    <p>You're editing before you shoot — catching pacing and coverage problems while they're still free to fix.</p>

    <h2>The 180-degree rule</h2>

    <p>The most important continuity rule, and the one storyboards are perfect for planning. Imagine an invisible line (the "axis") running through the two people or key points in your scene. <strong>Keep your camera on one side of that line.</strong> As long as you do, everyone stays on the same side of the frame from shot to shot, and eyelines match. Cross the line, and suddenly characters appear to swap sides or look the wrong way — the audience gets disoriented without knowing why.</p>

    <div class="diag180">
      <div class="diag180-fr"><svg viewBox="0 0 96 60">
        <line class="line" x1="8" y1="30" x2="88" y2="30"/>
        <circle class="actor" cx="34" cy="30" r="4"/><circle class="actor" cx="62" cy="30" r="4"/>
        <path class="ok" d="M30 46 l4 -6 l4 6 z"/><path class="ok" d="M58 46 l4 -6 l4 6 z"/>
        <path class="no" d="M44 12 l4 6 l4 -6 z"/>
        <text x="20" y="55" fill="rgba(0,212,170,.7)" font-size="6" font-family="monospace">OK side</text>
        <text x="40" y="9" fill="#ec6a6a" font-size="6" font-family="monospace">crosses line ✕</text>
      </svg></div>
      <div class="diag180-cap">Keep cameras on <b>one side</b> of the axis (green). A camera across the line (red) flips screen direction.</div>
    </div>

    <p>You can absolutely cross the line on purpose — for effect, or via a moving shot that carries the audience across so they follow it. The rule isn't "never cross"; it's "never cross <em>by accident.</em>" A storyboard lets you see your camera positions laid out and catch an unintentional line-cross before it wrecks a scene in the edit.</p>

    <h2>Screen direction and eyelines</h2>

    <ul class="spec-list">
      <li><b>Eyeline match.</b> When one character looks at another across a cut, their gazes must aim toward each other. If A looks screen-right at B, then B's shot should have B looking screen-left. Boarding both shots side by side makes mismatches obvious.</li>
      <li><b>Screen direction.</b> If a character exits frame-right, they should enter the next shot from frame-left, so their travel reads as continuous. Same for a car, a chase, a thrown ball — consistent direction keeps geography clear.</li>
      <li><b>Match on action.</b> When you cut mid-movement (a hand reaching, a door opening), the action should continue smoothly across the cut. Panels help you plan where the cut lands.</li>
    </ul>

    <div class="pullquote">The storyboard is the cheapest edit suite in the world. You cut the scene together in your head, catch the continuity errors on paper, and arrive on set already knowing it works.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Continuity errors are heartbreaking because you usually can't fix them — you discover in the edit that two shots won't cut together because someone crossed the line or an eyeline is wrong, and by then the set is struck and the actors are gone. The storyboard is your insurance against exactly this. When I board a dialogue scene, I sketch a little overhead map of where the camera goes for each shot, draw the axis, and make sure I stay on one side. Five minutes of planning saves a scene that would otherwise be broken forever. This is the single most practical reason to board.</p>
    </div>

    <p>You've now mastered the full craft — drawing, composing, animating, and sequencing panels into a coherent scene. That completes Module 2. In Module 3 we take the board out of the drawing pad and onto the set and screen: shot lists, action and genre, animatics, and software. Shot lists and the storyboard is next.</p>
`,
      takeaways: [
        "Board the whole scene, then flip through the panels to \"pre-edit\" it — checking rhythm, flow, and gaps.",
        "The 180-degree rule: keep the camera on one side of the axis so screen positions and eyelines stay consistent.",
        "Watch eyeline match, screen direction, and match on action across cuts — boarding shots side by side exposes errors.",
        "The board is a free edit suite — catch continuity mistakes on paper, since they're often unfixable in the edit.",
      ],
    },
    {
      slug: "shot-list-vs-storyboard",
      num: 9,
      roman: "IX",
      title: "Shot Lists & the Storyboard",
      desc: "Shot list vs. storyboard, and how they work together",
      time: "9 min",
      moduleKey: "apply",
      kicker: "From Board to Set",
      dek: `The storyboard shows what each shot looks like. The shot list is its practical twin — a checklist you actually run the day from. Together they're the two documents that get your board onto the set.`,
      seoTitle: "Shot List vs Storyboard: How They Work Together | Filmmaker Genius",
      seoDesc: "Shot list vs storyboard — the difference between the two, what a shot list includes, and how the board and the list work together to plan and run a shoot. With an example shot list. Chapter 9 of Storyboarding for Filmmakers.",
      body: `
    <p>People often ask which they need — a storyboard or a <strong>shot list</strong>. The answer is usually <em>both,</em> because they do different jobs. A storyboard <em>shows</em> you the shots (visual); a shot list <em>lists</em> them (text). The board answers "what does this look like?"; the list answers "what do we need to get, and have we got it?" On set, the storyboard is your creative reference and the shot list is your operational checklist — the thing the AD ticks off as the day goes. Understanding <strong>shot list vs storyboard</strong>, and how they pair, is what turns your board into a shootable plan.</p>

    <h2>What a shot list is</h2>

    <p>A shot list is a table — one row per shot — capturing the practical facts of each shot you plan to get. It's built from the same coverage decisions as your board (remember, in Chapter III you made the shot list <em>first,</em> then drew panels for it). A typical shot list looks like this:</p>

    <div class="shotlist">
      <table>
        <tr><th>Shot</th><th>Size</th><th>Angle / Move</th><th>Description</th></tr>
        <tr><td class="n">42A</td><td class="sz">WS</td><td>Static</td><td>Maya enters, shakes off rain</td></tr>
        <tr><td class="n">42B</td><td class="sz">POV</td><td>Static</td><td>The letter on the table</td></tr>
        <tr><td class="n">42C</td><td class="sz">MS</td><td>Dolly in</td><td>Maya crosses to the table</td></tr>
        <tr><td class="n">42D</td><td class="sz">CU</td><td>Static (insert)</td><td>Her hand picks up the letter</td></tr>
        <tr><td class="n">42E</td><td class="sz">CU</td><td>Slow push</td><td>Her reaction — face falls</td></tr>
      </table>
    </div>

    <p>Each row can carry more columns as needed — lens, equipment, cast in the shot, location, estimated time, notes. The list becomes the master inventory of coverage: every shot you intend to capture, in one scannable place.</p>

    <h2>Why you want both</h2>

    <ul class="spec-list">
      <li><b>The board is for vision; the list is for execution.</b> You look at the board to remember <em>how</em> you wanted the shot; you work off the list to make sure you <em>got</em> it.</li>
      <li><b>The list is faster to run a day from.</b> Ticking off "42A ✓, 42B ✓" keeps the shoot moving and ensures nothing's forgotten before you leave a setup.</li>
      <li><b>The list drives scheduling and gear.</b> The AD and cinematographer use it to plan the order of the day, the lenses, and the equipment — it feeds straight into the shot-by-shot plan.</li>
      <li><b>They cross-reference.</b> A shot list often notes the storyboard panel number, and a board panel carries its shot number — so you can jump between "what it looks like" and "what we need" instantly.</li>
    </ul>

    <div class="pullquote">The storyboard is the movie you want. The shot list is the checklist that makes sure you leave the location with all of it. You need the dream and the ledger.</div>

    <h2>How they work together on the day</h2>

    <p>In practice, the two live side by side. The director keeps the storyboard as a creative touchstone — glancing at a panel to recall the exact framing and feel of a shot before setting it up. The 1st AD and script supervisor run the shot list, checking off each shot as it's captured and flagging anything skipped. When time gets tight (and it always does), the list is what lets you make smart triage decisions: you can see at a glance which shots are essential and which are "nice to have," and cut coverage intelligently instead of in a panic. Together, board and list make sure you shoot efficiently <em>and</em> get everything you planned.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The shot list is what saves you when the day falls apart — and days always fall apart. When I'm suddenly two hours behind, I don't stare at my beautiful storyboard; I look at my shot list and decide, coldly, which three shots I can drop and still cut the scene together. The board tells me what I dreamed of; the list lets me make the ruthless real-world call. Board for the vision, list for the survival. Bring both to set, every time — and check the list before you ever say "moving on" from a setup.</p>
    </div>

    <p>You've got the tools to plan any ordinary scene. But some scenes are extraordinary — action, stunts, and effects — and they change how you board. And genre itself shapes the visual approach. Storyboarding action and genre is next.</p>
`,
      takeaways: [
        "A storyboard shows the shots visually; a shot list lists them as text — you usually want both.",
        "A shot list is a table (shot #, size, angle/move, description, plus lens/gear/notes) — the master inventory of coverage.",
        "Board = vision, list = execution; the list is faster to run a day from and drives scheduling and gear.",
        "Cross-reference them, and use the list to triage coverage smartly when the day runs short.",
      ],
    },
    {
      slug: "storyboarding-action-scenes",
      num: 10,
      roman: "X",
      title: "Storyboarding Action & Genre",
      desc: "Boarding action, and how genre shapes the board",
      time: "9 min",
      moduleKey: "apply",
      kicker: "From Board to Set",
      dek: `A dialogue scene can be improvised on set. An action scene cannot. This is where storyboarding stops being helpful and becomes <em>mandatory</em> — and where knowing your genre changes how you board.`,
      seoTitle: "Storyboarding Action Scenes (and How Genre Shapes the Board) | Filmmaker Genius",
      seoDesc: "How to storyboard action scenes and how genre shapes the board — beat-by-beat action, stunts and safety, VFX planning, and boarding for horror, comedy, and drama. Chapter 10 of Storyboarding for Filmmakers.",
      body: `
    <p>Everything you've learned works for any scene — but two things raise the stakes on storyboarding: <em>complexity</em> and <em>genre.</em> Complex scenes (action, stunts, effects) are dangerous and expensive to improvise, so they get boarded shot by shot as a matter of safety and money, not just craft. And every genre has its own visual grammar — horror boards differently than comedy — so knowing your genre shapes the shots you choose. This chapter covers how to <strong>storyboard action scenes</strong> and how genre changes the board.</p>

    <h2>Action: board every beat</h2>

    <p>An action sequence — a fight, a chase, a fall, an explosion — is choreography, and you can't wing choreography. You board it in fine detail, often one panel per <em>beat</em> of the action, because so much depends on precise planning:</p>

    <ul class="spec-list">
      <li><b>Safety.</b> Stunts and effects are dangerous. Boarding forces you to plan exactly what happens, so the stunt coordinator, the effects team, and the whole crew know the sequence and can rehearse it safely.</li>
      <li><b>Geography &amp; direction.</b> In fast cutting, the audience loses orientation instantly if screen direction breaks. Board it so the hero always moves the same way, the pursuer stays behind, and the geography reads.</li>
      <li><b>Precision.</b> Action is built from many short shots — an impact, a reaction, a fall — that must cut together perfectly. The board is where you design that rhythm and make sure every piece exists.</li>
      <li><b>Cost.</b> Action is the most expensive thing you can shoot. You cannot afford to figure it out on the day, so you figure it out on paper — completely.</li>
    </ul>

    <p>For action, the board often becomes a full previz plan, sometimes turned into an animatic (next chapter) to test the timing. This is the domain where "we'll figure it out on the day" isn't just wasteful — it's unsafe.</p>

    <div class="pullquote">You can improvise a conversation. You cannot improvise a car flip. Action lives or dies on the board — that's where the sequence is choreographed, made safe, and made to cut.</div>

    <h2>VFX and complex shots</h2>

    <p>Anything involving visual effects, green screen, or compositing needs boarding too, because multiple elements have to line up. If a creature will be added in post, the board shows where it is in frame, how big, and how the actors interact with the empty space — so the plate is shot correctly and the VFX team knows the intent. Boarding a VFX shot is often the only way the on-set crew and the post team share the same picture of an image that doesn't fully exist yet.</p>

    <h2>Genre shapes the board</h2>

    <p>Beyond complexity, the <em>kind</em> of film you're making guides your shot choices. Genre has visual conventions, and your board is where you apply them:</p>

    <ul class="spec-list">
      <li><b>Horror &amp; thriller.</b> Withhold and reveal. Board what the camera <em>doesn't</em> show — negative space, off-screen threats, the slow push toward a doorway. Wides that isolate, tight frames that trap. The board is where you design the dread.</li>
      <li><b>Comedy.</b> Often favors wider, static, longer takes that let physical gags and reactions play without cutting away. Boarding helps you resist over-cutting and let a joke breathe. Timing is everything.</li>
      <li><b>Drama.</b> Coverage that lives on faces — close-ups, subtle push-ins, the emotional beat held. Board where you go close, and where you hold back to give a moment room.</li>
      <li><b>Action &amp; spectacle.</b> Dynamic, varied, kinetic — a mix of scales and angles cut for energy, as above.</li>
    </ul>

    <p>You don't have to follow convention slavishly, but you should know it — because your board is where you decide whether to honor the genre's grammar or deliberately break it.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The clearest way I can put it: the more a scene <em>can't</em> be redone, the more you must board it. A dialogue scene, you can get another take, try another angle, fix it in the edit. A stunt, an effect, a one-time practical event — you get one shot, sometimes literally. That's why action and effects sequences are boarded to the last frame while a quiet two-hander might barely need it. Match your boarding effort to the risk and complexity of the scene. Board the dangerous, expensive, un-repeatable stuff <em>obsessively</em>, and board the simple stuff lightly.</p>
    </div>

    <p>For the most complex sequences, a static board isn't quite enough — you need to see it <em>move</em> and feel its timing. That's what an animatic does, and it leads us into the tools that bring boards to life. Animatics and software is next.</p>
`,
      takeaways: [
        "Action, stunts, and effects must be boarded shot by shot — for safety, geography, precision, and cost.",
        "Board VFX and complex shots so on-set crew and the post team share one picture of an image that doesn't exist yet.",
        "Genre shapes the board — horror withholds, comedy holds wide, drama lives on faces, action stays kinetic.",
        "Match boarding effort to risk — board the dangerous, expensive, un-repeatable scenes obsessively.",
      ],
    },
    {
      slug: "storyboard-software-and-animatics",
      num: 11,
      roman: "XI",
      title: "Animatics & Software",
      desc: "Turning boards into animatics, and the software to use",
      time: "9 min",
      moduleKey: "apply",
      kicker: "From Board to Set",
      dek: `A storyboard shows you the shots; an animatic shows you the <em>timing.</em> And the tools for making both have exploded — from paper and pencil to apps that draw the whole board for you.`,
      seoTitle: "Animatics & Storyboard Software | Filmmaker Genius",
      seoDesc: "Animatics and storyboard software — what an animatic is, how it tests timing, and the tools (from paper to apps to AI) for making storyboards. Chapter 11 of Storyboarding for Filmmakers.",
      body: `
    <p>A storyboard is powerful, but it has one blind spot: it can't show you <em>time.</em> You can flip through panels, but you're guessing at how long each shot holds and how the rhythm feels. An <strong>animatic</strong> fixes that — and modern <strong>storyboard software</strong> makes both the board and the animatic dramatically faster to produce. This chapter covers the tools that bring your board to life, from the humblest pencil to AI-assisted generators.</p>

    <h2>What an animatic is</h2>

    <p>An <strong>animatic</strong> is a storyboard edited into a video — your panels played in sequence, each held for its intended duration, cut together in a video editor and often laid over a scratch soundtrack (temp music, sound effects, even scratch dialogue). It's the next step up from a static board: a rough, moving version of your film built entirely from drawings.</p>

    <p>The magic of an animatic is that it adds the dimension a board can't: <em>timing.</em></p>

    <ul class="spec-list">
      <li><b>It tests pacing.</b> You feel whether the scene drags or rushes, whether a shot holds too long or cuts too fast — before you shoot a frame.</li>
      <li><b>It tests the edit.</b> The cuts play in real time, so you can tell if the sequence actually flows and where it stumbles.</li>
      <li><b>It's essential for complex sequences.</b> For action, VFX, and musical numbers, an animatic is how you nail the choreography and timing in advance — it's standard practice on animated films and big action set pieces.</li>
      <li><b>It communicates the whole idea.</b> Showing a producer or crew a moving animatic conveys your vision far better than a stack of stills.</li>
    </ul>

    <p>You don't need fancy tools — drop your panel images into any video editor, set each to the length you want, add a temp track, and you have an animatic. Rough is fine; it's about timing, not polish.</p>

    <div class="pullquote">A storyboard shows the shots. An animatic shows the movie. The moment your board starts playing in time, you find out whether the scene actually works.</div>

    <h2>The spectrum of storyboard tools</h2>

    <p>How you make a board runs from zero cost to fully automated:</p>

    <ul class="spec-list">
      <li><b>Paper and pencil.</b> The original, and still perfectly professional. A printed template and a pencil is all many working directors ever use. Fast, free, no learning curve.</li>
      <li><b>Drawing apps &amp; tablets.</b> Digital drawing (on a tablet or with a stylus) lets you erase, copy panels, and share easily — a natural upgrade if you like to draw.</li>
      <li><b>Dedicated storyboard software.</b> Programs and web apps built for boarding — think Storyboarder (free), StudioBinder, Boords, and others — give you templates, drag-and-drop panels, shot-list integration, and one-click animatics.</li>
      <li><b>Asset &amp; drag-drop tools.</b> Some tools let you build panels from pre-made characters, sets, and props — great for non-drawers who still want composed frames.</li>
      <li><b>AI &amp; generators.</b> The newest option: describe a shot and the tool <em>draws the panel for you.</em> This removes the drawing barrier entirely, so a filmmaker with no art skill still gets a real, shareable board (and often a matching shot list).</li>
    </ul>

    <h2>Choosing your tool</h2>

    <p>There's no "best" tool — only the best for you and the project. A quick personal short? Pencil and paper is faster than learning software. A complex VFX sequence you need to previz and share with a team? Dedicated software or a generator plus an animatic. If you can't draw and don't want to, a generator gets you a professional-looking board in minutes. The important thing to remember is the lesson from Chapter V: <em>the tool doesn't matter, the thinking does.</em> Whether you draw with a pencil or type a description into an app, <em>you</em> are still deciding the shots, the framing, the coverage — and that decision-making is the real skill this whole course has been building.</p>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The best thing about the new generation of tools is that they finally killed the "I can't draw" excuse for good. For years I watched talented directors skip storyboarding entirely because they were embarrassed by their stick figures — and their shoots suffered for it. Now anyone can produce a clean board and even an animatic, with zero drawing ability. That's a genuine gift. But don't let the tool do your thinking. The generator can draw the panel; it can't decide that <em>this</em> moment wants a low-angle close-up because that's the emotional beat of the scene. That's your job, and it always will be.</p>
    </div>

    <p>You now have the full craft and the full toolkit — from a pencil to an animatic. One chapter remains: the common storyboarding mistakes that make a board useless, gathered as your final checklist. That's the finale.</p>
`,
      takeaways: [
        "An animatic is a storyboard edited into a timed video — it tests the pacing and the edit before you shoot.",
        "Make one by dropping your panels into any video editor, holding each for its length, and adding a temp track.",
        "Tools run from paper and pencil to drawing apps, dedicated software, and AI generators that draw panels for you.",
        "The tool doesn't matter — the thinking does; you still decide the shots, framing, and coverage.",
      ],
    },
    {
      slug: "storyboarding-mistakes",
      num: 12,
      roman: "XII",
      title: "Common Storyboarding Mistakes",
      desc: "The traps that make a storyboard useless",
      time: "8 min",
      moduleKey: "apply",
      kicker: "From Board to Set",
      dek: `A storyboard can help you enormously — or waste your time and mislead your crew. The difference is avoiding a handful of predictable mistakes. Here they are, gathered as your final checklist.`,
      seoTitle: "Common Storyboarding Mistakes to Avoid | Filmmaker Genius",
      seoDesc: "The most common storyboarding mistakes — skipping the board, chasing pretty art over clarity, ignoring the 180-degree rule, treating the board as a straitjacket, and forgetting the shot list. The finale of Storyboarding for Filmmakers.",
      body: `
    <p>You now have the whole craft — from what a storyboard is to how to draw one, sequence it, and bring it to set and screen. This finale gathers the <strong>storyboarding mistakes</strong> that trip up filmmakers, so you can catch them in your own process. The encouraging news, as with every skill, is that they're few and predictable. Steer around these and your board will do exactly what it's meant to: save you time, align your crew, and make your film better.</p>

    <h2>The mistakes that undermine a board</h2>

    <ul class="spec-list">
      <li><b>Not storyboarding at all.</b> The biggest mistake — skipping it to "save time" and paying for it a hundredfold on set. Cure: board, at least the complex scenes (Chapter II).</li>
      <li><b>Chasing pretty art over clarity.</b> Spending hours making panels beautiful instead of clear, or avoiding boarding because "I can't draw." Cure: a storyboard is information; stick figures win (Chapter V).</li>
      <li><b>Unclear framing or movement.</b> Panels a crew can't read — ambiguous shot size, a move that could mean two things. Cure: clear framing, distinct arrows, and a label when in doubt (Chapters V &amp; VII).</li>
      <li><b>Ignoring the 180-degree rule.</b> Boarding shots that won't cut together because you accidentally crossed the line or mismatched an eyeline. Cure: plan your axis; check continuity on paper (Chapter VIII).</li>
      <li><b>Treating the board as a straitjacket.</b> Refusing to deviate on set even when reality offers something better. Cure: the board is a plan, not a prison — adapt (Chapter II).</li>
      <li><b>Boarding without thinking in shots.</b> Drawing pictures of the story instead of specific, filmable shots. Cure: break the scene into a shot list first, then board (Chapter III).</li>
      <li><b>Forgetting the shot list.</b> A gorgeous board and no practical checklist to run the day from. Cure: pair the board with a shot list (Chapter IX).</li>
      <li><b>Over-boarding the simple, under-boarding the hard.</b> Lavishing panels on a two-hander while winging the stunt. Cure: match effort to risk and complexity (Chapter X).</li>
    </ul>

    <div class="pullquote">A storyboard fails for one of two reasons: nobody can read it, or nobody made one. Clarity and effort — get those right and the board does the rest.</div>

    <h2>The mindset that prevents them</h2>

    <p>Almost every mistake above traces to forgetting a single principle this course kept returning to: <em>a storyboard is a communication tool, not an art project.</em> Its whole value is that it lets you make and share visual decisions <em>before</em> they cost anything. Keep that at the center — prioritize clarity over beauty, thinking over drawing, and planning over polish — and you'll board well by instinct. And remember the freedom in it: boarding isn't about locking yourself in, it's about arriving prepared enough to be spontaneous.</p>

    <h2>The final self-check</h2>

    <ul class="spec-list">
      <li><b>Can someone else read my board and understand each shot?</b> If not, it's not doing its job.</li>
      <li><b>Did I think in specific, filmable shots — not just pictures of the story?</b></li>
      <li><b>Do my shots cut together?</b> Flip through and check the flow and the 180-degree line.</li>
      <li><b>Do I have a shot list to run the day from?</b></li>
      <li><b>Did I board the risky, complex scenes most carefully?</b></li>
      <li><b>Am I holding the board loosely enough to improve on it if the day offers something better?</b></li>
    </ul>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Every storyboard mistake I've made came from forgetting <em>why</em> I was boarding. I've wasted evenings prettying up panels nobody needed to be pretty, and I've skipped boarding a scene I was sure was "simple" only to flounder on set. The board is a tool with one job: get the movie out of my head and into a form the crew and I can act on. When I keep that in view, storyboarding is one of the most powerful, time-saving, confidence-building things I do. Board with clarity, board the hard stuff, and hold it loosely. Do that, and you'll walk onto every set knowing your film.</p>
    </div>

    <p>That's the whole craft — from a blank frame to a board, an animatic, and a shootable plan. You can now see your film before you shoot it, and hand that vision to everyone who helps you make it. Now go board something.</p>
`,
      takeaways: [
        "The biggest mistakes: not boarding at all, chasing pretty art over clarity, and unclear framing or movement.",
        "Also fatal: ignoring the 180-degree rule, treating the board as a straitjacket, and forgetting the shot list.",
        "Every mistake traces to one principle: a storyboard is a communication tool, not an art project.",
        "Self-check: can others read it, do the shots cut, is there a shot list, and are you holding it loosely?",
      ],
    },
  ],
};
