export interface VoiceOption {
  id: string;
  label: string;
  gender: "female" | "male";
  accent: "American" | "British";
}

export const VOICES: VoiceOption[] = [
  // American Female
  { id: "af_heart", label: "Heart (US Female)", gender: "female", accent: "American" },
  { id: "af_bella", label: "Bella (US Female)", gender: "female", accent: "American" },
  { id: "af_nicole", label: "Nicole (US Female)", gender: "female", accent: "American" },
  { id: "af_sarah", label: "Sarah (US Female)", gender: "female", accent: "American" },
  { id: "af_sky", label: "Sky (US Female)", gender: "female", accent: "American" },
  // American Male
  { id: "am_adam", label: "Adam (US Male)", gender: "male", accent: "American" },
  { id: "am_michael", label: "Michael (US Male)", gender: "male", accent: "American" },
  { id: "am_fenrir", label: "Fenrir (US Male)", gender: "male", accent: "American" },
  { id: "am_liam", label: "Liam (US Male)", gender: "male", accent: "American" },
  // British Female
  { id: "bf_emma", label: "Emma (UK Female)", gender: "female", accent: "British" },
  { id: "bf_isabella", label: "Isabella (UK Female)", gender: "female", accent: "British" },
  { id: "bf_alice", label: "Alice (UK Female)", gender: "female", accent: "British" },
  // British Male
  { id: "bm_george", label: "George (UK Male)", gender: "male", accent: "British" },
  { id: "bm_lewis", label: "Lewis (UK Male)", gender: "male", accent: "British" },
  { id: "bm_daniel", label: "Daniel (UK Male)", gender: "male", accent: "British" },
];

const FEMALE_NAME_HINTS = [
  "MARY","SARAH","JANE","ANNA","ANNE","EMMA","LISA","KATE","JEN","JULIA",
  "RACHEL","LUCY","CLAIRE","SOPHIE","OLIVIA","NICOLE","ALICE","BELLA",
  "ROSE","GRACE","ELLA","CHLOE","MIA","AVA","ZOE","ELIZA","HELEN","LAURA",
  "MOM","MOTHER","DAUGHTER","SISTER","WOMAN","GIRL","WIFE","QUEEN","MS","MRS","MISS",
];
const MALE_NAME_HINTS = [
  "JOHN","JAMES","DAVID","MIKE","MICHAEL","TOM","BOB","BILL","JIM","STEVE",
  "PAUL","MARK","CHRIS","DAN","DANIEL","ADAM","LIAM","GEORGE","LEWIS",
  "DAD","FATHER","SON","BROTHER","MAN","BOY","HUSBAND","KING","MR","SHERIFF",
  "DETECTIVE","OFFICER","DOCTOR","CAPTAIN","SIR","FRANK","JACK","HARRY",
];

// Round-robin assignment indexes
let femaleIdx = 0;
let maleIdx = 0;

export function suggestVoice(characterName: string): string {
  const upper = characterName.toUpperCase();
  const tokens = upper.split(/[\s\-_'.]+/).filter(Boolean);

  let isFemale = tokens.some((t) => FEMALE_NAME_HINTS.includes(t));
  let isMale = tokens.some((t) => MALE_NAME_HINTS.includes(t));

  if (!isFemale && !isMale) {
    // Default to alternating to keep variety
    isFemale = (femaleIdx + maleIdx) % 2 === 0;
    isMale = !isFemale;
  }

  const pool = VOICES.filter((v) =>
    isFemale ? v.gender === "female" : v.gender === "male"
  );
  const idx = isFemale ? femaleIdx++ % pool.length : maleIdx++ % pool.length;
  return pool[idx].id;
}

export function resetVoiceSuggestions() {
  femaleIdx = 0;
  maleIdx = 0;
}
