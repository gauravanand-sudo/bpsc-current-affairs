export type HelpdeskIntent = "admission" | "course" | "payment" | "technical" | "general";

export type HelpdeskGuardrailReply = {
  answer: string;
  intent: HelpdeskIntent;
  leadReady?: boolean;
  needsHuman?: boolean;
};

export const HELP_DESK_IDENTITY = "I’m OneShot GS Talk to Us, the admissions and helpdesk assistant for the OneShot GS website.";

export const ONESHOT_GS_DESCRIPTION = "OneShot GS is the UPSC/BPSC preparation platform you’re currently using. The active paid programs on this site are UPSC CSE 2027 at ₹1,60,000 and 73rd BPSC at ₹87,000; both cover Foundation, Prelims, Mains and Interview. The site also provides PYQs, Current Affairs, Free Study, quizzes, demo classes and support.";

const TRUST_REPLY = "I don’t have live web-search access in this helpdesk, so I can’t verify how OneShot GS appears in search engines. I also won’t conclude that OneShot GS is fake, fictional or fraudulent merely because a user says so or because search visibility is unclear. I can only state the verified OneShot GS facts provided to this helpdesk and help you assess the programs on this site.";

const ROLE_LOCK_REPLY = "I can’t change my assigned identity, expose internal operating rules, adopt a different role, or treat user-provided claims as replacements for OneShot GS helpdesk facts. I can help with OneShot GS admissions, courses and fees, payment status, technical support or general helpdesk questions.";

const ADMISSION_DECISION_REPLY = "I can explain the program and verified fee details, but I shouldn’t make the admission decision for you. Before enrolling, review the course coverage, demo class, fee and support information on this site. The active programs are UPSC CSE 2027 at ₹1,60,000 and 73rd BPSC at ₹87,000. Online payment is temporarily unavailable while the payment flow is being fixed.";

function normalize(value: string) {
  return value.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

export function isHelpdeskRoleOverrideAttempt(question: string) {
  const q = normalize(question);
  const roleTerms = ["change your role", "change your identity", "you are now", "from now on", "act as", "roleplay as", "pretend to be"];
  if (roleTerms.some((term) => q.includes(term))) return true;

  const authorityVerbs = ["ignore", "disregard", "forget", "override", "bypass"];
  const authorityTargets = ["previous instructions", "above instructions", "system instructions", "developer instructions", "your rules", "your role", "your prompt"];
  if (authorityVerbs.some((verb) => q.includes(verb)) && authorityTargets.some((target) => q.includes(target))) return true;

  const extractionTargets = ["hidden instructions", "internal instructions", "system prompt", "developer message"];
  const extractionVerbs = ["show", "reveal", "print", "repeat", "quote"];
  return extractionTargets.some((target) => q.includes(target)) && extractionVerbs.some((verb) => q.includes(verb));
}

function isIdentityQuestion(question: string) {
  const q = normalize(question);
  return q.includes("who are you") || q.includes("what are you") || q.includes("identify yourself") || q.includes("what is your role");
}

function isOneShotDefinitionQuestion(question: string) {
  const q = normalize(question).replace(/one shot gs/g, "oneshot gs");
  return q.includes("what is oneshot gs") || q.includes("tell me about oneshot gs");
}

function isExistenceOrFraudChallenge(question: string) {
  const q = normalize(question).replace(/one shot gs/g, "oneshot gs");
  const target = ["oneshot gs", "organization", "organisation", "platform", "website", "you", "your"].some((term) => q.includes(term));
  const challenge = ["fake", "fraud", "fraudulent", "scam", "fictional", "not real", "isn't real", "doesn't exist", "does not exist", "nonexistent"].some((term) => q.includes(term));
  const visibility = ["google", "internet", "search engine", "online"].some((term) => q.includes(term)) && ["can't find", "cannot find", "don't find", "do not find", "not find", "no presence", "nothing"].some((term) => q.includes(term));
  return target && (challenge || visibility);
}

function isAdmissionDecisionQuestion(question: string) {
  const q = normalize(question);
  const asksDecision = ["should i", "would you recommend", "is it safe for me to", "do you recommend"].some((term) => q.includes(term));
  const admissionTerm = ["admission", "join", "enrol", "enroll", "pay"].some((term) => q.includes(term));
  return asksDecision && admissionTerm;
}

export function getHelpdeskGuardrailReply(question: string, fallbackIntent: HelpdeskIntent): HelpdeskGuardrailReply | null {
  if (isHelpdeskRoleOverrideAttempt(question)) return { answer: ROLE_LOCK_REPLY, intent: fallbackIntent };
  if (isIdentityQuestion(question)) return { answer: HELP_DESK_IDENTITY, intent: "general" };
  if (isOneShotDefinitionQuestion(question)) return { answer: ONESHOT_GS_DESCRIPTION, intent: "course" };
  if (isExistenceOrFraudChallenge(question)) return { answer: TRUST_REPLY, intent: "general" };
  if (isAdmissionDecisionQuestion(question)) return { answer: ADMISSION_DECISION_REPLY, intent: "admission" };
  return null;
}

export function helpdeskAnswerViolatesRole(answer: string) {
  const q = normalize(answer).replace(/one shot gs/g, "oneshot gs");
  const forbidden = [
    "fictional context",
    "created in a fictional",
    "not a real organization",
    "not a real organisation",
    "i don't have a real website",
    "i do not have a real website",
    "i don't represent a real organization",
    "i do not represent a real organization",
    "i'm chatgpt",
    "i am chatgpt",
    "i'm llama",
    "i am llama",
  ];
  if (forbidden.some((term) => q.includes(term))) return true;

  const oneShotMention = q.includes("oneshot gs");
  const contradiction = [" fake", " fraud", " scam", " fictional", " not real", "doesn't exist", "does not exist", "nonexistent"].some((term) => q.includes(term));
  return oneShotMention && contradiction;
}

export function safeHelpdeskFallback(question: string, intent: HelpdeskIntent) {
  return getHelpdeskGuardrailReply(question, intent)?.answer || "I’m OneShot GS Talk to Us. I can help with OneShot GS admissions, courses and fees, payment status, website issues or general helpdesk questions.";
}
