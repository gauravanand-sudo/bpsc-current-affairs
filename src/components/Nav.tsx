"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const hideMobileTabSpacer = ["/support", "/partner", "/ask"].includes(pathname);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => { setSession(data.session ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    await getSupabaseBrowserClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: getAuthRedirectUrl("/profile") } });
  }
  async function handleSignOut() { await getSupabaseBrowserClient().auth.signOut(); window.location.href = "/"; }

  const user = session?.user;
  const desktopLinks = [
    { href: "/#programs", label: "Programs" },
    { href: "/study", label: "Free Study" },
    { href: "/quizzes", label: "Free Quiz" },
    { href: "/ask", label: "Ask Tutor" },
    { href: "/partner", label: "Study Buddy" },
    { href: "/leaderboard", label: "Results" },
  ];
  const mobileTabs = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/study", label: "Free Study", icon: "▤" },
    { href: "/quizzes", label: "Free Quiz", icon: "✓" },
    { href: "/#programs", label: "Programs", icon: "◎" },
    { href: "/partner", label: "Buddy", icon: "◇" },
  ];
  const isActive = (href: string) => href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <>
      <div className="academic-topline">
        <span>OneShot GS</span>
        <b>UPSC & BPSC · Prelims + Mains + Interview</b>
        <span className="fees">UPSC ₹56,000 · BPSC ₹29,000</span>
      </div>
      <nav className="main-nav">
        <Link href="/" className="brand" aria-label="OneShot GS home"><Image src="/logo3.png" alt="OneShot GS" width={112} height={42} priority /></Link>
        <div className="desktop-nav">
          {desktopLinks.map(({ href, label }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}>{label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link href="/#programs" className="enroll-nav"><span>Explore Programs</span><b>→</b></Link>
          {user ? (
            <>
              <Link href="/profile" className="profile-dot">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" /> : <span>{(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}</span>}</Link>
              <button onClick={handleSignOut} className="auth-link">Sign out</button>
            </>
          ) : <button onClick={handleGoogleSignIn} disabled={loading} className="auth-link">{loading ? "…" : "Sign in"}</button>}
        </div>
      </nav>

      <nav className="mobile-tab-bar" aria-label="Primary navigation">
        {mobileTabs.map(({ href, label, icon }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}><span>{icon}</span><small>{label}</small></Link>)}
      </nav>
      <div className="mobile-tab-spacer" style={{ height: hideMobileTabSpacer ? 0 : 62 }} />

      <style>{`
        .academic-topline{height:28px;display:flex;align-items:center;justify-content:center;gap:18px;background:#172338;color:#e8edf5;border-bottom:1px solid rgba(255,255,255,.08);font-size:9px;letter-spacing:.055em;padding:0 12px;position:sticky;top:0;z-index:102}.academic-topline>span:first-child{font-family:var(--font-display);font-weight:700;color:#f3c981}.academic-topline b{font-weight:650}.academic-topline .fees{color:#c8d2e2}.main-nav{position:sticky;top:28px;z-index:101;height:58px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;background:rgba(252,250,246,.97);backdrop-filter:blur(14px);border-bottom:1px solid rgba(32,45,64,.12);box-shadow:0 2px 10px rgba(24,35,52,.035)}.brand{display:flex;flex-shrink:0}.brand img{object-fit:contain;mix-blend-mode:darken}.desktop-nav{display:flex;align-items:center;gap:1px}.desktop-nav a{text-decoration:none;padding:8px 9px;border-radius:7px;color:#536174;font-size:11.5px;font-weight:650;transition:.15s ease}.desktop-nav a:hover,.desktop-nav a.active{background:#eef2f6;color:#172338}.nav-actions{display:flex;align-items:center;gap:8px}.enroll-nav{text-decoration:none;padding:9px 12px;border-radius:8px;background:#9f3e1b;color:#fff;font-size:10.5px;font-weight:750;display:flex;gap:9px;align-items:center;box-shadow:0 4px 12px rgba(122,48,22,.12)}.enroll-nav b{font-size:13px}.auth-link{border:0;background:none;color:#657184;font-size:10px;font-weight:650;cursor:pointer}.profile-dot{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#273650;color:white;text-decoration:none;font-size:12px;font-weight:800;overflow:hidden}.profile-dot img{width:100%;height:100%;object-fit:cover}.mobile-tab-bar{display:none}.mobile-tab-spacer{display:none}
        @media(max-width:900px){.desktop-nav{display:none}}
        @media(max-width:639px){.academic-topline{height:25px;font-size:7.4px;gap:7px;letter-spacing:.025em}.academic-topline>span:first-child{display:none}.academic-topline b{white-space:nowrap}.main-nav{top:25px;height:52px;padding:0 12px}.brand img{width:96px;height:36px}.enroll-nav{font-size:9px;padding:7px 9px}.enroll-nav span{max-width:72px;white-space:nowrap}.auth-link{display:none}.mobile-tab-bar{position:fixed;bottom:0;left:0;right:0;z-index:210;display:flex;background:rgba(252,250,246,.985);backdrop-filter:blur(16px);border-top:1px solid rgba(32,45,64,.14);padding-bottom:env(safe-area-inset-bottom);box-shadow:0 -5px 22px rgba(24,35,52,.06)}.mobile-tab-bar a{flex:1;text-decoration:none;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 1px 5px;color:#7b8695;border-top:2px solid transparent}.mobile-tab-bar a.active{color:#8f3517;border-color:#9f3e1b}.mobile-tab-bar span{font-size:17px;line-height:1;font-family:Georgia,serif}.mobile-tab-bar small{font-size:7.8px;font-weight:750;white-space:nowrap}.mobile-tab-spacer{display:block}}
      `}</style>
    </>
  );
}
