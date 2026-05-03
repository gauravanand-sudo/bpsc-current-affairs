import Link from "next/link";
import Image from "next/image";

const CONTENT = [
  {
    href: "/ca/lectures",
    emoji: "📰",
    title: "Current Affairs",
    desc: "Month-wise lectures & PDF notes",
    color: "#c06010",
  },
  {
    href: "/ghatnachakra",
    emoji: "📕",
    title: "GS Ghatnachakra",
    desc: "Subject-wise lectures & PDF notes",
    color: "#6366f1",
  },
  {
    href: "/bihar-gs",
    emoji: "🗺️",
    title: "Bihar GS",
    desc: "Bihar Geo, Economy & Polity notes",
    color: "#b91c1c",
  },
  {
    href: "/ncert",
    emoji: "📗",
    title: "NCERT",
    desc: "Subject-wise lectures & PDF notes",
    color: "#0891b2",
  },
  {
    href: "/lucent-gk",
    emoji: "📘",
    title: "Lucent GK",
    desc: "Subject-wise lectures & PDF notes",
    color: "#7c3aed",
  },
  {
    href: "/pyq",
    emoji: "📋",
    title: "Bihar PYQ",
    desc: "BPSC previous year questions",
    color: "#d97706",
  },
];

export default function StudyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      {/* Header */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 0", textAlign: "center" }}>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 20, letterSpacing: "-0.025em",
          color: "var(--ink-strong)", marginBottom: 4,
        }}>Study Material</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Only what scores. Zero fluff, zero filler.
        </p>
      </div>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "14px 16px 72px" }}>
        <div className="content-grid">
          {CONTENT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="content-card"
              style={{ "--c": item.color } as React.CSSProperties}
            >
              <span className="card-emoji">{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15.5, fontWeight: 800,
                  color: "var(--ink-strong)", letterSpacing: "-0.03em",
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

      <style>{`
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
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 14px 16px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .content-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 36px rgba(120,80,30,0.12);
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
      `}</style>
    </main>
  );
}
