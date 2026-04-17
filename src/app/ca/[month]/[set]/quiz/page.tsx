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

function setLabel(month: string, s: string) {
  const monthName = new Date(+month.split("-")[0], +month.split("-")[1] - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
  });
  const setNum = s.match(/(\d+)/)?.[1] ?? "1";
  const lang = s.endsWith("-english") ? " English" : s.endsWith("-hindi") ? " Hindi" : "";
  return `${monthName} - Quiz Set ${setNum}/15${lang}`;
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ month: string; set: string }>;
  searchParams?: Promise<{ review?: string }>;
}) {
  const { month, set } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const fileName = quizFileName(set);
  const filePath = path.join(process.cwd(), "data", "ca", month, fileName);

  let quizData: QuizData | null = null;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const title = setLabel(month, set);
    quizData = normalizeQuiz(parsed, title);
  } catch {
    // file not available yet or unparseable
  }

  /* ── Quiz not ready ───────────────────────────────────────── */
  if (!quizData) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0c1220 0%, #1a2744 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>

          <div style={{ fontSize: 44, marginBottom: 20 }}>⏳</div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
            fontWeight: 700, color: "#f1f5f9",
            letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8,
          }}>
            {setLabel(month, set)}
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
            Quiz being prepared — check back in 24h
          </p>

          {/* Stat pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["30 MCQs", "30 min", "−⅓ negative", "/150 score"].map(s => (
              <span key={s} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, color: "#94a3b8",
              }}>{s}</span>
            ))}
          </div>

          <Link href={`/ca/${month}/${set}`} style={{
            display: "block", background: "linear-gradient(135deg, #c06010, #d97706)",
            color: "#fff", borderRadius: 14, padding: "14px 28px",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
            textDecoration: "none", letterSpacing: "0.01em",
            boxShadow: "0 6px 24px rgba(192,96,16,0.35)", marginBottom: 12,
          }}>
            📖 Study the Set First →
          </Link>
          <Link href="/ca" style={{
            fontSize: 12, color: "#475569", textDecoration: "none",
            fontFamily: "monospace", letterSpacing: "0.06em", display: "block",
          }}>
            ← All Sets
          </Link>

        </div>
      </main>
    );
  }

  /* ── Quiz ready ───────────────────────────────────────────── */
  return (
    <QuizEngine data={quizData} month={month} setName={set} reviewMode={resolvedSearchParams?.review === "best"} />
  );
}
