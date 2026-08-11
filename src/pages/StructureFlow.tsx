import { useEffect } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type StructureKey =
  | "save-the-cat"
  | "three-act"
  | "heros-journey"
  | "story-circle";

const CONFIG: Record<
  StructureKey,
  { title: string; accent: string; subtitle: string }
> = {
  "save-the-cat": {
    title: "Save the Cat",
    accent: "#d4a017",
    subtitle: "Fifteen beats, one at a time.",
  },
  "three-act": {
    title: "Three-Act",
    accent: "#a855f7",
    subtitle: "Beginning, middle, end.",
  },
  "heros-journey": {
    title: "Hero's Journey",
    accent: "#fb7185",
    subtitle: "The mythic path, stage by stage.",
  },
  "story-circle": {
    title: "Story Circle",
    accent: "#00d4aa",
    subtitle: "Eight steps around the circle.",
  },
};

const STOPS = [
  { key: "structure", label: "Structure" },
  { key: "beats", label: "Beats" },
  { key: "scene", label: "Scene" },
  { key: "shots", label: "Shots" },
  { key: "movie", label: "Movie" },
] as const;

type StopKey = (typeof STOPS)[number]["key"];

type StructData = {
  title: string;
  color: string;
  size: number;
  names: string[];
  acts: [string, number, number][];
};

const DATA: Record<StructureKey, StructData> = {
  "three-act": {
    title: "Three-Act",
    color: "#a855f7",
    size: 620,
    names: [
      "Ordinary World",
      "Inciting Incident",
      "First Plot Point",
      "Rising Action",
      "Midpoint",
      "Crisis / Low",
      "Climax",
      "Resolution",
    ],
    acts: [
      ["Act I", 0, 2],
      ["Act II", 3, 5],
      ["Act III", 6, 7],
    ],
  },
  "save-the-cat": {
    title: "Save the Cat",
    color: "#d4a017",
    size: 720,
    names: [
      "Opening",
      "Theme",
      "Setup",
      "Catalyst",
      "Debate",
      "Break 2",
      "B Story",
      "Fun & Games",
      "Midpoint",
      "Bad Guys",
      "All Is Lost",
      "Dark Night",
      "Break 3",
      "Finale",
      "Final Image",
    ],
    acts: [
      ["Act I", 0, 5],
      ["Act II", 6, 12],
      ["Act III", 13, 14],
    ],
  },
  "heros-journey": {
    title: "Hero's Journey",
    color: "#fb7185",
    size: 660,
    names: [
      "Ordinary",
      "Call",
      "Refusal",
      "Mentor",
      "Threshold",
      "Tests",
      "Inmost Cave",
      "Ordeal",
      "Reward",
      "Road Back",
      "Resurrection",
      "Return",
    ],
    acts: [
      ["Departure", 0, 4],
      ["Initiation", 5, 8],
      ["Return", 9, 11],
    ],
  },
  "story-circle": {
    title: "Story Circle",
    color: "#2bd1c0",
    size: 620,
    names: ["You", "Need", "Go", "Search", "Find", "Take", "Return", "Change"],
    acts: [
      ["Act I", 0, 2],
      ["Act II", 3, 5],
      ["Act III", 6, 7],
    ],
  },
};

const DIAGRAM_MODE: Record<StructureKey, "line" | "circle"> = {
  "three-act": "line",
  "save-the-cat": "line",
  "heros-journey": "circle",
  "story-circle": "circle",
};

export default function StructureFlow({
  structureKey,
}: {
  structureKey: StructureKey;
}) {
  const { title, accent, subtitle } = CONFIG[structureKey];
  const { stop } = useParams<{ stop?: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (stop !== "structure") return;
    const data = DATA[structureKey];
    if (!data) return;

    function draw(id, mode, names, color, sk, opts){opts=opts||{};var N=names.length,NS="http://www.w3.org/2000/svg",s;
var nav=function(i){return '/movie-in-a-box/'+sk+'/beat/'+slugify(names[i]);};
if(mode==='line'){var W=1000,H=opts.acts?232:196,y=104,x0=60,x1=940,xf=function(i){return x0+(x1-x0)*i/(N-1);};
s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="'+NS+'" style="width:100%;height:auto;display:block">';
if(opts.acts){opts.acts.forEach(function(g,gi){var cg=(xf(g[1])+xf(g[2]))/2;s+='<text x="'+cg+'" y="'+(H-14)+'" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="'+color+'" opacity="0.85">'+g[0]+'</text>';if(gi<opts.acts.length-1){var dx=(xf(g[2])+xf(opts.acts[gi+1][1]))/2;s+='<line x1="'+dx+'" y1="36" x2="'+dx+'" y2="'+(H-38)+'" stroke="#2a2f38" stroke-dasharray="4 5"/>';}});}
s+='<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" stroke="'+color+'" stroke-width="2.4" stroke-opacity="0.72"/>';
for(var i=0;i<N;i++){var x=xf(i),ab=i%2===0;s+='<g data-nav="'+nav(i)+'" style="cursor:pointer">';s+='<circle cx="'+x+'" cy="'+y+'" r="6" fill="'+color+'"/>';s+='<text x="'+x+'" y="'+(ab?y-22:y+32)+'" text-anchor="middle" font-family="serif" font-weight="700" font-size="14" fill="#f2f2f2">'+names[i]+'</text>';s+='<text x="'+x+'" y="'+(ab?y-38:y+48)+'" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="700" fill="'+color+'">'+(i+1)+'</text>';s+='</g>';}
s+='</svg>';}
else{var S=opts.size||660,c=S/2,r=c-140;s='<svg viewBox="0 0 '+S+' '+S+'" xmlns="'+NS+'" style="width:100%;height:auto;display:block">';s+='<circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="2.2" stroke-opacity="0.75"/>';
for(var i=0;i<N;i++){var a=(-90+i*360/N)*Math.PI/180,x=c+r*Math.cos(a),yy=c+r*Math.sin(a),lx=c+(r+22)*Math.cos(a),ly=c+(r+22)*Math.sin(a),an=Math.abs(Math.cos(a))<0.34?'middle':(Math.cos(a)>0?'start':'end');s+='<g data-nav="'+nav(i)+'" style="cursor:pointer">';s+='<circle cx="'+x+'" cy="'+yy+'" r="6" fill="'+color+'"/>';s+='<text x="'+lx+'" y="'+(ly+4)+'" text-anchor="'+an+'" font-family="serif" font-weight="700" font-size="13.5" fill="#f2f2f2">'+names[i]+'</text>';s+='<text x="'+lx+'" y="'+(ly-12)+'" text-anchor="'+an+'" font-family="sans-serif" font-size="9.5" font-weight="700" fill="'+color+'">'+(i+1)+'</text>';s+='</g>';}
if(opts.title)s+='<text x="'+c+'" y="'+(c+6)+'" text-anchor="middle" font-family="serif" font-size="24" font-weight="700" fill="'+color+'">'+opts.title+'</text>';
s+='</svg>';}
var el=document.getElementById(id); if(el) el.innerHTML=s;}

    const mode = DIAGRAM_MODE[structureKey];
    if (mode === "line") {
      draw("sfLine", "line", data.names, data.color, structureKey, { acts: data.acts });
    } else {
      draw("sfCircle", "circle", data.names, data.color, structureKey, {
        title: data.title,
        size: data.size,
      });
    }

    const onClick = (e: Event) => {
      const target = e.target as Element | null;
      const g = target?.closest?.("[data-nav]") as Element | null;
      const path = g?.getAttribute("data-nav");
      if (path) navigate(path);
    };

    const containerId = mode === "line" ? "sfLine" : "sfCircle";
    const container = document.getElementById(containerId) as HTMLElement | null;
    container?.addEventListener("click", onClick);
    return () => {
      container?.removeEventListener("click", onClick);
    };
  }, [structureKey, stop, navigate]);

  if (!stop || !STOPS.some((s) => s.key === stop)) {
    return <Navigate to={`/movie-in-a-box/${structureKey}/structure`} replace />;
  }

  const activeStop = stop as StopKey;
  const stopLabel = STOPS.find((s) => s.key === activeStop)!.label;

  return (
    <>
      <Seo
        title={`${title} — ${stopLabel} | Movie in a Box | Filmmaker Genius`}
        description={subtitle}
        canonical={`https://filmmakergenius.com/movie-in-a-box/${structureKey}/${activeStop}`}
        type="website"
      />

      <nav
        aria-label={`${title} flow`}
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2.5 text-sm whitespace-nowrap">
            <li>
              <Link
                to="/movie-in-a-box"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <span>Movie in a Box</span>
              </Link>
            </li>
            <li className="text-foreground/30" aria-hidden="true">
              ›
            </li>
            {STOPS.map((s) => {
              const isActive = s.key === activeStop;
              const label =
                s.key === "beats" ? `Beats (${title})` : s.label;
              return (
                <li key={s.key}>
                  <Link
                    to={`/movie-in-a-box/${structureKey}/${s.key}`}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "inline-block rounded-md px-3 py-1.5 font-semibold"
                        : "inline-block rounded-md px-3 py-1.5 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                    }
                    style={isActive ? { color: accent } : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {activeStop === "structure" ? (
        <section className="bg-background px-4 py-12">
          <div className="w-full max-w-[1080px] mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/45 font-semibold mb-4">
              As a line
            </p>
            <div id="sfLine" className="w-full" />

            <div className="my-12 h-px bg-white/10" />

            <p className="text-xs uppercase tracking-[0.2em] text-foreground/45 font-semibold mb-4">
              As a circle
            </p>
            <div id="sfCircle" className="w-full max-w-[1040px] mx-auto" />
          </div>
        </section>
      ) : (
        <section className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-background px-4 py-16">
          <div className="w-full max-w-[780px] mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight"
              style={{ color: accent }}
            >
              {title} — {stopLabel}
            </h1>
            <p className="text-lg text-foreground/60 mt-4">
              This stop will hold your {stopLabel.toLowerCase()} — coming next.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
