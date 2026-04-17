import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import MarkComplete from "@/components/MarkComplete";
import BookmarkButton from "@/components/BookmarkButton";
import RecordActivity from "@/components/RecordActivity";
import StickyQuizCTA from "@/components/StickyQuizCTA";

/** Detect if a quiz JSON exists for this set */
async function hasQuiz(month: string, set: string): Promise<boolean> {
  let quizFile = set;
  if (set.endsWith("-english")) quizFile = set.replace(/-english$/, "-quiz-english");
  else if (set.endsWith("-hindi")) quizFile = set.replace(/-hindi$/, "-quiz-hindi");
  else quizFile = set + "-quiz";
  try {
    await fs.access(path.join(process.cwd(), "data", "ca", month, `${quizFile}.json`));
    return true;
  } catch {
    return false;
  }
}

/** Return language badge emoji + label for set name */
function langBadge(set: string): { emoji: string; label: string } | null {
  if (set.endsWith("-english")) return { emoji: "EN", label: "English" };
  if (set.endsWith("-hindi")) return { emoji: "HI", label: "हिंदी" };
  return null;
}

type BpscItem = {
  id: number;
  emoji: string;
  categories: string[];
  title: string;
  summary: string;
  static_linkages: Record<string, string[]>;
  possible_mcq: string;
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
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function setLabel(month: string, s: string) {
  const monthName = new Date(+month.split("-")[0], +month.split("-")[1] - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
  });
  const setNum = s.match(/(\d+)/)?.[1] ?? "1";
  const lang = s.endsWith("-english") ? " English" : s.endsWith("-hindi") ? " Hindi" : "";
  return `${monthName} - Study Set ${setNum}/15${lang}`;
}

export default async function CASetPage({
  params,
}: {
  params: Promise<{ month: string; set: string }>;
}) {
  const { month, set } = await params;
  const filePath = path.join(process.cwd(), "data", "ca", month, `${set}.json`);

  const quizAvailable = await hasQuiz(month, set);
  const lang = langBadge(set);

  let items: BpscItem[] = [];
  try {
    const raw = await fs.readFile(filePath, "utf8");
    items = JSON.parse(raw);
  } catch {
    return (
      <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>Set not found: {month} / {set}</p>
          <Link href="/ca" style={{ color: "var(--accent)", fontSize: 14, fontFamily: "monospace" }}>← Back to all sets</Link>
        </div>
      </main>
    );
  }

  // Compute per-category counts
  const catCounts: Record<string, number> = {};
  for (const item of items) {
    for (const cat of item.categories) {
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    }
  }
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const totalFacts = items.reduce((sum, item) =>
    sum + Object.values(item.static_linkages).flat().length, 0
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <RecordActivity />
      <div className="feed-shell">

        {/* ════════════════════════════════════════
            SLIDE 0 — Cover (minimal)
        ════════════════════════════════════════ */}
        <section className="feed-slide">
          <article className="card-frame" style={{
            display: "flex", flexDirection: "column",
            background: "linear-gradient(160deg, #0c1220 0%, #1a2744 100%)",
          }}>

            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

              {/* Top nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/ca" style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.1em" }}>
                  ← All Sets
                </Link>
                <span style={{ background: "rgba(192,96,16,0.2)", color: "#fbbf24", borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>
                  BPSC 365
                </span>
              </div>

              {/* Centre — title + meta */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(251,191,36,0.6)", marginBottom: 12 }}>
                  {monthLabel(month)}
                </p>
                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 6vw, 3.2rem)",
                  fontWeight: 700, lineHeight: 1.08,
                  color: "#f1f5f9",
                  letterSpacing: "-0.03em",
                  marginBottom: 16,
                }}>
                  {setLabel(month, set)}
                </h1>

                {/* Inline stats */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 20, flexWrap: "wrap" }}>
                  {[
                    `${items.length} Cards`,
                    `${totalFacts}+ Facts`,
                    `~${Math.round(items.length * 1.5)} min`,
                  ].map((s, i) => (
                    <span key={s} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                      {i > 0 && <span style={{ color: "rgba(255,255,255,0.18)", margin: "0 10px" }}>·</span>}
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{s}</span>
                    </span>
                  ))}
                </div>

                {/* Topic pills — compact */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                  {sortedCats.slice(0, 5).map(([cat]) => {
                    const m = CAT[cat];
                    return (
                      <span key={cat} style={{
                        background: `${m?.color}22`,
                        color: m?.color,
                        border: `1px solid ${m?.color}40`,
                        borderRadius: 20, padding: "4px 11px",
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                      }}>
                        {m?.label ?? cat}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom — scroll nudge */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", letterSpacing: "0.18em", marginBottom: 4 }}>
                  SCROLL TO BEGIN
                </p>
                <p style={{ fontSize: 22, color: "rgba(255,255,255,0.2)" }}>↓</p>
              </div>

            </div>
          </article>
        </section>

        {/* ════════════════════════════════════════
            SLIDES 1–N — Content Cards
        ════════════════════════════════════════ */}
        {items.map((item, index) => (
          <section key={item.id} className="feed-slide">
            <article className="card-frame" style={{ display: "flex", flexDirection: "column" }}>
              <div className="card-glow" />

              <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%", gap: 12, minHeight: 0 }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{item.emoji}</span>
                    <div>
                      <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)" }}>
                        {monthLabel(month)} · {setLabel(month, set)}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", marginTop: 2 }}>
                        {index + 1} / {items.length}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 5, maxWidth: "55%" }}>
                    {item.categories.map((cat) => {
                      const m = CAT[cat];
                      return (
                        <span
                          key={cat}
                          style={{
                            background: `${m?.color}14`,
                            color: m?.color,
                            border: `1px solid ${m?.color}44`,
                            borderRadius: 20,
                            padding: "2px 8px",
                            fontSize: 10,
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
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    lineHeight: 1.18,
                    color: "var(--ink-strong)",
                    letterSpacing: "-0.02em",
                    fontSize: "clamp(1.15rem, 2.8vw, 1.75rem)",
                    flexShrink: 0,
                  }}
                >
                  {item.title}
                </h2>

                {/* Summary */}
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--line)",
                    background: "var(--card)",
                    padding: "12px 14px",
                    flexShrink: 0,
                  }}
                >
                  <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                    Summary
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--ink-strong)" }}>{item.summary}</p>
                </div>

                {/* Static Linkages — scrollable */}
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--line)",
                    background: "var(--panel)",
                    padding: "12px 14px",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                  }}
                >
                  <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
                    Static Linkages — Prelims
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {item.categories
                      .filter((cat) => item.static_linkages[cat]?.length)
                      .map((cat) => {
                        const m = CAT[cat];
                        return (
                          <div key={cat}>
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: "0.16em",
                                textTransform: "uppercase",
                                color: m?.color,
                                marginBottom: 8,
                              }}
                            >
                              {m?.label ?? cat}
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                              {item.static_linkages[cat].map((fact, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: m?.color,
                                      flexShrink: 0,
                                      marginTop: 7,
                                    }}
                                  />
                                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-strong)", flex: 1 }}>{fact}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* MCQ */}
                <div
                  style={{
                    borderRadius: 14,
                    border: "1px solid var(--accent)",
                    background: "var(--accent-soft)",
                    padding: "11px 14px",
                    flexShrink: 0,
                  }}
                >
                  <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 5 }}>
                    Likely MCQ
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.55, color: "var(--ink-strong)" }}>
                    {item.possible_mcq}
                  </p>
                </div>

                {/* Actions — sticky bottom of card */}
                <div style={{
                  position: "sticky", bottom: 0, zIndex: 10,
                  display: "flex", justifyContent: "flex-end", gap: 8,
                  padding: "10px 0 4px",
                  background: "linear-gradient(to bottom, transparent, rgba(255,250,240,0.97) 40%)",
                }}>
                  <BookmarkButton
                    month={month}
                    setName={set}
                    cardId={item.id}
                    title={item.title}
                    categories={item.categories}
                  />
                  <MarkComplete
                    month={month}
                    setName={set}
                    cardId={item.id}
                    categories={item.categories}
                  />
                </div>

              </div>
            </article>
          </section>
        ))}

        {/* ════════════════════════════════════════
            END SLIDE — Completion
        ════════════════════════════════════════ */}
        <section className="feed-slide">
          <article className="card-frame" style={{ display: "flex", flexDirection: "column" }}>
            <div className="card-glow" />

            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 0, textAlign: "center" }}>

              <div style={{ fontSize: "2.8rem", marginBottom: 16 }}>🎉</div>

              <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
                Study Complete
              </p>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                  fontWeight: 700,
                  color: "var(--ink-strong)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: 10,
                }}
              >
                {setLabel(month, set)} — Done!
              </h2>

              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 8, maxWidth: 380 }}>
                {items.length} events · {totalFacts}+ static facts · {items.length} MCQs covered
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, maxWidth: 380, fontStyle: "italic" }}>
                Knowledge is only half the battle — now test yourself under exam conditions.
              </p>

              {/* Summary stats */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 40,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {sortedCats.slice(0, 4).map(([cat, count]) => {
                  const m = CAT[cat];
                  return (
                    <div
                      key={cat}
                      style={{
                        border: `1px solid ${m?.color}44`,
                        background: `${m?.color}0e`,
                        borderRadius: 14,
                        padding: "10px 16px",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: m?.color, lineHeight: 1 }}>{count}</p>
                      <p style={{ fontSize: 11, color: m?.color, opacity: 0.8, marginTop: 3, letterSpacing: "0.06em" }}>{m?.label ?? cat}</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 360 }}>
                {quizAvailable ? (
                  <Link
                    href={`/ca/${month}/${set}/quiz`}
                    style={{
                      background: "linear-gradient(135deg, #c06010, #d97706)",
                      color: "#fff",
                      borderRadius: 14,
                      padding: "15px 28px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 16,
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      width: "100%",
                      boxShadow: "0 6px 24px rgba(192,96,16,0.35)",
                    }}
                  >
                    🎯 Take the Quiz Now
                    <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>30 min · −⅓ marking</span>
                  </Link>
                ) : (
                  <div style={{
                    background: "var(--panel)", border: "1px solid var(--line)",
                    borderRadius: 14, padding: "14px 20px", width: "100%", textAlign: "center",
                  }}>
                    <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>⏳ Quiz being prepared</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>Check back in 24 hours</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, width: "100%" }}>
                  <Link
                    href="/ca"
                    style={{
                      flex: 1,
                      border: "1px solid var(--line-hi)", background: "var(--card)",
                      color: "var(--ink-soft)", borderRadius: 11, padding: "11px 16px",
                      fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
                      textDecoration: "none", textAlign: "center", display: "block",
                    }}
                  >
                    Study Sets
                  </Link>
                  <Link
                    href="/quizzes"
                    style={{
                      flex: 1,
                      border: "1px solid var(--line-hi)", background: "var(--card)",
                      color: "var(--ink-soft)", borderRadius: 11, padding: "11px 16px",
                      fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
                      textDecoration: "none", textAlign: "center", display: "block",
                    }}
                  >
                    Quiz Sets
                  </Link>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "monospace", marginTop: 4 }}>
                Scroll up to review any card
              </p>
            </div>
          </article>
        </section>

      </div>

      {quizAvailable && <StickyQuizCTA month={month} set={set} />}
    </main>
  );
}
