import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

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
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

type QuizMeta = {
  setNum: number;
  english: boolean;
  hindi: boolean;
  categories: string[];
};

async function loadQuizMeta(): Promise<Record<string, QuizMeta[]>> {
  const base = path.join(process.cwd(), "data", "ca");
  const result: Record<string, Record<number, QuizMeta>> = {};
  try {
    const months = (await fs.readdir(base)).sort().reverse();
    for (const month of months) {
      const dir = path.join(base, month);
      let files: string[] = [];
      try { files = await fs.readdir(dir); } catch { continue; }
      result[month] = {};
      for (const file of files) {
        // Only quiz files
        const m = file.match(/^set-(\d+)-quiz-(english|hindi)\.json$/);
        if (!m) continue;
        const num = parseInt(m[1]);
        const lang = m[2] as "english" | "hindi";
        try {
          if (!result[month][num]) {
            result[month][num] = { setNum: num, english: false, hindi: false, categories: [] };
          }
          result[month][num][lang] = true;
        } catch { /* skip */ }
      }
      // Also pull categories from content file
      for (const num of Object.keys(result[month])) {
        const n = parseInt(num);
        for (const lang of ["english", "hindi"]) {
          const cPath = path.join(dir, `set-${n}-${lang}.json`);
          try {
            const raw = await fs.readFile(cPath, "utf8");
            const items: { categories: string[] }[] = JSON.parse(raw);
            const cats = new Set<string>(result[month][n].categories);
            items.forEach(i => i.categories?.forEach(c => cats.add(c)));
            result[month][n].categories = [...cats];
          } catch { /* skip */ }
        }
      }
    }
  } catch { /* no data */ }
  return Object.fromEntries(
    Object.entries(result).map(([m, byNum]) => [
      m,
      Object.values(byNum).sort((a, b) => a.setNum - b.setNum),
    ])
  );
}

// Planned months descending
const PLANNED_MONTHS = (() => {
  const months: string[] = [];
  const start = new Date(2025, 3, 1);
  const end   = new Date(2026, 3, 1); // Apr 2026
  const cur = new Date(start);
  while (cur <= end) {
    months.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`);
    cur.setMonth(cur.getMonth() + 1);
  }
  return months.reverse();
})();

export default async function QuizzesPage() {
  const meta = await loadQuizMeta();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "56px 24px 48px", textAlign: "center" }}>
        <p style={{
          fontFamily: "monospace", fontSize: 11, letterSpacing: "0.32em",
          textTransform: "uppercase", color: "var(--accent)", marginBottom: 16,
        }}>
          BPSC 365 · Quiz Sets
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 5vw, 3rem)",
          fontWeight: 700, lineHeight: 1.1, color: "var(--ink-strong)",
          letterSpacing: "-0.02em", marginBottom: 14,
        }}>
          Test Yourself — BPSC Style
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 12px" }}>
          30-min timer · −⅓ negative marking · Score extrapolated to /150
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 0 }}>
          Finish the study set first, then take the quiz.
        </p>
      </section>

      {/* Quiz grid */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <p style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 40,
        }}>
          Quiz Sets — Apr 2025 to Apr 2026 · 15 Sets Each
        </p>

        {PLANNED_MONTHS.map(month => {
          const sets = meta[month] ?? [];
          const liveByNum: Record<number, QuizMeta> = {};
          sets.forEach(s => { liveByNum[s.setNum] = s; });
          const liveCount = sets.filter(s => s.english || s.hindi).length;

          return (
            <div key={month} style={{ marginBottom: 52 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                  color: "var(--ink-strong)", letterSpacing: "-0.01em",
                }}>
                  {monthLabel(month)}
                </h2>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "monospace" }}>
                  {liveCount}/15 quizzes available
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 14,
              }}>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(num => {
                  const live = liveByNum[num];
                  const hasAny = live && (live.english || live.hindi);

                  if (!hasAny) {
                    return (
                      <div key={num} style={{
                        border: "1px dashed rgba(120,80,30,0.15)",
                        borderRadius: 20, padding: "18px 16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        minHeight: 110,
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--muted)", marginBottom: 3 }}>
                            Quiz {num}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--line-hi)", letterSpacing: "0.06em" }}>Coming soon</p>
                        </div>
                      </div>
                    );
                  }

                  const cats = (live.categories ?? []).slice(0, 4);

                  return (
                    <div key={num} style={{
                      border: "1px solid var(--line)",
                      borderRadius: 20, padding: "18px 16px",
                      background: "var(--card)",
                      display: "flex", flexDirection: "column", gap: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-strong)" }}>
                          Quiz {num}
                        </p>
                        <span style={{
                          background: "rgba(22,163,74,0.1)", color: "#16a34a",
                          border: "1px solid rgba(22,163,74,0.25)",
                          borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
                        }}>
                          LIVE
                        </span>
                      </div>

                      {cats.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {cats.map(cat => {
                            const c = CAT[cat];
                            return (
                              <span key={cat} style={{
                                background: `${c?.color}14`, color: c?.color,
                                border: `1px solid ${c?.color}33`,
                                borderRadius: 20, padding: "2px 8px",
                                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                              }}>
                                {c?.label ?? cat}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: "auto" }}>
                        {live.english && (
                          <Link href={`/ca/${month}/set-${num}-english/quiz`} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            background: "linear-gradient(135deg, rgba(192,96,16,0.08), rgba(217,119,6,0.06))",
                            border: "1px solid rgba(192,96,16,0.2)",
                            borderRadius: 10, padding: "9px 12px", textDecoration: "none",
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>
                              Quiz — English
                            </span>
                            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>Start →</span>
                          </Link>
                        )}
                        {live.hindi && (
                          <Link href={`/ca/${month}/set-${num}-hindi/quiz`} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            background: "var(--panel)",
                            border: "1px solid var(--line-hi)",
                            borderRadius: 10, padding: "9px 12px", textDecoration: "none",
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>
                              Quiz — हिंदी
                            </span>
                            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>Start →</span>
                          </Link>
                        )}

                        {/* Also study first nudge */}
                        <Link href={`/ca/${month}/set-${num}-${live.english ? "english" : "hindi"}`} style={{
                          fontSize: 11, color: "var(--muted)", textDecoration: "none",
                          textAlign: "center", letterSpacing: "0.04em",
                        }}>
                          📖 Study the set first →
                        </Link>
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
