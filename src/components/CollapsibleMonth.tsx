"use client";

import { useState } from "react";

export default function CollapsibleMonth({
  label,
  liveCount,
  totalPlanned,
  defaultOpen,
  children,
}: {
  label: string;
  liveCount: number;
  totalPlanned: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 12 }}>
      {/* ── Toggle header ──────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderRadius: open ? "16px 16px 0 0" : 16,
          border: "1px solid var(--line)",
          borderBottom: open ? "1px solid transparent" : "1px solid var(--line)",
          background: open ? "var(--card)" : "var(--panel)",
          cursor: "pointer",
          transition: "border-radius 0.15s",
          textAlign: "left",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--ink-strong)",
            letterSpacing: "-0.01em",
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            {label}
          </h2>
          {liveCount > 0 ? (
            <span style={{
              background: "rgba(22,163,74,0.1)", color: "#16a34a",
              border: "1px solid rgba(22,163,74,0.25)",
              borderRadius: 20, padding: "2px 9px",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {liveCount}/{totalPlanned} live
            </span>
          ) : (
            <span style={{
              fontSize: 11, color: "var(--line-hi)",
              fontFamily: "monospace", letterSpacing: "0.04em", flexShrink: 0,
            }}>
              coming soon
            </span>
          )}
        </div>
        <span style={{
          fontSize: 18,
          color: "var(--muted)",
          flexShrink: 0,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
          lineHeight: 1,
        }}>
          ▾
        </span>
      </button>

      {/* ── Collapsible content ────────────────────────── */}
      {open && (
        <div style={{
          border: "1px solid var(--line)",
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          padding: "16px",
          background: "var(--card)",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
