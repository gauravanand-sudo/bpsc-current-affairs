import Link from "next/link";
import GlowLogo from "@/components/GlowLogo";
import { STATIC_QUIZZES } from "@/lib/quizBank";

const PRESENTATION: Record<string, { emoji: string; color: string }> = {
  polity: { emoji: "⚖️", color: "#b86117" },
  economy: { emoji: "📊", color: "#2d7a4f" },
  history: { emoji: "🏺", color: "#5b4fcf" },
  geography: { emoji: "🗺️", color: "#0e7490" },
  environment: { emoji: "🌿", color: "#15803d" },
  st: { emoji: "🔬", color: "#6d28d9" },
  bihar: { emoji: "🏵️", color: "#c04a00" },
  world: { emoji: "🌍", color: "#1d4ed8" },
};

export default function StaticQuizPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div>
          <Link href="/quizzes" className="back">← Quiz Hub</Link>
          <GlowLogo style={{ margin: "0 auto 8px" }} />
          <span>STATIC GS · UPSC / BPSC FOUNDATION</span>
          <h1>Eight subjects. No dead cards.</h1>
          <p>Every subject now opens a complete timed test with statement-based questions, −⅓ negative marking, explanations and topic-wise performance analysis.</p>
        </div>
      </section>

      <section className="subject-shell">
        <div className="subject-grid">
          {STATIC_QUIZZES.map((quiz) => {
            const present = PRESENTATION[quiz.slug];
            return (
              <Link key={quiz.slug} href={`/quizzes/static/${quiz.slug}/quiz`} className="subject-card" style={{ "--c": present.color } as React.CSSProperties}>
                <div className="subject-top">
                  <span>{present.emoji}</span>
                  <small>{quiz.quiz.questions.length} QUESTIONS · {Math.ceil(quiz.quiz.duration / 60)} MIN</small>
                </div>
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>
                <div><b>Start UPSC-level test →</b><i>LIVE</i></div>
              </Link>
            );
          })}
        </div>
      </section>

      <style>{`
        .static-page{min-height:100vh;background:#f7f5f0;color:#172338}.static-hero{padding:38px 16px 32px;background:linear-gradient(180deg,#fff,#eceff2);border-bottom:1px solid #d5d9df}.static-hero>div{width:min(860px,100%);margin:auto;text-align:center;position:relative}.back{position:absolute;left:0;top:0;text-decoration:none;font-size:11px;font-weight:750;color:#687585}.static-hero span{font-size:8px;letter-spacing:.18em;font-weight:900;color:#9b4b29}.static-hero h1{font-family:var(--font-display);font-size:clamp(38px,6vw,61px);line-height:.97;letter-spacing:-.055em;margin:10px 0}.static-hero p{max-width:650px;margin:auto;font-size:12px;line-height:1.75;color:#5f6a78}.subject-shell{width:min(1050px,calc(100% - 32px));margin:auto;padding:42px 0 76px}.subject-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.subject-card{text-decoration:none;color:#172338;background:#fff;border:1px solid #dbd8d2;border-top:3px solid var(--c);border-radius:13px;padding:19px;min-height:235px;display:flex;flex-direction:column;transition:.18s ease}.subject-card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(30,46,66,.09)}.subject-top{display:flex;justify-content:space-between;align-items:center;gap:10px}.subject-top>span{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:color-mix(in srgb,var(--c) 10%,white);font-size:22px}.subject-top small{font-size:7px;line-height:1.4;text-align:right;letter-spacing:.08em;color:#7c8794}.subject-card h2{font-family:var(--font-display);font-size:20px;line-height:1.12;letter-spacing:-.03em;margin:18px 0 7px}.subject-card p{font-size:9.5px;line-height:1.65;color:#687482;flex:1}.subject-card>div:last-child{display:flex;justify-content:space-between;align-items:center;margin-top:18px}.subject-card b{font-size:9px;color:var(--c)}.subject-card i{font-style:normal;font-size:7px;font-weight:900;color:#15803d;background:#ecf8ef;padding:4px 7px;border-radius:20px}@media(max-width:850px){.subject-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.back{position:static;display:block;margin-bottom:12px}.subject-grid{grid-template-columns:1fr}.subject-shell{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
