"use client";

import { useEffect, useState } from "react";

const EXAM_DATE = new Date("2026-07-26T00:00:00+05:30");

function calcDays() {
  const diff = EXAM_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return Math.floor(diff / 86400000);
}

export default function ExamCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(calcDays());
    const id = setInterval(() => setDays(calcDays()), 60000);
    return () => clearInterval(id);
  }, []);

  if (days === null) return null;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(192,96,16,0.08)",
      border: "1px solid rgba(192,96,16,0.18)",
      borderRadius: 20, padding: "3px 9px",
      flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap" }}>
        {days}d left
      </span>
    </div>
  );
}
