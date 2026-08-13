import Link from "next/link";
import { OFFICIAL_LINKS } from "@/lib/coachingData";

const PRELIMS_YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i);
const MAINS_YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

export default function PyqPage() {
  return (
    <main className="pyq-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow">ONESHOT GS · UPSC / BPSC PREVIOUS YEAR PAPERS</span>
            <h1>Read the actual paper. Stay on OneShot GS.</h1>
            <p>Choose a UPSC Prelims year and open the real GS Paper I or CSAT paper in the OneShot GS reader. No reconstructed questions, no generated filler, and no forced redirect away from the site.</p>
            <div className="actions"><a href="#prelims" className="primary">UPSC Prelims Papers</a><a href="#mains" className="secondary">UPSC Mains Archive</a><a href="#bpsc" className="text-link">BPSC Papers →</a></div>
          </div>
          <aside className="archive-note">
            <span>PAPER LIBRARY</span>
            <div><strong>15</strong><p>UPSC Prelims years<br />2012–2026</p></div>
            <div><strong>2</strong><p>papers per year<br />GS I + CSAT</p></div>
            <small>Year pages open inside OneShot GS. Original paper files remain linked to their source.</small>
          </aside>
        </div>
      </section>

      <section id="prelims" className="shell section">
        <header>
          <div><span className="eyebrow">UPSC CIVIL SERVICES PRELIMINARY EXAMINATION</span><h2>Previous 15 years.</h2></div>
          <p>Select a year to open the actual paper reader. Inside each year, switch between General Studies Paper I and CSAT.</p>
        </header>

        <div className="year-grid">
          {PRELIMS_YEARS.map((year) => (
            <Link key={year} href={`/pyq/upsc/prelims/${year}`} className="year-card">
              <div className="year-top"><span>UPSC PRELIMS</span><b>→</b></div>
              <h3>{year}</h3>
              <p>General Studies Paper I</p>
              <p>General Studies Paper II · CSAT</p>
              <strong>View actual papers</strong>
            </Link>
          ))}
        </div>

        <div className="paper-guide">
          <div><span>01</span><b>Choose a year</b><p>Open a dedicated OneShot GS paper page.</p></div>
          <div><span>02</span><b>Switch paper</b><p>Move between GS Paper I and CSAT.</p></div>
          <div><span>03</span><b>Attempt properly</b><p>Use the original paper rather than a recreated question set.</p></div>
          <div><span>04</span><b>Review weak areas</b><p>Move into Free Study, Quiz or Ask Tutor after the attempt.</p></div>
        </div>
      </section>

      <section id="mains" className="mains-wrap">
        <div className="shell section">
          <header className="light">
            <div><span className="eyebrow light-text">UPSC CIVIL SERVICES MAIN EXAMINATION</span><h2>2011–2025 paper archive.</h2></div>
            <p>Essay and General Studies I–IV remain organised by year. Dedicated internal Mains readers can follow the same paper-first format.</p>
          </header>
          <div className="mains-grid">
            {MAINS_YEARS.map((year) => (
              <article key={year}>
                <span>UPSC MAINS</span><h3>{year}</h3><p>Essay · GS I · GS II · GS III · GS IV</p>
                <a href={OFFICIAL_LINKS.upscPyqArchive} target="_blank" rel="noopener noreferrer">Official archive ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="bpsc" className="shell section">
        <header>
          <div><span className="eyebrow">BPSC PREVIOUS YEAR PAPERS</span><h2>Use CCE papers alongside UPSC.</h2></div>
          <p>BPSC preparation remains part of the same PYQ library, with 73rd BPSC as the active complete program.</p>
        </header>
        <div className="bpsc-grid">
          <article><span>PRELIMS</span><h3>BPSC CCE General Studies</h3><p>Work through previous CCE booklets for General Studies, Bihar-specific themes and recurring factual areas.</p><a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">Open BPSC source ↗</a></article>
          <article><span>MAINS</span><h3>Answer-writing paper archive</h3><p>Use previous Mains questions to calibrate demand words, Bihar enrichment and answer depth.</p><a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">Open BPSC source ↗</a></article>
          <article className="course-card"><span>73RD BPSC</span><h3>End-to-end preparation</h3><p>Foundation + Prelims + Mains + Interview · complete guided program.</p><Link href="/courses/bpsc-73">View ₹87,000 Program →</Link></article>
        </div>
      </section>

      <section className="shell final">
        <div><span>PYQ-FIRST PREPARATION</span><h2>Start from the paper, then decide what to revise.</h2><p>Use actual UPSC/BPSC papers to identify gaps before adding more notes or lectures.</p></div>
        <div className="actions"><Link href="/quizzes" className="primary warm">Free Quiz</Link><Link href="/study" className="secondary dark">Free Study</Link></div>
      </section>

      <style>{`
        .pyq-page{min-height:100vh;background:#f5f4f1;color:#172338}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.eyebrow{font-size:7.5px;letter-spacing:.16em;font-weight:850;color:#935036}.light-text{color:#e1b68f}.hero{padding:58px 0 46px;background:#fff;border-bottom:1px solid #d9dde2}.hero-grid{display:grid;grid-template-columns:minmax(0,1.5fr) 280px;gap:50px;align-items:end}.hero h1{font-family:var(--font-display);font-size:clamp(44px,6.5vw,72px);line-height:.94;letter-spacing:-.06em;margin:10px 0 15px;max-width:830px}.hero>div>div>p{max-width:750px;font-size:13px;line-height:1.8;color:#5e6c7c}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:20px}.primary,.secondary{padding:11px 15px;border-radius:5px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#172338;color:#fff}.secondary{background:#fff;border:1px solid #cfd5dc;color:#21324d}.text-link{padding:10px;text-decoration:none;color:#91401f;font-size:9px;font-weight:850}.archive-note{background:#f6f6f3;border:1px solid #d8dce1;border-top:3px solid #8f4528;padding:17px}.archive-note>span{font-size:6.8px;letter-spacing:.14em;color:#8f482c;font-weight:850}.archive-note>div{display:grid;grid-template-columns:60px 1fr;align-items:center;padding:11px 0;border-bottom:1px solid #dedfdd}.archive-note strong{font-family:var(--font-display);font-size:28px}.archive-note p{font-size:8px;line-height:1.45;color:#677483}.archive-note small{display:block;font-size:7px;line-height:1.55;color:#7b8490;margin-top:10px}.section{padding:52px 0}.section header{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:20px}.section header h2,.final h2{font-family:var(--font-display);font-size:clamp(30px,4vw,44px);letter-spacing:-.045em;line-height:1.04;margin-top:7px}.section header>p{max-width:400px;text-align:right;font-size:9.5px;line-height:1.65;color:#687482}.year-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.year-card{background:#fff;border:1px solid #d8dce1;padding:14px;text-decoration:none;color:#172338;min-height:170px;display:flex;flex-direction:column;transition:.14s}.year-card:hover{border-color:#98a5b3;transform:translateY(-2px);box-shadow:0 9px 28px rgba(28,40,56,.07)}.year-top{display:flex;justify-content:space-between;align-items:center}.year-top span{font-size:6.5px;letter-spacing:.1em;color:#8e4b31;font-weight:850}.year-top b{font-size:14px;color:#a2aab3}.year-card h3{font-family:var(--font-display);font-size:27px;margin:9px 0 8px}.year-card p{font-size:7.7px;color:#657281;line-height:1.5}.year-card strong{font-size:8px;color:#8e3f22;margin-top:auto;padding-top:13px}.paper-guide{display:grid;grid-template-columns:repeat(4,1fr);margin-top:18px;border:1px solid #d8dce1;background:#fff}.paper-guide>div{padding:15px;border-right:1px solid #e0e3e7}.paper-guide>div:last-child{border-right:0}.paper-guide span{font-family:Georgia,serif;color:#9a4d2d;font-size:14px}.paper-guide b{display:block;font-size:8.5px;margin:7px 0 3px}.paper-guide p{font-size:7.5px;line-height:1.55;color:#707b88}.mains-wrap{background:#172338;color:#fff}.light>p{color:#bdc8d5!important}.mains-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.mains-grid article{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.035);padding:13px}.mains-grid span{font-size:6.4px;letter-spacing:.1em;color:#e0b58c;font-weight:850}.mains-grid h3{font-family:var(--font-display);font-size:24px;margin:6px 0}.mains-grid p{font-size:7.5px;line-height:1.5;color:#bec9d5;min-height:35px}.mains-grid a{display:inline-block;margin-top:8px;color:#e5b994;text-decoration:none;font-size:7.2px;font-weight:800}.bpsc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.bpsc-grid article{background:#fff;border:1px solid #d8dce1;padding:17px;border-top:3px solid #31445f}.bpsc-grid span{font-size:6.8px;letter-spacing:.11em;color:#955035;font-weight:850}.bpsc-grid h3{font-family:var(--font-display);font-size:19px;margin:8px 0}.bpsc-grid p{font-size:8.5px;line-height:1.65;color:#687482}.bpsc-grid a{display:inline-block;margin-top:12px;text-decoration:none;color:#8e3f22;font-size:8px;font-weight:850}.course-card{background:#f1ede7!important;border-top-color:#9a4625!important}.final{margin-bottom:40px;background:#26364f;color:#fff;padding:27px;display:flex;justify-content:space-between;align-items:center;gap:28px}.final>div:first-child>span{font-size:7px;letter-spacing:.13em;color:#deb48c;font-weight:850}.final p{font-size:9px;line-height:1.6;color:#c5d0dc}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.25)}@media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:25px}.year-grid,.mains-grid{grid-template-columns:repeat(3,1fr)}.section header{flex-direction:column;align-items:flex-start;gap:8px}.section header>p{text-align:left}.paper-guide{grid-template-columns:1fr 1fr}.paper-guide>div:nth-child(2){border-right:0}.paper-guide>div:nth-child(-n+2){border-bottom:1px solid #e0e3e7}.final{flex-direction:column;align-items:flex-start}}@media(max-width:600px){.hero{padding:42px 0 32px}.year-grid,.mains-grid{grid-template-columns:1fr 1fr}.bpsc-grid{grid-template-columns:1fr}.paper-guide{grid-template-columns:1fr}.paper-guide>div{border-right:0;border-bottom:1px solid #e0e3e7}.paper-guide>div:last-child{border-bottom:0}}@media(max-width:380px){.year-grid,.mains-grid{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
