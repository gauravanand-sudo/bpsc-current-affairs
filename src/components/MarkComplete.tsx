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
    <div style={{
      position: "fixed",
      bottom: "calc(60px + env(safe-area-inset-bottom))",
      left: 0, right: 0,
      zIndex: 150,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    }}>
      <button
        onClick={toggle}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          borderRadius: 50,
          border: done ? "1.5px solid var(--accent)" : "1.5px solid rgba(120,80,30,0.2)",
          background: done
            ? flash ? "var(--accent)" : "rgba(184,97,23,0.12)"
            : "rgba(244,239,232,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: done ? (flash ? "#fff" : "var(--accent)") : "var(--ink-soft)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.03em",
          boxShadow: "0 4px 20px rgba(120,80,30,0.15)",
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 16 }}>{done ? "✓" : "○"}</span>
        {done ? "Completed" : "Mark done"}
      </button>
    </div>
  );
}
