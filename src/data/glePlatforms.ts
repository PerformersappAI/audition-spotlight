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
};
