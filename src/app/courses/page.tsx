import Link from "next/link";
import { PROGRAMS } from "@/lib/coachingData";

const COMPARISON = [
  ["Foundation / NCERT", "Complete", "Complete"],
  ["Current Affairs", "Integrated", "Integrated + Bihar focus"],
  ["CSAT / Aptitude", "Full UPSC CSAT coverage", "Exam-specific aptitude support"],
  ["Previous papers", "UPSC GS-I archive + PYQ analysis", "BPSC CCE recurring-theme study"],
  ["Prelims practice", "Sectional + full mocks", "Sectional + full mocks"],
  ["Mains writing", "GS I-IV + Essay + Ethics", "GS + Bihar enrichment"],
  ["Evaluation + mentoring", "Included", "Included"],
  ["Interview preparation", "DAF + mocks", "Profile + Bihar issues + mocks"],
];

export default function CoursesPage() {
  return (
    <main className="program-page">
      <section className="course-hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">ONESHOT GS PROGRAMS</span>
            <h1>Complete preparation for UPSC CSE 2027 &amp; 73rd BPSC.</h1>
            <p>Two flagship programs, each designed as one academic journey from foundation to final interview. Classes, current affairs, previous papers, testing, answer-writing, evaluation, revision and mentoring are integrated into the same path.</p>
            <div className="actions"><Link href="/admissions" className="primary">Academic Counselling</Link><Link href="/demo" className="secondary">Watch Demo Class</Link></div>
          </div>
          <aside className="course-index">
            <div className="index-head"><span>COURSE INDEX</span><b>Current Flagship Programs</b></div>
            {PROGRAMS.map((program) => <Link href={`#${program.slug}`} key={program.slug}><div><b>{program.exam}</b><span>{program.target}</span></div><strong>{program.price}</strong></Link>)}
          </aside>
        </div>
      </section>

      <section className="shell section">
        <header><div><span className="overline">GENERAL STUDIES PROGRAMS</span><h2>Choose by target examination</h2></div><p>No bundle confusion or separate stage-wise upselling. Both programs cover Foundation, Prelims, Mains and Interview.</p></header>
        <div className="program-grid">
          {PROGRAMS.map((program, index) => (
            <article id={program.slug} key={program.slug}>
              <div className="program-top"><div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div><strong>{program.price}</strong></div>
              <div className="program-body">
                <b className="cycle">{program.target}</b>
                <p>{program.note}</p>
                <div className="include-grid"><div><h4>Academic coverage</h4><ul>{program.includes.map(item => <li key={item}>{item}</li>)}</ul></div><div><h4>Recommended for</h4><ul>{program.bestFor.map(item => <li key={item}>{item}</li>)}</ul></div></div>
              </div>
              <div className="card-actions"><Link href={`/courses/${program.slug}`}>View Complete Program</Link><Link href="/admissions">Admission Enquiry</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="compare-wrap"><div className="shell section"><header className="light"><div><span className="overline light-text">PROGRAM COMPARISON</span><h2>Same complete cycle. Exam-specific execution.</h2></div><p>The academic method is shared, while content, question trends and answer requirements differ for UPSC and BPSC.</p></header><div className="compare-table"><div className="row head"><b>Academic Component</b><b>UPSC CSE 2027</b><b>73rd BPSC</b></div>{COMPARISON.map(([name,upsc,bpsc]) => <div className="row" key={name}><span>{name}</span><span>{upsc}</span><span>{bpsc}</span></div>)}</div></div></section>

      <section className="shell section"><header><div><span className="overline">EXPLORE BEFORE ENROLLMENT</span><h2>Use the academic layer first</h2></div><p>See the teaching and preparation tools before deciding.</p></header><div className="steps"><Link href="/demo"><span>01</span><h3>Demo Class</h3><p>See the teaching approach and academic structure.</p></Link><Link href="/pyq"><span>02</span><h3>Previous Papers</h3><p>Open original UPSC GS-I papers directly on OneShot GS.</p></Link><Link href="/study"><span>03</span><h3>Free Study</h3><p>Explore NCERT, GS, Bihar Special and revision resources.</p></Link><Link href="/quizzes"><span>04</span><h3>Free Quiz</h3><p>Try active recall and exam-oriented practice.</p></Link></div></section>

      <section className="admission-cta"><div className="shell"><div><span>CURRENT PROGRAM FEES</span><h2>UPSC CSE 2027 · ₹1,60,000 &nbsp; | &nbsp; 73rd BPSC · ₹87,000</h2><p>Foundation + Prelims + Mains + Interview preparation.</p></div><div><Link href="/admissions">Admissions &amp; Counselling</Link><Link href="/demo">Demo Class</Link></div></div></section>

      <style>{`
        .program-page{min-height:100vh;background:#fff;color:#142844}.shell{width:min(1120px,calc(100% - 36px));margin:0 auto}.overline{font-size:8px;letter-spacing:.14em;font-weight:850;color:#c62c31}.light-text{color:#f0b4b7}.course-hero{padding:55px 0;background:#f6f8fb;border-bottom:1px solid #dce3ea}.hero-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:45px;align-items:center}.course-hero h1{font-family:var(--font-display);font-size:clamp(42px,5.8vw,66px);line-height:.98;letter-spacing:-.055em;color:#132d54;margin:9px 0 14px}.course-hero p{max-width:760px;font-size:12px;line-height:1.75;color:#607187}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:43px;padding:0 15px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#c62c31;color:#fff}.secondary{background:#fff;border:1px solid #cfd8e2;color:#17385f}.course-index{border:1px solid #d7dfe8;background:#fff}.index-head{padding:15px 17px;background:#17375f;color:#fff}.index-head span,.index-head b{display:block}.index-head span{font-size:6.5px;letter-spacing:.12em;color:#efb5b7}.index-head b{font-family:var(--font-display);font-size:17px;margin-top:3px}.course-index>a{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 17px;border-bottom:1px solid #e1e6ec;text-decoration:none;color:#17375f}.course-index>a:last-child{border-bottom:0}.course-index>a div b,.course-index>a div span{display:block}.course-index>a div b{font-size:9px}.course-index>a div span{font-size:7px;color:#708095;margin-top:3px}.course-index>a>strong{font-family:var(--font-display);font-size:18px;color:#c62c31}.section{padding:60px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:22px}.section header h2{font-family:var(--font-display);font-size:clamp(30px,4vw,43px);color:#15345d;letter-spacing:-.045em;margin-top:5px}.section header>p{max-width:420px;text-align:right;font-size:9.5px;line-height:1.65;color:#68798e}.program-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.program-grid article{border:1px solid #d8e0e7;background:#fff;scroll-margin-top:130px}.program-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:19px 21px;background:#f7f9fb;border-bottom:1px solid #dfe5eb}.program-top span{font-size:6.5px;letter-spacing:.1em;font-weight:850;color:#c62c31}.program-top h3{font-family:var(--font-display);font-size:25px;color:#17375f;margin-top:4px}.program-top>strong{font-family:var(--font-display);font-size:24px;color:#c62c31}.program-body{padding:20px 21px}.cycle{display:inline-block;padding:6px 8px;background:#edf3f8;border-left:3px solid #1e4d81;font-size:8px;color:#214a78}.program-body>p{font-size:9.5px;line-height:1.7;color:#627287;margin:13px 0 18px}.include-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:24px}.include-grid h4{font-size:7.5px;text-transform:uppercase;letter-spacing:.09em;color:#193e69;margin-bottom:9px}.include-grid ul{list-style:none;display:grid;gap:7px}.include-grid li{position:relative;padding-left:12px;font-size:8px;line-height:1.45;color:#5c6d82}.include-grid li::before{content:'•';position:absolute;left:0;color:#c62c31}.card-actions{display:flex;border-top:1px solid #dfe5eb}.card-actions a{flex:1;display:flex;align-items:center;justify-content:center;min-height:43px;text-decoration:none;font-size:8px;font-weight:850}.card-actions a:first-child{background:#17375f;color:#fff}.card-actions a:last-child{color:#17375f}.compare-wrap{background:#142c52;color:#fff}.light h2{color:#fff!important}.light>p{color:#c6d2df!important}.compare-table{border:1px solid rgba(255,255,255,.16)}.row{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.12);font-size:8.5px;color:#ccd6e1}.row:last-child{border-bottom:0}.row.head{background:rgba(255,255,255,.06);color:#fff;font-size:7.5px;text-transform:uppercase;letter-spacing:.08em}.steps{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d9e0e7}.steps a{padding:20px;border-right:1px solid #dfe5eb;text-decoration:none;color:#17375f}.steps a:last-child{border-right:0}.steps a>span{font-family:var(--font-display);font-size:25px;color:#d4dde7}.steps h3{font-family:var(--font-display);font-size:18px;margin:13px 0 5px}.steps p{font-size:8px;line-height:1.55;color:#68798e}.admission-cta{background:#c62c31;color:#fff}.admission-cta>.shell{padding:31px 0;display:flex;justify-content:space-between;align-items:center;gap:30px}.admission-cta span{font-size:7px;letter-spacing:.12em;font-weight:850;color:#ffd5d6}.admission-cta h2{font-family:var(--font-display);font-size:clamp(25px,3.4vw,36px);margin-top:4px}.admission-cta p{font-size:8px;color:#ffe3e4;margin-top:3px}.admission-cta>.shell>div:last-child{display:flex;gap:7px;flex-wrap:wrap}.admission-cta a{display:flex;align-items:center;justify-content:center;min-height:41px;padding:0 13px;background:#fff;color:#ae252a;text-decoration:none;font-size:8px;font-weight:850}.admission-cta a:last-child{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.45)}@media(max-width:850px){.hero-grid{grid-template-columns:1fr}.course-index{max-width:600px}.program-grid{grid-template-columns:1fr}.section header{align-items:flex-start;flex-direction:column;gap:8px}.section header>p{text-align:left}.admission-cta>.shell{align-items:flex-start;flex-direction:column}}@media(max-width:620px){.course-hero{padding:42px 0}.include-grid{grid-template-columns:1fr}.steps{grid-template-columns:1fr 1fr}.steps a:nth-child(2){border-right:0}.steps a:nth-child(-n+2){border-bottom:1px solid #dfe5eb}.program-top{flex-direction:column}.row{font-size:7.5px;padding:10px 7px}}@media(max-width:420px){.steps{grid-template-columns:1fr}.steps a{border-right:0;border-bottom:1px solid #dfe5eb!important}.steps a:last-child{border-bottom:0!important}.admission-cta>.shell>div:last-child{width:100%}.admission-cta a{flex:1}}
      `}</style>
    </main>
  );
}
