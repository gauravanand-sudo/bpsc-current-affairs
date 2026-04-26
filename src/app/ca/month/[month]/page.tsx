import Link from "next/link";
import { notFound } from "next/navigation";
import { MONTH_PLANS, SET_BLUEPRINTS, monthCodeToLabel, getThemeBySlug } from "@/lib/ca-structure";

export function generateStaticParams() {
  return MONTH_PLANS.map((month) => ({ month: month.slug }));
}

export default async function MonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ month: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const { month } = await params;
  const { theme: themeSlug } = await searchParams;
  const monthMeta = MONTH_PLANS.find((item) => item.slug === month);
  if (!monthMeta) notFound();
  const theme = themeSlug ? getThemeBySlug(themeSlug) : null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <section className="bpsc-hero" style={{ padding: "44px 20px 34px", textAlign: "center", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link href={theme ? `/ca/theme/${theme.slug}` : "/ca"} style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.12em", color: "var(--muted)" }}>
            ← Back
          </Link>

          {theme ? <div style={{ marginTop: 18, marginBottom: 8, fontSize: 34 }}>{theme.emoji}</div> : null}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3.4rem)", lineHeight: 1.06, letterSpacing: "-0.03em", color: "var(--ink-strong)", marginBottom: 10 }}>
            {monthCodeToLabel(month)}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--ink-soft)", maxWidth: 620, margin: "0 auto" }}>
            {theme ? `${theme.title} · 5 sets` : "5 sets"}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "34px 20px 48px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
          Sets
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
          Choose set ↓
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {SET_BLUEPRINTS.map((set) => (
            <Link
              key={set.number}
              href={`/ca/${month}/set-${set.number}-english`}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 20,
                padding: "18px 16px",
                textDecoration: "none",
              }}
            >
              <p style={{ fontSize: 22, marginBottom: 8 }}>{theme?.emoji ?? "📚"}</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-strong)", marginBottom: 6 }}>
                Set {set.number}
              </p>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 12 }}>
                {set.title}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                Open set →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
