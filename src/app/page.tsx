import Link from "next/link";
import FloatingExamTimers from "@/components/FloatingExamTimers";
import GlowLogo from "@/components/GlowLogo";

const COURSES = [
  {
    badge: "🚀 UPSC 2027 Complete Program",
    title: "UPSC CSE 2027 · Prelims + Mains + Interview",
    subtitle: "A complete two-stage preparation system with personality-test guidance built in from day one.",
    price: "₹56,000",
    href: "/ncert",
    color: "#5b21b6",
    features: ["Prelims GS + CSAT strategy", "Mains GS answer-writing program", "Essay + Ethics practice", "Current Affairs integration", "Test series & evaluation", "Interview / Personality Test guidance"],
  },
  {
    badge: "🌱 UPSC 2028 Foundation",
    title: "UPSC CSE 2028 · Prelims + Mains + Interview",
    subtitle: "Long-term foundation for aspirants who want time to build concepts, writing skill and revision depth.",
    price: "₹56,000",
    href: "/ncert",
    color: "#7c3aed",
    features: ["NCERT-to-advanced GS roadmap", "Prelims + CSAT preparation", "Mains answer-writing from foundation stage", "Essay + Ethics mentorship", "Current Affairs system", "Interview / Personality Test guidance"],
  },
  {
    badge: "🔥 Flagship BPSC Batch",
    title: "72nd BPSC · Prelims + Mains + Interview",
    subtitle: "End-to-end BPSC preparation with Bihar Special, current affairs, writing practice and interview support.",
    price: "₹29,000",
    href: "/ghatnachakra",
    color: "#b91c1c",
    features: ["Complete Prelims GS coverage", "Bihar Special intensive preparation", "Mains answer-writing & evaluation", "Current Affairs + PYQ strategy", "Full-length mock tests", "Interview guidance & mock support"],
  },
  {
    badge: "🎯 Next BPSC Cycle",
    title: "73rd BPSC · Prelims + Mains + Interview",
    subtitle: "A longer runway for 73rd BPSC aspirants with structured foundation, testing and personalised revision.",
    price: "₹29,000",
    href: "/bihar-gs",
    color: "#c06010",
    features: ["Foundation-to-advanced GS", "Bihar-focused static + current coverage", "Prelims MCQ test series", "Mains answer-writing program", "Mentored revision cycles", "Interview guidance & mock support"],
  },
];

const FACULTIES = [
  { name: "Ruhani Chauhan", emoji: "🏛️📜", subject: "History Faculty · BPSC / UPSC", credential: "Demo profile: 2× BPSC Prelims qualified · 1× UPSC Prelims qualified", focus: "Ancient 🪷 · Medieval ⚔️ · Modern India 🇮🇳" },
  { name: "Ira Jain", emoji: "⚖️📘", subject: "Polity & Governance Faculty · BPSC / UPSC", credential: "Demo profile: UPSC Prelims qualified · BPSC Mains appeared", focus: "Constitution 🏛️ · Governance 🧭 · Current Issues 📰" },
  { name: "Gargi Gupta", emoji: "🌍🌱", subject: "Geography & Environment Faculty · BPSC / UPSC", credential: "Demo profile: UPSC Prelims qualified · State PCS Prelims qualified", focus: "India 🇮🇳 · Bihar 🌾 · World 🌐 · Environment 🌿" },
];

const TESTIMONIALS = [
  ["The daily targets finally gave my preparation structure. I stopped collecting resources and started finishing them.", "Sample feedback · BPSC aspirant, Patna"],
  ["The Bihar-specific revision was concise and much easier to revise before mocks.", "Sample feedback · 72nd BPSC aspirant"],
  ["I liked the mix of lectures, PYQs, mains writing and tests. It feels like a complete plan, not just a video library.", "Sample feedback · Working professional"],
  ["The faculty explanations are simple and exam-focused. My revision became much faster.", "Sample feedback · UPSC/BPSC learner"],
  ["The mock routine helped me identify weak areas early instead of discovering them close to the exam.", "Sample feedback · State PCS aspirant"],
  ["Starting mains writing early made the preparation feel much more integrated.", "Sample feedback · UPSC aspirant"],
];

const CONTENT = [
  ["/ca/lectures", "📰", "Current Affairs", "Month-wise lectures & PDF notes"],
  ["/ghatnachakra", "📕", "GS Ghatnachakra", "Subject-wise lectures & PDF notes"],
  ["/bihar-gs", "🗺️", "Bihar GS", "Bihar geography, economy & polity"],
  ["/ncert", "📗", "NCERT", "Foundation reading & lectures"],
  ["/lucent-gk", "📘", "Lucent GK", "Fast factual revision"],
  ["/quizzes", "🎯", "Quiz", "Timed MCQs with instant feedback"],
  ["/pyq", "📋", "Bihar PYQ", "Previous-year questions"],
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <FloatingExamTimers />

      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((i) => (
            <div key={i} className="ticker-set">
              {["UPSC 2027 · COMPLETE PROGRAM", "UPSC 2028 · FOUNDATION", "72nd BPSC · COMPLETE PROGRAM", "73rd BPSC · COMPLETE PROGRAM"].map((x) => <span key={x}>🔥 {x}</span>)}
            </div>
          ))}
        </div>
      </div>

      <section className="hero">
        <GlowLogo width={300} height={112} />
        <div className="pill">🎯 PRELIMS + MAINS + INTERVIEW · ONE PROGRAM</div>
        <h1>One preparation ecosystem from your first class to the final interview.</h1>
        <p>Complete UPSC & BPSC programs built around concept clarity, daily discipline, testing, mains writing, revision and interview readiness.</p>
        <div className="actions">
          <a href="#courses" className="primary">🔥 Explore Complete Courses</a>
          <Link href="/partner" className="secondary">🤝 Find Study Partner</Link>
        </div>
        <div className="trust"><span>✅ Prelims</span><span>✍️ Mains</span><span>🎙️ Interview</span><span>🧪 Tests</span><span>📚 Notes</span><span>🧠 Mentorship</span></div>
      </section>

      <section className="proof">
        <div><strong>4</strong><span>Complete programs</span></div>
        <div><strong>3 Stages</strong><span>Prelims · Mains · Interview</span></div>
        <div><strong>₹56K</strong><span>UPSC complete program</span></div>
        <div><strong>₹29K</strong><span>BPSC complete program</span></div>
      </section>

      <section id="courses" className="section">
        <div className="head"><div><span className="eyebrow">🔥 Admissions Open</span><h2>Choose your complete preparation program</h2></div><p>No fragmented stage-wise pricing. Each program covers the full journey from Prelims through Mains to Interview guidance.</p></div>
        <div className="course-grid">
          {COURSES.map((course) => (
            <article key={course.title} className="course" style={{"--accent":course.color} as React.CSSProperties}>
              <span className="badge">{course.badge}</span>
              <h3>{course.title}</h3>
              <p>{course.subtitle}</p>
              <div className="price"><strong>{course.price}</strong><span>complete program</span></div>
              <div className="stage-strip"><b>PRELIMS</b><b>MAINS</b><b>INTERVIEW</b></div>
              <ul>{course.features.map(f => <li key={f}>✅ {f}</li>)}</ul>
              <Link href={course.href} className="buy">Enroll / Explore →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="head"><div><span className="eyebrow">👩‍🏫 Mentorship-led learning</span><h2>Faculty who teach for the exam, not just the syllabus</h2></div><p>Demo profiles below should be replaced with verified biographies before a public commercial launch.</p></div>
        <div className="faculty-grid">
          {FACULTIES.map(f => <article className="faculty" key={f.name}><div className="photo">{f.emoji}</div><h3>{f.name}</h3><b>{f.subject}</b><p>🏅 {f.credential}</p><small>📚 {f.focus}</small></article>)}
        </div>
      </section>

      <section className="section guest">
        <div className="guest-icon">🎙️👮‍♂️</div>
        <div><span className="eyebrow dark-pill">SPECIAL GUEST LECTURE · DEMO LISTING</span><h2>Prof. Kumar Sir · Retd. IPS</h2><p>Administration, Ethics & Decision-Making — practical insights for BPSC/UPSC Mains and Interview preparation.</p><div className="guest-tags"><span>⚖️ Ethics</span><span>🧭 Administration</span><span>🎙️ Interview</span><span>📝 Mains perspective</span></div></div>
        <a href="#courses" className="guest-button">View Programs →</a>
      </section>

      <section className="section">
        <div className="head"><div><span className="eyebrow">💬 Student Experience</span><h2>Built to reduce confusion and increase execution</h2></div><p>These are sample testimonials for layout purposes and should be replaced by verified student reviews before publication as endorsements.</p></div>
        <div className="testimonials">{TESTIMONIALS.map(([q,m],i) => <article key={i}><div>★★★★★</div><p>“{q}”</p><small>{m}</small></article>)}</div>
      </section>

      <section className="section">
        <div className="head"><div><span className="eyebrow">📚 Learning Ecosystem</span><h2>Your supporting study library</h2></div><p>Static GS, Bihar Special, current affairs, PYQs and quizzes stay accessible as part of the wider preparation ecosystem.</p></div>
        <div className="content-grid">{CONTENT.map(([href,emoji,title,desc]) => <Link href={href} className="content" key={href}><span>{emoji}</span><div><h3>{title}</h3><p>{desc}</p></div><b>›</b></Link>)}</div>
      </section>

      <section className="final">
        <span>🚀 PRELIMS IS ONLY THE FIRST GATE</span>
        <h2>Prepare for selection, not just the next exam date.</h2>
        <p>Choose the cycle that matches your timeline and prepare Prelims, Mains and Interview as one connected journey.</p>
        <div className="actions"><a href="#courses" className="primary light">See All 4 Programs</a><Link href="/partner" className="secondary dark">Find Study Partner</Link></div>
      </section>

      <style>{`
        .home-shell{min-height:100vh;padding:34px 0 70px;background:linear-gradient(rgba(250,246,240,.9),rgba(250,246,240,.98)),url('/bg1.png') center/cover fixed;position:relative}.ticker{position:fixed;top:52px;left:0;right:0;height:32px;z-index:99;background:#1c0d06;overflow:hidden;display:flex;align-items:center}.ticker-track{display:flex;width:200%;animation:ticker 22s linear infinite}.ticker-set{width:50%;display:flex;justify-content:space-around;gap:30px}.ticker span{white-space:nowrap;color:#f9d99d;font-size:10px;font-weight:900;letter-spacing:.11em}@keyframes ticker{to{transform:translateX(-50%)}}
        .hero{max-width:980px;margin:auto;padding:70px 18px 28px;text-align:center}.pill,.eyebrow{display:inline-block;padding:7px 11px;border-radius:999px;background:#fff9f1;border:1px solid #ead8c5;color:#8b3e16;font-size:10px;font-weight:900;letter-spacing:.08em}.hero h1{max-width:900px;margin:15px auto 12px;font-family:var(--font-display);font-size:clamp(34px,6vw,66px);line-height:.98;letter-spacing:-.055em;color:var(--ink-strong)}.hero>p{max-width:730px;margin:auto;color:var(--ink-soft);font-size:15px;line-height:1.7}.actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:20px}.primary,.secondary,.buy,.guest-button{text-decoration:none;font-weight:900;border-radius:14px;transition:.15s}.primary{padding:14px 19px;color:white;background:linear-gradient(135deg,#a91515,#c06010);box-shadow:0 10px 28px rgba(170,30,20,.2)}.secondary{padding:13px 18px;color:var(--ink-strong);background:#fff;border:1px solid #ead8c5}.primary:hover,.secondary:hover,.buy:hover,.guest-button:hover{transform:translateY(-2px)}.trust{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-top:18px}.trust span{background:rgba(255,255,255,.82);border:1px solid #eadfd4;border-radius:999px;padding:7px 9px;font-size:10px;font-weight:800}
        .proof{max-width:950px;margin:12px auto 0;padding:17px;display:grid;grid-template-columns:repeat(4,1fr);background:#241207;color:white;border-radius:22px;box-shadow:0 18px 45px rgba(45,20,8,.16)}.proof div{text-align:center;border-right:1px solid rgba(255,255,255,.11)}.proof div:last-child{border:0}.proof strong{display:block;color:#f4c267;font-size:23px}.proof span{font-size:10px;color:#eadfd5}.section{max-width:1000px;margin:44px auto 0;padding:0 14px}.head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:15px}.head h2{font-family:var(--font-display);font-size:clamp(26px,4vw,40px);line-height:1;letter-spacing:-.04em;color:var(--ink-strong);margin-top:9px}.head>p{max-width:420px;color:var(--ink-soft);font-size:12px;line-height:1.6}
        .course-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.course{position:relative;background:rgba(255,255,255,.93);padding:22px;border-radius:23px;border:1px solid color-mix(in srgb,var(--accent) 22%,#e9ddcf);box-shadow:0 10px 35px rgba(90,55,25,.1);overflow:hidden}.course:before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--accent)}.badge{font-size:10px;font-weight:900;color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,white);border-radius:999px;padding:6px 9px}.course h3{font-family:var(--font-display);font-size:25px;line-height:1.04;color:var(--ink-strong);margin:14px 0 8px}.course>p{font-size:12px;line-height:1.6;color:var(--ink-soft);min-height:58px}.price{margin:15px 0}.price strong{display:block;font-size:32px;color:var(--ink-strong)}.price span{font-size:10px;font-weight:800;color:#15803d}.stage-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:11px 0}.stage-strip b{text-align:center;padding:7px 4px;border-radius:9px;background:color-mix(in srgb,var(--accent) 8%,white);color:var(--accent);font-size:9px}.course ul{list-style:none;padding:0;display:grid;gap:7px;color:var(--ink-soft);font-size:11px;margin:14px 0 18px}.buy{display:block;text-align:center;padding:13px;color:white;background:var(--accent)}
        .faculty-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.faculty{background:#fff;padding:17px;border-radius:20px;border:1px solid #eadfd5;box-shadow:0 8px 28px rgba(85,50,25,.08)}.photo{height:125px;border-radius:16px;background:linear-gradient(145deg,#fff2e3,#eee7ff);display:grid;place-items:center;font-size:48px;margin-bottom:13px}.faculty h3{font-family:var(--font-display);font-size:21px;color:var(--ink-strong)}.faculty>b{font-size:11px;color:#8b3e16}.faculty p,.faculty small{display:block;color:var(--ink-soft);font-size:10.5px;line-height:1.5;margin-top:8px}
        .guest{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;padding:24px;border-radius:24px;background:linear-gradient(135deg,#211006,#4b210b);color:white}.guest-icon{width:78px;height:78px;border-radius:20px;background:rgba(255,255,255,.09);display:grid;place-items:center;font-size:28px}.dark-pill{background:rgba(255,255,255,.08);color:#f9d99d;border-color:rgba(255,255,255,.12)}.guest h2{font-family:var(--font-display);font-size:30px;margin:8px 0 5px}.guest p{font-size:12px;color:#eadfd5}.guest-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.guest-tags span{font-size:9px;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.08)}.guest-button{padding:12px 14px;background:#fff;color:#7c2d12;white-space:nowrap}.testimonials{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.testimonials article{background:#fff;padding:15px;border-radius:17px;border:1px solid #eadfd5}.testimonials article>div{color:#d97706;font-size:11px}.testimonials p{font-size:11.5px;line-height:1.55;margin:8px 0;color:var(--ink-strong)}.testimonials small{color:var(--muted);font-size:9.5px}.content-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.content{display:flex;align-items:center;gap:11px;text-decoration:none;background:#fff;padding:13px;border-radius:16px;border:1px solid #eadfd5}.content>span{font-size:24px}.content h3{color:var(--ink-strong);font-size:14px}.content p{color:var(--ink-soft);font-size:10.5px;margin-top:2px}.content>b{margin-left:auto;color:var(--muted);font-size:20px}.final{max-width:1000px;margin:46px auto 0;padding:35px 18px;text-align:center;border-radius:28px;background:linear-gradient(135deg,#8e1717,#c06010);color:white}.final>span{font-size:10px;font-weight:900;letter-spacing:.14em;color:#ffe0aa}.final h2{font-family:var(--font-display);font-size:clamp(30px,5vw,50px);line-height:1;max-width:800px;margin:9px auto;letter-spacing:-.045em}.final p{max-width:650px;margin:auto;color:#fff0df;font-size:12px}.light{background:white;color:#8e1717;box-shadow:none}.dark{background:rgba(40,10,5,.35);color:white;border-color:rgba(255,255,255,.18)}
        @media(max-width:760px){.proof{margin-left:14px;margin-right:14px;grid-template-columns:repeat(2,1fr)}.course-grid,.faculty-grid,.testimonials{grid-template-columns:1fr}.head{flex-direction:column;align-items:flex-start;gap:7px}.guest{grid-template-columns:1fr}.guest-button{justify-self:start}}@media(max-width:540px){.hero{padding-top:60px}.hero h1{font-size:37px}.content-grid{grid-template-columns:1fr}.proof div{border-right:0}.ticker-set{gap:40px}}
      `}</style>
    </main>
  );
}
