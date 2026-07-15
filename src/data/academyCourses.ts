export interface AcademyCategory {
  key: string;
  label: string;
  color: string;
  gradient: string;
}

export interface AcademyCourseEntry {
  slug: string;
  title: string;
  category: string;
  pairsWith: string | null;
}

export const categories: AcademyCategory[] = [
  { key: "dev", label: "Development & Writing", color: "#00d4aa", gradient: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)" },
  { key: "preprod", label: "Pre-Production", color: "#f59e0b", gradient: "linear-gradient(135deg,#1a1000 0%,#2d1e00 100%)" },
  { key: "prod", label: "Production", color: "#a855f7", gradient: "linear-gradient(135deg,#120a25 0%,#1e1040 100%)" },
  { key: "post", label: "Post-Production", color: "#fb7185", gradient: "linear-gradient(135deg,#1a0808 0%,#2d1010 100%)" },
  { key: "dist", label: "Distribution", color: "#34d399", gradient: "linear-gradient(135deg,#071a10 0%,#0a2d1a 100%)" },
  { key: "fund", label: "Funding", color: "#fbbf24", gradient: "linear-gradient(135deg,#1a1200 0%,#2d2000 100%)" },
  { key: "biz", label: "Business of Film", color: "#60a5fa", gradient: "linear-gradient(135deg,#060f1a 0%,#0a1a2d 100%)" },
  { key: "ai", label: "AI & Technology", color: "#818cf8", gradient: "linear-gradient(135deg,#0a0818 0%,#140e2d 100%)" },
];

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const raw: Array<[string, string, string | null, string?]> = [
  ["dev", "Screenplay Writing 101", "Table Read", "how-to-write-a-screenplay"],
  ["dev", "Story Structure & the Three-Act Format", "Scene Analysis", "screenplay-act-structure"],
  ["dev", "Writing the Short Film", null, "how-to-write-a-short-film-script"],
  ["dev", "Writing the Logline & Pitch Document", "Pitch Deck Maker", "how-to-write-a-logline"],
  ["dev", "Adapting Source Material for the Screen", null, "adapting-source-material"],
  ["dev", "Writing for Documentary", null, "documentary-script-writing"],
  ["dev", "The Rewrite: Developing Through Drafts", "Scene Analysis", "how-to-rewrite-a-screenplay"],
  ["preprod", "Script Breakdown Fundamentals", "Scene Analysis", "film-script-breakdown"],
  ["preprod", "Storyboarding for Indie Features", "Storyboard Generator", "how-to-storyboard-a-film"],
  ["preprod", "Budgeting & Scheduling Essentials", "Calendar", "film-budgeting-and-scheduling"],
  ["preprod", "Location Scouting & Management", "Project Intake Form", "film-location-scouting"],
  ["preprod", "Casting & Working with Actors", "Auditions", "casting-for-indie-films"],
  ["preprod", "Hiring Your Department Heads", "Crew Hire", "hiring-department-heads"],
  ["preprod", "Production Design on a Budget", null, "production-design-on-a-budget"],
  ["preprod", "Wardrobe & Costume on a Budget", "Document Library", "costume-design-for-film"],
  ["preprod", "Building a Shot List from Your Script", "Call Sheet Generator", "shot-list-filmmaking"],
  ["preprod", "Working with SAG-AFTRA on Low-Budget Films", "Contract Assistant", "sag-aftra-for-filmmakers"],
  ["preprod", "Permits & Releases: The Full Picture", "Document Library", "film-permits-and-releases"],
  ["preprod", "Insurance & Legal Basics for Filmmakers", "Contract Assistant", "film-production-insurance"],
  ["preprod", "Producing the Short Film", "Project Intake Form", "how-to-produce-a-short-film"],
  ["prod", "On-Set Protocols & Safety", "Call Sheet Generator", "film-set-safety"],
  ["prod", "Directing Actors on Indie Budgets", "Auditions", "directing-actors"],
  ["prod", "Camera & Lighting Basics", null, "camera-and-lighting-basics"],
  ["prod", "Sound Recording for Film", null, "production-sound-recording"],
  ["prod", "The Producer's Job: Producing 101", "Project Intake Form", "what-does-a-film-producer-do"],
  ["prod", "Working with Child Actors", "Auditions", "working-with-child-actors"],
  ["prod", "Working with Non-Actors", "Auditions", "directing-non-actors"],
  ["prod", "iPhone & Mirrorless Camera Filmmaking", "Storyboard Generator", "smartphone-filmmaking"],
  ["prod", "Drone Cinematography for Indie Films", null, "drone-cinematography"],
  ["prod", "Stunt & Action Coordination Basics", "Call Sheet Generator", "how-to-film-action-scenes"],
  ["prod", "Producing a Documentary", "Project Intake Form", "how-to-produce-a-documentary"],
  ["post", "Editing Workflow for Indies", null, "film-editing-workflow"],
  ["post", "Sound Design on a Budget", null, "sound-design-for-film"],
  ["post", "Color Grading Fundamentals", null, "color-grading-for-film"],
  ["post", "Music Licensing for Indie Films", "Document Library", "music-licensing-for-films"],
  ["post", "Working with a Composer", null, "working-with-a-film-composer"],
  ["post", "Visual Effects on a Budget", null, "vfx-on-a-budget"],
  ["post", "Creating Your Film Trailer", null, "how-to-make-a-film-trailer"],
  ["post", "DCP Creation & Delivery", "Document Library", "how-to-make-a-dcp"],
  ["dist", "Festival Strategy & Submissions", "Film Festivals", "film-festival-strategy"],
  ["dist", "Building Your EPK", "Document Library", "how-to-build-an-epk"],
  ["dist", "DIY Film Distribution", "Distribution Readiness", "diy-film-distribution"],
  ["dist", "Social Media Marketing for Your Film", null, "social-media-marketing-for-films"],
  ["dist", "Building a Film Website & Press Strategy", null, "how-to-make-a-film-website"],
  ["dist", "Pitching to Netflix, Amazon & Streaming Platforms", "Pitch Deck Maker", "how-to-pitch-to-streamers"],
  ["dist", "SVOD vs AVOD vs TVOD: Choosing Your Platform", "Distribution Readiness", "streaming-revenue-models"],
  ["dist", "International Sales & Foreign Distribution", "Distribution Readiness", "international-film-sales"],
  ["dist", "Film Markets: AFM, Cannes & Berlin", "Calendar", "film-markets-explained"],
  ["dist", "Understanding Distribution Contracts & Deal Terms", "Contract Assistant", "film-distribution-contracts"],
  ["fund", "Crowdfunding Campaigns That Work", "Funding Strategy", "film-crowdfunding"],
  ["fund", "Grants & Sponsorships", "Funding Strategy", "grants-for-filmmakers"],
  ["fund", "Pitching to Investors", "Pitch Deck Maker", "how-to-find-investors-for-a-film"],
  ["biz", "Starting Your Production Company", "Project Intake Form", "how-to-start-a-production-company"],
  ["biz", "The Film Business Plan", "Funding Strategy", "film-business-plan"],
  ["biz", "Film Accounting & Tax Basics", null, "film-production-accounting"],
  ["biz", "Copyright & IP Protection for Filmmakers", "Contract Assistant", "copyright-for-filmmakers"],
  ["biz", "Brand Partnerships & Product Placement", null, "brand-partnerships-for-films"],
  ["biz", "Building a Career in Independent Film", "Crew Hire", "indie-filmmaking-career"],
  ["ai", "AI Tools for Filmmakers", "Scene Analysis", "ai-tools-for-filmmakers"],
  ["ai", "Using AI for Script Development", "Scene Analysis", "ai-script-writing"],
  ["ai", "AI in Post-Production Workflows", null, "ai-in-post-production"],
  ["ai", "Virtual Production & LED Volumes", null, "virtual-production"],
];

export const courses: AcademyCourseEntry[] = raw.map(([category, title, pairsWith, slugOverride]) => ({
  slug: slugOverride ?? slugify(title),
  title,
  category,
  pairsWith,
}));
