"use client";

import { useEffect, useState } from "react";

type Props = {
  storageId: string;
};

type AtlasStatus = "none" | "revise" | "weak" | "ready";

type AtlasLocalState = {
  status: AtlasStatus;
  note: string;
};

const DEFAULT_STATE: AtlasLocalState = {
  status: "none",
  note: "",
};

function readState(storageId: string): AtlasLocalState {
  try {
    const raw = localStorage.getItem(storageId);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AtlasLocalState>;
    return {
      status: parsed.status ?? "none",
      note: parsed.note ?? "",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function AtlasStudyTools({ storageId }: Props) {
  const [state, setState] = useState<AtlasLocalState>(DEFAULT_STATE);

  useEffect(() => {
    setState(readState(storageId));
  }, [storageId]);

  function write(next: AtlasLocalState) {
    setState(next);
    try {
      localStorage.setItem(storageId, JSON.stringify(next));
    } catch {}
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 18,
        border: "1px solid var(--line)",
        background: "rgba(255,253,248,0.8)",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 8,
          }}
        >
          Revision Status
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { value: "revise", label: "Revise" },
            { value: "weak", label: "Weak Area" },
            { value: "ready", label: "Ready" },
          ].map((item) => {
            const active = state.status === item.value;
            return (
              <button
                key={item.value}
                onClick={() =>
                  write({
                    ...state,
                    status: active ? "none" : (item.value as AtlasStatus),
                  })
                }
                style={{
                  borderRadius: 999,
                  border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
                  background: active ? "var(--accent-soft)" : "var(--card)",
                  color: active ? "var(--accent)" : "var(--ink-soft)",
                  padding: "7px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <label style={{ display: "block" }}>
        <span
          style={{
            display: "block",
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 8,
          }}
        >
          Your Revision Note
        </span>
        <textarea
          value={state.note}
          onChange={(event) =>
            write({
              ...state,
              note: event.target.value,
            })
          }
          placeholder="Write your own recall cue, trap, or Bihar angle here."
          style={{
            width: "100%",
            minHeight: 88,
            resize: "vertical",
            borderRadius: 14,
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink-strong)",
            padding: 12,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        />
      </label>
    </div>
  );
}
