"use client";

import { useEffect, useState } from "react";

type CatStat = { cat: string; label: string; color: string; count: number };

const CAT_META: Record<string, { label: string; color: string }> = {
  polity:  { label: "Polity",      color: "#b86117" },
  economy: { label: "Economy",     color: "#2d7a4f" },
  history: { label: "History",     color: "#5b4fcf" },
  bihar:   { label: "Bihar Focus", color: "#c04a00" },
  geo:     { label: "Geography",   color: "#0e7490" },
  st:      { label: "Sci & Tech",  color: "#6d28d9" },
  env:     { label: "Environment", color: "#15803d" },
  world:   { label: "World",       color: "#1d4ed8" },
};

function buildArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startAngle));
  const y1 = cy + r * Math.sin(rad(startAngle));
  const x2 = cx + r * Math.cos(rad(endAngle));
  const y2 = cy + r * Math.sin(rad(endAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function ProgressChart() {
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<CatStat[]>([]);

  useEffect(() => {
    const catCount: Record<string, number> = {};
    let t = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("bpsc_")) continue;
      const val = localStorage.getItem(key) ?? "";
      t++;
      val.split(",").forEach((cat) => {
        if (cat) catCount[cat] = (catCount[cat] || 0) + 1;
      });
    }
    setTotal(t);
    const s = Object.entries(catCount)
      .map(([cat, count]) => ({
        cat,
        label: CAT_META[cat]?.label ?? cat,
        color: CAT_META[cat]?.color ?? "#888",
        count,
      }))
      .sort((a, b) => b.count - a.count);
    setStats(s);
  }, []);

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>No cards completed yet.</p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Start studying to see your progress here.</p>
      </div>
    );
  }

  // Build donut chart segments
  const CX = 80, CY = 80, R = 58, INNER = 34;
  const segments: { path: string; color: string; label: string; count: number }[] = [];
  let angle = -90;
  const catTotal = stats.reduce((s, x) => s + x.count, 0);

  for (const s of stats) {
    const sweep = (s.count / catTotal) * 360;
    if (sweep < 1) continue;
    const endAngle = angle + sweep;
    segments.push({ path: buildArc(CX, CY, R, angle, endAngle), color: s.color, label: s.label, count: s.count });
    angle = endAngle;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        {/* Donut SVG */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={160} height={160} viewBox="0 0 160 160">
            {/* Background ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={R - INNER} />
            {/* Segments */}
            {segments.map((seg, i) => (
              <path
                key={i}
                d={seg.path}
                fill="none"
                stroke={seg.color}
                strokeWidth={R - INNER}
                strokeLinecap="butt"
              />
            ))}
            {/* Inner label */}
            <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--ink-strong)" fontSize={20} fontWeight="700" fontFamily="var(--font-display)">
              {total}
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" fill="var(--muted)" fontSize={9} letterSpacing="0.12em" fontFamily="monospace">
              DONE
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {stats.map((s) => (
            <div key={s.cat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "var(--ink-strong)", flex: 1 }}>{s.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: s.color,
                }}
              >
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
