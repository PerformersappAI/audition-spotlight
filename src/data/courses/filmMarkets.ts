import type { Course, CourseChapter } from "../courseTypes";

const chapters: CourseChapter[] = [
  {
    slug: "film-markets-explained",
    num: 1,
    roman: "I",
    title: "What Film Markets Are",
    desc: "What a film market is and why it's where films get sold",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "What Film Markets Are: Film Markets Explained | Filmmaker Genius",
    seoDesc: "Film markets explained — what a film market actually is, why it's where films get sold, and how it fits into a film's journey to distribution. A working filmmaker's guide. Chapter 1 of Navigating Film Markets.",
    dek: `A film festival is where films are celebrated. A film market is where films are sold. If you've ever wondered where distribution deals actually get made, the answer is a film market — a trade show for movies. This chapter explains what that means and why it matters to you.`,
    body: `
    <p>Most independent filmmakers know about festivals — Sundance, Cannes, Toronto — as places where films premiere and get celebrated. Far fewer know that alongside many of those festivals, and sometimes as standalone events, there's a parallel world where the actual business of film happens: the <strong>film market.</strong> A film market is, in the plainest terms, a trade show for movies — an industry event where films are bought and sold. Buyers (distributors and platforms from around the world) come to acquire films for their territories; sellers (sales agents and producers) come to license their films to those buyers; and over a few intense days, in booths and screening rooms and meetings, distribution deals get made. If you've ever wondered where a film's distribution actually gets arranged — how a movie ends up on screens or platforms in France, Germany, Japan, and dozens of other places — a large part of the answer is: at a film market. This course is about that world, and this first chapter is about understanding what a film market fundamentally <em>is</em>, because once you grasp that it's a trade show where films are sold, everything else about it starts to make sense.</p>

    <h2>What a film market actually is</h2>

    <p>The core of the concept:</p>

    <ul class="spec-list">
      <li><b>A trade show for films.</b> A film market is an industry event where films are bought and sold — think of it as a marketplace for movie distribution rights.</li>
      <li><b>Buyers come to acquire.</b> Distributors and platforms from territories around the world attend to find and license films for their markets.</li>
      <li><b>Sellers come to license.</b> Sales agents and producers attend to present their films to those buyers and close territory deals.</li>
      <li><b>Deals are the point.</b> Unlike a festival, the purpose isn't premieres or awards — it's transactions: licensing films for distribution, territory by territory.</li>
      <li><b>It runs on booths, screenings &amp; meetings.</b> Sellers set up booths, screen films for buyers, and take meetings — the market floor is a working sales environment.</li>
      <li><b>It's mostly industry-only.</b> Film markets are trade events for professionals — buyers, sellers, agents — not public screenings for general audiences.</li>
    </ul>

    <h2>Why film markets matter to you</h2>

    <p>Understanding film markets matters even if you never set foot in one, because <strong>they are a central mechanism by which films get distributed — especially internationally — and knowing how they work demystifies a huge part of the film business that's otherwise invisible to independent filmmakers.</strong> When you learned about international sales, you learned that a sales agent takes your film to buyers around the world; the film market is <em>where</em> that happens — the physical arena where your agent meets the distributor from each territory and closes deals. When you think about how a film reaches audiences beyond its home country, the film market is a key part of the answer. And when you plan your own film's distribution, understanding markets helps you see where your film might be sold, who would buy it, and how the timing works. Film markets aren't a niche curiosity; they're infrastructure — the trade shows that keep the global film business moving. A few honest framings to carry through the course. First, <em>markets and festivals are different things that often travel together</em> — many major festivals have a film market attached (Cannes has the Marché du Film, Berlin has the EFM), so the celebration and the commerce happen side by side, but they serve completely different purposes, which the next chapter unpacks. Second, <em>you usually don't sell your own film at a market — your sales agent does</em> — markets are professional trade environments where sales agents represent films to buyers, so for most independent filmmakers the market is something your agent works on your behalf, not a floor you personally walk selling your movie (though understanding it helps you work with your agent and, in some cases, attend yourself). Third, <em>markets are about rights, not reels</em> — what's actually being traded is distribution rights (the license to distribute a film in a territory), so a film market is really a marketplace for the rights we've discussed throughout the distribution courses, gathered into a few concentrated days. Fourth, <em>this connects to everything else</em> — film markets sit at the intersection of festivals (which create the buzz that markets capitalize on), international sales (which happen largely at markets), and distribution (which markets arrange), so this course ties together threads from across the Academy. The goal of this course is to make the film-market world legible: what markets are, how they work, which ones matter, who's in the room, and how to prepare, pitch, and make deals — so that whether your film is headed to a market with a sales agent or you're simply trying to understand the business, you know what's actually going on. Film markets are where films get sold. Let's understand them. Next, we draw the crucial distinction between a market and a festival.</p>

    <div class="pullquote">A film festival is where films are celebrated. A film market is where films are sold — a trade show for movies, where buyers acquire distribution rights and sellers license their films, territory by territory.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first time someone mentioned "the market" to me, I assumed they meant the festival. I nodded along for a whole conversation before realizing they were talking about a completely separate event — a trade show, running in the same city, where the actual buying and selling happened. The festival was the party; the market was the business. Once I understood that films get <em>sold</em> at markets, not festivals, a whole invisible layer of the industry snapped into focus. All those distribution deals I'd wondered about weren't happening by magic — they were happening in booths and meeting rooms at events I'd never even heard of.</p>
    </div>
`,
    takeaways: [
      "A film market is a trade show for movies — an industry event where films are bought and sold.",
      "Buyers acquire distribution rights for their territories; sellers (agents and producers) license films to them.",
      "Markets often travel with festivals but serve a different purpose — commerce, not celebration.",
      "Markets are where much of film distribution — especially international — actually gets arranged.",
    ],
  },
  {
    slug: "film-market-vs-festival",
    num: 2,
    roman: "II",
    title: "Film Markets vs. Festivals",
    desc: "The difference between a market and a festival — and how they connect",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "Film Markets vs. Festivals: The Difference | Filmmaker Genius",
    seoDesc: "Film market vs festival — the real difference between the two, why they often happen together, and what each one does for your film. A working filmmaker's guide. Chapter 2 of Navigating Film Markets.",
    dek: `They often happen in the same city, the same week, under the same banner — and they're completely different things. A festival is about audiences and prestige; a market is about buyers and deals. Knowing the difference is the key to understanding both.`,
    body: `
    <p>The single most useful distinction for understanding this whole world is the difference between a film <strong>festival</strong> and a film <strong>market</strong> — because they're constantly confused, often happen together, and yet serve completely opposite purposes. A festival is a public-facing celebration of films: films premiere, audiences and press watch them, critics review them, juries give awards, and the currency is attention, prestige, and buzz. A market is a private, industry-only trade event running in parallel: buyers and sellers meet, films are screened for professionals, and distribution deals get made, with the currency being money and rights. The reason they're confused is that at the biggest events they're fused — Cannes is a festival <em>and</em> a market (the Marché du Film), Berlin is a festival <em>and</em> a market (the EFM) — so in the same city, the same week, under the same famous name, two entirely different things are happening: a glamorous public celebration and a hard-nosed private trade show. Grasping that these are distinct — and how they relate — is the foundation for everything else in this course.</p>

    <h2>Festival vs. market: the core differences</h2>

    <p>How the two differ:</p>

    <ul class="spec-list">
      <li><b>Purpose.</b> A festival celebrates and showcases films to audiences; a market sells films to buyers. Prestige vs. transactions.</li>
      <li><b>Audience.</b> Festivals are public (audiences, press, critics); markets are industry-only (buyers, sellers, agents).</li>
      <li><b>What happens.</b> Festivals have premieres, screenings, Q&amp;As, and awards; markets have booths, buyer screenings, and dealmaking meetings.</li>
      <li><b>The currency.</b> Festivals trade in attention, reviews, and awards; markets trade in money and distribution rights.</li>
      <li><b>Who benefits how.</b> A festival builds a film's profile and buzz; a market converts that profile into distribution deals and revenue.</li>
      <li><b>They often coexist.</b> Major events host both — the festival out front, the market behind the scenes — feeding each other.</li>
    </ul>

    <h2>How festivals and markets work together</h2>

    <p>The most important thing to understand isn't just that festivals and markets differ, but that <strong>they feed each other — the buzz a film earns at the festival is exactly what makes it sellable at the market.</strong> This is why the biggest events pair them. A film premieres at the festival, gets strong reviews and audience response and maybe an award — and that prestige and momentum become the film's selling points when a sales agent takes it to buyers at the market running alongside. The festival creates the value; the market captures it. A film that lights up a festival arrives at the market with buyers already interested; a film with no festival buzz is a much harder sell. This relationship is why your festival strategy and your sales/market strategy are so tightly linked (a theme running through the distribution courses): the festival isn't just a celebration for its own sake — for a film seeking distribution, it's also the profile-building engine that powers the market sale. A few honest points about the distinction. First, <em>you experience them completely differently</em> — at a festival you might be a filmmaker walking a red carpet and doing a Q&amp;A; at a market you (or more likely your sales agent) are doing business in booths and meeting rooms, and most filmmakers never even see the market floor, because it's a trade environment run by and for the sales side. Second, <em>not every festival has a market and not every market has a festival</em> — some festivals are purely celebratory with no market attached, and some markets (like the American Film Market) are primarily trade events without a big public festival wrapped around them, so the pairing is common but not universal. Third, <em>they serve your film at different stages</em> — the festival tends to come first (premiere, build buzz), and the market capitalizes on that buzz to make deals, so understanding the sequence helps you plan (which is what the festival-strategy and international-sales courses dig into). Fourth, <em>confusing them leads to wrong expectations</em> — filmmakers who think "getting into the festival" automatically means "selling the film" misunderstand the two; the festival gets you seen, but the market (and a sales agent working it) is where the selling happens, so knowing the difference keeps your expectations and strategy honest. Festivals and markets are two different machines that often sit in the same building: one builds a film's reputation, the other sells it, and together they move films from premiere to distribution. Keep the distinction clear, and the rest of this course — about how markets work, which ones matter, and how deals get made — will make complete sense. Next, we go inside the market itself to see how it actually works.</p>

    <div class="pullquote">A festival celebrates films to audiences; a market sells films to buyers. They often share a city and a name — but the festival builds a film's buzz, and the market turns that buzz into distribution deals.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I watched a film premiere to a rapturous festival crowd — standing ovation, glowing reviews, the works. The filmmakers were elated and, understandably, assumed the film was "made." But the deal that actually put that film on screens around the world happened three days later and two blocks away, at the market, where a sales agent used all that festival buzz to close territory after territory with buyers. The festival was the fireworks; the market was the transaction. Watching both up close taught me they're not the same event with different names — they're two different jobs, and a film needs both to reach the world.</p>
    </div>
`,
    takeaways: [
      "A festival celebrates films to audiences; a market sells films to buyers — opposite purposes, often in the same place.",
      "Festivals are public and trade in prestige; markets are industry-only and trade in money and distribution rights.",
      "They feed each other: festival buzz is what makes a film sellable at the market.",
      "Getting into a festival gets your film seen; the market is where it gets sold — don't confuse the two.",
    ],
  },
  {
    slug: "how-film-markets-work",
    num: 3,
    roman: "III",
    title: "How a Film Market Works",
    desc: "Booths, screenings, and meetings — the mechanics of a market",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "How a Film Market Works: Booths, Screenings & Meetings | Filmmaker Genius",
    seoDesc: "How film markets work — the booths, screenings, and meetings that make up a market's few intense days, and how a film moves from presentation to deal. Chapter 3 of Navigating Film Markets.",
    dek: `Strip away the glamour and a film market is a working trade show: booths where sellers set up shop, screening rooms where buyers assess films, and a packed calendar of meetings where deals get made. Here's how those pieces fit together over a few intense days.`,
    body: `
    <p>Now that we've defined what a film market is and how it differs from a festival, let's go inside one and see how it actually operates — because a market, for all its industry mystique, runs on a surprisingly concrete set of moving parts. Picture a large venue — a convention center, a set of hotel floors, a conference complex — filled for a few intense days with <strong>booths, screening rooms, and meetings.</strong> Sellers (sales agents) rent booths or suites and turn them into mini-offices, plastered with posters of the films they're representing. Buyers (distributors from around the world) move through the market, screening films in dedicated theaters and taking back-to-back meetings with sellers to discuss which films they might acquire for their territories. And underneath it all runs a dense calendar of scheduled meetings where the real negotiation happens. Understanding these mechanics — booths, screenings, meetings, over a compressed timeline — demystifies the market and shows you exactly how a film moves from being presented to being sold.</p>

    <h2>The moving parts of a market</h2>

    <p>What actually happens on the market floor:</p>

    <ul class="spec-list">
      <li><b>Booths and suites.</b> Sales agents set up booths or hotel suites as sales offices — branded with their films' posters — where they meet buyers and pitch their slate.</li>
      <li><b>Market screenings.</b> Films screen in dedicated theaters for buyers to assess — a strong screening can drive acquisition interest.</li>
      <li><b>Scheduled meetings.</b> Buyers and sellers book back-to-back meetings; the market calendar is a dense grid of appointments where deals are discussed.</li>
      <li><b>Catalogs and materials.</b> Sellers arrive with catalogs, trailers, one-sheets, and screeners so buyers can quickly evaluate their films.</li>
      <li><b>The compressed timeline.</b> A market runs just a few days, so everything — screenings, meetings, negotiations — is packed into an intense, fast-moving window.</li>
      <li><b>Registration and access.</b> Markets are credentialed trade events; buyers and sellers register and are accredited to attend and do business.</li>
    </ul>

    <h2>How a film moves through the market</h2>

    <p>The way to picture a market working is to <strong>follow a single film through it: presented at a booth, screened for buyers, discussed in meetings, and — if there's interest — moved toward a deal, all within a few days.</strong> A sales agent representing your film arrives at the market with the film in their catalog, a booth branded with its poster, a trailer and screener ready, and a schedule of meetings booked with buyers from various territories. Over the market's few days, they present the film to buyer after buyer in those meetings, arrange or point buyers to a market screening so they can assess it, and gauge interest territory by territory. Where a buyer is interested, discussions turn to terms, and a deal for that territory may be negotiated and (sometimes) closed on the spot or shortly after. Multiply that across many films and many buyers, all happening simultaneously in the same venue, and you have the controlled chaos of a film market: hundreds of these presentations, screenings, and negotiations compressed into a handful of intense days. A few honest points about how markets run. First, <em>it's the sellers' show</em> — the market is built around sales agents presenting films to buyers, so if your film is at a market, it's your sales agent working these booths, screenings, and meetings on your behalf, which is why so much of the international-sales course centered on choosing a good agent. Second, <em>preparation is everything</em> — because the timeline is so compressed, everything has to be ready in advance (catalog, trailer, screener, meeting schedule, deliverables info), since there's no time to scramble once the market starts, a point the "preparing for a market" chapter develops. Third, <em>screenings and meetings work together</em> — a meeting sparks a buyer's interest, a screening lets them confirm the film delivers, and the combination moves a deal forward, so both matter. Fourth, <em>most deals aren't instant</em> — while some deals close at the market, many are initiated there and finalized in the weeks after, so a market's "results" often keep arriving after the event ends, which shapes how you read its success. Underneath the industry glamour, a film market is a well-oiled trade show: booths, screenings, and meetings, running on a tight clock, through which films move from presentation to deal. Now that you can picture how a market actually works, we can look at which markets matter most — the major events that anchor the global film calendar. Next, the world's biggest film markets.</p>

    <div class="pullquote">Underneath the mystique, a market is a working trade show: sellers in booths, buyers in screening rooms, and a dense grid of meetings — all compressed into a few intense days where films move from presentation to deal.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first market floor I saw up close wasn't glamorous at all — it looked like any big trade show, rows of booths with movie posters instead of industrial equipment, people in meetings everywhere, a screening schedule taped to every wall. My sales agent's "booth" was a hotel suite with a laptop, a stack of catalogs, and a wall of one-sheets. Over three days I watched buyers cycle through, watched films screen down the hall, watched deals get talked through across a coffee table. It stripped all the mystery away. A market isn't magic — it's booths, screenings, and meetings, run at high speed by people who came to do business.</p>
    </div>
`,
    takeaways: [
      "A market runs on booths (sales offices), market screenings, and a dense calendar of buyer-seller meetings.",
      "A film moves through the market presented at a booth, screened for buyers, discussed in meetings, and moved toward a deal.",
      "The compressed few-day timeline makes advance preparation of catalog, trailer, and screener essential.",
      "It's the sellers' show — your sales agent works the market on your behalf, and many deals finalize after it ends.",
    ],
  },
  {
    slug: "biggest-film-markets-in-the-world",
    num: 4,
    roman: "IV",
    title: "The World's Biggest Film Markets",
    desc: "The major markets that anchor the global film calendar",
    time: "9 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "The World's Biggest Film Markets | Filmmaker Genius",
    seoDesc: "The biggest film markets in the world — AFM, Cannes' Marché du Film, Berlin's EFM, and the other major markets that anchor the global film calendar, and how they differ. Chapter 4 of Navigating Film Markets.",
    dek: `A handful of major markets anchor the global film calendar — the American Film Market, Cannes' Marché du Film, and Berlin's European Film Market chief among them. Knowing what they are and how they differ gives you the map of where films get sold.`,
    body: `
    <p>The world of film markets isn't a scattered free-for-all — it's organized around a handful of major markets that <strong>anchor the global film calendar and account for a large share of the industry's dealmaking.</strong> Three stand out as the pillars: the <em>American Film Market (AFM)</em>, held in the Los Angeles area; the <em>Marché du Film</em>, the market that runs alongside the Cannes Film Festival in France; and the <em>European Film Market (EFM)</em>, which runs alongside the Berlin Film Festival (the Berlinale) in Germany. These three are the biggest and most important trade events where films are bought and sold, and much of the year's international dealmaking clusters around them. Beyond the big three are other significant markets and events around the world, but knowing these anchors gives you the essential map — where and when the film business gathers to make deals. This chapter closes the foundations module by orienting you to the major markets so you understand the landscape before we go deeper.</p>

    <h2>The major markets</h2>

    <p>The anchors of the market calendar:</p>

    <ul class="spec-list">
      <li><b>American Film Market (AFM).</b> A major market in the Los Angeles area, historically one of the largest dedicated film markets — a trade event without a huge public festival wrapped around it.</li>
      <li><b>Marché du Film (Cannes).</b> The market running alongside the Cannes Film Festival — one of the world's most important, pairing the industry's most prestigious festival with a huge market.</li>
      <li><b>European Film Market (EFM, Berlin).</b> The market alongside the Berlin Film Festival (Berlinale) — a major early-year market that opens the calendar.</li>
      <li><b>Other significant markets.</b> Additional markets and industry events run around the world, serving regional buyers and specific sectors of the business.</li>
      <li><b>The calendar rhythm.</b> The major markets fall at different points in the year, so the industry's dealmaking follows a recurring seasonal rhythm.</li>
      <li><b>Different flavors.</b> Each market has its own character, strengths, and buyer mix — agents choose which to prioritize based on a film and its target territories.</li>
    </ul>

    <h2>Reading the market map</h2>

    <p>The value of knowing the major markets is that <strong>they give you a mental map of where and when films get sold — the recurring calendar of events the whole industry orbits.</strong> The three anchors each play a distinct role. The Marché du Film at Cannes pairs the world's most prestigious festival with an enormous market, so it's where festival glory and dealmaking most powerfully combine — a film that premieres well at Cannes can sell explosively at the Marché right there. Berlin's EFM opens the year early, setting the tone for the market calendar. And the American Film Market is a major dedicated trade event, more purely business-focused, without a giant public festival attached. Together with other markets around the world, they form a recurring annual rhythm: the industry gathers at these events, films get bought and sold, and the calendar repeats. For you, this map matters because it shows where your film might be sold and when — your sales agent will plan which market to launch your film at based on its type, its target territories, and the calendar, so understanding the anchors helps you understand your agent's strategy. A few honest points. First, <em>specific dates and details change, so verify them</em> — markets shift dates, venues, and formats over time (and some have evolved significantly in recent years), so when it actually matters for your film, confirm the current specifics rather than relying on general knowledge; this course teaches the landscape, not a fixed schedule. Second, <em>you don't need to know every market</em> — the big three plus an awareness that other markets exist is plenty for understanding the landscape; the deep territory-specific knowledge of which market suits which film is exactly what you hire a sales agent for. Third, <em>each market has a personality</em> — markets differ in their buyer mix, their strengths (some skew toward certain genres, regions, or budget levels), and their relationship to a festival, so "which market" is a real strategic choice, not a formality. Fourth, <em>the map connects to timing</em> — because markets fall at set points in the year, they shape when your film needs to be ready and when a sales push happens, tying your market strategy to your production and festival timeline. Knowing the world's biggest film markets — AFM, Cannes' Marché, Berlin's EFM, and the others — gives you the essential geography of the film business: where the industry gathers, when, and to do what. With this map in hand and the foundations complete, Module 2 goes deeper into the markets and the people in them — starting with a closer look at the American Film Market. Next, the AFM up close.</p>

    <div class="pullquote">Three markets anchor the global calendar: the American Film Market, Cannes' Marché du Film, and Berlin's EFM. Knowing them gives you the map of where and when films get sold.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>For years, market names like "the EFM" and "the Marché" washed over me as industry jargon I didn't need. Then a sales agent explained our film's plan in terms of that calendar: premiere at a festival in the fall, take it to the AFM right after to start selling, then keep pushing at the early-year markets. Suddenly those names were a map — a recurring rhythm of events where our film would be sold, each at a specific time, each with its own buyers. I didn't need to memorize every market. But knowing the big anchors turned the agent's strategy from mystery into something I could actually follow.</p>
    </div>
`,
    takeaways: [
      "Three major markets anchor the calendar: the American Film Market, Cannes' Marché du Film, and Berlin's EFM.",
      "Each has its own character — Cannes pairs prestige with a huge market; Berlin opens the year; AFM is a dedicated trade event.",
      "The markets form a recurring annual rhythm that shapes when and where films get sold.",
      "Dates and details change — verify current specifics when it matters, and lean on a sales agent to pick the right market.",
    ],
  },
  {
    slug: "afm-film-market",
    num: 5,
    roman: "V",
    title: "The American Film Market (AFM)",
    desc: "A closer look at the American Film Market and how it runs",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "The American Film Market (AFM): How It Works | Filmmaker Genius",
    seoDesc: "The AFM film market up close — what the American Film Market is, how it runs, who attends, and why it's one of the industry's key trade events for buying and selling films. Chapter 5 of Navigating Film Markets.",
    dek: `The AFM is one of the industry's key trade events — a market built primarily for business, where sellers and buyers from around the world gather to license films. A closer look at how it runs shows you what a dedicated film market really is.`,
    body: `
    <p>Of the major markets, the <strong>American Film Market (AFM)</strong> is worth a closer look because it exemplifies the pure form of what a film market is: a dedicated trade event built primarily for business, without a giant public festival wrapped around it. Where Cannes' Marché and Berlin's EFM run alongside prestigious festivals — pairing celebration with commerce — the AFM is more purely a marketplace, held in the Los Angeles area, where sales agents and buyers from around the world gather to license films. That focus makes it a clarifying example: at the AFM, the business of buying and selling films isn't happening in the shadow of a festival; it <em>is</em> the event. Studying how the AFM runs — who attends, how sellers and buyers operate, what the days look like — gives you a clean picture of a working film market and deepens the understanding you'll apply to every market. (As always, specific dates, venues, and formats evolve, so verify current details when they matter for your film — this chapter is about how the AFM works as a market, not a fixed schedule.)</p>

    <h2>What the AFM is and how it runs</h2>

    <p>The essentials of the American Film Market:</p>

    <ul class="spec-list">
      <li><b>A dedicated market.</b> The AFM is primarily a trade event for buying and selling films — a marketplace first, not a festival with a market attached.</li>
      <li><b>Los Angeles base.</b> Held in the LA area, it draws the international film business to a hub of the industry.</li>
      <li><b>Sellers and buyers converge.</b> Sales agents present their slates from offices and booths; buyers from territories worldwide come to acquire films.</li>
      <li><b>Screenings and meetings.</b> Like any market, it runs on market screenings and a dense schedule of buyer-seller meetings over its days.</li>
      <li><b>An industry-only event.</b> The AFM is a credentialed professional trade event — attendees register and are accredited to do business.</li>
      <li><b>A calendar anchor.</b> It's one of the year's key markets, a fixture in the recurring rhythm of the global film business.</li>
    </ul>

    <h2>Why the AFM is a clarifying example</h2>

    <p>The AFM is instructive precisely because <strong>it shows you a film market in its purest form — business without the festival wrapping — so everything you learned about how markets work is on clear display.</strong> There's no red carpet stealing the spotlight, no public premieres to distract from the trade; the AFM is filmmakers' and sellers' business, concentrated. Sales agents take offices and turn them into sales suites for their slates; buyers from around the world move through, screening films and taking meetings; deals get discussed, negotiated, and made. It's the mechanics of Chapter 3 — booths, screenings, meetings — running as the main event rather than a sidebar. For an independent filmmaker, understanding the AFM matters for a few reasons: it's a market where your sales agent might well take your film (especially certain genres and independent films that historically do business there), it clarifies what a "market" is when stripped of festival glamour, and it anchors your sense of the industry calendar. A few honest points. First, <em>you almost certainly won't work the AFM yourself — your sales agent will</em> — like all markets, the AFM is a sellers' trade environment, so for most independent filmmakers it's something your agent attends on your behalf, not a floor you personally walk (though understanding it helps you collaborate with your agent). Second, <em>the AFM has evolved and continues to</em> — the market has changed its dates, format, and even location over the years, and markets in general have been reshaped by industry shifts, so treat this as a picture of how the AFM functions as a market rather than a fixed set of current details to memorize; verify specifics when it counts. Third, <em>it has a character</em> — the AFM has historically been strong for certain kinds of independent and genre films and their buyers, so whether it's the right market for a given film is a strategic judgment (exactly what a sales agent provides). Fourth, <em>it embodies the whole course</em> — because the AFM is a market with the festival stripped away, it's the cleanest illustration of the market concepts this course teaches, which is why it's worth understanding even if your film ends up selling at a festival-paired market instead. The American Film Market shows you a film market with nothing hidden: the pure business of licensing films, sellers and buyers, screenings and meetings, concentrated into a dedicated event. With this clear example in hand, the next chapters widen back out — to the international markets, and then to the people who actually populate all of these markets. Next, Cannes, Berlin, and the global market circuit.</p>

    <div class="pullquote">The AFM is a film market in its purest form — business without the festival wrapping. Sellers, buyers, screenings, and meetings, with the trade itself as the main event, not a sidebar to a red carpet.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When a sales agent first told me they'd be taking my film to "the AFM," I pictured something like a festival — premieres, audiences, applause. The reality, once they described it, was almost the opposite: a working market in LA, sales suites full of posters and laptops, buyers cycling through meetings, films screening for professionals only. No red carpet, no public. Just the business. It turned out to be the clearest lesson I got in what a film market actually is — because with no festival glamour to distract me, I could finally see the machine underneath: sellers, buyers, and deals, plain and direct.</p>
    </div>
`,
    takeaways: [
      "The American Film Market is a dedicated trade event — a marketplace first, without a big public festival attached.",
      "It runs on the same mechanics as any market — sellers' offices, buyer screenings, and meetings — but as the main event.",
      "It's a clarifying example of what a market is when stripped of festival glamour — pure business.",
      "Details evolve — verify current specifics when they matter, and rely on your sales agent to work it on your behalf.",
    ],
  },
  {
    slug: "international-film-markets",
    num: 6,
    roman: "VI",
    title: "Cannes, Berlin & the Global Markets",
    desc: "Cannes' Marché, Berlin's EFM, and the international market circuit",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "Cannes, Berlin & the Global Markets: International Film Markets | Filmmaker Genius",
    seoDesc: "International film markets — Cannes' Marché du Film, Berlin's EFM, and the global market circuit, how festival-paired markets work, and how they shape a film's international sales. Chapter 6 of Navigating Film Markets.",
    dek: `The Marché du Film at Cannes and the European Film Market at Berlin show what happens when a huge market runs alongside a prestigious festival — celebration and commerce fused. Understanding these festival-paired markets rounds out your map of the global circuit.`,
    body: `
    <p>If the American Film Market showed you a market with the festival stripped away, Cannes and Berlin show you the opposite — <strong>markets fused to the world's most prestigious festivals, where celebration and commerce happen at once.</strong> The <em>Marché du Film</em> is the enormous market that runs alongside the Cannes Film Festival, and the <em>European Film Market (EFM)</em> is the major market that runs alongside the Berlin Film Festival (the Berlinale). At these events, the glamour of the festival and the business of the market operate side by side: a film can premiere on the festival's famous screens, earn reviews and buzz, and be sold to buyers at the market in the same city, the same week. This fusion is what makes festival-paired markets so powerful for international sales — the prestige feeds the deals directly. Understanding how Cannes' Marché and Berlin's EFM work, and how they fit the global circuit, completes your map of the major markets and shows why the festival-market pairing matters so much for a film's international life. (Specifics evolve; verify current details when they count.)</p>

    <h2>How festival-paired markets work</h2>

    <p>The character of Cannes, Berlin, and the circuit:</p>

    <ul class="spec-list">
      <li><b>Marché du Film (Cannes).</b> One of the world's largest film markets, running alongside the most prestigious festival — the peak fusion of festival glory and dealmaking.</li>
      <li><b>European Film Market (Berlin).</b> A major market alongside the Berlinale, falling early in the year and helping open the market calendar.</li>
      <li><b>Prestige feeds deals.</b> A strong festival premiere generates buzz that a sales agent converts into sales at the attached market — celebration powers commerce.</li>
      <li><b>Global buyer gathering.</b> These markets draw buyers from around the world, making them key venues for international, territory-by-territory sales.</li>
      <li><b>The wider circuit.</b> Beyond Cannes and Berlin, other markets and festival-markets around the world serve regional and specialized parts of the business.</li>
      <li><b>Different fit for different films.</b> A prestige arthouse film may thrive at Cannes; another film may fit a different market better — matching film to market is strategic.</li>
    </ul>

    <h2>Why the festival-market fusion matters</h2>

    <p>The reason festival-paired markets like Cannes' Marché and Berlin's EFM are so significant is that <strong>they are where a film's festival prestige and its market sales combine most directly — the buzz and the buyers are in the same place at the same time.</strong> At Cannes especially, a film that premieres to acclaim can be sold, right there at the Marché, into territory after territory, because the buyers who make those deals are attending the same event that just generated the film's buzz. This is the festival-market relationship from Chapter 2 at its most powerful: the festival creates the value and the attached market captures it, immediately and in one place. For international sales, that's enormously valuable — it's why a strong Cannes or Berlin premiere can be transformative for a film's global distribution, and why sales agents prize these festival-paired markets. Understanding this helps you see why your festival strategy and your sales strategy are, at these events, almost the same thing: getting into a festival like Cannes isn't just prestige for its own sake; it's positioning your film at the exact spot where its prestige can be converted into worldwide sales. A few honest points. First, <em>these are the hardest to get into</em> — Cannes and Berlin are the most prestigious and competitive festivals in the world, so premiering at them is a high bar most films won't clear, which is why they represent the peak rather than the norm of a film's market journey. Second, <em>the market is bigger than the competition</em> — even films not in a festival's prestigious competition can be present at the attached market (through a sales agent), so the Marché and EFM are vast marketplaces in their own right, not just showcases for the festival's official selection. Third, <em>fit still matters</em> — Cannes' prestige suits certain films (arthouse, auteur, prestige) more than others, so the "best" market for your film depends on its type and target buyers, a judgment your sales agent makes (echoing the international-sales course's emphasis on the right agent). Fourth, <em>details and formats evolve</em> — these markets have changed over time, including how they blend physical and digital participation, so verify current specifics when they matter, and treat this as the enduring logic of festival-paired markets rather than a snapshot. Cannes' Marché du Film and Berlin's EFM complete your map of the major markets by showing the festival-market fusion at full power: prestige and dealmaking in the same city, the same week, feeding each other. Together with the AFM and the wider circuit, you now understand the geography of where films get sold. Module 2's remaining chapters turn from the places to the people and the craft — starting with who's actually in the room. Next, buyers, sellers, and sales agents.</p>

    <div class="pullquote">Cannes' Marché and Berlin's EFM fuse the world's most prestigious festivals with huge markets — so a film's buzz and its buyers are in the same place at the same time, and prestige converts directly into worldwide sales.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A filmmaker I know got a film into a major festival's selection, and I watched what happened next in real time: the premiere generated genuine buzz, and within days the film's sales agent — working the market attached to that very festival — was closing territory deals off the back of it. The festival and the market weren't two trips; they were one event doing two jobs at once. That's when the power of a festival-paired market really landed for me. Getting into the festival wasn't the finish line — it was standing the film in the exact spot where its prestige could be turned into sales, immediately, with the world's buyers right there.</p>
    </div>
`,
    takeaways: [
      "Cannes' Marché du Film and Berlin's EFM are major markets fused to the world's most prestigious festivals.",
      "At festival-paired markets, a film's buzz and its buyers are in the same place — prestige converts directly into sales.",
      "They're hard to get into, but the attached markets are vast — films can be present via a sales agent even outside the competition.",
      "Fit matters — the right market depends on your film's type and buyers, and details evolve, so verify specifics when they count.",
    ],
  },
  {
    slug: "film-market-buyers-and-sellers",
    num: 7,
    roman: "VII",
    title: "Buyers, Sellers & Sales Agents",
    desc: "Who's actually in the room: buyers, sellers, and sales agents",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "Buyers, Sellers & Sales Agents at a Film Market | Filmmaker Genius",
    seoDesc: "Who's in the room at a film market — the buyers (distributors and platforms), the sellers (sales agents and producers), and how they find each other and do business. Chapter 7 of Navigating Film Markets.",
    dek: `A film market is really a room full of two kinds of people: those with films to sell and those looking to buy. Understanding who the buyers and sellers actually are — and how a sales agent connects your film to them — is understanding how the market works.`,
    body: `
    <p>Strip a film market down to its essence and it's a room full of two kinds of people: <strong>sellers, who have films to license, and buyers, who are looking to acquire films for their territories.</strong> Everything else — the booths, the screenings, the meetings — exists to connect these two groups. On the selling side are sales agents (representing filmmakers' films) and sometimes producers directly; on the buying side are distributors and platforms from territories around the world, each looking for films to release to their audiences. The market is the meeting ground where a seller with the right film finds a buyer with the right territory, and a deal happens. Understanding exactly who these players are — and, crucially, how a sales agent stands between your film and the buyers — clarifies the whole social structure of a market and your place in it. This chapter is about the people in the room.</p>

    <h2>Who's actually in the room</h2>

    <p>The players at a film market:</p>

    <ul class="spec-list">
      <li><b>Sellers: sales agents.</b> The primary sellers — companies representing films, presenting them to buyers and negotiating deals territory by territory (the focus of the International Sales course).</li>
      <li><b>Sellers: producers.</b> Sometimes producers attend directly, especially with a sales agent, to support the sale of their films.</li>
      <li><b>Buyers: distributors.</b> Local distributors from each territory who acquire films to release theatrically, on TV, or on home/digital platforms in their market.</li>
      <li><b>Buyers: platforms &amp; broadcasters.</b> Streaming services and broadcasters that acquire films for their territories and services.</li>
      <li><b>The connector: the sales agent.</b> The sales agent stands between your film and the buyers — you don't meet the buyers directly; your agent represents you to them.</li>
      <li><b>Support players.</b> Festival programmers, financiers, press, and service providers also populate markets, but buying and selling is the core activity.</li>
    </ul>

    <h2>How your film reaches the buyers</h2>

    <p>The most important thing for you to understand is that <strong>a wall of relationships and representation stands between your film and the buyers — and the sales agent is how your film crosses it.</strong> As an independent filmmaker, you don't walk a market floor introducing yourself to the distributor from France and the one from Japan; you (almost always) have a sales agent who represents your film to those buyers. The buyers, in turn, don't want to deal with hundreds of individual filmmakers — they work with sales agents they know and trust, who curate and present films to them. So the market's social structure runs: your film → your sales agent → the buyers. This is why so much of the international-sales course focused on getting and choosing a good sales agent: the agent is your film's connection to the entire buying side of the market. The buyers assess films largely through their relationships with sales agents, the screenings, and the materials, and they acquire based on what fits their territory and audience. Your job, upstream of all this, is to make a film worth buying and to have a good agent to represent it; the agent's job is to work the room of buyers on your behalf. A few honest points. First, <em>buyers are specific, not generic</em> — each buyer acquires films for a particular territory and audience, with their own tastes and needs (a genre-focused distributor in one country, a prestige arthouse distributor in another), so "the buyers" is really dozens of distinct businesses your agent matches your film to. Second, <em>relationships run the room</em> — markets operate heavily on trust and existing relationships between sales agents and buyers, which is exactly why an independent filmmaker can't easily replicate what an agent does and why the agent's relationships are so valuable. Third, <em>you're usually not in the room — and that's normal</em> — most filmmakers don't attend markets or meet buyers directly, because the market is a sellers-and-buyers trade environment run through agents; understanding this keeps your expectations realistic and your focus on the parts you control. Fourth, <em>knowing the players helps you work with your agent</em> — even though you're upstream of the market, understanding who the buyers are and how they think helps you give your agent what they need (the right materials, an honest sense of your film's appeal) and understand the results they bring back. A film market is, at bottom, sellers meeting buyers — and for your film, the sales agent is the bridge between the two. Knowing who's in the room, and that your film reaches the buyers through your agent, completes the picture of how a market's people fit together. With the places and the players understood, Module 2 closes with the one piece of market craft that's genuinely yours to shape: the pitch. Next, your film market pitch.</p>

    <div class="pullquote">A film market is sellers meeting buyers — and for your film, the sales agent is the bridge. You don't meet the buyers directly; your agent represents your film to the distributors who acquire it, territory by territory.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I used to imagine that "selling my film at a market" meant me, personally, convincing buyers to take it. The reality was humbling and clarifying: the buyers didn't want to meet me, and I had no way to reach them. They worked with sales agents they trusted, who brought them curated films. My film reached those buyers only because my agent stood in that room of relationships and presented it on my behalf. Once I understood the chain — my film, my agent, the buyers — I stopped trying to insert myself into the middle of it and focused on the two things that were actually mine: making the film good, and choosing the right agent to carry it in.</p>
    </div>
`,
    takeaways: [
      "A market is sellers (sales agents and producers) meeting buyers (distributors, platforms, broadcasters from every territory).",
      "Your film reaches the buyers through your sales agent — the chain runs film → agent → buyers.",
      "Buyers are specific businesses with distinct territories and tastes, and markets run heavily on agent-buyer relationships.",
      "You usually won't be in the room — focus on making the film worth buying and choosing the right agent to carry it.",
    ],
  },
  {
    slug: "film-market-pitch",
    num: 8,
    roman: "VIII",
    title: "Your Film Market Pitch",
    desc: "How to pitch your film to a market buyer and get their attention",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "Your Film Market Pitch: How to Pitch a Film to Buyers | Filmmaker Genius",
    seoDesc: "The film market pitch — how a film gets pitched to market buyers, what makes a pitch land, and how to package your film's hook, materials, and selling points. Chapter 8 of Navigating Film Markets.",
    dek: `At a market, a film gets a few seconds to grab a buyer's attention. Whether your agent is pitching your finished film or you're pitching a project for financing, the same craft applies: a sharp hook, clear selling points, and materials that sell. Here's how the market pitch works.`,
    body: `
    <p>A film market runs on attention, and attention is scarce — a buyer sits through dozens of films and pitches in a compressed few days, so <strong>a film gets only a brief window to grab their interest, and the pitch is what fills that window.</strong> At a market, "the pitch" takes a few forms: your sales agent pitching your finished film to a buyer in a meeting, materials (a catalog entry, a trailer, a one-sheet) that pitch the film in your absence, and — at some markets and forums — filmmakers pitching projects that aren't finished yet to secure financing or pre-sales. In every case, the same craft applies: lead with a sharp hook, make the selling points instantly clear, and back it with materials that do the film justice. This is the one area of the market that's genuinely shaped by you — your film's hook, positioning, and materials are things you help create, even if your agent delivers the pitch. This chapter, closing Module 2, is about how a film gets pitched at a market and what makes a pitch land.</p>

    <h2>What makes a market pitch land</h2>

    <p>The elements of an effective market pitch:</p>

    <ul class="spec-list">
      <li><b>A sharp hook.</b> One clear, compelling line that captures what the film is and why a buyer's audience will want it — the genre, concept, or angle that sells.</li>
      <li><b>Clear positioning.</b> What kind of film it is, who it's for, and where it fits a buyer's slate — buyers need to place it fast.</li>
      <li><b>Concrete selling points.</b> Cast, festival selections, genre appeal, a striking trailer — the specific reasons this film will perform in a territory.</li>
      <li><b>Materials that sell.</b> A strong trailer, a professional one-sheet and catalog entry, and a screener — the assets that pitch the film when you're not in the room.</li>
      <li><b>Brevity and clarity.</b> Buyers have no time for rambling — a market pitch is fast, focused, and easy to grasp.</li>
      <li><b>Honest positioning.</b> Overselling a film that doesn't deliver damages trust with buyers your agent needs long-term — pitch what the film truly is.</li>
    </ul>

    <h2>How to build a pitch that sells</h2>

    <p>The way to make your film pitch at a market is to <strong>distill your film to a hook and a handful of concrete selling points, and package them in materials sharp enough to sell the film in your absence.</strong> Start with the hook — the single most compelling thing about your film, expressed in a line a buyer grasps instantly: the genre and concept ("a contained horror film with a killer premise"), the angle, the thing that makes their audience want it. Then the positioning and selling points: what kind of film it is, who it's for, and the specific assets that make it sellable in a territory — recognizable cast, festival selections and awards, genre appeal, a trailer that delivers. Then the materials: because so much market pitching happens through assets rather than live conversation (a buyer flips through a catalog, watches a trailer, requests a screener), your one-sheet, catalog entry, trailer, and screener have to carry the pitch professionally when no one's there to speak for the film. Get those right — hook, selling points, materials — and your film pitches itself even in a crowded market. A few honest points. First, <em>your agent delivers most pitches, but you build the raw material</em> — the hook, the positioning, the trailer, the selling points are things you shape (with your agent's input), and a film that arrives with a sharp hook and strong materials makes your agent's job far easier, so this is where your effort directly helps the market sale. Second, <em>pitching a project for financing is a related but distinct skill</em> — at some markets and pitching forums, filmmakers pitch unfinished projects to raise money or secure pre-sales, which leans even harder on the hook, the package (cast, director, budget), and your ability to convey why the film will sell, so if you're seeking finance the pitch craft matters even more directly to you (the Pitching to Streaming and pitch-deck resources go deeper here). Third, <em>honesty protects the long game</em> — a pitch that oversells a film buyers then find disappointing burns trust that your sales agent relies on across many films and markets, so pitching your film as what it honestly is serves you better than hype that doesn't hold up. Fourth, <em>the pitch is where your storytelling meets the market</em> — distilling your film to a hook is a creative act, and doing it well is one of the most valuable market skills you can develop, useful far beyond any single sale. The market pitch is the point where your film has to earn a busy buyer's attention — through a sharp hook, clear selling points, and materials that sell in your absence. It's the piece of the market most shaped by you, and getting it right multiplies everything your agent does on the floor. With the places, the players, and the pitch covered, Module 3 turns to putting it all into practice — starting with how to prepare for a market. Next, preparing for a film market.</p>

    <div class="pullquote">A market pitch has seconds to land: a sharp hook, clear selling points, and materials that sell the film in your absence. It's the one piece of the market most shaped by you — and it multiplies everything your agent does on the floor.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The first time my agent asked me for "the hook" on my film, I gave a two-minute plot summary. She stopped me: "A buyer gives you one line. What's the one line?" It took me a dozen tries to boil the film down to a single compelling sentence — the genre, the concept, the reason an audience would show up. But once I had it, everything got easier: the trailer sharpened around it, the one-sheet led with it, and my agent could drop it into a meeting and watch a buyer lean in. I learned that a market pitch isn't a summary — it's a hook, and finding your film's hook is one of the most useful things you'll ever do for it.</p>
    </div>
`,
    takeaways: [
      "A market pitch has only a brief window — it must lead with a sharp hook and make the selling points instantly clear.",
      "Much market pitching happens through materials — trailer, one-sheet, catalog, screener — that sell the film in your absence.",
      "Your agent delivers most pitches, but you build the raw material — the hook and strong assets make their job far easier.",
      "Pitch your film honestly — overselling burns the buyer trust your agent needs across many films and markets.",
    ],
  },
  {
    slug: "how-to-prepare-for-a-film-market",
    num: 9,
    roman: "IX",
    title: "Preparing for a Film Market",
    desc: "The materials, plan, and homework to do before a market",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Preparing for a Film Market: What to Do Before You Go | Filmmaker Genius",
    seoDesc: "How to prepare for a film market — the materials, plan, and homework to have ready before a market so your film is fully packaged and your agent can sell it. Chapter 9 of Navigating Film Markets.",
    dek: `A market moves too fast to prepare during it — everything has to be ready before it starts. Whether your agent is running the market or you're getting your film market-ready, preparation is what separates a film that sells from one that doesn't.`,
    body: `
    <p>Opening Module 3, we shift from understanding markets to acting on that understanding — and the first practical truth is that <strong>a market is won or lost in the preparation, because there's no time to prepare once it starts.</strong> A market runs just a few intense days, packed with screenings, meetings, and negotiations; anything not ready in advance simply won't be ready. So whether your sales agent is running your film's market presence (the usual case) or you're getting your film into shape to be market-ready, the work happens <em>before</em> the market: the materials assembled, the rights and deliverables in order, the meetings booked, the pitch honed. Preparation is the unglamorous foundation that lets everything else happen — the film that arrives fully packaged and ready sells; the film that arrives half-prepared gets passed over while its scrambling team plays catch-up. This chapter is the practical checklist of what to have ready before a market.</p>

    <h2>What to have ready before a market</h2>

    <p>The preparation that has to be done in advance:</p>

    <ul class="spec-list">
      <li><b>Sales materials.</b> A polished trailer, one-sheet, catalog entry, and screener — the assets that pitch and sell your film on the floor.</li>
      <li><b>The pitch and hook.</b> Your film's hook, positioning, and selling points, sharpened and ready for your agent to deliver (from the pitch chapter).</li>
      <li><b>Rights and deliverables in order.</b> Clear, unencumbered rights and a sense of the deliverables a buyer will need — so a deal isn't stalled by loose ends.</li>
      <li><b>A meeting schedule.</b> Buyer meetings booked in advance — markets run on pre-arranged appointments, and a full schedule is set before you arrive.</li>
      <li><b>Target buyer research.</b> Knowing which buyers fit your film and territories, so time is spent on the right meetings (largely your agent's work).</li>
      <li><b>A clear plan and goals.</b> Realistic objectives for the market — which territories to prioritize, what a good outcome looks like — agreed with your agent.</li>
    </ul>

    <h2>Getting market-ready</h2>

    <p>The way to prepare for a market is to <strong>have every asset, right, and appointment locked down before the market begins, so the few days on the floor are spent selling — not scrambling.</strong> The heart of it is the materials: a strong trailer, a professional one-sheet and catalog entry, and a screener, all finished and ready, because these are what present and sell your film in the market's compressed window (and, as the pitch chapter showed, they carry the pitch when no one's speaking for the film). Alongside the materials, get the business side in order: clean, unencumbered rights and a clear picture of the deliverables a buyer will need, so an interested buyer isn't lost to a rights snag or a missing element. Then the logistics: markets run on pre-booked meetings, so the schedule of buyer appointments is arranged in advance (largely by your agent, who knows which buyers to target), and you go in with a plan — which territories matter most, what a successful market looks like. For most filmmakers, much of this is your sales agent's job, but your role is real and upstream: you supply the finished film, the strong materials, the sharp hook, and the clean rights that make your agent's preparation possible. A few honest points. First, <em>preparation is mostly your agent's job but partly yours</em> — the agent books the meetings, targets the buyers, and works the floor, but you provide the raw materials (film, trailer, one-sheet, hook) and the clean rights, so being a well-prepared client makes your agent far more effective. Second, <em>readiness is a signal</em> — a film that arrives fully packaged tells buyers (and your agent) it's a serious, professional project, while a half-prepared film signals risk, so preparation shapes perception as well as logistics. Third, <em>the deliverables matter more than you'd think</em> — a buyer who wants your film needs specific technical deliverables to actually release it, so knowing what's required and having your materials in order (the Distribution Readiness and DCP courses go deep here) prevents deals from stalling after the handshake. Fourth, <em>plan for realistic goals</em> — going in with clear, honest objectives (which territories to prioritize, what outcome would make the market a success) keeps you and your agent focused and keeps your expectations grounded. A market rewards preparation and punishes improvisation. Get your materials, rights, meetings, and plan locked down beforehand, and the market becomes a place to sell a well-packaged film rather than a scramble to assemble one. With your film prepared, the next question is a personal one: should you actually attend the market yourself? Next, attending as an indie filmmaker.</p>

    <div class="pullquote">A market is won or lost in the preparation. The few days on the floor are for selling — every asset, right, and appointment has to be locked down before it starts, so nothing is scrambled while the clock runs.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My first market taught me the cost of being half-ready. We had the film, but the trailer was rough, the one-sheet was a placeholder, and our rights had a loose end we hadn't resolved. A buyer showed real interest — and then we lost days sorting out the rights while their attention drifted to films that were ready to move. The next time, everything was locked before the market opened: polished trailer, clean deliverables, clean rights, meetings booked. That market went completely differently, because our agent could actually sell instead of firefight. Preparation isn't the boring part of a market. It's the part that decides whether the exciting part happens at all.</p>
    </div>
`,
    takeaways: [
      "A market runs too fast to prepare during it — materials, rights, meetings, and plan must be ready before it starts.",
      "Core prep: a polished trailer, one-sheet, catalog entry, and screener, plus a sharp hook and clean, unencumbered rights.",
      "Markets run on pre-booked meetings and targeted buyers — much of it your agent's work, with your materials as the foundation.",
      "A fully-packaged film signals a serious project and prevents deals from stalling on missing deliverables or rights snags.",
    ],
  },
  {
    slug: "attending-a-film-market",
    num: 10,
    roman: "X",
    title: "Attending as an Indie Filmmaker",
    desc: "Whether and how to attend a market as an indie filmmaker",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Attending a Film Market as an Indie Filmmaker | Filmmaker Genius",
    seoDesc: "Attending a film market as an indie filmmaker — whether you should go, what you'd actually do there, how to get the most from it, and when your money is better spent elsewhere. Chapter 10 of Navigating Film Markets.",
    dek: `Should you actually go to a film market? For most indie filmmakers, most of the time, your agent handles the selling — but there are real reasons to attend, and real ways to waste money doing it. Here's how to decide and how to get value if you go.`,
    body: `
    <p>A natural question once you understand markets is: <strong>should you, an independent filmmaker, actually attend one?</strong> The honest answer is nuanced. For most filmmakers most of the time, the selling is your sales agent's job, done in meetings you don't need to be in, so attending a market isn't necessary to sell your film — and markets are expensive to attend (travel, accommodation, accreditation), so going without a clear purpose can burn money you'd better spend elsewhere. But there are real, legitimate reasons an indie filmmaker might attend: to learn how the business works firsthand, to build relationships and meet potential sales agents or collaborators, to support your agent and film if it's a significant sale, or to seek financing for a future project at a market with a pitching forum. The key is to attend with a clear purpose and realistic expectations, not with the vague hope of "selling your film," which is your agent's role. This chapter helps you decide whether to go and how to get value if you do.</p>

    <h2>Should you attend — and how to get value</h2>

    <p>Weigh these honestly:</p>

    <ul class="spec-list">
      <li><b>Selling is your agent's job.</b> You don't need to attend for your film to be sold — your sales agent works the market on your behalf, so attending isn't required to make deals.</li>
      <li><b>Markets are expensive.</b> Travel, lodging, and accreditation add up; attending without a clear purpose can waste money better spent on your film.</li>
      <li><b>Learning is a real reason.</b> Seeing a market firsthand is a genuine education in how the business works — valuable, especially early in a career.</li>
      <li><b>Relationships are a real reason.</b> Markets can be places to meet potential sales agents, collaborators, and industry contacts — networking with intent.</li>
      <li><b>Financing/pitching is a real reason.</b> If a market has a pitching forum and you're seeking finance for a project, attending to pitch can be worthwhile.</li>
      <li><b>Go with a purpose and a plan.</b> If you attend, define why (learn, network, support a sale, pitch) and set concrete goals — don't wander hoping to sell.</li>
    </ul>

    <h2>Deciding well</h2>

    <p>The way to decide whether to attend a market is to <strong>be honest that selling your film is your agent's job, and only go if you have a clear, different purpose that justifies the cost.</strong> If your reason for wanting to attend is "to sell my film," reconsider — that's what your sales agent does in meetings you don't need to be in, and showing up hoping to sell it yourself usually just means expensive wandering. But if you have a genuine, different purpose, attending can be well worth it. Learning is a strong one: especially early in your career, walking a market and seeing how the business actually operates is an education you can't get any other way, and it makes you a smarter filmmaker and a better client to your future agents. Networking with intent is another: markets gather the industry, so if you go with specific people to meet — potential sales agents, producers, collaborators — and a plan to meet them, the relationships can pay off for years. And seeking financing is a concrete reason: at markets with pitching forums, attending to pitch a future project for finance or pre-sales is a legitimate, purposeful use of a market. In every case, the rule is the same: go with a clear purpose and concrete goals, budget honestly for the cost, and measure success against that purpose — not against a vague hope of selling. A few honest points. First, <em>your money has alternatives</em> — the cost of attending a market could instead fund your film's finishing, marketing, or festival strategy, so attending should clear a bar of being genuinely more valuable than those uses. Second, <em>early-career learning can justify a trip</em> — even without a film to sell, attending a market once to understand it can be a worthwhile investment in your education, as long as you go in knowing that's the goal. Third, <em>relationships need follow-through</em> — meeting people at a market only matters if you follow up and build the relationship afterward, so networking is the start of work, not the end of it. Fourth, <em>if you go, support don't smother</em> — if you attend to support your agent on a significant sale, coordinate with them and add value (be available, be professional), rather than inserting yourself into negotiations that are their expertise. Attending a film market can be genuinely valuable — for learning, relationships, or financing — but it's rarely necessary to sell your film, and it's easy to waste money on without a clear purpose. Decide honestly, go with a plan, or happily stay home and let your agent work. With preparation and attendance settled, the next chapter turns to the deals themselves — how they actually get made. Next, making deals at the market.</p>

    <div class="pullquote">Selling your film is your agent's job — you don't need to attend a market to make deals. Go only if you have a clear, different purpose: to learn, to build relationships, or to pitch for financing. Otherwise, your money has better uses.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Early on, I spent real money attending a market convinced I'd sell my film there. I didn't — because that's not how it works; the buyers dealt with my agent, not me, and I mostly wandered the floor feeling out of place. But the trip wasn't wasted, because I accidentally got the one thing markets actually offer a filmmaker like me: an education. I saw how the business ran, met a couple of people who mattered later, and came home understanding the machine. My mistake was the goal, not the trip. Now when I consider attending a market, I ask one question: what's my purpose? If the answer is "to sell my film," I stay home and let my agent do their job.</p>
    </div>
`,
    takeaways: [
      "You don't need to attend a market to sell your film — that's your agent's job, done in meetings you needn't be in.",
      "Markets are expensive — attending without a clear purpose can waste money better spent on your film.",
      "Real reasons to go: to learn the business, to build relationships with intent, or to pitch a project for financing.",
      "If you attend, go with a defined purpose and concrete goals — not a vague hope of selling your film yourself.",
    ],
  },
  {
    slug: "film-market-deals",
    num: 11,
    roman: "XI",
    title: "Making Deals at the Market",
    desc: "How deals get negotiated and closed on the market floor",
    time: "9 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Making Deals at the Market: How Film Market Deals Work | Filmmaker Genius",
    seoDesc: "How film market deals get made — from buyer interest to negotiation to a signed license, what terms are on the table, and how deals close during and after the market. Chapter 11 of Navigating Film Markets.",
    dek: `The whole point of a market is the deal — a buyer licenses your film for their territory. Understanding how that deal moves from interest to signature, what terms are on the table, and how it connects to your sales agent's work makes the market's purpose concrete.`,
    body: `
    <p>Everything a market does — the booths, screenings, pitches, and meetings — exists to produce one thing: <strong>the deal, in which a buyer licenses your film for their territory.</strong> Understanding how that deal actually gets made turns the whole market from an abstract event into a concrete process. It moves through recognizable stages: a buyer shows interest (from a meeting, a screening, the materials), the two sides discuss terms, they negotiate the specifics, and — if it comes together — they reach an agreement that becomes a signed license for that territory. The terms on the table are the ones you met in the international-sales course: which territory, which rights, for how long, and for how much. Your sales agent runs this process on your film's behalf, and while you're usually not in the negotiating room, understanding how a market deal is built helps you grasp what your agent is doing, read the results they bring back, and appreciate why the earlier chapters — preparation, clean rights, a good agent — matter so much at the moment of the deal. This chapter is about how deals get made.</p>

    <h2>How a market deal comes together</h2>

    <p>The path from interest to signed license:</p>

    <ul class="spec-list">
      <li><b>Interest sparks.</b> A buyer signals interest after a meeting, a market screening, or reviewing the materials — the start of a possible deal for their territory.</li>
      <li><b>Terms get discussed.</b> The sides talk through the key terms: which territory, which rights (theatrical, TV, digital), the license term, and the price.</li>
      <li><b>Negotiation.</b> Your agent negotiates the specifics — the fee (or minimum guarantee), rights included, term length, and conditions.</li>
      <li><b>Agreement, then paper.</b> A deal is agreed, often first in principle (a deal memo), then formalized into a full licensing contract.</li>
      <li><b>Deliverables follow.</b> Once signed, the buyer needs the film's deliverables (technical elements, materials) to actually release it in their territory.</li>
      <li><b>During and after.</b> Some deals close at the market; many are initiated there and finalized in the following weeks — the market seeds deals that ripen over time.</li>
    </ul>

    <h2>Understanding the deal you're not in the room for</h2>

    <p>Even though your sales agent, not you, negotiates market deals, understanding the process matters because <strong>it lets you read what your agent brings back and see how every earlier step pays off at the moment of the deal.</strong> When your agent reports that they've closed a territory, you now know what that means: a buyer in that territory has licensed specified rights to your film for a term at a price, and it will become a signed contract with deliverables to follow. When your agent reports interest that hasn't closed, you understand it's a deal in progress that may finalize after the market. And you can see why the earlier chapters were foundational: the buyer's interest came from the pitch and materials you helped build (Chapter 8); the negotiation went smoothly because your rights were clean and your deliverables ready (Chapter 9); and the whole thing happened because you had a good agent working the room (the international-sales course). The deal is where all of that converges. The terms themselves — territory, rights, term, price, and structures like a minimum guarantee — are exactly what the international-sales commission chapter covered, because a market deal <em>is</em> an international sales deal, made at the market. A few honest points. First, <em>your agent's skill shows here</em> — negotiating good terms (a fair price, the right rights, a sensible term) is the craft you're paying your sales agent for, so a market deal is where a good agent earns their commission, reinforcing why choosing the right agent mattered. Second, <em>a deal memo isn't the final contract</em> — many market deals are agreed in principle at the market and then formalized in a full contract afterward, with a lawyer's involvement, so "we made a deal" at the market is often the start of paperwork, not the end (and, as always, get legal review of the actual contract). Third, <em>deliverables are the deal's tail</em> — a signed license means nothing until the buyer gets the technical deliverables to release the film, so being ready to deliver (the Distribution Readiness and DCP courses) is what turns a signed deal into actual money and audience. Fourth, <em>the market seeds more than it closes</em> — because many deals finalize in the weeks after a market, the market's true results often keep arriving after it ends, so judge a market by what it ultimately produces, not just what closed on the floor. The deal is the market's whole purpose — a buyer licensing your film for their territory — and understanding how it's built, even from outside the room, lets you read your agent's results and see why every earlier step mattered. With deals understood, the final chapter pulls the whole course together into your film-market strategy. Next, your film market strategy.</p>

    <div class="pullquote">The deal is the market's whole purpose — a buyer licensing your film for their territory. Understanding how it's built, even from outside the room, lets you read your agent's results and see why every earlier step mattered.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>When my agent called to say she'd "closed a couple of territories" at a market, I used to just hear "good news" without understanding it. After I learned how market deals work, that same call meant something specific: buyers in those territories had licensed defined rights to my film for a term at a price, deal memos were signed, full contracts and deliverables would follow. I could also hear what she meant by "a few more are still in play" — deals seeded at the market that would likely close in the coming weeks. Understanding the mechanics turned her updates from vague reassurance into information I could actually act on. The deal stopped being a black box.</p>
    </div>
`,
    takeaways: [
      "A market deal moves from buyer interest to discussion to negotiation to a signed license for a territory.",
      "The terms — territory, rights, term length, price, sometimes a minimum guarantee — are the international-sales deal points, made at the market.",
      "Your agent negotiates on your behalf; a deal memo is often formalized into a full contract afterward (get legal review).",
      "Many deals close after the market and need deliverables to become real — judge a market by what it ultimately produces.",
    ],
  },
  {
    slug: "film-market-strategy",
    num: 12,
    roman: "XII",
    title: "Your Film Market Strategy",
    desc: "Bring it all together into a film-market strategy for your film",
    time: "9 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Your Film Market Strategy: Putting It All Together | Filmmaker Genius",
    seoDesc: "Build your film market strategy — how to bring markets, festivals, a sales agent, and timing into one plan that gives your film its best shot at getting sold. Chapter 12 of Navigating Film Markets.",
    dek: `Everything comes together here. Bring markets, festivals, a sales agent, and timing into one coherent plan — and give your film its best shot at reaching buyers and getting sold through the markets that fit it.`,
    body: `
    <p>We've covered the whole territory: what film markets are, how they differ from festivals, how they work, the major markets, the buyers and sellers, the pitch, preparation, attending, and deals. This final chapter pulls it together into what actually matters — <strong>a coherent film-market strategy for your specific film.</strong> A strategy isn't a formula; it's an honest plan built from your film's appeal, the right market and agent to reach buyers with it, and realistic timing tied to your festival run. The films that do well through markets aren't the ones that showed up hoping to get lucky — they're the ones whose makers understood the market world, packaged their film properly, matched it to the right market and a good sales agent, and timed everything so their film arrived where its buyers were, with the buzz that makes them pay attention. This chapter helps you build that plan and closes the course by tying film markets back into the whole distribution picture you've studied across the Academy.</p>

    <h2>Building your film market strategy</h2>

    <p>The elements of a market plan:</p>

    <ul class="spec-list">
      <li><b>Know your film's market appeal.</b> Be honest about what makes your film sellable — genre, cast, festival pedigree — and to which buyers and territories it appeals.</li>
      <li><b>Get the right sales agent.</b> A specialist agent who fits your film is your entry to the markets and the buyers — the single most important market decision (see International Sales).</li>
      <li><b>Match film to market.</b> Different markets suit different films; your agent chooses which market and moment fit your film's type and target buyers.</li>
      <li><b>Time it with your festival run.</b> Coordinate your market launch with festival buzz — a film arriving at a market with momentum commands attention.</li>
      <li><b>Prepare and package.</b> Have materials, rights, and deliverables ready before the market so your film can actually be sold (from the preparing chapter).</li>
      <li><b>Set realistic goals.</b> Understand that deals accumulate over markets and time, and judge success by what the market ultimately produces.</li>
    </ul>

    <h2>Putting your film in front of buyers</h2>

    <p>The best film-market strategy is one that <strong>starts from an honest read of your film and builds outward — matching the right agent, the right market, the right timing, and the right preparation to your film's actual appeal.</strong> Begin with honesty about your film: what makes it sellable, which buyers and territories it appeals to, whether it's the kind of film that travels through markets at all (a theme running through the distribution courses). If it is, build the plan around reaching buyers with it: get the right sales agent (a specialist who fits your film and has the buyer relationships — the single most important decision, and why so much of this connects to the international-sales course), let that agent match your film to the right market and moment, time your market launch to ride your festival buzz, and prepare your film so thoroughly that when it reaches the market it can actually be sold. Then — the strategic heart of it — <em>see film markets as one part of your film's whole distribution picture</em>, not a standalone gamble. Markets are where much of distribution (especially international) gets arranged, but they work in concert with your festival strategy (which builds the buzz markets capitalize on), your international sales (which happen at markets), your DIY and domestic release (which markets complement), and your overall plan for connecting your film to audiences. The filmmakers who do best see all of these as one integrated effort. This is where this course ties back into the whole Academy: festival strategy, distribution readiness, international sales, DIY distribution, and the rest are facets of the single job of getting your film to its audience — and film markets are a key mechanism, especially for reaching the world. A few closing thoughts. First, <em>honesty is your best strategic tool</em> — an honest read of your film's market appeal, the right agent, and realistic expectations will serve you far better than hope at every stage. Second, <em>the agent is your access</em> — because markets are sellers' trade environments reached through agents, getting and choosing the right sales agent is the decision that most determines your film's market fate, so treat it with the care the international-sales course urged. Third, <em>timing ties it together</em> — markets fall on a calendar and feed off festival buzz, so coordinating your festival run, your market launch, and your film's readiness is what makes the whole strategy work. Fourth, <em>markets are patient work</em> — deals accumulate across markets and months, so a good strategy plays the long game rather than expecting one event to sell your film in full. You now understand film markets end to end — what they are, how they work, and how to build a strategy that fits your film. Put it to work with honesty, good preparation, and the right agent, and you give your film its best shot at reaching the buyers who'll take it to the world. That's the end of the course — go get your film sold.</p>

    <div class="pullquote">The films that do well at markets aren't the lucky ones — they're the ones whose makers understood the market world, packaged the film properly, matched it to the right market and agent, and timed it to arrive where its buyers were, with the buzz that makes them pay attention.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The film of mine that sold best through markets wasn't my biggest — it was the one where I finally put the whole picture together. I read its appeal honestly (a genre film with real market potential), landed a specialist agent who knew its buyers, let her match it to the right market and time the launch to a festival premiere, and prepared it so thoroughly there were no loose ends when interest came. I stopped treating "the market" as a mysterious place where luck happened and started treating it as one deliberate stop in my film's whole journey to its audience. It worked — market by market, deal by deal. Strategy, preparation, and the right agent did what hoping never had.</p>
    </div>
`,
    takeaways: [
      "Build your strategy from an honest read of your film's market appeal — what makes it sellable and to which buyers.",
      "The right sales agent is your access to markets and buyers — the single most important market decision.",
      "Match film to market, time your launch with festival buzz, and prepare thoroughly so your film can actually be sold.",
      "See markets as one part of your whole distribution picture — integrated with festivals, international sales, and your release plan.",
    ],
  },
];

export const filmMarkets: Course = {
  slug: "film-markets-explained",
  title: "Navigating Film Markets",
  categoryLabel: "Distribution",
  subtitle: "Film markets are where films get sold. AFM, Cannes' Marché, Berlin's EFM — these are the trade shows where buyers and sellers meet and distribution deals are made. This course explains what film markets are, how they work, and how to prepare, pitch, and make deals at them.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~101 min read",
  pairsWithName: "Filmmaker Toolbox",
  pairsWithUrl: "/toolbox",
  pairsWithDesc: "The Toolbox helps you organize the materials, contacts, and deliverables a film market runs on — so when you or your sales agent works the floor, everything a buyer might ask for is ready.",
  seoTitle: "Navigating Film Markets — Filmmaker Genius Academy",
  seoDesc: "A working filmmaker's guide to film markets — what they are, how AFM, Cannes, and Berlin work, how buyers and sellers meet, and how to prepare, pitch, and make deals. 12 chapters.",
  learn: [
    "What film markets are and how they differ from festivals",
    "How AFM, Cannes' Marché, and Berlin's EFM actually work",
    "Who the buyers and sellers are and how deals get made",
    "How to prepare, pitch, and build a film-market strategy",
  ],
  mosaic: [
    "MARCHÉ<br>DU FILM<br><br>Booth 12",
    "BUYER MTG",
    "SCREENING",
    "AFM<br><br>DAY 2 OF 5",
    "Territory: FR",
    "DEAL CLOSED",
  ],
  modules: [
    { key: "foundations", label: "Module 1 — Foundations" },
    { key: "core", label: "Module 2 — Core Craft" },
    { key: "apply", label: "Module 3 — Putting It to Work" },
  ],
  chapters,
};
