import Link from "next/link";
import { OFFICIAL_LINKS } from "@/lib/coachingData";

const PRELIMS_YEARS = Array.from({ length: 13 }, (_, index) => 2026 - index);

export default function PyqPage() {
  return (
    <main className="pyq-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow">ONESHOT GS · UPSC / BPSC PREVIOUS YEAR PAPERS</span>
            <h1>Original papers. Open them directly.</h1>
            <p>Choose any UPSC Prelims year from 2014–2026. The original General Studies Paper I opens immediately in the browser&apos;s full PDF viewer, with a separate download option beside it.</p>
            <div className="actions"><a href="#upsc-prelims" className="primary">UPSC Prelims Papers</a><a href="#bpsc" className="secondary">BPSC PYQs</a></div>
          </div>
          <aside>
            <span>UPSC PRELIMS ARCHIVE</span>
            <strong>13 years</strong>
            <p>2014–2026 · General Studies Paper I</p>
            <small>Original PDFs are stored in the OneShot GS repository and served directly from the OneShot GS domain.</small>
          </aside>
        </div>
      </section>

      <section id="upsc-prelims" className="shell papers">
        <header>
          <div><span className="eyebrow">CIVIL SERVICES PRELIMINARY EXAMINATION</span><h2>Choose a year.</h2></div>
          <p>Click the year or Open PDF to launch the complete paper directly. Use Download PDF when you want an offline copy.</p>
        </header>

        <div className="year-grid">
          {PRELIMS_YEARS.map((year) => {
            const pdfUrl = `/pyq/upsc/prelims/${year}.pdf`;
            const downloadUrl = `/api/pyq/upsc/prelims/${year}/download`;

            return (
              <article key={year} className="year-card">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="paper-link" aria-label={`Open UPSC Prelims ${year} GS Paper I`}>
                  <div className="year-top"><span>UPSC PRELIMS</span><b>GS PAPER I</b></div>
                  <h3>{year}</h3>
                  <p>Original question paper</p>
                </a>
                <div className="card-actions">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="open-paper">Open PDF ↗</a>
                  <a href={downloadUrl} className="download-paper">Download PDF ↓</a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="note">
          <b>Paper-first workflow</b>
          <span>Open the original paper → attempt it under time → identify weak areas → move to Free Study, Free Quiz or Ask Tutor.</span>
        </div>
      </section>

      <section id="bpsc" className="bpsc">
        <div className="shell bpsc-grid">
          <div>
            <span className="eyebrow light">BPSC PREVIOUS YEAR PAPERS</span>
            <h2>BPSC paper library is next.</h2>
            <p>The same direct-paper format will be used for BPSC CCE Prelims and Mains papers so UPSC / BPSC preparation stays inside one library.</p>
          </div>
          <div className="bpsc-actions">
            <a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">BPSC source archive ↗</a>
            <Link href="/courses/bpsc-73">73rd BPSC Complete Program</Link>
          </div>
        </div>
      </section>

      <section className="shell footer-cta">
        <div><span>UPSC / BPSC PREPARATION</span><h2>Paper → diagnosis → revision → retest.</h2></div>
        <div><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link><Link href="/ask" className="warm">Ask Tutor</Link></div>
      </section>

      <style>{`
        .pyq-page{min-height:100vh;background:#f5f4f1;color:#172338}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.eyebrow{font-size:7px;letter-spacing:.15em;font-weight:850;color:#985033}.hero{background:#fff;border-bottom:1px solid #d9dde2;padding:60px 0 48px}.hero-grid{display:grid;grid-template-columns:1fr 285px;gap:55px;align-items:end}.hero h1{font-family:var(--font-display);font-size:clamp(44px,6vw,70px);line-height:.94;letter-spacing:-.06em;margin:10px 0 15px;max-width:800px}.hero p{max-width:750px;font-size:12px;line-height:1.8;color:#617080}.actions{display:flex;gap:8px;margin-top:20px}.actions a{padding:11px 14px;border-radius:4px;text-decoration:none;font-size:8px;font-weight:850}.primary{background:#172338;color:#fff}.secondary{border:1px solid #d3d8de;color:#283b53}.hero aside{border:1px solid #d6dbe0;border-top:3px solid #9a4b2b;background:#f7f7f4;padding:18px}.hero aside>span{font-size:6.5px;letter-spacing:.13em;color:#965035;font-weight:850}.hero aside strong{display:block;font-family:var(--font-display);font-size:34px;margin:10px 0 1px}.hero aside p{font-size:8.5px}.hero aside small{display:block;border-top:1px solid #dedfdd;margin-top:12px;padding-top:10px;font-size:7px;line-height:1.6;color:#76818d}.papers{padding:50px 0}.papers header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:20px}.papers h2,.bpsc h2,.footer-cta h2{font-family:var(--font-display);font-size:clamp(31px,4vw,45px);letter-spacing:-.045em;margin-top:6px}.papers header p{max-width:410px;text-align:right;font-size:9px;line-height:1.65;color:#6e7985}.year-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.year-card{min-height:180px;background:#fff;border:1px solid #d7dce1;display:flex;flex-direction:column;transition:.15s}.year-card:hover{transform:translateY(-2px);border-color:#9aa7b5;box-shadow:0 8px 25px rgba(27,39,54,.07)}.paper-link{padding:14px 14px 10px;text-decoration:none;color:#172338;display:block;flex:1}.year-top{display:flex;justify-content:space-between;gap:8px}.year-top span,.year-top b{font-size:6px;letter-spacing:.09em}.year-top span{color:#965034}.year-top b{color:#7a8591}.paper-link h3{font-family:var(--font-display);font-size:32px;letter-spacing:-.04em;margin:15px 0 3px}.paper-link p{font-size:8px;color:#707b87}.card-actions{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #e1e4e7}.card-actions a{padding:10px 8px;text-align:center;text-decoration:none;font-size:7px;font-weight:850}.open-paper{color:#fff;background:#1c2d45}.download-paper{color:#8d4327;background:#f7f4ef;border-left:1px solid #e1e4e7}.note{margin-top:16px;background:#fff;border:1px solid #d7dce1;padding:13px 15px;display:flex;gap:12px;align-items:center}.note b{font-size:8px;white-space:nowrap}.note span{font-size:8px;line-height:1.55;color:#6c7783}.bpsc{background:#1b2b43;color:#fff;padding:43px 0}.bpsc-grid{display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px}.light{color:#ddb18b}.bpsc p{max-width:660px;font-size:9.5px;line-height:1.7;color:#c2ccd7}.bpsc-actions{display:flex;flex-direction:column;gap:7px}.bpsc-actions a{min-width:210px;padding:10px 12px;text-align:center;text-decoration:none;background:#fff;color:#283b52;border-radius:4px;font-size:8px;font-weight:850}.bpsc-actions a:first-child{background:transparent;color:#e2b48f;border:1px solid rgba(255,255,255,.2)}.footer-cta{margin-top:38px;margin-bottom:38px;background:#fff;border:1px solid #d7dce1;padding:25px;display:flex;justify-content:space-between;align-items:center;gap:25px}.footer-cta>div:first-child>span{font-size:6.5px;letter-spacing:.13em;color:#955037;font-weight:850}.footer-cta>div:last-child{display:flex;gap:6px;flex-wrap:wrap}.footer-cta a{padding:9px 10px;background:#1b2b43;color:#fff;text-decoration:none;border-radius:4px;font-size:7.5px;font-weight:850}.footer-cta .warm{background:#a24a27}@media(max-width:900px){.hero-grid{grid-template-columns:1fr}.hero aside{max-width:360px}.year-grid{grid-template-columns:repeat(3,1fr)}.papers header{align-items:flex-start;flex-direction:column;gap:8px}.papers header p{text-align:left}.bpsc-grid{grid-template-columns:1fr}.bpsc-actions{align-items:flex-start}.footer-cta{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.hero{padding:42px 0 34px}.year-grid{grid-template-columns:1fr 1fr}.year-card{min-height:165px}.note{align-items:flex-start;flex-direction:column}.bpsc-actions a{min-width:0;width:100%}.card-actions{grid-template-columns:1fr}.download-paper{border-left:0;border-top:1px solid #e1e4e7}}@media(max-width:360px){.year-grid{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
