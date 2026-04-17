"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupportButton() {
  const pathname = usePathname();
  if (pathname === "/support") return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "calc(70px + env(safe-area-inset-bottom))",
      right: 14,
      zIndex: 190,
      pointerEvents: "auto",
    }}>
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
    </div>
  );
}
