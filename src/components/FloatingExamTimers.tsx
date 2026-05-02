"use client";

import { useEffect, useState } from "react";

// ── Update these dates when exam schedules are announced ──────────────────────
const EXAMS = [
  { label: "72nd BPSC Prelims", short: "BPSC 72nd", date: new Date("2026-07-26T00:00:00+05:30") },
  { label: "BPSC AEDO",         short: "AEDO",       date: new Date("2026-09-15T00:00:00+05:30") },
  { label: "BSSC CGL",          short: "BSSC CGL",   date: new Date("2026-11-01T00:00:00+05:30") },
];
// ─────────────────────────────────────────────────────────────────────────────

function remaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function FloatingExamTimers() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 94, right: 10,
      display: "flex", flexDirection: "column", gap: 5,
      zIndex: 90, pointerEvents: "none",
    }}>
      {EXAMS.map(exam => {
        const r = remaining(exam.date);
        return (
          <div key={exam.label} style={{
            background: "rgba(255,253,248,0.78)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(192,96,16,0.14)",
            borderRadius: 10,
            padding: "5px 10px",
            boxShadow: "0 2px 12px rgba(120,80,30,0.08)",
          }}>
            <p style={{
              fontSize: 8.5, fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: 2, whiteSpace: "nowrap",
            }}>{exam.short}</p>
            {r ? (
              <p style={{
                fontSize: 12, fontWeight: 700,
                color: "var(--ink-strong)",
                letterSpacing: "-0.01em",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}>
                {r.d}<span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 600 }}>d </span>
                {pad(r.h)}<span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 600 }}>h </span>
                {pad(r.m)}<span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 600 }}>m </span>
                {pad(r.s)}<span style={{ fontSize: 9, color: "var(--muted)", fontWeight: 600 }}>s</span>
              </p>
            ) : (
              <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)" }}>Exam Day!</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
