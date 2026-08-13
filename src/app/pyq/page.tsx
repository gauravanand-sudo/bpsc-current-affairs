import Link from "next/link";
import { OFFICIAL_LINKS } from "@/lib/coachingData";

const PRELIMS_YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i);
const MAINS_YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

const PRELIMS_TAXONOMY = [
  ["Polity & Governance", "Constitution · Parliament · Judiciary · Federalism · Local Government · Bodies · Rights · Governance"],
  ["History & Culture", "Ancient · Medieval · Modern · Freedom Struggle · Art & Culture · Religion · Literature"],
  ["Geography", "Physical · Indian · World · Mapping · Resources · Climatology · Oceanography"],
  ["Economy", "Macro · Banking · Inflation · Fiscal Policy · External Sector · Infrastructure · Agriculture"],
  ["Environment", "Ecology · Biodiversity · Protected Areas · Climate · Pollution · Conservation · Species"],
  ["Science & Technology", "Space · Biotechnology · Health · IT · Defence Tech · Energy · Emerging Technology"],
  ["International Relations", "Institutions · Groupings · Treaties · Neighbourhood · Global Governance"],
  ["Question Skill", "Statement logic · Pair matching · Chronology · Mapping · Elimination · Factual recall"],
];

const MAINS_TAXONOMY = [
  ["Essay", "Philosophical · Social · Political · Economic · Science/Technology · Environment · Governance"],
  ["GS I", "History · Culture · Society · Geography"],
  ["GS II", "Constitution · Governance · Social Justice · International Relations"],
  ["GS III", "Economy · Agriculture · Science & Technology · Environment · Security · Disaster Management"],
  ["GS IV", "Ethics · Integrity · Aptitude · Probity · Case Studies"],
  ["Demand Type", "Discuss · Examine · Analyse · Evaluate · Critically Examine · Comment · Explain · Illustrate"],
];

function PrelimsYearGrid() {
  return (
    <div className="year-grid">
      {PRELIMS_YEARS.map(year => (
        <Link key={year} href={`/pyq/upsc/prelims/${year}`} className="year-card">
          <span>UPSC PRELIMS</span>
          <h3>{year}</h3>
          <p>GS Paper I · 100-question on-site desk</p>
          <b>Open {year} Questions →</b>
        </Link>
      ))}
    </div>
  );
}

function MainsYearGrid() {
  return (
    <div className="year-grid mains-years">
      {MAINS_YEARS.map(year => (
        <article key={year} className="year-card">
          <span>UPSC MAINS</span>
          <h3>{year}</h3>
          <p>Essay · GS I · GS II · GS III · GS IV</p>
          <small>On-site year pages are being structured next.</small>
        </article>
      ))}
    </div>
  );
}

export default function PyqPage() {
  return (
    <main className="pyq-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">UPSC / BPSC PYQ INTELLIGENCE DESK</span>
            <h1>Click a year. Study the questions without leaving OneShot GS.</h1>
            <p>The UPSC Prelims archive is now an on-site year-by-year study system. Every year card opens a OneShot GS question page with 100 study entries, subject/topic tags, question-skill classification and revision links.</p>
            <div className="actions"><a href="#prelims" className="primary">UPSC Prelims 15 Years</a><a href="#mains" className="secondary">UPSC Mains</a><a href="#bpsc" className="text-link">BPSC PYQs →</a></div>
          </div>
          <aside className="source-card">
            <span>ON-SITE FIRST</span>
            <h2>Year cards stay on OneShot GS.</h2>
            <p>The Commission link is now only a secondary verification source. Students do not leave the site just to browse a year.</p>
            <a href={OFFICIAL_LINKS.upscPyqArchive} target="_blank" rel="noopener noreferrer">Verify UPSC source ↗</a>
            <a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">Verify BPSC source ↗</a>
          </aside>
        </div>
      </section>

      <section className="method-strip"><div className="shell"><article><b>01</b><span>Choose year</span><p>Open a year directly on OneShot GS.</p></article><article><b>02</b><span>Read questions</span><p>Work through the on-site question desk.</p></article><article><b>03</b><span>Tag weakness</span><p>Subject → topic → question skill.</p></article><article><b>04</b><span>Revise</span><p>Jump into the relevant free-study room.</p></article><article><b>05</b><span>Retest</span><p>Use Free Quiz to verify correction.</p></article></div></section>

      <section id="prelims" className="shell section">
        <header><div><span className="overline">UPSC PRELIMS · 15 YEARS</span><h2>2012–2026. Every year opens inside OneShot GS.</h2></div><p>Tap any year below. You will stay on the OneShot GS domain and enter that year’s dedicated question page.</p></header>
        <PrelimsYearGrid />

        <div className="taxonomy">
          <div className="tax-head"><span className="overline">INTELLIGENT CLASSIFICATION</span><h2>Questions are not just numbered. They are mapped.</h2></div>
          <div className="tax-grid">{PRELIMS_TAXONOMY.map(([title, copy]) => <article key={title}><b>{title}</b><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section id="mains" className="mains-wrap">
        <div className="shell section">
          <header className="light"><div><span className="overline light-text">UPSC MAINS · 15 COMPLETED YEARS</span><h2>2011–2025 Essay + GS I–IV.</h2></div><p>The Mains archive remains categorised here while dedicated on-site year pages are structured in the same pattern as Prelims.</p></header>
          <MainsYearGrid />
          <div className="taxonomy dark-tax"><div className="tax-head"><span className="overline light-text">MAINS TAXONOMY</span><h2>Paper + syllabus unit + command word.</h2></div><div className="tax-grid">{MAINS_TAXONOMY.map(([title, copy]) => <article key={title}><b>{title}</b><p>{copy}</p></article>)}</div></div>
        </div>
      </section>

      <section id="bpsc" className="shell section">
        <header><div><span className="overline">BPSC PYQ DESK</span><h2>BPSC remains alongside UPSC.</h2></div><p>The 73rd BPSC preparation layer uses previous CCE papers for Bihar-specific themes, General Studies pattern analysis and Mains demand mapping.</p></header>
        <div className="bpsc-grid"><article><span>PRELIMS</span><h3>General Studies + Bihar focus</h3><p>History, Geography, Polity, Economy, Science, Current Affairs and Bihar-specific themes.</p><a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">Verify BPSC booklets ↗</a></article><article><span>MAINS</span><h3>Demand + Bihar enrichment</h3><p>Directive, syllabus unit, Bihar relevance, data/examples and answer structure.</p><Link href="/courses/bpsc-73">73rd BPSC Program →</Link></article><article><span>FREE PRACTICE</span><h3>Turn PYQs into a revision loop</h3><p>Attempt → classify → revise → practise → retest.</p><Link href="/quizzes/pyq">Open PYQ Practice →</Link></article></div>
      </section>

      <section className="shell final-cta"><div><span className="overline light-text">PYQ-LED UPSC / BPSC PREPARATION</span><h2>The paper should become your syllabus filter.</h2><p>Start with any UPSC Prelims year above. You now stay on OneShot GS from year selection through question-by-question study.</p></div><div className="actions"><Link href="/quizzes/pyq" className="primary warm">PYQ Practice →</Link><Link href="/courses" className="secondary dark">View Courses</Link></div></section>

      <style>{`
        .pyq-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#98502e}.light-text{color:#e1b68f}.hero{padding:61px 0 47px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.hero-grid{display:grid;grid-template-columns:minmax(0,1.45fr) 310px;gap:48px;align-items:end}.hero h1{font-family:var(--font-display);font-size:clamp(43px,6vw,70px);line-height:.95;letter-spacing:-.06em;margin:10px 0 15px;max-width:850px}.hero p{font-size:13px;line-height:1.8;color:#596676;max-width:740px}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:20px}.primary,.secondary{padding:11px 15px;border-radius:6px;text-decoration:none;font-size:10px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d0d6dd;color:#21324d}.text-link{padding:10px;text-decoration:none;color:#91401f;font-size:10px;font-weight:850}.source-card{background:#fff;border:1px solid #d1d2cf;border-top:4px solid #9f3e1b;padding:18px}.source-card>span{font-size:7px;letter-spacing:.14em;color:#98502e;font-weight:850}.source-card h2{font-family:var(--font-display);font-size:21px;line-height:1.1;margin:8px 0}.source-card p{font-size:8.5px;line-height:1.6;color:#6d7885}.source-card a{display:block;margin-top:8px;text-decoration:none;color:#8f3f20;font-size:8px;font-weight:850}.method-strip{background:#172338;color:#fff}.method-strip>div{display:grid;grid-template-columns:repeat(5,1fr)}.method-strip article{padding:17px;border-right:1px solid rgba(255,255,255,.12)}.method-strip article:last-child{border-right:0}.method-strip b{font-family:Georgia,serif;color:#d8a877;font-size:17px}.method-strip span{display:block;font-family:var(--font-display);font-size:13px;margin:4px 0}.method-strip p{font-size:7.8px;line-height:1.5;color:#c6d0db}.section{padding:53px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:22px}.section header h2,.tax-head h2,.final-cta h2{font-family:var(--font-display);font-size:clamp(29px,4vw,43px);line-height:1.04;letter-spacing:-.045em;margin-top:7px}.section header>p{max-width:420px;text-align:right;font-size:10px;line-height:1.65;color:#687482}.year-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.year-card{display:block;background:#fff;border:1px solid #d9d6cf;padding:14px;text-decoration:none;color:#172338;transition:.15s}.year-card:hover{transform:translateY(-2px);border-color:#a9b2bd;box-shadow:0 8px 24px rgba(27,41,59,.07)}.year-card span{font-size:6.5px;letter-spacing:.1em;color:#99502e;font-weight:850}.year-card h3{font-family:var(--font-display);font-size:25px;margin:4px 0}.year-card p{font-size:7.8px;color:#6d7885;min-height:27px}.year-card b{display:block;margin-top:9px;font-size:7.8px;color:#8f3f20}.year-card small{display:block;margin-top:9px;font-size:7.2px;color:#8a939d}.taxonomy{margin-top:28px;padding:22px;background:#fff;border:1px solid #d8d5cf}.tax-head{margin-bottom:15px}.tax-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.tax-grid article{padding:12px;background:#f5f3ee;border:1px solid #e1ded7}.tax-grid b{font-size:8.5px}.tax-grid p{font-size:7.8px;line-height:1.55;color:#687482;margin-top:4px}.mains-wrap{background:#172338;color:#fff}.light>p{color:#c6d0dc!important}.mains-years .year-card{background:rgba(255,255,255,.045);border-color:rgba(255,255,255,.14);color:#fff}.mains-years .year-card span{color:#e1b68f}.mains-years .year-card p,.mains-years .year-card small{color:#b9c5d2}.dark-tax{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.14)}.dark-tax .tax-grid article{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1)}.dark-tax .tax-grid p{color:#bec9d5}.bpsc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.bpsc-grid article{background:#fff;border:1px solid #d8d5cf;border-top:3px solid #31445f;padding:17px}.bpsc-grid span{font-size:7px;letter-spacing:.1em;color:#99502e;font-weight:850}.bpsc-grid h3{font-family:var(--font-display);font-size:18px;margin:7px 0}.bpsc-grid p{font-size:8.5px;line-height:1.65;color:#687482}.bpsc-grid a{display:inline-block;margin-top:12px;text-decoration:none;color:#8f3f20;font-size:8px;font-weight:850}.final-cta{margin-bottom:42px;padding:28px;background:#26364f;color:#fff;display:flex;justify-content:space-between;gap:28px;align-items:center}.final-cta p{font-size:9.5px;color:#c7d1dd;max-width:650px}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.24)}@media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:24px}.year-grid{grid-template-columns:repeat(3,1fr)}.section header{flex-direction:column;align-items:flex-start;gap:8px}.section header>p{text-align:left}.final-cta{flex-direction:column;align-items:flex-start}}@media(max-width:640px){.method-strip>div{grid-template-columns:1fr 1fr}.year-grid{grid-template-columns:repeat(2,1fr)}.tax-grid,.bpsc-grid{grid-template-columns:1fr}.hero{padding:42px 0 32px}.final-cta{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
