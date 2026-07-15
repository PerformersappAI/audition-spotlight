import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
// Client-side loader: dynamic per-course imports (one chunk per course).
// The SSR entry pre-populates this loader's cache before renderToString,
// so getCourse() returns the course synchronously during prerendering.
// On the client, if the cache is empty for a given slug, we kick off the
// dynamic import and re-render when it resolves.
import { getCourse, loadCourse } from "@/data/courses/loader";


const ARTICLE_CSS = `
.fg-article p { font-size:17px; line-height:1.72; color:rgba(255,255,255,.82); margin-bottom:22px; }
.fg-article h2 { font-family:Fraunces,serif; font-size:28px; line-height:1.15; margin:44px 0 16px; color:#fff; }
.fg-article h3 { font-family:'Inter Tight',sans-serif; font-size:20px; font-weight:700; margin:30px 0 10px; color:#fff; }
.fg-article strong { color:#fff; font-weight:700; }
.fg-article em { color:rgba(255,255,255,.92); }
.fg-article .pullquote { font-family:Fraunces,serif; font-size:25px; line-height:1.35; color:#fff; border-left:3px solid #00d4aa; padding:6px 0 6px 26px; margin:36px 0; font-weight:600; }
.fg-article .callout { background:linear-gradient(135deg,#071820 0%,#0a2a30 100%); border:1px solid rgba(0,212,170,.2); border-radius:14px; padding:24px 26px; margin:34px 0; }
.fg-article .callout-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#00d4aa; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.fg-article .callout p { font-size:15px; line-height:1.65; color:rgba(255,255,255,.75); margin:0; }
.fg-article .spec-list { list-style:none; margin:8px 0 22px; padding:0; }
.fg-article .spec-list li { position:relative; padding:10px 0 10px 30px; border-bottom:1px solid #16161f; font-size:16px; color:rgba(255,255,255,.8); line-height:1.55; }
.fg-article .spec-list li:last-child { border-bottom:none; }
.fg-article .spec-list li::before { content:''; position:absolute; left:4px; top:17px; width:8px; height:8px; border-radius:2px; background:#00d4aa; }
.fg-article .spec-list li b { color:#fff; }
.fg-article a.inline { color:#00d4aa; border-bottom:1px solid rgba(0,212,170,.4); }
.fg-article .beat-list { list-style: none; margin: 8px 0 22px; padding: 0; counter-reset: beat; }
.fg-article .beat-list li { position: relative; padding: 11px 0 11px 44px; border-bottom: 1px solid #16161f; font-size: 15.5px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .beat-list li:last-child { border-bottom: none; }
.fg-article .beat-list li::before { counter-increment: beat; content: counter(beat); position: absolute; left: 0; top: 10px; width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.fg-article .beat-list li b { color: #fff; }
.fg-article .beat-list li .pg { color: rgba(0,212,170,.7); font-weight: 700; font-size: 13px; }
.cc-nav-card:hover { border-color: rgba(0,212,170,.45) !important; transform: translateY(-2px); }
.cc-nav-card { transition: transform .2s, border-color .2s; }
.cc-a:hover { color:#00d4aa !important; }

.fg-article .formula-box { background: #0d0d1a; border: 1px dashed rgba(0,212,170,.4); border-radius: 14px; padding: 24px 26px; margin: 30px 0; font-family: 'Inter Tight', sans-serif; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,.85); }
.fg-article .formula-box em { color: #00d4aa; font-style: normal; font-weight: 700; }
.fg-article .ex-card { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 18px 0; }
.fg-article .ex-card .ex-log { font-family: Fraunces, serif; font-size: 18px; line-height: 1.45; color: #fff; font-weight: 600; margin-bottom: 10px; }
.fg-article .ex-card .ex-why { font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,.62); }
.fg-article .ex-card .ex-why b { color: #00d4aa; font-weight: 700; }
.fg-article .mistake { border-bottom: 1px solid #16161f; padding: 18px 0; }
.fg-article .mistake:last-child { border-bottom: none; }
.fg-article .mistake .m-name { font-family: 'Inter Tight', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fg-article .mistake .m-name .x { color: #ff6b6b; margin-right: 8px; font-weight: 800; }
.fg-article .mistake p { font-size: 15px; line-height: 1.6; color: rgba(255,255,255,.62); margin: 0; }
.fg-article .mistake p .fix { color: #00d4aa; font-weight: 700; }
.fg-article .letter-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 26px 28px; margin: 30px 0; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,.78); }
.fg-article .letter-box .lb-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(0,212,170,.7); margin-bottom: 14px; }
.fg-article .letter-box p { font-size: 15px; margin-bottom: 14px; color: rgba(255,255,255,.78); }
.fg-article .letter-box p:last-child { margin-bottom: 0; }
.fg-article .letter-box .lb-sub { color: #fff; font-weight: 600; }
.fg-article .adapt-ex { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 30px 0 26px; }
@media(max-width:640px){ .fg-article .adapt-ex { grid-template-columns: 1fr; } }
.fg-article .adapt-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 22px; background: #0d0d1a; }
.fg-article .adapt-col.after { border-color: rgba(0,212,170,.3); background: linear-gradient(135deg, #071820 0%, #0a2a30 100%); }
.fg-article .adapt-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 12px; color: rgba(255,255,255,.4); }
.fg-article .adapt-col.after .adapt-tag { color: #00d4aa; }
.fg-article .adapt-prose { font-family: Fraunces, serif; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,.78); font-style: italic; margin: 0; }
.fg-article .adapt-script { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.55; color: rgba(255,255,255,.82); white-space: pre-wrap; margin: 0; }
.fg-article .anatomy { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .anatomy-row { display: flex; gap: 16px; padding: 16px 20px; border-bottom: 1px solid #16161f; }
.fg-article .anatomy-row:last-child { border-bottom: none; }
.fg-article .anatomy-num { font-family: Fraunces, serif; font-size: 18px; font-weight: 700; color: rgba(0,212,170,.5); flex-shrink: 0; width: 28px; }
.fg-article .anatomy-txt { font-size: 15px; line-height: 1.55; color: rgba(255,255,255,.78); }
.fg-article .anatomy-txt b { color: #fff; font-weight: 700; display: block; margin-bottom: 2px; font-family: 'Inter Tight', sans-serif; }
.fg-article .qa-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 28px 0; }
.fg-article .qa-row { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #16161f; }
.fg-article .qa-row:last-child { border-bottom: none; }
.fg-article .qa-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; padding: 3px 9px; border-radius: 9999px; height: fit-content; flex-shrink: 0; width: 62px; text-align: center; }
.fg-article .qa-tag.no { color: #ff8497; background: rgba(255,80,110,.1); border: 1px solid rgba(255,80,110,.25); }
.fg-article .qa-tag.yes { color: #00d4aa; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.28); }
.fg-article .qa-txt { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,.82); font-style: italic; }
.fg-article .diag-box { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 14px; padding: 22px 24px; margin: 28px 0; }
.fg-article .diag-row { display: flex; gap: 16px; padding: 13px 0; border-bottom: 1px solid #16161f; align-items: flex-start; }
.fg-article .diag-row:last-child { border-bottom: none; }
.fg-article .diag-sym { flex: 1; font-size: 14.5px; color: rgba(255,255,255,.62); font-style: italic; line-height: 1.5; }
.fg-article .diag-arrow { color: rgba(0,212,170,.5); font-size: 16px; flex-shrink: 0; padding-top: 1px; }
.fg-article .diag-cause { flex: 1; font-size: 14.5px; color: #fff; line-height: 1.5; }
.fg-article .diag-head { display: flex; gap: 16px; padding-bottom: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.3); }
.fg-article .diag-head span { flex: 1; }
.fg-article .diag-head span:first-child { padding-left: 0; }
.fg-article .eighths-wrap { display: flex; gap: 24px; align-items: center; margin: 30px 0 26px; flex-wrap: wrap; }
.fg-article .page-strip { width: 132px; flex-shrink: 0; border: 1px solid #2a2a3a; border-radius: 6px; overflow: hidden; background: #0d0d1a; }
.fg-article .page-strip .eighth { height: 26px; border-bottom: 1px dashed rgba(255,255,255,.1); display: flex; align-items: center; padding-left: 10px; font-family: 'Courier New', monospace; font-size: 10px; color: rgba(255,255,255,.35); }
.fg-article .page-strip .eighth:last-child { border-bottom: none; }
.fg-article .page-strip .eighth.filled { background: rgba(0,212,170,.14); color: rgba(0,212,170,.85); }
.fg-article .eighths-note { flex: 1; min-width: 220px; }
.fg-article .eighths-note p { font-size: 15px; color: rgba(255,255,255,.72); line-height: 1.6; margin-bottom: 12px; }
.fg-article .eighths-note p:last-child { margin-bottom: 0; }
.fg-article .eighths-note b { color: #fff; }
.fg-article .legend { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .legend-row { display: flex; align-items: center; gap: 14px; padding: 12px 18px; border-bottom: 1px solid #16161f; }
.fg-article .legend-row:last-child { border-bottom: none; }
.fg-article .swatch { width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0; border: 1px solid rgba(255,255,255,.18); }
.fg-article .legend-el { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; width: 150px; flex-shrink: 0; }
.fg-article .legend-desc { font-size: 14px; color: rgba(255,255,255,.6); line-height: 1.45; }
.fg-article .script-sample { background: #f5f3ec; color: #1a1a1a; border-radius: 12px; padding: 24px 26px; margin: 28px 0; font-family: 'Courier New', monospace; font-size: 13.5px; line-height: 1.7; }
.fg-article .script-sample .sl { font-weight: 700; margin-bottom: 8px; }
.fg-article .script-sample mark { padding: 0 2px; border-radius: 2px; font-weight: 700; }
.fg-article .m-cast { background: #ffb3b5; }
.fg-article .m-prop { background: #d7bdf5; }
.fg-article .m-ward { background: #a9e4c4; }
.fg-article .m-veh { background: #ffc0dd; }
.fg-article .m-bg { background: #ffe89a; }
.fg-article .sample-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 16px; font-size: 11px; color: #555; }
.fg-article .sample-legend span { display: inline-flex; align-items: center; gap: 5px; }
.fg-article .sample-legend i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
.fg-article .bd-sheet { background: #f5f3ec; color: #1a1a1a; border-radius: 12px; overflow: hidden; margin: 28px 0; font-family: 'Inter Tight', sans-serif; border: 1px solid #d8d4c6; }
.fg-article .bd-title { background: #1a1a1a; color: #fff; padding: 10px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; display: flex; justify-content: space-between; }
.fg-article .bd-hdr { display: grid; grid-template-columns: repeat(4,1fr); border-bottom: 2px solid #1a1a1a; }
.fg-article .bd-hdr .cell { padding: 8px 12px; border-right: 1px solid #ccc7b6; font-size: 12px; }
.fg-article .bd-hdr .cell:last-child { border-right: none; }
.fg-article .bd-hdr .lab { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #888; display: block; margin-bottom: 2px; }
.fg-article .bd-hdr .val { font-weight: 700; }
.fg-article .bd-grid { display: grid; grid-template-columns: 1fr 1fr; }
@media(max-width:560px){ .fg-article .bd-grid { grid-template-columns: 1fr; } }
.fg-article .bd-box { border-right: 1px solid #ccc7b6; border-bottom: 1px solid #ccc7b6; padding: 10px 12px; min-height: 56px; }
.fg-article .bd-box .bl { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; margin-bottom: 5px; }
.fg-article .bd-box .bv { font-size: 12.5px; color: #333; line-height: 1.5; }
.fg-article .bl-cast { color: #c0392b; }
.fg-article .bl-prop { color: #7b4fb5; }
.fg-article .bl-ward { color: #1f8a52; }
.fg-article .bl-veh { color: #c72c7f; }
.fg-article .bl-bg { color: #b8860b; }
.fg-article .bl-mk { color: #8a6d3b; }
.fg-article .stripboard { display: flex; gap: 3px; margin: 30px 0 8px; overflow-x: auto; padding-bottom: 6px; }
.fg-article .strip { width: 42px; flex-shrink: 0; border-radius: 4px; padding: 8px 0; min-height: 190px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; font-family: 'Courier New', monospace; }
.fg-article .strip .s-num { font-size: 12px; font-weight: 700; }
.fg-article .strip .s-body { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px; line-height: 1.3; letter-spacing: .04em; }
.fg-article .strip .s-len { font-size: 10px; }
.fg-article .strip.day { background: #f5efab; color: #4a3f00; }
.fg-article .strip.night { background: #2e3a55; color: #cfe0ff; }
.fg-article .strip.board-div { background: #1a1a1a; color: #fff; width: 30px; }
.fg-article .strip.board-div .s-body { color: #ffd24a; font-weight: 700; }
.fg-article .strip-legend { display: flex; gap: 18px; font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 26px; }
.fg-article .strip-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .strip-legend i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.fg-article .dood { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .dood table { width: 100%; border-collapse: collapse; font-family: 'Courier New', monospace; font-size: 12.5px; }
.fg-article .dood th { background: #0d0d1a; color: rgba(255,255,255,.5); font-weight: 700; padding: 9px 8px; text-align: center; border-bottom: 1px solid #1e1e35; text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
.fg-article .dood th.lft, .fg-article .dood td.lft { text-align: left; padding-left: 14px; }
.fg-article .dood td { padding: 9px 8px; text-align: center; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.7); }
.fg-article .dood tr:last-child td { border-bottom: none; }
.fg-article .dood .sw { color: #00d4aa; font-weight: 700; }
.fg-article .dood .wk { color: rgba(255,255,255,.85); }
.fg-article .dood .fn { color: #ec6a6a; font-weight: 700; }
.fg-article .dood .hd { color: rgba(255,255,255,.25); }
.fg-article .sb-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin: 30px 0 26px; }
@media(max-width:560px){ .fg-article .sb-row { grid-template-columns: 1fr 1fr; } }
.fg-article .sb-panel { border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; background: #0d0d1a; }
.fg-article .sb-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; display: flex; align-items: center; justify-content: center; }
.fg-article .sb-frame svg { width: 78%; height: 78%; }
.fg-article .sb-frame .stroke { stroke: rgba(0,212,170,.55); stroke-width: 2; fill: none; }
.fg-article .sb-frame .soft { stroke: rgba(255,255,255,.18); stroke-width: 1.5; fill: none; }
.fg-article .sb-cap { padding: 8px 10px; font-size: 11px; color: rgba(255,255,255,.5); border-top: 1px solid #1e1e35; display: flex; justify-content: space-between; font-family: 'Inter Tight', sans-serif; }
.fg-article .sb-cap b { color: rgba(0,212,170,.8); font-weight: 700; }
.fg-article .script-sample .shotmark { color: #0a8f74; font-weight: 700; }
.fg-article .shots-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin: 30px 0 26px; }
@media(max-width:640px){ .fg-article .shots-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .shot-cell { border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; background: #0d0d1a; }
.fg-article .shot-fr { aspect-ratio: 4/3; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; overflow: hidden; }
.fg-article .shot-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .shot-fr .fig { stroke: rgba(0,212,170,.6); stroke-width: 2.5; fill: none; }
.fg-article .shot-lab { padding: 7px 10px; border-top: 1px solid #1e1e35; }
.fg-article .shot-lab b { display: block; font-size: 12px; color: #fff; font-weight: 700; }
.fg-article .shot-lab span { font-size: 10px; color: rgba(255,255,255,.45); }
.fg-article .draw-panel { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 420px; }
.fg-article .draw-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .draw-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .draw-frame .fig { stroke: rgba(0,212,170,.65); stroke-width: 2; fill: none; }
.fg-article .draw-frame .box { stroke: rgba(255,255,255,.3); stroke-width: 1.5; fill: none; }
.fg-article .draw-frame .arrow { stroke: #ffd24a; stroke-width: 2; fill: none; }
.fg-article .draw-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); font-family: 'Inter Tight', sans-serif; display: flex; justify-content: space-between; }
.fg-article .draw-cap b { color: rgba(0,212,170,.8); }
.fg-article .thirds { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 460px; }
.fg-article .thirds-frame { aspect-ratio: 16/9; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .thirds-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .thirds-frame .grid { stroke: rgba(255,255,255,.22); stroke-width: 1; }
.fg-article .thirds-frame .node { fill: rgba(0,212,170,.7); }
.fg-article .thirds-frame .fig { stroke: rgba(0,212,170,.7); stroke-width: 2.5; fill: none; }
.fg-article .thirds-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .thirds-cap b { color: rgba(0,212,170,.8); }
.fg-article .arrow-legend { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 26px; }
@media(max-width:560px){ .fg-article .arrow-legend { grid-template-columns: 1fr 1fr; } }
.fg-article .arrow-cell { border: 1px solid #2a2a3a; border-radius: 10px; overflow: hidden; background: #0d0d1a; }
.fg-article .arrow-fr { aspect-ratio: 16/10; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .arrow-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .arrow-fr .cam { stroke: #ffd24a; stroke-width: 2.5; fill: none; }
.fg-article .arrow-fr .subj { stroke: rgba(0,212,170,.75); stroke-width: 2.5; fill: none; }
.fg-article .arrow-fr .fig { stroke: rgba(255,255,255,.3); stroke-width: 2; fill: none; }
.fg-article .arrow-lab { padding: 7px 10px; border-top: 1px solid #1e1e35; }
.fg-article .arrow-lab b { display: block; font-size: 12px; color: #fff; font-weight: 700; }
.fg-article .arrow-lab span { font-size: 10px; color: rgba(255,255,255,.45); }
.fg-article .diag180 { border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin: 30px 0 26px; max-width: 460px; }
.fg-article .diag180-fr { aspect-ratio: 16/10; background: linear-gradient(160deg,#12121e 0%,#0a0a14 100%); position: relative; }
.fg-article .diag180-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .diag180-fr .line { stroke: #ec6a6a; stroke-width: 1.5; stroke-dasharray: 4 3; }
.fg-article .diag180-fr .actor { fill: rgba(0,212,170,.75); }
.fg-article .diag180-fr .cam { fill: #ffd24a; }
.fg-article .diag180-fr .ok { stroke: rgba(0,212,170,.5); stroke-width: 1.5; fill: none; }
.fg-article .diag180-fr .no { stroke: #ec6a6a; stroke-width: 1.5; fill: none; }
.fg-article .diag180-cap { padding: 9px 12px; border-top: 1px solid #1e1e35; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .diag180-cap b { color: rgba(0,212,170,.8); }
.fg-article .shotlist { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .shotlist table { width: 100%; border-collapse: collapse; font-size: 13px; }
.fg-article .shotlist th { background: #0d0d1a; color: rgba(255,255,255,.5); font-weight: 700; padding: 9px 10px; text-align: left; border-bottom: 1px solid #1e1e35; text-transform: uppercase; font-size: 10px; letter-spacing: .05em; }
.fg-article .shotlist td { padding: 9px 10px; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.75); vertical-align: top; }
.fg-article .shotlist tr:last-child td { border-bottom: none; }
.fg-article .shotlist td.n { color: #00d4aa; font-weight: 700; font-family: 'Courier New', monospace; }
.fg-article .shotlist td.sz { font-family: 'Courier New', monospace; color: rgba(255,255,255,.9); }
.fg-article .atlbtl { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 30px 0 26px; }
.fg-article .atl-half, .fg-article .btl-half { padding: 18px 22px; }
.fg-article .atl-half { background: rgba(168,85,247,.08); }
.fg-article .btl-half { background: rgba(0,212,170,.06); }
.fg-article .abtl-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 10px; }
.fg-article .atl-half .abtl-tag { color: #c084fc; }
.fg-article .btl-half .abtl-tag { color: #00d4aa; }
.fg-article .abtl-items { display: flex; flex-wrap: wrap; gap: 8px; }
.fg-article .abtl-items span { font-size: 13px; padding: 5px 11px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.8); }
.fg-article .the-line { text-align: center; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .1em; color: #ffd24a; background: #0d0d1a; padding: 6px 0; border-top: 1px dashed rgba(255,210,74,.5); border-bottom: 1px dashed rgba(255,210,74,.5); }
.fg-article .bstruct { background: #0d0d1a; border: 1px solid #1e1e35; border-radius: 12px; padding: 20px 24px; margin: 28px 0; font-family: 'Courier New', monospace; font-size: 13.5px; line-height: 1.9; }
.fg-article .bstruct .acct { color: #c084fc; font-weight: 700; }
.fg-article .bstruct .cat { color: #00d4aa; }
.fg-article .bstruct .li { color: rgba(255,255,255,.7); }
.fg-article .bstruct .ind1 { padding-left: 22px; }
.fg-article .bstruct .ind2 { padding-left: 46px; }
.fg-article .bstruct .amt { float: right; color: rgba(255,255,255,.5); }
.fg-article .topsheet { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; font-size: 14px; }
.fg-article .topsheet .ts-title { background: #0d0d1a; padding: 14px 20px; font-family: Fraunces, serif; font-size: 16px; color: #fff; border-bottom: 1px solid #1e1e35; }
.fg-article .ts-row { display: grid; grid-template-columns: 54px 1fr auto; gap: 12px; padding: 9px 20px; border-bottom: 1px solid #16161f; align-items: center; }
.fg-article .ts-row .num { font-family: 'Courier New', monospace; color: rgba(255,255,255,.4); font-size: 13px; }
.fg-article .ts-row .name { color: rgba(255,255,255,.82); }
.fg-article .ts-row .amt { font-family: 'Courier New', monospace; color: rgba(255,255,255,.65); float: none; }
.fg-article .ts-row.sub { background: rgba(168,85,247,.05); }
.fg-article .ts-row.sub .name { color: #c084fc; font-weight: 600; }
.fg-article .ts-row.total { background: rgba(0,212,170,.07); border-bottom: none; }
.fg-article .ts-row.total .name { color: #00d4aa; font-weight: 700; }
.fg-article .ts-row.total .amt { color: #00d4aa; font-weight: 700; }
.fg-article .fringe { margin: 28px 0; border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; }
.fg-article .fringe-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-bottom: 1px solid #16161f; font-size: 15px; }
.fg-article .fringe-row:last-child { border-bottom: none; }
.fg-article .fringe-row .lbl { color: rgba(255,255,255,.82); }
.fg-article .fringe-row .val { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); }
.fg-article .fringe-row.base { background: rgba(0,212,170,.06); }
.fg-article .fringe-row.base .lbl { color: #00d4aa; font-weight: 600; }
.fg-article .fringe-row.add .lbl { padding-left: 14px; color: rgba(255,255,255,.7); }
.fg-article .fringe-row.add .lbl::before { content: '+ '; color: #c084fc; }
.fg-article .fringe-row.total { background: rgba(168,85,247,.09); }
.fg-article .fringe-row.total .lbl { color: #c084fc; font-weight: 700; }
.fg-article .fringe-row.total .val { color: #c084fc; font-weight: 700; }
.fg-article .deptgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .deptgrid { grid-template-columns: 1fr; } }
.fg-article .dept { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .dept h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .dept p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .contbar { margin: 30px 0 10px; }
.fg-article .contbar-track { display: flex; height: 54px; border-radius: 10px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .contbar-main { flex: 0 0 90%; background: rgba(0,212,170,.14); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #00d4aa; }
.fg-article .contbar-cont { flex: 0 0 10%; background: rgba(168,85,247,.22); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #c084fc; text-align: center; }
.fg-article .contbar-cap { font-size: 12.5px; color: rgba(255,255,255,.4); margin-top: 8px; text-align: center; }
.fg-article .strips { margin: 28px 0; border-radius: 10px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .strips .strip { display: grid; grid-template-columns: 34px 1fr auto; gap: 10px; align-items: center; padding: 9px 14px; font-size: 13px; border-bottom: 1px solid rgba(0,0,0,.3); width: auto; min-height: 0; flex-direction: row; border-radius: 0; font-family: inherit; }
.fg-article .strips .strip .sc { font-family: 'Courier New', monospace; font-weight: 700; }
.fg-article .strips .strip .desc { font-weight: 500; }
.fg-article .strips .strip .tag { font-size: 11px; opacity: .85; }
.fg-article .strips .strip.loc-a { background: rgba(0,212,170,.16); color: #0a0a12; }
.fg-article .strips .strip.loc-b { background: rgba(168,85,247,.20); color: #0a0a12; }
.fg-article .strips .strip.loc-c { background: rgba(255,210,74,.20); color: #0a0a12; }
.fg-article .strips .strip.brk { background: #0d0d1a; color: #00d4aa; grid-template-columns: 1fr; text-align: center; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .1em; }
.fg-article .daycost { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .daycost-head { background: rgba(168,85,247,.10); padding: 13px 20px; font-family: Fraunces, serif; font-size: 16px; color: #c084fc; border-bottom: 1px solid #1e1e35; }
.fg-article .daycost-row { display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; }
.fg-article .daycost-row .l { color: rgba(255,255,255,.75); }
.fg-article .daycost-row .r { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); }
.fg-article .daycost-row.tot { background: rgba(0,212,170,.08); border-bottom: none; }
.fg-article .daycost-row.tot .l { color: #00d4aa; font-weight: 700; }
.fg-article .daycost-row.tot .r { color: #00d4aa; font-weight: 700; }
.fg-article .costrep { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; font-size: 13px; }
.fg-article .costrep .cr-head, .fg-article .costrep .cr-row { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 8px; padding: 10px 16px; align-items: center; }
.fg-article .costrep .cr-head { background: #0d0d1a; border-bottom: 1px solid #1e1e35; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: rgba(255,255,255,.45); }
.fg-article .costrep .cr-row { border-bottom: 1px solid #16161f; }
.fg-article .costrep .cr-row:last-child { border-bottom: none; }
.fg-article .costrep .cr-row .nm { color: rgba(255,255,255,.8); }
.fg-article .costrep .cr-row .n { font-family: 'Courier New', monospace; color: rgba(255,255,255,.6); text-align: right; }
.fg-article .costrep .cr-row .var-good { font-family: 'Courier New', monospace; color: #00d4aa; text-align: right; font-weight: 700; }
.fg-article .costrep .cr-row .var-bad { font-family: 'Courier New', monospace; color: #ff6b6b; text-align: right; font-weight: 700; }
.fg-article .costrep .cr-row.tot { background: rgba(0,212,170,.06); }
.fg-article .costrep .cr-row.tot .nm { color: #fff; font-weight: 700; }
.fg-article .mistakes { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .mistakes li { position: relative; padding: 12px 0 12px 38px; border-bottom: 1px solid #16161f; font-size: 16px; color: rgba(255,255,255,.8); line-height: 1.55; }
.fg-article .mistakes li:last-child { border-bottom: none; }
.fg-article .mistakes li b { color: #fff; }
.fg-article .mistakes li::before { content: '✕'; position: absolute; left: 6px; top: 12px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.4); color: #ff6b6b; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.fg-article .roles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .roles { grid-template-columns: 1fr; } }
.fg-article .role { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 22px; background: #0d0d1a; }
.fg-article .role h4 { font-family: Fraunces, serif; font-size: 19px; color: #fff; margin-bottom: 4px; }
.fg-article .role .when { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .role ul { list-style: none; padding: 0; }
.fg-article .role li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .role li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; align-items: stretch; }
@media(max-width:600px){ .fg-article .breakdown { grid-template-columns: 1fr; } }
.fg-article .bd-col { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; }
.fg-article .bd-col-head { padding: 10px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; border-bottom: 1px solid #1e1e35; }
.fg-article .bd-script .bd-col-head { background: rgba(255,255,255,.04); color: rgba(255,255,255,.5); }
.fg-article .bd-list .bd-col-head { background: rgba(0,212,170,.08); color: #00d4aa; }
.fg-article .bd-script .row { padding: 8px 16px; font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.65); border-bottom: 1px solid #16161f; }
.fg-article .bd-script .row:last-child { border-bottom: none; }
.fg-article .bd-list .row { padding: 9px 16px; font-size: 13px; color: rgba(255,255,255,.8); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; gap: 8px; }
.fg-article .bd-list .row:last-child { border-bottom: none; }
.fg-article .bd-list .row b { color: #fff; }
.fg-article .bd-list .row .cnt { color: #00d4aa; font-family: 'Courier New', monospace; font-size: 12px; white-space: nowrap; }
.fg-article .srcgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .srcgrid { grid-template-columns: 1fr; } }
.fg-article .src { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .src h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .src p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .checklist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .cl-cat { border-bottom: 1px solid #1e1e35; }
.fg-article .cl-cat:last-child { border-bottom: none; }
.fg-article .cl-cat-head { display: flex; align-items: center; gap: 10px; padding: 12px 18px; background: rgba(0,212,170,.05); font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; }
.fg-article .cl-cat-head .n { width: 22px; height: 22px; border-radius: 6px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 11px; }
.fg-article .cl-items { padding: 10px 18px 14px 50px; }
.fg-article .cl-items span { display: inline-block; font-size: 13px; color: rgba(255,255,255,.7); background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); padding: 4px 11px; border-radius: 9999px; margin: 4px 6px 0 0; }
.fg-article .reportcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .rc-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.fg-article .rc-head .t { font-family: Fraunces, serif; font-size: 18px; color: #fff; }
.fg-article .rc-head .s { font-size: 12px; color: #00d4aa; font-family: 'Courier New', monospace; }
.fg-article .rc-photos { display: grid; grid-template-columns: repeat(4,1fr); gap: 4px; padding: 4px; }
@media(max-width:600px){ .fg-article .rc-photos { grid-template-columns: repeat(2,1fr); } }
.fg-article .rc-ph { aspect-ratio: 4/3; border-radius: 4px; display: flex; align-items: flex-end; padding: 6px; font-size: 9px; color: rgba(255,255,255,.5); font-family: 'Inter Tight', sans-serif; text-transform: uppercase; letter-spacing: .04em; }
.fg-article .rc-ph.a { background: linear-gradient(150deg,#0b2d35,#071c20); }
.fg-article .rc-ph.b { background: linear-gradient(150deg,#0a1030,#050510); }
.fg-article .rc-ph.c { background: linear-gradient(150deg,#00180e,#080816); }
.fg-article .rc-ph.d { background: linear-gradient(150deg,#141035,#0a0818); }
.fg-article .rc-meta { padding: 12px 20px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 13px; }
@media(max-width:600px){ .fg-article .rc-meta { grid-template-columns: 1fr; } }
.fg-article .rc-meta div { color: rgba(255,255,255,.7); }
.fg-article .rc-meta div b { color: #fff; }
.fg-article .logimap { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; margin: 28px 0; background: #0d0d1a; }
.fg-article .logimap-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); margin-bottom: 14px; }
.fg-article .logimap-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
@media(max-width:600px){ .fg-article .logimap-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .zone { border-radius: 10px; padding: 14px 12px; text-align: center; border: 1px solid rgba(255,255,255,.08); }
.fg-article .zone .zi { width: 30px; height: 30px; margin: 0 auto 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.fg-article .zone .zi svg { width: 16px; height: 16px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .zone .zt { font-size: 12px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; margin-bottom: 2px; }
.fg-article .zone .zd { font-size: 11px; color: rgba(255,255,255,.5); line-height: 1.4; }
.fg-article .zone.set { background: rgba(0,212,170,.08); border-color: rgba(0,212,170,.25); }
.fg-article .zone.set .zi { background: rgba(0,212,170,.16); }
.fg-article .zone.support { background: rgba(168,85,247,.06); border-color: rgba(168,85,247,.2); }
.fg-article .zone.support .zi { background: rgba(168,85,247,.14); }
.fg-article .zone.support .zi svg { stroke: #c084fc; }
.fg-article .pvp { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .pvp { grid-template-columns: 1fr; } }
.fg-article .pvp-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .pvp-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
.fg-article .pvp-col .who { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .pvp-col ul { list-style: none; padding: 0; }
.fg-article .pvp-col li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .pvp-col li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .agdoc { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .agdoc-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .agdoc-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .agrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .agrow:last-child { border-bottom: none; }
.fg-article .agrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .agrow .c b { color: #fff; font-size: 14px; }
.fg-article .agrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .coststack { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .cs-head { background: rgba(168,85,247,.10); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #c084fc; border-bottom: 1px solid #1e1e35; }
.fg-article .cs-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 18px; border-bottom: 1px solid #16161f; font-size: 14px; }
.fg-article .cs-row .l { color: rgba(255,255,255,.78); }
.fg-article .cs-row .r { font-family: 'Courier New', monospace; color: rgba(255,255,255,.55); font-size: 13px; }
.fg-article .cs-row.base { background: rgba(0,212,170,.06); }
.fg-article .cs-row.base .l { color: #00d4aa; font-weight: 600; }
.fg-article .cs-row.tot { background: rgba(168,85,247,.09); border-bottom: none; }
.fg-article .cs-row.tot .l { color: #c084fc; font-weight: 700; }
.fg-article .cs-row.tot .r { color: #c084fc; font-weight: 700; }
.fg-article .timeline { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .tl-row { display: grid; grid-template-columns: 92px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .tl-row:last-child { border-bottom: none; }
.fg-article .tl-time { background: rgba(0,212,170,.06); padding: 12px 14px; font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; font-weight: 700; display: flex; align-items: center; }
.fg-article .tl-what { padding: 12px 16px; font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .tl-what b { color: #fff; }
.fg-article .wrapout { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .wrapout li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .wrapout li:last-child { border-bottom: none; }
.fg-article .wrapout li b { color: #fff; }
.fg-article .wrapout li::before { content: '✓'; position: absolute; left: 4px; top: 11px; width: 20px; height: 20px; border-radius: 6px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.35); color: #00d4aa; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

.fg-article .funnel { display: flex; flex-direction: column; gap: 6px; margin: 28px 0; }
.fg-article .fstep { border: 1px solid #1e1e35; border-radius: 10px; padding: 12px 18px; background: #0d0d1a; display: flex; align-items: center; gap: 14px; }
.fg-article .fstep .fn { width: 24px; height: 24px; border-radius: 6px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; flex-shrink: 0; }
.fg-article .fstep .fx { font-size: 14px; color: rgba(255,255,255,.8); }
.fg-article .fstep .fx b { color: #fff; }
.fg-article .fstep.s2 { margin: 0 4%; }
.fg-article .fstep.s3 { margin: 0 8%; }
.fg-article .fstep.s4 { margin: 0 12%; border-color: rgba(0,212,170,.35); }
.fg-article .resp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .resp { grid-template-columns: 1fr; } }
.fg-article .rcard { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .rcard h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .rcard p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .bdcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .bdcard-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.fg-article .bdcard-head .nm { font-family: Fraunces, serif; font-size: 19px; color: #fff; }
.fg-article .bdcard-head .role { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.25); padding: 3px 10px; border-radius: 9999px; }
.fg-article .bdrow { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; align-items: baseline; }
.fg-article .bdrow:last-child { border-bottom: none; }
.fg-article .bdrow .k { color: rgba(255,255,255,.45); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .bdrow .v { color: rgba(255,255,255,.8); line-height: 1.55; }
@media(max-width:600px){ .fg-article .bdrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .callmock { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .callmock-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .cmrow { padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; display: grid; grid-template-columns: 120px 1fr; gap: 12px; align-items: baseline; }
.fg-article .cmrow:last-child { border-bottom: none; }
.fg-article .cmrow .k { color: rgba(255,255,255,.45); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .cmrow .v { color: rgba(255,255,255,.8); line-height: 1.5; }
@media(max-width:600px){ .fg-article .cmrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .redflags { list-style: none; margin: 10px 0 22px; padding: 0; }
.fg-article .redflags li { position: relative; padding: 11px 0 11px 34px; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .redflags li:last-child { border-bottom: none; }
.fg-article .redflags li b { color: #fff; }
.fg-article .redflags li::before { content: '!'; position: absolute; left: 5px; top: 11px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.4); color: #ff6b6b; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.fg-article .flow { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .fnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; }
.fg-article .fnode .fn { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .fnode .ft { font-size: 14px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .fnode .ft b { color: #fff; }
.fg-article .farrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .pairing { display: flex; align-items: center; justify-content: center; gap: 0; margin: 30px 0; flex-wrap: wrap; }
.fg-article .pcard { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 22px; background: #0d0d1a; text-align: center; min-width: 150px; }
.fg-article .pcard .pav { width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-family: 'Inter Tight', sans-serif; font-weight: 800; font-size: 15px; }
.fg-article .pcard.a .pav { background: linear-gradient(135deg,#00d4aa,#0099ff); color: #000; }
.fg-article .pcard.b .pav { background: linear-gradient(135deg,#a855f7,#6d28d9); color: #fff; }
.fg-article .pcard .pn { font-size: 14px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; }
.fg-article .pcard .pr { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 2px; }
.fg-article .pspark { display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.fg-article .pspark svg { width: 30px; height: 30px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pspark span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-top: 4px; }
@media(max-width:600px){ .fg-article .pspark { padding: 12px 0; } }
.fg-article .scard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .scard-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.45); border-bottom: 1px solid #1e1e35; }
.fg-article .scrow { display: grid; grid-template-columns: 160px 1fr; gap: 14px; padding: 12px 20px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .scrow:last-child { border-bottom: none; }
.fg-article .scrow .k { font-size: 14px; font-weight: 700; color: #00d4aa; }
.fg-article .scrow .v { font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .scrow { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .disclaimer { background: rgba(255,210,74,.06); border: 1px solid rgba(255,210,74,.25); border-radius: 12px; padding: 16px 20px; margin: 30px 0; font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.6; }
.fg-article .disclaimer b { color: #ffd24a; font-weight: 700; }
.fg-article .offer { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .offer-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .offer-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .ofrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .ofrow:last-child { border-bottom: none; }
.fg-article .ofrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .ofrow .c b { color: #fff; font-size: 14px; }
.fg-article .ofrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .reqcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .reqcard-head { background: #0d0d1a; padding: 13px 20px; border-bottom: 1px solid #1e1e35; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; }
.fg-article .reqrow { display: grid; grid-template-columns: 150px 1fr; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #16161f; font-size: 14px; align-items: baseline; }
.fg-article .reqrow:last-child { border-bottom: none; }
.fg-article .reqrow .k { color: rgba(255,255,255,.5); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article .reqrow .v { color: rgba(255,255,255,.8); line-height: 1.5; }
@media(max-width:600px){ .fg-article .reqrow { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .proscons { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .proscons { grid-template-columns: 1fr; } }
.fg-article .pc-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .pc-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .pc-pro h4 { color: #00d4aa; }
.fg-article .pc-con h4 { color: #ff9d5c; }
.fg-article .pc-col ul { list-style: none; padding: 0; }
.fg-article .pc-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .pc-col li:last-child { border-bottom: none; }
.fg-article .pc-pro li::before { content: '+'; position: absolute; left: 3px; top: 6px; color: #00d4aa; font-weight: 700; }
.fg-article .pc-con li::before { content: '–'; position: absolute; left: 4px; top: 6px; color: #ff9d5c; font-weight: 700; }
.fg-article .tiers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .tiers { grid-template-columns: 1fr; } }
.fg-article .tier { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .tier h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .tier p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .roles:has(.rrow) { display: block; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; grid-template-columns: none; gap: 0; }
.fg-article .roles .rrow { display: grid; grid-template-columns: 210px 1fr; gap: 14px; padding: 12px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .roles .rrow:last-child { border-bottom: none; }
.fg-article .roles .rrow .r { font-size: 14px; font-weight: 700; color: #00d4aa; }
.fg-article .roles .rrow .r span { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
.fg-article .roles .rrow .d { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
@media(max-width:600px){ .fg-article .roles .rrow { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .roles .grp-label { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); background: #0d0d1a; padding: 9px 18px; border-bottom: 1px solid #1e1e35; display: block; }
.fg-article .hier { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .htier { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; }
.fg-article .htier .hl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; margin-bottom: 6px; }
.fg-article .htier .hp { font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .htier .hp b { color: #fff; }
.fg-article .htier.t1 { border-color: rgba(168,85,247,.35); background: rgba(168,85,247,.06); }
.fg-article .htier.t1 .hl { color: #c084fc; }
.fg-article .htier.t2 { border-color: rgba(0,212,170,.35); }
.fg-article .htier.t3 { margin: 0 5%; }
.fg-article .lookfor { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .lookfor { grid-template-columns: 1fr; } }
.fg-article .lf-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .lf-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .lf-good h4 { color: #00d4aa; }
.fg-article .lf-bad h4 { color: #ff9d5c; }
.fg-article .lf-col ul { list-style: none; padding: 0; }
.fg-article .lf-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .lf-col li:last-child { border-bottom: none; }
.fg-article .lf-good li::before { content: '✓'; position: absolute; left: 2px; top: 7px; color: #00d4aa; font-weight: 700; font-size: 12px; }
.fg-article .lf-bad li::before { content: '!'; position: absolute; left: 5px; top: 7px; color: #ff9d5c; font-weight: 700; }
.fg-article .qcard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .qcat { border-bottom: 1px solid #1e1e35; }
.fg-article .qcat:last-child { border-bottom: none; }
.fg-article .qcat-head { padding: 11px 18px; background: rgba(0,212,170,.05); font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; }
.fg-article .qcat ul { list-style: none; padding: 8px 18px 12px; }
.fg-article .qcat li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; }
.fg-article .qcat li::before { content: '“'; position: absolute; left: 2px; top: 5px; color: rgba(0,212,170,.6); font-weight: 700; font-family: Georgia, serif; }
.fg-article .flags { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .flags { grid-template-columns: 1fr; } }
.fg-article .fl-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .fl-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.fg-article .fl-green h4 { color: #00d4aa; }
.fg-article .fl-red h4 { color: #ff9d5c; }
.fg-article .fl-col ul { list-style: none; padding: 0; }
.fg-article .fl-col li { position: relative; padding: 7px 0 7px 20px; font-size: 14px; color: rgba(255,255,255,.74); line-height: 1.5; border-bottom: 1px solid #14141d; }
.fg-article .fl-col li:last-child { border-bottom: none; }
.fg-article .fl-green li::before { content: '✓'; position: absolute; left: 2px; top: 7px; color: #00d4aa; font-weight: 700; font-size: 12px; }
.fg-article .fl-red li::before { content: '!'; position: absolute; left: 5px; top: 7px; color: #ff9d5c; font-weight: 700; }
.fg-article .qlist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .qlist-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.45); border-bottom: 1px solid #1e1e35; }
.fg-article .qi { padding: 11px 20px 11px 44px; border-bottom: 1px solid #16161f; font-size: 14.5px; color: rgba(255,255,255,.8); line-height: 1.5; position: relative; }
.fg-article .qi:last-child { border-bottom: none; }
.fg-article .qi::before { content: '“'; position: absolute; left: 20px; top: 12px; color: rgba(0,212,170,.7); font-weight: 700; font-family: Georgia, serif; font-size: 18px; }
.fg-article .qi b { color: #fff; }
.fg-article .deal { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .deal-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .deal-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; padding: 11px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .deal-row:last-child { border-bottom: none; }
.fg-article .deal-row .k { font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .deal-row .v { font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .deal-row { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .memo { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .memo-head { background: #0d0d1a; padding: 14px 20px; border-bottom: 1px solid #1e1e35; font-family: Fraunces, serif; font-size: 17px; color: #fff; display: flex; align-items: center; gap: 10px; }
.fg-article .memo-head svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .mrow { display: grid; grid-template-columns: 26px 1fr; gap: 12px; padding: 11px 20px; border-bottom: 1px solid #16161f; align-items: start; }
.fg-article .mrow:last-child { border-bottom: none; }
.fg-article .mrow .n { font-family: 'Courier New', monospace; font-size: 12px; color: #00d4aa; padding-top: 2px; }
.fg-article .mrow .c b { color: #fff; font-size: 14px; }
.fg-article .mrow .c p { font-size: 13px; color: rgba(255,255,255,.6); margin: 2px 0 0; line-height: 1.45; }
.fg-article .team { margin: 28px 0; }
.fg-article .team-head { border: 1px solid rgba(168,85,247,.35); background: rgba(168,85,247,.06); border-radius: 12px; padding: 12px 18px; text-align: center; max-width: 240px; margin: 0 auto 4px; }
.fg-article .team-head .l { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #c084fc; }
.fg-article .team-head .n { font-size: 15px; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; }
.fg-article .team-stem { width: 2px; height: 16px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .team-crew { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
@media(max-width:600px){ .fg-article .team-crew { grid-template-columns: 1fr; } }
.fg-article .team-crew div { border: 1px solid #1e1e35; border-radius: 10px; padding: 10px 12px; background: #0d0d1a; text-align: center; font-size: 13px; color: rgba(255,255,255,.75); }
.fg-article .team-crew div b { color: #fff; display: block; font-size: 13px; }
.fg-article .team-cap { text-align: center; font-size: 12.5px; color: rgba(255,255,255,.4); margin-top: 10px; }
.fg-article .chain { display: flex; flex-direction: column; gap: 0; margin: 28px 0; align-items: center; }
.fg-article .cnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 12px 20px; background: #0d0d1a; text-align: center; min-width: 260px; }
.fg-article .cnode .cl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; }
.fg-article .cnode .cd { font-size: 13px; color: rgba(255,255,255,.7); margin-top: 2px; }
.fg-article .cnode .cd b { color: #fff; }
.fg-article .cnode.top { border-color: rgba(168,85,247,.35); background: rgba(168,85,247,.06); }
.fg-article .cnode.top .cl { color: #c084fc; }
.fg-article .carrow { width: 2px; height: 16px; background: rgba(0,212,170,.3); }
.fg-article .covers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .covers { grid-template-columns: 1fr; } }
.fg-article .cov { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .cov h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .cov p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .dlist { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .dlist-head { background: #0d0d1a; padding: 12px 20px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .dl-scene { padding: 10px 20px; border-bottom: 1px solid #16161f; }
.fg-article .dl-scene:last-child { border-bottom: none; }
.fg-article .dl-scene .sc { font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 6px; }
.fg-article .dl-scene .tags { display: flex; flex-wrap: wrap; gap: 6px; }
.fg-article .dl-scene .tags span { font-size: 12px; padding: 3px 10px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.78); }
.fg-article .dl-scene .tags span.hero { color: #00d4aa; border-color: rgba(0,212,170,.35); background: rgba(0,212,170,.08); }
.fg-article .moodboard { border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; margin: 28px 0; }
.fg-article .mb-head { background: #0d0d1a; padding: 12px 18px; font-family: Fraunces, serif; font-size: 16px; color: #fff; border-bottom: 1px solid #1e1e35; }
.fg-article .mb-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 70px; gap: 5px; padding: 5px; }
@media(max-width:600px){ .fg-article .mb-grid { grid-template-columns: repeat(3,1fr); } }
.fg-article .mb-grid div { border-radius: 5px; display: flex; align-items: flex-end; padding: 6px; font-size: 9px; color: rgba(255,255,255,.6); font-family: 'Inter Tight', sans-serif; text-transform: uppercase; letter-spacing: .03em; line-height: 1.2; }
.fg-article .mb1 { background: linear-gradient(150deg,#3a2a1a,#1a1208); grid-column: span 2; grid-row: span 2; }
.fg-article .mb2 { background: linear-gradient(150deg,#4a3520,#2a1e12); }
.fg-article .mb3 { background: linear-gradient(150deg,#2a1810,#160b06); }
.fg-article .mb4 { background: linear-gradient(150deg,#5a4028,#31220f); grid-row: span 2; }
.fg-article .mb5 { background: linear-gradient(150deg,#3a2818,#20140a); }
.fg-article .mb6 { background: linear-gradient(150deg,#2e1f12,#170e07); }
.fg-article .mb-sw { display: flex; gap: 4px; padding: 8px 18px 12px; }
.fg-article .mb-sw span { flex: 1; height: 22px; border-radius: 5px; }
.fg-article .layers { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .layer { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; }
.fg-article .layer .ln { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .layer .lt { font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .layer .lt b { color: #fff; }
.fg-article .layer.l1 { border-color: rgba(0,212,170,.3); }
.fg-article .layer.l2 { margin: 0 3%; }
.fg-article .layer.l3 { margin: 0 6%; }
.fg-article .layer.l4 { margin: 0 9%; }
.fg-article .ptypes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .ptypes { grid-template-columns: 1fr; } }
.fg-article .pt { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .pt h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; }
.fg-article .pt p { font-size: 13px; color: rgba(255,255,255,.6); margin: 0; line-height: 1.5; }
.fg-article .pt.hero { border-color: rgba(0,212,170,.35); background: rgba(0,212,170,.06); }
.fg-article .cmean { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .cmean { grid-template-columns: 1fr; } }
.fg-article .cm { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 16px; background: #0d0d1a; display: flex; align-items: center; gap: 14px; }
.fg-article .cm .sw { width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0; border: 1px solid rgba(255,255,255,.12); }
.fg-article .cm .ct { font-size: 13px; color: rgba(255,255,255,.68); line-height: 1.45; }
.fg-article .cm .ct b { color: #fff; display: block; font-size: 14px; margin-bottom: 1px; }
.fg-article .pstrip { display: flex; height: 56px; border-radius: 12px; overflow: hidden; margin: 20px 0 8px; border: 1px solid #1e1e35; }
.fg-article .pstrip span { flex: 1; }
.fg-article .pcap { text-align: center; font-size: 12.5px; color: rgba(255,255,255,.4); margin-bottom: 22px; }
.fg-article .vs { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .vs { grid-template-columns: 1fr; } }
.fg-article .vs-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .vs-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 12px; }
.fg-article .vs-col .lbl { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin: 10px 0 6px; }
.fg-article .vs-col .pro { color: #00d4aa; }
.fg-article .vs-col .con { color: #ff9d5c; }
.fg-article .vs-col ul { list-style: none; padding: 0; }
.fg-article .vs-col li { position: relative; padding: 5px 0 5px 18px; font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; }
.fg-article .vs-col .pros li::before { content: '+'; position: absolute; left: 3px; top: 5px; color: #00d4aa; font-weight: 700; }
.fg-article .vs-col .cons li::before { content: '–'; position: absolute; left: 4px; top: 5px; color: #ff9d5c; font-weight: 700; }
.fg-article .ladder { display: flex; flex-direction: column; gap: 8px; margin: 28px 0; }
.fg-article .lrung { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 90px 1fr; gap: 14px; align-items: center; }
.fg-article .lrung .lt { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #00d4aa; }
.fg-article .lrung .ld { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
.fg-article .lrung .ld b { color: #fff; }
.fg-article .lrung.r1 { border-color: rgba(0,212,170,.35); }
@media(max-width:600px){ .fg-article .lrung { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .alloc { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .alloc-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .alloc-row { display: flex; align-items: center; gap: 12px; padding: 10px 18px; border-bottom: 1px solid #16161f; }
.fg-article .alloc-row:last-child { border-bottom: none; }
.fg-article .alloc-row .name { flex: 0 0 130px; font-size: 13px; color: rgba(255,255,255,.78); }
.fg-article .alloc-row .bar { flex: 1; height: 20px; border-radius: 5px; background: rgba(255,255,255,.05); overflow: hidden; }
.fg-article .alloc-row .bar span { display: block; height: 100%; background: linear-gradient(90deg,#00d4aa,#0099ff); }
.fg-article .alloc-row .pct { flex: 0 0 44px; text-align: right; font-family: 'Courier New', monospace; font-size: 12px; color: rgba(255,255,255,.55); }
.fg-article .alloc-row.save .bar span { background: linear-gradient(90deg,#3a5a4a,#2a4a5a); }
.fg-article .phases { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .phase { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: center; }
.fg-article .phase .pl { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #00d4aa; }
.fg-article .phase .pd { font-size: 13.5px; color: rgba(255,255,255,.68); line-height: 1.5; }
.fg-article .phase .pd b { color: #fff; }
.fg-article .parrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
@media(max-width:600px){ .fg-article .phase { grid-template-columns: 1fr; gap: 3px; } }
.fg-article .cd-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .cd-grid { grid-template-columns: 1fr; } }
.fg-article .cd-cell { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px 20px 18px; }
.fg-article .cd-ic { width: 38px; height: 38px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .cd-ic svg { width: 19px; height: 19px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .cd-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fg-article .cd-cell p { font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .cdept { margin: 30px 0 8px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; }
.fg-article .cdept-row { display: grid; grid-template-columns: 200px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .cdept-row:last-child { border-bottom: none; }
.fg-article .cdept-row.head { background: rgba(0,212,170,.06); }
.fg-article .cdept-role { padding: 14px 18px; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 14px; color: #fff; border-right: 1px solid #16161f; display: flex; align-items: center; gap: 8px; }
.fg-article .cdept-row.head .cdept-role, .fg-article .cdept-row.head .cdept-desc { font-size: 11px; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); font-weight: 700; }
.fg-article .cdept-desc { padding: 14px 18px; font-size: 14px; color: rgba(255,255,255,.65); line-height: 1.5; }
@media(max-width:600px){ .fg-article .cdept-row { grid-template-columns: 1fr; } .fg-article .cdept-role { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .plot { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow-x: auto; }
.fg-article .plot-title { padding: 12px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; }
.fg-article table.plot-tbl { border-collapse: collapse; width: 100%; min-width: 520px; }
.fg-article table.plot-tbl th, .fg-article table.plot-tbl td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 11px 12px; font-size: 13px; text-align: center; }
.fg-article table.plot-tbl th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.55); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
.fg-article table.plot-tbl td:first-child, .fg-article table.plot-tbl th:first-child { text-align: left; font-weight: 700; color: #fff; font-family: 'Inter Tight', sans-serif; white-space: nowrap; }
.fg-article table.plot-tbl tr:last-child td { border-bottom: none; }
.fg-article table.plot-tbl th:last-child, .fg-article table.plot-tbl td:last-child { border-right: none; }
.fg-article .chg { display: inline-block; min-width: 26px; padding: 2px 6px; border-radius: 6px; font-weight: 700; font-size: 12px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; }
.fg-article .chg.b { background: rgba(168,85,247,.14); border-color: rgba(168,85,247,.35); color: #c084fc; }
.fg-article .chg.c { background: rgba(255,180,80,.12); border-color: rgba(255,180,80,.3); color: #ffb450; }
.fg-article .plot-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .board { margin: 30px 0 6px; background: #0b0b16; border: 1px solid #1e1e35; border-radius: 16px; padding: 18px; }
.fg-article .board-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 6px; }
.fg-article .board-name { font-family: Fraunces, serif; font-size: 18px; color: #fff; }
.fg-article .board-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.7); }
.fg-article .board-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 74px; gap: 8px; }
@media(max-width:600px){ .fg-article .board-grid { grid-template-columns: repeat(3,1fr); } }
.fg-article .board-sw { border-radius: 8px; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 7px 8px; }
.fg-article .board-sw span { font-family: 'Courier New', monospace; font-size: 9px; color: rgba(255,255,255,.55); }
.fg-article .sw-a { background: linear-gradient(135deg,#3a2a1c,#5a4530); grid-column: span 2; grid-row: span 2; }
.fg-article .sw-b { background: linear-gradient(135deg,#22303a,#33505e); }
.fg-article .sw-c { background: linear-gradient(135deg,#4a3020,#6b4a2e); }
.fg-article .sw-d { background: linear-gradient(135deg,#2a2622,#443f38); }
.fg-article .sw-e { background: linear-gradient(135deg,#1c2a2a,#2e4444); }
.fg-article .sw-f { background: repeating-linear-gradient(45deg,#3a3228,#3a3228 4px,#4a4030 4px,#4a4030 8px); }
.fg-article .palette-strip { display: flex; gap: 0; margin-top: 12px; border-radius: 8px; overflow: hidden; height: 30px; }
.fg-article .palette-strip div { flex: 1; }
.fg-article .board-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .srcladder { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .rung { display: flex; align-items: center; gap: 16px; border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .rung-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .rung-body { flex: 1; }
.fg-article .rung-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .rung-body p { font-size: 13.5px; color: rgba(255,255,255,.58); line-height: 1.5; margin: 0; }
.fg-article .rung-cost { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; padding: 4px 10px; border-radius: 9999px; flex-shrink: 0; white-space: nowrap; }
.fg-article .c-free { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .c-low { color: #7fd4c4; background: rgba(0,212,170,.07); border: 1px solid rgba(0,212,170,.18); }
.fg-article .c-mid { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.28); }
.fg-article .c-high { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .srcladder-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .rung { flex-wrap: wrap; } }
.fg-article .arc { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 24px 22px 18px; background: #0b0b16; }
.fg-article .arc-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 20px; }
.fg-article .arc-track { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; position: relative; }
@media(max-width:600px){ .fg-article .arc-track { grid-template-columns: 1fr 1fr; gap: 14px; } }
.fg-article .arc-step { text-align: center; }
.fg-article .arc-fig { height: 84px; border-radius: 10px; margin-bottom: 10px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; }
.fg-article .arc-1 { background: linear-gradient(160deg,#2a3540,#3a4a58); }
.fg-article .arc-2 { background: linear-gradient(160deg,#2e3238,#464b44); }
.fg-article .arc-3 { background: linear-gradient(160deg,#3a2e26,#5a4432); }
.fg-article .arc-4 { background: linear-gradient(160deg,#3a1e1e,#5a2828); }
.fg-article .arc-dot { width: 12px; height: 12px; border-radius: 50%; background: #00d4aa; border: 2px solid #0b0b16; }
.fg-article .arc-step h5 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .arc-step p { font-size: 11.5px; color: rgba(255,255,255,.55); line-height: 1.4; margin: 0; }
.fg-article .arc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .cmeta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .cmeta { grid-template-columns: repeat(2,1fr); } }
.fg-article .cmcard { border-radius: 12px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .cm-chip { height: 56px; }
.fg-article .cm-txt { padding: 10px 12px; background: #0b0b16; }
.fg-article .cm-txt h5 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .cm-txt p { font-size: 11.5px; color: rgba(255,255,255,.55); line-height: 1.4; margin: 0; }
.fg-article .pvb { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 26px 0 6px; }
@media(max-width:600px){ .fg-article .pvb { grid-template-columns: 1fr; } }
.fg-article .pvb-cell { border-radius: 14px; overflow: hidden; border: 1px solid #1e1e35; }
.fg-article .pvb-scene { height: 140px; position: relative; display: flex; align-items: center; justify-content: center; }
.fg-article .pvb-fig { width: 46px; height: 78px; border-radius: 40% 40% 8px 8px; }
.fg-article .pvb-label { padding: 10px 14px; background: #0b0b16; font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; }
.fg-article .pvb-label b { color: #fff; }
.fg-article .demo-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .cont { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; overflow: hidden; background: #0b0b16; }
.fg-article .cont-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; flex-wrap: wrap; gap: 6px; }
.fg-article .cont-head h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .cont-head span { font-size: 11px; font-weight: 700; color: rgba(0,212,170,.75); text-transform: uppercase; letter-spacing: .06em; }
.fg-article .cont-body { display: grid; grid-template-columns: 260px 1fr; gap: 0; }
@media(max-width:600px){ .fg-article .cont-body { grid-template-columns: 1fr; } }
.fg-article .cont-photos { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 16px; border-right: 1px solid #16161f; }
@media(max-width:600px){ .fg-article .cont-photos { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .cont-shot { aspect-ratio: 3/4; border-radius: 8px; background: linear-gradient(160deg,#2a3038,#3c4650); position: relative; display: flex; align-items: flex-end; }
.fg-article .cont-shot span { font-family: 'Courier New', monospace; font-size: 9px; color: rgba(255,255,255,.5); padding: 5px 6px; }
.fg-article .cont-notes { padding: 16px 18px; }
.fg-article .cont-notes .cn { display: flex; gap: 8px; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #16161f; color: rgba(255,255,255,.72); }
.fg-article .cont-notes .cn:last-child { border-bottom: none; }
.fg-article .cont-notes .cn b { color: #00d4aa; font-weight: 700; min-width: 74px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; padding-top: 2px; }
.fg-article .cont-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .fit { margin: 30px 0 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media(max-width:600px){ .fg-article .fit { grid-template-columns: 1fr; } }
.fg-article .fit-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .fit-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .fit-item { display: flex; gap: 10px; align-items: flex-start; padding: 7px 0; font-size: 14px; color: rgba(255,255,255,.78); line-height: 1.45; }
.fg-article .fit-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(0,212,170,.5); flex-shrink: 0; margin-top: 2px; position: relative; }
.fg-article .fit-box::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #00d4aa; }
.fg-article .fit-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .budg { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 22px 22px 18px; background: #0b0b16; }
.fg-article .budg-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 18px; }
.fg-article .brow { display: grid; grid-template-columns: 130px 1fr 44px; gap: 12px; align-items: center; margin-bottom: 12px; }
.fg-article .brow:last-of-type { margin-bottom: 0; }
.fg-article .brow-label { font-size: 13px; color: rgba(255,255,255,.78); font-weight: 600; }
.fg-article .brow-track { height: 22px; background: #16161f; border-radius: 6px; overflow: hidden; }
.fg-article .brow-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #00d4aa, #0099ff); }
.fg-article .brow-pct { font-size: 12px; color: rgba(0,212,170,.85); font-weight: 700; text-align: right; }
.fg-article .brow.dim .brow-fill { background: linear-gradient(90deg,#2e6a60,#2a4a66); }
.fg-article .budg-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .brow { grid-template-columns: 92px 1fr 40px; } }
.fg-article .dayphases { margin: 30px 0 6px; }
.fg-article .dayphase { display: grid; grid-template-columns: 44px 1fr; gap: 16px; position: relative; padding-bottom: 18px; }
.fg-article .dayphase:not(:last-child)::before { content: ''; position: absolute; left: 21px; top: 40px; bottom: 0; width: 2px; background: linear-gradient(#00d4aa, rgba(0,212,170,.15)); }
.fg-article .phase-n { width: 44px; height: 44px; border-radius: 12px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; z-index: 1; }
.fg-article .phase-n svg { width: 21px; height: 21px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .phase-body { padding-top: 2px; }
.fg-article .phase-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .phase-body .ph-time { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(0,212,170,.7); margin-bottom: 6px; }
.fg-article .phase-body p { font-size: 14px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }

.fg-article .slanatomy { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .slanatomy-title { padding: 12px 16px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; }
.fg-article .slanatomy-scroll { overflow-x: auto; }
.fg-article table.slrows { border-collapse: collapse; width: 100%; min-width: 560px; }
.fg-article table.slrows th, .fg-article table.slrows td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 10px 12px; font-size: 13px; text-align: left; }
.fg-article table.slrows th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.5); font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; background: rgba(255,255,255,.02); }
.fg-article table.slrows td { color: rgba(255,255,255,.72); }
.fg-article table.slrows tr:last-child td { border-bottom: none; }
.fg-article table.slrows th:last-child, .fg-article table.slrows td:last-child { border-right: none; }
.fg-article table.slrows td.num { color: #00d4aa; font-weight: 700; }
.fg-article .slsz { display: inline-block; padding: 1px 7px; border-radius: 5px; font-weight: 700; font-size: 11px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.28); color: #00d4aa; }
.fg-article .slanatomy-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 10px 2px 22px; line-height: 1.5; }
.fg-article .compare3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .compare3 { grid-template-columns: 1fr; } }
.fg-article .ctool { border: 1px solid #1e1e35; border-radius: 14px; background: #0b0b16; overflow: hidden; }
.fg-article .ctool-vis { height: 96px; border-bottom: 1px solid #16161f; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#071820,#0a2230); }
.fg-article .ctool-vis svg { width: 100%; height: 100%; }
.fg-article .ctool-body { padding: 15px 16px; }
.fg-article .ctool-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .ctool-body .cform { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .ctool-body p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .compare3-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .sizes { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .sizes { grid-template-columns: repeat(2,1fr); } }
@media(max-width:420px){ .fg-article .sizes { grid-template-columns: 1fr; } }
.fg-article .szf { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .szf-frame { aspect-ratio: 16/10; background: linear-gradient(160deg,#0d2028,#0a1826); position: relative; overflow: hidden; border-bottom: 1px solid #16161f; }
.fg-article .szf-frame svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .szf-cap { padding: 9px 12px; }
.fg-article .szf-cap h5 { font-family: 'Inter Tight', sans-serif; font-size: 12.5px; font-weight: 700; color: #fff; }
.fg-article .szf-cap span { font-size: 10px; font-weight: 700; color: rgba(0,212,170,.7); text-transform: uppercase; letter-spacing: .05em; }
.fg-article .szf-cap p { font-size: 11px; color: rgba(255,255,255,.55); line-height: 1.4; margin-top: 3px; }
.fg-article .sizes-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .angles { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .angles { grid-template-columns: 1fr; } }
.fg-article .ang { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .ang-vis { height: 96px; background: linear-gradient(160deg,#0d2028,#0a1826); border-bottom: 1px solid #16161f; position: relative; }
.fg-article .ang-vis svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .ang-cap { padding: 11px 14px; }
.fg-article .ang-cap h5 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .ang-cap p { font-size: 12px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .angles-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .move-list { list-style: none; margin: 8px 0 22px; padding: 0; }
.fg-article .move-list li { display: grid; grid-template-columns: 92px 1fr; gap: 14px; padding: 11px 0; border-bottom: 1px solid #16161f; font-size: 15px; color: rgba(255,255,255,.78); line-height: 1.5; }
.fg-article .move-list li:last-child { border-bottom: none; }
.fg-article .move-list .mv { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: #00d4aa; font-size: 13px; }
@media(max-width:600px){ .fg-article .move-list li { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .covset { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .covset-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 16px; }
.fg-article .covset-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
@media(max-width:600px){ .fg-article .covset-grid { grid-template-columns: 1fr 1fr; } }
.fg-article .covset-shot { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .covset-fr { aspect-ratio: 16/10; position: relative; background: linear-gradient(160deg,#0d2028,#0a1826); }
.fg-article .covset-fr svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fg-article .covset-lbl { padding: 7px 10px; }
.fg-article .covset-lbl b { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; color: #00d4aa; }
.fg-article .covset-lbl span { display: block; font-size: 11px; color: rgba(255,255,255,.6); line-height: 1.35; margin-top: 1px; }
.fg-article .covset-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .fsl { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .fsl-head { padding: 12px 16px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .fsl-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .fsl-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; }
.fg-article .fsl-scroll { overflow-x: auto; }
.fg-article table.fsl-t { border-collapse: collapse; width: 100%; min-width: 640px; }
.fg-article table.fsl-t th, .fg-article table.fsl-t td { border-bottom: 1px solid #16161f; border-right: 1px solid #16161f; padding: 8px 11px; font-size: 12.5px; text-align: left; }
.fg-article table.fsl-t th { font-family: 'Inter Tight', sans-serif; font-weight: 700; color: rgba(255,255,255,.5); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; background: rgba(255,255,255,.02); }
.fg-article table.fsl-t td { color: rgba(255,255,255,.72); }
.fg-article table.fsl-t tr:last-child td { border-bottom: none; }
.fg-article table.fsl-t th:last-child, .fg-article table.fsl-t td:last-child { border-right: none; }
.fg-article table.fsl-t td.n { color: #00d4aa; font-weight: 700; }
.fg-article .szc { display: inline-block; padding: 1px 6px; border-radius: 4px; font-weight: 700; font-size: 10.5px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.28); color: #00d4aa; }
.fg-article .pri { display: inline-block; width: 9px; height: 9px; border-radius: 50%; }
.fg-article .pri.a { background: #00d4aa; }
.fg-article .pri.b { background: #ffb450; }
.fg-article .fsl-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .plan { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .plan-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .plan-wrap { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .plan-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: rgba(255,255,255,.6); }
.fg-article .plan-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .lg-dot { width: 12px; height: 12px; border-radius: 50%; }
.fg-article .lg-cam { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 11px solid rgba(255,220,120,.85); }
.fg-article .plan-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .oneeighty { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 20px; background: #0b0b16; }
.fg-article .oe-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 14px; }
.fg-article .oe-wrap { border: 1px solid #1e1e35; border-radius: 10px; overflow: hidden; background: #0d1524; }
.fg-article .oe-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 14px; font-size: 12px; color: rgba(255,255,255,.6); }
.fg-article .oe-legend span { display: inline-flex; align-items: center; gap: 6px; }
.fg-article .oe-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .pritiers { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 10px; }
.fg-article .pritier { display: flex; align-items: flex-start; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0b0b16; }
.fg-article .pritier-badge { flex-shrink: 0; width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: Fraunces, serif; font-weight: 700; font-size: 20px; }
.fg-article .pt-a { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .pt-b { background: rgba(255,180,80,.12); border: 1px solid rgba(255,180,80,.35); color: #ffb450; }
.fg-article .pt-c { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.18); color: rgba(255,255,255,.6); }
.fg-article .pritier-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .pritier-body p { font-size: 13.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .pritiers-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .regroup { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 8px; align-items: center; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .regroup { grid-template-columns: 1fr; } .fg-article .rg-arrow { transform: rotate(90deg); margin: 4px auto; } }
.fg-article .rg-col { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; background: #0b0b16; }
.fg-article .rg-head { padding: 9px 12px; font-family: 'Inter Tight', sans-serif; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #16161f; }
.fg-article .rg-head.story { color: rgba(255,255,255,.5); background: rgba(255,255,255,.02); }
.fg-article .rg-head.shoot { color: rgba(0,212,170,.8); background: rgba(0,212,170,.06); }
.fg-article .rg-row { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 12.5px; color: rgba(255,255,255,.72); border-bottom: 1px solid #16161f; }
.fg-article .rg-row:last-child { border-bottom: none; }
.fg-article .rg-n { font-weight: 700; color: #00d4aa; min-width: 30px; }
.fg-article .rg-grp { background: rgba(0,212,170,.05); }
.fg-article .rg-glabel { padding: 6px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.65); background: rgba(0,212,170,.08); border-bottom: 1px solid #16161f; }
.fg-article .rg-arrow { display: flex; align-items: center; justify-content: center; color: rgba(0,212,170,.6); }
.fg-article .regroup-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .track { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .track-head { padding: 12px 16px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .track-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .track-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; }
.fg-article .track-row { display: grid; grid-template-columns: 30px 22px 1fr auto; gap: 10px; align-items: center; padding: 9px 16px; border-bottom: 1px solid #16161f; font-size: 13px; }
.fg-article .track-row:last-child { border-bottom: none; }
.fg-article .track-row .tn { font-weight: 700; color: #00d4aa; }
.fg-article .track-row .td { color: rgba(255,255,255,.72); }
.fg-article .track-row.done .td { color: rgba(255,255,255,.35); text-decoration: line-through; }
.fg-article .track-row .tpri { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; }
.fg-article .tp-a { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .tp-b { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .tbox { width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid rgba(0,212,170,.5); position: relative; }
.fg-article .tbox.on { background: rgba(0,212,170,.18); }
.fg-article .tbox.on::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #00d4aa; }
.fg-article .track-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .sigdeal { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .sigdeal { grid-template-columns: 1fr; } }
.fg-article .sigdeal-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0d0d1a; }
.fg-article .sigdeal-col h4 { font-family: Fraunces, serif; font-size: 18px; color: #fff; margin-bottom: 4px; }
.fg-article .sigdeal-col .sigdeal-lbl { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #00d4aa; margin-bottom: 12px; }
.fg-article .sigdeal-col ul { list-style: none; padding: 0; }
.fg-article .sigdeal-col li { position: relative; padding: 6px 0 6px 18px; font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.5; }
.fg-article .sigdeal-col li::before { content: ''; position: absolute; left: 2px; top: 13px; width: 6px; height: 6px; border-radius: 2px; background: rgba(0,212,170,.6); }
.fg-article .lbtiers { margin: 28px 0; display: flex; flex-direction: column; gap: 8px; }
.fg-article .lbtier { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: center; background: #0d0d1a; position: relative; }
.fg-article .lbtier .lbt-step { width: 26px; height: 26px; border-radius: 7px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #00d4aa; font-family: 'Inter Tight', sans-serif; }
.fg-article .lbtier .lbt-name { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
.fg-article .lbtier .lbt-desc { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.45; margin-top: 2px; }
.fg-article .lbtier.lbt-1 { border-color: rgba(0,212,170,.35); }
.fg-article .lbtier.lbt-2 { border-color: rgba(0,212,170,.28); }
.fg-article .lbtier.lbt-3 { border-color: rgba(0,212,170,.22); }
.fg-article .lbtier.lbt-4 { border-color: rgba(0,212,170,.16); }
.fg-article .lbtier.lbt-5 { border-color: rgba(0,212,170,.12); }
.fg-article .sigsteps { margin: 28px 0; display: flex; flex-direction: column; gap: 10px; }
.fg-article .sigstep { display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start; border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: #0d0d1a; }
.fg-article .sigstep .sigstep-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; font-family: Fraunces, serif; font-size: 15px; font-weight: 700; color: #00d4aa; }
.fg-article .sigstep .sigstep-t { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .sigstep .sigstep-d { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.5; }
.fg-article .rateanat { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .ra-head { background: rgba(0,212,170,.06); padding: 12px 18px; font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #00d4aa; border-bottom: 1px solid #1e1e35; }
.fg-article .ra-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; padding: 11px 18px; border-bottom: 1px solid #16161f; align-items: baseline; }
.fg-article .ra-row:last-child { border-bottom: none; }
.fg-article .ra-row .ra-k { font-size: 14px; font-weight: 700; color: #fff; }
.fg-article .ra-row .ra-v { font-size: 13.5px; color: rgba(255,255,255,.65); line-height: 1.5; }
@media(max-width:600px){ .fg-article .ra-row { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .wagestack { border: 1px solid #1e1e35; border-radius: 12px; overflow: hidden; margin: 28px 0; }
.fg-article .wagestack-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 20px; border-bottom: 1px solid #16161f; font-size: 15px; }
.fg-article .wagestack-row:last-child { border-bottom: none; }
.fg-article .wagestack-row .ws-lbl { color: rgba(255,255,255,.82); }
.fg-article .wagestack-row .ws-note { font-size: 12px; color: rgba(255,255,255,.4); }
.fg-article .wagestack-row.ws-base { background: rgba(0,212,170,.06); }
.fg-article .wagestack-row.ws-base .ws-lbl { color: #00d4aa; font-weight: 600; }
.fg-article .wagestack-row.ws-add .ws-lbl { padding-left: 14px; color: rgba(255,255,255,.72); }
.fg-article .wagestack-row.ws-add .ws-lbl::before { content: '+ '; color: #c084fc; font-weight: 700; }
.fg-article .wagestack-row.ws-total { background: rgba(168,85,247,.09); }
.fg-article .wagestack-row.ws-total .ws-lbl { color: #c084fc; font-weight: 700; }
.fg-article .wagestack-row.ws-total .ws-note { color: #c084fc; }
.fg-article .docs { display: flex; flex-direction: column; gap: 10px; margin: 28px 0; }
.fg-article .doc { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 18px; background: #0d0d1a; display: grid; grid-template-columns: 34px 1fr; gap: 14px; align-items: start; }
.fg-article .doc .di { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; }
.fg-article .doc .di svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .doc .dt { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .doc .dd { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.5; }
.fg-article .doc .dd b { color: rgba(255,255,255,.85); }
.fg-article .setrules { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
@media(max-width:600px){ .fg-article .setrules { grid-template-columns: 1fr; } }
.fg-article .setrule { border: 1px solid #1e1e35; border-radius: 12px; padding: 16px 18px; background: #0d0d1a; }
.fg-article .setrule h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.fg-article .setrule h4 svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .setrule p { font-size: 13px; color: rgba(255,255,255,.62); margin: 0; line-height: 1.5; }
.fg-article .life { display: flex; flex-direction: column; gap: 0; margin: 28px 0; }
.fg-article .lnode { border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; background: #0d0d1a; display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: center; }
.fg-article .lnode .lt { font-size: 14px; color: rgba(255,255,255,.8); line-height: 1.5; }
.fg-article .lnode .lt b { color: #fff; }
.fg-article .lnode .ltag { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; white-space: nowrap; }
.fg-article .lnode .ltag.lt-none { color: rgba(255,255,255,.5); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
.fg-article .lnode .ltag.lt-maybe { color: #ffd24a; background: rgba(255,210,74,.1); border: 1px solid rgba(255,210,74,.3); }
.fg-article .larrow { width: 2px; height: 14px; background: rgba(0,212,170,.3); margin: 0 auto; }
.fg-article .legal-note { background: rgba(255,180,80,.06); border: 1px solid rgba(255,180,80,.28); border-radius: 12px; padding: 16px 20px; margin: 30px 0; display: flex; gap: 12px; align-items: flex-start; }
.fg-article .legal-note svg { width: 18px; height: 18px; stroke: #ffb450; fill: none; stroke-width: 2; flex-shrink: 0; margin-top: 2px; }
.fg-article .legal-note p { font-size: 13.5px; line-height: 1.6; color: rgba(255,210,140,.9); margin: 0; }
.fg-article .legal-note b { color: #ffce88; }
.fg-article .three { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .three { grid-template-columns: 1fr; } }
.fg-article .tcard { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; }
.fg-article .tcard-ic { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .tcard-ic svg { width: 20px; height: 20px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .tcard h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .tcard .who { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .tcard p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .three-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .needp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .needp { grid-template-columns: 1fr; } }
.fg-article .np-col { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .np-col.yes { border-color: rgba(255,180,80,.3); }
.fg-article .np-col.no { border-color: rgba(0,212,170,.3); }
.fg-article .np-col h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.fg-article .np-col.yes h4 { color: #ffb450; }
.fg-article .np-col.no h4 { color: #00d4aa; }
.fg-article .np-col h4 .badge { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.fg-article .np-col.yes .badge { background: rgba(255,180,80,.14); border: 1px solid rgba(255,180,80,.4); color: #ffb450; }
.fg-article .np-col.no .badge { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .np-item { font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 7px 0; border-bottom: 1px solid #16161f; }
.fg-article .np-item:last-child { border-bottom: none; }
.fg-article .needp-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .steps { margin: 30px 0 6px; }
.fg-article .step { display: grid; grid-template-columns: 44px 1fr; gap: 16px; position: relative; padding-bottom: 18px; }
.fg-article .step:not(:last-child)::before { content: ''; position: absolute; left: 21px; top: 40px; bottom: 0; width: 2px; background: linear-gradient(#00d4aa, rgba(0,212,170,.15)); }
.fg-article .step-n { width: 44px; height: 44px; border-radius: 12px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; z-index: 1; font-family: Fraunces, serif; font-weight: 700; color: #00d4aa; font-size: 18px; }
.fg-article .step-body { padding-top: 4px; }
.fg-article .step-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .step-body p { font-size: 14px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }
.fg-article .locagree { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .locagree-head { padding: 14px 18px; background: rgba(0,212,170,.06); border-bottom: 1px solid #16161f; display: flex; align-items: center; gap: 10px; }
.fg-article .locagree-head svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .locagree-head b { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #fff; }
.fg-article .locagree-row { display: flex; gap: 12px; padding: 11px 18px; border-bottom: 1px solid #16161f; font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.5; }
.fg-article .locagree-row:last-child { border-bottom: none; }
.fg-article .locagree-row b { color: #fff; font-weight: 700; }
.fg-article .locagree-chk { width: 18px; height: 18px; border-radius: 5px; background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.35); flex-shrink: 0; position: relative; margin-top: 1px; }
.fg-article .locagree-chk::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #00d4aa; }
.fg-article .locagree-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .relform { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0c1018; }
.fg-article .relform-head { padding: 16px 20px; border-bottom: 1px solid #16161f; background: rgba(0,212,170,.05); }
.fg-article .relform-head h4 { font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .relform-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.fg-article .relform-body { padding: 18px 20px; }
.fg-article .relform-clause { display: flex; gap: 10px; padding: 8px 0; font-size: 13.5px; color: rgba(255,255,255,.7); line-height: 1.5; border-bottom: 1px dashed #191922; }
.fg-article .relform-clause:last-of-type { border-bottom: none; }
.fg-article .relform-clause b { color: #00d4aa; font-weight: 700; }
.fg-article .relform-sign { display: flex; gap: 20px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #16161f; }
.fg-article .relform-sign div { flex: 1; }
.fg-article .relform-sign .relform-line { height: 1px; background: rgba(255,255,255,.25); margin-bottom: 5px; }
.fg-article .relform-sign span { font-size: 10.5px; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .05em; }
.fg-article .relform-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .spectrum { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .sp-row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; align-items: center; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 16px; background: #0b0b16; }
@media(max-width:600px){ .fg-article .sp-row { grid-template-columns: 1fr; gap: 6px; } }
.fg-article .sp-who { display: flex; align-items: center; gap: 9px; }
.fg-article .sp-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.fg-article .sp-who b { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; }
.fg-article .sp-need { font-size: 13px; color: rgba(255,255,255,.65); line-height: 1.45; }
.fg-article .sp-need .sp-tag { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; margin-right: 6px; }
.fg-article .sp-need .t-full { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .sp-need .t-app { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .sp-need .t-sign { color: #7fd4c4; background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.25); }
.fg-article .sp-need .t-ok { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .spectrum-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .loc { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .loc { grid-template-columns: 1fr; } }
.fg-article .loc-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; }
.fg-article .loc-cell .loc-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; padding: 3px 9px; border-radius: 9999px; margin-bottom: 9px; }
.fg-article .loc-cell .loc-tag.yes { color: #ff8a8a; background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .loc-cell .loc-tag.caut { color: #ffb450; background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); }
.fg-article .loc-cell .loc-tag.no { color: #00d4aa; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); }
.fg-article .loc-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .loc-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .loc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .obj { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .obj { grid-template-columns: 1fr; } }
.fg-article .obj-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; display: flex; gap: 13px; align-items: flex-start; }
.fg-article .obj-ic { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .obj-ic svg { width: 18px; height: 18px; stroke-width: 2; fill: none; }
.fg-article .obj-ic.yes { background: rgba(255,107,107,.1); border: 1px solid rgba(255,107,107,.3); }
.fg-article .obj-ic.yes svg { stroke: #ff8a8a; }
.fg-article .obj-ic.no { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); }
.fg-article .obj-ic.no svg { stroke: #00d4aa; }
.fg-article .obj-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .obj-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .obj-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .rights { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .rights { grid-template-columns: 1fr; } }
.fg-article .rt { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); }
.fg-article .rt-ic { width: 42px; height: 42px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .rt-ic svg { width: 21px; height: 21px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .rt h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .rt .own { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .rt p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .rights-note { background: rgba(255,107,107,.06); border: 1px solid rgba(255,107,107,.25); border-radius: 12px; padding: 14px 18px; margin: 14px 0 6px; font-size: 14px; color: rgba(255,180,180,.9); line-height: 1.55; }
.fg-article .rights-note b { color: #ffcaca; }
.fg-article .rights-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .tmzones { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:680px){ .fg-article .tmzones { grid-template-columns: 1fr; } }
.fg-article .tmzone { border: 1px solid #1e1e35; border-radius: 14px; padding: 16px 18px; background: #0b0b16; }
.fg-article .tmzone.ok { border-color: rgba(0,212,170,.3); }
.fg-article .tmzone.caut { border-color: rgba(255,180,80,.3); }
.fg-article .tmzone.no { border-color: rgba(255,107,107,.3); }
.fg-article .tmzone h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
.fg-article .tmzone.ok h4 { color: #00d4aa; }
.fg-article .tmzone.caut h4 { color: #ffb450; }
.fg-article .tmzone.no h4 { color: #ff8a8a; }
.fg-article .tmzone h4 .b { width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.fg-article .tmzone.ok .b { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); }
.fg-article .tmzone.caut .b { background: rgba(255,180,80,.14); border: 1px solid rgba(255,180,80,.4); }
.fg-article .tmzone.no .b { background: rgba(255,107,107,.14); border: 1px solid rgba(255,107,107,.4); }
.fg-article .tmzone-item { font-size: 12.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 6px 0; border-bottom: 1px solid #16161f; }
.fg-article .tmzone-item:last-child { border-bottom: none; }
.fg-article .tmzones-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .dstack { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 16px; padding: 22px; background: #0b0b16; }
.fg-article .dstack-title { font-family: 'Inter Tight', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: rgba(0,212,170,.75); margin-bottom: 16px; }
.fg-article .dlayer { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 10px; padding: 13px 16px; margin-bottom: 8px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .dlayer:last-child { margin-bottom: 0; }
.fg-article .dlayer-ic { width: 34px; height: 34px; border-radius: 8px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .dlayer-ic svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .dlayer-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .dlayer-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .dstack-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 30px 0 8px; }
@media(max-width:600px){ .fg-article .pillars { grid-template-columns: 1fr; } }
.fg-article .pillar { background: linear-gradient(135deg,#0b0b16 0%,#0d1524 100%); border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; }
.fg-article .pillar-ic { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.fg-article .pillar-ic svg { width: 20px; height: 20px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pillar h4 { font-family: 'Inter Tight', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .pillar .prot { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 8px; }
.fg-article .pillar p { font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.5; margin: 0; }
.fg-article .pillars-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .coi { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0c1018; }
.fg-article .coi-head { padding: 15px 20px; border-bottom: 1px solid #16161f; background: rgba(0,212,170,.05); display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.fg-article .coi-head h4 { font-family: Fraunces, serif; font-size: 17px; color: #fff; }
.fg-article .coi-head span { font-size: 11px; color: rgba(0,212,170,.7); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.fg-article .coi-body { padding: 16px 20px; }
.fg-article .coi-line { display: grid; grid-template-columns: 150px 1fr; gap: 12px; padding: 8px 0; border-bottom: 1px dashed #191922; font-size: 13.5px; }
.fg-article .coi-line:last-child { border-bottom: none; }
.fg-article .coi-line .k { color: rgba(0,212,170,.75); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; padding-top: 2px; }
.fg-article .coi-line .v { color: rgba(255,255,255,.78); line-height: 1.45; }
.fg-article .coi-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .coi-line { grid-template-columns: 1fr; gap: 2px; } }
.fg-article .pkg { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .pkg { grid-template-columns: 1fr; } }
.fg-article .pkg-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; display: flex; gap: 12px; align-items: flex-start; }
.fg-article .pkg-cell.core { border-color: rgba(0,212,170,.3); background: linear-gradient(135deg,#0b0b16,#0a1a1a); }
.fg-article .pkg-ic { width: 34px; height: 34px; border-radius: 8px; background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.28); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .pkg-ic svg { width: 17px; height: 17px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .pkg-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .pkg-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .pkg-cell .tag { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.75); }
.fg-article .pkg-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .gear { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .gear { grid-template-columns: 1fr; } }
.fg-article .gcol { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .gcol h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.fg-article .gcol h4 svg { width: 18px; height: 18px; stroke: #00d4aa; fill: none; stroke-width: 2; }
.fg-article .gitem { font-size: 13.5px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 7px 0; border-bottom: 1px solid #16161f; }
.fg-article .gitem:last-child { border-bottom: none; }
.fg-article .gitem b { color: #fff; }
.fg-article .gear-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .split { grid-template-columns: 1fr; } }
.fg-article .scol { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: linear-gradient(135deg,#0b0b16,#0d1524); }
.fg-article .scol .who { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: rgba(0,212,170,.7); margin-bottom: 6px; }
.fg-article .scol h4 { font-family: Fraunces, serif; font-size: 20px; color: #fff; margin-bottom: 8px; }
.fg-article .scol p { font-size: 13.5px; color: rgba(255,255,255,.62); line-height: 1.55; margin: 0; }
.fg-article .scol .scol-covers { font-size: 12px; color: rgba(0,212,170,.8); font-weight: 700; margin-top: 10px; }
.fg-article .split-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .eo { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .eo { grid-template-columns: 1fr; } }
.fg-article .eo-cell { border: 1px solid #1e1e35; border-radius: 12px; padding: 15px 16px; background: #0b0b16; }
.fg-article .eo-cell h4 { font-family: 'Inter Tight', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
.fg-article .eo-cell p { font-size: 12.5px; color: rgba(255,255,255,.6); line-height: 1.45; margin: 0; }
.fg-article .eo-cell .cross { color: #ff8a8a; font-weight: 700; margin-right: 5px; }
.fg-article .earn { background: rgba(0,212,170,.05); border: 1px solid rgba(0,212,170,.25); border-radius: 14px; padding: 18px 20px; margin: 22px 0 6px; }
.fg-article .earn h4 { font-family: 'Inter Tight', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.8); margin-bottom: 10px; }
.fg-article .earn-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 13.5px; color: rgba(255,255,255,.78); }
.fg-article .earn-row svg { width: 15px; height: 15px; stroke: #00d4aa; fill: none; stroke-width: 2.5; flex-shrink: 0; }
.fg-article .eo-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .shield { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .shield { grid-template-columns: 1fr; } }
.fg-article .shcol { border: 1px solid #1e1e35; border-radius: 14px; padding: 20px; background: #0b0b16; }
.fg-article .shcol.bad { border-color: rgba(255,107,107,.3); }
.fg-article .shcol.good { border-color: rgba(0,212,170,.3); }
.fg-article .shcol h4 { font-family: 'Inter Tight', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.fg-article .shcol.bad h4 { color: #ff8a8a; }
.fg-article .shcol.good h4 { color: #00d4aa; }
.fg-article .shflow { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.fg-article .shflow-box { width: 100%; text-align: center; padding: 9px 10px; border-radius: 8px; font-size: 12.5px; font-weight: 600; }
.fg-article .fb-claim { background: rgba(255,180,80,.1); border: 1px solid rgba(255,180,80,.3); color: #ffce88; }
.fg-article .fb-you-bad { background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.35); color: #ff9a9a; }
.fg-article .fb-llc { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); color: #7fe9d3; }
.fg-article .fb-you-good { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.14); color: rgba(255,255,255,.55); }
.fg-article .shflow-arrow { color: rgba(255,255,255,.3); font-size: 14px; }
.fg-article .shflow-arrow.blocked { color: #00d4aa; font-weight: 700; }
.fg-article .shield-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .contracts { margin: 30px 0 6px; border: 1px solid #1e1e35; border-radius: 14px; overflow: hidden; background: #0b0b16; }
.fg-article .ct-row { display: grid; grid-template-columns: 190px 1fr; gap: 0; border-bottom: 1px solid #16161f; }
.fg-article .ct-row:last-child { border-bottom: none; }
.fg-article .ct-row.head { background: rgba(0,212,170,.06); }
.fg-article .ct-name { padding: 13px 16px; font-family: 'Inter Tight', sans-serif; font-weight: 700; font-size: 13.5px; color: #fff; border-right: 1px solid #16161f; }
.fg-article .ct-row.head .ct-name, .fg-article .ct-row.head .ct-desc { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: rgba(0,212,170,.75); font-weight: 700; }
.fg-article .ct-desc { padding: 13px 16px; font-size: 13.5px; color: rgba(255,255,255,.66); line-height: 1.5; }
@media(max-width:600px){ .fg-article .ct-row { grid-template-columns: 1fr; } .fg-article .ct-name { border-right: none; border-bottom: 1px solid #16161f; } }
.fg-article .contracts-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .ec { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 30px 0 6px; }
@media(max-width:600px){ .fg-article .ec { grid-template-columns: 1fr; } }
.fg-article .eccol { border: 1px solid #1e1e35; border-radius: 14px; padding: 18px 20px; background: #0b0b16; }
.fg-article .eccol h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fg-article .eccol .sub { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(0,212,170,.7); margin-bottom: 12px; }
.fg-article .ec-item { font-size: 13px; color: rgba(255,255,255,.72); line-height: 1.45; padding: 6px 0; border-bottom: 1px solid #16161f; }
.fg-article .ec-item:last-child { border-bottom: none; }
.fg-article .ec-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
.fg-article .claimlayers { margin: 30px 0 6px; }
.fg-article .claimlyr { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; margin-bottom: 8px; background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .claimlyr:last-child { margin-bottom: 0; }
.fg-article .claimlyr.last { background: linear-gradient(90deg, rgba(255,107,107,.06), transparent); border-color: rgba(255,107,107,.25); }
.fg-article .claimlyr-n { width: 30px; height: 30px; border-radius: 8px; background: rgba(0,212,170,.12); border: 1px solid rgba(0,212,170,.3); color: #00d4aa; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fg-article .claimlyr.last .claimlyr-n { background: rgba(255,107,107,.12); border-color: rgba(255,107,107,.35); color: #ff8a8a; }
.fg-article .claimlyr-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .claimlyr-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .claimlayers-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 14px 2px 22px; line-height: 1.5; }
.fg-article .esc { margin: 30px 0 6px; display: flex; flex-direction: column; gap: 8px; }
.fg-article .esc-step { display: flex; align-items: center; gap: 14px; border: 1px solid #1e1e35; border-radius: 12px; padding: 14px 18px; }
.fg-article .esc-step.s1 { background: linear-gradient(90deg, rgba(0,212,170,.08), transparent); border-color: rgba(0,212,170,.3); }
.fg-article .esc-step.s2 { background: linear-gradient(90deg, rgba(0,212,170,.05), transparent); }
.fg-article .esc-step.s3 { background: linear-gradient(90deg, rgba(255,180,80,.05), transparent); }
.fg-article .esc-step.s4 { background: linear-gradient(90deg, rgba(255,107,107,.05), transparent); border-color: rgba(255,107,107,.25); }
.fg-article .esc-n { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.fg-article .esc-step.s1 .esc-n { background: rgba(0,212,170,.14); border: 1px solid rgba(0,212,170,.4); color: #00d4aa; }
.fg-article .esc-step.s2 .esc-n { background: rgba(0,212,170,.1); border: 1px solid rgba(0,212,170,.3); color: #7fe9d3; }
.fg-article .esc-step.s3 .esc-n { background: rgba(255,180,80,.12); border: 1px solid rgba(255,180,80,.35); color: #ffb450; }
.fg-article .esc-step.s4 .esc-n { background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.35); color: #ff8a8a; }
.fg-article .esc-body h4 { font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.fg-article .esc-body p { font-size: 12.5px; color: rgba(255,255,255,.58); line-height: 1.45; margin: 0; }
.fg-article .esc-cost { margin-left: auto; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: rgba(255,255,255,.4); white-space: nowrap; flex-shrink: 0; }
.fg-article .esc-cap { font-size: 13px; color: rgba(255,255,255,.4); margin: 12px 2px 22px; line-height: 1.5; }
@media(max-width:600px){ .fg-article .esc-cost { display: none; } }
.fg-article code { font-family: 'Courier New', monospace; font-size: 0.92em; background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.2); color: #7fe9d3; padding: 1px 6px; border-radius: 5px; }
`;

export default function CourseChapter() {
  const { courseSlug = "", chapterSlug = "" } = useParams();
  // Read from the sync cache. SSR pre-populates this; on the client the
  // main entry does too for the initial URL. For SPA navigations to a new
  // course we fall back to a dynamic import in the effect below.
  const [course, setCourse] = useState(() => getCourse(courseSlug));
  useEffect(() => {
    const cached = getCourse(courseSlug);
    if (cached) {
      if (cached !== course) setCourse(cached);
      return;
    }
    let cancelled = false;
    loadCourse(courseSlug).then((c) => {
      if (!cancelled) setCourse(c);
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);
  const chapter = course?.chapters.find((c) => c.slug === chapterSlug);


  if (!course) {
    return (
      <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', sans-serif" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40 }}>Course coming soon</h1>
        <Link to="/academy/education" style={{ color: "#00d4aa" }}>← Back to Education Modules</Link>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", padding: "80px 24px", textAlign: "center", fontFamily: "'Inter Tight', sans-serif" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, marginBottom: 12 }}>Chapter coming soon</h1>
        <p style={{ color: "rgba(255,255,255,.55)", marginBottom: 20 }}>This chapter isn't written yet.</p>
        <Link to={`/academy/${course.slug}`} style={{ color: "#00d4aa" }}>← Back to {course.title}</Link>
      </div>
    );
  }

  const idx = course.chapters.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? course.chapters[idx - 1] : null;
  const next = idx < course.chapters.length - 1 ? course.chapters[idx + 1] : null;
  const currentModule = course.modules.find((m) => m.key === chapter.moduleKey);

  const seoTitle = chapter.seoTitle || `${chapter.title} | ${course.title} | Filmmaker Genius`;

  return (
    <div style={{ background: "#0a0a12", color: "#fff", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <Seo
        title={seoTitle}
        description={chapter.seoDesc || `${chapter.title} — a chapter from the ${course.title} course on Filmmaker Genius Academy.`}
        canonical={`https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: chapter.title,
            description: chapter.seoDesc || `${chapter.title} — a chapter from ${course.title}.`,
            author: { "@type": "Person", name: "Will Roberts" },
            publisher: {
              "@type": "Organization",
              name: "Filmmaker Genius",
              logo: { "@type": "ImageObject", url: "https://filmmakergenius.com/og-image.jpg" },
            },
            url: `https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}`,
            isPartOf: {
              "@type": "Course",
              name: course.title,
              url: `https://filmmakergenius.com/academy/${course.slug}`,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://filmmakergenius.com/" },
              { "@type": "ListItem", position: 2, name: "Academy", item: "https://filmmakergenius.com/academy" },
              { "@type": "ListItem", position: 3, name: course.title, item: `https://filmmakergenius.com/academy/${course.slug}` },
              { "@type": "ListItem", position: 4, name: chapter.title, item: `https://filmmakergenius.com/academy/${course.slug}/${chapter.slug}` },
            ],
          },
        ]}
      />

      <style>{ARTICLE_CSS}</style>

      <div className="wrap" style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "20px 0 0", fontSize: 13, color: "rgba(255,255,255,.35)" }}>
          <Link to="/academy" className="cc-a" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>Academy</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link to="/academy/education" className="cc-a" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>Education Modules</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link to={`/academy/${course.slug}`} className="cc-a" style={{ color: "rgba(255,255,255,.35)", textDecoration: "none" }}>{course.title}</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,.6)" }}>{chapter.title}</span>
        </div>

        {/* Header */}
        <header style={{ padding: "30px 0 8px", borderBottom: "1px solid #1e1e35", marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 18 }}>
            {currentModule && (
              <span style={{ background: "rgba(0,212,170,.1)", border: "1px solid rgba(0,212,170,.25)", color: "#00d4aa", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
                {currentModule.label}
              </span>
            )}
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>Chapter {chapter.num} · {chapter.time} read</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 14 }}>
            {course.title} · <b style={{ color: "rgba(0,212,170,.75)", fontWeight: 700 }}>{chapter.kicker}</b>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 46, lineHeight: 1.08, margin: "0 0 16px" }}>{chapter.title}</h1>
          {chapter.dek && <p style={{ fontSize: 18, color: "rgba(255,255,255,.6)", lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={{ __html: chapter.dek }} />}
        </header>

        {/* Byline */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#00d4aa 0%,#0a7a63 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#031418" }}>WR</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>Will Roberts</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Working filmmaker · Written from the set</div>
          </div>
        </div>

        {/* Video Lesson */}
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.2)", borderRadius: 16, overflow: "hidden", marginBottom: 38 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#00d4aa"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span style={{ background: "rgba(0,212,170,.12)", border: "1px solid rgba(0,212,170,.3)", color: "#00d4aa", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
              Video Lesson — Coming Soon
            </span>
          </div>
        </div>

        {/* Article */}
        {chapter.body ? (
          <div className="fg-article" dangerouslySetInnerHTML={{ __html: chapter.body }} />
        ) : (
          <div className="fg-article">
            <p style={{ color: "rgba(255,255,255,.55)" }}>
              This chapter is being written. Check back soon — Will's on set. In the meantime, the chapters already published in this course are a great place to start.
            </p>
          </div>
        )}

        {/* Tool CTA */}
        {course.pairsWithName && course.pairsWithUrl && (
          <div className="tool-cta" style={{ background: "linear-gradient(135deg,#071820 0%,#0a2a30 100%)", border: "1px solid rgba(0,212,170,.25)", borderRadius: 16, padding: 30, margin: "40px 0", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#00d4aa"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#00d4aa", marginBottom: 6 }}>Pairs with this chapter</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 8 }}>{course.pairsWithName}</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.55, margin: 0 }}>{course.pairsWithDesc}</p>
            </div>
            <a href={course.pairsWithUrl} target="_blank" rel="noreferrer" style={{ background: "#00d4aa", color: "#031418", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
              Open {course.pairsWithName} →
            </a>
          </div>
        )}

        {/* Takeaways */}
        {chapter.takeaways.length > 0 && (
          <div style={{ background: "#0d0d1a", border: "1px solid #1e1e35", borderRadius: 16, padding: "28px 30px", margin: "44px 0" }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.3)", margin: "0 0 18px" }}>Key takeaways</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chapter.takeaways.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,212,170,.15)", border: "1px solid rgba(0,212,170,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4aa", fontSize: 11, fontWeight: 700, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,.78)", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter nav */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "48px 0 24px" }} className="cc-nav-grid">
          <style>{`@media (max-width:600px){.cc-nav-grid{grid-template-columns:1fr !important;}}`}</style>
          {prev ? (
            <Link to={`/academy/${course.slug}/${prev.slug}`} className="cc-nav-card" style={{ display: "block", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, textDecoration: "none", color: "#fff" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>← Previous</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{prev.title}</div>
            </Link>
          ) : (
            <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, opacity: .35, pointerEvents: "none" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>← Previous</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>You're at the beginning</div>
            </div>
          )}
          {next ? (
            <Link to={`/academy/${course.slug}/${next.slug}`} className="cc-nav-card" style={{ display: "block", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, textDecoration: "none", color: "#fff", textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#00d4aa", marginBottom: 6, fontWeight: 600 }}>Next Chapter →</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{next.title}</div>
            </Link>
          ) : (
            <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "20px 22px", minHeight: 92, opacity: .35, pointerEvents: "none", textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#00d4aa", marginBottom: 6, fontWeight: 600 }}>Next Chapter →</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>You've finished the course</div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 60 }}>
          <Link to={`/academy/${course.slug}`} className="cc-a" style={{ fontSize: 14, color: "rgba(255,255,255,.5)", textDecoration: "none" }}>
            ← Back to {course.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
