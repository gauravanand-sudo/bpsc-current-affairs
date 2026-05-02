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
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("study_partner_profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("is_active", true)
        .then(({ count }: { count: number | null }) => {
          if (count) setSeekers(count);
        });
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Link href="/partner" style={{
            width: 56,
            height: 56,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(192,96,16,0.18)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(192,96,16,0.22)",
            borderRadius: "50%",
            color: "var(--accent)",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(120,80,30,0.14)",
            position: "relative",
            fontSize: 24,
          }}>
            <span aria-hidden="true">🤝</span>
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
          <span style={{
            fontSize: 9,
            lineHeight: 1.15,
            color: "var(--muted)",
            textAlign: "center",
            maxWidth: 76,
            letterSpacing: "0.01em",
          }}>
            Find study partner
          </span>
        </div>
      )}

      {!hideSupport && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Link href="/support" style={{
            width: 56,
            height: 56,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,253,248,0.62)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(120,80,30,0.15)",
            borderRadius: "50%",
            color: "var(--ink-soft)",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(120,80,30,0.12)",
            fontSize: 24,
          }}>
            <span aria-hidden="true">💙</span>
          </Link>
          <span style={{
            fontSize: 9,
            lineHeight: 1.15,
            color: "var(--muted)",
            textAlign: "center",
            maxWidth: 76,
            letterSpacing: "0.01em",
          }}>
            Group chat with peers
          </span>
        </div>
      )}

    </div>
  );
}
