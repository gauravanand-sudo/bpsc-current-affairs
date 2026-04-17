import fs from "node:fs/promises";
import os from "node:os";
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

const pibSource = {
  id: "pib-all",
  label: "PIB All Releases",
  family: "PIB",
  category: "Mixed",
  url: "https://www.pib.gov.in/allrelease.aspx?lang=1&reg=3",
};

const syllabusRules = [
  {
    test: /constitution|president|vice-president|parliament|upsc|commission|democratic|public grievance|rajya sabha|electoral college|prime minister/i,
    links: ["Indian Polity", "Constitutional Bodies", "Parliament & Executive"],
    category: "Polity",
    similar: "Similar themes often appear in BPSC around constitutional offices, institutions, and practical governance reforms.",
  },
  {
    test: /finance|gst|company|corporate|investment|economy|bank|trade|industry|railways|logistics/i,
    links: ["Indian Economy", "Banking & Regulation", "Acts & Institutions"],
    category: "Economy",
    similar: "BPSC regularly connects current affairs with economic reforms, compliance systems, and sectoral growth.",
  },
  {
    test: /birth anniversary|jayanti|legacy|freedom fighter|national movement|prime minister of india/i,
    links: ["Modern Indian History", "National Movement", "Post-Independence India"],
    category: "History",
    similar: "BPSC often asks modern-history personalities through chronology, office held, and role in post-independence politics.",
  },
  {
    test: /science|technology|\bAI\b|innovation|digital|electronics|space|research|black hole|startup/i,
    links: ["Science & Technology", "Space & Physics", "Institutions & Missions"],
    category: "Science & Tech",
    similar: "BPSC tends to ask science current affairs through application, institution, and policy-use angles.",
  },
  {
    test: /environment|climate|forest|biodiversity|renewable|ecology/i,
    links: ["Geography", "Environment & Ecology", "Climate & Conservation"],
    category: "Environment",
    similar: "BPSC often frames environment current affairs through biodiversity, climate impact, and conservation policy.",
  },
  {
    test: /education|women|child|social justice|livelihood|rural|welfare|inclusion/i,
    links: ["Social Justice", "Education", "Welfare Administration"],
    category: "Social Justice",
    similar: "Similar BPSC questions usually connect vulnerable groups, welfare delivery, and social-sector governance.",
  },
];

function text(value) {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeAbsolute(base, href) {
  if (!href) return base;
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

function parseArgs() {
  const arg = process.argv.find((item) => item.startsWith("--date="));
  const value = arg ? arg.slice("--date=".length) : "";
  if (!value) return todayIso();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Use --date=YYYY-MM-DD");
  }
  return value;
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function parseIsoDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function formatPibPostedDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}

function mapCategory(ministry, title = "", paragraphs = []) {
  const haystack = `${ministry} ${title} ${paragraphs.join(" ")}`;
  for (const rule of syllabusRules) {
    if (rule.test.test(haystack)) return rule.category;
  }
  return "Governance";
}

function splitSentences(value) {
  return text(value)
    .split(/(?<=[.?!])\s+/)
    .map((part) => text(part))
    .filter(Boolean);
}

function isDecorativeParagraph(value, title = "") {
  const cleaned = text(value);
  if (!cleaned) return true;
  if (cleaned.length < 30) return true;
  if (/^\*{3,}$/.test(cleaned)) return true;
  if (/^[A-Z/]{2,12}$/.test(cleaned)) return true;
  if (cleaned.includes("pic.twitter.com")) return true;
  if (/^Follow us on/i.test(cleaned)) return true;
  if (/^Read this release in:/i.test(cleaned)) return true;
  if (/^Visitor Counter/i.test(cleaned)) return true;
  if (cleaned === title) return true;
  if (/^The Prime Minister shared a Sanskrit verse/i.test(cleaned)) return true;
  if (/^“.*”$/.test(cleaned) && !/[0-9]/.test(cleaned)) return true;
  if (/^[\u0900-\u097F\s,;:।॥"'“”()-]+$/.test(cleaned)) return true;
  return false;
}

function pickExamSummary(paragraphs = []) {
  return paragraphs.find((entry) => {
    const cleaned = text(entry);
    return cleaned.length >= 60 && /\b(will|has|have|launched|announced|approved|invited|signed|began|commenced|released|conducted|highlighted|said|noted|aims?)\b/i.test(cleaned);
  }) || paragraphs[0] || "";
}

function pickContextParagraph(paragraphs = [], summary = "") {
  return paragraphs.find((entry) => {
    const cleaned = text(entry);
    if (!cleaned || cleaned === summary) return false;
    return cleaned.length >= 70;
  }) || "";
}

function buildCrispSummary(item) {
  const paragraphs = item.fullSummary || item.summary || [];
  const candidate =
    paragraphs.find((entry) => {
      const cleaned = text(entry);
      return (
        cleaned.length >= 45 &&
        !/^Further,|^He also|^She also|^The programme will conclude/i.test(cleaned)
      );
    }) ||
    paragraphs.find((entry) => {
      const cleaned = text(entry);
      return (
        cleaned.length >= 45 &&
        cleaned.length <= 220 &&
        !/^Further,|^He also|^She also|^The programme will conclude/i.test(cleaned) &&
        /\b(announced|selected|commenced|invited|reviewing|concludes|explore|hosting|training|consultation|study|programme|rules|mission|conference)\b/i.test(cleaned)
      );
    }) ||
    paragraphs.find((entry) => text(entry).length >= 45 && text(entry).length <= 220) ||
    paragraphs[0] ||
    "";

  const cleaned = text(candidate);
  return cleaned.length <= 190 ? cleaned : cleaned.slice(0, 187).trim() + "...";
}

function scoreBpscRelevance(item, inferred) {
  const haystack = `${item.title} ${item.ministry} ${(item.fullSummary || []).join(" ")}`;
  let score = 0;

  if (/constitution|article|president|vice-president|prime minister|parliament|commission|election/i.test(haystack)) score += 5;
  if (/act|rules|regulator|authority|corporate|gst|finance|bank|economy|company/i.test(haystack)) score += 5;
  if (/science|technology|ai|black hole|galax|defence|space|research/i.test(haystack)) score += 4;
  if (/environment|climate|forest|biodiversity|river|ecology|geography/i.test(haystack)) score += 4;
  if (/history|birth anniversary|jayanti|former prime minister|national movement/i.test(haystack)) score += 3;
  if (/training programme|public comments|consultation|amendment|conference|study/i.test(haystack)) score += 2;

  if (["Polity", "Economy", "History", "Science & Tech", "Environment"].includes(inferred.category)) score += 3;

  if (/subhashitam|tributes only|greetings|felicitates|extends wishes/i.test(haystack)) score -= 4;
  if (/poem|verse/i.test(haystack)) score -= 4;

  return score;
}

function isBpscRelevant(item, inferred) {
  const haystack = `${item.title} ${item.ministry} ${(item.fullSummary || []).join(" ")}`;
  const score = scoreBpscRelevance(item, inferred);

  if (/subhashitam|verse/i.test(haystack)) return false;
  if (/women|child|education|welfare/i.test(haystack) && /(article 15|article 39|article 42)/i.test(buildFactList(item).join(" "))) {
    return true;
  }

  return score >= 6;
}

async function execCurl(args) {
  const { stdout } = await execFileAsync("curl", args, {
    encoding: "utf8",
    maxBuffer: 25 * 1024 * 1024,
  });
  return stdout;
}

async function fetchHtmlViaCurl(url, extraArgs = []) {
  return execCurl([
    "--fail-with-body",
    "--silent",
    "--show-error",
    "--location",
    "--compressed",
    "-A",
    USER_AGENT,
    "-H",
    "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "-H",
    "accept-language: en-IN,en;q=0.9,hi;q=0.8",
    "-H",
    "cache-control: no-cache",
    "-H",
    "pragma: no-cache",
    "-H",
    "upgrade-insecure-requests: 1",
    ...extraArgs,
    url,
  ]);
}

function extractAspNetFields(html) {
  const $ = cheerio.load(html);
  const names = [
    "script_HiddenField",
    "__VIEWSTATE",
    "__VIEWSTATEGENERATOR",
    "__VIEWSTATEENCRYPTED",
    "__EVENTVALIDATION",
    "__EVENTTARGET",
    "__EVENTARGUMENT",
    "__LASTFOCUS",
  ];

  return Object.fromEntries(
    names.map((name) => [name, $(`input[name='${name}']`).attr("value") || ""])
  );
}

async function fetchPibListingHtmlForDate(isoDate) {
  const cookieFile = path.join(
    os.tmpdir(),
    `pib-cookies-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`
  );

  try {
    const initialHtml = await fetchHtmlViaCurl(pibSource.url, ["-c", cookieFile, "-b", cookieFile]);
    const hidden = extractAspNetFields(initialHtml);
    const { year, month } = parseIsoDate(isoDate);
    const $ = cheerio.load(initialHtml);
    const currentMonth = Number(
      $("#ContentPlaceHolder1_ddlMonth option[selected='selected']").attr("value") ||
        $("#ContentPlaceHolder1_ddlMonth").val() ||
        0
    );
    const currentYear = Number(
      $("#ContentPlaceHolder1_ddlYear option[selected='selected']").attr("value") ||
        $("#ContentPlaceHolder1_ddlYear").val() ||
        0
    );

    if (currentMonth === month && currentYear === year) {
      return initialHtml;
    }

    const body = new URLSearchParams({
      script_HiddenField: hidden.script_HiddenField,
      __EVENTTARGET:
        currentYear !== year
          ? "ctl00$ContentPlaceHolder1$ddlYear"
          : "ctl00$ContentPlaceHolder1$ddlMonth",
      __EVENTARGUMENT: "",
      __LASTFOCUS: "",
      __VIEWSTATE: hidden.__VIEWSTATE,
      __VIEWSTATEGENERATOR: hidden.__VIEWSTATEGENERATOR,
      __VIEWSTATEENCRYPTED: hidden.__VIEWSTATEENCRYPTED,
      __EVENTVALIDATION: hidden.__EVENTVALIDATION,
      "ctl00$ContentPlaceHolder1$ddlMinistry": "0",
      "ctl00$ContentPlaceHolder1$ddlday": "0",
      "ctl00$ContentPlaceHolder1$ddlMonth": String(month),
      "ctl00$ContentPlaceHolder1$ddlYear": String(year),
    }).toString();

    return fetchHtmlViaCurl(pibSource.url, [
      "--http1.1",
      "-e",
      pibSource.url,
      "-H",
      "content-type: application/x-www-form-urlencoded",
      "-H",
      "origin: https://www.pib.gov.in",
      "-H",
      "sec-fetch-site: same-origin",
      "-H",
      "sec-fetch-mode: navigate",
      "-H",
      "sec-fetch-user: ?1",
      "-H",
      "sec-fetch-dest: document",
      "-c",
      cookieFile,
      "-b",
      cookieFile,
      "--data-binary",
      body,
    ]);
  } finally {
    await fs.rm(cookieFile, { force: true }).catch(() => {});
  }
}

function scrapePibReleaseList(html, source, requestedDate) {
  const $ = cheerio.load(html);
  const items = [];
  const pageDateRaw = text($("#ContentPlaceHolder1_lblDate").text());
  const requestedPostedDate = formatPibPostedDate(requestedDate);
  const list = $(".content-area ul.num").first();
  let currentMinistry = "";

  list.contents().each((_, node) => {
    if (node.type !== "tag") return;

    if (node.name === "h3") {
      currentMinistry = text($(node).text().replaceAll("&#39;", "'"));
      return;
    }

    if (node.name !== "li") return;

    const anchor = $(node).find("a").first();
    const title = text(anchor.attr("title") || anchor.text());
    const href = anchor.attr("href");
    const postedOnText = text($(node).find(".publishdatesmall").text()).replace(/^Posted on:\s*/i, "");

    if (!title || !href) return;
    if (postedOnText !== requestedPostedDate) return;

    items.push({
      id: `${source.id}-${items.length + 1}`,
      title,
      link: makeAbsolute(source.url, href),
      ministry: currentMinistry || "PIB",
      category: mapCategory(currentMinistry || "PIB", title),
      source: source.label,
      listingDate: postedOnText || pageDateRaw || requestedDate,
      requestedDate,
      scrapedAt: new Date().toISOString(),
    });
  });

  return items;
}

function parsePostedOn(rawText) {
  const match = rawText.match(
    /Posted On:\s*([0-9]{2}\s+[A-Z]{3}\s+[0-9]{4}(?:\s+[0-9:]+(?:AM|PM))?)/i
  );
  return match ? match[1].trim() : null;
}

function cleanMinistry(articleRoot, fallback) {
  const clone = articleRoot.clone();
  clone.find("*").remove();
  const plain = text(clone.text());
  return plain || fallback;
}

function scrapePibDetail(html, fallback) {
  const $ = cheerio.load(html);
  const articleRoot = $(".innner-page-main-about-us-content-right-part").first();
  const ministry =
    text($("#MinistryName").first().text()) ||
    cleanMinistry(articleRoot, fallback.ministry);
  const title =
    text($("#Titleh2").first().text()) ||
    text($("#ContentPlaceHolder1_Titleh2").first().text()) ||
    text($("meta[property='og:title']").attr("content") || "") ||
    fallback.title;
  const postedOn =
    text($("#PrDateTime").first().text()).replace(/^Posted On:\s*/i, "") ||
    parsePostedOn(text(articleRoot.text()));

  const paragraphs = [];
  const seen = new Set();

  articleRoot.find(".pt20 p").each((_, node) => {
    const value = text($(node).text());
    if (isDecorativeParagraph(value, title)) return;
    if (seen.has(value)) return;
    seen.add(value);
    paragraphs.push(value);
  });

  if (!paragraphs.length) {
    const embeddedDescription = $("input#ltrDescriptionn").attr("value") || "";
    if (embeddedDescription) {
      const embedded$ = cheerio.load(embeddedDescription);
      embedded$("p").each((_, node) => {
        const value = text(embedded$(node).text());
        if (isDecorativeParagraph(value, title)) return;
        if (seen.has(value)) return;
        seen.add(value);
        paragraphs.push(value);
      });
    }
  }

  if (!paragraphs.length) {
    const fallbackDescription = text($("meta[property='og:description']").attr("content") || "");
    if (fallbackDescription) {
      paragraphs.push(fallbackDescription);
    }
  }

  return {
    ...fallback,
    title,
    ministry,
    category: mapCategory(ministry, title, paragraphs),
    postedOn: postedOn || fallback.postedOn || null,
    summary: paragraphs.slice(0, 3),
    fullSummary: paragraphs,
  };
}

function inferSyllabusBundle(item) {
  const haystack = `${item.ministry} ${item.title} ${(item.fullSummary || []).join(" ")}`;
  if (/Companies Act|corporate|MCA|IICA|IFSCA|finance|economic|bank/i.test(haystack)) {
    return syllabusRules.find((rule) => rule.category === "Economy");
  }
  if (/IndiaAI|MeitY|\bAI\b|black hole|galax|science|technology|innovation/i.test(haystack)) {
    return syllabusRules.find((rule) => rule.category === "Science & Tech");
  }
  if (/birth anniversary|former Prime Minister|Vice-President|Prime Minister/i.test(haystack)) {
    return syllabusRules.find((rule) => rule.category === "Polity");
  }
  if (/history|national movement|freedom fighter/i.test(haystack)) {
    return syllabusRules.find((rule) => rule.category === "History");
  }

  for (const rule of syllabusRules) {
    if (rule.test.test(haystack)) return rule;
  }

  return {
    links: ["Current Affairs", "Governance & Policy"],
    category: item.category,
    similar: "BPSC often asks this theme by linking current events with static concepts and administrative impact.",
  };
}

function sentenceOrFallback(textValue, fallback) {
  const value = text(textValue || "");
  if (!value) return fallback;
  return value;
}

function buildExamAngle(item, syllabusLinks) {
  return `${item.category}, ${syllabusLinks[0]}, ${item.ministry}`;
}

function buildWhyItMatters(item, syllabusLinks) {
  return `This matters for BPSC because it links ${syllabusLinks.slice(0, 2).join(" and ")} with a live official development from ${item.ministry}.`;
}

function buildTags(item, syllabusLinks) {
  const tags = new Set();
  syllabusLinks.forEach((link) => tags.add(link));
  item.ministry
    .split(/[^A-Za-z&]+/)
    .filter((part) => part.length > 3)
    .slice(0, 2)
    .forEach((part) => tags.add(part));
  return Array.from(tags).slice(0, 5);
}

function difficultyFromCategory(category) {
  if (category === "Science & Tech" || category === "Economy") return "Medium";
  if (category === "Environment") return "Medium";
  return "Easy";
}

function buildQuizPrompt(item, syllabusLinks) {
  return `How can this PIB update be linked to ${syllabusLinks[0]} in a BPSC answer?`;
}

function pushFact(facts, value) {
  const cleaned = text(value);
  if (!cleaned) return;
  if (facts.includes(cleaned)) return;
  facts.push(cleaned);
}

function buildFactList(item) {
  const haystack = `${item.title} ${item.ministry} ${(item.fullSummary || []).join(" ")}`;
  const facts = [];
  const inferred = inferSyllabusBundle(item);
  const isWomenTheme = /Nari Shakti|women|mother|sister|daughter/i.test(haystack);
  const ministryName = item.ministry.toLowerCase();
  const isPmOffice = ministryName === "prime minister's office" || /^Prime Minister\b/i.test(item.title);
  const isPresidentOffice = ministryName === "president's secretariat" || /^President\b/i.test(item.title);
  const isVicePresidentOffice = ministryName === "vice president's secretariat" || /^Vice-President\b/i.test(item.title);

  if (/Chandra Shekhar/i.test(haystack)) {
    pushFact(facts, "Chandra Shekhar was the 8th Prime Minister of India and served from 1990 to 1991.");
    pushFact(facts, "He belonged to Uttar Pradesh and is remembered for the Samajwadi Janata political stream.");
    pushFact(facts, "He was associated with the Bharat Yatra and is remembered in post-Independence Indian politics.");
    pushFact(facts, "Former Prime Ministers are commonly asked in prelims through chronology, tenure, and office held.");
  }

  if (isPmOffice && !isWomenTheme) {
    pushFact(facts, "Article 74 provides for a Council of Ministers with the Prime Minister at the head to aid and advise the President.");
    pushFact(facts, "Under Article 75, the Prime Minister is appointed by the President.");
    pushFact(facts, "The Prime Minister is the real executive head in the parliamentary system.");
    pushFact(facts, "The Council of Ministers is collectively responsible to the Lok Sabha.");
  }

  if (isPresidentOffice) {
    pushFact(facts, "Article 52 provides that there shall be a President of India.");
    pushFact(facts, "The President is elected by an electoral college under Article 54 of the Constitution.");
    pushFact(facts, "The President's normal term is five years under Article 56.");
    pushFact(facts, "Article 61 deals with the impeachment of the President.");
  }

  if (isVicePresidentOffice) {
    pushFact(facts, "Article 63 of the Constitution provides that there shall be a Vice-President of India.");
    pushFact(facts, "Under Article 64, the Vice-President is the ex officio Chairman of the Rajya Sabha.");
    pushFact(facts, "The Vice-President is elected by members of both Houses of Parliament.");
    pushFact(facts, "Article 65 provides that the Vice-President acts as President when the office of President falls vacant.");
    pushFact(facts, "The Vice-President can be removed by a resolution of the Rajya Sabha agreed to by the Lok Sabha.");
  }

  if (isWomenTheme) {
    pushFact(facts, "Article 15(3) permits the State to make special provisions for women and children.");
    pushFact(facts, "Article 39(d) in the Directive Principles speaks of equal pay for equal work for both men and women.");
    pushFact(facts, "Article 42 directs the State to make provision for just and humane conditions of work and maternity relief.");
    pushFact(facts, "Article 51A(e) makes it a fundamental duty to renounce practices derogatory to the dignity of women.");
    pushFact(facts, "Questions on women-related current affairs in BPSC often connect with DPSPs and Fundamental Duties.");
  }

  if (/Companies Act|corporate|MCA|IICA|IFSCA/i.test(haystack)) {
    pushFact(facts, "The Companies Act, 2013 is the principal law governing incorporation, regulation, and winding up of companies in India.");
    pushFact(facts, "The Ministry of Corporate Affairs administers the Companies Act, 2013 and the Limited Liability Partnership Act, 2008.");
    pushFact(facts, "IFSCA is the unified regulator for financial products, services, and institutions in International Financial Services Centres under the IFSCA Act, 2019.");
    pushFact(facts, "IICA stands for Indian Institute of Corporate Affairs and functions under the Ministry of Corporate Affairs.");
    pushFact(facts, "GIFT City in Gujarat is India's major International Financial Services Centre.");
    pushFact(facts, "Important prelims angles here are parent Act, regulator, nodal ministry, and headquarters/location.");
  }

  if (/UPSC|Union Public Service Commission|Public Service Commission/i.test(haystack)) {
    pushFact(facts, "UPSC is a constitutional body under Article 315 of the Constitution.");
    pushFact(facts, "Articles 315 to 323 deal with Public Service Commissions.");
    pushFact(facts, "The Chairman and members of UPSC are appointed by the President of India.");
    pushFact(facts, "UPSC submits its annual report to the President under Article 323.");
    pushFact(facts, "UPSC conducts examinations for appointments to the services of the Union.");
    pushFact(facts, "UPSC is the central recruiting agency for Union services and also plays a role in recruitment to All India Services.");
    pushFact(facts, "State Public Service Commissions are also constitutional bodies under the same constitutional scheme.");
  }

  if (/UPSC|Union Public Service Commission|All India Services|\bIAS\b|\bIPS\b|\bIFoS\b/i.test(haystack)) {
    pushFact(facts, "Article 312 provides for the creation of All India Services by Parliament if the Rajya Sabha passes a resolution supported by not less than two-thirds of members present and voting.");
    pushFact(facts, "The three All India Services are IAS, IPS, and Indian Forest Service.");
    pushFact(facts, "All India Services serve both the Union and the States.");
    pushFact(facts, "IAS and IPS were created at the commencement of the Constitution, while Indian Forest Service was created later in 1966.");
  }

  if (/Army Commanders.? Conference|COAS|Defence|UAS|C-UAS/i.test(haystack)) {
    pushFact(facts, "Army Commanders' Conference is a biannual apex-level institutional conference of the Indian Army leadership.");
    pushFact(facts, "COAS stands for Chief of the Army Staff, the professional head of the Indian Army.");
    pushFact(facts, "UAS means Unmanned Aerial Systems, while C-UAS refers to Counter-Unmanned Aerial Systems.");
    pushFact(facts, "Defence prelims usually tests abbreviations, commands, chiefs, systems, and indigenous capability.");
  }

  if (/IndiaAI|MeitY|\bAI\b|startup/i.test(haystack)) {
    pushFact(facts, "MeitY stands for the Ministry of Electronics and Information Technology.");
    pushFact(facts, "The IndiaAI Mission functions under MeitY and is linked with India's AI ecosystem and innovation push.");
    pushFact(facts, "Artificial intelligence refers to computer systems performing tasks that normally require human intelligence such as learning, reasoning, or pattern recognition.");
    pushFact(facts, "In science prelims, institution, concept, mission, and application are more important than the headline event.");
  }

  if (/black hole|galax/i.test(haystack)) {
    pushFact(facts, "Dwarf spheroidal galaxies are small, faint, dark-matter-dominated satellite galaxies.");
    pushFact(facts, "The Milky Way is a barred spiral galaxy.");
    pushFact(facts, "Supermassive black holes are usually found near the centers of large galaxies.");
    pushFact(facts, "Astronomy questions in prelims often ask galaxy type, black hole type, and basic cosmic structure.");
  }

  if (/river|biodiversity|forest|climate|ecology|environment/i.test(haystack)) {
    pushFact(facts, "Biodiversity hotspots, protected areas, and climate agreements are recurring prelims themes.");
    pushFact(facts, "For geography and environment, BPSC often asks location, state, river basin, protected area, and species linkage.");
  }

  if (inferred.category === "Polity") {
    pushFact(facts, "Laxmikanth-style prelims coverage focuses on article, office, election method, term, removal, and powers.");
  }

  if (inferred.category === "History") {
    pushFact(facts, "Spectrum-style history revision usually covers personality, year, movement, ideology, and office held.");
  }

  if (inferred.category === "Economy") {
    pushFact(facts, "Economy prelims usually asks Act, regulator, institution, full form, and location/headquarters.");
  }

  if (inferred.category === "Science & Tech") {
    pushFact(facts, "Science prelims usually asks institution, scientific concept, mission, and use case.");
  }

  if (inferred.category === "Environment") {
    pushFact(facts, "Geography and environment prelims usually asks place, state, river, park, sanctuary, or climate linkage.");
  }

  return facts.slice(0, 10);
}

function buildPrelimsTrap(item) {
  const haystack = `${item.title} ${(item.fullSummary || []).join(" ")}`;

  if (/Prime Minister|President|Vice-President|UPSC/i.test(haystack)) {
    return "Do not stop at the personality or event; revise the related constitutional office, role, and institutional linkage.";
  }
  if (/Companies Act|Rules, 20\d{2}|draft notification|public comments|consultation/i.test(haystack)) {
    return "Distinguish between a draft amendment, consultation notice, and a final notified rule; prelims can test the parent Act and rule-making power.";
  }
  if (/MoU|agreement|launch|programme|scheme/i.test(haystack)) {
    return "Do not confuse an announcement, MoU, or training programme with a new statutory scheme or law.";
  }
  if (/\bAI\b|science|technology|innovation|black hole|startup/i.test(haystack)) {
    return "Prelims may test the institution, application area, or regulator behind the update rather than the headline phrase itself.";
  }
  if (/corporate|finance|company|regulation|governance/i.test(haystack)) {
    return "Revise the institution and regulatory framework here; prelims often asks who regulates what, not just what happened.";
  }

  return "Focus on the institution, purpose, and policy significance behind the headline instead of memorizing only the event wording.";
}

function buildMainsAngle(item, syllabusLinks) {
  if (/comment|consultation|draft|amendment|rules/i.test(`${item.title} ${(item.fullSummary || []).join(" ")}`)) {
    return `Use this in mains answers on ${syllabusLinks[0]} to show how consultation-led rule making improves compliance, transparency, and administrative responsiveness.`;
  }
  if (/training|capacity building|induction/i.test(`${item.title} ${(item.fullSummary || []).join(" ")}`)) {
    return `Use this in mains answers on ${syllabusLinks[0]} to show that institutional capacity building is as important as policy announcement for effective governance.`;
  }

  return `Use this as a current example in answers on ${syllabusLinks[0]} by showing how ${item.ministry} connects policy intent with on-ground governance or institutional reform.`;
}

function transformReleaseToCard(item, index) {
  const inferred = inferSyllabusBundle(item);
  const summary = sentenceOrFallback(
    buildCrispSummary(item),
    "Official PIB release captured for exam-oriented current affairs revision."
  );

  return {
    id: `pib-card-${slugify(item.title)}-${index + 1}`,
    title: item.title,
    category: inferred.category,
    ministry: item.ministry,
    source: "PIB",
    date: item.requestedDate,
    rawLink: item.link,
    postedOn: item.postedOn,
    examAngle: buildExamAngle(item, inferred.links),
    whyItMatters: buildWhyItMatters(item, inferred.links),
    summary,
    tags: buildTags(item, inferred.links),
    difficulty: difficultyFromCategory(inferred.category),
    quizPrompt: buildQuizPrompt(item, inferred.links),
    staticSyllabusLinks: inferred.links,
    similarAskedInBpsc: `#Similar Asked in 70th BPSC style: ${inferred.similar}`,
    factsToRemember: buildFactList(item),
    prelimsTrap: buildPrelimsTrap(item),
    mainsAngle: buildMainsAngle(item, inferred.links),
  };
}

async function main() {
  const requestedDate = parseArgs();
  const output = {
    generatedAt: new Date().toISOString(),
    scope: "PIB only",
    requestedDate,
    dailyDeckTarget: 25,
    sources: [],
    cards: [],
  };

  try {
    const listHtml = await fetchPibListingHtmlForDate(requestedDate);
    const listedItems = scrapePibReleaseList(listHtml, pibSource, requestedDate).slice(0, 25);
    const detailedItems = [];

    for (const item of listedItems) {
      try {
        const match = item.link.match(/PRID=(\d+)/i);
        const detailPageUrl = match
          ? `https://www.pib.gov.in/PressReleasePage.aspx?PRID=${match[1]}&reg=3&lang=1`
          : item.link;
        const articleHtml = await fetchHtmlViaCurl(detailPageUrl);
        detailedItems.push(scrapePibDetail(articleHtml, item));
      } catch (error) {
        detailedItems.push({
          ...item,
          detailError: error instanceof Error ? error.message : String(error),
          summary: [],
          fullSummary: [],
          postedOn: null,
        });
      }
    }

    const filteredItems = detailedItems.filter((item) => isBpscRelevant(item, inferSyllabusBundle(item))).slice(0, 25);

    output.sources.push({
      ...pibSource,
      status: "ok",
      itemCount: filteredItems.length,
      items: filteredItems,
    });
    output.cards = filteredItems.map(transformReleaseToCard);
  } catch (error) {
    output.sources.push({
      ...pibSource,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      items: [],
    });
  }

  const outDir = path.join(root, "data");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, "official-updates.json"),
    JSON.stringify(output, null, 2),
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
