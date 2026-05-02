"use client";

import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";

export default function SignInPage() {
  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthRedirectUrl("/profile"),
      },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          width: "min(100%, 420px)",
          border: "1px solid var(--line)",
          borderRadius: 24,
          background: "var(--card)",
          padding: "28px 24px",
          boxShadow: "0 16px 48px rgba(120,80,30,0.08)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 14,
          }}
        >
          72nd BPSC Sign In
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 4vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "var(--ink-strong)",
            marginBottom: 12,
          }}
        >
          Continue with Google
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--ink-soft)",
            marginBottom: 22,
          }}
        >
          Sign in with Supabase Auth to track progress, save completed cards, and sync your BPSC revision history.
        </p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: "100%",
            border: "none",
            borderRadius: 14,
            background: "linear-gradient(135deg, #c06010, #d97706)",
            color: "#fff",
            padding: "14px 18px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(192,96,16,0.24)",
          }}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
