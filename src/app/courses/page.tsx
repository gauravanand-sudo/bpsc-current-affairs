import Link from "next/link";
import { PROGRAMS } from "@/lib/coachingData";

const COMPARISON = [
  ["Complete GS coverage", "Included", "Included"],
  ["CSAT", "Included", "Not required"],
  ["Bihar Special", "Integrated where relevant", "Core component"],
  ["Current Affairs", "Included", "Included"],
  ["Prelims tests + PYQs", "Included", "Included"],
  ["Mains answer-writing", "Included", "Included"],
  ["Evaluation + mentoring", "Included", "Included"],
  ["Interview guidance", "Included", "Included"],
];

export default function CoursesPage() {
  return (
    <main className="program-page">
      <section className="program-hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">COMPLETE PROGRAMS</span>
            <h1>Choose one exam cycle and prepare it end to end.</h1>
            <p>OneShot GS complete programs are organised as a single academic journey: build concepts, practise PYQs, test for Prelims, write for Mains, revise systematically and prepare for the Interview stage.</p>
            <div className="actions">
              <Link href="/demo" className="primary">View Demo Class</Link>
              <Link href="/admissions" className="secondary">Talk to Admissions</Link>
              <Link href="/pyq" className="text-link">Explore PYQs →</Link>
            </div>
          </div>
          <aside className="fee-note">
            <span>FULL-CYCLE FEE</span>
            <div><b>UPSC 2027 / 2028</b><strong>₹56,000</strong><small>Prelims + Mains + Interview</small></div>
            <div><b>72nd / 73rd BPSC</b><strong>₹29,000</strong><small>Prelims + Mains + Interview</small></div>
            <p>Open any program to review the academic roadmap, inclusions, FAQs and enrollment status before deciding.</p>
          </aside>
        </div>
      </section>

      <section className="shell section">
        <header className="section-head">
          <div><span className="overline">AVAILABLE BATCHES</span><h2>Four focused programs. No bundle confusion.</h2></div>
          <p>Choose based on your target examination cycle, not on a pile of separate stage-wise products.</p>
        </header>
        <div className="program-grid">
          {PROGRAMS.map(program => (
            <article key={program.slug} className="program-card">
              <div className="program-top"><span>{program.exam}</span><strong>{program.price}</strong></div>
              <h3>{program.title}</h3>
              <p className="note">{program.note}</p>
              <p className="cycle">{program.target}</p>
              <ul>{program.includes.slice(0, 6).map(item => <li key={item}>✓ {item}</li>)}</ul>
              <div className="card-actions">
                <Link href={`/courses/${program.slug}`}>View Full Program →</Link>
                <Link href="/demo" className="outline">Demo Class</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="compare-wrap">
        <div className="shell section">
          <header className="section-head light-head">
            <div><span className="overline light">WHAT THE COMPLETE FEE COVERS</span><h2>Compare the academic structure.</h2></div>
            <p>UPSC and BPSC have different exam-specific needs, but both programs are designed across the complete selection cycle.</p>
          </header>
          <div className="compare-table">
            <div className="row head"><b>Academic component</b><b>UPSC</b><b>BPSC</b></div>
            {COMPARISON.map(([name, upsc, bpsc]) => <div className="row" key={name}><span>{name}</span><span>{upsc}</span><span>{bpsc}</span></div>)}
          </div>
        </div>
      </section>

      <section className="shell section process-section">
        <header className="section-head"><div><span className="overline">HOW ENROLLMENT WORKS</span><h2>Review first. Enroll second.</h2></div><p>A coaching site should let you understand the program before asking you to pay.</p></header>
        <div className="steps">
          <article><span>01</span><h3>Review program</h3><p>Open the complete syllabus coverage, learning phases and who the batch is designed for.</p></article>
          <article><span>02</span><h3>Take the demo</h3><p>Use the working demo class to assess the learning style and academic structure.</p></article>
          <article><span>03</span><h3>Use free resources</h3><p>Try Free Study, Free Quiz and official PYQs before making a paid decision.</p></article>
          <article><span>04</span><h3>Enroll</h3><p>Proceed from the program page. The site will show the current payment-system status transparently.</p></article>
        </div>
      </section>

      <section className="shell final-cta">
        <div><span className="overline light">NEED HELP CHOOSING?</span><h2>Tell us your target exam and preparation stage.</h2><p>Use the admissions page to choose between UPSC 2027, UPSC 2028, 72nd BPSC and 73rd BPSC.</p></div>
        <div className="actions"><Link href="/admissions" className="primary warm">Talk to Admissions →</Link><Link href="/study" className="secondary dark">Start Free Study</Link></div>
      </section>

      <style>{`
        .program-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1100px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#98502e}.overline.light{color:#e2b58c}.program-hero{padding:64px 0 50px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.hero-grid{display:grid;grid-template-columns:minmax(0,1.4fr) 320px;gap:50px;align-items:end}.program-hero h1{font-family:var(--font-display);font-size:clamp(44px,6.5vw,72px);line-height:.95;letter-spacing:-.06em;max-width:820px;margin:10px 0 15px}.program-hero p{max-width:760px;font-size:13.5px;line-height:1.8;color:#586575}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:20px}.primary,.secondary{padding:11px 15px;border-radius:6px;text-decoration:none;font-size:10px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d2d7dd;color:#21324d}.text-link{padding:10px;text-decoration:none;color:#91401f;font-size:10px;font-weight:850}.fee-note{background:#fff;border:1px solid #d1d2d0;border-top:4px solid #9f3e1b;padding:18px}.fee-note>span{font-size:7px;letter-spacing:.15em;color:#94502f;font-weight:850}.fee-note>div{padding:13px 0;border-bottom:1px solid #e3e0da;display:grid;grid-template-columns:1fr auto}.fee-note b,.fee-note small{display:block}.fee-note b{font-size:9px}.fee-note strong{font-family:var(--font-display);font-size:22px;grid-column:2;grid-row:1/3}.fee-note small{font-size:8px;color:#77818d}.fee-note>p{font-size:9px;line-height:1.6;color:#667280;margin-top:12px}.section{padding:54px 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:22px}.section-head h2{font-family:var(--font-display);font-size:clamp(29px,4vw,43px);line-height:1.04;letter-spacing:-.045em;margin-top:7px}.section-head>p{max-width:390px;text-align:right;font-size:10px;line-height:1.6;color:#687482}.program-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.program-card{background:#fff;border:1px solid #d8d6d0;border-top:3px solid #31445f;padding:20px;display:flex;flex-direction:column}.program-top{display:flex;justify-content:space-between;gap:10px;align-items:start}.program-top span{font-size:8px;letter-spacing:.1em;font-weight:850;color:#965033}.program-top strong{font-family:var(--font-display);font-size:24px}.program-card h3{font-family:var(--font-display);font-size:25px;letter-spacing:-.035em;margin:8px 0 3px}.program-card .note{font-size:10px;line-height:1.6;color:#667383}.cycle{font-size:8.5px;font-weight:850;color:#245a3c;margin-top:9px}.program-card ul{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:17px 0;font-size:9px;color:#536171;flex:1}.card-actions{display:flex;gap:7px}.card-actions a{flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:4px;background:#21324d;color:#fff;font-size:9px;font-weight:850}.card-actions .outline{background:#fff;color:#21324d;border:1px solid #d0d5dc}.compare-wrap{background:#172338;color:#fff}.light-head>p{color:#c5ced9}.compare-table{border:1px solid rgba(255,255,255,.14)}.row{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.11);font-size:9.5px;color:#cbd4df}.row:last-child{border-bottom:0}.row.head{background:rgba(255,255,255,.055);color:#fff;font-size:8px;letter-spacing:.08em}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.steps article{background:#fff;border:1px solid #d8d5cf;padding:17px}.steps article>span{font-family:Georgia,serif;color:#9f3e1b;font-size:19px}.steps h3{font-family:var(--font-display);font-size:17px;margin:10px 0 5px}.steps p{font-size:9px;line-height:1.65;color:#687482}.final-cta{margin-top:10px;margin-bottom:40px;padding:28px;background:#26364f;color:white;display:flex;justify-content:space-between;gap:30px;align-items:center}.final-cta h2{font-family:var(--font-display);font-size:clamp(28px,4vw,42px);line-height:1.03;letter-spacing:-.04em;margin:6px 0}.final-cta p{font-size:9.5px;color:#c8d1dd}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.25)}@media(max-width:800px){.hero-grid{grid-template-columns:1fr;gap:26px}.program-grid{grid-template-columns:1fr}.steps{grid-template-columns:1fr 1fr}.section-head{align-items:start;flex-direction:column;gap:8px}.section-head>p{text-align:left}.row{grid-template-columns:1.2fr .8fr .8fr}.final-cta{align-items:flex-start;flex-direction:column}}@media(max-width:520px){.program-hero{padding:44px 0 34px}.program-card ul{grid-template-columns:1fr}.steps{grid-template-columns:1fr}.row{font-size:8px;padding:10px 8px}.final-cta{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
