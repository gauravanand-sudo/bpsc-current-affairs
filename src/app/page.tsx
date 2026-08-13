import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { FACULTY, FAQ, PROGRAMS, TESTIMONIALS } from "@/lib/coachingData";

const WHATS_NEW = [
  { label: "NEW", title: "UPSC Prelims GS-I papers · 2014–2026", href: "/pyq" },
  { label: "CA", title: "Current Affairs study desk", href: "/ca" },
  { label: "FREE", title: "UPSC / BPSC quizzes", href: "/quizzes" },
];

const PILLARS = [
  {
    number: "01",
    title: "Concept-first teaching",
    copy: "NCERTs, core General Studies and exam-specific foundations arranged in a clear learning sequence.",
  },
  {
    number: "02",
    title: "Integrated current affairs",
    copy: "Current issues are connected with static subjects, Prelims elimination and Mains answer enrichment.",
  },
  {
    number: "03",
    title: "Testing & evaluation",
    copy: "Sectional practice, full-length mocks, answer-writing and feedback are built into the preparation cycle.",
  },
  {
    number: "04",
    title: "Mentorship & doubt support",
    copy: "Ask Tutor, revision planning and structured mentoring keep preparation focused across every stage.",
  },
];

const STUDENT_CORNER = [
  { eyebrow: "CURRENT AFFAIRS", title: "Daily & Monthly CA", copy: "Source-backed current affairs for UPSC and BPSC.", href: "/ca", icon: "CA" },
  { eyebrow: "QUESTION PAPERS", title: "UPSC PYQ Library", copy: "Open and download original GS-I papers from 2014–2026.", href: "/pyq", icon: "PYQ" },
  { eyebrow: "PRACTICE", title: "Free Quiz", copy: "Current affairs and static GS practice with exam-level framing.", href: "/quizzes", icon: "Q" },
  { eyebrow: "OPEN LIBRARY", title: "Free Study", copy: "NCERT, GS, Bihar Special and revision desks.", href: "/study", icon: "GS" },
  { eyebrow: "DOUBT SUPPORT", title: "Ask Tutor", copy: "Get UPSC / BPSC concepts clarified and structure the next step.", href: "/ask", icon: "?" },
  { eyebrow: "ACCOUNTABILITY", title: "Study Buddy", copy: "Find a preparation partner and build study accountability.", href: "/partner", icon: "SB" },
];

const PREPARATION_PATH = [
  ["Foundation", "NCERT + GS + Bihar Special where relevant"],
  ["Prelims", "PYQs + MCQs + sectional and full-length practice"],
  ["Mains", "Answer-writing + Essay + Ethics + evaluation"],
  ["Interview", "Profile work + current issues + mock guidance"],
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroKicker}>UPSC CSE 2027 · 73RD BPSC</div>
            <h1>Serious preparation.<br /><span>One complete academic system.</span></h1>
            <p>
              OneShot GS brings foundation teaching, current affairs, PYQs, Prelims practice,
              Mains answer-writing, mentoring and interview preparation into one focused UPSC / BPSC pathway.
            </p>
            <div className={styles.heroActions}>
              <Link href="/courses" className={styles.primary}>Explore Courses</Link>
              <Link href="/demo" className={styles.secondary}>Watch Demo Class</Link>
            </div>
            <div className={styles.heroLinks}>
              <Link href="/study">Free Study</Link>
              <Link href="/quizzes">Daily Practice</Link>
              <Link href="/pyq">Previous Year Papers</Link>
              <Link href="/ca">Current Affairs</Link>
            </div>
          </div>

          <aside className={styles.admissionPanel}>
            <div className={styles.panelHead}>
              <span>ADMISSIONS OPEN</span>
              <h2>Flagship Programs</h2>
              <p>Foundation to Interview · complete guided preparation.</p>
            </div>
            {PROGRAMS.map((program) => (
              <div className={styles.admissionCourse} key={program.slug}>
                <div>
                  <small>{program.exam}</small>
                  <h3>{program.title}</h3>
                  <p>{program.target}</p>
                </div>
                <strong>{program.price}</strong>
                <Link href={`/courses/${program.slug}`}>View Details <span>→</span></Link>
              </div>
            ))}
            <Link href="/admissions" className={styles.counsellingButton}>Book Free Academic Counselling</Link>
          </aside>
        </div>
      </section>

      <section className={styles.newsBar}>
        <div className={styles.shell}>
          <div className={styles.newsTitle}><span>●</span> WHAT&apos;S NEW</div>
          <div className={styles.newsItems}>
            {WHATS_NEW.map((item) => (
              <Link key={item.title} href={item.href}><b>{item.label}</b><span>{item.title}</span><i>→</i></Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.programs}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>OUR PROGRAMS</span><h2>Choose your examination pathway</h2></div>
            <p>Two focused flagship programs. No confusing catalogue. Each one connects Foundation, Prelims, Mains and Interview preparation.</p>
          </div>
          <div className={styles.programGrid}>
            {PROGRAMS.map((program, index) => (
              <article className={styles.programCard} key={program.slug}>
                <div className={styles.programTop}>
                  <div><span>{index === 0 ? "UPSC CIVIL SERVICES" : "BIHAR PUBLIC SERVICE COMMISSION"}</span><h3>{program.exam}</h3></div>
                  <strong>{program.price}</strong>
                </div>
                <p className={styles.programNote}>{program.note}</p>
                <div className={styles.programTarget}>{program.target}</div>
                <div className={styles.programColumns}>
                  <div>
                    <b>Program includes</b>
                    <ul>{program.includes.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <b>Best suited for</b>
                    <ul>{program.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
                <div className={styles.programActions}>
                  <Link href={`/courses/${program.slug}`}>View Complete Program</Link>
                  <Link href="/admissions">Talk to Counsellor</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className={styles.shell}>
          <div className={styles.centerHead}>
            <span>WHY ONESHOT GS</span>
            <h2>Four pillars of disciplined preparation</h2>
            <p>Teaching, content, practice and support work together instead of operating as disconnected products.</p>
          </div>
          <div className={styles.pillarGrid}>
            {PILLARS.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.studentSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>STUDENT CORNER</span><h2>Free academic resources</h2></div>
            <p>Use the academic layer before enrolling. Previous papers, current affairs, quizzes, study resources and doubt support remain accessible.</p>
          </div>
          <div className={styles.studentGrid}>
            {STUDENT_CORNER.map((item) => (
              <Link href={item.href} key={item.title} className={styles.studentCard}>
                <div className={styles.studentIcon}>{item.icon}</div>
                <div><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.copy}</p></div>
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
            <h2>Daily issues. Monthly consolidation. Exam relevance.</h2>
            <p>Study current affairs through source-backed desks and connect them with static GS, Bihar relevance and question practice.</p>
            <div>
              <Link href="/ca">Current Affairs Desk</Link>
              <Link href="/quizzes">Current Affairs Quiz</Link>
            </div>
          </div>
          <div className={styles.pyqBlock}>
            <div><span>PREVIOUS YEAR PAPERS</span><b>13 YEARS</b></div>
            <h3>UPSC Prelims GS-I · 2014–2026</h3>
            <p>Original papers are hosted on OneShot GS. Open the full paper or download it directly year-wise.</p>
            <Link href="/pyq">Open PYQ Library →</Link>
          </div>
          <div className={styles.demoBlock}>
            <span>BEFORE YOU ENROLL</span>
            <h3>Attend a demo class</h3>
            <p>See the teaching approach and explore the free academic layer first.</p>
            <Link href="/demo">Watch Demo →</Link>
          </div>
        </div>
      </section>

      <section className={styles.facultySection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>FACULTY TEAM</span><h2>Meet your educators</h2></div>
            <Link href="/faculty" className={styles.textLink}>View Faculty Details →</Link>
          </div>
          <div className={styles.facultyGrid}>
            {FACULTY.map((faculty) => (
              <article key={faculty.name}>
                <div className={styles.facultyImage}><Image src={faculty.image} alt={faculty.name} width={340} height={390} /></div>
                <div className={styles.facultyBody}>
                  <span>{faculty.subject}</span>
                  <h3>{faculty.name}</h3>
                  <b>{faculty.record}</b>
                  <p>{faculty.focus}</p>
                </div>
              </article>
            ))}
            <article className={styles.guestFaculty}>
              <div className={styles.guestBadge}>IPS</div>
              <span>SPECIAL GUEST SESSION</span>
              <h3>Narayanan Sir</h3>
              <b>Retd. IPS</b>
              <p>Administration, Ethics and Decision-Making for Mains and Interview.</p>
              <Link href="/faculty">View Faculty Page →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.pathSection}>
        <div className={styles.shell}>
          <div className={styles.centerHead}>
            <span>COMPLETE PREPARATION FRAMEWORK</span>
            <h2>From first chapter to final interview</h2>
          </div>
          <div className={styles.pathGrid}>
            {PREPARATION_PATH.map(([title, copy], index) => (
              <article key={title}>
                <div><span>{String(index + 1).padStart(2, "0")}</span>{index < PREPARATION_PATH.length - 1 && <i />}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div><span>ASPIRANT FEEDBACK</span><h2>What structured preparation changes</h2></div>
            <p>Feedback from learners using the OneShot GS preparation system.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.slice(0, 3).map((item) => (
              <article key={item.quote}>
                <div>“</div>
                <p>{item.quote}</p>
                <span>{item.meta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <span>ADMISSIONS & ACADEMICS</span>
            <h2>Common questions</h2>
            <p>Explore the free resources, attend a demo class or speak to the admissions desk before deciding.</p>
            <Link href="/admissions">Academic Counselling →</Link>
          </div>
          <div className={styles.faqList}>
            {FAQ.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span>+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`${styles.shell} ${styles.finalGrid}`}>
          <div><span>UPSC CSE 2027 · 73RD BPSC</span><h2>Begin with a clear academic plan.</h2><p>Choose the program that matches your examination and preparation stage.</p></div>
          <div><Link href="/courses">Explore Programs</Link><Link href="/admissions">Book Free Counselling</Link></div>
        </div>
      </section>
    </main>
  );
}
