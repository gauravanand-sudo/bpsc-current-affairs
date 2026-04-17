"use client";

import { useState, useEffect } from "react";
import { saveStudyCardProgress } from "@/lib/progress";

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

  async function toggle() {
    const key = storageKey(month, setName, cardId);
    if (done) {
      localStorage.removeItem(key);
      setDone(false);
      void saveStudyCardProgress({ month, setName, cardId, categories, done: false });
    } else {
      localStorage.setItem(key, categories.join(","));
      setDone(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      void saveStudyCardProgress({ month, setName, cardId, categories, done: true });
    }
  }

  return (
    <button
      onClick={toggle}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 14,
        border: done
          ? `1.5px solid ${flash ? "transparent" : "rgba(22,163,74,0.4)"}`
          : "1.5px solid rgba(120,80,30,0.18)",
        background: done
          ? flash ? "#16a34a" : "rgba(22,163,74,0.1)"
          : "var(--card)",
        color: done ? (flash ? "#fff" : "#16a34a") : "var(--ink-soft)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.02em",
        transition: "all 0.15s",
        boxShadow: done && !flash ? "0 0 0 0" : "none",
      }}
    >
      <span style={{ fontSize: 16 }}>{done ? "✓" : "○"}</span>
      {done ? "Done" : "Mark done"}
    </button>
  );
}
