"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Message = {
  id: number;
  text: string;
  username: string;
  created_at: string;
};

function getOrCreateUsername(signedInName?: string): string {
  if (signedInName) return signedInName.split(" ")[0];
  try {
    const stored = localStorage.getItem("bpsc_support_username");
    if (stored) return stored;
    const name = `Aspirant #${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("bpsc_support_username", name);
    return name;
  } catch {
    return `Aspirant #${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState(1);
  const [username, setUsername] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Get signed-in name if available
    supabase.auth.getSession().then(({ data }) => {
      const name = data.session?.user?.user_metadata?.full_name;
      setUsername(getOrCreateUsername(name));
    });

    // Load last 50 messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }: { data: Message[] | null }) => {
        if (data) setMessages(data as Message[]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });

    // Realtime subscription
    const channel = supabase
      .channel("support-room", { config: { presence: { key: "support" } } })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "support_messages",
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function send() {
    if (!text.trim() || sending) return;
    setSending(true);
    const supabase = getSupabaseBrowserClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("support_messages").insert({
      text: text.trim().slice(0, 500),
      username,
    });
    setText("");
    setSending(false);
    inputRef.current?.focus();
  }

  return (
    <main style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        padding: "20px 16px 16px",
        borderBottom: "1px solid var(--line)",
        background: "var(--card)",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 28, marginBottom: 6 }}>💙</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 20, color: "var(--ink-strong)", marginBottom: 4,
        }}>
          You&apos;re not alone
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 8 }}>
          This is a safe space. BPSC aspirants helping each other.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)",
          borderRadius: 20, padding: "4px 12px",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
            {online} {online === 1 ? "person" : "people"} here right now
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px",
        display: "flex", flexDirection: "column", gap: 10,
        paddingBottom: 80,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>🕊️</p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              Be the first to say something.<br />Someone out there needs to hear it.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.username === username;
          return (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
            }}>
              {!isMe && (
                <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, marginLeft: 4, fontWeight: 600 }}>
                  {msg.username}
                </p>
              )}
              <div style={{
                maxWidth: "80%",
                background: isMe
                  ? "linear-gradient(135deg, #c06010, #d97706)"
                  : "var(--card)",
                color: isMe ? "#fff" : "var(--ink-strong)",
                border: isMe ? "none" : "1px solid var(--line)",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                fontSize: 14,
                lineHeight: 1.55,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}>
                {msg.text}
              </div>
              <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, marginRight: isMe ? 2 : 0, marginLeft: isMe ? 0 : 4 }}>
                {timeAgo(msg.created_at)}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: "fixed",
        bottom: "calc(60px + env(safe-area-inset-bottom))",
        left: 0, right: 0,
        padding: "10px 12px",
        background: "rgba(244,239,232,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--line)",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Say something kind..."
          maxLength={500}
          style={{
            flex: 1,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 24,
            padding: "10px 16px",
            fontSize: 14,
            color: "var(--ink-strong)",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: text.trim() ? "var(--accent)" : "var(--line)",
            border: "none", cursor: text.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          ↑
        </button>
      </div>

    </main>
  );
}
