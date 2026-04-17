import Link from "next/link";

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

      {/* ── QUOTES ─────────────────────────────────────────────── */}
      <section style={{ background: "#0f172a", padding: "36px 20px 32px" }}>
        <div style={{
          maxWidth: 820, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          <div style={{ borderLeft: "2px solid rgba(251,191,36,0.4)", paddingLeft: 16 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.7vw,15px)", fontWeight: 600, color: "#fef3c7", lineHeight: 1.9, fontStyle: "italic", marginBottom: 10 }}>
              &ldquo;समर शेष है, नहीं पाप का भागी केवल व्याध,<br />
              जो तटस्थ हैं, समय लिखेगा उनके भी अपराध।&rdquo;
            </p>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>Ramdhari Singh &lsquo;Dinkar&rsquo;</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>Rashtrakavi · Begusarai, Bihar</p>
          </div>
          <div style={{ borderLeft: "2px solid rgba(192,96,16,0.45)", paddingLeft: 16 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.7vw,15px)", fontWeight: 600, color: "#fed7aa", lineHeight: 1.9, fontStyle: "italic", marginBottom: 10 }}>
              &ldquo;जे जन बिदेस गइले, ओहसे पूछा जाय —<br />
              अपने मिट्टी के लगन से, बड़ा कुछ नाहीं।&rdquo;
            </p>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#fb923c" }}>Bhikari Thakur</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>Shakespeare of Bhojpuri · Saran, Bihar</p>
          </div>
        </div>
      </section>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="bpsc-hero" style={{ padding: "64px 20px 68px", textAlign: "center" }}>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(192,96,16,0.1)", border: "1px solid var(--accent-border)",
          borderRadius: 20, padding: "5px 16px", marginBottom: 24,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block", boxShadow: "0 0 0 2px rgba(22,163,74,0.25)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Built for 5 lakh+ 72nd BPSC aspirants
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(2.2rem, 6.5vw, 4rem)",
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "var(--ink-strong)",
          maxWidth: 760, margin: "0 auto 16px",
        }}>
          72nd BPSC —<br />
          <span style={{ color: "var(--accent)" }}>Every topic. One place. Free.</span>
        </h1>

        <p style={{ fontSize: "clamp(14px,2vw,17px)", lineHeight: 1.85, color: "var(--ink-soft)", maxWidth: 540, margin: "0 auto 6px" }}>
          हर topic में — Exhaustive Current Affairs + Static Linkage + Bihar Angle + BPSC MCQ.
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", marginBottom: 36 }}>
          &ldquo;Trained on 15+ Years of BPSC Prelims Questions using Deep Learning&rdquo;
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <Link href="/ca" style={{
            background: "linear-gradient(135deg, #c06010, #d97706)",
            color: "#fff", borderRadius: 14, padding: "16px 48px",
            fontSize: 17, fontWeight: 700, fontFamily: "var(--font-display)",
            boxShadow: "0 6px 32px rgba(192,96,16,0.38)",
            display: "inline-block", textDecoration: "none",
          }}>
            Start Studying Free →
          </Link>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/quizzes" style={{
              border: "2px solid var(--accent)", background: "transparent",
              color: "var(--accent)", borderRadius: 9, padding: "8px 18px",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>Browse Quiz Sets →</Link>
            <Link href="/profile" style={{
              border: "1.5px solid var(--line-hi)", background: "rgba(255,253,248,0.85)",
              color: "var(--ink-soft)", borderRadius: 9, padding: "8px 18px",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>Track Progress</Link>
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>No signup · Always ₹0</p>
        </div>

        <div style={{
          display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
          border: "1px solid var(--line-hi)", borderRadius: 14,
          overflow: "hidden",
          background: "rgba(255,253,248,0.96)",
          boxShadow: "0 2px 16px rgba(120,80,30,0.08)",
        }}>
          {[
            { n: "15", sub: "Months of Content" },
            { n: "225+", sub: "Study Sets" },
            { n: "225+", sub: "Quiz Sets" },
            { n: "₹0", sub: "Always Free" },
          ].map(({ n, sub }, i) => (
            <div key={sub} style={{ padding: "12px 20px", textAlign: "center", borderLeft: i > 0 ? "1px solid var(--line)" : "none" }}>
              <p className="stat-shimmer" style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, lineHeight: 1, marginBottom: 3 }}>{n}</p>
              <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SETS ───────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--panel)", padding: "52px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Exhaustive Current Affairs + Exhaustive Static + Exhaustive Bihar — Apr 2025 to Jun 2026.
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)", marginTop: 6 }}>
              15 months of content = Cover in 3 months.
            </p>
          </div>

          {/* Cards with × between */}
          <div style={{ display: "flex", alignItems: "stretch", gap: 0, flexWrap: "wrap" }}>

            <Link href="/ca" style={{ textDecoration: "none", flex: "1 1 260px" }}>
              <div style={{
                background: "var(--card)", border: "1.5px solid var(--accent-border)",
                borderRadius: 20, padding: "24px 20px", height: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>📖</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-strong)" }}>Study Sets</p>
                    <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>15 per month · 225+ total</p>
                  </div>
                </div>
                {[
                  "Every Current Affairs topic — nothing skipped",
                  "Entire static syllabus covered through current context",
                  "Bihar angle woven into every card",
                  "BPSC MCQ direction for each topic",
                ].map(pt => (
                  <p key={pt} style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 5 }}>
                    <span style={{ color: "var(--accent)", marginRight: 7, fontWeight: 700 }}>→</span>{pt}
                  </p>
                ))}
                <p style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>Browse Study Sets →</p>
              </div>
            </Link>

            {/* × separator */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 16px", flexShrink: 0,
              minWidth: 44,
            }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700,
                color: "var(--accent)", opacity: 0.5, lineHeight: 1,
              }}>×</span>
            </div>

            <Link href="/quizzes" style={{ textDecoration: "none", flex: "1 1 260px" }}>
              <div style={{
                background: "var(--card)", border: "1.5px solid var(--line-hi)",
                borderRadius: 20, padding: "24px 20px", height: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>🎯</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-strong)" }}>Quiz Sets</p>
                    <p style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>15 per month · 225+ total</p>
                  </div>
                </div>
                {[
                  "Questions built from 15 years of BPSC CA + static patterns",
                  "Every quiz tests both current affairs and its static link",
                  "30-min timer · ⅓ negative marking · scored /150",
                  "Topic-wise analysis + AI improvement notes",
                ].map(pt => (
                  <p key={pt} style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 5 }}>
                    <span style={{ color: "var(--muted)", marginRight: 7 }}>→</span>{pt}
                  </p>
                ))}
                <p style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>Browse Quiz Sets →</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOURCES ────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--bg)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }}>
            Built from
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 10, letterSpacing: "0.05em" }}>
                Current Affairs — national · Bihar · world affairs
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CA_SOURCES.map(s => <span key={s} className="source-badge">{s}</span>)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 10, letterSpacing: "0.05em" }}>
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
