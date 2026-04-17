"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import ProgressChart from "@/components/ProgressChart";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ensureProfileRow, syncLocalProgressToSupabase } from "@/lib/progress";

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession) {
        void ensureProfileRow(nextSession, supabase);
        void syncLocalProgressToSupabase(nextSession, supabase);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
  }

  const user = session?.user;

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            border: "1px solid var(--line)",
            borderRadius: 28,
            background: "var(--card)",
            padding: "44px 32px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 36, marginBottom: 16 }}>📚</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink-strong)",
              marginBottom: 10,
            }}
          >
            Sign in to track progress
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
            Save your progress across devices. See which topics you&apos;ve mastered.
          </p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "13px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            Continue with Google
          </button>
        </div>
      </main>
    );
  }

  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name ?? user.email ?? "User";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 0 80px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <Link
          href="/ca"
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 32,
          }}
        >
          ← Browse Sets
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            padding: "20px 20px",
            marginBottom: 28,
          }}
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={name}
              width={52}
              height={52}
              style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {name[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--ink-strong)",
                marginBottom: 2,
              }}
            >
              {name}
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
          <span
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            Progress Profile
          </span>
        </div>

        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--panel)",
            padding: "18px 20px",
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {[
            { label: "Profile Goal", value: "72nd BPSC Prelims" },
            { label: "Tracked Data", value: "Sets, cards, quizzes, scores" },
            { label: "Sync", value: "Cloud progress tracking" },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", padding: "14px 14px" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink-strong)" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            padding: "22px 20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            Progress Dashboard
          </p>
          <ProgressChart />
        </div>
      </div>
    </main>
  );
}
