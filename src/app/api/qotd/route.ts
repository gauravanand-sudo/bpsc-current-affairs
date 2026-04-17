import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type RawQuestion = {
  type: string;
  question: string;
  statements?: Record<string, string>;
  options: Record<string, string>;
  answer: string;
  explanation: string;
};

export async function GET() {
  try {
    const base = path.join(process.cwd(), "data", "ca");
    const months = (await fs.readdir(base)).sort();

    // Collect all files that have actual questions (non-empty)
    const allQuestions: { q: RawQuestion; file: string }[] = [];
    for (const month of months) {
      const dir = path.join(base, month);
      let files: string[] = [];
      try { files = await fs.readdir(dir); } catch { continue; }
      for (const f of files) {
        if (!f.match(/set-\d+-quiz-english\.json$/)) continue;
        try {
          const raw = await fs.readFile(path.join(dir, f), "utf8");
          const qs: RawQuestion[] = JSON.parse(raw);
          if (Array.isArray(qs) && qs.length > 0) {
            qs.forEach(q => allQuestions.push({ q, file: f }));
          }
        } catch { continue; }
      }
    }

    if (allQuestions.length === 0) return NextResponse.json({ error: "no data" }, { status: 404 });

    const dayIndex = Math.floor(Date.now() / 86400000);
    const { q } = allQuestions[dayIndex % allQuestions.length];

    // Normalise options to array
    const options = Object.entries(q.options).map(([key, val]) => ({ key, val }));
    const correctKey = q.answer;

    return NextResponse.json({
      question: q.question,
      statements: q.statements ?? null,
      options,
      correctKey,
      explanation: q.explanation ?? "",
      day: dayIndex,
    });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
