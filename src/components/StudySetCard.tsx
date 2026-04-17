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

function shortMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", { month: "long" });
}

export default function StudySetCard({
  month,
  num,
  cats,
  cardCount,
}: {
  month: string;
  num: number;
  cats: string[];
  cardCount: number;
}) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const prefix = `bpsc_${month}_set-${num}-english_`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) count++;
    }
    setCompletedCount(count);
  }, [month, num]);

  const isDone = cardCount > 0 && completedCount >= cardCount;
  const isStarted = completedCount > 0;

  return (
    <div style={{
      border: isDone
        ? "1.5px solid rgba(22,163,74,0.5)"
        : "1px solid var(--line)",
      borderRadius: 20,
      padding: "18px 16px",
      background: isDone ? "rgba(22,163,74,0.04)" : "var(--card)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 15, color: "var(--ink-strong)",
        }}>
          {shortMonthLabel(month)} - Set {num}/15
        </p>
        {isDone ? (
          <span style={{
            background: "rgba(22,163,74,0.12)", color: "#16a34a",
            border: "1px solid rgba(22,163,74,0.3)",
            borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
          }}>
            ✓ DONE
          </span>
        ) : isStarted ? (
          <span style={{
            background: "rgba(217,119,6,0.1)", color: "#d97706",
            border: "1px solid rgba(217,119,6,0.25)",
            borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
          }}>
            {completedCount}/{cardCount}
          </span>
        ) : (
          <span style={{
            background: "var(--accent-soft)", color: "var(--accent)",
            borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.06em",
          }}>
            LIVE
          </span>
        )}
      </div>

      {/* Category pills */}
      {cats.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {cats.map(cat => {
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

      {/* CTA */}
      <div style={{ marginTop: "auto" }}>
        <Link
          href={`/ca/${month}/set-${num}-english`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: isDone
              ? "rgba(22,163,74,0.08)"
              : "linear-gradient(135deg, rgba(192,96,16,0.08), rgba(217,119,6,0.06))",
            border: isDone
              ? "1px solid rgba(22,163,74,0.25)"
              : "1px solid rgba(192,96,16,0.2)",
            borderRadius: 10, padding: "10px 14px", textDecoration: "none",
          }}
        >
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: isDone ? "#16a34a" : "var(--ink-strong)",
          }}>
            {isDone ? "Review Set →" : isStarted ? "Continue →" : "Study Now →"}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>
            {cardCount} cards
          </span>
        </Link>
      </div>
    </div>
  );
}
