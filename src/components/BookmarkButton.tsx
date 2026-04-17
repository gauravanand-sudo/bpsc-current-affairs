"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "@/lib/bookmarks";

type Props = {
  month: string;
  setName: string;
  cardId: number;
  title: string;
  categories: string[];
};

export default function BookmarkButton({ month, setName, cardId, title, categories }: Props) {
  const [saved, setSaved] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(month, setName, cardId));
  }, [month, setName, cardId]);

  function toggle() {
    const nowSaved = toggleBookmark({ month, setName, cardId, title, categories });
    setSaved(nowSaved);
    if (nowSaved) { setFlash(true); setTimeout(() => setFlash(false), 500); }
  }

  return (
    <button onClick={toggle} title={saved ? "Remove bookmark" : "Bookmark this card"} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 10,
      border: saved ? "1px solid #2563eb" : "1px solid var(--line)",
      background: saved ? (flash ? "#2563eb" : "rgba(37,99,235,0.08)") : "var(--chip)",
      color: saved ? (flash ? "#fff" : "#2563eb") : "var(--ink-soft)",
      fontSize: 12, fontWeight: 700, cursor: "pointer",
      fontFamily: "var(--font-display)", letterSpacing: "0.03em",
      transition: "all 0.15s", flexShrink: 0,
    }}>
      <span style={{ fontSize: 14 }}>{saved ? "🔖" : "🏷️"}</span>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
