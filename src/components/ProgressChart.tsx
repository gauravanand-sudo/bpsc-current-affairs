"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  SETS_PER_MONTH,
  formatQuizSetLabel,
  formatSetLabel,
  normalizeSetName,
  plannedSetUniverse,
  readLocalStudyProgress,
  syncLocalProgressToSupabase,
  type QuizProgressRow,
  type StudySetProgressRow,
} from "@/lib/progress";

type QuizRecord = {
  score?: number;
  maxScore?: number;
  qualified?: boolean;
  month?: string;
  setName?: string;
  title?: string;
};

type SetSummary = {
  id: string;
  month: string;
  setName: string;
  label: string;
  cardsCompleted?: number;
  categories?: string[];
  lastReadAt?: string;
};

function percent(value: number, total: number) {
  return Math.round((value / Math.max(total, 1)) * 100);
}

export default function ProgressChart() {
  const [readSets, setReadSets] = useState<SetSummary[]>([]);
  const [quizRecords, setQuizRecords] = useState<Array<QuizRecord & { id: string; label: string; attemptsCount?: number; bestScore?: number }>>([]);
  const [syncLabel, setSyncLabel] = useState("Syncing progress...");

  const allPlannedSets = useMemo(() => plannedSetUniverse(), []);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (!session) {
        const local = readLocalStudyProgress();
        if (!active) return;
        setReadSets(
          local.studySets.map((item) => ({
            id: `${item.month}:${normalizeSetName(item.setName)}`,
            month: item.month,
            setName: normalizeSetName(item.setName),
            label: formatSetLabel(item.month, normalizeSetName(item.setName)),
            cardsCompleted: item.cardsCompleted,
            categories: item.categories,
            lastReadAt: item.lastReadAt,
          }))
        );
        setQuizRecords(
          local.quizzes.map((item) => ({
            id: `${item.month}:${normalizeSetName(item.setName)}`,
            label: formatQuizSetLabel(item.month, normalizeSetName(item.setName)),
            month: item.month,
            setName: normalizeSetName(item.setName),
            title: item.title,
            score: item.bestScore ?? item.latestScore,
            maxScore: item.maxScore,
            qualified: item.qualified,
            attemptsCount: item.attemptsCount,
            bestScore: item.bestScore ?? item.latestScore,
          }))
        );
        setSyncLabel("Showing device progress");
        return;
      }

      await syncLocalProgressToSupabase(session, supabase);

      const [{ data: studyRows }, { data: quizRows }] = await Promise.all([
        supabase
          .from("study_set_progress")
          .select("user_id, month, set_name, marked_card_ids, categories, cards_completed, started_at, last_read_at")
          .eq("user_id", session.user.id)
          .order("last_read_at", { ascending: false }),
        supabase
          .from("quiz_progress")
          .select("user_id, month, set_name, title, latest_score, max_score, percentage, qualified, time_taken, attempts_count, best_score, best_percentage, first_attempted_at, last_attempted_at")
          .eq("user_id", session.user.id)
          .order("last_attempted_at", { ascending: false }),
      ]);

      if (!active) return;

      setReadSets(
        ((studyRows ?? []) as StudySetProgressRow[]).map((row) => ({
          id: `${row.month}:${normalizeSetName(row.set_name)}`,
          month: row.month,
          setName: normalizeSetName(row.set_name),
          label: formatSetLabel(row.month, normalizeSetName(row.set_name)),
          cardsCompleted: row.cards_completed,
          categories: row.categories ?? [],
          lastReadAt: row.last_read_at,
        }))
      );

      setQuizRecords(
        ((quizRows ?? []) as QuizProgressRow[]).map((row) => ({
          id: `${row.month}:${normalizeSetName(row.set_name)}`,
          label: formatQuizSetLabel(row.month, normalizeSetName(row.set_name)),
          month: row.month,
          setName: normalizeSetName(row.set_name),
          title: row.title ?? undefined,
          score: row.best_score,
          maxScore: row.max_score,
          qualified: row.qualified,
          attemptsCount: row.attempts_count,
          bestScore: row.best_score,
        }))
      );
      setSyncLabel("Cloud sync active");
    }

    void loadProgress();
    return () => {
      active = false;
    };
  }, []);

  const consolidatedReadSets = useMemo(() => {
    const map = new Map<string, SetSummary>();
    for (const item of readSets) {
      const normalizedSetName = normalizeSetName(item.setName);
      const id = `${item.month}:${normalizedSetName}`;
      const existing = map.get(id);
      if (!existing) {
        map.set(id, {
          ...item,
          id,
          setName: normalizedSetName,
          label: formatSetLabel(item.month, normalizedSetName),
          cardsCompleted: item.cardsCompleted ?? 0,
        });
      } else {
        map.set(id, {
          ...existing,
          cardsCompleted: Math.max(existing.cardsCompleted ?? 0, item.cardsCompleted ?? 0),
          lastReadAt:
            existing.lastReadAt && item.lastReadAt
              ? new Date(existing.lastReadAt) > new Date(item.lastReadAt)
                ? existing.lastReadAt
                : item.lastReadAt
              : existing.lastReadAt ?? item.lastReadAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => (b.lastReadAt ?? "").localeCompare(a.lastReadAt ?? ""));
  }, [readSets]);

  const consolidatedQuizRecords = useMemo(() => {
    const map = new Map<string, QuizRecord & { id: string; label: string; attemptsCount?: number; bestScore?: number }>();
    for (const item of quizRecords) {
      const normalizedSetName = normalizeSetName(item.setName ?? "");
      const label = formatQuizSetLabel(item.month ?? "", normalizedSetName);
      const existing = map.get(label);
      if (!existing) {
        map.set(label, { ...item, id: label, setName: normalizedSetName, label });
      } else {
        const bestScore = Math.max(Number(existing.bestScore ?? existing.score ?? 0), Number(item.bestScore ?? item.score ?? 0));
        map.set(label, {
          ...existing,
          score: bestScore,
          bestScore,
          maxScore: Math.max(Number(existing.maxScore ?? 0), Number(item.maxScore ?? 0)),
          qualified: Boolean(existing.qualified || item.qualified),
          attemptsCount: Math.max(Number(existing.attemptsCount ?? 1), Number(item.attemptsCount ?? 1)),
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [quizRecords]);

  const readSetIds = new Set(consolidatedReadSets.map((item) => item.id));
  const pendingSets = allPlannedSets.filter((item) => !readSetIds.has(item.id));
  const attemptedQuizIds = new Set(consolidatedQuizRecords.map((item) => `${item.month}:${normalizeSetName(item.setName ?? "")}`));
  const pendingQuizSets = consolidatedReadSets.filter((item) => !attemptedQuizIds.has(item.id));
  const avgScore = consolidatedQuizRecords.length
    ? Math.round(
        consolidatedQuizRecords.reduce((sum, item) => sum + ((item.score ?? 0) / Math.max(item.maxScore ?? 1, 1)) * 100, 0) /
          consolidatedQuizRecords.length
      )
    : 0;

  const latestReadSet = consolidatedReadSets[0];
  const nextStudySet = pendingSets[0];
  const nextQuizSet = pendingQuizSets[0];

  const headline =
    consolidatedReadSets.length === 0
      ? "Start the first study set and your full-year progress line will begin."
      : pendingSets.length === 0
        ? "You are on track across the full planned current affairs cycle."
        : `${pendingSets.length} study sets remain. Keep the line moving every day.`;

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 24,
          background: "var(--card)",
          padding: "22px 20px",
        }}
      >
        <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
          Progress Overview
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.1 }}>
          {percent(consolidatedReadSets.length, allPlannedSets.length)}% of your 72nd BPSC plan is tracked
        </p>
        <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>
          {headline} {syncLabel}.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginTop: 18 }}>
          {[
            { label: "Study Sets Done", value: `${consolidatedReadSets.length}/${allPlannedSets.length}` },
            { label: "Quiz Sets Attempted", value: `${consolidatedQuizRecords.length}` },
            {
              label: "Highest Marks",
              value: consolidatedQuizRecords.length
                ? `${Math.max(...consolidatedQuizRecords.map((item) => Number(item.bestScore ?? item.score ?? 0)))}/${Math.max(...consolidatedQuizRecords.map((item) => Number(item.maxScore ?? 0)), 0)}`
                : "0",
            },
            { label: "Cloud Status", value: syncLabel },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid var(--line)", borderRadius: 16, background: "var(--panel)", padding: "14px" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--ink-strong)" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
            Continue Study
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.5 }}>
            {latestReadSet?.label ?? nextStudySet?.label ?? "Start your first study set"}
          </p>
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
            {latestReadSet
              ? `${latestReadSet.cardsCompleted ?? 0} card(s) revised so far in this set.`
              : "Begin the first available set to activate your progress line."}
          </p>
          <Link
            href={latestReadSet ? `/ca/${latestReadSet.month}/${latestReadSet.setName}` : nextStudySet ? `/ca/${nextStudySet.month}/${nextStudySet.setName}` : "/ca"}
            style={{
              marginTop: 14,
              display: "inline-block",
              borderRadius: 12,
              background: "var(--accent)",
              color: "#fff",
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Go To Study Sets
          </Link>
        </div>

        <div style={{ border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)", padding: "18px 16px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
            Next Quiz
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.5 }}>
            {nextQuizSet?.label ?? "You are caught up on available quiz sets"}
          </p>
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
            {nextQuizSet
              ? "Turn your revision into retention with the next pending test."
              : "Open more study sets to unlock the next quiz milestone."}
          </p>
          <Link
            href={nextQuizSet ? `/ca/${nextQuizSet.month}/${nextQuizSet.setName}/quiz` : "/quizzes"}
            style={{
              marginTop: 14,
              display: "inline-block",
              borderRadius: 12,
              background: "var(--panel)",
              color: "var(--ink-strong)",
              border: "1px solid var(--line)",
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Go To Quizzes
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <details
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            overflow: "hidden",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              padding: "18px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                Quiz History
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-strong)" }}>
                {consolidatedQuizRecords.length} quiz set(s) attempted
              </p>
            </div>
            <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>Open</p>
          </summary>
          <div style={{ borderTop: "1px solid var(--line)", padding: "4px 16px 16px", display: "grid", gap: 10 }}>
            {consolidatedQuizRecords.length ? (
              consolidatedQuizRecords.map((item) => {
                const score = Number(item.score ?? 0);
                const maxScore = Number(item.maxScore ?? 0);
                return (
                  <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.45 }}>{item.label}</p>
                        <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                          {Number(item.attemptsCount ?? 1)} attempt(s) · best {Number(item.bestScore ?? score)}/{maxScore}
                        </p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: item.qualified ? "#15803d" : "var(--accent)" }}>
                        {score}/{maxScore}
                      </span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Link
                        href={`/ca/${item.month}/${normalizeSetName(item.setName ?? "")}/quiz?review=best`}
                        style={{
                          display: "inline-block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        Review Quiz →
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ paddingTop: 12, fontSize: 13, color: "var(--muted)" }}>No quiz attempts yet.</p>
            )}
          </div>
        </details>

        <details
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            overflow: "hidden",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              padding: "18px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                Study History
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-strong)" }}>
                {consolidatedReadSets.length} study set(s) opened
              </p>
            </div>
            <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>Open</p>
          </summary>
          <div style={{ borderTop: "1px solid var(--line)", padding: "4px 16px 16px", display: "grid", gap: 10 }}>
            {consolidatedReadSets.length ? (
              consolidatedReadSets.map((item) => {
                return (
                  <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.45 }}>{item.label}</p>
                        <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                          {item.cardsCompleted ?? 0} cards revised
                        </p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{item.cardsCompleted ?? 0}</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Link
                        href={`/ca/${item.month}/${item.setName}`}
                        style={{
                          display: "inline-block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent)",
                        }}
                      >
                        Continue Study →
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ paddingTop: 12, fontSize: 13, color: "var(--muted)" }}>No study sets started yet.</p>
            )}
          </div>
        </details>

        <details
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            overflow: "hidden",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              padding: "18px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                Review Queue
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-strong)" }}>
                {pendingQuizSets.length} pending quiz review path
              </p>
            </div>
            <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>Open</p>
          </summary>
          <div style={{ borderTop: "1px solid var(--line)", padding: "4px 16px 16px", display: "grid", gap: 10 }}>
            {pendingQuizSets.length ? (
              pendingQuizSets.map((item) => (
                <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 1.45 }}>{formatQuizSetLabel(item.month, item.setName)}</p>
                    <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>This study set is opened but its quiz is still pending.</p>
                  </div>
                  <Link
                    href={`/ca/${item.month}/${item.setName}/quiz`}
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    Take Quiz →
                  </Link>
                </div>
              ))
            ) : (
              <p style={{ paddingTop: 12, fontSize: 13, color: "var(--muted)" }}>No pending quiz reviews right now.</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
