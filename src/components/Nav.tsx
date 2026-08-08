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
    { href: "/#courses", label: "Courses" },
    { href: "/study", label: "Study" },
    { href: "/quizzes", label: "Quiz" },
    { href: "/ask", label: "Ask Tutor" },
    { href: "/partner", label: "Study Buddy" },
    { href: "/leaderboard", label: "Results" },
  ];
  const mobileTabs = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/#courses", label: "Courses", icon: "🎓" },
    { href: "/quizzes", label: "Quiz", icon: "🎯" },
    { href: "/partner", label: "Buddy", icon: "🤝" },
    { href: "/ask", label: "Tutor", icon: "🧠" },
  ];
  const isActive = (href: string) => href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <>
      <div className="sales-topline">🎓 UPSC 2027/28 ₹56,000 &nbsp;•&nbsp; BPSC 72nd/73rd ₹29,000 &nbsp;•&nbsp; PRELIMS + MAINS + INTERVIEW</div>
      <nav className="main-nav">
        <Link href="/" className="brand"><Image src="/logo3.png" alt="OneShot GS" width={110} height={42} priority /></Link>
        <div className="desktop-nav">
          {desktopLinks.map(({ href, label }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}>{label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link href="/#courses" className="enroll-nav">Enroll Now</Link>
          {user ? (
            <>
              <Link href="/profile" className="profile-dot">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" /> : <span>{(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}</span>}</Link>
              <button onClick={handleSignOut} className="auth-link">Sign out</button>
            </>
          ) : <button onClick={handleGoogleSignIn} disabled={loading} className="auth-link">{loading ? "…" : "Sign in"}</button>}
        </div>
      </nav>

      <nav className="mobile-tab-bar">
        {mobileTabs.map(({ href, label, icon }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}><span>{icon}</span><small>{label}</small></Link>)}
      </nav>
      <div className="mobile-tab-spacer" style={{ height: hideMobileTabSpacer ? 0 : 60 }} />

      <style>{`
        .sales-topline{height:27px;display:flex;align-items:center;justify-content:center;background:#241006;color:#ffe2a8;font-size:9px;font-weight:900;letter-spacing:.1em;text-align:center;padding:0 8px;position:sticky;top:0;z-index:102}.main-nav{position:sticky;top:27px;z-index:101;height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;background:rgba(249,244,237,.97);backdrop-filter:blur(14px);border-bottom:1px solid rgba(120,80,30,.12)}.brand{display:flex;flex-shrink:0}.brand img{object-fit:contain;mix-blend-mode:darken}.desktop-nav{display:flex;align-items:center;gap:2px}.desktop-nav a{text-decoration:none;padding:7px 9px;border-radius:9px;color:var(--ink-soft);font-size:12px;font-weight:700}.desktop-nav a:hover,.desktop-nav a.active{background:#fff3e4;color:#9a3f0d}.nav-actions{display:flex;align-items:center;gap:7px}.enroll-nav{text-decoration:none;padding:8px 11px;border-radius:10px;background:linear-gradient(135deg,#a71919,#c06010);color:#fff;font-size:11px;font-weight:900;box-shadow:0 5px 15px rgba(170,50,20,.2)}.auth-link{border:0;background:none;color:var(--muted);font-size:10px;font-weight:700;cursor:pointer}.profile-dot{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:white;text-decoration:none;font-size:12px;font-weight:900;overflow:hidden}.profile-dot img{width:100%;height:100%;object-fit:cover}.mobile-tab-bar{display:none}.mobile-tab-spacer{display:none}
        @media(max-width:850px){.desktop-nav{display:none}}
        @media(max-width:639px){.sales-topline{height:24px;font-size:7.5px;letter-spacing:.06em}.main-nav{top:24px;height:50px}.brand img{width:94px;height:36px}.enroll-nav{font-size:9px;padding:7px 9px}.auth-link{display:none}.mobile-tab-bar{position:fixed;bottom:0;left:0;right:0;z-index:210;display:flex;background:rgba(249,244,237,.98);backdrop-filter:blur(16px);border-top:1px solid rgba(120,80,30,.13);padding-bottom:env(safe-area-inset-bottom)}.mobile-tab-bar a{flex:1;text-decoration:none;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 2px 5px;color:var(--muted);border-top:2px solid transparent}.mobile-tab-bar a.active{color:#a44912;border-color:#c06010}.mobile-tab-bar span{font-size:18px;line-height:1}.mobile-tab-bar small{font-size:8.5px;font-weight:800}.mobile-tab-spacer{display:block}}
      `}</style>
    </>
  );
}
