"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const MONTHS = [
  "2026-04",
  "2026-03",
  "2026-02",
  "2026-01",
  "2025-12",
  "2025-11",
  "2025-10",
  "2025-09",
  "2025-08",
  "2025-07",
  "2025-06",
  "2025-05",
  "2025-04",
] as const;

export const SETS_PER_MONTH = 15;

export type StudySetProgressRow = {
  user_id: string;
  month: string;
  set_name: string;
  marked_card_ids: number[] | null;
  categories: string[] | null;
  cards_completed: number;
  started_at: string;
  last_read_at: string;
};

export type QuizProgressRow = {
  user_id: string;
  month: string;
  set_name: string;
  title: string | null;
  latest_score: number;
  max_score: number;
  percentage: number;
  qualified: boolean;
  time_taken: number | null;
  attempts_count: number;
  best_score: number;
  best_percentage: number;
  latest_attempt_answers?: Record<string, number> | null;
  best_attempt_answers?: Record<string, number> | null;
  best_time_taken?: number | null;
  first_attempted_at: string;
  last_attempted_at: string;
};

export type QuizPayload = {
  title?: string;
  score?: number;
  maxScore?: number;
  qualified?: boolean;
  timeTaken?: number;
  month?: string;
  setName?: string;
  date?: string;
  answers?: Record<string, number>;
  bestScore?: number;
  bestPercentage?: number;
  bestAttemptAnswers?: Record<string, number>;
  bestTimeTaken?: number;
};

export type LocalStudySnapshot = {
  month: string;
  setName: string;
  label: string;
  markedCardIds: number[];
  categories: string[];
  cardsCompleted: number;
  startedAt?: string;
  lastReadAt: string;
};

export type LocalQuizSnapshot = {
  month: string;
  setName: string;
  label: string;
  title?: string;
  latestScore: number;
  maxScore: number;
  percentage: number;
  qualified: boolean;
  timeTaken?: number;
  attemptsCount: number;
  bestScore: number;
  bestPercentage: number;
  answers?: Record<string, number>;
  bestAttemptAnswers?: Record<string, number>;
  bestTimeTaken?: number;
  firstAttemptedAt: string;
  lastAttemptedAt: string;
};

export function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
  });
}

export function formatSetLabel(month: string, setName: string) {
  const normalized = normalizeSetName(setName);
  const setNum = normalized.match(/(\d+)/)?.[1] ?? "1";
  const lang = normalized.endsWith("-english") ? " English" : normalized.endsWith("-hindi") ? " Hindi" : "";
  return `${monthLabel(month)} - Study Set ${setNum}/15${lang}`;
}

export function formatQuizSetLabel(month: string, setName: string) {
  const normalized = normalizeSetName(setName);
  const setNum = normalized.match(/(\d+)/)?.[1] ?? "1";
  const lang = normalized.endsWith("-english") ? " English" : normalized.endsWith("-hindi") ? " Hindi" : "";
  return `${monthLabel(month)} - Quiz Set ${setNum}/15${lang}`;
}

export function normalizeSetName(setName: string) {
  if (!setName) return setName;
  if (/-(english|hindi)$/.test(setName)) return setName;
  if (/^set-\d+$/.test(setName)) return `${setName}-english`;
  return setName;
}

export function plannedSetUniverse() {
  return MONTHS.flatMap((month) =>
    Array.from({ length: SETS_PER_MONTH }, (_, index) => {
      const setName = `set-${index + 1}-english`;
      return {
        id: `${month}:${setName}`,
        month,
        setName,
        label: formatSetLabel(month, setName),
      };
    })
  );
}

export function getSupabaseClientOrNull() {
  try {
    return getSupabaseBrowserClient();
  } catch {
    return null;
  }
}

export async function getCurrentSession(supabase?: SupabaseClient) {
  const client = supabase ?? getSupabaseClientOrNull();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session ?? null;
}

export function readLocalStudyProgress() {
  const studyMap = new Map<string, LocalStudySnapshot>();
  const quizMap = new Map<string, LocalQuizSnapshot>();

  if (typeof window === "undefined") {
    return { studySets: [], quizzes: [] };
  }

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (key.startsWith("bpsc_") && !key.startsWith("bpsc_quiz_")) {
      const parts = key.split("_");
      const month = parts[1];
      const setName = normalizeSetName(parts[2]);
      const cardId = Number(parts[3]);
      if (!month || !setName || Number.isNaN(cardId)) continue;

      const existing = studyMap.get(`${month}:${setName}`) ?? {
        month,
        setName,
        label: formatSetLabel(month, setName),
        markedCardIds: [],
        categories: [],
        cardsCompleted: 0,
        lastReadAt: new Date().toISOString(),
      };

      if (!existing.markedCardIds.includes(cardId)) {
        existing.markedCardIds.push(cardId);
      }

      const rawCategories = localStorage.getItem(key) ?? "";
      const nextCategories = rawCategories
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      existing.categories = Array.from(new Set([...existing.categories, ...nextCategories]));
      existing.cardsCompleted = existing.markedCardIds.length;
      studyMap.set(`${month}:${setName}`, existing);
    }

    if (key.startsWith("bpsc_quiz_")) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as QuizPayload;
        const month = parsed.month ?? key.split("_")[2];
        const setName = normalizeSetName(parsed.setName ?? key.split("_").slice(3).join("_"));
        if (!month || !setName) continue;
        const score = parsed.score ?? 0;
        const maxScore = parsed.maxScore ?? 0;
        const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
        const attemptedAt = parsed.date ?? new Date().toISOString();
        quizMap.set(`${month}:${setName}`, {
          month,
          setName,
          label: formatSetLabel(month, setName),
          title: parsed.title,
          latestScore: score,
          maxScore,
          percentage,
          qualified: Boolean(parsed.qualified),
          timeTaken: parsed.timeTaken,
          attemptsCount: 1,
          bestScore: parsed.bestScore ?? score,
          bestPercentage: parsed.bestPercentage ?? percentage,
          answers: parsed.answers,
          bestAttemptAnswers: parsed.bestAttemptAnswers ?? parsed.answers,
          bestTimeTaken: parsed.bestTimeTaken ?? parsed.timeTaken,
          firstAttemptedAt: attemptedAt,
          lastAttemptedAt: attemptedAt,
        });
      } catch {
        continue;
      }
    }
  }

  return {
    studySets: Array.from(studyMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    quizzes: Array.from(quizMap.values()).sort((a, b) => b.label.localeCompare(a.label)),
  };
}

export async function ensureProfileRow(session: Session, supabase?: SupabaseClient) {
  const client = supabase ?? getSupabaseBrowserClient();
  const user = session.user;
  await (client.from("profiles") as never as { upsert: (value: Record<string, unknown>) => Promise<unknown> }).upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    email: user.email ?? null,
    updated_at: new Date().toISOString(),
  });
}

export async function saveStudyCardProgress(args: {
  month: string;
  setName: string;
  cardId: number;
  categories: string[];
  done: boolean;
}) {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return;
  const session = await getCurrentSession(supabase);
  if (!session) return;

  const { month, setName, cardId, categories, done } = args;
  const userId = session.user.id;
  const studyTable = supabase.from("study_set_progress") as unknown as {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: unknown }> };
        };
      };
    };
    delete: () => {
      eq: (column: string, value: string) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => Promise<unknown>;
        };
      };
    };
    upsert: (value: Record<string, unknown>) => Promise<unknown>;
  };

  const { data } = await studyTable
    .select("marked_card_ids, categories, started_at")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("set_name", setName)
    .maybeSingle();
  const existing = (data ?? null) as Pick<StudySetProgressRow, "marked_card_ids" | "categories" | "started_at"> | null;

  const currentCardIds = new Set<number>((existing?.marked_card_ids ?? []).map(Number));
  if (done) currentCardIds.add(cardId);
  else currentCardIds.delete(cardId);

  const nextCardIds = Array.from(currentCardIds).sort((a, b) => a - b);
  const nextCategories = Array.from(new Set([...(existing?.categories ?? []), ...categories]));

  if (nextCardIds.length === 0) {
    await studyTable
      .delete()
      .eq("user_id", userId)
      .eq("month", month)
      .eq("set_name", setName);
    return;
  }

  await studyTable.upsert({
    user_id: userId,
    month,
    set_name: setName,
    marked_card_ids: nextCardIds,
    categories: nextCategories,
    cards_completed: nextCardIds.length,
    started_at: existing?.started_at ?? new Date().toISOString(),
    last_read_at: new Date().toISOString(),
  });
}

export async function saveQuizProgress(args: {
  month: string;
  setName: string;
  title: string;
  score: number;
  maxScore: number;
  qualified: boolean;
  timeTaken: number;
  answers: Record<number, number>;
}) {
  const supabase = getSupabaseClientOrNull();
  if (!supabase) return;
  const session = await getCurrentSession(supabase);
  if (!session) return;

  const { month, title, score, maxScore, qualified, timeTaken, answers } = args;
  const setName = normalizeSetName(args.setName);
  const userId = session.user.id;
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
  const now = new Date().toISOString();

  const quizTable = supabase.from("quiz_progress") as unknown as {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: unknown }> };
        };
      };
    };
    upsert: (value: Record<string, unknown>) => Promise<unknown>;
  };

  const { data } = await quizTable
    .select("attempts_count, best_score, best_percentage, first_attempted_at, best_attempt_answers, best_time_taken")
    .eq("user_id", userId)
    .eq("month", month)
    .eq("set_name", setName)
    .maybeSingle();
  const existing = (data ?? null) as Pick<
    QuizProgressRow,
    "attempts_count" | "best_score" | "best_percentage" | "first_attempted_at" | "best_attempt_answers" | "best_time_taken"
  > | null;
  const isFirstAttempt = !existing || (existing.attempts_count ?? 0) === 0;
  const isBestAttempt = score >= (existing?.best_score ?? Number.NEGATIVE_INFINITY);

  await quizTable.upsert({
    user_id: userId,
    month,
    set_name: setName,
    title,
    latest_score: score,
    max_score: maxScore,
    percentage,
    qualified,
    time_taken: timeTaken,
    latest_attempt_answers: answers,
    attempts_count: (existing?.attempts_count ?? 0) + 1,
    // first_score is set once and never updated — used for leaderboard to prevent retake cheating
    ...(isFirstAttempt ? { first_score: score } : {}),
    best_score: Math.max(existing?.best_score ?? 0, score),
    best_percentage: Math.max(existing?.best_percentage ?? 0, percentage),
    best_attempt_answers: isBestAttempt ? answers : existing?.best_attempt_answers ?? null,
    best_time_taken: isBestAttempt ? timeTaken : existing?.best_time_taken ?? null,
    first_attempted_at: existing?.first_attempted_at ?? now,
    last_attempted_at: now,
  });
}

export async function syncLocalProgressToSupabase(session: Session, supabase?: SupabaseClient) {
  const client = supabase ?? getSupabaseBrowserClient();
  await ensureProfileRow(session, client);

  const { studySets, quizzes } = readLocalStudyProgress();
  const userId = session.user.id;

  if (studySets.length) {
    await ((client.from("study_set_progress") as never as {
      upsert: (value: Record<string, unknown>[]) => Promise<unknown>;
    }).upsert(
      studySets.map((item) => ({
        user_id: userId,
        month: item.month,
        set_name: item.setName,
        marked_card_ids: item.markedCardIds,
        categories: item.categories,
        cards_completed: item.cardsCompleted,
        started_at: item.startedAt ?? item.lastReadAt,
        last_read_at: item.lastReadAt,
      }))
    ));
  }

  if (quizzes.length) {
    await ((client.from("quiz_progress") as never as {
      upsert: (value: Record<string, unknown>[]) => Promise<unknown>;
    }).upsert(
      quizzes.map((item) => ({
        user_id: userId,
        month: item.month,
        set_name: normalizeSetName(item.setName),
        title: item.title ?? item.label,
        latest_score: item.latestScore,
        max_score: item.maxScore,
        percentage: item.percentage,
        qualified: item.qualified,
        time_taken: item.timeTaken ?? null,
        attempts_count: item.attemptsCount,
        best_score: item.bestScore,
        best_percentage: item.bestPercentage,
        latest_attempt_answers: item.answers ?? null,
        best_attempt_answers: item.bestAttemptAnswers ?? item.answers ?? null,
        best_time_taken: item.bestTimeTaken ?? item.timeTaken ?? null,
        first_attempted_at: item.firstAttemptedAt,
        last_attempted_at: item.lastAttemptedAt,
      }))
    ));
  }
}
