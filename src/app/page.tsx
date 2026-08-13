import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { FACULTY, PROGRAMS } from "@/lib/coachingData";

const QUICK_LINKS = [
  { label: "UPSC PYQs", detail: "GS-I papers · 2014–2026", href: "/pyq" },
  { label: "Current Affairs", detail: "UPSC + BPSC study desk", href: "/ca" },
  { label: "Talk to Tutor", detail: "Academic doubts · exam strategy", href: "/ask" },
  { label: "Talk to Us", detail: "Admissions · payment · helpdesk", href: "/talk-to-us" },
];

const RESOURCES = [
  { title: "Previous Year Papers", copy: "Open or download UPSC Prelims GS-I papers from 2014–2026.", href: "/pyq", tag: "PYQ" },
  { title: "Current Affairs", copy: "Source-backed Current Affairs desk for UPSC and BPSC preparation.", href: "/ca", tag: "CA" },
  { title: "Free Study", copy: "NCERT, General Studies, Bihar GS and revision resources.", href: "/study", tag: "GS" },
  { title: "Free Quiz", copy: "Current Affairs and static GS practice.", href: "/quizzes", tag: "MCQ" },
  { title: "Talk to Tutor", copy: "Academic doubts, concepts, Prelims, Mains and exam strategy.", href: "/ask", tag: "TUTOR" },
  { title: "Talk to Us", copy: "Admissions, courses, payment help, technical support and callbacks.", href: "/talk-to-us", tag: "HELP" },
];

const FEATURED_FACULTY = [
  ...FACULTY.slice(0, 5),
  FACULTY[FACULTY.length - 1],
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroKicker}>UPSC CSE 2027 · 73RD BPSC</div>
            <h1>UPSC &amp; BPSC coaching<br /><span>on OneShot GS.</span></h1>
            <p>Two complete programs covering Foundation, Prelims, Mains and Interview preparation.</p>
            <div className={styles.heroActions}>
              <Link href="/courses" className={styles.primary}>View Courses</Link>
              <Link href="/ask" className={styles.secondary}>Talk to Tutor</Link>
              <Link href="/talk-to-us" className={styles.secondary}>Talk to Us</Link>
            </div>
          </div>

          <aside className={styles.admissionPanel}>
            <div className={styles.panelHead}>
              <span>PROGRAMS &amp; FEES</span>
              <h2>Current flagship courses</h2>
            </div>
            {PROGRAMS.map((program) => (
              <div className={styles.admissionCourse} key={program.slug}>
                <div>
                  <small>{program.exam}</small>
                  <h3>{program.title}</h3>
                  <p>{program.target}</p>
                </div>
                <strong>{program.price}</strong>
                <Link href={`/courses/${program.slug}`}>Course details →</Link>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className={styles.newsBar}>
        <div className={styles.shell}>
          <div className={styles.newsTitle}>QUICK ACCESS</div>
          <div className={styles.newsItems}>
            {QUICK_LINKS.map((item) => (
              <Link key={item.label} href={item.href}><b>{item.label}</b><span>{item.detail}</span><i>→</i></Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.programs}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>COURSES</span><h2>Two complete programs</h2></div>
            <Link href="/courses" className={styles.textLink}>Compare courses →</Link>
          </div>
          <div className={styles.programGrid}>
            {PROGRAMS.map((program, index) => (
              <article className={styles.programCard} key={program.slug}>
                <div className={styles.programTop}>
                  <div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div>
                  <strong>{program.price}</strong>
                </div>
                <div className={styles.programTarget}>{program.target}</div>
                <ul className={styles.programList}>{program.includes.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>
                <div className={styles.programActions}>
                  <Link href={`/courses/${program.slug}`}>View Course</Link>
                  <Link href="/demo">Demo</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.studentSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>STUDENT RESOURCES</span><h2>Study, practice and support</h2></div>
          </div>
          <div className={styles.studentGrid}>
            {RESOURCES.map((item) => (
              <Link href={item.href} key={item.title} className={styles.studentCard}>
                <div className={styles.studentIcon}>{item.tag}</div>
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                <b>→</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.academicsBand}>
        <div className={`${styles.shell} ${styles.academicsGrid}`}>
          <div className={styles.caBlock}>
            <span>CURRENT AFFAIRS</span>
            <h2>UPSC &amp; BPSC Current Affairs</h2>
            <p>PIB, PRS, RBI, MEA, environment and Bihar-government source desks.</p>
            <div><Link href="/ca">Open Current Affairs</Link><Link href="/quizzes">CA Quiz</Link></div>
          </div>
          <div className={styles.pyqBlock}>
            <div><span>UPSC PRELIMS</span><b>2014–2026</b></div>
            <h3>GS Paper-I archive</h3>
            <p>Original PDFs hosted on OneShot GS with Open PDF and Download PDF options.</p>
            <Link href="/pyq">Open PYQ Library →</Link>
          </div>
        </div>
      </section>

      <section className={styles.facultySection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>FACULTY, MENTORS &amp; GUIDANCE</span><h2>A specialist team for every exam stage</h2></div>
            <Link href="/faculty" className={styles.textLink}>View all 13 profiles →</Link>
          </div>
          <div className={styles.facultyGrid}>
            {FEATURED_FACULTY.map((faculty) => (
              <article key={faculty.name}>
                <div className={styles.facultyImage}><Image src={faculty.image} alt={faculty.name} width={360} height={450} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" /></div>
                <div className={styles.facultyBody}>
                  <span>{faculty.role} · {faculty.subject}</span>
                  <h3>{faculty.name}</h3>
                  <b>{faculty.record}</b>
                  <p>{faculty.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
