"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalSalesCTA() {
  const pathname = usePathname();
  const compact = ["/partner", "/ask", "/support"].includes(pathname) || pathname.endsWith("/quiz");

  return (
    <>
      <aside className={`global-sales-rail ${compact ? "compact" : ""}`} aria-label="Course enrollment">
        <div className="sales-kicker">🎯 FULL-CYCLE PROGRAMS</div>
        {!compact && <p>Prelims + Mains + Interview</p>}
        <div className="sales-price-row">
          <span><b>UPSC</b> ₹56K</span>
          <span><b>BPSC</b> ₹29K</span>
        </div>
        <div className="sales-actions">
          <Link href="/#courses">View Courses</Link>
          {!compact && <Link href="/partner" className="buddy">Find Study Buddy</Link>}
        </div>
      </aside>

      <div className="mobile-sales-bar">
        <div><strong>Pre + Mains + Interview</strong><span>UPSC ₹56K · BPSC ₹29K</span></div>
        <Link href="/#courses">Enroll →</Link>
      </div>

      <style>{`
        .global-sales-rail{position:fixed;right:12px;bottom:18px;z-index:175;width:218px;padding:13px;border-radius:18px;background:rgba(28,12,5,.95);color:#fff;border:1px solid rgba(255,218,150,.22);box-shadow:0 18px 50px rgba(35,15,4,.28);backdrop-filter:blur(14px)}
        .global-sales-rail.compact{width:auto;padding:9px 10px;bottom:12px}.global-sales-rail.compact p,.global-sales-rail.compact .sales-price-row{display:none}
        .sales-kicker{font-size:9px;font-weight:900;letter-spacing:.13em;color:#ffd890}.global-sales-rail p{font-size:11px;margin:4px 0 8px;color:#f7eee7}
        .sales-price-row{display:flex;gap:6px;margin-bottom:9px}.sales-price-row span{flex:1;padding:6px;border-radius:10px;background:rgba(255,255,255,.08);font-size:10px}.sales-price-row b{display:block;font-size:9px;color:#ffd890}
        .sales-actions{display:flex;gap:6px}.sales-actions a{text-decoration:none;flex:1;text-align:center;padding:8px 7px;border-radius:10px;background:linear-gradient(135deg,#b91c1c,#c06010);color:#fff;font-size:10px;font-weight:900}.sales-actions .buddy{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12)}
        .mobile-sales-bar{display:none}
        @media(max-width:639px){.global-sales-rail{display:none}.mobile-sales-bar{position:fixed;left:8px;right:8px;bottom:68px;z-index:180;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border-radius:14px;background:rgba(31,13,5,.96);color:#fff;box-shadow:0 10px 34px rgba(30,10,3,.3)}.mobile-sales-bar div{display:flex;flex-direction:column}.mobile-sales-bar strong{font-size:10px}.mobile-sales-bar span{font-size:9px;color:#ffd890;margin-top:2px}.mobile-sales-bar a{text-decoration:none;background:#c06010;color:white;border-radius:10px;padding:8px 11px;font-size:10px;font-weight:900}.global-sales-rail.compact + .mobile-sales-bar{bottom:8px}}
      `}</style>
    </>
  );
}
