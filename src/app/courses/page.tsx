import Link from "next/link";
import { PROGRAMS } from "@/lib/coachingData";

const COMPARISON = [
  ["Foundation / NCERT", "Complete", "Complete"],
  ["Current Affairs", "Integrated", "Integrated + Bihar focus"],
  ["CSAT / Aptitude", "UPSC CSAT coverage", "Exam-specific aptitude support"],
  ["Previous papers", "UPSC GS-I archive + PYQ analysis", "BPSC PYQ study"],
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
            <span className="overline">COURSES &amp; FEES</span>
            <h1>UPSC CSE 2027 &amp; 73rd BPSC</h1>
            <p>Two complete programs covering Foundation, Prelims, Mains and Interview preparation.</p>
            <div className="actions"><Link href="/admissions" className="primary">Admissions &amp; Fees</Link><Link href="/demo" className="secondary">Demo Class</Link></div>
          </div>
          <aside className="course-index">
            <div className="index-head"><span>CURRENT PROGRAMS</span></div>
            {PROGRAMS.map((program) => <Link href={`#${program.slug}`} key={program.slug}><div><b>{program.exam}</b><span>{program.target}</span></div><strong>{program.price}</strong></Link>)}
          </aside>
        </div>
      </section>

      <section className="shell section">
        <header><div><span className="overline">PROGRAM DETAILS</span><h2>Coverage</h2></div></header>
        <div className="program-grid">
          {PROGRAMS.map((program, index) => (
            <article id={program.slug} key={program.slug}>
              <div className="program-top"><div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div><strong>{program.price}</strong></div>
              <div className="program-body">
                <b className="cycle">{program.target}</b>
                <p>{program.note}</p>
                <ul>{program.includes.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="card-actions"><Link href={`/courses/${program.slug}`}>Full Course Details</Link><Link href="/demo">Demo</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="compare-wrap"><div className="shell section"><header className="light"><div><span className="overline light-text">COMPARISON</span><h2>UPSC 2027 vs 73rd BPSC</h2></div></header><div className="compare-table"><div className="row head"><b>Component</b><b>UPSC CSE 2027</b><b>73rd BPSC</b></div>{COMPARISON.map(([name,upsc,bpsc]) => <div className="row" key={name}><span>{name}</span><span>{upsc}</span><span>{bpsc}</span></div>)}</div></div></section>

      <section className="shell links-section">
        <div><span className="overline">FREE LINKS</span><h2>Demo &amp; resources</h2></div>
        <div className="link-grid"><Link href="/demo">Demo Class <span>→</span></Link><Link href="/pyq">Previous Papers <span>→</span></Link><Link href="/study">Free Study <span>→</span></Link><Link href="/quizzes">Free Quiz <span>→</span></Link></div>
      </section>

      <style>{`
        .program-page{min-height:100vh;background:#fff;color:#142844}.shell{width:min(1120px,calc(100% - 36px));margin:0 auto}.overline{font-size:8px;letter-spacing:.14em;font-weight:850;color:#c62c31}.light-text{color:#f0b4b7}.course-hero{padding:55px 0;background:#f6f8fb;border-bottom:1px solid #dce3ea}.hero-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:45px;align-items:center}.course-hero h1,.section h2,.links-section h2{font-family:var(--font-display);color:#15335c;letter-spacing:-.05em}.course-hero h1{font-size:clamp(42px,5.8vw,66px);line-height:.98;margin:9px 0 14px}.course-hero p{font-size:12px;line-height:1.7;color:#607187}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:43px;padding:0 15px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#c62c31;color:#fff}.secondary{background:#fff;border:1px solid #cfd8e2;color:#17385f}.course-index{border:1px solid #d7dfe8;background:#fff}.index-head{padding:14px 17px;background:#17375f;color:#fff}.index-head span{font-size:7px;letter-spacing:.12em;color:#efb5b7;font-weight:850}.course-index>a{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px 17px;border-bottom:1px solid #e1e6ec;text-decoration:none;color:#17375f}.course-index>a:last-child{border-bottom:0}.course-index>a div b,.course-index>a div span{display:block}.course-index>a div b{font-size:9px}.course-index>a div span{font-size:7px;color:#708095;margin-top:3px}.course-index>a>strong{font-family:var(--font-display);font-size:18px;color:#c62c31}.section{padding:60px 0}.section header{margin-bottom:22px}.section h2,.links-section h2{font-size:clamp(30px,4vw,43px);margin-top:5px}.program-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.program-grid article{border:1px solid #d8e0e7;background:#fff;scroll-margin-top:130px}.program-top{display:flex;justify-content:space-between;gap:20px;padding:19px 21px;background:#f7f9fb;border-bottom:1px solid #dfe5eb}.program-top span{font-size:6.5px;letter-spacing:.1em;font-weight:850;color:#c62c31}.program-top h3{font-family:var(--font-display);font-size:25px;color:#17375f;margin-top:4px}.program-top>strong{font-family:var(--font-display);font-size:24px;color:#c62c31}.program-body{padding:20px 21px}.cycle{display:inline-block;padding:6px 8px;background:#edf3f8;border-left:3px solid #1e4d81;font-size:8px;color:#214a78}.program-body>p{font-size:9px;line-height:1.65;color:#627287;margin:13px 0 16px}.program-body ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:7px 18px}.program-body li{position:relative;padding-left:12px;font-size:8px;line-height:1.45;color:#5c6d82}.program-body li::before{content:'•';position:absolute;left:0;color:#c62c31}.card-actions{display:flex;border-top:1px solid #dfe5eb}.card-actions a{flex:1;display:flex;align-items:center;justify-content:center;min-height:43px;text-decoration:none;font-size:8px;font-weight:850}.card-actions a:first-child{background:#17375f;color:#fff}.card-actions a:last-child{color:#17375f}.compare-wrap{background:#142c52;color:#fff}.light h2{color:#fff!important}.compare-table{border:1px solid rgba(255,255,255,.16)}.row{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.12);font-size:8.5px;color:#ccd6e1}.row:last-child{border-bottom:0}.row.head{background:rgba(255,255,255,.06);color:#fff;font-size:7.5px;text-transform:uppercase;letter-spacing:.08em}.links-section{padding:60px 0}.link-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d9e0e7;margin-top:20px}.link-grid a{padding:18px;border-right:1px solid #dfe5eb;text-decoration:none;color:#17375f;font-size:9px;font-weight:850;display:flex;justify-content:space-between}.link-grid a:last-child{border-right:0}@media(max-width:850px){.hero-grid{grid-template-columns:1fr}.course-index{max-width:600px}.program-grid{grid-template-columns:1fr}.link-grid{grid-template-columns:1fr 1fr}.link-grid a:nth-child(2){border-right:0}.link-grid a:nth-child(-n+2){border-bottom:1px solid #dfe5eb}}@media(max-width:560px){.program-body ul{grid-template-columns:1fr}.program-top{flex-direction:column}.link-grid{grid-template-columns:1fr}.link-grid a{border-right:0;border-bottom:1px solid #dfe5eb}.link-grid a:last-child{border-bottom:0}.row{font-size:7.5px;padding:10px 7px}}
      `}</style>
    </main>
  );
}
