"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalSalesCTA() {
  const pathname = usePathname();
  const compact = ["/partner", "/ask", "/support"].includes(pathname) || pathname.endsWith("/quiz");
  const hideDesktop = pathname.startsWith("/courses/");

  return (
    <>
      {!hideDesktop && <aside className={`program-note ${compact ? "compact" : ""}`} aria-label="OneShot GS complete programs">
        <div className="note-head"><span>PROGRAMS</span><b>UPSC & BPSC</b></div>
        {!compact && <p>Structured preparation from Prelims through Mains and Interview.</p>}
        {!compact && <div className="fee-row"><span><small>UPSC 2027/28</small><strong>₹56,000</strong></span><span><small>BPSC 72nd/73rd</small><strong>₹29,000</strong></span></div>}
        <div className="note-actions"><Link href="/#courses">Explore Programs →</Link>{!compact && <Link href="/study" className="quiet">Start Free Study</Link>}</div>
      </aside>}

      <div className={`mobile-program-bar ${compact ? "compact" : ""}`}>
        <div><strong>Complete UPSC & BPSC Programs</strong><span>Prelims · Mains · Interview</span></div>
        <Link href="/#courses">Explore →</Link>
      </div>

      <style>{`
        .program-note{position:fixed;right:12px;bottom:18px;z-index:175;width:225px;padding:14px;border-radius:9px;background:rgba(252,250,246,.97);color:#172338;border:1px solid #d6d7d6;border-top:3px solid #9f3e1b;box-shadow:0 12px 35px rgba(27,39,57,.12);backdrop-filter:blur(12px)}.program-note.compact{width:auto;padding:8px 10px;bottom:12px;border-top-width:2px}.program-note.compact .note-head span{display:none}.note-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.note-head span{font-size:7.5px;font-weight:850;letter-spacing:.14em;color:#9a4c2a}.note-head b{font-family:var(--font-display);font-size:12px}.program-note p{font-size:9.5px;line-height:1.55;color:#657181;margin:7px 0 9px}.fee-row{display:grid;grid-template-columns:1fr 1fr;gap:5px}.fee-row span{padding:7px;background:#f2f1ed;border-radius:5px}.fee-row small,.fee-row strong{display:block}.fee-row small{font-size:7px;color:#7b6f66}.fee-row strong{font-size:14px;margin-top:1px}.note-actions{display:flex;gap:5px;margin-top:8px}.note-actions a{text-decoration:none;flex:1;text-align:center;padding:7px 6px;border-radius:5px;background:#21324d;color:#fff;font-size:8.5px;font-weight:800}.note-actions .quiet{background:#fff;color:#31445f;border:1px solid #d3d8df}.compact .note-actions{margin:0}.compact .note-actions .quiet{display:none}.mobile-program-bar{display:none}
        @media(max-width:639px){.program-note{display:none}.mobile-program-bar{position:fixed;left:7px;right:7px;bottom:68px;z-index:180;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:8px;background:rgba(31,45,66,.97);color:#fff;box-shadow:0 8px 25px rgba(25,37,55,.22)}.mobile-program-bar div{display:flex;flex-direction:column}.mobile-program-bar strong{font-size:9.5px}.mobile-program-bar span{font-size:7.8px;color:#cbd5e1;margin-top:1px}.mobile-program-bar a{text-decoration:none;background:#f4efe8;color:#21324d;border-radius:5px;padding:7px 9px;font-size:8.5px;font-weight:850}.mobile-program-bar.compact{bottom:8px}.mobile-program-bar.compact span{display:none}}
      `}</style>
    </>
  );
}
