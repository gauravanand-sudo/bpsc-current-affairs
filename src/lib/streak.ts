const KEY = "bpsc_streak";

type StreakData = {
  streak: number;
  longest: number;
  lastDate: string; // YYYY-MM-DD
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { streak: 0, longest: 0, lastDate: "" };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { streak: 0, longest: 0, lastDate: "" };
  }
}

export function recordActivity(): StreakData {
  try {
    const t = today();
    const data = getStreak();

    if (data.lastDate === t) return data; // already recorded today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = data.lastDate === yesterday ? data.streak + 1 : 1;
    const updated: StreakData = {
      streak: newStreak,
      longest: Math.max(newStreak, data.longest),
      lastDate: t,
    };
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return { streak: 1, longest: 1, lastDate: today() };
  }
}
