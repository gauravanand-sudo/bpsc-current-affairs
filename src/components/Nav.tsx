"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user;

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(244,239,232,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
        padding: "0 20px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--ink-strong)",
            letterSpacing: "-0.02em",
          }}
        >
          BPSC <span style={{ color: "var(--accent)" }}>365</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[
          { href: "/", label: "Home" },
          { href: "/ca", label: "Study Sets" },
          { href: "/quizzes", label: "Quiz Sets" },
          { href: "/pyq", label: "PYQ" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink-soft)",
              textDecoration: "none",
              padding: "5px 11px",
              borderRadius: 8,
              letterSpacing: "0.01em",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {user ? (
          <>
            <Link href="/profile" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name ?? "Profile"}
                  width={30}
                  height={30}
                  style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                fontSize: 11,
                color: "var(--muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.06em",
              }}
            >
              sign out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.02em",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        )}
      </div>
    </nav>
  );
}
