"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";

const FOOTER_LINKS = [
  {
    title: "Programs",
    links: [
      ["UPSC CSE 2027", "/courses/upsc-2027"],
      ["73rd BPSC", "/courses/bpsc-73"],
      ["All courses", "/courses"],
      ["Admissions", "/admissions"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Free Study", "/study"],
      ["Free Quizzes", "/quizzes"],
      ["Current Affairs", "/ca"],
      ["UPSC / BPSC PYQs", "/pyq"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Ask Tutor", "/ask"],
      ["Find Study Buddy", "/partner"],
      ["Support Desk", "/support"],
      ["Student Profile", "/profile"],
    ],
  },
];

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.counselling}>
        <div>
          <span>NOT SURE WHERE TO START?</span>
          <h2>Talk to a OneShot GS academic counsellor.</h2>
        </div>
        <div className={styles.counsellingActions}>
          <Link href="/admissions">Book free counselling <span>→</span></Link>
          <Link href="/demo">Watch demo class</Link>
        </div>
      </div>

      <div className={styles.footerMain}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo} aria-label="OneShot GS home">
            <Image src="/logo4.png" alt="OneShot GS" width={210} height={72} />
          </Link>
          <p>A focused UPSC and BPSC preparation ecosystem—from foundation classes to the final interview.</p>
          <div className={styles.brandPills}><span>Foundation</span><span>Prelims</span><span>Mains</span><span>Interview</span></div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div className={styles.linkColumn} key={group.title}>
            <b>{group.title}</b>
            {group.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </div>
        ))}
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 OneShot GS. Built for serious UPSC &amp; BPSC aspirants.</p>
        <div><Link href="/faculty">Faculty</Link><Link href="/demo">Demo</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/support">Contact</Link></div>
      </div>
    </footer>
  );
}
