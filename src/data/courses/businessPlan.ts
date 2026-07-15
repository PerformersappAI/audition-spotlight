import type { Course, CourseChapter } from "../courseTypes";

export const businessPlan: Course = {
  slug: "film-business-plan",
  title: "The Film Business Plan",
  categoryLabel: "Business",
  subtitle: "Whether you're raising money from investors, applying for funding, or just getting your own head straight, a film business plan is the document that makes your project make sense on paper. This course walks through every section — from the executive summary and market analysis to the financing plan and revenue projections — and how to write one that convinces.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~95 min read",
  pairsWithName: "Funding Strategy",
  pairsWithUrl: "https://filmmakergenius.com/funding-strategy",
  pairsWithDesc: "A business plan works best as part of a funding strategy. The Funding Strategy tool helps you map which money sources fit your film and pull the plan into a real fundraising approach.",
  seoTitle: "The Film Business Plan — Filmmaker Genius Academy",
  seoDesc: "Learn to write a film business plan that raises money — the executive summary, project, market analysis, financing plan, revenue projections, team, and comparables, section by section.",
  learn: [
    "What a film business plan is, who reads it, and how it differs from a pitch deck",
    "Every section: executive summary, project, market, and financing plan",
    "Budgets, revenue projections, comparables, and honest financials",
    "How to write, format, and use the plan to raise money",
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
      slug: "film-business-plan",
      num: 1,
      roman: "I",
      title: "What a Film Business Plan Is",
      desc: "What a film business plan actually is, and what it's for",
      time: "7 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "What a Film Business Plan Is | Filmmaker Genius",
      seoDesc: "What a film business plan actually is, what it contains, and what it's for — the document that makes your film make sense as a business. Chapter 1 of The Film Business Plan.",
      dek: `Before you write a word of one, it helps to know exactly what a film business plan is: the document that presents your film as a business — the story, the market, the money, and the people — so that someone can decide whether to back it.`,
      body: `
    <p>"Business plan" sounds like something for a startup, not a film — but for any filmmaker trying to raise money, it's one of the most important documents you'll ever put together. Here's the plain definition: <strong>a film business plan is a document that presents your film project as a business proposition — it lays out what the film is, who its audience is, how much it costs, how it will make money, who's involved, and what you need from a reader — so that an investor, funder, or partner can understand the opportunity and the risk and decide whether to back it.</strong> It's the bridge between your creative vision and someone else's money. Where a script shows a reader the story, a business plan shows them the <em>business</em>: the market for the film, the budget, the projected revenue, the team's credibility, and the deal on offer. It's a structured, professional document with recognizable sections — executive summary, project description, market analysis, financials, team — and this whole course walks through each one. For now, the goal is simply to understand what it is and what job it does, so the sections make sense as you build them. <em>(A quick note that runs through the whole course: a film business plan often involves raising money from investors, which touches securities law — so this is general education, not legal or financial advice, and you should work with the appropriate professionals, and never promise or guarantee returns.)</em></p>

    <h2>What a film business plan contains</h2>

    <p>The recognizable pieces of a film business plan:</p>

    <ul class="spec-list">
      <li><b>Executive summary.</b> A short, compelling overview of the whole opportunity — often the most-read part of the plan.</li>
      <li><b>The project.</b> What the film is — logline, synopsis, format, genre, creative vision — so the reader understands the actual work.</li>
      <li><b>Market &amp; audience.</b> Who watches this kind of film, the market it fits into, and how it reaches its audience.</li>
      <li><b>The financials.</b> The budget, how the film is financed, and realistic revenue projections — the money case.</li>
      <li><b>The team.</b> Who's making it and why they're capable — the people the reader is really betting on.</li>
      <li><b>The ask &amp; the deal.</b> What you need from the reader and what they get in return — investment terms, framed honestly.</li>
    </ul>

    <h2>The job the document does</h2>

    <p>The clearest way to understand a film business plan is by the job it does: <strong>it translates your film from a creative idea into a business proposition a reader can evaluate — answering, in a structured and credible way, "what is this, who's it for, what does it cost, how does it make money, who's making it, and what do you want from me?"</strong> Every section exists to answer one of those questions, and together they let an investor or funder judge both the opportunity and the risk. That framing matters because it tells you what a good business plan actually needs to do: not dazzle with hype, but <em>make the case honestly and completely</em>. A reader with money on the line wants to see that you understand your film as a business — that you know who the audience is, what it costs, how the money might come back, and who's capable of pulling it off. A plan that's all creative passion and no market or money reads as naïve; a plan that's all spreadsheets and no compelling project reads as soulless. The good ones do both. It's also worth distinguishing the film business plan from its cousins, which we'll cover next chapter: a <em>pitch deck</em> is a shorter, more visual presentation; a <em>proposal</em> can be a briefer ask; the business plan is the fuller, more detailed document. A few honest points to set up the course. First, <em>it's a translation tool</em> — its whole purpose is turning your creative vision into something a business-minded reader can assess, so write it for them, not for yourself. Second, <em>honesty is the through-line</em> — the plan's credibility rests on realistic numbers and honest framing of risk, and (because investors are often involved) you must never promise guaranteed returns; overhyping destroys trust and can cross legal lines. Third, <em>every section has a job</em> — as we build each one, keep asking "which reader question does this answer?", because a plan is only as strong as its weakest, hand-waved section. A film business plan presents your film as a business so someone can decide to back it — story, market, money, and team, made honest and complete. With that foundation, the next chapter makes the case for why you actually need one. Next, why you need one.</p>

    <div class="pullquote">A script shows a reader the story. A business plan shows them the business — the market, the budget, the revenue, the team, and the deal. It's the bridge between your creative vision and someone else's money.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first time someone asked me for my film's "business plan," I sent them the script and a budget spreadsheet and figured that covered it. It didn't. What they actually wanted was the thing I hadn't made: a document that answered, in order, what the film was, who would watch it, what it cost, how their money might come back, who was making it, and what exactly I was asking them for. The script answered one of those questions. The spreadsheet answered half of another. I learned that a business plan isn't the script plus a budget — it's a purpose-built translation of the whole project into terms a person with money can actually evaluate. Once I understood that, everything about how I approached financing changed.</p>
    </div>
`,
      takeaways: [
        "A film business plan presents your film as a business proposition — what it is, who it's for, what it costs, how it earns, and who makes it.",
        "It has recognizable sections: executive summary, project, market, financials, team, and the ask — each answering a reader's question.",
        "Its job is translation — turning a creative idea into something a business-minded reader can evaluate for opportunity and risk.",
        "Honesty is the through-line — realistic numbers, honest risk, and never promising guaranteed returns. General education, not legal/financial advice.",
      ],
    },
    {
      slug: "why-you-need-a-film-plan",
      num: 2,
      roman: "II",
      title: "Why You Need One",
      desc: "Why you need one — to raise money and to think clearly",
      time: "7 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Why You Need a Film Business Plan | Filmmaker Genius",
      seoDesc: "Why a film business plan matters — it raises money, and it forces you to think through your film as a business. The two purposes every plan serves. Chapter 2 of The Film Business Plan.",
      dek: `A business plan does two jobs at once, and the second is the one filmmakers underrate: it convinces other people to fund your film, and it forces <em>you</em> to figure out whether your film actually makes sense as a business.`,
      body: `
    <p>Filmmakers often see a business plan as a hoop to jump through — a thing investors demand — and miss half its value. Here's the fuller truth: <strong>a film business plan serves two purposes at once, and both matter — externally, it's the document that convinces investors, funders, and partners to back your film; internally, writing it forces you to think through your film as a business and confront whether the numbers, the audience, and the plan actually hold together.</strong> The external purpose is obvious: almost no serious investor or funding body will commit real money without seeing a plan, so if you want to raise money the professional way, you need one. But the internal purpose is the one that quietly makes you a better filmmaker-entrepreneur: the act of writing the plan — genuinely answering who watches this film, what it costs, how the money comes back, and why you're the one to make it — surfaces the weak assumptions you'd otherwise discover the hard way. A plan you write honestly will sometimes tell you your film's business case is shaky, which is painful but far cheaper to learn on paper than with someone's investment. This chapter makes the case for both.</p>

    <h2>The two purposes a plan serves</h2>

    <p>Why every serious film benefits from a business plan:</p>

    <ul class="spec-list">
      <li><b>It raises money.</b> Investors, funders, and partners expect a plan — it's how they evaluate the opportunity and decide to commit. No plan, often no money.</li>
      <li><b>It forces clarity.</b> Writing it makes you answer the hard questions — audience, cost, revenue, team — and exposes weak assumptions before they cost you.</li>
      <li><b>It signals professionalism.</b> A serious, well-made plan tells readers you understand your film as a business, not just a passion — which builds trust.</li>
      <li><b>It aligns your team.</b> A shared plan gets partners and collaborators on the same page about what you're making and how it succeeds.</li>
      <li><b>It's a reference and a roadmap.</b> Once written, it guides your decisions and gives you something to measure reality against as the project moves.</li>
      <li><b>It de-risks the ask.</b> A credible plan makes a "yes" easier by showing you've thought seriously about the risks — not by hiding them.</li>
    </ul>

    <h2>The internal value most filmmakers miss</h2>

    <p>The reason I push every filmmaker to actually write the plan — even if they think they don't need one yet — is that <strong>the writing itself is where the value hides: forcing yourself to answer, on paper and honestly, who your audience is, what the film costs, how the money comes back, and why you can pull it off, surfaces the shaky assumptions that would otherwise sink you later.</strong> It's easy to believe your film's business case is solid when it lives only in your head, all optimism and no scrutiny. The plan drags it into the light. When you sit down to write the market section, you have to actually name who watches this kind of film and how you reach them — and if you can't, that's a real problem you've just discovered cheaply. When you write the financials, you have to make the numbers add up — and if the projected revenue can't plausibly cover the budget, better to know now than after you've raised money on a fantasy. This is exactly the same lesson the pitching-investors and production-company courses teach from their own angles: honest confrontation with the business reality makes you stronger. And it feeds the external purpose too, because a plan you've genuinely thought through reads as credible, while one you've hand-waved reads as naïve to any experienced reader. A few honest points. First, <em>write it even for yourself</em> — the clarity you gain is worth it regardless of whether an investor ever reads a word, so don't treat it as pure paperwork. Second, <em>let it tell you hard truths</em> — if writing the plan reveals your business case is weak, that's the plan doing its most valuable work, so listen rather than paper over it. Third, <em>honesty serves both purposes</em> — realistic numbers and honest risk make the plan both a better thinking tool and a more convincing pitch, and (with investors involved) keep you on the right side of never promising guaranteed returns. Fourth, <em>it's expected</em> — practically, serious money won't move without one, so if you want to fund a film professionally, you simply need it. You need a film business plan for two reasons: it raises the money, and it forces you to figure out whether your film makes sense as a business. Both matter. With the "why" settled, the next chapter clears up a common confusion — how the plan differs from a pitch deck and a proposal. Next, plan vs. pitch deck vs. proposal.</p>

    <div class="pullquote">A plan you write honestly will sometimes tell you your film's business case is shaky. That's painful — and it's the plan doing its most valuable work. Far cheaper to learn it on paper than with someone else's investment.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I once had a film I was <em>sure</em> was a slam-dunk business case — in my head, the audience was obvious and the money would come back easily. Then I forced myself to write the actual plan. The market section stopped me cold: when I had to name who really watched this kind of film and how I'd reach them, my confident story fell apart. The audience I'd imagined was smaller and harder to reach than I'd admitted, and the revenue I'd projected couldn't cover the budget I wanted. That plan saved me from raising money on a fantasy. I reworked the film's scope and approach until the numbers actually held, and <em>then</em> went to investors with a plan I believed. The document didn't just help me raise money — it stopped me from raising money for the wrong version of the film.</p>
    </div>
`,
      takeaways: [
        "A business plan serves two purposes: externally it raises money, and internally it forces you to think through your film as a business.",
        "The internal value is underrated — writing it honestly surfaces weak assumptions about audience, cost, and revenue before they cost you.",
        "Write it even for yourself, and let it tell you hard truths — if the case is weak, that's the plan doing its most valuable work.",
        "Serious money rarely moves without one — and honesty makes it both a better thinking tool and a more convincing pitch.",
      ],
    },
    {
      slug: "film-plan-vs-pitch-deck",
      num: 3,
      roman: "III",
      title: "Plan vs. Pitch Deck vs. Proposal",
      desc: "How the plan differs from a pitch deck and a proposal",
      time: "8 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Plan vs. Pitch Deck vs. Proposal | Filmmaker Genius",
      seoDesc: "How a film business plan differs from a pitch deck and a proposal — what each document is, when to use it, and how they work together to raise money. Chapter 3 of The Film Business Plan.",
      dek: `Filmmakers mix these three up constantly. They're related but distinct: a business plan is the full document, a pitch deck is the short visual presentation, and a proposal is the concise ask. Knowing which is which — and when to use each — keeps you from sending the wrong thing.`,
      body: `
    <p>People throw around "business plan," "pitch deck," and "proposal" as if they're interchangeable, and then send an investor the wrong one. Let's fix that, because the distinction is simple and useful: <strong>a business plan is the full, detailed written document that makes the complete case; a pitch deck is a short, visual slide presentation that hooks interest quickly; and a proposal is a concise ask, often a brief document or letter — they're related tools that overlap in content but differ in length, format, and moment of use, and knowing which to use when keeps you from overwhelming someone who wanted a taste or under-delivering to someone who wanted the full case.</strong> Think of them as different depths of the same story. The pitch deck is the trailer — punchy, visual, designed to make someone lean in and ask for more. The business plan is the full feature — the detailed document a seriously interested reader digs into. The proposal is the short, direct ask you might lead with or leave behind. They share DNA (the same film, market, and money underneath), but you deploy them at different points. This chapter sorts them out so you always send the right thing.</p>

    <h2>The three documents at a glance</h2>

    <p>What each is and when it's used:</p>

    <ul class="spec-list">
      <li><b>Pitch deck.</b> A short, visual slide presentation (often 10–20 slides) that hooks interest fast. Used to open a conversation or present in a meeting.</li>
      <li><b>Business plan.</b> The full, detailed written document with all the sections — the complete case a serious reader evaluates. Used when someone wants depth.</li>
      <li><b>Proposal.</b> A concise, direct ask — sometimes a brief document or letter stating the opportunity and what you want. Used to initiate or summarize.</li>
      <li><b>Shared DNA.</b> All three rest on the same underlying film, market, money, and team — they're different depths and formats of one story.</li>
      <li><b>Different moments.</b> Deck to hook, proposal to ask, plan to convince in full — matched to where the reader is in the process.</li>
    </ul>

    <h2>Using the right one at the right time</h2>

    <p>The practical skill here is <strong>matching the document to the moment and the reader — leading with the short, punchy tool to spark interest, and providing the full business plan when a genuinely interested reader wants the complete, detailed case.</strong> In most real fundraising, you don't dump a thirty-page business plan on someone cold — you'd overwhelm them before they cared. Instead you often open with a <em>pitch deck</em> (or a short proposal): something quick and compelling that makes them want to know more, which is exactly the territory the logline-and-pitch and pitching-investors courses cover. Then, when they're interested and asking real questions, you hand over the <em>business plan</em> — the full document that answers everything in depth and lets them do their due diligence. The <em>proposal</em> often serves as the concise ask that frames the opportunity, sometimes as the thing you lead with or leave behind. The mistake in both directions is a mismatch: sending a dense full plan to someone who just wanted a taste (you lose them), or offering only a flashy deck to a serious investor who wants the detailed case (you look unprepared). Because they share the same underlying content, building the full business plan actually makes the others easier — once you've done the deep thinking, you can distill it into a deck or a proposal. A few honest points. First, <em>know which one they're asking for</em> — when someone says "send me your plan" or "do you have a deck?", give them exactly that, not a substitute, because the mismatch signals you don't understand the process. Second, <em>lead short, follow deep</em> — hook with the deck or proposal, convince with the plan; that's the natural order of a fundraising conversation. Third, <em>build the plan and the rest gets easier</em> — the full business plan is the deepest version, so doing it well gives you the raw material to distill into a deck or proposal. Fourth, <em>consistency across all three</em> — the film, numbers, and framing should match across every document, so a reader who sees your deck and then your plan finds one coherent, honest story (and, with investors, the same care to never promise guaranteed returns). A business plan is the full case, a pitch deck is the visual hook, a proposal is the concise ask — same story, different depths and moments. Use the right one at the right time. With the documents sorted, the next chapter asks who you're actually writing the plan for. Next, who reads your plan.</p>

    <div class="pullquote">Think of them as depths of the same story. The pitch deck is the trailer — punchy, visual, made to make someone lean in. The business plan is the full feature — the detailed case a serious reader digs into. Send the one they actually asked for.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I lost an investor early in my career by sending the wrong document. He'd casually said at a party that my film sounded interesting, so I emailed him my full thirty-page business plan the next morning — financials, market analysis, the works. I never heard back. Months later a mentor explained what I'd done: the man had expressed a flicker of curiosity, and I'd buried him in a document meant for someone already deep in due diligence. What he wanted was a two-minute deck to see if the flicker was worth pursuing. Now I always lead with the short, compelling version and keep the full plan ready for when someone actually asks for depth. Same film, same story — I'd just handed him the feature when he wanted the trailer.</p>
    </div>
`,
      takeaways: [
        "A business plan is the full detailed document; a pitch deck is the short visual presentation; a proposal is the concise ask.",
        "They share the same underlying film, market, money, and team — different depths and formats of one story.",
        "Lead short to hook interest (deck or proposal), then provide the full plan when a serious reader wants depth — match the document to the moment.",
        "Send exactly what they asked for, keep all three consistent, and build the full plan first — it makes the deck and proposal easier.",
      ],
    },
    {
      slug: "film-plan-audience",
      num: 4,
      roman: "IV",
      title: "Who Reads Your Plan",
      desc: "Who reads your plan, and what each reader is looking for",
      time: "7 min",
      moduleKey: "foundations",
      kicker: "Foundations",
      seoTitle: "Who Reads Your Plan | Filmmaker Genius",
      seoDesc: "Who actually reads a film business plan — investors, funders, sales agents, and partners — and what each is looking for, so you write to their concerns. Chapter 4 of The Film Business Plan.",
      dek: `You're not writing into a void — you're writing for specific readers with specific concerns. Investors, funders, sales agents, partners: each looks for different things. Knowing who's reading, and what they care about, is what makes a plan actually land.`,
      body: `
    <p>A business plan isn't written for everyone; it's written for the specific people you hope will back your film, and they don't all want the same things. Here's the principle that should shape everything you write: <strong>a film business plan is read by different audiences — private investors, funding bodies and grant panels, sales agents and distributors, and potential partners — and each reads it looking for different things, so the most effective plans are written with a clear sense of who the reader is and what concern you most need to answer for them.</strong> An investor with their own money on the line cares intensely about the financials and the risk. A grant panel cares about the film's cultural or artistic merit and whether you meet their criteria. A sales agent or distributor cares about the film's marketability and audience. A potential producing partner cares about the project's viability and your capability. Same film, same plan structure — but which sections you emphasize, and how you frame the whole thing, should flex toward the reader in front of you. Writing "to no one in particular" produces a plan that speaks to no one. This chapter maps the readers so you can write for them.</p>

    <h2>Who might read it — and what they want</h2>

    <p>The main audiences and their core concerns:</p>

    <ul class="spec-list">
      <li><b>Private investors.</b> Care most about the financials, the potential return, and the risk. They want realistic numbers and honest risk — never promises of guaranteed returns.</li>
      <li><b>Funding bodies &amp; grant panels.</b> Care about artistic/cultural merit and whether you meet their specific criteria. They want to see you fit their mission.</li>
      <li><b>Sales agents &amp; distributors.</b> Care about marketability — who the audience is, comparable films, and how the film sells. They want commercial clarity.</li>
      <li><b>Producing partners.</b> Care about viability and your capability — whether the project holds together and whether you can deliver it.</li>
      <li><b>Lenders (if relevant).</b> Care about security and repayment — a more conservative lens focused on how their money comes back.</li>
      <li><b>You and your team.</b> The internal reader — using the plan to align and guide decisions, as covered last chapter.</li>
    </ul>

    <h2>Writing for the reader in front of you</h2>

    <p>The practical move is to <strong>identify who a given version of your plan is really for, and lead with the section and framing that answers their central concern — without ever distorting the honest facts underneath.</strong> If you're approaching a private <em>investor</em>, the financials and risk are front-of-mind, so those sections need to be airtight, realistic, and honest — and you must frame the opportunity truthfully, never promising guaranteed returns (a theme the pitching-investors course drives home, because it's both an ethical and a legal line). If you're applying to a <em>grant or funding body</em>, their published criteria and the film's cultural or artistic value matter most, so you emphasize fit and merit and make sure you actually meet their requirements. If you're talking to a <em>sales agent or distributor</em>, marketability leads — comparable films, the audience, the commercial hook. This doesn't mean writing a different film for each reader or bending the truth; the underlying facts stay constant. It means <em>emphasis and framing</em> flex toward the reader's concern, and you make sure the section they care about most is the strongest. A generic plan written for no one lands with no one; a plan that clearly speaks to its reader's real question feels like it was written for them, because it was. A few honest points. First, <em>know your reader before you send</em> — a quick bit of homework on who they are and what they fund tells you which concern to lead with, and skipping it wastes your best shot. Second, <em>flex emphasis, not facts</em> — tailor which sections you foreground and how you frame the opportunity, but keep the actual numbers, risks, and claims identical and honest across every version. Third, <em>investors get the honest risk, never guarantees</em> — the financial reader especially needs realistic projections and a truthful risk picture, and promising guaranteed returns is both dishonest and legally dangerous. Fourth, <em>meet stated criteria exactly</em> — for grants and funds, read their requirements and address them directly, because panels screen hard for fit. You write a business plan for specific readers — investors, funders, sales agents, partners — each with different concerns, so lead with what answers theirs, honestly. That closes the Foundations module. In Module 2 we build the plan section by section, starting with the page everyone reads first: the executive summary. Next, the executive summary.</p>

    <div class="pullquote">Same film, same structure — but an investor reads for the money and the risk, a grant panel reads for merit and fit, a sales agent reads for marketability. Flex your emphasis toward the reader's real concern. Never flex the honest facts underneath.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I used to send one identical business plan to everyone — an investor, a grant fund, a sales agent — and wondered why the response was lukewarm across the board. The plan wasn't bad; it just wasn't <em>for</em> any of them in particular. When I finally did my homework on each reader, everything sharpened. For the investor, I made sure the financials and honest risk picture were the strongest, most airtight part — and I was scrupulous never to imply a guaranteed return. For the grant, I read their criteria line by line and made the film's cultural value and my fit unmistakable. For the sales agent, I led with comparable films and the audience. Same film, same true numbers underneath — I just made sure each reader found their central question answered first. The responses stopped being lukewarm.</p>
    </div>
`,
      takeaways: [
        "Different readers — investors, funding bodies, sales agents, partners — read your plan for different things.",
        "Investors want financials and honest risk; grant panels want merit and fit; sales agents want marketability; partners want viability.",
        "Flex emphasis and framing toward the reader's concern — but keep the actual facts, numbers, and risks identical and honest across versions.",
        "Know your reader before you send, meet stated criteria exactly, and give investors honest risk — never guaranteed returns.",
      ],
    },
    {
      slug: "film-plan-executive-summary",
      num: 5,
      roman: "V",
      title: "The Executive Summary",
      desc: "The executive summary — the most-read page in the plan",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "The Executive Summary | Filmmaker Genius",
      seoDesc: "How to write the executive summary of a film business plan — the most-read page — so it hooks the reader and previews the whole opportunity. Chapter 5 of The Film Business Plan.",
      dek: `It's the first page and the most-read page — and for many readers, the only page they finish. The executive summary has to preview the whole opportunity so compellingly that the reader wants to keep going. Get it right and everything else gets a chance.`,
      body: `
    <p>If a reader only reads one part of your plan, it's this one — so it has to carry more than its length suggests. Here's the principle: <strong>the executive summary is a short, standalone overview at the front of the plan that previews the entire opportunity — the film, the audience, the money, the team, and the ask — in a way compelling enough that the reader wants to continue, and clear enough that if it's all they read, they still grasp the whole proposition.</strong> Busy investors, funders, and agents often decide whether to engage based on this page or two alone; if it doesn't hook them, the brilliant market analysis and airtight financials deeper in never get read. So the executive summary does double duty: it's both a hook (making the reader lean in) and a complete miniature (standing on its own if that's as far as they get). The counterintuitive craft point is that although it appears first, it's usually best written <em>last</em> — once you know exactly what the plan says, distilling it becomes far easier than trying to summarize something you haven't yet built. This chapter covers what goes in it and how to make it land.</p>

    <h2>What the executive summary must convey</h2>

    <p>The essentials to distill into a page or two:</p>

    <ul class="spec-list">
      <li><b>The film, fast.</b> Logline and the core of what it is — genre, format, hook — so the reader instantly pictures the project.</li>
      <li><b>The opportunity.</b> Why this film, why now — the audience and the commercial or cultural case in a few compelling sentences.</li>
      <li><b>The money.</b> The budget, what you're raising, and the shape of the return or use of funds — honest and clear, never a guaranteed-return promise.</li>
      <li><b>The team.</b> Who's making it and the one or two reasons they're credible — the confidence factor in brief.</li>
      <li><b>The ask.</b> What you want from the reader, stated plainly, so they know exactly what's being proposed.</li>
      <li><b>Standalone clarity.</b> Written so that if it's the only thing read, the reader still fully understands the proposition.</li>
    </ul>

    <h2>Making it hook — and writing it last</h2>

    <p>The way to nail the executive summary is to treat it as <strong>a distillation, not a teaser — write it after the full plan exists, pack the whole proposition into a page or two, and make the opening lines compelling enough that a busy reader chooses to keep going.</strong> Writing it last is the single most useful tip: you cannot cleanly summarize a plan you haven't finished thinking through, so build the market analysis, financials, and everything else first, and then the summary almost writes itself because you finally know exactly what the strongest points are. When you do write it, lead with the hook — the most compelling thing about the opportunity, whether that's the film's concept, a striking audience insight, or the strength of the team — because the first few lines decide whether the rest gets read. Then move efficiently through the film, the opportunity, the money, the team, and the ask, keeping each to its essence. Crucially, make it <em>standalone</em>: a reader who stops after the summary should still understand what you're proposing and what you want, because for many readers that's exactly what happens. And keep the honesty consistent with the rest of the plan — the summary's money lines should reflect the same realistic numbers and honest framing as the financials deeper in, never promising guaranteed returns to make the hook shinier. A few honest points. First, <em>write it last</em> — trying to write the summary first is why so many are vague; finish the plan, then distill, and it gets dramatically easier and sharper. Second, <em>the opening lines are everything</em> — lead with your single most compelling point, because a busy reader decides in seconds whether to continue. Third, <em>make it standalone</em> — assume it might be all they read, and ensure it conveys the complete proposition on its own. Fourth, <em>stay honest here too</em> — the summary is where the temptation to overhype is strongest, so keep the money and risk truthful and never imply guaranteed returns; a hook built on a false promise collapses the moment they read the financials. The executive summary previews the whole opportunity compellingly and completely, so the reader wants to continue — and it's best written last, once you know what the plan says. With the front page handled, the next chapter builds the section that shows what the film actually is. Next, the project and creative vision.</p>

    <div class="pullquote">It appears first and is best written last. You can't cleanly summarize a plan you haven't finished thinking through — so build everything else, then distill. And assume the summary might be all they read: it has to hook and stand alone at once.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I wrote my first executive summary before the rest of the plan, and it showed — vague, hedged, trying to summarize thinking I hadn't actually done yet. A producer who read it told me kindly that she'd stopped after the first paragraph because it hadn't told her anything. So I flipped my process: I built the whole plan first — the market, the numbers, the team — and only then went back and wrote the summary. Suddenly I knew exactly what the strongest points were, and the page nearly wrote itself. I led with the sharpest thing about the project, packed the whole proposition into two tight pages, and made sure it stood on its own. The next reader finished it — and asked for the full plan. Same film. I'd just stopped trying to summarize a thought I hadn't finished having.</p>
    </div>
`,
      takeaways: [
        "The executive summary previews the whole opportunity — film, audience, money, team, ask — compellingly and completely.",
        "It's the most-read page and often the only one finished, so it must both hook the reader and stand alone.",
        "Write it last — once the full plan exists, distilling it is far easier and sharper; lead with your single most compelling point.",
        "Keep it as honest as the rest of the plan — realistic money, honest risk, never a guaranteed-return promise.",
      ],
    },
    {
      slug: "film-project-overview",
      num: 6,
      roman: "VI",
      title: "The Project & Creative Vision",
      desc: "The project and creative vision — what the film actually is",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "The Project & Creative Vision | Filmmaker Genius",
      seoDesc: "How to write the project section of a film business plan — logline, synopsis, format, and creative vision — so a business reader understands the actual film. Chapter 6 of The Film Business Plan.",
      dek: `This is the section where the reader meets your actual film — logline, synopsis, format, tone. The trick is to convey the creative vision compellingly while keeping it tied to the business case, so passion and viability reinforce each other.`,
      body: `
    <p>After the summary, the reader wants to know what the film actually <em>is</em> — and this is the section where your creative heart gets to beat, as long as it stays connected to the business. Here's the principle: <strong>the project section presents the film itself — logline, synopsis, genre, format, tone, and creative vision — vividly enough that the reader is excited by the work, while keeping it anchored to the business case so that the creative appeal and the commercial or cultural viability reinforce rather than compete with each other.</strong> This is the one part of the plan where passion belongs on the page, because a reader backing a film is partly backing a vision they believe in. But it's still a business document, so the creative material has to earn its place by connecting to why the film will find an audience or matter. The two failure modes are equal and opposite: a project section that's pure poetic vision with no sense of who it's for reads as naïve; one that's so dry and commercial it forgets to make the film sound worth making reads as soulless. The craft is holding both — a film that sounds genuinely exciting <em>and</em> like it makes sense. This chapter shows how.</p>

    <h2>What goes in the project section</h2>

    <p>The elements that let a reader picture and believe in the film:</p>

    <ul class="spec-list">
      <li><b>Logline.</b> The one-sentence hook — what the film is, at its core. Draws the reader in before the detail (the logline course covers this deeply).</li>
      <li><b>Synopsis.</b> A concise, compelling summary of the story or subject — enough to grasp the film without reading the script.</li>
      <li><b>Genre &amp; format.</b> Feature, short, documentary, series; the genre and length — practical facts that shape everything downstream.</li>
      <li><b>Tone &amp; vision.</b> How the film feels and looks, and your creative approach — where your directorial voice comes through.</li>
      <li><b>Why this film.</b> The reason it deserves to exist and will connect — the bridge from creative vision to the business case.</li>
      <li><b>Optional supporting material.</b> Comparable-film touchpoints, visual references, or a director's statement — used sparingly to deepen the picture.</li>
    </ul>

    <h2>Holding vision and viability together</h2>

    <p>The way to write this section well is to <strong>make the film sound genuinely exciting and clearly conceived — conveying your creative vision with real conviction while always tying it back to who it's for and why it will land — so the reader feels both the passion and the plausibility.</strong> Start with the <em>logline</em>, because a sharp one-sentence hook makes the reader want the rest (and if you can't write a clean logline, that's a signal the concept itself needs sharpening — the logline-and-pitch course goes deep here). Then the <em>synopsis</em> conveys the story or subject compellingly but concisely — enough to grasp the film, not the full script. The <em>genre, format, and tone</em> give the practical and emotional shape. And the crucial connective tissue is the <em>"why this film"</em> — the reason it will find its audience or carry its cultural weight, which is what turns a creative pitch into a business case and sets up the market section that follows. Throughout, let your voice and passion show, because a reader is partly betting on a vision they find compelling — but keep tying that vision to viability, so excitement and business sense travel together. The balance is everything: this is where you're allowed to be a filmmaker on the page, but never at the expense of the reader's confidence that the film makes sense. A few honest points. First, <em>lead with a sharp logline</em> — it hooks the reader and, if it won't come cleanly, tells you the concept needs work before the plan can. Second, <em>let passion show, tied to viability</em> — this is the section for creative conviction, but every flourish should ultimately connect to why the film will land, so vision and business reinforce each other. Third, <em>concise beats exhaustive</em> — convey the film compellingly without dumping the whole script; a reader wants to be excited and oriented, not buried. Fourth, <em>set up the market</em> — the "why this film" naturally hands off to who watches it, so write it as the bridge into the next section. The project section makes the reader excited about the actual film while keeping it anchored to the business case — vision and viability reinforcing each other. With the film vivid on the page, the next chapter answers the question it raises: who watches it? Next, market and audience analysis.</p>

    <div class="pullquote">This is the one section where passion belongs on the page — a reader is partly backing a vision they believe in. But it's still a business document. The craft is making the film sound genuinely exciting <em>and</em> like it makes sense, at the same time.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My early project sections were all soul and no anchor — pages of lyrical vision that left a business reader with no idea who the film was for or why it would work. An investor once told me, gently, that he loved how I talked about the film but had "no idea how to think about it." So I learned to hold both. I'd open with a sharp logline, convey the story and my creative approach with real conviction — I <em>want</em> the reader excited — but then always land on the "why this film": why it would find its audience, why it mattered now. That one connective move changed everything. The passion still showed, but now it sat on top of a reason to believe. Vision and viability stopped competing and started reinforcing each other.</p>
    </div>
`,
      takeaways: [
        "The project section presents the film — logline, synopsis, genre, format, tone, and creative vision — so the reader can picture and believe in it.",
        "It's the one place passion belongs, but it must stay anchored to the business case — vision and viability reinforcing each other.",
        "Lead with a sharp logline, keep the synopsis concise, and use \"why this film\" as the bridge to the market section.",
        "Avoid both failure modes — pure poetry with no audience sense, or dry commerce with no reason to care.",
      ],
    },
    {
      slug: "film-market-analysis",
      num: 7,
      roman: "VII",
      title: "Market & Audience Analysis",
      desc: "Market and audience analysis — who watches, and how you reach them",
      time: "8 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "Market & Audience Analysis | Filmmaker Genius",
      seoDesc: "How to write the market and audience section of a film business plan — who watches your film, the market it fits, and how it reaches them, backed honestly. Chapter 7 of The Film Business Plan.",
      dek: `This is where naïve plans get exposed and serious ones prove themselves: who actually watches this film, how big is that audience, and how does the film reach them? A grounded, honest market section is what separates a real business plan from a wish.`,
      body: `
    <p>If the project section is where your film comes alive, the market section is where a serious reader decides whether it's a business or a fantasy — and it's the part filmmakers most often fumble. Here's the principle: <strong>the market and audience section identifies who actually watches your kind of film, how that audience is reached, and where the film fits in the market — using comparable films and honest reasoning rather than the fatal claim that "everyone will love it" — because a grounded, specific audience picture is what convinces a reader the film can find viewers and make money.</strong> The number-one mistake, and it kills credibility instantly, is a vague, universal audience: "this film is for everyone." No experienced reader believes that; it signals you haven't done the thinking. The opposite — a specific, defensible audience ("viewers who loved these comparable films, reached through these channels") — signals you understand the business. This section leans on the same market thinking as the distribution, festival, and streaming courses, applied to proving your film has a real, reachable audience. It's the section that most rewards honesty and most punishes hand-waving. This chapter shows how to do it right.</p>

    <h2>What the market section must establish</h2>

    <p>The pieces of a credible audience and market picture:</p>

    <ul class="spec-list">
      <li><b>The specific audience.</b> Who actually watches this kind of film — defined by taste, demographics, or interest, not "everyone." Specific and defensible.</li>
      <li><b>Comparable films.</b> Similar films and how they performed — the single most credible evidence that an audience exists for yours.</li>
      <li><b>Market size &amp; context.</b> A grounded sense of how big and reachable the audience is, and where the film sits in the current market.</li>
      <li><b>How you reach them.</b> The channels and approach — festivals, platforms, niche communities — that connect the film to its viewers.</li>
      <li><b>Honest reasoning.</b> Claims backed by comparables and logic, never inflated — credibility comes from realism, not optimism.</li>
      <li><b>The competitive angle.</b> How the film stands out or fits a gap — why viewers choose it among the alternatives.</li>
    </ul>

    <h2>Grounding it in comparables, not wishes</h2>

    <p>The way to write a market section that convinces is to <strong>replace optimism with evidence — defining a specific, reachable audience and backing it with comparable films and honest reasoning, so the reader sees a real market rather than a hopeful claim.</strong> The workhorse tool here is the <em>comparable film</em>: naming similar films and noting how they found their audience is the most credible way to show yours can too, because it grounds your claim in reality rather than aspiration. (Handle comparables honestly — pick genuinely similar films and don't cherry-pick only the breakout hits, which any savvy reader will see through.) Around the comparables, define the audience <em>specifically</em>: not "everyone," but the real people who watch this kind of work, described by their tastes and where they are. Then show <em>how you reach them</em> — the channels and strategy that connect film to viewer, drawing on the distribution and marketing thinking from those courses. The through-line is honesty: this section's entire credibility rests on realistic, evidence-backed reasoning, and the fastest way to lose a reader is an inflated audience or a cherry-picked comparison. Done well, the market section is where your plan proves it's a business — and, not coincidentally, it's where writing the plan most often forces <em>you</em> to confront whether the audience is really there, which is exactly the internal value from earlier chapters. A few honest points. First, <em>never say "everyone"</em> — a specific, defensible audience is credible; a universal one is a red flag that instantly costs you the reader's trust. Second, <em>comparables are your best evidence</em> — genuinely similar films and how they performed do more to prove your market than any amount of adjectives, so use them, and use them honestly. Third, <em>show the path to the audience</em> — identifying viewers isn't enough; the reader wants to see how the film actually reaches them, so include the channels and approach. Fourth, <em>let it test your film</em> — if you struggle to name a real audience and comparables, that's the section doing its job, telling you something you need to address before you raise money. The market section proves a specific, reachable audience exists using comparables and honest reasoning — never "everyone." It's where a plan becomes a business. With the audience established, the next chapter turns to how the film gets paid for. Next, the financing plan.</p>

    <div class="pullquote">"This film is for everyone" is the fastest way to lose a serious reader — it signals you haven't done the thinking. A specific, defensible audience backed by honest comparables signals the opposite. Evidence beats optimism every time.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The market section humbled me more than any other part of my first real plan. I'd written that my film would appeal to "a broad general audience" — which sounds ambitious and means nothing. A producer read it and asked one question: "Name three films like yours and tell me how they found their audience." I couldn't, not really, and in that silence I realized I hadn't actually thought about who would watch my film or how they'd find it. So I did the work: I found genuinely comparable films, looked honestly at how they performed and reached viewers, and rebuilt the section around a specific, reachable audience. It was less grand than "everyone," and infinitely more convincing. It also quietly reshaped the film itself, because now I actually knew who I was making it for.</p>
    </div>
`,
      takeaways: [
        "The market section identifies who actually watches your film, how big and reachable that audience is, and how the film reaches them.",
        "Never claim \"everyone\" — a specific, defensible audience is credible; a universal one signals you haven't done the thinking.",
        "Comparable films are your strongest evidence — use genuinely similar ones honestly, not cherry-picked breakout hits.",
        "Show the path to the audience, and let the section test your film — if you can't name a real market, that's something to address.",
      ],
    },
    {
      slug: "film-financing-plan",
      num: 8,
      roman: "VIII",
      title: "The Financing Plan",
      desc: "The financing plan — how the money comes in and how it's structured",
      time: "9 min",
      moduleKey: "core",
      kicker: "Core Craft",
      seoTitle: "The Financing Plan | Filmmaker Genius",
      seoDesc: "How to write the financing section of a film business plan — how the money comes in, the recoupment structure, and the investor deal, framed honestly. Chapter 8 of The Film Business Plan.",
      dek: `This is the section an investor reads most carefully: how the film gets paid for, how their money comes back, and what the deal is. Get it clear, structured, and honest — and get the specifics right with professionals, because this is where law and money meet.`,
      body: `
    <p>For an investor, this is the section — the one they slow down and read twice, because it's about their money. Here's the principle: <strong>the financing plan explains how the film will be funded, how any investment is recouped and profit shared, and what deal you're offering — laying out the money structure clearly and honestly so a reader understands how their money is used and how it might come back, always framed with realistic expectations and never a promise of guaranteed returns.</strong> This section overlaps heavily with the pitching-investors and distribution-contracts courses, because it's describing the same machinery — the financing sources, the recoupment waterfall, the investor deal — as it applies to your specific film. It's also the section where law and money genuinely intersect: raising investment touches securities regulation, and the deal terms are legal, so I'll say clearly and repeatedly that <em>this is general education, not legal or financial advice</em>, and the specifics must be structured with a qualified entertainment/securities attorney and your accountant. What this chapter gives you is the conceptual map — what the financing section covers and how to present it honestly — so you can work productively with those professionals and write a section that reads as credible rather than naïve.</p>

    <h2>What the financing plan covers</h2>

    <p>The pieces of the money structure (structure the specifics with professionals):</p>

    <ul class="spec-list">
      <li><b>Financing sources.</b> Where the money comes from — investors, grants, pre-sales, crowdfunding, your own funds — and the mix you're assembling.</li>
      <li><b>Use of funds.</b> How the money is spent (ties to the budget) — showing investors their money goes into the film, responsibly.</li>
      <li><b>Recoupment.</b> How investors get their money back and in what order — the waterfall, explained plainly (covered in the pitching-investors course).</li>
      <li><b>Profit split.</b> How profit after recoupment is shared between investors and filmmakers — the upside, stated honestly.</li>
      <li><b>The deal &amp; terms.</b> The investment structure you're offering — set with a securities/entertainment attorney, never DIY.</li>
      <li><b>Realistic framing.</b> Honest expectations and clear risk — film is high-risk, so never promise or guarantee returns.</li>
    </ul>

    <h2>Presenting the money honestly</h2>

    <p>The way to write a financing section that earns trust is to <strong>lay out the money structure with total clarity and honesty — where the funds come from, how they're used, how investors recoup and share profit, and what the deal is — while framing everything with realistic expectations and getting the actual terms right with professionals.</strong> Clarity is the first virtue: an investor wants to see, plainly, how the film gets paid for and how their money might come back, so present the <em>sources</em>, the <em>use of funds</em> (tied to the budget in the next chapter), the <em>recoupment</em> order, and the <em>profit split</em> in a way a non-specialist can follow. Honesty is the second and more important virtue, and it has a hard line: <em>never promise or guarantee returns</em>. Film is a high-risk investment, and any language implying a sure return is both dishonest and — because this is a securities matter — legally dangerous; the credible framing is always "here's the opportunity and here are the real risks," never "you'll make your money back." The recoupment and deal concepts here are the same waterfall and terms the pitching-investors and distribution-contracts courses cover in depth, so lean on those. And the whole section rests on professional input: the deal structure is a securities/legal matter, and the numbers a tax/accounting one, so the honest role of this chapter is to make you a smart, informed client who understands the map — not to have you draft terms yourself. A few honest points, all of which I mean firmly. First, <em>clarity over cleverness</em> — an investor trusts a financing plan they can actually follow, so explain the structure plainly rather than dazzling with complexity. Second, <em>never promise guaranteed returns</em> — this is the single most important line in the whole course; film is high-risk, and guaranteeing returns is dishonest and a serious securities violation, so frame realistically, always. Third, <em>get the deal done by professionals</em> — the investment structure and terms are legal and financial matters that must be set with a securities/entertainment attorney and an accountant; this is general education, not advice, and DIY here is dangerous. Fourth, <em>tie funds to the film</em> — showing responsible use of funds (into the budget) reassures investors their money makes the movie, not vanishes. The financing plan lays out the money structure — sources, use, recoupment, split, and deal — clearly and honestly, with realistic expectations and no guaranteed returns, structured with professionals. That closes the Core Craft module. In Module 3 we get concrete about the numbers, starting with the budget and revenue projections. Next, budget and revenue projections.</p>

    <div class="pullquote">This is the single most important line in the course: never promise or guarantee returns. Film is a high-risk investment. Guaranteeing a return is dishonest and — because this is a securities matter — legally dangerous. Frame the opportunity and the real risk, always.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Early on I nearly wrote something catastrophic into a financing section: language that all but promised investors they'd get their money back, because I so badly wanted the "yes." My lawyer struck it out immediately and explained why — not just that it was dishonest given how risky film is, but that promising returns in an investment solicitation is a serious securities problem that could have exposed me to real liability. He taught me the honest frame I've used ever since: lay out the money structure clearly, show exactly how their funds are used and how recoupment works, and then be scrupulously truthful about the risk — "here's the opportunity, here are the ways you could lose money." Investors respected that far more than false confidence. And I never let the deal terms leave a professional's desk again. Clarity and honesty, structured by experts — that's the whole section.</p>
    </div>
`,
      takeaways: [
        "The financing plan covers sources, use of funds, recoupment, profit split, and the deal — the money structure, laid out clearly.",
        "Clarity earns trust — present the structure so a non-specialist can follow how funds are used and how money might come back.",
        "Never promise or guarantee returns — film is high-risk, and guaranteeing returns is dishonest and a serious securities violation.",
        "Structure the deal and terms with a securities/entertainment attorney and an accountant. This is general education, not legal or financial advice.",
      ],
    },
    {
      slug: "film-revenue-projections",
      num: 9,
      roman: "IX",
      title: "Budget & Revenue Projections",
      desc: "Budget and revenue projections — honest numbers that hold up",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Budget & Revenue Projections | Filmmaker Genius",
      seoDesc: "How to present the budget and revenue projections in a film business plan — grounded numbers, honest scenarios, and comparables — that hold up to scrutiny. Chapter 9 of The Film Business Plan.",
      dek: `Numbers are where credibility is won or lost. A grounded budget and honest, comparable-backed revenue projections make a reader trust the whole plan; inflated or hand-wavy ones sink it. This chapter is about making the math defensible.`,
      body: `
    <p>Every experienced reader turns to the numbers, and they can smell a fantasy in seconds. Here's the principle: <strong>the budget shows what the film costs and the revenue projections estimate what it might earn — and both must be grounded, realistic, and defensible, built on comparable films and honest reasoning rather than optimism, because inflated or hand-wavy numbers destroy the credibility of the entire plan while conservative, well-supported ones build trust.</strong> The budget side is more concrete: it's what the film actually costs to make and deliver, and it should be realistic and complete (the film-accounting and budgeting courses go deep on building one). The revenue side is inherently uncertain — no one can truly predict what a film will earn — which is exactly why <em>how</em> you present projections matters so much. The credible approach is to ground estimates in comparable films, show a range of scenarios rather than a single rosy number, and be transparent that projections are estimates, not promises. This is also the section where the never-promise-guaranteed-returns rule bites hardest, and where a professional's input on the numbers is invaluable. This is general education, not financial advice — the goal here is to help you present numbers that hold up. This chapter shows how.</p>

    <h2>What makes the numbers credible</h2>

    <p>How to present budget and projections defensibly:</p>

    <ul class="spec-list">
      <li><b>A realistic, complete budget.</b> What the film truly costs to make and deliver — grounded and thorough, not lowballed to look attractive (see the budgeting course).</li>
      <li><b>Comparable-based revenue.</b> Estimates grounded in how genuinely similar films performed — the most credible basis for projections.</li>
      <li><b>A range of scenarios.</b> Conservative, moderate, and optimistic cases — showing you've thought about the downside, not just the dream.</li>
      <li><b>Transparent assumptions.</b> State what your numbers rest on, so a reader can judge the reasoning rather than trust a mystery figure.</li>
      <li><b>Honest uncertainty.</b> Make clear projections are estimates, not promises — film revenue is unpredictable, and pretending otherwise destroys trust.</li>
      <li><b>Professional input.</b> Have an accountant or experienced producer sanity-check the numbers — credible math is worth the help.</li>
    </ul>

    <h2>Building numbers that hold up</h2>

    <p>The way to write this section is to <strong>treat the numbers as something a skeptical reader will stress-test — so ground the budget in reality, base revenue projections on comparable films, present a range of scenarios, and be transparent that these are honest estimates, not guarantees.</strong> Start with the <em>budget</em>, because it's the firmer number: a realistic, complete budget signals competence, while a suspiciously low one (to make the return look better) signals either naïveté or dishonesty and gets caught. Then the <em>revenue projections</em>, which require the most care because they're genuinely uncertain: the credible method is to anchor them in how comparable films actually performed (tying back to your market section), and to present a <em>range</em> — a conservative case, a moderate case, an optimistic case — rather than a single hopeful figure, because showing you've reckoned with the downside is what earns trust. Be transparent about your assumptions so a reader can evaluate the reasoning, and be explicit that projections are estimates, not promises. This is where the guaranteed-returns line reappears with full force: presenting a rosy single number as if it's what investors will get is both dishonest and, in an investment context, a securities problem — so frame everything as honest estimation. And because credible numbers are hard, get an accountant or experienced producer to sanity-check them; this is general education, not financial advice, and a professional's eye is worth it. A few honest points. First, <em>conservative beats rosy</em> — a modest, well-supported projection earns more trust than a spectacular one, because experienced readers reward realism and punish hype. Second, <em>ground revenue in comparables</em> — "similar films earned in this range" is credible; a big number from nowhere is not, so anchor projections in real evidence. Third, <em>show scenarios, not a single dream</em> — presenting a range including the downside proves you've thought seriously, which is exactly what a reader wants to see. Fourth, <em>never dress projections as guarantees</em> — they're estimates, film revenue is unpredictable, and implying certainty is both dishonest and legally dangerous, so label them honestly and get professional help. Grounded budgets and honest, comparable-based, scenario-ranged projections make the numbers defensible — and the whole plan credible. With the math solid, the next chapter covers the people and the proof points behind it. Next, team, comparables, and risks.</p>

    <div class="pullquote">Experienced readers can smell a fantasy in seconds. A modest, comparable-backed projection with an honest downside earns trust; a spectacular number from nowhere destroys it. Conservative and defensible beats rosy every single time.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I once handed an investor a plan with a single, glorious revenue number — the best case, presented as the expected case. He looked at it for about four seconds and asked, "And if it doesn't do that?" I had no answer, because I hadn't done the work of thinking about the downside. That one question ended the meeting, and rightly so. I rebuilt the section the honest way: a realistic budget, revenue estimates anchored in how genuinely comparable films had performed, and three scenarios — conservative, moderate, optimistic — with my assumptions stated plainly and a clear note that these were estimates, not promises. I had an accountant sanity-check it. The next investor trusted the numbers precisely <em>because</em> they were modest and showed I'd reckoned with failure. Realism, it turns out, is more persuasive than optimism.</p>
    </div>
`,
      takeaways: [
        "The budget shows real cost; revenue projections estimate earnings — both must be grounded, realistic, and defensible.",
        "Ground revenue in comparable films, present a range of scenarios including the downside, and state your assumptions transparently.",
        "Conservative and well-supported beats rosy — experienced readers reward realism and punish hype.",
        "Projections are estimates, never guarantees — get professional sanity-checks. General education, not financial advice.",
      ],
    },
    {
      slug: "film-plan-comparables",
      num: 10,
      roman: "X",
      title: "Team, Comparables & Risks",
      desc: "The team, comparable films, and being honest about risk",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Team, Comparables & Risks | Filmmaker Genius",
      seoDesc: "How to present the team, comparable films, and risk factors in a film business plan — the credibility and honesty that make a reader trust you. Chapter 10 of The Film Business Plan.",
      dek: `Three sections that quietly decide whether a reader trusts you: the team (who's making it), comparables (proof an audience exists), and risks (whether you're honest about the downside). The last one is the most counterintuitive — naming risks builds trust.`,
      body: `
    <p>Three shorter sections round out the plan, and together they do a lot of quiet work on the reader's confidence. Here's the principle: <strong>the team section shows who's making the film and why they can deliver it, the comparables section proves an audience exists by pointing to similar films, and the risk section honestly names what could go wrong — and the counterintuitive truth is that acknowledging risks openly builds more trust than pretending there are none, because every experienced reader knows film is risky and is really testing whether you know it too.</strong> A reader backing a film is ultimately betting on <em>people</em>, so the team section matters more than filmmakers assume — it's the human credibility behind all the numbers. Comparables reinforce the market case with concrete evidence. And the risk section, which nervous filmmakers want to skip or bury, is actually where you win the most trust: a plan that pretends the film is a sure thing reads as naïve or dishonest, while one that names the real risks and shows you've thought about them reads as the work of a serious, trustworthy operator. This chapter covers all three, with the emphasis on that last, underrated one.</p>

    <h2>What these three sections do</h2>

    <p>The job of each:</p>

    <ul class="spec-list">
      <li><b>The team.</b> Who's making the film — key people, their relevant experience and credibility. A reader is betting on people, so make the case for yours.</li>
      <li><b>Filling experience gaps.</b> If you're new, show how you close the gap — experienced collaborators, advisors, or attached talent that add credibility.</li>
      <li><b>Comparables.</b> Similar films and how they performed — concrete proof an audience exists, reinforcing the market and revenue sections.</li>
      <li><b>The risk section.</b> An honest accounting of what could go wrong — the film, the market, the money — showing you see the downside clearly.</li>
      <li><b>Mitigations.</b> For each real risk, how you reduce it — turning "here's what could go wrong" into "and here's how we've thought about it."</li>
      <li><b>Honest tone throughout.</b> Confidence grounded in realism, not hype — the posture that earns a serious reader's trust.</li>
    </ul>

    <h2>Why naming risks builds trust</h2>

    <p>The insight that ties these sections together — and the one most filmmakers resist — is that <strong>honesty is more persuasive than polish: a strong team case, real comparables, and a frank risk section that names the downside and how you'll manage it build far more trust than a plan that pretends success is guaranteed.</strong> Start with the <em>team</em>, because readers bet on people: present the key players and their relevant credibility clearly, and if you're relatively new, show how you close the experience gap with seasoned collaborators, advisors, or attached talent — this is the human confidence behind every number. <em>Comparables</em> then reinforce the case with evidence, echoing the market and revenue sections. But the section that does the most surprising work is <em>risk</em>. Every experienced investor knows film is a high-risk venture, so a plan that omits risks doesn't look confident — it looks naïve or evasive, and it makes the reader wonder what you're hiding. The trust-building move is the opposite: name the real risks honestly (the film, the market, the money), and pair each with how you've thought about mitigating it. That transforms the risk section from a weakness into proof of your seriousness. It also connects to the never-promise-guaranteed-returns thread: an honest risk section is the natural home for the truthful acknowledgment that success isn't guaranteed, which protects both your credibility and, with investors, your legal footing. A few honest points. First, <em>sell the people</em> — the team section is where a reader decides you can actually deliver, so make the human case clearly and, if new, show how you've shored up experience. Second, <em>use comparables as proof</em> — concrete similar films reinforce every claim about audience and revenue, so anchor your case in them. Third, and most importantly, <em>name the risks</em> — an honest risk section builds trust because experienced readers know film is risky and are testing whether you do; pair each risk with a mitigation to show you've thought it through. Fourth, <em>honest confidence, not hype</em> — the whole posture that wins serious readers is realism, not the pretense of a sure thing. The team shows who delivers, comparables prove the audience, and an honest risk section builds the most trust of all. With every section built, the next chapter covers pulling it into a professional document. Next, writing and formatting the plan.</p>

    <div class="pullquote">Nervous filmmakers want to bury the risk section. That's exactly backwards. Every experienced reader knows film is risky and is testing whether you know it too — so naming the risks honestly, with mitigations, builds more trust than pretending there are none.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I used to leave the risk section out entirely — why advertise the downside to someone I'm trying to convince? Then a seasoned investor explained the psychology to me. "When a plan has no risks," he said, "I don't think the film is safe. I think the filmmaker is naïve or hiding something." So I started including an honest risk section: the real things that could go wrong with the film, the market, the money — each paired with how I'd thought about managing it. I braced for it to scare people off. The opposite happened. Investors visibly relaxed, because I'd shown them I saw the same risks they did and had reckoned with them. The section I'd been most afraid to write turned out to be the one that earned the most trust. Honesty, again, out-persuading polish.</p>
    </div>
`,
      takeaways: [
        "The team section shows who delivers — a reader bets on people, so make the human case, and close experience gaps with collaborators.",
        "Comparables prove an audience exists — concrete similar films reinforce the market and revenue sections.",
        "Name the risks honestly, paired with mitigations — acknowledging the downside builds more trust than pretending success is guaranteed.",
        "The winning posture is honest confidence, not hype — and the risk section is the natural home for acknowledging success isn't guaranteed.",
      ],
    },
    {
      slug: "how-to-write-a-film-plan",
      num: 11,
      roman: "XI",
      title: "Writing & Formatting the Plan",
      desc: "Writing and formatting the plan so it reads professionally",
      time: "8 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Writing & Formatting the Plan | Filmmaker Genius",
      seoDesc: "How to write and format a film business plan so it reads professionally — clear structure, right length, clean presentation, and no jargon. Chapter 11 of The Film Business Plan.",
      dek: `You've got all the sections. Now they have to become one clean, professional document. Good writing and formatting won't save weak content — but sloppy presentation will sink strong content, because it signals carelessness with a reader's money.`,
      body: `
    <p>All the sections in the world don't help if the document that holds them is a mess. Here's the principle: <strong>how the plan is written and formatted shapes how seriously it's taken — clear, concise writing, a logical structure, clean professional presentation, and the right length signal competence and respect for the reader's time, while dense jargon, sloppy formatting, typos, or bloat signal carelessness that a reader will transfer to their judgment of you and your film.</strong> Presentation can't rescue a weak business case, and it shouldn't try to disguise one — but strong content in a sloppy wrapper gets underrated, because a reader unconsciously reasons: if they were careless with the document asking for my money, how careful will they be with the money itself? So this final craft chapter is about the wrapper: writing clearly (plain language, not jargon), structuring logically (the sections in sensible order with an easy-to-navigate flow), keeping it the right length (thorough but not bloated), and presenting it cleanly (professional formatting, proofread, consistent). None of this is hard; it just requires care — the same care the plan is asking the reader to trust you with. This chapter covers how to make the document itself professional.</p>

    <h2>What makes a plan read professionally</h2>

    <p>The presentation choices that signal competence:</p>

    <ul class="spec-list">
      <li><b>Clear, plain writing.</b> Say things simply — avoid jargon and padding. A reader trusts a plan they can easily understand.</li>
      <li><b>Logical structure.</b> Sections in a sensible order (summary first), with headings and flow that make the plan easy to navigate.</li>
      <li><b>The right length.</b> Thorough but not bloated — long enough to make the case, short enough to respect the reader's time.</li>
      <li><b>Clean, professional formatting.</b> Consistent layout, readable typography, and tidy tables for the numbers — it should look like a real business document.</li>
      <li><b>Proofread and polished.</b> No typos or errors — small mistakes make a reader doubt your care with bigger things, like their money.</li>
      <li><b>Consistent with your brand.</b> On-brand and coherent, so the plan matches the professional impression of your whole project.</li>
    </ul>

    <h2>Making the document match the content</h2>

    <p>The mindset for this stage is that <strong>the document is itself a demonstration — a plan that's clear, well-structured, appropriately concise, and cleanly presented shows the reader you're careful and professional, which they'll assume extends to how you'd handle their money.</strong> Write in <em>plain language</em>: the goal is to be understood, not to sound impressive, so cut jargon and say things simply — clarity reads as confidence, while dense prose reads as either confusion or hiding. Structure <em>logically</em>: lead with the executive summary, then move through the sections in the sensible order this course built them, with clear headings so a reader can navigate and skim to what they care about. Get the <em>length</em> right: thorough enough to make the full case, but ruthlessly trimmed of padding — a bloated plan tests a reader's patience, and respecting their time is itself a signal of professionalism. Present it <em>cleanly</em>: consistent formatting, readable layout, tidy tables for the financials, and — non-negotiably — proofread it so there are no typos or errors, because small mistakes make a reader doubt your care with big things. And keep it <em>on-brand</em> and coherent, so the document matches the professional impression of your film and (if you have one) your company. Crucially, none of this substitutes for substance: presentation makes strong content shine, but it can't fix a weak business case, and it should never be used to dress up dishonest numbers or hide risk — the honesty threaded through this whole course still governs. A few honest points. First, <em>clarity over cleverness</em> — plain language that's easily understood beats impressive-sounding jargon every time, so write to be understood. Second, <em>right length, no bloat</em> — make the case thoroughly, then cut everything that isn't earning its place; respecting the reader's time is professionalism. Third, <em>proofread ruthlessly</em> — typos and sloppiness make a reader doubt your care with their money, so polish the document like it matters, because it does. Fourth, <em>presentation serves substance, never replaces it</em> — a clean wrapper makes good content land, but can't rescue a weak or dishonest case, so get the substance right first. Clear writing, logical structure, right length, and clean presentation make the plan read professionally — the document proving you're careful with the reader's trust. With a polished plan in hand, the final chapter is about using it to actually raise the money. Next, using your plan to raise money.</p>

    <div class="pullquote">A reader unconsciously reasons: if they were careless with the document asking for my money, how careful will they be with the money itself? Presentation can't save a weak case — but sloppiness sinks a strong one. Polish the wrapper like it matters.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I once poured months into a genuinely strong business plan — solid market case, honest numbers, real comparables — and then sent it out in a rush: inconsistent formatting, a couple of typos in the executive summary, tables that didn't line up. An investor gave me feedback I never forgot: "The thinking is good. But the document made me nervous — it looked like you'd hurried, and I couldn't help wondering if you'd hurry with my money too." The content hadn't changed, but the sloppy wrapper had cost me credibility I'd earned. I reformatted the whole thing cleanly, proofread it three times, trimmed the padding, and resent it. Same plan, night-and-day reception. Now I treat the document itself as part of the pitch — because to the reader, it is.</p>
    </div>
`,
      takeaways: [
        "How the plan is written and formatted shapes how seriously it's taken — clear, clean presentation signals competence and respect.",
        "Write plainly (no jargon), structure logically, keep the right length (thorough not bloated), and format cleanly.",
        "Proofread ruthlessly — typos and sloppiness make a reader doubt your care with their money.",
        "Presentation serves substance, never replaces it — a clean wrapper makes good content land but can't fix a weak or dishonest case.",
      ],
    },
    {
      slug: "film-fundraising-plan",
      num: 12,
      roman: "XII",
      title: "Using Your Plan to Raise Money",
      desc: "Using your plan to actually raise the money for your film",
      time: "9 min",
      moduleKey: "apply",
      kicker: "Putting It to Work",
      seoTitle: "Using Your Plan to Raise Money | Filmmaker Genius",
      seoDesc: "How to actually use your finished film business plan to raise money — who to approach, how to deploy it, and keeping it a living document. Chapter 12 of The Film Business Plan.",
      dek: `A business plan sitting in a folder raises nothing. This final chapter is about deploying it — who to approach, how to use the plan in real conversations, and keeping it a living document — so the work you've done actually turns into a funded film.`,
      body: `
    <p>You've built the whole plan, section by section — and now comes the part that actually matters: using it. Here's the principle that closes the course: <strong>a finished business plan only raises money when you actively deploy it — approaching the right funders, leading with the short version and following with the full plan, using it as the backbone of real conversations, and treating it as a living document you keep current — so the goal of this final chapter is to turn the document you've written into a funded film.</strong> The plan is not the end of the work; it's the instrument you now play. And how you use it draws on everything in the funding side of this Academy: the pitching-investors course for how to approach and talk to investors, the grants and crowdfunding courses for other money routes, the production-company course for the entity that holds it all. This chapter ties the plan into that broader fundraising practice, and it carries forward the two rules that have run through every chapter: be honest — realistic numbers, honest risk, never guaranteed returns — and get professionals involved where money and law meet. This is general education, not legal or financial advice. Let's put the plan to work.</p>

    <h2>Turning the plan into funding</h2>

    <p>How to deploy your finished plan:</p>

    <ul class="spec-list">
      <li><b>Target the right readers.</b> Approach funders who fit your film — the right investors, grant bodies, or partners — rather than blasting it everywhere.</li>
      <li><b>Lead short, follow deep.</b> Open with the deck or a concise version to spark interest, then provide the full plan when they want depth (as in Chapter 3).</li>
      <li><b>Use it in conversation.</b> The plan is the backbone of your pitch and their due diligence — know it cold and let it anchor real discussions.</li>
      <li><b>Keep it a living document.</b> Update it as the film, attachments, and market evolve — a current plan is credible, a stale one isn't.</li>
      <li><b>Stay honest &amp; get help.</b> Realistic numbers, honest risk, never guaranteed returns — and involve a securities/entertainment attorney and accountant on the deal.</li>
      <li><b>Persist.</b> Expect more no's than yes's — keep refining and approaching, because raising money is a process of persistence.</li>
    </ul>

    <h2>Putting the whole course to work</h2>

    <p>The way to actually raise the money is to treat the plan as <strong>a living instrument you deploy with focus and persistence — targeting the right funders, leading with the short version and following with the full plan, anchoring every real conversation in it, keeping it current, and staying honest throughout — knowing that fundraising is a process, not a single moment.</strong> Start by <em>targeting</em>: your plan lands best with funders it actually fits, so approach the right investors, grant bodies, and partners rather than sending it to everyone, using the funding-strategy thinking to match film to money. <em>Deploy it in the right order</em>: open with the deck or concise version to spark interest, then hand over the full plan when a serious reader wants depth — the sequence from Chapter 3. <em>Use it in conversation</em>: the plan is the backbone of your pitch and the reader's due diligence, so know it cold and let it anchor discussions rather than sitting unread. <em>Keep it living</em>: as your film, attachments, and the market evolve, update the plan so it stays current and credible. And carry the course's two constants all the way through: <em>honesty</em> — realistic numbers, honest risk, and never a promise of guaranteed returns — and <em>professional help</em> where money and law meet, because the deal terms are a securities/legal matter and the numbers an accounting one (general education, not advice). Above all, <em>persist</em>: raising money is a process with more no's than yes's, and the filmmakers who succeed are the ones who keep refining the plan and approaching the right people. A few honest closing thoughts. First, <em>the plan is a tool, not a trophy</em> — its value is entirely in being used, so get it in front of the right people rather than perfecting it forever in a drawer. Second, <em>honesty is your long-term asset</em> — the same realism and integrity that make the plan credible protect your reputation and keep you on the right side of the law, so never trade them for a quicker yes. Third, <em>lean on the professionals and the rest of the Academy</em> — the pitching, funding, and company courses, plus a real attorney and accountant, are how you turn this document into a closed deal. Fourth, <em>keep going</em> — persistence, with a strong honest plan, is what finally turns "here's my film" into "here's my funded film." You came in wanting to make your film make sense on paper. Now you can — and you can use that plan to raise the money and get it made. Go build your plan, and go make your film.</p>

    <div class="pullquote">A business plan sitting in a folder raises exactly nothing. Its entire value is in being used — put in front of the right people, anchoring real conversations, kept honest and current. The plan is the instrument. Now go play it.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I once spent so long perfecting a business plan that I forgot to actually use it — polishing a document that sat in a folder while the film went nowhere. A mentor finally asked me the obvious question: "Who have you sent it to?" The answer was no one. So I changed my whole approach: I targeted funders my film genuinely fit, led with a short version to spark interest, brought the full plan to the serious conversations, and kept it updated as the project evolved. I stayed honest — realistic numbers, honest risk, never a promise of returns — and got a lawyer on the deal terms. And I persisted through a lot of no's. The plan that had gathered dust became the backbone of the conversations that finally funded the film. The lesson: the document is only worth the work if you actually put it to work.</p>
    </div>
`,
      takeaways: [
        "A finished plan only raises money when you deploy it — target the right funders rather than sending it everywhere.",
        "Lead with the short version, follow with the full plan, anchor real conversations in it, and keep it a living, current document.",
        "Stay honest all the way — realistic numbers, honest risk, never guaranteed returns — and get professionals on the deal and the money.",
        "Persist — fundraising has more no's than yes's, and a strong, honest plan used relentlessly is what finally funds the film.",
      ],
    },
  ] satisfies CourseChapter[],
};
