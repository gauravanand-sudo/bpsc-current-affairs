"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "bpsc_lang";

export function useLang(): "english" | "hindi" {
  if (typeof window === "undefined") return "english";
  return (localStorage.getItem(STORAGE_KEY) as "english" | "hindi") || "english";
}

export default function LangGate() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function choose(lang: "english" | "hindi") {
    localStorage.setItem(STORAGE_KEY, lang);
    setVisible(false);
    router.refresh();
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(21,14,6,0.88)",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeUp 0.3s ease both",
      }}
    >
      {/* Dot grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(192,96,16,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        background: "rgba(255,253,248,0.97)",
        border: "1px solid rgba(192,96,16,0.2)",
        borderRadius: 28,
        padding: "40px 32px",
        maxWidth: 440, width: "100%",
        textAlign: "center",
        boxShadow: "0 24px 80px rgba(21,14,6,0.35)",
        animation: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {/* Logo */}
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: 20,
        }}>
          BPSC Cosmos
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.5rem, 5vw, 2rem)", lineHeight: 1.2,
          color: "var(--ink-strong)", marginBottom: 8,
          letterSpacing: "-0.02em",
        }}>
          भाषा चुनें<br />
          <span style={{ color: "var(--muted)", fontSize: "0.72em", fontWeight: 500 }}>Choose Your Language</span>
        </h1>

        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 32, lineHeight: 1.6 }}>
          अपनी पसंद की भाषा में BPSC की तैयारी करें.<br />
          Study BPSC in your preferred language.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => choose("hindi")}
            style={{
              padding: "16px 24px", borderRadius: 14, border: "2px solid transparent",
              background: "linear-gradient(135deg, #c06010, #d97706)",
              color: "#fff", fontSize: 17, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 20px rgba(192,96,16,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = ""; }}
          >
            <span style={{ fontSize: 22 }}>🇮🇳</span>
            हिंदी में पढ़ें
            <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>Hindi</span>
          </button>

          <button
            onClick={() => choose("english")}
            style={{
              padding: "16px 24px", borderRadius: 14,
              border: "2px solid var(--line-hi)",
              background: "var(--card)",
              color: "var(--ink-strong)", fontSize: 17, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
              letterSpacing: "0.02em",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = ""; }}
          >
            <span style={{ fontSize: 22 }}>🇬🇧</span>
            Read in English
            <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 400 }}>English</span>
          </button>
        </div>

        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 20, letterSpacing: "0.04em" }}>
          You can change this anytime from the menu.
        </p>
      </div>
    </div>
  );
}
