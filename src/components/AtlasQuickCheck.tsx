"use client";

import { useMemo, useState } from "react";

type Props = {
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export default function AtlasQuickCheck({ question, options, answer, explanation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const hasOptions = Boolean(options?.length);
  const normalizedAnswer = useMemo(() => answer.trim().toLowerCase(), [answer]);

  const isCorrect = selected ? selected.trim().toLowerCase() === normalizedAnswer : false;

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid var(--accent-border)",
        background: "linear-gradient(180deg, rgba(253,232,200,0.8), rgba(255,255,255,0.95))",
        padding: 16,
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        Quick Check
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
        {question}
      </p>

      {hasOptions ? (
        <div style={{ display: "grid", gap: 8 }}>
          {options?.map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setRevealed(true);
                }}
                style={{
                  textAlign: "left",
                  borderRadius: 12,
                  border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
                  background: active ? "var(--accent-soft)" : "var(--card)",
                  padding: "10px 12px",
                  cursor: "pointer",
                  color: "var(--ink-strong)",
                  fontSize: 13,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <button
          onClick={() => setRevealed((value) => !value)}
          style={{
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "var(--card)",
            padding: "10px 12px",
            cursor: "pointer",
            color: "var(--ink-strong)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {revealed ? "Hide answer" : "Reveal answer"}
        </button>
      )}

      {revealed && (
        <div
          style={{
            marginTop: 12,
            borderRadius: 14,
            padding: 12,
            background: hasOptions
              ? isCorrect
                ? "rgba(22,163,74,0.1)"
                : "rgba(192,96,16,0.08)"
              : "rgba(22,163,74,0.08)",
            border: hasOptions
              ? isCorrect
                ? "1px solid rgba(22,163,74,0.2)"
                : "1px solid rgba(192,96,16,0.2)"
              : "1px solid rgba(22,163,74,0.2)",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 4 }}>
            Answer: {answer}
          </p>
          {explanation && (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)" }}>{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
