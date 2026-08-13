import Image from "next/image";
import Link from "next/link";
import BatchUpdatePopup from "@/components/BatchUpdatePopup";
import styles from "./home.module.css";
import { FACULTY, PROGRAMS } from "@/lib/coachingData";
import { getProgramPricing } from "@/lib/programPricing";

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

function TickerGroup({ academic = false }: { academic?: boolean }) {
  return (
    <div className={styles.tickerGroup} aria-hidden="true">
      {academic ? (
        <>
          <span>UPSC PRELIMS GS-I · 2014–2026</span><i>◆</i>
          <span>CURRENT AFFAIRS · UPSC + BPSC</span><i>◆</i>
          <span>FREE QUIZ + FREE STUDY</span><i>◆</i>
          <span>TALK TO TUTOR · ACADEMIC DOUBTS</span><i>◆</i>
          <span>TALK TO US · ADMISSIONS + HELPDESK</span><i>◆</i>
        </>
      ) : (
        <>
          <span>UPSC CSE 2027 · ₹2,00,000 → ₹1,60,000 · 20% OFF</span><i>◆</i>
          <span>73RD BPSC · ₹1,20,000 → ₹87,000 · 27.5% OFF</span><i>◆</i>
          <span>FOUNDATION + PRELIMS + MAINS + INTERVIEW</span><i>◆</i>
          <span>DEMO CLASS AVAILABLE</span><i>◆</i>
          <span>ADMISSION QUERY · TALK TO US</span><i>◆</i>
        </>
      )}
    </div>
  );
}

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
            {PROGRAMS.map((program) => {
              const pricing = getProgramPricing(program.slug);
              return (
                <div className={styles.admissionCourse} key={program.slug}>
                  <div>
                    <small>{program.exam}</small>
                    <h3>{program.title}</h3>
                    <p>{program.target}</p>
                  </div>
                  <div className={styles.priceBox}>
                    <span>REGULAR FEE</span>
                    <s>{pricing?.regularPrice}</s>
                    <div className={styles.currentPrice}><strong>{program.price}</strong><em>{pricing?.discount}</em></div>
                    <small>{pricing?.saving}</small>
                  </div>
                  <Link href={`/courses/${program.slug}`}>Course details →</Link>
                </div>
              );
            })}
          </aside>
        </div>
      </section>

      <div className={`${styles.ticker} ${styles.tickerRed}`} aria-label="Program updates">
        <div className={styles.tickerTrack}><TickerGroup /><TickerGroup /></div>
      </div>

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
            {PROGRAMS.map((program, index) => {
              const pricing = getProgramPricing(program.slug);
              return (
                <article className={styles.programCard} key={program.slug}>
                  <div className={styles.programTop}>
                    <div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div>
                    <div className={`${styles.priceBox} ${styles.cardPrice}`}>
                      <span>REGULAR FEE</span>
                      <s>{pricing?.regularPrice}</s>
                      <div className={styles.currentPrice}><strong>{program.price}</strong><em>{pricing?.discount}</em></div>
                      <small>{pricing?.saving}</small>
                    </div>
                  </div>
                  <div className={styles.programTarget}>{program.target}</div>
                  <ul className={styles.programList}>{program.includes.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>
                  <div className={styles.programActions}>
                    <Link href={`/courses/${program.slug}`}>View Course</Link>
                    <Link href="/demo">Demo</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`${styles.ticker} ${styles.tickerNavy}`} aria-label="Study resources">
        <div className={`${styles.tickerTrack} ${styles.tickerTrackReverse}`}><TickerGroup academic /><TickerGroup academic /></div>
      </div>

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

      <BatchUpdatePopup />
    </main>
  );
}
