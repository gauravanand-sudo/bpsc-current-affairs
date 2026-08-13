import Link from "next/link";

const TOPICS = [
  ["Ancient History", "Chronology, dynasties, religion, literature and key sites"],
  ["Medieval History", "Sultanate, Mughals, Bhakti-Sufi traditions and administration"],
  ["Modern History", "Company rule, reform movements, nationalism and freedom struggle"],
  ["Indian Geography", "Physiography, rivers, climate, soils, agriculture and resources"],
  ["World Geography", "Continents, oceans, physical features, climate and mapping"],
  ["Indian Polity", "Constitution, rights, institutions, Parliament, judiciary and federalism"],
  ["Indian Economy", "Basic terms, banking, inflation, budget, agriculture and development"],
  ["Physics", "Units, motion, energy, heat, light, sound and electricity basics"],
  ["Chemistry", "Matter, elements, compounds, acids-bases, metals and everyday chemistry"],
  ["Biology", "Cells, human systems, disease, nutrition, genetics and ecology"],
  ["Environment", "Ecology, biodiversity, climate, pollution and conservation"],
  ["Computer & Tech", "Digital basics, internet, cyber concepts and common technology terms"],
  ["Art & Culture", "Architecture, dance, music, painting, religion and heritage"],
  ["Sports & Awards", "High-frequency factual revision where relevant to the exam cycle"],
  ["Miscellaneous GK", "Institutions, symbols, important places and recurring factual themes"],
];

const RULES = [
  ["01", "Use for revision", "Treat factual GK as a compact revision layer, not the foundation of the entire syllabus."],
  ["02", "Prioritise PYQ themes", "Revise facts that previous UPSC/BPSC papers have shown to be testable."],
  ["03", "Practise retrieval", "Close the source and answer Static GS questions before rereading."],
  ["04", "Maintain an error list", "Keep only facts you repeatedly miss; do not build another giant notebook."],
];

export default function LucentGKPage() {
  return (
    <main className="page">
      <section className="hero"><div className="shell"><Link href="/study" className="back">← Free Study</Link><span className="overline">RAPID GK REVISION</span><h1>Lucent GK Revision Desk</h1><p>This page is a topic map for fast factual revision. It does not reproduce copyrighted book content; instead, every topic leads into working Static GS practice, official PYQs or the tutor desk.</p><div className="actions"><a href="#topics" className="primary">Open Revision Map</a><Link href="/quizzes/static" className="secondary">Static GS Quiz</Link><Link href="/pyq" className="text-link">Official PYQs →</Link></div></div></section>

      <section id="topics" className="shell section"><header><div><span className="overline">15 REVISION BLOCKS</span><h2>Use factual GK as a compact second pass.</h2></div><p>Pick a block, revise briefly, then answer questions. The goal is retrieval, not passive rereading.</p></header><div className="topic-grid">{TOPICS.map(([title,copy],i) => <article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p><div><Link href="/quizzes/static">Practice →</Link><Link href="/pyq" className="outline">PYQs</Link></div></article>)}</div></section>

      <section className="rules-wrap"><div className="shell section"><header className="light"><div><span className="overline light-text">HOW TO USE A RAPID GK SOURCE</span><h2>Keep it subordinate to the exam.</h2></div><p>Previous papers and your error log decide what deserves repetition.</p></header><div className="rules-grid">{RULES.map(([n,title,copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="shell bridge"><div><span className="overline">BUILD A BETTER REVISION STACK</span><h2>Foundation first. Rapid revision second.</h2><p>Use NCERT for conceptual base, current affairs for live issues, PYQs for exam depth and rapid GK only for compression and recall.</p></div><div className="bridge-links"><Link href="/ncert">NCERT Foundation</Link><Link href="/ca/lectures">Current Affairs</Link><Link href="/pyq">PYQ Library</Link><Link href="/ask">Ask Tutor</Link></div></section>

      <section className="shell final"><div><span className="overline light-text">NEED A COMPLETE REVISION PLAN?</span><h2>Complete UPSC/BPSC programs sequence foundation, practice, writing and revision across the whole attempt.</h2></div><div className="actions"><Link href="/courses" className="primary warm">View Programs →</Link><Link href="/demo" className="secondary dark">Demo Class</Link></div></section>

      <style>{`
        .page{min-height:100vh;background:#f7f5f0;color:#172338}.shell{width:min(1080px,calc(100% - 32px));margin:0 auto}.overline{font-size:8px;letter-spacing:.16em;font-weight:850;color:#99502f}.light-text{color:#e0b58e}.hero{padding:52px 0 40px;background:linear-gradient(180deg,#fdfcf9,#efebe4);border-bottom:1px solid #d9d5ce}.back{display:block;width:max-content;text-decoration:none;color:#6e7986;font-size:8px;font-weight:800;margin-bottom:17px}.hero h1{font-family:var(--font-display);font-size:clamp(43px,7vw,70px);line-height:.94;letter-spacing:-.06em;margin:8px 0 12px}.hero p{font-size:12px;line-height:1.75;color:#596676;max-width:760px}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:18px}.primary,.secondary{padding:10px 14px;border-radius:6px;text-decoration:none;font-size:9px;font-weight:850}.primary{background:#21324d;color:#fff}.secondary{background:#fff;border:1px solid #d0d6dd;color:#21324d}.text-link{text-decoration:none;color:#91401f;font-size:9px;font-weight:850;padding:9px}.section{padding:49px 0}.section header{display:flex;justify-content:space-between;align-items:end;gap:26px;margin-bottom:20px}.section header h2,.bridge h2{font-family:var(--font-display);font-size:clamp(28px,4vw,41px);line-height:1.04;letter-spacing:-.045em;margin-top:7px}.section header>p{max-width:390px;text-align:right;font-size:9.5px;line-height:1.65;color:#687482}.topic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.topic-grid article{background:#fff;border:1px solid #d9d6d0;padding:14px;display:flex;flex-direction:column;min-height:175px}.topic-grid article>span{font-family:Georgia,serif;color:#7457a8;font-size:15px}.topic-grid h3{font-family:var(--font-display);font-size:16px;margin:7px 0 4px}.topic-grid p{font-size:8px;line-height:1.55;color:#687482;flex:1}.topic-grid article>div{display:flex;gap:5px;margin-top:10px}.topic-grid a{flex:1;text-align:center;text-decoration:none;background:#21324d;color:#fff;padding:8px 5px;border-radius:4px;font-size:7.2px;font-weight:850}.topic-grid .outline{background:#fff;color:#21324d;border:1px solid #d1d6dc}.rules-wrap{background:#172338;color:#fff}.light>p{color:#c6d0dc!important}.rules-grid{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(255,255,255,.13)}.rules-grid article{padding:17px;border-right:1px solid rgba(255,255,255,.12)}.rules-grid article:last-child{border-right:0}.rules-grid span{font-family:Georgia,serif;color:#d8a776;font-size:18px}.rules-grid h3{font-family:var(--font-display);font-size:15px;margin:9px 0 4px}.rules-grid p{font-size:8px;line-height:1.6;color:#c5d0dc}.bridge{padding:47px 0;display:grid;grid-template-columns:.8fr 1.2fr;gap:32px;align-items:center}.bridge>div>p{font-size:9.5px;line-height:1.65;color:#687482;margin-top:7px}.bridge-links{display:grid;grid-template-columns:1fr 1fr;gap:7px}.bridge-links a{text-align:center;text-decoration:none;background:#fff;border:1px solid #d9d6d0;color:#21324d;padding:12px 8px;font-size:8.3px;font-weight:850}.final{margin-bottom:40px;padding:25px;background:#26364f;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:24px}.final h2{font-family:var(--font-display);font-size:clamp(26px,4vw,38px);line-height:1.04;letter-spacing:-.04em;margin-top:6px;max-width:700px}.primary.warm{background:#a34821}.secondary.dark{background:transparent;color:#fff;border-color:rgba(255,255,255,.24)}@media(max-width:780px){.topic-grid{grid-template-columns:1fr 1fr}.section header{flex-direction:column;align-items:flex-start;gap:7px}.section header>p{text-align:left}.bridge{grid-template-columns:1fr}.final{flex-direction:column;align-items:flex-start}}@media(max-width:500px){.topic-grid,.rules-grid,.bridge-links{grid-template-columns:1fr}.hero{padding:39px 0 30px}.final{width:calc(100% - 24px)}}
      `}</style>
    </main>
  );
}
