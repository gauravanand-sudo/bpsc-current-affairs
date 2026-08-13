import Link from "next/link";
import { notFound } from "next/navigation";

const PAPERS: Record<number, { gs1: string; gs2: string; source: "UPSC" | "Archive mirror" }> = {
  2026: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP_CSP_2026_GENERAL_STUDIES_PAPER-I_25052026.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP_CSP_2026_GENERAL_STUDIES_PAPER-II_25052026.pdf",
    source: "UPSC",
  },
  2025: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP-CSP-25-GENERAL-STUDIES-PAPER-I-26052025.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP-CSP-25-GENERAL-STUDIES-PAPER-II-26052025.pdf",
    source: "UPSC",
  },
  2024: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP-CSP-24-GENERAL-STUDIES-PAPER-I-180624.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP-CSP-24-GENERAL-STUDIES-PAPER-II-180624.pdf",
    source: "UPSC",
  },
  2023: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP_CS_Pre_Exam_2023_280523.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP_CS_Pre_Exam_2023_GENERAL_STUDIES_PAPER_II_280523.pdf",
    source: "UPSC",
  },
  2022: {
    gs1: "https://www.upsc.gov.in/sites/default/files/GENERAL%20STUDIES%20PAPER%20I.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/GENERAL%20STUDIES%20PAPER%20II.pdf",
    source: "UPSC",
  },
  2021: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP-CSP-21-GeneralStudiesPaper-I-121021.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP-CSP-21-GeneralStudiesPaper-II-121021.pdf",
    source: "UPSC",
  },
  2020: {
    gs1: "https://www.upsc.gov.in/sites/default/files/CSP_2020_GS_Paper-1.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/CSP_2020_GS_Paper-2.pdf",
    source: "UPSC",
  },
  2019: {
    gs1: "https://www.upsc.gov.in/sites/default/files/csp-p1.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/csp-p2.pdf",
    source: "UPSC",
  },
  2018: {
    gs1: "https://www.upsc.gov.in/sites/default/files/QP-CSP-18-GS-I-C.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/QP-CSP-18-GS-II-C.pdf",
    source: "UPSC",
  },
  2017: {
    gs1: "https://www.upsc.gov.in/sites/default/files/CSP-17-GS_PAPER-1-C.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/CSP-17-GS_PAPER-II-C.pdf",
    source: "UPSC",
  },
  2016: {
    gs1: "https://www.upsc.gov.in/sites/default/files/GENERAL_STUDIES_PAPER-I.pdf",
    gs2: "https://www.upsc.gov.in/sites/default/files/GENERAL_STUDIES_PAPER-II.pdf",
    source: "UPSC",
  },
  2015: {
    gs1: "https://iashelpdesk.in//pdf/year-papers//1396a0a7ef2e97901f63f51b79ea9a470a058a14.pdf",
    gs2: "https://iashelpdesk.in//pdf/year-papers//f0bbd930e3bb4300fdefb56965ff9a9e377eed36.pdf",
    source: "Archive mirror",
  },
  2014: {
    gs1: "https://iashelpdesk.in//pdf/year-papers//35dee1b6dd5b3a147436e8dbcd69f99a2f08874a.pdf",
    gs2: "https://iashelpdesk.in//pdf/year-papers//b5f7cb1a29e7af64982303437aca5ef9066e0750.pdf",
    source: "Archive mirror",
  },
  2013: {
    gs1: "https://iashelpdesk.in//pdf/year-papers//6989a64032794532f5ac325a596913659d5a07ae.pdf",
    gs2: "https://iashelpdesk.in//pdf/year-papers//9defc990d01062f7ec22c5eb488a2eeb26364038.pdf",
    source: "Archive mirror",
  },
  2012: {
    gs1: "https://iashelpdesk.in//pdf/year-papers//989ae3597a13191fbb66aa135736cd8fa4a3836f.pdf",
    gs2: "https://iashelpdesk.in//pdf/year-papers//c01562b8febe174b91e8d48d541639f9fc269000.pdf",
    source: "Archive mirror",
  },
};

const YEARS = Object.keys(PAPERS).map(Number).sort((a, b) => b - a);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export default async function UpscPrelimsYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ paper?: string }>;
}) {
  const { year: rawYear } = await params;
  const { paper } = await searchParams;
  const year = Number(rawYear);
  const paperSet = PAPERS[year];
  if (!paperSet) notFound();

  const activePaper = paper === "2" ? 2 : 1;
  const pdfUrl = activePaper === 2 ? paperSet.gs2 : paperSet.gs1;
  const paperTitle = activePaper === 1 ? "General Studies Paper I" : "General Studies Paper II (CSAT)";
  const yearIndex = YEARS.indexOf(year);
  const newerYear = yearIndex > 0 ? YEARS[yearIndex - 1] : null;
  const olderYear = yearIndex < YEARS.length - 1 ? YEARS[yearIndex + 1] : null;

  return (
    <main className="paper-page">
      <section className="paper-header">
        <div className="shell">
          <div className="crumbs">
            <Link href="/pyq">PYQ Library</Link><span>/</span><Link href="/pyq#prelims">UPSC Prelims</Link><span>/</span><b>{year}</b>
          </div>

          <div className="title-row">
            <div>
              <span className="eyebrow">UNION PUBLIC SERVICE COMMISSION · CIVIL SERVICES PRELIMINARY EXAMINATION</span>
              <h1>UPSC Prelims {year}</h1>
              <p>Read the actual previous-year paper here on OneShot GS. Switch between GS Paper I and CSAT without leaving the year desk.</p>
            </div>
            <div className="year-nav">
              {newerYear ? <Link href={`/pyq/upsc/prelims/${newerYear}`}>← {newerYear}</Link> : <span />}
              {olderYear ? <Link href={`/pyq/upsc/prelims/${olderYear}`}>{olderYear} →</Link> : <span />}
            </div>
          </div>

          <div className="paper-tabs" role="navigation" aria-label="Choose paper">
            <Link href={`/pyq/upsc/prelims/${year}?paper=1`} className={activePaper === 1 ? "active" : ""}>
              <span>Paper I</span><b>General Studies</b><small>100 questions · 200 marks</small>
            </Link>
            <Link href={`/pyq/upsc/prelims/${year}?paper=2`} className={activePaper === 2 ? "active" : ""}>
              <span>Paper II</span><b>CSAT</b><small>Qualifying paper · 200 marks</small>
            </Link>
          </div>
        </div>
      </section>

      <section className="reader-shell shell">
        <div className="reader-toolbar">
          <div>
            <span>{year} · {activePaper === 1 ? "PAPER I" : "PAPER II"}</span>
            <h2>{paperTitle}</h2>
          </div>
          <div className="toolbar-actions">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
            <Link href="/ask">Ask Tutor</Link>
          </div>
        </div>

        <div className="paper-frame-wrap">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={`UPSC Prelims ${year} ${paperTitle}`}
            className="paper-frame"
          />
          <noscript>
            <p className="fallback">JavaScript is disabled. <a href={pdfUrl}>Open the paper PDF</a>.</p>
          </noscript>
        </div>

        <div className="source-note">
          <div><b>Paper source</b><span>{paperSet.source === "UPSC" ? "Official UPSC-hosted question paper" : "Archived paper mirror for an older UPSC paper"}</span></div>
          <p>The paper is displayed inside the OneShot GS reader. The external PDF address is retained only as the source document.</p>
        </div>
      </section>

      <section className="shell after-paper">
        <div>
          <span>AFTER THE PAPER</span>
          <h2>Use your mistakes to decide the revision list.</h2>
          <p>Go back to the exact subject you missed, practise it, then return to another UPSC/BPSC PYQ instead of collecting more material.</p>
        </div>
        <div className="after-actions">
          <Link href="/quizzes/static">Free GS Quiz</Link>
          <Link href="/study">Free Study</Link>
          <Link href="/courses/upsc-2027" className="warm">UPSC 2027 Program</Link>
        </div>
      </section>

      <style>{`
        .paper-page{min-height:100vh;background:#f2f2ef;color:#172338}.shell{width:min(1180px,calc(100% - 28px));margin:0 auto}.paper-header{background:#fff;border-bottom:1px solid #d9dde2;padding:26px 0 22px}.crumbs{display:flex;gap:7px;align-items:center;font-size:9px;color:#7c8794;margin-bottom:23px}.crumbs a{text-decoration:none;color:#586879}.crumbs b{color:#172338}.title-row{display:flex;justify-content:space-between;align-items:end;gap:30px}.eyebrow{font-size:7px;letter-spacing:.15em;font-weight:850;color:#8f482a}.title-row h1{font-family:var(--font-display);font-size:clamp(35px,5vw,56px);line-height:.96;letter-spacing:-.05em;margin:7px 0 8px}.title-row p{max-width:720px;font-size:11px;line-height:1.65;color:#637080}.year-nav{display:flex;gap:6px}.year-nav a{min-width:68px;text-align:center;text-decoration:none;border:1px solid #d7dce2;background:#f8f9fa;color:#293b53;border-radius:5px;padding:8px 10px;font-size:8px;font-weight:800}.paper-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:24px;max-width:700px}.paper-tabs a{display:grid;grid-template-columns:auto 1fr;column-gap:11px;row-gap:1px;text-decoration:none;color:#435267;border:1px solid #d9dde3;background:#f7f8f9;border-radius:7px;padding:12px 14px}.paper-tabs a>span{grid-row:1/3;font-family:Georgia,serif;font-size:11px;color:#8a4a2e;padding-top:2px}.paper-tabs b{font-size:10px}.paper-tabs small{font-size:7.5px;color:#788493}.paper-tabs a.active{background:#172338;border-color:#172338;color:#fff}.paper-tabs a.active>span{color:#e7b98e}.paper-tabs a.active small{color:#bdc8d4}.reader-shell{padding:18px 0 0}.reader-toolbar{background:#fff;border:1px solid #d8dce1;border-bottom:0;border-radius:8px 8px 0 0;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:16px}.reader-toolbar>div:first-child>span{display:block;font-size:6.5px;letter-spacing:.12em;font-weight:850;color:#915033}.reader-toolbar h2{font-family:var(--font-display);font-size:15px;margin-top:2px}.toolbar-actions{display:flex;gap:6px}.toolbar-actions a{text-decoration:none;border:1px solid #d4d9df;background:#fff;color:#34465d;border-radius:4px;padding:7px 9px;font-size:7.5px;font-weight:800}.paper-frame-wrap{height:min(82vh,1040px);min-height:650px;background:#cfd2d5;border:1px solid #c9cdd2;box-shadow:0 8px 30px rgba(28,38,51,.08)}.paper-frame{width:100%;height:100%;border:0;background:#e4e4e4}.fallback{padding:30px}.source-note{display:grid;grid-template-columns:1fr 1.4fr;gap:20px;background:#fff;border:1px solid #d8dce1;border-top:0;border-radius:0 0 8px 8px;padding:11px 14px}.source-note b,.source-note span{display:block}.source-note b{font-size:7px;letter-spacing:.09em;color:#8c482c}.source-note span,.source-note p{font-size:7.5px;line-height:1.55;color:#75808d}.after-paper{margin-top:20px;margin-bottom:38px;background:#172338;color:#fff;padding:25px 27px;display:flex;justify-content:space-between;align-items:center;gap:26px}.after-paper>div:first-child>span{font-size:7px;letter-spacing:.14em;color:#dfb58e;font-weight:850}.after-paper h2{font-family:var(--font-display);font-size:clamp(24px,3.5vw,36px);letter-spacing:-.04em;margin:5px 0}.after-paper p{font-size:8.5px;line-height:1.65;color:#c4ceda;max-width:700px}.after-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.after-actions a{text-decoration:none;background:#f2ede6;color:#26364f;padding:9px 10px;border-radius:4px;font-size:8px;font-weight:850;white-space:nowrap}.after-actions .warm{background:#a34821;color:#fff}@media(max-width:700px){.title-row{flex-direction:column;align-items:flex-start}.year-nav{width:100%;justify-content:space-between}.paper-tabs{grid-template-columns:1fr}.reader-toolbar{align-items:flex-start;flex-direction:column}.paper-frame-wrap{height:72vh;min-height:560px}.source-note{grid-template-columns:1fr}.after-paper{flex-direction:column;align-items:flex-start}.after-actions{justify-content:flex-start}}@media(max-width:430px){.shell{width:min(100% - 18px,1180px)}.paper-header{padding-top:18px}.paper-frame-wrap{height:68vh;min-height:500px}.paper-tabs a{padding:10px}.after-paper{padding:20px}}
      `}</style>
    </main>
  );
}
