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

  async function handleSignOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.href = "/";
  }

  const user = session?.user;
  const desktopLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/study", label: "Free Study" },
    { href: "/quizzes", label: "Free Quiz" },
    { href: "/pyq", label: "PYQs" },
    { href: "/faculty", label: "Faculty" },
    { href: "/ask", label: "Ask Tutor" },
  ];
  const mobileTabs = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/courses", label: "Courses", icon: "▦" },
    { href: "/study", label: "Study", icon: "▤" },
    { href: "/quizzes", label: "Quiz", icon: "✓" },
    { href: "/pyq", label: "PYQs", icon: "≡" },
  ];
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="institute-strip">
        <span>OneShot GS</span>
        <b>UPSC 2027/28 · BPSC 72nd/73rd · Prelims + Mains + Interview</b>
        <span className="fees">UPSC ₹56,000 · BPSC ₹29,000</span>
      </div>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label="OneShot GS home"><Image src="/logo3.png" alt="OneShot GS" width={112} height={42} priority /></Link>
        <div className="desktop-nav">
          {desktopLinks.map(({ href, label }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}>{label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link href="/admissions" className="admissions-link">Admissions <b>→</b></Link>
          {user ? (
            <>
              <Link href="/profile" className="profile-dot" aria-label="Profile">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" /> : <span>{(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}</span>}</Link>
              <button onClick={handleSignOut} className="auth-link">Sign out</button>
            </>
          ) : <button onClick={handleGoogleSignIn} disabled={loading} className="auth-link">{loading ? "…" : "Sign in"}</button>}
        </div>
      </nav>

      <nav className="mobile-tab-bar" aria-label="Mobile navigation">
        {mobileTabs.map(({ href, label, icon }) => <Link key={href} href={href} className={isActive(href) ? "active" : ""}><span>{icon}</span><small>{label}</small></Link>)}
      </nav>
      <div className="mobile-tab-spacer" style={{ height: hideMobileTabSpacer ? 0 : 62 }} />

      <style>{`
        .institute-strip{height:27px;display:flex;align-items:center;justify-content:center;gap:18px;background:#172338;color:#e9eef5;border-bottom:1px solid rgba(255,255,255,.08);font-size:8.5px;letter-spacing:.045em;padding:0 12px;position:sticky;top:0;z-index:102}.institute-strip>span:first-child{font-family:var(--font-display);font-weight:700;color:#e7bd8e}.institute-strip b{font-weight:650}.institute-strip .fees{color:#c8d1dc}.main-nav{position:sticky;top:27px;z-index:101;height:59px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;background:rgba(252,250,246,.975);backdrop-filter:blur(14px);border-bottom:1px solid rgba(32,45,64,.13);box-shadow:0 2px 10px rgba(24,35,52,.035)}.brand{display:flex;flex-shrink:0}.brand img{object-fit:contain;mix-blend-mode:darken}.desktop-nav{display:flex;align-items:center;gap:1px}.desktop-nav a{text-decoration:none;padding:8px 9px;border-radius:6px;color:#536174;font-size:11px;font-weight:680;transition:.15s ease}.desktop-nav a:hover,.desktop-nav a.active{background:#edf1f5;color:#172338}.nav-actions{display:flex;align-items:center;gap:8px}.admissions-link{text-decoration:none;padding:9px 12px;border-radius:6px;background:#9f3e1b;color:#fff;font-size:10px;font-weight:800;display:flex;gap:8px;align-items:center}.auth-link{border:0;background:none;color:#657184;font-size:9.5px;font-weight:650;cursor:pointer}.profile-dot{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#273650;color:white;text-decoration:none;font-size:12px;font-weight:800;overflow:hidden}.profile-dot img{width:100%;height:100%;object-fit:cover}.mobile-tab-bar{display:none}.mobile-tab-spacer{display:none}@media(max-width:900px){.desktop-nav{display:none}}@media(max-width:639px){.institute-strip{height:25px;font-size:7.1px;gap:7px;letter-spacing:.015em}.institute-strip>span:first-child,.institute-strip .fees{display:none}.institute-strip b{white-space:nowrap}.main-nav{top:25px;height:52px;padding:0 12px}.brand img{width:96px;height:36px}.admissions-link{font-size:8.7px;padding:7px 9px}.auth-link{display:none}.mobile-tab-bar{position:fixed;bottom:0;left:0;right:0;z-index:210;display:flex;background:rgba(252,250,246,.988);backdrop-filter:blur(16px);border-top:1px solid rgba(32,45,64,.14);padding-bottom:env(safe-area-inset-bottom);box-shadow:0 -5px 22px rgba(24,35,52,.06)}.mobile-tab-bar a{flex:1;text-decoration:none;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 1px 5px;color:#7b8695;border-top:2px solid transparent}.mobile-tab-bar a.active{color:#8f3517;border-color:#9f3e1b}.mobile-tab-bar span{font-size:17px;line-height:1;font-family:Georgia,serif}.mobile-tab-bar small{font-size:7.8px;font-weight:750;white-space:nowrap}.mobile-tab-spacer{display:block}}
      `}</style>
    </>
  );
}
