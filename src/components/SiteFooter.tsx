"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (["/support", "/partner", "/ask"].includes(pathname) || pathname.endsWith("/quiz")) return null;

  return (
    <footer className="sales-footer">
      <div className="footer-inner">
        <div className="footer-pitch">
          <span>🎯 COMPLETE PREPARATION, ONE ENROLLMENT</span>
          <h2>Prelims. Mains. Interview. Stay with one system till the final list.</h2>
          <p>UPSC 2027 & 2028 complete programs at <b>₹56,000</b>. 72nd & 73rd BPSC complete programs at <b>₹29,000</b>.</p>
          <div className="footer-actions"><Link href="/#courses">View Courses & Enroll →</Link><Link href="/partner" className="outline">🤝 Find Study Buddy</Link></div>
        </div>
        <div className="footer-programs">
          <div><b>UPSC</b><strong>₹56,000</strong><small>2027 / 2028 · Pre + Mains + Interview</small></div>
          <div><b>BPSC</b><strong>₹29,000</strong><small>72nd / 73rd · Pre + Mains + Interview</small></div>
        </div>
      </div>
      <div className="footer-links"><Link href="/study">Study Library</Link><Link href="/quizzes">Practice MCQs</Link><Link href="/ask">Ask Tutor</Link><Link href="/partner">Study Buddy</Link><span>Made with ♥ for serious aspirants</span></div>
      <style>{`
        .sales-footer{margin-top:42px;background:#241006;color:#fff;padding:32px 18px 84px}.footer-inner{max-width:980px;margin:0 auto;display:grid;grid-template-columns:1.4fr .8fr;gap:24px;align-items:center}.footer-pitch>span{font-size:9px;font-weight:900;letter-spacing:.14em;color:#ffd88d}.footer-pitch h2{font-family:var(--font-display);font-size:clamp(25px,4vw,40px);line-height:1.02;letter-spacing:-.04em;max-width:650px;margin:9px 0}.footer-pitch p{font-size:12px;color:#eaded4;line-height:1.6}.footer-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.footer-actions a{text-decoration:none;background:#c06010;color:#fff;border-radius:11px;padding:10px 13px;font-size:11px;font-weight:900}.footer-actions .outline{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}.footer-programs{display:grid;gap:8px}.footer-programs div{padding:13px;border-radius:15px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.09)}.footer-programs b{font-size:9px;color:#ffd88d;letter-spacing:.12em}.footer-programs strong{display:block;font-size:24px;margin:2px 0}.footer-programs small{font-size:9px;color:#d8c9bc}.footer-links{max-width:980px;margin:24px auto 0;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-wrap:wrap;gap:15px;align-items:center}.footer-links a,.footer-links span{font-size:9.5px;color:#bfaea1;text-decoration:none}.footer-links span{margin-left:auto}@media(max-width:700px){.sales-footer{padding-bottom:142px}.footer-inner{grid-template-columns:1fr}.footer-links span{width:100%;margin-left:0}.footer-programs{grid-template-columns:1fr 1fr}}
      `}</style>
    </footer>
  );
}
