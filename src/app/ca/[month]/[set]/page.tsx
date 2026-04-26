import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import MarkComplete from "@/components/MarkComplete";
import BookmarkButton from "@/components/BookmarkButton";
import RecordActivity from "@/components/RecordActivity";
import StickyQuizCTA from "@/components/StickyQuizCTA";
import AtlasStudyTools from "@/components/AtlasStudyTools";
import AtlasQuickCheck from "@/components/AtlasQuickCheck";
import {
  buildAtlasFromLegacy,
  isStudyAtlasSet,
  monthLabel,
  type StudyAtlasSet,
} from "@/lib/ca-atlas";

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

function langBadge(set: string): { emoji: string; label: string } | null {
  if (set.endsWith("-english")) return { emoji: "EN", label: "English" };
  if (set.endsWith("-hindi")) return { emoji: "HI", label: "हिंदी" };
  return null;
}

function setNumber(setName: string) {
  return setName.match(/(\d+)/)?.[1] ?? "1";
}

function setLabel(month: string, setName: string, totalSets: number) {
  const monthName = new Date(+month.split("-")[0], +month.split("-")[1] - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
  });
  const lang = setName.endsWith("-english") ? " English" : setName.endsWith("-hindi") ? " Hindi" : "";
  return `${monthName} - Study Set ${setNumber(setName)}/${totalSets}${lang}`;
}

async function loadSet(month: string, set: string): Promise<StudyAtlasSet | null> {
  const baseDir = path.join(process.cwd(), "data", "ca", month);
  const atlasPath = path.join(baseDir, `${set}.atlas.json`);
  const jsonPath = path.join(baseDir, `${set}.json`);

  try {
    const atlasRaw = await fs.readFile(atlasPath, "utf8");
    const parsed = JSON.parse(atlasRaw);
    if (isStudyAtlasSet(parsed)) return parsed;
  } catch {}

  try {
    const legacyRaw = await fs.readFile(jsonPath, "utf8");
    const parsed = JSON.parse(legacyRaw);
    if (isStudyAtlasSet(parsed)) return parsed;
    if (Array.isArray(parsed)) return buildAtlasFromLegacy(parsed, month, set);
  } catch {}

  return null;
}

const CAT: Record<string, { label: string; color: string }> = {
  polity: { label: "Polity", color: "#b86117" },
  economy: { label: "Economy", color: "#2d7a4f" },
  history: { label: "History", color: "#5b4fcf" },
  bihar: { label: "Bihar Focus", color: "#c04a00" },
  geo: { label: "Geography", color: "#0e7490" },
  st: { label: "Sci & Tech", color: "#6d28d9" },
  env: { label: "Environment", color: "#15803d" },
  world: { label: "World", color: "#1d4ed8" },
};

export default async function CASetPage({
  params,
}: {
  params: Promise<{ month: string; set: string }>;
}) {
  const { month, set } = await params;
  const atlas = await loadSet(month, set);
  const quizAvailable = await hasQuiz(month, set);
  const lang = langBadge(set);

  if (!atlas) {
    return (
      <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>Set not found: {month} / {set}</p>
          <Link href="/ca" style={{ color: "var(--accent)", fontSize: 14, fontFamily: "monospace" }}>
            ← Back to all sets
          </Link>
        </div>
      </main>
    );
  }

  const allDossiers = atlas.sections.flatMap((section) => section.dossiers);
  const totalPyqs = allDossiers.reduce((sum, dossier) => sum + dossier.pyqLinks.length, 0);
  const totalRevisionBullets = allDossiers.reduce((sum, dossier) => sum + dossier.revisionBullets.length, 0);
  const sectionLabel = setLabel(month, set, atlas.studySetsPerMonth);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", paddingBottom: 80 }}>
      <RecordActivity />

      <section
        style={{
          padding: "32px 16px 20px",
          borderBottom: "1px solid var(--line)",
          background:
            "radial-gradient(circle at top, rgba(192,96,16,0.16), transparent 36%), linear-gradient(180deg, rgba(255,253,248,0.96), rgba(247,242,235,0.98))",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <Link href="/ca" style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em" }}>
              ← All Sets
            </Link>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  borderRadius: 999,
                  border: "1px solid var(--accent-border)",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Study Atlas
              </span>
              {lang && (
                <span
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--line)",
                    background: "var(--card)",
                    color: "var(--ink-soft)",
                    padding: "5px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {lang.emoji} {lang.label}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 24, alignItems: "start" }}>
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 10,
                }}
              >
                {monthLabel(month)}
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.3rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  color: "var(--ink-strong)",
                  maxWidth: 820,
                  marginBottom: 12,
                }}
              >
                {sectionLabel}
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ink-soft)", maxWidth: 840, marginBottom: 18 }}>
                {atlas.intro}
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  `${atlas.sections.length} themes`,
                  `${allDossiers.length} dossiers`,
                  `${totalPyqs} mapped PYQs`,
                  `${atlas.estimatedMinutes} min guided study`,
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      border: "1px solid var(--line)",
                      background: "var(--card)",
                      color: "var(--ink-soft)",
                      padding: "7px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {atlas.coveragePromise.map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 18,
                    border: "1px solid var(--line)",
                    background: "rgba(255,255,255,0.78)",
                    padding: "14px 14px",
                  }}
                >
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-strong)", fontWeight: 700 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ overflowX: "auto" }} className="hide-scrollbar">
          <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
            {atlas.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                style={{
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: "var(--card)",
                  padding: "10px 14px",
                  color: "var(--ink-strong)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {section.emoji} {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 16px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 20,
          }}
        >
          <div
            style={{
              borderRadius: 24,
              border: "1px solid var(--line)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(249,244,237,0.92))",
              padding: 20,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                  Study Flow
                </p>
                <p style={{ fontSize: 14, color: "var(--ink-strong)", fontWeight: 700 }}>News → Static → Bihar → PYQ → Revision</p>
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                  Coverage Feel
                </p>
                <p style={{ fontSize: 14, color: "var(--ink-strong)", fontWeight: 700 }}>Theme-wise, not isolated-card-wise</p>
              </div>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                  Revision Load
                </p>
                <p style={{ fontSize: 14, color: "var(--ink-strong)", fontWeight: 700 }}>{totalRevisionBullets} rapid recall points</p>
              </div>
            </div>
          </div>

          {atlas.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                borderRadius: 26,
                border: "1px solid var(--line)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(249,244,237,0.94))",
                padding: 20,
                scrollMarginTop: 90,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                    {section.emoji} Theme Section
                  </p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "var(--ink-strong)", marginBottom: 8 }}>
                    {section.title}
                  </h2>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-soft)", maxWidth: 780 }}>{section.themeGoal}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 320 }}>
                  {section.coverageChecklist.map((item) => (
                    <span
                      key={item}
                      style={{
                        borderRadius: 999,
                        border: "1px solid var(--line)",
                        background: "var(--card)",
                        padding: "7px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                {section.dossiers.map((dossier) => (
                  <article
                    key={dossier.id}
                    style={{
                      borderRadius: 22,
                      border: "1px solid var(--line)",
                      background: "rgba(255,253,248,0.92)",
                      padding: 18,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                      <div style={{ maxWidth: 760 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 28, lineHeight: 1 }}>{dossier.emoji}</span>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "4px 10px",
                              background:
                                dossier.examPriority === "High"
                                  ? "rgba(192,96,16,0.12)"
                                  : dossier.examPriority === "Medium"
                                    ? "rgba(37,99,235,0.08)"
                                    : "rgba(22,163,74,0.08)",
                              color:
                                dossier.examPriority === "High"
                                  ? "var(--accent)"
                                  : dossier.examPriority === "Medium"
                                    ? "#2563eb"
                                    : "#15803d",
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            {dossier.examPriority} Priority
                          </span>
                          {dossier.categories.map((cat) => {
                            const meta = CAT[cat];
                            return (
                              <span
                                key={cat}
                                style={{
                                  borderRadius: 999,
                                  border: `1px solid ${meta?.color ?? "var(--line)"}`,
                                  background: `${meta?.color ?? "#999"}12`,
                                  color: meta?.color ?? "var(--ink-soft)",
                                  padding: "4px 9px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                }}
                              >
                                {meta?.label ?? cat}
                              </span>
                            );
                          })}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: "var(--ink-strong)", lineHeight: 1.15, marginBottom: 8 }}>
                          {dossier.title}
                        </h3>
                        <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-soft)", marginBottom: 10 }}>{dossier.inBrief}</p>
                        <div
                          style={{
                            borderRadius: 16,
                            border: "1px solid var(--accent-border)",
                            background: "rgba(253,232,200,0.42)",
                            padding: "12px 14px",
                          }}
                        >
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>
                            Why It Matters
                          </p>
                          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)", fontWeight: 700 }}>{dossier.whyItMatters}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <MarkComplete month={month} setName={set} cardId={dossier.id} categories={dossier.categories} />
                        <BookmarkButton month={month} setName={set} cardId={dossier.id} title={dossier.title} categories={dossier.categories} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            What Happened
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.whatHappened.map((point) => (
                              <li key={point} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Background
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.background.map((point) => (
                              <li key={point} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Bihar Angle
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {(dossier.biharAngle.length ? dossier.biharAngle : ["No explicit Bihar angle mapped yet. Add a district, scheme, institution, or comparative state angle in enrichment pass."]).map((point) => (
                              <li key={point} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <details open style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--panel)", padding: 16 }}>
                        <summary style={{ cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
                          Static Spine
                        </summary>
                        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                          {dossier.staticSpine.map((block) => (
                            <div key={block.title} style={{ borderRadius: 16, background: "rgba(255,255,255,0.72)", border: "1px solid var(--line)", padding: 14 }}>
                              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                                {block.title}
                              </p>
                              <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                                {block.facts.map((fact) => (
                                  <li key={fact} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                    {fact}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </details>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            PYQ Links
                          </p>
                          <div style={{ display: "grid", gap: 10 }}>
                            {dossier.pyqLinks.length > 0 ? (
                              dossier.pyqLinks.map((pyq) => (
                                <div key={`${pyq.year}-${pyq.paper}-${pyq.question}`} style={{ borderRadius: 14, border: "1px solid var(--line)", background: "rgba(253,232,200,0.34)", padding: 12 }}>
                                  <p style={{ fontSize: 12, fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                                    {pyq.year} · {pyq.stage} · {pyq.paper}
                                  </p>
                                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)", marginBottom: 6 }}>{pyq.question}</p>
                                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)" }}>{pyq.takeaway}</p>
                                </div>
                              ))
                            ) : (
                              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-soft)" }}>
                                PYQ mapping is not added here yet. The structure is ready, so we can keep layering real BPSC Prelims and Mains questions theme by theme.
                              </p>
                            )}
                          </div>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Prelims Traps
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.prelimsTraps.map((trap) => (
                              <li key={trap} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {trap}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Mains Frame
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.mainsFrame.map((point) => (
                              <li key={point} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Emoji Mindmap
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {dossier.mindmap.map((node) => (
                              <span
                                key={node}
                                style={{
                                  borderRadius: 999,
                                  background: "rgba(26,39,68,0.06)",
                                  border: "1px solid rgba(26,39,68,0.1)",
                                  color: "var(--ink-strong)",
                                  padding: "8px 12px",
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {node}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            1-Minute Revision
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.revisionBullets.map((point) => (
                              <li key={point} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)", padding: 14 }}>
                          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                            Self-Prompts
                          </p>
                          <ul style={{ paddingLeft: 18, display: "grid", gap: 8 }}>
                            {dossier.interactivePrompts.map((prompt) => (
                              <li key={prompt} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-strong)" }}>
                                {prompt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                        <AtlasQuickCheck {...dossier.quickCheck} />
                        <AtlasStudyTools storageId={`bpsc_atlas_${month}_${set}_${dossier.id}`} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 16px 0" }}>
        <div
          style={{
            borderRadius: 24,
            border: "1px solid var(--line)",
            background: "linear-gradient(135deg, #0c1220 0%, #1a2744 100%)",
            padding: 24,
            color: "#f8fafc",
          }}
        >
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(251,191,36,0.8)", marginBottom: 8 }}>
            Keep Them On Platform
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: 10 }}>
            This set now studies like a guided notebook, not a downloadable handout.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(241,245,249,0.82)", maxWidth: 900, marginBottom: 16 }}>
            The stickiness comes from interaction: students can move theme by theme, mark weak areas, save their own revision notes, hit quick checks, and see PYQ bridges directly beside the current affair.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {quizAvailable ? (
              <Link
                href={`/ca/${month}/${set}/quiz`}
                style={{
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #c06010, #d97706)",
                  color: "#fff",
                  padding: "12px 18px",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                }}
              >
                Take the Quiz
              </Link>
            ) : null}
            <Link
              href="/pyq"
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.04)",
                color: "#f8fafc",
                padding: "12px 18px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
              }}
            >
              Open PYQ Hub
            </Link>
          </div>
        </div>
      </section>

      {quizAvailable && <StickyQuizCTA month={month} set={set} />}
    </main>
  );
}
