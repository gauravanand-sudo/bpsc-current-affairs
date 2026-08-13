import Link from "next/link";
import { notFound } from "next/navigation";
import { getUpscPrelimsPaper, UPSC_PRELIMS_AVAILABLE_YEARS } from "@/lib/upscPrelimsQuestionBank";

export const dynamic = "force-dynamic";

export default async function UpscPrelimsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: rawYear } = await params;
  const year = Number(rawYear);
  if (!UPSC_PRELIMS_AVAILABLE_YEARS.includes(year)) notFound();

  const currentPaper = await getUpscPrelimsPaper(year, 1);
  const yearIndex = UPSC_PRELIMS_AVAILABLE_YEARS.indexOf(year);
  const newerYear = yearIndex > 0 ? UPSC_PRELIMS_AVAILABLE_YEARS[yearIndex - 1] : null;
  const olderYear = yearIndex < UPSC_PRELIMS_AVAILABLE_YEARS.length - 1 ? UPSC_PRELIMS_AVAILABLE_YEARS[yearIndex + 1] : null;

  return (
    <main className="paper-page">
      <section className="paper-head">
        <div className="shell">
          <div className="crumbs">
            <Link href="/pyq">PYQ Library</Link><span>/</span><span>UPSC</span><span>/</span><b>{year}</b>
          </div>

          <div className="head-grid">
            <div>
              <span className="eyebrow">UPSC CIVIL SERVICES PRELIMINARY EXAMINATION</span>
              <h1>{year} General Studies Paper I</h1>
              <p>The actual paper rendered as readable web text on OneShot GS. No PDF embed, no reconstructed questions, no redirect while studying.</p>
            </div>
            <aside>
              <div><strong>{currentPaper?.questions.length ?? "—"}</strong><span>questions loaded</span></div>
              <div><strong>200</strong><span>maximum marks</span></div>
              <div><strong>2 hrs</strong><span>paper duration</span></div>
            </aside>
          </div>

          <div className="paper-strip">
            <div><span>PAPER</span><b>General Studies · Paper I</b></div>
            <div><span>FORMAT</span><b>Objective · Four options</b></div>
            <div><span>NEGATIVE MARKING</span><b>⅓ of marks for a wrong answer</b></div>
            <div className="year-nav">
              {olderYear ? <Link href={`/pyq/upsc/prelims/${olderYear}`}>← {olderYear}</Link> : <span />}
              {newerYear ? <Link href={`/pyq/upsc/prelims/${newerYear}`}>{newerYear} →</Link> : <span />}
            </div>
          </div>
        </div>
      </section>

      <section className="shell reader">
        {currentPaper ? (
          <>
            <div className="reader-title">
              <div><span>QUESTION PAPER</span><h2>Questions 1–{currentPaper.questions.length}</h2></div>
              <p>Read in sequence as you would attempt the actual paper. Subject-wise intelligence and explanations can sit on top of this exact-question layer without altering the paper.</p>
            </div>

            <div className="questions">
              {currentPaper.questions.map((q) => (
                <article id={`q-${q.number}`} key={q.number}>
                  <div className="q-index">
                    <span>Q.</span>
                    <strong>{q.number}</strong>
                  </div>
                  <div className="q-content">
                    <p className="question">{q.question}</p>
                    <ol className="options">
                      {q.options.map((option, index) => (
                        <li key={`${q.number}-${index}`}>
                          <span>{String.fromCharCode(65 + index)}</span>
                          <p>{option}</p>
                        </li>
                      ))}
                    </ol>
                    {(q.subject || q.topic) && (
                      <div className="meta">
                        {q.subject && <span>{q.subject}</span>}
                        {q.topic && <span>{q.topic}</span>}
                        {q.subtopic && <span>{q.subtopic}</span>}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="after-paper">
              <div><span>FINISHED THE PAPER?</span><h2>Use mistakes to decide what you revise next.</h2><p>Move from the PYQ into Free Study or practice instead of adding another random source.</p></div>
              <div><Link href="/quizzes">Free Quiz</Link><Link href="/study">Free Study</Link><Link href="/ask" className="warm">Ask Tutor</Link></div>
            </div>
          </>
        ) : (
          <div className="load-error">
            <span>PAPER DATA TEMPORARILY UNAVAILABLE</span>
            <h2>{year} GS Paper I</h2>
            <p>The native reader could not load this paper right now. Please refresh once; the page does not fall back to a broken external PDF embed.</p>
            <Link href="/pyq">Back to PYQ Library</Link>
          </div>
        )}
      </section>

      <style>{`
        .paper-page{min-height:100vh;background:#f3f2ee;color:#162236}.shell{width:min(980px,calc(100% - 28px));margin:0 auto}.paper-head{background:#fff;border-bottom:1px solid #d9dde1;padding:27px 0 0}.crumbs{display:flex;align-items:center;gap:7px;color:#828b95;font-size:8px;margin-bottom:22px}.crumbs a{color:#596879;text-decoration:none}.crumbs b{color:#1a2b42}.head-grid{display:grid;grid-template-columns:1fr 245px;gap:42px;align-items:end}.eyebrow,.reader-title span,.after-paper>div:first-child>span,.load-error>span{font-size:7px;letter-spacing:.15em;font-weight:850;color:#93482b}.head-grid h1{font-family:var(--font-display);font-size:clamp(38px,5.8vw,61px);letter-spacing:-.055em;line-height:.96;margin:7px 0 10px;max-width:720px}.head-grid>div>p{font-size:10.5px;line-height:1.7;color:#667381;max-width:690px}.head-grid aside{border:1px solid #d9dde1;display:grid;grid-template-columns:repeat(3,1fr);background:#f7f7f5}.head-grid aside div{padding:13px 8px;border-right:1px solid #d9dde1;text-align:center}.head-grid aside div:last-child{border-right:0}.head-grid aside strong{display:block;font-family:var(--font-display);font-size:18px}.head-grid aside span{display:block;font-size:6.5px;line-height:1.35;color:#75808d;margin-top:2px}.paper-strip{display:grid;grid-template-columns:1.15fr 1fr 1.25fr auto;margin-top:24px;border-top:1px solid #e0e3e6}.paper-strip>div{padding:11px 13px;border-right:1px solid #e0e3e6}.paper-strip>div:first-child{padding-left:0}.paper-strip span{display:block;font-size:5.8px;letter-spacing:.11em;color:#8b6a58;font-weight:800}.paper-strip b{display:block;font-size:7.7px;margin-top:3px}.year-nav{display:flex;align-items:center;gap:5px!important;padding-right:0!important}.year-nav a{border:1px solid #d6dbe0;border-radius:4px;padding:7px 8px;color:#33465d;text-decoration:none;font-size:7px;font-weight:850}.reader{padding:25px 0 50px}.reader-title{display:flex;justify-content:space-between;align-items:end;gap:35px;padding:0 2px 14px}.reader-title h2{font-family:var(--font-display);font-size:25px;letter-spacing:-.035em;margin-top:4px}.reader-title>p{max-width:430px;text-align:right;font-size:8.5px;line-height:1.6;color:#747f8b}.questions{background:#fff;border:1px solid #d9dce0;box-shadow:0 8px 28px rgba(31,42,54,.04)}.questions article{display:grid;grid-template-columns:66px 1fr;border-top:1px solid #e2e4e6;scroll-margin-top:100px}.questions article:first-child{border-top:0}.q-index{border-right:1px solid #e2e4e6;padding:21px 10px;text-align:center;background:#faf9f6}.q-index span{display:block;font-size:6px;letter-spacing:.1em;color:#9a654d;font-weight:850}.q-index strong{display:block;font-family:Georgia,serif;font-size:19px;color:#283a51;margin-top:2px}.q-content{padding:21px 24px 23px}.question{font-family:Georgia,'Times New Roman',serif;font-size:15.5px;line-height:1.62;color:#1c2837;white-space:pre-wrap}.options{list-style:none;margin:17px 0 0;padding:0;display:grid;gap:7px;max-width:790px}.options li{display:grid;grid-template-columns:28px 1fr;align-items:start;border:1px solid #e0e2e4;background:#fbfbfa;min-height:39px}.options li>span{display:flex;align-items:center;justify-content:center;height:100%;min-height:38px;border-right:1px solid #e0e2e4;font-family:Georgia,serif;font-size:10px;color:#914426}.options li p{padding:10px 11px;font-size:10.5px;line-height:1.55;color:#455365;white-space:pre-wrap}.meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:12px}.meta span{font-size:6.4px;border:1px solid #dce0e4;background:#f4f5f5;color:#687482;padding:4px 6px}.after-paper{margin-top:20px;background:#1d2d45;color:#fff;padding:24px 26px;display:flex;justify-content:space-between;align-items:center;gap:25px}.after-paper h2{font-family:var(--font-display);font-size:28px;letter-spacing:-.04em;margin:5px 0}.after-paper p{font-size:8.5px;line-height:1.6;color:#c2cdda}.after-paper>div:last-child{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.after-paper a{padding:9px 10px;background:#f2eee8;color:#24364d;text-decoration:none;border-radius:4px;font-size:7.5px;font-weight:850;white-space:nowrap}.after-paper .warm{background:#a34a27;color:#fff}.load-error{background:#fff;border:1px solid #d9dce0;padding:65px 30px;text-align:center}.load-error h2{font-family:var(--font-display);font-size:34px;margin:8px 0}.load-error p{font-size:10px;line-height:1.7;color:#687482;max-width:600px;margin:0 auto}.load-error a{display:inline-block;margin-top:16px;padding:9px 11px;background:#172338;color:#fff;text-decoration:none;border-radius:4px;font-size:8px;font-weight:850}@media(max-width:760px){.head-grid{grid-template-columns:1fr;gap:19px}.head-grid aside{max-width:390px}.paper-strip{grid-template-columns:1fr 1fr}.paper-strip>div:first-child{padding-left:13px}.paper-strip>div:nth-child(2){border-right:0}.paper-strip>div:nth-child(-n+2){border-bottom:1px solid #e0e3e6}.reader-title{align-items:flex-start;flex-direction:column;gap:6px}.reader-title>p{text-align:left}.after-paper{align-items:flex-start;flex-direction:column}.after-paper>div:last-child{justify-content:flex-start}}@media(max-width:520px){.shell{width:min(100% - 18px,980px)}.paper-head{padding-top:18px}.head-grid aside{grid-template-columns:1fr 1fr 1fr}.paper-strip{grid-template-columns:1fr}.paper-strip>div{border-right:0!important;border-bottom:1px solid #e0e3e6}.paper-strip>div:last-child{border-bottom:0}.questions article{grid-template-columns:45px 1fr}.q-index{padding:17px 5px}.q-index strong{font-size:16px}.q-content{padding:17px 14px 19px}.question{font-size:14px}.options li{grid-template-columns:26px 1fr}.options li p{font-size:10px}.after-paper{padding:20px}}
      `}</style>
    </main>
  );
}
