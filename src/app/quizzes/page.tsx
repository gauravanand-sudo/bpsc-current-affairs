import Link from "next/link";
import Image from "next/image";

const QUIZ_TYPES = [
  {
    href: "/quizzes/current",
    emoji: "📰",
    title: "Current Affairs",
    desc: "Month-wise CA quiz sets · Apr 2025 – Apr 2026",
    color: "#c06010",
    tag: "Month-wise",
  },
  {
    href: "/quizzes/static",
    emoji: "📚",
    title: "Static GK",
    desc: "Subject-wise quizzes on Polity, History, Geography & more",
    color: "#15803d",
    tag: "Subject-wise",
  },
  {
    href: "/quizzes/pyq",
    emoji: "📋",
    title: "PYQ",
    desc: "BPSC previous year papers — 64th to 72nd set-wise",
    color: "#d97706",
    tag: "Set-wise",
  },
];

export default function QuizzesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      {/* Header */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 0", textAlign: "center" }}>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 20, letterSpacing: "-0.025em",
          color: "var(--ink-strong)", marginBottom: 4,
        }}>Quiz</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Only what scores. Zero fluff, zero filler.
        </p>
      </div>

      {/* 3 options */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "14px 20px 80px" }}>
        <div className="quiz-grid">
          {QUIZ_TYPES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="quiz-card"
              style={{ "--c": item.color } as React.CSSProperties}
            >
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  display: "inline-block",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: item.color,
                  background: `color-mix(in srgb, ${item.color} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${item.color} 22%, transparent)`,
                  borderRadius: 6, padding: "3px 8px",
                  marginBottom: 12,
                }}>{item.tag}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontSize: 30, width: 56, height: 56,
                    borderRadius: 16, display: "grid", placeItems: "center",
                    background: `color-mix(in srgb, ${item.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${item.color} 20%, transparent)`,
                    flexShrink: 0,
                  }}>{item.emoji}</span>
                  <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22, fontWeight: 800,
                    color: "var(--ink-strong)", letterSpacing: "-0.03em",
                  }}>{item.title}</h2>
                </div>
              </div>
              <p style={{
                fontSize: 13.5, color: "var(--ink-soft)",
                lineHeight: 1.6, marginBottom: 18,
              }}>{item.desc}</p>
              <span style={{
                fontSize: 13, fontWeight: 700, color: item.color,
              }}>Start Quiz →</span>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .quiz-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 600px) {
          .quiz-grid { grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        }
        .quiz-card {
          text-decoration: none;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 22px;
          padding: 24px 22px 22px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          display: flex; flex-direction: column;
        }
        @media (hover: hover) {
          .quiz-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 40px rgba(120,80,30,0.13);
          }
        }
      `}</style>
    </main>
  );
}
