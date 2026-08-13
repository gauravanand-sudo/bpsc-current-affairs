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
    note: "Complete UPSC CSE 2027 preparation covering General Studies, Current Affairs, CSAT, PYQs, tests, answer-writing, Essay, Ethics and Interview preparation.",
    includes: [
      "NCERT + complete General Studies foundation",
      "Advanced GS coverage and integrated Current Affairs",
      "CSAT classes, drills and sectional tests",
      "UPSC PYQ analysis and topic mapping",
      "Prelims sectional tests + full-length mocks",
      "Mains GS I-IV answer-writing and evaluation",
      "Essay + Ethics classes, practice and feedback",
      "Mentoring, revision plans and performance reviews",
      "DAF/profile work + Personality Test guidance",
      "Interview mocks and final-stage mentoring",
    ],
    bestFor: ["UPSC CSE 2027 aspirants", "Foundation-to-interview preparation", "Integrated Prelims + Mains preparation"],
  },
  {
    slug: "bpsc-73",
    exam: "73rd BPSC",
    title: "End-to-End Complete Program",
    price: "₹87,000",
    target: "Foundation + Prelims + Mains + Interview",
    note: "Complete 73rd BPSC preparation covering General Studies, Bihar Special, Current Affairs, PYQs, tests, Mains writing and Interview preparation.",
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
    bestFor: ["73rd BPSC aspirants", "Bihar-focused GS preparation", "Integrated Prelims + Mains preparation"],
  },
];

export const FACULTY = [
  {
    name: "Ira Jain",
    tier: "Founder",
    role: "Founder · Academic Director",
    subject: "Polity & Governance · UPSC",
    record: "Founder · Governance Faculty",
    focus: "Constitution · Governance · Social Justice · Current Issues",
    image: "/faculty/ira-hd.webp",
  },
  {
    name: "Gargi Gupta",
    tier: "Founder",
    role: "Founder · Program Director",
    subject: "Geography & Environment · UPSC",
    record: "Founder · Geography Faculty",
    focus: "India · World Geography · Environment",
    image: "/faculty/gargi-hd.webp",
  },
  {
    name: "Dr. Aditi Sen",
    tier: "Senior Faculty",
    role: "Senior Faculty",
    subject: "Indian Economy · UPSC",
    record: "Economy Faculty · Academic Review Mentor",
    focus: "Macro Economy · Budget · Banking · Economic Survey · Answer Enrichment",
    image: "/faculty/aditi-sen.webp",
  },
  {
    name: "Arvind Menon",
    tier: "Senior Faculty",
    role: "Senior Faculty",
    subject: "History & Essay · UPSC",
    record: "History Faculty · Essay Workshop Lead",
    focus: "Ancient · Medieval · Modern India · World History · Essay Structure",
    image: "/faculty/arvind-menon.webp",
  },
  {
    name: "Meera Sinha",
    tier: "Senior Faculty",
    role: "Senior Faculty",
    subject: "Geography & Mapping · UPSC",
    record: "Geography Faculty · Mapping Lab Lead",
    focus: "Physical Geography · Indian Geography · World Mapping · Atlas Work",
    image: "/faculty/meera-sinha.webp",
  },
  {
    name: "Kabir Srivastava",
    tier: "Senior Faculty",
    role: "Senior Faculty",
    subject: "Environment & Science-Tech · UPSC",
    record: "Prelims Faculty · Elimination Workshop Lead",
    focus: "Ecology · Climate · Space · Biotechnology · Emerging Technology",
    image: "/faculty/kabir-srivastava.webp",
  },
  {
    name: "Neha Prakash",
    tier: "Senior Faculty",
    role: "Senior Faculty · Prelims Mentor",
    subject: "CSAT & Prelims Strategy · UPSC",
    record: "Aptitude Faculty · Test Strategy Mentor",
    focus: "Quantitative Aptitude · Reasoning · Comprehension · Attempt Strategy",
    image: "/faculty/neha-prakash.webp",
  },
  {
    name: "Rahul Dev",
    tier: "Senior Faculty",
    role: "Senior Faculty · Mains Mentor",
    subject: "Ethics & Answer Writing · UPSC",
    record: "Ethics Faculty · Copy Evaluation Mentor",
    focus: "Ethics Theory · Case Studies · GS Answers · Essay Feedback",
    image: "/faculty/rahul-dev.webp",
  },
  {
    name: "Sana Khan",
    tier: "Senior Faculty",
    role: "Senior Faculty",
    subject: "International Relations & Current Affairs",
    record: "IR Faculty · Current Affairs Discussion Lead",
    focus: "India's Foreign Policy · Global Institutions · Security · Issue Linkages",
    image: "/faculty/sana-khan.webp",
  },
  {
    name: "Vivek Anand",
    tier: "Senior Faculty",
    role: "Senior Faculty · GS Mentor",
    subject: "General Studies & Exam Strategy",
    record: "General Studies · Attempt Mentor",
    focus: "General Studies · Current Issues · Mains Enrichment · Attempt Strategy",
    image: "/faculty/vivek-anand.webp",
  },
  {
    name: "Ananya Rao",
    tier: "Senior Faculty",
    role: "Senior Faculty · Academic Counsellor",
    subject: "Study Planning & Learner Support",
    record: "Academic Counsellor",
    focus: "Course Planning · Backlog Recovery · Revision Cycles · Progress Reviews",
    image: "/faculty/ananya-rao.webp",
  },
  {
    name: "Raghav Bhatia",
    tier: "Senior Faculty",
    role: "Senior Faculty · Interview Panel",
    subject: "Personality Test & DAF Guidance",
    record: "Senior Mock Interview Panel Mentor",
    focus: "DAF Analysis · Communication · Situational Questions · Mock Interviews",
    image: "/faculty/raghav-bhatia.webp",
  },
  {
    name: "Kavya Joshi",
    tier: "Junior Faculty",
    role: "Junior Faculty · Mains Copy Evaluator",
    subject: "Art & Culture",
    record: "Art & Culture · Mains Copy Evaluator",
    focus: "Indian Art & Culture · Mains Answer Evaluation",
    image: "/faculty/kavya-joshi.webp",
  },
  {
    name: "Nisha Verma",
    tier: "Junior Faculty",
    role: "Junior Faculty",
    subject: "Current Affairs & Prelims Practice",
    record: "Current Affairs · MCQ Practice",
    focus: "Current Affairs · Prelims Elimination · Practice Discussions",
    image: "/faculty/nisha-verma.webp",
  },
  {
    name: "Ruhani Chauhan",
    tier: "Junior Faculty",
    role: "Junior Faculty · Mains Copy Evaluator",
    subject: "Bihar Special · Polity",
    record: "Bihar Special · Polity · Mains Copy Evaluator",
    focus: "Bihar History · Geography · Economy · Polity · Mains Answer Evaluation",
    image: "/faculty/ruhani.webp",
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
  { href: "/quizzes", title: "Free Quiz", eyebrow: "PRACTICE", description: "Current Affairs and static GS practice for UPSC / BPSC." },
  { href: "/pyq", title: "UPSC / BPSC PYQs", eyebrow: "QUESTION PAPERS", description: "Open and download UPSC Prelims GS-I papers from 2014–2026, with BPSC paper sources alongside." },
  { href: "/ask", title: "Talk to Tutor", eyebrow: "ACADEMIC SUPPORT", description: "UPSC / BPSC concepts, Prelims, Mains and exam-strategy support." },
  { href: "/talk-to-us", title: "Talk to Us", eyebrow: "HELPDESK", description: "Admissions, course queries, payment help, technical support and callbacks." },
  { href: "/partner", title: "Study Buddy", eyebrow: "ACCOUNTABILITY", description: "Find a study buddy for UPSC / BPSC preparation." },
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
    papers: ["General Studies Paper I"],
    href: "/pyq/upsc/prelims/2026.pdf",
    source: "OneShot GS hosted paper",
    note: "General Studies Paper I PDF available to open or download directly on OneShot GS.",
  },
  ...Array.from({ length: 12 }, (_, index) => {
    const year = String(2025 - index);
    return {
      label: `UPSC CSE Prelims ${year}`,
      year,
      stage: "Prelims",
      papers: ["General Studies Paper I"],
      href: `/pyq/upsc/prelims/${year}.pdf`,
      source: "OneShot GS hosted paper",
      note: "General Studies Paper I PDF available to open or download directly on OneShot GS.",
    } satisfies PyqGroup;
  }),
];

export const BPSC_PYQ: PyqGroup[] = [
  {
    label: "73rd BPSC preparation archive",
    stage: "Previous CCE papers",
    papers: ["Prelims General Studies", "Mains papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
    note: "BPSC question-booklet archive.",
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
  ["Can I use OneShot GS without buying a course?", "Yes. Free Study, Free Quiz, UPSC previous papers, Talk to Tutor, Talk to Us and Study Buddy are available without buying a course."],
  ["What does the complete program fee include?", "UPSC 2027 at ₹1,60,000 and 73rd BPSC at ₹87,000 both cover Foundation, Prelims, Mains and Interview preparation."],
  ["Can I see a demo before enrolling?", "Yes. Use the Demo Class page before enrollment."],
  ["How are UPSC previous papers handled?", "UPSC Prelims General Studies Paper I PDFs for 2014–2026 are hosted year-wise on OneShot GS with separate Open PDF and Download PDF actions. BPSC papers link to the BPSC question-booklet archive."],
];
