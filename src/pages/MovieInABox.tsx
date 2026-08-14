import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { BarChart3, SlidersHorizontal } from "lucide-react";

const GOLD = "#d4a017";
const VIOLET = "#a855f7";
const ROSE = "#fb7185";
const TEAL = "#2bd1c0";

type CardDef = {
  key: string;
  to: string;
  title: string;
  count: string;
  description: string;
  bestFor: string;
  accent: string;
  diagram: (props: { accent: string }) => JSX.Element;
};

const cards: CardDef[] = [
  {
    key: "three-act",
    to: "/movie-in-a-box/three-act/structure",
    title: "Three-Act",
    count: "3 acts",
    description:
      "Beginning, middle, end — in a 1 / 2 / 1 rhythm. The foundation under everything. Simple and flexible.",
    bestFor: "Best for almost anything",
    accent: VIOLET,
    diagram: ThreeActDiagram,
  },
  {
    key: "save-the-cat",
    to: "/movie-in-a-box/save-the-cat/structure",
    title: "Save the Cat",
    count: "15 beats",
    description:
      "Turn-by-turn directions. Fifteen clear beats, each with a job. The most guidance of any structure.",
    bestFor: "Best for your first film",
    accent: GOLD,
    diagram: SaveTheCatDiagram,
  },
  {
    key: "heros-journey",
    to: "/movie-in-a-box/heros-journey/structure",
    title: "Hero's Journey",
    count: "12 stages",
    description:
      "The classic myth: an ordinary hero is called to adventure, faces an ordeal, and returns transformed.",
    bestFor: "Best for epic & transformation",
    accent: ROSE,
    diagram: HerosJourneyDiagram,
  },
  {
    key: "story-circle",
    to: "/movie-in-a-box/story-circle/structure",
    title: "Story Circle",
    count: "8 steps",
    description:
      "Eight plain words — you, need, go, search, find, take, return, change. The quickest way to a complete story.",
    bestFor: "Best for character-driven stories",
    accent: TEAL,
    diagram: StoryCircleDiagram,
  },
];

function isSaveTheCat(accent: string) {
  return accent.toLowerCase() === GOLD.toLowerCase();
}

export default function MovieInABox() {
  return (
    <>
      <Seo
        title="Story Structure Templates for Screenwriters | Filmmaker Genius"
        description="Pick a proven story structure — three-act, Save the Cat, Hero's Journey or the sequence method — and build your film beat by beat with prompts for every beat."
        canonical="https://filmmakergenius.com/movie-in-a-box"
        type="website"
      />
      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-[780px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Movie in a <span className="text-gold">Box</span>
            </h1>
            <p className="text-base text-foreground/60 mt-4 leading-relaxed">
              The fastest way to outline a film is to start from a structure that already
              works, then fill in its beats with your story. Pick a template below —
              three-act, Save the Cat, the Hero's Journey or the sequence method — and
              Movie in a Box walks you beat by beat, explaining what each beat has to
              accomplish before you write it.
            </p>

          </div>

          {/* Hero compare banner */}
          <Link
            to="/movie-in-a-box/compare"
            aria-label="Compare all four story structures side by side"
            className="group relative flex flex-col items-center text-center rounded-xl bg-[#161a21] border border-white/25 px-6 py-8 sm:py-10 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-white/45 mb-8"
            style={{
              boxShadow: "0 0 20px rgba(255,255,255,0.10)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 34px rgba(255,255,255,0.20)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(255,255,255,0.10)";
            }}
          >
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mb-4">
              <BarChart3
                className="w-8 h-8 text-foreground"
                strokeWidth={1.8}
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Compare all four side by side
            </h2>
            <p className="text-base text-foreground/70 mt-2 max-w-md">
              See the same story through every lens — the best place to start.
            </p>

            <div className="flex items-center gap-2 mt-4">
              {[
                { color: VIOLET, label: "Three-Act" },
                { color: GOLD, label: "Save the Cat" },
                { color: ROSE, label: "Hero's Journey" },
                { color: TEAL, label: "Story Circle" },
              ].map((dot) => (
                <span
                  key={dot.label}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dot.color }}
                  aria-label={dot.label}
                />
              ))}
            </div>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground/90 transition-colors group-hover:text-foreground">
              Start here
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {cards.map((card) => {
              const Diagram = card.diagram;
              const isGold = isSaveTheCat(card.accent);
              return (
                <Link
                  key={card.key}
                  to={card.to}
                  aria-label={`Select ${card.title}`}
                  className="group relative rounded-xl bg-[#161a21] p-[22px] text-left flex flex-col gap-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                  style={{
                    border: `1px solid ${card.accent}73`,
                    boxShadow: isGold
                      ? `0 0 18px ${card.accent}40`
                      : `0 0 14px ${card.accent}26`,
                    ["--accent" as string]: card.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isGold
                      ? `0 0 34px ${card.accent}73`
                      : `0 0 26px ${card.accent}4D`;
                    e.currentTarget.style.border = `1px solid ${card.accent}CC`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isGold
                      ? `0 0 18px ${card.accent}40`
                      : `0 0 14px ${card.accent}26`;
                    e.currentTarget.style.border = `1px solid ${card.accent}73`;
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[19px] font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <span className="text-sm text-foreground/40">
                      {card.count}
                    </span>
                  </div>
                  <div className="bg-[#0c0e13] rounded-lg p-4">
                    <Diagram accent={card.accent} />
                  </div>
                  <p className="text-sm text-foreground/60 leading-snug">
                    {card.description}
                  </p>
                  <span
                    className="inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium mt-1"
                    style={{
                      color: card.accent,
                      backgroundColor: `${card.accent}1E`,
                      border: `1px solid ${card.accent}59`,
                    }}
                  >
                    {card.bestFor}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Engine Room banner — long, thin, matches the compare banner's white glow */}
          <Link
            to="/movie-in-a-box/engine-room"
            aria-label="Open the Engine Room to choose your AI tools"
            className="group relative flex items-center gap-5 rounded-xl bg-[#161a21] border border-white/25 px-6 py-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-white/45 mt-[18px]"
            style={{ boxShadow: "0 0 20px rgba(255,255,255,0.10)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 34px rgba(255,255,255,0.20)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.10)"; }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal className="w-6 h-6 text-foreground" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">The Engine Room</h2>
              <p className="text-sm text-foreground/70 mt-1">Choose the AI tools that build your movie — pick a budget tier, or hand-pick every piece.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground/90 transition-colors group-hover:text-foreground flex-shrink-0">
              Set up
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

function SaveTheCatDiagram({ accent }: { accent: string }) {
  const dots = [16, 38, 64, 88, 118, 152, 182, 210, 236, 266, 300];
  const large = [64, 236];
  return (
    <svg
      viewBox="0 0 320 24"
      className="w-full h-6"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1="10"
        y1="12"
        x2="310"
        y2="12"
        stroke={accent}
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {dots.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy="12"
          r={large.includes(x) ? 3.5 : 2}
          fill={accent}
        />
      ))}
    </svg>
  );
}

function ThreeActDiagram({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 320 24"
      className="w-full h-6"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="8"
        y="8"
        width="70"
        height="8"
        rx="4"
        fill={accent}
        fillOpacity="0.2"
        stroke={accent}
        strokeWidth="1"
      />
      <rect
        x="92"
        y="6"
        width="136"
        height="12"
        rx="6"
        fill={accent}
        fillOpacity="0.2"
        stroke={accent}
        strokeWidth="1"
      />
      <rect
        x="242"
        y="8"
        width="70"
        height="8"
        rx="4"
        fill={accent}
        fillOpacity="0.2"
        stroke={accent}
        strokeWidth="1"
      />
      <circle cx="80" cy="12" r="2.5" fill={accent} />
      <circle cx="232" cy="12" r="2.5" fill={accent} />
      <circle cx="160" cy="4" r="2.5" fill={accent} />
    </svg>
  );
}

function HerosJourneyDiagram({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 320 32"
      className="w-full h-6"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        x1="10"
        y1="16"
        x2="118"
        y2="16"
        stroke={accent}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <line
        x1="202"
        y1="16"
        x2="310"
        y2="16"
        stroke={accent}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <circle
        cx="160"
        cy="16"
        r="13"
        fill="none"
        stroke={accent}
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <circle cx="160" cy="3" r="2.5" fill={accent} />
      <circle cx="173" cy="16" r="2.5" fill={accent} />
      <circle cx="160" cy="29" r="2.5" fill={accent} />
      <circle cx="147" cy="16" r="2.5" fill={accent} />
    </svg>
  );
}

function StoryCircleDiagram({ accent }: { accent: string }) {
  const cx = 160;
  const cy = 16;
  const r = 13;
  const dots = 8;
  return (
    <svg
      viewBox="0 0 320 32"
      className="w-full h-6"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
      />
      {Array.from({ length: dots }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / dots - Math.PI / 2;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r="2.5"
            fill={accent}
          />
        );
      })}
    </svg>
  );
}
