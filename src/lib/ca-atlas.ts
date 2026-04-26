export type LegacyBpscItem = {
  id: number;
  emoji: string;
  categories: string[];
  title: string;
  summary: string;
  static_linkages: Record<string, string[]>;
  possible_mcq: string;
};

export type AtlasQuickCheck = {
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type AtlasPyqLink = {
  year: string;
  stage: "Prelims" | "Mains";
  paper: string;
  question: string;
  takeaway: string;
};

export type AtlasStaticBlock = {
  title: string;
  facts: string[];
};

export type AtlasDossier = {
  id: number;
  emoji: string;
  title: string;
  categories: string[];
  examPriority: "High" | "Medium" | "Support";
  inBrief: string;
  whyItMatters: string;
  whatHappened: string[];
  background: string[];
  staticSpine: AtlasStaticBlock[];
  biharAngle: string[];
  pyqLinks: AtlasPyqLink[];
  prelimsTraps: string[];
  mainsFrame: string[];
  mindmap: string[];
  revisionBullets: string[];
  interactivePrompts: string[];
  quickCheck: AtlasQuickCheck;
};

export type AtlasSection = {
  id: string;
  title: string;
  emoji: string;
  categoryKeys: string[];
  themeGoal: string;
  coverageChecklist: string[];
  dossiers: AtlasDossier[];
};

export type StudyAtlasSet = {
  format: "atlas-v1";
  month: string;
  setName: string;
  title: string;
  language: "english" | "hindi";
  studySetsPerMonth: number;
  estimatedMinutes: number;
  intro: string;
  coveragePromise: string[];
  sections: AtlasSection[];
};

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  polity: { label: "Polity & Governance", emoji: "🏛️" },
  economy: { label: "Economy & Development", emoji: "💰" },
  history: { label: "History & Culture", emoji: "📜" },
  bihar: { label: "Bihar Special", emoji: "🌾" },
  geo: { label: "Geography", emoji: "🗺️" },
  st: { label: "Science & Tech", emoji: "🔬" },
  env: { label: "Environment", emoji: "🌿" },
  world: { label: "World Affairs", emoji: "🌍" },
};

function splitMcq(text: string) {
  const [question, answer] = text.split("→").map((part) => part.trim());
  return {
    question: question || "What is the most likely prelims direction from this topic?",
    answer: answer || text,
  };
}

export function isStudyAtlasSet(value: unknown): value is StudyAtlasSet {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StudyAtlasSet>;
  return candidate.format === "atlas-v1" && Array.isArray(candidate.sections);
}

export function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function buildAtlasFromLegacy(
  items: LegacyBpscItem[],
  month: string,
  setName: string
): StudyAtlasSet {
  const sectionMap = new Map<string, AtlasSection>();

  for (const item of items) {
    const primaryCategory = item.categories[0] ?? "polity";
    const meta = CATEGORY_META[primaryCategory] ?? { label: primaryCategory, emoji: item.emoji || "🧭" };
    const existing = sectionMap.get(primaryCategory) ?? {
      id: primaryCategory,
      title: meta.label,
      emoji: meta.emoji,
      categoryKeys: [primaryCategory],
      themeGoal: `Build a reliable ${meta.label.toLowerCase()} chain from current event to static recall to exam framing.`,
      coverageChecklist: [
        "Current event understood",
        "Static facts linked",
        "Bihar relevance extracted",
        "Probable prelims angle revised",
      ],
      dossiers: [],
    };

    const mcq = splitMcq(item.possible_mcq);
    const allFacts = Object.values(item.static_linkages).flat();
    existing.dossiers.push({
      id: item.id,
      emoji: item.emoji,
      title: item.title,
      categories: item.categories,
      examPriority: item.categories.includes("bihar") || item.categories.includes("polity") ? "High" : "Medium",
      inBrief: item.summary,
      whyItMatters: "Use this topic to connect the news event with static recall, Bihar angle, and the most probable prelims trigger.",
      whatHappened: [item.summary],
      background: allFacts.slice(0, 3),
      staticSpine: Object.entries(item.static_linkages).map(([key, facts]) => ({
        title: CATEGORY_META[key]?.label ?? key,
        facts,
      })),
      biharAngle: item.static_linkages.bihar ?? [],
      pyqLinks: [],
      prelimsTraps: [
        mcq.question,
        "Revise the exact article / year / institution mentioned here before the next mock.",
      ],
      mainsFrame: [
        "Use this in a short note by linking the event, core concept, implementation challenge, and Bihar relevance.",
      ],
      mindmap: [
        `${item.emoji} ${item.title}`,
        ...item.categories.map((category) => `${CATEGORY_META[category]?.emoji ?? "•"} ${CATEGORY_META[category]?.label ?? category}`),
        "🧠 Static recall",
        "🎯 Likely exam direction",
      ],
      revisionBullets: allFacts.slice(0, 4),
      interactivePrompts: [
        "Can you explain this event in 20 seconds without looking?",
        "What is the single strongest Bihar angle here?",
      ],
      quickCheck: {
        question: mcq.question,
        answer: mcq.answer,
        explanation: "This was generated from the legacy likely-MCQ direction and should be tightened further during content enrichment.",
      },
    });

    sectionMap.set(primaryCategory, existing);
  }

  return {
    format: "atlas-v1",
    month,
    setName,
    title: `${monthLabel(month)} Study Atlas`,
    language: setName.endsWith("-hindi") ? "hindi" : "english",
    studySetsPerMonth: 15,
    estimatedMinutes: Math.max(25, items.length * 6),
    intro:
      "This set has been auto-upgraded from the older card format into a theme-based atlas so learners can study event -> static -> Bihar -> exam direction in one flow.",
    coveragePromise: [
      "Theme-wise organisation instead of isolated cards",
      "Static linkage blocks for every current affair",
      "Space for revision notes, weakness tags, and self-checks",
      "PYQ-ready structure even where real PYQs are not yet mapped",
    ],
    sections: [...sectionMap.values()],
  };
}
