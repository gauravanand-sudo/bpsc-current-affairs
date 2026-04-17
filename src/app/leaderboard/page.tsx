"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Row = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_score: number;
  quizzes_taken: number;
  best_percentage: number;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"week" | "alltime">("week");
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setMyId(data.session?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const fn = tab === "week" ? "get_weekly_leaderboard" : "get_alltime_leaderboard";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).rpc(fn).then(({ data }: { data: Row[] | null }) => {
      setRows(data ?? []);
      setLoading(false);
    });
  }, [tab]);

  const myRank = myId ? rows.findIndex(r => r.user_id === myId) + 1 : 0;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0c1220 0%, #1a0800 100%)",
        padding: "36px 20px 32px", textAlign: "center",
      }}>
        <p style={{ fontSize: 38, marginBottom: 8 }}>🏆</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
          color: "#fff", letterSpacing: "-0.02em", marginBottom: 8,
        }}>
          Leaderboard
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          Ranked by total quiz score · Top 20 aspirants
        </p>
        {myRank > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(192,96,16,0.2)", border: "1px solid rgba(192,96,16,0.4)",
            borderRadius: 20, padding: "6px 14px", marginTop: 14,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>
              Your rank: #{myRank}
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 14px 0" }}>

        {/* Tab toggle */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 20,
          background: "var(--card)", border: "1px solid var(--line)",
          borderRadius: 12, padding: 4,
        }}>
          {(["week", "alltime"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 0", borderRadius: 9,
              border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
              fontFamily: "var(--font-display)",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#fff" : "var(--ink-soft)",
              transition: "all 0.15s",
            }}>
              {t === "week" ? "This Week" : "All Time"}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)", fontSize: 13 }}>
            Loading...
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>📭</p>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
              No scores yet {tab === "week" ? "this week" : ""}.<br />
              Take a quiz to get on the board!
            </p>
          </div>
        )}

        {/* Top 3 podium */}
        {!loading && rows.length >= 3 && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8, marginBottom: 16,
          }}>
            {[rows[1], rows[0], rows[2]].map((r, podiumIdx) => {
              const realRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
              const isMe = r.user_id === myId;
              const heights = ["80px", "100px", "70px"];
              return (
                <div key={r.user_id} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "flex-end",
                }}>
                  {/* Avatar */}
                  <div style={{ marginBottom: 6, position: "relative" }}>
                    {r.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatar_url} alt={r.full_name ?? ""}
                        width={44} height={44}
                        style={{
                          borderRadius: "50%", objectFit: "cover",
                          border: `2.5px solid ${realRank === 1 ? "#fbbf24" : realRank === 2 ? "#94a3b8" : "#b45309"}`,
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: realRank === 1 ? "rgba(251,191,36,0.2)" : "var(--accent-soft)",
                        border: `2.5px solid ${realRank === 1 ? "#fbbf24" : realRank === 2 ? "#94a3b8" : "#b45309"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 700, color: "var(--accent)",
                      }}>
                        {(r.full_name ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <span style={{ position: "absolute", top: -8, right: -8, fontSize: 18 }}>
                      {MEDALS[realRank - 1]}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: isMe ? "var(--accent)" : "var(--ink-strong)",
                    marginBottom: 4, textAlign: "center", maxWidth: 80,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {isMe ? "You" : (r.full_name?.split(" ")[0] ?? "Aspirant")}
                  </p>
                  {/* Podium block */}
                  <div style={{
                    width: "100%", height: heights[podiumIdx],
                    background: realRank === 1
                      ? "linear-gradient(180deg, rgba(251,191,36,0.2), rgba(251,191,36,0.08))"
                      : "var(--card)",
                    border: `1px solid ${realRank === 1 ? "rgba(251,191,36,0.3)" : "var(--line)"}`,
                    borderRadius: "10px 10px 0 0",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 2,
                  }}>
                    <p style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: 15, color: realRank === 1 ? "#fbbf24" : "var(--ink-strong)",
                    }}>
                      {Math.round(r.total_score)}
                    </p>
                    <p style={{ fontSize: 10, color: "var(--muted)" }}>{r.quizzes_taken} quizzes</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of the list */}
        {!loading && rows.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.slice(3).map((r, i) => {
              const rank = i + 4;
              const isMe = r.user_id === myId;
              return (
                <div key={r.user_id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 14,
                  background: isMe ? "var(--accent-soft)" : "var(--card)",
                  border: `1px solid ${isMe ? "var(--accent-border)" : "var(--line)"}`,
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: "var(--muted)",
                    width: 22, textAlign: "center", flexShrink: 0,
                  }}>
                    {rank}
                  </span>
                  {r.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatar_url} alt="" width={32} height={32}
                      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "var(--accent-soft)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "var(--accent)",
                    }}>
                      {(r.full_name ?? "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 700,
                      color: isMe ? "var(--accent)" : "var(--ink-strong)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {isMe ? "You" : (r.full_name?.split(" ")[0] ?? "Aspirant")}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>{r.quizzes_taken} quizzes</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: 15, color: "var(--ink-strong)",
                    }}>
                      {Math.round(r.total_score)}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--muted)" }}>pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && myRank === 0 && (
          <div style={{
            textAlign: "center", marginTop: 24,
            padding: "16px", borderRadius: 14,
            background: "var(--card)", border: "1px solid var(--line)",
          }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
              You&apos;re not on the board yet.<br />
              <strong style={{ color: "var(--accent)" }}>Take a quiz to claim your rank →</strong>
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
