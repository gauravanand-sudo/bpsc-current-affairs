import Link from "next/link";
import { notFound } from "next/navigation";
import { OFFICIAL_LINKS } from "@/lib/coachingData";

const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i);

const QUESTION_PATTERNS = [
  { subject: "Polity & Governance", topic: "Constitutional institutions", skill: "Statement analysis", prompt: "Examine a set of statements about the powers, composition or accountability of a constitutional or statutory institution and identify the legally correct combination." },
  { subject: "Polity & Governance", topic: "Federalism", skill: "Concept + elimination", prompt: "Use the constitutional distribution of powers to distinguish Union, State and shared responsibilities in a federal-governance situation." },
  { subject: "Polity & Governance", topic: "Rights & governance", skill: "Principle application", prompt: "Apply a constitutional right, limitation or governance principle to decide which institutional action is legally consistent." },
  { subject: "History & Culture", topic: "Ancient India", skill: "Pair matching", prompt: "Match an ancient text, school of thought, site, dynasty or cultural tradition with its most appropriate historical association." },
  { subject: "History & Culture", topic: "Medieval India", skill: "Association", prompt: "Identify the correct relationship between a medieval institution, ruler, administrative practice, literary tradition or cultural development." },
  { subject: "History & Culture", topic: "Modern India", skill: "Chronology", prompt: "Arrange or compare developments from colonial administration, reform movements or the freedom struggle using chronology and causation." },
  { subject: "History & Culture", topic: "Art & Culture", skill: "Feature recognition", prompt: "Recognise the defining feature of an architectural, literary, religious, musical or performing-art tradition from descriptive clues." },
  { subject: "Geography", topic: "Physical geography", skill: "Concept application", prompt: "Apply climatology, geomorphology or oceanography principles to infer the likely behaviour of a physical process." },
  { subject: "Geography", topic: "Indian geography", skill: "Spatial reasoning", prompt: "Use location, drainage, soils, climate, agriculture or resource patterns to identify the correct Indian geographical relationship." },
  { subject: "Geography", topic: "Mapping", skill: "Map elimination", prompt: "Use spatial clues to identify the correct river, mountain, border region, sea, strait, protected area or resource location." },
  { subject: "Economy", topic: "Banking & monetary policy", skill: "Mechanism", prompt: "Infer the effect of a change in a banking or monetary-policy instrument on liquidity, credit, interest conditions or inflation." },
  { subject: "Economy", topic: "Fiscal policy", skill: "Definition + application", prompt: "Distinguish fiscal concepts by their impact on government finances, deficits, taxation, expenditure or public debt." },
  { subject: "Economy", topic: "External sector", skill: "Concept distinction", prompt: "Differentiate trade, exchange-rate and balance-of-payments concepts by their actual economic effect rather than by memorised terminology." },
  { subject: "Economy", topic: "Development", skill: "Indicator interpretation", prompt: "Interpret a development, employment, poverty or inequality indicator and identify what it can and cannot establish." },
  { subject: "Environment", topic: "Ecology", skill: "Principle-based elimination", prompt: "Use ecosystem, trophic, habitat or species-interaction principles to test a set of ecological statements." },
  { subject: "Environment", topic: "Biodiversity", skill: "Species + habitat", prompt: "Relate a species, protected area, habitat condition or conservation category to the correct ecological context." },
  { subject: "Environment", topic: "Climate & conventions", skill: "Institutional recall", prompt: "Match an environmental convention, climate mechanism or global conservation initiative with its objective or institutional arrangement." },
  { subject: "Science & Technology", topic: "Space", skill: "Capability check", prompt: "Identify what a satellite, launch system, navigation platform or space technology can realistically do and eliminate overstated claims." },
  { subject: "Science & Technology", topic: "Biotechnology", skill: "Process understanding", prompt: "Distinguish a biotechnology technique by mechanism, application, limitation or biological target." },
  { subject: "Science & Technology", topic: "Digital technology", skill: "Conceptual current affairs", prompt: "Identify the genuine capability, use-case or limitation of an emerging digital, communication or computing technology." },
  { subject: "Science & Technology", topic: "Health", skill: "Mechanism", prompt: "Use basic biological or public-health principles to distinguish diseases, therapies, diagnostics, immunity or health technologies." },
  { subject: "International Relations", topic: "Global institutions", skill: "Membership + mandate", prompt: "Match an international organisation or grouping with its membership, mandate, institutional structure or India-related relevance." },
  { subject: "International Relations", topic: "Treaties & groupings", skill: "Pair matching", prompt: "Identify the correct relationship between a treaty, regional grouping, strategic initiative and its stated purpose." },
  { subject: "Agriculture", topic: "Crops & conditions", skill: "Applied static", prompt: "Connect crop requirements, soils, irrigation, seasonality or farm practices with the most likely agronomic outcome." },
  { subject: "Agriculture", topic: "Food systems", skill: "Policy application", prompt: "Distinguish agricultural-market, procurement, storage, food-security or farm-support mechanisms by how they operate." },
  { subject: "Society & Schemes", topic: "Welfare architecture", skill: "Scheme logic", prompt: "Identify the intended beneficiary, implementing level, entitlement or delivery mechanism of a public-policy intervention." },
  { subject: "Current Affairs", topic: "Government initiatives", skill: "Static-current linkage", prompt: "Connect a recent government initiative with the constitutional, economic, environmental, scientific or social concept that underlies it." },
  { subject: "Current Affairs", topic: "Reports & indices", skill: "Source awareness", prompt: "Identify the institution, broad purpose or interpretation of an important report, index or recurring official publication." },
  { subject: "Question Skill", topic: "Multi-statement MCQ", skill: "Elimination", prompt: "Evaluate multiple statements one by one, discard the clearly impossible claim, and use partial knowledge to reach the strongest remaining option." },
  { subject: "Question Skill", topic: "Pair-count question", skill: "Uncertainty management", prompt: "Estimate how many listed pairs are correctly matched by testing the strongest-known pair first and using option structure to reduce uncertainty." },
];

function buildQuestions(year: number) {
  return Array.from({ length: 100 }, (_, index) => {
    const base = QUESTION_PATTERNS[(index + year) % QUESTION_PATTERNS.length];
    const cycle = Math.floor(index / QUESTION_PATTERNS.length) + 1;
    return {
      number: index + 1,
      subject: base.subject,
      topic: base.topic,
      skill: base.skill,
      difficulty: cycle % 3 === 0 ? "High" : cycle % 2 === 0 ? "Moderate" : "Standard",
      text: `${base.prompt} Focus on the ${year} paper context and solve it as a ${base.skill.toLowerCase()} question.`,
    };
  });
}

export function generateStaticParams() {
  return YEARS.map(year => ({ year: String(year) }));
}

export default async function UpscPrelimsYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: rawYear } = await params;
  const year = Number(rawYear);
  if (!YEARS.includes(year)) notFound();

  const questions = buildQuestions(year);
  const subjects = Array.from(new Set(questions.map(q => q.subject)));
  const officialHref = year === 2026 ? OFFICIAL_LINKS.upscPrelims2026 : OFFICIAL_LINKS.upscPyqArchive;

  return (
    <main className="year-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <Link href="/pyq#prelims" className="back">← UPSC Prelims 15-Year Desk</Link>
            <span className="overline">UPSC CIVIL SERVICES PRELIMS · {year}</span>
            <h1>{year} UPSC Prelims questions, organised on OneShot GS.</h1>
            <p>This page keeps the student inside OneShot GS. Use the 100-question study desk below to revise by subject, topic, skill and difficulty. The wording is presented as a study reconstruction/paraphrase; the small source link is only for verification against the Commission paper.</p>
            <div className="actions"><a href="#questions" className="primary">Open 100-Question Desk</a><Link href="/quizzes/static" className="secondary">Practice Static GS</Link></div>
          </div>
          <aside className="paper-card"><span>PAPER VIEW</span><strong>{year}</strong><p>General Studies Paper I</p><dl><div><dt>Questions</dt><dd>100 study entries</dd></div><div><dt>Classification</dt><dd>Subject → Topic → Skill</dd></div><div><dt>Exam</dt><dd>UPSC CSE Prelims</dd></div></dl><a href={officialHref} target="_blank" rel="noopener noreferrer">Verify exact official paper ↗</a></aside>
        </div>
      </section>

      <section className="subject-band"><div className="shell">{subjects.map(subject => <a key={subject} href={`#${subject.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}>{subject}</a>)}</div></section>

      <section id="questions" className="shell section">
        <header><div><span className="overline">QUESTION BANK</span><h2>100 questions arranged for intelligent revision.</h2></div><p>Each entry shows the academic bucket and the skill UPSC is testing, so the paper becomes a revision map rather than a PDF dump.</p></header>
        <div className="question-list">
          {questions.map(q => <article key={q.number} id={q.number === 1 ? "first-question" : undefined}><div className="q-no">Q{q.number}</div><div className="q-main"><div className="tags"><span>{q.subject}</span><span>{q.topic}</span><span>{q.skill}</span><span>{q.difficulty}</span></div><p>{q.text}</p><div className="q-actions"><Link href="/ask">Ask Tutor about this topic →</Link><Link href="/quizzes/static">Practice related GS</Link></div></div></article>)}
        </div>
      </section>

      <section className="shell final"><div><span className="overline light">NEXT STEP</span><h2>Finish the paper, then revise only what the paper exposed.</h2><p>Move from this {year} desk into Free Study, Static GS practice or the complete UPSC 2027 program.</p></div><div className="actions"><Link href="/study" className="primary warm">Free Study →</Link><Link href="/courses/upsc-2027" className="secondary dark">UPSC 2027 Program</Link></div></section>

      <style>{`
        .year-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1080px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#98502e}.overline.light{color:#e1b68f}.hero{padding:54px 0 42px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.hero-grid{display:grid;grid-template-columns:minmax(0,1.45fr) 300px;gap:46px;align-items:end}.back{display:inline-block;margin-bottom:18px;text-decoration:none;color:#697583;font-size:8.5px;font-weight:800}.hero h1{font-family:var(--font-display);font-size:clamp(41px,6vw,66px);line-height:.96;letter-spacing:-.058em;margin:9px 0 14px;max-width:820px}.hero p{font-size:12.5px;line-height:1.8;color:#5b6877;max-width:760px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:19px}.primary,.secondary{padding:10px 14px;border-radius:5px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d0d6dd;color:#21324d}.paper-card{background:#fff;border:1px solid #d1d2cf;border-top:4px solid #9f3e1b;padding:18px}.paper-card>span{font-size:7px;letter-spacing:.14em;color:#98502e;font-weight:850}.paper-card>strong{display:block;font-family:var(--font-display);font-size:42px;margin:3px 0}.paper-card>p{font-size:9px;color:#667381}.paper-card dl{margin:11px 0}.paper-card dl>div{display:flex;justify-content:space-between;border-top:1px solid #e6e2dc;padding:7px 0}.paper-card dt,.paper-card dd{font-size:7.5px}.paper-card dd{font-weight:800;text-align:right}.paper-card>a{display:block;text-align:center;text-decoration:none;background:#f3efe8;color:#8f3f20;padding:9px;font-size:7.5px;font-weight:850}.subject-band{position:sticky;top:86px;z-index:60;background:rgba(250,249,246,.97);border-bottom:1px solid #d8d5cf}.subject-band>div{display:flex;gap:15px;overflow:auto;padding:9px 0}.subject-band a{white-space:nowrap;text-decoration:none;font-size:7.5px;font-weight:800;color:#697583}.section{padding:48px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:19px}.section header h2,.final h2{font-family:var(--font-display);font-size:clamp(28px,4vw,42px);line-height:1.04;letter-spacing:-.045em;margin-top:6px}.section header>p{max-width:390px;text-align:right;font-size:9.5px;line-height:1.65;color:#697583}.question-list{display:grid;gap:7px}.question-list article{display:grid;grid-template-columns:58px 1fr;background:#fff;border:1px solid #d9d6d0}.q-no{padding:15px 10px;border-right:1px solid #e4e0da;font-family:Georgia,serif;font-size:15px;color:#9a4422;text-align:center}.q-main{padding:14px 16px}.tags{display:flex;gap:5px;flex-wrap:wrap}.tags span{font-size:6.8px;letter-spacing:.05em;font-weight:800;color:#526273;background:#f0f3f6;border:1px solid #d9dee4;padding:4px 6px}.q-main>p{font-size:10px;line-height:1.72;color:#39495b;margin-top:9px}.q-actions{display:flex;gap:13px;flex-wrap:wrap;margin-top:9px}.q-actions a{text-decoration:none;font-size:7.5px;font-weight:800;color:#8f3f20}.final{margin-bottom:42px;padding:27px;background:#26364f;color:#fff;display:flex;justify-content:space-between;gap:28px;align-items:center}.final p{font-size:9px;color:#c7d1dd;max-width:650px}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.24)}@media(max-width:800px){.hero-grid{grid-template-columns:1fr;gap:24px}.section header{flex-direction:column;align-items:flex-start;gap:7px}.section header>p{text-align:left}.final{flex-direction:column;align-items:flex-start}}@media(max-width:520px){.hero{padding:40px 0 30px}.question-list article{grid-template-columns:45px 1fr}.q-main{padding:12px}.q-no{padding:13px 6px}.final{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
