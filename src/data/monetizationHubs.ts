export type MonetizationStat = { hi?: string; text: string };
export type MonetizationTile = {
  num: string;
  cat: string;
  title: string;
  desc: string;
  count: string;
  tags: string[];
  to: string;
};
export type MonetizationHub = {
  accent: string;
  accentRgb: string;
  keyBg: string;
  keyBg2: string;
  canonical: string;
  title: string;
  sub: string;
  stats: MonetizationStat[];
  whatIsHeading: string;
  whatIsBody: string;
  keyFactsHeading: string;
  keyFacts: string[];
  sectionLabel: string;
  tiles: MonetizationTile[];
};

export const monetizationHubs: Record<string, MonetizationHub> = {
  aggregators: {
    accent: "#34d399",
    accentRgb: "52,211,153",
    keyBg: "#071a10",
    keyBg2: "#0a2d1a",
    canonical: "https://filmmakergenius.com/academy/film-aggregator-list",
    title: "Aggregators",
    sub: "Technical delivery partners who place your film on major VOD platforms — without acquiring your rights or locking you into long-term contracts.",
    stats: [
      { hi: "10", text: "companies" },
      { hi: "3", text: "categories" },
      { text: "You retain full rights" },
      { text: "No acquisition required" },
    ],
    whatIsHeading: "What is an Aggregator?",
    whatIsBody:
      "An aggregator is a company that handles the technical and administrative work of getting your film onto major VOD platforms — encoding, metadata, contracts, and delivery. Unlike distributors, they don't acquire rights or ownership of your film. You stay in control and can usually end the relationship at will. The trade-off: marketing and audience-building remain entirely on you.",
    keyFactsHeading: "Key Facts",
    keyFacts: [
      "No rights acquisition — you own your film",
      "Fee-based ($1,000–$2,500) or revenue share (15–20%)",
      "Access to iTunes, Amazon, Google TV, Tubi & more",
      "No marketing support — promotion is your responsibility",
      "Best for indie filmmakers with limited budgets & no industry connections",
    ],
    sectionLabel: "Browse by model",
    tiles: [
      {
        num: "01",
        cat: "Business Model",
        title: "Fee-Based",
        desc: "Pay a flat upfront fee per platform and keep 100% of your revenue after the platform's cut. Higher risk up front — but no ongoing revenue split. Best for filmmakers with a marketing plan in place.",
        count: "4 companies",
        tags: ["Bitmax", "Quiver Digital", "Premiere Digital", "Under the Milky Way"],
        to: "/academy/aggregators/fee-based",
      },
      {
        num: "02",
        cat: "Business Model",
        title: "Revenue Share",
        desc: "No upfront cost to get on platforms. The aggregator takes 15–20% of your film's earnings instead. Lower barrier to entry — ideal for filmmakers without a large initial budget.",
        count: "3 companies",
        tags: ["Filmhub", "Kinonation", "Altavod"],
        to: "/academy/aggregators/revenue-share",
      },
      {
        num: "03",
        cat: "Business Model",
        title: "Hybrid Model",
        desc: "Companies that function as both aggregators and distributors depending on the deal. They may act as a simple delivery partner for some windows and take rights for others. Understand the deal before you sign.",
        count: "3 companies",
        tags: ["Indie Rights", "Giant Pictures", "Echelon Studios"],
        to: "/academy/aggregators/hybrid",
      },
    ],
  },
  distributors: {
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    keyBg: "#060f1a",
    keyBg2: "#0a1a2d",
    canonical: "https://filmmakergenius.com/academy/film-distributor-list",
    title: "Distributors",
    sub: "Rights-acquiring partners who license and place your film across platforms, taking a commission in exchange for marketing support, platform relationships, and broader reach.",
    stats: [
      { hi: "26+", text: "companies" },
      { hi: "6", text: "categories" },
      { text: "20–40% commission" },
      { text: "7–15 year terms typical" },
    ],
    whatIsHeading: "What is a Distributor?",
    whatIsBody:
      "Distributors acquire rights to your film for a defined term and territory, then commercially exploit it across platforms, broadcasters, international markets, airlines, and physical media. Unlike aggregators, they control how and where your film is sold. In return, they bring real marketing power — press, platform relationships, and strategic release timing. Most distributors recoup their expenses first, then take 20–40% before paying you.",
    keyFactsHeading: "Key Facts",
    keyFacts: [
      "They acquire rights — you give up some control",
      "Commission: 20–40% after recouping expenses",
      "Terms: typically 7–15 years per territory",
      "Can access Netflix, Hulu, AVOD & FAST — aggregators cannot",
      "Minimum guarantees (MGs) rare but possible for strong films",
    ],
    sectionLabel: "Browse by specialty",
    tiles: [
      {
        num: "01",
        cat: "Specialty",
        title: "Full-Service & Wide Release",
        desc: "High-volume distributors with wide platform reach, strong digital and broadcast relationships, and experience moving commercial indie films across all major VOD windows.",
        count: "5 companies",
        tags: ["Gravitas Ventures", "Cineverse", "FilmRise", "Level 33", "TriCoast"],
        to: "/academy/distributors/full-service",
      },
      {
        num: "02",
        cat: "Specialty",
        title: "Arthouse & Prestige",
        desc: "Curated distributors focused on festival-caliber, critically driven, and internationally recognized cinema. Offer awards positioning, theatrical campaigns, and academic/institutional markets.",
        count: "7 companies",
        tags: ["Kino Lorber", "Cinema Guild", "Cohen Media", "First Run Features", "Blue Fox", "Canyon Cinema", "GoDigital / Amplify"],
        to: "/academy/distributors/arthouse",
      },
      {
        num: "03",
        cat: "Specialty",
        title: "Genre Specialists",
        desc: "Distributors with deep roots in horror, cult, sci-fi, and genre-driven films. Bring pre-built fan communities, genre-specific PR, and placement on niche AVOD/SVOD channels.",
        count: "5 companies",
        tags: ["Shout! / Scream Factory", "Terror Films", "Gunpowder & Sky", "Dark Star Pictures", "Passion River"],
        to: "/academy/distributors/genre",
      },
      {
        num: "04",
        cat: "Specialty",
        title: "Documentary",
        desc: "Distributors specializing in nonfiction storytelling, with broadcaster relationships (BBC, PBS, Al Jazeera), festival pipelines, and educational/institutional licensing channels.",
        count: "4 companies",
        tags: ["Journeyman Pictures", "IndiePix", "Watermelon Pictures", "Freestyle Digital"],
        to: "/academy/distributors/documentary",
      },
      {
        num: "05",
        cat: "Specialty",
        title: "International & Sales Agent",
        desc: "Distributors and sales agents who specialize in cross-border licensing, international TV deals, and market representation at Cannes, AFM, and Berlin.",
        count: "4 companies",
        tags: ["House of Film", "Mongrel Media", "TriCoast Worldwide", "Vision Films"],
        to: "/academy/distributors/international",
      },
      {
        num: "06",
        cat: "Specialty",
        title: "Digital-First",
        desc: "Revenue-share distributors focused primarily on VOD — minimal theatrical or physical media. Wide digital footprint with lower barriers to entry for emerging indie filmmakers.",
        count: "5 companies",
        tags: ["BayView Entertainment", "Breaking Glass", "Echelon Studios", "New Video / Cinedigm", "Freestyle Digital"],
        to: "/academy/distributors/digital-first",
      },
    ],
  },
  vod: {
    accent: "#a855f7",
    accentRgb: "168,85,247",
    keyBg: "#0f0a1a",
    keyBg2: "#1a0f2d",
    canonical: "https://filmmakergenius.com/academy/vod-platforms",
    title: "VOD Platforms",
    sub: "The consumer-facing streaming services where audiences find and watch your film. Most require an aggregator or distributor to access — but some accept indie submissions directly.",
    stats: [
      { hi: "80+", text: "platforms" },
      { hi: "8", text: "categories" },
      { text: "SVOD · TVOD · AVOD · FAST" },
      { text: "Global reach" },
    ],
    whatIsHeading: "How VOD Platforms Work",
    whatIsBody:
      "VOD (Video on Demand) platforms are where audiences actually watch your film. There are four main models: SVOD (subscription), TVOD (pay-per-title), AVOD (free with ads), and FAST (free scheduled channels). Most major platforms — Netflix, Hulu, Tubi — won't accept films directly from unknown indie filmmakers. You access them through aggregators (technical delivery) or distributors (rights-based deals). Some niche platforms do accept direct submissions.",
    keyFactsHeading: "VOD Models at a Glance",
    keyFacts: [
      "<strong>SVOD</strong> — Monthly subscription (Netflix, Hulu, Shudder)",
      "<strong>TVOD</strong> — Pay per rental or purchase (iTunes, Google TV)",
      "<strong>AVOD</strong> — Free with ads (Tubi, Pluto TV, Roku)",
      "<strong>FAST</strong> — Free scheduled channels (Samsung TV+, LG Channels)",
      "<strong>Hybrid</strong> — Multiple models on one platform (Amazon Prime, YouTube)",
    ],
    sectionLabel: "Browse by category",
    tiles: [
      {
        num: "01",
        cat: "Category",
        title: "Major Platforms",
        desc: "The mainstream high-volume streamers where the largest audiences live. Most require aggregators or distributors to access.",
        count: "22 platforms",
        tags: ["Netflix", "Amazon Prime", "Hulu", "Tubi", "Roku", "Pluto TV"],
        to: "/academy/vod/major-platforms",
      },
      {
        num: "02",
        cat: "Category",
        title: "Arthouse & Prestige",
        desc: "Curated platforms for festival-caliber and critically recognized cinema. Highly selective — distributor relationships are usually required.",
        count: "15 platforms",
        tags: ["Criterion Channel", "MUBI", "BFI Player", "Sundance Now", "Fandor"],
        to: "/academy/vod/arthouse",
      },
      {
        num: "03",
        cat: "Category",
        title: "Genre",
        desc: "Horror, cult, sci-fi, martial arts, and genre-defining platforms with dedicated fan communities and niche programming teams.",
        count: "8 platforms",
        tags: ["Shudder", "Screambox", "Arrow Player", "Full Moon", "Hi-YAH!"],
        to: "/academy/vod/genre",
      },
      {
        num: "04",
        cat: "Category",
        title: "Documentary",
        desc: "Platforms dedicated to nonfiction storytelling — from global SVOD services to niche doc hubs with festival-grade curation standards.",
        count: "9 platforms",
        tags: ["CuriosityStream", "MagellanTV", "Docurama", "GuideDoc", "Tënk"],
        to: "/academy/vod/documentary",
      },
      {
        num: "05",
        cat: "Category",
        title: "LGBTQ+",
        desc: "Streaming platforms dedicated to queer stories — from global FAST networks to niche SVODs focused on gay, lesbian, bisexual, trans, and nonbinary narratives.",
        count: "11 platforms",
        tags: ["Revry", "OUTtv", "Dekkoo", "GagaOOLala", "TelloFilms"],
        to: "/academy/vod/lgbtq",
      },
      {
        num: "06",
        cat: "Category",
        title: "Black Cinema",
        desc: "Platforms spotlighting Black indie films, African diaspora stories, and Black-owned cultural content — from grassroots SVOD to premium AMC Networks programming.",
        count: "6 platforms",
        tags: ["KweliTV", "ALLBLK", "Maverick Black Cinema", "AfroLandTV"],
        to: "/academy/vod/black-cinema",
      },
      {
        num: "07",
        cat: "Category",
        title: "International",
        desc: "Region-specific and diaspora platforms serving global audiences — from Ukrainian cinema to Cambodian OTT, Bengali SVOD, and Southeast Asian streaming.",
        count: "10 platforms",
        tags: ["FilmDoo", "AsianCrush", "Hoichoi", "Klassiki", "Takflix"],
        to: "/academy/vod/international",
      },
      {
        num: "08",
        cat: "Category",
        title: "Shorts",
        desc: "Platforms dedicated to short films — from global YouTube channels with millions of subscribers to curated indie hubs that connect shorts to festivals, distributors, and industry scouts.",
        count: "8 platforms",
        tags: ["Short of the Week", "Omeleto", "ShortVerse", "Nowness", "Film Shortage"],
        to: "/academy/vod/shorts",
      },
    ],
  },
};
