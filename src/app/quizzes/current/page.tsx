import Link from "next/link";
import GlowLogo from "@/components/GlowLogo";
import QuizSetCard from "@/components/QuizSetCard";
import CollapsibleMonth from "@/components/CollapsibleMonth";
import { CURRENT_AFFAIRS_2026 } from "@/lib/quizBank";

const MONTHS = ["2026-06", "2026-05", "2026-04", "2026-03", "2026-02", "2026-01"];

function monthLabel(ym: string) {
  const [year, month] = ym.split("-");
  return new Date(+year, +month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function CurrentQuizPage() {
  return (
    <main className="current-page">
      <section className="current-hero">
        <div className="hero-shell">
          <Link href="/quizzes" className="back-link">← Quiz Hub</Link>
          <GlowLogo style={{ margin: "0 auto 10px" }} />
          <span>ONESHOT GS · MONTHLY CURRENT AFFAIRS TEST SERIES</span>
          <h1>January–June 2026</h1>
          <p>Thirty complete UPSC-level mini tests. Every month has exactly five quizzes built around that month&apos;s policy, economy, environment, science and international developments.</p>
          <div className="hero-stats">
            <div><b>6</b><small>months</small></div>
            <div><b>30</b><small>quizzes</small></div>
            <div><b>150</b><small>statement MCQs</small></div>
            <div><b>−⅓</b><small>negative marking</small></div>
          </div>
        </div>
      </section>

      <section className="month-shell">
        <div className="section-heading">
          <div><span>MONTH-WISE PRACTICE</span><h2>Choose one month. Finish all five sets.</h2></div>
          <p>Each five-question set is deliberately compact, difficult and explanation-led. Review every wrong option after submitting.</p>
        </div>

        {MONTHS.map((month, index) => {
          const sets = CURRENT_AFFAIRS_2026[month];
          return (
            <CollapsibleMonth
              key={month}
              label={monthLabel(month)}
              liveCount={sets.length}
              totalPlanned={5}
              defaultOpen={index === 0}
            >
              <div className="quiz-set-grid">
                {sets.map((set, setIndex) => (
                  <QuizSetCard
                    key={set.slug}
                    month={month}
                    num={setIndex + 1}
                    cats={set.categories}
                    questionCount={set.quiz.questions.length}
                    durationMinutes={Math.ceil(set.quiz.duration / 60)}
                    studyHref="/ca"
                    studyLabel="Open Current Affairs desk →"
                  />
                ))}
              </div>
            </CollapsibleMonth>
          );
        })}
      </section>

      <style>{`
        .current-page{min-height:100vh;background:#f7f5f0;color:#172338}.current-hero{padding:38px 16px 34px;background:radial-gradient(circle at 50% 0,#fff 0,#eef1f4 46%,#e7ebef 100%);border-bottom:1px solid #d4dae1}.hero-shell{width:min(880px,100%);margin:auto;text-align:center;position:relative}.back-link{position:absolute;left:0;top:0;text-decoration:none;color:#6d7887;font-size:11px;font-weight:750}.hero-shell>span,.section-heading span{font-size:8px;letter-spacing:.18em;font-weight:900;color:#9a4c2a}.hero-shell h1{font-family:var(--font-display);font-size:clamp(39px,7vw,68px);line-height:.95;letter-spacing:-.055em;margin:10px 0}.hero-shell>p{max-width:680px;margin:auto;font-size:12px;line-height:1.75;color:#5d6877}.hero-stats{display:grid;grid-template-columns:repeat(4,1fr);max-width:620px;margin:24px auto 0;background:#fff;border:1px solid #d5dbe2;border-radius:14px;overflow:hidden}.hero-stats>div{padding:13px;border-right:1px solid #e1e5ea}.hero-stats>div:last-child{border:0}.hero-stats b{display:block;font-family:var(--font-display);font-size:23px;color:#263b59}.hero-stats small{display:block;font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:#7a8491}.month-shell{width:min(940px,calc(100% - 32px));margin:auto;padding:42px 0 74px}.section-heading{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:22px}.section-heading h2{font-family:var(--font-display);font-size:clamp(27px,4vw,39px);letter-spacing:-.04em;line-height:1.03;margin-top:6px}.section-heading>p{max-width:360px;text-align:right;font-size:10px;line-height:1.7;color:#6b7684}.quiz-set-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}@media(max-width:760px){.section-heading{flex-direction:column;align-items:flex-start}.section-heading>p{text-align:left}.quiz-set-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.back-link{position:static;display:block;margin-bottom:12px}.hero-stats{grid-template-columns:1fr 1fr}.hero-stats>div:nth-child(2){border-right:0}.hero-stats>div:nth-child(-n+2){border-bottom:1px solid #e1e5ea}.quiz-set-grid{grid-template-columns:1fr}.month-shell{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
