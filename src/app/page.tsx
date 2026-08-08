import Link from "next/link";
import FloatingExamTimers from "@/components/FloatingExamTimers";
import GlowLogo from "@/components/GlowLogo";

const COURSES = [
  { badge: "🔥 Flagship BPSC Batch", title: "72nd BPSC Prelims Complete Course", subtitle: "GS + Bihar Special + Current Affairs + PYQ strategy", price: "₹1,499", oldPrice: "₹4,999", href: "/ghatnachakra", color: "#b91c1c", features: ["120+ structured classes", "Daily MCQ practice", "Bihar-specific revision", "Full-length mock tests"] },
  { badge: "⚡ Fast Track", title: "BPSC AEDO Target Batch", subtitle: "Focused preparation for AEDO with exam-oriented practice", price: "₹999", oldPrice: "₹2,999", href: "/quizzes", color: "#c06010", features: ["Concept + practice plan", "Topic-wise MCQs", "Revision sheets", "Doubt support"] },
  { badge: "🚀 Long-Term Foundation", title: "UPSC 2027 Prelims Foundation", subtitle: "Build a strong GS foundation with disciplined weekly targets", price: "₹3,999", oldPrice: "₹9,999", href: "/ncert", color: "#5b21b6", features: ["NCERT-to-standard-book path", "Prelims-focused GS", "Current affairs integration", "Weekly tests + revision"] },
];

const FACULTIES = [
  { name: "Ruhani Chauhan", emoji: "🏛️📜", subject: "History Faculty · BPSC / UPSC", credential: "Demo profile: 2× BPSC Prelims qualified · 1× UPSC Prelims qualified", focus: "Ancient 🪷 · Medieval ⚔️ · Modern India 🇮🇳" },
  { name: "Ira Jain", emoji: "⚖️📘", subject: "Polity & Governance Faculty · BPSC / UPSC", credential: "Demo profile: UPSC Prelims qualified · BPSC Mains appeared", focus: "Constitution 🏛️ · Governance 🧭 · Current Issues 📰" },
  { name: "Gargi Gupta", emoji: "🌍🌱", subject: "Geography & Environment Faculty · BPSC / UPSC", credential: "Demo profile: UPSC Prelims qualified · State PCS Prelims qualified", focus: "India 🇮🇳 · Bihar 🌾 · World 🌐 · Environment 🌿" },
];

const TESTIMONIALS = [
  { quote: "The daily targets finally gave my preparation structure. I stopped collecting resources and started finishing them.", meta: "Sample feedback · BPSC aspirant, Patna" },
  { quote: "The Bihar-specific revision was concise and much easier to revise before mocks.", meta: "Sample feedback · 72nd BPSC aspirant" },
  { quote: "I liked the mix of lectures, PYQs and tests. It feels like a plan, not just a video library.", meta: "Sample feedback · Working professional" },
  { quote: "The faculty explanations are simple and exam-focused. I could revise polity much faster.", meta: "Sample feedback · UPSC/BPSC learner" },
  { quote: "The mock-test routine helped me identify weak areas early instead of discovering them near the exam.", meta: "Sample feedback · Bihar PCS aspirant" },
  { quote: "Current affairs became manageable because the notes were linked back to static GS topics.", meta: "Sample feedback · UPSC 2027 aspirant" },
  { quote: "The study-partner feature is useful for accountability when motivation drops.", meta: "Sample feedback · College student" },
  { quote: "The platform feels lightweight, direct and focused on what to study next.", meta: "Sample feedback · Repeat aspirant" },
];

const CONTENT = [
  { href: "/ca/lectures", emoji: "📰", title: "Current Affairs", desc: "Month-wise lectures & PDF notes" },
  { href: "/ghatnachakra", emoji: "📕", title: "GS Ghatnachakra", desc: "Subject-wise lectures & PDF notes" },
  { href: "/bihar-gs", emoji: "🗺️", title: "Bihar GS", desc: "Bihar geography, economy & polity" },
  { href: "/ncert", emoji: "📗", title: "NCERT", desc: "Foundation reading & lectures" },
  { href: "/lucent-gk", emoji: "📘", title: "Lucent GK", desc: "Fast factual revision" },
  { href: "/quizzes", emoji: "🎯", title: "Quiz", desc: "Timed MCQs with instant feedback" },
  { href: "/pyq", emoji: "📋", title: "Bihar PYQ", desc: "Previous-year questions" },
];

const TOOLS = [
  { href: "/partner", emoji: "🤝", title: "Find Study Partner", desc: "Build accountability with a serious aspirant" },
  { href: "/ask", emoji: "🧠", title: "Ask Tutor", desc: "AI tutor for quick concept clarification" },
  { href: "/support", emoji: "💙", title: "Student Support", desc: "Reset, refocus and get back to preparation" },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <div className="grain" />
      <FloatingExamTimers />

      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((i) => (
            <div key={i} className="ticker-set">
              {["72nd BPSC PRELIMS • ENROLLMENT OPEN", "BPSC AEDO • FAST TRACK", "UPSC 2027 • FOUNDATION BATCH"].map((exam) => (
                <span key={exam} className="ticker-item">🔥 {exam}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero-logo"><GlowLogo width={300} height={112} /></div>
        <div className="hero-badge">🎯 One platform. One plan. One serious attempt.</div>
        <h1>Prepare for BPSC & UPSC with a clear daily system — not endless resource hunting.</h1>
        <p className="hero-copy">Structured GS, Bihar Special, Current Affairs, PYQs, quizzes and guided revision for aspirants who want consistency, clarity and measurable progress.</p>
        <div className="hero-actions">
          <a className="primary-cta" href="#courses">🔥 View Courses & Prices</a>
          <Link className="secondary-cta" href="/partner">🤝 Find Study Partner</Link>
        </div>
        <div className="trust-strip"><span>📚 Structured learning</span><span>🧪 Practice-first</span><span>🗓️ Daily targets</span><span>🧠 AI doubt support</span></div>
        <p className="vedic">असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥</p>
      </section>

      <section className="proof-band">
        <div><strong>3</strong><span>Focused paid batches</span></div><div><strong>7+</strong><span>Core study resources</span></div><div><strong>Daily</strong><span>Practice & revision rhythm</span></div><div><strong>1</strong><span>Integrated prep ecosystem</span></div>
      </section>

      <section id="courses" className="section">
        <div className="section-head"><div><span className="eyebrow">🔥 Most Popular</span><h2>Choose your target exam</h2></div><p>Simple pricing. Focused syllabus. Start with the batch closest to your exam.</p></div>
        <div className="course-grid">
          {COURSES.map((course) => (
            <article key={course.title} className="course-card" style={{ "--accent": course.color } as React.CSSProperties}>
              <span className="course-badge">{course.badge}</span><h3>{course.title}</h3><p className="course-subtitle">{course.subtitle}</p>
              <div className="price-row"><strong>{course.price}</strong><del>{course.oldPrice}</del><span>Limited launch price</span></div>
              <ul>{course.features.map((feature) => <li key={feature}>✅ {feature}</li>)}</ul>
              <Link href={course.href} className="buy-cta">Enroll / Explore →</Link>
              <small>Demo pricing shown for storefront layout. Connect checkout before launch.</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section faculty-section">
        <div className="section-head"><div><span className="eyebrow">👩‍🏫 Mentorship-led learning</span><h2>Meet your faculty</h2></div><p>Subject ownership, exam orientation and revision-first teaching.</p></div>
        <div className="faculty-grid">
          {FACULTIES.map((faculty) => (
            <article key={faculty.name} className="faculty-card">
              <div className="faculty-photo">{faculty.emoji}</div>
              <div><h3>{faculty.name}</h3><p className="faculty-subject">🎓 {faculty.subject}</p><p className="faculty-credential">🏅 {faculty.credential}</p><p className="faculty-focus">📚 {faculty.focus}</p></div>
            </article>
          ))}
        </div>
        <p className="demo-note">Faculty names, credentials and portraits are demo/placeholder content until verified for production.</p>
      </section>

      <section className="section guest">
        <div className="guest-icon">🎙️👮‍♂️</div>
        <div className="guest-copy"><span className="eyebrow">Special Guest Lecture · Demo Listing</span><h2>Prof. Kumar Sir · Retd. IPS</h2><p>“Administration, Ethics & Decision-Making: What aspirants should understand beyond the textbook.”</p><div className="guest-points"><span>🧭 Administrative perspective</span><span>⚖️ Ethics in public service</span><span>📝 Interview-oriented insights</span><span>🎯 BPSC / UPSC relevance</span></div></div>
        <a className="primary-cta guest-cta" href="#courses">Reserve Seat →</a>
      </section>

      <section className="section testimonials">
        <div className="section-head"><div><span className="eyebrow">💬 Student voice</span><h2>What serious aspirants want from preparation</h2></div><p>Sample testimonial copy for the marketing layout — replace with verified reviews before publishing as real endorsements.</p></div>
        <div className="testimonial-grid">{TESTIMONIALS.map((item, idx) => <article className="testimonial-card" key={idx}><div className="stars">★★★★★</div><p>“{item.quote}”</p><span>{item.meta}</span></article>)}</div>
      </section>

      <section className="section">
        <div className="section-head"><div><span className="eyebrow">📚 Included ecosystem</span><h2>Everything you need between lectures</h2></div><p>Use the free study library alongside your batch for revision and practice.</p></div>
        <div className="content-grid">{CONTENT.map((item) => <Link key={item.href} href={item.href} className="content-card"><span className="content-emoji">{item.emoji}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div><span className="arrow">›</span></Link>)}</div>
      </section>

      <section className="section">
        <div className="section-head"><div><span className="eyebrow">🛠️ Accountability tools</span><h2>Preparation is easier when you are not doing it alone</h2></div></div>
        <div className="tools-grid">{TOOLS.map((item) => <Link key={item.href} href={item.href} className="tool-card"><div className="tool-icon">{item.emoji}</div><h3>{item.title}</h3><p>{item.desc}</p></Link>)}</div>
      </section>

      <section className="final-cta"><span>🚀 YOUR NEXT ATTEMPT DESERVES A SYSTEM</span><h2>Stop planning to prepare. Start preparing with a plan.</h2><p>Pick your exam, follow the daily sequence and measure progress through practice.</p><div className="hero-actions"><a className="primary-cta light" href="#courses">See Courses & Pricing</a><Link className="secondary-cta dark" href="/quizzes">Try a Quiz First</Link></div></section>

      <style>{`
        .home-shell{min-height:100vh;padding:34px 0 72px;position:relative;overflow:hidden;background:linear-gradient(to bottom,rgba(250,246,240,.88),rgba(248,241,232,.95) 45%,rgba(252,249,245,.99)),url('/bg1.png') center/cover fixed no-repeat}.grain{position:fixed;inset:0;pointer-events:none;z-index:-1;opacity:.08;background-image:radial-gradient(rgba(75,45,20,.7) .45px,transparent .45px);background-size:5px 5px}.ticker{position:fixed;top:52px;left:0;right:0;z-index:99;height:32px;overflow:hidden;background:rgba(20,9,3,.94);border-bottom:1px solid rgba(245,158,11,.3);display:flex;align-items:center}.ticker-track{display:flex;width:200%;animation:ticker 20s linear infinite}.ticker-set{width:50%;display:flex;justify-content:space-around;gap:28px}.ticker-item{color:#fde3a7;font-size:10px;font-weight:900;letter-spacing:.13em;white-space:nowrap}@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .hero{max-width:980px;margin:0 auto;padding:68px 18px 28px;text-align:center}.hero-logo{display:flex;justify-content:center;margin-bottom:4px}.hero-badge,.eyebrow{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid rgba(120,80,30,.14);padding:7px 11px;font-size:11px;font-weight:900;letter-spacing:.05em;color:#7c2d12}.hero h1{max-width:900px;margin:16px auto 12px;font-family:var(--font-display);font-size:clamp(32px,6vw,64px);line-height:.99;letter-spacing:-.055em;color:var(--ink-strong)}.hero-copy{max-width:720px;margin:0 auto;font-size:15px;line-height:1.75;color:var(--ink-soft);font-weight:560}.hero-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:20px}.primary-cta,.secondary-cta,.buy-cta{text-decoration:none;border-radius:14px;font-weight:900;transition:transform .15s ease,box-shadow .15s ease}.primary-cta{padding:14px 19px;color:#fff;background:linear-gradient(135deg,#b91c1c,#c06010);box-shadow:0 10px 28px rgba(185,28,28,.2)}.secondary-cta{padding:13px 18px;color:var(--ink-strong);background:rgba(255,255,255,.78);border:1px solid rgba(120,80,30,.14)}.primary-cta:hover,.secondary-cta:hover,.buy-cta:hover{transform:translateY(-2px)}.trust-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:20px auto 0}.trust-strip span{background:rgba(255,255,255,.7);border:1px solid rgba(120,80,30,.1);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:750}.vedic{margin-top:18px;font-size:12px;color:var(--muted);font-style:italic}
        .proof-band{max-width:930px;margin:16px auto 0;padding:16px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:20px;background:rgba(35,18,8,.94);color:white;box-shadow:0 18px 50px rgba(60,30,10,.15)}.proof-band div{text-align:center;padding:5px 8px;border-right:1px solid rgba(255,255,255,.1)}.proof-band div:last-child{border-right:0}.proof-band strong{display:block;font-size:24px;color:#f8c66d}.proof-band span{font-size:10px;color:#eadfd5}.section{max-width:980px;margin:42px auto 0;padding:0 14px}.section-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:14px}.section-head h2{font-family:var(--font-display);font-size:clamp(25px,4vw,38px);letter-spacing:-.04em;line-height:1;margin-top:9px;color:var(--ink-strong)}.section-head>p{max-width:390px;color:var(--ink-soft);font-size:12px;line-height:1.6}
        .course-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.course-card{position:relative;padding:20px;border-radius:22px;background:rgba(255,255,255,.9);border:1px solid color-mix(in srgb,var(--accent) 20%,rgba(120,80,30,.08));box-shadow:0 10px 35px rgba(100,60,25,.11);overflow:hidden}.course-card:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--accent)}.course-badge{display:inline-block;font-size:10px;font-weight:900;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,white);padding:6px 9px;border-radius:999px}.course-card h3{font-family:var(--font-display);font-size:22px;line-height:1.08;margin:13px 0 7px;color:var(--ink-strong)}.course-subtitle{min-height:58px;font-size:12px;color:var(--ink-soft);line-height:1.55}.price-row{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:13px 0}.price-row strong{font-size:27px;color:var(--ink-strong)}.price-row del{color:var(--muted);font-size:12px}.price-row span{width:100%;font-size:10px;font-weight:800;color:#15803d}.course-card ul{list-style:none;padding:0;margin:12px 0 17px;display:grid;gap:7px;font-size:11px;color:var(--ink-soft)}.buy-cta{display:block;text-align:center;padding:12px;color:white;background:var(--accent)}.course-card small{display:block;margin-top:9px;color:var(--muted);font-size:9px;line-height:1.4}
        .faculty-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.faculty-card{padding:17px;border-radius:20px;background:rgba(255,255,255,.88);border:1px solid rgba(120,80,30,.11);box-shadow:0 7px 28px rgba(100,60,25,.09)}.faculty-photo{height:130px;border-radius:16px;display:grid;place-items:center;font-size:48px;margin-bottom:13px;background:linear-gradient(145deg,#fff4e7,#efe7ff)}.faculty-card h3{font-family:var(--font-display);font-size:20px;color:var(--ink-strong)}.faculty-subject{font-size:11px;font-weight:800;margin-top:5px;color:#7c2d12}.faculty-credential{font-size:10.5px;line-height:1.5;margin-top:8px;color:var(--ink-soft)}.faculty-focus{font-size:10px;line-height:1.5;margin-top:7px;color:var(--muted)}.demo-note{margin-top:9px;font-size:9px;color:var(--muted)}
        .guest{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:18px;padding:22px;border-radius:24px;background:linear-gradient(135deg,#241207,#4a210b);color:#fff;box-shadow:0 14px 40px rgba(50,25,10,.2)}.guest-icon{width:80px;height:80px;display:grid;place-items:center;border-radius:20px;background:rgba(255,255,255,.09);font-size:28px}.guest .eyebrow{color:#ffe0a6;background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12)}.guest h2{font-family:var(--font-display);font-size:30px;margin:8px 0 5px}.guest-copy>p{color:#eadfd5;font-size:12px}.guest-points{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.guest-points span{font-size:10px;background:rgba(255,255,255,.08);padding:6px 8px;border-radius:999px}.guest-cta{white-space:nowrap}
        .testimonial-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.testimonial-card{padding:15px;border-radius:17px;background:rgba(255,255,255,.82);border:1px solid rgba(120,80,30,.1);box-shadow:0 6px 22px rgba(100,60,25,.07)}.stars{color:#d97706;letter-spacing:.08em;font-size:11px}.testimonial-card p{font-size:11.5px;line-height:1.58;margin:9px 0;color:var(--ink-strong)}.testimonial-card span{font-size:9.5px;color:var(--muted)}.content-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.content-card{display:flex;align-items:center;gap:11px;text-decoration:none;padding:13px 14px;border-radius:16px;background:rgba(255,255,255,.82);border:1px solid rgba(120,80,30,.1)}.content-emoji{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:#fff4e7;font-size:22px}.content-card h3{font-size:14px;color:var(--ink-strong)}.content-card p{font-size:10.5px;margin-top:2px;color:var(--ink-soft)}.arrow{margin-left:auto;color:var(--muted);font-size:20px}.tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.tool-card{text-decoration:none;padding:16px;border-radius:18px;background:rgba(255,255,255,.82);border:1px solid rgba(120,80,30,.1)}.tool-icon{font-size:25px;margin-bottom:9px}.tool-card h3{font-size:14px;color:var(--ink-strong)}.tool-card p{font-size:10.5px;line-height:1.5;margin-top:4px;color:var(--ink-soft)}
        .final-cta{max-width:980px;margin:46px auto 0;padding:34px 18px;text-align:center;border-radius:28px;background:linear-gradient(135deg,#8d1717,#c06010);color:#fff;box-shadow:0 18px 50px rgba(140,40,20,.22)}.final-cta>span{font-size:10px;font-weight:900;letter-spacing:.14em;color:#ffe1ad}.final-cta h2{font-family:var(--font-display);font-size:clamp(30px,5vw,48px);max-width:760px;margin:9px auto;line-height:1;letter-spacing:-.045em}.final-cta p{max-width:620px;margin:0 auto;color:#fff4e8;font-size:12px}.light{background:#fff;color:#8d1717;box-shadow:none}.dark{color:#fff;background:rgba(30,10,5,.38);border-color:rgba(255,255,255,.18)}
        @media(max-width:760px){.proof-band{margin-left:14px;margin-right:14px;grid-template-columns:repeat(2,1fr)}.proof-band div:nth-child(2){border-right:0}.proof-band div{border-bottom:1px solid rgba(255,255,255,.08)}.course-grid,.faculty-grid{grid-template-columns:1fr}.testimonial-grid{grid-template-columns:repeat(2,1fr)}.section-head{align-items:flex-start;flex-direction:column;gap:7px}.guest{grid-template-columns:1fr}.guest-icon{width:64px;height:64px}.guest-cta{justify-self:start}}@media(max-width:540px){.hero{padding-top:58px}.hero h1{font-size:36px}.testimonial-grid,.content-grid{grid-template-columns:1fr}.tools-grid{grid-template-columns:1fr}.ticker-set{gap:40px}}
      `}</style>
    </main>
  );
}
