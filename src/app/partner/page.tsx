"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getAuthRedirectUrl, getSupabaseBrowserClient } from "@/lib/supabase";

/* ── Types ───────────────────────────────────────────────────────────────── */
type PartnerProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  exam_target: string;
  stage: string;
  district: string;
  language: string;
  gender_preference: string;       // user's own gender
  partner_gender_preference: string; // preferred partner gender
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

/* ── Constants ───────────────────────────────────────────────────────────── */
const EXAMS     = ["72nd BPSC", "BPSC TRE", "Bihar SI", "UPSC + BPSC", "Bihar SSC"];
const STAGES    = ["Starting", "Building basics", "Revision", "Test series", "Final sprint"];
const DISTRICTS = ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnea", "Nalanda", "Siwan", "Bhojpur", "Bihar", "Outside Bihar"];
const LANGUAGES = ["Hindi", "English", "Hindi + English"];
const HOURS     = ["1-2 hrs/day", "2-3 hrs/day", "3-5 hrs/day", "5+ hrs/day"];
const MODES     = ["Accountability + Silent Study", "Doubt discussion", "Daily target check", "Mock-test partner", "Full syllabus revision"];
const REQUEST_FOCUSES = ["Current Affairs", "Answer Writing", "Mock Analysis", "Daily Revision", "Doubt Solving", "Bihar Special"];
const SLOTS     = ["Morning", "Afternoon", "Evening", "Late night"];
const SUBJECTS  = ["Current Affairs", "Polity", "Economy", "History", "Geography", "Bihar Special", "Science", "Environment", "Maths", "Reasoning"];
const MY_GENDERS     = ["Male", "Female", "Non-binary", "Prefer not to say"];
const PARTNER_PREFS  = ["Any gender", "Male only", "Female only"];
const MOODS          = ["locked in", "steady", "tired but showing up", "test mode"];

const STAGE_COLORS: Record<string, string> = {
  "Starting": "#6366f1", "Building basics": "#0891b2",
  "Revision": "#c06010", "Test series": "#15803d", "Final sprint": "#b91c1c",
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function firstName(session: Session | null) {
  const u = session?.user;
  return (u?.user_metadata?.full_name as string | undefined)?.split(" ")[0]
    ?? u?.email?.split("@")[0] ?? "Aspirant";
}
function initials(name: string) { return (name || "?").split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase(); }
function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}
function todayKey() { return new Date().toISOString().slice(0, 10); }
function connFocus(conn: Pick<PartnerConnection, "request_focus">) { return conn.request_focus || "Current Affairs"; }
function overlap(a: string[] = [], b: string[] = []) { return a.filter(x => b.includes(x)); }

function scoreMatch(me: PartnerProfile | null, p: PartnerProfile) {
  if (!me) return 60;
  let s = 24;
  if (p.exam_target === me.exam_target) s += 16;
  if (p.stage       === me.stage)       s += 10;
  if (p.language    === me.language)    s += 8;
  if (p.district    === me.district)    s += 6;
  if (p.daily_hours === me.daily_hours) s += 8;
  s += Math.min(16, overlap(p.slots, me.slots).length * 8);
  s += Math.min(18, overlap(p.strong_subjects, me.weak_subjects).length * 9);
  s += Math.min(10, overlap(p.weak_subjects, me.strong_subjects).length * 5);
  s += Math.round(Math.min(p.seriousness_score, 100) / 10);
  return Math.min(99, s);
}

function matchReasons(me: PartnerProfile | null, p: PartnerProfile): string[] {
  if (!me) return [];
  const r: string[] = [];
  if (p.exam_target === me.exam_target) r.push("same exam");
  if (p.stage       === me.stage)       r.push("same stage");
  const slots = overlap(p.slots, me.slots);
  if (slots.length) r.push(`${slots[0].toLowerCase()} slot`);
  const helps = overlap(p.strong_subjects, me.weak_subjects);
  if (helps.length) r.push(`strong in ${helps[0]}`);
  return r.slice(0, 3);
}

/* ── Avatar ──────────────────────────────────────────────────────────────── */
function Avatar({ url, name, size = 40 }: { url: string | null; name: string; size?: number }) {
  if (url) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, display: "block" }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "grid", placeItems: "center",
      background: "var(--accent-soft)", color: "var(--accent)",
      fontWeight: 800, fontSize: Math.round(size * 0.36),
    }}>{initials(name)}</div>
  );
}

/* ── SelectField ─────────────────────────────────────────────────────────── */
function SelectField({ label, value, values, onChange }: {
  label: string; value: string; values: string[]; onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        display: "block", width: "100%", marginTop: 6,
        border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px",
        background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 600, fontSize: 13,
      }}>
        {values.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

/* ── MultiField ──────────────────────────────────────────────────────────── */
function MultiField({ label, values, selected, onToggle }: {
  label: string; values: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {values.map(item => {
          const active = selected.includes(item);
          return (
            <button key={item} type="button" onClick={() => onToggle(item)} style={{
              border: active ? "1.5px solid var(--accent)" : "1px solid var(--line-hi)",
              background: active ? "var(--accent-soft)" : "var(--panel)",
              color: active ? "var(--accent)" : "var(--muted)",
              borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.1s",
            }}>{item}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function PartnerPage() {
  const [session,   setSession]   = useState<Session | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [tab, setTab] = useState<"discover" | "requests" | "chat" | "profile">("discover");

  const [profiles,    setProfiles]    = useState<PartnerProfile[]>([]);
  const [myProfile,   setMyProfile]   = useState<PartnerProfile | null>(null);
  const [connections, setConnections] = useState<PartnerConnection[]>([]);

  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [messages,   setMessages]   = useState<PartnerMessage[]>([]);
  const [checkins,   setCheckins]   = useState<PartnerCheckin[]>([]);
  const [msgText,    setMsgText]    = useState("");
  const [showPact,   setShowPact]   = useState(false);
  const [mobileOpenChat, setMobileOpenChat] = useState(false);

  const [targetText,   setTargetText]   = useState("");
  const [focusMinutes, setFocusMinutes] = useState(90);
  const [mood,         setMood]         = useState("locked in");

  const [actionPending,      setActionPending]      = useState<string | null>(null);
  const [requestFocusByUser, setRequestFocusByUser] = useState<Record<string, string>>({});
  const [saving,  setSaving]  = useState(false);
  const [notice,  setNotice]  = useState<{ msg: string; ok: boolean } | null>(null);
  const [genderFilter, setGenderFilter] = useState("Any gender");

  const msgScrollRef    = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef   = useRef<HTMLDivElement>(null);
  const activeConnIdRef = useRef<string | null>(null);
  const noticeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scrollToBottomIfNear() {
    for (const ref of [msgScrollRef, mobileScrollRef]) {
      const el = ref.current;
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
    }
  }
  function scrollToBottom() {
    for (const ref of [msgScrollRef, mobileScrollRef]) {
      const el = ref.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }

  const [form, setForm] = useState({
    exam_target: "72nd BPSC", stage: "Revision", district: "Patna",
    language: "Hindi + English",
    gender_preference: "Male",             // user's own gender
    partner_gender_preference: "Any gender", // preferred partner gender
    study_mode: "Accountability + Silent Study", daily_hours: "2-3 hrs/day",
    slots:           ["Evening"] as string[],
    weak_subjects:   ["Current Affairs", "Polity"] as string[],
    strong_subjects: ["Bihar Special"] as string[],
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
  const myCheckin      = todaysCheckins.find(c => c.user_id === userId) ?? null;
  const partnerCheckin = todaysCheckins.find(c => c.user_id === activePartnerId) ?? null;
  const pactComplete   = Boolean(myCheckin?.completed && partnerCheckin?.completed);
  const pairFocusMins  = todaysCheckins.reduce((sum, r) => sum + r.focus_minutes, 0);

  const otherUserId = (conn: PartnerConnection) =>
    conn.requester_id === userId ? conn.receiver_id : conn.requester_id;

  // Any connection (accepted or pending) with a given user — enforces one-pair rule
  function connWith(otherUser: string) {
    return connections.find(c =>
      (c.requester_id === userId && c.receiver_id === otherUser) ||
      (c.requester_id === otherUser && c.receiver_id === userId)
    ) ?? null;
  }

  const candidates = useMemo(() => {
    let list = profiles
      .filter(p => p.user_id !== userId)
      .map(p => ({ profile: p, score: scoreMatch(myProfile, p), reasons: matchReasons(myProfile, p) }))
      .sort((a, b) => b.score - a.score);

    if (genderFilter !== "Any gender") {
      const wantGender = genderFilter.replace(" only", "");
      list = list.filter(({ profile }) => profile.gender_preference === wantGender);
    }
    return list;
  }, [myProfile, profiles, userId, genderFilter]);

  function showNotice(msg: string, ok = true) {
    setNotice({ msg, ok });
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 4000);
  }

  useEffect(() => {
    if (tab !== "chat") {
      if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
      setMobileOpenChat(false);
    }
  }, [tab]);

  /* ── Auth + realtime ─────────────────────────────────────────────────── */
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
      void loadMessages(activeConnection.id, true);
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

  /* ── Loaders ─────────────────────────────────────────────────────────── */
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

  /* ── Actions ─────────────────────────────────────────────────────────── */
  async function signIn() {
    await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthRedirectUrl("/partner") },
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
      ...form, bio: form.bio.trim().slice(0, 220), is_active: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { showNotice(error.message, false); return; }
    showNotice("Profile saved. Matches refreshed.");
    await loadAll();
    setTab("discover");
  }

  async function sendRequest(receiverId: string, requestFocus: string) {
    if (!session || !myProfile) { setTab("profile"); showNotice("Create your profile first.", false); return; }
    const pendingKey = `request:${receiverId}`;
    setActionPending(pendingKey);
    const supabase = getSupabaseBrowserClient();
    const partner = profileMap.get(receiverId);

    // One-pair rule: check ANY existing connection with this person
    const existing = connWith(receiverId);
    if (existing?.status === "accepted") {
      setActiveConnectionId(existing.id); setTab("chat");
      showNotice(`Already chatting with ${partner?.display_name ?? "this person"}.`);
      setActionPending(null); return;
    }
    if (existing?.status === "pending") {
      setTab("requests");
      showNotice("A request with this person is already pending.");
      setActionPending(null); return;
    }

    const opener = `Hi ${partner?.display_name ?? "there"}, let's do a focused ${requestFocus} sprint for BPSC.`;
    const payload = { requester_id: session.user.id, receiver_id: receiverId, request_focus: requestFocus, opener };

    const { error } = existing
      ? await (supabase as any).from("study_partner_connections")
          .update({ ...payload, status: "pending", responded_at: null }).eq("id", existing.id)
      : await (supabase as any).from("study_partner_connections").insert(payload);

    if (error) {
      setActionPending(null);
      showNotice(error.message.includes("duplicate")
        ? "Already sent a request to this person. Check Requests."
        : error.message, false);
      return;
    }
    showNotice("Request sent! Chat opens once they accept.");
    await loadAll(); setActionPending(null); setTab("requests");
  }

  async function updateConnection(id: string, status: "accepted" | "rejected" | "cancelled") {
    setActionPending(`${status}:${id}`);
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_connections")
      .update({ status, responded_at: new Date().toISOString() }).eq("id", id);
    if (error) { setActionPending(null); showNotice(error.message, false); return; }
    await loadAll(); setActionPending(null);
    if (status === "accepted") { setActiveConnectionId(id); setTab("chat"); setMobileOpenChat(true); }
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
    if (error) { showNotice(error.message, false); setMessages(prev => prev.filter(m => m.id !== opt.id)); return; }
    await loadMessages(activeConnection.id, true);
  }

  async function saveCheckin(completed = false) {
    if (!session || !activeConnection) return;
    const target = targetText.trim().slice(0, 220);
    if (!target) { showNotice("Add today's target first.", false); return; }
    setActionPending(completed ? "done" : "lock");
    const { error } = await (getSupabaseBrowserClient() as any).from("study_partner_checkins").upsert({
      connection_id: activeConnection.id, user_id: userId, checkin_date: todayKey(),
      target, completed: completed || myCheckin?.completed || false,
      focus_minutes: focusMinutes, mood, updated_at: new Date().toISOString(),
    }, { onConflict: "connection_id,user_id,checkin_date" });
    if (error) { setActionPending(null); showNotice(error.message, false); return; }
    await loadCheckins(activeConnection.id);
    const partner = profileMap.get(activePartnerId);
    setMsgText(completed
      ? `Done for today: ${target} (${focusMinutes} min). Your turn, ${partner?.display_name ?? "partner"}.`
      : `Today's target: ${target} (${focusMinutes} min). Let's finish this.`);
    setActionPending(null);
    showNotice(completed ? "Done marked! Hit Send." : "Target locked! Send it to your partner.");
  }

  async function reportUser(reportedUserId: string) {
    if (!session) return;
    const reason = window.prompt("Why are you reporting this user?");
    if (!reason?.trim()) return;
    await (getSupabaseBrowserClient() as any).from("study_partner_reports").insert({
      reporter_id: userId, reported_user_id: reportedUserId, reason: reason.trim().slice(0, 300),
    });
    showNotice("Report submitted.");
  }

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (loading) return (
    <main style={{ height: "100dvh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", margin: "0 auto 14px",
          border: "3px solid var(--line-hi)", borderTopColor: "var(--accent)",
          animation: "spin 0.75s linear infinite",
        }} />
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Finding your tribe…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  /* ── Sign-in gate ────────────────────────────────────────────────────── */
  if (!session) return (
    <main style={{ height: "100dvh", background: "var(--bg)", display: "grid", placeItems: "center", padding: "20px 16px" }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{
          background: "var(--card)", border: "1px solid var(--line-hi)",
          borderRadius: 28, padding: "44px 32px",
          boxShadow: "0 8px 48px rgba(39,24,8,0.10)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.5rem, 5vw, 2rem)", lineHeight: 1.1,
            color: "var(--ink-strong)", marginBottom: 12, letterSpacing: "-0.03em",
          }}>
            Find one serious aspirant.<br />Clear BPSC together.
          </h1>
          <p style={{ color: "var(--ink-soft)", lineHeight: 1.75, fontSize: 13.5, marginBottom: 28 }}>
            Matched by exam, weak subjects, study slot and prep stage.
            Private 1:1 chat opens only after both connect.
          </p>
          <button onClick={signIn} style={{
            width: "100%", border: "none", borderRadius: 16, padding: "14px 24px",
            background: "var(--accent)", color: "#fff", fontWeight: 700,
            cursor: "pointer", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continue with Google
          </button>
          <p style={{ marginTop: 14, fontSize: 11, color: "var(--muted)" }}>Free · No spam · Google sign-in</p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );

  /* ── Tab config ──────────────────────────────────────────────────────── */
  const TABS = [
    { id: "discover" as const, emoji: "🔍", label: "Discover", badge: candidates.length || null },
    { id: "requests" as const, emoji: "📨", label: "Requests", badge: incoming.length   || null },
    { id: "chat"     as const, emoji: "💬", label: "Chat",     badge: accepted.length   || null },
    { id: "profile"  as const, emoji: "👤", label: myProfile ? "Profile" : "Setup ✦", badge: null },
  ];

  /* ── Main render ─────────────────────────────────────────────────────── */
  return (
    <main id="partner-shell" style={{ position: "fixed", top: 52, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        #partner-shell { bottom: 60px; }
        @media (min-width: 640px) {
          #partner-shell { bottom: 0; }
          .mobile-chat-list { display: none !important; }
          .mobile-chat-overlay { display: none !important; }
        }
        @media (max-width: 639px) {
          .desktop-chat { display: none !important; }
          .mobile-chat-overlay {
            position: fixed !important;
            top: 52px !important;
            bottom: 60px !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 150 !important;
          }
        }
      `}</style>

      {/* ── Fixed toast ───────────────────────────────────────────────── */}
      {notice && (
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 200, maxWidth: "calc(100vw - 32px)",
          padding: "10px 16px", borderRadius: 14,
          background: notice.ok ? "var(--ink-strong)" : "#b91c1c",
          color: "#fff", fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
        }}>
          <span>{notice.ok ? "✓" : "!"}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{notice.msg}</span>
          <button onClick={() => setNotice(null)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 15, cursor: "pointer", padding: 0 }}>
            ✕
          </button>
        </div>
      )}

      {/* ── Tab bar — fixed, thin, non-scrollable ─────────────────────── */}
      <div style={{
        flexShrink: 0, background: "var(--card)",
        borderBottom: "1px solid var(--line)", zIndex: 30,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", padding: "0 8px" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: "7px 4px 9px",
                borderBottom: tab === t.id ? "2.5px solid var(--accent)" : "2.5px solid transparent",
                color: tab === t.id ? "var(--accent)" : "var(--muted)",
                fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
                position: "relative", transition: "color 0.12s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{t.emoji}</span>
              <span>{t.label}</span>
              {t.badge != null && (
                <span style={{
                  position: "absolute", top: 5, right: "calc(50% - 18px)",
                  background: "var(--accent)", color: "#fff",
                  borderRadius: 999, fontSize: 8.5, fontWeight: 900,
                  padding: "1px 4px", lineHeight: 1.6, minWidth: 14, textAlign: "center",
                }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Scrollable tabs */}
        {tab !== "chat" && (
          <div ref={scrollAreaRef} style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 14px 80px" }}>

              {/* ═══════════════ DISCOVER ═══════════════════════════════ */}
              {tab === "discover" && (
                <div>
                  {/* No profile CTA */}
                  {!myProfile && (
                    <div style={{
                      background: "linear-gradient(135deg, #0d1221, #1b2846)",
                      borderRadius: 20, padding: "28px 24px", marginBottom: 16, textAlign: "center",
                    }}>
                      <p style={{ fontSize: 28, marginBottom: 10 }}>👤</p>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#fef3c7", marginBottom: 8 }}>
                        Profile missing — set it up first
                      </h2>
                      <p style={{ color: "rgba(254,243,199,0.6)", fontSize: 13, lineHeight: 1.65, maxWidth: 340, margin: "0 auto 20px" }}>
                        Takes 2 minutes. Exam, prep stage, weak subjects — that&apos;s what makes matching accurate.
                      </p>
                      <button onClick={() => setTab("profile")} style={{
                        border: "none", borderRadius: 14, padding: "12px 28px",
                        background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
                      }}>
                        Set up now →
                      </button>
                    </div>
                  )}

                  {/* Gender filter + incoming alert */}
                  {myProfile && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>Show:</span>
                      {PARTNER_PREFS.map(g => (
                        <button key={g} onClick={() => setGenderFilter(g)} style={{
                          border: genderFilter === g ? "1.5px solid var(--accent)" : "1px solid var(--line-hi)",
                          background: genderFilter === g ? "var(--accent-soft)" : "var(--panel)",
                          color: genderFilter === g ? "var(--accent)" : "var(--muted)",
                          borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          transition: "all 0.1s",
                        }}>{g}</button>
                      ))}
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                        {candidates.length} match{candidates.length !== 1 ? "es" : ""}
                      </span>
                    </div>
                  )}

                  {/* Empty state */}
                  {myProfile && candidates.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                      <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--ink-strong)", marginBottom: 8 }}>
                        No matches for this filter
                      </h2>
                      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
                        Try &quot;Any gender&quot; or update your profile to improve match quality.
                      </p>
                      <button onClick={() => setGenderFilter("Any gender")} style={{
                        border: "1px solid var(--accent-border)", borderRadius: 14, padding: "9px 18px",
                        background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 700, cursor: "pointer", fontSize: 13,
                      }}>
                        Show all →
                      </button>
                    </div>
                  )}

                  {/* ── Circular profile cards ── */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
                    gap: 14,
                  }}>
                    {candidates.map(({ profile }) => {
                      const focus = requestFocusByUser[profile.user_id] ?? REQUEST_FOCUSES[0];
                      const pKey  = `request:${profile.user_id}`;
                      const conn  = connWith(profile.user_id);
                      const genderIcon = profile.gender_preference === "Female" ? "👩" : profile.gender_preference === "Male" ? "👨" : "🧑";

                      return (
                        <article key={profile.user_id} style={{
                          background: "var(--card)",
                          border: "1px solid var(--line)",
                          borderRadius: 20,
                          padding: "18px 14px 16px",
                          display: "flex", flexDirection: "column", alignItems: "center",
                          textAlign: "center",
                          boxShadow: "0 2px 12px rgba(39,24,8,0.05)",
                          transition: "transform 0.15s, box-shadow 0.15s",
                        }}>
                          <p style={{
                            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15,
                            color: "var(--ink-strong)", letterSpacing: "-0.02em",
                            marginBottom: 10, lineHeight: 1.2,
                            maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{profile.display_name}</p>

                          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14, width: "100%" }}>
                            <span style={{
                              fontSize: 12, color: "var(--ink-soft)", fontWeight: 600,
                              background: "var(--panel)", borderRadius: 8, padding: "5px 8px",
                            }}>{genderIcon} {profile.gender_preference}</span>
                            <span style={{
                              fontSize: 12, color: "var(--ink-soft)", fontWeight: 600,
                              background: "var(--panel)", borderRadius: 8, padding: "5px 8px",
                            }}>📍 {profile.district}</span>
                            {profile.weak_subjects.length > 0 && (
                              <span style={{
                                fontSize: 11.5, color: "var(--accent)", fontWeight: 700,
                                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
                                borderRadius: 8, padding: "5px 8px", lineHeight: 1.4,
                              }}>📚 {profile.weak_subjects.slice(0, 2).join(", ")}</span>
                            )}
                          </div>

                          {conn?.status === "accepted" ? (
                            <button
                              onClick={() => { setActiveConnectionId(conn.id); setTab("chat"); setMobileOpenChat(true); }}
                              style={{
                                width: "100%", border: "none", borderRadius: 12, padding: "9px 12px",
                                background: "#15803d", color: "#fff", fontWeight: 700,
                                cursor: "pointer", fontSize: 12,
                              }}
                            >💬 Chat</button>
                          ) : conn?.status === "pending" ? (
                            <span style={{
                              fontSize: 11.5, fontWeight: 700, color: "#b45309",
                              background: "rgba(217,119,6,0.08)",
                              border: "1px solid rgba(217,119,6,0.22)",
                              borderRadius: 12, padding: "7px 10px", width: "100%",
                              display: "block",
                            }}>⏳ Pending</span>
                          ) : (
                            <button
                              disabled={actionPending === pKey}
                              onClick={() => void sendRequest(profile.user_id, focus)}
                              style={{
                                width: "100%", border: "none", borderRadius: 12, padding: "9px 12px",
                                background: "var(--accent)", color: "#fff", fontWeight: 700,
                                cursor: actionPending === pKey ? "wait" : "pointer", fontSize: 12,
                                opacity: actionPending === pKey ? 0.7 : 1,
                              }}
                            >{actionPending === pKey ? "Sending…" : "🤝 Connect"}</button>
                          )}

                          <button onClick={() => void reportUser(profile.user_id)}
                            style={{ background: "none", border: "none", fontSize: 10, color: "var(--line-hi)", cursor: "pointer", marginTop: 8 }}>
                            Report
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══════════════ REQUESTS ════════════════════════════════ */}
              {tab === "requests" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--ink-strong)" }}>
                        📨 Requests to you
                      </h2>
                      {incoming.length > 0 && (
                        <span style={{
                          background: "rgba(21,128,61,0.08)", color: "#15803d",
                          border: "1px solid rgba(21,128,61,0.22)", borderRadius: 999,
                          padding: "2px 9px", fontSize: 11, fontWeight: 700,
                        }}>
                          {incoming.length} new
                        </span>
                      )}
                    </div>
                    {incoming.length === 0 ? (
                      <div style={{ border: "1px dashed var(--line-hi)", borderRadius: 16, padding: "24px 20px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                        No incoming requests yet. Go to Discover and send one — don&apos;t wait.
                      </div>
                    ) : incoming.map(row => {
                      const partner = profileMap.get(otherUserId(row));
                      return (
                        <div key={row.id} style={{
                          border: "1px solid rgba(21,128,61,0.2)", borderRadius: 18,
                          padding: "16px 14px", marginBottom: 10, background: "rgba(21,128,61,0.025)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                            <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={44} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 15 }}>
                                {partner?.display_name ?? "Aspirant"}
                              </p>
                              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                                {partner?.exam_target} · {partner?.stage}
                                {partner?.gender_preference && partner.gender_preference !== "Prefer not to say"
                                  ? ` · ${partner.gender_preference}` : ""}
                              </p>
                            </div>
                            <span style={{
                              background: "var(--accent-soft)", color: "var(--accent)",
                              border: "1px solid var(--accent-border)", borderRadius: 999,
                              padding: "3px 9px", fontSize: 11, fontWeight: 700, flexShrink: 0,
                            }}>{connFocus(row)}</span>
                          </div>
                          {row.opener && (
                            <p style={{
                              fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 12,
                              borderLeft: "3px solid rgba(21,128,61,0.3)", paddingLeft: 10,
                            }}>{row.opener}</p>
                          )}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => void updateConnection(row.id, "accepted")} disabled={!!actionPending} style={{
                              flex: 1, border: "none", borderRadius: 12, padding: "12px 0",
                              background: "linear-gradient(135deg, #14532d, #15803d)",
                              color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
                            }}>Accept</button>
                            <button onClick={() => void updateConnection(row.id, "rejected")} disabled={!!actionPending} style={{
                              flex: 1, border: "1px solid var(--line-hi)", borderRadius: 12, padding: "12px 0",
                              background: "var(--panel)", color: "var(--muted)", fontWeight: 600, cursor: "pointer", fontSize: 13,
                            }}>Decline</button>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  <section>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 14 }}>
                      📤 Sent by you
                    </h2>
                    {outgoing.length === 0 ? (
                      <div style={{ border: "1px dashed var(--line-hi)", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
                        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>No sent requests yet.</p>
                        <button onClick={() => setTab("discover")} style={{
                          border: "none", borderRadius: 12, padding: "9px 18px",
                          background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
                        }}>Browse matches →</button>
                      </div>
                    ) : outgoing.map(row => {
                      const partner = profileMap.get(otherUserId(row));
                      return (
                        <div key={row.id} style={{
                          border: "1px solid var(--line)", borderRadius: 18, padding: "14px",
                          marginBottom: 10, background: "var(--card)",
                          display: "flex", alignItems: "center", gap: 12,
                        }}>
                          <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={42} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 14 }}>
                              {partner?.display_name ?? "Aspirant"}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                              {connFocus(row)} · {timeAgo(row.created_at)}
                            </p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                            <span style={{
                              background: "rgba(217,119,6,0.08)", color: "#b45309",
                              border: "1px solid rgba(217,119,6,0.2)", borderRadius: 999,
                              padding: "2px 9px", fontSize: 10.5, fontWeight: 700,
                            }}>pending</span>
                            <button onClick={() => void updateConnection(row.id, "cancelled")} style={{
                              border: "none", background: "none", fontSize: 11, color: "var(--muted)", cursor: "pointer",
                            }}>Cancel</button>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  {accepted.length > 0 && (
                    <section>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 14 }}>
                        ✅ Active partners
                      </h2>
                      {accepted.map(row => {
                        const partner = profileMap.get(otherUserId(row));
                        return (
                          <div key={row.id} style={{
                            border: "1px solid rgba(21,128,61,0.2)", borderRadius: 18, padding: "14px",
                            marginBottom: 10, background: "rgba(21,128,61,0.025)",
                            display: "flex", alignItems: "center", gap: 12,
                          }}>
                            <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={40} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 700, color: "var(--ink-strong)", fontSize: 14 }}>
                                {partner?.display_name ?? "Partner"}
                              </p>
                              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{connFocus(row)}</p>
                            </div>
                            <button onClick={() => { setActiveConnectionId(row.id); setTab("chat"); setMobileOpenChat(true); }} style={{
                              border: "none", borderRadius: 12, padding: "8px 16px",
                              background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
                            }}>
                              Open chat →
                            </button>
                          </div>
                        );
                      })}
                    </section>
                  )}
                </div>
              )}

              {/* ═══════════════ PROFILE ═════════════════════════════════ */}
              {tab === "profile" && (
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                  {myProfile && (
                    <div style={{
                      background: "rgba(21,128,61,0.06)", border: "1px solid rgba(21,128,61,0.18)",
                      borderRadius: 16, padding: "12px 16px", marginBottom: 20,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <span style={{ fontSize: 20 }}>✅</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Profile is live</p>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>Visible to other aspirants.</p>
                      </div>
                      <button onClick={() => setTab("discover")} style={{
                        border: "none", borderRadius: 10, padding: "7px 14px",
                        background: "rgba(21,128,61,0.12)", color: "#15803d",
                        fontWeight: 700, cursor: "pointer", fontSize: 12, flexShrink: 0,
                      }}>See matches →</button>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Exam */}
                    <section style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", background: "var(--card)" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
                        🎯 Which exam are you preparing for?
                      </h3>
                      <SelectField label="" value={form.exam_target} values={EXAMS} onChange={v => setForm({ ...form, exam_target: v })} />
                    </section>

                    {/* Gender */}
                    <section style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", background: "var(--card)" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
                        👤 Your gender
                      </h3>
                      <SelectField label="" value={form.gender_preference} values={MY_GENDERS} onChange={v => setForm({ ...form, gender_preference: v })} />
                    </section>

                    {/* District */}
                    <section style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", background: "var(--card)" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
                        📍 Your district
                      </h3>
                      <SelectField label="" value={form.district} values={DISTRICTS} onChange={v => setForm({ ...form, district: v })} />
                    </section>

                    {/* Subjects to study */}
                    <section style={{ border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", background: "var(--card)" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--ink-strong)", marginBottom: 12 }}>
                        📚 Which subjects do you want to study?
                      </h3>
                      <MultiField label="" values={SUBJECTS} selected={form.weak_subjects} onToggle={v => toggleArr("weak_subjects", v)} />
                    </section>

                    <button onClick={saveProfile} disabled={saving} style={{
                      width: "100%", border: "none", borderRadius: 16, padding: "15px 20px",
                      background: "var(--accent)", color: "#fff", fontWeight: 700,
                      fontFamily: "var(--font-display)", cursor: saving ? "wait" : "pointer", fontSize: 15,
                    }}>
                      {saving ? "Saving…" : myProfile ? "Update →" : "Find my study partner →"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Mobile: conversation list ── */}
        {tab === "chat" && (
          <div className="mobile-chat-list" style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "12px 14px 80px" }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12, paddingLeft: 4 }}>
                Your chats
              </p>
              {accepted.length === 0 ? (
                <div style={{ border: "1px dashed var(--line-hi)", borderRadius: 18, padding: "40px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 32, marginBottom: 10 }}>💬</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-strong)", marginBottom: 8 }}>No chats yet</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, marginBottom: 20 }}>
                    Send a request in Discover. Chat unlocks once they accept.
                  </p>
                  <button onClick={() => setTab("discover")} style={{
                    border: "none", borderRadius: 14, padding: "11px 22px",
                    background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
                  }}>Find a partner →</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {accepted.map(conn => {
                    const other = profileMap.get(otherUserId(conn));
                    return (
                      <button key={conn.id} onClick={() => { setActiveConnectionId(conn.id); setMobileOpenChat(true); }} style={{
                        width: "100%", textAlign: "left", border: "none",
                        background: "var(--card)", borderRadius: 18, padding: "14px 16px",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                        boxShadow: "0 1px 8px rgba(39,24,8,0.07)", marginBottom: 4,
                      }}>
                        <Avatar url={other?.avatar_url ?? null} name={other?.display_name ?? "?"} size={48} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {other?.display_name ?? "Study Partner"}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{connFocus(conn)}</p>
                        </div>
                        <span style={{ fontSize: 22, color: "var(--muted)", flexShrink: 0 }}>›</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Desktop: sidebar + chat panel ── */}
        {tab === "chat" && (
          <div className="desktop-chat" style={{ position: "absolute", inset: 0, display: "flex", padding: 12, gap: 12, boxSizing: "border-box" }}>

            {/* Sidebar */}
            <div className="chat-sidebar" style={{
              width: 210, flexShrink: 0, display: "flex", flexDirection: "column",
              border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", overflow: "hidden",
            }}>
              <div style={{ padding: "11px 14px 9px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--ink-strong)" }}>💬 Chats</p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{accepted.length} active</p>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {accepted.length === 0 ? (
                  <p style={{ padding: "16px 14px", textAlign: "center", color: "var(--muted)", fontSize: 12 }}>
                    Accept a request to start chatting.
                  </p>
                ) : accepted.map(conn => {
                  const other  = profileMap.get(otherUserId(conn));
                  const active = activeConnection?.id === conn.id;
                  return (
                    <button key={conn.id} onClick={() => setActiveConnectionId(conn.id)} style={{
                      width: "100%", textAlign: "left", border: "none",
                      background: active ? "var(--accent-soft)" : "none",
                      borderBottom: "1px solid var(--line)", padding: "10px 14px", cursor: "pointer",
                      borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar url={other?.avatar_url ?? null} name={other?.display_name ?? "?"} size={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontWeight: 700, fontSize: 12.5,
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
            </div>

            {/* Chat panel */}
            <div style={{
              flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              border: "1px solid var(--line)", borderRadius: 16, background: "var(--card)", overflow: "hidden",
            }}>
              {!activeConnection ? (
                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
                  <div>
                    <p style={{ fontSize: 40, marginBottom: 12 }}>💬</p>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 8, fontSize: 18 }}>No chats yet</h2>
                    <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
                      Private chat opens once a partner accepts your request.
                    </p>
                    <button onClick={() => setTab("discover")} style={{
                      border: "none", borderRadius: 14, padding: "11px 22px",
                      background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
                    }}>
                      Find a study partner →
                    </button>
                  </div>
                </div>
              ) : (() => {
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
                      padding: "11px 16px", borderBottom: "1px solid var(--line)", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={34} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-strong)" }}>
                            {partner?.display_name ?? "Study Partner"}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>
                            {connFocus(activeConnection)} · private 1:1
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setShowPact(v => !v)} style={{
                        border: "1px solid var(--line-hi)", borderRadius: 10, padding: "5px 12px",
                        background: showPact ? "var(--accent-soft)" : "var(--panel)",
                        color: showPact ? "var(--accent)" : "var(--muted)",
                        fontWeight: 600, fontSize: 12, cursor: "pointer", flexShrink: 0,
                      }}>
                        {showPact ? "Hide pact" : "📋 Daily Pact"}
                      </button>
                    </div>

                    {/* Daily pact */}
                    {showPact && (
                      <div style={{
                        padding: "13px 16px", borderBottom: "1px solid var(--line)", flexShrink: 0,
                        background: "linear-gradient(135deg, rgba(184,97,23,0.03), rgba(21,128,61,0.02))",
                        overflowY: "auto", maxHeight: "42%",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
                          <div>
                            <p style={{ fontFamily: "monospace", fontSize: 9.5, letterSpacing: "0.14em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 3 }}>
                              Today&apos;s pact
                            </p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--ink-strong)" }}>
                              One honest block together
                            </p>
                          </div>
                          <div style={{
                            background: pactComplete ? "rgba(21,128,61,0.08)" : "rgba(184,97,23,0.07)",
                            border: `1px solid ${pactComplete ? "rgba(21,128,61,0.22)" : "rgba(184,97,23,0.18)"}`,
                            borderRadius: 12, padding: "6px 10px", textAlign: "center", flexShrink: 0,
                          }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: pactComplete ? "#15803d" : "var(--accent)" }}>
                              {pactComplete ? "✓ Pact done" : "Pact open"}
                            </p>
                            <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{perfectDays}/7 days</p>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 72px", gap: 8, marginBottom: 8 }}>
                          <input value={targetText} onChange={e => setTargetText(e.target.value)}
                            placeholder="Today's target…" maxLength={220} style={{
                              border: "1px solid var(--line)", borderRadius: 12, padding: "9px 12px",
                              background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 600, fontSize: 13,
                            }} />
                          <input type="number" value={focusMinutes} min={15} max={600}
                            onChange={e => setFocusMinutes(Number(e.target.value))} style={{
                              border: "1px solid var(--line)", borderRadius: 12, padding: "9px 8px",
                              background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 700,
                              fontSize: 13, textAlign: "center",
                            }} />
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                          {MOODS.map(m => (
                            <button key={m} type="button" onClick={() => setMood(m)} style={{
                              border: mood === m ? "1.5px solid var(--accent)" : "1px solid var(--line-hi)",
                              background: mood === m ? "var(--accent-soft)" : "var(--panel)",
                              color: mood === m ? "var(--accent)" : "var(--muted)",
                              borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                            }}>{m}</button>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                          {[
                            { name: "You", checkin: myCheckin },
                            { name: partner?.display_name ?? "Partner", checkin: partnerCheckin },
                          ].map(({ name, checkin }) => (
                            <div key={name} style={{
                              borderRadius: 12, padding: "8px 10px",
                              background: checkin?.completed ? "rgba(21,128,61,0.07)" : "var(--panel)",
                              border: `1px solid ${checkin?.completed ? "rgba(21,128,61,0.18)" : "var(--line)"}`,
                            }}>
                              <p style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{name}</p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: checkin?.completed ? "#15803d" : "var(--ink-strong)", marginTop: 3 }}>
                                {checkin?.completed ? "✓ Done" : checkin ? `${checkin.focus_minutes}m` : "Waiting"}
                              </p>
                            </div>
                          ))}
                          <div style={{ borderRadius: 12, padding: "8px 10px", background: "var(--panel)", border: "1px solid var(--line)" }}>
                            <p style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pair focus</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-strong)", marginTop: 3 }}>
                              {Math.floor(pairFocusMins / 60)}h {pairFocusMins % 60}m
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button disabled={actionPending === "lock"} onClick={() => void saveCheckin(false)} style={{
                            flex: 1, border: "1px solid var(--accent-border)", borderRadius: 12, padding: "9px 0",
                            background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 700, cursor: "pointer",
                            opacity: actionPending === "lock" ? 0.7 : 1, fontSize: 12,
                          }}>
                            {actionPending === "lock" ? "Locking…" : "Lock target"}
                          </button>
                          <button disabled={actionPending === "done"} onClick={() => void saveCheckin(true)} style={{
                            flex: 1, border: "none", borderRadius: 12, padding: "9px 0",
                            background: "linear-gradient(135deg, #14532d, #15803d)",
                            color: "#fff", fontWeight: 700, cursor: "pointer",
                            opacity: actionPending === "done" ? 0.7 : 1, fontSize: 12,
                          }}>
                            {actionPending === "done" ? "Marking…" : "Mark done ✓"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    <div ref={msgScrollRef} style={{
                      flex: 1, minHeight: 0, overflowY: "auto",
                      padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      {messages.length === 0 ? (
                        <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: "24px 16px" }}>
                          <div>
                            <p style={{ fontSize: 30, marginBottom: 10 }}>💬</p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-strong)", marginBottom: 6 }}>Start this private thread</p>
                            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>
                              Share today&apos;s target, a mock score, or open the Daily Pact above.
                            </p>
                          </div>
                        </div>
                      ) : messages.map(msg => {
                        const mine = msg.sender_id === userId;
                        return (
                          <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                            <div style={{
                              maxWidth: "75%",
                              borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              background: mine ? "var(--accent)" : "var(--panel)",
                              color: mine ? "#fff" : "var(--ink-strong)",
                              padding: "10px 14px", lineHeight: 1.5, fontSize: 14,
                              border: mine ? "none" : "1px solid var(--line)",
                            }}>
                              <p>{msg.body}</p>
                              <p style={{ opacity: 0.55, fontSize: 10, marginTop: 4, textAlign: "right" }}>{timeAgo(msg.created_at)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Input */}
                    <div style={{
                      padding: "9px 12px 11px", borderTop: "1px solid var(--line)",
                      flexShrink: 0, display: "flex", gap: 8, background: "var(--card)",
                    }}>
                      <input
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
                        placeholder="Share a target, mock score, or doubt…"
                        style={{
                          flex: 1, border: "1px solid var(--line-hi)", borderRadius: 14,
                          padding: "10px 14px", background: "var(--panel)",
                          color: "var(--ink-strong)", fontSize: 14,
                        }}
                      />
                      <button onClick={() => void sendMessage()} disabled={!msgText.trim()} style={{
                        border: "none", borderRadius: 14, padding: "0 18px",
                        background: "var(--accent)", color: "#fff", fontWeight: 700,
                        cursor: msgText.trim() ? "pointer" : "default",
                        opacity: msgText.trim() ? 1 : 0.5, fontSize: 18, flexShrink: 0,
                      }}>↑</button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile full-screen chat overlay ── */}
      {mobileOpenChat && activeConnection && tab === "chat" && (() => {
        const partner = profileMap.get(activePartnerId);
        const lastSeven = Array.from({ length: 7 }, (_, i) =>
          new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
        ).reverse();
        const perfectDays = lastSeven.filter(date => {
          const rows = checkins.filter(r => r.checkin_date === date);
          return rows.length >= 2 && rows.every(r => r.completed);
        }).length;
        return (
          <div className="mobile-chat-overlay" style={{
            display: "flex", flexDirection: "column",
            background: "var(--card)",
          }}>
            {/* Header */}
            <div style={{
              padding: "10px 14px",
              borderBottom: "1px solid var(--line)", flexShrink: 0,
              display: "flex", alignItems: "center", gap: 10,
              background: "var(--card)",
            }}>
              <button onClick={() => setMobileOpenChat(false)} style={{
                background: "none", border: "none", fontSize: 26, cursor: "pointer",
                color: "var(--accent)", padding: "0 2px", flexShrink: 0, lineHeight: 1,
              }}>‹</button>
              <Avatar url={partner?.avatar_url ?? null} name={partner?.display_name ?? "?"} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {partner?.display_name ?? "Study Partner"}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", display: "inline-block", flexShrink: 0,
                    background: partner && (Date.now() - new Date(partner.updated_at).getTime() < 86400000) ? "#16a34a" : "#9ca3af",
                  }} />
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>
                    {partner && (Date.now() - new Date(partner.updated_at).getTime() < 86400000)
                      ? "active today"
                      : partner ? `last seen ${timeAgo(partner.updated_at)}` : "offline"
                    }
                    {" · "}{connFocus(activeConnection)}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPact(v => !v)} style={{
                border: "1px solid var(--line-hi)", borderRadius: 10, padding: "5px 10px",
                background: showPact ? "var(--accent-soft)" : "var(--panel)",
                color: showPact ? "var(--accent)" : "var(--muted)",
                fontWeight: 600, fontSize: 11, cursor: "pointer", flexShrink: 0,
              }}>
                {showPact ? "Hide" : "📋 Pact"}
              </button>
            </div>

            {/* Daily pact */}
            {showPact && (
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid var(--line)", flexShrink: 0,
                background: "linear-gradient(135deg, rgba(184,97,23,0.03), rgba(21,128,61,0.02))",
                overflowY: "auto", maxHeight: "42%",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 9.5, letterSpacing: "0.14em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 3 }}>
                      Today&apos;s pact
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--ink-strong)" }}>
                      One honest block together
                    </p>
                  </div>
                  <div style={{
                    background: pactComplete ? "rgba(21,128,61,0.08)" : "rgba(184,97,23,0.07)",
                    border: `1px solid ${pactComplete ? "rgba(21,128,61,0.22)" : "rgba(184,97,23,0.18)"}`,
                    borderRadius: 12, padding: "6px 10px", textAlign: "center", flexShrink: 0,
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: pactComplete ? "#15803d" : "var(--accent)" }}>
                      {pactComplete ? "✓ Pact done" : "Pact open"}
                    </p>
                    <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{perfectDays}/7 days</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 72px", gap: 8, marginBottom: 8 }}>
                  <input value={targetText} onChange={e => setTargetText(e.target.value)}
                    placeholder="Today's target…" maxLength={220} style={{
                      border: "1px solid var(--line)", borderRadius: 12, padding: "9px 12px",
                      background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 600, fontSize: 13,
                    }} />
                  <input type="number" value={focusMinutes} min={15} max={600}
                    onChange={e => setFocusMinutes(Number(e.target.value))} style={{
                      border: "1px solid var(--line)", borderRadius: 12, padding: "9px 8px",
                      background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 700,
                      fontSize: 13, textAlign: "center",
                    }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {MOODS.map(m => (
                    <button key={m} type="button" onClick={() => setMood(m)} style={{
                      border: mood === m ? "1.5px solid var(--accent)" : "1px solid var(--line-hi)",
                      background: mood === m ? "var(--accent-soft)" : "var(--panel)",
                      color: mood === m ? "var(--accent)" : "var(--muted)",
                      borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    }}>{m}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {[
                    { name: "You", checkin: myCheckin },
                    { name: partner?.display_name ?? "Partner", checkin: partnerCheckin },
                  ].map(({ name, checkin }) => (
                    <div key={name} style={{
                      borderRadius: 12, padding: "8px 10px",
                      background: checkin?.completed ? "rgba(21,128,61,0.07)" : "var(--panel)",
                      border: `1px solid ${checkin?.completed ? "rgba(21,128,61,0.18)" : "var(--line)"}`,
                    }}>
                      <p style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{name}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: checkin?.completed ? "#15803d" : "var(--ink-strong)", marginTop: 3 }}>
                        {checkin?.completed ? "✓ Done" : checkin ? `${checkin.focus_minutes}m` : "Waiting"}
                      </p>
                    </div>
                  ))}
                  <div style={{ borderRadius: 12, padding: "8px 10px", background: "var(--panel)", border: "1px solid var(--line)" }}>
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pair focus</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-strong)", marginTop: 3 }}>
                      {Math.floor(pairFocusMins / 60)}h {pairFocusMins % 60}m
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button disabled={actionPending === "lock"} onClick={() => void saveCheckin(false)} style={{
                    flex: 1, border: "1px solid var(--accent-border)", borderRadius: 12, padding: "9px 0",
                    background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 700, cursor: "pointer",
                    opacity: actionPending === "lock" ? 0.7 : 1, fontSize: 12,
                  }}>
                    {actionPending === "lock" ? "Locking…" : "Lock target"}
                  </button>
                  <button disabled={actionPending === "done"} onClick={() => void saveCheckin(true)} style={{
                    flex: 1, border: "none", borderRadius: 12, padding: "9px 0",
                    background: "linear-gradient(135deg, #14532d, #15803d)",
                    color: "#fff", fontWeight: 700, cursor: "pointer",
                    opacity: actionPending === "done" ? 0.7 : 1, fontSize: 12,
                  }}>
                    {actionPending === "done" ? "Marking…" : "Mark done ✓"}
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div ref={mobileScrollRef} style={{
              flex: 1, minHeight: 0, overflowY: "auto",
              padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6,
            }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: "24px 16px" }}>
                  <div>
                    <p style={{ fontSize: 30, marginBottom: 10 }}>💬</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-strong)", marginBottom: 6 }}>Start this private thread</p>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>
                      Share today&apos;s target, a mock score, or open the Daily Pact above.
                    </p>
                  </div>
                </div>
              ) : messages.map(msg => {
                const mine = msg.sender_id === userId;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "80%",
                      borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: mine ? "var(--accent)" : "var(--panel)",
                      color: mine ? "#fff" : "var(--ink-strong)",
                      padding: "10px 14px", lineHeight: 1.5, fontSize: 14,
                      border: mine ? "none" : "1px solid var(--line)",
                    }}>
                      <p>{msg.body}</p>
                      <p style={{ opacity: 0.55, fontSize: 10, marginTop: 4, textAlign: "right" }}>{timeAgo(msg.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div style={{
              padding: "9px 12px 11px",
              borderTop: "1px solid var(--line)",
              flexShrink: 0, display: "flex", gap: 8, background: "var(--card)",
            }}>
              <input
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }}
                placeholder="Share a target, mock score, or doubt…"
                style={{
                  flex: 1, border: "1px solid var(--line-hi)", borderRadius: 14,
                  padding: "10px 14px", background: "var(--panel)",
                  color: "var(--ink-strong)", fontSize: 14,
                }}
              />
              <button onClick={() => void sendMessage()} disabled={!msgText.trim()} style={{
                border: "none", borderRadius: 14, padding: "0 18px",
                background: "var(--accent)", color: "#fff", fontWeight: 700,
                cursor: msgText.trim() ? "pointer" : "default",
                opacity: msgText.trim() ? 1 : 0.5, fontSize: 18, flexShrink: 0,
              }}>↑</button>
            </div>
          </div>
        );
      })()}

    </main>
  );
}
