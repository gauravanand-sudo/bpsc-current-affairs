"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  const pagesWithBottomInput = ["/support", "/partner", "/ask"];
  if (pagesWithBottomInput.includes(pathname)) return null;
  if (pathname.endsWith("/quiz")) return null;

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(120, 80, 30, 0.12)",
        padding: "16px 20px 22px",
        textAlign: "center",
        background: "rgba(255, 253, 248, 0.72)",
      }}
    >
      <p
        style={{
          fontSize: 13,
          color: "#8a7260",
          lineHeight: 1.6,
        }}
      >
        Made with <span style={{ color: "#dc2626" }}>♥</span> for Bihar Students
      </p>
    </footer>
  );
}
