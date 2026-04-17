"use client";

import { useEffect, useRef } from "react";

// Replace with your actual AdSense publisher ID and slot ID once approved
const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "";
const SLOT_ID      = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? "";

export default function AdBanner() {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!PUBLISHER_ID || !SLOT_ID || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle ?? []).push({});
      pushed.current = true;
    } catch { /* ignore */ }
  }, []);

  // Don't render anything until publisher ID is configured
  if (!PUBLISHER_ID || !SLOT_ID) return null;

  return (
    <div style={{
      textAlign: "center", overflow: "hidden",
      padding: "8px 0",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      background: "var(--panel)",
    }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
