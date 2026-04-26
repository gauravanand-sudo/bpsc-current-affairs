import Link from "next/link";
import { notFound } from "next/navigation";
import { CA_THEMES, MONTH_PLANS, getThemeBySlug } from "@/lib/ca-structure";

export function generateStaticParams() {
  return CA_THEMES.map((theme) => ({ theme: theme.slug }));
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: themeSlug } = await params;
  const theme = getThemeBySlug(themeSlug);
  if (!theme) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <section className="bpsc-hero" style={{ padding: "44px 20px 34px", textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <Link href="/ca" style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>
          ← Back to themes
        </Link>

        <div style={{ marginTop: 18, marginBottom: 10, fontSize: 38 }}>{theme.emoji}</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 6vw, 3.4rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "var(--ink-strong)",
            marginBottom: 10,
          }}
        >
          {theme.title}
        </h1>
        <p style={{ maxWidth: 620, margin: "0 auto", fontSize: 14, lineHeight: 1.8, color: "var(--ink-soft)" }}>
          {theme.description}
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "34px 20px 48px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
          Months
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 4vw, 2.1rem)",
            lineHeight: 1.15,
            color: "var(--ink-strong)",
            marginBottom: 20,
          }}
        >
          Choose month ↓
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {MONTH_PLANS.map((month) => (
            <Link
              key={month.slug}
              href={`/ca/month/${month.slug}?theme=${theme.slug}`}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: "18px 16px",
                textDecoration: "none",
              }}
            >
              <p style={{ fontSize: 20, marginBottom: 8 }}>{theme.emoji}</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-strong)", marginBottom: 6 }}>
                {month.label}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 12 }}>
                {theme.shortTitle} coverage
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                Open month →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
