import Link from "next/link";
import { notFound } from "next/navigation";

const YEARS = Array.from({ length: 13 }, (_, index) => 2026 - index);

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export default async function UpscPrelimsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: rawYear } = await params;
  const year = Number(rawYear);
  if (!YEARS.includes(year)) notFound();

  const yearIndex = YEARS.indexOf(year);
  const newerYear = yearIndex > 0 ? YEARS[yearIndex - 1] : null;
  const olderYear = yearIndex < YEARS.length - 1 ? YEARS[yearIndex + 1] : null;
  const pdfUrl = `/pyq/upsc/prelims/${year}.pdf`;

  return (
    <main className="paper-page">
      <header className="paper-header">
        <div className="shell top-row">
          <div className="identity">
            <Link href="/pyq" className="back">← PYQ Library</Link>
            <div className="divider" />
            <div>
              <span>UPSC CIVIL SERVICES PRELIMINARY EXAMINATION</span>
              <h1>{year} · General Studies Paper I</h1>
            </div>
          </div>

          <div className="controls">
            {olderYear ? <Link href={`/pyq/upsc/prelims/${olderYear}`}>← {olderYear}</Link> : <span className="spacer" />}
            {newerYear ? <Link href={`/pyq/upsc/prelims/${newerYear}`}>{newerYear} →</Link> : <span className="spacer" />}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="open">Open full paper ↗</a>
          </div>
        </div>
      </header>

      <section className="viewer-wrap">
        <object data={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0`} type="application/pdf" className="pdf-viewer">
          <div className="fallback">
            <span>PDF VIEWER</span>
            <h2>Your browser cannot display the paper inline.</h2>
            <p>The paper is hosted directly on OneShot GS. Open it in the browser&apos;s full PDF reader.</p>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open {year} GS Paper I</a>
          </div>
        </object>
      </section>

      <footer className="paper-footer">
        <div className="shell">
          <div>
            <b>UPSC Prelims {year}</b>
            <span>General Studies Paper I · Original paper hosted on OneShot GS</span>
          </div>
          <div>
            <Link href="/pyq">All PYQs</Link>
            <Link href="/study">Free Study</Link>
            <Link href="/quizzes">Free Quiz</Link>
          </div>
        </div>
      </footer>

      <style>{`
        .paper-page{height:calc(100dvh - 0px);min-height:680px;background:#23272d;color:#152136;display:flex;flex-direction:column}.shell{width:min(1400px,calc(100% - 28px));margin:0 auto}.paper-header{background:#fff;border-bottom:1px solid #d7dbe0;flex:0 0 auto}.top-row{min-height:70px;display:flex;align-items:center;justify-content:space-between;gap:24px}.identity{display:flex;align-items:center;gap:15px;min-width:0}.back{text-decoration:none;color:#6c7886;font-size:8px;font-weight:800;white-space:nowrap}.divider{width:1px;height:30px;background:#dce0e4}.identity span{display:block;font-size:6px;font-weight:850;letter-spacing:.13em;color:#97492a;margin-bottom:3px}.identity h1{font-family:var(--font-display);font-size:19px;line-height:1.1;letter-spacing:-.025em;white-space:nowrap}.controls{display:flex;align-items:center;gap:6px}.controls a{padding:8px 10px;border:1px solid #d6dbe0;border-radius:4px;text-decoration:none;color:#34465c;font-size:7px;font-weight:850;white-space:nowrap}.controls .open{background:#1c2d45;border-color:#1c2d45;color:#fff}.spacer{display:none}.viewer-wrap{flex:1;min-height:0;padding:10px;background:#2a2e34}.pdf-viewer{display:block;width:100%;height:100%;min-height:570px;border:0;background:#d7d7d7}.fallback{height:100%;min-height:570px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#f4f3ef;padding:30px}.fallback>span{font-size:7px;letter-spacing:.14em;font-weight:850;color:#984b2c}.fallback h2{font-family:var(--font-display);font-size:30px;letter-spacing:-.04em;margin:8px 0}.fallback p{font-size:10px;line-height:1.7;color:#6a7581;max-width:520px}.fallback a{margin-top:16px;padding:10px 13px;background:#1c2d45;color:#fff;border-radius:4px;text-decoration:none;font-size:8px;font-weight:850}.paper-footer{background:#fff;border-top:1px solid #d7dbe0;flex:0 0 auto}.paper-footer .shell{min-height:47px;display:flex;align-items:center;justify-content:space-between;gap:20px}.paper-footer>div>div:first-child{display:flex;align-items:center;gap:10px}.paper-footer b{font-size:8px}.paper-footer span{font-size:7px;color:#77828e}.paper-footer>div>div:last-child{display:flex;gap:14px}.paper-footer a{text-decoration:none;color:#536274;font-size:7px;font-weight:800}@media(max-width:760px){.paper-page{min-height:100dvh}.top-row{padding:10px 0;align-items:flex-start}.identity{align-items:flex-start;gap:9px}.divider{display:none}.identity{flex-direction:column}.identity h1{font-size:17px;white-space:normal}.controls a:not(.open){display:none}.controls .open{padding:9px 10px}.viewer-wrap{padding:5px}.pdf-viewer{min-height:calc(100dvh - 155px)}.paper-footer .shell{padding:9px 0;align-items:flex-start}.paper-footer>div>div:first-child{display:block}.paper-footer span{display:block;margin-top:2px}.paper-footer>div>div:last-child{gap:9px}}@media(max-width:480px){.shell{width:calc(100% - 18px)}.paper-header .shell{width:calc(100% - 16px)}.identity span{font-size:5.5px}.identity h1{font-size:15px}.controls .open{font-size:6.5px}.viewer-wrap{padding:0}.pdf-viewer{min-height:calc(100dvh - 145px)}.paper-footer a:nth-child(n+2){display:none}}
      `}</style>
    </main>
  );
}
