"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";
import styles from "./Nav.module.css";

const DESKTOP_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/study", label: "Study" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/pyq", label: "PYQ Library" },
  { href: "/faculty", label: "Faculty" },
];

const MOBILE_TABS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/courses", label: "Courses", icon: "▦" },
  { href: "/study", label: "Study", icon: "▤" },
  { href: "/quizzes", label: "Quiz", icon: "✓" },
  { href: "/pyq", label: "PYQs", icon: "≡" },
];

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const hideMobileTabSpacer = ["/support", "/partner", "/ask"].includes(pathname);

  useEffect(() => {
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data }) => {
        setSession(data.session ?? null);
        setLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setLoading(false);
      });
      return () => subscription.unsubscribe();
    } catch {
      const fallbackTimer = window.setTimeout(() => setLoading(false), 0);
      return () => window.clearTimeout(fallbackTimer);
    }
  }, []);

  async function handleGoogleSignIn() {
    try {
      await getSupabaseBrowserClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthRedirectUrl("/profile") },
      });
    } catch {
      window.location.href = "/signin";
    }
  }

  async function handleSignOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.href = "/";
  }

  const user = session?.user;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className={styles.announcement}>
        <div>
          <p><span>●</span> Admissions open for UPSC CSE 2027 &amp; 73rd BPSC</p>
          <Link href="/admissions">Get free counselling <span>→</span></Link>
        </div>
      </div>

      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/" className={styles.brand} aria-label="OneShot GS home">
            <Image src="/logo4.png" alt="OneShot GS" width={178} height={61} priority />
          </Link>

          <div className={styles.desktopLinks}>
            {DESKTOP_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={isActive(href) ? styles.active : ""}>{label}</Link>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/ask" className={styles.askLink}>Ask Tutor</Link>
            <Link href="/demo" className={styles.demoLink}><span>▶</span> Demo</Link>
            <Link href="/admissions" className={styles.admissionsLink}>Admissions <span>→</span></Link>
            {user ? (
              <>
                <Link href="/profile" className={styles.profile} aria-label="Open profile">
                  {user.user_metadata?.avatar_url ? <Image src={user.user_metadata.avatar_url} alt="Profile" width={33} height={33} unoptimized /> : <span>{(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}</span>}
                </Link>
                <button onClick={handleSignOut} className={styles.authButton}>Sign out</button>
              </>
            ) : (
              <button onClick={handleGoogleSignIn} disabled={loading} className={styles.authButton}>{loading ? "…" : "Sign in"}</button>
            )}
          </div>
        </nav>
      </header>

      <nav className={styles.mobileTabs} aria-label="Mobile navigation">
        {MOBILE_TABS.map(({ href, label, icon }) => (
          <Link key={href} href={href} className={isActive(href) ? styles.mobileActive : ""}>
            <span>{icon}</span><small>{label}</small>
          </Link>
        ))}
      </nav>
      <div className={styles.mobileSpacer} style={{ height: hideMobileTabSpacer ? 0 : 68 }} />
    </>
  );
}
