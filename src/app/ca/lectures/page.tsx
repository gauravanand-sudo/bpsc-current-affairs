import Link from "next/link";
import Image from "next/image";

const SECTIONS = [
  { key: "polity",      label: "Polity",                    emoji: "⚖️"  },
  { key: "economics",   label: "Economics",                  emoji: "📊"  },
  { key: "environment", label: "Environment",                emoji: "🌿"  },
  { key: "st",          label: "Science & Tech",             emoji: "🔬"  },
  { key: "ir",          label: "International Relations",    emoji: "🌍"  },
  { key: "geo",         label: "Geography",                  emoji: "🗺️" },
  { key: "culture",     label: "Culture / Society / History",emoji: "🏛️" },
];

type SectionLinks = { yt: string; pdf: string };
type MonthData = {
  label: string;
  emoji: string;
  sections: Record<string, SectionLinks>;
};

const empty = (): SectionLinks => ({ yt: "", pdf: "" });
const emptySections = () =>
  Object.fromEntries(SECTIONS.map((s) => [s.key, empty()]));

const MONTHS: MonthData[] = [
  { label: "June 2025",      emoji: "☀️",  sections: { ...emptySections(), polity: { yt: "", pdf: "https://drive.google.com/file/d/1-lWB0usLdLRbZ8s4tDgLYtkO3w5jCw7J/view?usp=sharing" } } },
  { label: "July 2025",      emoji: "🌧️",  sections: emptySections() },
  { label: "August 2025",    emoji: "🎑",  sections: emptySections() },
  { label: "September 2025", emoji: "🍂",  sections: emptySections() },
  { label: "October 2025",   emoji: "🏮",  sections: emptySections() },
  { label: "November 2025",  emoji: "🌾",  sections: emptySections() },
  { label: "December 2025",  emoji: "❄️",  sections: emptySections() },
  { label: "January 2026",   emoji: "🎊",  sections: emptySections() },
  { label: "February 2026",  emoji: "🌸",  sections: emptySections() },
  { label: "March 2026",     emoji: "🌿",  sections: emptySections() },
  { label: "April 2026",     emoji: "🌻",  sections: emptySections() },
];

export default function CALecturesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 16px 0", textAlign: "center", position: "relative" }}>
        <Link href="/study" style={{ position: "absolute", right: 16, top: 20, fontSize: 12.5, fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>← Back</Link>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: 20, letterSpacing: "-0.025em",
          color: "var(--ink-strong)", marginBottom: 4,
        }}>Current Affairs</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Only what scores. Zero fluff, zero filler.
        </p>
      </div>

      {/* Month cards */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "14px 16px 72px" }}>
        <div className="months-grid">
          {MONTHS.map((month) => (
            <div key={month.label} className="month-card">
              {/* Month header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 11,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid var(--line)",
              }}>
                <span style={{
                  fontSize: 24, width: 44, height: 44,
                  borderRadius: 12, display: "grid", placeItems: "center",
                  background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
                  flexShrink: 0,
                }}>{month.emoji}</span>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17, fontWeight: 800,
                  color: "var(--ink-strong)",
                  letterSpacing: "-0.025em",
                }}>{month.label}</p>
              </div>

              {/* Sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SECTIONS.map((sec) => {
                  const links = month.sections[sec.key];
                  const hasYt = !!links.yt;
                  const hasPdf = !!links.pdf;
                  return (
                    <div key={sec.key} className="section-row">
                      {/* Subject label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{sec.emoji}</span>
                        <span style={{
                          fontSize: 12.5, fontWeight: 700,
                          color: "var(--ink-soft)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{sec.label}</span>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 6 }}>
                        {hasYt ? (
                          <a href={links.yt} target="_blank" rel="noopener noreferrer" className="pill-yt">
                            <YtIcon /> Lecture
                          </a>
                        ) : (
                          <span className="pill-yt pill-off"><YtIcon /> Lecture</span>
                        )}
                        {hasPdf ? (
                          <a href={links.pdf} target="_blank" rel="noopener noreferrer" className="pill-pdf">
                            <DlIcon /> PDF
                          </a>
                        ) : (
                          <span className="pill-pdf pill-off"><DlIcon /> PDF</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .months-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 600px) {
          .months-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .months-grid { grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        }

        .month-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 18px 16px 16px;
          transition: box-shadow 0.15s ease, transform 0.15s ease;
        }
        @media (hover: hover) {
          .month-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(120,80,30,0.11);
          }
        }

        .section-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px 8px;
          padding: 6px 8px;
          border-radius: 10px;
          background: color-mix(in srgb, var(--accent) 4%, transparent);
        }

        .pill-yt, .pill-pdf {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.12s ease;
        }

        .pill-yt {
          background: #ff2a2a;
          color: #fff;
        }
        @media (hover: hover) {
          .pill-yt:not(.pill-off):hover { opacity: 0.82; }
        }

        .pill-pdf {
          background: color-mix(in srgb, var(--accent) 13%, transparent);
          color: var(--accent);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
        }
        @media (hover: hover) {
          .pill-pdf:not(.pill-off):hover { opacity: 0.75; }
        }

        .pill-off {
          opacity: 0.32;
          cursor: default;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}

function YtIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
    </svg>
  );
}

function DlIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
