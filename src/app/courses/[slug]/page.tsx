"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const COURSES: Record<string, {
  exam: string; title: string; price: string; accent: string; kicker: string;
  promise: string; audience: string[]; includes: string[]; phases: {title:string;items:string[]}[];
}> = {
  "upsc-2027": {
    exam: "UPSC CSE 2027", title: "UPSC 2027 Complete Program", price: "₹56,000", accent: "#5b21b6",
    kicker: "PRELIMS + MAINS + INTERVIEW · ONE COMPLETE PROGRAM",
    promise: "A structured attempt from foundation to Personality Test — with study plan, classes, testing, answer writing, revision and mentoring connected in one system.",
    audience: ["First serious UPSC attempt", "Working aspirants who need structure", "Repeat aspirants rebuilding strategy"],
    includes: ["GS foundation + advanced coverage", "CSAT preparation", "Current Affairs integration", "Prelims test series + PYQs", "Mains GS answer writing", "Essay + Ethics practice", "Evaluated copies & feedback", "Revision plans & mentoring", "Interview / Personality Test guidance"],
    phases: [
      {title:"Phase 1 · Build",items:["NCERT + core GS foundation","Daily Current Affairs integration","CSAT basics and practice"]},
      {title:"Phase 2 · Prelims",items:["High-frequency revision","Sectional + full-length tests","PYQ-led elimination strategy"]},
      {title:"Phase 3 · Mains",items:["GS answer writing","Essay + Ethics","Evaluation and improvement loops"]},
      {title:"Phase 4 · Interview",items:["DAF-oriented guidance","Mock interview preparation","Communication + issue framing"]},
    ],
  },
  "upsc-2028": {
    exam: "UPSC CSE 2028", title: "UPSC 2028 Complete Program", price: "₹56,000", accent: "#7c3aed",
    kicker: "LONG-RUN FOUNDATION · PRELIMS + MAINS + INTERVIEW",
    promise: "Use the longer runway properly: build concepts early, start writing before the crowd, revise multiple times and enter 2028 with a complete preparation system.",
    audience: ["College students", "Early starters", "Aspirants who want multiple revision cycles"],
    includes: ["NCERT-to-advanced GS roadmap", "CSAT from foundation", "Current Affairs habit system", "Prelims MCQ progression", "Early Mains answer writing", "Essay + Ethics", "Mentor-led revision cycles", "Full test series", "Interview guidance"],
    phases: [
      {title:"Foundation",items:["NCERT mastery","Core GS concepts","Current Affairs discipline"]},
      {title:"Skill Building",items:["CSAT practice","Answer-writing basics","Essay + Ethics foundation"]},
      {title:"Exam Mode",items:["Prelims tests + PYQs","Mains evaluated tests","Multiple revision cycles"]},
      {title:"Personality Test",items:["DAF preparation","Mock interviews","Final mentoring"]},
    ],
  },
  "bpsc-72": {
    exam: "72nd BPSC", title: "72nd BPSC Complete Program", price: "₹29,000", accent: "#b91c1c",
    kicker: "BIHAR-FOCUSED · PRELIMS + MAINS + INTERVIEW",
    promise: "One Bihar-first preparation system built around what BPSC actually asks — static GS, Bihar Special, Current Affairs, PYQs, testing, Mains writing and Interview guidance.",
    audience: ["72nd BPSC focused aspirants", "Working candidates", "Repeat BPSC candidates"],
    includes: ["Complete Prelims GS", "Bihar Special", "Current Affairs", "PYQ-led preparation", "Prelims test series", "Mains answer writing", "Evaluated Mains practice", "Bihar issue enrichment", "Interview guidance"],
    phases: [
      {title:"Prelims Core",items:["Static GS + Bihar Special","Current Affairs revision","PYQs + full mocks"]},
      {title:"Mains Writing",items:["Structured answer writing","Bihar-focused enrichment","Evaluation + feedback"]},
      {title:"Revision",items:["Short notes","High-yield test cycles","Weak-area correction"]},
      {title:"Interview",items:["Bihar issues","Profile-based questions","Mock interview guidance"]},
    ],
  },
  "bpsc-73": {
    exam: "73rd BPSC", title: "73rd BPSC Complete Program", price: "₹29,000", accent: "#c06010",
    kicker: "FOUNDATION TO FINAL INTERVIEW · ONE PROGRAM",
    promise: "A longer preparation runway for 73rd BPSC with strong Bihar GS, systematic MCQ practice, Mains writing from early stages and full-cycle mentoring.",
    audience: ["Early 73rd BPSC starters", "Graduates building fundamentals", "Aspirants balancing job or college"],
    includes: ["Foundation GS", "Bihar static + current", "Prelims MCQ program", "PYQ analysis", "Mains writing program", "Evaluation + mentoring", "Revision cycles", "Full mocks", "Interview guidance"],
    phases: [
      {title:"Foundation",items:["Core GS","Bihar Special","Current Affairs"]},
      {title:"Practice",items:["Topic-wise MCQs","PYQs","Mains answer writing"]},
      {title:"Exam Cycle",items:["Full tests","Revision sprints","Performance analysis"]},
      {title:"Interview",items:["Bihar issues","Personality guidance","Mock interview support"]},
    ],
  },
};

export default function CoursePage() {
  const params = useParams<{slug:string}>();
  const course = COURSES[params.slug];
  const [paymentNotice, setPaymentNotice] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  if (!course) return <main style={{padding:40,textAlign:"center"}}><h1>Course not found</h1><Link href="/#courses">View all programs</Link></main>;

  return (
    <main className="course-page" style={{"--accent":course.accent} as React.CSSProperties}>
      <section className="sales-hero">
        <Link href="/#courses" className="back">← All Programs</Link>
        <span className="kicker">🎓 {course.kicker}</span>
        <h1>{course.title}</h1>
        <p>{course.promise}</p>
        <div className="price-row"><strong>{course.price}</strong><span>Complete program fee</span></div>
        <div className="actions">
          <button onClick={() => setPaymentNotice(true)} className="buy">Enroll / Purchase Now →</button>
          <button onClick={() => setDemoOpen(true)} className="demo">▶ View Demo Lecture</button>
        </div>
        <div className="trust"><span>✅ Prelims</span><span>✅ Mains</span><span>✅ Interview</span><span>📝 Tests</span><span>🧠 Mentoring</span></div>
      </section>

      <section className="content-grid">
        <div>
          <section className="block"><span className="eyebrow">WHAT YOU GET</span><h2>Everything required for one complete attempt.</h2><div className="feature-grid">{course.includes.map(x => <div key={x}>✓ {x}</div>)}</div></section>
          <section className="block"><span className="eyebrow">THE JOURNEY</span><h2>Preparation is sequenced, not dumped.</h2><div className="phase-grid">{course.phases.map(p => <article key={p.title}><b>{p.title}</b>{p.items.map(i => <span key={i}>• {i}</span>)}</article>)}</div></section>
          <section className="block"><span className="eyebrow">WHO THIS IS FOR</span><h2>Built for aspirants who want one clear system.</h2><div className="audience">{course.audience.map(x => <span key={x}>🎯 {x}</span>)}</div></section>
          <section className="block faq"><span className="eyebrow">FAQ</span><h2>Before you enroll.</h2><details open><summary>Does the fee include all three stages?</summary><p>Yes. The program is positioned as one complete preparation journey covering Prelims, Mains and Interview guidance.</p></details><details><summary>Is testing included?</summary><p>Yes. Stage-appropriate MCQs, PYQs, test cycles and evaluated writing are included in the program structure.</p></details><details><summary>Can I see a lecture before buying?</summary><p>Yes. Use the Demo Lecture button to preview the teaching experience.</p></details></section>
        </div>
        <aside className="side-card"><span>FULL PROGRAM</span><h3>{course.exam}</h3><strong>{course.price}</strong><p>Prelims + Mains + Interview</p><ul><li>Structured classes</li><li>Practice + PYQs</li><li>Tests & evaluation</li><li>Revision system</li><li>Mentoring support</li></ul><button onClick={() => setPaymentNotice(true)} className="buy">Purchase Course →</button><button onClick={() => setDemoOpen(true)} className="demo">▶ Watch Demo</button><small>One fee · Complete preparation journey</small></aside>
      </section>

      <section className="final-cta"><span>READY TO PREPARE WITH A SYSTEM?</span><h2>Stop stitching together disconnected resources.</h2><p>Join {course.title} and prepare every stage inside one guided program.</p><div className="actions"><button onClick={() => setPaymentNotice(true)} className="buy">Enroll at {course.price} →</button><button onClick={() => setDemoOpen(true)} className="demo">Watch Demo Lecture</button></div></section>

      {paymentNotice && <div className="modal" onClick={() => setPaymentNotice(false)}><div className="modal-card" onClick={e => e.stopPropagation()}><div className="status-icon">⚙️</div><h2>Payments temporarily unavailable</h2><p>We’re currently facing a technical issue with the payment flow. Our backend team is fixing it. Please try again shortly.</p><button onClick={() => setPaymentNotice(false)}>Got it</button></div></div>}
      {demoOpen && <div className="modal" onClick={() => setDemoOpen(false)}><div className="modal-card" onClick={e => e.stopPropagation()}><div className="video-placeholder">▶</div><h2>Demo Lecture</h2><p>The demo lecture player will appear here. Connect the final video URL when ready.</p><button onClick={() => setDemoOpen(false)}>Close</button></div></div>}

      <style>{`
        .course-page{min-height:100vh;background:linear-gradient(180deg,#fbf7f1,#f5ecdf);color:var(--ink-strong);padding-bottom:40px}.sales-hero{padding:62px 16px 44px;text-align:center;background:radial-gradient(circle at top,color-mix(in srgb,var(--accent) 13%,transparent),transparent 55%)}.back{display:inline-block;margin-bottom:18px;text-decoration:none;color:var(--muted);font-size:11px;font-weight:800}.kicker,.eyebrow{display:inline-block;color:var(--accent);font-size:9px;font-weight:900;letter-spacing:.12em}.sales-hero h1{font-family:var(--font-display);font-size:clamp(42px,7vw,76px);letter-spacing:-.06em;line-height:.95;max-width:900px;margin:12px auto}.sales-hero>p{max-width:720px;margin:0 auto;color:var(--ink-soft);font-size:14px;line-height:1.75}.price-row{display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:19px}.price-row strong{font-size:38px}.price-row span{font-size:10px;color:var(--muted)}.actions{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-top:16px}.buy,.demo{border:0;border-radius:13px;padding:13px 18px;font-size:11px;font-weight:900;cursor:pointer}.buy{background:linear-gradient(135deg,var(--accent),#c06010);color:#fff;box-shadow:0 10px 28px color-mix(in srgb,var(--accent) 22%,transparent)}.demo{background:#fff;color:var(--ink-strong);border:1px solid rgba(90,60,30,.13)}.trust{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-top:17px}.trust span{background:#fff;border:1px solid rgba(90,60,30,.1);border-radius:999px;padding:6px 9px;font-size:9px;font-weight:800}.content-grid{max-width:1050px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;padding:0 14px}.block{background:rgba(255,255,255,.82);border:1px solid rgba(90,60,30,.1);border-radius:22px;padding:22px;margin-bottom:13px}.block h2{font-family:var(--font-display);font-size:30px;letter-spacing:-.04em;margin:7px 0 14px}.feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.feature-grid div,.audience span{padding:11px;border-radius:12px;background:#faf5ed;font-size:10px;font-weight:700}.phase-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.phase-grid article{padding:14px;border-radius:14px;background:#faf5ed}.phase-grid b,.phase-grid span{display:block}.phase-grid b{font-size:11px;color:var(--accent);margin-bottom:6px}.phase-grid span{font-size:9.5px;color:var(--ink-soft);line-height:1.7}.audience{display:grid;gap:7px}.faq details{border-top:1px solid rgba(90,60,30,.1);padding:12px 0}.faq summary{font-size:11px;font-weight:900;cursor:pointer}.faq p{font-size:10px;line-height:1.6;color:var(--ink-soft);margin-top:7px}.side-card{position:sticky;top:100px;align-self:start;background:#271106;color:#fff;border-radius:22px;padding:20px;box-shadow:0 20px 50px rgba(40,15,5,.18)}.side-card>span{font-size:8px;color:#ffd58d;letter-spacing:.12em;font-weight:900}.side-card h3{font-family:var(--font-display);font-size:24px;margin:7px 0}.side-card>strong{font-size:32px}.side-card>p,.side-card small{display:block;font-size:9px;color:#e6d9ce}.side-card ul{padding-left:17px;font-size:10px;line-height:2;color:#f5ede7}.side-card button{width:100%;margin-top:8px}.final-cta{max-width:1000px;margin:24px auto 0;border-radius:25px;padding:34px 18px;text-align:center;background:linear-gradient(135deg,#241006,#4b1c08);color:#fff}.final-cta>span{font-size:8px;color:#ffd68b;font-weight:900;letter-spacing:.13em}.final-cta h2{font-family:var(--font-display);font-size:clamp(30px,5vw,48px);letter-spacing:-.05em;margin:8px auto}.final-cta p{font-size:11px;color:#eadbd0}.modal{position:fixed;inset:0;z-index:999;background:rgba(20,10,4,.72);display:grid;place-items:center;padding:18px}.modal-card{max-width:420px;width:100%;background:#fff;border-radius:22px;padding:26px;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,.28)}.status-icon,.video-placeholder{width:64px;height:64px;border-radius:18px;background:#fff2df;display:grid;place-items:center;margin:0 auto 13px;font-size:26px}.modal-card h2{font-family:var(--font-display);font-size:25px}.modal-card p{font-size:11px;line-height:1.7;color:var(--ink-soft);margin:9px 0 16px}.modal-card button{border:0;background:#271106;color:#fff;border-radius:11px;padding:11px 18px;font-size:10px;font-weight:900;cursor:pointer}@media(max-width:760px){.content-grid{grid-template-columns:1fr}.side-card{position:static}.feature-grid,.phase-grid{grid-template-columns:1fr}.sales-hero{padding-top:38px}.side-card{order:-1}}
      `}</style>
    </main>
  );
}
