import Link from "next/link";

const LESSON_POINTS = [
  ["What the doctrine does", "The basic structure doctrine limits Parliament’s amending power under Article 368. Constitutional amendments remain possible, but the Constitution’s foundational identity cannot be destroyed."],
  ["Why it matters for Prelims", "Questions often test the relationship between Article 368, judicial review, constitutional amendments and landmark Supreme Court cases."],
  ["Why it matters for Mains", "The topic sits at the intersection of constitutionalism, parliamentary sovereignty, judicial review, separation of powers and federal-democratic safeguards."],
  ["Answer-writing angle", "A strong Mains answer should explain the doctrine, identify its constitutional purpose, acknowledge criticism about judicial overreach, and conclude with institutional balance."],
];

const QUICK_CHECK = [
  "Can Parliament amend Fundamental Rights?",
  "Is the basic structure doctrine written expressly in the Constitution?",
  "Why is judicial review connected to the doctrine?",
  "How would you distinguish constitutional amendment from constitutional destruction?",
];

export default function DemoPage() {
  return (
    <main className="demo-page">
      <section className="demo-hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">DEMO CLASS · POLITY</span>
            <h1>Basic Structure Doctrine: learn it for Prelims and write it for Mains.</h1>
            <p>This is a working sample lesson from the OneShot GS teaching format. It shows how one topic is taken from concept → PYQ relevance → Mains structure → revision.</p>
            <div className="actions"><a href="#lesson" className="primary">Start Demo Lesson</a><Link href="/courses" className="secondary">View Complete Programs</Link></div>
          </div>
          <aside className="lesson-card">
            <span>DEMO FORMAT</span>
            <dl><div><dt>Subject</dt><dd>Indian Polity</dd></div><div><dt>Level</dt><dd>UPSC / BPSC</dd></div><div><dt>Use</dt><dd>Prelims + Mains</dd></div><div><dt>Time</dt><dd>10–15 min</dd></div></dl>
            <p>No signup required. Use this page to judge the academic structure before enrolling.</p>
          </aside>
        </div>
      </section>

      <section id="lesson" className="shell lesson-layout">
        <article className="lesson-main">
          <div className="lesson-block intro">
            <span className="overline">01 · CONCEPT</span>
            <h2>Start with the constitutional problem, not the case name.</h2>
            <p>If Parliament had unlimited power to amend the Constitution, an elected majority could theoretically remove features that make the Constitution democratic, federal or rights-protecting. The basic structure doctrine emerged as a judicial answer to that problem.</p>
            <div className="definition"><b>Exam-ready definition</b><p>The doctrine means that Parliament can amend the Constitution under Article 368, but cannot alter or destroy its basic structure or essential constitutional identity.</p></div>
          </div>

          <div className="lesson-block">
            <span className="overline">02 · BUILD THE TOPIC</span>
            <h2>Four layers to remember.</h2>
            <div className="point-grid">{LESSON_POINTS.map(([title, copy], i) => <div key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
          </div>

          <div className="lesson-block mains-box">
            <span className="overline light">03 · MAINS PRACTICE</span>
            <h2>Practice question</h2>
            <blockquote>“The basic structure doctrine is both a limitation on constitutional power and a safeguard for constitutional democracy.” Discuss.</blockquote>
            <div className="answer-plan"><div><b>Introduction</b><span>Define the doctrine and connect it to Article 368.</span></div><div><b>Body I</b><span>Explain why limits on amendment power protect constitutional identity.</span></div><div><b>Body II</b><span>Discuss judicial review, democracy, federalism and rights as examples of protected principles.</span></div><div><b>Counter-view</b><span>Acknowledge criticism regarding judicial supremacy and unelected judges.</span></div><div><b>Conclusion</b><span>Frame the doctrine as institutional balance, not parliamentary paralysis.</span></div></div>
          </div>

          <div className="lesson-block">
            <span className="overline">04 · ACTIVE RECALL</span>
            <h2>Close the notes and answer these.</h2>
            <ol>{QUICK_CHECK.map(q => <li key={q}>{q}</li>)}</ol>
            <div className="next-actions"><Link href="/quizzes/static">Practice Static GS →</Link><Link href="/pyq">Open Official PYQs →</Link><Link href="/study">Continue Free Study →</Link></div>
          </div>
        </article>

        <aside className="lesson-side">
          <div><span className="overline">THE METHOD</span><h3>How OneShot GS teaches a topic</h3><ol><li>Understand the concept</li><li>Connect it to PYQs</li><li>Convert it into Mains structure</li><li>Test recall</li><li>Schedule revision</li></ol></div>
          <div className="cta-side"><span>READY FOR THE FULL PATHWAY?</span><h3>Prelims + Mains + Interview</h3><p>UPSC ₹56,000 · BPSC ₹29,000</p><Link href="/courses">Compare Programs →</Link><Link href="/admissions" className="outline">Talk to Admissions</Link></div>
        </aside>
      </section>

      <style>{`
        .demo-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1050px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#98502e}.overline.light{color:#e3b991}.demo-hero{padding:58px 0 44px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d8d5ce}.hero-grid{display:grid;grid-template-columns:minmax(0,1.4fr) 300px;gap:45px;align-items:end}.demo-hero h1{font-family:var(--font-display);font-size:clamp(42px,6vw,68px);line-height:.96;letter-spacing:-.058em;margin:10px 0 15px;max-width:800px}.demo-hero p{font-size:13px;line-height:1.8;color:#5c6877;max-width:720px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.primary,.secondary{padding:11px 15px;border-radius:6px;text-decoration:none;font-size:10px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d0d5dc;color:#21324d}.lesson-card{background:#fff;border:1px solid #d0d2d2;border-top:4px solid #9f3e1b;padding:18px}.lesson-card>span{font-size:7px;letter-spacing:.14em;font-weight:850;color:#99502f}.lesson-card dl{margin-top:9px}.lesson-card dl>div{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8e4de}.lesson-card dt{font-size:8px;color:#7a8490}.lesson-card dd{font-size:8px;font-weight:800}.lesson-card p{font-size:8.5px;line-height:1.55;color:#687482;margin-top:10px}.lesson-layout{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:18px;padding:34px 0 60px}.lesson-block{background:#fff;border:1px solid #d9d6d0;padding:25px;margin-bottom:12px}.lesson-block h2{font-family:var(--font-display);font-size:clamp(27px,4vw,39px);line-height:1.05;letter-spacing:-.04em;margin:8px 0 12px}.lesson-block>p{font-size:11px;line-height:1.85;color:#566372}.definition{margin-top:18px;border-left:3px solid #9f3e1b;background:#f6f1eb;padding:15px}.definition b{font-size:9px;color:#8e3e22}.definition p{font-size:10px;line-height:1.7;color:#455466;margin-top:5px}.point-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.point-grid>div{border:1px solid #e0ddd7;padding:15px;background:#faf9f6}.point-grid>div>span{font-family:Georgia,serif;color:#a34b27;font-size:15px}.point-grid h3{font-family:var(--font-display);font-size:15px;margin:7px 0 4px}.point-grid p{font-size:8.8px;line-height:1.65;color:#64707e}.mains-box{background:#26364f;color:#fff;border-color:#26364f}.mains-box blockquote{font-family:Georgia,serif;font-size:17px;line-height:1.6;color:#f1ece6;border-left:2px solid #dda873;padding-left:15px;margin:13px 0 18px}.answer-plan{display:grid;gap:6px}.answer-plan>div{display:grid;grid-template-columns:100px 1fr;gap:12px;padding:9px;border-top:1px solid rgba(255,255,255,.12)}.answer-plan b{font-size:8px;color:#e2b486}.answer-plan span{font-size:8.5px;line-height:1.55;color:#ced7e2}.lesson-block ol{padding-left:18px;display:grid;gap:9px;font-size:10px;color:#566372}.next-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}.next-actions a{padding:9px 11px;border-radius:4px;text-decoration:none;background:#21324d;color:#fff;font-size:8.5px;font-weight:850}.lesson-side{display:grid;gap:10px;align-content:start;position:sticky;top:100px;height:max-content}.lesson-side>div{background:#fff;border:1px solid #d9d6d0;padding:17px}.lesson-side h3{font-family:var(--font-display);font-size:20px;line-height:1.1;margin:7px 0 10px}.lesson-side ol{padding-left:17px;font-size:9px;line-height:1.9;color:#61707f}.lesson-side .cta-side{background:#172338;color:#fff}.cta-side>span{font-size:7px;letter-spacing:.12em;color:#dfb58e;font-weight:850}.cta-side p{font-size:9px;color:#c6d0dc;margin:6px 0 13px}.cta-side a{display:block;text-align:center;text-decoration:none;padding:9px;background:#a34720;color:#fff;font-size:8.5px;font-weight:850;margin-top:6px;border-radius:4px}.cta-side .outline{background:transparent;border:1px solid rgba(255,255,255,.22)}@media(max-width:780px){.hero-grid,.lesson-layout{grid-template-columns:1fr}.lesson-side{position:static;grid-template-columns:1fr 1fr}.point-grid{grid-template-columns:1fr}}@media(max-width:520px){.demo-hero{padding:42px 0 32px}.lesson-side{grid-template-columns:1fr}.answer-plan>div{grid-template-columns:1fr;gap:4px}}
      `}</style>
    </main>
  );
}
