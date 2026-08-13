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
            <div className="index-head">CURRENT PROGRAMS</div>
            {PROGRAMS.map((program) => <Link href={`#${program.slug}`} key={program.slug}><div><b>{program.exam}</b><span>{program.target}</span></div><strong>{program.price}</strong></Link>)}
          </aside>
        </div>
      </section>

      <section className="shell section">
        <header><span className="overline">PROGRAM DETAILS</span><h2>Course coverage</h2></header>
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

      <section className="compare-wrap"><div className="shell section"><header className="light"><span className="overline light-text">COMPARISON</span><h2>UPSC 2027 vs 73rd BPSC</h2></header><div className="compare-table"><div className="row head"><b>Component</b><b>UPSC CSE 2027</b><b>73rd BPSC</b></div>{COMPARISON.map(([name,upsc,bpsc]) => <div className="row" key={name}><span>{name}</span><span>{upsc}</span><span>{bpsc}</span></div>)}</div></div></section>

      <section className="shell links-section"><div><span className="overline">FREE LINKS</span><h2>Demo &amp; resources</h2></div><div className="link-grid"><Link href="/demo">Demo Class <span>→</span></Link><Link href="/pyq">Previous Papers <span>→</span></Link><Link href="/study">Free Study <span>→</span></Link><Link href="/quizzes">Free Quiz <span>→</span></Link></div></section>

      <style>{`
        .program-page{min-height:100vh;background:#fff;color:#26384d;font-family:Arial,"Helvetica Neue",sans-serif}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.overline{font-size:10px;letter-spacing:.06em;font-weight:700;color:#d9272e}.light-text{color:#ffc2c5}.course-hero{padding:32px 0;background:#f5f7fa;border-bottom:1px solid #dce3e9}.hero-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:30px;align-items:center}.course-hero h1,.section h2,.links-section h2{color:#12345b;font-weight:700}.course-hero h1{font-size:36px;line-height:1.15;margin:7px 0 9px}.course-hero p{font-size:13px;line-height:1.6;color:#607083}.actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:15px}.primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;text-decoration:none;font-size:10px;font-weight:700;border-radius:2px}.primary{background:#d9272e;color:#fff}.secondary{background:#fff;border:1px solid #cad5df;color:#174f86}.course-index{border:1px solid #d6dee6;background:#fff}.index-head{padding:10px 13px;background:#12345b;color:#fff;border-bottom:3px solid #d9272e;font-size:10px;font-weight:700}.course-index>a{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 13px;border-bottom:1px solid #e0e5ea;color:#12345b}.course-index>a:last-child{border-bottom:0}.course-index>a div b,.course-index>a div span{display:block}.course-index>a div b{font-size:11px}.course-index>a div span{font-size:9px;color:#6f7d8d;margin-top:2px}.course-index>a>strong{font-size:16px;color:#d9272e}.section{padding:42px 0}.section header{margin-bottom:16px}.section h2,.links-section h2{font-size:27px;margin-top:2px}.program-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.program-grid article{border:1px solid #d8e0e7;background:#fff;scroll-margin-top:120px}.program-top{display:flex;justify-content:space-between;gap:18px;padding:14px 16px;background:#f7f9fb;border-bottom:1px solid #dfe5eb}.program-top span{font-size:9px;letter-spacing:.04em;font-weight:700;color:#d9272e}.program-top h3{font-size:20px;color:#12345b;margin-top:2px;font-weight:700}.program-top>strong{font-size:19px;color:#d9272e;white-space:nowrap}.program-body{padding:15px 16px}.cycle{display:inline-block;padding:5px 7px;background:#edf3f8;border-left:3px solid #174f86;font-size:9px;color:#174f86}.program-body>p{font-size:9.5px;line-height:1.55;color:#627287;margin:10px 0 12px}.program-body ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px 15px}.program-body li{position:relative;padding-left:11px;font-size:9px;line-height:1.4;color:#5b6d80}.program-body li::before{content:'•';position:absolute;left:0;color:#d9272e}.card-actions{display:flex;border-top:1px solid #dfe5eb}.card-actions a{flex:1;display:flex;align-items:center;justify-content:center;min-height:39px;font-size:9px;font-weight:700}.card-actions a:first-child{background:#174f86;color:#fff}.card-actions a:last-child{color:#174f86}.compare-wrap{background:#12345b;color:#fff}.light h2{color:#fff!important}.compare-table{border:1px solid rgba(255,255,255,.18)}.row{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.12);font-size:9px;color:#d2dbe4}.row:last-child{border-bottom:0}.row.head{background:rgba(255,255,255,.06);color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.04em}.links-section{padding:42px 0}.link-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d9e0e7;margin-top:14px}.link-grid a{padding:14px;border-right:1px solid #dfe5eb;color:#174f86;font-size:10px;font-weight:700;display:flex;justify-content:space-between}.link-grid a:last-child{border-right:0}@media(max-width:850px){.hero-grid{grid-template-columns:1fr}.course-index{max-width:600px}.program-grid{grid-template-columns:1fr}.link-grid{grid-template-columns:1fr 1fr}.link-grid a:nth-child(2){border-right:0}.link-grid a:nth-child(-n+2){border-bottom:1px solid #dfe5eb}}@media(max-width:560px){.course-hero h1{font-size:29px}.program-body ul{grid-template-columns:1fr}.program-top{flex-direction:column}.link-grid{grid-template-columns:1fr}.link-grid a{border-right:0;border-bottom:1px solid #dfe5eb}.link-grid a:last-child{border-bottom:0}.row{font-size:8px;padding:9px 6px}}
      `}</style>
    </main>
  );
}
