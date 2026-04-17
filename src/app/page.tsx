import Link from "next/link";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";

const CA_SOURCES = [
  "PIB", "The Hindu", "Indian Express", "Yojana", "Kurukshetra",
  "Down To Earth", "PRS India",
  "Prabhat Khabar", "Bihar Govt. Portal", "X / Twitter",
  "UN Press Releases", "Reuters", "MEA India",
];
const STATIC_SOURCES = [
  "M. Laxmikant", "Spectrum", "NCERT 6–12",
  "Majid Husain", "Ramesh Singh", "G.C. Leong",
  "Bihar State Gazetteer", "Patna University Journals", "Bihar Economic Survey",
];

export default function HomePage() {
  return (
    <main style={{ color: "var(--ink)" }}>

      {/* ── QUOTE ──────────────────────────────────────────────── */}
      <section style={{ background: "#0c1220", padding: "28px 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", borderLeft: "2px solid rgba(251,191,36,0.35)", paddingLeft: 16 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.6vw,15px)", fontWeight: 500, color: "rgba(254,243,199,0.88)", lineHeight: 1.9, fontStyle: "italic", marginBottom: 8 }}>
            &ldquo;समर शेष है, नहीं पाप का भागी केवल व्याध,<br />
            जो तटस्थ हैं, समय लिखेगा उनके भी अपराध।&rdquo;
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>Ramdhari Singh &lsquo;Dinkar&rsquo; &nbsp;·&nbsp; <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>Rashtrakavi · Begusarai, Bihar</span></p>
        </div>
      </section>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="bpsc-hero" style={{ padding: "60px 20px 56px", textAlign: "center" }}>

        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(2.1rem, 6.5vw, 3.8rem)",
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "var(--ink-strong)",
          maxWidth: 700, margin: "0 auto 10px",
        }}>
          72nd BPSC Prelims
        </h1>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.5rem, 4.5vw, 2.6rem)",
          lineHeight: 1.1, letterSpacing: "-0.02em",
          color: "var(--accent)",
          maxWidth: 700, margin: "0 auto 28px",
        }}>
          Every topic. One place. Free.
        </h2>

        <Link href="/ca" style={{
          background: "linear-gradient(135deg, #b86117, #d97706)",
          color: "#fff", borderRadius: 14, padding: "16px 52px",
          fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)",
          boxShadow: "0 8px 32px rgba(192,96,16,0.35)",
          display: "inline-block", textDecoration: "none",
          letterSpacing: "0.01em",
        }}>
          Start Studying Free →
        </Link>

        <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.06em", marginTop: 14 }}>
          No signup &nbsp;·&nbsp; Always ₹0 &nbsp;·&nbsp; Research lab trained
        </p>

      </section>

      {/* ── QOTD ───────────────────────────────────────────────── */}
      <QuestionOfTheDay />

      {/* ── SETS ───────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--panel)", padding: "56px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
              What&apos;s inside
            </p>
            <p style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
              fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.4,
              maxWidth: 520, margin: "0 auto 10px",
              letterSpacing: "-0.01em",
            }}>
              Exhaustive CA + Exhaustive Static + Bihar Angle —{" "}
              <span style={{ color: "var(--accent)" }}>Cover it all in 3 months.</span>
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
              Research lab trained on 15 years of BPSC Prelims — every set built to maximise your score, not just your knowledge.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "stretch", gap: 0 }}>

            <Link href="/ca" style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--card)",
                border: "1.5px solid var(--accent-border)",
                borderRadius: 20, padding: "28px 22px", height: "100%",
                boxSizing: "border-box",
                transition: "box-shadow 0.15s",
              }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>📖</span>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-strong)", marginBottom: 4 }}>
                  Study Sets
                </p>
                <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 18, letterSpacing: "0.04em" }}>
                  225+ sets
                </p>
                {[
                  "Every Current Affairs topic — nothing skipped",
                  "Full static syllabus through current context",
                  "Bihar angle in every card",
                  "BPSC MCQ direction for each topic",
                ].map(pt => (
                  <p key={pt} style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 6, display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>→</span>{pt}
                  </p>
                ))}
                <p style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.02em" }}>
                  Browse Study Sets →
                </p>
              </div>
            </Link>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 300, color: "var(--line-hi)", lineHeight: 1 }}>×</span>
            </div>

            <Link href="/quizzes" style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--card)",
                border: "1.5px solid var(--line-hi)",
                borderRadius: 20, padding: "28px 22px", height: "100%",
                boxSizing: "border-box",
              }}>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 28 }}>🎯</span>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-strong)", marginBottom: 4 }}>
                  Quiz Sets
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 700, marginBottom: 18, letterSpacing: "0.04em" }}>
                  225+ quizzes
                </p>
                {[
                  "Built from 15 years of BPSC CA + static patterns",
                  "Every quiz tests current affairs + static link",
                  "30-min timer · ⅓ negative marking · /150",
                  "Topic analysis + AI improvement notes",
                ].map(pt => (
                  <p key={pt} style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.75, marginBottom: 6, display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--muted)", flexShrink: 0 }}>→</span>{pt}
                  </p>
                ))}
                <p style={{ marginTop: 20, fontSize: 13, fontWeight: 700, color: "var(--ink-strong)", letterSpacing: "0.02em" }}>
                  Browse Quiz Sets →
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── SOURCES ────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--bg)", padding: "52px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 28 }}>
            Built from
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 12, letterSpacing: "0.04em" }}>
                Current Affairs — national · Bihar · world
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CA_SOURCES.map(s => <span key={s} className="source-badge">{s}</span>)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 12, letterSpacing: "0.04em" }}>
                Static — standard books + Bihar-specific references
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATIC_SOURCES.map(s => <span key={s} className="source-badge">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
