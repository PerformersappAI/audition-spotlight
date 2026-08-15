export type GleStatChip = { hi?: string; text: string };

export type GleDoorCard = {
  label: string;
  title: string;
  desc: string;
  verdict: string;
};

export type GleSpecRow = { label: string; value: string };

export type GleMoneyRow = {
  label: string;
  value: string;
  kind?: "gross" | "minus" | "net" | "plus";
  note?: string;
};

export type GleTableRow = { cells: string[] };

export type GleFaq = { q: string; a: string };

export type GlePlatformDetail = {
  slug: string;
  name: string;
  accent: string;
  accentRgb: string;
  catPill: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  stats: GleStatChip[];
  introCallout: string;

  doors: { heading: string; cards: GleDoorCard[]; note?: string };

  wants: {
    heading: string;
    cards?: GleDoorCard[];
    note?: string;
    genresLabel?: string;
    genres?: string[];
    hardest?: string;
    leversLabel?: string;
    levers?: { title: string; desc: string }[];
    test?: string;
  };

  partners?: {
    heading: string;
    blocks: { title: string; desc: string }[];
    remember?: string;
    tableHead?: string[];
    tableRows?: GleTableRow[];
    footnote?: string;
  };

  flow?: { heading: string; steps: { title: string; desc: string }[]; note?: string };

  money: {
    heading: string;
    subhead?: string;
    rows: GleMoneyRow[];
    note?: string;
    warning?: string;
  };

  technical: {
    heading: string;
    golden?: string;
    groups: { title: string; rows?: GleSpecRow[]; bullets?: string[] }[];
    qc?: string;
  };

  contract: {
    heading: string;
    intro?: string;
    bullets: string[];
    kicker?: string;
  };

  steps: { heading: string; items: { title: string; desc: string }[] };

  faq: GleFaq[];
};

export const glePlatforms: Record<string, GlePlatformDetail> = {
  netflix: {
    slug: "netflix",
    name: "Netflix",
    accent: "#e50914",
    accentRgb: "229,9,20",
    catPill: "Tier 1 · Major Streamer",
    h1: "How to Get Your Film on Netflix",
    seoTitle: "How to Get Your Film on Netflix — Green Light Engine | Filmmaker Genius",
    seoDescription:
      "The real rules for licensing an indie film to Netflix: the three doors in, distributor vs aggregator, what a deal actually pays, and every technical delivery spec.",
    intro:
      "The real rules — not the film-school version. Exactly what it takes to get an independent film licensed onto the world's largest streaming platform: the doors, the gatekeepers, the money, and every technical spec that can make or break your delivery.",
    stats: [
      { hi: "325M+", text: "subscribers worldwide" },
      { hi: "~190", text: "countries" },
      { hi: "$20B", text: "2026 content budget" },
      { hi: "<1%", text: "of indie films reach major SVOD" },
    ],
    introCallout:
      "Netflix is not an arts foundation. It's a publicly traded technology company with a ~$20B content budget and a board that answers to shareholders. Every acquisition decision runs through one question: will this content retain existing subscribers and attract new ones? Passion is what you go through making the film. Data and certainty are what get it onto the platform. And less than 1% of independent features ever reach a major subscription streaming platform — not because they were bad films, but because the filmmakers didn't know the rules.",
    doors: {
      heading: "The three doors into Netflix",
      cards: [
        {
          label: "Door 1",
          title: "Netflix Original",
          desc: "Netflix funds it, owns it, controls it. You get budget + day-one global reach. Needs a proven track record, major representation, named talent, OR pre-existing IP.",
          verdict: "Effectively closed to most indies",
        },
        {
          label: "Door 2",
          title: "Netflix licenses your film",
          desc: "Your finished film gets seen, generates buzz, and Netflix rents it for a term. Opens via a festival run, a sales agent, or proven audience data.",
          verdict: "Where most indie success stories live",
        },
        {
          label: "Door 3",
          title: "Through a middleman",
          desc: "A distributor or approved aggregator delivers on your behalf. Netflix routes delivery through partners it already works with — even after they say yes.",
          verdict: "Most accessible pathway",
        },
      ],
      note: "Licensing is a rental, not a sale. Netflix pays a negotiated fee to stream your film for a set term in set territories; when the term ends the rights revert to you and the film comes off the platform.",
    },
    wants: {
      heading: "What Netflix actually wants",
      genresLabel: "Working now",
      genres: ["Documentaries", "International content", "Thriller", "Horror", "Limited series / anthology"],
      hardest:
        "Steepest climb: the mid-budget prestige drama with no major star, no festival pedigree, and no pre-existing IP.",
      leversLabel: "Four levers you control",
      levers: [
        {
          title: "Track record → partnership",
          desc: "Attach a credible EP, sales agent, or production company Netflix already trusts.",
        },
        {
          title: "Festivals as strategy, not trophies",
          desc: "Netflix execs scout Sundance, Toronto, Tribeca, SXSW, Berlin and Cannes — plan the festival run before the film is finished.",
        },
        {
          title: "Audience as an asset",
          desc: "Followers, subscribers and email lists are proof of demand; opening-day viewership from your own community is the signal the algorithm rewards.",
        },
        {
          title: "The two-minute pitch",
          desc: "Hook (one sentence) + comparable titles (2–3) + audience (who, how large, why they care).",
        },
      ],
      test:
        "The test: can you say, in under 30 seconds, why someone who has already watched everything on Netflix will choose your film on a Wednesday night over anything else? If not, you're not ready to pitch.",
    },
    partners: {
      heading: "Distributor vs. Aggregator",
      blocks: [
        {
          title: "Distributor — the dealmaker",
          desc: "Sells your film, negotiates the deal, handles business and legal. Value = relationships. Cost = commission (~15%, sometimes 20–35%), often a multi-year rights term (3–7+). A bad one can sit on your film for years and still own the rights.",
        },
        {
          title: "Aggregator — the delivery specialist",
          desc: "Encodes to spec, runs QC, packages video/audio/subtitles/metadata/artwork, and submits through Netflix's portal. Netflix won't take direct delivery from an individual filmmaker — an approved partner is mandatory.",
        },
      ],
      remember: "Remember it this way: the distributor opens the door; the aggregator gets you through it.",
      tableHead: ["Partner", "Model", "Detail"],
      tableRows: [
        {
          cells: [
            "Quiver Digital",
            "Flat fee, 0% back-end",
            "~$1,395–$1,495 first platform, ~$225 each additional; you keep 100% of platform earnings.",
          ],
        },
        { cells: ["ODMedia", "Custom pricing", "Preferred aggregator for Netflix / Apple / Amazon / Google."] },
        { cells: ["The Movie Partnership", "Custom pricing", "European-based, strong international reach."] },
        { cells: ["NPFP program", "Authorization", "Netflix Preferred Fulfillment Partner status authorizes who can deliver into Backlot."] },
      ],
      footnote:
        "Flat vs. commission: on a $30,000 deal a 15% aggregator takes $4,500; a flat-fee aggregator takes ~$1,495 — roughly a $3,000 difference on a single deal.",
    },
    money: {
      heading: "What a Netflix deal actually pays",
      subhead: "Licensing fee $15,000/yr × 2 years",
      rows: [
        { label: "Gross licensing fee (2-year term)", value: "$30,000", kind: "gross" },
        { label: "Sales agent commission (15%)", value: "–$4,500", kind: "minus" },
        { label: "Aggregator (15%)", value: "–$4,500", kind: "minus" },
        { label: "Filmmaker net over two years", value: "≈ $21,000", kind: "net" },
      ],
      note:
        "Over the same two years the film earned 120,000+ viewer ratings on Netflix. It performed — and still netted ~$21,000. That $21,000 also bought global visibility, a career-opening credit, a proof point for every future deal, and an audience larger than most indie films ever find. One film on Netflix is a milestone; a catalog across platforms is a business.",
    },
    technical: {
      heading: "Technical delivery — the exhaustive spec",
      golden:
        "Golden rule: budget delivery costs from the very beginning — a funded line item before a single frame is shot. Delivery alone can meet or exceed the total production budget of most indie films.",
      groups: [
        {
          title: "Picture",
          rows: [
            { label: "Master format", value: "Apple ProRes 422 HQ or IMF (SMPTE ST 2067-21, App #2E)" },
            { label: "Resolution", value: "4K UHD 3840×2160 (standard for new content); HD 1920×1080 accepted for some ProRes deliveries" },
            { label: "Approved cameras", value: "ARRI Alexa, RED, Sony VENICE, Blackmagic URSA (decide before you shoot)" },
            { label: "Frame rate", value: "Native 23.976 / 24 / 25 (also 29.97 / 59.94); 3:2 pull-down rejected" },
            { label: "Aspect ratio", value: "Original AR preserved — no reformatting or cropping" },
            { label: "Codec / color", value: "ProRes 422 HQ / 4444, or XAVC; Rec.709 (HD) / Rec.2020 (4K), 10-bit preferred; H.264/H.265 rejected" },
          ],
        },
        {
          title: "Audio",
          rows: [
            { label: "Mix", value: "Fully-filled 5.1 (L, C, R, Ls, Rs, LFE); Dolby Atmos home mix where applicable" },
            { label: "Loudness", value: "−27 LKFS ±2 LU (dialog-gated, ITU-R BS.1770-1)" },
            { label: "True Peak", value: "≤ −2 dBTP (limiters at −2.3 dBFS)" },
            { label: "Monitoring", value: "Near-field at 79 or 82 dB SPL" },
            { label: "M&E", value: "Fully-filled 5.1 M&E submix, no dialogue" },
          ],
        },
        {
          title: "IMF, localization & delivery",
          bullets: [
            "IMF separates video/audio/subtitles/metadata into versioned components so Netflix builds territory versions without re-encoding — most indies let the aggregator handle IMF packaging.",
            "Localization is the cost bomb: subtitles in 20–30 languages; dubbing at tens of thousands per language — $50K–$100K+ across 10–15 languages. Who pays is a contract negotiation.",
            "Artwork: multiple poster and thumbnail versions to exact pixel specs.",
            "Metadata: titles and synopses per language, correct cast, crew, genre, content ratings per territory, runtime to the exact second.",
            "Delivery portal: Backlot is the only route in — no email, hard drives or Dropbox. You don't get direct access; only approved partners do. IaaS pre-checks return QC error codes.",
          ],
        },
      ],
      qc:
        "Netflix rejects roughly 20–30% of first submissions — color-space tagging, audio sync drift, subtitle timing, black levels, incomplete metadata. Fixes and resubmission can take weeks.",
    },
    contract: {
      heading: "The contract",
      intro: "It's a rental, not a sale. What to watch:",
      bullets: [
        "Licensing fee",
        "Term length (and exclusivity)",
        "Territories",
        "Localization responsibility ($50K–$100K+)",
        "Commission stack (sales agent ~15% + aggregator)",
        "Distributor minimum term (3–7+ years)",
      ],
      kicker:
        "The one misunderstanding that costs filmmakers most: walking in treating a Netflix licensing fee as a windfall rather than a milestone.",
    },
    steps: {
      heading: "Step-by-step assembly line",
      items: [
        { title: "Assess the film honestly", desc: "Decide which door is actually open to you." },
        { title: "Build positioning before you finish", desc: "Comps, festival plan, audience, press kit, trailer." },
        { title: "Shoot & finish to spec", desc: "Approved camera, 4K, native frame rate, correct color, 5.1 mix; budget for IMF + localization." },
        { title: "Run the festival / audience strategy", desc: "Plan the circuit and the community launch together." },
        { title: "Secure a partner", desc: "A sales agent or distributor with a Netflix pipeline, or an NPFP aggregator; attach a credible EP if you have no track record." },
        { title: "Pitch in two minutes", desc: "Hook, comps, audience — nothing else." },
        { title: "Negotiate the deal", desc: "Fee, term, territories, exclusivity, localization responsibility." },
        { title: "Deliver through the aggregator", desc: "Into Backlot; pass QC." },
        { title: "Launch, monitor, leverage the credit", desc: "Use performance data as the proof point for the next deal." },
        { title: "Build the catalog", desc: "One title is a milestone; a catalog is a business." },
      ],
    },
    faq: [
      {
        q: "Can I submit my film to Netflix directly?",
        a: "No — there's no open licensing portal and no direct technical delivery from individuals. You go through a sales agent or distributor (deal) and an approved aggregator (delivery).",
      },
      { q: "Do I need a distributor AND an aggregator?", a: "Often yes — one sells, one delivers. Some companies do both." },
      {
        q: "How much will I actually make?",
        a: "It's deal-dependent. The documented example netted ~$21,000 over two years across UK + US after commissions, for a film with 120,000+ ratings. A milestone and a credit, not a windfall.",
      },
      {
        q: "What does delivery cost?",
        a: "Potentially as much as or more than the film cost to make — 4K pipeline, 5.1/Atmos mix, M&E, IMF, subtitles (20–30 languages), dubbing (10–15 languages, $50K–$100K+), QC, aggregator fees, artwork and metadata.",
      },
      {
        q: "What format does Netflix want?",
        a: "ProRes 422 HQ/4444 or a compliant IMF package; 4K UHD, native frame rate, original aspect ratio, Rec.709/2020, 10-bit preferred — not H.264/H.265.",
      },
      {
        q: "Why did my film get rejected by QC?",
        a: "Netflix rejects 20–30% of first submissions — usually color-space tagging, audio sync drift, subtitle timing, black levels, or incomplete metadata.",
      },
      {
        q: "Is a Netflix Original impossible for me?",
        a: "Effectively closed without a track record, major representation, named talent, or pre-existing IP — build toward it.",
      },
      {
        q: "I have no track record — what do I do?",
        a: "Partner up. Attach an EP, sales agent, or production company Netflix already trusts.",
      },
    ],
  },

  hulu: {
    slug: "hulu",
    name: "Hulu",
    accent: "#1ce783",
    accentRgb: "28,231,131",
    catPill: "Tier 1 · Major Streamer",
    h1: "How to Get Your Film on Hulu",
    seoTitle: "How to Get Your Film on Hulu — Green Light Engine | Filmmaker Genius",
    seoDescription:
      "Hulu takes no direct submissions. The selectivity filter, the two real doors in, the flat-license money, and every deliverable — including the M&E track most filmmakers forget.",
    intro:
      "Hulu doesn't take submissions — and it doesn't take just anyone. Here's exactly what it takes: the selectivity filter, the two real doors in, the flat-license money, and every deliverable — including the M&E track most filmmakers forget.",
    stats: [
      { hi: "~50M", text: "subscribers (US)" },
      { hi: "100%", text: "owned by Disney" },
      { text: "Flat license, not ad-rev share" },
      { hi: "0", text: "direct submissions accepted" },
    ],
    introCallout:
      "Hulu is a US-focused, Disney-owned premium service (SVOD + ad-supported + Live TV), ~50 million subscribers, now folding into a unified Disney+ app through 2026. The core rule: you cannot submit to Hulu directly. Every indie film reaches Hulu through a distributor or an approved aggregator that Hulu already works with. The distributor opens the door; the aggregator gets you through it.",
    wants: {
      heading: "What Hulu is actually looking for",
      cards: [
        {
          label: "Signal 1",
          title: "Known / name actors",
          desc: "The single strongest signal — a marketing hook and predictable demand.",
          verdict: "Strongest single factor",
        },
        {
          label: "Signal 2",
          title: "High production value",
          desc: "It must look and sound like a premium release, not a micro-budget shoot.",
          verdict: "Non-negotiable bar",
        },
        {
          label: "Signal 3",
          title: "First-run preferred",
          desc: "Hulu wants freshness — titles not already free elsewhere. It will evaluate older films, but first-run wins.",
          verdict: "Freshness is leverage",
        },
      ],
      note:
        "Also bring a strong pitch package — logline, synopsis, trailer, key art and a pitch deck. On the Filmhub→Hulu channel a pitch deck materially improves your odds.",
    },
    doors: {
      heading: "The doors into Hulu",
      cards: [
        {
          label: "Door A",
          title: "Distributor",
          desc: "A distributor with a Hulu relationship (e.g. Gravitas Ventures) licenses your film to Hulu. Rev-share, sometimes a small minimum guarantee (MG).",
          verdict: "The classic, most proven path",
        },
        {
          label: "Door B",
          title: "Filmhub → Hulu",
          desc: "Filmhub's curated Hulu licensing channel. Selective (name cast / high production value / first-run). Flat upfront license, NOT ad-rev share. Pitch deck required.",
          verdict: "Accessible but selective",
        },
        {
          label: "Door C",
          title: "Hulu Originals",
          desc: "Through the Disney / ABC / FX / agency pipeline. For a first- or second-time filmmaker without representation this is effectively closed.",
          verdict: "What you build toward",
        },
      ],
    },
    flow: {
      heading: "The Hulu assembly line",
      steps: [
        { title: "Finished film", desc: "Name cast · premium · first-run" },
        { title: "Deliverables", desc: "ProRes master · captions · M&E track · transcription · key art · trailer · pitch deck" },
        { title: "Partner", desc: "Distributor OR the Filmhub→Hulu channel" },
        { title: "Hulu review", desc: "Selective; flat license negotiated" },
        { title: "Live on Hulu", desc: "Multi-year term; first check ~1–2 years" },
      ],
      note:
        "With a distributor you can window the release — lead with transactional (Apple/Amazon rent-buy), then Hulu (subscription), then ad-supported (Tubi) — coordinated with Hulu's first-run preference.",
    },
    money: {
      heading: "What a Hulu deal actually pays",
      subhead: "Case study — Electric Love (≈$100,000 budget) via Gravitas Ventures",
      rows: [
        { label: "Production budget", value: "$100,000", kind: "gross" },
        { label: "Minimum guarantee (advance ≈1/10 of budget)", value: "≈ $10,000 up front", kind: "plus" },
        { label: "Hulu license deal (flat, 7-year term)", value: "≈ $50,000", kind: "plus" },
        { label: "International sales", value: "≈ $20,000", kind: "plus" },
        { label: "Recouped over the term", value: "≈ $70,000 of $100K", kind: "net" },
      ],
      note:
        "The first check arrived roughly two years after release. Hulu paid a flat license fee — not per-view ad revenue. One Hulu license is a milestone; a multi-platform catalog is the business.",
      warning:
        "The same filmmakers' first film (15 North) was signed to a shady tertiary company WITHOUT a lawyer, routed through an aggregator, and never paid a dime — the company later went under with the money. Get a lawyer. Vet the partner's financial stability. Negotiate.",
    },
    technical: {
      heading: "Technical delivery checklist",
      groups: [
        {
          title: "Deliverables",
          rows: [
            { label: "Master file", value: "Apple ProRes 422 HQ preferred (H.264 accepted in some cases); DCP/IMF for certain workflows" },
            { label: "Resolution", value: "Up to 4K UHD; HD accepted; native frame rate, original aspect ratio" },
            { label: "Closed captions", value: "Required — CEA-608/708-compliant, accurate timing" },
            { label: "M&E track", value: "REQUIRED — Music & Effects, full mix without dialogue, for international dubbing (often hired out)" },
            { label: "Transcription", value: "Complete transcription of every line of dialogue" },
            { label: "Key art / posters", value: "Multiple versions to spec (the thumbnail drives home-screen clicks)" },
            { label: "Trailer", value: "Official trailer to spec" },
            { label: "Metadata", value: "Title, logline, synopsis (multiple lengths), cast/crew, genre, rating, runtime, year, language" },
            { label: "Pitch deck", value: "Strengthens selective channels (Filmhub→Hulu)" },
          ],
        },
      ],
      qc:
        "Expect a rigorous pass — frame-rate errors, ghosting, macro-blocking, caption timing, audio sync and incomplete metadata are common rejection causes. Your encoding house runs QC before delivery; Hulu runs its own after.",
    },
    contract: {
      heading: "The contract — what to watch",
      bullets: [
        "Get a lawyer (the #1 way indie filmmakers lose money is signing without one).",
        "Term length — often 5–7 years; know when rights revert.",
        "Rights & territory — worldwide vs territory; exclusive vs non-exclusive; first-run/exclusivity may be required.",
        "MG recoupment — an advance is recouped before you see more.",
        "Commission & expenses — what the distributor takes and what comes off the top.",
        "Deliverable costs — who pays for the M&E track, captions, encoding and QC fixes.",
        "Reversion & audit rights — can you terminate for non-performance; can you audit statements.",
        "Vet financial stability — aggregator bankruptcies (e.g. the Distribber collapse) have wiped out filmmakers' earnings.",
      ],
    },
    steps: {
      heading: "Step-by-step to Hulu",
      items: [
        { title: "Build to the criteria", desc: "Recognizable cast, premium production value, keep it first-run." },
        { title: "Prepare deliverables", desc: "ProRes master, captions, M&E track, transcription, key art, trailer, metadata, pitch deck." },
        { title: "Choose your door", desc: "A distributor with a Hulu relationship, or the Filmhub→Hulu channel." },
        { title: "Vet the partner & lawyer up", desc: "Financial stability and a real entertainment attorney before signature." },
        { title: "Window the release", desc: "TVOD first, then Hulu, then AVOD." },
        { title: "Pitch & negotiate", desc: "Hook, name cast, comps, audience; then fee/MG, term, territory, exclusivity, recoupment, audit rights." },
        { title: "Deliver & pass QC", desc: "Encoding house QC first, Hulu QC after." },
        { title: "Launch, track, stack", desc: "Expect the first check ~1–2 years out; build the catalog." },
      ],
    },
    faq: [
      {
        q: "Can I submit my film to Hulu directly?",
        a: "No — Hulu takes no direct submissions. You go through a distributor, an aggregator, or the curated Filmhub→Hulu channel.",
      },
      {
        q: "What does Hulu want?",
        a: "Known/name actors, high production value, first-run (not already free elsewhere), a clear audience, and a strong pitch deck.",
      },
      {
        q: "Does Hulu pay per view like Tubi?",
        a: "No — for licensed indie films Hulu typically pays a flat, upfront license fee for a multi-year term, not ad-revenue share.",
      },
      {
        q: "How much can I make?",
        a: "Deal-dependent. Electric Love earned ~$50K from Hulu (half a ~$100K budget) on a 7-year term. A milestone, not a windfall.",
      },
      {
        q: "What's an M&E track and do I need one?",
        a: "Music & Effects — your full mix minus dialogue, so the film can be dubbed internationally. Yes, Hulu requires it (often hired out).",
      },
      {
        q: "Is Filmhub a legit way onto Hulu?",
        a: "Yes — via Filmhub's selective Hulu licensing channel. It's curated (name cast / high production value / first-run), pays an upfront license rather than ad-rev share, and you should upload a pitch deck.",
      },
      { q: "Do I need a lawyer?", a: "Yes — the most common way filmmakers lose money is signing distribution deals without one." },
      {
        q: "Hulu is merging into Disney+ — does that change my path?",
        a: "Content and licensing continue; Hulu becomes a hub inside Disney+. Your path in (distributor/aggregator) is unchanged and the premium bar stays high.",
      },
      {
        q: "My film has no name cast — what do I do?",
        a: "Target Tier 3 (Tubi, Roku, Pluto via Filmhub) first, build audience and performance data, then strengthen a later Hulu pitch.",
      },
    ],
  },

  amazon: {
    slug: "amazon",
    name: "Amazon Prime Video",
    accent: "#00a8e1",
    accentRgb: "0,168,225",
    catPill: "Tier 1 · Major Streamer",
    h1: "How to Get Your Film on Amazon Prime Video",
    seoTitle: "How to Get Your Film on Amazon Prime Video — Green Light Engine | Filmmaker Genius",
    seoDescription:
      "The widest-reach Tier 1 platform — but the self-publish door has narrowed. The aggregator path in, what it really pays, delivery specs, and how to keep your title from getting pruned.",
    intro:
      "The biggest audience in the tier — and a lower talent bar than Netflix or Hulu. But the self-publish door has narrowed and the money is engagement-driven. Here's the real path in, what it pays, and how to keep your title from getting pruned.",
    stats: [
      { hi: "200M+", text: "Prime Video subscribers" },
      { hi: "315M+", text: "monthly ad-supported viewers" },
      { hi: "16", text: "ad markets — beats Netflix ad reach" },
      { hi: "20%", text: "Filmhub revenue share, no upfront fee" },
    ],
    introCallout:
      "Amazon is a retail-and-advertising company that happens to run a streaming service. Its priority is Prime retention and ad inventory — so the reach is enormous and the talent bar is lower than Netflix/Hulu, but the per-title money is thin and Amazon has been tightening who can self-publish. Prime Video Direct — Amazon's old self-publish program — stopped accepting unsolicited documentaries and short-form content, repeatedly slashed its per-hour royalties, and removes low-engagement titles. The reliable path now is through an aggregator or distributor.",
    doors: {
      heading: "The doors into Prime Video",
      cards: [
        {
          label: "Door A",
          title: "An aggregator",
          desc: "Delivers your film to Amazon's spec and places it across TVOD/SVOD/AVOD. Filmhub is dominant: no upfront fee, 20% revenue share, free delivery, non-exclusive.",
          verdict: "Most accessible — start here",
        },
        {
          label: "Door B",
          title: "A distributor",
          desc: "Licenses/sells your film across platforms including Amazon, for a commission (and sometimes exclusivity + a multi-year term). A human advocate and broader sales.",
          verdict: "For broader sales",
        },
        {
          label: "Door C",
          title: "Prime Video Direct",
          desc: "Self-publish still exists for some features in some regions, but is closed to unsolicited docs/shorts, low-paying, and prone to takedown.",
          verdict: "Restricted — not reliable",
        },
      ],
    },
    wants: {
      heading: "What Amazon actually wants",
      leversLabel: "The four things that matter",
      levers: [
        {
          title: "Genre clarity + strong artwork",
          desc: "The thumbnail and title do the selling in a massive catalog.",
        },
        {
          title: "Flawless deliverables",
          desc: "Captions, artwork and metadata must be clean and complete — the top causes of QC delay.",
        },
        {
          title: "Engagement / watch-time",
          desc: "AVOD pays per hour and included-with-Prime pays on engagement, so a strong opening and real watch-time are the currency.",
        },
        {
          title: "Multi-model placement",
          desc: "TVOD + SVOD + AVOD together dramatically outperform TVOD-only.",
        },
      ],
      note:
        "Amazon is less about name talent than Netflix/Hulu — but you must drive your own audience, because Amazon removes low-engagement titles.",
    },
    partners: {
      heading: "How the aggregator path works",
      blocks: [
        {
          title: "Aggregator",
          desc: "Handles delivery, QC, metadata, captions and conforms your package to Amazon's spec — usually non-exclusive.",
        },
        {
          title: "Distributor",
          desc: "Sells your film across platforms and negotiates terms; may want exclusivity and a multi-year rights term.",
        },
      ],
      tableHead: ["Partner", "Model", "Detail"],
      tableRows: [
        {
          cells: [
            "Filmhub",
            "20% rev-share, no upfront",
            "Free delivery to Amazon specs (conversion, artwork, captions, QC). ~$500 optional QC fee added in 2026; skipping it can limit channels. Non-exclusive.",
          ],
        },
        {
          cells: [
            "Bitmax / Premiere Digital",
            "Fixed / custom",
            "Established aggregators delivering premium TVOD/SVOD/AVOD to Amazon.",
          ],
        },
        {
          cells: [
            "Distributor",
            "Commission",
            "Broader sales + an advocate; may want exclusivity and a term.",
          ],
        },
      ],
    },
    money: {
      heading: "How Amazon pays",
      subhead: "Volume-and-engagement, not an upfront check",
      rows: [
        { label: "TVOD (rent/buy)", value: "Share of each transaction", kind: "plus" },
        { label: "AVOD (ad-supported)", value: "Small per-hour-streamed royalty (repeatedly cut)", kind: "minus" },
        { label: "SVOD (included with Prime)", value: "Engagement-based earnings", kind: "plus" },
        { label: "Aggregator fee (Filmhub)", value: "20% + optional ~$500 QC fee", kind: "net" },
      ],
      note:
        "Most Amazon revenue is a launch spike (often TVOD) plus a small long tail of AVOD/SVOD. One title rarely pays a mortgage; a catalog with strong watch-time is the business. Because Amazon removes low-engagement titles, you must drive your own audience to the page.",
    },
    technical: {
      heading: "Technical delivery checklist",
      groups: [
        {
          title: "Deliverables",
          rows: [
            {
              label: "Master file",
              value:
                "Apple ProRes preferred (high-bitrate H.264/H.265 accepted); up to 4K UHD, HD accepted; native frame rate, original aspect ratio",
            },
            {
              label: "Closed captions",
              value:
                "Required and strictly checked (CEA-608/708 or SRT/TTML) — the #1 cause of rejection/delay",
            },
            {
              label: "Artwork",
              value: "Cover/box art + thumbnails to Amazon's exact pixel specs",
            },
            {
              label: "Metadata",
              value:
                "Title, synopsis, genre, cast/crew, rating, runtime, year, language, keywords — complete and correct",
            },
            {
              label: "Trailer",
              value: "Preview/trailer to spec",
            },
            {
              label: "Audio",
              value: "Stereo minimum; 5.1 where available",
            },
          ],
        },
      ],
      qc:
        "Amazon checks video, audio, captions, artwork and metadata. Frame-rate errors, caption timing and incomplete metadata are the usual rejection causes; your aggregator runs QC and fixes them first.",
    },
    contract: {
      heading: "The contract — what to watch",
      bullets: [
        "Aggregator terms — Filmhub is non-exclusive at 20% (you can leave and pull your film); distributors may want exclusivity + a multi-year term.",
        "The QC fee — Filmhub's ~$500 QC fee is 'optional' but skipping it can limit your channels.",
        "Rights & exclusivity — don't grant exclusive rights that block Tubi/Roku/Apple unless justified.",
        "Takedown risk — Amazon removes low-engagement titles; keep the ability to re-list or move.",
        "Get a lawyer for any distributor contract; always read even the self-serve terms.",
      ],
    },
    steps: {
      heading: "Step-by-step to Amazon",
      items: [
        { title: "Finish a clean, high-quality master", desc: "ProRes preferred, native frame rate." },
        { title: "Prepare deliverables", desc: "Closed captions, cover art + thumbnails, complete metadata, trailer." },
        { title: "Choose your door", desc: "Filmhub (fast, non-exclusive, 20%) for most; a distributor for broader sales." },
        { title: "Deliver & pass QC", desc: "The aggregator conforms to Amazon spec." },
        { title: "Select models & territories", desc: "Enable TVOD + SVOD + AVOD together." },
        { title: "Drive your own audience", desc: "Amazon rewards engagement and prunes low watch-time." },
        { title: "Track & optimize", desc: "Refresh artwork/metadata; keep the title engaged." },
        { title: "Build the catalog", desc: "Across platforms and titles." },
      ],
    },
    faq: [
      {
        q: "Can I still self-publish via Prime Video Direct?",
        a: "Largely no for docs and shorts — PVD stopped accepting unsolicited non-fiction and short-form, cut royalties, and removes low-engagement titles. Use an aggregator or distributor.",
      },
      {
        q: "What's the easiest way onto Amazon Prime Video?",
        a: "An aggregator like Filmhub — no upfront fee, 20% revenue share, free delivery to Amazon specs, non-exclusive.",
      },
      {
        q: "How much does Amazon pay?",
        a: "Volume/engagement-based: TVOD per transaction, AVOD a small per-hour-streamed royalty (repeatedly cut), SVOD on engagement. Expect a launch spike plus a small long tail — not a big upfront check.",
      },
      {
        q: "Do I need name actors?",
        a: "No — Amazon is more forgiving on talent. But you need clean deliverables, strong artwork/metadata, and the ability to drive watch-time.",
      },
      {
        q: "What format does Amazon want?",
        a: "A high-quality ProRes (or high-bitrate H.264) master, required closed captions, cover art/thumbnails to spec, complete metadata — up to 4K, native frame rate.",
      },
      {
        q: "Why did my film get rejected or removed?",
        a: "Rejections are usually caption timing, frame-rate errors, or incomplete metadata. Removals are usually low engagement — Amazon prunes titles nobody watches.",
      },
      {
        q: "TVOD, SVOD, or AVOD?",
        a: "All three together — optimized multi-model placement dramatically outperforms TVOD-only.",
      },
    ],
  },

  "apple-tv": {
    slug: "apple-tv",
    name: "Apple TV / iTunes",
    accent: "#c9d1dc",
    accentRgb: "201,209,220",
    catPill: "Tier 1 · Major Streamer",
    h1: "How to Get Your Film on Apple TV / iTunes",
    seoTitle: "How to Get Your Film on Apple TV / iTunes — Green Light Engine | Filmmaker Genius",
    seoDescription:
      "A prestigious rent/buy storefront in 100+ countries — but you can't submit directly, and it isn't Apple TV+. The approved-aggregator path, the iTunes Store Package spec, and what it pays.",
    intro:
      "A prestigious rent/buy storefront reaching 100+ countries — but you can't submit directly, and it isn't Apple TV+. Here's the approved-aggregator path in, the iTunes Store Package spec, and exactly what it pays.",
    stats: [
      { hi: "100+", text: "countries (Apple TV app)" },
      { hi: "~70%", text: "to filmmaker after Apple's cut" },
      { hi: ".itmsp", text: "iTunes Store Package required" },
      { hi: "0", text: "direct submissions accepted" },
    ],
    introCallout:
      "Apple TV / iTunes is a transactional rent/buy (TVOD) storefront open to indies via aggregators. Apple TV+ is Apple's originals subscription service (~47–48M subscribers) — commissioned premium content, effectively closed to independents. Don't confuse the two. The core rule: you cannot submit to Apple directly. Every film reaches the Apple TV app / iTunes Store through an Apple-approved aggregator (or an approved encoding house, only if you already hold a direct Apple delivery agreement). Apple publishes a ranked list of approved partners.",
    doors: {
      heading: "The doors into Apple TV",
      cards: [
        {
          label: "Door A",
          title: "Approved aggregator",
          desc: "Builds your iTunes Store Package, delivers it, clears QC, reports sales. Quiver (flat fee, 0% back-end), Bitmax (major, high-volume), or Filmhub (20%, non-exclusive).",
          verdict: "The path for virtually everyone",
        },
        {
          label: "Door B",
          title: "Encoding house",
          desc: "Formats and QCs your package to Apple's standard — but only usable if you already hold a direct delivery agreement with Apple. Rare for indies.",
          verdict: "Only with a direct Apple deal",
        },
        {
          label: "Door C",
          title: "Apple TV+ originals",
          desc: "Apple's originals subscription — commissioned/acquired via agencies, major producers, festival deals. Effectively closed to indies.",
          verdict: "What you build toward",
        },
      ],
    },
    wants: {
      heading: "What Apple actually wants",
      leversLabel: "The quality gate",
      levers: [
        {
          title: "A pristine, compliant master",
          desc: "ProRes-based, correct frame rate, correct color, clean audio — Apple QC rejects non-compliant files.",
        },
        {
          title: "Correct captions & subtitles",
          desc: "Accessibility compliance is mandatory; caption timing/format is a top rejection cause. Subtitles/dubbing may be needed per territory.",
        },
        {
          title: "Polished artwork & complete metadata",
          desc: "The storefront is curated and premium — sloppy assets get rejected or buried.",
        },
        {
          title: "A reason to buy",
          desc: "It's transactional, so name talent, festival pedigree, strong reviews, or a built-in audience drive rentals and purchases.",
        },
      ],
      note: "Apple TV is a quality-gated premium storefront — a prestige placement as much as a revenue channel.",
    },
    partners: {
      heading: "The approved aggregators",
      blocks: [
        {
          title: "Approved aggregator",
          desc: "Builds the .itmsp, runs QC, delivers to Apple — required for virtually everyone without a direct Apple deal.",
        },
        {
          title: "Encoding house",
          desc: "Formats and QCs the package — only usable if you already hold a direct Apple delivery agreement.",
        },
      ],
      tableHead: ["Partner", "Model", "Detail"],
      tableRows: [
        {
          cells: [
            "Quiver Digital",
            "Flat fee, 0% back-end",
            "Indie gold standard — pay once, keep 100% of your net. Endorsed by Sundance's Creative Distribution Initiative.",
          ],
        },
        {
          cells: [
            "Bitmax",
            "Major aggregator",
            "Delivers premium VOD/SVOD/AVOD/TVOD; among the largest-volume providers.",
          ],
        },
        {
          cells: [
            "Filmhub",
            "20% rev-share",
            "Self-serve, non-exclusive, no upfront fee; delivers to Apple among 100+ channels.",
          ],
        },
      ],
    },
    money: {
      heading: "How Apple pays",
      subhead: "Transactional — higher value per sale, lower volume",
      rows: [
        { label: "Apple's platform cut", value: "~30%", kind: "minus" },
        { label: "Filmmaker side", value: "~70% of each transaction", kind: "plus" },
        { label: "Aggregator fee", value: "Quiver flat fee (0% back-end) / Filmhub 20%", kind: "net" },
      ],
      note:
        "Apple TV/iTunes is a prestige + transactional channel. Revenue depends on how many people you drive to rent or buy — so it rewards films with a built-in audience, a launch push, or name recognition. One high-value tile in a multi-platform release, not a stand-alone payday.",
    },
    technical: {
      heading: "The iTunes Store Package",
      groups: [
        {
          title: "Deliverables (.itmsp)",
          rows: [
            {
              label: "Video master",
              value:
                "Apple ProRes 422 HQ (SD/HD); ProRes 4444 / 4444 XQ required for HDR. Built via Compressor or the encoding house",
            },
            {
              label: "Resolution",
              value:
                "Up to 4K UHD (HDR / Dolby Vision supported); HD accepted; native frame rate, original aspect ratio",
            },
            {
              label: "Closed captions",
              value: "Required — CEA-608/708-compliant, accurate timing",
            },
            {
              label: "Subtitles / dubbing",
              value: "Subtitle files and/or dub tracks per target territory as needed",
            },
            {
              label: "Audio",
              value: "Stereo minimum; 5.1 where available; Dolby Atmos supported",
            },
            {
              label: "Artwork",
              value: "Cover art / poster to Apple's exact pixel dimensions and format",
            },
            {
              label: "Metadata",
              value:
                "Title, synopsis, genre, cast/crew, rating, runtime, year, language, and Apple-required fields",
            },
          ],
        },
      ],
      qc:
        "The encoding house re-encodes into the resolutions, audio formats and bitrates Apple needs, then Apple runs rigorous QC. Frame-rate, caption timing, encoding, color and metadata issues are the usual rejection causes.",
    },
    contract: {
      heading: "The contract — what to watch",
      bullets: [
        "Fee model — flat-fee (Quiver) vs. revenue-share (Filmhub 20%) vs. fixed service fee; run the math for your volume. Flat fee wins on larger sales.",
        "Exclusivity — Filmhub is non-exclusive (leave anytime); a distributor may want exclusivity + a term.",
        "Territories & pricing — confirm countries and price tiers; keep the right to distribute elsewhere.",
        "Reporting & payment — how and when you're paid; transaction-level reporting.",
        "Deliverable costs — who pays for encoding, captions, subtitles/dubbing, and QC fixes.",
        "Vet financial stability — the Distribber collapse wiped out filmmakers when an aggregator went under holding their money.",
      ],
    },
    steps: {
      heading: "Step-by-step to Apple TV",
      items: [
        { title: "Finish a pristine, compliant master", desc: "ProRes 422 HQ (ProRes 4444/4444 XQ for HDR), native frame rate, correct color and audio." },
        { title: "Prepare deliverables", desc: "Closed captions, subtitles as needed, poster/artwork to spec, complete metadata, trailer." },
        { title: "Choose an Apple-approved aggregator", desc: "Quiver, Bitmax, or Filmhub; confirm they're on Apple's approved list." },
        { title: "Package & deliver", desc: "The partner builds the .itmsp iTunes Store Package." },
        { title: "Pass Apple QC", desc: "Fix any rejections and resubmit." },
        { title: "Set territories & price tiers", desc: "Global or selected markets; rental/purchase pricing." },
        { title: "Drive rentals/purchases", desc: "It's transactional; launch with a real push." },
        { title: "Track & stack", desc: "One high-value, prestige tile; build the catalog." },
      ],
    },
    faq: [
      {
        q: "Can I submit my film to Apple TV / iTunes directly?",
        a: "No. You must go through an Apple-approved aggregator (or an approved encoding house if you already hold a direct Apple delivery agreement).",
      },
      {
        q: "Is Apple TV the same as Apple TV+?",
        a: "No. Apple TV / iTunes is a transactional rent/buy storefront open to indies via aggregators. Apple TV+ is Apple's originals subscription (~47–48M subs), effectively closed to indies.",
      },
      {
        q: "Which aggregator should I use?",
        a: "Reputable Apple-approved ones include Quiver Digital (flat fee, 0% back-end), Bitmax (major, high-volume), and Filmhub (20%, non-exclusive). Match the fee model to expected sales.",
      },
      {
        q: "How much does Apple pay?",
        a: "Roughly 70% to the filmmaker after Apple's ~30% cut, then your aggregator's fee. Per-transaction (rent/buy) — higher value per sale than ad platforms, lower volume.",
      },
      {
        q: "What master format does Apple want?",
        a: "ProRes 422 HQ for SD/HD; ProRes 4444 / 4444 XQ for HDR; up to 4K UHD, native frame rate, original aspect ratio, required closed captions, complete metadata — packaged as an iTunes Store Package (.itmsp).",
      },
      {
        q: "Why did my film fail Apple QC?",
        a: "Usually caption timing/format, frame-rate issues, non-compliant encoding, color, or incomplete metadata. Your encoding house/aggregator fixes and resubmits.",
      },
      {
        q: "Can I get on Apple TV+?",
        a: "Effectively closed to indies without representation and a premium package — build toward it through festivals, track record, and partners.",
      },
    ],
  },
};
