import type { Course, CourseChapter } from "../courseTypes";

const chapters: CourseChapter[] = [
  {
    slug: "how-to-make-a-dcp",
    num: 1,
    roman: "I",
    title: "What Delivery Actually Means",
    desc: "Delivery is the last mile — why the right file matters as much as the film",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "What Delivery Actually Means: How to Make a DCP | Filmmaker Genius",
    seoDesc: "How to make a DCP and deliver a film starts with understanding what 'delivery' means — handing your finished film over in the exact format the destination demands, or getting rejected. A working filmmaker's guide. Chapter 1 of DCP & Delivery.",
    dek: `You spent months finishing your film. Now comes a step nobody warns you about: handing it over in the precise technical format the festival, platform, or distributor demands. Get it wrong and your masterpiece bounces at the door. Delivery is the unglamorous last mile that decides whether your film is ever seen.`,
    body: `
    <p>Every guide to making a film ends when the film is done. But "done" isn't the finish line — <strong>delivery is</strong>, and it's the step that quietly kills more indie films' chances than any creative problem. Here's the reality: a festival, a streaming platform, a broadcaster, or a distributor doesn't want "your film." They want your film in an <em>exact</em> technical package — a specific format, resolution, frame rate, codec, audio configuration, with specific accompanying files — and if you hand them anything else, they reject it, or at best send it back with a list of fixes while your deadline burns. This isn't bureaucracy for its own sake; their playback systems and pipelines physically require these formats to work. So the mindset shift for this whole course is that <strong>delivery is a technical translation problem, not a creative one</strong>: your job is to take your beautiful finished film and repackage it into whatever precise shape each destination requires. It's unglamorous, it's fiddly, and it's absolutely essential — because a film nobody can play is a film nobody sees.</p>

    <h2>Why delivery trips people up</h2>

    <p>The reasons this step catches filmmakers off guard:</p>

    <ul class="spec-list">
      <li><b>It's invisible until it isn't.</b> Nobody talks about delivery while you're shooting and editing, so it hits you as a surprise at the exact moment you're exhausted and out of money — the worst time to learn a new technical skill.</li>
      <li><b>Every destination is different.</b> A cinema wants a DCP; a festival might want a DCP or a screener; a streamer wants a specific master and files; a broadcaster wants yet another package. There's no single "export" that works everywhere.</li>
      <li><b>The specs are unforgiving.</b> Wrong frame rate, wrong color space, wrong loudness, a missing file — any one can trigger a rejection. Delivery is pass/fail, and the standards are precise.</li>
      <li><b>It's often a hard deadline.</b> Festival delivery dates are fixed and strict. Miss the technical spec and miss the deadline, and your acceptance can evaporate. Delivery problems become existential fast.</li>
      <li><b>It feels like a foreign language.</b> DCP, mezzanine, ProRes, KDM, IMF, loudness, dual-mono — the vocabulary alone is intimidating. But it's learnable, and this course teaches it plainly.</li>
    </ul>

    <h2>The right mindset going in</h2>

    <p>The single most valuable thing you can do about delivery is <strong>plan for it early instead of scrambling at the end.</strong> The filmmakers who deliver smoothly aren't technical geniuses — they're the ones who found out the delivery requirements <em>before</em> they finished, so their edit, color, and sound were built to produce the right masters from the start. The ones who suffer are the ones who "finished" the film and only then asked "wait, how do I actually send this to the festival?" — and discovered their project was the wrong frame rate, or they never made a proper master, or the loudness is wrong for broadcast. So carry two principles through this course. First, <em>know your destination's specs before you lock anything</em>: read the delivery requirements of the festivals and platforms you're targeting the way you'd read a recipe before cooking, because they dictate technical choices upstream. Second, <em>make a proper high-quality master first, then derive everything from it</em> — because a clean master is the source you'll repackage into a DCP, a screener, a streaming file, or a broadcast package, and if the master is right, every delivery is just a translation. That's the roadmap of everything ahead: we'll build up from what a master is, through codecs and specs, into the DCP itself and how to make and test one, then subtitles and accessibility, and finally the specific packages festivals, streamers, and broadcasters demand — closing with a checklist and archive. None of it is as scary as the jargon suggests. Delivery is just the craft of handing your film over correctly, and learning it is the difference between a film that gets played and a film that gets bounced. Let's start with the foundation everything else derives from: your master file, next.</p>

    <div class="pullquote">"Done" isn't the finish line — delivery is. A festival or platform doesn't want your film; they want it in an exact technical package. A film nobody can play is a film nobody sees.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My first festival acceptance nearly became a rejection. I'd finished the film, celebrated, then read the delivery email: DCP required, specific frame rate, specific audio config, due in twelve days. I had no master, didn't know what a DCP was, and my project was the wrong frame rate for their spec. I spent those twelve days in a panic learning what should have taken a calm afternoon months earlier. We made the deadline by luck. Now the first thing I do on any film is read the delivery specs of where I want it to go — before I lock a single frame. Delivery isn't the end of the work. It's part of it.</p>
    </div>
`,
    takeaways: [
      "Delivery is the real finish line — handing your film over in the exact format each destination demands, or getting rejected.",
      "It's a technical translation problem, not a creative one — every destination (cinema, festival, streamer, broadcaster) wants a different package.",
      "Specs are pass/fail and deadlines are strict — wrong frame rate, color, loudness, or a missing file triggers rejection.",
      "Plan early: learn your destination's specs before you lock, make a proper master first, and derive every delivery from it.",
    ],
  },
  {
    slug: "film-master-file",
    num: 2,
    roman: "II",
    title: "Masters, Mezzanines & Deliverables",
    desc: "Masters, mezzanines, and deliverables — the file hierarchy explained",
    time: "8 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "Masters, Mezzanines & Deliverables: The Film Master File | Filmmaker Genius",
    seoDesc: "The film master file explained — what a master, mezzanine, and deliverable are, why you make the master first, and how everything else derives from it. A working filmmaker's guide. Chapter 2 of DCP & Delivery.",
    dek: `The whole delivery workflow rests on one idea: make one pristine master, then derive everything else from it. This chapter defines the file hierarchy — master, mezzanine, and deliverable — so you always know which file you're making and why.`,
    body: `
    <p>Delivery vocabulary sounds like a wall of jargon, but underneath it is a simple, logical hierarchy of files, and once you see it, everything clicks. At the top sits your <strong>master</strong>: the single highest-quality, pristine version of your finished film, fully graded and mixed, exported in a high-end format with no visible compression. Think of it as the negative — the definitive source you protect and never post online or hand to a festival directly. From that master you create <strong>deliverables</strong>: the specific packaged versions each destination requires — a DCP for cinema, a compressed screener for a festival portal, a streaming master for a platform, a broadcast package for a TV sale. In between, you'll sometimes hear <strong>mezzanine</strong>: a high-quality intermediate file, lighter than the full master but still excellent, used as a convenient working source to make various deliverables from. The mental model that makes delivery manageable is this: <strong>one master at the top, many deliverables below, all flowing from that single pristine source.</strong> Get the master right, and every delivery is just a controlled derivation.</p>

    <h2>The file hierarchy</h2>

    <p>Know these three tiers and you know the whole system:</p>

    <ul class="spec-list">
      <li><b>The master.</b> Your definitive, highest-quality file — final grade, final mix, high-end codec (like ProRes 4444 or an uncompressed/lossless format), correct resolution and frame rate. This is your "negative." Store it safely; it's the source of everything.</li>
      <li><b>The mezzanine (optional).</b> A high-quality intermediate — smaller than the master but still visually excellent (often ProRes 422 HQ) — that's easier to store and work from when generating multiple deliverables. Not always needed, but handy on bigger projects.</li>
      <li><b>Deliverables.</b> The purpose-built packages each destination demands: DCP (cinema), screener file (festival review), streaming/VOD master, broadcast master, trailer files, and so on. Each is derived from the master to a precise spec.</li>
      <li><b>Supporting files.</b> Delivery is rarely just the picture — it usually includes separate audio stems, subtitle/caption files, artwork, metadata, and paperwork (chain of title, music cue sheets). More on these in later chapters.</li>
    </ul>

    <h2>Make the master first, protect it always</h2>

    <p>The one discipline that separates smooth deliveries from chaotic ones is <strong>creating a proper master before you make a single deliverable, and treating it as sacred.</strong> When your film is finally locked, graded, and mixed, your very first export should be the master — the best-quality version, in a robust format, with everything correct — and then you make copies. This matters for three reasons. First, <em>quality</em>: every deliverable you create will be a compression or transformation of its source, and you want that source to be pristine, because you can always go from high quality to low, but never the reverse — a screener made from a full master looks better than one made from another compressed file. Second, <em>flexibility</em>: months later a new opportunity appears (a foreign sale, a different festival, a platform with its own specs), and if you have a clean master you can generate whatever new deliverable they need in an afternoon; if you don't, you're re-exporting from your editing project, which may have moved, changed, or broken. Third, <em>safety</em>: your master is the irreplaceable artifact of all your work, so you back it up in multiple places and guard it, because losing it means potentially losing the ability to ever deliver your film again. A practical tip: when you make your master, also make and safely store the separate audio stems (dialogue, music, effects) and a textless version (without titles or subtitles burned in), because foreign and broadcast deliveries frequently require these and re-creating them later is painful. In short, the workflow is always the same shape — finish the film, make the pristine master, protect and back it up, then derive each deliverable from it to the exact spec required. Every remaining chapter is really about that last step: turning your master into the specific package a cinema, festival, streamer, or broadcaster will accept. And to do that well, you need to understand the raw materials those packages are built from — codecs and containers, which is where we go next.</p>

    <div class="pullquote">One master at the top, many deliverables below. Make the pristine master first, guard it like a negative, and derive every delivery from it — because you can always go from high quality to low, never the reverse.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A film I worked on got a surprise foreign sale a year after release — great news, until the buyer's spec sheet asked for a textless master and separate audio stems. We'd never made them, the edit project was a mess of relinked media on a drive nobody could find, and recreating clean stems took a miserable week. On my next film I made the master, the stems, and a textless version on day one of picture lock and backed them up three ways. When opportunities came, delivery was a same-day job. Make the master first, make the extras while you're there, and never touch the editing project again if you can help it.</p>
    </div>
`,
    takeaways: [
      "The delivery hierarchy is simple: one pristine master at the top, optional mezzanine intermediates, and many deliverables below.",
      "The master is your \"negative\" — highest quality, final grade and mix, never posted or delivered directly; every deliverable derives from it.",
      "Make the master first and back it up in multiple places — you can go high-to-low quality, never the reverse.",
      "While you're at it, make audio stems and a textless version too — foreign and broadcast deliveries often demand them.",
    ],
  },
  {
    slug: "video-codecs-explained",
    num: 3,
    roman: "III",
    title: "Codecs, Containers & Wrappers",
    desc: "Codecs, containers, and wrappers — ProRes, DNxHR, H.264 and what they're for",
    time: "9 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "Codecs, Containers & Wrappers Explained | Filmmaker Genius",
    seoDesc: "Video codecs explained for delivery — ProRes, DNxHR, H.264, and the difference between a codec, a container, and a wrapper, so you export the right file every time. A working filmmaker's guide. Chapter 3 of DCP & Delivery.",
    dek: `"Export as ProRes 422 HQ in a QuickTime .mov" sounds like a foreign language until you understand the two things it's actually saying. This chapter untangles codecs from containers so that delivery specs stop being intimidating and start being instructions you can follow.`,
    body: `
    <p>Most delivery confusion comes from mixing up two different things that a spec sheet mentions in the same breath: the <strong>codec</strong> and the <strong>container</strong>. Here's the clean way to think about it. The <em>codec</em> is how the video is compressed and encoded — the actual method used to squeeze the picture into data (ProRes, DNxHR, H.264, JPEG2000). The <em>container</em> (or wrapper) is the file format that holds the encoded video, audio, and metadata together — the "box" (.mov, .mp4, .mxf). A useful analogy: the codec is the <em>language</em> the video is written in, and the container is the <em>envelope</em> you put it in. A spec like "ProRes 422 HQ in a .mov" is just telling you the language (ProRes) and the envelope (.mov). Once you separate these two ideas, delivery specs stop reading as gibberish and start reading as a simple two-part instruction: encode it <em>this</em> way, wrap it in <em>that</em> file. Let me give you the handful of codecs and containers that actually matter for delivery so you can recognize any spec you're handed.</p>

    <h2>The codecs that matter</h2>

    <p>You only need to know a few:</p>

    <ul class="spec-list">
      <li><b>ProRes (Apple).</b> The workhorse mastering codec. "Visually lossless" flavors like 422 HQ and 4444 are the standard for masters and high-quality deliverables. If a spec asks for a mastering-quality file, it usually means ProRes.</li>
      <li><b>DNxHR / DNxHD (Avid).</b> The equivalent to ProRes, common in the Avid and Windows world. Same idea — high-quality mastering codec. Specs often accept "ProRes 422 HQ or DNxHR HQX."</li>
      <li><b>H.264 / H.265 (HEVC).</b> Highly compressed delivery codecs for the web, screeners, and streaming. Small files, good quality for viewing, but too compressed to be a master. This is what you export for a festival screener or YouTube.</li>
      <li><b>JPEG2000.</b> The codec inside a DCP. You won't handle it directly, but it's why a DCP is different from a normal video file — it's a specialized cinema codec (more in the DCP chapters).</li>
      <li><b>Uncompressed / lossless.</b> Occasionally required for the highest-end masters. Huge files, perfect quality. Rarely needed at indie level, but good to recognize.</li>
    </ul>

    <h2>Containers, and matching the spec exactly</h2>

    <p>The containers you'll meet are just as few: <strong>.mov</strong> (QuickTime — the common wrapper for ProRes masters and many deliverables), <strong>.mp4</strong> (the standard wrapper for H.264/H.265 web and streaming files), and <strong>.mxf</strong> (a professional broadcast container, and also the wrapper used inside DCPs and IMF packages). A given codec usually lives in a particular container — ProRes in .mov, H.264 in .mp4 — but not always, which is exactly why specs name both: they're removing ambiguity. And here's the crucial discipline this chapter is really about: <strong>match the delivery spec exactly, don't approximate.</strong> If a festival asks for "H.264, .mp4, up to 10 Mbps, 1080p," you deliver precisely that — not a ProRes file because it's higher quality (it'll be rejected as the wrong format and too large), and not a random export at whatever bitrate your software defaulted to. The spec exists because their system expects that exact combination, and "better" is not the same as "correct." When you get a delivery spec, read it as a checklist of parameters — codec, container, resolution, frame rate, bitrate, audio format — and hit every single one. A great free tool here is MediaInfo, which reads any video file and tells you its actual codec, container, resolution, frame rate, and bitrate; run it on your export and compare against the spec line by line before you send anything, because a file that <em>looks</em> right in your player can still be the wrong codec or frame rate under the hood. Understanding codecs and containers turns delivery specs from a source of dread into a form you fill out correctly. With the file formats demystified, the next chapter covers the other half of any spec — the technical parameters like resolution, frame rate, color space, and loudness that get checked just as strictly.</p>

    <div class="pullquote">The codec is the language the video is written in; the container is the envelope it's mailed in. A spec naming both isn't gibberish — it's a two-part instruction: encode it this way, wrap it in that file.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A festival rejected my screener and I couldn't understand why — it played perfectly on my machine. I ran MediaInfo on it and saw the problem instantly: I'd exported ProRes in a .mov when they'd asked for H.264 in an .mp4 under 10 Mbps. My "high quality" file was a 40 GB monster their portal couldn't ingest. I re-exported to their exact spec, a tidy 1.5 GB .mp4, and it sailed through. Lesson learned: "better" isn't "correct." Now I run MediaInfo on every deliverable and check it against the spec sheet line by line before I hit send. Thirty seconds of checking saves a rejection.</p>
    </div>
`,
    takeaways: [
      "A codec is how the video is encoded (ProRes, DNxHR, H.264); a container is the file that holds it (.mov, .mp4, .mxf).",
      "Use ProRes/DNxHR for masters, H.264/H.265 for screeners and streaming, and JPEG2000 (inside a DCP) for cinema.",
      "Match the delivery spec exactly — \"better quality\" is not \"correct\"; the wrong codec or container gets rejected.",
      "Run MediaInfo on every export and check codec, container, resolution, frame rate, and bitrate against the spec before sending.",
    ],
  },
  {
    slug: "delivery-technical-specs",
    num: 4,
    roman: "IV",
    title: "Color, Frame Rate & Technical Specs",
    desc: "Resolution, frame rate, color space, and loudness — the specs that get checked",
    time: "9 min",
    moduleKey: "foundations",
    kicker: "Foundations",
    seoTitle: "Color, Frame Rate & Technical Specs for Delivery | Filmmaker Genius",
    seoDesc: "Delivery technical specs explained — resolution, frame rate, aspect ratio, color space, and audio loudness, and why each one gets checked at the door. A working filmmaker's guide. Chapter 4 of DCP & Delivery.",
    dek: `Codec and container are only half a spec. The other half — resolution, frame rate, aspect ratio, color space, and audio loudness — gets checked just as strictly, and a mismatch on any of them bounces your file. Here's what each one means and why it matters.`,
    body: `
    <p>A delivery spec is a list of parameters, and codec and container are only two of them. The rest describe the actual shape and character of your picture and sound, and each one is checked — often automatically — when you deliver. The reason these matter so much is that a playback system or pipeline is built for a specific set of these values, and a mismatch doesn't just look slightly off; it can make the file unplayable, out of sync, wrong-colored, or too loud/quiet for their standard, any of which is a rejection. The good news is that most of these you set correctly <em>once</em>, early in the project, and then they take care of themselves — which is exactly why this chapter belongs in Foundations. Decide your resolution, frame rate, and aspect ratio at the start and build the whole film to them, and delivery becomes far simpler. Let me walk through the parameters you'll see on every spec sheet.</p>

    <h2>The specs that get checked</h2>

    <p>Know each of these and what it controls:</p>

    <ul class="spec-list">
      <li><b>Resolution.</b> The pixel dimensions — 1920×1080 (HD/2K-ish), 3840×2160 (UHD/4K), and cinema's 2K (2048×1080) or 4K (4096×2160). Deliver the resolution asked for; don't upscale a lower-res film to fake a higher one.</li>
      <li><b>Frame rate.</b> Frames per second — 23.976/24, 25, 29.97, 30, etc. This is the one to lock at the very start, because it's baked into your entire project. Delivering the wrong frame rate causes judder or sync problems and is a common rejection.</li>
      <li><b>Aspect ratio.</b> The shape of the frame — 1.85:1, 2.39:1 (scope), 16:9. Cinema specs care about this precisely; delivering the wrong aspect can mean black bars in the wrong places or a stretched image.</li>
      <li><b>Color space &amp; bit depth.</b> The color standard — Rec.709 (HD/streaming), DCI-P3 (cinema/DCP), Rec.2020/HDR for high-end. Deliver in the color space the spec asks for, or your carefully graded film will look wrong on their system.</li>
      <li><b>Audio configuration.</b> Channel layout — stereo (2.0), 5.1 surround, and whether tracks are split (discrete stems) or mixed. Specs are precise about which channel is which; a wrong config means missing or misrouted sound.</li>
      <li><b>Loudness.</b> The measured audio level, in LUFS/LKFS, to a target standard (broadcast and streaming enforce this strictly — e.g. -23 or -24 LUFS). Too loud or too quiet gets flagged; you often need to run a loudness-normalization pass.</li>
    </ul>

    <h2>Lock it early, verify it late</h2>

    <p>Two principles turn this list from intimidating into manageable. First, <strong>lock the fundamentals at the start of the project.</strong> Frame rate, resolution, and aspect ratio should be decided before you shoot or at least before you edit, and your whole project built to them, because they're extremely painful to change late — converting frame rates introduces artifacts, changing aspect ratio re-frames every shot, and upscaling resolution never truly adds detail. If you know you're aiming for cinema, that informs choices from the camera onward. The filmmakers who deliver painlessly are the ones who worked to a target spec the whole way through, so their finished film already <em>is</em> the shape their deliverables need. Second, <strong>verify against the spec before you send.</strong> When a deliverable is exported, check every one of these parameters against the destination's requirements — resolution, frame rate, aspect, color space, audio config, loudness — the same way you checked codec and container last chapter. Loudness especially trips people up because it's invisible: your mix might sound great but measure at the wrong LUFS for a broadcaster, so you run a loudness meter (many are free, and NLEs increasingly have loudness normalization built in) and correct it to their target. A useful reality check: color space and loudness are the two "silent killers" here, because a file can play perfectly on your setup and still be in the wrong color standard or at the wrong loudness for the destination's calibrated system — problems you only catch by measuring, not by eyeballing. So build a habit of treating every delivery spec as a checklist and ticking off each parameter with a tool, not a guess. Master this and codecs together, and you can read any spec sheet in the world and produce a file that passes. That completes your foundations — you now understand what delivery is, the master hierarchy, codecs and containers, and the technical parameters. Module 2 gets hands-on with the format that intimidates indies most and needn't: the DCP, starting with what it actually is.</p>

    <div class="pullquote">Lock frame rate, resolution, and aspect ratio at the very start and build the whole film to them — then delivery is easy, because your finished film already is the shape its deliverables need.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Two delivery disasters taught me these lessons. The first: I edited a film at 30fps without thinking, then a festival required 24 — converting it introduced ugly judder I could never fully fix. The second: a broadcaster rejected a delivery that sounded perfect to me, because my mix measured at the wrong loudness; I'd never even heard of LUFS. Now I lock frame rate and aspect on day one, and I run a loudness meter and a color-space check on every deliverable before it leaves. The specs that get you are the invisible ones — frame rate, color space, loudness — so I measure them instead of trusting my eyes and ears.</p>
    </div>
`,
    takeaways: [
      "Beyond codec and container, specs check resolution, frame rate, aspect ratio, color space, audio config, and loudness.",
      "Lock frame rate, resolution, and aspect ratio at the start — they're baked into the project and painful to change late.",
      "Color space and loudness are the \"silent killers\" — a file can look and sound fine to you but be wrong for their calibrated system.",
      "Verify every parameter with a tool (loudness meter, MediaInfo) against the spec before sending — measure, don't guess.",
    ],
  },
  {
    slug: "what-is-a-dcp",
    num: 5,
    roman: "V",
    title: "What Is a DCP?",
    desc: "What a DCP actually is — the cinema's delivery format, demystified",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "What Is a DCP? The Digital Cinema Package Explained | Filmmaker Genius",
    seoDesc: "What is a DCP? The Digital Cinema Package explained in plain English — what's inside it, why cinemas require it, and how it differs from a normal video file. A working filmmaker's guide. Chapter 5 of DCP & Delivery.",
    dek: `The word "DCP" strikes fear into indie filmmakers, but it's just the format cinemas use to play your film — a folder of files, not black magic. Understand what's inside it and why it exists, and it stops being intimidating and starts being a package you can actually make.`,
    body: `
    <p>DCP stands for <strong>Digital Cinema Package</strong>, and it is simply the standardized format that modern cinemas use to play films — the digital successor to the reels of film that used to arrive in metal cans. When your film screens at a proper cinema or many festivals, it plays from a DCP loaded onto the cinema's server. The reason indies find it scary is that it's not a normal video file you can double-click and play; it's a <em>folder</em> containing several specialized files that only cinema equipment (or dedicated DCP software) can play, built to a strict international standard so that any DCP works on any compliant cinema projector anywhere in the world. That standardization is the whole point: a distributor can send the same DCP to a thousand cinemas and trust it'll play identically on all of them. So a DCP isn't a mysterious black box — it's a precisely-specified package designed for reliability and universality. Let me open it up so you can see there's nothing magical inside.</p>

    <h2>What's actually inside a DCP</h2>

    <p>Peel back the acronym and a DCP is a folder containing:</p>

    <ul class="spec-list">
      <li><b>Picture, as JPEG2000 frames.</b> Your image, encoded frame-by-frame in the JPEG2000 codec (from Chapter 3) and wrapped in MXF. This is why a DCP looks so good — it's a very high-quality, cinema-grade encode, not a compressed web file.</li>
      <li><b>Sound, as uncompressed audio.</b> Your mix as high-quality uncompressed PCM audio in MXF, in the correct channel layout (often 5.1). Cinema sound is pristine — no lossy compression.</li>
      <li><b>The "recipe" files (XMLs).</b> A set of small text files — the CPL (Composition Playlist, which lists what plays in what order), the PKL (Packing List), ASSETMAP, and VOLINDEX — that tell the cinema server how to assemble and play the package. These are the instructions that tie the picture and sound together.</li>
      <li><b>Colour in DCI-P3, XYZ-encoded.</b> A DCP uses the cinema color standard (from Chapter 4), so your grade must be converted for it — which is why a film graded for streaming needs a DCP-specific conversion to look right on a cinema screen.</li>
      <li><b>Optional: subtitles &amp; encryption.</b> A DCP can include subtitle files, and can be encrypted (requiring a KDM "key" to unlock) — both covered in upcoming chapters.</li>
    </ul>

    <h2>Why it works this way — and why you needn't fear it</h2>

    <p>Understanding <em>why</em> a DCP is built like this makes it far less intimidating. Every design choice serves one goal: <strong>a film that plays flawlessly and identically on any cinema screen in the world, with the best possible picture and sound.</strong> The JPEG2000 frame-by-frame encoding means the projector can decode it reliably in real time at high quality; the uncompressed audio means the sound is pristine; the DCI-P3 color and XYZ encoding mean your grade translates correctly to cinema projectors; and the strict standard and recipe files mean there's no ambiguity about how to play it. It's engineered for a context — a paying audience in a dark room on a giant screen — where playback failures and quality compromises are unacceptable. Now, the two things indies most need to internalize. First, <strong>a DCP is not something you can preview by double-clicking</strong> — you need DCP-player software (there are free ones) to check it on your computer, which is exactly why testing gets its own chapter. Second, and most reassuring: <strong>you can make a DCP yourself, for free.</strong> For years, making a DCP meant paying a post house hundreds or thousands of dollars, and that expense is a big reason DCPs feel out of reach. But free, capable tools now exist (DCP-o-matic being the famous one) that let a solo filmmaker turn their master into a valid, cinema-playable DCP on their own laptop — which is the entire subject of the next chapter. So don't let the acronym scare you off submitting to festivals that require a DCP. It's a folder of files built to a clear standard, its design all makes sense once you see inside it, and you have the tools to make one without a lab. The mystery is really just unfamiliarity. Now that you know what a DCP <em>is</em>, let's actually build one.</p>

    <div class="pullquote">A DCP isn't black magic — it's a folder of files built to a strict standard so your film plays flawlessly and identically on any cinema screen in the world. And you can make one yourself, for free.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The word "DCP" almost stopped me submitting my first short to a cinema festival — I assumed it required a lab and money I didn't have. Then someone showed me a DCP is literally a folder you can open and look inside: some MXF files for picture and sound, a few little XML "recipe" files. Once I saw it wasn't a magic sealed object but a sensible package with parts I could understand, the fear evaporated. I made my own with free software that weekend and it played perfectly on the big screen. Ninety percent of DCP anxiety is just not knowing what's in the box. Open the box.</p>
    </div>
`,
    takeaways: [
      "A DCP (Digital Cinema Package) is the standardized folder of files cinemas use to play films — the digital successor to film reels.",
      "Inside it: JPEG2000 picture and uncompressed audio in MXF, small XML \"recipe\" files, and DCI-P3 cinema color.",
      "Its strict standard exists so one DCP plays flawlessly and identically on any compliant cinema projector worldwide.",
      "You can't double-click a DCP to preview it — but you can make one yourself for free with tools like DCP-o-matic.",
    ],
  },
  {
    slug: "how-to-create-a-dcp",
    num: 6,
    roman: "VI",
    title: "Making a DCP on a Budget",
    desc: "Build a DCP yourself with free tools — step by step, on a budget",
    time: "9 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "Making a DCP on a Budget: How to Create a DCP | Filmmaker Genius",
    seoDesc: "How to create a DCP for free — a step-by-step guide to turning your master into a cinema-ready Digital Cinema Package with DCP-o-matic, without paying a post house. A working filmmaker's guide. Chapter 6 of DCP & Delivery.",
    dek: `Post houses charge hundreds or thousands to make a DCP. You can make one yourself, for free, on your own laptop. This chapter walks through the process with the tool the indie world relies on — so the next time a cinema festival asks for a DCP, you just make it.`,
    body: `
    <p>For years, "you need a DCP" was code for "you need to pay a post facility," and the cost — often several hundred to a couple thousand dollars per version — put cinema and festival screenings out of reach for a lot of indies. That barrier is gone. Free, open-source software now lets you convert your master into a fully valid, cinema-playable DCP on your own computer, and the standard tool the indie world uses is <strong>DCP-o-matic</strong> — free, cross-platform, actively maintained, and genuinely capable of producing DCPs that play in real cinemas. Making a DCP with it isn't difficult; it's mostly a matter of feeding it your correct master and setting a handful of parameters properly, then letting it churn. This chapter walks the process at a level that demystifies it. (It's not a click-by-click manual — the software changes and has good documentation — but a map of what you're doing and the choices that matter, so you approach it with confidence instead of dread.)</p>

    <h2>The DCP-making process</h2>

    <p>Turning your master into a DCP, step by step:</p>

    <ul class="spec-list">
      <li><b>Start from a correct master.</b> Feed it your best-quality master (from Chapter 2) at the right resolution and frame rate. Garbage in, garbage out — a DCP can't fix a bad source, so get the master right first.</li>
      <li><b>Set the container &amp; resolution.</b> Choose the DCP container size — 2K (2048×1080) or 4K (4096×2160) — and the aspect ratio (Flat 1.85 or Scope 2.39). Match what your festival/cinema specified. Most indie DCPs are 2K, which plays everywhere.</li>
      <li><b>Set the frame rate.</b> Use your film's actual frame rate (commonly 24fps for DCP). Mismatches cause playback problems. DCP frame-rate support is specific, so confirm your rate is a valid DCP rate.</li>
      <li><b>Handle color conversion.</b> The software converts your Rec.709 master to the cinema's DCI-P3/XYZ color. Choose the correct input color space so your grade translates faithfully — getting this wrong makes the DCP look washed out or off.</li>
      <li><b>Configure audio.</b> Map your audio to the correct DCP channels (e.g. stereo or 5.1 layout). Make sure left/right/center and surrounds land in the right channels — cinema audio routing is specific.</li>
      <li><b>2D, unencrypted, single reel — keep it simple.</b> For most festival submissions, an unencrypted 2D DCP is what you want (encryption needs KDMs — next chapter — and festivals usually prefer unencrypted). Then let it encode. It takes time; a feature can run many hours.</li>
    </ul>

    <h2>Get the inputs right and let it run</h2>

    <p>The mindset that makes DCP creation painless is realizing that <strong>the tool does the hard technical work; your job is to give it correct inputs and settings.</strong> You're not hand-encoding JPEG2000 or writing XML recipe files — DCP-o-matic does all of that. What you control is: the right master in, the right container/resolution/aspect, the right frame rate, the correct color-space conversion, and the correct audio mapping. Get those right and the output is a valid DCP; get one wrong and you get a DCP that's the wrong shape, wrong color, or won't play. So slow down on the settings and match them to your target's spec exactly, then be patient with the long encode. A few practical realities. DCP encoding is <em>slow</em> and CPU-heavy — budget hours, not minutes, for a feature, and don't do it the night before a deadline. DCPs are <em>large</em> — often tens to over a hundred gigabytes — so you need the drive space, and you'll deliver it on a physical drive (usually a specifically-formatted CRU/EXT drive for cinemas, though many festivals now accept upload). Name it properly using DCP naming conventions (the software helps), because cinema servers read those names. And most importantly — which is the entire next chapter — <strong>you must test the finished DCP before you send it</strong>, because a DCP that fails at a screening with a live audience is a nightmare, and a surprising number of home-made DCPs have small errors that only show up on playback. But none of this is beyond a determined solo filmmaker. The first DCP you make will feel like an achievement; the second will feel routine. The point of this chapter is simply this: a required DCP is no longer a reason to pay a lab or skip a festival — it's an afternoon (plus a long render) with free software. You made the film; you can make the DCP. Next, we make sure it actually works, and cover encryption and KDMs.</p>

    <div class="pullquote">A required DCP is no longer a reason to pay a lab or skip a festival. Free software does the hard technical work — your job is correct inputs and settings, then patience with a long render. You made the film; you can make the DCP.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My first DCP quote from a post house was $900 for one version. As a broke filmmaker that was a gut-punch — nearly my whole finishing budget. Someone pointed me to DCP-o-matic, free. I was terrified I'd get it wrong, but it turned out to be a matter of loading my master, setting 2K Flat, 24fps, the right color space, mapping my stereo audio, and hitting go. It rendered overnight. I tested it, it played perfectly at the festival, and I'd spent zero dollars. Since then I've made DCPs for every film. The tool isn't the hard part — being careful with the settings and testing the result is. And that's free.</p>
    </div>
`,
    takeaways: [
      "You can make a valid, cinema-playable DCP yourself for free with DCP-o-matic — no post house required.",
      "The tool does the hard encoding; you provide a correct master and set container/resolution, aspect, frame rate, color space, and audio mapping to match the spec.",
      "Most festival DCPs are 2K, unencrypted, 2D — keep it simple; DCP encoding is slow and files are large, so plan time and drive space.",
      "Never send a DCP without testing it first — small errors that only appear on playback are common in home-made DCPs.",
    ],
  },
  {
    slug: "dcp-testing-and-kdm",
    num: 7,
    roman: "VII",
    title: "DCP Testing & KDMs",
    desc: "Test your DCP so it plays, and understand KDMs and encryption",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "DCP Testing & KDMs: Testing a DCP and Encryption Keys | Filmmaker Genius",
    seoDesc: "DCP testing and KDMs explained — how to test a DCP so it plays at your screening, and what KDM encryption keys are and when you need them. A working filmmaker's guide. Chapter 7 of DCP & Delivery.",
    dek: `A DCP that fails in front of a paying audience is a filmmaker's nightmare — and it's entirely preventable. This chapter covers how to test your DCP before it ever reaches a cinema, plus the one bit of DCP jargon left to demystify: KDMs, the encryption keys, and why for festivals you usually don't want them.`,
    body: `
    <p>Making a DCP is only half the job; the other half is making sure it actually <em>works</em>, because a DCP is delivered blind — you hand it over, and the next time it plays might be in front of an audience. A DCP that won't load, plays with corrupted picture, has no sound, or crashes the cinema server is one of the most stressful things that can happen to a filmmaker, and it's almost always preventable with testing. The problem is that you can't just double-click a DCP to check it, so testing requires a deliberate step. The good news: <strong>you can validate and preview a DCP on your own computer with free software before it goes anywhere near a cinema.</strong> Two kinds of checking matter — verifying the package is technically valid, and actually watching it play — and doing both catches the overwhelming majority of DCP disasters while you can still fix them.</p>

    <h2>How to test a DCP</h2>

    <p>Before any DCP leaves your hands:</p>

    <ul class="spec-list">
      <li><b>Validate the package.</b> Use a DCP validator (some tools, including DCP-o-matic's ecosystem, can check a DCP against the standard) to confirm the files, hashes, and structure are correct and nothing is corrupt or malformed. This catches technical faults before playback.</li>
      <li><b>Play it in a DCP player.</b> Free DCP-player software lets you actually watch your DCP on your computer — checking that picture and sound play, are in sync, look right (color), and run start to finish without glitches. This is the single most important test.</li>
      <li><b>Check color and audio specifically.</b> DCP color conversion is where home-made DCPs go wrong — watch for a washed-out or oddly-tinted image versus your master. Confirm audio is present, in sync, and in the right channels (especially if 5.1).</li>
      <li><b>Test on real cinema gear if you can.</b> The gold standard is a test screening on an actual cinema server before your real one — many venues will do a technical check, and some festivals let you test in advance. Nothing beats seeing it on the target system.</li>
      <li><b>Deliver with time to spare.</b> Send or bring the DCP early enough that the venue can ingest and test it before your screening, so any problem surfaces with time to fix, not five minutes before the lights go down.</li>
    </ul>

    <h2>KDMs and encryption — and why festivals skip them</h2>

    <p>The last piece of DCP jargon is the <strong>KDM — Key Delivery Message</strong>. A DCP can be <em>encrypted</em>, meaning the package is locked and won't play without a matching digital key, the KDM. That key is generated for a <em>specific cinema server</em> and a <em>specific time window</em>, so an encrypted film only plays on the authorized projector during the authorized dates. This exists for a good reason at the commercial level: it's anti-piracy protection for wide theatrical releases, ensuring a blockbuster only plays where and when it's licensed. But here's what matters for you as an indie: <strong>for festivals and most indie screenings, you almost always want an UNencrypted DCP, and you should not encrypt unless specifically required.</strong> Encryption adds a whole layer of complexity and failure — you have to collect the exact server certificate from each venue, generate a correctly-configured KDM for each screening's dates, and deliver the key alongside the DCP, and if the KDM is wrong, expired, made for the wrong server, or the dates are off, your film simply won't play. Festivals hate this because they juggle hundreds of films and don't want to chase keys, so most explicitly request unencrypted DCPs. Unless a distributor or a specific venue tells you they require encryption (which for indie festival play is rare), make your DCP unencrypted — it's simpler, it's what festivals want, and it removes an entire category of "the key didn't work" disasters. If you ever <em>do</em> need an encrypted DCP for a commercial engagement, that's when you'll get each venue's certificate and generate a dated KDM per screening, and the tools support it — but treat it as an advanced case you opt into only when required, not a default. So the rule of thumb: test every DCP by validating and playing it before you send it, deliver early, and keep it unencrypted unless someone specifically demands otherwise. Do that and DCP delivery goes from a source of terror to a routine, reliable step. With picture and sound handled, the next chapter adds a delivery element that's increasingly required and often forgotten: subtitles, captions, and accessibility.</p>

    <div class="pullquote">A DCP is delivered blind — the next time it plays might be in front of an audience. Validate it and watch it play on your own computer first, deliver early, and keep it unencrypted unless someone specifically demands a key.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>I heard a horror story that made me a testing zealot: a filmmaker's encrypted DCP wouldn't play at their premiere because the KDM was generated for the wrong server, and there was no time to fix it — a packed house, and their film couldn't screen. Two lessons burned in. One: always test the DCP by actually playing it before delivery, and deliver early enough for the venue to test too. Two: never encrypt for a festival — I make every festival DCP unencrypted, so there's no key to be wrong. Since adopting both rules, I've never had a DCP fail. The nightmare is real, and it's completely avoidable.</p>
    </div>
`,
    takeaways: [
      "A DCP plays blind in front of an audience — always test it before delivery to prevent a screening disaster.",
      "Validate the package with a checker, then watch it play in a free DCP player — check picture, sound, sync, and color.",
      "A KDM is an encryption key tied to a specific server and dates — needed for anti-piracy on commercial releases.",
      "For festivals, deliver an unencrypted DCP unless specifically told otherwise — it's what they want and removes \"key didn't work\" failures.",
    ],
  },
  {
    slug: "subtitles-and-captions",
    num: 8,
    roman: "VIII",
    title: "Subtitles, Captions & Accessibility",
    desc: "Subtitles, closed captions, and accessibility tracks done right",
    time: "8 min",
    moduleKey: "core",
    kicker: "Core Craft",
    seoTitle: "Subtitles, Captions & Accessibility for Delivery | Filmmaker Genius",
    seoDesc: "Subtitles and captions for film delivery — the difference between subtitles, SDH, and closed captions, the file formats, and the accessibility tracks festivals and platforms now require. A working filmmaker's guide. Chapter 8 of DCP & Delivery.",
    dek: `Subtitles and captions aren't an afterthought anymore — they're a delivery requirement, an accessibility obligation, and a way to reach a far wider audience. This chapter untangles subtitles from SDH from closed captions, covers the file formats, and shows how to get them right.`,
    body: `
    <p>Text-on-screen for dialogue used to be optional for a lot of indie films. It isn't anymore. Streaming platforms mandate closed captions, broadcasters require them, festivals increasingly ask for subtitle files, foreign markets need translated subtitles, and accessibility law and expectation mean that leaving out captions excludes deaf and hard-of-hearing viewers. On top of the obligation, there's opportunity: captions dramatically expand who can watch and enjoy your film, including the huge number of viewers who watch with sound off. So this is a delivery element to plan for, not scramble on — and the first step is clearing up terms that get used interchangeably but mean different things. <strong>Subtitles</strong> translate spoken dialogue (assuming the viewer can hear, e.g. a foreign film subtitled in English). <strong>Closed captions / SDH</strong> (Subtitles for the Deaf and Hard-of-hearing) transcribe dialogue <em>and</em> describe relevant sound — "[door slams]", "[ominous music]", speaker IDs — for viewers who can't hear the audio. And <strong>closed vs. open</strong> refers to whether the text can be turned on/off (closed, a separate file) or is burned permanently into the picture (open). Knowing which one a spec is asking for is half the battle.</p>

    <h2>The captioning landscape</h2>

    <p>What to know and produce:</p>

    <ul class="spec-list">
      <li><b>Subtitles vs. SDH.</b> Subtitles = translated dialogue for hearing viewers. SDH/closed captions = full transcription plus sound descriptions and speaker IDs for deaf/HoH viewers. Platforms usually want SDH; foreign sales want translated subtitles. You may need both.</li>
      <li><b>Closed (file) vs. open (burned-in).</b> Closed captions are a separate sidecar file the viewer toggles; open captions are permanently in the picture. Most delivery wants closed/separate files so they can be turned on and off — don't burn them in unless asked.</li>
      <li><b>The file formats.</b> Common sidecar formats: SRT (simple, widespread), VTT (web), and the pro formats like TTML/IMSC and DFXP that platforms often require. DCPs use their own subtitle format (SMPTE or Interop XML). Deliver the exact format the spec names.</li>
      <li><b>Timing &amp; readability.</b> Good captions are correctly timed to the dialogue, stay on screen long enough to read, break lines sensibly, and don't cover important image. Bad timing is worse than none — it's distracting and looks unprofessional.</li>
      <li><b>Accuracy &amp; completeness.</b> Transcribe accurately, include all dialogue, and for SDH capture meaningful sounds. Errors and omissions are both an accessibility failure and, for platforms, a QC rejection.</li>
    </ul>

    <h2>Get them made right, and early</h2>

    <p>The practical path to good captions on a budget is straightforward once you know it. You can generate a first-pass transcript quickly — many tools (including AI-assisted ones and features built into editing software) will auto-transcribe your dialogue and produce timed captions — but <strong>never ship an auto-generated caption file without careful human review</strong>, because automatic transcription mangles names, technical terms, overlapping dialogue, and anything mumbled or accented, and those errors read as sloppiness and fail QC. Treat auto-captioning as a time-saving first draft, then proofread and correct it line by line against the actual dialogue, fix the timing, add SDH sound cues if required, and check readability. For translated subtitles into other languages, use an actual translator who understands subtitling (not just literal translation) if you can, because subtitling is a craft of condensing meaning to fit reading speed, and a clumsy translation undersells your film abroad. Two workflow tips. First, <em>make your captions from a locked cut</em> — if you caption before picture lock, every edit change throws off the timing and you redo the work, so wait until the film is locked. Second, <em>keep your caption files organized alongside your master and stems</em> (from Chapter 2), because different deliveries want different caption formats and languages, and having a clean, corrected master subtitle file means you can export it to SRT, VTT, TTML, or a DCP subtitle format as needed rather than starting over. Increasingly, delivery specs will list exactly which caption/subtitle deliverables they need — closed captions in a specific format, particular languages, SDH — so treat captions as a first-class deliverable on your checklist, not an afterthought you bolt on the night before. Done well, they satisfy the requirement, meet your responsibility to make your film accessible, and widen your audience. That completes the core craft of delivery — masters, formats, DCPs, and captions. Module 3 turns to the specific packages each destination demands, starting with the one most indie films chase first: festivals.</p>

    <div class="pullquote">Captions aren't an afterthought — they're a delivery requirement, an accessibility obligation, and a way to reach the huge audience that watches with sound off. Auto-transcribe to save time, but never ship it without human review.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A platform rejected my film's delivery over the captions — I'd auto-generated them and never checked, and they were riddled with wrong names and garbled technical lines. Embarrassing, and it cost me the delivery deadline while I fixed them. Now I treat captions as a real deliverable: auto-transcribe from the locked cut for speed, then proofread every line against the dialogue, fix timing, add sound cues for SDH, and keep a clean master subtitle file I can export to whatever format each platform wants. Captions are the last thing people think about and one of the first things QC checks. Give them real attention.</p>
    </div>
`,
    takeaways: [
      "Captions are now required by platforms, broadcasters, and many festivals — and they widen your audience, including sound-off viewers.",
      "Know the difference: subtitles translate dialogue; SDH/closed captions add sound descriptions for deaf/HoH viewers; closed = toggleable file, open = burned-in.",
      "Deliver the exact format asked for (SRT, VTT, TTML, or DCP subtitle XML) — usually as separate closed files, not burned in.",
      "Auto-transcribe from the locked cut to save time, but always proofread line by line, fix timing, and keep an organized master caption file.",
    ],
  },
  {
    slug: "film-festival-delivery",
    num: 9,
    roman: "IX",
    title: "Festival Delivery",
    desc: "What festivals actually want — screeners, DCPs, and the delivery deadline",
    time: "9 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Festival Delivery: What Film Festivals Actually Want | Filmmaker Genius",
    seoDesc: "Film festival delivery explained — screeners for selection, DCPs for screening, deadlines, and the deliverables festivals actually ask for, so your acceptance doesn't fall apart at the finish. A working filmmaker's guide. Chapter 9 of DCP & Delivery.",
    dek: `Festivals are where most indie films start their public life, and they have a two-stage delivery flow: a screener to get selected, then a screening copy (often a DCP) once you're in. Understand both stages and their strict deadlines, and an acceptance won't turn into a scramble.`,
    body: `
    <p>Festival delivery happens in two distinct stages, and confusing them is a common source of stress. Stage one is <strong>the screener</strong>: the file the festival's programmers watch to decide whether to accept your film. This is usually a compressed streaming link (Vimeo, a festival platform, or a submission site's player) or occasionally a downloadable file — it just needs to look and sound good enough to judge the film, not be broadcast-perfect. Stage two, which only happens if you're <em>selected</em>, is <strong>the screening copy</strong>: the actual file that plays for the audience at the festival, which for cinema-based festivals is very often a DCP, and for others might be a high-quality file (ProRes) or Blu-ray. The key insight is that these are different deliverables with different specs and timelines — the screener is for selection and is forgiving; the screening copy is for the audience and is strict — and each festival tells you exactly what it wants at each stage. Get organized around this two-stage flow and festival delivery becomes predictable instead of panicky.</p>

    <h2>The festival delivery flow</h2>

    <p>What each stage requires:</p>

    <ul class="spec-list">
      <li><b>Submission screener.</b> For getting selected — usually an online screener link (with a password) or a submission-platform upload. Make it good quality and reliable, with captions if the film needs them for judges. This is what most submissions are.</li>
      <li><b>Read the specs the moment you're accepted.</b> Acceptance triggers a delivery packet with exact requirements and a hard deadline. Read it immediately — it names the screening format (DCP? ProRes? Blu-ray?), specs, subtitles, and due date.</li>
      <li><b>The screening DCP (usually).</b> Most cinema festivals want a DCP — unencrypted, correct resolution/frame rate, tested (Module 2). Build and test it to their spec. This is where all the DCP knowledge pays off.</li>
      <li><b>Publicity materials.</b> Festivals also ask for stills, a poster, a trailer, director/cast info, and a synopsis for their program and press. These are part of "delivery" too — have them ready.</li>
      <li><b>Delivery method &amp; deadline.</b> They'll specify how (upload, or ship a physical drive) and by when. Festival deadlines are firm; missing the technical deadline can forfeit your slot. Deliver early enough for them to test.</li>
    </ul>

    <h2>Deadlines are the killer — plan backward</h2>

    <p>The thing that turns festival delivery from routine into disaster is almost always <strong>the deadline colliding with unfinished deliverables.</strong> The pattern is brutal and common: you submit a screener, wait months, get the joyful acceptance email — and discover you have two or three weeks to produce a tested DCP, subtitle files, and a publicity package for a film whose master you may not have finished, on a frame rate that might not match their spec, using tools you've never touched. That's why this whole course preaches planning ahead: if you've already made a clean master, know your frame rate is festival-standard, and understand how to make and test a DCP, then an acceptance means a calm few days of focused work instead of a crisis. So plan backward from the moment of acceptance: assume that if you get in, you'll need a screening-ready deliverable fast, and have as much of it prepared as possible <em>before</em> you even submit. Practical festival wisdom: submit screeners early in submission windows (fees are lower and slots less crowded), keep your screener links live and reliable throughout the long judging period, respond to acceptance and delivery emails immediately (festivals are juggling hundreds of films and appreciate responsive filmmakers), and always deliver your screening copy with buffer time so the venue can ingest and test it — never plan to deliver a DCP the day of the screening. And keep a simple record of what each festival needs and when it's due, because if your film gets into multiple festivals, you'll be juggling several delivery packages with different specs and deadlines at once, and it's easy to send the wrong thing to the wrong place. Handle festivals well and they launch your film; handle delivery poorly and a hard-won acceptance can slip away over a technical miss. With the festival path mapped, the next chapter covers the delivery world most films head to eventually — streaming and VOD.</p>

    <div class="pullquote">Festival delivery is two stages: a forgiving screener to get selected, then a strict screening copy — usually a tested DCP — once you're in. The deadline is the killer, so prepare your deliverables before you even submit.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>The gap between "we're accepted!" and "the DCP is due in 16 days" is where films fall apart. My first time, I hadn't made a master, didn't know DCPs, and my film was the wrong frame rate — pure panic. Now I flip it: before I submit a single screener, I make the clean master, confirm the frame rate is festival-standard, and know I can produce a tested DCP in a couple of days. So when the acceptance comes, it's a celebration and a calm checklist, not an emergency. Prepare your delivery before you submit, respond to festivals fast, and always deliver the screening copy early. Acceptances are hard to get — don't lose one to a deadline.</p>
    </div>
`,
    takeaways: [
      "Festival delivery is two stages: a forgiving online screener to get selected, then a strict screening copy (often a DCP) once accepted.",
      "Read the delivery packet the instant you're accepted — it names the screening format, specs, subtitles, publicity materials, and a hard deadline.",
      "Prepare your master, frame rate, and DCP knowledge before you submit — an acceptance gives you little time to produce a tested screening copy.",
      "Deliver the screening copy early so the venue can test it, respond to festivals promptly, and track multiple festivals' specs and deadlines.",
    ],
  },
  {
    slug: "streaming-delivery-specs",
    num: 10,
    roman: "X",
    title: "Streaming & VOD Delivery",
    desc: "Streaming and VOD specs — aggregators, platforms, and their requirements",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Streaming & VOD Delivery: Streaming Delivery Specs | Filmmaker Genius",
    seoDesc: "Streaming delivery specs explained — how aggregators and VOD platforms work, the masters and QC they require, and how to get your film onto streaming without rejection. A working filmmaker's guide. Chapter 10 of DCP & Delivery.",
    dek: `Most indie films end up on streaming, and getting there has its own rules — aggregators, strict masters, automated QC, and a pile of metadata and artwork. Understand how the streaming pipeline works and what it demands, and your film reaches the platforms without bouncing.`,
    body: `
    <p>Streaming — Video On Demand — is where most indie films live out their long life, and delivering to it is different from festivals in a crucial way: <strong>you usually can't upload directly to the big platforms; you go through an aggregator.</strong> Major services (the well-known SVOD and TVOD platforms) don't take films directly from individual filmmakers — they work with approved distributors and aggregators who package and deliver films to spec, handle the QC, and manage the relationship. So for most indies the path is: sign with an aggregator/distributor (or use a self-service aggregator that fees you to place your film), then deliver to <em>their</em> spec, and they get it onto the platforms. The exceptions are open platforms you can upload to yourself (like some AVOD/free services and, at the simplest end, YouTube/Vimeo on-demand). Either way, streaming delivery is highly standardized and heavily <em>automated</em>, which cuts both ways: the specs are clear and consistent, but they're checked by unforgiving automated QC that rejects files for tiny deviations a human would wave through. Understanding this pipeline is what keeps your streaming delivery from turning into a rejection loop.</p>

    <h2>What streaming delivery demands</h2>

    <p>The typical streaming/VOD package:</p>

    <ul class="spec-list">
      <li><b>A high-quality master to spec.</b> A "ProRes 422 HQ" (or similar) master at the exact resolution, frame rate, and color space the aggregator specifies. This is why your clean master from Chapter 2 matters — it's the source for this.</li>
      <li><b>Correct, strict audio.</b> Specific channel layout and — critically — a precise loudness target (LUFS), enforced by automated QC. Wrong loudness is one of the most common streaming rejections; run a loudness pass.</li>
      <li><b>Captions &amp; subtitles.</b> Closed captions (SDH) in the required format are typically mandatory, plus any language subtitles. Platforms enforce caption accuracy and format precisely (Chapter 8).</li>
      <li><b>Metadata.</b> A pile of textual data — title, synopsis, cast/crew, genre, runtime, rating, release year, keywords — delivered in the platform's exact structure. Incomplete or malformed metadata blocks a release.</li>
      <li><b>Artwork.</b> Key art / poster and thumbnails at exact pixel dimensions, often with strict rules (no text on some, specific safe areas). The thumbnail is what sells the click, so it matters commercially too.</li>
      <li><b>Trailer &amp; extras.</b> Often a trailer file to spec, and sometimes additional assets. All to precise technical requirements.</li>
    </ul>

    <h2>Automated QC and the aggregator relationship</h2>

    <p>Two realities shape streaming delivery, and knowing them saves you grief. First, <strong>automated QC is strict and literal.</strong> When you deliver, machines check your file against the spec — resolution, frame rate, loudness, black levels, caption timing, even things like whether there's a stray frame of black or a caption that's on screen a fraction too long — and they reject for deviations no human viewer would ever notice. This is frustrating but it means the game is precision: hit the spec exactly, run your own loudness and format checks first (MediaInfo, a loudness meter, from earlier chapters), and don't argue with the robot — fix the flagged issue and resubmit. The filmmakers who breeze through are the ones who treat the spec as gospel and self-QC before delivering. Second, <strong>the aggregator is your gateway and your ally.</strong> Because you generally can't reach the platforms directly, the aggregator you choose matters — they package and deliver your film, take a cut or a fee, and their competence affects how smoothly (and how widely) your film gets placed. Choose one whose terms are transparent, understand exactly what they take and what they deliver, and lean on them for the current platform specs (which change and are detailed). A practical note on this whole chapter: the <em>exact</em> specs and even the players change constantly, so this isn't a list to memorize — it's a map so you know the shape of what's coming (master, audio to loudness, captions, metadata, artwork, via an aggregator, through automated QC) and can confidently read and hit whatever spec sheet your distributor hands you. The through-line remains what it's been all course: a clean master plus organized deliverables plus precise adherence to the destination's spec equals a film that gets accepted. Streaming is just that pattern applied to the biggest, most standardized, most automated destination of all. One delivery world remains — the heavy, formal package that broadcasters and sales agents require — which we cover next before the final checklist.</p>

    <div class="pullquote">You usually can't upload to the big platforms directly — you go through an aggregator, and everything is checked by strict automated QC. Don't argue with the robot: hit the spec exactly, self-QC first, and fix-and-resubmit.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>My first streaming delivery through an aggregator bounced three times from automated QC — once for loudness a hair off spec, once for a caption timing issue, once for a single stray black frame. No human would've cared, but the machine did, and each rejection cost days. Once I learned to self-QC — checking loudness with a meter, verifying captions, scrubbing the head and tail for stray frames, matching every spec line exactly — deliveries started passing first time. Streaming QC isn't cruel, it's literal. Give it exactly what it asks for, check your own work before submitting, and it goes smoothly. Fighting it just wastes days.</p>
    </div>
`,
    takeaways: [
      "You usually reach the big streaming platforms through an aggregator/distributor, not directly — choose one with transparent terms.",
      "Streaming needs a to-spec master, loudness-correct audio, captions, complete metadata, and exact-size artwork.",
      "Automated QC is strict and literal — it rejects for tiny deviations, so self-QC (loudness, format, stray frames, captions) before delivering.",
      "Specs change constantly — learn the shape of the package and lean on your aggregator for the current exact requirements.",
    ],
  },
  {
    slug: "broadcast-delivery-requirements",
    num: 11,
    roman: "XI",
    title: "Broadcast & Sales Deliverables",
    desc: "Broadcast and sales deliverables — the full package a distributor demands",
    time: "8 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "Broadcast & Sales Deliverables: The Delivery Package | Filmmaker Genius",
    seoDesc: "Broadcast delivery requirements and the sales deliverables package — textless masters, split audio stems, M&E tracks, and the paperwork a distributor or broadcaster demands. A working filmmaker's guide. Chapter 11 of DCP & Delivery.",
    dek: `When a distributor, sales agent, or broadcaster takes your film, they send a "delivery schedule" — a long, formal list of technical files and paperwork that can run to dozens of items. It's the most demanding delivery of all, and knowing what's on it means you can prepare the expensive parts before you're asked.`,
    body: `
    <p>If festival and streaming delivery are demanding, formal <strong>sales and broadcast delivery is the boss level.</strong> When a sales agent, distributor, or broadcaster licenses your film, they issue a <em>delivery schedule</em> (or "delivery requirements") — a formal contract document listing every element you must provide, and it can be genuinely long: dozens of technical files, audio configurations, textless materials, plus a stack of legal and promotional paperwork. This exists because these buyers need to be able to re-version your film for many territories and platforms — dub it into other languages, add local subtitles, re-edit for ad breaks, remaster to their standard — and to do that they need not just your finished film but its <em>component parts</em>. The intimidating length of a delivery schedule is really just the sum of "give us everything anyone downstream could possibly need." The single most valuable thing you can do is know what tends to be on these lists <em>before</em> you're handed one, because several of the items are expensive or impossible to create after the fact — and if you made them during finishing (as earlier chapters urged), delivery is assembling files rather than a costly scramble.</p>

    <h2>What's on a delivery schedule</h2>

    <p>Typical broadcast/sales deliverables include:</p>

    <ul class="spec-list">
      <li><b>The broadcast master.</b> A high-quality master (often ProRes or a broadcast format) to their exact spec — resolution, frame rate, color, and strict loudness (the loudness standards are non-negotiable for broadcast).</li>
      <li><b>A textless / "clean" version.</b> Your film without any burned-in titles, subtitles, or on-screen text — so they can add their own localized text. Plus "texted" backgrounds for any titles, so they can recreate them. Make this during finishing; recreating it later is painful.</li>
      <li><b>Split audio stems &amp; an M&amp;E track.</b> Separate dialogue, music, and effects stems, and crucially a <em>Music &amp; Effects (M&amp;E) track</em> — the full mix minus dialogue — so they can dub the film into other languages. No M&amp;E, no foreign-language versions; this is a classic expensive-to-recreate item.</li>
      <li><b>Caption/subtitle files &amp; scripts.</b> Closed captions, subtitle files, and often a "dialogue list" or "as-broadcast script" (a precise transcript with timecodes) used for translation and compliance.</li>
      <li><b>Promotional package.</b> Trailer(s) to spec, key art, stills, EPK (electronic press kit), synopsis, and cast/crew info — the marketing materials, delivered to their formats.</li>
      <li><b>Legal &amp; chain-of-title paperwork.</b> Chain of title, E&amp;O insurance, music cue sheets and licenses, talent releases, and rights documentation — proof you actually own/cleared everything. Missing paperwork stalls delivery as surely as a missing file.</li>
    </ul>

    <h2>Prepare the expensive parts in advance</h2>

    <p>The strategic lesson of this chapter — and honestly of the whole course — is that <strong>the items on a delivery schedule are far cheaper and easier to make during finishing than to recreate after the film is "done."</strong> Three in particular are the ones that blindside filmmakers. The <em>M&amp;E track and split stems</em>: if your re-recording mixer creates these while mixing, it's a small addition; if you ask for them a year later after the session files are archived or lost, it can mean an expensive partial remix — so always have your mix delivered with stems and an M&amp;E track (the Sound Design course covers this). The <em>textless master and texted-background elements</em>: trivial to output during your online/finishing when the title layers are live; a real headache to reconstruct once flattened. And the <em>legal/chain-of-title paperwork</em>: the music cue sheets, licenses, releases, and clearances that prove you own your film — gather and organize these as you go, because a distributor won't (can't) release a film whose rights aren't documented, and chasing a musician for a license two years later is grim. So the takeaway is proactive: knowing a delivery schedule is coming, build its expensive components into your finishing process — stems, M&amp;E, textless, clean paperwork — and keep them organized with your master (Chapter 2). Then, if you land a sale, the scary delivery schedule becomes a matter of collecting files you already have and filling in forms, not a second production. And don't be afraid of the schedule's length or jargon: much of it you'll already have (master, captions, trailer, stills), the buyer's delivery contact will clarify their exact specs, and you can hire help for genuinely specialized items. A sale is a huge win; delivery is how you actually get paid and get seen, so treat the delivery schedule as the final, formal version of the same discipline you've practiced all along — make a clean master, keep organized components, and hit the spec. We've now covered every delivery destination. The final chapter ties it all together into a single master checklist and the archive that protects your film for good.</p>

    <div class="pullquote">A delivery schedule's scary length is just "give us everything anyone downstream could need." Make the expensive parts — M&amp;E track, stems, textless master, chain-of-title paperwork — during finishing, and a sale becomes collecting files, not a second production.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>A sales agent took a film I'd worked on, and their delivery schedule was 40-plus items long — I'd never seen anything like it. The gut-punches were the ones we didn't have: no M&amp;E track (so no foreign dubbing without an expensive remix), no textless master, and patchy music paperwork we had to chase for months. The film that delivered next to us, whose team had made stems, M&amp;E, and textless during finishing and kept every cue sheet organized, just handed over a drive and got paid. That contrast rewired how I finish films: I now make the "delivery components" up front, every time. The schedule stops being scary when you already have what's on it.</p>
    </div>
`,
    takeaways: [
      "Sales/broadcast delivery is the most demanding — a formal delivery schedule lists dozens of technical files plus legal and promo materials.",
      "The buyer needs your film's component parts to re-version it: broadcast master, textless version, split stems, and an M&E track for dubbing.",
      "Make the expensive items (M&E, stems, textless) during finishing — recreating them after the film is flattened is costly or impossible.",
      "Keep chain-of-title paperwork — cue sheets, licenses, releases, E&O — organized as you go; missing rights docs stall delivery like a missing file.",
    ],
  },
  {
    slug: "film-delivery-checklist",
    num: 12,
    roman: "XII",
    title: "The Delivery Checklist & Archive",
    desc: "Your master delivery checklist, and how to archive everything safely",
    time: "9 min",
    moduleKey: "apply",
    kicker: "Putting It to Work",
    seoTitle: "The Delivery Checklist & Archive: Film Delivery Checklist | Filmmaker Genius",
    seoDesc: "A film delivery checklist and archive plan — the master list of deliverables to verify before you send, and how to archive your film's masters and components so it's deliverable forever. A working filmmaker's guide. Chapter 12 of DCP & Delivery.",
    dek: `Everything in this course comes down to two habits: verify against a checklist before every delivery, and archive your masters and components so your film stays deliverable for years. Get these right and your film is protected, professional, and ready for any opportunity that comes.`,
    body: `
    <p>Across this course you've learned what delivery is, how to make masters and DCPs, how to handle captions, and what festivals, streamers, and broadcasters demand. This final chapter distills all of it into the two disciplines that actually keep your film safe and deliverable: <strong>a pre-delivery checklist you run every single time, and a proper archive of your masters and components.</strong> Both come from the same truth that's run through every chapter — delivery is unforgiving of small mistakes and gaps, so the professionals don't rely on memory; they rely on checklists and organized archives. A checklist catches the wrong frame rate, the missing caption file, the un-tested DCP, the loudness that's off — the tiny, invisible errors that cause rejections — before they reach the destination. And an archive means that when an opportunity arrives months or years later, your film is instantly deliverable instead of lost to a broken hard drive or a missing session file. Let me give you both.</p>

    <h2>The pre-delivery checklist</h2>

    <p>Before any deliverable leaves your hands, verify:</p>

    <ul class="spec-list">
      <li><b>Right file for the right destination.</b> Confirm you're sending the deliverable this destination actually asked for (DCP vs. screener vs. streaming master), not last week's file for a different place.</li>
      <li><b>Format &amp; specs match exactly.</b> Codec, container, resolution, frame rate, aspect ratio, color space — run MediaInfo and check each against the spec sheet. No approximations.</li>
      <li><b>Audio config &amp; loudness verified.</b> Correct channel layout, and loudness measured against their target (LUFS). Run a loudness meter — don't trust your ears.</li>
      <li><b>Captions/subtitles present, correct, proofread.</b> Right format, right languages, accurate and well-timed. Human-checked, not raw auto-transcribe.</li>
      <li><b>DCP tested (if applicable).</b> Validated and play-tested, unencrypted unless required, named correctly, delivered early enough for the venue to test.</li>
      <li><b>Metadata, artwork &amp; paperwork included.</b> All the non-picture deliverables — metadata, key art, stills, cue sheets, releases — present and to spec.</li>
      <li><b>Watched start to finish.</b> Actually watch the final deliverable through once for glitches, black frames, sync, and quality. The last human check catches what tools miss.</li>
    </ul>

    <h2>Archive it — and a final word</h2>

    <p>The second discipline is the <strong>archive</strong>, and it's what protects your film for the long haul. When delivery is done, don't let your masters and components scatter across random drives — gather them into a deliberate archive: your pristine master, mezzanine, audio stems, M&amp;E track, textless version, caption/subtitle files, DCP, artwork, trailer, and all the paperwork (cue sheets, licenses, releases, chain of title). Back this archive up in <em>multiple</em> places — at minimum two physical drives in different locations plus, ideally, cloud/LTO — because a single drive <em>will</em> eventually fail, and a film that exists only on one dying disk is a film you can lose forever. Organize it clearly with a simple index so that future-you (or a distributor) can find any component fast, and keep it even after the film's "moment" passes, because opportunities — a foreign sale, a retrospective, a new platform, a re-release — arrive on their own timeline, and the filmmaker who can instantly produce a clean master and the required components years later gets the deal that the filmmaker with a lost drive cannot. This is the true endpoint of delivery: not just handing off one file, but keeping your film alive and deliverable indefinitely. Step back and see what you've built across this course. You now understand that delivery is the real finish line; you can make and protect a master; you can read any spec sheet's codecs, containers, and technical parameters; you can make, test, and deliver a DCP without a lab; you can handle captions and accessibility; and you know exactly what festivals, streamers, and broadcasters demand — and how to prepare the expensive parts in advance. Above all, you've internalized the one habit that makes delivery reliable: <strong>make a clean master, keep organized components, verify against a checklist, and archive everything.</strong> That's the whole discipline, and it's what turns "I finished my film" into "the world can actually see my film." You did the hard creative work; now you can hand it over like a professional and keep it safe forever. Congratulations on finishing the course — go get your film delivered.</p>

    <div class="pullquote">Delivery's real endpoint isn't handing off one file — it's keeping your film alive and deliverable forever. Verify against a checklist every time, and archive your master and components in multiple places, because a single drive will eventually fail.</div>

    <div class="callout">
      <div class="callout-label">◆ From the set</div>
      <p>Two habits saved me more than any technical trick. The checklist: I run the same pre-delivery list on every file — right file, specs, loudness, captions, DCP tested, watched through — and it's caught wrong frame rates and missing captions that would've been rejections. The archive: after a film I once needed for a surprise sale existed only on one dead drive, I now keep every master and component on multiple backups with a clear index. A year later, a distributor asked for deliverables and I produced them in a day from my archive, clean and complete. Delivery isn't a moment — it's a discipline you keep. Checklist every time, archive forever.</p>
    </div>
`,
    takeaways: [
      "Run a pre-delivery checklist every time — right file, exact specs, loudness, captions, DCP tested, paperwork, and watched through.",
      "Don't rely on memory — professionals rely on checklists to catch the invisible errors (frame rate, loudness, missing files) that cause rejections.",
      "Archive your master and all components (stems, M&E, textless, captions, DCP, artwork, paperwork) in multiple backed-up locations with a clear index.",
      "The discipline that makes delivery reliable: clean master, organized components, checklist every time, archive forever — so your film is deliverable for years.",
    ],
  },
];


export const dcpDelivery: Course = {
  slug: "how-to-make-a-dcp",
  title: "DCP & Delivery Formats",
  categoryLabel: "Post-Production",
  subtitle: "You finished the film — now you have to hand it over in exactly the right format, or it gets rejected at the door. This course demystifies delivery: masters, codecs, DCPs, subtitles, and the specific deliverables festivals, streamers, and broadcasters demand. The unglamorous last step that decides whether anyone sees your film.",
  level: "Beginner",
  chapterCount: "12 Chapters",
  readTime: "~100 min read",
  pairsWithName: "Distribution Readiness",
  pairsWithUrl: "https://filmmakergenius.com/distribution-readiness",
  pairsWithDesc: "Run your finished film through Distribution Readiness — check your masters, deliverables, and specs against what festivals and platforms require, so you catch problems before a rejection letter does.",
  seoTitle: "DCP & Delivery Formats — Filmmaker Genius Academy",
  seoDesc: "How to make a DCP and deliver your finished film — a working filmmaker's 12-chapter course on masters, codecs, DCPs, subtitles, and festival, streaming, and broadcast deliverables. Get your film accepted, not rejected.",
  learn: [
    "Understand masters, codecs, and containers so you export the right file every time",
    "Make and test a DCP for cinema and festival screenings on a budget",
    "Add subtitles, captions, and accessibility tracks that meet delivery specs",
    "Hit festival, streaming, and broadcast deliverable requirements without rejection",
  ],
  mosaic: [
    "INT. FILM SET<br>- DAY<br><br>Crew settles.",
    "ROLL SOUND",
    "SCENE 42",
    "CUT TO:<br><br>EXT. BACKLOT<br>- NIGHT",
    "Take 1 of 3",
    "ACTION.",
  ],
  modules: [
    { key: "foundations", label: "Module 1 — Foundations" },
    { key: "core", label: "Module 2 — Core Craft" },
    { key: "apply", label: "Module 3 — Putting It to Work" },
  ],
  chapters,
};
