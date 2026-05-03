"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Message = {
  role: "user" | "ai";
  text: string;
};


const SUGGESTIONS = [
  "What is Article 356 and how is it relevant to Bihar?",
  "Explain the difference between Rajya Sabha and Lok Sabha",
  "What is the significance of Nalanda in Bihar history?",
  "What is the difference between GDP and GNP?",
  "What are Fundamental Rights and when can they be suspended?",
  "What is the role of the Finance Commission?",
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json() as { answer?: string; error?: string };
      let text = data.answer ?? "";
      if (!text) {
        if (data.error === "AI not configured") text = "⚠️ AI is not configured yet. The admin needs to add the GROQ_API_KEY to Vercel environment variables.";
        else if (data.error === "AI unavailable") text = "⚠️ AI service is temporarily unavailable. Please try again in a moment.";
        else text = "Sorry, couldn't get an answer. Please try again.";
      }
      setMessages(prev => [...prev, { role: "ai", text }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  return (
    <main className="chat-shell" style={{ background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        flexShrink: 0, padding: "12px 16px",
        borderBottom: "1px solid var(--line)",
        background: "rgba(244,239,232,0.97)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Image src="/logo3.png" alt="OneShot GS" width={100} height={38} style={{ objectFit: "contain", mixBlendMode: "darken", flexShrink: 0 }} priority />
        <div style={{ width: 1, height: 28, background: "var(--line)", flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>
            Ask Tutor
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            Only what scores. Zero fluff, zero filler.
          </p>
        </div>
        <div style={{
          marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 20, padding: "4px 10px", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a" }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>

        {messages.length === 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              background: "var(--card)", border: "1px solid var(--line)",
              borderRadius: 16, padding: "16px 14px", marginBottom: 20,
            }}>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 4 }}>
                👋 Ask me anything about the <strong style={{ color: "var(--ink-strong)" }}>72nd BPSC Prelims</strong> syllabus — Polity, Economy, History, Bihar, Geography, Science.
              </p>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>
                I&apos;ll give you the answer, which book chapter it&apos;s from, Bihar angle, and whether it&apos;s likely to appear as MCQ.
              </p>
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Try asking
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => ask(s)} style={{
                  textAlign: "left", background: "var(--card)",
                  border: "1px solid var(--line)", borderRadius: 12,
                  padding: "10px 14px", fontSize: 13, color: "var(--ink-soft)",
                  cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4,
                  transition: "border-color 0.1s",
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            {m.role === "user" ? (
              <div style={{
                background: "linear-gradient(135deg, #b86117, #d97706)",
                color: "#fff", borderRadius: "18px 18px 4px 18px",
                padding: "10px 14px", fontSize: 14, lineHeight: 1.55,
                maxWidth: "82%", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}>
                {m.text}
              </div>
            ) : (
              <div style={{
                background: "var(--card)", border: "1px solid var(--line)",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 16px", fontSize: 13, lineHeight: 1.7,
                maxWidth: "92%", color: "var(--ink-soft)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>🧠</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    BPSC AI Tutor
                  </span>
                </div>
                <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{
              background: "var(--card)", border: "1px solid var(--line)",
              borderRadius: "18px 18px 18px 4px", padding: "14px 18px",
            }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "var(--accent)", display: "inline-block",
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid var(--line)",
        background: "rgba(244,239,232,0.97)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        padding: "10px 12px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        display: "flex", gap: 8, alignItems: "flex-end",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); }
          }}
          placeholder="Ask your BPSC doubt..."
          maxLength={500}
          rows={1}
          style={{
            flex: 1, background: "var(--card)", border: "1px solid var(--line)",
            borderRadius: 18, padding: "10px 16px", fontSize: 14,
            color: "var(--ink-strong)", outline: "none", fontFamily: "inherit",
            resize: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
          }}
        />
        <button
          onClick={() => ask()}
          disabled={!input.trim() || loading}
          style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: input.trim() && !loading ? "var(--accent)" : "var(--line)",
            border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff", transition: "background 0.15s",
          }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
