import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import QuizEngine, { type QuizData, type QuizQuestion } from "@/components/QuizEngine";

/* ─── Format normalizer ──────────────────────────────────────────
   Accepts two shapes from JSON:

   Shape A (engine-native):
   { title, duration, negativeMarking, cutoff, questions: [...] }

   Shape B (user's natural format — array of question objects):
   [{ type, question, options: {A,B,C,D}, answer: "B", explanation }]
   ─────────────────────────────────────────────────────────────── */
type UserQuestion = {
  type?: string;
  question: string;
  statements?: Record<string, string>; // { A: "...", B: "...", C: "...", D: "..." }
  options: Record<string, string> | string[];
  answer: string | number;
  explanation?: string;
};

const LETTER_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

function normalizeQuiz(raw: unknown, fallbackTitle: string): QuizData | null {
  if (!raw || typeof raw !== "object") return null;

  // Shape A — already correct structure
  if (!Array.isArray(raw) && (raw as Record<string,unknown>).questions) {
    return raw as QuizData;
  }

  // Shape B — array of questions
  const arr: UserQuestion[] = Array.isArray(raw) ? (raw as UserQuestion[]) : [];
  if (arr.length === 0) return null;

  const questions: QuizQuestion[] = arr.map((q, i) => {
    // Normalize options → string[]
    // Single-correct questions use keys "A"/"B"/"C"/"D"
    // Multiple-correct questions use keys "1"/"2"/"3"/"4"
    let opts: string[];
    if (Array.isArray(q.options)) {
      opts = q.options as string[];
    } else {
      const optObj = q.options as Record<string, string>;
      if ("A" in optObj || "B" in optObj) {
        opts = ["A", "B", "C", "D"].map((k) => optObj[k] ?? "");
      } else {
        opts = ["1", "2", "3", "4"].map((k) => optObj[k] ?? "");
      }
    }

    // Normalize correct → 0-indexed number
    // "A"/"B"/"C"/"D"  →  0/1/2/3
    // 1/2/3/4 or "1"/"2"/"3"/"4"  →  0/1/2/3  (1-indexed)
    let correct: number;
    const ans = String(q.answer).trim().toUpperCase();
    if (ans in LETTER_INDEX) {
      correct = LETTER_INDEX[ans];
    } else {
      const n = parseInt(ans, 10);
      correct = isNaN(n) ? 0 : n - 1;
    }

    return {
      id: i + 1,
      question: q.question,
      statements: q.statements,
      options: opts,
      correct,
      explanation: q.explanation,
    };
  });

  return {
    title: fallbackTitle,
    duration: 1800,
    negativeMarking: 0.333,
    cutoff: Math.ceil(questions.length * 0.6),
    questions,
  };
}

/** set-1-english  →  set-1-quiz-english
 *  set-3-hindi    →  set-3-quiz-hindi      */
function quizFileName(setParam: string): string {
  if (setParam.endsWith("-english")) {
    return setParam.replace(/-english$/, "-quiz-english") + ".json";
  }
  if (setParam.endsWith("-hindi")) {
    return setParam.replace(/-hindi$/, "-quiz-hindi") + ".json";
  }
  // fallback: no language suffix
  return setParam + "-quiz.json";
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function setLabel(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ month: string; set: string }>;
}) {
  const { month, set } = await params;
  const fileName = quizFileName(set);
  const filePath = path.join(process.cwd(), "data", "ca", month, fileName);

  let quizData: QuizData | null = null;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const title = `${monthLabel(month)} — Set ${set.match(/\d+/)?.[0] ?? "1"}`;
    quizData = normalizeQuiz(parsed, title);
  } catch {
    // file not available yet or unparseable
  }

  /* ── Quiz not ready ───────────────────────────────────────── */
  if (!quizData) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(192,96,16,0.12)",
              border: "1px solid rgba(192,96,16,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 32,
            }}
          >
            ⏳
          </div>

          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#c06010",
              marginBottom: 12,
            }}
          >
            BPSC 365 · Quiz
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            {setLabel(set)} — Test
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#94a3b8",
              lineHeight: 1.7,
              marginBottom: 8,
            }}
          >
            {monthLabel(month)}
          </p>

          <p
            style={{
              fontSize: 14,
              color: "#64748b",
              lineHeight: 1.7,
              marginBottom: 36,
            }}
          >
            This quiz is being prepared by our team.<br />
            It will be live soon — check back after 24 hours.
          </p>

          {/* What to expect */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "20px 18px",
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: 14,
              }}
            >
              What to expect
            </p>
            {[
              "30 MCQs based on this set's current affairs",
              "30-minute timer, exactly like BPSC pattern",
              "−⅓ negative marking for wrong answers",
              "Score extrapolated to /150 with BPSC cutoff",
              "Detailed explanation for every question",
            ].map((line) => (
              <div
                key={line}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}
              >
                <span style={{ color: "#c06010", flexShrink: 0, marginTop: 2 }}>→</span>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55 }}>{line}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={`/ca/${month}/${set}`}
              style={{
                background: "linear-gradient(135deg, #c06010, #d97706)",
                color: "#fff",
                borderRadius: 12,
                padding: "13px 24px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: "0.02em",
                display: "block",
                textAlign: "center",
              }}
            >
              Revise the Set First →
            </Link>
            <Link
              href="/ca"
              style={{
                color: "#64748b",
                fontSize: 13,
                textDecoration: "none",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
                display: "block",
                textAlign: "center",
              }}
            >
              ← All Sets
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── Quiz ready ───────────────────────────────────────────── */
  return (
    <QuizEngine data={quizData} month={month} setName={set} />
  );
}
