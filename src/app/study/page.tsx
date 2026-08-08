import Link from "next/link";

const CONTENT = [
  { href: "/ca/lectures", code: "CA", title: "Current Affairs", desc: "Month-wise lectures, issue briefs and revision notes for UPSC & BPSC.", meta: "Lectures · Notes · Revision" },
  { href: "/ghatnachakra", code: "GS", title: "GS Ghatnachakra", desc: "Subject-wise GS lectures and compact PDF notes for focused revision.", meta: "Static GS · Topic-wise" },
  { href: "/bihar-gs", code: "BI", title: "Bihar General Studies", desc: "Bihar history, geography, economy, polity and state-specific current issues.", meta: "BPSC-focused · Bihar Special" },
  { href: "/ncert", code: "NC", title: "NCERT Foundation", desc: "A structured starting point for History, Geography, Polity, Economy and Science.", meta: "Foundation · Subject-wise" },
  { href: "/lucent-gk", code: "GK", title: "Lucent General Knowledge", desc: "High-frequency factual revision organised subject by subject.", meta: "Rapid revision · Static GK" },
  { href: "/pyq", code: "PY", title: "Previous Year Questions", desc: "Use BPSC PYQs to understand recurring themes, depth and elimination patterns.", meta: "Exam analysis · Practice" },
];

const METHOD = [
  ["01", "Build the base", "Start with NCERT and the core static subjects. Keep the syllabus beside you."],
  ["02", "Connect current affairs", "Link daily and monthly issues to the static topics already studied."],
  ["03", "Practice every week", "Use PYQs and Free Quiz sets to test recall, elimination and weak areas."],
  ["04", "Move to exam mode", "When you need a complete schedule, evaluation and mentoring, enter the full program."],
];

export default function StudyPage() {
  return (
    <main className="study-page">
      <section className="study-hero">
        <div className="study-shell">
          <span className="overline">ONESHOT GS · OPEN LEARNING LIBRARY</span>
          <div className="hero-grid">
            <div>
              <h1>Free Study</h1>
              <p className="lead">A serious, no-paywall study library for UPSC and BPSC aspirants. Start with the syllabus, learn from curated resources, revise systematically and test yourself as you go.</p>
              <div className="hero-actions"><a href="#library" className="primary">Browse Free Library</a><Link href="/quizzes" className="secondary">Take a Free Quiz →</Link></div>
            </div>
            <aside className="free-note"><span>FREE ACCESS</span><strong>Study before you enroll.</strong><p>Use the open library, quizzes and PYQs first. Full programs add sequencing, tests, answer-writing evaluation, mentoring and interview guidance.</p></aside>
          </div>
        </div>
      </section>

      <section id="library" className="study-shell library-section">
        <div className="section-head"><div><span className="overline">ACADEMIC RESOURCES</span><h2>Build your preparation subject by subject.</h2></div><p>All resources listed here are part of the free learning layer.</p></div>
        <div className="resource-grid">
          {CONTENT.map(item => (
            <Link key={item.href} href={item.href} className="resource-card">
              <div className="code">{item.code}</div>
              <div className="resource-copy"><span>{item.meta}</span><h3>{item.title}</h3><p>{item.desc}</p></div>
              <b className="arrow">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="method-wrap"><div className="study-shell"><div className="section-head light"><div><span className="overline">HOW TO USE THE FREE LAYER</span><h2>A simple study sequence that stays exam-oriented.</h2></div></div><div className="method-grid">{METHOD.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

      <section className="study-shell bridge">
        <div><span className="overline">WHEN YOU WANT STRUCTURE</span><h2>Free resources for learning. Full programs for a complete attempt.</h2><p>UPSC 2027/2028 and 72nd/73rd BPSC programs combine classes, Prelims testing, Mains answer-writing and evaluation, revision planning, mentoring and Interview guidance.</p></div>
        <div className="bridge-actions"><Link href="/#courses" className="primary">Explore Full Programs</Link><div className="fees"><span><b>UPSC</b> ₹56,000</span><span><b>BPSC</b> ₹29,000</span></div></div>
      </section>

      <style>{`
        .study-page{min-height:100vh;background:#f7f5f0;color:#172338}.study-shell{width:min(1080px,calc(100% - 32px));margin:0 auto}.study-hero{padding:62px 0 44px;background:linear-gradient(180deg,#fdfcf9,#f3f0e9);border-bottom:1px solid #dedbd3}.overline{font-size:9px;letter-spacing:.16em;font-weight:800;color:#98502e}.hero-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.65fr);gap:42px;align-items:end;margin-top:15px}.study-hero h1{font-family:var(--font-display);font-size:clamp(48px,8vw,86px);letter-spacing:-.065em;line-height:.9;color:#172338}.lead{max-width:720px;margin-top:18px;font-size:15px;line-height:1.8;color:#546174}.hero-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:24px}.primary,.secondary{text-decoration:none;border-radius:8px;padding:11px 15px;font-size:11px;font-weight:800}.primary{background:#21324d;color:#fff}.secondary{background:#fff;color:#21324d;border:1px solid #d7dbe2}.free-note{background:#fff;border:1px solid #d9d6cf;border-top:3px solid #9f3e1b;padding:19px;border-radius:4px}.free-note>span{font-size:8px;letter-spacing:.15em;color:#98502e;font-weight:900}.free-note strong{display:block;font-family:var(--font-display);font-size:21px;margin:7px 0;color:#172338}.free-note p{font-size:11px;line-height:1.7;color:#667181}.library-section{padding:50px 0}.section-head{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:20px}.section-head h2{font-family:var(--font-display);font-size:clamp(27px,4vw,42px);letter-spacing:-.045em;line-height:1.05;margin-top:7px}.section-head>p{max-width:310px;text-align:right;font-size:11px;color:#6f7884}.resource-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.resource-card{text-decoration:none;display:grid;grid-template-columns:47px 1fr auto;align-items:start;gap:14px;background:#fff;border:1px solid #dddad2;border-radius:9px;padding:18px;color:#172338;transition:.15s ease}.resource-card:hover{border-color:#b8b1a5;box-shadow:0 7px 22px rgba(30,42,60,.07);transform:translateY(-2px)}.code{width:47px;height:47px;border:1px solid #cdd3dc;background:#f2f5f8;display:grid;place-items:center;border-radius:7px;font-family:var(--font-display);font-size:13px;font-weight:800;color:#31445f}.resource-copy>span{font-size:8px;text-transform:uppercase;letter-spacing:.09em;color:#8d6a54;font-weight:800}.resource-copy h3{font-family:var(--font-display);font-size:18px;letter-spacing:-.025em;margin:3px 0}.resource-copy p{font-size:11px;line-height:1.6;color:#667181}.arrow{font-size:17px;color:#9f3e1b}.method-wrap{background:#172338;color:#fff;padding:48px 0}.section-head.light .overline{color:#e0b58e}.section-head.light h2{color:#fff;max-width:700px}.method-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.13)}.method-grid article{background:#172338;padding:21px}.method-grid article>span{font-family:Georgia,serif;color:#d7a777;font-size:21px}.method-grid h3{font-family:var(--font-display);font-size:16px;margin:13px 0 6px}.method-grid p{font-size:10px;line-height:1.7;color:#c7d0dc}.bridge{margin-top:42px;margin-bottom:42px;padding:27px;background:#fff;border:1px solid #d8d5ce;border-left:4px solid #9f3e1b;display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center}.bridge h2{font-family:var(--font-display);font-size:27px;letter-spacing:-.04em;margin:6px 0}.bridge p{max-width:700px;font-size:11px;line-height:1.65;color:#68727f}.bridge-actions{display:grid;gap:11px;min-width:220px}.bridge-actions .primary{text-align:center}.fees{display:flex;gap:7px}.fees span{flex:1;background:#f5f2ec;padding:8px;border-radius:6px;font-size:9px}.fees b{display:block;color:#98502e;font-size:8px}
        @media(max-width:760px){.hero-grid{grid-template-columns:1fr;gap:22px}.study-hero{padding:42px 0 30px}.resource-grid{grid-template-columns:1fr}.method-grid{grid-template-columns:1fr 1fr}.section-head{align-items:start;flex-direction:column}.section-head>p{text-align:left}.bridge{grid-template-columns:1fr}.bridge-actions{min-width:0}}@media(max-width:430px){.method-grid{grid-template-columns:1fr}.study-shell{width:min(100% - 24px,1080px)}.study-hero h1{font-size:52px}}
      `}</style>
    </main>
  );
}
