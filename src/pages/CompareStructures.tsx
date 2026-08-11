import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";

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
        aria-label="Movie in a Box breadcrumb"
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
            <li>
              <span className="inline-block rounded-md px-3 py-1.5 font-semibold text-foreground">
                Compare
              </span>
            </li>
          </ul>
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
              Every one of these tells the same story — a beginning, a middle, and an end.
              Here they are side by side, all lined up against the three acts you already know.
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

          <div className="mt-20 mx-auto max-w-[820px]">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-6 text-center">
              Why line them up like this?
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              Every filmmaker already understands a story as a beginning, a middle, and an end.
              That three-act shape isn't just a convention — it's how our minds naturally organize a story.
              It clicks. So instead of asking you to learn four competing systems from scratch, we
              line all four up against the one you already know.
            </p>
            <blockquote
              className="font-serif text-2xl sm:text-3xl italic text-foreground/90 border-l-4 pl-6 py-2 my-8"
              style={{ borderColor: "#a855f7" }}
            >
              They're not four different stories. They're four maps of the same territory.
            </blockquote>
            <p className="text-foreground/70 leading-relaxed mb-6">
              Save the Cat, the Hero's Journey, and the Story Circle are all the same three acts —
              just told in more detail, or with a different emphasis. That's why you can read any
              column straight down and find the same beats in the same places.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              So you don't have to master four philosophies. You already know the shape. Pick the
              lens that fits the movie in your head — knowing that underneath, it's still the
              beginning, middle, and end you've understood your whole life.
            </p>
          </div>

          <div className="mt-20">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-8 text-center">
              The four at a glance
            </h2>
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
