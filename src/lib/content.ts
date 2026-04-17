export type CurrentAffairCard = {
  id: string;
  title: string;
  category: string;
  ministry: string;
  source: string;
  date: string;
  examAngle: string;
  whyItMatters: string;
  summary: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "High";
  quizPrompt: string;
  staticSyllabusLinks?: string[];
  similarAskedInBpsc?: string;
  factsToRemember?: string[];
  prelimsTrap?: string;
  mainsAngle?: string;
};

export type DailyQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  category: string;
};

export const sourceGroups = [
  "PIB",
  "PMO",
  "President Secretariat",
  "Finance Ministry",
  "Education Ministry",
  "Rural Development",
  "Science & Technology",
  "Home Affairs",
];

export const categories = [
  "Governance",
  "Economy",
  "Science & Tech",
  "Environment",
  "International Relations",
  "Social Justice",
  "Schemes",
  "Appointments",
];

export const todayCards: CurrentAffairCard[] = [
  {
    id: "ca-01",
    title: "Cabinet clears digital land-record modernization push",
    category: "Governance",
    ministry: "Ministry of Rural Development",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Land reforms, digital governance, Bihar rural administration",
    whyItMatters: "BPSC asks governance reforms in practical implementation language, not just scheme names.",
    summary:
      "A new modernization push focuses on land-record digitization, dispute reduction, and service delivery transparency through interoperable state systems.",
    tags: ["Digital India", "Land Records", "Governance"],
    difficulty: "Medium",
    quizPrompt: "How does land-record digitization improve citizen-facing governance?"
  },
  {
    id: "ca-02",
    title: "PMO reviews logistics bottlenecks before peak procurement season",
    category: "Economy",
    ministry: "Prime Minister's Office",
    source: "PMO",
    date: "2026-04-17",
    examAngle: "Infrastructure, supply chains, public administration",
    whyItMatters: "Useful for linking policy coordination with economic outcomes in mains answers.",
    summary:
      "The review stresses inter-ministerial coordination, faster data sharing, and last-mile delivery efficiency for time-sensitive procurement operations.",
    tags: ["Logistics", "Coordination", "Economy"],
    difficulty: "Medium",
    quizPrompt: "Why is logistics coordination an administrative issue as much as an economic one?"
  },
  {
    id: "ca-03",
    title: "President highlights constitutional morality at university event",
    category: "Governance",
    ministry: "President Secretariat",
    source: "President Secretariat",
    date: "2026-04-17",
    examAngle: "Constitution, ethics, public life",
    whyItMatters: "Strong fodder for essays and ethics answers.",
    summary:
      "The address connects constitutional morality with institutional restraint, equality before law, and responsible citizenship.",
    tags: ["Constitution", "Ethics", "Polity"],
    difficulty: "Easy",
    quizPrompt: "What is constitutional morality and why is it relevant in governance?"
  },
  {
    id: "ca-04",
    title: "New agriculture extension dashboard launched for district monitoring",
    category: "Schemes",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Agriculture policy, data dashboards, implementation",
    whyItMatters: "Bihar-focused exam prep benefits from agri-delivery examples with administrative relevance.",
    summary:
      "District-level monitoring indicators will help officials identify extension gaps, input delivery delays, and coverage mismatches faster.",
    tags: ["Agriculture", "Dashboard", "District Administration"],
    difficulty: "Medium",
    quizPrompt: "How can dashboards strengthen agricultural extension outcomes?"
  },
  {
    id: "ca-05",
    title: "Science ministry backs translational innovation clusters",
    category: "Science & Tech",
    ministry: "Ministry of Science & Technology",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Innovation ecosystem, research to industry",
    whyItMatters: "Useful for linking science policy to jobs, startups, and state growth models.",
    summary:
      "The cluster model aims to convert lab-stage research into deployable products through academia, incubators, and industry collaboration.",
    tags: ["Innovation", "Research", "Startup Ecosystem"],
    difficulty: "Medium",
    quizPrompt: "Why is translational research a policy priority?"
  },
  {
    id: "ca-06",
    title: "Home ministry pushes stronger cyber-fraud awareness messaging",
    category: "Governance",
    ministry: "Ministry of Home Affairs",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Internal security, cyber safety, citizen awareness",
    whyItMatters: "Good for prelims and for governance answers on prevention-based administration.",
    summary:
      "The focus is on multilingual public campaigns, reporting ease, and coordination between digital platforms and law enforcement units.",
    tags: ["Cyber Fraud", "Internal Security", "Awareness"],
    difficulty: "Easy",
    quizPrompt: "What are the administrative pillars of cyber-fraud prevention?"
  },
  {
    id: "ca-07",
    title: "Education ministry expands competency-linked assessment framework",
    category: "Social Justice",
    ministry: "Ministry of Education",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "School reform, learning outcomes, education policy",
    whyItMatters: "Lets students move beyond slogans and discuss measurable reform.",
    summary:
      "The updated framework centers classroom feedback, applied skills, and periodic learning diagnostics rather than rote-heavy evaluation.",
    tags: ["Education", "Assessment", "Learning Outcomes"],
    difficulty: "Easy",
    quizPrompt: "How do competency-based assessments differ from rote-based systems?"
  },
  {
    id: "ca-08",
    title: "Finance ministry signals deeper GST analytics for compliance",
    category: "Economy",
    ministry: "Ministry of Finance",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Tax administration, analytics, revenue governance",
    whyItMatters: "Good for understanding administrative efficiency within fiscal policy.",
    summary:
      "Improved analytics may help identify leakage patterns, risky filings, and targeted enforcement without broad harassment.",
    tags: ["GST", "Compliance", "Revenue"],
    difficulty: "Medium",
    quizPrompt: "Why is data-led compliance better than blanket enforcement?"
  },
  {
    id: "ca-09",
    title: "Rural livelihoods mission spotlights women-led producer groups",
    category: "Social Justice",
    ministry: "Ministry of Rural Development",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Women empowerment, livelihoods, SHGs",
    whyItMatters: "A likely BPSC angle because it links local economy, inclusion, and implementation.",
    summary:
      "Producer groups are being positioned as vehicles for income diversification, market linkage, and community-level economic resilience.",
    tags: ["SHGs", "Women", "Livelihoods"],
    difficulty: "Easy",
    quizPrompt: "How do SHG-linked producer groups improve rural livelihoods?"
  },
  {
    id: "ca-10",
    title: "PMO reviews heat preparedness ahead of summer escalation",
    category: "Environment",
    ministry: "Prime Minister's Office",
    source: "PMO",
    date: "2026-04-17",
    examAngle: "Climate adaptation, disaster preparedness, public health",
    whyItMatters: "Excellent issue for interdisciplinary answers crossing health, urban planning, and administration.",
    summary:
      "Preparedness measures include local warning systems, hospital readiness, water supply planning, and worker protection strategies.",
    tags: ["Climate", "Heatwave", "Preparedness"],
    difficulty: "Medium",
    quizPrompt: "Why should heatwaves be treated as a governance challenge?"
  },
  {
    id: "ca-11",
    title: "India signs targeted skill partnership with overseas institutions",
    category: "International Relations",
    ministry: "Ministry of External Affairs",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Diaspora, skilling, economic diplomacy",
    whyItMatters: "Shows how foreign policy can connect with employment and human capital.",
    summary:
      "The partnership aims to align training standards, increase employability, and support legal migration pathways in select sectors.",
    tags: ["Diplomacy", "Skills", "Migration"],
    difficulty: "Medium",
    quizPrompt: "How can skilling partnerships strengthen diplomacy?"
  },
  {
    id: "ca-12",
    title: "New biodiversity restoration plan prioritizes riverine stretches",
    category: "Environment",
    ministry: "Ministry of Environment, Forest and Climate Change",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Restoration ecology, water systems, climate resilience",
    whyItMatters: "Useful for environment prelims and applied ecology in mains.",
    summary:
      "The plan focuses on fragile river-linked habitats, native vegetation, and community participation in restoration activity.",
    tags: ["Biodiversity", "Rivers", "Ecology"],
    difficulty: "Medium",
    quizPrompt: "Why are riverine ecosystems important for ecological stability?"
  },
  {
    id: "ca-13",
    title: "President emphasizes inclusion during disability rights interaction",
    category: "Social Justice",
    ministry: "President Secretariat",
    source: "President Secretariat",
    date: "2026-04-17",
    examAngle: "Inclusive development, dignity, rights discourse",
    whyItMatters: "Useful for essay and ethics framing with constitutional language.",
    summary:
      "The message focuses on dignity, accessibility, and institutional sensitivity rather than charity-driven discourse.",
    tags: ["Inclusion", "Rights", "Accessibility"],
    difficulty: "Easy",
    quizPrompt: "How should governance move from welfare to dignity in disability policy?"
  },
  {
    id: "ca-14",
    title: "Digital public grievance review targets faster departmental closure",
    category: "Governance",
    ministry: "Department of Administrative Reforms",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Citizen services, accountability, grievance redressal",
    whyItMatters: "Directly relevant for administrative reform questions.",
    summary:
      "The review pushes better escalation paths, response quality audits, and dashboard-driven monitoring of pendency.",
    tags: ["Grievance Redressal", "Accountability", "Governance"],
    difficulty: "Easy",
    quizPrompt: "What makes grievance redressal effective beyond just quick disposal?"
  },
  {
    id: "ca-15",
    title: "Urban transport plan links clean mobility with city productivity",
    category: "Economy",
    ministry: "Ministry of Housing and Urban Affairs",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Urbanization, transport economics, sustainability",
    whyItMatters: "Lets aspirants frame mobility as an economy and governance issue together.",
    summary:
      "The emphasis is on multimodal transit, reduced congestion costs, and stronger urban service reliability.",
    tags: ["Urban Transport", "Mobility", "Cities"],
    difficulty: "Medium",
    quizPrompt: "How does public transport affect economic productivity?"
  },
  {
    id: "ca-16",
    title: "Renewable integration roadmap highlights storage readiness",
    category: "Science & Tech",
    ministry: "Ministry of Power",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Energy transition, storage, grid management",
    whyItMatters: "Important for linking climate goals with infrastructure constraints.",
    summary:
      "The roadmap frames energy storage as essential for balancing intermittency, peak demand, and grid reliability.",
    tags: ["Renewables", "Energy Storage", "Power"],
    difficulty: "Medium",
    quizPrompt: "Why is storage central to renewable energy expansion?"
  },
  {
    id: "ca-17",
    title: "Health system review stresses primary care data integration",
    category: "Schemes",
    ministry: "Ministry of Health and Family Welfare",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Public health administration, digital health, service delivery",
    whyItMatters: "A strong governance-health crossover topic.",
    summary:
      "Primary care data integration is being pitched as a route to continuity of care, disease surveillance, and local planning.",
    tags: ["Health", "Digital Health", "Primary Care"],
    difficulty: "Medium",
    quizPrompt: "What does data integration improve in primary healthcare?"
  },
  {
    id: "ca-18",
    title: "Skill ecosystem update targets district-industry alignment",
    category: "Economy",
    ministry: "Ministry of Skill Development",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Employment, district planning, skilling",
    whyItMatters: "Good for labor-market and local development answers.",
    summary:
      "District-level skilling plans are being tied more closely to actual employer demand, migration patterns, and placement outcomes.",
    tags: ["Skilling", "Employment", "Districts"],
    difficulty: "Easy",
    quizPrompt: "Why do district-specific skilling plans work better than generic ones?"
  },
  {
    id: "ca-19",
    title: "Official update tracks inland waterways logistics pilots",
    category: "Economy",
    ministry: "Ministry of Ports, Shipping and Waterways",
    source: "PIB",
    date: "2026-04-17",
    examAngle: "Transport diversification, logistics, infrastructure",
    whyItMatters: "Useful for infrastructure questions with economic efficiency angles.",
    summary:
      "Pilot routes are being used to test whether lower-cost bulk movement can reduce freight pressure on roads and rail.",
    tags: ["Waterways", "Infrastructure", "Logistics"],
    difficulty: "Medium",
    quizPrompt: "What are the advantages of inland waterways in freight movement?"
  },
  {
    id: "ca-20",
    title: "Administrative appointments update reshapes key oversight roles",
    category: "Appointments",
    ministry: "President Secretariat",
    source: "President Secretariat",
    date: "2026-04-17",
    examAngle: "Constitutional bodies, appointments, institutional structure",
    whyItMatters: "Appointments are common current-affairs territory for prelims.",
    summary:
      "A fresh round of constitutional and statutory appointments offers quick revision material on roles, powers, and institutional relevance.",
    tags: ["Appointments", "Institutions", "Polity"],
    difficulty: "Easy",
    quizPrompt: "Why do constitutional appointments matter in current affairs preparation?"
  },
];

export const dailyQuiz: DailyQuizQuestion[] = [
  {
    id: "quiz-1",
    question: "Which governance benefit is most directly associated with digital land records?",
    options: [
      "Lower food inflation",
      "Reduced property disputes and cleaner service delivery",
      "Higher foreign exchange reserves",
      "Expansion of coastal trade",
    ],
    answer: "Reduced property disputes and cleaner service delivery",
    explanation:
      "Land-record digitization mainly improves transparency, mutation efficiency, and dispute reduction.",
    category: "Governance",
  },
  {
    id: "quiz-2",
    question: "Why is energy storage important in renewable expansion?",
    options: [
      "It removes all transmission losses",
      "It allows fossil-fuel plants to close instantly",
      "It helps manage intermittency and peak balancing",
      "It replaces distribution companies",
    ],
    answer: "It helps manage intermittency and peak balancing",
    explanation:
      "Storage is critical because renewable generation varies with weather and time, while demand remains continuous.",
    category: "Science & Tech",
  },
  {
    id: "quiz-3",
    question: "The Command pattern is especially useful in Adobe-style apps because it supports:",
    options: [
      "Undo/redo and action history",
      "Compiler optimization only",
      "Database sharding",
      "Cryptographic hashing",
    ],
    answer: "Undo/redo and action history",
    explanation:
      "Command objects are ideal for reversible operations in tools where users expect history and repeatable actions.",
    category: "App Logic",
  },
];

export const ministryFocus = [
  {
    name: "PIB Core Ministries",
    items: ["Finance", "Home Affairs", "Education", "Rural Development", "Science & Technology"],
  },
  {
    name: "Executive Offices",
    items: ["PMO", "President Secretariat"],
  },
  {
    name: "High-yield exam buckets",
    items: ["Schemes", "Appointments", "Governance Reforms", "Economy", "Environment"],
  },
];
