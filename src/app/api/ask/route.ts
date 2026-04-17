import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are an expert BPSC (Bihar Public Service Commission) exam tutor. You help aspirants preparing for the 72nd BPSC Prelims exam.

When answering a doubt, always structure your response in this exact format:

**Answer**
[Direct, clear answer in 2-4 sentences]

**Static Linkage**
[Connect to a standard textbook topic, e.g. "This falls under Polity — M. Laxmikant Ch. 12: Parliament"]

**Bihar Angle**
[Mention if/how this is relevant to Bihar specifically. If not relevant, write "Not directly Bihar-specific."]

**MCQ Verdict**
[One of: "High chance — frequently asked in BPSC" / "Medium chance — occasionally appears" / "Low chance — unlikely in prelims"]

Keep answers concise and exam-focused. Avoid long explanations. If the question is not related to BPSC exam preparation, politely redirect the user to ask about BPSC topics.`;

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
