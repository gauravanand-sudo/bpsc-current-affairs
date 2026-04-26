import Link from "next/link";

const CA_SOURCES = [
  "PIB", "The Hindu", "Indian Express", "Yojana", "Kurukshetra",
  "Down To Earth", "PRS India", "Prabhat Khabar", "Bihar Govt. Portal",
  "UN / MEA / Reuters",
];

const STATIC_SOURCES = [
  "Laxmikant", "Spectrum", "NCERT 6-12", "Majid Husain",
  "Ramesh Singh", "G.C. Leong", "Bihar Economic Survey", "Bihar Gazetteer",
];

const MAIN_TRACKS = [
  {
    href: "/ca",
    emoji: "📚",
    title: "Study Sets",
    note: "15 month CA + static linkages",
    lines: [
      "Theme-wise current affairs across all major subjects",
      "Static linkage in every track",
      "Bihar angle where it matters",
    ],
  },
  {
    href: "/quizzes",
    emoji: "🎯",
    title: "Quiz Sets",
    note: "PYQ-trained prelims testing",
    lines: [
      "Built on 15 years prelims pattern sense",
      "CA + static integration",
      "Timed exam-style practice",
    ],
  },
  {
    href: "/pyq",
    emoji: "📝",
    title: "PYQ Sets",
    note: "See the real exam language",
    lines: [
      "Prelims direction awareness",
      "Question style familiarity",
      "Pattern-based revision",
    ],
  },
  {
    href: "/ca",
    emoji: "🧭",
    title: "Static Sets",
    note: "Static built from current context",
    lines: [
      "Polity, economy, geo, env, history, Bihar",
      "Focused on what gets asked",
      "No random theory dumping",
    ],
  },
];

const SMALL_TOOLS = [
  {
    href: "/ask",
    emoji: "🧠",
    title: "AI Tutor",
    sub: "Instant doubt help",
  },
  {
    href: "/partner",
    emoji: "🤝",
    title: "Study Partner",
    sub: "Find serious peers",
  },
  {
    href: "/leaderboard",
    emoji: "🏆",
    title: "Leaderboard",
    sub: "Track the race",
  },
  {
    href: "/support",
    emoji: "💬",
    title: "Group Chat",
    sub: "Chat with peers",
  },
];

export default function HomePage() {
  return (
    <main style={{ color: "var(--ink)" }}>
      <section style={{ background: "#0c1220", padding: "20px 24px", marginTop: -1 }}>
        <div style={{ maxWidth: 620, margin: "0 auto", borderLeft: "2px solid rgba(251,191,36,0.35)", paddingLeft: 16 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.6vw,15px)", fontWeight: 500, color: "rgba(254,243,199,0.88)", lineHeight: 1.9, fontStyle: "italic", marginBottom: 8 }}>
            &ldquo;समर शेष है, नहीं पाप का भागी केवल व्याध,<br />
            जो तटस्थ हैं, समय लिखेगा उनके भी अपराध।&rdquo;
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>
            Ramdhari Singh &lsquo;Dinkar&rsquo; &nbsp;·&nbsp;
            <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>Rashtrakavi · Begusarai, Bihar</span>
          </p>
        </div>
      </section>

      <section className="bpsc-hero" style={{ padding: "38px 16px 24px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", gap: 14, alignItems: "stretch" }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(249,244,237,0.92))",
                border: "1px solid var(--line)",
                borderRadius: 24,
                padding: "22px 18px",
              }}
            >
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                🚨 72nd BPSC Prelims
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.9rem, 5.5vw, 3.25rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  color: "var(--ink-strong)",
                  maxWidth: 620,
                  marginBottom: 10,
                }}
              >
                15 months CA 📚 + static links 🧭 + 15 years PYQ training 🎯
              </h1>
              <p style={{ maxWidth: 640, fontSize: 14, lineHeight: 1.78, color: "var(--ink-soft)", marginBottom: 16 }}>
                Full current affairs coverage, static linkage across all subjects, and exam-shaping built on deep learning from 15 years of prelims PYQ.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {["📖 Current Affairs", "🏛️ Polity", "💰 Economy", "🌾 Bihar", "🌍 International", "🌿 Environment"].map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      border: "1px solid var(--line)",
                      background: "var(--card)",
                      padding: "6px 11px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  href="/ca"
                  style={{
                    background: "linear-gradient(135deg, #b86117, #d97706)",
                    color: "#fff",
                    borderRadius: 14,
                    padding: "14px 22px",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    boxShadow: "0 8px 24px rgba(192,96,16,0.28)",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                >
                  Start Studying →
                </Link>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                  ₹0 • no signup • built for BPSC
                </span>
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fff7ed 0%, #fde8c8 100%)",
                border: "1px solid var(--accent-border)",
                borderRadius: 24,
                padding: "20px 18px",
                color: "var(--ink)",
              }}
            >
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                ✅ What You Need
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.9rem)", lineHeight: 1.08, color: "var(--ink-strong)", marginBottom: 10 }}>
                Enough to stay ahead in the race. 🚀
              </h2>
              <p style={{ fontSize: 13.5, lineHeight: 1.72, color: "var(--ink-soft)", marginBottom: 14 }}>
                15 months current affairs, their static linkages, PYQ practice, quiz practice, and enough static knowledge. This is what we are giving here. 📚
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "🗓️ 15 months current affairs",
                  "🧭 Static linkages across subjects",
                  "📝 PYQ practice",
                  "🎯 Quiz practice",
                  "📘 Enough static knowledge",
                ].map((line) => (
                  <div
                    key={line}
                    style={{
                      borderRadius: 14,
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.62)",
                      border: "1px solid rgba(192,96,16,0.14)",
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--ink-strong)",
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 10,
            }}
          >
            {SMALL_TOOLS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 82,
                  textAlign: "center",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(249,244,237,0.92))",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: "12px 10px",
                  textDecoration: "none",
                  boxShadow: "0 10px 24px rgba(120,80,30,0.05)",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.emoji}</div>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink-strong)", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.3 }}>
                  {item.sub}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--panel)", padding: "34px 16px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                🚀 Main Tracks
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.8rem)", color: "var(--ink-strong)" }}>
                Study only what moves rank.
              </h3>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", maxWidth: 360, lineHeight: 1.7 }}>
              📚 CA • 🧭 Static • 📝 PYQ • 🎯 Quiz
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {MAIN_TRACKS.map((track) => (
              <Link
                key={track.title}
                href={track.href}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: "18px 16px",
                  textDecoration: "none",
                }}
              >
                <div style={{ marginBottom: 10, fontSize: 26 }}>{track.emoji}</div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-strong)", marginBottom: 4 }}>
                  {track.title}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--accent)", fontWeight: 700, marginBottom: 10 }}>
                  {track.note}
                </p>
                {track.lines.map((line) => (
                  <p key={line} style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 5 }}>
                    {line}
                  </p>
                ))}
                <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--line)", background: "var(--bg)", padding: "34px 16px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px 18px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-strong)", marginBottom: 10 }}>
                📦 Content
              </p>
              {[
                "🗓️ 15 month current affairs coverage",
                "🧭 Static linkages across all subjects",
                "🎯 15 years prelims PYQ-trained direction",
                "⚡ Built around what can clear the exam",
              ].map((line) => (
                <p key={line} style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 6 }}>
                  {line}
                </p>
              ))}
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, padding: "22px 18px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink-strong)", marginBottom: 10 }}>
                👥 Team
              </p>
              {[
                "🏅 UPSC prelims high scorers",
                "🌾 BPSC prelims high scorers",
                "🧠 Senior AI researcher",
              ].map((line) => (
                <p key={line} style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 6 }}>
                  {line}
                </p>
              ))}
            </div>
            <div style={{ background: "#0c1220", borderRadius: 20, padding: "22px 18px", color: "#f8fafc" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                ⚠️ Get aware
              </p>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "rgba(241,245,249,0.82)", marginBottom: 12 }}>
                Old strategy, fake completeness, random notes. Study what will clear the exam. Do that well and you stay ahead. 🏁
              </p>
              <Link
                href="/ca"
                style={{
                  background: "linear-gradient(135deg, #b86117, #d97706)",
                  color: "#fff",
                  borderRadius: 14,
                  padding: "12px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                Take control →
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "16px 14px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 10, letterSpacing: "0.04em" }}>
                📰 Current affairs sources
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CA_SOURCES.map((s) => <span key={s} className="source-badge">{s}</span>)}
              </div>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "16px 14px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 10, letterSpacing: "0.04em" }}>
                📘 Static references
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATIC_SOURCES.map((s) => <span key={s} className="source-badge">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
