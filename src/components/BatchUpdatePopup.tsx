"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BatchUpdatePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("oneshot_batch_popup_closed") === "1") return;
    } catch {
      // Continue without storage if unavailable.
    }

    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
    try { sessionStorage.setItem("oneshot_batch_popup_closed", "1"); } catch { /* no-op */ }
  }

  if (!visible) return null;

  return (
    <aside className="batch-popup" aria-label="Batch update">
      <button className="batch-close" onClick={close} aria-label="Close batch update">×</button>
      <div className="batch-status"><i /> BATCH UPDATE</div>
      <h2>UPSC 2027 &amp; 73rd BPSC</h2>
      <p>Complete programs covering Foundation, Prelims, Mains and Interview.</p>
      <div className="batch-fees">
        <span><b>UPSC 2027</b><s>₹2,00,000</s><strong>₹1,60,000</strong><em>20% OFF · Save ₹40,000</em></span>
        <span><b>73rd BPSC</b><s>₹1,20,000</s><strong>₹87,000</strong><em>27.5% OFF · Save ₹33,000</em></span>
      </div>
      <div className="batch-actions">
        <Link href="/courses">View Courses</Link>
        <Link href="/talk-to-us?intent=admission">Admission Query</Link>
      </div>
      <style jsx>{`
        .batch-popup{position:fixed;right:18px;bottom:18px;width:min(360px,calc(100vw - 28px));z-index:80;background:#fff;border:1px solid #d7dfe7;border-top:4px solid #d9272e;box-shadow:0 18px 50px rgba(18,52,91,.22);padding:17px;font-family:Arial,"Helvetica Neue",sans-serif;animation:batchIn .35s ease both}.batch-close{position:absolute;right:10px;top:8px;border:0;background:transparent;color:#768393;font-size:22px;line-height:1;cursor:pointer}.batch-status{display:flex;align-items:center;gap:7px;font-size:9px;font-weight:800;letter-spacing:.08em;color:#d9272e}.batch-status i{width:8px;height:8px;border-radius:50%;background:#d9272e;box-shadow:0 0 0 0 rgba(217,39,46,.35);animation:batchPulse 1.8s infinite}.batch-popup h2{font-size:20px;color:#12345b;margin:7px 0 5px;padding-right:25px}.batch-popup p{font-size:10px;line-height:1.5;color:#657486}.batch-fees{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e0e5ea;margin-top:12px}.batch-fees span{padding:10px}.batch-fees span+span{border-left:1px solid #e0e5ea}.batch-fees b,.batch-fees s,.batch-fees strong,.batch-fees em{display:block}.batch-fees b{font-size:8px;color:#647386}.batch-fees s{font-size:10px;color:#8793a0;text-decoration-color:#d9272e;text-decoration-thickness:2px;margin-top:3px}.batch-fees strong{font-size:17px;color:#d9272e;margin-top:1px;animation:pricePulse 2.4s ease-in-out infinite}.batch-fees em{font-style:normal;font-size:7px;font-weight:800;color:#a51f24;margin-top:3px}.batch-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.batch-actions :global(a){display:flex;align-items:center;justify-content:center;min-height:36px;text-decoration:none;font-size:9px;font-weight:800;background:#174f86;color:#fff}.batch-actions :global(a:last-child){background:#d9272e}@keyframes batchIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}@keyframes batchPulse{0%{box-shadow:0 0 0 0 rgba(217,39,46,.35)}70%{box-shadow:0 0 0 7px rgba(217,39,46,0)}100%{box-shadow:0 0 0 0 rgba(217,39,46,0)}}@keyframes pricePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}@media(max-width:600px){.batch-popup{right:10px;bottom:78px;width:calc(100vw - 20px)}}@media(prefers-reduced-motion:reduce){.batch-popup,.batch-status i,.batch-fees strong{animation:none}}
      `}</style>
    </aside>
  );
}
