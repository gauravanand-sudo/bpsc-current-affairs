"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className="academic-footer">
      <div className="footer-inner">
        <div className="footer-intro">
          <span className="footer-label">ONESHOT GS · UPSC & BPSC</span>
          <h2>Study freely. Enroll when you need a complete preparation system.</h2>
          <p>Open study resources and practice remain available through Free Study and Free Quiz. Complete programs add structured classes, tests, Mains evaluation, mentoring and Interview guidance.</p>
          <div className="footer-actions"><Link href="/study">Start Free Study</Link><Link href="/quizzes" className="secondary">Take a Free Quiz</Link><Link href="/#programs" className="program">Explore Programs →</Link></div>
        </div>
        <div className="program-table">
          <div className="table-head"><span>COMPLETE PROGRAM</span><span>FEE</span></div>
          <Link href="/courses/upsc-2027"><span><b>UPSC CSE</b><small>2027 / 2028</small></span><strong>₹56,000</strong></Link>
          <Link href="/courses/bpsc-72"><span><b>BPSC</b><small>72nd / 73rd</small></span><strong>₹29,000</strong></Link>
          <p>Both pathways cover Prelims, Mains and Interview preparation.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div><b>OneShot GS</b><span>Academic preparation for serious UPSC & BPSC aspirants.</span></div>
        <nav><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link><Link href="/pyq">PYQs</Link><Link href="/ask">Ask Tutor</Link><Link href="/partner">Study Buddy</Link><Link href="/#programs">Programs</Link></nav>
      </div>
      <style>{`
        .academic-footer{margin-top:46px;background:#172338;color:#edf1f6;padding:42px 18px 92px;border-top:4px solid #9f3e1b}.footer-inner{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:1.35fr .65fr;gap:54px}.footer-label{font-size:8px;letter-spacing:.16em;font-weight:850;color:#dfb58e}.footer-intro h2{font-family:var(--font-display);font-size:clamp(28px,4vw,43px);line-height:1.03;letter-spacing:-.045em;max-width:700px;margin:9px 0 11px}.footer-intro p{max-width:720px;font-size:11px;line-height:1.7;color:#c8d1dd}.footer-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:17px}.footer-actions a{text-decoration:none;padding:9px 12px;border-radius:5px;background:#f4f1ea;color:#23344d;font-size:9.5px;font-weight:800}.footer-actions .secondary{background:transparent;color:#e2e8f0;border:1px solid rgba(255,255,255,.19)}.footer-actions .program{background:#9f3e1b;color:#fff}.program-table{border:1px solid rgba(255,255,255,.14);align-self:start}.table-head,.program-table>a{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:11px 13px;border-bottom:1px solid rgba(255,255,255,.12)}.table-head{font-size:7px;letter-spacing:.13em;color:#9eacbd}.program-table>a{text-decoration:none;color:#fff}.program-table>a:hover{background:rgba(255,255,255,.045)}.program-table b,.program-table small{display:block}.program-table b{font-size:10px}.program-table small{font-size:8px;color:#abb7c6;margin-top:2px}.program-table strong{font-size:18px;font-family:var(--font-display)}.program-table>p{padding:10px 13px;font-size:8.5px;line-height:1.55;color:#aeb8c5}.footer-bottom{max-width:1080px;margin:30px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:end;justify-content:space-between;gap:25px}.footer-bottom>div b,.footer-bottom>div span{display:block}.footer-bottom>div b{font-family:var(--font-display);font-size:13px}.footer-bottom>div span{font-size:8px;color:#9eabba;margin-top:3px}.footer-bottom nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:13px}.footer-bottom nav a{text-decoration:none;color:#bdc7d3;font-size:8.5px}.footer-bottom nav a:hover{color:#fff}
        @media(max-width:760px){.academic-footer{padding-bottom:145px}.footer-inner{grid-template-columns:1fr;gap:28px}.footer-bottom{align-items:start;flex-direction:column}.footer-bottom nav{justify-content:flex-start}}
      `}</style>
    </footer>
  );
}
