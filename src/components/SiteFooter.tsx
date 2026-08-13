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
      ["Talk to Admissions", "/ask?intent=admission"],
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
    title: "BPSC",
    links: [
      ["73rd BPSC Program", "/courses/bpsc-73"],
      ["Bihar GS", "/bihar-gs"],
      ["BPSC PYQs", "/pyq#bpsc"],
      ["Current Affairs", "/ca"],
      ["Lucent GK Revision", "/lucent-gk"],
    ],
  },
  {
    title: "Help & Support",
    links: [
      ["Talk to Us", "/ask"],
      ["Academic Query", "/ask?intent=academic"],
      ["Payment Help", "/ask?intent=payment"],
      ["Technical Help", "/ask?intent=technical"],
      ["Study Buddy", "/partner"],
    ],
  },
];

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className={styles.footer}>
      {pathname !== "/" && (
        <div className={styles.counselling}>
          <div className={styles.counsellingInner}>
            <div>
              <span>NEED HELP?</span>
              <h2>Admissions, academic query or technical help</h2>
              <p>Open Talk to Us and choose the type of query. The assistant will collect only the relevant details for follow-up.</p>
            </div>
            <div>
              <Link href="/ask">Talk to Us</Link>
              <Link href="/ask?intent=admission">Admission Query</Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footerMain}>
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo} aria-label="OneShot GS home">
            <Image src="/logo4.png" alt="OneShot GS" width={210} height={72} />
          </Link>
          <p>UPSC CSE 2027 and 73rd BPSC preparation, plus Current Affairs, PYQs, quizzes, study resources and helpdesk support.</p>
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
        <div><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link><Link href="/pyq">PYQs</Link><Link href="/ca">Current Affairs</Link><Link href="/ask">Talk to Us</Link></div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 OneShot GS · UPSC / BPSC</p>
        <div><Link href="/courses">Courses</Link><Link href="/faculty">Faculty</Link><Link href="/admissions">Admissions</Link><Link href="/ask">Helpdesk</Link></div>
      </div>
    </footer>
  );
}
