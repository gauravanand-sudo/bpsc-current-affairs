export type UpscPrelimsQuestion = {
  number: number;
  question: string;
  options: string[];
  subject?: string;
  topic?: string;
  subtopic?: string;
};

export type UpscPrelimsPaper = {
  year: number;
  paper: 1 | 2;
  title: string;
  questions: UpscPrelimsQuestion[];
};

/**
 * Native OneShot GS UPSC Prelims question bank.
 *
 * Exact paper text should be populated only from source files the publisher is
 * authorised to reproduce. Keeping the data separate from the page means a
 * parsed year can be dropped in without changing the reader UI.
 */
export const UPSC_PRELIMS_PAPERS: Record<string, UpscPrelimsPaper> = {};

export function getUpscPrelimsPaper(year: number, paper: 1 | 2) {
  return UPSC_PRELIMS_PAPERS[`${year}-${paper}`] ?? null;
}
