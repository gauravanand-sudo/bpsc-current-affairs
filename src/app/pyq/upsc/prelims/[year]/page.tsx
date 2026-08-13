import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpscPrelimsPaper } from "@/lib/upscPrelimsQuestionBank";
import { OFFICIAL_LINKS } from "@/lib/coachingData";

const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export default async function UpscPrelimsYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ paper?: string }>;
}) {
  const { year: rawYear } = await params;
  const { paper } = await searchParams;
  const year = Number(rawYear);
  if (!YEARS.includes(year)) notFound();

  const activePaper: 1 | 2 = paper === "2" ? 2 : 1;
  const currentPaper = getUpscPrelimsPaper(year, activePaper);
  const yearIndex = YEARS.indexOf(year);
  const newerYear = yearIndex > 0 ? YEARS[yearIndex - 1] : null;
  const olderYear = yearIndex < YEARS.length - 1 ? YEARS[yearIndex + 1] : null;

  return (
    <main className="paper-page">
      <section className="head">
        <div className="shell">
          <div className="crumbs"><Link href="/pyq">PYQ Library</Link><span>/</span><b>UPSC Prelims {year}</b></div>
          <div className="title-row">
            <div>
              <span className="eyebrow">UPSC CIVIL SERVICES PRELIMINARY EXAMINATION</span>
              <h1>{year} Prelims</h1>
              <p>Native OneShot GS question reader. Questions and options are rendered as normal web text — no PDF iframe and no external viewer.</p>
            </div>
            <div className="year-nav">
              {newerYear ? <Link href={`/pyq/upsc/prelims/${newerYear}`}>← {newerYear}</Link> : <span />}
              {olderYear ? <Link href={`/pyq/upsc/prelims/${olderYear}`}>{olderYear} →</Link> : <span />}
            </div>
          </div>
          <nav className="tabs" aria-label="Choose UPSC Prelims paper">
            <Link href={`/pyq/upsc/prelims/${year}?paper=1`} className={activePaper === 1 ? "active" : ""}><small>PAPER I</small><b>General Studies</b></Link>
            <Link href={`/pyq/upsc/prelims/${year}?paper=2`} className={activePaper === 2 ? "active" : ""}><small>PAPER II</small><b>CSAT</b></Link>
          </nav>
        </div>
      </section>

      <section className="shell reader">
        <div className="reader-head">
          <div><span>{year} · PAPER {activePaper === 1 ? "I" : "II"}</span><h2>{activePaper === 1 ? "General Studies Paper I" : "General Studies Paper II (CSAT)"}</h2></div>
          <a href={OFFICIAL_LINKS.upscPyqArchive} target="_blank" rel="noopener noreferrer">Verify UPSC source ↗</a>
        </div>

        {currentPaper ? (
          <div className="questions">
            {currentPaper.questions.map((q) => (
              <article key={q.number}>
                <div className="qno">{q.number}</div>
                <div className="qbody">
                  <p className="question">{q.question}</p>
                  <ol type="a">{q.options.map((option) => <li key={option}>{option}</li>)}</ol>
                  {(q.subject || q.topic) && <div className="meta">{q.subject && <span>{q.subject}</span>}{q.topic && <span>{q.topic}</span>}{q.subtopic && <span>{q.subtopic}</span>}</div>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>NATIVE QUESTION DATA NOT IMPORTED YET</span>
            <h2>{year} {activePaper === 1 ? "GS Paper I" : "CSAT"}</h2>
            <p>The broken UPSC iframe has been removed. This page is ready to render the exact paper as native HTML as soon as the authorised PDF source is imported into the OneShot GS question bank.</p>
            <div><Link href="/pyq">Choose another year</Link><a href={OFFICIAL_LINKS.upscPyqArchive} target="_blank" rel="noopener noreferrer">UPSC source ↗</a></div>
          </div>
        )}
      </section>

      <style>{`
        .paper-page{min-height:100vh;background:#f4f3ef;color:#172338}.shell{width:min(980px,calc(100% - 28px));margin:0 auto}.head{background:#fff;border-bottom:1px solid #d8dce2;padding:25px 0 20px}.crumbs{display:flex;gap:7px;align-items:center;font-size:9px;color:#7b8590;margin-bottom:20px}.crumbs a{text-decoration:none;color:#5a6878}.title-row{display:flex;justify-content:space-between;gap:30px;align-items:end}.eyebrow{font-size:7px;letter-spacing:.15em;font-weight:850;color:#98502e}.title-row h1{font-family:var(--font-display);font-size:clamp(38px,6vw,60px);line-height:.94;letter-spacing:-.055em;margin:6px 0 8px}.title-row p{font-size:11px;line-height:1.65;color:#667381;max-width:650px}.year-nav{display:flex;gap:6px}.year-nav a{padding:8px 10px;border:1px solid #d5dae0;border-radius:5px;text-decoration:none;color:#34465c;font-size:8px;font-weight:800}.tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:22px;max-width:560px}.tabs a{display:flex;flex-direction:column;gap:2px;padding:11px 13px;border:1px solid #d6dbe1;border-radius:6px;text-decoration:none;color:#435267;background:#f8f9fa}.tabs small{font-size:6.5px;letter-spacing:.12em}.tabs b{font-size:10px}.tabs a.active{background:#172338;border-color:#172338;color:#fff}.reader{padding:20px 0 50px}.reader-head{display:flex;justify-content:space-between;align-items:center;gap:20px;background:#fff;border:1px solid #d8dce1;border-radius:8px 8px 0 0;padding:14px 16px}.reader-head span{font-size:6.5px;letter-spacing:.12em;font-weight:850;color:#98502e}.reader-head h2{font-family:var(--font-display);font-size:18px;margin-top:2px}.reader-head>a{text-decoration:none;color:#7b4b34;font-size:7.5px;font-weight:800}.questions{background:#fff;border:1px solid #d8dce1;border-top:0}.questions article{display:grid;grid-template-columns:54px 1fr;border-top:1px solid #e7e8e8}.questions article:first-child{border-top:0}.qno{padding:20px 10px;border-right:1px solid #e7e8e8;text-align:center;font-family:Georgia,serif;font-size:16px;color:#914522}.qbody{padding:18px 20px}.question{font-family:Georgia,serif;font-size:15px;line-height:1.65;color:#202b3a}.qbody ol{margin:13px 0 0 20px;display:grid;gap:7px}.qbody li{font-size:12px;line-height:1.55;color:#4d5b6b;padding-left:5px}.meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:14px}.meta span{font-size:7px;padding:4px 6px;background:#f1f3f5;border:1px solid #dce1e5;color:#667381}.empty{background:#fff;border:1px solid #d8dce1;border-top:0;padding:70px 28px;text-align:center}.empty>span{font-size:7px;letter-spacing:.14em;font-weight:850;color:#98502e}.empty h2{font-family:var(--font-display);font-size:30px;margin:8px 0}.empty p{max-width:620px;margin:0 auto;font-size:11px;line-height:1.75;color:#687482}.empty>div{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-top:18px}.empty a{text-decoration:none;padding:9px 11px;background:#172338;color:#fff;border-radius:4px;font-size:8px;font-weight:800}.empty a:last-child{background:#fff;color:#8d4729;border:1px solid #d5d9de}@media(max-width:650px){.title-row{flex-direction:column;align-items:flex-start}.tabs{grid-template-columns:1fr}.reader-head{align-items:flex-start;flex-direction:column}.questions article{grid-template-columns:42px 1fr}.qno{padding:16px 5px}.qbody{padding:15px}.question{font-size:14px}}
      `}</style>
    </main>
  );
}
