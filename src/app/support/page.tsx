"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";

type Message = {
  id: number;
  text: string;
  username: string;
  created_at: string;
  reply_to_id?: number | null;
  reply_to_text?: string | null;
  reply_to_username?: string | null;
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

type ReplyTo = { id: number; text: string; username: string } | null;

function SupportPageInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState(searchParams.get("say") ?? "");
  const [sending, setSending] = useState(false);
  const [online, setOnline] = useState(1);
  const [username, setUsername] = useState("");
  const [replyTo, setReplyTo] = useState<ReplyTo>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setLoggedIn(!!user);
      setUsername(getOrCreateUsername(user?.user_metadata?.full_name));
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
      setUsername(getOrCreateUsername(session?.user?.user_metadata?.full_name));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }: { data: Message[] | null }) => {
        if (data) setMessages(data);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });

    const presenceKey = `user-${Math.random().toString(36).slice(2, 10)}`;
    const channel = supabase
      .channel("support-room", { config: { presence: { key: presenceKey } } })
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "support_messages",
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
      reply_to_id: replyTo?.id ?? null,
      reply_to_text: replyTo?.text ?? null,
      reply_to_username: replyTo?.username ?? null,
    });
    setText("");
    setReplyTo(null);
    setSending(false);
    inputRef.current?.focus();
  }

  return (
    <main className="chat-shell" style={{ background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Fixed header ── */}
      <div style={{
        flexShrink: 0,
        padding: "10px 14px",
        borderBottom: "1px solid var(--line)",
        background: "rgba(244,239,232,0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 10,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>💙</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)", letterSpacing: "-0.02em" }}>
              You&apos;re not alone
            </h1>
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
            Safe space · BPSC aspirants only
          </p>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.18)",
          borderRadius: 999, padding: "4px 10px", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "0.01em" }}>
            {online} online
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 14px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
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
              display: "flex", flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
            }}>
              {!isMe && (
                <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, marginLeft: 4, fontWeight: 600 }}>
                  {msg.username}
                </p>
              )}

              <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Reply preview */}
                {msg.reply_to_text && (
                  <div style={{
                    background: "rgba(120,80,30,0.07)",
                    border: "1px solid rgba(120,80,30,0.12)",
                    borderRadius: 10, padding: "5px 10px",
                    borderLeft: "3px solid var(--accent)",
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", marginBottom: 2 }}>
                      {msg.reply_to_username}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                      {msg.reply_to_text}
                    </p>
                  </div>
                )}

                {/* Bubble */}
                <div
                  style={{
                    background: isMe ? "linear-gradient(135deg, #c06010, #d97706)" : "var(--card)",
                    color: isMe ? "#fff" : "var(--ink-strong)",
                    border: isMe ? "none" : "1px solid var(--line)",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px", fontSize: 14, lineHeight: 1.55,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  {msg.text}
                </div>
              </div>

              {/* Time + Reply tap */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginTop: 3,
                flexDirection: isMe ? "row-reverse" : "row",
                marginLeft: isMe ? 0 : 4, marginRight: isMe ? 2 : 0,
              }}>
                <p style={{ fontSize: 10, color: "var(--muted)" }}>
                  {timeAgo(msg.created_at)}
                </p>
                <button
                  onClick={() => { setReplyTo({ id: msg.id, text: msg.text, username: msg.username }); inputRef.current?.focus(); }}
                  style={{
                    fontSize: 10, color: "var(--muted)", background: "none",
                    border: "none", cursor: "pointer", padding: 0,
                    fontFamily: "inherit", letterSpacing: "0.04em",
                  }}
                >
                  Reply
                </button>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid var(--line)",
        background: "rgba(244,239,232,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {!loggedIn ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", gap: 12 }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>
              Sign in to send a message
            </p>
            <button
              onClick={async () => {
                const supabase = getSupabaseBrowserClient();
                await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: getAuthRedirectUrl("/support") },
                });
              }}
              style={{
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: 10, padding: "9px 18px", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
                flexShrink: 0,
              }}
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            {replyTo && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 14px",
                background: "rgba(192,96,16,0.06)",
                borderBottom: "1px solid var(--line)",
                borderLeft: "3px solid var(--accent)",
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)" }}>Replying to {replyTo.username}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>
                    {replyTo.text}
                  </p>
                </div>
                <button onClick={() => setReplyTo(null)} style={{
                  fontSize: 18, color: "var(--muted)", background: "none",
                  border: "none", cursor: "pointer", flexShrink: 0, padding: "0 4px",
                }}>×</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 12px" }}>
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Say something kind..."}
                maxLength={500}
                style={{
                  flex: 1, background: "var(--card)", border: "1px solid var(--line)",
                  borderRadius: 24, padding: "10px 16px", fontSize: 14,
                  color: "var(--ink-strong)", outline: "none", fontFamily: "inherit",
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
                  fontSize: 18, flexShrink: 0, color: "#fff",
                  transition: "background 0.15s",
                }}
              >
                ↑
              </button>
            </div>
          </>
        )}
      </div>

    </main>
  );
}

export default function SupportPage() {
  return (
    <Suspense>
      <SupportPageInner />
    </Suspense>
  );
}
