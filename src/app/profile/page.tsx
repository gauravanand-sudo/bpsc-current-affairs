"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import ProgressChart from "@/components/ProgressChart";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ensureProfileRow, syncLocalProgressToSupabase } from "@/lib/progress";

type QuizResult = {
  setName: string;
  month: string;
  title?: string;
  bestScore?: number;
  score?: number;
  maxScore?: number;
  bestPercentage?: number;
  pct?: number;
  timeTaken?: number;
  date?: string;
};

function loadAllQuizResults(): QuizResult[] {
  const results: QuizResult[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("bpsc_quiz_")) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as QuizResult;
      results.push(parsed);
    }
  } catch { /* ignore */ }
  return results.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${accent ? "var(--accent-border)" : "var(--line)"}`,
      borderRadius: 16, background: accent ? "var(--accent-soft)" : "var(--card)",
      padding: "16px 14px",
    }}>
      <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: accent ? "var(--accent)" : "var(--ink-strong)", lineHeight: 1, marginBottom: sub ? 4 : 0 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
      if (data.session) {
        void ensureProfileRow(data.session, supabase);
        void syncLocalProgressToSupabase(data.session, supabase);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession) {
        void ensureProfileRow(nextSession, supabase);
        void syncLocalProgressToSupabase(nextSession, supabase);
      }
    });
    setQuizResults(loadAllQuizResults());
    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/profile` },
    });
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const user = session?.user;

  if (loading) {
    return (
      <main style={{ minHeight: "60vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ minHeight: "80vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 380, width: "100%", border: "1px solid var(--line)", borderRadius: 28, background: "var(--card)", padding: "44px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 10 }}>
            Track your progress
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
            Sign in to save quiz scores, see your weak topics, and track improvement over time.
          </p>
          <button type="button" onClick={handleGoogleSignIn} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
          }}>
            Continue with Google
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14 }}>Free · No ads · Progress syncs across devices</p>
        </div>
      </main>
    );
  }

  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name ?? user.email ?? "User";

  // Stats
  const totalQuizzes = quizResults.length;
  const avgPct = totalQuizzes
    ? Math.round(quizResults.reduce((s, r) => s + (r.bestPercentage ?? r.pct ?? 0), 0) / totalQuizzes)
    : 0;
  const bestPct = totalQuizzes
    ? Math.round(Math.max(...quizResults.map(r => r.bestPercentage ?? r.pct ?? 0)))
    : 0;
  const recentResults = quizResults.slice(0, 5);

  // Days to exam
  const examDate = new Date("2026-07-26T00:00:00+05:30");
  const daysLeft = Math.max(0, Math.floor((examDate.getTime() - Date.now()) / 86400000));

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 40 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 0" }}>

        {/* Profile card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          border: "1px solid var(--line)", borderRadius: 20,
          background: "var(--card)", padding: "18px 16px", marginBottom: 20,
        }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} width={52} height={52}
              style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {name[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-strong)", marginBottom: 2 }}>
              {name}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
          <button type="button" onClick={handleSignOut} style={{
            fontSize: 11, color: "var(--muted)", background: "none",
            border: "1px solid var(--line)", borderRadius: 8,
            padding: "5px 10px", cursor: "pointer",
          }}>
            Sign out
          </button>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
          <StatCard label="Days to Exam" value={String(daysLeft)} sub="26 Jul 2026" accent />
          <StatCard label="Quizzes Taken" value={String(totalQuizzes)} sub="total attempts" />
          <StatCard label="Avg Score" value={`${avgPct}%`} sub="across all sets" />
          <StatCard label="Best Score" value={`${bestPct}%`} sub="personal best" />
        </div>

        {/* Recent quiz history */}
        {recentResults.length > 0 && (
          <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
              Recent Quizzes
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentResults.map((r, i) => {
                const pct = Math.round(r.bestPercentage ?? r.pct ?? 0);
                const passed = pct >= 40;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 12,
                    background: "var(--panel)", gap: 10,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-strong)", marginBottom: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.title ?? r.setName}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>
                        {r.month} · {r.timeTaken ? `${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s` : "—"}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700,
                      color: passed ? "#16a34a" : "var(--accent)",
                      background: passed ? "rgba(22,163,74,0.08)" : "rgba(192,96,16,0.08)",
                      border: `1px solid ${passed ? "rgba(22,163,74,0.2)" : "rgba(192,96,16,0.2)"}`,
                      borderRadius: 10, padding: "3px 10px", flexShrink: 0,
                    }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
            <Link href="/quizzes" style={{
              display: "block", textAlign: "center", marginTop: 12,
              fontSize: 12, color: "var(--accent)", fontWeight: 700, textDecoration: "none",
            }}>
              Take more quizzes →
            </Link>
          </div>
        )}

        {/* Progress chart */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
            Progress Dashboard
          </p>
          <ProgressChart />
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Link href="/ca" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", padding: "16px 14px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 6 }}>📖</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--ink-strong)" }}>Study Sets</p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Continue reading</p>
            </div>
          </Link>
          <Link href="/quizzes" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid var(--accent-border)", borderRadius: 16, background: "var(--accent-soft)", padding: "16px 14px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 6 }}>🎯</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>Quiz Sets</p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Practice now</p>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
