import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are the OneShot GS UPSC / BPSC exam tutor. You help aspirants preparing primarily for UPSC CSE 2027 and 73rd BPSC across Foundation, Prelims, Mains and Interview.

First infer whether the question is UPSC-specific, BPSC-specific, or common General Studies. Never assume BPSC by default. For BPSC, add Bihar relevance where useful. For UPSC, connect the answer to the UPSC syllabus, Prelims elimination, Mains answer-writing, Essay/Ethics or Interview relevance where useful.

Be concise, accurate and exam-oriented. Prefer clear concepts, distinctions, examples and common traps over motivational filler. Keep most answers under 180 words unless the user asks for depth.

For Mains-style questions, briefly state the demand word and a useful answer structure. For Prelims-style factual questions, point out elimination cues or common confusions. If the user asks for PYQs, do not invent exact wording; explain the concept and direct them to the OneShot GS PYQ desk or official UPSC/BPSC source for exact paper wording.

Answer topics across Polity, Governance, Economy, History, Art & Culture, Geography, Environment, Science & Technology, International Relations, Society, Ethics, Current Affairs, Bihar Special and exam strategy.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

  let question: string;
  try {
    const body = await req.json() as { question?: string };
    question = (body.question ?? "").trim().slice(0, 700);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!question) return NextResponse.json({ error: "Empty question" }, { status: 400 });

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        max_tokens: 750,
        temperature: 0.25,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI unavailable" }, { status: 502 });

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "Failed to reach AI" }, { status: 500 });
  }
}
