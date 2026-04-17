"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type PartnerRequest = {
  id: number;
  username: string;
  topic: string;
  hours: string;
  medium: string;
  contact_hint: string | null;
  created_at: string;
};

const TOPICS = [
  "Current Affairs", "Polity & Governance", "Economy",
  "History & Culture", "Geography", "Bihar Special",
  "Science & Tech", "Environment", "Full Syllabus Revision",
];
const HOURS = ["1–2 hrs/day", "2–3 hrs/day", "3–5 hrs/day", "5+ hrs/day"];
const MEDIUMS = ["WhatsApp", "Telegram", "This chat"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function getUsername(): string {
  try {
    const s = localStorage.getItem("bpsc_support_username");
    if (s) return s;
    const n = `Aspirant #${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("bpsc_support_username", n);
    return n;
  } catch {
    return `Aspirant #${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

export default function PartnerPage() {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [hours, setHours] = useState(HOURS[1]);
  const [medium, setMedium] = useState(MEDIUMS[0]);
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [posted, setPosted] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof getSupabaseBrowserClient>["channel"] | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Load last 24h requests
    const cutoff = new Date(Date.now() - 86400000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("study_partner_requests")
      .select("*")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }: { data: PartnerRequest[] | null }) => {
        if (data) setRequests(data);
      });

    // Realtime new posts + presence
    const presenceKey = `p-${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel("partner-room", { config: { presence: { key: presenceKey } } })
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "study_partner_requests",
      }, (payload) => {
        setRequests(prev => [payload.new as PartnerRequest, ...prev]);
      })
      .on("presence", { event: "sync" }, () => {
        setActiveCount(Object.keys(channel.presenceState()).length || 0);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channelRef.current = channel as any;
    return () => { supabase.removeChannel(channel); };
  }, []);

  const contactRequired = medium !== "This chat";
  const contactPlaceholder = medium === "WhatsApp"
    ? "10-digit mobile number e.g. 9876543210"
    : medium === "Telegram"
    ? "@your_telegram_handle"
    : "";
  const contactLabel = medium === "WhatsApp"
    ? "Your WhatsApp number (required)"
    : medium === "Telegram"
    ? "Your Telegram handle (required)"
    : "";

  function getConnectUrl(r: PartnerRequest): string {
    const hint = r.contact_hint?.trim() ?? "";
    const msg = encodeURIComponent(
      `Hi ${r.username}! I saw your BPSC 365 study partner card (${r.topic}). Want to study together? 🤝`
    );
    if (r.medium === "WhatsApp") {
      const digits = hint.replace(/\D/g, "");
      const num = digits.length === 10 ? `91${digits}` : digits;
      return `https://wa.me/${num}?text=${msg}`;
    }
    if (r.medium === "Telegram") {
      const handle = hint.startsWith("@") ? hint.slice(1) : hint;
      return `https://t.me/${handle}`;
    }
    // This chat — open support with pre-fill via query param
    return `/support?say=${encodeURIComponent(`Hey ${r.username}! Saw your study partner card for ${r.topic} — want to grind together? 🤝`)}`;
  }

  async function post() {
    if (sending || posted) return;
    if (contactRequired && !contact.trim()) return;
    setSending(true);
    const supabase = getSupabaseBrowserClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("study_partner_requests").insert({
      username: getUsername(),
      topic,
      hours,
      medium,
      contact_hint: contact.trim().slice(0, 40) || null,
    });
    setSending(false);
    setPosted(true);
  }

  const mediumColor: Record<string, string> = {
    WhatsApp: "#25d366",
    Telegram: "#0088cc",
    "This chat": "var(--accent)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #0c1220 0%, #1a0a00 100%)",
        padding: "40px 20px 36px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 36, marginBottom: 10 }}>🤝</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
          color: "#fff", lineHeight: 1.1, marginBottom: 10,
          letterSpacing: "-0.02em",
        }}>
          Don&apos;t grind alone.
        </h1>
        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.6)",
          lineHeight: 1.65, maxWidth: 360, margin: "0 auto 20px",
        }}>
          Find your BPSC battle partner. Study together, hold each other accountable, crack it together.
        </p>
        {activeCount > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)",
            borderRadius: 20, padding: "6px 14px",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
              display: "inline-block",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>
              {activeCount} aspirant{activeCount !== 1 ? "s" : ""} browsing now
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 0" }}>

        {/* ── Post your card ── */}
        {!posted ? (
          <div style={{
            border: "1.5px solid var(--accent-border)",
            borderRadius: 20, background: "var(--card)",
            padding: "22px 18px", marginBottom: 24,
          }}>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 16, color: "var(--ink-strong)", marginBottom: 4,
            }}>
              Post your card
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
              Expires in 24 hours · shown to all aspirants on this page
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Topic */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Studying right now
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TOPICS.map(t => (
                    <button key={t} onClick={() => setTopic(t)} style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: topic === t ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                      background: topic === t ? "var(--accent-soft)" : "var(--chip)",
                      color: topic === t ? "var(--accent)" : "var(--ink-soft)",
                      cursor: "pointer", transition: "all 0.1s",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Study hours
                </label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {HOURS.map(h => (
                    <button key={h} onClick={() => setHours(h)} style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: hours === h ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                      background: hours === h ? "var(--accent-soft)" : "var(--chip)",
                      color: hours === h ? "var(--accent)" : "var(--ink-soft)",
                      cursor: "pointer", transition: "all 0.1s",
                    }}>{h}</button>
                  ))}
                </div>
              </div>

              {/* Medium */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Connect via
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {MEDIUMS.map(m => (
                    <button key={m} onClick={() => setMedium(m)} style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: medium === m ? `1.5px solid ${mediumColor[m]}` : "1px solid var(--line)",
                      background: medium === m ? `${mediumColor[m]}18` : "var(--chip)",
                      color: medium === m ? mediumColor[m] : "var(--ink-soft)",
                      cursor: "pointer", transition: "all 0.1s",
                    }}>{m}</button>
                  ))}
                </div>
              </div>

              {/* Contact — shown only for WhatsApp / Telegram */}
              {contactRequired && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {contactLabel}
                  </label>
                  <input
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder={contactPlaceholder}
                    maxLength={40}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "var(--panel)",
                      border: `1px solid ${contactRequired && !contact.trim() ? "rgba(220,38,38,0.4)" : "var(--line)"}`,
                      borderRadius: 10, padding: "9px 14px", fontSize: 13,
                      color: "var(--ink-strong)", outline: "none", fontFamily: "inherit",
                    }}
                  />
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                    Only shown to people who view your card — not stored publicly beyond this board.
                  </p>
                </div>
              )}

              <button
                onClick={post}
                disabled={sending || (contactRequired && !contact.trim())}
                style={{
                  background: "linear-gradient(135deg, #b86117, #d97706)",
                  color: "#fff", border: "none", borderRadius: 12,
                  padding: "13px 24px", fontSize: 14, fontWeight: 700,
                  cursor: sending || (contactRequired && !contact.trim()) ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display)", letterSpacing: "0.02em",
                  boxShadow: "0 4px 16px rgba(192,96,16,0.3)",
                  opacity: contactRequired && !contact.trim() ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {sending ? "Posting..." : "🔥 Post my card — find me a partner"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            border: "1.5px solid rgba(34,197,94,0.3)",
            borderRadius: 20, background: "rgba(34,197,94,0.06)",
            padding: "22px 18px", marginBottom: 24, textAlign: "center",
          }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>✅</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#15803d", marginBottom: 4 }}>
              Your card is live!
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
              Expires in 24 hours. Others can see it below and reach out.
            </p>
          </div>
        )}

        {/* ── Live board ── */}
        <p style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 14,
        }}>
          Looking right now · {requests.length} card{requests.length !== 1 ? "s" : ""}
        </p>

        {requests.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>🕊️</p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              Be the first to post.<br />Your partner is out there.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {requests.map(r => (
            <div key={r.id} style={{
              border: "1px solid var(--line)", borderRadius: 16,
              background: "var(--card)", padding: "16px 14px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--accent-soft)", border: "1.5px solid var(--accent-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "var(--accent)", flexShrink: 0,
                  }}>
                    {r.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>{r.username}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>{timeAgo(r.created_at)}</p>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: mediumColor[r.medium] ?? "var(--accent)",
                  background: `${mediumColor[r.medium] ?? "var(--accent)"}18`,
                  border: `1px solid ${mediumColor[r.medium] ?? "var(--accent)"}40`,
                  borderRadius: 20, padding: "3px 10px", flexShrink: 0,
                }}>
                  {r.medium}
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "var(--accent)",
                  background: "var(--accent-soft)", border: "1px solid var(--accent-border)",
                  borderRadius: 20, padding: "4px 10px",
                }}>
                  📚 {r.topic}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "var(--ink-soft)",
                  background: "var(--chip)", border: "1px solid var(--line)",
                  borderRadius: 20, padding: "4px 10px",
                }}>
                  ⏱ {r.hours}
                </span>
              </div>

              <a
                href={getConnectUrl(r)}
                target={r.medium !== "This chat" ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: mediumColor[r.medium] ?? "var(--accent)",
                  color: "#fff", borderRadius: 12, padding: "11px 16px",
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  boxShadow: `0 3px 12px ${mediumColor[r.medium] ?? "var(--accent)"}40`,
                }}
              >
                {r.medium === "WhatsApp" && "💬 Connect on WhatsApp"}
                {r.medium === "Telegram" && "✈️ Open on Telegram"}
                {r.medium === "This chat" && "💙 Say hi in group chat"}
              </a>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
