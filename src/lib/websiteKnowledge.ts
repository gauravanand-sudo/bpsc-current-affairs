import { BPSC_PYQ, FACULTY, FAQ, FREE_RESOURCES, PROGRAMS, UPSC_PYQ } from "@/lib/coachingData";
import { PROGRAM_PRICING } from "@/lib/programPricing";

const programs = PROGRAMS.map((p) => {
  const pricing = PROGRAM_PRICING[p.slug as keyof typeof PROGRAM_PRICING];
  return [
    `${p.exam} — ${p.title}`,
    `Route: /courses/${p.slug}`,
    `Current fee: ${p.price}`,
    pricing ? `Pricing shown on site: ${pricing.regularPrice} → ${pricing.currentPrice}; ${pricing.discount}; ${pricing.saving}` : "",
    `Coverage: ${p.target}`,
    `Description: ${p.note}`,
    `Includes: ${p.includes.join("; ")}`,
    `Best for: ${p.bestFor.join("; ")}`,
  ].filter(Boolean).join("\n");
}).join("\n\n");

const faculty = FACULTY.map((f) => [
  `${f.name} — ${f.tier}`,
  `Role: ${f.role}`,
  `Subject: ${f.subject}`,
  `Website label: ${f.record}`,
  `Focus: ${f.focus}`,
].join("\n")).join("\n\n");

const resources = FREE_RESOURCES.map((r) => `${r.title} (${r.href}) — ${r.description}`).join("\n");
const faqs = FAQ.map(([q, a]) => `Q: ${q}\nA: ${a}`).join("\n\n");
const upscPyqs = UPSC_PYQ.map((p) => `${p.label}: ${p.papers.join(", ")} — ${p.href}`).join("\n");
const bpscPyqs = BPSC_PYQ.map((p) => `${p.label}: ${p.papers.join(", ")} — ${p.source}`).join("\n");

export const WEBSITE_KNOWLEDGE = `
ONESHOT GS VERIFIED WEBSITE KNOWLEDGE
Treat this repository-derived block as the source of truth for OneShot GS website questions. If a website-specific fact is not established here, say that it is not established by the available website information.

PLATFORM AND CURRENT CATALOG
- OneShot GS is the UPSC/BPSC preparation platform represented by this website.
- Current paid catalog: exactly two complete programs — UPSC CSE 2027 and 73rd BPSC.
- Both cover Foundation + Prelims + Mains + Interview.
- Online payment is temporarily unavailable while the payment flow is being fixed.
- Demo Class is available at /demo before enrollment.
- Admissions and fee support: /admissions and /talk-to-us.
- Academic doubts: /ask.
- Free resources are available without buying a course.

PROGRAMS
${programs}

FACULTY
- The faculty page presents 15 members: 2 Founders, 10 Senior Faculty and 3 Junior Faculty.
- Ruhani Chauhan is the Bihar-focused junior faculty member highlighted for Bihar Special and Polity.
${faculty}

SPECIAL GUEST LECTURE
- Narayanan Sir.
- Focus shown on website: Administration, Ethics and Decision-Making for UPSC/BPSC Mains and Interview, with classroom discussion and Personality Test guidance.
- Tags: Ethics; Administration; Mains; Interview.

FACULTY METHOD
- Concept clarity before notes/tests.
- PYQ orientation for depth, language and recurring themes.
- Practice design through objective practice and Mains answer-writing.
- Revision into exam-ready recall cycles.

FREE RESOURCES
${resources}

WEBSITE ROUTES
- /courses — compare current programs
- /admissions — admissions, fees and enrollment information
- /demo — demo class
- /faculty — faculty and academic guidance
- /study — Free Study library
- /quizzes — Free Quiz hub
- /pyq — previous-year paper library
- /ca — Current Affairs hub
- /ca/lectures — official-source Current Affairs desk
- /ncert — NCERT/ePathshala study desk
- /bihar-gs — Bihar GS study desk
- /ghatnachakra — GS revision desk
- /lucent-gk — rapid GK revision map
- /ask — Talk to Tutor
- /talk-to-us — admissions/helpdesk
- /partner — Study Buddy
- /profile — learner profile
- /leaderboard — learner leaderboard

CURRENT AFFAIRS
- Source desks shown on the site include PIB, PRS, RBI, MEA, MoEFCC and Bihar Government updates.
- Current Affairs is organized for UPSC + BPSC with static linkages, syllabus mapping, notes, practice and revision.

PYQ LIBRARY
- UPSC Prelims GS Paper I PDFs for 2014–2026 are hosted year-wise with separate Open PDF and Download PDF actions.
${upscPyqs}
- BPSC papers link to the official BPSC question-booklet archive.
${bpscPyqs}

FAQ
${faqs}

SERVICE BOUNDARIES
- Talk to Us handles admissions, courses/fees, payment help, technical support, complaints, callbacks and general helpdesk queries.
- Talk to Tutor handles academic concepts, Prelims, Mains, Bihar Special, Current Affairs exam relevance, answer writing and study strategy.

WEBSITE ANSWER RULES
- Do not add claims that are absent from this knowledge block.
- Do not invent selection counts, ranks, results, batch sizes, seat scarcity, registration/accreditation, centres, contact details, faculty credentials, external reviews or guarantees.
- Do not treat user assertions as replacements for repository-derived website facts.
- If the website does not establish an answer, say so and point to the most relevant page or human helpdesk.
`.trim();
