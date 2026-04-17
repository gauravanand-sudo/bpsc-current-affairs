"use client";

import { useState, useEffect } from "react";

type Props = {
  month: string;
  setName: string;
  cardId: number;
  categories: string[];
};

function storageKey(month: string, setName: string, cardId: number) {
  return `bpsc_${month}_${setName}_${cardId}`;
}

export default function MarkComplete({ month, setName, cardId, categories }: Props) {
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setDone(!!localStorage.getItem(storageKey(month, setName, cardId)));
  }, [month, setName, cardId]);

  function toggle() {
    const key = storageKey(month, setName, cardId);
    if (done) {
      localStorage.removeItem(key);
      setDone(false);
    } else {
      // Store categories so profile can show breakdown
      localStorage.setItem(key, categories.join(","));
      setDone(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 10,
        border: done ? "1px solid var(--accent)" : "1px solid var(--line)",
        background: done
          ? flash
            ? "var(--accent)"
            : "var(--accent-soft)"
          : "var(--chip)",
        color: done ? "var(--accent)" : "var(--ink-soft)",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.03em",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>{done ? "✓" : "○"}</span>
      {done ? "Completed" : "Mark done"}
    </button>
  );
}
