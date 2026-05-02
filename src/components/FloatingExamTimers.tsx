"use client";

import { useEffect, useState } from "react";

// ── Update dates when exam schedules are announced ────────────────────────────
const EXAMS = [
  { short: "BPSC 72nd",  full: "72nd BPSC Prelims", date: new Date("2026-07-26T00:00:00+05:30"), color: "#c06010", start: new Date("2025-07-26T00:00:00+05:30") },
  { short: "BPSC AEDO",  full: "BPSC AEDO",         date: new Date("2026-09-15T00:00:00+05:30"), color: "#6366f1", start: new Date("2025-09-15T00:00:00+05:30") },
  { short: "BSSC CGL",   full: "BSSC CGL",           date: new Date("2026-11-01T00:00:00+05:30"), color: "#15803d", start: new Date("2025-11-01T00:00:00+05:30") },
];
// ─────────────────────────────────────────────────────────────────────────────

function remaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function progressPct(start: Date, end: Date) {
  const total = end.getTime() - start.getTime();
  const elapsed = Date.now() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export default function FloatingExamTimers() {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes timerSlideIn {
          from { opacity: 0; transform: translateX(28px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes secondPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(0.92); }
        }
        @keyframes barShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .exam-timers-root { display: none; }
        @media (min-width: 768px) { .exam-timers-root { display: flex; } }
        .timer-card {
          animation: timerSlideIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .timer-card:nth-child(1) { animation-delay: 0.08s; }
        .timer-card:nth-child(2) { animation-delay: 0.18s; }
        .timer-card:nth-child(3) { animation-delay: 0.28s; }
        .sec-val {
          display: inline-block;
          animation: secondPulse 1s ease infinite;
        }
        .timer-bar-fill {
          background-size: 200% auto;
          animation: barShimmer 3s linear infinite;
        }
      `}</style>

      <div className="exam-timers-root" style={{
        position: "fixed",
        top: 94, right: 10,
        flexDirection: "column", gap: 7,
        zIndex: 90, pointerEvents: "none",
      }}>
        {EXAMS.map(exam => {
          const r = remaining(exam.date);
          const pct = progressPct(exam.start, exam.date);

          return (
            <div key={exam.short} className="timer-card" style={{
              background: "rgba(255, 253, 248, 0.75)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.6)",
              borderTop: `2.5px solid ${exam.color}`,
              boxShadow: `0 8px 28px rgba(120,80,30,0.1), 0 2px 6px rgba(120,80,30,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`,
              padding: "9px 13px 10px",
              minWidth: 152,
            }}>

              {/* Exam label */}
              <p style={{
                fontSize: 8.5, fontWeight: 800,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: exam.color, marginBottom: 6,
              }}>{exam.short}</p>

              {/* Countdown numbers */}
              {r ? (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <Unit val={r.d}  label="d" color={exam.color} />
                  <Unit val={r.h}  label="h" color={exam.color} />
                  <Unit val={r.m}  label="m" color={exam.color} />
                  <Unit val={r.s}  label="s" color={exam.color} pulse />
                </div>
              ) : (
                <p style={{ fontSize: 13, fontWeight: 800, color: exam.color }}>Exam Day 🎯</p>
              )}

              {/* Progress bar */}
              <div style={{
                marginTop: 9, height: 3, borderRadius: 99,
                background: `color-mix(in srgb, ${exam.color} 12%, transparent)`,
                overflow: "hidden",
              }}>
                <div className="timer-bar-fill" style={{
                  height: "100%", borderRadius: 99,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${exam.color}99, ${exam.color}, ${exam.color}99)`,
                  transition: "width 60s linear",
                }} />
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}

function Unit({ val, label, color, pulse }: { val: number; label: string; color: string; pulse?: boolean }) {
  const str = label === "d" ? String(val) : String(val).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <span className={pulse ? "sec-val" : undefined} style={{
        fontSize: label === "d" ? 18 : 15,
        fontWeight: 800,
        color: "var(--ink-strong)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        fontVariantNumeric: "tabular-nums",
      }}>{str}</span>
      <span style={{
        fontSize: 7.5, fontWeight: 800,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color,
      }}>{label}</span>
    </div>
  );
}
