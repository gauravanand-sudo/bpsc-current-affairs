"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";
import styles from "./Nav.module.css";

const MENUS = [
  {
    label: "UPSC",
    columns: [
      {
        title: "UPSC CSE 2027",
        links: [
          ["Complete Foundation Program", "/courses/upsc-2027"],
          ["Admissions & Counselling", "/admissions"],
          ["Demo Class", "/demo"],
        ],
      },
      {
        title: "Preparation",
        links: [
          ["UPSC Previous Papers", "/pyq"],
          ["Current Affairs", "/ca"],
          ["Free Study", "/study"],
          ["Free Quiz", "/quizzes"],
        ],
      },
    ],
  },
  {
    label: "BPSC",
    columns: [
      {
        title: "73rd BPSC",
        links: [
          ["Complete Foundation Program", "/courses/bpsc-73"],
          ["Admissions & Counselling", "/admissions"],
          ["Demo Class", "/demo"],
        ],
      },
      {
        title: "Bihar Preparation",
        links: [
          ["Bihar GS", "/bihar-gs"],
          ["BPSC Previous Papers", "/pyq#bpsc"],
          ["Current Affairs", "/ca"],
          ["Free Quiz", "/quizzes"],
        ],
      },
    ],
  },
  {
    label: "Free Resources",
    columns: [
      {
        title: "Study",
        links: [
          ["Free Study Library", "/study"],
          ["NCERT Desk", "/ncert"],
          ["Bihar GS", "/bihar-gs"],
          ["Lucent GK Revision", "/lucent-gk"],
        ],
      },
      {
        title: "Practice & Support",
        links: [
          ["Free Quizzes", "/quizzes"],
          ["Previous Year Papers", "/pyq"],
          ["Ask Tutor", "/ask"],
          ["Study Buddy", "/partner"],
        ],
      },
    ],
  },
];

const MOBILE_TABS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/courses", label: "Courses", icon: "▦" },
  { href: "/ca", label: "CA", icon: "◫" },
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
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <>
      <div className={styles.utility}>
        <div className={styles.utilityInner}>
          <p><b>Admissions Open:</b> UPSC CSE 2027 &amp; 73rd BPSC</p>
          <div>
            <Link href="/admissions">Academic Counselling</Link>
            <Link href="/demo">Demo Class</Link>
            <Link href="/faculty">Faculty</Link>
            {user ? (
              <>
                <Link href="/profile">Student Profile</Link>
                <button onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <button onClick={handleGoogleSignIn} disabled={loading}>{loading ? "…" : "Student Login"}</button>
            )}
          </div>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="OneShot GS home">
            <Image src="/logo4.png" alt="OneShot GS" width={190} height={66} priority />
          </Link>
          <div className={styles.instituteLabel}>
            <span>UPSC &amp; BPSC PREPARATION</span>
            <b>Foundation · Prelims · Mains · Interview</b>
          </div>
          <div className={styles.headerActions}>
            <Link href="/ask" className={styles.ask}>Ask Tutor</Link>
            <Link href="/admissions" className={styles.admission}>Admissions <span>→</span></Link>
            {user && (
              <Link href="/profile" className={styles.profile} aria-label="Open profile">
                {user.user_metadata?.avatar_url ? <Image src={user.user_metadata.avatar_url} alt="Profile" width={34} height={34} unoptimized /> : <span>{(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}</span>}
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className={styles.menuBar} aria-label="Primary navigation">
        <div className={styles.menuInner}>
          <Link href="/" className={pathname === "/" ? styles.active : ""}>Home</Link>
          {MENUS.map((menu) => (
            <div className={styles.menuItem} key={menu.label}>
              <button type="button">{menu.label}<span>⌄</span></button>
              <div className={styles.dropdown}>
                {menu.columns.map((column) => (
                  <div key={column.title}>
                    <b>{column.title}</b>
                    {column.links.map(([label, href]) => <Link href={href} key={`${label}-${href}`}>{label}<span>→</span></Link>)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Link href="/courses" className={isActive("/courses") ? styles.active : ""}>Courses</Link>
          <Link href="/ca" className={isActive("/ca") ? styles.active : ""}>Current Affairs</Link>
          <Link href="/pyq" className={isActive("/pyq") ? styles.active : ""}>PYQs</Link>
          <Link href="/faculty" className={isActive("/faculty") ? styles.active : ""}>Faculty</Link>
          <Link href="/demo" className={isActive("/demo") ? styles.active : ""}>Demo</Link>
        </div>
      </nav>

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
