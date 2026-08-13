import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { FACULTY, FAQ, FREE_RESOURCES, PROGRAMS, TESTIMONIALS } from "@/lib/coachingData";

const SYSTEM = [
  { step: "01", title: "Build the base", copy: "NCERTs, core GS and exam-specific foundations taught in a clear sequence." },
  { step: "02", title: "Decode PYQs", copy: "Understand recurring themes, demand patterns and what the exam actually rewards." },
  { step: "03", title: "Master Prelims", copy: "Daily MCQs, elimination drills, sectional tests and full-length mock cycles." },
  { step: "04", title: "Write for Mains", copy: "Answer-writing, Essay, Ethics, evaluation and structured value addition." },
  { step: "05", title: "Face the board", copy: "Profile work, current issues, mock interviews and final-stage mentoring." },
];

const RESOURCE_ICONS: Record<string, string> = {
  "/study": "01",
  "/quizzes": "02",
  "/pyq": "03",
  "/ask": "04",
  "/partner": "05",
};

const HERO_STATS = [
  ["15 years", "UPSC PYQs mapped"],
  ["5 stages", "Foundation to interview"],
  ["2 tracks", "UPSC + BPSC"],
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}>
              <span /> Admissions open for 2027–28
            </div>
            <h1>
              Prepare once.
              <br />
              <span>Clear with confidence.</span>
            </h1>
            <p className={styles.heroLead}>
              A complete UPSC and BPSC learning system that brings classes, current affairs,
              PYQs, tests, answer-writing and personal mentoring into one focused journey.
            </p>
            <div className={styles.heroActions}>
              <Link href="/courses" className={styles.primaryButton}>
                Explore programs <span>→</span>
              </Link>
              <Link href="/demo" className={styles.playButton}>
                <i>▶</i> Watch a demo class
              </Link>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.avatarStack} aria-hidden="true">
                {FACULTY.map((faculty) => (
                  <Image key={faculty.name} src={faculty.image} alt="" width={34} height={34} />
                ))}
              </div>
              <p><b>Learn with exam-experienced faculty</b><span>Concepts, practice and mentorship in one place</span></p>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label="Inside the OneShot GS learning platform">
            <div className={styles.visualDots} />
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardTop}>
                <div>
                  <span>YOUR LEARNING DESK</span>
                  <h2>Today&apos;s focused plan</h2>
                </div>
                <div className={styles.streak}><b>12</b><span>day streak</span></div>
              </div>

              <div className={styles.progressBlock}>
                <div><span>Daily progress</span><b>68%</b></div>
                <div className={styles.progressTrack}><span /></div>
              </div>

              <div className={styles.taskList}>
                <div className={styles.taskDone}><i>✓</i><p><b>Polity foundation</b><span>Fundamental Rights · 42 min</span></p><em>Done</em></div>
                <div className={styles.taskActive}><i>▶</i><p><b>June Current Affairs</b><span>Study Set 06 · Bihar focus</span></p><em>Resume</em></div>
                <div><i>03</i><p><b>Prelims practice</b><span>30 MCQs · negative marking</span></p><em>Start</em></div>
              </div>

              <div className={styles.mentorNote}>
                <span>MENTOR NOTE</span>
                <p>Revise the PYQ pattern before attempting today&apos;s test.</p>
                <Link href="/ask">Ask tutor →</Link>
              </div>
            </div>
            <div className={styles.floatingResult}>
              <span>Weekly accuracy</span><strong>+18%</strong><small>Improving steadily</small>
            </div>
            <div className={styles.floatingClass}>
              <i>●</i><div><b>Live class</b><span>Polity · 7:00 PM</span></div>
            </div>
          </div>
        </div>

        <div className={`${styles.shell} ${styles.heroStats}`}>
          {HERO_STATS.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          <Link href="/admissions">Book free counselling <span>↗</span></Link>
        </div>
      </section>

      <section className={styles.programSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>FLAGSHIP PROGRAMS</span><h2>One serious program for one serious attempt.</h2></div>
            <p>Choose your exam. We connect every stage—from learning the basics to facing the interview board.</p>
          </div>

          <div className={styles.programGrid}>
            {PROGRAMS.map((program, index) => (
              <article key={program.slug} className={index === 0 ? styles.programFeatured : styles.programCard}>
                <div className={styles.programHeader}>
                  <div><span>{index === 0 ? "MOST POPULAR" : "BIHAR FOCUSED"}</span><h3>{program.exam}</h3></div>
                  <div><strong>{program.price}</strong><small>Complete program</small></div>
                </div>
                <p>{program.note}</p>
                <div className={styles.programPill}>{program.target}</div>
                <ul>{program.includes.slice(0, 6).map(item => <li key={item}><i>✓</i>{item}</li>)}</ul>
                <div className={styles.programActions}>
                  <Link href={`/courses/${program.slug}`}>View full program <span>→</span></Link>
                  <Link href="/demo">Try demo</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ecosystemSection}>
        <div className={styles.shell}>
          <div className={styles.centerHeading}>
            <span className={styles.eyebrow}>THE ONESHOT ADVANTAGE</span>
            <h2>Everything your preparation needs.<br /><span>Nothing that distracts you.</span></h2>
            <p>Use the academic ecosystem before you enroll. The free layer stays open to every serious aspirant.</p>
          </div>
          <div className={styles.resourceGrid}>
            {FREE_RESOURCES.map((resource) => (
              <Link href={resource.href} key={resource.href} className={styles.resourceCard}>
                <div><span>{RESOURCE_ICONS[resource.href]}</span><i>↗</i></div>
                <small>{resource.eyebrow}</small>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.journeySection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>YOUR PREPARATION JOURNEY</span><h2>A clear path from day one to final selection.</h2></div>
            <p>No random resource hopping. Every learning activity moves you towards the next exam stage.</p>
          </div>
          <div className={styles.journeyGrid}>
            {SYSTEM.map((item, index) => (
              <article key={item.step}>
                <div><span>{item.step}</span>{index < SYSTEM.length - 1 && <i />}</div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pyqSection}>
        <div className={`${styles.shell} ${styles.pyqGrid}`}>
          <div className={styles.pyqCopy}>
            <span className={styles.eyebrowLight}>PYQ INTELLIGENCE DESK</span>
            <h2>Don&apos;t just solve past papers. <span>Decode the exam.</span></h2>
            <p>Study UPSC and BPSC questions by year, subject, topic, demand and recurring theme—then practise the pattern inside the same platform.</p>
            <ul>
              <li><i>✓</i> UPSC Prelims 2012–2026</li>
              <li><i>✓</i> UPSC Mains 2011–2025</li>
              <li><i>✓</i> Official BPSC CCE archive</li>
            </ul>
            <div className={styles.pyqActions}><Link href="/pyq">Explore PYQ desk →</Link><Link href="/quizzes/pyq">Practice PYQs</Link></div>
          </div>
          <div className={styles.insightPanel}>
            <div className={styles.insightTop}><div><span>UPSC PRELIMS · POLITY</span><h3>Topic recurrence</h3></div><b>15Y</b></div>
            <div className={styles.chart}>
              {[72, 48, 85, 62, 92].map((height, index) => <div key={height}><span style={{ height: `${height}%` }} /><small>{["FR", "Parl.", "Bodies", "Gov.", "Const."][index]}</small></div>)}
            </div>
            <div className={styles.insightFooter}><span><i /> High-frequency theme</span><b>View 128 mapped questions →</b></div>
          </div>
        </div>
      </section>

      <section className={styles.facultySection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>MEET YOUR FACULTY</span><h2>Learn from mentors who understand the exam.</h2></div>
            <Link href="/faculty" className={styles.textLink}>View all faculty →</Link>
          </div>
          <div className={styles.facultyGrid}>
            {FACULTY.map((faculty, index) => (
              <article key={faculty.name}>
                <div className={styles.facultyImage}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Image src={faculty.image} alt={`${faculty.name}, ${faculty.subject}`} width={360} height={410} />
                </div>
                <div className={styles.facultyBody}><small>{faculty.subject}</small><h3>{faculty.name}</h3><b>{faculty.record}</b><p>{faculty.focus}</p></div>
              </article>
            ))}
            <article className={styles.guestCard}>
              <div className={styles.guestIcon}>IPS</div><small>SPECIAL GUEST SESSION</small><h3>Prof. Kumar Sir</h3><b>Retd. IPS</b><p>Administration, Ethics and Decision-Making for Mains and Interview.</p><Link href="/faculty">View session details →</Link>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.testimonialSection}>
        <div className={styles.shell}>
          <div className={styles.centerHeading}>
            <span className={styles.eyebrow}>LEARNER STORIES</span>
            <h2>Structure changes preparation.</h2>
            <p>What aspirants experience when classes, practice and revision finally work together.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.slice(0, 3).map((item, index) => (
              <article key={item.quote} className={index === 1 ? styles.testimonialFeatured : ""}>
                <div className={styles.quoteMark}>“</div><div className={styles.stars}>★★★★★</div><blockquote>{item.quote}</blockquote><div className={styles.learner}><span>{String(index + 1).padStart(2, "0")}</span><p><b>Verified learner</b><small>{item.meta}</small></p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={`${styles.shell} ${styles.faqGrid}`}>
          <div><span className={styles.eyebrow}>FREQUENTLY ASKED</span><h2>Questions before you begin?</h2><p>Explore the free learning layer, attend a demo or speak with the admissions team.</p><Link href="/admissions">Talk to a counsellor →</Link></div>
          <div className={styles.faqList}>{FAQ.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.finalCta}`}>
        <div className={styles.ctaOrb} />
        <div><span>YOUR SERIOUS ATTEMPT STARTS HERE</span><h2>Turn preparation into progress.</h2><p>Choose UPSC CSE 2027 or 73rd BPSC and get a complete path from foundation to interview.</p></div>
        <div><Link href="/courses">Explore programs →</Link><Link href="/demo">Watch demo</Link></div>
      </section>
    </main>
  );
}
