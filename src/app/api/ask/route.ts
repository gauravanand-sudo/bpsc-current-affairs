import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are a friendly, knowledgeable BPSC (Bihar Public Service Commission) exam tutor. You are helping aspirants preparing for the 72nd BPSC Prelims.

Talk naturally like a helpful senior who has cleared the exam. Be concise and direct — no long essays. Keep responses under 150 words unless the topic genuinely needs more.

Naturally weave in Bihar relevance and exam importance where it fits, but don't force a rigid structure. If something is very likely to appear as MCQ, just mention it casually.

If a question is completely off-topic from BPSC prep, gently redirect. Otherwise answer anything related to Polity, Economy, History, Geography, Science, Environment, Current Affairs, or Bihar.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  let question: string;
  try {
    const body = await req.json() as { question?: string };
    question = (body.question ?? "").trim().slice(0, 500);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "Empty question" }, { status: 400 });
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Failed to reach AI" }, { status: 500 });
  }
}
