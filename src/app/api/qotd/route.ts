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

    const allFiles: string[] = [];
    for (const month of months) {
      const dir = path.join(base, month);
      let files: string[] = [];
      try { files = await fs.readdir(dir); } catch { continue; }
      for (const f of files) {
        if (f.match(/set-\d+-quiz-english\.json$/)) {
          allFiles.push(path.join(dir, f));
        }
      }
    }

    if (allFiles.length === 0) return NextResponse.json({ error: "no data" }, { status: 404 });

    // Deterministic daily seed
    const dayIndex = Math.floor(Date.now() / 86400000);
    const fileIndex = dayIndex % allFiles.length;
    const raw = await fs.readFile(allFiles[fileIndex], "utf8");
    const questions: RawQuestion[] = JSON.parse(raw);

    if (!questions.length) return NextResponse.json({ error: "empty" }, { status: 404 });

    const qIndex = dayIndex % questions.length;
    const q = questions[qIndex];

    // Normalise options to array
    const options = Object.entries(q.options).map(([key, val]) => ({ key, val }));
    const correctKey = q.answer;

    return NextResponse.json({
      question: q.question,
      statements: q.statements ?? null,
      options,
      correctKey,
      explanation: q.explanation,
      day: dayIndex,
    });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
