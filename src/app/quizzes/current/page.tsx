import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import QuizSetCard from "@/components/QuizSetCard";
import CollapsibleMonth from "@/components/CollapsibleMonth";

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

type QuizMeta = { setNum: number; english: boolean; hindi: boolean; categories: string[] };

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
        const m = file.match(/^set-(\d+)-quiz-(english|hindi)\.json$/);
        if (!m) continue;
        const num = parseInt(m[1]);
        const lang = m[2] as "english" | "hindi";
        if (!result[month][num]) result[month][num] = { setNum: num, english: false, hindi: false, categories: [] };
        result[month][num][lang] = true;
      }
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
    Object.entries(result).map(([m, byNum]) => [m, Object.values(byNum).sort((a, b) => a.setNum - b.setNum)])
  );
}

const PLANNED_MONTHS = (() => {
  const months: string[] = [];
  const start = new Date(2025, 3, 1);
  const end   = new Date(2026, 3, 1);
  const cur = new Date(start);
  while (cur <= end) {
    months.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`);
    cur.setMonth(cur.getMonth() + 1);
  }
  return months.reverse();
})();

export default async function CurrentQuizPage() {
  const meta = await loadQuizMeta();

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 0", textAlign: "center", position: "relative" }}>
        <Link href="/quizzes" style={{ position: "absolute", right: 16, top: 20, fontSize: 12.5, fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>← Back</Link>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.025em", color: "var(--ink-strong)", marginBottom: 4 }}>Current Affairs Quiz</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>Only what scores. Zero fluff, zero filler.</p>
      </div>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <p style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 40,
        }}>Apr 2025 – Apr 2026 · 15 Sets Each</p>

        {PLANNED_MONTHS.map((month, idx) => {
          const sets = meta[month] ?? [];
          const liveByNum: Record<number, QuizMeta> = {};
          sets.forEach(s => { liveByNum[s.setNum] = s; });
          const liveCount = sets.filter(s => s.english || s.hindi).length;
          return (
            <CollapsibleMonth key={month} label={monthLabel(month)} liveCount={liveCount} totalPlanned={15} defaultOpen={idx === 0}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(num => {
                  const live = liveByNum[num];
                  const hasAny = live && (live.english || live.hindi);
                  if (!hasAny) {
                    return (
                      <div key={num} style={{
                        border: "1px dashed rgba(120,80,30,0.15)",
                        borderRadius: 20, padding: "18px 16px",
                        display: "flex", alignItems: "center", justifyContent: "center", minHeight: 110,
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--muted)", marginBottom: 3 }}>Quiz {num}</p>
                          <p style={{ fontSize: 11, color: "var(--line-hi)", letterSpacing: "0.06em" }}>Coming soon</p>
                        </div>
                      </div>
                    );
                  }
                  return <QuizSetCard key={num} month={month} num={num} cats={live.categories ?? []} />;
                })}
              </div>
            </CollapsibleMonth>
          );
        })}
      </section>
    </main>
  );
}
