import Link from "next/link";
import { OFFICIAL_LINKS } from "@/lib/coachingData";
import { PYQ_QUIZZES } from "@/lib/quizBank";

export default function PYQQuizPage() {
  return (
    <main className="pyq-page">
      <section className="pyq-hero">
        <div className="shell">
          <Link href="/quizzes" className="back">← Quiz Hub</Link>
          <span>UPSC / BPSC PYQ-ORIENTED PRACTICE</span>
          <h1>Practice the patterns previous papers repeatedly reward.</h1>
          <p>These are original, paraphrased drills built from recurring PYQ concepts—not copied paper text. Attempt them under negative marking, then use the official archives for exact questions.</p>
          <div className="hero-actions">
            <a href="#tests">Start PYQ-pattern tests →</a>
            <Link href="/pyq" className="outline">Open PYQ Intelligence Desk</Link>
          </div>
        </div>
      </section>

      <section id="tests" className="shell test-section">
        <header><div><span>4 LIVE TESTS</span><h2>UPSC concepts + Bihar-specific traps.</h2></div><p>Each set uses the same engine as Current Affairs: timer, navigator, −⅓ marking, saved best attempt and detailed review.</p></header>
        <div className="test-grid">
          {PYQ_QUIZZES.map((quiz, index) => (
            <Link key={quiz.slug} href={`/quizzes/pyq/${quiz.slug}/quiz`}>
              <div className="number">0{index + 1}</div>
              <small>{quiz.slug.startsWith("bpsc") ? "BPSC PRELIMS" : "UPSC PRELIMS"}</small>
              <h3>{quiz.title.replace("PYQ Patterns - ", "")}</h3>
              <p>{quiz.description}</p>
              <div><b>{quiz.quiz.questions.length} questions · {Math.ceil(quiz.quiz.duration / 60)} min</b><strong>Start →</strong></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="official">
        <div className="shell official-grid">
          <div><span>EXACT ORIGINAL WORDING</span><h2>Always verify from the commission paper.</h2><p>The practice sets teach demand and elimination. The official archives remain the source for original question wording.</p></div>
          <div>
            <a href={OFFICIAL_LINKS.upscPyqArchive} target="_blank" rel="noopener noreferrer">Official UPSC papers ↗</a>
            <a href={OFFICIAL_LINKS.bpscQuestionBooklets} target="_blank" rel="noopener noreferrer">Official BPSC booklets ↗</a>
            <Link href="/pyq">OneShot GS PYQ desk →</Link>
          </div>
        </div>
      </section>

      <style>{`
        .pyq-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1020px,calc(100% - 32px));margin:auto}.pyq-hero{padding:55px 0 43px;background:linear-gradient(135deg,#15233a,#263d60);color:#fff}.pyq-hero .shell{position:relative}.back{position:absolute;right:0;top:0;color:#bcc9d9;text-decoration:none;font-size:10px}.pyq-hero span,.test-section header span,.official span{font-size:8px;letter-spacing:.18em;font-weight:900;color:#e2b88e}.pyq-hero h1{font-family:var(--font-display);font-size:clamp(40px,6vw,65px);line-height:.96;letter-spacing:-.055em;max-width:870px;margin:10px 0 15px}.pyq-hero p{max-width:720px;color:#c8d2df;font-size:11.5px;line-height:1.75}.hero-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:21px}.hero-actions a{background:#a64922;color:#fff;padding:11px 14px;border-radius:6px;text-decoration:none;font-size:9px;font-weight:850}.hero-actions .outline{background:transparent;border:1px solid rgba(255,255,255,.24)}.test-section{padding:48px 0 58px}.test-section header{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:20px}.test-section header span{color:#9b4e2b}.test-section h2,.official h2{font-family:var(--font-display);font-size:clamp(29px,4vw,42px);letter-spacing:-.045em;line-height:1.03;margin-top:6px}.test-section header>p{max-width:380px;text-align:right;font-size:10px;line-height:1.65;color:#687482}.test-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.test-grid>a{background:#fff;border:1px solid #d9d6d0;border-radius:11px;padding:21px;text-decoration:none;color:#172338;display:grid;grid-template-columns:50px 1fr;column-gap:15px;transition:.15s}.test-grid>a:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(27,43,63,.08)}.number{grid-row:1/5;font-family:Georgia,serif;font-size:30px;color:#a24b27;border-right:1px solid #e2ddd6}.test-grid small{font-size:7px;letter-spacing:.1em;color:#9a4e2c;font-weight:900}.test-grid h3{font-family:var(--font-display);font-size:20px;margin:6px 0}.test-grid p{font-size:9px;line-height:1.65;color:#697582}.test-grid>a>div:last-child{display:flex;justify-content:space-between;margin-top:16px;gap:10px}.test-grid b,.test-grid strong{font-size:8px}.test-grid b{color:#7c8692}.test-grid strong{color:#9d4825}.official{background:#172338;color:#fff;padding:42px 0}.official-grid{display:grid;grid-template-columns:1fr 330px;align-items:center;gap:38px}.official p{font-size:10px;line-height:1.7;color:#c5d0dc;margin-top:9px}.official-grid>div:last-child{display:grid;gap:8px}.official-grid a{display:block;text-align:center;text-decoration:none;padding:11px;background:#f3eee8;color:#26364f;font-size:9px;font-weight:850;border-radius:5px}@media(max-width:720px){.test-section header{flex-direction:column;align-items:flex-start}.test-section header>p{text-align:left}.test-grid,.official-grid{grid-template-columns:1fr}}@media(max-width:500px){.test-grid{grid-template-columns:1fr}.back{position:static;display:block;margin-bottom:15px}.shell{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
