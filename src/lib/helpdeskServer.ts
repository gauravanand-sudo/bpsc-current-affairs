type HelpdeskProfile = {
  name?: string;
  email?: string;
  phone?: string;
  exam?: string;
  city?: string;
  stage?: string;
  callbackTime?: string;
};

type TranscriptMessage = { role: "user" | "assistant"; text: string };

type HelpdeskEvent = {
  conversationId: string;
  role: "user" | "assistant";
  message: string;
  intent: string;
  profile: HelpdeskProfile;
  leadReady: boolean;
  needsHuman: boolean;
  pagePath?: string;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export async function persistHelpdeskEvents(events: HelpdeskEvent[]) {
  const config = supabaseConfig();
  if (!config || events.length === 0) return false;

  try {
    const response = await fetch(`${config.url}/rest/v1/helpdesk_events`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(events.map((event) => ({
        conversation_id: event.conversationId,
        role: event.role,
        message: event.message.slice(0, 5000),
        intent: event.intent,
        profile: event.profile,
        lead_ready: event.leadReady,
        needs_human: event.needsHuman,
        page_path: event.pagePath ?? "/ask",
      }))),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

function clean(value?: string) {
  return value?.trim() || "—";
}

export async function emailHelpdeskTranscript(args: {
  conversationId: string;
  intent: string;
  profile: HelpdeskProfile;
  transcript: TranscriptMessage[];
  leadReady: boolean;
  needsHuman: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.HELPDESK_EMAIL;
  const from = process.env.HELPDESK_FROM_EMAIL;
  if (!apiKey || !to || !from) return false;

  const transcriptText = args.transcript
    .slice(-30)
    .map((item) => `${item.role === "user" ? "VISITOR" : "ONESHOT GS"}: ${item.text}`)
    .join("\n\n");

  const body = [
    "OneShot GS Helpdesk conversation",
    "",
    `Conversation ID: ${args.conversationId}`,
    `Intent: ${args.intent}`,
    `Lead ready: ${args.leadReady ? "Yes" : "No"}`,
    `Human follow-up: ${args.needsHuman ? "Requested / useful" : "Not yet"}`,
    "",
    "CONTACT / CONTEXT",
    `Name: ${clean(args.profile.name)}`,
    `Email: ${clean(args.profile.email)}`,
    `Phone / WhatsApp: ${clean(args.profile.phone)}`,
    `Exam: ${clean(args.profile.exam)}`,
    `Preparation stage: ${clean(args.profile.stage)}`,
    `City: ${clean(args.profile.city)}`,
    `Preferred callback time: ${clean(args.profile.callbackTime)}`,
    "",
    "TRANSCRIPT",
    transcriptText,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[OneShot GS Helpdesk] ${args.intent} · ${clean(args.profile.name)} · ${args.conversationId.slice(0, 8)}`,
        text: body,
      }),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
