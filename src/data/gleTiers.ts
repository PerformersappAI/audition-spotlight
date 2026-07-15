export type GlePlatform = {
  logoText: string;
  logoBg: string;
  logoColor?: string;
  logoBorder?: string;
  name: string;
  desc: string;
  pill?: string;
};

export type GleTier = {
  accent: string;
  canonical: string;
  label: string;
  title: string;
  sub: string;
  platforms: GlePlatform[];
};

export const gleTiers: Record<string, GleTier> = {
  "tier-1": {
    accent: "#40bcf4",
    canonical: "https://filmmakergenius.com/greenlight-engine/major-streamers",
    label: "Tier 1",
    title: "Major Streamers",
    sub: "The biggest global platforms. Highest technical bar and a distributor required — pick one to see exactly what it takes.",
    platforms: [
      { logoText: "N", logoBg: "#e50914", name: "Netflix", desc: "Direct licensing only. Top specs — 4K, IMF, Dolby Atmos, approved cameras. Needs a distributor." },
      { logoText: "a", logoBg: "#00a8e1", name: "Amazon Prime Video", desc: "SVOD + rent/buy. Reachable via aggregator or distributor. Huge global reach." },
      { logoText: "h", logoBg: "#1ce783", logoColor: "#0b0f12", name: "Hulu", desc: "SVOD / AVOD (US). Indie access through a distributor." },
      { logoText: "", logoBg: "#333", logoBorder: "#555", name: "Apple TV / iTunes", desc: "Rent/buy (TVOD). Reached via aggregators like Bitmax or Quiver." },
      { logoText: "D", logoBg: "#113ccf", name: "Disney+", desc: "Studio-owned. Effectively closed to indies — included for completeness." },
      { logoText: "M", logoBg: "#7b2ff7", name: "Max", desc: "SVOD (Warner/HBO). Indie access through a distributor." },
      { logoText: "P", logoBg: "#000", logoBorder: "#555", name: "Peacock", desc: "SVOD / AVOD (NBCUniversal). Via a distributor." },
      { logoText: "P+", logoBg: "#0064ff", name: "Paramount+", desc: "SVOD. Via a distributor; FAST ties to Pluto TV." },
    ],
  },
  "tier-2": {
    accent: "#8b5cf6",
    canonical: "https://filmmakergenius.com/greenlight-engine/prestige-arthouse",
    label: "Tier 2",
    title: "Prestige & Arthouse",
    sub: "Curated, festival-quality homes. Most need a festival pedigree or a distributor — the credibility platforms. Pick one to see what it takes.",
    platforms: [
      { logoText: "M", logoBg: "#000", logoBorder: "#555", name: "MUBI", desc: "Curated arthouse/festival. Via festival, distributor, or sales agent." },
      { logoText: "C", logoBg: "#111", logoBorder: "#777", name: "Criterion Channel", desc: "Ultra-prestige classics & arthouse. Distributor only — nearly impossible direct." },
      { logoText: "S", logoBg: "#e0b13a", logoColor: "#0b0f12", name: "Sundance Now", desc: "Festival winners, docs, acclaimed indies. Via distributor." },
      { logoText: "B", logoBg: "#d4233a", name: "BFI Player", desc: "UK arthouse. Acquired via distributors and festivals." },
      { logoText: "Cz", logoBg: "#222", logoBorder: "#555", name: "Curzon Home Cinema", desc: "UK curated arthouse/festival. Distributor required." },
      { logoText: "Mg", logoBg: "#3a6df0", name: "Magnolia Selects", desc: "Curated indie/arthouse. Via distributor." },
      { logoText: "FM", logoBg: "#7b2ff7", name: "Film Movement Plus", desc: "World, indie & arthouse cinema. Via distributor." },
      { logoText: "O", logoBg: "#1aa3ff", name: "Ovid.tv", desc: "Arthouse & documentary (US/Canada). Partner distributors." },
      { logoText: "U", logoBg: "#e85d2a", name: "UniversCiné", desc: "European indie & arthouse. Distributor required." },
      { logoText: "LC", logoBg: "#444", logoBorder: "#666", name: "LaCinetek", desc: "Classics curated by filmmakers. Via distributor." },
      { logoText: "K", logoBg: "#b23b6e", name: "Klassiki", desc: "Russia / Caucasus / Central Asia cinema. Direct inquiry; pro masters." },
      { logoText: "Le", logoBg: "#2a2a2a", logoBorder: "#555", name: "Le Cinéma Club", desc: "Free, one curated film weekly. Curated / invite only." },
      { logoText: "IFC", logoBg: "#c0392b", name: "IFC Films Unlimited", desc: "IFC / Sundance Selects / IFC Midnight catalog. Via IFC acquisition." },
      { logoText: "F", logoBg: "#0f8a6a", name: "Fandor", desc: "Indie & arthouse (Cineverse). Selective pitch." },
      { logoText: "Kn", logoBg: "#6a4cf0", name: "Kanopy", desc: "Library / university (educational). Via distributor (e.g. Giant Pictures)." },
      { logoText: "Sh", logoBg: "#8b0000", name: "Shudder", desc: "Prestige horror/genre. Accepts direct pitches + scouts festivals." },
    ],
  },
  "tier-3": {
    accent: "#00e054",
    canonical: "https://filmmakergenius.com/greenlight-engine/open-accessible",
    label: "Tier 3",
    title: "Open & Accessible",
    sub: "The lowest barrier — where most films realistically start. Free / AVOD / FAST and DIY, reachable directly or through a low-cost aggregator. Many accept direct submissions.",
    platforms: [
      { logoText: "H", logoBg: "#00e054", logoColor: "#0b0f12", name: "Hook Cinema", desc: "Upload direct, retain full rights, 50/50 ad split, crowdfund — start here in minutes.", pill: "Partner platform" },
      { logoText: "T", logoBg: "#7d2ae8", name: "Tubi", desc: "Free AVOD/FAST, huge reach. Via aggregator (Filmhub) or distributor." },
      { logoText: "R", logoBg: "#662d91", name: "The Roku Channel", desc: "AVOD/FAST. Via Filmhub or a distributor." },
      { logoText: "Pl", logoBg: "#0b1f3a", logoBorder: "#2a4a7a", name: "Pluto TV", desc: "FAST/AVOD channels. Via aggregator or distributor." },
      { logoText: "Px", logoBg: "#e5a00d", logoColor: "#0b0f12", name: "Plex", desc: "AVOD/FAST. Via a distributor (Indie Rights, Giant Pictures)." },
      { logoText: "Cr", logoBg: "#ff6a00", name: "Crackle", desc: "Free AVOD. Via aggregator (Bitmax, Premiere Digital)." },
      { logoText: "Po", logoBg: "#d4233a", name: "Popcornflix", desc: "AVOD (Screen Media). Via aggregator/partner." },
      { logoText: "Fa", logoBg: "#00b3a4", logoColor: "#0b0f12", name: "Fawesome", desc: "Free AVOD/FAST. Via Filmhub." },
      { logoText: "Sm", logoBg: "#1428a0", name: "Samsung TV Plus", desc: "FAST, built into Samsung TVs. Via Filmhub." },
      { logoText: "LG", logoBg: "#a50034", name: "LG Channels", desc: "FAST, built into LG TVs. Via Filmhub." },
      { logoText: "Vz", logoBg: "#111", logoBorder: "#555", name: "Vizio WatchFree+", desc: "FAST on Vizio TVs. Via Filmhub." },
      { logoText: "Ln", logoBg: "#2f6fed", name: "Local Now", desc: "AVOD/FAST. Via Filmhub." },
      { logoText: "Ds", logoBg: "#0aa14f", name: "DistroTV", desc: "Free AVOD/FAST. Via Filmhub." },
      { logoText: "St", logoBg: "#e23b2e", name: "STIRR", desc: "Free live + on-demand. Via aggregator." },
      { logoText: "Xu", logoBg: "#5a2ed6", name: "Xumo Play", desc: "AVOD/FAST (Comcast). Via Filmhub." },
      { logoText: "Vu", logoBg: "#3b5bdb", name: "Vudu / Fandango at Home", desc: "Rent/buy (TVOD) + AVOD. Via aggregator (Bitmax, Quiver)." },
      { logoText: "Fr", logoBg: "#d12d2d", name: "FilmRise", desc: "AVOD/FAST. Acquires content directly." },
      { logoText: "Vo", logoBg: "#17d4fe", logoColor: "#0b0f12", name: "Vimeo On Demand", desc: "DIY direct-to-fan rent/buy — upload it yourself, keep most revenue." },
      { logoText: "Ip", logoBg: "#6a4cf0", name: "IndiePix Unlimited", desc: "Indie SVOD. Accepts direct submissions." },
      { logoText: "eo", logoBg: "#0f8a6a", name: "eoFlix", desc: "Indie streaming + community. Upload direct." },
      { logoText: "Rg", logoBg: "#2a9d8f", name: "Reelgood", desc: "Discovery/listing — self-list to boost findability." },
    ],
  },
};
