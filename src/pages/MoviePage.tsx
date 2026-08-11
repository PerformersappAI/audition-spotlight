import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import gladiatorPoster from "@/assets/gladiator-poster.png.asset.json";

function Oscar({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 2} viewBox="0 0 12 24" aria-hidden="true" style={{ display: "block" }}>
      <g fill="#e7c04a">
        <circle cx="6" cy="3" r="2" />
        <path d="M4.6 5.2h2.8l1 6.6a6 6 0 0 1-4.8 0z" />
        <rect x="4.4" y="12.2" width="3.2" height="6.4" rx="0.6" />
        <rect x="2.6" y="18.6" width="6.8" height="1.8" rx="0.5" />
        <rect x="1.8" y="20.4" width="8.4" height="2.4" rx="0.6" />
      </g>
    </svg>
  );
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type Beat = { name: string; pos: string; what: string; why: string; slug: string };
type Act = { label: string; shade: "a1" | "a2" | "a3"; beats: Beat[] };
type Fact = { k: string; v: string };
type Movie = {
  title: string;
  structureName: string;
  structureKey: string;
  color: string;
  shades: { a1: string; a2: string; a3: string };
  oscars: number;
  oscarLabel: string;
  subheader: string[];
  oneBreath: string;
  facts: Fact[];
  whyTitle: string;
  whyBody: string;
  beatsIntro: string;
  acts: Act[];
  takeaway: string;
};

const MOVIES: Record<string, Movie> = {
  "the-godfather": {
    title: "The Godfather",
    structureName: "Three-Act",
    structureKey: "three-act",
    color: "#a855f7",
    shades: { a1: "rgba(221,190,255,0.16)", a2: "rgba(168,85,247,0.20)", a3: "rgba(88,28,135,0.38)" },
    oscars: 3,
    oscarLabel: "3 Academy Awards — Best Picture · Adapted Screenplay · Actor",
    subheader: ["Ordinary World","Inciting Incident","First Plot Point","Rising Action","Midpoint","Crisis / Low","Climax","Resolution"],
    oneBreath: "A war-hero son swears he is nothing like his mafia family — until an assassination attempt on his father pulls him in. Step by step, Michael Corleone becomes the ruthless new Don, sacrificing his soul to protect the family he meant to escape. At heart it is a tragedy of transformation: a good man choosing, one reasonable-seeming decision at a time, to become a monster.",
    facts: [
      { k: "Year", v: "1972" },
      { k: "Director", v: "Francis Ford Coppola" },
      { k: "Writers", v: "Mario Puzo & Coppola" },
      { k: "Runtime", v: "175 min" },
    ],
    whyTitle: "The cleanest three acts ever built.",
    whyBody: "The Godfather is our Three-Act flagship because it is a linear, flawlessly built three-act story with no flashbacks to hide behind. Its protagonist is Michael, and the whole film hangs on one question: can he stay out of the family business, or will he become his father? Watch the mirror — the film opens with petitioners kissing Don Vito's hand and ends with them kissing Michael's. Beginning, middle, end, in their purest form.",
    beatsIntro: "The exact spine from the Three-Act structure page — same beats, same order, shaded by act. Here is what each one is in the movie, and why the screenplay works there.",
    acts: [
      { label: "Act I — Setup", shade: "a1", beats: [
        { name: "Ordinary World", pos: "Opening", slug: "ordinary-world", what: "Connie's wedding. One virtuoso sequence installs the whole world — the Don's power, the code of favors (\"I believe in America…\"), and Michael as the war hero who stands apart: \"That's my family, Kay. It's not me.\"", why: "a single scene installs the world, the rules, and the hero's distance from it — so the fall has something to fall from." },
        { name: "Inciting Incident", pos: "~12%", slug: "inciting-incident", what: "Don Vito refuses Sollozzo's narcotics deal — and is gunned down in the street. The family's world shatters, and the vacuum begins pulling Michael in.", why: "the event cracks the ordinary world open and creates the vacuum only Michael can fill." },
        { name: "First Plot Point", pos: "~25% → into Act II", slug: "first-plot-point", what: "Michael volunteers to kill Sollozzo and the crooked Captain McCluskey — and does it in the restaurant. The outsider crosses fully into the family business.", why: "the point of no return that locks Act II — the door to a normal life clicks shut." },
      ]},
      { label: "Act II — Confrontation", shade: "a2", beats: [
        { name: "Rising Action", pos: "Act II", slug: "rising-action", what: "Michael in exile in Sicily; he marries Apollonia; the gang war escalates at home. Then Apollonia is killed by a car bomb meant for him.", why: "Act II keeps raising the stakes and the cost — and makes the price personal, not just tactical." },
        { name: "Midpoint", pos: "~50%", slug: "midpoint", what: "Sonny is ambushed and slaughtered at the causeway. Succession pivots irreversibly to Michael; a broken Don Vito sues for a false peace.", why: "the hinge of the film — succession swings to Michael for good, and the second half becomes his." },
        { name: "Crisis / Low", pos: "~75% → into Act III", slug: "crisis-low", what: "Don Vito dies in the garden with his grandson. Michael is now the Don — and utterly alone at the top, surrounded by enemies he must destroy to survive.", why: "strands the hero alone and exposed — the lowest point right before the final move." },
      ]},
      { label: "Act III — Resolution", shade: "a3", beats: [
        { name: "Climax", pos: "~90%", slug: "climax", what: "The baptism massacre. As Michael renounces Satan at the christening, his men murder the heads of the Five Families. In one sequence he seizes absolute power.", why: "answers the central question in a single sequence — he becomes the Don, absolutely." },
        { name: "Resolution", pos: "~99%", slug: "resolution", what: "Kay asks if Michael ordered Carlo's death. He lies: \"No.\" The office door closes on her face. The war hero has become the Godfather — the fate he swore to escape.", why: "the closing door mirrors the opening wedding — the transformation is complete, and damning." },
      ]},
    ],
    takeaway: "Give your hero a life worth losing in the first ten minutes, then make every step toward the dark side a reasonable choice. The Godfather never asks Michael to want to be bad — it just closes every other door, one beat at a time.",
  },

  "the-silence-of-the-lambs": {
    title: "The Silence of the Lambs",
    structureName: "Save the Cat",
    structureKey: "save-the-cat",
    color: "#d4a017",
    shades: { a1: "rgba(212,160,23,0.12)", a2: "rgba(212,160,23,0.22)", a3: "rgba(120,90,10,0.45)" },
    oscars: 5,
    oscarLabel: "The \"Big Five\" — Picture · Director · Actor · Actress · Screenplay",
    subheader: ["Opening","Theme","Setup","Catalyst","Debate","Break 2","B Story","Fun & Games","Midpoint","Bad Guys","All Is Lost","Dark Night","Break 3","Finale","Final Image"],
    oneBreath: "A driven young FBI trainee is sent to pick the brain of an imprisoned cannibal genius, Hannibal Lecter, to catch another serial killer before his latest victim dies. To get Lecter's help she must trade pieces of herself — and face the monster inside as well as the one at large. It is a thriller built with almost mathematical precision.",
    facts: [
      { k: "Year", v: "1991" },
      { k: "Director", v: "Jonathan Demme" },
      { k: "Screenplay", v: "Ted Tally" },
      { k: "Runtime", v: "118 min" },
    ],
    whyTitle: "Fifteen beats, hit like a metronome.",
    whyBody: "The Silence of the Lambs is our Save the Cat flagship because it lands all fifteen beats almost exactly where Blake Snyder says they should fall — theme stated on page five, catalyst on twelve, a false-victory midpoint, an \"all is lost\" whiff of death, and a finale where the hero spends everything she has learned. It is the clearest proof that the beat sheet is not a formula that flattens a film — here it shapes a Best Picture winner.",
    beatsIntro: "The exact fifteen beats from the Save the Cat structure page — same order, shaded by act. Here is what each one is in the movie, and why the screenplay works there.",
    acts: [
      { label: "Act I — Setup", shade: "a1", beats: [
        { name: "Opening Image", pos: "p.1", slug: "opening", what: "Clarice alone on the FBI Academy obstacle course, running uphill through gray woods — small, driven, out of breath. Striving, vulnerable, tough.", why: "one image sets the hero's essence: small, striving, alone." },
        { name: "Theme Stated", pos: "p.5", slug: "theme", what: "\"Quid pro quo\": to catch the monster, Clarice must give pieces of herself. You cannot defeat what you will not face — in the world or in yourself.", why: "the film's idea is spoken early, before the hero fully understands it." },
        { name: "Set-Up", pos: "pp.1–10", slug: "setup", what: "Clarice's world at Quantico; her ambition and outsider status among men; her mentor Crawford singles her out.", why: "establishes the hero's world, drive, and the flaw the story will test." },
        { name: "Catalyst", pos: "p.12", slug: "catalyst", what: "Crawford sends Clarice to interview the imprisoned Hannibal Lecter — the assignment that changes everything.", why: "the event that knocks the hero out of routine and into the story." },
        { name: "Debate", pos: "pp.12–25", slug: "debate", what: "The unnerving first meetings with Lecter (Miggs, the \"census taker\" taunt). Is she out of her depth? She is rattled — but pulled in.", why: "the hero hesitates at the threshold, then gets pulled across." },
        { name: "Break into Two", pos: "p.25", slug: "break-2", what: "Buffalo Bill abducts Catherine Martin. A living victim, a ticking clock; Clarice commits fully to the hunt — and to using Lecter to run it.", why: "a living victim and a clock commit the hero fully to the quest." },
      ]},
      { label: "Act II — Confrontation", shade: "a2", beats: [
        { name: "B Story", pos: "p.30", slug: "b-story", what: "The intimate duel with Lecter — the relationship that carries the theme, trading her worst memories for his insight.", why: "the relationship that carries the theme — self traded for insight." },
        { name: "Fun and Games", pos: "pp.30–55", slug: "fun-games", what: "The profiling procedural: trades with Lecter, the storage-unit discovery, Raspail's head, the death's-head moth.", why: "the promise of the premise — the pleasures the audience came for." },
        { name: "Midpoint", pos: "p.55", slug: "midpoint", what: "Clarice gives Lecter the story of the screaming lambs; he cracks the case (\"he covets\"). A false victory — Chilton's meddling gets Lecter transferred, raising the stakes.", why: "a false victory that immediately raises the stakes." },
        { name: "Bad Guys Close In", pos: "pp.55–75", slug: "bad-guys", what: "Chilton exposes the deal; Lecter is moved to Memphis; the Bureau sidelines Clarice; Catherine's clock runs down.", why: "pressure mounts from all sides and the hero's support is stripped away." },
        { name: "All Is Lost", pos: "p.75", slug: "all-is-lost", what: "Lecter's savage escape from the Memphis cage — the \"whiff of death,\" guards slaughtered. Clarice is off the case; her source is gone.", why: "the lowest point, with a whiff of death — the hero has nothing left." },
        { name: "Dark Night of the Soul", pos: "pp.75–85", slug: "dark-night", what: "Alone with the case files, doubting — but returning to Lecter's clue: the killer is local; he \"covets what he sees every day.\"", why: "alone and doubting, the hero sits with the loss before the last idea comes." },
        { name: "Break into Three", pos: "p.85", slug: "break-3", what: "The insight lands: Bill knew Fredrica Bimmel; he is a local tailor of skin. Clarice follows the thread to Jame Gumb's door.", why: "the insight lands and the hero drives toward the finale." },
      ]},
      { label: "Act III — Resolution", shade: "a3", beats: [
        { name: "Finale", pos: "pp.85–110", slug: "finale", what: "Clarice arrives alone (the FBI is at the wrong address), descends into the basement, the lights die, and she kills Buffalo Bill in the dark — saving Catherine. Everything learned, spent at once.", why: "the hero, alone, spends everything learned to win in the dark." },
        { name: "Final Image", pos: "p.110", slug: "final-image", what: "Clarice graduates as an agent — respected at last, the lambs quiet for now. Lecter phones from freedom (\"I'm having an old friend for dinner\") and melts into a crowd.", why: "the mirror of the opening — the trainee is now an agent, but the world is not safe." },
      ]},
    ],
    takeaway: "State your theme out loud early, then make the hero earn the right to understand it. \"Quid pro quo\" — Clarice can only defeat the monster outside by facing the one inside. Fifteen beats give a first-time writer a runway; hit them and the machine hums.",
  },

  gladiator: {
    title: "Gladiator",
    structureName: "Hero's Journey",
    structureKey: "heros-journey",
    color: "#fb7185",
    shades: { a1: "rgba(251,113,133,0.12)", a2: "rgba(251,113,133,0.22)", a3: "rgba(159,18,57,0.42)" },
    oscars: 5,
    oscarLabel: "5 Academy Awards — incl. Best Picture & Actor (Crowe)",
    subheader: ["Ordinary","Call","Refusal","Mentor","Threshold","Tests","Inmost Cave","Ordeal","Reward","Road Back","Resurrection","Return"],
    oneBreath: "A beloved Roman general is betrayed and his family murdered by the new emperor, who has him enslaved. Forced to fight as a gladiator, Maximus rises through the arena to avenge his family, restore the Republic, and — only in death — find his way home. It is a myth of transformation and return: a man who wants nothing but his farm becomes the instrument that frees Rome.",
    facts: [
      { k: "Year", v: "2000" },
      { k: "Director", v: "Ridley Scott" },
      { k: "Writers", v: "Franzoni · Logan · Nicholson" },
      { k: "Runtime", v: "155 min" },
    ],
    whyTitle: "The twelve stages, walked in full.",
    whyBody: "Maximus's arc is one of the cleanest modern examples of the Hero's Journey — all twelve stages, in order, with no shortcuts. He leaves an ordinary world he loves, is dragged across a threshold into a brutal special world, faces an ordeal that kills the old self and births the avenger, and returns with an \"elixir\": a freer Rome. And like myth demands, it ends not in a happy ending but in transformation — the hero brings the boon home at the cost of his life.",
    beatsIntro: "The exact loop from the Hero's Journey structure page — same stages, same order, grouped into Departure, Initiation, Return. Here is what each one is in the movie, and why the screenplay works there.",
    acts: [
      { label: "Departure — the ordinary world & the break from it", shade: "a1", beats: [
        { name: "Ordinary World", pos: "Stage 1", slug: "ordinary", what: "Maximus, a beloved general, wins Rome's war and longs only to go home to his farm, wife, and son. His honor and homesickness are set in the opening — his hand brushing the wheat.", why: "establishes exactly what the hero loves and will lose — the journey is measured against home." },
        { name: "Call to Adventure", pos: "Stage 2", slug: "call", what: "The dying Marcus Aurelius asks Maximus to become Protector of Rome and hand power back to the Senate — not to his corrupt son.", why: "someone lays a burden on the hero far bigger than the life he wanted." },
        { name: "Refusal of the Call", pos: "Stage 3", slug: "refusal", what: "Maximus wants no power and no politics — he wants home. He hesitates before the crushing duty the old emperor hands him.", why: "reluctance makes the hero human and raises the cost of saying yes." },
        { name: "Meeting the Mentor", pos: "Stage 4", slug: "mentor", what: "Marcus Aurelius is the first mentor, dreaming of a free Rome. Later, in the special world, Proximo becomes the mentor who teaches Maximus to \"win the crowd.\"", why: "a guide hands the hero the wisdom and skill he will need to survive." },
        { name: "Crossing the Threshold", pos: "Stage 5", slug: "threshold", what: "Commodus murders his father, seizes the throne, and orders Maximus killed. He escapes, rides home — and finds his family crucified and burned. Broken and captured, he is sold into slavery: general to gladiator.", why: "the catastrophe strips the old life away and forces the hero, with no way back, into the special world." },
      ]},
      { label: "Initiation — the special world & the ordeal", shade: "a2", beats: [
        { name: "Tests, Allies, Enemies", pos: "Stage 6", slug: "tests", what: "Bought by Proximo, Maximus fights in the provinces, wins, survives, and gains allies — chiefly Juba — learning the brutal rules of the arena.", why: "the special world teaches its rules; the hero earns skills and allies for what is ahead." },
        { name: "Approach the Inmost Cave", pos: "Stage 7", slug: "inmost-cave", what: "Proximo's troupe is brought to Rome, to the Colosseum itself — the heart of Commodus's power, and the place Maximus must enter to reach his enemy.", why: "the hero closes on the enemy's stronghold; dread builds toward the center." },
        { name: "The Ordeal", pos: "Stage 8", slug: "ordeal", what: "Meant to be slaughtered, Maximus instead leads the gladiators to victory, then unmasks before Commodus: \"My name is Maximus Decimus Meridius… and I will have my vengeance, in this life or the next.\" The anonymous slave dies; the avenger is reborn before Rome.", why: "the death-and-rebirth centerpiece — the old self dies and the true hero is born." },
        { name: "Reward", pos: "Stage 9", slug: "reward", what: "Maximus becomes the people's hero — a power Commodus dares not openly kill. He reconnects with Lucilla and a conspiracy to restore the Republic.", why: "the hero seizes something that changes the board — the crowd's love as shield and weapon." },
      ]},
      { label: "Return — the road home & the elixir", shade: "a3", beats: [
        { name: "The Road Back", pos: "Stage 10", slug: "road-back", what: "Maximus plots to slip out of Rome, rejoin his legion, and march on Commodus. The plan is betrayed; his contact Cicero is killed, the conspiracy collapses, and he is captured.", why: "the push homeward, and the betrayal that raises the stakes for one final test." },
        { name: "Resurrection", pos: "Stage 11", slug: "resurrection", what: "The final test. Fearing him, Commodus stabs Maximus in the back before their public duel, then faces him wounded. Bleeding to death, Maximus still kills Commodus — passing the ultimate trial at the cost of his life.", why: "the hero passes the ultimate trial and is transformed — victory and death in the same breath." },
        { name: "Return with the Elixir", pos: "Stage 12", slug: "return", what: "With his last breath, Maximus orders power returned to the Senate and the conspirators freed — his \"elixir\" is a freer Rome and honor restored. He walks into the wheat field, reunited with his family.", why: "the hero brings the boon back — the world is healed, and he finds his peace." },
      ]},
    ],
    takeaway: "Make your hero want to go home, not to win — then take home away. The Journey has teeth when the reward the hero actually craves (peace, family, the ordinary life) is the one thing the adventure keeps costing him.",
  },

  "forrest-gump": {
    title: "Forrest Gump",
    structureName: "Story Circle",
    structureKey: "story-circle",
    color: "#2bd1c0",
    shades: { a1: "rgba(43,209,192,0.12)", a2: "rgba(43,209,192,0.22)", a3: "rgba(13,110,102,0.42)" },
    oscars: 6,
    oscarLabel: "6 Academy Awards — incl. Best Picture, Director, Actor",
    subheader: ["You","Need","Go","Search","Find","Take","Return","Change"],
    oneBreath: "A kind, simple-hearted man from Alabama drifts through three decades of American history — football, Vietnam, ping-pong, a shrimp empire — always circling back to the one thing he is missing: Jenny, and a place to belong. It is a loose, episodic epic that still traces one complete emotional loop.",
    facts: [
      { k: "Year", v: "1994" },
      { k: "Director", v: "Robert Zemeckis" },
      { k: "Screenplay", v: "Eric Roth" },
      { k: "Runtime", v: "142 min" },
    ],
    whyTitle: "A complete loop inside a loose life.",
    whyBody: "Forrest Gump is our Story Circle flagship precisely because it looks like it has no structure at all — it is episodic, drifting, decades long. Yet under the wandering, Dan Harmon's eight steps run perfectly: a character in his comfort zone, a need, a crossing into chaos, a search, a find, a heavy price, a return, and a change. The final image — Forrest Jr. boarding the bus as the feather lifts — mirrors the first, closing the circle.",
    beatsIntro: "The exact eight steps from the Story Circle page — same order, shaded by phase. Here is what each one is in the movie, and why the screenplay works there.",
    acts: [
      { label: "Order — you, and the need", shade: "a1", beats: [
        { name: "You", pos: "Order", slug: "you", what: "Young Forrest in Greenbow, Alabama — leg braces, a low IQ, and a fiercely loving mother. His comfort zone: home, and Mama's belief that he is no different from anyone else.", why: "plants the hero in his comfort zone and the belief that will carry him." },
        { name: "Need", pos: "Order", slug: "need", what: "His deep need is love and belonging — which becomes Jenny, the one child kind to him: \"You can sit here if you want.\" Everything he does for the rest of his life orbits that need.", why: "names the one thing the hero is missing — every later choice orbits it." },
        { name: "Go", pos: "Chaos ↓", slug: "go", what: "Forrest leaves the familiar again and again: his braces shatter and he can run — into a football scholarship, then the Army and Vietnam. He crosses into the wide, chaotic world.", why: "the hero leaves the familiar and crosses into the wide world." },
      ]},
      { label: "Chaos — the search below", shade: "a2", beats: [
        { name: "Search", pos: "Chaos", slug: "search", what: "He moves through the chaos of an era — Vietnam, Bubba's shrimp dream, Lt. Dan, ping-pong fame, presidents and history at every turn — adapting and enduring, unknowingly searching for belonging.", why: "in the chaos of a new world, the hero adapts and endures, unknowingly chasing the need." },
        { name: "Find", pos: "Chaos", slug: "find", what: "He gets what he sought, in pieces: war hero, ping-pong champion, shrimping tycoon, rich and famous. And Jenny comes back to him for a real stretch of love. He finds success — and, briefly, her.", why: "the hero gets what he was after — success, and a real stretch of love." },
        { name: "Take", pos: "Chaos", slug: "take", what: "Every gain exacts its price: Bubba dies; Lt. Dan loses his legs; Mama dies; and Jenny slips away again after one night. Overwhelmed by loss, Forrest simply runs — across America, for years.", why: "every gain has a price; loss piles up and the hero pays for what he found." },
      ]},
      { label: "Return — and change", shade: "a3", beats: [
        { name: "Return", pos: "Order ↑", slug: "return", what: "Forrest comes home to Greenbow. Jenny reappears — with a son, Forrest Jr., his child. They marry; he climbs back into the ordinary world, but changed, having finally found the family he needed.", why: "the hero comes back to the ordinary world — but changed by everything out there." },
        { name: "Change", pos: "Order", slug: "change", what: "Jenny dies, but Forrest is now a father — the parent to his son that Mama was to him. Belonging, sought his whole life, is now his to give. The final image mirrors the first: Forrest Jr. boards the school bus, and the feather lifts off again.", why: "the hero is transformed: what he searched for his whole life is now his to give." },
      ]},
    ],
    takeaway: "Give your hero one simple, unwavering need and let history happen around them. The Story Circle works even in a loose, episodic life as long as every wandering step quietly serves the one thing the hero is missing.",
  },
};

export default function MoviePage() {
  const { slug = "" } = useParams();
  const movie = MOVIES[slug];

  if (!movie) {
    return (
      <section className="bg-background px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Movie not found</h1>
        <Link to="/movie-in-a-box/compare" className="mt-4 inline-block text-sm text-foreground/60 hover:text-foreground">
          Back to Compare
        </Link>
      </section>
    );
  }

  const shadeFor = (s: "a1" | "a2" | "a3") => movie.shades[s];

  return (
    <>
      <Seo
        title={`${movie.title} | Movie in a Box`}
        description={`How ${movie.title} maps to the ${movie.structureName} structure, beat by beat.`}
        canonical={`https://filmmakergenius.com/movie-in-a-box/movie/${slug}`}
        type="article"
      />

      <div className="border-b border-white/10 bg-[#0c0e13]/95">
        <div className="container mx-auto px-4 pt-3 pb-1 text-sm whitespace-nowrap overflow-x-auto">
          <Link to="/movie-in-a-box" className="text-foreground/50 hover:text-foreground transition-colors">Movie in a Box</Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">›</span>
          <Link to={`/movie-in-a-box/${movie.structureKey}/structure`} className="transition-colors" style={{ color: movie.color, fontWeight: 600 }}>{movie.structureName}</Link>
        </div>
      </div>

      <nav aria-label={`${movie.structureName} beats`} className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <ul className="flex items-center overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            <li>
              <span className="inline-block rounded-md px-2.5 py-1.5 font-semibold" style={{ color: movie.color }}>{movie.title}</span>
            </li>
            {movie.subheader.map((b) => {
              const bs = slugify(b);
              return (
                <li key={bs} className="flex items-center">
                  <span className="text-foreground/25 px-1" aria-hidden="true">·</span>
                  <Link to={`/movie-in-a-box/${movie.structureKey}/beat/${bs}`} className="inline-block rounded-md px-2.5 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors">{b}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section className="bg-background px-4 pt-16 pb-10">
        <div className="container mx-auto flex flex-col items-center text-center">
          {slug === "gladiator" || slug === "the-godfather" ? (
            <img
              src={slug === "gladiator" ? gladiatorPoster.url : godfatherPoster.url}
              alt={`${movie.title} movie poster`}
              className="rounded-lg object-cover bg-black/40"
              style={{ width: 132, height: 194 }}
              loading="lazy"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-white/25 bg-black/40 flex items-center justify-center text-center" style={{ width: 132, height: 194 }}>
              <span className="text-[10px] text-foreground/40 px-2">Movie poster</span>
            </div>
          )}
          <span className="mt-7 text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: movie.color }}>{movie.structureName}</span>
          <h1 className="mt-2 text-4xl font-bold tracking-tight" style={{ color: movie.color }}>{movie.title}</h1>
          <span className="mt-4 block h-[2px] w-10 rounded-full" style={{ backgroundColor: movie.color, opacity: 0.7 }} />
          <span className="mt-4 text-xs text-foreground/50">This film is our guide to the {movie.structureName} structure.</span>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex flex-row flex-wrap items-center justify-center gap-2">
              {Array.from({ length: movie.oscars }).map((_, i) => (<Oscar key={i} />))}
            </div>
            <span className="text-xs text-foreground/50">{movie.oscarLabel}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-[820px]">
        <section className="border-t border-white/10 py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/40 mb-4">The film in one breath</p>
          <p className="text-[15.5px] leading-relaxed text-foreground/80">{movie.oneBreath}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden border border-white/10 bg-white/10">
            {movie.facts.map((f) => (
              <div key={f.k} className="bg-background px-4 py-3">
                <span className="block text-[10.5px] uppercase tracking-[0.14em] text-foreground/40 mb-1">{f.k}</span>
                <span className="text-sm text-foreground">{f.v}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/40 mb-3">Why this movie teaches {movie.structureName}</p>
          <h2 className="font-serif text-[26px] font-semibold tracking-tight mb-3 text-foreground">{movie.whyTitle}</h2>
          <p className="text-[15.5px] leading-relaxed text-foreground/80">{movie.whyBody}</p>
        </section>

        <section className="border-t border-white/10 py-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/40 mb-3">Beat by beat — {movie.title} × {movie.structureName}</p>
          <h2 className="font-serif text-[26px] font-semibold tracking-tight mb-3 text-foreground">The same beats, executed.</h2>
          <p className="text-[15px] leading-relaxed text-foreground/55 mb-2">{movie.beatsIntro}</p>

          {movie.acts.map((act) => (
            <div key={act.label} className="mt-6">
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] mb-2.5" style={{ color: movie.color, opacity: 0.9 }}>{act.label}</p>
              {act.beats.map((beat) => (
                <div key={beat.slug} className="mb-3 rounded-r-xl px-[18px] py-4" style={{ borderLeft: `3px solid ${movie.color}`, backgroundColor: shadeFor(act.shade) }}>
                  <div className="flex items-baseline gap-2.5 flex-wrap mb-2">
                    <span className="font-serif text-[18px] font-bold" style={{ color: movie.color }}>{beat.name}</span>
                    <span className="text-[11px] text-foreground/55 border border-white/10 rounded-full px-2.5 py-0.5">{beat.pos}</span>
                    <Link to={`/movie-in-a-box/${movie.structureKey}/beat/${beat.slug}`} className="ml-auto text-[12px]" style={{ color: movie.color, opacity: 0.85 }}>Open beat →</Link>
                  </div>
                  <p className="text-[14.5px] leading-relaxed text-foreground/85 mb-2">{beat.what}</p>
                  <p className="text-[13px] text-foreground/55 border-t border-dashed border-white/10 pt-2"><span className="font-semibold text-foreground/70">Why it works: </span>{beat.why}</p>
                </div>
              ))}
            </div>
          ))}

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[13px] text-foreground/55">
            <span aria-hidden="true">↔</span>
            <span>This walk mirrors the <Link to={`/movie-in-a-box/${movie.structureKey}/structure`} className="font-semibold" style={{ color: movie.color }}>{movie.structureName} structure page</Link> — the theory page shows the beats empty; this page shows them filled by a film you know.</span>
          </div>
        </section>

        <section className="border-t border-white/10 py-9">
          <div className="rounded-2xl px-6 py-5" style={{ border: `1px solid ${movie.color}`, backgroundColor: `${movie.color}14` }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: movie.color }}>Steal this</p>
            <p className="text-[15.5px] text-foreground">{movie.takeaway}</p>
          </div>
        </section>
      </div>

      <div className="bg-background px-4 pt-4 pb-20 text-center">
        <Link to={`/movie-in-a-box/${movie.structureKey}/structure`} className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: movie.color, color: "#0c0e13" }}>
          Build your own with {movie.structureName} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
