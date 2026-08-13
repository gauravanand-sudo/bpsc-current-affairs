import Link from "next/link";

const SUBJECTS = [
  ["Polity & Governance", "Constitution, institutions, rights, Parliament, judiciary and governance", "/quizzes/static"],
  ["Economy", "Growth, inflation, banking, fiscal policy, agriculture and external sector", "/ca/lectures"],
  ["Geography", "Physical geography, India, resources, mapping and human geography", "/ncert"],
  ["History & Culture", "Ancient, medieval, modern India and art & culture", "/quizzes/static"],
  ["Environment & Ecology", "Ecology, biodiversity, climate, protected areas and environmental governance", "/ca/lectures"],
  ["Science & Technology", "General science, space, health, biotech, digital and emerging technology", "/quizzes/static"],
  ["International Relations", "Neighbourhood, groupings, bilateral relations and global institutions", "/ca/lectures"],
  ["Social Issues", "Society, welfare, education, health, vulnerable groups and social change", "/ca/lectures"],
  ["Bihar Special", "Bihar history, geography, economy, polity, schemes and current issues", "/bihar-gs"],
];

const LOOP = [
  ["01", "Revise the theme", "Use compact notes or your own short notes to refresh the core concept."],
  ["02", "Open PYQs", "See how UPSC/BPSC framed the same theme in previous papers."],
  ["03", "Practise", "Move to Static GS or Current Affairs quizzes without notes."],
  ["04", "Fix the gap", "Return only to the exact concept that produced the mistake."],
];

export default function GhatnachakraPage() {
  return (
    <main className="page">
      <section className="hero"><div className="shell"><Link href="/study" className="back">← Free Study</Link><span className="overline">GS REVISION DESK</span><h1>GS Ghatnachakra</h1><p>Use this page as a subject-wise revision map. Instead of showing empty lecture buttons, every subject now takes you to a working study, current-affairs or practice route.</p><div className="actions"><a href="#subjects" className="primary">Open Subject Map</a><Link href="/pyq" className="secondary">Official PYQs</Link><Link href="/ask" className="text-link">Ask Tutor →</Link></div></div></section>

      <section id="subjects" className="shell section"><header><div><span className="overline">SUBJECT MAP</span><h2>Revise by syllabus block.</h2></div><p>Pick one subject, refresh the theme, then move directly into questions or source-backed current affairs.</p></header><div className="subject-grid">{SUBJECTS.map(([title,copy,href],i) => <article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p><div><Link href={href}>Study / Practise →</Link><Link href="/pyq" className="outline">PYQs</Link></div></article>)}</div></section>

      <section className="loop-wrap"><div className="shell section"><header className="light"><div><span className="overline light-text">REVISION LOOP</span><h2>Revision should end in a question.</h2></div><p>Use the same four-step loop across all nine subject blocks.</p></header><div className="loop-grid">{LOOP.map(([n,title,copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="shell bridge"><div><span className="overline">KEEP THE LOOP CONNECTED</span><h2>Study → PYQ → Quiz → correction.</h2><p>Use Free Study for concepts, the official PYQ library for exam depth, and Free Quiz for active recall.</p></div><div className="bridge-links"><Link href="/study">Free Study</Link><Link href="/pyq">PYQ Library</Link><Link href="/quizzes">Free Quiz</Link><Link href="/demo">Demo Class</Link></div></section>

      <section className="shell final"><div><span className="overline light-text">NEED A TIMETABLED GS PLAN?</span><h2>Complete programs add sequencing, tests, evaluation and mentoring around the same subjects.</h2></div><div className="actions"><Link href="/courses" className="primary warm">View Programs →</Link><Link href="/admissions" className="secondary dark">Admissions</Link></div></section>

      <style>{`
        .page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1050px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#99502f}.light-text{color:#e0b58e}.hero{padding:52px 0 41px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.back{display:block;width:max-content;text-decoration:none;color:#6e7986;font-size:8px;font-weight:800;margin-bottom:17px}.hero h1{font-family:var(--font-display);font-size:clamp(44px,7vw,72px);line-height:.94;letter-spacing:-.06em;margin:8px 0 12px}.hero p{font-size:12px;line-height:1.75;color:#596676;max-width:720px}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:18px}.primary,.secondary{padding:10px 14px;border-radius:6px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d0d6dd;color:#21324d}.text-link{text-decoration:none;color:#91401f;font-size:9px;font-weight:850;padding:9px}.section{padding:49px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:26px;margin-bottom:20px}.section header h2,.bridge h2{font-family:var(--font-display);font-size:clamp(28px,4vw,41px);line-height:1.04;letter-spacing:-.045em;margin-top:7px}.section header>p{max-width:380px;text-align:right;font-size:9.5px;line-height:1.65;color:#687482}.subject-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.subject-grid article{background:#fff;border:1px solid #d9d6d0;padding:15px;display:flex;flex-direction:column;min-height:200px}.subject-grid article>span{font-family:Georgia,serif;color:#5e5bb2;font-size:16px}.subject-grid h3{font-family:var(--font-display);font-size:17px;margin:7px 0 5px}.subject-grid p{font-size:8.3px;line-height:1.58;color:#687482;flex:1}.subject-grid article>div{display:flex;gap:5px;margin-top:11px}.subject-grid a{flex:1;text-align:center;text-decoration:none;background:#21324d;color:#fff;padding:8px 5px;border-radius:4px;font-size:7.3px;font-weight:850}.subject-grid .outline{background:#fff;color:#21324d;border:1px solid #d1d6dc}.loop-wrap{background:#172338;color:#fff}.light>p{color:#c6d0dc!important}.loop-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(255,255,255,.13)}.loop-grid article{padding:17px;border-right:1px solid rgba(255,255,255,.12)}.loop-grid article:last-child{border-right:0}.loop-grid span{font-family:Georgia,serif;color:#d8a776;font-size:18px}.loop-grid h3{font-family:var(--font-display);font-size:15px;margin:9px 0 4px}.loop-grid p{font-size:8px;line-height:1.6;color:#c5d0dc}.bridge{padding:47px 0;display:grid;grid-template-columns:.8fr 1.2fr;gap:32px;align-items:center}.bridge>div>p{font-size:9.5px;line-height:1.65;color:#687482;margin-top:7px}.bridge-links{display:grid;grid-template-columns:1fr 1fr;gap:7px}.bridge-links a{text-align:center;text-decoration:none;background:#fff;border:1px solid #d9d6d0;color:#21324d;padding:12px 8px;font-size:8.3px;font-weight:850}.final{margin-bottom:40px;padding:25px;background:#26364f;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:24px}.final h2{font-family:var(--font-display);font-size:clamp(26px,4vw,38px);line-height:1.04;letter-spacing:-.04em;margin-top:6px;max-width:700px}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.24)}@media(max-width:780px){.subject-grid{grid-template-columns:1fr 1fr}.section header{flex-direction:column;align-items:flex-start;gap:7px}.section header>p{text-align:left}.bridge{grid-template-columns:1fr}.final{flex-direction:column;align-items:flex-start}}@media(max-width:500px){.subject-grid,.loop-grid,.bridge-links{grid-template-columns:1fr}.hero{padding:39px 0 30px}.final{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
