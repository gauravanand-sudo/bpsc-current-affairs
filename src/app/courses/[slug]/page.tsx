"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type Course = {
  exam: string;
  title: string;
  price: string;
  cycle: string;
  summary: string;
  audience: string[];
  includes: string[];
  phases: { title: string; subtitle: string; items: string[] }[];
};

const COURSES: Record<string, Course> = {
  "upsc-2027": {
    exam: "UPSC CSE 2027", title: "UPSC 2027 Complete Program", price: "₹56,000", cycle: "Prelims · Mains · Interview",
    summary: "A complete 2027 preparation pathway connecting GS foundation, CSAT, Current Affairs, Prelims testing, Mains answer-writing and Personality Test guidance under one academic plan.",
    audience: ["First serious UPSC attempt", "Working aspirants who need a fixed structure", "Repeat aspirants rebuilding their preparation system"],
    includes: ["GS foundation and advanced coverage", "CSAT preparation", "Current Affairs integration", "Prelims PYQs and test series", "Mains GS answer-writing", "Essay and Ethics practice", "Evaluated copies and feedback", "Revision planning and mentoring", "Interview / Personality Test guidance"],
    phases: [
      { title: "Foundation", subtitle: "Build the syllabus correctly", items: ["NCERT and core GS", "Current Affairs integration", "CSAT fundamentals"] },
      { title: "Prelims", subtitle: "Convert knowledge into selection", items: ["Sectional and full tests", "PYQ-led preparation", "High-frequency revision"] },
      { title: "Mains", subtitle: "Learn to write for marks", items: ["GS answer-writing", "Essay and Ethics", "Evaluation and improvement loops"] },
      { title: "Interview", subtitle: "Move from content to judgement", items: ["DAF-oriented guidance", "Issue framing", "Mock interview preparation"] },
    ],
  },
  "upsc-2028": {
    exam: "UPSC CSE 2028", title: "UPSC 2028 Complete Program", price: "₹56,000", cycle: "Prelims · Mains · Interview",
    summary: "A long-run UPSC pathway designed to use the extra preparation window for stronger concepts, early writing practice, repeated revision cycles and stage-wise testing.",
    audience: ["College students", "Early starters", "Aspirants who want multiple revision cycles before 2028"],
    includes: ["NCERT-to-advanced GS roadmap", "CSAT from foundation", "Current Affairs system", "Progressive Prelims MCQs", "Early Mains answer-writing", "Essay and Ethics", "Mentored revision cycles", "Full test series", "Interview guidance"],
    phases: [
      { title: "Foundation", subtitle: "Create durable concepts", items: ["NCERT mastery", "Core GS subjects", "Current Affairs discipline"] },
      { title: "Skill Building", subtitle: "Develop exam skills early", items: ["CSAT practice", "Answer-writing basics", "Essay and Ethics foundation"] },
      { title: "Exam Mode", subtitle: "Test, analyse and revise", items: ["Prelims tests and PYQs", "Mains evaluated tests", "Multiple revision cycles"] },
      { title: "Interview", subtitle: "Prepare the final stage", items: ["DAF preparation", "Mock interviews", "Final mentoring"] },
    ],
  },
  "bpsc-72": {
    exam: "72nd BPSC", title: "72nd BPSC Complete Program", price: "₹29,000", cycle: "Prelims · Mains · Interview",
    summary: "A Bihar-first preparation program covering Static GS, Bihar Special, Current Affairs, PYQs, Prelims testing, Mains answer-writing and Interview guidance in one connected plan.",
    audience: ["72nd BPSC focused aspirants", "Working candidates", "Repeat BPSC candidates seeking a more systematic attempt"],
    includes: ["Complete Prelims GS", "Bihar Special", "Current Affairs", "PYQ-led preparation", "Prelims test series", "Mains answer-writing", "Evaluated Mains practice", "Bihar issue enrichment", "Interview guidance"],
    phases: [
      { title: "Prelims Core", subtitle: "Build Bihar-first coverage", items: ["Static GS and Bihar Special", "Current Affairs revision", "PYQs and full mocks"] },
      { title: "Mains Writing", subtitle: "Turn knowledge into answers", items: ["Structured answer-writing", "Bihar-focused enrichment", "Evaluation and feedback"] },
      { title: "Revision", subtitle: "Consolidate before the exam", items: ["Short notes", "High-yield test cycles", "Weak-area correction"] },
      { title: "Interview", subtitle: "Prepare for final selection", items: ["Bihar issues", "Profile-based questions", "Mock interview guidance"] },
    ],
  },
  "bpsc-73": {
    exam: "73rd BPSC", title: "73rd BPSC Complete Program", price: "₹29,000", cycle: "Prelims · Mains · Interview",
    summary: "A longer BPSC preparation runway for building fundamentals, Bihar GS, systematic MCQ practice, early Mains writing, revision cycles and Interview preparation.",
    audience: ["Early 73rd BPSC starters", "Graduates building fundamentals", "Aspirants balancing preparation with job or college"],
    includes: ["Foundation GS", "Bihar static and current", "Prelims MCQ program", "PYQ analysis", "Mains writing program", "Evaluation and mentoring", "Revision cycles", "Full mocks", "Interview guidance"],
    phases: [
      { title: "Foundation", subtitle: "Build the core syllabus", items: ["Core GS", "Bihar Special", "Current Affairs"] },
      { title: "Practice", subtitle: "Develop exam readiness", items: ["Topic-wise MCQs", "PYQs", "Mains answer-writing"] },
      { title: "Exam Cycle", subtitle: "Test and refine", items: ["Full tests", "Revision sprints", "Performance analysis"] },
      { title: "Interview", subtitle: "Prepare the final stage", items: ["Bihar issues", "Personality guidance", "Mock interview support"] },
    ],
  },
};

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const course = COURSES[params.slug];
  const [paymentNotice, setPaymentNotice] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  if (!course) return <main style={{ padding: 40, textAlign: "center" }}><h1>Program not found</h1><Link href="/#programs">View all programs</Link></main>;

  return (
    <main className="course-page">
      <section className="course-hero">
        <div className="shell hero-grid">
          <div>
            <Link href="/#programs" className="back">← All Programs</Link>
            <span className="overline">ONESHOT GS · COMPLETE PROGRAM</span>
            <h1>{course.title}</h1>
            <p className="summary">{course.summary}</p>
            <div className="actions"><button onClick={() => setPaymentNotice(true)} className="primary">Enroll in Program →</button><button onClick={() => setDemoOpen(true)} className="secondary">View Demo Lecture</button><Link href="/study" className="text-link">Explore Free Study</Link></div>
          </div>
          <aside className="fee-card">
            <span>PROGRAM FEE</span><strong>{course.price}</strong><p>{course.cycle}</p>
            <dl><div><dt>Program</dt><dd>{course.exam}</dd></div><div><dt>Coverage</dt><dd>Complete cycle</dd></div><div><dt>Demo</dt><dd>Available before purchase</dd></div></dl>
            <button onClick={() => setPaymentNotice(true)}>Proceed to Enrollment →</button><button onClick={() => setDemoOpen(true)} className="demo-button">View Demo Lecture</button>
          </aside>
        </div>
      </section>

      <nav className="course-subnav"><div className="shell"><a href="#overview">Overview</a><a href="#coverage">Coverage</a><a href="#roadmap">Roadmap</a><a href="#fit">Who it is for</a><a href="#faq">FAQ</a></div></nav>

      <section id="overview" className="shell overview section-block">
        <div><span className="overline">ACADEMIC APPROACH</span><h2>One program, one preparation sequence.</h2><p>The course is designed around progression rather than disconnected content. Foundation feeds into Prelims practice, Prelims concepts feed into Mains writing, and the same preparation is refined for the Interview stage.</p></div>
        <div className="stage-strip"><span><b>01</b>Learn</span><span><b>02</b>Practice</span><span><b>03</b>Write</span><span><b>04</b>Revise</span><span><b>05</b>Interview</span></div>
      </section>

      <section id="coverage" className="shell section-block">
        <header><span className="overline">PROGRAM COVERAGE</span><h2>What is included in the fee.</h2><p>The program combines content coverage, practice, evaluation and mentoring across the complete examination cycle.</p></header>
        <div className="coverage-grid">{course.includes.map((item, i) => <article key={item}><span>{String(i + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>
      </section>

      <section id="roadmap" className="roadmap-wrap"><div className="shell"><header><span className="overline light">PROGRAM ROADMAP</span><h2>Preparation organised by stage.</h2></header><div className="phase-grid">{course.phases.map((phase, i) => <article key={phase.title}><span className="phase-no">0{i + 1}</span><h3>{phase.title}</h3><b>{phase.subtitle}</b><ul>{phase.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div></div></section>

      <section id="fit" className="shell section-block fit-grid">
        <div><span className="overline">WHO THIS PROGRAM IS FOR</span><h2>A structured pathway for a serious attempt.</h2><p>The course works best for aspirants who want a planned preparation sequence rather than assembling separate resources for every stage.</p></div>
        <div className="audience">{course.audience.map(item => <div key={item}><span>✓</span><p>{item}</p></div>)}</div>
      </section>

      <section className="shell demo-section"><div><span className="overline light">SEE THE TEACHING FIRST</span><h2>View a demo lecture before you decide.</h2><p>Use the demo to understand teaching style, class structure and academic depth before enrollment.</p></div><button onClick={() => setDemoOpen(true)}>View Demo Lecture →</button></section>

      <section id="faq" className="shell section-block faq"><header><span className="overline">ADMISSIONS FAQ</span><h2>Questions before enrollment.</h2></header><details open><summary>Does the fee cover Prelims, Mains and Interview?</summary><p>Yes. This is presented as a complete program covering preparation for all three stages within one fee.</p></details><details><summary>Are tests and answer-writing included?</summary><p>Yes. The program includes stage-appropriate objective practice, PYQs, test cycles and Mains answer-writing with evaluation as listed above.</p></details><details><summary>Can I use the free resources without enrolling?</summary><p>Yes. Free Study, Free Quiz and the open practice layer remain available separately.</p></details><details><summary>Can I see a class before purchase?</summary><p>Yes. Use the View Demo Lecture button on this page.</p></details></section>

      <section className="shell final-cta"><div><span className="overline light">{course.exam}</span><h2>Prepare the complete examination cycle inside one academic plan.</h2><p>{course.price} · {course.cycle}</p></div><div className="actions"><button onClick={() => setPaymentNotice(true)} className="primary warm">Enroll Now →</button><button onClick={() => setDemoOpen(true)} className="secondary dark">View Demo</button></div></section>

      {paymentNotice && <div className="modal" onClick={() => setPaymentNotice(false)}><div className="modal-card" onClick={e => e.stopPropagation()}><span className="modal-mark">STATUS</span><h2>Payments temporarily unavailable</h2><p>We’re currently facing a technical issue with the payment flow. Our backend team is fixing it. Please try again shortly.</p><button onClick={() => setPaymentNotice(false)}>Close</button></div></div>}
      {demoOpen && <div className="modal" onClick={() => setDemoOpen(false)}><div className="modal-card" onClick={e => e.stopPropagation()}><span className="modal-mark">DEMO LECTURE</span><div className="video-placeholder">▶</div><h2>Program Demo Lecture</h2><p>The demo lecture player will appear here once the final video is connected.</p><button onClick={() => setDemoOpen(false)}>Close</button></div></div>}

      <style>{`
        .course-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1080px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#99502e}.overline.light{color:#dfb58e}.course-hero{padding:58px 0 44px;background:linear-gradient(180deg,#fdfcf9,#f0ede7);border-bottom:1px solid #d8d5ce}.hero-grid{display:grid;grid-template-columns:minmax(0,1.35fr) 320px;gap:48px;align-items:end}.back{display:block;width:max-content;margin-bottom:24px;color:#707b88;font-size:9px;font-weight:750;text-decoration:none}.course-hero h1{font-family:var(--font-display);font-size:clamp(42px,6vw,68px);line-height:.95;letter-spacing:-.058em;margin:10px 0 15px}.summary{max-width:720px;font-size:14px;line-height:1.8;color:#576474}.actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:22px}.primary,.secondary{border:0;border-radius:6px;padding:11px 15px;font-size:10.5px;font-weight:800;cursor:pointer}.primary{background:#21324d;color:#fff}.secondary{background:#fff;color:#21324d;border:1px solid #d0d5dc}.text-link{font-size:9.5px;font-weight:800;color:#90401f;text-decoration:none;padding:9px}.fee-card{background:#fff;border:1px solid #cfd2d4;border-top:4px solid #9f3e1b;padding:19px}.fee-card>span{font-size:7.5px;letter-spacing:.15em;color:#98502e;font-weight:850}.fee-card>strong{display:block;font-family:var(--font-display);font-size:35px;margin:5px 0 0}.fee-card>p{font-size:9px;color:#697481;border-bottom:1px solid #e1dfda;padding-bottom:12px}.fee-card dl{margin:8px 0 12px}.fee-card dl>div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid #eeeae4}.fee-card dt{font-size:8px;color:#7d8793}.fee-card dd{font-size:8px;font-weight:750;text-align:right}.fee-card button{width:100%;border:0;padding:10px;border-radius:5px;background:#21324d;color:white;font-size:9px;font-weight:850;margin-top:7px}.fee-card .demo-button{background:white;color:#21324d;border:1px solid #d2d7de}.course-subnav{position:sticky;top:86px;z-index:60;background:rgba(250,249,246,.97);border-bottom:1px solid #dbd9d3}.course-subnav>div{display:flex;gap:22px;overflow:auto}.course-subnav a{text-decoration:none;color:#657181;font-size:8.5px;font-weight:750;padding:11px 0;white-space:nowrap}.section-block{padding:50px 0}.section-block h2,.roadmap-wrap h2,.demo-section h2{font-family:var(--font-display);font-size:clamp(27px,4vw,40px);line-height:1.05;letter-spacing:-.045em;margin:7px 0}.overview{display:grid;grid-template-columns:1fr 430px;gap:45px;align-items:center}.overview>div:first-child>p,.section-block header>p,.fit-grid>div>p{font-size:11px;line-height:1.7;color:#697481;max-width:720px}.stage-strip{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid #d9d7d1}.stage-strip span{padding:12px 5px;text-align:center;font-size:8px;border-right:1px solid #d9d7d1}.stage-strip span:last-child{border:0}.stage-strip b{display:block;font-family:Georgia,serif;font-size:15px;color:#9b5b38;margin-bottom:4px}.section-block header{margin-bottom:20px}.coverage-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.coverage-grid article{background:#fff;border:1px solid #d9d7d1;padding:14px;display:flex;gap:11px;align-items:start}.coverage-grid article>span{font-family:Georgia,serif;color:#9b5b38;font-size:14px}.coverage-grid p{font-size:9.5px;line-height:1.55;color:#46566b;font-weight:650}.roadmap-wrap{padding:50px 0;background:#172338;color:#fff}.roadmap-wrap header{margin-bottom:21px}.phase-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(255,255,255,.13)}.phase-grid article{padding:20px;border-right:1px solid rgba(255,255,255,.13)}.phase-grid article:last-child{border:0}.phase-no{font-family:Georgia,serif;color:#d8a777;font-size:20px}.phase-grid h3{font-family:var(--font-display);font-size:18px;margin:12px 0 3px}.phase-grid b{display:block;font-size:8px;color:#d3dbe5;margin-bottom:12px}.phase-grid ul{list-style:none;padding:0;display:grid;gap:7px}.phase-grid li{font-size:9px;line-height:1.55;color:#bec9d6}.phase-grid li:before{content:"— ";color:#d8a777}.fit-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}.audience{display:grid;gap:7px}.audience>div{background:#fff;border:1px solid #dad7d0;padding:12px;display:flex;gap:10px}.audience span{color:#9c4a28;font-weight:900}.audience p{font-size:9.5px;font-weight:650}.demo-section{padding:28px;background:#273850;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:30px}.demo-section p{font-size:10px;line-height:1.6;color:#cbd4df}.demo-section button{border:0;background:#f3eee7;color:#273850;padding:10px 15px;border-radius:5px;font-size:9px;font-weight:850;white-space:nowrap}.faq details{border-top:1px solid #d8d6d0;padding:14px 0}.faq details:last-child{border-bottom:1px solid #d8d6d0}.faq summary{font-size:10.5px;font-weight:800;cursor:pointer}.faq details p{font-size:9.5px;line-height:1.7;color:#667281;margin-top:8px}.final-cta{margin-bottom:42px;padding:27px;background:#172338;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:30px}.final-cta h2{font-family:var(--font-display);font-size:clamp(25px,3.6vw,38px);max-width:720px;line-height:1.03;margin-top:6px}.final-cta p{font-size:9px;color:#c5cfdb;margin-top:7px}.final-cta .actions{margin:0;justify-content:flex-end}.primary.warm{background:#9f3e1b}.secondary.dark{background:transparent;color:white;border-color:rgba(255,255,255,.24)}.modal{position:fixed;inset:0;z-index:999;background:rgba(18,27,41,.72);display:grid;place-items:center;padding:18px}.modal-card{max-width:420px;width:100%;background:#fff;border-radius:8px;padding:25px;border-top:4px solid #9f3e1b;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,.25)}.modal-mark{font-size:7.5px;letter-spacing:.16em;font-weight:850;color:#99502e}.modal-card h2{font-family:var(--font-display);font-size:25px;margin:8px 0}.modal-card p{font-size:10px;line-height:1.7;color:#647080;margin:0 0 15px}.modal-card button{border:0;background:#21324d;color:#fff;border-radius:5px;padding:10px 15px;font-size:9px;font-weight:850}.video-placeholder{width:70px;height:50px;background:#eef1f5;border:1px solid #d5dae1;display:grid;place-items:center;margin:12px auto 4px;color:#31445f}
        @media(max-width:800px){.hero-grid,.overview,.fit-grid{grid-template-columns:1fr;gap:25px}.fee-card{max-width:500px}.coverage-grid{grid-template-columns:1fr 1fr}.phase-grid{grid-template-columns:1fr 1fr}.phase-grid article:nth-child(2){border-right:0}.phase-grid article{border-bottom:1px solid rgba(255,255,255,.13)}.demo-section,.final-cta{align-items:flex-start;flex-direction:column}.final-cta .actions{justify-content:flex-start}.course-subnav{top:77px}}
        @media(max-width:480px){.shell{width:min(100% - 24px,1080px)}.course-hero{padding:40px 0 30px}.course-hero h1{font-size:43px}.coverage-grid,.phase-grid{grid-template-columns:1fr}.phase-grid article{border-right:0}.stage-strip{grid-template-columns:repeat(5,90px);overflow:auto}.course-subnav>div{gap:17px}}
      `}</style>
    </main>
  );
}
