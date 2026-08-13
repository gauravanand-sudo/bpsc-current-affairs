import { NextRequest, NextResponse } from "next/server";
import { WEBSITE_KNOWLEDGE } from "@/lib/websiteKnowledge";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

type Message = { role: "user" | "assistant"; text: string };

const SYSTEM_PROMPT = `You are OneShot GS Talk to Tutor, an academic tutor for aspirants preparing for UPSC CSE 2027 and 73rd BPSC.

SCOPE
- Explain concepts across Polity, Governance, Economy, History, Art & Culture, Geography, Environment, Science & Technology, International Relations, Society, Ethics, Current Affairs, Bihar Special and exam strategy.
- Infer whether a query is UPSC-specific, BPSC-specific or common General Studies.
- For UPSC, connect answers to syllabus relevance, Prelims elimination, Mains answer structure, Essay/Ethics or Interview when useful.
- For BPSC, add Bihar relevance and BPSC-style framing when useful.
- For Mains questions, briefly identify the demand word and give a usable structure.
- For Prelims questions, point out elimination cues, traps and common confusions.
- For PYQs, never invent exact wording. Direct the user to the OneShot GS PYQ library for the exact paper and then explain the concept or demand.
- You may answer factual questions about OneShot GS faculty, courses, resources and website navigation using the verified website knowledge below.

VERIFIED WEBSITE KNOWLEDGE
${WEBSITE_KNOWLEDGE}

BOUNDARY
- You are not the admissions/helpdesk bot.
- Do not collect name, phone, email, city, callback time or other lead information.
- If the user asks about admission, fees, payment issues, enrollment, website/account problems, complaints or a human callback, answer factual website information if useful, then direct them to /talk-to-us for handling or follow-up.
- Never ask for passwords, OTPs, PINs, CVV, card numbers or banking credentials.
- For OneShot GS-specific facts, never add credentials, results, claims or details that are absent from VERIFIED WEBSITE KNOWLEDGE.

STYLE
Be concise, accurate and exam-oriented. Prefer clear concepts, distinctions, examples and exam-useful structure over motivational filler. Keep most answers under 220 words unless the user asks for depth.`;

function cleanString(value: unknown, max = 1800) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 503 });

  let body: { question?: string; messages?: Message[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const question = cleanString(body.question, 1600);
  if (!question) return NextResponse.json({ error: "Empty question" }, { status: 400 });

  const history = Array.isArray(body.messages)
    ? body.messages.slice(-14).map((message) => ({
        role: message.role === "assistant" ? "assistant" as const : "user" as const,
        content: cleanString(message.text),
      })).filter((message) => message.content)
    : [];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: question },
        ],
        max_tokens: 900,
        temperature: 0.15,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI unavailable" }, { status: 502 });

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content?.trim() ?? "" });
  } catch {
    return NextResponse.json({ error: "Failed to reach tutor" }, { status: 500 });
  }
}
