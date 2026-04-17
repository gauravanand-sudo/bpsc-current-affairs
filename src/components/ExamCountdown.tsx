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
      position: "fixed", bottom: 20, right: 16, zIndex: 200,
      background: "var(--navy)",
      border: "1px solid rgba(251,191,36,0.25)",
      borderRadius: 16,
      padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      minWidth: 160,
    }}>
      <p style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "rgba(251,191,36,0.7)",
        marginBottom: 8, fontFamily: "monospace",
      }}>
        72nd BPSC Prelims
      </p>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        {[
          { v: t.d, u: "d" },
          { v: t.h, u: "h" },
          { v: t.m, u: "m" },
          { v: t.s, u: "s" },
        ].map(({ v, u }) => (
          <div key={u} style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "monospace", fontSize: 22, fontWeight: 700,
              color: "#f1f5f9", lineHeight: 1,
              minWidth: u === "d" ? 32 : 26,
            }}>
              {String(v).padStart(2, "0")}
            </p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginTop: 2 }}>
              {u}
            </p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 8, letterSpacing: "0.06em" }}>
        26 July 2026
      </p>
    </div>
  );
}
