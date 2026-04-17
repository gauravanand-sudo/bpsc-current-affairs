import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as cheerio from "cheerio";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const TOPIC_QUERIES = [
  { id: "polity", label: "Polity", query: "India constitution president vice-president parliament UPSC OR PSC" },
  { id: "economy", label: "Economy", query: "India economy regulator companies act RBI SEBI MCA IFSCA" },
  { id: "history", label: "History", query: "India birth anniversary freedom movement national leader history" },
  { id: "geography", label: "Geography", query: "India biodiversity river climate forest geography environment" },
  { id: "science", label: "Science", query: "India science technology AI mission research black hole startup MeitY" },
  { id: "bihar", label: "Bihar", query: "Bihar governance exam current affairs economy polity environment" },
];

const BOOSTER_TEMPLATES = [
  {
    id: "booster-polity-upsc",
    category: "Polity",
    title: "BPSC Booster: UPSC, State PSCs and All India Services",
    summary: "Quick static revision on Public Service Commissions and All India Services for BPSC prelims.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Article 315 provides for Union and State Public Service Commissions.",
      "Articles 315 to 323 deal with composition, appointment, removal, functions, and reports of Public Service Commissions.",
      "UPSC is a constitutional body and State PSCs are also constitutional bodies.",
      "The Chairman and members of UPSC are appointed by the President; State PSC heads are appointed by the Governor.",
      "Article 312 deals with creation of All India Services.",
      "IAS, IPS, and Indian Forest Service are the present All India Services.",
      "All India Services serve both the Union and the States.",
      "BPSC prelims often asks article numbers, appointing authority, and which services fall under AIS."
    ],
  },
  {
    id: "booster-polity-executive",
    category: "Polity",
    title: "BPSC Booster: President, Vice-President and Prime Minister",
    summary: "Static revision on Union Executive offices often asked in BPSC prelims.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Article 52 provides that there shall be a President of India.",
      "Article 63 provides that there shall be a Vice-President of India.",
      "Article 74 provides for a Council of Ministers with the Prime Minister at the head.",
      "Under Article 75, the Prime Minister is appointed by the President.",
      "Under Article 64, the Vice-President is ex officio Chairman of the Rajya Sabha.",
      "Article 65 deals with the Vice-President acting as President.",
      "Article 56 gives the President a term of five years.",
      "BPSC prelims often asks office, election, term, powers, and removal."
    ],
  },
  {
    id: "booster-economy-regulators",
    category: "Economy",
    title: "BPSC Booster: Acts, Regulators and Financial Institutions",
    summary: "Economy static facts focused on laws, regulators, institutions, and headquarters.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Economy prelims commonly tests Act, regulator, institution, full form, and headquarters.",
      "The Companies Act, 2013 is the principal corporate law framework in India.",
      "RBI is India's central bank and SEBI regulates the securities market.",
      "IFSCA regulates financial products and institutions in International Financial Services Centres.",
      "GIFT City in Gujarat is India's major IFSC location.",
      "MCA stands for Ministry of Corporate Affairs.",
      "Questions often ask which regulator governs which sector.",
      "BPSC frequently links current affairs with static economy institutions."
    ],
  },
  {
    id: "booster-history-spectrum",
    category: "History",
    title: "BPSC Booster: Modern History Personality Mapping",
    summary: "Spectrum-style revision on how personalities are asked in prelims.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Modern history questions usually connect personality, year, movement, ideology, and office held.",
      "Post-Independence personalities are often asked through chronology and tenure.",
      "BPSC can connect a current anniversary with a national leader's political role.",
      "Remember office held, associated movement, and time period.",
      "Spectrum-style revision means concise personality-event-year linkage.",
      "Former Prime Ministers are often asked through tenure and sequence.",
      "Chronology-based elimination is common in prelims.",
      "National movement and post-Independence politics both matter for BPSC."
    ],
  },
  {
    id: "booster-geography-environment",
    category: "Environment",
    title: "BPSC Booster: Geography, Environment and Mapping Facts",
    summary: "Static geography revision focused on location, state, river, and protected area linkage.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Geography and environment prelims usually ask location, state, river basin, protected area, and species linkage.",
      "National parks, sanctuaries, biosphere reserves, and Ramsar sites are recurring themes.",
      "Climate and ecology questions often link current events with static geography.",
      "Map-based elimination is a common prelims strategy.",
      "River-based questions may ask tributary, basin, source, and state through which it flows.",
      "Protected area questions may ask state, flagship species, and category.",
      "Biodiversity hotspots and climate agreements are frequent static linkages.",
      "BPSC often prefers factual location-based recall."
    ],
  },
  {
    id: "booster-science-tech",
    category: "Science & Tech",
    title: "BPSC Booster: Science and Technology Recall Sheet",
    summary: "Static science revision focused on institution, concept, mission, and application.",
    ministry: "BPSC Deck Engine",
    facts: [
      "Science prelims usually asks institution, concept, mission, and application.",
      "In technology current affairs, nodal ministry and implementing institution matter a lot.",
      "For AI, revise full form, application area, and ministry handling the mission.",
      "In astronomy, galaxy type, black hole type, and cosmic structure are common fact zones.",
      "Defence technology questions often test abbreviations and system use.",
      "Mission-based science questions may ask objective, institution, and application.",
      "BPSC usually prefers factual science over technical depth.",
      "Short concept-to-application linkage works best in revision cards."
    ],
  },
];

function text(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function parseArgs() {
  const arg = process.argv.find((item) => item.startsWith("--date="));
  const value = arg ? arg.slice("--date=".length) : "";
  if (!value) return todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Use --date=YYYY-MM-DD");
  return value;
}

async function execCurl(args) {
  const { stdout } = await execFileAsync("curl", args, {
    encoding: "utf8",
    maxBuffer: 25 * 1024 * 1024,
  });
  return stdout;
}

async function fetchText(url) {
  return execCurl([
    "--fail-with-body",
    "--silent",
    "--show-error",
    "--location",
    "--compressed",
    "-A",
    USER_AGENT,
    url,
  ]);
}

function isoFromPubDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function inferBundle(haystack) {
  if (/UPSC|Public Service Commission|President|Vice-President|Prime Minister|Rajya Sabha|Constitution|Article/i.test(haystack)) {
    return {
      category: "Polity",
      links: ["Indian Polity", "Constitutional Bodies", "Parliament & Executive"],
    };
  }
  if (/Companies Act|MCA|IFSCA|IICA|bank|economy|regulator|finance|RBI|SEBI/i.test(haystack)) {
    return {
      category: "Economy",
      links: ["Indian Economy", "Banking & Regulation", "Acts & Institutions"],
    };
  }
  if (/history|anniversary|birth anniversary|freedom|leader|movement/i.test(haystack)) {
    return {
      category: "History",
      links: ["Modern Indian History", "National Movement", "Post-Independence India"],
    };
  }
  if (/biodiversity|river|climate|forest|environment|ecology|protected area|park/i.test(haystack)) {
    return {
      category: "Environment",
      links: ["Geography", "Environment & Ecology", "Climate & Conservation"],
    };
  }
  return {
    category: "Science & Tech",
    links: ["Science & Technology", "Institutions & Missions", "Applications"],
  };
}

function buildFacts(title, summary, sourceName = "", category = "") {
  const haystack = `${title} ${summary} ${sourceName}`;
  const facts = [];
  const push = (value) => {
    const cleaned = text(value);
    if (!cleaned || facts.includes(cleaned)) return;
    facts.push(cleaned);
  };

  if (/UPSC|Public Service Commission/i.test(haystack)) {
    push("UPSC is a constitutional body under Article 315 of the Constitution.");
    push("Articles 315 to 323 deal with Public Service Commissions.");
    push("The Chairman and members of UPSC are appointed by the President of India.");
    push("UPSC submits its annual report to the President under Article 323.");
    push("State Public Service Commissions are also constitutional bodies.");
  }
  if (/All India Services|\bIAS\b|\bIPS\b|\bIFoS\b/i.test(haystack)) {
    push("Article 312 deals with creation of All India Services.");
    push("IAS, IPS, and Indian Forest Service are the present All India Services.");
    push("All India Services serve both the Union and the States.");
  }
  if (/President|Vice-President|Prime Minister/i.test(haystack)) {
    push("Articles 52 to 78 cover the Union Executive broadly.");
    push("Article 63 provides that there shall be a Vice-President of India.");
    push("Article 74 provides for a Council of Ministers with the Prime Minister at the head.");
    push("Under Article 64, the Vice-President is ex officio Chairman of the Rajya Sabha.");
  }
  if (/Companies Act|MCA|IICA|IFSCA|GIFT City/i.test(haystack)) {
    push("The Companies Act, 2013 is the principal corporate law framework in India.");
    push("MCA stands for Ministry of Corporate Affairs.");
    push("IFSCA is the unified regulator for IFSCs under the IFSCA Act, 2019.");
    push("GIFT City in Gujarat is India's major International Financial Services Centre.");
  }
  if (/AI|IndiaAI|MeitY|startup/i.test(haystack)) {
    push("MeitY stands for the Ministry of Electronics and Information Technology.");
    push("Artificial intelligence refers to systems performing tasks associated with human intelligence.");
    push("Science prelims usually asks institution, concept, mission, and application.");
  }
  if (/Army|COAS|UAS|C-UAS|Defence/i.test(haystack)) {
    push("COAS stands for Chief of the Army Staff.");
    push("UAS means Unmanned Aerial Systems and C-UAS means Counter-Unmanned Aerial Systems.");
    push("Defence prelims usually tests abbreviations, institutions, and system use.");
  }
  if (/black hole|galax|Milky Way/i.test(haystack)) {
    push("The Milky Way is a barred spiral galaxy.");
    push("Supermassive black holes are generally found near the centers of large galaxies.");
    push("Astronomy prelims often ask concept, structure, and institution.");
  }
  if (/river|biodiversity|climate|forest|ecology|environment/i.test(haystack)) {
    push("Geography and environment prelims often ask location, state, river basin, and protected area linkage.");
    push("Biodiversity hotspots and climate agreements are recurring static themes.");
  }

  if (category === "Polity") push("Laxmikanth-style revision focuses on article, office, election, removal, term, and powers.");
  if (category === "Economy") push("Economy prelims usually asks Act, regulator, institution, and headquarters/location.");
  if (category === "History") push("Spectrum-style revision covers person, year, movement, ideology, and office held.");
  if (category === "Science & Tech") push("Science prelims usually asks institution, concept, mission, and application.");
  if (category === "Environment") push("Geography and environment prelims usually asks place, river, state, sanctuary, park, or species.");

  return facts.slice(0, 10);
}

function cardFromNewsItem(item, index, requestedDate) {
  const combined = `${item.title} ${item.summary} ${item.sourceName}`;
  const inferred = inferBundle(combined);
  return {
    id: `news-card-${slugify(item.title)}-${index + 1}`,
    title: item.title,
    category: inferred.category,
    ministry: item.sourceName || "News Desk",
    source: item.source || "Web",
    date: requestedDate,
    rawLink: item.link,
    postedOn: item.pubDate || requestedDate,
    examAngle: `${inferred.category}, ${inferred.links[0]}, ${item.sourceName || "Current Affairs"}`,
    whyItMatters: `Selected for BPSC prelims relevance from ${item.sourceName || "web sources"}.`,
    summary: text(item.summary).slice(0, 200),
    tags: inferred.links.slice(0, 3),
    difficulty: inferred.category === "Economy" || inferred.category === "Science & Tech" ? "Medium" : "Easy",
    quizPrompt: `How can this topic be linked with ${inferred.links[0]}?`,
    staticSyllabusLinks: inferred.links,
    similarAskedInBpsc: `#Similar Asked in BPSC style: ${inferred.links.join(" / ")}`,
    factsToRemember: buildFacts(item.title, item.summary, item.sourceName, inferred.category),
    prelimsTrap: "Revise the related static concept rather than memorizing only the headline.",
    mainsAngle: `Use as a current hook for ${inferred.links[0]} and related static themes.`,
  };
}

function isUsefulLiveCard(card) {
  const combined = `${card.title} ${card.summary}`;
  if (/^Text of /i.test(card.title)) return false;
  if ((combined.match(/[\u0900-\u097F]/g) || []).length > 40) return false;
  if (/greetings|wishes|subhashitam|tributes only/i.test(combined)) return false;
  return true;
}

function buildBoosterCards(existingCards, requestedDate, target = 30) {
  const cards = [];
  const seenTitles = new Set(existingCards.map((card) => card.title));

  for (const template of BOOSTER_TEMPLATES) {
    if (cards.length + existingCards.length >= target) break;
    if (seenTitles.has(template.title)) continue;
    cards.push({
      id: template.id,
      title: template.title,
      category: template.category,
      ministry: template.ministry,
      source: "Revision Deck",
      date: requestedDate,
      rawLink: null,
      postedOn: requestedDate,
      examAngle: `${template.category}, BPSC prelims, revision coverage`,
      whyItMatters: "Added to ensure full prelims-oriented daily coverage when live-source volume is thin.",
      summary: template.summary,
      tags: [template.category, "BPSC", "Revision"],
      difficulty: "Easy",
      quizPrompt: `How can this revision card strengthen ${template.category} basics?`,
      staticSyllabusLinks: [template.category, "BPSC Prelims"],
      similarAskedInBpsc: `#Similar Asked in BPSC style: Static basics from ${template.category} often appear in objective questions.`,
      factsToRemember: template.facts,
      prelimsTrap: "Revise article, institution, chronology, location, or concept depending on the topic family.",
      mainsAngle: `Useful as a compact static base for ${template.category}.`,
    });
  }

  while (cards.length + existingCards.length < target) {
    const index = cards.length + 1;
    cards.push({
      id: `booster-generic-${index}`,
      title: `BPSC Booster ${index}: Static Revision Drill`,
      category: index % 5 === 0 ? "Environment" : index % 4 === 0 ? "Science & Tech" : index % 3 === 0 ? "History" : index % 2 === 0 ? "Economy" : "Polity",
      ministry: "BPSC Deck Engine",
      source: "Revision Deck",
      date: requestedDate,
      rawLink: null,
      postedOn: requestedDate,
      examAngle: "BPSC prelims static reinforcement",
      whyItMatters: "Added to complete a balanced daily revision pack across core prelims domains.",
      summary: "Static revision booster generated to ensure the day covers multiple BPSC prelims dimensions.",
      tags: ["BPSC", "Revision"],
      difficulty: "Easy",
      quizPrompt: "How does this booster help static recall?",
      staticSyllabusLinks: ["BPSC Prelims"],
      similarAskedInBpsc: "#Similar Asked in BPSC style: Static one-liners often support elimination in prelims.",
      factsToRemember: [
        "Prelims revision works best when each topic is reduced to article, institution, year, location, or concept.",
        "Polity asks article, office, election, term, removal, and powers.",
        "Economy asks Act, regulator, institution, full form, and location/headquarters.",
        "History asks person, year, movement, ideology, and office held.",
        "Geography and environment ask location, state, river, sanctuary, park, and species linkage.",
        "Science asks institution, concept, mission, and application."
      ],
      prelimsTrap: "Do not revise only current affairs; always attach a static anchor.",
      mainsAngle: "This is primarily a prelims reinforcement card.",
    });
  }

  return cards.slice(0, Math.max(0, target - existingCards.length));
}

async function buildPibCards(requestedDate) {
  await execFileAsync("node", [path.join(root, "scripts", "fetch-official-updates.mjs"), `--date=${requestedDate}`], {
    cwd: root,
    maxBuffer: 25 * 1024 * 1024,
  });
  const raw = await fs.readFile(path.join(root, "data", "official-updates.json"), "utf8");
  const parsed = JSON.parse(raw);
  return {
    meta: parsed.sources?.[0] || { label: "PIB", itemCount: 0 },
    cards: parsed.cards || [],
  };
}

async function fetchGoogleNewsCards(requestedDate) {
  const cards = [];
  const sourceMeta = [];
  const seen = new Set();

  for (const topic of TOPIC_QUERIES) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${topic.query} when:7d`)}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      const xml = await fetchText(url);
      const $ = cheerio.load(xml, { xmlMode: true });
      let count = 0;
      $("item").each((_, node) => {
        const title = text($(node).find("title").first().text()).replace(/\s*-\s*[^-]+$/, "");
        const link = text($(node).find("link").first().text());
        const summary = text($(node).find("description").first().text().replace(/<[^>]+>/g, " "));
        const pubDate = text($(node).find("pubDate").first().text());
        const sourceName = text($(node).find("source").first().text()) || topic.label;
        if (!title || !link || !pubDate) return;
        if (isoFromPubDate(pubDate) !== requestedDate) return;
        if (seen.has(title.toLowerCase())) return;
        seen.add(title.toLowerCase());
        cards.push(cardFromNewsItem({ title, link, summary, pubDate, sourceName, source: "Google News" }, cards.length, requestedDate));
        count += 1;
      });
      sourceMeta.push({ id: topic.id, label: `Google News ${topic.label}`, status: "ok", itemCount: count, url });
    } catch (error) {
      sourceMeta.push({ id: topic.id, label: `Google News ${topic.label}`, status: "error", itemCount: 0, error: error instanceof Error ? error.message : String(error), url });
    }
  }

  return { sourceMeta, cards };
}

async function main() {
  const requestedDate = parseArgs();
  const output = {
    generatedAt: new Date().toISOString(),
    scope: "PIB + web news + revision coverage",
    requestedDate,
    dailyDeckTarget: 30,
    storage: {
      latest: "data/daily-deck.json",
      archiveDir: "data/decks",
    },
    sources: [],
    cards: [],
  };

  const pib = await buildPibCards(requestedDate).catch((error) => ({
    meta: { id: "pib", label: "PIB", status: "error", itemCount: 0, error: error instanceof Error ? error.message : String(error) },
    cards: [],
  }));
  output.sources.push({ ...pib.meta, family: "official" });

  const news = await fetchGoogleNewsCards(requestedDate);
  output.sources.push(...news.sourceMeta.map((item) => ({ ...item, family: "news" })));

  const combined = [...(pib.cards || []), ...news.cards];
  const seenTitles = new Set();
  const deduped = combined.filter((card) => {
    const key = card.title.toLowerCase();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  }).filter(isUsefulLiveCard);

  const boosters = buildBoosterCards(deduped, requestedDate, 30);
  output.cards = [...deduped, ...boosters].slice(0, 30);

  const dataDir = path.join(root, "data");
  const deckDir = path.join(dataDir, "decks");
  await fs.mkdir(deckDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, "daily-deck.json"), JSON.stringify(output, null, 2), "utf8");
  await fs.writeFile(path.join(deckDir, `${requestedDate}.json`), JSON.stringify(output, null, 2), "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
