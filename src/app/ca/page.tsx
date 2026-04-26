import Link from "next/link";
import { CA_THEMES } from "@/lib/ca-structure";

export default function CALandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <section className="bpsc-hero" style={{ padding: "56px 20px 48px", textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          Current Affairs
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(2rem, 6vw, 3.6rem)",
          lineHeight: 1.06, letterSpacing: "-0.03em",
          color: "var(--ink-strong)",
          maxWidth: 720, margin: "0 auto 10px",
        }}>
          Study by theme
        </h1>
        <p style={{ maxWidth: 720, margin: "0 auto", fontSize: 14, lineHeight: 1.8, color: "var(--ink-soft)" }}>
          1.5 years coverage of current affairs with static linkages.
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "34px 20px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {CA_THEMES.map((theme) => (
            <Link
              key={theme.slug}
              href={`/ca/theme/${theme.slug}`}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: "18px 16px",
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{theme.emoji}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--ink-strong)" }}>
                  {theme.title}
                </h3>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--ink-soft)", marginBottom: 12 }}>{theme.shortTitle} + static links</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                Open months →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
