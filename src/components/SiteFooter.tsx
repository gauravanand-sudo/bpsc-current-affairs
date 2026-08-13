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
      ["Courses", "/courses"],
      ["Admissions & Fees", "/admissions"],
      ["Talk to Admissions", "/talk-to-us?intent=admission"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Current Affairs", "/ca"],
      ["Free Quiz", "/quizzes"],
      ["UPSC Previous Papers", "/pyq"],
      ["Free Study", "/study"],
      ["NCERT", "/ncert"],
    ],
  },
  {
    title: "Academic Support",
    links: [
      ["Talk to Tutor", "/ask"],
      ["Bihar GS", "/bihar-gs"],
      ["BPSC PYQs", "/pyq#bpsc"],
      ["Study Buddy", "/partner"],
      ["Faculty", "/faculty"],
    ],
  },
  {
    title: "Helpdesk",
    links: [
      ["Talk to Us", "/talk-to-us"],
      ["Admission Query", "/talk-to-us?intent=admission"],
      ["Payment Help", "/talk-to-us?intent=payment"],
      ["Technical Help", "/talk-to-us?intent=technical"],
      ["Other Query", "/talk-to-us?intent=general"],
    ],
  },
];

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask", "/talk-to-us"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className={styles.footer}>
      {pathname !== "/" && (
        <div className={styles.counselling}>
          <div className={styles.counsellingInner}>
            <div>
              <span>NEED HELP?</span>
              <h2>Academic doubt or helpdesk query?</h2>
              <p>Use Talk to Tutor for study questions. Use Talk to Us for admissions, payment and technical support.</p>
            </div>
            <div>
              <Link href="/ask">Talk to Tutor</Link>
              <Link href="/talk-to-us">Talk to Us</Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footerMain}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo} aria-label="OneShot GS home">
            <Image src="/logo4.png" alt="OneShot GS" width={210} height={72} />
          </Link>
          <p>UPSC CSE 2027 and 73rd BPSC preparation, plus Current Affairs, PYQs, quizzes, study resources, academic tutoring and helpdesk support.</p>
          <div className={styles.programMini}>
            <Link href="/courses/upsc-2027"><b>UPSC CSE 2027</b><span>₹1,60,000</span></Link>
            <Link href="/courses/bpsc-73"><b>73rd BPSC</b><span>₹87,000</span></Link>
          </div>
        </div>

        <div className={styles.linkGrid}>
          {FOOTER_LINKS.map((group) => (
            <div className={styles.linkColumn} key={group.title}>
              <b>{group.title}</b>
              {group.links.map(([label, href]) => <Link href={href} key={`${label}-${href}`}>{label}</Link>)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.studentStrip}>
        <div><b>Quick Links</b></div>
        <div><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link><Link href="/pyq">PYQs</Link><Link href="/ask">Talk to Tutor</Link><Link href="/talk-to-us">Talk to Us</Link></div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 OneShot GS · UPSC / BPSC</p>
        <div><Link href="/courses">Courses</Link><Link href="/faculty">Faculty</Link><Link href="/admissions">Admissions</Link><Link href="/talk-to-us">Helpdesk</Link></div>
      </div>
    </footer>
  );
}
