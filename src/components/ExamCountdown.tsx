"use client";

import { useEffect, useState } from "react";

const EXAM_DATE = new Date("2026-07-26T00:00:00+05:30");

function calcTimeLeft() {
  const diff = EXAM_DATE.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, over: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    over: false,
  };
}

export default function ExamCountdown() {
  const [t, setT] = useState(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setT(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.over) return null;

  return (
    <div style={{
      position: "fixed", top: 62, right: 14, zIndex: 200,
      textAlign: "right",
      pointerEvents: "none",
    }}>
      <p style={{
        fontFamily: "monospace", fontSize: 9, fontWeight: 700,
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: "var(--muted)", marginBottom: 3,
      }}>
        Exam · 26 Jul
      </p>
      <p style={{
        fontFamily: "monospace", fontSize: 17, fontWeight: 700,
        color: "var(--accent)", lineHeight: 1, letterSpacing: "0.04em",
      }}>
        {String(t.d).padStart(2, "0")}
        <span style={{ fontSize: 11, color: "var(--muted)", margin: "0 1px" }}>d</span>
        {String(t.h).padStart(2, "0")}
        <span style={{ fontSize: 11, color: "var(--muted)", margin: "0 1px" }}>h</span>
        {String(t.m).padStart(2, "0")}
        <span style={{ fontSize: 11, color: "var(--muted)", margin: "0 1px" }}>m</span>
        {String(t.s).padStart(2, "0")}
        <span style={{ fontSize: 11, color: "var(--muted)", margin: "0 1px" }}>s</span>
      </p>
    </div>
  );
}
