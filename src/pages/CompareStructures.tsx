import { useEffect } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function CompareStructures() {
  useEffect(() => {
    var ACT1='rgba(221,190,255,0.24)', ACT2='rgba(168,85,247,0.34)', ACT3='rgba(88,28,135,0.55)';

    function line(id:string,names:string[],ps:number[],color:string,showActs:boolean){var N=names.length,NS="http://www.w3.org/2000/svg";
    var W=1000,H=124,y=66,x0=80,x1=920,xf=function(p:number){return x0+(x1-x0)*p;};
    var s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="'+NS+'" style="width:100%;height:auto;display:block">';
    s+='<rect x="'+x0+'" y="0" width="'+(xf(0.25)-x0)+'" height="'+H+'" fill="'+ACT1+'"/>';
    s+='<rect x="'+xf(0.25)+'" y="0" width="'+(xf(0.75)-xf(0.25))+'" height="'+H+'" fill="'+ACT2+'"/>';
    s+='<rect x="'+xf(0.75)+'" y="0" width="'+(x1-xf(0.75))+'" height="'+H+'" fill="'+ACT3+'"/>';
    if(showActs){s+='<text x="'+((x0+xf(0.25))/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#e9d5ff">ACT I</text>';s+='<text x="'+((xf(0.25)+xf(0.75))/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#e9d5ff">ACT II</text>';s+='<text x="'+((xf(0.75)+x1)/2)+'" y="18" text-anchor="middle" font-family="serif" font-size="13" font-weight="800" letter-spacing="2" fill="#f2e9ff">ACT III</text>';}
    s+='<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" stroke="'+color+'" stroke-width="2.6" stroke-opacity="0.85"/>';
    for(var i=0;i<N;i++){var x=xf(ps[i]),ab=i%2===0;s+='<circle cx="'+x+'" cy="'+y+'" r="5.5" fill="'+color+'"/>';s+='<text x="'+x+'" y="'+(ab?y-16:y+26)+'" text-anchor="middle" font-family="serif" font-weight="700" font-size="12" fill="#f4f5f7">'+names[i]+'</text>';}
    s+='</svg>';document.getElementById(id)!.innerHTML=s;}

    line('l1',['Ordinary World','Inciting Incident','First Plot Point','Rising Action','Midpoint','Crisis / Low','Climax','Resolution'],[0.02,0.12,0.25,0.40,0.50,0.75,0.90,0.99],'#a855f7',true);
    line('l2',['Opening','Theme','Setup','Catalyst','Debate','Break 2','B Story','Fun & Games','Midpoint','Bad Guys','All Is Lost','Dark Night','Break 3','Finale','Final Image'],[0.01,0.05,0.07,0.11,0.18,0.25,0.28,0.40,0.50,0.62,0.68,0.75,0.78,0.90,1.0],'#d4a017',false);
    line('l3',['Ordinary','Call','Refusal','Mentor','Threshold','Tests','Inmost Cave','Ordeal','Reward','Road Back','Resurrection','Return'],[0.03,0.10,0.15,0.20,0.25,0.40,0.48,0.55,0.63,0.75,0.90,0.98],'#fb7185',false);
    line('l4',['You','Need','Go','Search','Find','Take','Return','Change'],[0.02,0.12,0.25,0.40,0.50,0.68,0.80,0.97],'#2bd1c0',false);

  }, []);


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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Four structures, one story
            </h1>
            <p className="text-lg text-foreground/60 mt-4">
              The same story, four ways — all synced to the three acts. Act I is the
              lightest purple, Act II darker, Act III the darkest.
            </p>
          </div>

          <div className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-6">
              As four lines — shaded by act
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
          </div>

        </div>
      </section>

    </>
  );
}
