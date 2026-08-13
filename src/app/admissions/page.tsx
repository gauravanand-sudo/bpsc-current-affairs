import Link from "next/link";
import { PROGRAMS } from "@/lib/coachingData";

export default function AdmissionsPage() {
  return (
    <main className="admissions-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">ADMISSIONS &amp; FEES</span>
            <h1>UPSC CSE 2027 &amp; 73rd BPSC</h1>
            <p>Both are complete programs covering Foundation, Prelims, Mains and Interview preparation.</p>
            <div className="actions"><Link href="/courses" className="primary">Course Details</Link><Link href="/demo" className="secondary">Demo Class</Link><Link href="/support" className="text-link">Contact Support →</Link></div>
          </div>
          <aside className="status-card">
            <span>PAYMENT STATUS</span>
            <h2>Online payment is temporarily unavailable.</h2>
            <p>The payment flow is being fixed. Course pages and free resources remain available.</p>
          </aside>
        </div>
      </section>

      <section className="shell section">
        <header><div><span className="overline">CURRENT PROGRAMS</span><h2>Fees and coverage</h2></div></header>
        <div className="program-grid">
          {PROGRAMS.map((program, index) => (
            <article key={program.slug}>
              <div className="program-head"><div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div><strong>{program.price}</strong></div>
              <div className="program-body"><b>{program.target}</b><ul>{program.includes.slice(0,8).map(item => <li key={item}>{item}</li>)}</ul></div>
              <Link href={`/courses/${program.slug}`}>View Course →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="shell links-section">
        <div><span className="overline">BEFORE ENROLLMENT</span><h2>Useful links</h2></div>
        <div className="link-grid"><Link href="/demo">Demo Class <span>→</span></Link><Link href="/pyq">Previous Papers <span>→</span></Link><Link href="/study">Free Study <span>→</span></Link><Link href="/quizzes">Free Quiz <span>→</span></Link></div>
      </section>

      <style>{`
        .admissions-page{min-height:100vh;background:#fff;color:#142844}.shell{width:min(1100px,calc(100% - 36px));margin:0 auto}.overline{font-size:8px;letter-spacing:.14em;font-weight:850;color:#c62c31}.hero{padding:54px 0;background:#f6f8fb;border-bottom:1px solid #dce3ea}.hero-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:45px;align-items:center}.hero h1,.section h2,.links-section h2{font-family:var(--font-display);color:#15335c;letter-spacing:-.05em}.hero h1{font-size:clamp(42px,5.8vw,66px);line-height:.98;margin:9px 0 14px}.hero p{font-size:12px;line-height:1.7;color:#607187}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:20px}.primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:43px;padding:0 15px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#c62c31;color:#fff}.secondary{background:#fff;border:1px solid #cfd8e2;color:#17385f}.text-link{padding:10px;text-decoration:none;color:#174b80;font-size:9px;font-weight:850}.status-card{background:#fff;border:1px solid #d7dfe8;border-top:4px solid #c62c31;padding:20px}.status-card>span{font-size:7px;letter-spacing:.12em;font-weight:850;color:#c62c31}.status-card h2{font-family:var(--font-display);font-size:23px;line-height:1.08;color:#17375f;margin:9px 0}.status-card p{font-size:9px;line-height:1.6;color:#68798e}.section{padding:60px 0}.section header{margin-bottom:22px}.section h2,.links-section h2{font-size:clamp(30px,4vw,43px);margin-top:5px}.program-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.program-grid article{border:1px solid #d8e0e7;background:#fff}.program-head{display:flex;justify-content:space-between;gap:20px;padding:18px 20px;background:#f7f9fb;border-bottom:1px solid #dfe5eb}.program-head span{font-size:6.5px;letter-spacing:.1em;font-weight:850;color:#c62c31}.program-head h3{font-family:var(--font-display);font-size:24px;color:#17375f;margin-top:4px}.program-head>strong{font-family:var(--font-display);font-size:24px;color:#c62c31}.program-body{padding:18px 20px}.program-body>b{font-size:8px;color:#214b79}.program-body ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:14px}.program-body li{position:relative;padding-left:12px;font-size:8px;line-height:1.45;color:#5d6e83}.program-body li::before{content:'•';position:absolute;left:0;color:#c62c31}.program-grid article>a{display:flex;align-items:center;justify-content:center;min-height:43px;background:#17375f;color:#fff;text-decoration:none;font-size:8px;font-weight:850}.links-section{padding:0 0 60px}.link-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d9e0e7;margin-top:20px}.link-grid a{padding:18px;border-right:1px solid #dfe5eb;text-decoration:none;color:#17375f;font-size:9px;font-weight:850;display:flex;justify-content:space-between}.link-grid a:last-child{border-right:0}@media(max-width:820px){.hero-grid{grid-template-columns:1fr}.status-card{max-width:580px}.program-grid{grid-template-columns:1fr}.link-grid{grid-template-columns:1fr 1fr}.link-grid a:nth-child(2){border-right:0}.link-grid a:nth-child(-n+2){border-bottom:1px solid #dfe5eb}}@media(max-width:560px){.program-body ul{grid-template-columns:1fr}.program-head{flex-direction:column}.hero{padding:42px 0}.link-grid{grid-template-columns:1fr}.link-grid a{border-right:0;border-bottom:1px solid #dfe5eb}.link-grid a:last-child{border-bottom:0}}
      `}</style>
    </main>
  );
}
