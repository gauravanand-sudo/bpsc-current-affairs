import Image from "next/image";
import Link from "next/link";
import FloatingExamTimers from "@/components/FloatingExamTimers";

const CONTENT = [
  {
    href: "/ca",
    emoji: "📰",
    title: "Current Affairs",
    desc: "Daily CA sets, month-wise revision",
    color: "#c06010",
  },
  {
    href: "/ca/theme/polity",
    emoji: "📕",
    title: "GS Ghatnachakra",
    desc: "Polity, economy & governance GS",
    color: "#6366f1",
  },
  {
    href: "/ca/theme/bihar-special",
    emoji: "🗺️",
    title: "Bihar GS",
    desc: "Bihar history, geography & polity",
    color: "#b91c1c",
  },
  {
    href: "/ca/theme/history-culture",
    emoji: "📗",
    title: "NCERT",
    desc: "History, culture & geography basics",
    color: "#0891b2",
  },
  {
    href: "/ca",
    emoji: "📘",
    title: "Lucent GK",
    desc: "Static GK, science & environment",
    color: "#7c3aed",
  },
  {
    href: "/quizzes",
    emoji: "🎯",
    title: "Quiz",
    desc: "Timed MCQs with instant feedback",
    color: "#15803d",
  },
  {
    href: "/pyq",
    emoji: "📋",
    title: "Bihar PYQ",
    desc: "BPSC previous year questions",
    color: "#d97706",
  },
];

const TOOLS = [
  {
    href: "/partner",
    emoji: "🤝",
    title: "Study Partner",
    desc: "Find your accountability partner",
    color: "#15803d",
  },
  {
    href: "/support",
    emoji: "💙",
    title: "Feeling Sad?",
    desc: "Take a breath. We've got you.",
    color: "#6366f1",
  },
  {
    href: "/ask",
    emoji: "🧠",
    title: "Ask Tutor",
    desc: "AI tutor — ask anything, anytime",
    color: "#c06010",
  },
];

export default function HomePage() {
  return (
    <main style={{
      minHeight: "100vh", padding: "34px 0 64px",
      backgroundImage: "linear-gradient(to bottom, rgba(247,242,235,0.84) 0%, rgba(247,242,235,0.90) 40%, rgba(247,242,235,0.95) 75%, rgba(247,242,235,0.99) 100%), url('/bg1.png')",
      backgroundSize: "cover", backgroundPosition: "center",
      backgroundAttachment: "fixed", backgroundRepeat: "no-repeat",
      position: "relative",
    }}>

      {/* ── Grain overlay ─────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "220px 220px",
        opacity: 0.13, mixBlendMode: "multiply",
      }} />

      <FloatingExamTimers />

      {/* ── Exam ticker — fixed below nav ─────────────────────── */}
      <div style={{
        position: "fixed", top: 52, left: 0, right: 0, zIndex: 99,
        overflow: "hidden", height: 32,
        background: "rgba(18,8,2,0.90)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(192,96,16,0.25)",
        display: "flex", alignItems: "center",
      }}>
        <div className="ticker-track" style={{ display: "flex", width: "200%", alignItems: "center" }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
              {["72nd BPSC Prelims", "BPSC AEDO", "BSSC CGL"].map((exam, j) => (
                <span key={j} style={{ display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#d97706", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#f5c87a", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    {exam}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Brand header ─────────────────────────────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "40px 20px 28px", textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        <Image
          src="/logo3.png"
          alt="OneShot GS"
          width={300} height={112}
          style={{ objectFit: "contain", display: "block", marginBottom: 8, mixBlendMode: "multiply" }}
          priority
        />
        <p style={{
          fontSize: 13.5,
          color: "var(--ink-strong)",
          fontWeight: 700,
          lineHeight: 1.7,
          fontStyle: "italic",
          letterSpacing: "0.02em",
          textShadow: "0 2px 12px rgba(255,253,248,1), 0 0px 30px rgba(255,253,248,0.8)",
        }}>
          असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥
        </p>
      </div>

      {/* ── Content section ───────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 14px 8px", position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
          marginBottom: 10, paddingLeft: 4,
        }}>Study Material</p>

        <div className="content-grid">
          {CONTENT.map(item => (
            <Link key={item.href + item.title} href={item.href} className="content-card" style={{
              "--c": item.color,
            } as React.CSSProperties}>
              <span className="card-emoji">{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15.5, fontWeight: 800,
                  color: "var(--ink-strong)",
                  letterSpacing: "-0.03em",
                  marginBottom: 2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.title}</p>
                <p style={{
                  fontSize: 12, color: "var(--ink-soft)",
                  lineHeight: 1.5, fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.desc}</p>
              </div>
              <span className="card-arrow">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tools section ─────────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "24px auto 0", padding: "0 14px", position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
          marginBottom: 10, paddingLeft: 4,
        }}>More on this site</p>

        <div className="tools-grid">
          {TOOLS.map(item => (
            <Link key={item.href} href={item.href} className="tool-card" style={{
              "--c": item.color,
            } as React.CSSProperties}>
              <div className="tool-icon">{item.emoji}</div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 14, fontWeight: 800,
                color: "var(--ink-strong)",
                letterSpacing: "-0.03em",
                marginBottom: 3,
              }}>{item.title}</p>
              <p style={{
                fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.5, fontWeight: 500,
              }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .ticker-track {
          animation: ticker 18s linear infinite;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Content grid — 1 col mobile, 2 col tablet+ */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 540px) {
          .content-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }

        .content-card {
          text-decoration: none;
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,253,248,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.72);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 4px 20px rgba(120,80,30,0.1), 0 1px 4px rgba(120,80,30,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        @media (hover: hover) {
          .content-card:hover {
            transform: translateY(-3px);
            background: rgba(255,253,248,0.98);
            box-shadow: 0 10px 36px rgba(120,80,30,0.16), 0 2px 8px rgba(120,80,30,0.08), inset 0 1px 0 rgba(255,255,255,1);
          }
        }

        .card-emoji {
          font-size: 26px; line-height: 1; flex-shrink: 0;
          width: 46px; height: 46px; border-radius: 14px;
          display: grid; place-items: center;
          background: color-mix(in srgb, var(--c) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
        }

        .card-arrow {
          font-size: 20px; font-weight: 300;
          color: var(--muted); flex-shrink: 0;
          transition: transform 0.13s ease;
        }
        @media (hover: hover) {
          .content-card:hover .card-arrow { transform: translateX(2px); color: var(--c); }
        }

        /* Tools grid — always 3 columns */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .tool-card {
          text-decoration: none;
          background: rgba(255,253,248,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.72);
          border-radius: 18px;
          padding: 16px 14px;
          display: flex; flex-direction: column; align-items: flex-start;
          box-shadow: 0 4px 20px rgba(120,80,30,0.1), 0 1px 4px rgba(120,80,30,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        @media (hover: hover) {
          .tool-card:hover {
            transform: translateY(-3px);
            background: rgba(255,253,248,0.98);
            box-shadow: 0 10px 36px rgba(120,80,30,0.16), 0 2px 8px rgba(120,80,30,0.08), inset 0 1px 0 rgba(255,255,255,1);
          }
        }

        .tool-icon {
          font-size: 24px; line-height: 1; margin-bottom: 10px;
          width: 44px; height: 44px; border-radius: 14px;
          display: grid; place-items: center;
          background: color-mix(in srgb, var(--c) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
        }
      `}</style>
    </main>
  );
}
