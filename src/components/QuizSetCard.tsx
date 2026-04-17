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
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bpsc_quiz_${month}_set-${num}-english`);
      if (raw) {
        const parsed = JSON.parse(raw) as { pct?: number; bestPercentage?: number };
        setScore(Math.round(parsed.bestPercentage ?? parsed.pct ?? 0));
      }
    } catch { /* ignore */ }
  }, [month, num]);

  const isDone = score !== null;
  const scoreColor = score !== null
    ? score >= 60 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626"
    : "var(--accent)";
  const scoreBg = score !== null
    ? score >= 60 ? "rgba(22,163,74,0.1)" : score >= 40 ? "rgba(217,119,6,0.1)" : "rgba(220,38,38,0.06)"
    : "var(--accent-soft)";
  const scoreBorder = score !== null
    ? score >= 60 ? "rgba(22,163,74,0.3)" : score >= 40 ? "rgba(217,119,6,0.25)" : "rgba(220,38,38,0.2)"
    : "var(--accent-border)";

  return (
    <div style={{
      border: isDone
        ? `1.5px solid ${scoreBorder}`
        : "1px solid var(--line)",
      borderRadius: 20,
      padding: "18px 16px",
      background: isDone && score! >= 60
        ? "rgba(22,163,74,0.03)"
        : "var(--card)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 15, color: "var(--ink-strong)",
        }}>
          Quiz {num}
        </p>
        {isDone ? (
          <span style={{
            background: scoreBg, color: scoreColor,
            border: `1px solid ${scoreBorder}`,
            borderRadius: 20, padding: "2px 10px",
            fontSize: 11, fontWeight: 700,
          }}>
            {score}%
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
        <Link href={`/ca/${month}/set-${num}-english/quiz`} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isDone
            ? scoreBg
            : "linear-gradient(135deg, rgba(192,96,16,0.08), rgba(217,119,6,0.06))",
          border: `1px solid ${isDone ? scoreBorder : "rgba(192,96,16,0.2)"}`,
          borderRadius: 10, padding: "10px 14px", textDecoration: "none",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? scoreColor : "var(--ink-strong)" }}>
            {isDone ? "Retake Quiz →" : "Start Quiz →"}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isDone ? scoreColor : "var(--accent)" }}>
            {isDone ? `Score: ${score}%` : "30 min"}
          </span>
        </Link>
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
