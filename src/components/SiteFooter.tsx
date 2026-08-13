"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <span>ONESHOT GS · UPSC / BPSC COACHING</span>
          <h2>Two flagship programs. Complete preparation from foundation to interview.</h2>
          <p>Faculty-led classes, on-site PYQ study, Prelims tests, Mains answer-writing, evaluation, revision planning, mentoring and final-stage interview preparation.</p>
          <div className="footer-ctas"><Link href="/demo">View Demo Class</Link><Link href="/admissions" className="warm">Admissions →</Link></div>
        </div>

        <div className="footer-column">
          <b>FLAGSHIP COURSES</b>
          <Link href="/courses/upsc-2027">UPSC CSE 2027 · ₹1,60,000</Link>
          <Link href="/courses/bpsc-73">73rd BPSC · ₹87,000</Link>
          <Link href="/courses" className="highlight">Compare both programs →</Link>
        </div>

        <div className="footer-column">
          <b>UPSC / BPSC RESOURCES</b>
          <Link href="/study">Free Study</Link>
          <Link href="/quizzes">Free Quiz</Link>
          <Link href="/pyq">UPSC / BPSC PYQ Library</Link>
          <Link href="/faculty">Faculty</Link>
          <Link href="/demo">Demo Class</Link>
        </div>

        <div className="footer-column">
          <b>STUDENT SUPPORT</b>
          <Link href="/ask">Ask Tutor</Link>
          <Link href="/partner">Find Study Buddy</Link>
          <Link href="/support">Support Desk</Link>
          <Link href="/admissions">Admissions & Counselling</Link>
          <Link href="/leaderboard">Results / Leaderboard</Link>
        </div>
      </div>

      <div className="fee-band">
        <Link href="/courses/upsc-2027"><span>UPSC CSE 2027</span><b>₹1,60,000</b><small>Foundation + Prelims + Mains + Interview</small></Link>
        <Link href="/courses/bpsc-73"><span>73RD BPSC</span><b>₹87,000</b><small>Foundation + Prelims + Mains + Interview</small></Link>
        <p>Payment flow is temporarily unavailable while the backend team fixes the technical issue. Course information, demo class, PYQs and free resources remain accessible.</p>
      </div>

      <div className="footer-bottom"><div><b>OneShot GS</b><span>End-to-end UPSC / BPSC preparation.</span></div><nav><Link href="/courses">Courses</Link><Link href="/demo">Demo</Link><Link href="/pyq">PYQs</Link><Link href="/study">Free Study</Link><Link href="/quizzes">Free Quiz</Link><Link href="/admissions">Admissions</Link></nav></div>

      <style>{`
        .site-footer{margin-top:48px;background:#172338;color:#edf1f6;padding:44px 18px 92px;border-top:4px solid #9f3e1b}.footer-main{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.35fr .72fr .72fr .72fr;gap:36px}.footer-brand>span,.footer-column>b{font-size:7.5px;letter-spacing:.14em;font-weight:850;color:#dfb58e}.footer-brand h2{font-family:var(--font-display);font-size:clamp(27px,3.7vw,40px);line-height:1.04;letter-spacing:-.045em;margin:8px 0 10px;max-width:620px}.footer-brand p{font-size:9.5px;line-height:1.7;color:#c7d1dd;max-width:630px}.footer-ctas{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px}.footer-ctas a{text-decoration:none;background:#f1ece5;color:#26364f;border-radius:4px;padding:9px 11px;font-size:8.5px;font-weight:850}.footer-ctas .warm{background:#a34821;color:#fff}.footer-column{display:flex;flex-direction:column;align-items:flex-start;gap:9px}.footer-column>b{margin-bottom:2px}.footer-column a{text-decoration:none;color:#c1ccd8;font-size:8.5px;line-height:1.35}.footer-column a:hover{color:#fff}.footer-column .highlight{color:#e6b991;font-weight:800}.fee-band{max-width:1100px;margin:30px auto 0;border:1px solid rgba(255,255,255,.13);display:grid;grid-template-columns:.85fr .85fr 1.3fr}.fee-band>a,.fee-band>p{padding:13px 15px;border-right:1px solid rgba(255,255,255,.11);text-decoration:none;color:#fff}.fee-band>a:hover{background:rgba(255,255,255,.04)}.fee-band>p{border-right:0;font-size:8px;line-height:1.6;color:#aeb9c6;display:flex;align-items:center}.fee-band span,.fee-band b,.fee-band small{display:block}.fee-band span{font-size:6.8px;letter-spacing:.1em;color:#dcae83;font-weight:850}.fee-band b{font-family:var(--font-display);font-size:20px;margin:2px 0}.fee-band small{font-size:7.3px;color:#aeb8c5}.footer-bottom{max-width:1100px;margin:27px auto 0;padding-top:17px;border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:end;justify-content:space-between;gap:24px}.footer-bottom>div b,.footer-bottom>div span{display:block}.footer-bottom>div b{font-family:var(--font-display);font-size:12px}.footer-bottom>div span{font-size:7.5px;color:#9eabba;margin-top:3px}.footer-bottom nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:13px}.footer-bottom nav a{text-decoration:none;color:#b8c4d1;font-size:8px}@media(max-width:900px){.footer-main{grid-template-columns:1.3fr 1fr 1fr}.footer-column:last-child{grid-column:2/4}.fee-band{grid-template-columns:1fr 1fr}.fee-band>p{grid-column:1/3;border-top:1px solid rgba(255,255,255,.11)}}@media(max-width:680px){.site-footer{padding-bottom:100px}.footer-main{grid-template-columns:1fr 1fr;gap:28px}.footer-brand{grid-column:1/3}.footer-column:last-child{grid-column:auto}.footer-bottom{align-items:flex-start;flex-direction:column}.footer-bottom nav{justify-content:flex-start}}@media(max-width:430px){.footer-main{grid-template-columns:1fr}.footer-brand{grid-column:1}.fee-band{grid-template-columns:1fr}.fee-band>a,.fee-band>p{border-right:0;border-bottom:1px solid rgba(255,255,255,.11)}.fee-band>p{grid-column:1}.fee-band>p:last-child{border-bottom:0}}
      `}</style>
    </footer>
  );
}
