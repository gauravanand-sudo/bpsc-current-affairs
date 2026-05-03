import Link from "next/link";

const SUBJECTS = [
  { key: "geo",      label: "Bihar Geography",  emoji: "🗺️", yt: "", pdf: "" },
  { key: "economy",  label: "Bihar Economy",    emoji: "📊",  yt: "", pdf: "" },
  { key: "polity",   label: "Bihar Polity",     emoji: "⚖️",  yt: "", pdf: "" },
];

export default function BiharGSPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      {/* Hero */}
      <section style={{
        padding: "56px 20px 44px",
        textAlign: "center",
        borderBottom: "1px solid var(--line)",
      }}>
        <p style={{
          fontFamily: "monospace", fontSize: 10,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "var(--muted)", marginBottom: 14,
        }}>
          State GS
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.9rem, 5.5vw, 3rem)",
          lineHeight: 1.08, letterSpacing: "-0.03em",
          color: "var(--ink-strong)",
          maxWidth: 680, margin: "0 auto 12px",
        }}>
          Bihar GS
        </h1>
        <p style={{
          maxWidth: 480, margin: "0 auto",
          fontSize: 14, lineHeight: 1.8, color: "var(--ink-soft)",
        }}>
          Video lectures & PDF notes for Bihar-specific GS preparation
        </p>
        <div style={{ marginTop: 22 }}>
          <Link href="/" style={{
            fontSize: 13, fontWeight: 600,
            color: "var(--accent)", textDecoration: "none",
          }}>
            ← Home
          </Link>
        </div>
      </section>

      {/* Subject cards */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "36px 16px 72px" }}>
        <div className="subjects-grid">
          {SUBJECTS.map((sub) => {
            const hasYt = !!sub.yt;
            const hasPdf = !!sub.pdf;
            return (
              <div key={sub.key} className="subject-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{
                    fontSize: 26, width: 48, height: 48,
                    borderRadius: 13, display: "grid", placeItems: "center",
                    background: "color-mix(in srgb, #b91c1c 10%, transparent)",
                    border: "1px solid color-mix(in srgb, #b91c1c 20%, transparent)",
                    flexShrink: 0,
                  }}>{sub.emoji}</span>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17, fontWeight: 800,
                    color: "var(--ink-strong)",
                    letterSpacing: "-0.025em",
                  }}>{sub.label}</p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {hasYt ? (
                    <a href={sub.yt} target="_blank" rel="noopener noreferrer" className="btn-yt">
                      <YtIcon /> Watch Lecture
                    </a>
                  ) : (
                    <span className="btn-yt btn-off"><YtIcon /> Coming Soon</span>
                  )}
                  {hasPdf ? (
                    <a href={sub.pdf} target="_blank" rel="noopener noreferrer" className="btn-pdf">
                      <DlIcon /> Download PDF
                    </a>
                  ) : (
                    <span className="btn-pdf btn-off"><DlIcon /> Coming Soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .subjects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 500px) {
          .subjects-grid { grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        }

        .subject-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 20px 18px 18px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .subject-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 32px rgba(185,28,28,0.10);
          }
        }

        .btn-yt, .btn-pdf {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 13px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          flex: 1;
          justify-content: center;
          white-space: nowrap;
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .btn-yt {
          background: #ff2a2a;
          color: #fff;
        }
        @media (hover: hover) {
          .btn-yt:not(.btn-off):hover { opacity: 0.85; transform: translateY(-1px); }
        }
        .btn-pdf {
          background: color-mix(in srgb, #b91c1c 12%, transparent);
          color: #b91c1c;
          border: 1px solid color-mix(in srgb, #b91c1c 25%, transparent);
        }
        @media (hover: hover) {
          .btn-pdf:not(.btn-off):hover { opacity: 0.78; transform: translateY(-1px); }
        }
        .btn-off {
          opacity: 0.35;
          cursor: default;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}

function YtIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
    </svg>
  );
}

function DlIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
