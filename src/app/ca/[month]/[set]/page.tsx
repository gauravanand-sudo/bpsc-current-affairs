import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import MarkComplete from "@/components/MarkComplete";
import BookmarkButton from "@/components/BookmarkButton";
import RecordActivity from "@/components/RecordActivity";

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
            SLIDE 0 — Cover
        ════════════════════════════════════════ */}
        <section className="feed-slide">
          <article className="card-frame" style={{ display: "flex", flexDirection: "column" }}>
            <div className="card-glow" />

            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>

              {/* Top nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexShrink: 0 }}>
                <Link
                  href="/ca"
                  style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.1em" }}
                >
                  ← All Sets
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {lang && (
                    <span
                      style={{
                        background: "var(--chip)", color: "var(--ink-soft)",
                        borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {lang.emoji}
                    </span>
                  )}
                  <span
                    style={{
                      background: "var(--accent-soft)", color: "var(--accent)",
                      borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    }}
                  >
                    BPSC 365
                  </span>
                </div>
              </div>

              {/* Month + Set label */}
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 8 }}>
                  {monthLabel(month)}
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.4rem, 7vw, 4rem)",
                    fontWeight: 700,
                    lineHeight: 1.05,
                    color: "var(--ink-strong)",
                    letterSpacing: "-0.03em",
                    marginBottom: 4,
                  }}
                >
                  {setLabel(month, set)}
                </h1>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 28 }}>
                  Current Affairs + Exhaustive Static Linked
                </p>
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 28,
                  flexShrink: 0,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { n: items.length.toString(), label: "Cards" },
                  { n: `${totalFacts}+`, label: "Facts" },
                  { n: items.length.toString(), label: "MCQs" },
                  { n: `~${Math.round(items.length * 1.5)} min`, label: "Est. time" },
                ].map(({ n, label }) => (
                  <div
                    key={label}
                    style={{
                      flex: "1 1 60px",
                      border: "1px solid var(--line)",
                      borderRadius: 14,
                      padding: "12px 10px",
                      textAlign: "center",
                      background: "var(--card)",
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{n}</p>
                    <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: "0.08em" }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Category breakdown */}
              <div
                style={{
                  flex: 1,
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  padding: "18px 16px",
                  background: "var(--panel)",
                  minHeight: 0,
                }}
              >
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                  Topics Covered
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sortedCats.map(([cat, count]) => {
                    const m = CAT[cat];
                    return (
                      <span
                        key={cat}
                        style={{
                          background: `${m?.color}14`,
                          color: m?.color,
                          border: `1px solid ${m?.color}40`,
                          borderRadius: 20,
                          padding: "5px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {m?.label ?? cat}
                        <span style={{ opacity: 0.65, fontWeight: 400, fontSize: 11 }}>{count}</span>
                      </span>
                    );
                  })}
                </div>

                {/* What's inside */}
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { icon: "📰", text: "Current affairs from PIB · The Hindu · Indian Express · Yojana · Kurukshetra" },
                    { icon: "📚", text: "Static facts from Laxmikant · Spectrum · NCERT · Majid Husain · G.C. Leong" },
                    { icon: "🗺️", text: "Bihar angle — schemes, data, geography hooks — in every card" },
                    { icon: "🎯", text: "One likely MCQ per card — exact BPSC format" },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Training badge */}
                <div style={{
                  marginTop: 14,
                  background: "linear-gradient(135deg, rgba(192,96,16,0.07), rgba(26,39,68,0.07))",
                  border: "1px solid var(--accent-border)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>🏛️</span>
                  <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.55 }}>
                    <strong style={{ color: "var(--ink-strong)" }}>Trained on 15 Years of BPSC Prelims</strong> using deep learning models — every MCQ direction, static link, and Bihar angle is shaped by what Bihar actually asks.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: 20, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{
                  display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center",
                  background: "var(--panel)", borderRadius: 14, padding: "12px 16px",
                  border: "1px solid var(--line)", width: "100%",
                }}>
                  {[
                    "📖 Read each card carefully",
                    "📌 Note static facts",
                    "🎯 Quiz waits at the end",
                  ].map(tip => (
                    <span key={tip} style={{ fontSize: 12, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>{tip}</span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                  ↓ scroll to begin
                </p>
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
    </main>
  );
}
