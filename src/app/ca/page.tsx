import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

/* ─── Types ──────────────────────────────────────────────────── */
type SetMeta = {
  setNum: number;           // 1, 2, 3 …
  english: { count: number; categories: string[] } | null;
  hindi:   { count: number; categories: string[] } | null;
};

const CAT: Record<string, { label: string; color: string }> = {
  polity:  { label: "Polity",      color: "#b86117" },
  economy: { label: "Economy",     color: "#2d7a4f" },
  history: { label: "History",     color: "#5b4fcf" },
  bihar:   { label: "Bihar Focus", color: "#c04a00" },
  geo:     { label: "Geography",   color: "#0e7490" },
  st:      { label: "Sci & Tech",  color: "#6d28d9" },
  env:     { label: "Environment", color: "#15803d" },
  world:   { label: "World",       color: "#1d4ed8" },
};

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function shortMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
  });
}

/* ─── Load sets grouped by month/setNum ─────────────────────── */
async function loadGroupedSets(): Promise<Record<string, SetMeta[]>> {
  const base = path.join(process.cwd(), "data", "ca");
  const result: Record<string, SetMeta[]> = {};
  const bySetNum: Record<string, Record<number, SetMeta>> = {};

  try {
    const months = (await fs.readdir(base)).sort().reverse();
    for (const month of months) {
      const monthDir = path.join(base, month);
      let files: string[] = [];
      try {
        files = (await fs.readdir(monthDir))
          .filter((f) => f.endsWith(".json") && !f.includes("-quiz"))
          .sort();
      } catch { continue; }

      if (!bySetNum[month]) bySetNum[month] = {};

      for (const file of files) {
        const setName = file.replace(".json", ""); // e.g. set-1-english
        // detect language and set number
        let lang: "english" | "hindi" | null = null;
        let baseSet = setName;
        if (setName.endsWith("-english")) { lang = "english"; baseSet = setName.replace(/-english$/, ""); }
        else if (setName.endsWith("-hindi")) { lang = "hindi";   baseSet = setName.replace(/-hindi$/, ""); }

        // extract set number: set-1 → 1
        const match = baseSet.match(/(\d+)$/);
        const setNum = match ? parseInt(match[1]) : 0;

        try {
          const raw = await fs.readFile(path.join(monthDir, file), "utf8");
          const items: { categories: string[] }[] = JSON.parse(raw);
          const catSet = new Set<string>();
          items.forEach((i) => i.categories.forEach((c) => catSet.add(c)));
          const meta = { count: items.length, categories: [...catSet] };

          if (!bySetNum[month][setNum]) {
            bySetNum[month][setNum] = { setNum, english: null, hindi: null };
          }
          if (lang === "english") bySetNum[month][setNum].english = meta;
          else if (lang === "hindi") bySetNum[month][setNum].hindi = meta;
          else {
            // no lang suffix — treat as english
            bySetNum[month][setNum].english = meta;
          }
        } catch { /* skip */ }
      }

      result[month] = Object.values(bySetNum[month]).sort((a, b) => a.setNum - b.setNum);
    }
  } catch { /* no data yet */ }
  return result;
}

/* ─── Planned months (Apr 2025 → Jun 2026 = 15 months × 15 sets) */
const PLANNED_MONTHS = (() => {
  const months: string[] = [];
  const start = new Date(2025, 3, 1); // April 2025
  const end   = new Date(2026, 3, 1); // Apr 2026
  const cur = new Date(start);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
    cur.setMonth(cur.getMonth() + 1);
  }
  return months.reverse(); // newest first
})();


export default async function CALandingPage() {
  const allSets = await loadGroupedSets();
  const availableMonths = Object.keys(allSets);
  const totalSets = Object.values(allSets).reduce((s, sets) => s + sets.length, 0);
  const totalCards = Object.values(allSets).flat().reduce((s, x) => s + (x.english?.count ?? 0) + (x.hindi?.count ?? 0), 0);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "72px 24px 64px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 20,
          }}
        >
          BPSC Cosmos · Study Sets
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 3.4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--ink-strong)",
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Bihar का शार्पेस्ट<br />
          Current Affairs Engine
        </h1>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--ink-soft)",
            maxWidth: 560,
            margin: "0 auto 36px",
          }}
        >
          One card = one event + static prelims facts + Bihar angle + MCQ.
          Everything BPSC asks, nothing you don't need.
        </p>

        {/* Stats bar */}
        <div
          style={{
            display: "inline-flex",
            gap: 0,
            border: "1px solid var(--line)",
            borderRadius: 16,
            overflow: "hidden",
            background: "var(--card)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { n: "225+", label: "Sets" },
            { n: "6,750+", label: "Cards" },
            { n: "3,375+", label: "Tests" },
            { n: "₹0", label: "Always Free" },
          ].map(({ n, label }, i) => (
            <div
              key={label}
              style={{
                padding: "14px 24px",
                borderLeft: i > 0 ? "1px solid var(--line)" : "none",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {n}
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, letterSpacing: "0.06em" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sources + Training ───────────────────────────────── */}
      <section style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--panel)",
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Training badge — hero of this section */}
          <div style={{
            background: "linear-gradient(135deg, rgba(192,96,16,0.09), rgba(26,39,68,0.09))",
            border: "1px solid var(--accent-border)",
            borderRadius: 18,
            padding: "18px 20px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🏛️</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: 16, color: "var(--ink-strong)", marginBottom: 4,
              }}>
                Trained on 15+ Years of BPSC Prelims — Deep Learning Models
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                Every MCQ direction, every static linkage, every Bihar angle is shaped
                by what Bihar Prelims actually asks. Curated by UPSC/BPSC qualified professionals.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["UPSC Qualified", "BPSC Qualified", "Bihar-Focused", "Always Free"].map(b => (
                <span key={b} style={{
                  background: "var(--card)", border: "1px solid var(--line-hi)",
                  borderRadius: 20, padding: "4px 11px",
                  fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                }}>✓ {b}</span>
              ))}
            </div>
          </div>

          {/* Two-column source grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}>
            {/* Current Affairs sources */}
            <div style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: "20px 18px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📰</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>
                    Current Affairs
                  </p>
                  <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>Curated from trusted sources</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {[
                  "PIB", "The Hindu", "Indian Express", "Hindustan Times",
                  "Yojana", "Kurukshetra", "Down To Earth", "PRS India",
                  "MOSPI / RBI Reports",
                ].map(s => (
                  <span key={s} style={{
                    background: "var(--surface)", border: "1px solid var(--line-hi)",
                    borderRadius: 8, padding: "4px 9px",
                    fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                  }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Static sources */}
            <div style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: "20px 18px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📚</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>
                    Exhaustive Static Linked
                  </p>
                  <p style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.04em" }}>Every card links back to your books</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {[
                  "M. Laxmikant", "Spectrum", "NCERT 6–12", "Majid Husain",
                  "Ramesh Singh", "Nitin Singhania", "G.C. Leong", "Shankar IAS",
                ].map(s => (
                  <span key={s} style={{
                    background: "var(--surface)", border: "1px solid var(--line-hi)",
                    borderRadius: 8, padding: "4px 9px",
                    fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* What each card has */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 10,
          }}>
            {[
              { icon: "🗞️", label: "News Summary",     sub: "What happened & why it matters" },
              { icon: "🔗", label: "Static Links",      sub: "Laxmikant / NCERT chapter tagged" },
              { icon: "🗺️", label: "Bihar Angle",       sub: "State-specific hook in every card" },
              { icon: "🎯", label: "Likely MCQ",        sub: "Exact BPSC-style question per card" },
              { icon: "⏱️", label: "Quiz at the End",   sub: "30-min · −⅓ · extrapolated to /150" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{
                background: "var(--card)", border: "1px solid var(--line)",
                borderRadius: 14, padding: "14px 14px",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-strong)", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Sets grid ────────────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "64px 24px 96px" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 40,
          }}
        >
          Study Sets — Apr 2025 to Apr 2026 · 15 Sets Each
        </p>

        <AdBanner />

        {PLANNED_MONTHS.map((month) => {
          const liveSets = allSets[month] ?? [];
          const liveByNum: Record<number, SetMeta> = {};
          liveSets.forEach((s) => { liveByNum[s.setNum] = s; });

          return (
            <div key={month} style={{ marginBottom: 56 }}>
              {/* Month heading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--ink-strong)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {monthLabel(month)}
                </h2>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "monospace" }}>
                  {liveSets.length}/15 sets live
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                  gap: 14,
                }}
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
                  const live = liveByNum[num];

                  if (!live) {
                    /* Pending slot */
                    return (
                      <div
                        key={num}
                        style={{
                          border: "1px dashed rgba(120,80,30,0.15)",
                          borderRadius: 20,
                          padding: "18px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 120,
                          background: "transparent",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: 14,
                              color: "var(--muted)",
                              marginBottom: 3,
                            }}
                          >
                            {shortMonthLabel(month)} - Study Set {num}/15
                          </p>
                          <p style={{ fontSize: 11, color: "var(--line-hi)", letterSpacing: "0.06em" }}>
                            Coming soon
                          </p>
                        </div>
                      </div>
                    );
                  }

                  /* Live set — show both language links */
                  const cats = [
                    ...(live.english?.categories ?? []),
                    ...(live.hindi?.categories ?? []),
                  ].filter((c, i, arr) => arr.indexOf(c) === i).slice(0, 5);

                  return (
                    <div
                      key={num}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 20,
                        padding: "18px 16px",
                        background: "var(--card)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "var(--ink-strong)",
                          }}
                        >
                          {shortMonthLabel(month)} - Study Set {num}/15
                        </p>
                        <span
                          style={{
                            background: "var(--accent-soft)",
                            color: "var(--accent)",
                            borderRadius: 20,
                            padding: "2px 9px",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                          }}
                        >
                          LIVE
                        </span>
                      </div>

                      {/* Category pills */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {cats.map((cat) => {
                          const m = CAT[cat];
                          return (
                            <span
                              key={cat}
                              style={{
                                background: `${m?.color}14`,
                                color: m?.color,
                                border: `1px solid ${m?.color}33`,
                                borderRadius: 20,
                                padding: "2px 8px",
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                              }}
                            >
                              {m?.label ?? cat}
                            </span>
                          );
                        })}
                      </div>

                      {/* Language links */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: "auto" }}>
                        {live.english && (
                          <Link
                            href={`/ca/${month}/set-${num}-english`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "var(--panel)",
                              border: "1px solid var(--line)",
                              borderRadius: 10,
                              padding: "9px 12px",
                              textDecoration: "none",
                            }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-strong)" }}>
                              English
                            </span>
                            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>
                              {live.english.count} cards →
                            </span>
                          </Link>
                        )}
                        {live.hindi && (
                          <Link
                            href={`/ca/${month}/set-${num}-hindi`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "linear-gradient(135deg, rgba(192,96,16,0.06), rgba(217,119,6,0.06))",
                              border: "1px solid rgba(192,96,16,0.2)",
                              borderRadius: 10,
                              padding: "9px 12px",
                              textDecoration: "none",
                            }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-strong)" }}>
                              हिंदी
                            </span>
                            <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>
                              {live.hindi.count} cards →
                            </span>
                          </Link>
                        )}
                        {!live.english && !live.hindi && (
                          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                            Content loading…
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--line)", background: "var(--card)",
        padding: "24px 20px", textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Made with <span style={{ color: "#e11d48" }}>❤️</span> for Bihar aspirants
        </p>
      </footer>

    </main>
  );
}
