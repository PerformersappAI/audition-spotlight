import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type Work = { b: string; text: string };
type Beat = {
  name: string;
  actChip: string;
  posChip: string;
  aliasChip: string;
  lead: string;
  oneLiner: string;
  theory: string[];
  checklistTitle: string;
  checklist: string[];
  moviePos: string;
  scene: string;
  works: Work[];
  steal: string;
};

const STRUCTURES: Record<
  string,
  { name: string; color: string; shade: string; movie: { title: string; slug: string }; beats: { slug: string; name: string }[] }
> = {
  "three-act": {
    name: "Three-Act",
    color: "#a855f7",
    shade: "rgba(221,190,255,0.14)",
    movie: { title: "The Godfather", slug: "the-godfather" },
    beats: [
      { slug: "ordinary-world", name: "Ordinary World" },
      { slug: "inciting-incident", name: "Inciting Incident" },
      { slug: "first-plot-point", name: "First Plot Point" },
      { slug: "rising-action", name: "Rising Action" },
      { slug: "midpoint", name: "Midpoint" },
      { slug: "crisis-low", name: "Crisis / Low" },
      { slug: "climax", name: "Climax" },
      { slug: "resolution", name: "Resolution" },
    ],
  },
  "save-the-cat": {
    name: "Save the Cat",
    color: "#d4a017",
    shade: "rgba(212,160,23,0.12)",
    movie: { title: "The Silence of the Lambs", slug: "the-silence-of-the-lambs" },
    beats: [
      { slug: "opening", name: "Opening" },
      { slug: "theme", name: "Theme" },
      { slug: "setup", name: "Setup" },
      { slug: "catalyst", name: "Catalyst" },
      { slug: "debate", name: "Debate" },
      { slug: "break-2", name: "Break 2" },
      { slug: "b-story", name: "B Story" },
      { slug: "fun-games", name: "Fun & Games" },
      { slug: "midpoint", name: "Midpoint" },
      { slug: "bad-guys", name: "Bad Guys" },
      { slug: "all-is-lost", name: "All Is Lost" },
      { slug: "dark-night", name: "Dark Night" },
      { slug: "break-3", name: "Break 3" },
      { slug: "finale", name: "Finale" },
      { slug: "final-image", name: "Final Image" },
    ],
  },
  "heros-journey": {
    name: "Hero's Journey",
    color: "#fb7185",
    shade: "rgba(251,113,133,0.12)",
    movie: { title: "Gladiator", slug: "gladiator" },
    beats: [
      { slug: "ordinary", name: "Ordinary" },
      { slug: "call", name: "Call" },
      { slug: "refusal", name: "Refusal" },
      { slug: "mentor", name: "Mentor" },
      { slug: "threshold", name: "Threshold" },
      { slug: "tests", name: "Tests" },
      { slug: "inmost-cave", name: "Inmost Cave" },
      { slug: "ordeal", name: "Ordeal" },
      { slug: "reward", name: "Reward" },
      { slug: "road-back", name: "Road Back" },
      { slug: "resurrection", name: "Resurrection" },
      { slug: "return", name: "Return" },
    ],
  },
  "story-circle": {
    name: "Story Circle",
    color: "#2bd1c0",
    shade: "rgba(43,209,192,0.12)",
    movie: { title: "Forrest Gump", slug: "forrest-gump" },
    beats: [
      { slug: "you", name: "You" },
      { slug: "need", name: "Need" },
      { slug: "go", name: "Go" },
      { slug: "search", name: "Search" },
      { slug: "find", name: "Find" },
      { slug: "take", name: "Take" },
      { slug: "return", name: "Return" },
      { slug: "change", name: "Change" },
    ],
  },
};

const THREE_ACT: Record<string, Beat> = {
  "ordinary-world": {
    name: "Ordinary World",
    actChip: "Act I · Setup",
    posChip: "Opening · ~0–10%",
    aliasChip: "a.k.a. Opening Image / Status Quo",
    lead: "Every story starts with a “before” picture. The Ordinary World is the hero’s life as it is — the normal, the status quo — drawn just clearly enough that we feel it break the moment the story arrives.",
    oneLiner: "establish who the hero is, what their normal world is, and what they want — and make us ask a question.",
    theory: [
      "This opening beat has one purpose: to show us who the protagonist is and the world they live in before anything changes. It sets the tone, the rules, and the emotional baseline the rest of the film will measure itself against.",
      "It also has to make us care and make us curious. A strong Ordinary World plants a hook — a question that pulls us forward — and quietly introduces the hero’s flaw or unmet need, the very thing the journey will test.",
      "The craft is compression: the best openings install a whole world in a single vivid sequence instead of a slow tour — showing the rules by dramatizing them, revealing character through action, not exposition.",
      "The classic mistakes are opposite errors: too much ordinary world (the film is slow to start) or too little (we don’t care about the hero yet). And remember it is a mirror — the final image will rhyme with it, and the distance between the two is the measure of the hero’s change.",
    ],
    checklistTitle: "What to establish here",
    checklist: [
      "Who the hero is — and the flaw or need the story will test",
      "Their normal world and the rules that govern it",
      "What they want, or what’s quietly missing",
      "The tone and genre — the promise you make the audience",
      "A hook: one question that makes us need to keep watching",
    ],
    moviePos: "Ordinary World · Opening sequence",
    scene: "Connie’s wedding. In one virtuoso sequence, Coppola installs the entire world — the Don’s power, the code of loyalty and favors (“I believe in America…”), and Michael Corleone as the decorated war hero who insists he stands apart: “That’s my family, Kay. It’s not me.”",
    works: [
      { b: "It dramatizes the rules instead of explaining them.", text: "Loyalty, favors, and the violence humming beneath the celebration are all shown, not told. We feel the equilibrium of the Corleone empire at its peak — the “normal” the film will spend three hours dismantling." },
      { b: "It plants the flaw and the hook.", text: "Michael’s insistence that he’s not part of this is the exact belief the story will destroy. His distance from the family is the baseline — and the whole tragedy is that distance closing." },
      { b: "It sets up the mirror.", text: "The film opens with petitioners kissing Don Vito’s hand; it will end with them kissing Michael’s. This is the “before” photo of a man who still has a soul." },
    ],
    steal: "Establish what your hero swears they’ll never become. Michael’s “It’s not me” is the whole movie in four words — the Ordinary World’s job is to make that promise, so the story can break it.",
  },
  "inciting-incident": {
    name: "Inciting Incident",
    actChip: "Act I · Setup",
    posChip: "~12%",
    aliasChip: "a.k.a. Catalyst",
    lead: "The Inciting Incident is the knock on the door — the outside event that disrupts the hero’s balance and points them toward a journey. It’s the reason there is a story at all.",
    oneLiner: "disrupt the hero’s normal with something they can’t ignore, and aim them at the story to come.",
    theory: [
      "Something from outside the hero breaks the equilibrium of the Ordinary World. Remove it and the hero simply goes on living their normal life — which is why it is the event that makes a story necessary.",
      "It has to be undeniable: the knock the hero can’t pretend they didn’t hear. Big or small, it must land hard enough that the world can’t snap back to how it was.",
      "Note it is often a choice presented, not yet accepted. The Inciting Incident opens the door; the hero doesn’t have to walk through it yet. That hesitation is what the rest of Act I is for.",
      "Place it early — modern audiences won’t wait long for the story to start — but not so early that we haven’t felt the “normal” it disrupts.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Come from outside the hero, not their own plan",
      "Break the equilibrium so the world can’t reset",
      "Be impossible to ignore",
      "Point toward the journey — even if the hero refuses at first",
    ],
    moviePos: "Inciting Incident · ~12%",
    scene: "Don Vito refuses Sollozzo’s narcotics proposition — and is gunned down in the street. In a single act of violence, the balance of the family’s world is shattered.",
    works: [
      { b: "It comes from outside and can’t be undone.", text: "Sollozzo’s attack is not something the Corleones chose; it’s done to them. The Don in a hospital bed, the family exposed — the equilibrium of the opening wedding is gone for good." },
      { b: "It opens the door without shoving Michael through.", text: "The shooting doesn’t make Michael a gangster yet. It creates the vacuum — the danger, the disarray — that will pull the war hero in. The choice is presented; he hasn’t accepted it." },
      { b: "It starts the real clock.", text: "Everything after this is reaction: protect the Don, answer Sollozzo, hold the family together. The story proper has begun." },
    ],
    steal: "Aim your Inciting Incident straight at the hero’s stated “not me.” The bullets that hit Vito are really aimed at Michael’s promise to stay out — the catalyst works because it threatens exactly the life he swore to keep.",
  },
  "first-plot-point": {
    name: "First Plot Point",
    actChip: "Act I → Act II",
    posChip: "~25%",
    aliasChip: "a.k.a. Break into Two / Point of No Return",
    lead: "The First Plot Point is the point of no return — the moment the hero commits to the goal and the door to the ordinary world closes behind them. Syd Field considered this the true start of the story.",
    oneLiner: "make the hero commit — and shut the door back to their old life.",
    theory: [
      "This is the hinge from Act I into Act II. The hero stops reacting and makes a choice that can’t be taken back — stepping onto the road the rest of the film travels.",
      "Field argued everything before it is setup. The First Plot Point is where the “real” movie begins, because it’s the first irreversible commitment; the ordinary world is now gone.",
      "The strongest versions are active: the hero chooses, rather than simply having something happen to them. A choice costs something and reveals character; an accident doesn’t.",
      "It should redefine the goal. After this point we know what the hero is chasing and what it will cost — the central dramatic question is fully in play.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Force an irreversible commitment",
      "Come from the hero’s choice where possible",
      "Close the door to the old, ordinary life",
      "Launch Act II with a clear goal",
    ],
    moviePos: "First Plot Point · ~25%",
    scene: "Michael volunteers to kill Sollozzo and the crooked Captain McCluskey — and then does it, in the restaurant. The outsider crosses fully into the family business.",
    works: [
      { b: "It’s a choice, not an accident.", text: "No one forces Michael to pull the trigger. He argues for it, plans it, and does it himself. That’s what makes it the hinge of the whole tragedy — he chose." },
      { b: "The door slams shut.", text: "Before the restaurant, Michael could still walk away into Kay’s world. After it, he’s a murderer and a fugitive. “It’s not me” is dead. Act II is exile and war." },
      { b: "It sets the Act II goal.", text: "From here the question is no longer “will Michael get involved?” but “how far will he go?” — the engine of the entire middle." },
    ],
    steal: "Put the point of no return in the hero’s own hands. The more they choose their fall, the more the story belongs to them — and the more the ending will hurt.",
  },
  "rising-action": {
    name: "Rising Action",
    actChip: "Act II · Confrontation",
    posChip: "~25–50%",
    aliasChip: "a.k.a. Tests & Trials / Fun & Games",
    lead: "Rising Action is the body of Act II: the hero pursues the goal and meets escalating opposition. The key word is escalating — not more obstacles, but costlier ones.",
    oneLiner: "raise the cost of the goal, scene by scene — don’t just add obstacles, escalate them.",
    theory: [
      "Confrontation is not “more problems.” It’s a narrowing corridor where every scene removes an option and raises the price of the goal. Allies and enemies appear; the plan changes; pressure mounts.",
      "This is where character is revealed, because we learn who someone is by watching what they do under increasing pressure.",
      "It’s also where most stories die — the “sagging middle.” The cure is escalation: if your scenes could be reordered without anyone noticing, they aren’t rising.",
      "Pinch points (around 37% and 62%) exist here to force the antagonist back on screen and remind us exactly what the hero is up against.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Escalate the cost, not just the count, of obstacles",
      "Change the plan as pressure mounts",
      "Reveal character through choices under pressure",
      "Keep the antagonist felt and present",
    ],
    moviePos: "Rising Action · Act II",
    scene: "Michael in exile in Sicily; he marries Apollonia; the gang war escalates back home. Then Apollonia is killed by a car bomb meant for him.",
    works: [
      { b: "The cost keeps climbing.", text: "Exile isn’t a pause — it’s the war reaching Michael personally. Apollonia’s death is the price of this world made intimate: no longer tactics, but his life." },
      { b: "The plan and the man change.", text: "The reluctant son hardens into a strategist. Each escalation strips away more of the innocent Michael and reveals the Don he’s becoming." },
      { b: "Every beat removes an option.", text: "Peace, safety, a normal marriage — the corridor narrows until the only path left is back into power at home." },
    ],
    steal: "Make the middle personal. Godfather’s Act II works because the war stops being about business and starts costing Michael the people he loves — escalation you can feel, not just count.",
  },
  midpoint: {
    name: "Midpoint",
    actChip: "Act II · Midpoint",
    posChip: "~50%",
    aliasChip: "a.k.a. the Reversal",
    lead: "The Midpoint is the pivot at the center — usually a reversal. A false victory that curdles, or a false defeat that reveals a path. Above all, it changes what the hero is fighting for.",
    oneLiner: "flip the story at the center so the second half isn’t a rerun of the first.",
    theory: [
      "A real midpoint splits Act II into two different halves. Before it, the hero is largely reacting — being pushed. After it, they start pushing back: reaction turns to action.",
      "The classic shape is a reversal: a win that turns sour, or a loss that opens a door. Either way, the hero’s goal or understanding changes.",
      "This is the single most important defense against the sagging middle. Strengthen the midpoint and the whole second act tightens.",
      "Raise the stakes and often make it personal — the midpoint is where the story stops being something happening to the hero and becomes something the hero drives.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Reverse the situation — victory sours or defeat opens a path",
      "Change what the hero is fighting for",
      "Turn the hero from reactive to active",
      "Split Act II into two distinct halves",
    ],
    moviePos: "Midpoint · ~50%",
    scene: "Sonny is ambushed and slaughtered at the causeway. Succession pivots irreversibly to Michael; a broken Don Vito sues for a false peace.",
    works: [
      { b: "It reverses everything.", text: "Sonny’s death removes the heir and forces the reluctant Michael to the center. The family’s future — and the film’s — now runs through him." },
      { b: "Reaction becomes action.", text: "Up to now Michael has been swept along by events. From the causeway on, he becomes the planner, the strategist — the one making the moves." },
      { b: "It changes what he’s fighting for.", text: "No longer just survival or revenge — now it’s succession, rebuilding, becoming the Don. The second half of Act II is a different film from the first." },
    ],
    steal: "Use the midpoint to hand the hero the wheel. Sonny’s death is the moment Michael stops being pulled into the family and starts running it — the reversal that makes the back half inevitable.",
  },
  "crisis-low": {
    name: "Crisis / Low",
    actChip: "Act II → Act III",
    posChip: "~75%",
    aliasChip: "a.k.a. All Is Lost / Second Plot Point",
    lead: "The Crisis is the low point — “all is lost.” The hero’s plan collapses and the goal looks impossible. The deeper this fall, the more the climax will mean.",
    oneLiner: "drop the hero to their lowest point and force the final, hardest choice.",
    theory: [
      "This is the hinge from Act II into Act III. Whatever the hero has been building comes apart, and the goal looks out of reach.",
      "The depth of the fall is the point: the climax can only be as powerful as the low that precedes it. A shallow crisis makes a weak ending.",
      "It usually forces the hero’s final, hardest choice — the one that requires everything they’ve learned and costs the most.",
      "Emotionally it often isolates the hero: stripped of allies, support, or certainty, alone with the decision only they can make.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Collapse the plan / make the goal look impossible",
      "Fall as far as the climax needs to rise",
      "Isolate the hero",
      "Force the final, hardest choice",
    ],
    moviePos: "Crisis / Low · ~75%",
    scene: "Don Vito dies in the garden with his grandson. Michael is now the Don — and utterly alone at the top, surrounded by enemies he must destroy to survive.",
    works: [
      { b: "The support is gone.", text: "Vito’s death removes the father, the shield, the last restraint. Michael stands alone at the head of a family circled by rivals." },
      { b: "It’s the darkest “win.”", text: "Michael has the power he was pulled toward — and it’s a prison. The low point here isn’t defeat; it’s the terrible isolation of the top." },
      { b: "It forces the final move.", text: "Alone and threatened, Michael faces the hardest choice: destroy every enemy at once, and with it whatever’s left of the man from the wedding." },
    ],
    steal: "The low point doesn’t have to be a loss. Michael’s crisis is getting exactly what the story pulled him toward — and finding himself alone with it. The most chilling “all is lost” can look like a victory.",
  },
  climax: {
    name: "Climax",
    actChip: "Act III · Resolution",
    posChip: "~90%",
    aliasChip: "a.k.a. the Finale",
    lead: "The Climax is the biggest confrontation — the moment everything the hero has learned is spent in one decisive act. It’s the answer to the central dramatic question the story asked in Act I.",
    oneLiner: "spend everything the hero has, in one decisive act that answers the story’s question.",
    theory: [
      "This is what the whole film has been building toward. The tension peaks and breaks; the hero acts, decisively, and the outcome settles the central question.",
      "Everything earned in Act II — skills, allies, hard truths — is spent here. A climax that requires nothing the hero learned feels unearned.",
      "It should be inevitable but not predictable: the logical end of everything before it, arriving in a way we didn’t quite see coming.",
      "In tragedy, the climax is where the hero’s victory and their damnation can be the very same act.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Answer the central dramatic question",
      "Spend what the hero learned in Act II",
      "Peak the tension and break it decisively",
      "Feel inevitable, not predictable",
    ],
    moviePos: "Climax · ~90%",
    scene: "The baptism massacre. As Michael renounces Satan at his nephew’s christening, his men murder the heads of the Five Families. In one intercut sequence, he seizes absolute power.",
    works: [
      { b: "It answers the question.", text: "“Will Michael stay out — or become his father?” The baptism is the answer, in full: he becomes the Don, and more ruthless than Vito ever was." },
      { b: "It spends everything.", text: "Every lesson of Act II — patience, strategy, the willingness to kill — is fired at once. Nothing is held back." },
      { b: "Victory and damnation are one act.", text: "Coppola marries sacrament and slaughter in the edit: as Michael renounces Satan, he commits his greatest sins. He wins absolutely and loses his soul in the same breath." },
    ],
    steal: "Make the climax the answer to your Act I question, in the hero’s own hands. The baptism works because it settles “who is Michael?” so completely — and so damningly — that no scene after it could be in doubt.",
  },
  resolution: {
    name: "Resolution",
    actChip: "Act III · Resolution",
    posChip: "~99%",
    aliasChip: "a.k.a. Final Image / New Normal",
    lead: "The Resolution shows the new equilibrium — the world after the climax — and, in the best films, rhymes with the opening image so we feel exactly how far the hero has come.",
    oneLiner: "show the new normal and mirror the opening, so the change is undeniable.",
    theory: [
      "After the climax answers the question, the Resolution shows the fallout: the changed world, the new status quo, the cost paid.",
      "Its most powerful tool is the mirror — echoing the Ordinary World so the audience can measure the distance travelled. Same frame, changed meaning.",
      "It should be brief. Once the question is answered, lingering drains tension; the best endings land the final image and stop.",
      "It doesn’t have to be happy — only true. The Resolution proves the change, whether that change is triumph or tragedy.",
    ],
    checklistTitle: "What this beat must do",
    checklist: [
      "Show the new equilibrium / proof of change",
      "Mirror the opening image",
      "Keep it brief once the question is answered",
      "Be true, not necessarily happy",
    ],
    moviePos: "Resolution · ~99%",
    scene: "Kay asks if Michael ordered Carlo’s death. He lies to her face: “No.” Then his men close the office door on her — and on us.",
    works: [
      { b: "It mirrors the opening.", text: "The film began with petitioners kissing Don Vito’s hand; it ends with them kissing Michael’s, the door closing on Kay. The “before” and “after” photos, side by side." },
      { b: "It proves the change.", text: "The war hero who said “It’s not me” now lies to his wife about murder and accepts the ring-kiss of a Don. The transformation is complete." },
      { b: "It’s true, not happy.", text: "No triumph, no comfort. Just the closing door — the exact measure of everything Michael has become, and lost." },
    ],
    steal: "End on the mirror. The closing door works because it rhymes with the opening wedding — one image that shows the whole distance from “It’s not me” to the new Godfather. Find your “before” frame, then show its “after.”",
  },
};

export default function BeatPage() {
  const { structure = "", slug = "" } = useParams();
  const struct = STRUCTURES[structure];

  if (!struct) {
    return (
      <section className="bg-background px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Beat not found</h1>
        <Link to="/movie-in-a-box/compare" className="mt-4 inline-block text-sm text-foreground/60 hover:text-foreground">
          Back to Compare
        </Link>
      </section>
    );
  }

  const color = struct.color;
  const idx = struct.beats.findIndex((b) => b.slug === slug);
  const prev = idx > 0 ? struct.beats[idx - 1] : null;
  const next = idx >= 0 && idx < struct.beats.length - 1 ? struct.beats[idx + 1] : null;
  const beat = structure === "three-act" ? THREE_ACT[slug] : undefined;
  const beatName = beat?.name ?? struct.beats[idx]?.name ?? "Beat";

  return (
    <>
      <Seo
        title={`${beatName} — ${struct.name} | Movie in a Box`}
        description={`${beatName}: what the beat is, and how ${struct.movie.title} nails it.`}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structure}/beat/${slug}`}
        type="article"
      />

      {/* breadcrumb */}
      <div className="border-b border-white/10 bg-[#0c0e13]/95">
        <div className="container mx-auto px-4 pt-3 pb-1 text-sm whitespace-nowrap overflow-x-auto">
          <Link to="/movie-in-a-box" className="text-foreground/50 hover:text-foreground transition-colors">Movie in a Box</Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">›</span>
          <Link to={`/movie-in-a-box/${structure}/structure`} className="transition-colors" style={{ color, fontWeight: 600 }}>{struct.name}</Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">›</span>
          <Link to={`/movie-in-a-box/movie/${struct.movie.slug}`} className="transition-colors" style={{ color, fontWeight: 600, opacity: 0.85 }}>{struct.movie.title}</Link>
          <span className="text-foreground/30 px-2" aria-hidden="true">›</span>
          <span className="font-semibold text-foreground">{beatName}</span>
        </div>
      </div>

      {/* beat-flow subheader */}
      <nav aria-label={`${struct.name} beats`} className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <ul className="flex items-center overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            {struct.beats.map((b, i) => {
              const active = b.slug === slug;
              return (
                <li key={b.slug} className="flex items-center">
                  {i > 0 && <span className="text-foreground/25 px-1" aria-hidden="true">·</span>}
                  <Link
                    to={`/movie-in-a-box/${structure}/beat/${b.slug}`}
                    aria-current={active ? "page" : undefined}
                    className="inline-block rounded-md px-2.5 py-1.5 transition-colors"
                    style={active ? { color, backgroundColor: struct.shade, fontWeight: 600 } : undefined}
                  >
                    <span className={active ? "" : "text-foreground/50 hover:text-foreground"}>{b.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-[780px]">
        {/* header */}
        <div className="pt-11 pb-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em]" style={{ color }}>
            {struct.name} · Beat {idx + 1}
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight mt-2 text-foreground">{beatName}</h1>
          {beat && (
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span className="text-[11px] rounded-full px-2.5 py-[3px]" style={{ color, border: `1px solid ${color}66`, backgroundColor: `${color}14` }}>{beat.actChip}</span>
              <span className="text-[11px] text-foreground/60 rounded-full px-2.5 py-[3px] border border-white/10">{beat.posChip}</span>
              <span className="text-[11px] text-foreground/60 rounded-full px-2.5 py-[3px] border border-white/10">{beat.aliasChip}</span>
            </div>
          )}
        </div>

        {beat ? (
          <>
            {/* TOP HALF — theory */}
            <section className="py-8">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40">What this beat is</span>
                <span className="flex-1 h-px bg-white/10" />
              </div>
              <p className="text-[17px] leading-relaxed text-foreground mb-4">{beat.lead}</p>
              <div className="rounded-r-[10px] px-4 py-3 mb-5 text-[14.5px] text-foreground" style={{ borderLeft: `3px solid ${color}`, backgroundColor: struct.shade }}>
                <span className="font-semibold" style={{ color }}>Its job, in one line: </span>{beat.oneLiner}
              </div>
              {beat.theory.map((p, i) => (
                <p key={i} className="text-[15.5px] leading-relaxed text-foreground/82 mb-3.5">{p}</p>
              ))}
              <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-[18px] py-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/40 mb-2.5">{beat.checklistTitle}</div>
                <ul className="grid gap-2">
                  {beat.checklist.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-[14px] text-foreground/85">
                      <span className="mt-2 h-[7px] w-[7px] rounded-full flex-none" style={{ backgroundColor: color }} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* divider */}
            <div className="flex items-center gap-4 my-1">
              <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.1))" }} />
              <span className="font-serif text-[13px] uppercase tracking-[0.14em]" style={{ color, opacity: 0.85 }}>Now, in the film</span>
              <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.1),transparent)" }} />
            </div>

            {/* BOTTOM HALF — the movie */}
            <section className="py-8">
              <div className="rounded-2xl p-6" style={{ border: `1px solid ${color}47`, background: `linear-gradient(180deg, ${color}10, ${color}05)` }}>
                <div className="flex items-baseline gap-2.5 flex-wrap mb-4">
                  <span className="font-serif text-[22px] font-bold" style={{ color }}>{struct.movie.title}</span>
                  <span className="text-[11px] text-foreground/60 rounded-full px-2.5 py-[2px] border border-white/10">{beat.moviePos}</span>
                </div>

                <div className="mb-4 flex items-center justify-center text-center rounded-lg border border-dashed border-white/20 bg-black/30 text-[10.5px] text-foreground/40" style={{ width: "100%", maxWidth: 220, height: 120 }}>
                  Film still (optional) — leave blank
                </div>

                <p className="text-[15.5px] leading-relaxed text-foreground mb-4">{beat.scene}</p>

                <div className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color }}>How it does the beat’s job</div>
                {beat.works.map((w, i) => (
                  <p key={i} className="text-[14.5px] leading-relaxed text-foreground/85 mb-2.5">
                    <span className="font-semibold text-foreground">{w.b} </span>{w.text}
                  </p>
                ))}

                <div className="mt-5 rounded-xl px-5 py-4" style={{ border: `1px solid ${color}`, backgroundColor: `${color}14` }}>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color }}>Steal this</div>
                  <p className="text-[15.5px] text-foreground m-0">{beat.steal}</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="py-16 text-center">
            <p className="text-foreground/60 text-[15px]">We’re still writing this one — check back soon.</p>
            <Link to={`/movie-in-a-box/${structure}/structure`} className="mt-4 inline-block text-sm font-semibold" style={{ color }}>
              Back to {struct.name} →
            </Link>
          </section>
        )}

        {/* pager */}
        <div className="flex justify-between gap-3 py-7 pb-16">
          {prev ? (
            <Link to={`/movie-in-a-box/${structure}/beat/${prev.slug}`} className="flex-1 rounded-xl border border-white/10 px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
              <div className="text-[11px] uppercase tracking-[0.12em] text-foreground/40">← Previous beat</div>
              <div className="font-serif text-[16px] font-bold mt-0.5 text-foreground">{prev.name}</div>
            </Link>
          ) : (
            <span className="flex-1 rounded-xl border border-white/10 px-4 py-3.5 opacity-35">
              <div className="text-[11px] uppercase tracking-[0.12em] text-foreground/40">← Previous beat</div>
              <div className="font-serif text-[16px] font-bold mt-0.5 text-foreground">—</div>
            </span>
          )}
          {next ? (
            <Link to={`/movie-in-a-box/${structure}/beat/${next.slug}`} className="flex-1 text-right rounded-xl border border-white/10 px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
              <div className="text-[11px] uppercase tracking-[0.12em] text-foreground/40">Next beat →</div>
              <div className="font-serif text-[16px] font-bold mt-0.5 text-foreground">{next.name}</div>
            </Link>
          ) : (
            <span className="flex-1 text-right rounded-xl border border-white/10 px-4 py-3.5 opacity-35">
              <div className="text-[11px] uppercase tracking-[0.12em] text-foreground/40">Next beat →</div>
              <div className="font-serif text-[16px] font-bold mt-0.5 text-foreground">—</div>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
