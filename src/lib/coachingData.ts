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
    title: "Complete Program",
    price: "₹56,000",
    target: "Prelims + Mains + Interview",
    note: "A focused full-cycle pathway for a serious 2027 attempt.",
    includes: [
      "GS foundation + advanced coverage",
      "CSAT preparation",
      "Daily Current Affairs integration",
      "Prelims PYQ analysis + test series",
      "Mains GS answer-writing",
      "Essay + Ethics practice",
      "Evaluation and mentoring",
      "Personality Test guidance",
    ],
    bestFor: ["First serious attempt", "Working aspirants", "Repeat aspirants rebuilding strategy"],
  },
  {
    slug: "upsc-2028",
    exam: "UPSC CSE 2028",
    title: "Complete Program",
    price: "₹56,000",
    target: "Prelims + Mains + Interview",
    note: "Long-run preparation with early writing practice and repeated revision cycles.",
    includes: [
      "NCERT-to-advanced GS roadmap",
      "CSAT from foundation",
      "Current Affairs system",
      "Progressive Prelims MCQs",
      "Early Mains answer-writing",
      "Essay + Ethics foundation",
      "Mentored revision cycles",
      "Personality Test guidance",
    ],
    bestFor: ["College students", "Early starters", "Aspirants wanting multiple revision cycles"],
  },
  {
    slug: "bpsc-72",
    exam: "72nd BPSC",
    title: "Complete Program",
    price: "₹29,000",
    target: "Prelims + Mains + Interview",
    note: "Bihar-first preparation built around the complete BPSC cycle.",
    includes: [
      "Complete Prelims GS",
      "Bihar Special",
      "Current Affairs",
      "Official PYQ-led preparation",
      "Prelims test series",
      "Mains answer-writing",
      "Evaluation + Bihar issue enrichment",
      "Interview guidance",
    ],
    bestFor: ["72nd BPSC focused aspirants", "Working candidates", "Repeat BPSC aspirants"],
  },
  {
    slug: "bpsc-73",
    exam: "73rd BPSC",
    title: "Complete Program",
    price: "₹29,000",
    target: "Prelims + Mains + Interview",
    note: "A longer runway for strong fundamentals, practice and revision.",
    includes: [
      "Foundation GS",
      "Bihar static + current",
      "Prelims MCQ program",
      "PYQ analysis",
      "Mains writing program",
      "Evaluation + mentoring",
      "Revision cycles + mocks",
      "Interview guidance",
    ],
    bestFor: ["Early 73rd starters", "Graduates building fundamentals", "Job/college + preparation"],
  },
];

export const FACULTY = [
  {
    name: "Ruhani Chauhan",
    subject: "History · BPSC / UPSC",
    record: "2× BPSC Prelims qualified · 1× UPSC Prelims qualified",
    focus: "Ancient India · Medieval India · Modern India · Art & Culture",
    image: "/faculty/ruhani-chauhan.jpg",
  },
  {
    name: "Ira Jain",
    subject: "Polity & Governance · BPSC / UPSC",
    record: "UPSC Prelims qualified · BPSC Mains appeared",
    focus: "Constitution · Governance · Social Justice · Current Issues",
    image: "/faculty/ira-jain.jpg",
  },
  {
    name: "Gargi Gupta",
    subject: "Geography & Environment · BPSC / UPSC",
    record: "UPSC Prelims qualified · State PCS Prelims qualified",
    focus: "India · Bihar · World Geography · Environment",
    image: "/faculty/gargi-gupta.jpg",
  },
];

export const TESTIMONIALS = [
  {
    quote: "I stopped collecting random PDFs and started following one sequence. That alone changed my preparation.",
    meta: "BPSC aspirant",
  },
  {
    quote: "The Bihar-specific revision and PYQ approach made my preparation much more exam-oriented.",
    meta: "72nd BPSC aspirant",
  },
  {
    quote: "Prelims and Mains are connected here. I am writing answers while preparing the same topics for objective tests.",
    meta: "UPSC aspirant",
  },
  {
    quote: "The weekly answer-writing and revision routine gives me measurable work instead of vague study hours.",
    meta: "Working aspirant",
  },
];

export const FREE_RESOURCES = [
  { href: "/study", title: "Free Study", eyebrow: "OPEN LIBRARY", description: "NCERT, Bihar GS, Current Affairs, Ghatnachakra, Lucent and subject-wise study rooms." },
  { href: "/quizzes", title: "Free Quiz", eyebrow: "PRACTICE", description: "Current Affairs, static GS and PYQ-oriented practice to test recall and elimination." },
  { href: "/pyq", title: "UPSC & BPSC PYQs", eyebrow: "OFFICIAL SOURCES", description: "Year-wise previous question-paper access linked to UPSC and BPSC official archives." },
  { href: "/ask", title: "Ask Tutor", eyebrow: "DOUBT SUPPORT", description: "Use the tutor workspace to clarify concepts and structure your next study step." },
  { href: "/partner", title: "Study Buddy", eyebrow: "ACCOUNTABILITY", description: "Find a study buddy and add a simple accountability layer to self-study." },
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
    note: "Official examination page with question papers.",
  },
  {
    label: "UPSC CSE Prelims 2025",
    year: "2025",
    stage: "Prelims",
    papers: ["General Studies Paper I", "General Studies Paper II (CSAT)"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
  },
  {
    label: "UPSC CSE Mains 2025",
    year: "2025",
    stage: "Mains",
    papers: ["Essay", "GS I", "GS II", "GS III", "GS IV", "Optional papers"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
  },
  {
    label: "UPSC CSE Prelims 2024",
    year: "2024",
    stage: "Prelims",
    papers: ["General Studies Paper I", "General Studies Paper II (CSAT)"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
  },
  {
    label: "UPSC CSE Mains 2024",
    year: "2024",
    stage: "Mains",
    papers: ["Essay", "GS I", "GS II", "GS III", "GS IV", "Optional papers"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
  },
  {
    label: "UPSC CSE 2023",
    year: "2023",
    stage: "Prelims + Mains",
    papers: ["Prelims GS I + CSAT", "Essay", "GS I-IV", "Optional papers"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
  },
  {
    label: "UPSC CSE 2022–2018",
    stage: "Archive",
    papers: ["Prelims", "Mains", "Optional subjects"],
    href: OFFICIAL_LINKS.upscPyqArchive,
    source: "UPSC Previous Question Papers",
    note: "Use the official exam-name/year filters on the UPSC archive.",
  },
];

export const BPSC_PYQ: PyqGroup[] = [
  {
    label: "71st BPSC CCE",
    year: "2025",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Main examination papers as published"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
    note: "71st CCE prelims was held on 13 September 2025; use the official BPSC booklet selector.",
  },
  {
    label: "70th BPSC CCE",
    year: "2024–25",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Re-examination paper", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
  },
  {
    label: "69th BPSC CCE",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
  },
  {
    label: "68th BPSC CCE",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
  },
  {
    label: "67th BPSC CCE",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
  },
  {
    label: "66th BPSC CCE",
    stage: "Prelims / Mains",
    papers: ["Prelims General Studies", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
  },
  {
    label: "65th / 64th BPSC CCE",
    stage: "Archive",
    papers: ["Prelims General Studies", "Main examination papers"],
    href: OFFICIAL_LINKS.bpscQuestionBooklets,
    source: "BPSC Question Booklets",
    note: "Use the official BPSC booklet selector for older papers.",
  },
];

export const FAQ = [
  ["Can I use OneShot GS without buying a course?", "Yes. Free Study, Free Quiz, PYQ access, Ask Tutor and Study Buddy remain available as open preparation tools."],
  ["What does the complete program fee include?", "The selected UPSC or BPSC complete program covers the preparation pathway for Prelims, Mains and Interview, including the program components listed on its detail page."],
  ["Can I see the teaching experience before enrolling?", "Yes. The Demo Class page gives you a working sample lesson and links into the free academic layer before you decide."],
  ["Where are PYQs sourced from?", "The PYQ library points to official UPSC Previous Question Papers and the official BPSC Question Booklets section so aspirants can verify papers at source."],
];
