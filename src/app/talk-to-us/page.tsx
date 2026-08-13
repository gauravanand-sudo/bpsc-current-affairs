"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Intent = "admission" | "course" | "payment" | "technical" | "general";
type Message = { role: "user" | "assistant"; text: string };
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

const STARTERS: Array<{ intent: Intent; title: string; copy: string; prompt: string }> = [
  { intent: "admission", title: "Admission", copy: "Enrollment, eligibility, callback or joining query", prompt: "I want to discuss admission." },
  { intent: "course", title: "Courses & Fees", copy: "UPSC 2027 / 73rd BPSC coverage, fee or program question", prompt: "I have a course or fee question." },
  { intent: "payment", title: "Payment Help", copy: "Enrollment payment or transaction-related help", prompt: "I need help with payment or enrollment payment." },
  { intent: "technical", title: "Technical Help", copy: "Website, login, PDF, quiz or account issue", prompt: "I have a technical issue on the website." },
  { intent: "general", title: "Other Query", copy: "Complaint, callback or another helpdesk query", prompt: "I have another query for the helpdesk." },
];

const INTENT_LABEL: Record<Intent, string> = {
  admission: "Admission",
  course: "Courses & Fees",
  payment: "Payment Help",
  technical: "Technical Help",
  general: "General Helpdesk",
};

function createConversationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `00000000-0000-4000-8000-${Math.random().toString(16).slice(2).padEnd(12, "0").slice(0, 12)}`;
}

export default function TalkToUsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [intent, setIntent] = useState<Intent>("general");
  const [profile, setProfile] = useState<Profile>({});
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const existing = localStorage.getItem("oneshot_helpdesk_conversation");
      const id = existing || createConversationId();
      if (!existing) localStorage.setItem("oneshot_helpdesk_conversation", id);
      setConversationId(id);

      const requested = new URLSearchParams(window.location.search).get("intent") as Intent | null;
      if (requested && STARTERS.some((item) => item.intent === requested)) setIntent(requested);
    } catch {
      setConversationId(createConversationId());
    }
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function talk(question?: string, nextIntent?: Intent) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    const activeIntent = nextIntent ?? intent;
    const history = messages;
    setIntent(activeIntent);
    setInput("");
    setStatus("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/helpdesk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          conversationId: conversationId || createConversationId(),
          messages: history,
          profile,
          intent: activeIntent,
          pagePath: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/talk-to-us",
        }),
      });
      const data = await res.json() as {
        answer?: string;
        intent?: Intent;
        profile?: Profile;
        stored?: boolean;
        notified?: boolean;
        conversationId?: string;
        error?: string;
      };

      const answer = data.answer || (data.error ? "The helpdesk assistant is temporarily unavailable. Please try again shortly." : "Please tell me a little more about your query.");
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      if (data.intent) setIntent(data.intent);
      if (data.profile) setProfile(data.profile);
      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
        try { localStorage.setItem("oneshot_helpdesk_conversation", data.conversationId); } catch { /* no-op */ }
      }
      if (data.stored && data.notified) setStatus("Conversation saved · helpdesk email updated");
      else if (data.stored) setStatus("Conversation saved for helpdesk follow-up");
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const captured = [
    profile.name && ["Name", profile.name],
    profile.phone && ["Phone", profile.phone],
    profile.email && ["Email", profile.email],
    (profile.exam || profile.courseInterest) && ["Exam", profile.exam || profile.courseInterest],
  ].filter(Boolean) as string[][];

  return (
    <main className="help-page">
      <section className="help-head">
        <div className="shell head-grid">
          <div>
            <span>ONESHOT GS HELPDESK</span>
            <h1>Talk to Us</h1>
            <p>Admissions, course queries, payment help, website support and human follow-up.</p>
          </div>
          <div className="head-links"><Link href="/ask">Talk to Tutor</Link><Link href="/courses">Courses</Link><Link href="/admissions">Admissions &amp; Fees</Link></div>
        </div>
      </section>

      <section className="shell help-grid">
        <aside className="help-menu">
          <div className="menu-title"><span>HELPDESK</span><h2>What do you need help with?</h2></div>
          <div className="starter-list">
            {STARTERS.map((item) => (
              <button key={item.intent} className={intent === item.intent ? "active" : ""} onClick={() => void talk(item.prompt, item.intent)} disabled={loading}>
                <b>{item.title}</b><span>{item.copy}</span>
              </button>
            ))}
          </div>
          <div className="privacy-note">
            <b>Private helpdesk conversation</b>
            <p>Details you provide may be stored for follow-up. Never share passwords, OTPs, UPI PINs, CVV or full card details.</p>
          </div>
        </aside>

        <div className="chat-card">
          <div className="chat-top">
            <div><span>QUERY TYPE</span><b>{INTENT_LABEL[intent]}</b></div>
            {captured.length > 0 && <div className="captured">{captured.map(([label, value]) => <span key={label}><b>{label}:</b> {value}</span>)}</div>}
          </div>

          <div className="messages">
            {messages.length === 0 && (
              <div className="welcome">
                <span>TALK TO US</span>
                <h2>How can the helpdesk assist?</h2>
                <p>Choose a category or type your query. If a callback or admission follow-up is needed, the assistant will collect the relevant contact details.</p>
                <div className="quick-mobile">{STARTERS.slice(0, 4).map((item) => <button key={item.intent} onClick={() => void talk(item.prompt, item.intent)}>{item.title}</button>)}</div>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                <span>{message.role === "user" ? "YOU" : "HELPDESK"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {loading && <div className="message assistant"><span>HELPDESK</span><p>Checking that for you…</p></div>}
            <div ref={bottomRef} />
          </div>

          <div className="composer-wrap">
            {status && <div className="save-status">✓ {status}</div>}
            <form onSubmit={(event) => { event.preventDefault(); void talk(); }} className="composer">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your admission, payment, course or support query…" rows={3} maxLength={1600} />
              <button type="submit" disabled={loading || !input.trim()}>Send →</button>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        .help-page{min-height:100vh;background:#f5f7fa;color:#26384d;font-family:Arial,"Helvetica Neue",sans-serif}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.help-head{background:#fff;border-bottom:1px solid #dbe2e8}.head-grid{min-height:125px;display:flex;align-items:center;justify-content:space-between;gap:30px}.help-head span,.menu-title>span,.welcome>span,.message>span,.chat-top>div:first-child>span{font-size:10px;font-weight:700;letter-spacing:.08em;color:#d9272e}.help-head h1{font-size:36px;line-height:1.1;color:#12345b;margin:4px 0;font-weight:700}.help-head p{font-size:13px;color:#647386}.head-links{display:flex;gap:7px;flex-wrap:wrap}.head-links a{padding:9px 11px;border:1px solid #d5dde5;background:#fff;color:#174f86;font-size:10px;font-weight:700}.help-grid{display:grid;grid-template-columns:310px 1fr;gap:14px;padding:22px 0 42px}.help-menu,.chat-card{background:#fff;border:1px solid #d8e0e7}.help-menu{align-self:start}.menu-title{padding:16px 17px;border-bottom:1px solid #dfe5ea}.menu-title h2{font-size:18px;color:#12345b;margin-top:3px}.starter-list{display:grid}.starter-list button{padding:12px 16px;text-align:left;background:#fff;border:0;border-bottom:1px solid #e3e7eb;cursor:pointer}.starter-list button:hover,.starter-list button.active{background:#f1f5f9;border-left:3px solid #d9272e;padding-left:13px}.starter-list b,.starter-list span{display:block}.starter-list b{font-size:11px;color:#12345b}.starter-list span{font-size:9px;line-height:1.45;color:#6d7987;margin-top:2px}.privacy-note{padding:15px 17px;background:#fff8f8;border-top:1px solid #f1d9da}.privacy-note b{font-size:10px;color:#a92328}.privacy-note p{font-size:9px;line-height:1.55;color:#6f6062;margin-top:4px}.chat-card{height:min(690px,calc(100dvh - 190px));min-height:570px;display:flex;flex-direction:column}.chat-top{min-height:55px;padding:10px 15px;border-bottom:1px solid #dfe5ea;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;gap:16px}.chat-top>div:first-child>b{display:block;font-size:12px;color:#12345b;margin-top:1px}.captured{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.captured>span{padding:4px 6px;background:#eaf1f7;color:#53677c;font-size:8px}.captured b{color:#174f86}.messages{flex:1;min-height:0;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;background:#fff}.welcome{max-width:550px;margin:auto;text-align:center}.welcome h2{font-size:27px;color:#12345b;margin:5px 0}.welcome p{font-size:11px;line-height:1.6;color:#697787}.quick-mobile{display:none}.message{max-width:82%;padding:11px 13px;border:1px solid #dbe2e8;background:#f5f7fa}.message.user{align-self:flex-end;background:#174f86;border-color:#174f86;color:#fff}.message.user>span{color:#dfeaf5}.message.assistant{align-self:flex-start}.message p{white-space:pre-wrap;font-size:11px;line-height:1.65;margin-top:3px}.composer-wrap{border-top:1px solid #dce3e9;background:#f8fafc}.save-status{padding:6px 13px 0;color:#2d6b45;font-size:9px;font-weight:700}.composer{padding:10px;display:grid;grid-template-columns:1fr auto;gap:8px}.composer textarea{resize:none;border:1px solid #cfd8e1;background:#fff;padding:10px 11px;font-family:inherit;font-size:11px;line-height:1.5;color:#26384d;outline:none}.composer textarea:focus{border-color:#174f86}.composer button{min-width:86px;border:0;background:#d9272e;color:#fff;padding:0 16px;font-size:10px;font-weight:700;cursor:pointer}.composer button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:780px){.head-grid{align-items:flex-start;flex-direction:column;padding:24px 0;min-height:0}.help-grid{grid-template-columns:1fr}.help-menu{display:none}.chat-card{height:calc(100dvh - 170px);min-height:530px}.quick-mobile{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:16px}.quick-mobile button{padding:9px;border:1px solid #d7dfe7;background:#fff;color:#174f86;font-size:9px;font-weight:700}.captured{display:none}.composer{grid-template-columns:1fr}.composer button{padding:11px}.message{max-width:92%}}@media(max-width:480px){.shell{width:calc(100% - 20px)}.help-head h1{font-size:31px}.head-links{display:none}.chat-card{height:calc(100dvh - 135px);border-inline:0}.help-grid{width:100%;padding-top:0}.messages{padding:13px}.welcome{padding:0 12px}}
      `}</style>
    </main>
  );
}
