"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */
export type QuizQuestion = {
  id: number;
  question: string;
  statements?: Record<string, string>;
  options: string[];   // exactly 4
  correct: number;     // 0-indexed
  explanation?: string;
};

export type QuizData = {
  title: string;
  duration: number;
  negativeMarking: number;
  cutoff: number;
  questions: QuizQuestion[];
};

type Answers = Record<number, number>;

const LABELS = ["A", "B", "C", "D"];
const BPSC_TOTAL = 150;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function calcResult(questions: QuizQuestion[], answers: Answers, neg: number) {
  let raw = 0, correct = 0, wrong = 0, unattempted = 0;
  questions.forEach((q, i) => {
    const a = answers[i];
    if (a === undefined) unattempted++;
    else if (a === q.correct) { raw += 1; correct++; }
    else { raw -= neg; wrong++; }
  });
  const score    = Math.max(0, Math.round(raw * 100) / 100);
  const rawScore = Math.round(raw * 100) / 100;
  const pct      = questions.length ? (score / questions.length) * 100 : 0;
  const outOf150 = Math.round((raw / questions.length) * BPSC_TOTAL * 10) / 10;
  return { score, rawScore, pct, outOf150, correct, wrong, unattempted };
}

/* ─── QuizEngine ────────────────────────────────────────────── */
export default function QuizEngine({
  data, month, setName,
}: {
  data: QuizData; month: string; setName: string;
}) {
  const { questions, negativeMarking, cutoff, duration } = data;
  const total = questions.length;

  const [phase, setPhase]         = useState<"quiz" | "result">("quiz");
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState<Answers>({});
  const [flagged, setFlagged]     = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft]   = useState(duration);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [flash, setFlash]         = useState<number | null>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<Answers>({});

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const submitQuiz = useCallback((elapsed: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeTaken(elapsed);
    setPhase("result");
    const r = calcResult(questions, answersRef.current, negativeMarking);
    try {
      localStorage.setItem(`bpsc_quiz_${month}_${setName}`, JSON.stringify({
        ...r, maxScore: total, qualified: r.score >= cutoff,
        timeTaken: elapsed, date: new Date().toISOString(),
        month, setName, title: data.title,
      }));
    } catch { /* silent */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutoff, data.title, month, negativeMarking, questions, setName, total]);

  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { submitQuiz(duration); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, duration]);

  function selectOption(idx: number) {
    setAnswers(prev =>
      prev[current] === idx
        ? (({ [current]: _, ...rest }) => rest)(prev)
        : { ...prev, [current]: idx }
    );
    setFlash(idx);
    setTimeout(() => setFlash(null), 180);
  }

  function toggleFlag() {
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });
  }

  /* ── Result ── */
  if (phase === "result") {
    const r = calcResult(questions, answers, negativeMarking);
    return (
      <ResultScreen
        result={r} qualified={r.score >= cutoff} cutoff={cutoff}
        bpscCutoff={Math.round((cutoff / total) * BPSC_TOTAL)}
        timeTaken={timeTaken} questions={questions} answers={answers}
        total={total} showReview={showReview} setShowReview={setShowReview}
        negativeMarking={negativeMarking} month={month} setName={setName}
      />
    );
  }

  /* ── Quiz ── */
  const q   = questions[current];
  const sel = answers[current];
  const answered = Object.keys(answers).length;
  const urgent = timeLeft < 300;
  const veryUrgent = timeLeft < 60;

  const timerColor = veryUrgent ? "#dc2626" : urgent ? "#d97706" : "#16a34a";

  return (
    <div style={{
      minHeight: "calc(100vh - 52px)",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
      }}>
        {/* Title + progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {data.title}
          </p>
          <div style={{ height: 5, background: "var(--surface)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${((current + 1) / total) * 100}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              borderRadius: 3,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        {/* Q counter */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-strong)", fontFamily: "var(--font-display)", lineHeight: 1 }}>
            {current + 1}<span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>/{total}</span>
          </p>
          <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em" }}>{answered} answered</p>
        </div>

        {/* Timer */}
        <div style={{
          flexShrink: 0,
          background: veryUrgent ? "rgba(220,38,38,0.08)" : urgent ? "rgba(217,119,6,0.08)" : "rgba(22,163,74,0.08)",
          border: `1px solid ${timerColor}33`,
          borderRadius: 10,
          padding: "6px 14px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "monospace", fontSize: 22, fontWeight: 700, lineHeight: 1,
            color: timerColor,
            animation: veryUrgent ? "timer-urgent 0.8s ease infinite" : "none",
          }}>
            {fmt(timeLeft)}
          </p>
          <p style={{ fontSize: 9, color: "var(--muted)", marginTop: 2, letterSpacing: "0.08em" }}>remaining</p>
        </div>

        {/* End button */}
        <button
          onClick={() => submitQuiz(duration - timeLeft)}
          style={{
            flexShrink: 0,
            padding: "8px 14px", borderRadius: 9,
            border: "1px solid var(--line-hi)",
            background: "transparent",
            color: "var(--muted)", fontSize: 12, cursor: "pointer",
          }}
        >
          End
        </button>
      </div>

      {/* ── Body: LEFT question | RIGHT navigator ───────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
      }}>

        {/* LEFT — question + options */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 740,
        }}>

          {/* Question card */}
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 18,
            padding: "22px 20px",
          }}>
            <p style={{
              fontSize: 15, lineHeight: 1.75, color: "var(--ink-strong)", fontWeight: 500,
              marginBottom: q.statements ? 16 : 0,
            }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontFamily: "monospace", marginRight: 6 }}>Q{current + 1}.</span>
              {q.question}
            </p>

            {q.statements && (
              <div style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                {Object.entries(q.statements).map(([label, text]) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                      background: "var(--chip)", color: "var(--accent)",
                      fontSize: 11, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: 1,
                    }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = sel === i;
              const isFlashing = flash === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className="quiz-option"
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    textAlign: "left", width: "100%",
                    padding: "14px 16px", borderRadius: 13, cursor: "pointer",
                    border: isSelected ? "2px solid var(--accent)" : "1px solid var(--line-hi)",
                    background: isFlashing
                      ? "rgba(192,96,16,0.1)"
                      : isSelected
                      ? "var(--accent-soft)"
                      : "var(--card)",
                    color: isSelected ? "var(--ink-strong)" : "var(--ink-soft)",
                    fontSize: 14, lineHeight: 1.55,
                    transform: isFlashing ? "scale(0.99)" : "scale(1)",
                    transition: "all 0.12s",
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800,
                    background: isSelected ? "var(--accent)" : "var(--surface)",
                    color: isSelected ? "#fff" : "var(--muted)",
                    border: isSelected ? "none" : "1px solid var(--line-hi)",
                    transition: "all 0.12s",
                    marginTop: 1,
                  }}>
                    {LABELS[i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Bottom nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 4, paddingBottom: 8 }}>
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              style={{
                padding: "10px 20px", borderRadius: 10,
                border: "1px solid var(--line-hi)",
                background: "var(--card)",
                color: current === 0 ? "var(--line-hi)" : "var(--ink-soft)",
                fontSize: 13, cursor: current === 0 ? "not-allowed" : "pointer",
                fontFamily: "var(--font-display)", fontWeight: 600,
              }}
            >← Prev</button>

            <button
              onClick={toggleFlag}
              style={{
                padding: "10px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                border: flagged.has(current) ? "1px solid var(--accent)" : "1px solid var(--line-hi)",
                background: flagged.has(current) ? "var(--accent-soft)" : "var(--card)",
                color: flagged.has(current) ? "var(--accent)" : "var(--muted)",
              }}
            >
              {flagged.has(current) ? "🚩 Flagged" : "🏳 Flag"}
            </button>

            {current < total - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                style={{
                  padding: "10px 20px", borderRadius: 10,
                  border: "none",
                  background: sel !== undefined ? "var(--accent)" : "var(--surface)",
                  color: sel !== undefined ? "#fff" : "var(--muted)",
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  transition: "background 0.15s",
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => submitQuiz(duration - timeLeft)}
                style={{
                  padding: "10px 22px", borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  color: "#fff", fontSize: 13, cursor: "pointer",
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  boxShadow: "0 2px 12px rgba(22,163,74,0.3)",
                }}
              >
                Submit ✓
              </button>
            )}
          </div>

        </div>

        {/* RIGHT — question navigator */}
        <div style={{
          width: 220,
          flexShrink: 0,
          borderLeft: "1px solid var(--line)",
          background: "var(--panel)",
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--muted)" }}>
            Navigator
          </p>

          {/* Grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {questions.map((_, i) => {
              const isCurrent  = i === current;
              const isAnswered = answers[i] !== undefined;
              const isFlagged  = flagged.has(i);
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.1s",
                    border: isCurrent ? "2px solid var(--accent)" : "1px solid var(--line-hi)",
                    background: isCurrent
                      ? "var(--accent)"
                      : isFlagged
                      ? "rgba(192,96,16,0.12)"
                      : isAnswered
                      ? "var(--accent-soft)"
                      : "var(--card)",
                    color: isCurrent
                      ? "#fff"
                      : isFlagged
                      ? "var(--accent)"
                      : isAnswered
                      ? "var(--accent)"
                      : "var(--muted)",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { bg: "var(--accent-soft)", border: "var(--line-hi)", color: "var(--accent)", label: "Answered" },
              { bg: "rgba(192,96,16,0.12)", border: "var(--line-hi)", color: "var(--accent)", label: "Flagged" },
              { bg: "var(--card)", border: "var(--line-hi)", color: "var(--muted)", label: "Not visited" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1px solid ${l.border}`, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Answered</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{answered}/{total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Flagged</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)" }}>{flagged.size}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Skipped</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{total - answered}</span>
            </div>
          </div>

          <button
            onClick={() => submitQuiz(duration - timeLeft)}
            style={{
              width: "100%", padding: "11px", borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              color: "#fff", fontSize: 13, cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700,
              boxShadow: "0 2px 10px rgba(22,163,74,0.25)",
            }}
          >
            Submit Quiz ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Result Screen ─────────────────────────────────────────── */
function ResultScreen({
  result, qualified, cutoff, bpscCutoff, timeTaken,
  questions, answers, total, showReview, setShowReview,
  negativeMarking, month, setName,
}: {
  result: ReturnType<typeof calcResult>;
  qualified: boolean; cutoff: number; bpscCutoff: number;
  timeTaken: number; questions: QuizQuestion[]; answers: Answers;
  total: number; showReview: boolean; setShowReview: (v: boolean) => void;
  negativeMarking: number; month: string; setName: string;
}) {
  const { score, pct, outOf150, correct, wrong, unattempted, rawScore } = result;
  const col = pct >= 70 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  const CX = 60, R = 48, circ = 2 * Math.PI * R;
  const arcLen = Math.min((pct / 100) * circ, circ);

  return (
    <div style={{ minHeight: "calc(100vh - 52px)", background: "var(--bg)", overflowY: "auto" }}>

      {/* ── Score hero ── */}
      <div style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
        padding: "36px 24px 28px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>

          {/* Donut */}
          <svg width={130} height={130} viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
            <circle cx={CX} cy={CX} r={R} fill="none" stroke="var(--surface)" strokeWidth={11} />
            <circle
              cx={CX} cy={CX} r={R} fill="none"
              stroke={col} strokeWidth={11}
              strokeDasharray={`${arcLen} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
            />
            <text x={CX} y={CX - 4} textAnchor="middle" fill={col}
              fontSize={22} fontWeight="700" fontFamily="monospace">{score}</text>
            <text x={CX} y={CX + 13} textAnchor="middle"
              fill="var(--muted)" fontSize={10} fontFamily="monospace">/ {total}</text>
          </svg>

          {/* Score details */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: qualified ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.08)",
              border: `1px solid ${qualified ? "#16a34a" : "#dc2626"}44`,
              borderRadius: 20, padding: "6px 16px", marginBottom: 12,
            }}>
              <span style={{ fontSize: 16 }}>{qualified ? "✓" : "✗"}</span>
              <span style={{
                fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
                color: qualified ? "#16a34a" : "#dc2626",
              }}>
                {qualified ? "QUALIFIED" : "NOT QUALIFIED"}
              </span>
            </div>

            {/* Extrapolated */}
            <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: col, lineHeight: 1, marginBottom: 4 }}>
              {outOf150 < 0 ? outOf150.toFixed(1) : outOf150}
              <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 400 }}> / 150</span>
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 4 }}>
              Scaled to BPSC 150-question paper
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              Typical BPSC cutoff ≈ <strong style={{ color: "var(--ink-soft)" }}>{bpscCutoff}/150</strong>
              &nbsp;·&nbsp;
              {outOf150 >= bpscCutoff
                ? <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Above cutoff</span>
                : <span style={{ color: "#dc2626", fontWeight: 600 }}>✗ Below cutoff</span>
              }
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flexShrink: 0 }}>
            {[
              { label: "Correct",  v: correct,     color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
              { label: "Wrong",    v: wrong,        color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
              { label: "Skipped",  v: unattempted,  color: "var(--muted)", bg: "var(--surface)"   },
              { label: "Accuracy", v: `${pct.toFixed(0)}%`, color: col, bg: "var(--surface)"     },
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg, border: "1px solid var(--line)",
                borderRadius: 12, padding: "12px 14px", textAlign: "center", minWidth: 80,
              }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Marking + time row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 16px" }}>
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 5, textTransform: "uppercase" }}>Time Taken</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-strong)", fontFamily: "monospace" }}>{fmt(timeTaken)}</p>
          </div>
          <div style={{ flex: 1, minWidth: 160, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 16px" }}>
            <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 5, textTransform: "uppercase" }}>Raw Score</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--ink-strong)", fontFamily: "monospace" }}>
              {rawScore < 0 ? rawScore.toFixed(2) : rawScore}
            </p>
          </div>
          <div style={{ flex: 2, minWidth: 200, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.8 }}>
            <span style={{ color: "#16a34a", fontWeight: 700 }}>+1</span> correct &nbsp;·&nbsp;
            <span style={{ color: "#dc2626", fontWeight: 700 }}>−{negativeMarking.toFixed(2)}</span> wrong &nbsp;·&nbsp;
            <span style={{ color: "var(--muted)" }}>0</span> skipped
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowReview(!showReview)}
            style={{
              flex: 1, minWidth: 180, padding: "12px", borderRadius: 11,
              border: "1px solid var(--line-hi)",
              background: showReview ? "var(--accent-soft)" : "var(--card)",
              color: showReview ? "var(--accent)" : "var(--ink-soft)",
              fontSize: 13, cursor: "pointer", fontWeight: 600,
              fontFamily: "var(--font-display)",
            }}
          >
            {showReview ? "Hide Review" : "Review All Questions →"}
          </button>
          <Link
            href={`/ca/${month}/${setName}`}
            style={{
              flex: 1, minWidth: 140, padding: "12px", borderRadius: 11,
              border: "1px solid var(--line-hi)",
              background: "var(--card)", color: "var(--ink-soft)",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              textAlign: "center", fontFamily: "var(--font-display)",
              display: "block",
            }}
          >
            Revise Cards →
          </Link>
          <Link
            href="/ca"
            style={{
              flex: 1, minWidth: 120, padding: "12px", borderRadius: 11,
              border: "1px solid var(--line-hi)",
              background: "var(--card)", color: "var(--muted)",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              textAlign: "center", fontFamily: "var(--font-display)",
              display: "block",
            }}
          >
            All Sets
          </Link>
        </div>

        {/* Review */}
        {showReview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {questions.map((q, i) => {
              const ua  = answers[i];
              const ok  = ua === q.correct;
              const bad = ua !== undefined && !ok;
              return (
                <div key={i} style={{
                  background: "var(--card)",
                  border: `1px solid ${ok ? "rgba(22,163,74,0.35)" : bad ? "rgba(220,38,38,0.25)" : "var(--line)"}`,
                  borderRadius: 16, padding: "18px 16px",
                }}>
                  {/* Q header */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
                    <p style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace" }}>Q{i + 1}</p>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: ok ? "#16a34a" : bad ? "#dc2626" : "var(--muted)",
                    }}>
                      {ok ? "+1 ✓" : bad ? `−${negativeMarking.toFixed(2)} ✗` : "skipped"}
                    </span>
                  </div>

                  {/* Question text */}
                  <p style={{ fontSize: 14, color: "var(--ink-strong)", lineHeight: 1.65, marginBottom: q.statements ? 12 : 14 }}>
                    {q.question}
                  </p>

                  {/* Statements */}
                  {q.statements && (
                    <div style={{
                      background: "var(--panel)", border: "1px solid var(--line)",
                      borderRadius: 10, padding: "12px 14px",
                      display: "flex", flexDirection: "column", gap: 8, marginBottom: 14,
                    }}>
                      {Object.entries(q.statements).map(([label, text]) => (
                        <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--chip)", color: "var(--accent)", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>{label}</span>
                          <span style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Options */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: q.explanation ? 12 : 0 }}>
                    {q.options.map((opt, j) => {
                      const isUser    = ua === j;
                      const isCorrect = j === q.correct;
                      return (
                        <div key={j} style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "8px 12px", borderRadius: 9,
                          background: isCorrect ? "rgba(22,163,74,0.08)" : isUser ? "rgba(220,38,38,0.07)" : "transparent",
                          border: `1px solid ${isCorrect ? "rgba(22,163,74,0.3)" : isUser ? "rgba(220,38,38,0.2)" : "transparent"}`,
                        }}>
                          <span style={{
                            flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 800, marginTop: 1,
                            background: isCorrect ? "rgba(22,163,74,0.15)" : isUser ? "rgba(220,38,38,0.12)" : "var(--surface)",
                            color: isCorrect ? "#16a34a" : isUser ? "#dc2626" : "var(--muted)",
                          }}>{LABELS[j]}</span>
                          <span style={{ fontSize: 13, color: isCorrect ? "#15803d" : isUser ? "#dc2626" : "var(--ink-soft)", lineHeight: 1.55 }}>
                            {opt}{isCorrect && " ✓"}{isUser && !isCorrect && " ✗"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div style={{ background: "var(--accent-soft)", borderRadius: 10, padding: "12px 14px", marginTop: 4 }}>
                      <p style={{ fontSize: 9, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.14em", marginBottom: 5, fontFamily: "monospace" }}>EXPLANATION</p>
                      <p style={{ fontSize: 13, color: "var(--ink-strong)", lineHeight: 1.7 }}>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
