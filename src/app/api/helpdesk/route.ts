import { NextRequest, NextResponse } from "next/server";
import { emailHelpdeskTranscript, persistHelpdeskEvents } from "@/lib/helpdeskServer";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const INTENTS = ["admission", "course", "payment", "technical", "general"] as const;
type Intent = (typeof INTENTS)[number];

type Profile = {
  name?: string;
  email?: string;
  phone?: string;
  exam?: string;
  city?: string;
  stage?: string;
  callbackTime?: string;
  device?: string;
  courseInterest?: string;
};

type Message = { role: "user" | "assistant"; text: string };

type AiOutput = {
  answer?: string;
  intent?: Intent;
  profile_updates?: Profile;
  lead_ready?: boolean;
  needs_human?: boolean;
};

const SYSTEM_PROMPT = `You are OneShot GS Talk to Us, the private admissions and helpdesk assistant for OneShot GS.

CURRENT PROGRAM FACTS
- UPSC CSE 2027 Complete Program: ₹1,60,000. Foundation + Prelims + Mains + Interview.
- 73rd BPSC Complete Program: ₹87,000. Foundation + Prelims + Mains + Interview.
- Online payment is currently temporarily unavailable while the payment flow is being fixed.
- UPSC Prelims GS-I PDFs for 2014–2026 are hosted on OneShot GS.

YOUR JOB
1. Classify the conversation as exactly one of: admission, course, payment, technical, general.
2. Answer the user's immediate question first. Do not sound like a form or sales script.
3. Collect only the information genuinely needed for that type of conversation, and only one or two missing items at a time.
4. Never ask again for information already present in CURRENT PROFILE or visible in the conversation.
5. Never invent contact details, exam preferences, names or personal facts. profile_updates must contain only details explicitly provided by the user.
6. Keep answers concise and useful. No motivational filler.
7. If the user asks a subject/exam-content doubt, tell them Talk to Tutor is the right desk and direct them to /ask. Do not turn the helpdesk into an academic tutor.

LEAD / SUPPORT RULES
- admission: normally collect name, one contact method (phone/WhatsApp or email), target exam/course, current preparation stage, city and preferred callback time. The minimum for lead_ready=true is name + one contact method + target exam/course.
- course: answer course/fee/coverage questions directly. If the user wants admission, a callback or human follow-up, transition to admission collection.
- payment: acknowledge the current payment-flow issue when relevant. Collect name, one contact method, program/course and a short description of the issue. needs_human=true. Never ask for OTP, UPI PIN, card number, CVV, password, banking login or other financial credentials.
- technical: collect the affected page/feature, what happened, device/browser when useful, and one contact method only if human follow-up is needed. needs_human=true for unresolved technical issues.
- general: answer the query. Ask for contact details only if a human follow-up is requested or clearly useful.

PRIVACY / SAFETY
- Tell users not to share passwords, OTPs, PINs, CVV, full card numbers or banking credentials if the topic could involve payment/security.
- Do not request Aadhaar/PAN or other government IDs for ordinary admissions/helpdesk queries.

OUTPUT FORMAT
Return ONLY valid JSON with this exact shape:
{
  "answer": "natural-language reply shown to the visitor",
  "intent": "admission|course|payment|technical|general",
  "profile_updates": {
    "name": "only if explicitly provided",
    "email": "only if explicitly provided",
    "phone": "only if explicitly provided",
    "exam": "only if explicitly provided",
    "city": "only if explicitly provided",
    "stage": "only if explicitly provided",
    "callbackTime": "only if explicitly provided",
    "device": "only if explicitly provided",
    "courseInterest": "only if explicitly provided"
  },
  "lead_ready": false,
  "needs_human": false
}
Omit profile fields that were not explicitly provided. Do not wrap JSON in markdown.`;

function cleanString(value: unknown, max = 180) {
  return typeof value === "string" ? value.trim().slice(0, max) : undefined;
}

function cleanProfile(value: unknown): Profile {
  if (!value || typeof value !== "object") return {};
  const raw = value as Record<string, unknown>;
  return {
    name: cleanString(raw.name, 100),
    email: cleanString(raw.email, 160),
    phone: cleanString(raw.phone, 60),
    exam: cleanString(raw.exam, 120),
    city: cleanString(raw.city, 100),
    stage: cleanString(raw.stage, 140),
    callbackTime: cleanString(raw.callbackTime, 100),
    device: cleanString(raw.device, 140),
    courseInterest: cleanString(raw.courseInterest, 140),
  };
}

function mergeProfile(base: Profile, updates: Profile): Profile {
  const merged: Profile = { ...base };
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "string" && value.trim()) (merged as Record<string, string>)[key] = value.trim();
  }
  return merged;
}

function normalizeIntent(value: unknown, fallback: Intent): Intent {
  return typeof value === "string" && (INTENTS as readonly string[]).includes(value) ? value as Intent : fallback;
}

function extractJson(raw: string): AiOutput | null {
  try {
    return JSON.parse(raw) as AiOutput;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try { return JSON.parse(match[0]) as AiOutput; } catch { return null; }
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  let body: {
    question?: string;
    conversationId?: string;
    messages?: Message[];
    profile?: Profile;
    intent?: Intent;
    pagePath?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const question = cleanString(body.question, 1600) ?? "";
  if (!question) return NextResponse.json({ error: "Empty question" }, { status: 400 });

  const conversationId = cleanString(body.conversationId, 80) || crypto.randomUUID();
  const currentIntent = normalizeIntent(body.intent, "general");
  const currentProfile = cleanProfile(body.profile);
  const history = Array.isArray(body.messages)
    ? body.messages.slice(-14).map((m) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: cleanString(m.text, 1800) || "",
      })).filter((m) => m.content)
    : [];

  if (!apiKey) {
    const fallback = "Talk to Us is temporarily unavailable. Please use the course or admissions pages and try again shortly.";
    const stored = await persistHelpdeskEvents([{
      conversationId, role: "user", message: question, intent: currentIntent,
      profile: currentProfile, leadReady: false, needsHuman: true, pagePath: body.pagePath,
    }]);
    return NextResponse.json({ answer: fallback, intent: currentIntent, profile: currentProfile, leadReady: false, needsHuman: true, stored, notified: false, conversationId }, { status: 503 });
  }

  try {
    const context = `CURRENT PROFILE: ${JSON.stringify(currentProfile)}\nCURRENT INTENT: ${currentIntent}`;
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: context },
          ...history,
          { role: "user", content: question },
        ],
        max_tokens: 900,
        temperature: 0.15,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: "AI unavailable" }, { status: 502 });

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(raw);
    const answer = cleanString(parsed?.answer, 2400) || raw.trim() || "Please tell me how I can help.";
    const intent = normalizeIntent(parsed?.intent, currentIntent);
    const profile = mergeProfile(currentProfile, cleanProfile(parsed?.profile_updates));
    const leadReady = parsed?.lead_ready === true;
    const needsHuman = parsed?.needs_human === true;

    const transcript: Message[] = [
      ...(Array.isArray(body.messages) ? body.messages.slice(-28) : []),
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ];

    const [stored, notified] = await Promise.all([
      persistHelpdeskEvents([
        { conversationId, role: "user", message: question, intent, profile, leadReady, needsHuman, pagePath: body.pagePath },
        { conversationId, role: "assistant", message: answer, intent, profile, leadReady, needsHuman, pagePath: body.pagePath },
      ]),
      emailHelpdeskTranscript({ conversationId, intent, profile, transcript, leadReady, needsHuman }),
    ]);

    return NextResponse.json({ answer, intent, profile, leadReady, needsHuman, stored, notified, conversationId });
  } catch {
    return NextResponse.json({ error: "Failed to reach helpdesk assistant" }, { status: 500 });
  }
}
