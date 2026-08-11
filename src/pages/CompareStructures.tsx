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

    (function(){
      var NS="http://www.w3.org/2000/svg", cx=600, cy=580;
      function xy(p:number,r:number){var a=(-90+p*360)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a),a];}
      function wedge(p0:number,p1:number,r:number,fill:string){var a0=(-90+p0*360)*Math.PI/180,a1=(-90+p1*360)*Math.PI/180,x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),lg=(p1-p0)>0.5?1:0;return '<path d="M'+cx+' '+cy+' L'+x0+' '+y0+' A'+r+' '+r+' 0 '+lg+' 1 '+x1+' '+y1+' Z" fill="'+fill+'"/>';}
      var rings=[
        {color:'#a855f7',r:340,outer:true,names:['Ordinary World','Inciting Incident','First Plot Point','Rising Action','Midpoint','Crisis / Low','Climax','Resolution'],p:[0.02,0.12,0.25,0.40,0.50,0.75,0.90,0.99]},
        {color:'#d4a017',r:268,names:['Opening','Theme','Setup','Catalyst','Debate','Break 2','B Story','Fun & Games','Midpoint','Bad Guys','All Is Lost','Dark Night','Break 3','Finale','Final Image'],p:[0.01,0.05,0.07,0.11,0.18,0.25,0.28,0.40,0.50,0.62,0.68,0.75,0.78,0.90,1.0]},
        {color:'#fb7185',r:198,names:['Ordinary','Call','Refusal','Mentor','Threshold','Tests','Inmost Cave','Ordeal','Reward','Road Back','Resurrection','Return'],p:[0.03,0.10,0.15,0.20,0.25,0.40,0.48,0.55,0.63,0.75,0.90,0.98]},
        {color:'#2bd1c0',r:130,names:['You','Need','Go','Search','Find','Take','Return','Change'],p:[0.02,0.12,0.25,0.40,0.50,0.68,0.80,0.97]}
      ] as Array<{color:string;r:number;outer?:boolean;names:string[];p:number[]}>;
      var s='<svg viewBox="0 0 1200 1200" xmlns="'+NS+'" style="width:100%;height:auto;display:block">';
      s+=wedge(0,0.25,356,ACT1); s+=wedge(0.25,0.75,356,ACT2); s+=wedge(0.75,1.0,356,ACT3);
      [0,0.25,0.75].forEach(function(pp){var q=xy(pp,356);s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+q[0]+'" y2="'+q[1]+'" stroke="#c39cf5" stroke-width="1.6" stroke-opacity="0.6"/>';});
      rings.forEach(function(ring){
        s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+ring.r+'" fill="none" stroke="'+ring.color+'" stroke-width="'+(ring.outer?2.4:1.8)+'" stroke-opacity="'+(ring.outer?0.8:0.65)+'"/>';
        for(var i=0;i<ring.p.length;i++){var q=xy(ring.p[i],ring.r),x=q[0],y=q[1],a=q[2];
          s+='<circle cx="'+x+'" cy="'+y+'" r="'+(ring.outer?6:5)+'" fill="'+ring.color+'"/>';
          if(ring.outer){var lr=ring.r+18,lx=cx+lr*Math.cos(a),ly=cy+lr*Math.sin(a),ca=Math.cos(a),an=Math.abs(ca)<0.34?'middle':(ca>0?'start':'end');
            s+='<text x="'+lx+'" y="'+(ly+4)+'" text-anchor="'+an+'" font-family="serif" font-weight="700" font-size="12" fill="#efe6ff">'+ring.names[i]+'</text>';}
        }
      });
      function actLabel(p:number,txt:string,sub:string){var Lin=xy(p,346),c=xy(p,532),x=c[0],y=c[1];
        s+='<line x1="'+Lin[0]+'" y1="'+Lin[1]+'" x2="'+x+'" y2="'+y+'" stroke="#a855f7" stroke-width="2.5"/>';
        s+='<rect x="'+(x-72)+'" y="'+(y-30)+'" width="144" height="60" rx="11" fill="#a855f7"/>';
        s+='<text x="'+x+'" y="'+(y-2)+'" text-anchor="middle" font-family="serif" font-size="27" font-weight="800" letter-spacing="1" fill="#12141a">'+txt+'</text>';
        s+='<text x="'+x+'" y="'+(y+17)+'" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="700" fill="#2c1147">'+sub+'</text>';}
      actLabel(0,'ACT I','begins at the opening'); actLabel(0.25,'ACT II','begins at plot point 1'); actLabel(0.75,'ACT III','begins at the low point');
      var leg=[['Three-Act','#a855f7'],['Save the Cat','#d4a017'],["Hero's Journey",'#fb7185'],['Story Circle','#2bd1c0']];
      leg.forEach(function(l,i){var ly=cy-42+i*28;s+='<circle cx="'+(cx-66)+'" cy="'+(ly-4)+'" r="5.5" fill="'+l[1]+'"/>';s+='<text x="'+(cx-52)+'" y="'+ly+'" text-anchor="start" font-family="sans-serif" font-size="12.5" font-weight="600" fill="'+l[1]+'">'+l[0]+'</text>';});
      s+='</svg>';document.getElementById('diag')!.innerHTML=s;
    })();
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
              lightest purple, Act II darker, Act III the darkest. That shading fills the
              lines and slices the circle.
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

          <hr className="my-16 border-white/10" />

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-6">
              As concentric rings — sliced by act
            </h2>
            <div id="diag" className="w-full max-w-[840px] mx-auto" />
          </div>
        </div>
      </section>

    </>
  );
}
