"use client";

import Link from "next/link";

export default function StickyQuizCTA({
  month,
  set,
}: {
  month: string;
  set: string;
}) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: "10px 16px 14px",
      background: "linear-gradient(to top, rgba(12,18,32,0.97) 60%, transparent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      pointerEvents: "none",
    }}>
      <Link
        href={`/ca/${month}/${set}/quiz`}
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, #c06010, #d97706)",
          color: "#fff",
          borderRadius: 40,
          padding: "11px 28px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          letterSpacing: "0.01em",
          boxShadow: "0 4px 20px rgba(192,96,16,0.45)",
          whiteSpace: "nowrap",
        }}
      >
        🎯 Take the Quiz
        <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>30 min · −⅓</span>
      </Link>
    </div>
  );
}
