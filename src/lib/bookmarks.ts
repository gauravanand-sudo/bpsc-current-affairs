const KEY = "bpsc_bookmarks";

export type Bookmark = {
  month: string;
  setName: string;
  cardId: number;
  title: string;
  categories: string[];
  savedAt: string;
};

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(month: string, setName: string, cardId: number): boolean {
  return getBookmarks().some(b => b.month === month && b.setName === setName && b.cardId === cardId);
}

export function toggleBookmark(b: Omit<Bookmark, "savedAt">): boolean {
  try {
    const list = getBookmarks();
    const idx = list.findIndex(x => x.month === b.month && x.setName === b.setName && x.cardId === b.cardId);
    if (idx >= 0) {
      list.splice(idx, 1);
      localStorage.setItem(KEY, JSON.stringify(list));
      return false;
    } else {
      list.unshift({ ...b, savedAt: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
      return true;
    }
  } catch {
    return false;
  }
}
