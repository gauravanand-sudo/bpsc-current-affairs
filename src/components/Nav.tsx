"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import ExamCountdown from "@/components/ExamCountdown";

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
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
      options: { redirectTo: `${window.location.origin}/profile` },
    });
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const tabs = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/ca", label: "Study", icon: "📖" },
    { href: "/quizzes", label: "Quiz", icon: "🎯" },
    { href: "/ask", label: "Ask AI", icon: "🧠" },
    { href: "/partner", label: "Partner", icon: "🤝" },
    { href: "/leaderboard", label: "Rank", icon: "🏆" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(244,239,232,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
        padding: "0 16px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 17, color: "var(--ink-strong)", letterSpacing: "-0.02em",
          }}>
            72nd BPSC <span style={{ color: "var(--accent)" }}>PT365</span>
            <span style={{ display: "block", fontSize: 9, fontWeight: 500, color: "var(--muted)", letterSpacing: "0.06em", marginTop: -2 }}>by BPSC Cosmos</span>
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {tabs.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontSize: 13, fontWeight: isActive(href) ? 700 : 600,
              color: isActive(href) ? "var(--accent)" : "var(--ink-soft)",
              textDecoration: "none", padding: "5px 11px", borderRadius: 8,
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Countdown + Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <ExamCountdown />
          {user ? (
            <>
              <Link href="/profile" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                {user.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name ?? "Profile"}
                    width={30} height={30}
                    style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "var(--accent)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff",
                  }}>
                    {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <button type="button" onClick={handleSignOut} style={{
                fontSize: 11, color: "var(--muted)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "monospace",
                letterSpacing: "0.06em",
              }}>
                sign out
              </button>
            </>
          ) : (
            <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-display)",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "..." : "Sign in"}
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ───────────────────────────── */}
      <nav className="mobile-tab-bar" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(244,239,232,0.97)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--line)",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {tabs.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "8px 4px 6px", textDecoration: "none", gap: 3,
              borderTop: active ? "2px solid var(--accent)" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? "var(--accent)" : "var(--muted)",
                letterSpacing: "0.04em",
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom spacer so content isn't hidden behind tab bar ── */}
      <div className="mobile-tab-spacer" style={{ height: 60 }} />

      <style>{`
        @media (min-width: 640px) {
          .mobile-tab-bar { display: none !important; }
          .mobile-tab-spacer { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
