"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ensureProfileRow, syncLocalProgressToSupabase } from "@/lib/progress";
import { getStreak } from "@/lib/streak";
import { getBookmarks, type Bookmark } from "@/lib/bookmarks";

type QuizResult = {
  setName: string;
  month: string;
  title?: string;
  pct?: number;
  bestPercentage?: number;
  score?: number;
  bestScore?: number;
  maxScore?: number;
  outOf150?: number;
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
      results.push(JSON.parse(raw) as QuizResult);
    }
  } catch { /* ignore */ }
  return results.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

function formatSetTitle(r: QuizResult): string {
  if (r.title) return r.title;
  const monthName = r.month
    ? new Date(+r.month.split("-")[0], +r.month.split("-")[1] - 1, 1)
        .toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : r.month;
  const num = r.setName?.match(/(\d+)/)?.[1] ?? "";
  return `${monthName} · Set ${num}`;
}

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [streak, setStreak] = useState({ streak: 0, longest: 0 });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
      if (s) {
        void ensureProfileRow(s, supabase);
        void syncLocalProgressToSupabase(s, supabase);
      }
    });
    setQuizResults(loadAllQuizResults());
    setStreak(getStreak());
    setBookmarks(getBookmarks());
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
    await getSupabaseBrowserClient().auth.signOut();
    window.location.href = "/";
  }

  const user = session?.user;

  if (loading) {
    return (
      <main style={{ minHeight: "60vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ minHeight: "80vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 360, width: "100%", border: "1px solid var(--line)", borderRadius: 24, background: "var(--card)", padding: "40px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>👤</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 10 }}>
            Sign in to track progress
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
            Your quiz scores, streaks, and bookmarks sync across devices when you&apos;re signed in.
          </p>
          <button type="button" onClick={handleGoogleSignIn} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-display)",
          }}>
            Continue with Google
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>Free · No ads · Always ₹0</p>
        </div>
      </main>
    );
  }

  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "User";

  const totalQuizzes = quizResults.length;
  const examDate = new Date("2026-07-26T00:00:00+05:30");
  const daysLeft = Math.max(0, Math.floor((examDate.getTime() - Date.now()) / 86400000));

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 48 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 0" }}>

        {/* ── Profile card ─────────────────────────────────────── */}
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

        {/* ── 3 stats ──────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {/* Days to exam */}
          <div style={{
            border: "1px solid var(--accent-border)", borderRadius: 16,
            background: "var(--accent-soft)", padding: "16px 14px",
          }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
              Exam in
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>
              {daysLeft}d
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>26 Jul 2026</p>
          </div>

          {/* Streak */}
          <div style={{
            border: "1px solid var(--line)", borderRadius: 16,
            background: "var(--card)", padding: "16px 14px",
          }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
              Streak
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1, marginBottom: 4 }}>
              {streak.streak} 🔥
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>Best: {streak.longest} days</p>
          </div>

          {/* Quizzes done */}
          <div style={{
            border: "1px solid var(--line)", borderRadius: 16,
            background: "var(--card)", padding: "16px 14px",
          }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
              Quizzes done
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1, marginBottom: 4 }}>
              {totalQuizzes}
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              {totalQuizzes === 0 ? "Start your first" : totalQuizzes === 1 ? "quiz taken" : "quizzes taken"}
            </p>
          </div>
        </div>

        {/* ── Bookmarks ────────────────────────────────────────── */}
        {bookmarks.length > 0 && (
          <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>
                🔖 Saved to revise
              </p>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{bookmarks.length} cards</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bookmarks.slice(0, 6).map((b, i) => (
                <Link key={i} href={`/ca/${b.month}/${b.setName}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 12, background: "var(--panel)",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.title}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                        {new Date(+b.month.split("-")[0], +b.month.split("-")[1] - 1, 1)
                          .toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--accent)", flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
            {bookmarks.length > 6 && (
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
                +{bookmarks.length - 6} more saved
              </p>
            )}
          </div>
        )}

        {/* ── Quiz history ─────────────────────────────────────── */}
        {quizResults.length > 0 ? (
          <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)", marginBottom: 14 }}>
              Recent quizzes
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quizResults.slice(0, 8).map((r, i) => {
                // Compute /150 score from bestScore/maxScore or outOf150
                const out150 = r.bestScore !== undefined && r.maxScore
                  ? Math.round((r.bestScore / r.maxScore) * 150 * 10) / 10
                  : r.outOf150 ?? Math.round((r.bestPercentage ?? r.pct ?? 0) * 1.5);
                const display = `${Math.max(0, out150)}/150`;
                const color = out150 >= 90 ? "#16a34a" : out150 >= 60 ? "var(--accent)" : "#dc2626";
                const bg = out150 >= 90 ? "rgba(22,163,74,0.08)" : out150 >= 60 ? "rgba(192,96,16,0.08)" : "rgba(220,38,38,0.06)";
                const border = out150 >= 90 ? "rgba(22,163,74,0.2)" : out150 >= 60 ? "rgba(192,96,16,0.2)" : "rgba(220,38,38,0.15)";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 12, background: "var(--panel)", gap: 10,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-strong)", marginBottom: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {formatSetTitle(r)}
                      </p>
                      {r.timeTaken && (
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>
                          {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
                      color, background: bg, border: `1px solid ${border}`,
                      borderRadius: 10, padding: "3px 10px", flexShrink: 0,
                    }}>
                      {display}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link href="/quizzes" style={{
              display: "block", textAlign: "center", marginTop: 12,
              fontSize: 13, color: "var(--accent)", fontWeight: 700, textDecoration: "none",
            }}>
              Take more quizzes →
            </Link>
          </div>
        ) : (
          <div style={{ border: "1px dashed var(--line)", borderRadius: 20, padding: "32px 20px", marginBottom: 20, textAlign: "center" }}>
            <p style={{ fontSize: 22, marginBottom: 10 }}>🎯</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)", marginBottom: 6 }}>
              No quizzes yet
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Study a set and take the quiz — your scores will appear here.
            </p>
            <Link href="/quizzes" style={{
              display: "inline-block", background: "var(--accent)", color: "#fff",
              borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700,
              textDecoration: "none", fontFamily: "var(--font-display)",
            }}>
              Browse quizzes →
            </Link>
          </div>
        )}

        {/* ── Quick links ──────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <Link href="/ca" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 22, marginBottom: 6 }}>📖</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-strong)" }}>Study</p>
            </div>
          </Link>
          <Link href="/quizzes" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid var(--accent-border)", borderRadius: 16, background: "var(--accent-soft)", padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 22, marginBottom: 6 }}>🎯</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--accent)" }}>Quizzes</p>
            </div>
          </Link>
          <Link href="/leaderboard" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 22, marginBottom: 6 }}>🏆</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--ink-strong)" }}>Rank</p>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
