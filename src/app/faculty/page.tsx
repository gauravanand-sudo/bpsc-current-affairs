import Image from "next/image";
import Link from "next/link";
import { FACULTY } from "@/lib/coachingData";

const FACULTY_GROUPS = [
  {
    tier: "Founder",
    title: "Founders",
    note: "Academic leadership, program direction and institutional teaching standards.",
  },
  {
    tier: "Senior Faculty",
    title: "Senior Faculty",
    note: "Core subject specialists, mentors, counselling and interview guidance.",
  },
  {
    tier: "Junior Faculty",
    title: "Junior Faculty",
    note: "Practice-led teaching, evaluation and focused classroom support.",
  },
] as const;

export default function FacultyPage() {
  return (
    <main className="faculty-page">
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="overline">FACULTY & ACADEMIC GUIDANCE</span>
            <h1>Specialists for every stage of your attempt.</h1>
            <p>Subject faculty, strategy mentors, academic counselling and interview guidance work as one coordinated UPSC/BPSC preparation team.</p>
            <div className="actions"><Link href="/demo" className="primary">View Demo Class</Link><Link href="/courses" className="secondary">Explore Programs</Link></div>
          </div>
          <aside><span>15-PERSON ACADEMIC TEAM</span><b>Founders → Senior Faculty → Junior Faculty</b><p>Clear academic ownership across leadership, core subjects, mentoring, evaluation and the Personality Test.</p></aside>
        </div>
      </section>

      <section className="shell section">
        <header><div><span className="overline">ACADEMIC TEAM</span><h2>Meet the complete academic team.</h2></div><p>Every profile sits within a clear seniority group with defined subject responsibility and learner-support focus.</p></header>
        <div className="team-strip" aria-label="Academic team composition">
          <span><b>2</b> Founders</span>
          <span><b>10</b> Senior faculty</span>
          <span><b>3</b> Junior faculty</span>
          <span><b>1</b> Exclusive Bihar faculty</span>
        </div>
        {FACULTY_GROUPS.map(group => {
          const members = FACULTY.filter(f => f.tier === group.tier);
          return (
            <section className="faculty-group" key={group.tier} data-tier={group.tier}>
              <div className="group-heading"><div><span>{String(members.length).padStart(2, "0")}</span><h3>{group.title}</h3></div><p>{group.note}</p></div>
              <div className="faculty-grid">
                {members.map(f => (
                  <article key={f.name} data-tier={f.tier}>
                    <div className="photo"><Image src={f.image} alt={`${f.name}, ${f.subject}`} width={360} height={450} sizes="(max-width: 520px) 80px, 72px" /></div>
                    <div className="copy"><div className="role-badge">{f.role}</div><span>{f.subject}</span><h3>{f.name}</h3><b>{f.record}</b><p>{f.focus}</p><div className="faculty-actions"><Link href="/demo">View Teaching Demo →</Link><Link href="/courses" className="outline">Programs</Link></div></div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section className="guest-wrap"><div className="shell guest"><div className="guest-mark">PT</div><div><span className="overline light">SPECIAL GUEST LECTURE</span><h2>Narayanan Sir</h2><p>Administration, Ethics and Decision-Making for UPSC/BPSC Mains and Interview, with focused classroom discussion and Personality Test guidance.</p><div className="tags"><span>Ethics</span><span>Administration</span><span>Mains</span><span>Interview</span></div></div><Link href="/courses">Explore Complete Programs →</Link></div></section>

      <section className="shell section method"><div><span className="overline">HOW FACULTY INPUT IS USED</span><h2>Teaching should improve exam output.</h2></div><div className="method-grid"><article><b>01</b><h3>Concept clarity</h3><p>Build a clean conceptual base before rushing into notes and tests.</p></article><article><b>02</b><h3>PYQ orientation</h3><p>Use previous questions to decide depth, language and recurring themes.</p></article><article><b>03</b><h3>Practice design</h3><p>Convert topics into objective practice and Mains answer-writing.</p></article><article><b>04</b><h3>Revision</h3><p>Compress class content into exam-ready recall and revision cycles.</p></article></div></section>

      <section className="shell final-cta"><div><span className="overline light">SEE THE METHOD BEFORE ENROLLING</span><h2>Take the working demo lesson.</h2><p>Use the sample Polity lesson to see how OneShot GS connects a concept to Prelims, Mains and revision.</p></div><div className="actions"><Link href="/demo" className="primary warm">Open Demo Class →</Link><Link href="/admissions" className="secondary dark">Admissions</Link></div></section>

      <style>{`
        .faculty-page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1080px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#99502f}.overline.light{color:#dfb58e}.hero{padding:61px 0 46px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d6cf}.hero-grid{display:grid;grid-template-columns:minmax(0,1.45fr) 300px;gap:48px;align-items:end}.hero h1{font-family:var(--font-display);font-size:clamp(43px,6vw,70px);line-height:.95;letter-spacing:-.06em;margin:10px 0 15px;max-width:800px}.hero p{font-size:13px;line-height:1.8;color:#596676;max-width:720px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.primary,.secondary{padding:11px 15px;border-radius:6px;text-decoration:none;font-size:10px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d1d6dc;color:#21324d}.hero aside{background:#fff;border:1px solid #d2d2ce;border-top:4px solid #9f3e1b;padding:18px}.hero aside>span{font-size:7px;letter-spacing:.14em;color:#98502e;font-weight:850}.hero aside b{display:block;font-family:var(--font-display);font-size:20px;line-height:1.15;margin:9px 0}.hero aside p{font-size:8.5px;line-height:1.6;color:#697583}.section{padding:53px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:22px}.section header h2,.method h2{font-family:var(--font-display);font-size:clamp(29px,4vw,43px);line-height:1.04;letter-spacing:-.045em;margin-top:7px}.section header>p{max-width:380px;text-align:right;font-size:10px;line-height:1.65;color:#687482}.team-strip{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d8d5cf;background:#fff;margin-bottom:32px}.team-strip span{padding:12px 14px;border-right:1px solid #e5e1da;font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:#647080}.team-strip span:last-child{border-right:0}.team-strip b{font-family:var(--font-display);font-size:19px;color:#9d4726;margin-right:5px}.faculty-group{margin-top:34px}.group-heading{display:flex;align-items:end;justify-content:space-between;gap:30px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid #d8d5cf}.group-heading>div{display:flex;align-items:center;gap:10px}.group-heading span{width:34px;height:34px;display:grid;place-items:center;background:#21324d;color:#fff;font-size:9px;font-weight:850}.group-heading h3{font-family:var(--font-display);font-size:28px;color:#172338}.group-heading p{max-width:420px;text-align:right;font-size:9px;line-height:1.6;color:#687482}.faculty-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.faculty-grid article{background:#fff;border:1px solid #d8d5cf;border-top:3px solid #243956}.faculty-grid article[data-tier="Founder"]{border-top-color:#9d4726}.faculty-grid article[data-tier="Junior Faculty"]{border-top-color:#2c7182}.photo{height:270px;overflow:hidden;background:#e9edf0}.photo img{width:100%;height:100%;object-fit:cover;object-position:center 24%;filter:none;opacity:1}.copy{padding:16px}.role-badge{display:inline-flex;padding:4px 7px;margin-bottom:8px;border-radius:99px;background:#eef1f4;color:#31455f;font-size:6.8px;letter-spacing:.09em;text-transform:uppercase;font-weight:900}.copy>span{display:block;font-size:7.5px;letter-spacing:.09em;color:#984e2d;font-weight:850}.copy h3{font-family:var(--font-display);font-size:23px;margin:6px 0}.copy>b{font-size:8.5px;color:#344961}.copy>p{font-size:9px;line-height:1.6;color:#697482;margin-top:8px;min-height:43px}.faculty-actions{display:flex;gap:6px;margin-top:14px}.faculty-actions a{flex:1;text-align:center;text-decoration:none;background:#21324d;color:#fff;padding:9px;border-radius:4px;font-size:8px;font-weight:850}.faculty-actions .outline{background:#fff;border:1px solid #d1d6dc;color:#21324d}.guest-wrap{background:#172338;color:#fff}.guest{padding:33px 0;display:grid;grid-template-columns:70px 1fr auto;gap:20px;align-items:center}.guest-mark{width:70px;height:70px;border:1px solid rgba(255,255,255,.25);display:grid;place-items:center;font-family:Georgia,serif;color:#e3b88e;font-size:20px}.guest h2{font-family:var(--font-display);font-size:29px;margin:5px 0}.guest p{font-size:9.5px;line-height:1.65;color:#cbd4df;max-width:680px}.tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:9px}.tags span{font-size:7.5px;border:1px solid rgba(255,255,255,.14);padding:5px 7px;color:#d7dfe8}.guest>a{text-decoration:none;background:#f1ece5;color:#26364f;padding:10px 12px;font-size:8.5px;font-weight:850}.method{display:grid;grid-template-columns:.7fr 1.3fr;gap:35px;align-items:start}.method-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.method-grid article{background:#fff;border:1px solid #d9d6d0;padding:15px}.method-grid b{font-family:Georgia,serif;color:#a34a27;font-size:18px}.method-grid h3{font-family:var(--font-display);font-size:16px;margin:7px 0 4px}.method-grid p{font-size:8.5px;line-height:1.6;color:#687482}.final-cta{margin-bottom:42px;padding:28px;background:#26364f;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:28px}.final-cta h2{font-family:var(--font-display);font-size:clamp(28px,4vw,41px);line-height:1.03;letter-spacing:-.04em;margin:6px 0}.final-cta p{font-size:9.5px;color:#c7d1dd;max-width:650px}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.24)}@media(max-width:800px){.hero-grid{grid-template-columns:1fr;gap:24px}.faculty-grid{grid-template-columns:1fr 1fr}.team-strip{grid-template-columns:1fr 1fr}.team-strip span:nth-child(2){border-right:0}.team-strip span:nth-child(-n+2){border-bottom:1px solid #e5e1da}.group-heading{align-items:flex-start;flex-direction:column;gap:7px}.group-heading p{text-align:left}.section header{flex-direction:column;align-items:flex-start;gap:8px}.section header>p{text-align:left}.guest{grid-template-columns:60px 1fr}.guest>a{grid-column:2}.method{grid-template-columns:1fr}.final-cta{flex-direction:column;align-items:flex-start}}@media(max-width:520px){.faculty-grid,.method-grid,.team-strip{grid-template-columns:1fr}.team-strip span{border-right:0;border-bottom:1px solid #e5e1da}.team-strip span:last-child{border-bottom:0}.hero{padding:43px 0 32px}.guest{grid-template-columns:1fr}.guest>a{grid-column:1}.final-cta{width:calc(100% - 24px)}}
        .faculty-grid{grid-template-columns:repeat(4,1fr);gap:7px;align-items:start}.faculty-grid article{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:start;min-height:0}.photo{width:72px;height:auto;aspect-ratio:3/5;margin:8px 0 8px 8px;overflow:hidden;background:#eef1f3}.photo img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:#eef1f3}.copy{min-width:0;padding:8px}.role-badge{padding:3px 5px;margin-bottom:5px;font-size:5.6px}.copy>span{font-size:6.4px}.copy h3{font-size:16px;line-height:1.05;margin:4px 0}.copy>b{display:block;font-size:7px;line-height:1.35}.copy>p{font-size:7.4px;line-height:1.4;margin-top:5px;min-height:31px}.faculty-actions{gap:3px;margin-top:7px}.faculty-actions a{padding:6px 3px;font-size:6.2px;line-height:1.25}
        @media(max-width:980px){.faculty-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:800px){.faculty-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:520px){.faculty-grid{grid-template-columns:1fr}.faculty-grid article{grid-template-columns:80px minmax(0,1fr)}.photo{width:80px;margin:8px 0 8px 8px}.copy>p{min-height:0}}
      `}</style>
    </main>
  );
}
