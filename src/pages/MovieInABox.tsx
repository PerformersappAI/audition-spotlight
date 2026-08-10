import Seo from "@/components/Seo";

const cards = [
  {
    key: "save-the-cat",
    title: "Save the Cat",
    count: "15 beats",
    description:
      "Turn-by-turn directions. Fifteen clear beats, each with a job. The most guidance of any structure.",
    bestFor: "Best for your first film",
    featured: true,
    diagram: SaveTheCatDiagram,
  },
  {
    key: "three-act",
    title: "Three-Act",
    count: "3 acts",
    description:
      "Beginning, middle, end — in a 1 / 2 / 1 rhythm. The foundation under everything. Simple and flexible.",
    bestFor: "Best for almost anything",
    diagram: ThreeActDiagram,
  },
  {
    key: "heros-journey",
    title: "Hero's Journey",
    count: "12 stages",
    description:
      "The classic myth: an ordinary hero is called to adventure, faces an ordeal, and returns transformed.",
    bestFor: "Best for epic & transformation",
    diagram: HerosJourneyDiagram,
  },
  {
    key: "story-circle",
    title: "Story Circle",
    count: "8 steps",
    description:
      "Eight plain words — you, need, go, search, find, take, return, change. The quickest way to a complete story.",
    bestFor: "Best for character-driven stories",
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
                <button
                  key={card.key}
                  type="button"
                  aria-label={`Select ${card.title}`}
                  className={[
                    "relative rounded-xl bg-[#161a21] p-[22px] text-left flex flex-col gap-3",
                    "border transition-all duration-300 cursor-pointer",
                    "hover:-translate-y-0.5 hover:shadow-surface",
                    card.featured
                      ? "border-gold/50 hover:border-gold/70"
                      : "border-[#242b35] hover:border-[#3d4756]",
                  ].join(" ")}
                >
                  {card.featured && (
                    <span className="absolute top-3 left-3 z-10 bg-gold text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-surface">
                      START HERE
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-[19px] font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <span className="text-sm text-foreground/40">
                      {card.count}
                    </span>
                  </div>
                  <div className="bg-[#0c0e13] rounded-lg p-4">
                    <Diagram />
                  </div>
                  <p className="text-sm text-foreground/60 leading-snug">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium text-success bg-success/10 border border-success/30 mt-1">
                    {card.bestFor}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compare box */}
          <button
            type="button"
            aria-label="Compare all four structures side by side"
            className="w-full mt-5 flex items-center gap-4 rounded-xl bg-[#161a21] border border-[#00d4aa]/40 p-5 cursor-pointer hover:border-[#00d4aa] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#00d4aa]"
              >
                <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" />
                <rect x="8" y="9" width="4" height="12" rx="1" fill="currentColor" />
                <rect x="13" y="5" width="4" height="16" rx="1" fill="currentColor" />
                <rect x="18" y="10" width="3" height="11" rx="1" fill="currentColor" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-serif text-[17px] text-foreground">
                Compare all four side by side
              </p>
              <p className="text-[13px] text-foreground/60 mt-0.5">
                See the same story through every lens — and how the beats line up.
              </p>
            </div>
            <span className="text-[#00d4aa] text-xl flex-shrink-0">→</span>
          </button>

          {/* Hint */}
          <p className="text-center text-xs text-foreground/50 mt-[22px]">
            Not sure? Start with Save the Cat — you can relight your film through another lens anytime.
          </p>
        </div>
      </section>
    </>
  );
}

function SaveTheCatDiagram() {
  const dots = [
    16, 38, 64, 88, 118, 152, 182, 210, 236, 266, 300,
  ];
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
        stroke="currentColor"
        strokeWidth="2"
        className="text-gold/30"
      />
      {dots.map((x, i) => {
        const isLarge = large.includes(x);
        return (
          <circle
            key={i}
            cx={x}
            cy="12"
            r={isLarge ? 3.5 : 2}
            fill="currentColor"
            className="text-gold"
          />
        );
      })}
    </svg>
  );
}

function ThreeActDiagram() {
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
        strokeWidth="1"
        className="fill-gold/20 stroke-gold"
      />
      <rect
        x="92"
        y="6"
        width="136"
        height="12"
        rx="6"
        strokeWidth="1"
        className="fill-gold/20 stroke-gold"
      />
      <rect
        x="242"
        y="8"
        width="70"
        height="8"
        rx="4"
        strokeWidth="1"
        className="fill-gold/20 stroke-gold"
      />
      <circle cx="80" cy="12" r="2.5" className="fill-gold" />
      <circle cx="232" cy="12" r="2.5" className="fill-gold" />
      <circle cx="160" cy="4" r="2.5" className="fill-gold" />
    </svg>
  );
}

function HerosJourneyDiagram() {
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
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className="text-gold/40"
      />
      <line
        x1="202"
        y1="16"
        x2="310"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className="text-gold/40"
      />
      <circle
        cx="160"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gold/50"
      />
      <circle cx="160" cy="3" r="2.5" className="fill-gold" />
      <circle cx="173" cy="16" r="2.5" className="fill-gold" />
      <circle cx="160" cy="29" r="2.5" className="fill-gold" />
      <circle cx="147" cy="16" r="2.5" className="fill-gold" />
    </svg>
  );
}

function StoryCircleDiagram() {
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
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-[#00d4aa]"
      />
      {Array.from({ length: dots }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / dots - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="2.5" className="fill-[#00d4aa]" />;
      })}
    </svg>
  );
}
