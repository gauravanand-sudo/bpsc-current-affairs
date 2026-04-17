"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function SupportButton() {
  const pathname = usePathname();
  const [seekers, setSeekers] = useState(0);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const cutoff = new Date(Date.now() - 86400000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("study_partner_requests")
      .select("id", { count: "exact", head: true })
      .gte("created_at", cutoff)
      .then(({ count }: { count: number | null }) => {
        if (count) setSeekers(count);
      });
  }, []);

  // Hide on pages with bottom input bars or quiz (dark exam mode)
  const pagesWithBottomInput = ["/support", "/partner", "/ask"];
  if (pagesWithBottomInput.includes(pathname)) return null;
  if (pathname.endsWith("/quiz")) return null;

  const hidePartner = false;
  const hideSupport = false;

  return (
    <div style={{
      position: "fixed",
      bottom: "calc(70px + env(safe-area-inset-bottom))",
      right: 14,
      zIndex: 190,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 8,
      pointerEvents: "auto",
    }}>

      {!hidePartner && (
        <Link href="/partner" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg, rgba(192,96,16,0.92), rgba(217,119,6,0.92))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(192,96,16,0.3)",
          borderRadius: 50,
          padding: "9px 14px",
          fontSize: 12, fontWeight: 700,
          color: "#fff",
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(192,96,16,0.35)",
          position: "relative",
        }}>
          🤝 Find Study Partner
          {seekers > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6,
              background: "#22c55e", color: "#fff",
              fontSize: 10, fontWeight: 700,
              borderRadius: 20, padding: "2px 6px",
              minWidth: 18, textAlign: "center",
              boxShadow: "0 0 0 2px var(--bg)",
              lineHeight: 1.4,
            }}>
              {seekers}
            </span>
          )}
        </Link>
      )}

      {!hideSupport && (
        <Link href="/support" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(244,239,232,0.82)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(120,80,30,0.15)",
          borderRadius: 50,
          padding: "8px 14px",
          fontSize: 12, fontWeight: 700,
          color: "var(--ink-soft)",
          textDecoration: "none",
          boxShadow: "0 2px 12px rgba(120,80,30,0.10)",
        }}>
          💙 Feeling sad?
        </Link>
      )}

    </div>
  );
}
