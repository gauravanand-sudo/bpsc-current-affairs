import Link from "next/link";
import Image from "next/image";

const SUBJECTS = [
  { key: "ancient",   label: "Ancient History",          emoji: "🏺",  yt: "", pdf: "" },
  { key: "medieval",  label: "Medieval History",         emoji: "🕌",  yt: "", pdf: "" },
  { key: "modern",    label: "Modern History",           emoji: "📜",  yt: "", pdf: "" },
  { key: "geo-india", label: "Indian Geography",         emoji: "🗺️", yt: "", pdf: "" },
  { key: "geo-world", label: "World Geography",          emoji: "🌍",  yt: "", pdf: "" },
  { key: "polity",    label: "Indian Polity",            emoji: "⚖️",  yt: "", pdf: "" },
  { key: "economy",   label: "Indian Economy",           emoji: "📊",  yt: "", pdf: "" },
  { key: "sociology", label: "Sociology",                emoji: "🤝",  yt: "", pdf: "" },
  { key: "physics",   label: "Physics",                  emoji: "⚡",  yt: "", pdf: "" },
  { key: "chemistry", label: "Chemistry",                emoji: "🧪",  yt: "", pdf: "" },
  { key: "biology",   label: "Biology",                  emoji: "🧬",  yt: "", pdf: "" },
  { key: "environment", label: "Environment & Ecology",  emoji: "🌿",  yt: "", pdf: "" },
];

export default function NCERTPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 16px 0", textAlign: "center", position: "relative" }}>
        <Link href="/study" style={{ position: "absolute", right: 16, top: 20, fontSize: 12.5, fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>← Back</Link>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 20, letterSpacing: "-0.025em",
          color: "var(--ink-strong)", marginBottom: 4,
        }}>NCERT</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Only what scores. Zero fluff, zero filler.
        </p>
      </div>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "14px 16px 72px" }}>
        <div className="subjects-grid">
          {SUBJECTS.map((sub) => {
            const hasYt = !!sub.yt;
            const hasPdf = !!sub.pdf;
            return (
              <div key={sub.key} className="subject-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{
                    fontSize: 24, width: 46, height: 46,
                    borderRadius: 13, display: "grid", placeItems: "center",
                    background: "color-mix(in srgb, #0891b2 10%, transparent)",
                    border: "1px solid color-mix(in srgb, #0891b2 20%, transparent)",
                    flexShrink: 0,
                  }}>{sub.emoji}</span>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15.5, fontWeight: 800,
                    color: "var(--ink-strong)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.3,
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
          .subjects-grid { grid-template-columns: 1fr 1fr; gap: 13px; }
        }
        @media (min-width: 780px) {
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
            box-shadow: 0 10px 32px rgba(8,145,178,0.10);
          }
        }
        .btn-yt, .btn-pdf {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 13px; border-radius: 10px;
          font-size: 12.5px; font-weight: 700; text-decoration: none;
          flex: 1; justify-content: center; white-space: nowrap;
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .btn-yt { background: #ff2a2a; color: #fff; }
        @media (hover: hover) {
          .btn-yt:not(.btn-off):hover { opacity: 0.85; transform: translateY(-1px); }
        }
        .btn-pdf {
          background: color-mix(in srgb, #0891b2 12%, transparent);
          color: #0891b2;
          border: 1px solid color-mix(in srgb, #0891b2 25%, transparent);
        }
        @media (hover: hover) {
          .btn-pdf:not(.btn-off):hover { opacity: 0.78; transform: translateY(-1px); }
        }
        .btn-off { opacity: 0.35; cursor: default; pointer-events: none; }
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
