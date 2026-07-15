import type { GlePlatform } from "@/data/gleTiers";

export type GleNiche = {
  accent: string;
  canonical: string;
  title: string;
  sub: string;
  platforms: GlePlatform[];
};

export const gleNiche: Record<string, GleNiche> = {
  "black-cinema": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/black-cinema",
    title: "Black Cinema",
    sub: "Platforms built for Black film and the African diaspora. Pick one to see exactly how to get your film in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "K", logoBg: "#e0233a", pill: "Direct submissions", name: "KweliTV", desc: "SVOD for Black indie films, docs, web series & kids. Curated review for cultural fit." },
      { logoText: "A", logoBg: "#111", logoBorder: "#555", name: "ALLBLK", desc: "Premium SVOD (AMC Networks) — films, series, stage plays. Via distributor or agent." },
      { logoText: "BS", logoBg: "#7a3b12", name: "Brown Sugar", desc: "\"Netflix of Blaxploitation\" — classic Black cinema (Bounce/Scripps). Licensed via rights holders." },
      { logoText: "Af", logoBg: "#0f8a4f", name: "AfroLandTV", desc: "SVOD/AVOD for African & diaspora stories. Via distributor, festival, or curator outreach." },
      { logoText: "Mv", logoBg: "#d4233a", pill: "Direct submissions", name: "Maverick Black Cinema", desc: "FAST/AVOD Black indie features (Tubi/Peacock/Roku). Direct w/ release form; 70–120 min." },
      { logoText: "B&S", logoBg: "#222", logoBorder: "#555", name: "Black&Sexy TV", desc: "Content studio distributing via BET+, Starz, Amazon. Via partnership/co-production." },
    ],
  },
  "lgbtq": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/lgbtq",
    title: "LGBTQ+",
    sub: "Queer-focused streaming homes for LGBTQ+ stories. Pick one to see exactly how to get in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Rv", logoBg: "#ff2d78", pill: "Direct submissions", name: "Revry", desc: "FAST/AVOD — LGBTQ+ films, series, music, podcasts. 130+ countries. Submit via online form." },
      { logoText: "Dk", logoBg: "#1f6feb", pill: "Direct submissions", name: "Dekkoo", desc: "SVOD for gay male stories — films, shorts, series. Direct via contests/acquisitions." },
      { logoText: "Go", logoBg: "#7b2ff7", pill: "Direct submissions", name: "GagaOOLala", desc: "Asia's first LGBTQ+ SVOD, global reach. Direct via GOL Studios (EN/ZH subs)." },
      { logoText: "Ou", logoBg: "#e0233a", pill: "Direct submissions", name: "OUTtv", desc: "Curated LGBTQ+ SVOD (Canada) + FAST. Direct — queer-led docs & series." },
      { logoText: "Lf", logoBg: "#d63384", pill: "Direct submissions", name: "Lesflicks", desc: "Global SVOD/TVOD for lesbian/WLW stories. Direct via website; standard deliverables." },
      { logoText: "Tf", logoBg: "#b5179e", pill: "Direct submissions", name: "TelloFilms", desc: "SVOD for queer women — web series & indie films. Direct via email/site." },
      { logoText: "Hr", logoBg: "#222", logoBorder: "#555", name: "Here TV", desc: "Longest-running LGBTQ+ premium (SVOD/TVOD). Usually via distributor; direct pitches possible." },
      { logoText: "Pc", logoBg: "#5a2ed6", name: "PeccadilloPOD", desc: "UK LGBTQ+ & world-cinema SVOD. No public form — via Peccadillo distribution." },
      { logoText: "WW", logoBg: "#ff7a00", logoColor: "#0b0f12", name: "WOW Presents Plus", desc: "World of Wonder (Drag Race). No open portal — WOW productions / distributor ties." },
      { logoText: "Gb", logoBg: "#2a9d8f", logoColor: "#0b0f12", name: "GayBingeTV", desc: "LGBTQ+ films, shorts & series SVOD. Via distributor or direct contact." },
      { logoText: "Fl", logoBg: "#444", logoBorder: "#666", name: "Fearless", desc: "LGBTQ+/diverse films, web series, shorts. Curated partnerships / outreach." },
    ],
  },
  "horror-cult": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/horror-cult",
    title: "Horror & Cult",
    sub: "Genre, horror, and cult specialists with built-in fanbases. Pick one to see how to get in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Sh", logoBg: "#8b0000", pill: "Direct submissions", name: "Shudder", desc: "AMC's horror SVOD. Pitch the acquisitions team directly; also scouts festivals and co-produces." },
      { logoText: "Sc", logoBg: "#b30000", name: "Screambox", desc: "Cineverse horror (slashers, docs, originals). Via Terror Films, Midnight Releasing, or Cineverse." },
      { logoText: "Mp", logoBg: "#6a0d0d", name: "Midnight Pulp", desc: "Cult & horror (Cineverse) SVOD/AVOD/FAST. Via distributors (Arrow, Severin) or Cineverse." },
      { logoText: "Ar", logoBg: "#111", logoBorder: "#c0392b", name: "Arrow Player", desc: "Boutique Arrow Films — cult, horror, exploitation. Via Arrow acquisitions / sales agents." },
      { logoText: "Kc", logoBg: "#7a1f1f", name: "Kino Cult", desc: "Free AVOD from Kino Lorber — cult/horror/underground. Secure Kino Lorber distribution first." },
      { logoText: "Fm", logoBg: "#4b0082", pill: "Direct submissions", name: "Full Moon Features", desc: "Charles Band's B-movie/cult SVOD/AVOD. Grassroots-friendly — accepts direct submissions." },
      { logoText: "Nf", logoBg: "#1a1a2e", logoBorder: "#555", name: "Night Flight Plus", desc: "Cult, underground & counterculture SVOD/AVOD. Direct outreach aligned with the brand." },
    ],
  },
  "documentary": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/documentary",
    title: "Documentary",
    sub: "Platforms dedicated to nonfiction and factual film. These are largely curated — most reach the platform through a distributor, sales agent, or festival pipeline. Pick one to see the path.",
    platforms: [
      { logoText: "Cs", logoBg: "#1aa3ff", name: "CuriosityStream", desc: "SVOD — science, history, nature, tech. Via distributor or production partner (no direct)." },
      { logoText: "Mg", logoBg: "#0f5fa6", name: "MagellanTV", desc: "SVOD docs — history, science, true crime, nature. Via distributor/agent." },
      { logoText: "Db", logoBg: "#e0233a", name: "DocuBay", desc: "Global SVOD docs (India-based). Fully curated — licensed via distributors." },
      { logoText: "D+", logoBg: "#111", logoBorder: "#555", name: "Documentary+", desc: "Free AVOD (XTR / Village Roadshow). Curated via distributors & festivals." },
      { logoText: "Dv", logoBg: "#2a7f62", name: "Docsville", desc: "Socially engaged docs (ex-BBC Storyville). Via distributors, agents, festivals; curator pitch." },
      { logoText: "Gd", logoBg: "#5a2ed6", name: "GuideDoc", desc: "Curated festival-quality docs (Barcelona). Needs representation; also acts as a distributor." },
      { logoText: "Dc", logoBg: "#c0392b", name: "Docurama", desc: "Cineverse FAST/AVOD docs (Roku, Tubi, Prime…). Via Cineverse / partner aggregators." },
      { logoText: "Ae", logoBg: "#222", logoBorder: "#666", name: "Aeon Video", desc: "Short docs & essays on ideas, culture, science. Editorially selected; indie pitch possible." },
    ],
  },
  "international": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/international",
    title: "International",
    sub: "Regional and world-cinema platforms, matched by country and culture. Pick one to see the path in — green tags mean direct submissions are accepted.",
    platforms: [
      { logoText: "Fd", logoBg: "#2a7de1", pill: "Direct", name: "FilmDoo", desc: "International & indie/world cinema (TVOD). Direct submissions, no aggregator. (Not in US.)" },
      { logoText: "Tk", logoBg: "#0057b7", name: "Takflix", desc: "Ukrainian cinema (TVOD), 50% to filmmakers. Best fit: Ukrainian or culturally tied work." },
      { logoText: "Om", logoBg: "#d52b1e", name: "Ondamedia", desc: "Chilean cultural cinema, free (Ministry of Culture). Chilean / culturally aligned works." },
      { logoText: "Tn", logoBg: "#111", logoBorder: "#555", name: "Tënk", desc: "Auteur documentaries (SVOD/coop). No open call — inquire directly; festival-level work." },
      { logoText: "Fq", logoBg: "#5a2ed6", name: "Filmatique", desc: "Arthouse/experimental SVOD (Kino Lorber). Via distributors, festivals, curated programs." },
      { logoText: "Ss", logoBg: "#138d75", logoColor: "#0b0f12", pill: "Direct", name: "Shasha", desc: "SWANA cinema SVOD. Accepts direct indie submissions; subtitles + festival-ready assets." },
      { logoText: "Ac", logoBg: "#e84393", name: "AsianCrush", desc: "Asian film/TV (Cineverse). Via aggregators or distributors (DMR) — no direct." },
      { logoText: "Hc", logoBg: "#c0392b", name: "Hoichoi", desc: "Bengali SVOD (SVF). No open call — pitch via business channels with a deck." },
      { logoText: "An", logoBg: "#8e44ad", name: "Angkor DC", desc: "Cambodia's national OTT (TVOD). Direct outreach / partnerships; standard deliverables." },
      { logoText: "Kl", logoBg: "#b23b6e", name: "Klassiki", desc: "Russia, Caucasus & Central Asia cinema. No open form — approach directly; pro masters." },
    ],
  },
  "shorts-experimental": {
    accent: "#ff8000",
    canonical: "https://filmmakergenius.com/greenlight-engine/shorts-experimental",
    title: "Shorts & Experimental",
    sub: "Homes for short films and experimental / art work. Great news — most of these accept films directly. Green tags mean direct submissions are open.",
    platforms: [
      { logoText: "SW", logoBg: "#111", logoBorder: "#777", pill: "Direct submissions", name: "Short of the Week", desc: "Curated standout indie shorts, watched by fans + industry scouts. Direct, no fee — exposure-only." },
      { logoText: "FS", logoBg: "#e0233a", pill: "Direct submissions", name: "Film Shortage", desc: "Curated discovery for the best indie shorts. Direct submissions, no fees — visibility & credibility." },
      { logoText: "Om", logoBg: "#ff0000", pill: "Direct submissions", name: "Omeleto", desc: "Huge YouTube short-film channel (millions of subs). Direct submissions — exposure (ad-rev kept by Omeleto)." },
      { logoText: "Nw", logoBg: "#000", logoBorder: "#555", pill: "Direct submissions", name: "Nowness", desc: "High-prestige art/fashion/experimental shorts. Direct but highly selective — cultural prestige." },
      { logoText: "Na", logoBg: "#222", logoBorder: "#555", pill: "Direct submissions", name: "Nowness Asia", desc: "Regional Nowness — art & experimental shorts across Asia. Direct, very selective." },
      { logoText: "Bo", logoBg: "#1aa3ff", pill: "Direct submissions", name: "Booooooom TV", desc: "Shorts, music videos, animation & experimental (Booooooom art community). Direct via portal." },
      { logoText: "Sv", logoBg: "#6a4cf0", pill: "Direct submissions", name: "ShortVerse", desc: "Short-film hub focused on discoverability & audience connection. Direct submissions." },
    ],
  },
};
