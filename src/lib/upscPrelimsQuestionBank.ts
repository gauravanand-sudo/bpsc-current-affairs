import * as cheerio from "cheerio";

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

const AVAILABLE_YEARS = new Set(Array.from({ length: 13 }, (_, i) => 2026 - i));

function compact(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,.;:?])/g, "$1")
    .trim();
}

function htmlToLines(html: string) {
  const $ = cheerio.load(html);
  $("script,style,noscript,svg").remove();
  $("br").replaceWith("\n");
  $("p,div,section,article,li,h1,h2,h3,h4,h5,h6,button,tr,td,th").each((_, el) => {
    $(el).prepend("\n");
    $(el).append("\n");
  });

  return $("body")
    .text()
    .replace(/\r/g, "")
    .split("\n")
    .map(compact)
    .filter(Boolean);
}

function finishQuestion(
  output: UpscPrelimsQuestion[],
  number: number | null,
  questionParts: string[],
  options: string[],
) {
  if (!number || !questionParts.length || options.length !== 4 || options.some((x) => !compact(x))) return;
  if (output.some((q) => q.number === number)) return;

  output.push({
    number,
    question: compact(questionParts.join(" ")),
    options: options.map(compact),
  });
}

function parseUnlockIAS(html: string) {
  const lines = htmlToLines(html);
  const output: UpscPrelimsQuestion[] = [];
  let number: number | null = null;
  let questionParts: string[] = [];
  let options: string[] = [];
  let activeOption = -1;

  const reset = () => {
    number = null;
    questionParts = [];
    options = [];
    activeOption = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const qLine = line.match(/^Q:\s*(.+)$/i);

    if (qLine) {
      finishQuestion(output, number, questionParts, options);
      let detected: number | null = null;
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        const m = lines[j].match(/\bQ(\d{1,3})\b/);
        if (m) {
          detected = Number(m[1]);
          break;
        }
      }
      number = detected ?? (output.length + 1);
      questionParts = [qLine[1]];
      options = [];
      activeOption = -1;
      continue;
    }

    if (!number) continue;

    const option = line.match(/^\(([a-d])\)\s*(.*)$/i);
    if (option) {
      activeOption = "abcd".indexOf(option[1].toLowerCase());
      while (options.length <= activeOption) options.push("");
      options[activeOption] = option[2];
      continue;
    }

    if (/^(Show Answer|\[Button:\s*Show Answer\]|View Full Question|Report Issue)/i.test(line)) {
      finishQuestion(output, number, questionParts, options);
      reset();
      continue;
    }

    if (activeOption >= 0 && activeOption < 4) {
      if (!/^UPSC\s+\d{4}$/i.test(line)) options[activeOption] += ` ${line}`;
    } else {
      questionParts.push(line);
    }
  }

  finishQuestion(output, number, questionParts, options);
  return output.sort((a, b) => a.number - b.number);
}

function parsePrayas(html: string) {
  const lines = htmlToLines(html);
  const output: UpscPrelimsQuestion[] = [];
  let number: number | null = null;
  let questionParts: string[] = [];
  let options: string[] = [];
  let activeOption = -1;

  const flush = () => {
    finishQuestion(output, number, questionParts, options);
    number = null;
    questionParts = [];
    options = [];
    activeOption = -1;
  };

  for (const line of lines) {
    const q = line.match(/^Q\s*(\d{1,3})\s*\.\s*(.*)$/i);
    if (q) {
      flush();
      number = Number(q[1]);
      if (q[2]) questionParts.push(q[2]);
      continue;
    }

    if (!number) continue;

    const option = line.match(/^([A-D])\.\s*(.*)$/);
    if (option) {
      activeOption = "ABCD".indexOf(option[1]);
      while (options.length <= activeOption) options.push("");
      options[activeOption] = option[2];
      continue;
    }

    if (/^Question\s+\d+/i.test(line)) continue;
    if (activeOption >= 0) options[activeOption] += ` ${line}`;
    else questionParts.push(line);
  }

  flush();
  return output.sort((a, b) => a.number - b.number);
}

function parseQuizcherry(html: string) {
  const lines = htmlToLines(html);
  const output: UpscPrelimsQuestion[] = [];
  let number: number | null = null;
  let questionParts: string[] = [];
  let options: string[] = [];
  let activeOption = -1;

  const flush = () => {
    finishQuestion(output, number, questionParts, options);
    number = null;
    questionParts = [];
    options = [];
    activeOption = -1;
  };

  for (const line of lines) {
    const q = line.match(/^Question\s+(\d{1,3})\s+of\s+100$/i);
    if (q) {
      flush();
      number = Number(q[1]);
      continue;
    }

    if (!number) continue;

    if (/^Reveal answer$/i.test(line)) {
      flush();
      continue;
    }

    const option = line.match(/^(?:\d+\.\s*)?([A-D])(?:[\s.):-]*)(.+)$/);
    if (option) {
      activeOption = "ABCD".indexOf(option[1]);
      while (options.length <= activeOption) options.push("");
      options[activeOption] = option[2];
      continue;
    }

    if (/^(Correct answer|Explanation|Option\s+[A-D])\b/i.test(line)) continue;
    if (activeOption >= 0) options[activeOption] += ` ${line}`;
    else questionParts.push(line);
  }

  flush();
  return output.sort((a, b) => a.number - b.number);
}

async function loadHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "OneShotGS-PYQ-Reader/1.0",
      accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) throw new Error(`PYQ source returned ${response.status}`);
  return response.text();
}

async function loadGs1(year: number): Promise<UpscPrelimsQuestion[]> {
  if (year >= 2014 && year <= 2024) {
    return parseUnlockIAS(await loadHtml(`https://www.unlockias.in/upsc-prelims-pyq/${year}`));
  }
  if (year === 2025) {
    return parsePrayas(await loadHtml("https://prayas.ai/upsc-prelims-previous-year-question-paper/2025?paper=gs1"));
  }
  if (year === 2026) {
    return parseQuizcherry(await loadHtml("https://quizcherry.com/previous-year-papers/en/upsc-prelims-2026-gs-set-a/"));
  }
  return [];
}

export async function getUpscPrelimsPaper(year: number, paper: 1 | 2) {
  if (!AVAILABLE_YEARS.has(year) || paper !== 1) return null;

  try {
    const questions = await loadGs1(year);
    if (!questions.length) return null;
    return {
      year,
      paper: 1 as const,
      title: `UPSC Prelims ${year} — General Studies Paper I`,
      questions,
    } satisfies UpscPrelimsPaper;
  } catch (error) {
    console.error(`Unable to load UPSC Prelims ${year}:`, error);
    return null;
  }
}

export const UPSC_PRELIMS_AVAILABLE_YEARS = Array.from(AVAILABLE_YEARS).sort((a, b) => b - a);
