import Link from "next/link";

const FEATURES = [
  {
    href: "/ca",
    emoji: "📖",
    title: "Current Affairs",
    desc: "Daily CA briefs, month-wise sets, and quick revision notes",
    color: "#c06010",
  },
  {
    href: "/quizzes",
    emoji: "🎯",
    title: "Practice Quiz",
    desc: "Topic-wise MCQs with instant feedback and explanations",
    color: "#0891b2",
  },
  {
    href: "/ask",
    emoji: "🧠",
    title: "Ask AI",
    desc: "Get instant answers to your BPSC doubts anytime",
    color: "#6366f1",
  },
  {
    href: "/partner",
    emoji: "🤝",
    title: "Study Partner",
    desc: "Find an accountability partner who matches your schedule",
    color: "#15803d",
  },
  {
    href: "/leaderboard",
    emoji: "🏆",
    title: "Leaderboard",
    desc: "Track your daily rank and compete with aspirants",
    color: "#d97706",
  },
  {
    href: "/ca/theme/bihar-special",
    emoji: "🗺️",
    title: "Bihar Special",
    desc: "Bihar GS — history, geography, polity & economy",
    color: "#b91c1c",
  },
];

const PILLS = ["72nd BPSC", "Daily CA", "AI-Powered", "100% Free"];

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "52px 20px 40px",
        textAlign: "center",
      }}>
        {/* Pill badges */}
        <div style={{
          display: "flex", gap: 6, justifyContent: "center",
          flexWrap: "wrap", marginBottom: 24,
        }}>
          {PILLS.map(p => (
            <span key={p} style={{
              display: "inline-block",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              fontSize: 11, fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "4px 12px", borderRadius: 999,
              border: "1px solid var(--accent-border)",
            }}>{p}</span>
          ))}
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 8vw, 3.8rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "var(--ink-strong)",
          marginBottom: 16,
        }}>
          Everything you need<br />
          for <span style={{ color: "var(--accent)" }}>BPSC Prelims</span>
        </h1>

        <p style={{
          fontSize: 15,
          color: "var(--ink-soft)",
          lineHeight: 1.7,
          maxWidth: 460,
          margin: "0 auto 32px",
        }}>
          Daily Current Affairs, AI doubt solving, timed quizzes, and a study partner — built for Bihar aspirants. Completely free.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/ca" className="btn-primary">
            📖 Start Studying
          </Link>
          <Link href="/ask" className="btn-secondary">
            🧠 Ask AI
          </Link>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: "0 auto 36px", padding: "0 16px" }}>
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: "18px 8px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          textAlign: "center",
        }}>
          {[
            { num: "72nd",  label: "BPSC Prelims" },
            { num: "Daily", label: "CA Updates" },
            { num: "AI",    label: "Doubt Solving" },
            { num: "Free",  label: "Always" },
          ].map((s, i, arr) => (
            <div key={i} style={{
              borderRight: i < arr.length - 1 ? "1px solid var(--line)" : "none",
              padding: "0 8px",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.3rem, 4vw, 1.9rem)",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}>{s.num}</div>
              <div style={{
                fontSize: 10.5, color: "var(--muted)",
                fontWeight: 600, marginTop: 3,
                letterSpacing: "0.04em",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 72px" }}>
        <div className="home-grid">
          {FEATURES.map(f => (
            <Link key={f.href} href={f.href} className="home-card" style={{
              "--card-color": f.color,
            } as React.CSSProperties}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `color-mix(in srgb, ${f.color} 12%, transparent)`,
                border: `1.5px solid color-mix(in srgb, ${f.color} 22%, transparent)`,
                display: "grid", placeItems: "center",
                fontSize: 26, marginBottom: 12, flexShrink: 0,
              }}>{f.emoji}</div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: 16.5, fontWeight: 700,
                color: "var(--ink-strong)",
                letterSpacing: "-0.025em",
                marginBottom: 5,
              }}>{f.title}</h2>
              <p style={{
                fontSize: 12.5, color: "var(--muted)",
                lineHeight: 1.6, flex: 1,
              }}>{f.desc}</p>
              <span className="card-cta" style={{ color: f.color }}>
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent); color: #fff;
          font-size: 14px; font-weight: 700;
          padding: 13px 26px; border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(192,96,16,0.3);
          transition: transform 0.14s ease, box-shadow 0.14s ease;
        }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--card); color: var(--ink-strong);
          font-size: 14px; font-weight: 700;
          padding: 13px 26px; border-radius: 14px;
          text-decoration: none;
          border: 1px solid var(--line-hi);
          transition: transform 0.14s ease, border-color 0.14s ease;
        }
        @media (hover: hover) {
          .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(192,96,16,0.36); }
          .btn-secondary:hover { transform: translateY(-2px); border-color: var(--accent-border); }
        }

        .home-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 600px) {
          .home-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }

        .home-card {
          text-decoration: none;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 22px 20px 18px;
          display: flex; flex-direction: column;
          box-shadow: 0 2px 10px rgba(120,80,30,0.045);
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        @media (hover: hover) {
          .home-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 32px rgba(120,80,30,0.1);
            border-color: var(--line-hi);
          }
        }

        .card-cta {
          display: inline-flex; align-items: center; gap: 3px;
          margin-top: 14px;
          font-size: 11.5px; font-weight: 800;
          letter-spacing: 0.02em;
          transition: gap 0.14s ease;
        }
        @media (hover: hover) {
          .home-card:hover .card-cta { gap: 6px; }
        }
      `}</style>
    </main>
  );
}
