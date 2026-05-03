import Link from "next/link";

const SUBJECTS = [
  { key: "polity",      label: "Polity & Constitution",   emoji: "⚖️",  color: "#b86117" },
  { key: "economy",     label: "Economy",                  emoji: "📊",  color: "#2d7a4f" },
  { key: "history",     label: "History",                  emoji: "🏺",  color: "#5b4fcf" },
  { key: "geography",   label: "Geography",                emoji: "🗺️", color: "#0e7490" },
  { key: "environment", label: "Environment & Ecology",    emoji: "🌿",  color: "#15803d" },
  { key: "st",          label: "Science & Technology",     emoji: "🔬",  color: "#6d28d9" },
  { key: "bihar",       label: "Bihar Special",            emoji: "🏵️", color: "#c04a00" },
  { key: "world",       label: "World Affairs",            emoji: "🌍",  color: "#1d4ed8" },
];

export default function StaticQuizPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <section style={{
        padding: "56px 20px 44px", textAlign: "center",
        borderBottom: "1px solid var(--line)",
      }}>
        <p style={{
          fontFamily: "monospace", fontSize: 10,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "var(--muted)", marginBottom: 14,
        }}>Quiz · Static GK</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.9rem, 5.5vw, 3rem)",
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "var(--ink-strong)", maxWidth: 680, margin: "0 auto 12px",
        }}>Subject-wise Quizzes</h1>
        <p style={{
          maxWidth: 480, margin: "0 auto",
          fontSize: 14, lineHeight: 1.8, color: "var(--ink-soft)",
        }}>Pick a subject and test your static GK</p>
        <div style={{ marginTop: 22 }}>
          <Link href="/quizzes" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
            ← All Quizzes
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "36px 16px 72px" }}>
        <div className="subjects-grid">
          {SUBJECTS.map((sub) => (
            <div key={sub.key} className="subject-card" style={{ "--c": sub.color } as React.CSSProperties}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{
                  fontSize: 26, width: 48, height: 48,
                  borderRadius: 13, display: "grid", placeItems: "center",
                  background: `color-mix(in srgb, ${sub.color} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${sub.color} 20%, transparent)`,
                  flexShrink: 0,
                }}>{sub.emoji}</span>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16, fontWeight: 800,
                  color: "var(--ink-strong)", letterSpacing: "-0.025em",
                }}>{sub.label}</p>
              </div>
              <span style={{
                fontSize: 12.5, fontWeight: 700,
                color: sub.color, opacity: 0.55,
                letterSpacing: "0.04em",
              }}>Coming soon</span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .subjects-grid {
          display: grid; grid-template-columns: 1fr; gap: 12px;
        }
        @media (min-width: 500px) { .subjects-grid { grid-template-columns: 1fr 1fr; gap: 13px; } }
        @media (min-width: 780px) { .subjects-grid { grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; } }
        .subject-card {
          background: var(--card); border: 1px solid var(--line);
          border-radius: 20px; padding: 20px 18px 16px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: default;
        }
        @media (hover: hover) {
          .subject-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(120,80,30,0.10); }
        }
      `}</style>
    </main>
  );
}
