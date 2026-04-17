"use client";

import { useEffect, useState } from "react";
import { recordActivity } from "@/lib/streak";

type Option = { key: string; val: string };
type QOTD = {
  question: string;
  statements: Record<string, string> | null;
  options: Option[];
  correctKey: string;
  explanation: string;
  day: number;
};

const STORAGE_KEY = "bpsc_qotd_answer";

export default function QuestionOfTheDay() {
  const [q, setQ] = useState<QOTD | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/qotd")
      .then(r => r.json())
      .then((data: QOTD) => {
        setQ(data);
        // Restore today's answer if already attempted
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const { day, answer } = JSON.parse(saved) as { day: number; answer: string };
            if (day === data.day) {
              setSelected(answer);
              setRevealed(true);
            }
          }
        } catch { /* ignore */ }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function answer(key: string) {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
    recordActivity();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: q?.day, answer: key }));
    } catch { /* ignore */ }
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 13 }}>
      Loading today&apos;s question...
    </div>
  );

  if (!q) return null;

  const isCorrect = selected === q.correctKey;

  return (
    <div style={{
      border: "1.5px solid var(--accent-border)",
      borderRadius: 20, background: "var(--card)",
      padding: "22px 20px", maxWidth: 680, margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>🎯</span>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
          Question of the Day
        </p>
        {revealed && (
          <span style={{
            marginLeft: "auto", fontSize: 11, fontWeight: 700,
            color: isCorrect ? "#16a34a" : "#dc2626",
            background: isCorrect ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
            border: `1px solid ${isCorrect ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
            borderRadius: 20, padding: "2px 10px",
          }}>
            {isCorrect ? "✓ Correct" : "✗ Wrong"}
          </span>
        )}
      </div>

      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-strong)", lineHeight: 1.65, marginBottom: 14 }}>
        {q.question}
      </p>

      {q.statements && (
        <div style={{ background: "var(--panel)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
          {Object.entries(q.statements).map(([k, v]) => (
            <p key={k} style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: "var(--ink-strong)", marginRight: 6 }}>{k}.</span>{v}
            </p>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: revealed ? 16 : 0 }}>
        {q.options.map(({ key, val }) => {
          const isThis = selected === key;
          const isCorrectOpt = key === q.correctKey;
          let bg = "var(--panel)";
          let border = "1px solid var(--line)";
          let color = "var(--ink-soft)";
          if (revealed) {
            if (isCorrectOpt) { bg = "rgba(22,163,74,0.08)"; border = "1px solid rgba(22,163,74,0.3)"; color = "#15803d"; }
            else if (isThis) { bg = "rgba(220,38,38,0.06)"; border = "1px solid rgba(220,38,38,0.25)"; color = "#dc2626"; }
          } else if (isThis) {
            bg = "var(--accent-soft)"; border = "1px solid var(--accent)"; color = "var(--accent)";
          }
          return (
            <button key={key} onClick={() => answer(key)} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: bg, border, borderRadius: 10,
              padding: "10px 12px", cursor: revealed ? "default" : "pointer",
              textAlign: "left", width: "100%", transition: "all 0.12s",
            }}>
              <span style={{ fontWeight: 700, fontSize: 12, color, flexShrink: 0, marginTop: 1 }}>{key}</span>
              <span style={{ fontSize: 13, color, lineHeight: 1.5 }}>{val}</span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <div style={{
          background: "rgba(120,80,30,0.05)", borderRadius: 12,
          padding: "12px 14px", borderLeft: "3px solid var(--accent)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Explanation
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
