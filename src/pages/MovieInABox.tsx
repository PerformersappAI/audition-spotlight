import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

const GOLD = "#d4a017";
const VIOLET = "#a855f7";
const ROSE = "#fb7185";
const TEAL = "#00d4aa";

type CardDef = {
  key: string;
  to: string;
  title: string;
  count: string;
  description: string;
  bestFor: string;
  accent: string;
  featured?: boolean;
  diagram: (props: { accent: string }) => JSX.Element;
};

const cards: CardDef[] = [
  {
    key: "save-the-cat",
    to: "/movie-in-a-box/save-the-cat/structure",
    title: "Save the Cat",
    count: "15 beats",
    description:
      "Turn-by-turn directions. Fifteen clear beats, each with a job. The most guidance of any structure.",
    bestFor: "Best for your first film",
    accent: GOLD,
    featured: true,
    diagram: SaveTheCatDiagram,
  },
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

export default function MovieInABox() {
  return (
    <>
      <Seo
        title="Movie in a Box | Filmmaker Genius"
        description="Pick a story structure and start building your film — beat by beat."
        canonical="https://filmmakergenius.com/movie-in-a-box"
        type="website"
      />
      <section className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-[780px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Movie in a <span className="text-gold">Box</span>
            </h1>
            <p className="text-lg text-foreground/60 mt-4">
              How do you want to shape your story?
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {cards.map((card) => {
              const Diagram = card.diagram;
              return (
                <Link
                  key={card.key}
                  to={card.to}
                  aria-label={`Select ${card.title}`}
                  className="group relative rounded-xl bg-[#161a21] p-[22px] text-left flex flex-col gap-3 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                  style={
                    {
                      border: `1px solid ${card.accent}66`,
                      boxShadow: `0 0 12px ${card.accent}14`,
                      ["--accent" as string]: card.accent,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 24px ${card.accent}40`;
                    e.currentTarget.style.border = `1px solid ${card.accent}b3`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 12px ${card.accent}14`;
                    e.currentTarget.style.border = `1px solid ${card.accent}66`;
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
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium text-success bg-success/10 border border-success/30 mt-1">
                    {card.bestFor}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Compare card — neutral treatment, centered below the grid */}
          <Link
            to="/movie-in-a-box/compare"
            aria-label="Compare all four structures side by side"
            className="w-full sm:w-[calc(50%-9px)] mx-auto mt-5 flex flex-col items-center text-center gap-4 rounded-xl bg-[#161a21] border border-white/15 hover:border-white/35 p-[22px] cursor-pointer transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:shadow-[0_0_24px_rgba(226,232,240,0.18)]"
          >
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-foreground/80"
              >
                <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" />
                <rect x="8" y="9" width="4" height="12" rx="1" fill="currentColor" />
                <rect x="13" y="5" width="4" height="16" rx="1" fill="currentColor" />
                <rect x="18" y="10" width="3" height="11" rx="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-[17px] text-foreground">
                Compare all four side by side
              </p>
              <p className="text-[13px] text-foreground/60 mt-0.5">
                See the same story through every lens — and how the beats line up.
              </p>
            </div>
          </Link>

          {/* Hint */}
          <p className="text-center text-xs text-foreground/50 mt-[22px]">
            Not sure? Start with Save the Cat — you can relight your film through another lens anytime.
          </p>
        </div>
      </section>
    </>
  );
}

function SaveTheCatDiagram({ accent }: { accent: string }) {
  const dots = [16, 38, 64, 88, 118, 152, 182, 210, 236, 266, 300];
  const large = [64, 236];
  return (
    <svg viewBox="0 0 320 24" className="w-full h-6" preserveAspectRatio="xMidYMid meet">
      <line x1="10" y1="12" x2="310" y2="12" stroke={accent} strokeOpacity="0.35" strokeWidth="2" />
      {dots.map((x, i) => (
        <circle key={i} cx={x} cy="12" r={large.includes(x) ? 3.5 : 2} fill={accent} />
      ))}
    </svg>
  );
}

function ThreeActDiagram({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 320 24" className="w-full h-6" preserveAspectRatio="xMidYMid meet">
      <rect x="8" y="8" width="70" height="8" rx="4" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1" />
      <rect x="92" y="6" width="136" height="12" rx="6" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1" />
      <rect x="242" y="8" width="70" height="8" rx="4" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1" />
      <circle cx="80" cy="12" r="2.5" fill={accent} />
      <circle cx="232" cy="12" r="2.5" fill={accent} />
      <circle cx="160" cy="4" r="2.5" fill={accent} />
    </svg>
  );
}

function HerosJourneyDiagram({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 320 32" className="w-full h-6" preserveAspectRatio="xMidYMid meet">
      <line x1="10" y1="16" x2="118" y2="16" stroke={accent} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="202" y1="16" x2="310" y2="16" stroke={accent} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="160" cy="16" r="13" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="1.5" />
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
    <svg viewBox="0 0 320 32" className="w-full h-6" preserveAspectRatio="xMidYMid meet">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth="1.5" />
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
