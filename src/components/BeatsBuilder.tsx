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

const BOND_GROUPS: Group[] = [
  { L: "A", name: "Who is the bond", qs: ["Which relationship carries the emotional heart of your film?", "Who is that person (love interest, ally, rival, mentor, child, friend)?", "How and when do they enter the hero's life?", "What's the first spark or connection between them?", "Why this person, and not anyone else?", "What do they represent to the hero?"] },
  { L: "B", name: "The relationship's nature", qs: ["Is it romance, friendship, family, rivalry-turned-respect?", "What draws them together?", "What keeps them apart?", "What does each want from the other?", "What's the power balance between them?", "How do they change in each other's presence?"] },
  { L: "C", name: "Theme through the bond", qs: ["How does this relationship embody the film's theme?", "What truth does the bond teach the hero that the main plot can't?", "Does the bond model the “right way” the hero must learn?", "How does the B-story argue the theme alongside the A-story?", "What does the hero learn from this person that saves them later?"] },
  { L: "D", name: "Contrast & complement", qs: ["How is the bond's worldview different from the hero's?", "What does this person have that the hero lacks?", "What does the hero have that this person needs?", "How do they complete or challenge each other?", "Where do their values clash?", "How does the bond expose the hero's flaw?"] },
  { L: "E", name: "How it grows", qs: ["What moments deepen the bond across the story?", "What shared experience cements it?", "What vulnerability does the hero show only to this person?", "What secret do they share?", "How does trust build (or break) between them?"] },
  { L: "F", name: "Conflict within it", qs: ["What misunderstanding or betrayal strains the bond?", "What does the hero risk losing in this relationship?", "How does the hero's flaw damage the bond?", "Is there a breakup, falling-out, or separation?", "What's the lowest point for this relationship?"] },
  { L: "G", name: "What it teaches the hero", qs: ["What lesson does the bond force the hero to confront?", "How does this person see through the hero's mask?", "What do they demand the hero become?", "What do they forgive in the hero?", "What sacrifice does the bond inspire?", "How does the relationship push the hero toward their need?"] },
  { L: "H", name: "Stakes of the bond", qs: ["What happens to this person if the hero fails?", "Would the hero trade the mission for this relationship?", "What's the cost of choosing the bond over the goal (or vice versa)?", "How does the bond raise the emotional stakes of the plot?", "Who threatens this relationship?"] },
  { L: "I", name: "The bond under pressure", qs: ["How does the bond behave at the darkest moment?", "Does this person save the hero, or need saving?", "What does the hero do for them that proves growth?", "Is the bond reconciled, lost, or transformed by the end?", "What final moment defines the relationship?"] },
  { L: "J", name: "Craft & payoff", qs: ["What image captures this relationship?", "What recurring detail or callback tracks it?", "What line between them will the audience remember?", "How do you keep it from feeling like a subplot tacked on?", "How does the bond's resolution pay off the theme?", "How does this relationship change the hero's final choice?"] },
];

const TRIALS_GROUPS: Group[] = [
  { L: "A", name: "The promise of the premise", qs: ["What's the “fun” the audience came to see, delivered here?", "What set-pieces show off your movie's core concept?", "What does the poster or trailer promise that this section pays off?", "What's the most entertaining scene of the whole film — is it here?", "How does the hero explore the new world's possibilities?", "What makes this section a joy (or a thrill, or a terror) to watch?"] },
  { L: "B", name: "Tests & challenges", qs: ["What series of obstacles does the hero face?", "What's the first test, and how do they handle it?", "Which tests do they pass, and which do they fail?", "What does each test teach them?", "How do the tests escalate in difficulty?", "What test reveals their true weakness?"] },
  { L: "C", name: "Allies", qs: ["Who joins the hero's team, and how?", "What does each ally bring (skill, humor, heart, muscle)?", "Who's the most loyal, and who's unreliable?", "How does the hero earn their allies' trust?", "What does an ally teach or sacrifice?"] },
  { L: "D", name: "Enemies", qs: ["Who opposes the hero in the new world?", "Are the enemies minions, rivals, or the antagonist's agents?", "What's the first real clash with the opposition?", "How does the enemy test the hero's resolve?", "What does the hero underestimate about their enemies?"] },
  { L: "E", name: "Learning the new world", qs: ["What rules must the hero learn to survive here?", "What surprises or overwhelms them?", "What advantage do they discover they have?", "What tool or ally becomes essential?", "How does the world push back against them?", "What do they misread about how this world works?"] },
  { L: "F", name: "Skill & growth", qs: ["What new skill or strength does the hero develop?", "How do they get better at the thing they came to do?", "What confidence do they gain (that may be false)?", "What old habit still trips them up?", "What small victory feels like progress?"] },
  { L: "G", name: "Fun & tone", qs: ["What's the tone here — playful, tense, wondrous, escalating dread?", "Where's the humor or levity?", "What moment makes the audience fall in love with the hero?", "What “save the cat” act makes us root for them?", "How does the genre flavor these scenes?"] },
  { L: "H", name: "Escalation", qs: ["How do the stakes rise across the trials?", "What complication makes things harder than expected?", "What does the hero lose along the way?", "What pushes them toward the midpoint?", "What false sense of control builds before the turn?"] },
  { L: "I", name: "The hero's flaw at work", qs: ["How does the hero's flaw sabotage them during the trials?", "Where does their old wound resurface?", "What relationship strains under pressure?", "What shortcut or mistake do they make?", "What do the trials reveal that the hero still needs to learn?", "How does the want-vs-need tension show up here?"] },
  { L: "J", name: "Craft & momentum", qs: ["What are the 2–3 signature scenes of this section?", "What image defines the trials?", "What line captures the hero mid-adventure?", "How do you keep this section from sagging (the “muddy middle”)?", "How does each scene end with momentum into the next?", "How do the trials set up the midpoint turn?"] },
];

const MIDPOINT_GROUPS: Group[] = [
  { L: "A", name: "The turn itself", qs: ["What happens at the exact middle that changes everything?", "Is it a false victory (looks great, then sours) or a false defeat (looks lost, then a path opens)?", "What does the hero achieve or lose here?", "Why is this the pivot point of the whole film?", "What truth is revealed at the midpoint?", "How does the story flip direction here?", "What can never go back to how it was before the midpoint?"] },
  { L: "B", name: "False win / false loss", qs: ["If it's a win, why is it hollow or temporary?", "If it's a loss, what hope survives inside it?", "What does the hero mistakenly believe they've accomplished?", "What's the sting hidden inside the apparent success?", "What's the gift hidden inside the apparent failure?", "How does the audience know it's not really over?"] },
  { L: "C", name: "Raising the stakes", qs: ["How do the stakes double at the midpoint?", "What new threat or deadline emerges?", "What does the hero now stand to lose that they didn't before?", "How does the antagonist escalate?", "What makes the second half harder than the first?"] },
  { L: "D", name: "The mirror moment", qs: ["What forces the hero to look at themselves honestly?", "What truth about their flaw do they glimpse (even if they reject it)?", "What question do they silently ask (“Who am I? What must I do?”)?", "How does the midpoint confront the hero with their need?", "What do they realize they've been getting wrong?"] },
  { L: "E", name: "Shift in the hero", qs: ["Does the hero move from reactive to proactive (or the reverse)?", "What new resolve or plan do they form?", "How does their goal sharpen or change?", "What do they commit to that they wouldn't have before?", "What mask do they drop, or put on?", "How are they different walking out of the midpoint than walking in?"] },
  { L: "F", name: "New information", qs: ["What secret or twist is revealed here?", "What does the hero learn about the enemy?", "What does the hero learn about an ally?", "What does the audience learn that the hero doesn't (or vice versa)?", "How does the new information reframe everything before it?"] },
  { L: "G", name: "The want / need pivot", qs: ["Does the hero get closer to the want but further from the need (or vice versa)?", "What temptation appears at the midpoint?", "What's the first real hint they may have to choose want vs. need?", "How does the midpoint test their values?", "What would the “old” hero do vs. the “changing” hero?"] },
  { L: "H", name: "Relationships at the midpoint", qs: ["How does the bond / B-story turn here?", "Who is revealed as friend or foe?", "What alliance forms or breaks?", "How does a key relationship raise the stakes?", "What promise or betrayal happens?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel at the midpoint?", "What's the signature midpoint image or set-piece?", "What line marks the turn?", "How do you make the midpoint a genuine surprise?", "How does tone shift into the darker second half?", "What's the “point of no return” quality of this beat?"] },
  { L: "J", name: "Propulsion forward", qs: ["How does the midpoint launch the “walls close in” descent?", "What clock starts ticking louder now?", "What does the hero chase in the second half?", "How does the midpoint plant the seed of the lowest point?", "What thematic meaning does the turn carry?"] },
];

const WALLS_GROUPS: Group[] = [
  { L: "A", name: "The mounting pressure", qs: ["How does the pressure tighten around your hero after the midpoint?", "What's going wrong that wasn't before?", "What deadline or threat is closing in?", "How does each scene raise the tension a notch?", "What safety nets are being removed one by one?", "What's the sense of the walls literally or figuratively closing?", "Why does everything feel harder now?"] },
  { L: "B", name: "The antagonist gains", qs: ["How does the enemy gain the upper hand?", "What move does the antagonist make that the hero can't counter?", "What resource or ally does the enemy take from the hero?", "How does the villain exploit the hero's flaw?", "What does the antagonist reveal about their plan?", "Why does the enemy seem to be winning?"] },
  { L: "C", name: "The team fractures", qs: ["How does the hero's alliance start to crack?", "Who doubts the hero's plan or leadership?", "What argument or betrayal splits the team?", "Who leaves, is captured, or is lost?", "How does isolation begin to set in?"] },
  { L: "D", name: "Internal decay", qs: ["How does the hero's old flaw resurface under pressure?", "What bad habit or fear takes over?", "What mistake does the hero make out of desperation?", "How does the hero's confidence erode?", "What relationship does the hero damage here?", "How does the hero's want blind them to their need?"] },
  { L: "E", name: "The approach", qs: ["What is the “inmost cave” — the most dangerous place or confrontation ahead?", "How does the hero prepare (or fail to) for the biggest test?", "What's the plan going in, and what could go wrong?", "What does the hero fear most about what's coming?", "What's the point of no return before the ordeal?"] },
  { L: "F", name: "Loss & attrition", qs: ["What does the hero lose on the way in?", "What sacrifice is demanded to get closer?", "Who gets hurt as they approach?", "What tool or advantage fails at the worst time?", "What hope dims here?"] },
  { L: "G", name: "The hero's doubt", qs: ["What makes the hero question whether they can win?", "What temptation to quit or turn back appears?", "Whose faith in the hero wavers?", "What lie does the hero start to believe again?", "How does the hero try (and fail) to hold it together?"] },
  { L: "H", name: "The narrowing path", qs: ["How do the hero's options shrink?", "What choice becomes unavoidable?", "What door closes behind them?", "What makes retreat impossible now?", "How does the noose tighten toward the low point?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel as the walls close?", "What image captures the mounting dread?", "What line signals the danger?", "How do you build suspense without stalling?", "How does the tone darken?", "What quiet moment before the storm hits hardest?"] },
  { L: "J", name: "Toward the abyss", qs: ["How does this beat deliver the hero to the lowest point?", "What final thread of hope is about to snap?", "What does the hero walk into, unaware?", "How does the thematic argument look like it's losing?", "What sets up the “all is lost” moment?"] },
];

const LOWEST_GROUPS: Group[] = [
  { L: "A", name: "The all-is-lost moment", qs: ["What is the lowest point your hero reaches?", "What does the hero lose completely here?", "What makes this the darkest moment of the story?", "How does everything the hero built collapse?", "Why does it feel like the end?", "What's the emotional bottom your hero hits?"] },
  { L: "B", name: "Death & its echo", qs: ["What dies here — literally, or a dream, relationship, or version of the self?", "How does a whiff of death hang over this moment?", "Who or what does the hero mourn?", "How does the loss connect to the story's theme?", "What does the hero fear is gone forever?"] },
  { L: "C", name: "Defeat by the antagonist", qs: ["How does the antagonist win this round decisively?", "What does the enemy take or destroy?", "How does the villain's plan seem unstoppable now?", "What does the hero's defeat cost the wider world?", "Why does the hero seem powerless to respond?"] },
  { L: "D", name: "Isolation & abandonment", qs: ["How is the hero alone at the lowest point?", "Who has left, betrayed, or died?", "What support system is gone?", "How does the hero push away the people who remain?", "What makes the loneliness total?"] },
  { L: "E", name: "The wound reopened", qs: ["How does the hero's original wound resurface here?", "What old pain does this moment echo?", "How does the hero's flaw finally catch up with them?", "What lie about themselves does the hero fully believe now?", "How does the past come back to haunt them?", "What shame does the hero confront?"] },
  { L: "F", name: "Rock-bottom behavior", qs: ["How does the hero behave at their worst?", "What destructive choice does despair drive?", "What does the hero do that they'll regret?", "How does the hero give up?", "What line does the hero cross, or nearly cross?"] },
  { L: "G", name: "The spark in the dark", qs: ["What tiny ember of hope survives?", "What does the hero still have, even now?", "Who or what refuses to let the hero quit?", "What memory, object, or word keeps a flicker alive?", "How does the theme whisper back here?", "What plants the seed of the comeback?"] },
  { L: "H", name: "Reckoning with the need", qs: ["How does the hero finally see their true need?", "What truth can no longer be avoided?", "What must the hero accept to move forward?", "How does the want die so the need can live?", "What realization begins to form in the ashes?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel at rock bottom?", "What image captures the lowest point?", "What line lands hardest here?", "How long do you let the audience sit in the dark?", "How do you avoid melodrama while going deep?", "What silence or stillness carries the weight?"] },
  { L: "J", name: "Toward the turn", qs: ["How does this moment set up the hero's rise?", "What has to break before the hero can change?", "What question does the lowest point leave hanging?", "How does hitting bottom become the pivot?", "What does the hero need to do next to climb out?", "How does the darkness make the coming light matter?"] },
];

const DARKNIGHT_GROUPS: Group[] = [
  { L: "A", name: "The soul in darkness", qs: ["What is your hero's dark night of the soul?", "How is this an inner low, distinct from the external lowest point?", "What does the hero grapple with in the quiet after the crash?", "What does the hero feel they've lost about themselves?", "How deep does the despair go?", "What does the hero believe is no longer possible?"] },
  { L: "B", name: "Grief & processing", qs: ["How does the hero mourn what was lost?", "What stages of grief does the hero move through here?", "What does the hero need to feel before they can act?", "How does the hero sit with the pain rather than flee it?", "What emotion finally breaks the surface?"] },
  { L: "C", name: "The reckoning", qs: ["What hard truth does the hero face about themselves?", "How does the hero own their part in the failure?", "What excuse or illusion does the hero finally drop?", "What does the hero admit they got wrong?", "How does the hero confront their deepest fear?", "What does the hero forgive — in themselves or others?"] },
  { L: "D", name: "The old self dies", qs: ["What version of the hero has to die here?", "What belief does the hero let go of?", "What identity no longer fits?", "How does the hero release the want that was holding them back?", "What does the hero surrender?"] },
  { L: "E", name: "The whisper of the mentor", qs: ["How does the mentor's lesson return to the hero now?", "What words, memory, or gift resurfaces to guide them?", "How does the theme speak to the hero in the dark?", "Who reaches the hero when they're lowest?", "What truth finally lands that the hero once rejected?"] },
  { L: "F", name: "The choice to rise", qs: ["What makes the hero decide to keep going?", "What is worth fighting for, even now?", "How does the hero choose the need over the want?", "What flips despair into resolve?", "What does the hero find inside that they didn't know was there?", "How does the hero say yes to the fight again?"] },
  { L: "G", name: "Gathering the pieces", qs: ["What does the hero gather to prepare for the final push?", "How does the hero make amends before moving on?", "Who does the hero reconnect with?", "What resource, plan, or ally comes back?", "How does the hero rebuild enough to stand?"] },
  { L: "H", name: "The transformed hero", qs: ["How is the hero different coming out of the dark night?", "What new strength or clarity emerges?", "How does the hero now embody the theme?", "What can the hero do now that they couldn't before?", "What fear no longer controls them?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel in this turning?", "What image captures the hero's rebirth?", "What line marks the decision to rise?", "How do you earn the turn so it doesn't feel cheap?", "How do you pace the shift from despair to resolve?", "What quiet beat makes the change believable?"] },
  { L: "J", name: "Toward the climax", qs: ["How does the dark night launch the hero toward the final test?", "What is the hero now ready to do?", "What plan forms out of the darkness?", "What's at stake in the battle ahead?", "How does the transformed hero change the odds?", "What promise does this beat make about the ending?"] },
];

const TURNEND_GROUPS: Group[] = [
  { L: "A", name: "The pivot to the finale", qs: ["What launches your hero into the final stretch?", "How does the story turn decisively toward its ending?", "What decision or event kicks off the endgame?", "How does the hero commit fully to the final path?", "What signals that there's no turning back now?", "How does the pace accelerate here?"] },
  { L: "B", name: "The new plan", qs: ["What is the hero's plan for the final confrontation?", "How is this plan different from what failed before?", "What has the hero learned that shapes the new approach?", "What role does each ally play in the plan?", "What could still go wrong with it?", "How does the plan reflect the hero's transformation?"] },
  { L: "C", name: "Rallying the team", qs: ["How does the hero gather their allies for the end?", "Who rejoins the fight, and why?", "How does the hero inspire or lead now?", "What broken bond gets repaired here?", "How does the team unite around a shared goal?"] },
  { L: "D", name: "Storming the castle", qs: ["How does the hero move toward the antagonist's stronghold?", "What obstacles stand between the hero and the final battle?", "What's the point of entry into the climax?", "How does the hero break through defenses?", "What early win or setback happens on the way in?"] },
  { L: "E", name: "Raising the stakes", qs: ["How do the stakes reach their peak here?", "What does the hero stand to lose in the finale?", "What does the wider world stand to lose?", "How does the antagonist raise the threat?", "What deadline or ticking clock intensifies?", "Why does everything come down to this?"] },
  { L: "F", name: "The hero's resolve", qs: ["How does the transformed hero show up differently now?", "What fear has the hero conquered to get here?", "What does the hero draw on for strength?", "How does the hero embody the theme in action?", "What does the hero refuse to give up on?"] },
  { L: "G", name: "Setbacks on approach", qs: ["What last obstacle nearly stops the hero?", "What sacrifice does the approach demand?", "Who or what is lost on the way to the climax?", "What twist complicates the plan?", "How does the hero adapt when things go sideways?"] },
  { L: "H", name: "The gathering forces", qs: ["How do all the threads converge toward the climax?", "What setups from earlier pay off now?", "How does the antagonist prepare for the hero's arrival?", "What secret or reveal changes the board?", "How does the story tighten toward the final clash?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel as the end nears?", "What image captures the charge to the finale?", "What line signals the final push?", "How do you build momentum without losing clarity?", "How do you make the audience believe the hero can win?", "What quiet beat precedes the storm of the climax?"] },
  { L: "J", name: "Into the climax", qs: ["How does this beat hand the hero to the final test?", "What is the hero walking into?", "What's the last thing the hero does before the battle?", "What question will the climax answer?", "How does the theme reach its decisive test?", "What makes the audience lean in for the finale?"] },
];

const FINALTEST_GROUPS: Group[] = [
  { L: "A", name: "The confrontation", qs: ["What is the final showdown your hero faces?", "Who or what does the hero confront at the climax?", "Where does the final battle take place?", "What form does the ultimate test take?", "How does the conflict reach its peak here?", "What makes this the hardest thing the hero has ever done?"] },
  { L: "B", name: "The stakes at their highest", qs: ["What does the hero win or lose in this moment?", "What is on the line for everyone the hero cares about?", "What happens if the hero fails?", "Why can't the hero walk away?", "How does the outcome define everything that came before?"] },
  { L: "C", name: "The antagonist's peak", qs: ["How does the antagonist reach full power here?", "What is the villain's final move?", "How does the antagonist exploit the hero's remaining weakness?", "What makes the enemy nearly unbeatable?", "How does the antagonist embody the theme's opposite?", "What does the villain believe they've already won?"] },
  { L: "D", name: "The darkest turn", qs: ["What moment makes it look like the hero will lose?", "What goes wrong at the worst possible time?", "What does the hero sacrifice in the fight?", "Who is hurt or lost at the climax?", "How low does the hero fall before the final rise?"] },
  { L: "E", name: "The hero's true self", qs: ["How does the hero draw on their transformation to win?", "What lesson from the journey does the hero finally use?", "How does the hero's need — not their want — carry the day?", "What proves the hero has truly changed?", "What does the hero do now that they could never have done at the start?", "How does the theme win through the hero's action?"] },
  { L: "F", name: "The decisive move", qs: ["What is the hero's winning choice or action?", "How does the hero turn the tables?", "What clever, brave, or selfless act clinches it?", "How does an earlier setup pay off decisively?", "What surprises the audience yet feels inevitable?"] },
  { L: "G", name: "The cost of victory", qs: ["What price does the hero pay to win?", "What does the hero give up in the final test?", "Who or what is not saved?", "How is the victory bittersweet?", "What scar does the hero carry out of the climax?"] },
  { L: "H", name: "Resolution of the antagonist", qs: ["How is the antagonist defeated, converted, or reckoned with?", "What becomes of the villain?", "How does the antagonist's defeat prove the theme?", "Does the hero show mercy, justice, or something else?", "What final truth does the confrontation reveal?"] },
  { L: "I", name: "Emotion & craft", qs: ["What do you want the audience to feel at the climax?", "What image captures the peak of the story?", "What line lands as the decisive blow?", "How do you pace the climax for maximum tension?", "How do you make the victory feel earned?", "What single moment do you want people to remember?"] },
  { L: "J", name: "Toward resolution", qs: ["How does the climax release the built-up tension?", "What changes in the world the instant the hero wins?", "What question does the final test finally answer?", "How does the hero emerge different from this fight?", "What does the victory make possible?", "How does this beat hand off to the ending?"] },
];

const BEAT_FORMS: Record<string, Group[]> = {
  "the-ordinary-world": OW_GROUPS,
  "the-theme": THEME_GROUPS,
  "the-need": NEED_GROUPS,
  "the-call": CALL_GROUPS,
  "the-refusal": REFUSAL_GROUPS,
  "the-mentor": MENTOR_GROUPS,
  "the-point-of-no-return": PONR_GROUPS,
  "the-bond": BOND_GROUPS,
  "the-trials": TRIALS_GROUPS,
  "the-midpoint-turn": MIDPOINT_GROUPS,
  "the-walls-close-in": WALLS_GROUPS,
  "the-lowest-point": LOWEST_GROUPS,
  "the-dark-night": DARKNIGHT_GROUPS,
  "the-turn-to-the-end": TURNEND_GROUPS,
  "the-final-test": FINALTEST_GROUPS,
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
