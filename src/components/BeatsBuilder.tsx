import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type FwKey = "p" | "g" | "r" | "t";
const FWC: Record<FwKey, string> = { p: "#a855f7", g: "#d4a017", r: "#fb7185", t: "#2bd1c0" };
const GOLD = "#d4a017";

type Beat = { t: string; slug: string; fw: Partial<Record<FwKey, string>> };
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

const RAW: { t: string; fw: Partial<Record<FwKey, string>> }[] = [
  { t: "The Ordinary World", fw: { p: "Ordinary World", g: "Opening / Set-Up", r: "Ordinary World", t: "You" } },
  { t: "The Theme", fw: { g: "Theme Stated" } },
  { t: "The Need", fw: { t: "Need" } },
  { t: "The Call", fw: { p: "Inciting Incident", g: "Catalyst", r: "Call to Adventure" } },
  { t: "The Refusal", fw: { g: "Debate", r: "Refusal of the Call" } },
  { t: "The Mentor", fw: { r: "Meeting the Mentor" } },
  { t: "The Point of No Return", fw: { p: "First Plot Point", g: "Break into Two", r: "Crossing the Threshold", t: "Go" } },
  { t: "The Bond", fw: { g: "B Story" } },
  { t: "The Trials", fw: { p: "Rising Action", g: "Fun & Games", r: "Tests, Allies, Enemies", t: "Search" } },
  { t: "The Midpoint Turn", fw: { p: "Midpoint", g: "Midpoint", t: "Find" } },
  { t: "The Walls Close In", fw: { g: "Bad Guys Close In", r: "Approach the Inmost Cave" } },
  { t: "The Lowest Point", fw: { p: "Crisis / Low Point", g: "All Is Lost", r: "The Ordeal", t: "Take" } },
  { t: "The Dark Night", fw: { g: "Dark Night of the Soul" } },
  { t: "The Turn to the End", fw: { g: "Break into Three", r: "Reward / Road Back", t: "Return" } },
  { t: "The Final Test", fw: { p: "Climax", g: "Finale", r: "Resurrection" } },
  { t: "The Elixir", fw: { r: "Return with the Elixir" } },
  { t: "The New World", fw: { p: "Resolution", g: "Final Image", t: "Change" } },
];
const M: Beat[] = RAW.map((b) => ({ ...b, slug: slugify(b.t) }));

type Group = { L: string; name: string; qs: string[] };

const OW_GROUPS: Group[] = [
  { L: "A", name: "The Hero — basics", qs: ["Who is your main character (name, age, gender)?", "What's their job or role in life right now?", "How would a stranger describe them in one sentence?", "How do they see themselves in one sentence?", "What are they exceptionally good at — their signature skill?", "What small habit or quirk makes them feel like a real person?"] },
  { L: "B", name: "Their inner world — flaw, wound, want vs. need", qs: ["What is their core flaw — the thing holding them back?", "What past wound created that flaw (their “ghost”)?", "What do they consciously WANT at the start?", "What do they actually NEED (the lesson they don't yet know)?", "What lie do they believe about themselves or the world?", "What are they most afraid of?", "What do they secretly long for but won't admit?", "What's the “hole” in their life the story will eventually fill?"] },
  { L: "C", name: "Their daily life — the routine", qs: ["Walk me through an ordinary day for them, start to finish.", "What does their home look and feel like?", "How do they spend their time / make their living?", "Their relationship to that work — love it, trapped by it, indifferent?", "What rituals or routines define their “normal”?", "What everyday problem do they deal with (before the big one hits)?"] },
  { L: "D", name: "The world — setting", qs: ["Where does the story begin (place)?", "What time period / era is it?", "What are the “rules” of this world — social, cultural, physical?", "What's the mood and atmosphere of this place?", "What's beautiful or appealing about their world?", "What's suffocating or limiting about it?", "How does this world shape who they are?"] },
  { L: "E", name: "Relationships", qs: ["Who are the most important people in their life right now?", "Who do they live with / who's their family?", "Who's their closest ally or friend?", "Is there a love interest in the ordinary world? Who?", "Who do they have tension or conflict with?", "Is a mentor present yet, or still to come?", "How do others treat them — respected, overlooked, feared, loved?"] },
  { L: "F", name: "The status quo — and what's missing", qs: ["What “normal” is about to be shattered?", "What are they avoiding, tolerating, or settling for?", "What would they call “fine” that actually isn't?", "If nothing ever changed, where would this life lead them?", "What's the one thing that could tempt them out of their comfort zone?"] },
  { L: "G", name: "Theme & meaning", qs: ["What is the movie really about underneath the plot?", "How is that theme quietly present in the ordinary world?", "What belief will the story challenge or prove?", "If someone stated the theme out loud early, what would they say?"] },
  { L: "H", name: "Tone, genre, style", qs: ["What genre is this?", "Emotional tone of the opening — warm, tense, melancholy, fun?", "What existing movies feel tonally similar to your goal?", "Is the opening realistic, stylized, epic, or intimate?"] },
  { L: "I", name: "Opening image — visual & sensory", qs: ["If the first shot introduced your hero, what would we see?", "What single image captures their “before” state?", "What sounds, colors, and textures define this world?", "What is your hero physically doing in that first scene?", "What contrast do you want between this opening and the film's ending?"] },
  { L: "J", name: "Seeds of what's coming", qs: ["What tiny hint of the coming adventure can we plant here?", "What's at stake if their world gets disrupted?", "What does your hero not yet know is about to happen?"] },
];

const THEME_GROUPS: Group[] = [
  { L: "A", name: "The central truth", qs: ["In one sentence, what is the single truth your movie argues?", "What life lesson does your hero need to learn by the end?", "If your movie were a bumper sticker, what would it say?", "What question is your story asking (e.g., “Can a person change?”)?", "What is your honest answer to that question by the final frame?", "Why does this truth matter to you personally as the storyteller?"] },
  { L: "B", name: "The moral argument", qs: ["What does your story say is the “right” way to live?", "What does it say is the “wrong” way — and who embodies it?", "What price does a character pay for ignoring the theme?", "What reward does a character earn for living it?", "Is the theme a warning, a hope, a comfort, or a provocation?", "What belief does your audience hold that you want to challenge?"] },
  { L: "C", name: "How it's stated", qs: ["Which character says the theme out loud, early on?", "What exact line of dialogue could state it (a draft)?", "Does the hero dismiss or misunderstand it when they first hear it?", "Is it stated directly, ironically, or as a throwaway they'll only get later?", "What everyday moment could carry the theme without announcing it?"] },
  { L: "D", name: "The opposing view (antithesis)", qs: ["What's the counter-argument your antagonist truly believes?", "Why is that counter-argument seductive or reasonable?", "Where does the counter-argument look like it's winning?", "Who is the living proof of the wrong path?", "How do you keep the theme from feeling preachy?"] },
  { L: "E", name: "The hero's relationship to the theme", qs: ["How does the hero embody the OPPOSITE of the theme at the start?", "What false belief must they shed to learn it?", "What moment forces them to confront the theme head-on?", "Do they learn it fully, partially, or too late?", "How does living the theme change what they want?", "Is the theme learned through victory or through loss?"] },
  { L: "F", name: "Theme through characters", qs: ["Which supporting character reflects the theme achieved?", "Which reflects the theme rejected or failed?", "How does the love interest or ally push the hero toward the truth?", "Does any character argue the theme aloud on the hero's behalf?", "What does the villain reveal about the theme by opposing it?"] },
  { L: "G", name: "Theme through world, image & motif", qs: ["What recurring image or object could symbolize the theme?", "What visual motif appears at start, middle, and end to track it?", "How can the setting itself embody the argument?", "What color, sound, or piece of music carries the theme?", "What “before” image will you contrast with an “after” image to prove change?", "Is there a metaphor at the heart of the story (a cage, a door, a river)?"] },
  { L: "H", name: "The cost & the payoff", qs: ["What must the hero sacrifice to embody the theme?", "What does the world gain if the hero lives it?", "What emotional payoff do you want the audience to feel?", "What would make the theme land as earned rather than stated?", "If you removed the theme, would the plot still matter — why or why not?"] },
  { L: "I", name: "Tone & universality", qs: ["Is your theme universal enough for a stranger to feel it?", "How does the genre shape the way the theme is delivered?", "Could the theme be misread — and are you okay with that ambiguity?", "What's a movie whose theme landed on you — and how did it do it?", "In your genre, is the theme usually spoken or shown? Which will you do?"] },
  { L: "J", name: "Testing & seeds", qs: ["Where is the theme first planted so it pays off later?", "What scene most clearly tests the theme under pressure?", "What's the final image that proves the theme true?", "If a viewer described your movie's message, what would you want them to say?", "What line will the audience remember and repeat?", "Does every subplot echo or complicate the theme?"] },
];

const NEED_GROUPS: Group[] = [
  { L: "A", name: "Naming the need", qs: ["What does your hero most deeply need (not want) — in one word?", "What's missing inside them that no external win could fix?", "If they got everything they wanted but not this, would they be empty — why?", "What emotional hunger drives them without their knowing it?", "Is the need connection, worth, freedom, forgiveness, courage — or what?", "Finish the sentence: “Deep down, they need to learn that ___.”"] },
  { L: "B", name: "The root of the need", qs: ["Where did this lack come from — what event or absence created it?", "Who or what taught them to believe they don't deserve it?", "What formative moment planted the void?", "Is the need inherited from family, or forged by circumstance?", "What have they been substituting for the real thing?", "How long have they carried this — and what has it cost them?"] },
  { L: "C", name: "Want vs. Need", qs: ["What does your hero consciously WANT (the external goal)?", "How does that want disguise the deeper need?", "Where do want and need pull in opposite directions?", "At what point must they choose between the want and the need?", "Can they get the want without the need — or only one?", "What do they think will make them happy that actually won't?"] },
  { L: "D", name: "How the need shows up", qs: ["What everyday behavior reveals the unmet need?", "What do they overdo to compensate (work, control, charm, distance)?", "What do they avoid because of it?", "How does the need leak out in a moment of weakness?", "What do they secretly envy in others?", "What lie do they tell themselves to keep the need buried?"] },
  { L: "E", name: "The gap the hero can't see", qs: ["What's obvious to everyone but the hero?", "Who has tried to tell them the truth — and been ignored?", "What defense keeps them from seeing their own need?", "What would they have to admit for the need to surface?", "What are they most afraid the need would make them feel?"] },
  { L: "F", name: "Others & the need", qs: ["Who models the fulfilled version of what the hero lacks?", "Who exploits the hero's unmet need?", "Who loves them despite (or because of) the wound?", "How does the antagonist's own need mirror or invert the hero's?", "Who finally says the thing the hero needs to hear?"] },
  { L: "G", name: "Symptoms & behavior", qs: ["What small, specific action shows the need in scene one?", "What relationship suffers because of it?", "What opportunity have they refused because of it?", "What do they do when the need gets triggered under stress?", "How does the need shape the way they speak to people?"] },
  { L: "H", name: "The stakes of the need", qs: ["What happens to them if the need is never met?", "What happens to the people around them?", "Why is now the moment this need must be faced?", "What would “too late” look like for this need?", "What's the quiet tragedy if they win the plot but lose the need?"] },
  { L: "I", name: "The arc of the need", qs: ["What's the first crack that lets light into the need?", "What forces them to confront it at the midpoint?", "What loss makes the need undeniable?", "What moment do they finally accept it?", "What choice proves they've met the need?", "Do they meet it fully, or is it bittersweet?"] },
  { L: "J", name: "Craft & seeds", qs: ["What image could symbolize the empty place inside them?", "What line of dialogue could hint at the need without naming it?", "How will the audience feel the need before they understand it?", "What “before/after” contrast will show the need resolved?", "How does meeting the need connect to the film's theme?"] },
];

const CALL_GROUPS: Group[] = [
  { L: "A", name: "The event itself", qs: ["What single event breaks your hero's normal world?", "Is it a chance, a message, a death, an offer, a threat, a discovery?", "Does it come from outside (fate) or from the hero's own choice?", "What exactly happens in that moment, beat by beat?", "Is it a sudden shock or a slow-dawning realization?", "Could the story exist without this event? (If yes, it's not the real call.)", "Why does this event, specifically, force a response?"] },
  { L: "B", name: "Who or what delivers it", qs: ["Who is the messenger or catalyst — a herald, a villain, an accident?", "Do they mean to change the hero's life, or is it a side effect?", "What do they want from the hero?", "Does the hero trust the source of the call?", "Is the caller an ally, an enemy, or something ambiguous?"] },
  { L: "C", name: "Timing & placement", qs: ["How far into the movie does the call land (roughly)?", "What's the last “normal” beat right before it?", "Does a smaller inciting ripple precede the big one?", "Is the audience ahead of the hero, or do they learn it together?", "How much ordinary world do we need before the call earns its impact?"] },
  { L: "D", name: "The hero's first reaction", qs: ["What's their immediate gut response — fear, excitement, denial, anger?", "Do they grasp its importance right away, or dismiss it?", "What does the reaction reveal about their flaw?", "Whom do they turn to first?", "What do they try to do to make it go away?", "How does it collide with the life they've built?"] },
  { L: "E", name: "The disruption", qs: ["What exactly is knocked out of balance?", "What can the hero no longer pretend or ignore?", "What door does it open — and what door does it close?", "What's taken from them, or dangled in front of them?", "Why can't they simply return to how things were?"] },
  { L: "F", name: "Stakes introduced", qs: ["What does the hero stand to gain if they respond?", "What do they stand to lose if they don't?", "Who else is affected by this event?", "Is the threat personal, communal, or existential?", "What's the ticking clock, if any?", "How do the stakes escalate from here?"] },
  { L: "G", name: "The dramatic question", qs: ["What central question does the call plant (“Will they…?”)?", "What's the hero's new goal, even if unstated?", "What obstacle immediately stands in the way?", "What's the “adventure” being offered, in plain terms?", "What makes this a story worth two hours?"] },
  { L: "H", name: "Emotion & tone", qs: ["What do you want the audience to feel at this moment?", "Is the call thrilling, terrifying, tragic, or tempting?", "How does the tone here signal the genre?", "What's the emotional whiplash between before and after?", "Where's the spark of hope inside the disruption?"] },
  { L: "I", name: "Craft & dramatization", qs: ["What's the visual image of the call?", "Is it delivered through action, dialogue, or event?", "What line could a character say to mark the turn?", "How do you make it inevitable yet surprising?", "What sensory detail makes it land (a sound, an object, a face)?", "How do you avoid it feeling contrived or convenient?"] },
  { L: "J", name: "Seeds & connection", qs: ["How does the call target the hero's specific flaw or need?", "What earlier detail pays off in this moment?", "How does the call carry the theme?", "What does it foreshadow about the ending?", "How does it set up the refusal that follows?"] },
];

const REFUSAL_GROUPS: Group[] = [
  { L: "A", name: "The nature of the refusal", qs: ["How does your hero resist the call at first?", "Is the refusal loud (open defiance) or quiet (avoidance)?", "Do they say no outright, or just fail to say yes?", "Is it one refusal or a series of hesitations?", "How long do they resist before circumstances force them?", "Is the refusal reasonable, cowardly, or both?"] },
  { L: "B", name: "The fear behind it", qs: ["What are they truly afraid of losing?", "What's the worst thing they imagine could happen?", "How does this fear connect to their core wound?", "Do they fear failure, or do they fear success?", "What comfort are they clinging to?", "What does the fear protect them from feeling?"] },
  { L: "C", name: "The excuses", qs: ["What practical reasons do they give for refusing?", "What responsibilities do they hide behind?", "Which excuse do they half-believe, and which is pure avoidance?", "Who or what do they blame for not being able to go?", "What would they never admit is the real reason?"] },
  { L: "D", name: "What holds them back", qs: ["What in the ordinary world are they reluctant to leave?", "Who would they be abandoning?", "What obligation feels like a chain?", "What have they invested that they'd have to walk away from?", "What identity would they have to give up to say yes?", "What's the safest, smallest version of their life they're protecting?"] },
  { L: "E", name: "The debate", qs: ["What's the argument for going vs. staying, in their head?", "What does the rational side say? The emotional side?", "Do they weigh it openly or bury it?", "What tips the internal scale, moment to moment?", "What do they tell themselves to justify hesitating?"] },
  { L: "F", name: "Others in the refusal", qs: ["Who pushes them to go?", "Who begs them to stay?", "Does anyone shame, dare, or guilt them?", "Does a mentor figure appear during the refusal?", "Whose opinion matters most to them here?"] },
  { L: "G", name: "The stakes of staying", qs: ["What happens if they refuse for good?", "What's the cost of the comfortable life they'd keep?", "What regret would haunt them?", "What would they lose that's worse than the risk of going?", "Why is staying no longer actually safe?"] },
  { L: "H", name: "The turning pressure", qs: ["What event or revelation makes refusing impossible?", "What's the “second push” that overrides the fear?", "What's taken away that removes the option to stay?", "What raises the stakes so high that inaction becomes unbearable?", "Does the hero choose, or is the choice forced on them?", "What final straw breaks their resistance?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel during the hesitation?", "How do you keep the refusal from stalling the pace?", "What image captures their reluctance?", "What line marks the moment of doubt?", "How do you make the audience root for them to say yes?", "What physical action shows the internal debate?"] },
  { L: "J", name: "The tipping point", qs: ["What's the exact moment they decide to go?", "Is it courage, desperation, love, or having no choice?", "How does saying yes reveal growth (or the start of it)?", "How does the refusal deepen our investment in the hero?", "How does it set up the cost of the point of no return?"] },
];

const MENTOR_GROUPS: Group[] = [
  { L: "A", name: "Who is the mentor", qs: ["Who guides your hero — and how do they meet?", "What makes this person qualified to teach the hero?", "Is the mentor a person, a group, a place, an object, or an idea?", "Are they a classic wise guide, a reluctant one, or a flawed one?", "What's their first impression on the hero (and on us)?", "What do they see in the hero that the hero can't see yet?"] },
  { L: "B", name: "What they give", qs: ["What tangible tool, weapon, or resource do they provide?", "What intangible gift — courage, a truth, a skill, permission?", "Is the gift given freely, earned, or stolen?", "Does the gift come with a warning or a cost?", "What will the hero misuse or misunderstand about it at first?", "When, later, will the gift pay off?"] },
  { L: "C", name: "The wisdom", qs: ["What's the one lesson the mentor most wants to impart?", "How does that lesson connect to the film's theme?", "What does the hero resist hearing?", "What advice will only make sense to the hero much later?", "What piece of wisdom is a lie or half-truth (if any)?"] },
  { L: "D", name: "The relationship", qs: ["What's the emotional bond between mentor and hero?", "Is it parental, adversarial, romantic, transactional?", "What does the hero give the mentor in return?", "Where do they clash?", "What does the mentor demand of the hero?", "How does the mentor challenge the hero's flaw?"] },
  { L: "E", name: "The mentor's own story", qs: ["What's the mentor's past — their own failed or completed journey?", "What regret or wound drives them to help?", "What did they lose that they hope the hero won't?", "Are they seeking redemption through the hero?", "What's their unfinished business?"] },
  { L: "F", name: "How they prepare the hero", qs: ["What training, test, or trial do they put the hero through?", "What weakness do they force the hero to face?", "How do they build the hero's confidence — or humble it?", "What do they refuse to do for the hero (so the hero must)?", "What do they reveal about the road ahead?"] },
  { L: "G", name: "Resistance & trust", qs: ["Does the hero trust the mentor immediately, or earn it?", "What makes the hero doubt them?", "Is there a betrayal, real or feared?", "What secret does the mentor keep?", "How is trust finally sealed?"] },
  { L: "H", name: "The gift's meaning", qs: ["What does the gift symbolize thematically?", "How does it represent the hero's potential?", "What must the hero become to be worthy of it?", "How will the gift be transformed by the hero's use of it?", "What happens if the hero loses the gift?"] },
  { L: "I", name: "The mentor's fate", qs: ["Does the mentor accompany the hero, or send them alone?", "Will the mentor die, leave, or be lost — and when?", "How does the mentor's absence force the hero to grow?", "What last words or lesson do they leave?", "How does the hero carry the mentor forward?", "Does the hero eventually surpass or fulfill the mentor?"] },
  { L: "J", name: "Craft & seeds", qs: ["What's the image of the mentor we'll remember?", "What line of theirs will echo later?", "How do you keep the mentor from feeling like a cliché?", "What flaw or humor makes them human?", "How does meeting the mentor push the hero toward the threshold?", "What does the mentor foreshadow about the final test?"] },
];

const PONR_GROUPS: Group[] = [
  { L: "A", name: "The commitment", qs: ["What action commits your hero to the journey, with no way back?", "Is it a choice they make, or a bridge that burns behind them?", "What's the exact moment “before” becomes impossible?", "Why is this decision irreversible?", "Does the hero commit willingly, or are they pushed past the point?", "What do they finally decide to pursue?", "How does this choice differ from who they were in the ordinary world?"] },
  { L: "B", name: "Crossing the threshold", qs: ["What literal or symbolic threshold do they cross (a door, a border, a plane)?", "What marks the boundary between the old world and the new?", "Who or what guards that threshold?", "What test must they pass to cross?", "What's the first thing they see on the other side?", "How does the world visibly change once they cross?"] },
  { L: "C", name: "What's left behind", qs: ["What or whom does the hero leave behind?", "What comfort or safety is now gone?", "What identity do they shed at the threshold?", "What do they sacrifice to cross?", "What will they miss?"] },
  { L: "D", name: "The new world", qs: ["What are the rules of the new world?", "How is it different from the ordinary world?", "What's exciting or wondrous about it?", "What's dangerous or disorienting about it?", "Who runs this world?", "Where does the hero fit (or not) in it?"] },
  { L: "E", name: "The choice", qs: ["What alternative could the hero have taken instead?", "What tips them toward going rather than staying?", "Is it courage, love, desperation, or duty?", "Do they fully understand what they're committing to?", "What lie or hope do they carry across with them?"] },
  { L: "F", name: "The cost", qs: ["What price do they pay to cross?", "Who pays a price alongside them?", "What's the immediate consequence of committing?", "What can never be undone now?", "What does the commitment reveal about their want vs. need?"] },
  { L: "G", name: "Stakes locked in", qs: ["What's now on the line that wasn't before?", "What's the new, sharper goal?", "What's the deadline or pressure driving them?", "How have the stakes escalated from the call?", "What makes retreat impossible?"] },
  { L: "H", name: "The guardian / first obstacle", qs: ["What first challenge tests them in the new world?", "Who opposes their entry?", "What early failure or fumble humbles them?", "What do they learn immediately about the road ahead?", "Who do they meet first on the other side?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel as they cross?", "What image captures the point of no return?", "What line marks the commitment?", "How do you make the leap feel both scary and thrilling?", "What physical action embodies “no going back”?", "How does pacing shift as we enter Act Two?"] },
  { L: "J", name: "Momentum forward", qs: ["How does crossing propel the story into the trials?", "What promise (of fun, danger, discovery) does this open?", "How does the new world reflect the hero's inner state?", "What thematic meaning does the crossing carry?", "What does it foreshadow about how they'll return, changed?"] },
];

const BEAT_FORMS: Record<string, Group[]> = {
  "the-ordinary-world": OW_GROUPS,
  "the-theme": THEME_GROUPS,
  "the-need": NEED_GROUPS,
  "the-call": CALL_GROUPS,
  "the-refusal": REFUSAL_GROUPS,
  "the-mentor": MENTOR_GROUPS,
  "the-point-of-no-return": PONR_GROUPS,
};

type Item = { kind: "group"; L: string; name: string } | { kind: "q"; text: string; qi: number };
function flattenItems(groups: Group[]): Item[] {
  const out: Item[] = []; let qi = 0;
  for (const g of groups) { out.push({ kind: "group", L: g.L, name: g.name }); for (const q of g.qs) { out.push({ kind: "q", text: q, qi }); qi++; } }
  return out;
}
const BEAT_ITEMS: Record<string, Item[]> = {};
const BEAT_FLAT: Record<string, string[]> = {};
const BEAT_TOTAL: Record<string, number> = {};
for (const [s, g] of Object.entries(BEAT_FORMS)) { BEAT_ITEMS[s] = flattenItems(g); BEAT_FLAT[s] = g.flatMap((x) => x.qs); BEAT_TOTAL[s] = BEAT_FLAT[s].length; }

const CHAR_COACH: string[] = [
  "What's their full name — and do they go by anything else (nickname, alias, title)?",
  "How old are they exactly, and how old do they feel inside?",
  "What's their nationality, and where specifically are they from (country, region, city, block)?",
  "What's their ethnic background, race, and cultural heritage?",
  "What's their religion or spiritual belief — devout, lapsed, atheist, searching?",
  "Do they speak with an accent or dialect? What does their voice actually sound like?",
  "What language(s) do they speak — and which do they think and dream in?",
  "What do they physically look like — height, build, distinguishing features?",
  "How do they dress, and what does that say about them?",
  "What's the first thing people notice about them?",
  "Who raised them, and what was their family like?",
  "Was their childhood happy, hard, chaotic, sheltered?",
  "What class did they grow up in — and what class are they now?",
  "What's their education or training — formal, street-smart, self-taught?",
  "What's the single event from their past that shaped them most?",
  "What's their relationship with their parents today?",
  "Do they have siblings, a spouse, kids? What are those bonds like?",
  "What place made them who they are?",
  "What did they want to be when they grew up — and did they become it?",
  "What's a secret from their past they've never told anyone?",
  "What is their greatest fear?",
  "What do they want more than anything (their conscious goal)?",
  "What do they actually need to learn or heal (their deeper need)?",
  "What's their core wound — the pain that still drives them?",
  "What lie do they believe about themselves or the world?",
  "What's their greatest flaw?",
  "What's their greatest strength?",
  "Do they see themselves accurately, or are they fooling themselves?",
  "What are they ashamed of?",
  "What are they most proud of?",
  "What would they never do, no matter what?",
  "What would they do that would shock everyone who knows them?",
  "Where's the moral line they won't cross?",
  "What do they do when no one is watching?",
  "How do they talk — fast, slow, blunt, careful, funny, formal?",
  "What's a word or phrase they always use?",
  "What's a nervous habit or physical tic?",
  "What makes them laugh? What makes them cry?",
  "What's their relationship with money, food, drink, or vice?",
  "What do they do to relax or escape?",
  "What's one small, specific detail that makes them feel real?",
  "Who do they love, and who loves them back?",
  "Who's their enemy or rival, and why?",
  "Who do they pretend to be in public vs. who they really are?",
  "How do strangers treat them — and how does that make them feel?",
  "Who would they call at 3 a.m. in a crisis?",
  "What's a contradiction inside them (tough but tender, generous but selfish)?",
  "What's something they believe that they also secretly doubt?",
  "If they got everything they wanted, would they actually be happy — why or why not?",
  "In one line: what makes them worth following for two hours — why them?",
];
const COACH_SETS: Record<string, string[]> = { "the-ordinary-world:0": CHAR_COACH };

export default function BeatsBuilder(_props: { structureKey: string }) {
  const [sel, setSel] = useState<FwKey[]>([]);
  const [openIdx, setOpenIdx] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({});
  const [coach, setCoach] = useState<Record<string, Record<number, Record<number, string>>>>({});
  const [active, setActive] = useState<{ slug: string; qi: number } | null>(null);
  const [weaving, setWeaving] = useState(false);
  const [coachErr, setCoachErr] = useState("");

  useEffect(() => {
    try { const f = localStorage.getItem("mib-frameworks"); if (f) setSel(JSON.parse(f)); } catch { /* ignore */ }
    try { const a = localStorage.getItem("mib-beats"); if (a) setAnswers(JSON.parse(a)); } catch { /* ignore */ }
    try { const c = localStorage.getItem("mib-beats-coach"); if (c) setCoach(JSON.parse(c)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("mib-beats", JSON.stringify(answers)); } catch { /* ignore */ } }, [answers]);
  useEffect(() => { try { localStorage.setItem("mib-beats-coach", JSON.stringify(coach)); } catch { /* ignore */ } }, [coach]);

  const fws = sel.length ? sel : (["p", "g", "r", "t"] as FwKey[]);
  const visible = M.filter((b) => fws.some((k) => b.fw[k]));

  const setMain = (slug: string, qi: number, val: string) => setAnswers((a) => ({ ...a, [slug]: { ...(a[slug] || {}), [qi]: val } }));
  const setCoachAns = (slug: string, qi: number, ci: number, val: string) => setCoach((c) => ({ ...c, [slug]: { ...(c[slug] || {}), [qi]: { ...((c[slug] || {})[qi] || {}), [ci]: val } } }));

  const openCoach = (slug: string, qi: number) => {
    setActive({ slug, qi }); setCoachErr("");
    if (typeof window !== "undefined" && window.innerWidth < 1024) setTimeout(() => document.getElementById("mib-coach")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const weave = async () => {
    if (!active || weaving) return;
    const set = COACH_SETS[`${active.slug}:${active.qi}`];
    if (!set) return;
    setCoachErr(""); setWeaving(true);
    try {
      const cAns = (coach[active.slug] || {})[active.qi] || {};
      const items = set.map((q, ci) => ({ q, a: cAns[ci] || "" }));
      const { data, error } = await supabase.functions.invoke("movie-brain", { body: { mainQuestion: (BEAT_FLAT[active.slug] || [])[active.qi] || "", items } });
      if (error) throw error;
      const p = data as { text?: string; error?: string } | null;
      if (p?.error) throw new Error(p.error);
      if (p?.text) setMain(active.slug, active.qi, p.text);
      else throw new Error("No text returned");
    } catch (e) {
      setCoachErr(e instanceof Error ? e.message : "Weave failed");
    } finally { setWeaving(false); }
  };

  const activeSet = active ? COACH_SETS[`${active.slug}:${active.qi}`] : undefined;
  const activeCoachAns = active ? ((coach[active.slug] || {})[active.qi] || {}) : {};

  return (
    <section className="bg-background px-4 py-10 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Your movie · beats</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">The Beats</h1>
        <p className="text-[13.5px] text-foreground/55 mt-2 max-w-[640px]">Open a beat and answer its questions. Stuck on one? Hit ✨ and the AI Coach on the right walks you through it — your coaching answers weave back into your main answer.</p>

        <div className="mt-6 lg:flex lg:gap-6 lg:items-start">
          <div className="lg:flex-1 min-w-0 flex flex-col gap-2.5">
            {visible.map((b, i) => {
              const isOpen = openIdx === i;
              const chips = fws.filter((k) => b.fw[k]);
              const built = !!BEAT_FORMS[b.slug];
              const items = BEAT_ITEMS[b.slug] || [];
              const total = BEAT_TOTAL[b.slug] || 0;
              const mainAns = answers[b.slug] || {};
              const filled = Object.values(mainAns).filter((v) => v && v.trim()).length;
              return (
                <div key={b.slug} className="rounded-xl border bg-white/[0.02] overflow-hidden" style={{ borderColor: isOpen ? GOLD : "#2c323b" }}>
                  <button onClick={() => { setOpenIdx(isOpen ? -1 : i); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                    <span className="w-6 h-6 rounded-md bg-[#0c0e13] border border-white/10 flex items-center justify-center text-[11px] font-extrabold text-foreground/55 flex-shrink-0">{i + 1}</span>
                    <span className="text-[15px] font-extrabold text-foreground">{b.t}</span>
                    <span className="flex gap-1.5 flex-wrap">
                      {chips.map((k) => <span key={k} className="text-[9px] font-bold rounded-full px-2 py-[2px]" style={{ color: FWC[k], background: `${FWC[k]}1f`, border: `1px solid ${FWC[k]}55` }}>{b.fw[k]}</span>)}
                    </span>
                    <span className="ml-auto flex items-center gap-3 flex-shrink-0">
                      {built && <span className="text-[11px] text-foreground/40">{filled}/{total}</span>}
                      <span className="text-[12px] text-foreground/50 inline-block" style={{ transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
                    </span>
                  </button>
                  {isOpen && (built ? (
                    <div className="border-t border-white/10 px-4 pb-4">
                      {items.map((it) => it.kind === "group" ? (
                        <div key={"g" + it.L} className="mt-5 mb-1 flex items-center gap-2.5">
                          <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[12px] font-extrabold" style={{ background: "#f0d089", color: "#1a1300" }}>{it.L}</span>
                          <span className="text-[13px] font-extrabold" style={{ color: "#f0d089" }}>{it.name}</span>
                          <span className="flex-1 h-px bg-white/10" />
                        </div>
                      ) : (
                        <div key={"q" + it.qi} className="flex gap-3 py-2.5 border-b border-white/[0.045] rounded-lg" style={active && active.slug === b.slug && active.qi === it.qi ? { background: "rgba(212,160,23,0.06)" } : {}}>
                          <span className="w-6 text-right text-[11px] font-extrabold text-foreground/35 pt-1">{it.qi + 1}</span>
                          <div className="flex-1">
                            <label className="block text-[13px] font-semibold text-foreground mb-1.5">{it.text}</label>
                            <textarea value={mainAns[it.qi] || ""} onChange={(e) => setMain(b.slug, it.qi, e.target.value)} placeholder="Type your answer…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-2 text-[12.5px] resize-y" style={{ minHeight: 36, fontFamily: "inherit" }} />
                            {COACH_SETS[`${b.slug}:${it.qi}`] && <button onClick={() => openCoach(b.slug, it.qi)} className="mt-1.5 text-[10.5px] font-bold rounded-md px-2.5 py-1" style={{ color: "#f0d089", background: "#1a1710", border: `1px solid ${GOLD}66` }}>✨ Coach me on this →</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-[12.5px] text-foreground/40 italic border-t border-white/10">This beat opens into the same kind of question template as The Ordinary World — tailored to “{b.t}.” We'll build it next.</div>
                  ))}
                </div>
              );
            })}
          </div>

          <aside id="mib-coach" className="mt-5 lg:mt-0 lg:w-[380px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-[92px] rounded-xl border border-white/12 bg-[#12141a] overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 110px)" }}>
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2" style={{ background: "linear-gradient(180deg,#1a1710,#12141a)" }}>
                <span className="text-[14px] font-extrabold" style={{ color: "#f0d089" }}>🧠 AI Coach</span>
                {active && <button onClick={() => setActive(null)} className="ml-auto text-foreground/40 hover:text-foreground text-[13px]">✕</button>}
              </div>
              {!active ? (
                <div className="p-5 text-[12.5px] text-foreground/45 leading-relaxed">Open a beat and hit <span style={{ color: "#f0d089" }} className="font-bold">✨ Coach me on this</span> next to any question. I'll ask you deeper questions here — and weave your answers back into your main answer.</div>
              ) : (
                <div className="flex flex-col min-h-0">
                  <div className="px-4 pt-3 pb-2 border-b border-white/8">
                    <div className="text-[10px] uppercase tracking-wide text-foreground/40 font-bold">Coaching</div>
                    <div className="text-[13px] font-bold text-foreground mt-0.5">{(BEAT_FLAT[active.slug] || [])[active.qi]}</div>
                  </div>
                  {activeSet ? (
                    <>
                      <div className="overflow-y-auto px-4 py-3" style={{ flex: "1 1 auto" }}>
                        <div className="text-[11.5px] text-foreground/50 mb-2">Answer any of these — the more, the richer. They weave into your answer.</div>
                        {activeSet.map((q, ci) => (
                          <div key={ci} className="mb-3">
                            <label className="block text-[12px] text-foreground/85 mb-1"><span className="text-foreground/35 font-bold mr-1">{ci + 1}.</span>{q}</label>
                            <textarea value={activeCoachAns[ci] || ""} onChange={(e) => setCoachAns(active.slug, active.qi, ci, e.target.value)} placeholder="…" className="w-full bg-[#0f1116] text-foreground border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] resize-y" style={{ minHeight: 30, fontFamily: "inherit" }} />
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-white/10">
                        {coachErr && <div className="mb-2 text-[11px]" style={{ color: "#ff9a9a" }}>{coachErr}</div>}
                        <button onClick={weave} disabled={weaving} className="w-full text-[12.5px] font-extrabold rounded-lg py-2.5 disabled:opacity-50" style={{ background: GOLD, color: "#1a1300" }}>{weaving ? "✨ Weaving…" : "✨ Weave into my answer"}</button>
                        <div className="text-[10px] text-foreground/35 mt-1.5 text-center">The AI writes a polished answer into the left box using only what you gave it.</div>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-[12.5px] text-foreground/45 italic">Deeper coaching questions for this one are coming next — for now, answer it directly on the left.</div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
