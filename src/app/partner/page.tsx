"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

/* ── Types ───────────────────────────────────────────────────────── */
type PartnerProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  exam_target: string;
  stage: string;
  district: string;
  language: string;
  gender_preference: string;
  partner_gender_preference: string;
  study_mode: string;
  daily_hours: string;
  slots: string[];
  weak_subjects: string[];
  strong_subjects: string[];
  bio: string;
  seriousness_score: number;
  is_active: boolean;
  updated_at: string;
};

type PartnerConnection = {
  id: string;
  requester_id: string;
  receiver_id: string;
  request_focus: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  opener: string;
  created_at: string;
  responded_at: string | null;
};

type PartnerMessage = {
  id: number;
  connection_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

type PartnerCheckin = {
  id: number;
  connection_id: string;
  user_id: string;
  checkin_date: string;
  target: string;
  completed: boolean;
  focus_minutes: number;
  mood: string;
  created_at: string;
  updated_at: string;
};

/* ── Constants ───────────────────────────────────────────────────── */
const EXAMS    = ["72nd BPSC", "BPSC TRE", "Bihar SI", "UPSC + BPSC", "Bihar SSC"];
const STAGES   = ["Starting", "Building basics", "Revision", "Test series", "Final sprint"];
const DISTRICTS = [
  "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnea",
  "Nalanda", "Siwan", "Bhojpur", "Bihar", "Outside Bihar",
];
const LANGUAGES = ["Hindi", "English", "Hindi + English"];
const HOURS     = ["1-2 hrs/day", "2-3 hrs/day", "3-5 hrs/day", "5+ hrs/day"];
const MODES     = [
  "Accountability + Silent Study", "Doubt discussion",
  "Daily target check", "Mock-test partner", "Full syllabus revision",
];
const REQUEST_FOCUSES = [
  "Current Affairs", "Answer Writing", "Mock Analysis",
  "Daily Revision", "Doubt Solving", "Bihar Special",
];
const SLOTS    = ["Morning", "Afternoon", "Evening", "Late night"];
const SUBJECTS = [
  "Current Affairs", "Polity", "Economy", "History", "Geography",
  "Bihar Special", "Science", "Environment", "Maths", "Reasoning",
];
const GENDER_PREFS = ["No preference", "Female only", "Male only"];
const MOODS        = ["locked in", "steady", "tired but showing up", "test mode"];

/* ── Helpers ─────────────────────────────────────────────────────── */
function firstName(session: Session | null) {
  const u = session?.user;
  return (u?.user_metadata?.full_name as string | undefined)?.split(" ")[0]
    ?? u?.email?.split("@")[0]
    ?? "Aspirant";
}

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000)    return "just now";
  if (d < 3600000)  return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

function todayKey() { return new Date().toISOString().slice(0, 10); }

function connFocus(conn: Pick<PartnerConnection, "request_focus">) {
  return conn.request_focus || "Current Affairs";
}

function overlap(a: string[] = [], b: string[] = []) {
  return a.filter(x => b.includes(x));
}

function scoreMatch(me: PartnerProfile | null, p: PartnerProfile) {
  if (!me) return 60;
  let s = 24;
  if (p.exam_target === me.exam_target)  s += 16;
  if (p.stage       === me.stage)        s += 10;
  if (p.language    === me.language)     s += 8;
  if (p.district    === me.district)     s += 6;
  if (p.daily_hours === me.daily_hours)  s += 8;
  s += Math.min(16, overlap(p.slots, me.slots).length * 8);
  s += Math.min(18, overlap(p.strong_subjects, me.weak_subjects).length * 9);
  s += Math.min(10, overlap(p.weak_subjects, me.strong_subjects).length * 5);
  s += Math.round(Math.min(p.seriousness_score, 100) / 10);
  return Math.min(99, s);
}

function matchReason(me: PartnerProfile | null, p: PartnerProfile) {
  if (!me) return "Create your profile to unlock precise matching.";
  const r: string[] = [];
  if (p.exam_target === me.exam_target) r.push("same exam");
  if (p.stage       === me.stage)       r.push("same stage");
  const slots = overlap(p.slots, me.slots);
  if (slots.length) r.push(`${slots[0].toLowerCase()} slot`);
  const helps = overlap(p.strong_subjects, me.weak_subjects);
  if (helps.length) r.push(`strong in your weak: ${helps[0]}`);
  return r.length ? r.slice(0, 3).join(" · ") : "Good for accountability variety.";
}

function scoreColor(score: number) {
  if (score >= 80) return { text: "#16a34a", bg: "rgba(22,163,74,0.10)", border: "rgba(22,163,74,0.28)" };
  if (score >= 60) return { text: "#d97706", bg: "rgba(217,119,6,0.10)", border: "rgba(217,119,6,0.28)" };
  return { text: "#c06010", bg: "rgba(192,96,16,0.08)", border: "rgba(192,96,16,0.22)" };
}

/* ── Avatar ──────────────────────────────────────────────────────── */
function Avatar({ url, name, size = 44 }: { url: string | null; name: string; size?: number }) {
  if (url) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "grid", placeItems: "center",
      background: "var(--accent-soft)", color: "var(--accent)",
      fontWeight: 900, fontSize: Math.round(size * 0.36),
    }}>{initials(name)}</div>
  );
}

/* ── SelectField ─────────────────────────────────────────────────── */
function SelectField({ label, value, values, onChange }: {
  label: string; value: string; values: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        display: "block", width: "100%", marginTop: 7,
        border: "1px solid var(--line)", borderRadius: 12, padding: "11px 12px",
        background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 700, fontSize: 13,
        appearance: "auto",
      }}>
        {values.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

/* ── MultiField ──────────────────────────────────────────────────── */
function MultiField({ label, values, selected, onToggle }: {
  label: string; values: string[]; selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {values.map(item => {
          const active = selected.includes(item);
          return (
            <button key={item} type="button" onClick={() => onToggle(item)} style={{
              border: active ? "1.5px solid var(--accent)" : "1px solid var(--line)",
              background: active ? "var(--accent-soft)" : "var(--panel)",
              color: active ? "var(--accent)" : "var(--muted)",
              borderRadius: 999, padding: "6px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>{item}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function PartnerPage() {
  const [session,   setSession]   = useState<Session | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [tab, setTab] = useState<"discover" | "requests" | "chat" | "profile">("discover");

  // Data
  const [profiles,    setProfiles]    = useState<PartnerProfile[]>([]);
  const [myProfile,   setMyProfile]   = useState<PartnerProfile | null>(null);
  const [connections, setConnections] = useState<PartnerConnection[]>([]);

  // Chat
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [messages,   setMessages]   = useState<PartnerMessage[]>([]);
  const [checkins,   setCheckins]   = useState<PartnerCheckin[]>([]);
  const [msgText,    setMsgText]    = useState("");
  const [showPact,   setShowPact]   = useState(false);

  // Daily pact
  const [targetText,    setTargetText]    = useState("");
  const [focusMinutes,  setFocusMinutes]  = useState(90);
  const [mood,          setMood]          = useState("locked in");

  // UI
  const [actionPending,      setActionPending]      = useState<string | null>(null);
  const [requestFocusByUser, setRequestFocusByUser] = useState<Record<string, string>>({});
  const [saving,  setSaving]  = useState(false);
  const [notice,  setNotice]  = useState("");

  const bottomRef             = useRef<HTMLDivElement>(null);
  const msgScrollRef          = useRef<HTMLDivElement>(null);
  const activeConnIdRef       = useRef<string | null>(null);
  const noticeTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only auto-scroll when user is already within 120px of the bottom
  function scrollToBottomIfNear() {
    const el = msgScrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }

  // Always scroll — used when the user themselves sends a message
  function scrollToBottom() {
    const el = msgScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  const [form, setForm] = useState({
    exam_target:             "72nd BPSC",
    stage:                   "Revision",
    district:                "Patna",
    language:                "Hindi + English",
    gender_preference:       "No preference",
    partner_gender_preference: "No preference",
    study_mode:              "Accountability + Silent Study",
    daily_hours:             "2-3 hrs/day",
    slots:         ["Evening"]                          as string[],
    weak_subjects: ["Current Affairs", "Polity"]        as string[],
    strong_subjects: ["Bihar Special"]                  as string[],
    bio: "I want a serious partner for daily targets, revision and mock analysis.",
    seriousness_score: 70,
  });

  const userId = session?.user.id ?? "";

  const profileMap = useMemo(
    () => new Map(profiles.concat(myProfile ? [myProfile] : []).map(p => [p.user_id, p])),
    [profiles, myProfile],
  );

  const accepted = connections.filter(c => c.status === "accepted");
  const incoming = connections.filter(c => c.status === "pending" && c.receiver_id === userId);
  const outgoing = connections.filter(c => c.status === "pending" && c.requester_id === userId);

  const activeConnection = accepted.find(c => c.id === activeConnectionId) ?? accepted[0] ?? null;
  const activePartnerId  = activeConnection
    ? (activeConnection.requester_id === userId ? activeConnection.receiver_id : activeConnection.requester_id)
    : "";

  const todaysCheckins = checkins.filter(c => c.checkin_date === todayKey());
  const myCheckin      = todaysCheckins.find(c => c.user_id === userId)          ?? null;
  const partnerCheckin = todaysCheckins.find(c => c.user_id === activePartnerId) ?? null;
  const pactComplete   = Boolean(myCheckin?.completed && partnerCheckin?.completed);
  const pairFocusMins  = todaysCheckins.reduce((sum, r) => sum + r.focus_minutes, 0);

  const otherUserId = (conn: PartnerConnection) =>
    conn.requester_id === userId ? conn.receiver_id : conn.requester_id;

  const candidates = useMemo(() =>
    profiles
      .filter(p => p.user_id !== userId)
      .map(p => ({ profile: p, score: scoreMatch(myProfile, p), reason: matchReason(myProfile, p) }))
      .sort((a, b) => b.score - a.score),
    [myProfile, profiles, userId],
  );

  function showNotice(msg: string) {
    setNotice(msg);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(""), 4500);
  }

  /* ── Effects ─────────────────────────────────────────────────── */
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => { setSession(data.session ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { activeConnIdRef.current = activeConnection?.id ?? null; }, [activeConnection?.id]);

  useEffect(() => {
    if (!activeConnectionId && accepted.length > 0) setActiveConnectionId(accepted[0].id);
  }, [accepted, activeConnectionId]);

  useEffect(() => {
    if (!session) return;
    void loadAll();
    const supabase = getSupabaseBrowserClient();
    const ch = supabase
      .channel("study-partner-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_profiles" }, () => void loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_connections" }, () => void loadAll())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "study_partner_messages" }, payload => {
        const next = payload.new as PartnerMessage;
        if (next.connection_id === activeConnIdRef.current) {
          setMessages(prev => prev.some(m => m.id === next.id) ? prev : [...prev, next]);
          setTimeout(() => scrollToBottomIfNear(), 40);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_checkins" }, payload => {
        const next = payload.new as PartnerCheckin;
        if (next?.connection_id === activeConnIdRef.current) void loadCheckins(next.connection_id);
      })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  useEffect(() => {
    if (activeConnection?.id) {
      void loadMessages(activeConnection.id, true);  // initial load → force-scroll
      void loadCheckins(activeConnection.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnection?.id]);

  useEffect(() => {
    if (!activeConnection?.id) return;
    const t = window.setInterval(() => void loadMessages(activeConnection.id), 4500);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnection?.id]);

  /* ── Loaders ─────────────────────────────────────────────────── */
  async function loadAll() {
    if (!session) return;
    const supabase = getSupabaseBrowserClient();
    const [{ data: ap }, { data: ac }] = await Promise.all([
      (supabase as any).from("study_partner_profiles").select("*").order("updated_at", { ascending: false }),
      (supabase as any).from("study_partner_connections").select("*").order("created_at", { ascending: false }),
    ]);
    const typed = (ap ?? []) as PartnerProfile[];
    const mine  = typed.find(p => p.user_id === session.user.id) ?? null;
    setMyProfile(mine);
    setProfiles(typed.filter(p => p.user_id !== session.user.id && p.is_active));
    setConnections((ac ?? []) as PartnerConnection[]);
    if (mine) {
      setForm({
        exam_target: mine.exam_target, stage: mine.stage, district: mine.district,
        language: mine.language, gender_preference: mine.gender_preference,
        partner_gender_preference: mine.partner_gender_preference, study_mode: mine.study_mode,
        daily_hours: mine.daily_hours, slots: mine.slots, weak_subjects: mine.weak_subjects,
        strong_subjects: mine.strong_subjects, bio: mine.bio, seriousness_score: mine.seriousness_score,
      });
    } else {
      setTab("profile");
    }
  }

  async function loadMessages(connectionId: string, forceScroll = false) {
    const supabase = getSupabaseBrowserClient();
    const { data } = await (supabase as any)
      .from("study_partner_messages").select("*")
      .eq("connection_id", connectionId).order("created_at", { ascending: true }).limit(100);
    setMessages((data ?? []) as PartnerMessage[]);
    // On initial load force-scroll; on polling only scroll if already at bottom
    setTimeout(() => forceScroll ? scrollToBottom() : scrollToBottomIfNear(), 60);
  }

  async function loadCheckins(connectionId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data } = await (supabase as any)
      .from("study_partner_checkins").select("*")
      .eq("connection_id", connectionId)
      .gte("checkin_date", new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10))
      .order("checkin_date", { ascending: false });
    const rows = (data ?? []) as PartnerCheckin[];
    setCheckins(rows);
    const mine = rows.find(r => r.user_id === userId && r.checkin_date === todayKey());
    if (mine) { setTargetText(mine.target); setFocusMinutes(mine.focus_minutes || 90); setMood(mine.mood || "locked in"); }
    else       { setTargetText(""); setFocusMinutes(90); setMood("locked in"); }
  }

  /* ── Actions ──────────────────────────────────────────────────── */
  async function signIn() {
    await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/partner` },
    });
  }

  function toggleArr(key: "slots" | "weak_subjects" | "strong_subjects", val: string) {
    setForm(prev => {
      const cur = prev[key];
      return { ...prev, [key]: cur.includes(val) ? cur.filter(i => i !== val) : [...cur, val] };
    });
  }

  async function saveProfile() {
    if (!session) return;
    setSaving(true);
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_profiles").upsert({
      user_id: session.user.id,
      display_name: firstName(session),
      avatar_url: (session.user.user_metadata?.avatar_url as string | undefined) ?? null,
      ...form,
      bio: form.bio.trim().slice(0, 220),
      is_active: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { showNotice(error.message); return; }
    showNotice("Profile saved. Matches refreshed.");
    await loadAll();
    setTab("discover");
  }

  async function sendRequest(receiverId: string, requestFocus: string) {
    if (!session || !myProfile) { setTab("profile"); showNotice("Create your profile first."); return; }
    const pendingKey = `request:${receiverId}:${requestFocus}`;
    setActionPending(pendingKey);
    const supabase = getSupabaseBrowserClient();
    const partner = profileMap.get(receiverId);
    const opener  = `Hi ${partner?.display_name ?? "there"}, let's do a focused ${requestFocus} sprint for BPSC.`;

    const { data: existingRows, error: existingError } = await (supabase as any)
      .from("study_partner_connections").select("*")
      .or(`and(requester_id.eq.${session.user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${session.user.id})`)
      .eq("request_focus", requestFocus).order("created_at", { ascending: false }).limit(1);

    if (existingError) { setActionPending(null); showNotice(existingError.message); return; }

    const existing = ((existingRows ?? []) as PartnerConnection[])[0];
    if (existing?.status === "accepted") {
      setActiveConnectionId(existing.id); setTab("chat");
      showNotice(`Already chatting with ${partner?.display_name ?? "this student"} for ${requestFocus}.`);
      setActionPending(null); return;
    }
    if (existing?.status === "pending") {
      setTab("requests");
      showNotice(`A ${requestFocus} request is already pending.`);
      setActionPending(null); return;
    }

    const payload = { requester_id: session.user.id, receiver_id: receiverId, request_focus: requestFocus, opener };
    const { error } = existing
      ? await (supabase as any).from("study_partner_connections")
          .update({ ...payload, status: "pending", responded_at: null, created_at: new Date().toISOString() }).eq("id", existing.id)
      : await (supabase as any).from("study_partner_connections").insert(payload);

    if (error) {
      setActionPending(null);
      showNotice(error.message.includes("duplicate")
        ? `Already connected for ${requestFocus}. Check Requests or Messages.`
        : error.message);
      return;
    }
    showNotice("Request sent! Chat unlocks when they accept.");
    await loadAll();
    setActionPending(null);
    setTab("requests");
  }

  async function updateConnection(id: string, status: "accepted" | "rejected" | "cancelled") {
    setActionPending(`${status}:${id}`);
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_connections")
      .update({ status, responded_at: new Date().toISOString() }).eq("id", id);
    if (error) { setActionPending(null); showNotice(error.message); return; }
    await loadAll();
    setActionPending(null);
    if (status === "accepted") { setActiveConnectionId(id); setTab("chat"); }
  }

  async function sendMessage() {
    if (!session || !activeConnection || !msgText.trim()) return;
    const body = msgText.trim().slice(0, 600);
    setMsgText("");
    const opt: PartnerMessage = {
      id: -Date.now(), connection_id: activeConnection.id, sender_id: userId,
      body, created_at: new Date().toISOString(), read_at: null,
    };
    setMessages(prev => [...prev, opt]);
    setTimeout(() => scrollToBottom(), 40);
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_messages")
      .insert({ connection_id: activeConnection.id, sender_id: userId, body });
    if (error) { showNotice(error.message); setMessages(prev => prev.filter(m => m.id !== opt.id)); return; }
    await loadMessages(activeConnection.id, true);
  }

  async function saveCheckin(completed = false) {
    if (!session || !activeConnection) return;
    const target = targetText.trim().slice(0, 220);
    if (!target) { showNotice("Add today's target first."); return; }
    setActionPending(completed ? "done" : "lock");
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_checkins").upsert({
      connection_id: activeConnection.id, user_id: userId, checkin_date: todayKey(),
      target, completed: completed || myCheckin?.completed || false,
      focus_minutes: focusMinutes, mood, updated_at: new Date().toISOString(),
    }, { onConflict: "connection_id,user_id,checkin_date" });
    if (error) { setActionPending(null); showNotice(error.message); return; }
    await loadCheckins(activeConnection.id);
    const partner = profileMap.get(activePartnerId);
    setMsgText(completed
      ? `Done for today: ${target} (${focusMinutes} min). Your turn, ${partner?.display_name ?? "partner"}.`
      : `Today's target: ${target} (${focusMinutes} min). Let's finish this.`
    );
    setActionPending(null);
    showNotice(completed ? "Done marked! Hit Send to notify your partner." : "Target locked! Send it to your partner.");
  }

  async function reportUser(reportedUserId: string) {
    if (!session) return;
    const reason = window.prompt("Why are you reporting this user?");
    if (!reason?.trim()) return;
    await (getSupabaseBrowserClient() as any).from("study_partner_reports").insert({
      reporter_id: userId, reported_user_id: reportedUserId, reason: reason.trim().slice(0, 300),
    });
    showNotice("Report submitted. We will review this user.");
  }

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>🤝</p>
        <p style={{ color: "var(--muted)", fontWeight: 700, fontSize: 15 }}>Finding your tribe…</p>
      </div>
    </main>
  );

  /* ── Sign-in gate ─────────────────────────────────────────────── */
  if (!session) return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "grid", placeItems: "center", padding: "24px 16px" }}>
      <div style={{
        maxWidth: 500, width: "100%", textAlign: "center",
        border: "1px solid var(--line)", borderRadius: 28,
        background: "var(--card)", padding: "44px 32px",
        boxShadow: "0 24px 64px rgba(39,24,8,0.09)",
      }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🤝</p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 5vw, 2.3rem)",
          lineHeight: 1.1, color: "var(--ink-strong)", marginBottom: 14, letterSpacing: "-0.02em",
        }}>
          Find one serious aspirant.<br />Finish BPSC together.
        </h1>
        <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 28, fontSize: 14, maxWidth: 380, margin: "0 auto 28px" }}>
          Matched by exam, weak subjects, study slot and prep stage. Private 1:1 chat opens only after both students connect.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, textAlign: "left" }}>
          {[
            ["🎯", "Smart match by exam + stage + weak subjects"],
            ["🔒", "Private 1:1 chat — no public feed, no strangers"],
            ["📋", "Daily pact — shared target + completion check-in"],
            ["🛡️", "Report system to keep quality high"],
          ].map(([icon, text]) => (
            <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-soft)" }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <button onClick={signIn} style={{
          width: "100%", border: "none", borderRadius: 16, padding: "15px 24px",
          background: "var(--accent)", color: "#fff", fontWeight: 900,
          fontFamily: "var(--font-display)", cursor: "pointer", fontSize: 16,
        }}>
          Sign in with Google →
        </button>
      </div>
    </main>
  );

  /* ── Tabs config ─────────────────────────────────────────────── */
  const TABS = [
    { id: "discover"  as const, icon: "🔍", label: "Discover",  badge: candidates.length || null },
    { id: "requests"  as const, icon: "📨", label: "Requests",  badge: incoming.length   || null },
    { id: "chat"      as const, icon: "💬", label: "Chat",      badge: accepted.length   || null },
    { id: "profile"   as const, icon: "👤", label: myProfile ? "Profile" : "Setup ✦", badge: null },
  ];

  /* ── Main render ─────────────────────────────────────────────── */
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 80 }}>

      {/* ── Page header + Tab bar ────────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--card)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>

          {/* Mini header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 10, gap: 12 }}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.26em", color: "var(--accent)", textTransform: "uppercase" }}>
                Study Partner
              </p>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.15rem, 3.5vw, 1.55rem)", letterSpacing: "-0.02em", color: "var(--ink-strong)", lineHeight: 1.15 }}>
                Hey {firstName(session)} 👋
              </h1>
            </div>
            {candidates.length > 0 && (
              <div style={{
                background: "var(--accent-soft)", border: "1px solid var(--accent-border)",
                borderRadius: 14, padding: "7px 12px", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{candidates.length}</p>
                <p style={{ fontSize: 9, color: "var(--muted)", marginTop: 2, letterSpacing: "0.06em" }}>MATCHES</p>
              </div>
            )}
          </div>

          {/* Tab row */}
          <div style={{ display: "flex" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, border: "none", background: "none", cursor: "pointer",
                padding: "9px 6px 13px",
                borderBottom: tab === t.id ? "2.5px solid var(--accent)" : "2.5px solid transparent",
                color: tab === t.id ? "var(--accent)" : "var(--muted)",
                fontSize: 11, fontWeight: tab === t.id ? 800 : 600,
                position: "relative", transition: "color 0.15s",
              }}>
                <span style={{ fontSize: 15, display: "block", marginBottom: 2 }}>{t.icon}</span>
                {t.label}
                {t.badge != null && (
                  <span style={{
                    position: "absolute", top: 5, right: "50%", transform: "translateX(10px)",
                    background: "var(--accent)", color: "#fff",
                    borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 5px", minWidth: 16, textAlign: "center",
                  }}>{t.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* Toast notice */}
        {notice && (
          <div style={{
            marginBottom: 16, padding: "11px 15px",
            background: "rgba(184,97,23,0.07)", border: "1px solid rgba(184,97,23,0.22)",
            borderRadius: 14, fontSize: 13, fontWeight: 700, color: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          }}>
            <span>{notice}</span>
            <button onClick={() => setNotice("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
          </div>
        )}

        {/* ════════════════════════ DISCOVER ════════════════════════ */}
        {tab === "discover" && (
          <div>
            {/* Create profile nudge */}
            {!myProfile && (
              <div style={{
                border: "1.5px dashed var(--accent-border)", borderRadius: 20,
                padding: "28px 20px", textAlign: "center", marginBottom: 24,
                background: "linear-gradient(135deg, rgba(192,96,16,0.04), transparent)",
              }}>
                <p style={{ fontSize: 36, marginBottom: 10 }}>👤</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-strong)", marginBottom: 8 }}>Set up your profile first</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.65, maxWidth: 360, margin: "0 auto 18px" }}>
                  Tell us your exam, weak subjects and study slot. Matching is useful only after we know your prep situation.
                </p>
                <button onClick={() => setTab("profile")} style={{
                  border: "none", borderRadius: 14, padding: "12px 22px",
                  background: "var(--accent)", color: "#fff", fontWeight: 900,
                  fontFamily: "var(--font-display)", cursor: "pointer", fontSize: 15,
                }}>
                  Create profile →
                </button>
              </div>
            )}

            {/* Empty state */}
            {myProfile && candidates.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
                <p style={{ fontSize: 44, marginBottom: 12 }}>🔍</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-strong)", marginBottom: 8 }}>No matches yet</h2>
                <p style={{ fontSize: 13, lineHeight: 1.65 }}>More aspirants join daily. Check back soon.</p>
              </div>
            )}

            {/* Candidate cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {candidates.map(({ profile, score, reason }) => {
                const focus   = requestFocusByUser[profile.user_id] ?? REQUEST_FOCUSES[0];
                const pKey    = `request:${profile.user_id}:${focus}`;
                const col     = scoreColor(score);
                const connFor = connections.find(c =>
                  (c.status === "pending" || c.status === "accepted")
                  && connFocus(c) === focus
                  && (c.requester_id === profile.user_id || c.receiver_id === profile.user_id)
                );

                return (
                  <article key={profile.user_id} style={{
                    border: "1px solid var(--line)", borderRadius: 22, padding: "18px 16px",
                    background: "var(--card)", display: "flex", flexDirection: "column", gap: 12,
                    boxShadow: "0 4px 20px rgba(39,24,8,0.05)",
                  }}>
                    {/* Name row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <Avatar url={profile.avatar_url} name={profile.display_name} size={46} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                          color: "var(--ink-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{profile.display_name}</p>
                        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                          {profile.district} · {profile.stage}
                        </p>
                      </div>
                      <div style={{
                        background: col.bg, border: `1px solid ${col.border}`,
                        borderRadius: 14, padding: "6px 10px", textAlign: "center", flexShrink: 0,
                      }}>
                        <p style={{ fontSize: 18, fontWeight: 900, color: col.text, lineHeight: 1 }}>{score}</p>
                        <p style={{ fontSize: 9, color: col.text, opacity: 0.75, letterSpacing: "0.05em", marginTop: 1 }}>MATCH</p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div style={{ height: 4, background: "rgba(120,80,30,0.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        width: `${score}%`, height: "100%", borderRadius: 999,
                        background: score >= 80 ? "linear-gradient(90deg,#c06010,#16a34a)" : `linear-gradient(90deg,${col.text},${col.text})`,
                      }} />
                    </div>

                    {/* Match reason */}
                    <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5, fontStyle: "italic" }}>
                      ✨ {reason}
                    </p>

                    {/* Bio excerpt */}
                    {profile.bio && (
                      <p style={{
                        fontSize: 13, color: "var(--ink-strong)", lineHeight: 1.55,
                        borderLeft: "3px solid var(--line)", paddingLeft: 10,
                      }}>
                        {profile.bio.slice(0, 120)}{profile.bio.length > 120 ? "…" : ""}
                      </p>
                    )}

                    {/* Pill row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {[profile.exam_target, profile.daily_hours, profile.language].map(pill => (
                        <span key={pill} style={{
                          border: "1px solid var(--line)", borderRadius: 999, padding: "4px 9px",
                          fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", background: "var(--panel)",
                        }}>{pill}</span>
                      ))}
                    </div>

                    {/* Subjects grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ background: "rgba(22,163,74,0.07)", borderRadius: 12, padding: "9px 10px" }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#15803d", letterSpacing: "0.05em", marginBottom: 4 }}>STRONG</p>
                        <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.4 }}>{profile.strong_subjects.slice(0, 3).join(", ") || "—"}</p>
                      </div>
                      <div style={{ background: "rgba(220,38,38,0.05)", borderRadius: 12, padding: "9px 10px" }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: "#b91c1c", letterSpacing: "0.05em", marginBottom: 4 }}>WORKING ON</p>
                        <p style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.4 }}>{profile.weak_subjects.slice(0, 3).join(", ") || "—"}</p>
                      </div>
                    </div>

                    {/* Request box */}
                    <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: "12px" }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        Request a focused room
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select
                          value={focus}
                          onChange={e => setRequestFocusByUser(prev => ({ ...prev, [profile.user_id]: e.target.value }))}
                          style={{
                            flex: 1, minWidth: 0, border: "1px solid var(--line)", borderRadius: 11,
                            padding: "9px 10px", background: "var(--card)", color: "var(--ink-strong)", fontWeight: 700, fontSize: 13,
                          }}
                        >
                          {REQUEST_FOCUSES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <button
                          disabled={actionPending === pKey}
                          onClick={() => {
                            if (connFor?.status === "accepted") { setActiveConnectionId(connFor.id); setTab("chat"); }
                            else void sendRequest(profile.user_id, focus);
                          }}
                          style={{
                            border: "none", borderRadius: 11, padding: "0 16px",
                            background: connFor?.status === "accepted" ? "#16a34a" : "var(--accent)",
                            color: "#fff", fontWeight: 900, cursor: "pointer",
                            opacity: actionPending === pKey ? 0.7 : 1,
                            fontSize: 13, whiteSpace: "nowrap", flexShrink: 0,
                          }}
                        >
                          {actionPending === pKey ? "…"
                            : connFor?.status === "accepted" ? "Open →"
                            : connFor?.status === "pending"  ? "Pending"
                            : "Send →"}
                        </button>
                      </div>
                      {connFor?.status === "pending" && (
                        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Pending. Try a different focus topic.</p>
                      )}
                    </div>

                    {/* Footer row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>Active {timeAgo(profile.updated_at)}</p>
                      <button onClick={() => reportUser(profile.user_id)} style={{
                        background: "none", border: "1px solid var(--line)", borderRadius: 10,
                        padding: "4px 10px", fontSize: 11, color: "var(--muted)", cursor: "pointer",
                      }}>Report</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════ REQUESTS ════════════════════════ */}
        {tab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Incoming */}
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-strong)" }}>Requests to you</h2>
                {incoming.length > 0 && (
                  <span style={{
                    background: "rgba(22,163,74,0.10)", color: "#16a34a",
                    border: "1px solid rgba(22,163,74,0.28)", borderRadius: 999, padding: "2px 9px", fontSize: 11, fontWeight: 800,
                  }}>{incoming.length} new</span>
                )}
              </div>
              {incoming.length === 0 ? (
                <div style={{ border: "1px dashed var(--line)", borderRadius: 16, padding: "24px 20px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  No incoming requests. Share your profile link to get one!
                </div>
              ) : incoming.map(row => {
                const partner = profileMap.get(otherUserId(row));
                return (
                  <div key={row.id} style={{
                    border: "1px solid rgba(22,163,74,0.25)", borderRadius: 18,
                    padding: "16px 14px", marginBottom: 10, background: "rgba(22,163,74,0.025)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                      <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={42} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 15 }}>{partner?.display_name ?? "Aspirant"}</p>
                        <p style={{ fontSize: 12, color: "var(--muted)" }}>{partner?.exam_target} · {partner?.stage}</p>
                      </div>
                      <span style={{
                        background: "rgba(22,163,74,0.10)", color: "#16a34a",
                        border: "1px solid rgba(22,163,74,0.28)", borderRadius: 999, padding: "3px 9px", fontSize: 11, fontWeight: 800,
                      }}>{connFocus(row)}</span>
                    </div>
                    <p style={{
                      fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 12,
                      borderLeft: "3px solid rgba(22,163,74,0.3)", paddingLeft: 10,
                    }}>{row.opener}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => updateConnection(row.id, "accepted")} style={{
                        flex: 1, border: "none", borderRadius: 12, padding: "12px 0",
                        background: "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff", fontWeight: 900, cursor: "pointer",
                      }}>Accept</button>
                      <button onClick={() => updateConnection(row.id, "rejected")} style={{
                        flex: 1, border: "1px solid var(--line)", borderRadius: 12, padding: "12px 0",
                        background: "var(--panel)", color: "var(--muted)", fontWeight: 700, cursor: "pointer",
                      }}>Decline</button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Sent */}
            <section>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-strong)", marginBottom: 14 }}>Sent by you</h2>
              {outgoing.length === 0 ? (
                <div style={{ border: "1px dashed var(--line)", borderRadius: 16, padding: "24px 20px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  No sent requests. Go to Discover and send one.
                </div>
              ) : outgoing.map(row => {
                const partner = profileMap.get(otherUserId(row));
                return (
                  <div key={row.id} style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "16px 14px", marginBottom: 10, background: "var(--card)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                      <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={42} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 15 }}>{partner?.display_name ?? "Aspirant"}</p>
                        <p style={{ fontSize: 12, color: "var(--muted)" }}>{partner?.exam_target} · {partner?.district}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{
                          background: "rgba(217,119,6,0.10)", color: "#d97706",
                          border: "1px solid rgba(217,119,6,0.28)", borderRadius: 999,
                          padding: "3px 9px", fontSize: 11, fontWeight: 800, display: "block", marginBottom: 4,
                        }}>{connFocus(row)}</span>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>{timeAgo(row.created_at)}</p>
                      </div>
                    </div>
                    <button onClick={() => updateConnection(row.id, "cancelled")} style={{
                      width: "100%", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 0",
                      background: "var(--panel)", color: "var(--muted)", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    }}>Cancel request</button>
                  </div>
                );
              })}
            </section>

            {/* Active connections shortcut */}
            {accepted.length > 0 && (
              <section>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink-strong)", marginBottom: 14 }}>Active connections</h2>
                {accepted.map(row => {
                  const partner = profileMap.get(otherUserId(row));
                  return (
                    <div key={row.id} style={{
                      border: "1px solid rgba(22,163,74,0.28)", borderRadius: 18,
                      padding: "14px 14px", marginBottom: 10, background: "rgba(22,163,74,0.025)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={40} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 15 }}>{partner?.display_name ?? "Partner"}</p>
                          <p style={{ fontSize: 12, color: "var(--muted)" }}>{connFocus(row)} room · connected</p>
                        </div>
                        <button onClick={() => { setActiveConnectionId(row.id); setTab("chat"); }} style={{
                          border: "none", borderRadius: 12, padding: "9px 14px",
                          background: "var(--accent)", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 13,
                        }}>Open chat →</button>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        )}

        {/* ════════════════════════ CHAT ════════════════════════════ */}
        {tab === "chat" && (
          <div className="partner-chat-shell" style={{ display: "grid", gridTemplateColumns: "260px minmax(0,1fr)", gap: 14, alignItems: "start" }}>

            {/* Sidebar */}
            <div className="partner-chat-list" style={{
              border: "1px solid var(--line)", borderRadius: 20,
              background: "var(--card)", overflow: "hidden",
            }}>
              <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--line)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--ink-strong)" }}>Private Chats</p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{accepted.length} connection{accepted.length !== 1 ? "s" : ""}</p>
              </div>
              {accepted.length === 0 ? (
                <div style={{ padding: "20px 14px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  Accept a request to start chatting.
                </div>
              ) : accepted.map(conn => {
                const other  = profileMap.get(otherUserId(conn));
                const active = activeConnection?.id === conn.id;
                return (
                  <button key={conn.id} onClick={() => setActiveConnectionId(conn.id)} style={{
                    width: "100%", textAlign: "left", border: "none",
                    background: active ? "var(--accent-soft)" : "none",
                    borderBottom: "1px solid var(--line)", padding: "12px 14px", cursor: "pointer",
                    borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar url={other?.avatar_url ?? null} name={other?.display_name ?? "?"} size={34} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: 700, fontSize: 13,
                          color: active ? "var(--accent)" : "var(--ink-strong)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{other?.display_name ?? "Partner"}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{connFocus(conn)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chat panel */}
            <div className="partner-chat-panel" style={{
              border: "1px solid var(--line)", borderRadius: 20, background: "var(--card)",
              height: "min(82vh, 820px)", display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              {activeConnection ? (() => {
                const partner = profileMap.get(activePartnerId);
                const lastSeven = Array.from({ length: 7 }, (_, i) =>
                  new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
                ).reverse();
                const perfectDays = lastSeven.filter(date => {
                  const rows = checkins.filter(r => r.checkin_date === date);
                  return rows.length >= 2 && rows.every(r => r.completed);
                }).length;

                return (
                  <>
                    {/* Chat header */}
                    <div style={{
                      padding: "13px 16px", borderBottom: "1px solid var(--line)",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={36} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>{partner?.display_name ?? "Study Partner"}</p>
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>{connFocus(activeConnection)} · private 1:1</p>
                        </div>
                      </div>
                      <button onClick={() => setShowPact(v => !v)} style={{
                        border: "1px solid var(--line)", borderRadius: 12, padding: "7px 12px",
                        background: showPact ? "var(--accent-soft)" : "var(--panel)",
                        color: showPact ? "var(--accent)" : "var(--muted)",
                        fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
                      }}>
                        {showPact ? "Hide pact" : "📋 Daily Pact"}
                      </button>
                    </div>

                    {/* Daily pact panel */}
                    {showPact && (
                      <div style={{
                        padding: "14px 16px", borderBottom: "1px solid var(--line)",
                        background: "linear-gradient(135deg, rgba(184,97,23,0.04), rgba(22,163,74,0.02))",
                        overflowY: "auto", maxHeight: "45%",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                          <div>
                            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 3 }}>
                              Today&apos;s pact
                            </p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--ink-strong)" }}>
                              One honest block together
                            </p>
                          </div>
                          <div style={{
                            background: pactComplete ? "rgba(22,163,74,0.10)" : "rgba(184,97,23,0.08)",
                            border: `1px solid ${pactComplete ? "rgba(22,163,74,0.28)" : "rgba(184,97,23,0.2)"}`,
                            borderRadius: 14, padding: "7px 10px", textAlign: "center", flexShrink: 0,
                          }}>
                            <p style={{ fontSize: 11, fontWeight: 900, color: pactComplete ? "#15803d" : "var(--accent)" }}>
                              {pactComplete ? "✓ Pact done" : "Pact open"}
                            </p>
                            <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{perfectDays}/7 perfect days</p>
                          </div>
                        </div>

                        {/* Target + minutes */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 76px", gap: 8, marginBottom: 8 }}>
                          <input
                            value={targetText}
                            onChange={e => setTargetText(e.target.value)}
                            placeholder="Today's target: e.g. Revise Polity + 25 CA facts"
                            maxLength={220}
                            style={{
                              border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px",
                              background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 600, fontSize: 13,
                            }}
                          />
                          <input
                            type="number" value={focusMinutes} min={15} max={600}
                            onChange={e => setFocusMinutes(Number(e.target.value))}
                            style={{
                              border: "1px solid var(--line)", borderRadius: 12, padding: "10px 10px",
                              background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 700, fontSize: 13,
                              textAlign: "center",
                            }}
                          />
                        </div>

                        {/* Mood chips */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                          {MOODS.map(m => (
                            <button key={m} type="button" onClick={() => setMood(m)} style={{
                              border: mood === m ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                              background: mood === m ? "var(--accent-soft)" : "var(--panel)",
                              color: mood === m ? "var(--accent)" : "var(--muted)",
                              borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                            }}>{m}</button>
                          ))}
                        </div>

                        {/* Status tiles */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                          {[
                            { name: "You", checkin: myCheckin },
                            { name: partner?.display_name ?? "Partner", checkin: partnerCheckin },
                          ].map(({ name, checkin }) => (
                            <div key={name} style={{
                              borderRadius: 14, padding: "10px 11px",
                              background: checkin?.completed ? "rgba(22,163,74,0.08)" : "var(--panel)",
                              border: `1px solid ${checkin?.completed ? "rgba(22,163,74,0.2)" : "var(--line)"}`,
                            }}>
                              <p style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{name}</p>
                              <p style={{ fontSize: 13, fontWeight: 700, color: checkin?.completed ? "#15803d" : "var(--ink-strong)", marginTop: 4 }}>
                                {checkin?.completed ? "✓ Done" : checkin ? `${checkin.focus_minutes}m locked` : "Waiting"}
                              </p>
                              {checkin?.target && (
                                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.4 }}>
                                  {checkin.target.slice(0, 48)}{checkin.target.length > 48 ? "…" : ""}
                                </p>
                              )}
                            </div>
                          ))}
                          <div style={{
                            borderRadius: 14, padding: "10px 11px",
                            background: pairFocusMins >= 120 ? "rgba(22,163,74,0.06)" : "var(--panel)",
                            border: "1px solid var(--line)",
                          }}>
                            <p style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pair focus</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-strong)", marginTop: 4 }}>
                              {Math.floor(pairFocusMins / 60)}h {pairFocusMins % 60}m
                            </p>
                            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>today</p>
                          </div>
                        </div>

                        {/* Pact actions */}
                        <div style={{ display: "flex", gap: 8 }}>
                          <button disabled={actionPending === "lock"} onClick={() => saveCheckin(false)} style={{
                            flex: 1, border: "1px solid rgba(184,97,23,0.3)", borderRadius: 12, padding: "10px 0",
                            background: "rgba(184,97,23,0.08)", color: "var(--accent)", fontWeight: 900, cursor: "pointer",
                            opacity: actionPending === "lock" ? 0.7 : 1,
                          }}>
                            {actionPending === "lock" ? "Locking…" : "Lock target"}
                          </button>
                          <button disabled={actionPending === "done"} onClick={() => saveCheckin(true)} style={{
                            flex: 1, border: "none", borderRadius: 12, padding: "10px 0",
                            background: "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff", fontWeight: 900, cursor: "pointer",
                            opacity: actionPending === "done" ? 0.7 : 1,
                          }}>
                            {actionPending === "done" ? "Marking…" : "Mark done ✓"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Messages list */}
                    <div ref={msgScrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {messages.length === 0 ? (
                        <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: "32px 16px" }}>
                          <div>
                            <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-strong)", marginBottom: 8 }}>Start this private thread</p>
                            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>
                              Share today&apos;s target, a mock score, or open the Daily Pact above to lock a commitment.
                            </p>
                          </div>
                        </div>
                      ) : messages.map(msg => {
                        const mine = msg.sender_id === userId;
                        return (
                          <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                            <div style={{
                              maxWidth: "76%",
                              borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              background: mine ? "var(--accent)" : "var(--panel)",
                              color: mine ? "#fff" : "var(--ink-strong)",
                              padding: "10px 14px", lineHeight: 1.5, fontSize: 14,
                              border: mine ? "none" : "1px solid var(--line)",
                            }}>
                              <p>{msg.body}</p>
                              <p style={{ opacity: 0.6, fontSize: 10, marginTop: 4, textAlign: "right" }}>{timeAgo(msg.created_at)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message input */}
                    <div style={{ padding: "10px 12px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
                      <input
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
                        placeholder="Share a target, mock score, or doubt…"
                        style={{
                          flex: 1, border: "1px solid var(--line)", borderRadius: 14,
                          padding: "11px 14px", background: "var(--panel)", color: "var(--ink-strong)", fontSize: 14,
                        }}
                      />
                      <button onClick={sendMessage} style={{
                        border: "none", borderRadius: 14, padding: "0 18px",
                        background: "var(--accent)", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 18,
                      }}>↑</button>
                    </div>
                  </>
                );
              })() : (
                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
                  <div>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>💬</p>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 8 }}>No chat selected</h2>
                    <p style={{ color: "var(--muted)", fontSize: 13 }}>Accept a request to open a private chat.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════ PROFILE ═════════════════════════ */}
        {tab === "profile" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {!myProfile && (
              <div style={{
                background: "linear-gradient(135deg, rgba(192,96,16,0.06), rgba(255,255,255,0))",
                border: "1px solid var(--accent-border)", borderRadius: 18, padding: "16px 18px", marginBottom: 24,
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 6 }}>
                  Welcome to Study Partner 👋
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  Fill in your profile below. This is what other aspirants see before sending a request. Be honest — better profiles attract better partners.
                </p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Basics */}
              <section style={{ border: "1px solid var(--line)", borderRadius: 20, padding: "18px 16px", background: "var(--card)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink-strong)", marginBottom: 14 }}>📚 Basics</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <SelectField label="Exam target"  value={form.exam_target}  values={EXAMS}     onChange={v => setForm({ ...form, exam_target: v })} />
                  <SelectField label="Prep stage"   value={form.stage}        values={STAGES}    onChange={v => setForm({ ...form, stage: v })} />
                  <SelectField label="District"     value={form.district}     values={DISTRICTS} onChange={v => setForm({ ...form, district: v })} />
                  <SelectField label="Language"     value={form.language}     values={LANGUAGES} onChange={v => setForm({ ...form, language: v })} />
                </div>
              </section>

              {/* Study habits */}
              <section style={{ border: "1px solid var(--line)", borderRadius: 20, padding: "18px 16px", background: "var(--card)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink-strong)", marginBottom: 14 }}>⏰ Study Habits</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 14 }}>
                  <SelectField label="Daily hours" value={form.daily_hours} values={HOURS} onChange={v => setForm({ ...form, daily_hours: v })} />
                  <SelectField label="Study mode"  value={form.study_mode}  values={MODES} onChange={v => setForm({ ...form, study_mode: v })} />
                </div>
                <MultiField label="Available slots" values={SLOTS} selected={form.slots} onToggle={v => toggleArr("slots", v)} />
              </section>

              {/* Subjects */}
              <section style={{ border: "1px solid var(--line)", borderRadius: 20, padding: "18px 16px", background: "var(--card)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink-strong)", marginBottom: 14 }}>🎯 Subjects</h3>
                <MultiField label="Working on (weak)" values={SUBJECTS} selected={form.weak_subjects}   onToggle={v => toggleArr("weak_subjects", v)} />
                <div style={{ marginTop: 14 }}>
                  <MultiField label="Can help others (strong)" values={SUBJECTS} selected={form.strong_subjects} onToggle={v => toggleArr("strong_subjects", v)} />
                </div>
              </section>

              {/* About */}
              <section style={{ border: "1px solid var(--line)", borderRadius: 20, padding: "18px 16px", background: "var(--card)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--ink-strong)", marginBottom: 14 }}>🙋 About you</h3>
                <div style={{ marginBottom: 14 }}>
                  <SelectField label="Partner preference" value={form.partner_gender_preference} values={GENDER_PREFS} onChange={v => setForm({ ...form, partner_gender_preference: v })} />
                </div>
                <label style={{ display: "block" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Short bio</span>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    maxLength={220}
                    rows={3}
                    placeholder="What kind of partner are you looking for? What's your current focus?"
                    style={{
                      display: "block", width: "100%", marginTop: 8,
                      border: "1px solid var(--line)", borderRadius: 14, padding: "12px 13px",
                      background: "var(--panel)", color: "var(--ink-strong)", resize: "vertical",
                      fontSize: 14, lineHeight: 1.55,
                    }}
                  />
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, textAlign: "right" }}>{form.bio.length}/220</p>
                </label>
              </section>

              <button onClick={saveProfile} disabled={saving} style={{
                width: "100%", border: "none", borderRadius: 18, padding: "16px 20px",
                background: "var(--accent)", color: "#fff", fontWeight: 900,
                fontFamily: "var(--font-display)", cursor: saving ? "wait" : "pointer", fontSize: 17,
                letterSpacing: "-0.01em",
              }}>
                {saving ? "Saving…" : myProfile ? "Update profile →" : "Create profile & start matching →"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .partner-chat-shell { grid-template-columns: 1fr !important; }
          .partner-chat-list  { height: auto !important; max-height: 200px !important; overflow-y: auto !important; }
          .partner-chat-panel { height: calc(100dvh - 270px) !important; min-height: 480px !important; }
        }
      `}</style>
    </main>
  );
}
