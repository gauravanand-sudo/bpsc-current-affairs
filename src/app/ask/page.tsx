"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "UPSC: explain basic structure doctrine for Prelims and Mains",
  "BPSC: what Bihar economy themes should I revise for 73rd BPSC?",
  "Compare Finance Commission and GST Council",
  "How should I structure a GS2 answer on cooperative federalism?",
  "Explain monsoon mechanism with Prelims elimination traps",
  "Give me an Ethics case-study framework for administrative conflict",
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function ask(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      const data = await res.json() as { answer?: string; error?: string };
      let text = data.answer ?? "";
      if (!text) {
        if (data.error === "AI not configured") text = "Tutor AI is not configured yet. Please use the PYQ desk, Free Study or Support meanwhile.";
        else if (data.error === "AI unavailable") text = "Tutor service is temporarily unavailable. Please try again shortly.";
        else text = "I couldn't get an answer right now. Please try again.";
      }
      setMessages(prev => [...prev, { role: "ai", text }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  return (
    <main className="tutor-page">
      <section className="tutor-header"><div className="shell"><div><span>ONESHOT GS · UPSC / BPSC TUTOR</span><h1>Ask Tutor</h1><p>Ask concept, Prelims, Mains, Essay, Ethics, Bihar Special, Current Affairs or strategy questions. The tutor now distinguishes UPSC-specific, BPSC-specific and common GS queries.</p></div><div className="header-links"><Link href="/pyq">PYQ Desk</Link><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link></div></div></section>

      <section className="shell tutor-grid">
        <aside className="side-panel"><span>GOOD QUESTIONS TO ASK</span><h2>Use the tutor for exam output, not random browsing.</h2><div className="suggestions">{SUGGESTIONS.map(s => <button key={s} onClick={() => ask(s)}>{s}</button>)}</div><div className="tip"><b>PYQ rule</b><p>For exact previous-paper wording, use the PYQ desk and official paper source. The tutor can explain concepts, demands and answer structures.</p></div></aside>

        <div className="chat-card">
          <div className="messages">
            {messages.length === 0 && <div className="welcome"><span>UPSC / BPSC</span><h2>What are you studying right now?</h2><p>Try a syllabus concept, a Mains demand word, a Prelims elimination doubt or a Bihar-specific topic.</p></div>}
            {messages.map((m,i) => <div key={i} className={`message ${m.role}`}><span>{m.role === "user" ? "YOU" : "TUTOR"}</span><p>{m.text}</p></div>)}
            {loading && <div className="message ai"><span>TUTOR</span><p>Thinking through the exam angle…</p></div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={e => { e.preventDefault(); void ask(); }} className="composer"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ask an UPSC / BPSC question…" rows={3} /><button type="submit" disabled={loading || !input.trim()}>Ask Tutor →</button></form>
        </div>
      </section>

      <style>{`
        .tutor-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1050px,calc(100% - 32px));margin:0 auto}.tutor-header{padding:45px 0 34px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.tutor-header .shell{display:flex;justify-content:space-between;gap:30px;align-items:end}.tutor-header span,.side-panel>span,.welcome>span,.message>span{font-size:7px;letter-spacing:.14em;color:#98502e;font-weight:850}.tutor-header h1{font-family:var(--font-display);font-size:clamp(40px,6vw,64px);line-height:.95;letter-spacing:-.055em;margin:7px 0}.tutor-header p{font-size:11px;line-height:1.7;color:#657181;max-width:720px}.header-links{display:flex;gap:6px;flex-wrap:wrap}.header-links a{text-decoration:none;border:1px solid #d1d6dd;background:#fff;color:#26364f;padding:9px 10px;font-size:8px;font-weight:850}.tutor-grid{display:grid;grid-template-columns:300px 1fr;gap:14px;padding-top:24px;padding-bottom:45px}.side-panel,.chat-card{background:#fff;border:1px solid #d9d6d0}.side-panel{padding:18px;align-self:start}.side-panel h2{font-family:var(--font-display);font-size:21px;line-height:1.08;margin:8px 0 13px}.suggestions{display:grid;gap:6px}.suggestions button{border:1px solid #d9d6d0;background:#f7f5f0;text-align:left;padding:10px;color:#35465e;font-size:8.5px;line-height:1.45;cursor:pointer}.suggestions button:hover{border-color:#bcb6ac;background:#fff}.tip{margin-top:14px;padding-top:13px;border-top:1px solid #e4e1db}.tip b{font-size:8px}.tip p{font-size:7.8px;line-height:1.55;color:#6d7885;margin-top:4px}.chat-card{min-height:610px;display:flex;flex-direction:column}.messages{flex:1;padding:20px;overflow:auto;display:flex;flex-direction:column;gap:12px}.welcome{max-width:520px;margin:auto;text-align:center}.welcome h2{font-family:var(--font-display);font-size:29px;letter-spacing:-.04em;margin:8px 0}.welcome p{font-size:10px;line-height:1.65;color:#687482}.message{max-width:82%;padding:12px 13px;border:1px solid #d9d6d0;background:#f7f5f0}.message.user{align-self:flex-end;background:#26364f;color:#fff;border-color:#26364f}.message.user>span{color:#e2b58e}.message.ai{align-self:flex-start}.message p{white-space:pre-wrap;font-size:10px;line-height:1.7;margin-top:4px}.composer{border-top:1px solid #dedbd4;padding:12px;display:grid;grid-template-columns:1fr auto;gap:8px}.composer textarea{resize:none;border:1px solid #d2d6dc;background:#faf9f6;padding:11px;font-family:inherit;font-size:10px;line-height:1.55;color:#172338}.composer button{border:0;background:#9f3e1b;color:#fff;padding:0 17px;font-size:9px;font-weight:850;cursor:pointer}.composer button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:760px){.tutor-header .shell{align-items:flex-start;flex-direction:column}.tutor-grid{grid-template-columns:1fr}.side-panel{order:2}.chat-card{min-height:560px}.composer{grid-template-columns:1fr}.composer button{padding:11px}.message{max-width:92%}}
      `}</style>
    </main>
  );
}
