export type CATheme = {
  slug: string;
  title: string;
  shortTitle: string;
  emoji: string;
  accent: string;
  description: string;
  cta: string;
  promise: string;
};

export type MonthPlan = {
  slug: string;
  label: string;
  pitch: string;
};

export type SetBlueprint = {
  number: number;
  title: string;
  angle: string;
  vibe: string;
};

export const CA_THEMES: CATheme[] = [
  {
    slug: "polity",
    title: "Polity",
    shortTitle: "Polity",
    emoji: "🏛️",
    accent: "#b86117",
    description: "Constitution, governance, amendments, institutions, rights, federalism and statecraft.",
    cta: "Open Constitutional Track",
    promise: "Current events mapped to articles, amendments, judgements and Bihar governance examples.",
  },
  {
    slug: "economy",
    title: "Economy",
    shortTitle: "Economy",
    emoji: "💰",
    accent: "#2d7a4f",
    description: "Budget, banking, taxation, agriculture economy, growth, inflation, schemes and livelihoods.",
    cta: "Open Economy Track",
    promise: "Macro headlines translated into exam-ready public finance, growth and Bihar economy notes.",
  },
  {
    slug: "bihar-special",
    title: "Bihar Special",
    shortTitle: "Bihar",
    emoji: "🌾",
    accent: "#c04a00",
    description: "State-specific schemes, geography, history, administration, economy and district-level memory hooks.",
    cta: "Open Bihar Track",
    promise: "Every month’s current affairs filtered through the exact Bihar angle BPSC students need.",
  },
  {
    slug: "geography",
    title: "Geography",
    shortTitle: "Geography",
    emoji: "🗺️",
    accent: "#0e7490",
    description: "Physical geography, resources, rivers, transport, mapping, Bihar geography and location logic.",
    cta: "Open Geography Track",
    promise: "Current issues connected to maps, regions, corridors, climate zones and Bihar spatial recall.",
  },
  {
    slug: "environment",
    title: "Environment",
    shortTitle: "Environment",
    emoji: "🌿",
    accent: "#15803d",
    description: "Climate, biodiversity, conservation, pollution, disaster, sustainability and environmental governance.",
    cta: "Open Environment Track",
    promise: "Environment in a layered format: concept, convention, species, policy and Bihar relevance.",
  },
  {
    slug: "science-tech",
    title: "Science & Tech",
    shortTitle: "Sci-Tech",
    emoji: "🔬",
    accent: "#6d28d9",
    description: "Digital public infrastructure, innovation, AI, space, defence tech, health tech and research policy.",
    cta: "Open Sci-Tech Track",
    promise: "Tech topics explained in plain language with government relevance and likely exam traps.",
  },
  {
    slug: "history-culture",
    title: "History / Culture",
    shortTitle: "History",
    emoji: "📜",
    accent: "#5b4fcf",
    description: "Modern history, culture, heritage, personalities, festivals, art forms and Bihar cultural memory.",
    cta: "Open History Track",
    promise: "News-linked culture and history structured for both recall and interpretation-based questions.",
  },
  {
    slug: "international",
    title: "International",
    shortTitle: "International",
    emoji: "🌍",
    accent: "#1d4ed8",
    description: "Diplomacy, multilateral bodies, strategic affairs, neighbourhood, global trends and India’s positioning.",
    cta: "Open IR Track",
    promise: "Foreign affairs stripped of noise and rebuilt around institutions, interests and exam-friendly context.",
  },
  {
    slug: "fast-track",
    title: "Fast Track Buckets",
    shortTitle: "Fast Track",
    emoji: "⚡",
    accent: "#d97706",
    description: "Awards, books, sports, reports, army exercises, appointments, policies and judgements.",
    cta: "Open Rapid Revision Track",
    promise: "Short-form, high-hit-rate sections for factual coverage that still feel premium and organised.",
  },
];

export const MONTH_PLANS: MonthPlan[] = [
  { slug: "2026-04", label: "April 2026", pitch: "Launch month with atlas-style study sets and premium revision UX." },
  { slug: "2026-03", label: "March 2026", pitch: "Fast-moving governance, economy and defence stories in a tighter exam window." },
  { slug: "2026-02", label: "February 2026", pitch: "Budget-prep energy, policy shifts and institution-heavy current affairs." },
  { slug: "2026-01", label: "January 2026", pitch: "New-year policy momentum, summits, state action and revision layering." },
  { slug: "2025-12", label: "December 2025", pitch: "Year-end reports, rankings, diplomacy and trend-based consolidation." },
  { slug: "2025-11", label: "November 2025", pitch: "Festival-season policy, agriculture, environment and Bihar-linked stories." },
];

export const SET_BLUEPRINTS: SetBlueprint[] = [
  {
    number: 1,
    title: "Power, Governance and Judgement Watch",
    angle: "Polity, governance, Bihar administration and major legal directions.",
    vibe: "High-utility constitutional and governance build.",
  },
  {
    number: 2,
    title: "Money, Markets and Rural Livelihoods",
    angle: "Economy, agriculture, schemes, Bihar economy and public finance.",
    vibe: "Budget-smart and livelihood-driven coverage.",
  },
  {
    number: 3,
    title: "Maps, Climate and Bihar Terrain",
    angle: "Geography, environment, disaster, rivers and region-based revision.",
    vibe: "Strong static anchoring with visual recall value.",
  },
  {
    number: 4,
    title: "Tech, Defence and Global Motion",
    angle: "Science-tech, security, space, strategic affairs and international developments.",
    vibe: "Explainer-led, modern and high-curiosity set.",
  },
  {
    number: 5,
    title: "Culture, Fast Track and Revision Lock",
    angle: "History, culture, awards, books, sports, reports and mixed monthly revision.",
    vibe: "Compact finish with retention-heavy polish.",
  },
];

export function monthCodeToLabel(code: string) {
  const [year, month] = code.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function getThemeBySlug(slug: string) {
  return CA_THEMES.find((theme) => theme.slug === slug);
}
