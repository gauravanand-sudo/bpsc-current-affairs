"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Explain basic structure doctrine for UPSC Prelims and Mains",
  "What Bihar economy themes should I revise for 73rd BPSC?",
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
    const history = messages;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, messages: history }),
      });
      const data = await res.json() as { answer?: string; error?: string };
      let answer = data.answer ?? "";
      if (!answer) {
        if (data.error === "AI not configured") answer = "Talk to Tutor is temporarily unavailable. Please use Free Study, PYQs or try again shortly.";
        else answer = "I couldn't answer that right now. Please try again.";
      }
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="tutor-page">
      <section className="tutor-head">
        <div className="shell head-grid">
          <div>
            <span>ACADEMIC TUTOR · UPSC / BPSC</span>
            <h1>Talk to Tutor</h1>
            <p>Concepts, Prelims, Mains, Essay, Ethics, Bihar Special, Current Affairs and exam strategy.</p>
          </div>
          <div className="head-links"><Link href="/study">Free Study</Link><Link href="/pyq">PYQs</Link><Link href="/talk-to-us">Talk to Us</Link></div>
        </div>
      </section>

      <section className="shell tutor-grid">
        <aside className="side-panel">
          <span>TRY A QUESTION</span>
          <h2>Academic doubts only</h2>
          <div className="suggestions">{SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => void ask(suggestion)} disabled={loading}>{suggestion}</button>)}</div>
          <div className="help-note"><b>Admissions or support?</b><p>Fees, enrollment, payment issues, technical help and callbacks are handled separately.</p><Link href="/talk-to-us">Open Talk to Us →</Link></div>
        </aside>

        <div className="chat-card">
          <div className="chat-top"><div><span>ONESHOT GS</span><b>Academic Tutor</b></div><Link href="/talk-to-us">Need helpdesk?</Link></div>
          <div className="messages">
            {messages.length === 0 && <div className="welcome"><span>TALK TO TUTOR</span><h2>What are you studying?</h2><p>Ask a syllabus concept, Prelims doubt, Mains demand, Bihar-specific topic or answer-writing question.</p></div>}
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`message ${message.role}`}><span>{message.role === "user" ? "YOU" : "TUTOR"}</span><p>{message.text}</p></div>)}
            {loading && <div className="message assistant"><span>TUTOR</span><p>Working through the exam angle…</p></div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={(event) => { event.preventDefault(); void ask(); }} className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask an UPSC / BPSC academic question…" rows={3} maxLength={1600} /><button type="submit" disabled={loading || !input.trim()}>Ask Tutor →</button></form>
        </div>
      </section>

      <style>{`
        .tutor-page{min-height:100vh;background:#f5f7fa;color:#26384d;font-family:Arial,"Helvetica Neue",sans-serif}.shell{width:min(1120px,calc(100% - 32px));margin:0 auto}.tutor-head{background:#fff;border-bottom:1px solid #dbe2e8}.head-grid{min-height:125px;display:flex;align-items:center;justify-content:space-between;gap:30px}.tutor-head span,.side-panel>span,.welcome>span,.message>span,.chat-top span{font-size:10px;font-weight:700;letter-spacing:.08em;color:#174f86}.tutor-head h1{font-size:36px;line-height:1.1;color:#12345b;margin:4px 0;font-weight:700}.tutor-head p{font-size:13px;color:#647386}.head-links{display:flex;gap:7px;flex-wrap:wrap}.head-links a{padding:9px 11px;border:1px solid #d5dde5;background:#fff;color:#174f86;font-size:10px;font-weight:700}.tutor-grid{display:grid;grid-template-columns:310px 1fr;gap:14px;padding:22px 0 42px}.side-panel,.chat-card{background:#fff;border:1px solid #d8e0e7}.side-panel{padding:16px;align-self:start}.side-panel h2{font-size:18px;color:#12345b;margin:4px 0 12px}.suggestions{display:grid;gap:6px}.suggestions button{border:1px solid #dce3e9;background:#f8fafc;text-align:left;padding:10px;color:#40546a;font-size:10px;line-height:1.45;cursor:pointer}.suggestions button:hover{border-color:#174f86;background:#fff}.help-note{margin-top:15px;padding-top:13px;border-top:1px solid #e1e6eb}.help-note b{font-size:10px;color:#12345b}.help-note p{font-size:9px;line-height:1.5;color:#6a7888;margin:3px 0 7px}.help-note a{font-size:9px;font-weight:700;color:#d9272e}.chat-card{height:min(690px,calc(100dvh - 190px));min-height:570px;display:flex;flex-direction:column}.chat-top{min-height:55px;padding:10px 15px;border-bottom:1px solid #dfe5ea;background:#f8fafc;display:flex;align-items:center;justify-content:space-between}.chat-top b{display:block;font-size:12px;color:#12345b;margin-top:1px}.chat-top a{font-size:9px;font-weight:700;color:#d9272e}.messages{flex:1;min-height:0;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;background:#fff}.welcome{max-width:560px;margin:auto;text-align:center}.welcome h2{font-size:27px;color:#12345b;margin:5px 0}.welcome p{font-size:11px;line-height:1.6;color:#697787}.message{max-width:82%;padding:11px 13px;border:1px solid #dbe2e8;background:#f5f7fa}.message.user{align-self:flex-end;background:#174f86;border-color:#174f86;color:#fff}.message.user>span{color:#dfeaf5}.message.assistant{align-self:flex-start}.message p{white-space:pre-wrap;font-size:11px;line-height:1.65;margin-top:3px}.composer{border-top:1px solid #dce3e9;padding:10px;display:grid;grid-template-columns:1fr auto;gap:8px;background:#f8fafc}.composer textarea{resize:none;border:1px solid #cfd8e1;background:#fff;padding:10px 11px;font-family:inherit;font-size:11px;line-height:1.5;color:#26384d;outline:none}.composer textarea:focus{border-color:#174f86}.composer button{min-width:105px;border:0;background:#174f86;color:#fff;padding:0 16px;font-size:10px;font-weight:700;cursor:pointer}.composer button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:780px){.head-grid{align-items:flex-start;flex-direction:column;padding:24px 0;min-height:0}.tutor-grid{grid-template-columns:1fr}.side-panel{display:none}.chat-card{height:calc(100dvh - 170px);min-height:530px}.composer{grid-template-columns:1fr}.composer button{padding:11px}.message{max-width:92%}}@media(max-width:480px){.shell{width:calc(100% - 20px)}.tutor-head h1{font-size:31px}.head-links{display:none}.chat-card{height:calc(100dvh - 135px);border-inline:0}.tutor-grid{width:100%;padding-top:0}.messages{padding:13px}.welcome{padding:0 12px}}
      `}</style>
    </main>
  );
}
