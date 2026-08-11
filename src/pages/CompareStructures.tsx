import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";
import gladiatorPoster from "@/assets/gladiator-poster.png.asset.json";
import godfatherPoster from "@/assets/godfather-poster.png.asset.json";
import lambsPoster from "@/assets/lambs-poster.png.asset.json";
import gumpPoster from "@/assets/forrest-gump-poster.png.asset.json";

const POSTERS: Record<string, string> = {
  gladiator: gladiatorPoster.url,
  "the-godfather": godfatherPoster.url,
  "the-silence-of-the-lambs": lambsPoster.url,
  "forrest-gump": gumpPoster.url,
};

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

const MOVIE_CARDS = [
  {
    slug: "the-godfather",
    title: "The Godfather",
    structureName: "Three-Act",
    color: "#a855f7",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
    teaser: "First Plot Point = Michael shoots Sollozzo and McCluskey.",
  },
  {
    slug: "the-silence-of-the-lambs",
    title: "The Silence of the Lambs",
    structureName: "Save the Cat",
    color: "#d4a017",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
    teaser: "Catalyst = Clarice is sent to interview Hannibal Lecter.",
  },
  {
    slug: "gladiator",
    title: "Gladiator",
    structureName: "Hero's Journey",
    color: "#fb7185",
    oscars: 1,
    oscarLabel: "Best Picture",
    teaser: "Crossing the Threshold = Maximus is enslaved and made a gladiator.",
  },
  {
    slug: "forrest-gump",
    title: "Forrest Gump",
    structureName: "Story Circle",
    color: "#2bd1c0",
    oscars: 2,
    oscarLabel: "Best Screenplay · Best Picture",
    teaser: "You = young Forrest on the bus-stop bench, starting his story.",
  },
];


export default function CompareStructures() {
  const navigate = useNavigate();

  useEffect(() => {
    var ACT1='rgba(221,190,255,0.24)', ACT2='rgba(168,85,247,0.34)', ACT3='rgba(88,28,135,0.55)';

    function slug(name:string){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}

    function line(id:string,names:string[],ps:number[],color:string,showActs:boolean,structureKey:string){var N=names.length,NS="http://www.w3.org/2000/svg";
    var W=1000,H=124,y=66,x0=80,x1=920,xf=function(p:number){return x0+(x1-x0)*p;};
    var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="'+NS+'" style="width:100%;height:auto;display:block">';
    s+='<rect x="'+x0+'" y="0" width="'+(xf(0.25)-x0)+'" height="'+H+'" fill="'+ACT1+'"/>';
    s+='<rect x="'+xf(0.25)+'" y="0" width="'+(xf(0.75)-xf(0.25))+'" height="'+H+'" fill="'+ACT2+'"/>';
    s+='<rect x="'+xf(0.75)+'" y="0" width="'+(x1-xf(0.75))+'" height="'+H+'" fill="'+ACT3+'"/>';
    if(showActs){s+='<text x="'+((x0+xf(0.25))/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#e9d5ff">ACT I</text>';s+='<text x="'+((xf(0.25)+xf(0.75))/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#e9d5ff">ACT II</text>';s+='<text x="'+((xf(0.75)+x1)/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#f2e9ff">ACT III</text>';}
    s+='<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" stroke="'+color+'" stroke-width="2.6" stroke-opacity="0.85"/>';
    for(var i=0;i<N;i++){var x=xf(ps[i]),ab=i%2===0;
      s+='<g data-nav="/movie-in-a-box/'+structureKey+'/beat/'+slug(names[i])+'" style="cursor:pointer">';
      s+='<circle cx="'+x+'" cy="'+y+'" r="5.5" fill="'+color+'"/>';
      s+='<text x="'+x+'" y="'+(ab?y-16:y+26)+'" text-anchor="middle" font-family="serif" font-weight="700" font-size="12" fill="#f4f5f7">'+names[i]+'</text>';
      s+='</g>';}
    s+='</svg>';document.getElementById(id)!.innerHTML=s;}

    line('l1',['Ordinary World','Inciting Incident','First Plot Point','Rising Action','Midpoint','Crisis / Low','Climax','Resolution'],[0.02,0.12,0.25,0.40,0.50,0.75,0.90,0.99],'#a855f7',true,'three-act');
    line('l2',['Opening','Theme','Setup','Catalyst','Debate','Break 2','B Story','Fun & Games','Midpoint','Bad Guys','All Is Lost','Dark Night','Break 3','Finale','Final Image'],[0.01,0.05,0.07,0.11,0.18,0.25,0.28,0.40,0.50,0.62,0.68,0.75,0.78,0.90,1.0],'#d4a017',false,'save-the-cat');
    line('l3',['Ordinary','Call','Refusal','Mentor','Threshold','Tests','Inmost Cave','Ordeal','Reward','Road Back','Resurrection','Return'],[0.03,0.10,0.15,0.20,0.25,0.40,0.48,0.55,0.63,0.75,0.90,0.98],'#fb7185',false,'heros-journey');
    line('l4',['You','Need','Go','Search','Find','Take','Return','Change'],[0.02,0.12,0.25,0.40,0.50,0.68,0.80,0.97],'#2bd1c0',false,'story-circle');

    const ids = ['l1','l2','l3','l4'];
    const handler = (e: Event) => {
      const target = e.target as Element | null;
      const g = target?.closest?.('[data-nav]');
      const path = g?.getAttribute('data-nav');
      if (path) navigate(path);
    };
    const els = ids.map((i) => document.getElementById(i)).filter(Boolean) as HTMLElement[];
    els.forEach((el) => el.addEventListener('click', handler));
    return () => els.forEach((el) => el.removeEventListener('click', handler));
  }, [navigate]);



  return (
    <>
      <Seo
        title="Compare All Four | Movie in a Box | Filmmaker Genius"
        description="The same story through every lens."
        canonical="https://filmmakergenius.com/movie-in-a-box/compare"
        type="website"
      />

      <nav
        aria-label="Movie in a Box quick navigation"
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0e13]/95 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 text-sm whitespace-nowrap">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  to="/movie-in-a-box"
                  className="inline-flex items-center rounded-md px-3 py-2 text-[14px] text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Movie in a Box
                </Link>
              </li>
              <li className="text-foreground/30" aria-hidden="true">›</li>
              <li>
                <span className="inline-block rounded-md px-3 py-2 text-[14px] font-semibold text-foreground">
                  Compare
                </span>
              </li>
            </ul>

            <span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />

            <ul className="flex items-center gap-1">
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Link
                    to="/movie-in-a-box/three-act/structure"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "#a855f7" }}
                  >
                    Three-Act
                  </Link>
                  <span className="text-[13px]" style={{ color: "#a855f7", opacity: 0.5 }} aria-hidden="true">·</span>
                  <Link
                    to="/movie-in-a-box/movie/the-godfather"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-medium hover:bg-white/5 transition-colors"
                    style={{ color: "#a855f7", opacity: 0.85 }}
                  >
                    The Godfather
                  </Link>
                </span>
              </li>
              <span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Link
                    to="/movie-in-a-box/save-the-cat/structure"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "#d4a017" }}
                  >
                    Save the Cat
                  </Link>
                  <span className="text-[13px]" style={{ color: "#d4a017", opacity: 0.5 }} aria-hidden="true">·</span>
                  <Link
                    to="/movie-in-a-box/movie/the-silence-of-the-lambs"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-medium hover:bg-white/5 transition-colors"
                    style={{ color: "#d4a017", opacity: 0.85 }}
                  >
                    The Silence of the Lambs
                  </Link>
                </span>
              </li>
              <span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Link
                    to="/movie-in-a-box/heros-journey/structure"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "#fb7185" }}
                  >
                    Hero's Journey
                  </Link>
                  <span className="text-[13px]" style={{ color: "#fb7185", opacity: 0.5 }} aria-hidden="true">·</span>
                  <Link
                    to="/movie-in-a-box/movie/gladiator"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-medium hover:bg-white/5 transition-colors"
                    style={{ color: "#fb7185", opacity: 0.85 }}
                  >
                    Gladiator
                  </Link>
                </span>
              </li>
              <span className="mx-2 h-4 w-px bg-white/10" aria-hidden="true" />
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Link
                    to="/movie-in-a-box/story-circle/structure"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "#2bd1c0" }}
                  >
                    Story Circle
                  </Link>
                  <span className="text-[13px]" style={{ color: "#2bd1c0", opacity: 0.5 }} aria-hidden="true">·</span>
                  <Link
                    to="/movie-in-a-box/movie/forrest-gump"
                    className="inline-flex items-center rounded-md px-2 py-2 text-[14px] font-medium hover:bg-white/5 transition-colors"
                    style={{ color: "#2bd1c0", opacity: 0.85 }}
                  >
                    Forrest Gump
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="bg-background px-4 py-16">
        <div className="container mx-auto">
          <div className="relative max-w-3xl mx-auto text-center">
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(168,85,247,0.22), transparent 60%)",
              }}
            />
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.25em] mb-4"
              style={{ color: "#a855f7" }}
            >
              The best place to start
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Four structures, one story
            </h1>
            <p className="text-lg text-foreground/60 mt-4">
              The same story, four ways — all lined up against the three acts you already know.{" "}
              <strong className="text-foreground/80">
                Click any beat and we'll teach you what it is, then show you the exact moment a famous movie nailed it.
              </strong>
            </p>
          </div>

          <div className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-6">
              The same story, four ways — shaded by act
            </h2>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#a855f7" }}>
                    Three-Act
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      color: "#a855f7",
                      backgroundColor: "#a855f71e",
                      border: "1px solid #a855f759",
                    }}
                  >
                    Reference
                  </span>
                </div>
                <div id="l1" className="w-full" />
              </div>

              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#d4a017" }}>
                  Save the Cat
                </div>
                <div id="l2" className="w-full" />
              </div>

              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#fb7185" }}>
                  Hero's Journey
                </div>
                <div id="l3" className="w-full" />
              </div>

              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#2bd1c0" }}>
                  Story Circle
                </div>
                <div id="l4" className="w-full" />
              </div>
            </div>

            <div className="mt-8 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5">
              <p className="text-sm text-foreground/70 leading-relaxed">
                <span className="inline-flex items-center gap-2 mr-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#a855f7" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#d4a017" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fb7185" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#2bd1c0" }} />
                </span>
                <strong>Read straight down a column:</strong> the same moment — the hero commits, the low point, the final test — lands in the same place in every one.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="font-serif text-[32px] leading-tight text-foreground text-center">
              Learn each structure through a movie you know
            </h2>
            <p className="mt-4 mx-auto max-w-[720px] text-center text-sm text-foreground/60 leading-relaxed">
              Click any beat — on the lines above or on a structure's page — and we'll tell you exactly
              what it is, then show you that exact moment in a famous film. Each structure follows one
              movie all the way through.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[940px] mx-auto">
              {MOVIE_CARDS.map((m) => (
                <Link
                  key={m.slug}
                  to={`/movie-in-a-box/movie/${m.slug}`}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:bg-white/[0.05] border-l-[3px]"
                  style={{ borderLeftColor: m.color }}
                >
                  {POSTERS[m.slug] ? (
                    <img
                      src={POSTERS[m.slug]}
                      alt={`${m.title} movie poster`}
                      className="shrink-0 rounded-md object-cover bg-black/40"
                      style={{ width: 76, height: 110 }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="shrink-0 rounded-md border border-dashed border-white/25 bg-black/40"
                      style={{ width: 76, height: 110 }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: m.color }}
                    >
                      {m.structureName}
                    </span>
                    <h3 className="font-serif text-[19px] text-foreground mt-1">{m.title}</h3>
                    <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{m.teaser}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-1 pl-1">
                    <div className="flex flex-row items-center gap-2">
                      {Array.from({ length: m.oscars }).map((_, i) => (
                        <Oscar key={i} />
                      ))}
                    </div>
                    <span className="text-[9px] text-foreground/40 text-center leading-tight max-w-[86px]">
                      {m.oscarLabel}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-foreground/40">
              <Oscar />
              <span>Academy Award — Best Screenplay and/or Best Picture.</span>
            </p>
          </div>

          <div className="mt-20">
            <h2 className="font-serif text-[32px] leading-tight text-foreground text-center">
              Already know it? Start building.
            </h2>
            <p className="mt-4 mb-10 mx-auto max-w-[720px] text-center text-sm text-foreground/60 leading-relaxed">
              Choose your lens and go straight to building your film — no lesson required.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
              <Link
                to="/movie-in-a-box/three-act/structure"
                className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.05] border-l-[3px]"
                style={{ borderLeftColor: "#a855f7" }}
              >
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#a855f7" }}>
                  Three-Act
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  the foundation
                </span>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  Beginning, middle, end. The reference every other structure is built on — and the one everyone already feels.
                </p>
                <span
                  className="mt-4 inline-flex text-sm font-semibold transition-colors"
                  style={{ color: "#a855f7" }}
                >
                  Explore Three-Act →
                </span>
              </Link>

              <Link
                to="/movie-in-a-box/save-the-cat/structure"
                className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.05] border-l-[3px]"
                style={{ borderLeftColor: "#d4a017" }}
              >
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#d4a017" }}>
                  Save the Cat
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  most step-by-step
                </span>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  The three acts broken into 15 specific beats, each with a suggested page. The most hand-holding of the four.
                </p>
                <span
                  className="mt-4 inline-flex text-sm font-semibold transition-colors"
                  style={{ color: "#d4a017" }}
                >
                  Explore Save the Cat →
                </span>
              </Link>

              <Link
                to="/movie-in-a-box/heros-journey/structure"
                className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.05] border-l-[3px]"
                style={{ borderLeftColor: "#fb7185" }}
              >
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#fb7185" }}>
                  Hero's Journey
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  mythic
                </span>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  The three acts told as a journey — leave the ordinary world, face an ordeal, return changed. Best for transformation.
                </p>
                <span
                  className="mt-4 inline-flex text-sm font-semibold transition-colors"
                  style={{ color: "#fb7185" }}
                >
                  Explore Hero's Journey →
                </span>
              </Link>

              <Link
                to="/movie-in-a-box/story-circle/structure"
                className="group block rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.05] border-l-[3px]"
                style={{ borderLeftColor: "#2bd1c0" }}
              >
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#2bd1c0" }}>
                  Story Circle
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  fast & character-driven
                </span>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">
                  A leaner 8-step loop of the same idea — you, need, go… change. The quickest way to a complete story.
                </p>
                <span
                  className="mt-4 inline-flex text-sm font-semibold transition-colors"
                  style={{ color: "#2bd1c0" }}
                >
                  Explore Story Circle →
                </span>
              </Link>
            </div>
          </div>

          <p className="mt-16 text-center text-xs italic text-foreground/40">
            The three-act idea goes back to Aristotle (c. 335 BC); the modern screenwriting version was set down by Syd Field in 1979.
          </p>
        </div>
      </section>

    </>
  );
}
