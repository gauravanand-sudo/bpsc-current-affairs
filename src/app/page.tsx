"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ExamId = "all" | "bpsc72" | "adeo" | "bssc-cgl";

const EXAM_TABS: { id: ExamId; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "bpsc72",   label: "BPSC 72nd" },
  { id: "adeo",     label: "ADEO" },
  { id: "bssc-cgl", label: "BSSC CGL" },
];

const EXAM_CHIP: Record<ExamId, string> = {
  all:        "",
  bpsc72:     "BPSC",
  adeo:       "ADEO",
  "bssc-cgl": "BSSC",
};

type ContentItem = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  exams: ExamId[];   // exams this content is relevant for
};

const CONTENT: ContentItem[] = [
  {
    href: "/ca",
    emoji: "📰",
    title: "Current Affairs",
    desc: "Daily CA sets, month-wise revision",
    color: "#c06010",
    exams: ["bpsc72", "adeo", "bssc-cgl"],
  },
  {
    href: "/ca/theme/polity",
    emoji: "📕",
    title: "GS Ghatnachakra",
    desc: "Polity, economy & governance GS",
    color: "#6366f1",
    exams: ["bpsc72", "bssc-cgl"],
  },
  {
    href: "/ca/theme/bihar-special",
    emoji: "🗺️",
    title: "Bihar GS",
    desc: "Bihar history, geography & polity",
    color: "#b91c1c",
    exams: ["bpsc72", "adeo"],
  },
  {
    href: "/ca/theme/history-culture",
    emoji: "📗",
    title: "NCERT",
    desc: "History, culture & geography basics",
    color: "#0891b2",
    exams: ["bpsc72", "bssc-cgl"],
  },
  {
    href: "/ca",
    emoji: "📘",
    title: "Lucent GK",
    desc: "Static GK, science & environment",
    color: "#7c3aed",
    exams: ["bpsc72", "adeo", "bssc-cgl"],
  },
  {
    href: "/quizzes",
    emoji: "🎯",
    title: "Quiz",
    desc: "Timed MCQs with instant feedback",
    color: "#15803d",
    exams: ["bpsc72", "adeo", "bssc-cgl"],
  },
  {
    href: "/pyq",
    emoji: "📋",
    title: "Bihar PYQ",
    desc: "BPSC previous year questions",
    color: "#d97706",
    exams: ["bpsc72"],
  },
];

const TOOLS = [
  { href: "/partner", emoji: "🤝", title: "Study Partner", desc: "Find your accountability partner", color: "#15803d" },
  { href: "/support", emoji: "💙", title: "Feeling Sad?",  desc: "Take a breath. We've got you.",   color: "#6366f1" },
  { href: "/ask",     emoji: "🧠", title: "Ask Tutor",     desc: "AI tutor — ask anything, anytime", color: "#c06010" },
];

export default function HomePage() {
  const [exam, setExam] = useState<ExamId>("all");

  useEffect(() => {
    const saved = localStorage.getItem("exam") as ExamId | null;
    if (saved && EXAM_TABS.some(t => t.id === saved)) setExam(saved);
  }, []);

  function pickExam(id: ExamId) {
    setExam(id);
    localStorage.setItem("exam", id);
  }

  const visible = exam === "all"
    ? CONTENT
    : CONTENT.filter(c => c.exams.includes(exam));

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", padding: "0 0 64px" }}>

      {/* ── Brand header ──────────────────────────────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "40px 20px 24px", textAlign: "center",
      }}>
        <Image
          src="/icons/icon.svg"
          alt="OneShot GS"
          width={72} height={72}
          style={{ borderRadius: "50%", marginBottom: 14, boxShadow: "0 4px 20px rgba(184,97,23,0.22)" }}
          priority
        />
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--ink-strong)",
          marginBottom: 8,
        }}>
          OneShot GS
        </h1>
        <p style={{
          fontSize: 13, color: "var(--muted)",
          fontWeight: 500, fontStyle: "italic", letterSpacing: "0.01em",
        }}>
          असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥
        </p>
      </div>

      {/* ── Exam switcher ─────────────────────────────────────── */}
      <div style={{
        maxWidth: 860, margin: "0 auto 28px", padding: "0 14px",
        display: "flex", gap: 8, overflowX: "auto",
      }} className="hide-scrollbar">
        {EXAM_TABS.map(({ id, label }) => {
          const active = exam === id;
          return (
            <button key={id} onClick={() => pickExam(id)} style={{
              flexShrink: 0,
              border: active ? "1.5px solid var(--accent)" : "1.5px solid var(--line-hi)",
              background: active ? "var(--accent)" : "var(--card)",
              color: active ? "#fff" : "var(--ink-soft)",
              fontWeight: 700, fontSize: 13,
              padding: "8px 18px", borderRadius: 999,
              cursor: "pointer",
              transition: "background 0.13s, color 0.13s, border-color 0.13s",
            }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Content section ───────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 14px 8px" }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
          marginBottom: 10, paddingLeft: 4,
        }}>
          {exam === "all" ? "Study Material" : `Study Material · ${EXAM_TABS.find(t => t.id === exam)?.label}`}
        </p>

        <div className="content-grid">
          {visible.map(item => (
            <Link key={item.href + item.title} href={item.href} className="content-card" style={{
              "--c": item.color,
            } as React.CSSProperties}>
              <span className="card-emoji">{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15, fontWeight: 700,
                  color: "var(--ink-strong)",
                  letterSpacing: "-0.02em",
                  marginBottom: 2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.title}</p>
                <p style={{
                  fontSize: 12, color: "var(--muted)",
                  lineHeight: 1.5,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item.desc}</p>
              </div>

              {/* Exam chips — shown only in "All" view */}
              {exam === "all" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
                  {item.exams.map(e => (
                    <span key={e} style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "2px 6px", borderRadius: 999,
                      background: "var(--chip)", color: "var(--muted)",
                    }}>{EXAM_CHIP[e]}</span>
                  ))}
                </div>
              )}

              <span className="card-arrow">›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tools section ─────────────────────────────────────── */}
      <section style={{ maxWidth: 860, margin: "24px auto 0", padding: "0 14px" }}>
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
          marginBottom: 10, paddingLeft: 4,
        }}>More on this site</p>

        <div className="tools-grid">
          {TOOLS.map(item => (
            <Link key={item.href} href={item.href} className="tool-card" style={{
              "--c": item.color,
            } as React.CSSProperties}>
              <div className="tool-icon">{item.emoji}</div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 14, fontWeight: 700,
                color: "var(--ink-strong)",
                letterSpacing: "-0.02em",
                marginBottom: 3,
              }}>{item.title}</p>
              <p style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5 }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 540px) {
          .content-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        }

        .content-card {
          text-decoration: none;
          display: flex; align-items: center; gap: 12px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 1px 6px rgba(120,80,30,0.04);
          transition: transform 0.13s ease, box-shadow 0.13s ease, border-color 0.13s ease;
        }
        @media (hover: hover) {
          .content-card:hover {
            transform: translateY(-2px);
            border-color: color-mix(in srgb, var(--c) 35%, transparent);
            box-shadow: 0 6px 22px rgba(120,80,30,0.09);
          }
        }

        .card-emoji {
          font-size: 26px; line-height: 1; flex-shrink: 0;
          width: 46px; height: 46px; border-radius: 14px;
          display: grid; place-items: center;
          background: color-mix(in srgb, var(--c) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
        }

        .card-arrow {
          font-size: 20px; font-weight: 300;
          color: var(--muted); flex-shrink: 0;
          transition: transform 0.13s ease;
        }
        @media (hover: hover) {
          .content-card:hover .card-arrow { transform: translateX(2px); color: var(--c); }
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .tool-card {
          text-decoration: none;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 16px 14px;
          display: flex; flex-direction: column; align-items: flex-start;
          box-shadow: 0 1px 6px rgba(120,80,30,0.04);
          transition: transform 0.13s ease, box-shadow 0.13s ease, border-color 0.13s ease;
        }
        @media (hover: hover) {
          .tool-card:hover {
            transform: translateY(-2px);
            border-color: color-mix(in srgb, var(--c) 35%, transparent);
            box-shadow: 0 6px 22px rgba(120,80,30,0.09);
          }
        }

        .tool-icon {
          font-size: 24px; line-height: 1; margin-bottom: 10px;
          width: 44px; height: 44px; border-radius: 14px;
          display: grid; place-items: center;
          background: color-mix(in srgb, var(--c) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
        }
      `}</style>
    </main>
  );
}
