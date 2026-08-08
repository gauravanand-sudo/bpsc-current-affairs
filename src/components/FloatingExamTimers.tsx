"use client";

import Link from "next/link";

const PROGRAMS = [
  { exam: "UPSC 2027", price: "₹56K", emoji: "🚀", color: "#5b21b6" },
  { exam: "UPSC 2028", price: "₹56K", emoji: "🌱", color: "#7c3aed" },
  { exam: "72nd BPSC", price: "₹29K", emoji: "🔥", color: "#b91c1c" },
  { exam: "73rd BPSC", price: "₹29K", emoji: "🎯", color: "#c06010" },
];

export default function FloatingExamTimers() {
  return (
    <>
      <div className="program-float" aria-label="Complete programs">
        <div className="program-float-head">FULL PROGRAMS <span>Pre + Mains + Interview</span></div>
        {PROGRAMS.map((p) => (
          <Link href="/#courses" key={p.exam} className="program-pill" style={{ "--pc": p.color } as React.CSSProperties}>
            <span className="program-emoji">{p.emoji}</span>
            <span><b>{p.exam}</b><small>Complete preparation</small></span>
            <strong>{p.price}</strong>
          </Link>
        ))}
      </div>
      <style>{`
        .program-float{position:fixed;top:94px;right:10px;z-index:88;width:190px;padding:8px;border-radius:17px;background:rgba(255,253,248,.86);backdrop-filter:blur(14px);border:1px solid rgba(120,80,30,.12);box-shadow:0 10px 30px rgba(70,35,10,.09)}.program-float-head{font-size:8px;font-weight:900;letter-spacing:.12em;color:#7c2d12;padding:3px 4px 7px}.program-float-head span{display:block;margin-top:2px;font-size:7px;letter-spacing:.04em;color:var(--muted)}.program-pill{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:7px;text-decoration:none;padding:7px 6px;border-radius:11px;transition:.14s}.program-pill:hover{background:#fff;transform:translateX(-2px)}.program-emoji{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:color-mix(in srgb,var(--pc) 10%,white);font-size:13px}.program-pill b{display:block;font-size:9.5px;color:var(--ink-strong)}.program-pill small{display:block;font-size:7px;color:var(--muted);margin-top:1px}.program-pill strong{font-size:10px;color:var(--pc)}@media(max-width:900px){.program-float{display:none}}
      `}</style>
    </>
  );
}
