"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function QuizSetCard({
  month,
  num,
  cats,
}: {
  month: string;
  num: number;
  cats: string[];
}) {
  const [out150, setOut150] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bpsc_quiz_${month}_set-${num}-english`);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          bestScore?: number; maxScore?: number; outOf150?: number;
        };
        if (parsed.bestScore !== undefined && parsed.maxScore) {
          setOut150(Math.round((parsed.bestScore / parsed.maxScore) * 150 * 10) / 10);
        } else if (parsed.outOf150 !== undefined) {
          setOut150(parsed.outOf150);
        }
      }
    } catch { /* ignore */ }
  }, [month, num]);

  const isDone = out150 !== null;
  const displayed = isDone ? Math.max(0, out150!) : null;

  // colour tier
  const tier = isDone
    ? (out150! >= 90 ? "green" : out150! >= 60 ? "amber" : "red")
    : "none";

  const palette = {
    green: { text: "#16a34a", bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.3)",  cardBg: "rgba(22,163,74,0.04)"  },
    amber: { text: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.3)",  cardBg: "rgba(217,119,6,0.04)"  },
    red:   { text: "#dc2626", bg: "rgba(220,38,38,0.06)",  border: "rgba(220,38,38,0.22)", cardBg: "rgba(220,38,38,0.03)"  },
    none:  { text: "var(--ink-strong)", bg: "var(--card)", border: "var(--line)",           cardBg: "var(--card)"           },
  }[tier];

  return (
    <div style={{
      border: isDone ? `1.5px solid ${palette.border}` : "1px solid var(--line)",
      borderRadius: 20,
      padding: "18px 16px",
      background: palette.cardBg,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>
          Quiz {num}
        </p>
        {isDone ? (
          <span style={{
            background: palette.bg, color: palette.text,
            border: `1px solid ${palette.border}`,
            borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
          }}>
            {displayed}/150
          </span>
        ) : (
          <span style={{
            background: "rgba(22,163,74,0.1)", color: "#16a34a",
            border: "1px solid rgba(22,163,74,0.25)",
            borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
          }}>
            LIVE
          </span>
        )}
      </div>

      {/* Category pills */}
      {cats.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {cats.slice(0, 4).map(cat => {
            const m = CAT[cat];
            return (
              <span key={cat} style={{
                background: `${m?.color}14`, color: m?.color,
                border: `1px solid ${m?.color}33`,
                borderRadius: 20, padding: "2px 8px",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                {m?.label ?? cat}
              </span>
            );
          })}
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: "auto" }}>
        {isDone ? (
          /* Taken quiz: Review + Retake side by side */
          <div style={{ display: "flex", gap: 7 }}>
            <Link href={`/ca/${month}/set-${num}-english/quiz?review=best`} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6,
              background: palette.bg,
              border: `1px solid ${palette.border}`,
              borderRadius: 10, padding: "10px 10px", textDecoration: "none",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: palette.text }}>
                📋 Review
              </span>
            </Link>
            <Link href={`/ca/${month}/set-${num}-english/quiz`} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--card)",
              border: "1px solid var(--line-hi)",
              borderRadius: 10, padding: "10px 10px", textDecoration: "none",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>
                🔁 Retake
              </span>
            </Link>
          </div>
        ) : (
          /* Not taken: single start CTA */
          <Link href={`/ca/${month}/set-${num}-english/quiz`} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "linear-gradient(135deg, rgba(192,96,16,0.08), rgba(217,119,6,0.06))",
            border: "1px solid rgba(192,96,16,0.2)",
            borderRadius: 10, padding: "10px 14px", textDecoration: "none",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>Start Quiz →</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>30 min</span>
          </Link>
        )}

        <Link href={`/ca/${month}/set-${num}-english`} style={{
          fontSize: 11, color: "var(--muted)", textDecoration: "none",
          textAlign: "center", letterSpacing: "0.04em",
        }}>
          📖 Study the set first →
        </Link>
      </div>
    </div>
  );
}
