"use client";

import Link from "next/link";

export default function SupportButton() {
  return (
    <div>
      <p style={{ fontSize: 20, marginBottom: 10 }}>💙</p>
      <p style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: 17, color: "var(--ink-strong)", marginBottom: 6,
      }}>
        Feeling overwhelmed?
      </p>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 16, maxWidth: 340, margin: "0 auto 16px" }}>
        Exam pressure is real. Talk to fellow aspirants who get it.
      </p>
      <Link href="/support" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "var(--card)", border: "1px solid var(--line)",
        borderRadius: 50, padding: "10px 22px",
        fontSize: 13, fontWeight: 700, color: "var(--ink-soft)",
        textDecoration: "none",
        boxShadow: "0 2px 8px rgba(120,80,30,0.08)",
      }}>
        💬 Talk to someone →
      </Link>
    </div>
  );
}
