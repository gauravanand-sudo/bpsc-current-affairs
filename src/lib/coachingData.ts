export const OFFICIAL_LINKS = {
  upscPyqArchive: "https://www.upsc.gov.in/examinations/previous-question-papers",
  upscPrelims2026: "https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026",
  upscHome: "https://www.upsc.gov.in/",
  bpscQuestionBooklets: "https://bpsc.bihar.gov.in/question-booklets/",
  bpscExamCalendar: "https://bpsc.bihar.gov.in/exam-calendar/",
  bpscCandidateCorner: "https://bpsc.bihar.gov.in/candidate-corner/",
};

export type Program = {
  slug: string;
  exam: string;
  title: string;
  price: string;
  target: string;
  note: string;
  includes: string[];
  bestFor: string[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "upsc-2027",
    exam: "UPSC CSE 2027",
    title: "End-to-End Complete Program",
    price: "₹1,60,000",
    target: "Foundation + Prelims + Mains + Interview",
    note: "One flagship UPSC pathway from foundation to Personality Test, built around teaching, PYQs, tests, evaluation, revision and mentoring.",
    includes: [
      "NCERT + complete General Studies foundation",
      "Advanced GS coverage and integrated Current Affairs",
      "CSAT classes, drills and sectional tests",
      "15-year UPSC PYQ analysis and topic mapping",
      "Prelims sectional tests + full-length mocks",
      "Mains GS I-IV answer-writing and evaluation",
      "Essay + Ethics classes, practice and feedback",
      "Mentoring, revision plans and performance reviews",
      "DAF/profile work + Personality Test guidance",
      "Interview mocks and final-stage mentoring",
    ],
    bestFor: ["UPSC CSE 2027 focused aspirants", "First serious attempt", "Repeat aspirants rebuilding end-to-end strategy"],
  },
  {
    slug: "bpsc-73",
    exam: "73rd BPSC",
    title: "End-to-End Complete Program",
    price: "₹87,000",
    target: "Foundation + Prelims + Mains + Interview",
    note: "One complete BPSC pathway combining Bihar Special, General Studies, Current Affairs, PYQs, tests, Mains writing and Interview preparation.",
    includes: [
      "Complete General Studies foundation",
      "Bihar History, Geography, Economy, Polity and Current Issues",
      "Current Affairs integrated for BPSC and Bihar-specific relevance",
      "BPSC PYQ analysis and recurring-theme mapping",
      "Prelims topic tests + full-length mocks",
      "Mains answer-writing + evaluated practice",
      "Bihar issue enrichment and data-based answers",
      "Mentoring, revision plans and performance reviews",
      "Interview preparation + Bihar issue discussions",
      "Profile-based mocks and final-stage mentoring",
    ],
    bestFor: ["73rd BPSC focused aspirants", "First-time BPSC candidates", "Repeat candidates seeking a complete structured attempt"],
  },
];

export const FACULTY = [
  {
    name: "Ruhani Chauhan",
    subject: "History · UPSC / BPSC",
    record: "2× BPSC Prelims qualified · 1× UPSC Prelims qualified",
    focus: "Ancient India · Medieval India · Modern India · Art & Culture",
    image: "/faculty/ruhani.svg",
  },
  {
    name: "Ira Jain",
    subject: "Polity & Governance · UPSC / BPSC",
    record: "UPSC Prelims qualified · BPSC Mains appeared",
    focus: "Constitution · Governance · Social Justice · Current Issues",
    image: "/faculty/ira.svg",
  },
  {
    name: "Gargi Gupta",
    subject: "Geography & Environment · UPSC / BPSC",
    record: "UPSC Prelims qualified · State PCS Prelims qualified",
    focus: "India · Bihar · World Geography · Environment",
    image: "/faculty/gargi.svg",
  },
];

export const TESTIMONIALS = [
  {
    quote: "I stopped collecting random PDFs and started following one sequence. That alone changed my preparation.",
    meta: "UPSC / BPSC aspirant",
  },
  {
    quote: "The PYQ-first revision approach made my preparation much more exam-oriented and measurable.",
    meta: "UPSC / BPSC aspirant",
  },
  {
    quote: "Prelims and Mains are connected here. I write answers while preparing the same topics for objective tests.",
    meta: "UPSC aspirant",
  },
  {
    quote: "The weekly answer-writing and revision routine gives me measurable work instead of vague study hours.",
    meta: "Working aspirant",
  },
];

export const FREE_RESOURCES = [
  { href: "/study", title: "Free Study", eyebrow: "OPEN LIBRARY", description: "NCERT, General Studies, Bihar GS, Current Affairs and subject-wise study rooms for UPSC / BPSC." },
  { href: "/quizzes", title: "Free Quiz", eyebrow: "PRACTICE", description: "Current Affairs, static GS and PYQ-oriented practice for UPSC / BPSC recall and elimination." },
  { href: "/pyq", title: "UPSC / BPSC PYQs", eyebrow: "ON-SITE PYQ DESK", description: "Year-wise PYQ study with on-site categorisation plus links to official commission papers." },
  { href: "/ask", title: "Ask Tutor", eyebrow: "DOUBT SUPPORT", description: "Clarify UPSC / BPSC concepts and structure your next study step." },
  { href: "/partner", title: "Study Buddy", eyebrow: "ACCOUNTABILITY", description: "Find a study buddy for UPSC / BPSC preparation and add accountability to self-study." },
];

export type PyqGroup = {
  label: string;
  year?: string;
  stage: string;
  papers: string[];
  href: string;
  source: string;
  note?: string;
};

export const UPSC_PYQ: PyqGroup[] = [
  {
    label: "UPSC CSE Prelims 2026",
    year: "2026",
    stage: "Prelims",
    papers: ["General Studies Paper I", "General Studies Paper II (CSAT)"],
    href: OFFICIAL_LINKS.upscPrelims2026,
    source: "UPSC",
    note: "Official examination page with question papers uploaded after the 24 May 2026 examination.",
  },
  ...Array.from({ length: 14 }, (_, index) => {
    const year = String(2025 - index);
    return {
      label: `UPSC CSE ${year}`,
      year,
      stage: "Prelims + Mains",
      papers: ["Prelims GS I", "Prelims CSAT", "Mains Essay", "Mains GS I-IV"],
      href: OFFICIAL_LINKS.upscPyqArchive,
      source: "UPSC Previous Question Papers",
      note: "Use the on-site taxonomy for study and the official archive for exact paper wording.",
    } satisfies PyqGroup;
  }),
];

export const BPSC_PYQ: PyqGroup[] = [
  {
    label: "73rd BPSC preparation archive",
    stage: "Previous CCE papers",
    papers: ["Prelims General Studies", "Mains papers", "Bihar-focused recurring themes"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
    note: "Use the latest available CCE papers to prepare for the 73rd BPSC cycle.",
  },
  {
    label: "71st–64th BPSC CCE",
    stage: "Archive",
    papers: ["Prelims General Studies", "Mains examination papers as published"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
    note: "Official BPSC archive for previous CCE question booklets.",
  },
];

export const FAQ = [
  ["Can I use OneShot GS without buying a course?", "Yes. Free Study, Free Quiz, PYQ study, Ask Tutor and Study Buddy remain available as open UPSC / BPSC preparation tools."],
  ["What does the complete program fee include?", "UPSC 2027 at ₹1,60,000 and 73rd BPSC at ₹87,000 are both end-to-end programs covering Foundation, Prelims, Mains and Interview preparation."],
  ["Can I see the teaching experience before enrolling?", "Yes. The Demo Class page and free academic layer are available before enrollment."],
  ["How are PYQs handled on OneShot GS?", "The PYQ desk renders an on-site taxonomy and paraphrased study view, while exact question-paper wording remains linked to official UPSC and BPSC sources."],
];
