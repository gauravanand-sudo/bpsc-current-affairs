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
        <header><span className="overline">CURRENT PROGRAMS</span><h2>Fees and coverage</h2></header>
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
        .admissions-page{min-height:100vh;background:#fff;color:#26384d;font-family:Arial,"Helvetica Neue",sans-serif}.shell{width:min(1100px,calc(100% - 32px));margin:0 auto}.overline{font-size:10px;letter-spacing:.06em;font-weight:700;color:#d9272e}.hero{padding:32px 0;background:#f5f7fa;border-bottom:1px solid #dce3e9}.hero-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:30px;align-items:center}.hero h1,.section h2,.links-section h2{color:#12345b;font-weight:700}.hero h1{font-size:36px;line-height:1.15;margin:7px 0 9px}.hero p{font-size:13px;line-height:1.6;color:#607083}.actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:15px}.primary,.secondary{display:flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;text-decoration:none;font-size:10px;font-weight:700;border-radius:2px}.primary{background:#d9272e;color:#fff}.secondary{background:#fff;border:1px solid #cad5df;color:#174f86}.text-link{padding:9px;color:#174f86;font-size:10px;font-weight:700}.status-card{background:#fff;border:1px solid #d7dfe7;border-top:3px solid #d9272e;padding:16px}.status-card>span{font-size:9px;letter-spacing:.05em;font-weight:700;color:#d9272e}.status-card h2{font-size:19px;line-height:1.2;color:#12345b;margin:6px 0;font-weight:700}.status-card p{font-size:10px;line-height:1.5;color:#687788}.section{padding:42px 0}.section header{margin-bottom:16px}.section h2,.links-section h2{font-size:27px;margin-top:2px}.program-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.program-grid article{border:1px solid #d8e0e7;background:#fff}.program-head{display:flex;justify-content:space-between;gap:18px;padding:14px 16px;background:#f7f9fb;border-bottom:1px solid #dfe5eb}.program-head span{font-size:9px;letter-spacing:.04em;font-weight:700;color:#d9272e}.program-head h3{font-size:20px;color:#12345b;margin-top:2px;font-weight:700}.program-head>strong{font-size:19px;color:#d9272e;white-space:nowrap}.program-body{padding:15px 16px}.program-body>b{font-size:9px;color:#174f86}.program-body ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px 15px;margin-top:11px}.program-body li{position:relative;padding-left:11px;font-size:9px;line-height:1.4;color:#5d6e80}.program-body li::before{content:'•';position:absolute;left:0;color:#d9272e}.program-grid article>a{display:flex;align-items:center;justify-content:center;min-height:39px;background:#174f86;color:#fff;font-size:9px;font-weight:700}.links-section{padding:0 0 42px}.link-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d9e0e7;margin-top:14px}.link-grid a{padding:14px;border-right:1px solid #dfe5eb;color:#174f86;font-size:10px;font-weight:700;display:flex;justify-content:space-between}.link-grid a:last-child{border-right:0}@media(max-width:820px){.hero-grid{grid-template-columns:1fr}.status-card{max-width:580px}.program-grid{grid-template-columns:1fr}.link-grid{grid-template-columns:1fr 1fr}.link-grid a:nth-child(2){border-right:0}.link-grid a:nth-child(-n+2){border-bottom:1px solid #dfe5eb}}@media(max-width:560px){.hero h1{font-size:29px}.program-body ul{grid-template-columns:1fr}.program-head{flex-direction:column}.link-grid{grid-template-columns:1fr}.link-grid a{border-right:0;border-bottom:1px solid #dfe5eb}.link-grid a:last-child{border-bottom:0}}
      `}</style>
    </main>
  );
}
