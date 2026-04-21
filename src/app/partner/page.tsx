"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

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

const EXAMS = ["72nd BPSC", "BPSC TRE", "Bihar SI", "UPSC + BPSC", "Bihar SSC"];
const STAGES = ["Starting", "Building basics", "Revision", "Test series", "Final sprint"];
const DISTRICTS = [
  "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnea",
  "Nalanda", "Siwan", "Bhojpur", "Bihar", "Outside Bihar",
];
const LANGUAGES = ["Hindi", "English", "Hindi + English"];
const HOURS = ["1-2 hrs/day", "2-3 hrs/day", "3-5 hrs/day", "5+ hrs/day"];
const MODES = [
  "Accountability + Silent Study",
  "Doubt discussion",
  "Daily target check",
  "Mock-test partner",
  "Full syllabus revision",
];
const SLOTS = ["Morning", "Afternoon", "Evening", "Late night"];
const SUBJECTS = [
  "Current Affairs", "Polity", "Economy", "History", "Geography",
  "Bihar Special", "Science", "Environment", "Maths", "Reasoning",
];
const GENDER_PREFS = ["No preference", "Female only", "Male only"];

function firstName(session: Session | null) {
  const user = session?.user;
  return (
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "Aspirant"
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function overlap(a: string[] = [], b: string[] = []) {
  return a.filter(item => b.includes(item));
}

function scoreMatch(me: PartnerProfile | null, partner: PartnerProfile) {
  if (!me) return 60;
  let score = 24;
  if (partner.exam_target === me.exam_target) score += 16;
  if (partner.stage === me.stage) score += 10;
  if (partner.language === me.language) score += 8;
  if (partner.district === me.district) score += 6;
  if (partner.daily_hours === me.daily_hours) score += 8;
  score += Math.min(16, overlap(partner.slots, me.slots).length * 8);
  score += Math.min(18, overlap(partner.strong_subjects, me.weak_subjects).length * 9);
  score += Math.min(10, overlap(partner.weak_subjects, me.strong_subjects).length * 5);
  score += Math.round(Math.min(partner.seriousness_score, 100) / 10);
  return Math.min(99, score);
}

function matchReason(me: PartnerProfile | null, partner: PartnerProfile) {
  if (!me) return "Create your profile to unlock precise matching.";
  const reasons = [];
  if (partner.exam_target === me.exam_target) reasons.push("same exam");
  if (partner.stage === me.stage) reasons.push("same prep stage");
  const slots = overlap(partner.slots, me.slots);
  if (slots.length) reasons.push(`${slots[0].toLowerCase()} slot`);
  const helps = overlap(partner.strong_subjects, me.weak_subjects);
  if (helps.length) reasons.push(`strong in your weak area: ${helps[0]}`);
  return reasons.length ? reasons.slice(0, 3).join(" · ") : "Different profile, useful for accountability.";
}

const chip = (active: boolean): React.CSSProperties => ({
  border: active ? "1.5px solid var(--accent)" : "1px solid var(--line)",
  background: active ? "var(--accent-soft)" : "var(--chip)",
  color: active ? "var(--accent)" : "var(--ink-soft)",
  borderRadius: 999,
  padding: "7px 11px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
});

const card: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--card)",
  borderRadius: 22,
  boxShadow: "0 12px 32px rgba(39, 24, 8, 0.07)",
};

const glassCard: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.16)",
  background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,248,235,0.72))",
  borderRadius: 26,
  boxShadow: "0 24px 70px rgba(48, 26, 7, 0.13)",
};

export default function PartnerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"discover" | "requests" | "chat" | "profile">("discover");
  const [profiles, setProfiles] = useState<PartnerProfile[]>([]);
  const [myProfile, setMyProfile] = useState<PartnerProfile | null>(null);
  const [connections, setConnections] = useState<PartnerConnection[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PartnerMessage[]>([]);
  const [checkins, setCheckins] = useState<PartnerCheckin[]>([]);
  const [messageText, setMessageText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(90);
  const [mood, setMood] = useState("locked in");
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeConnectionIdRef = useRef<string | null>(null);

  const [form, setForm] = useState({
    exam_target: "72nd BPSC",
    stage: "Revision",
    district: "Patna",
    language: "Hindi + English",
    gender_preference: "No preference",
    partner_gender_preference: "No preference",
    study_mode: "Accountability + Silent Study",
    daily_hours: "2-3 hrs/day",
    slots: ["Evening"],
    weak_subjects: ["Current Affairs", "Polity"],
    strong_subjects: ["Bihar Special"],
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
  const activePartnerId = activeConnection
    ? activeConnection.requester_id === userId
      ? activeConnection.receiver_id
      : activeConnection.requester_id
    : "";
  const todaysCheckins = checkins.filter(c => c.checkin_date === todayKey());
  const myCheckin = todaysCheckins.find(c => c.user_id === userId) ?? null;
  const partnerCheckin = todaysCheckins.find(c => c.user_id === activePartnerId) ?? null;
  const pactComplete = Boolean(myCheckin?.completed && partnerCheckin?.completed);
  const pairFocusMinutes = todaysCheckins.reduce((sum, item) => sum + item.focus_minutes, 0);
  const activeChatCount = accepted.length;
  const attentionCount = incoming.length + activeChatCount;

  const candidates = useMemo(() => {
    const blocked = new Set(
      connections
        .filter(c => c.status === "pending" || c.status === "accepted")
        .flatMap(c => [c.requester_id, c.receiver_id])
    );
    return profiles
      .filter(p => p.user_id !== userId)
      .filter(p => !blocked.has(p.user_id))
      .map(p => ({ profile: p, score: scoreMatch(myProfile, p), reason: matchReason(myProfile, p) }))
      .sort((a, b) => b.score - a.score);
  }, [connections, myProfile, profiles, userId]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function boot() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    }

    void boot();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    activeConnectionIdRef.current = activeConnection?.id ?? null;
  }, [activeConnection?.id]);

  useEffect(() => {
    if (!activeConnectionId && accepted.length > 0) {
      setActiveConnectionId(accepted[0].id);
    }
  }, [accepted, activeConnectionId]);

  useEffect(() => {
    if (!session) return;
    void loadAll();

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("study-partner-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_profiles" }, () => void loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_connections" }, () => void loadAll())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "study_partner_messages" }, payload => {
        const next = payload.new as PartnerMessage;
        if (next.connection_id === activeConnectionIdRef.current) {
          setMessages(prev => prev.some(item => item.id === next.id) ? prev : [...prev, next]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_checkins" }, payload => {
        const next = payload.new as PartnerCheckin;
        if (next?.connection_id === activeConnectionIdRef.current) void loadCheckins(next.connection_id);
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  useEffect(() => {
    if (activeConnection?.id) {
      void loadMessages(activeConnection.id);
      void loadCheckins(activeConnection.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnection?.id]);

  async function loadAll() {
    if (!session) return;
    const supabase = getSupabaseBrowserClient();
    const [{ data: allProfiles }, { data: allConnections }] = await Promise.all([
      (supabase as any)
        .from("study_partner_profiles")
        .select("*")
        .order("updated_at", { ascending: false }),
      (supabase as any)
        .from("study_partner_connections")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    const typedProfiles = (allProfiles ?? []) as PartnerProfile[];
    const mine = typedProfiles.find(p => p.user_id === session.user.id) ?? null;
    setMyProfile(mine);
    setProfiles(typedProfiles.filter(p => p.user_id !== session.user.id && p.is_active));
    setConnections((allConnections ?? []) as PartnerConnection[]);
    if (mine) {
      setForm({
        exam_target: mine.exam_target,
        stage: mine.stage,
        district: mine.district,
        language: mine.language,
        gender_preference: mine.gender_preference,
        partner_gender_preference: mine.partner_gender_preference,
        study_mode: mine.study_mode,
        daily_hours: mine.daily_hours,
        slots: mine.slots,
        weak_subjects: mine.weak_subjects,
        strong_subjects: mine.strong_subjects,
        bio: mine.bio,
        seriousness_score: mine.seriousness_score,
      });
    } else {
      setTab("profile");
    }
  }

  async function loadMessages(connectionId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data } = await (supabase as any)
      .from("study_partner_messages")
      .select("*")
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true })
      .limit(100);
    setMessages((data ?? []) as PartnerMessage[]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }

  async function loadCheckins(connectionId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data } = await (supabase as any)
      .from("study_partner_checkins")
      .select("*")
      .eq("connection_id", connectionId)
      .gte("checkin_date", new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10))
      .order("checkin_date", { ascending: false });
    const rows = (data ?? []) as PartnerCheckin[];
    setCheckins(rows);
    const mine = rows.find(row => row.user_id === userId && row.checkin_date === todayKey());
    if (mine) {
      setTargetText(mine.target);
      setFocusMinutes(mine.focus_minutes || 90);
      setMood(mine.mood || "locked in");
    } else {
      setTargetText("");
      setFocusMinutes(90);
      setMood("locked in");
    }
  }

  async function signIn() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/partner` },
    });
  }

  function toggleArray(key: "slots" | "weak_subjects" | "strong_subjects", value: string) {
    setForm(prev => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  async function saveProfile() {
    if (!session) return;
    setSaving(true);
    setNotice("");
    const supabase = getSupabaseBrowserClient();
    const payload = {
      user_id: session.user.id,
      display_name: firstName(session),
      avatar_url: (session.user.user_metadata?.avatar_url as string | undefined) ?? null,
      ...form,
      bio: form.bio.trim().slice(0, 220),
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    const { error } = await (supabase as any)
      .from("study_partner_profiles")
      .upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      setNotice(error.message);
      return;
    }
    setNotice("Profile updated. Matching refreshed.");
    await loadAll();
    setTab("discover");
  }

  async function sendRequest(receiverId: string) {
    if (!session || !myProfile) {
      setTab("profile");
      setNotice("Create your study profile first.");
      return;
    }
    setActionPending(`request:${receiverId}`);
    setNotice("Sending match request...");
    const supabase = getSupabaseBrowserClient();
    const partner = profileMap.get(receiverId);
    const { error } = await (supabase as any).from("study_partner_connections").insert({
      requester_id: session.user.id,
      receiver_id: receiverId,
      opener: `Hi ${partner?.display_name ?? "there"}, let's do a 7-day BPSC accountability sprint.`,
    });
    if (error) {
      setActionPending(null);
      setNotice(
        error.message.includes("duplicate")
          ? "You already have an active request or chat with this student."
          : error.message
      );
      return;
    }
    setNotice("Request sent. Chat opens after they accept.");
    await loadAll();
    setActionPending(null);
    setTab("requests");
  }

  async function updateConnection(id: string, status: "accepted" | "rejected" | "cancelled") {
    setActionPending(`${status}:${id}`);
    const supabase = getSupabaseBrowserClient();
    const { error } = await (supabase as any)
      .from("study_partner_connections")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setActionPending(null);
      setNotice(error.message);
      return;
    }
    await loadAll();
    setActionPending(null);
    if (status === "accepted") {
      setActiveConnectionId(id);
      setTab("chat");
    }
  }

  async function sendMessage() {
    if (!session || !activeConnection || !messageText.trim()) return;
    const body = messageText.trim().slice(0, 600);
    setMessageText("");
    const optimistic: PartnerMessage = {
      id: -Date.now(),
      connection_id: activeConnection.id,
      sender_id: session.user.id,
      body,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
    const supabase = getSupabaseBrowserClient();
    const { error } = await (supabase as any).from("study_partner_messages").insert({
      connection_id: activeConnection.id,
      sender_id: session.user.id,
      body,
    });
    if (error) {
      setNotice(error.message);
      setMessages(prev => prev.filter(item => item.id !== optimistic.id));
      return;
    }
    await loadMessages(activeConnection.id);
  }

  async function saveCheckin(completed = false) {
    if (!session || !activeConnection) return;
    const target = targetText.trim().slice(0, 220);
    if (!target) {
      setNotice("Add today's target first.");
      return;
    }
    setActionPending(completed ? "done" : "lock");
    setNotice(completed ? "Marking today as done..." : "Locking today's target...");
    const supabase = getSupabaseBrowserClient();
    const { error } = await (supabase as any)
      .from("study_partner_checkins")
      .upsert({
        connection_id: activeConnection.id,
        user_id: session.user.id,
        checkin_date: todayKey(),
        target,
        completed: completed || myCheckin?.completed || false,
        focus_minutes: focusMinutes,
        mood,
        updated_at: new Date().toISOString(),
      }, { onConflict: "connection_id,user_id,checkin_date" });

    if (error) {
      setActionPending(null);
      setNotice(error.message);
      return;
    }

    await loadCheckins(activeConnection.id);
    const partner = profileMap.get(otherUser(activeConnection));
    setMessageText(
      completed
        ? `Done for today: ${target} (${focusMinutes} min). Your turn, ${partner?.display_name ?? "partner"}.`
        : `Today's target: ${target} (${focusMinutes} min). Let's finish this.`
    );
    setActionPending(null);
    setNotice(completed ? "Done marked. Send the update to your partner." : "Target locked. Send it to your partner.");
  }

  async function reportUser(reportedUserId: string) {
    if (!session) return;
    const reason = window.prompt("Why are you reporting this user?");
    if (!reason?.trim()) return;
    const supabase = getSupabaseBrowserClient();
    await (supabase as any).from("study_partner_reports").insert({
      reporter_id: session.user.id,
      reported_user_id: reportedUserId,
      reason: reason.trim().slice(0, 300),
    });
    setNotice("Report submitted. We will review this user.");
  }

  const otherUser = (connection: PartnerConnection) =>
    connection.requester_id === userId ? connection.receiver_id : connection.requester_id;

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--muted)", fontWeight: 800 }}>Loading partner room...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "56px 18px" }}>
        <section style={{ ...card, maxWidth: 560, margin: "0 auto", padding: 28, textAlign: "center" }}>
          <p style={{ fontSize: 42, marginBottom: 14 }}>Study Partner</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 7vw, 3.4rem)", lineHeight: 1, color: "var(--ink-strong)", marginBottom: 12 }}>
            Find one serious aspirant. Finish the syllabus together.
          </h1>
          <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 22 }}>
            Match by exam, weak subjects, daily slot, language, district and seriousness. Private chat opens only after both students connect.
          </p>
          <button onClick={signIn} style={{
            border: "none", borderRadius: 14, padding: "14px 20px",
            background: "var(--accent)", color: "#fff", fontWeight: 900,
            fontFamily: "var(--font-display)", cursor: "pointer",
          }}>
            Sign in to find a partner
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "18px 14px 90px" }}>
      <section style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{
          ...card,
          padding: "24px 18px",
          background: "linear-gradient(135deg, #16110b, #2a1608 58%, #8a3f0f)",
          color: "#fff",
          overflow: "hidden",
        }}>
          <p style={{ fontFamily: "monospace", letterSpacing: "0.22em", fontSize: 11, opacity: 0.72, textTransform: "uppercase", marginBottom: 10 }}>
            BPSC Cosmos Matching Lab
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 7vw, 4.3rem)", lineHeight: 0.95, letterSpacing: "-0.05em", maxWidth: 760 }}>
            Don&apos;t study alone. Build your serious circle.
          </h1>
          <p style={{ marginTop: 14, color: "rgba(255,255,255,0.72)", maxWidth: 620, lineHeight: 1.7, fontSize: 15 }}>
            Match with aspirants who share your target, timing and weak areas. Send a request, accept privately, then use 1:1 chat for daily targets.
          </p>
        </div>

        {notice && (
          <div style={{
            ...card,
            position: "sticky",
            top: 62,
            zIndex: 20,
            marginTop: 14,
            padding: "12px 14px",
            color: "var(--accent)",
            fontWeight: 800,
            fontSize: 13,
            borderColor: "rgba(184,97,23,0.28)",
          }}>
            {notice}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 12px" }}>
          {[
            ["discover", `Discover ${candidates.length}`],
            ["requests", `Requests ${incoming.length + outgoing.length}`],
            ["chat", `Messages ${attentionCount}`],
            ["profile", myProfile ? "My Match Profile" : "Create Profile"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)} style={{
              ...chip(tab === id),
              whiteSpace: "nowrap",
              padding: "10px 14px",
            }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "discover" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {!myProfile && (
              <div style={{ ...card, padding: 20 }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 8 }}>Create your profile first</h2>
                <p style={{ color: "var(--ink-soft)", lineHeight: 1.65, fontSize: 14, marginBottom: 14 }}>
                  Matching becomes useful only after we know your stage, weak subjects and study slot.
                </p>
                <button onClick={() => setTab("profile")} style={{ ...chip(true), borderRadius: 12 }}>Create profile</button>
              </div>
            )}

            {candidates.map(({ profile, score, reason }) => (
              <article key={profile.user_id} style={{ ...card, padding: 18, display: "flex", flexDirection: "column", gap: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={profile.display_name} width={48} height={48} style={{ borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center",
                      background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 900,
                    }}>
                      {initials(profile.display_name)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "var(--ink-strong)", fontSize: 17, fontFamily: "var(--font-display)" }}>{profile.display_name}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 12 }}>{profile.district} · {profile.stage}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 22 }}>{score}%</p>
                    <p style={{ color: "var(--muted)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>match</p>
                  </div>
                </div>

                <div style={{ height: 8, background: "rgba(120,80,30,0.12)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${score}%`, height: "100%", background: "linear-gradient(90deg, #b86117, #16a34a)", borderRadius: 999 }} />
                </div>

                <p style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.55 }}>{reason}</p>
                <p style={{ color: "var(--ink-strong)", fontSize: 13, lineHeight: 1.55 }}>{profile.bio}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[profile.exam_target, profile.daily_hours, profile.study_mode, ...profile.slots.slice(0, 2)].map(item => (
                    <span key={item} style={{ ...chip(false), cursor: "default", padding: "5px 9px" }}>{item}</span>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ background: "rgba(22,163,74,0.08)", borderRadius: 12, padding: 10 }}>
                    <b style={{ color: "#15803d" }}>Strong</b>
                    <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>{profile.strong_subjects.join(", ") || "Not set"}</p>
                  </div>
                  <div style={{ background: "rgba(220,38,38,0.06)", borderRadius: 12, padding: 10 }}>
                    <b style={{ color: "#b91c1c" }}>Improving</b>
                    <p style={{ color: "var(--ink-soft)", marginTop: 4 }}>{profile.weak_subjects.join(", ") || "Not set"}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" disabled={actionPending === `request:${profile.user_id}`} onClick={() => sendRequest(profile.user_id)} style={{
                    flex: 1, border: "none", borderRadius: 13, padding: "12px 14px",
                    background: "var(--accent)", color: "#fff", fontWeight: 900, cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    opacity: actionPending === `request:${profile.user_id}` ? 0.72 : 1,
                  }}>
                    {actionPending === `request:${profile.user_id}` ? "Sending..." : "Send private request"}
                  </button>
                  <button type="button" onClick={() => reportUser(profile.user_id)} style={{ ...chip(false), borderRadius: 13 }}>
                    Report
                  </button>
                </div>
              </article>
            ))}

            {myProfile && candidates.length === 0 && (
              <div style={{ ...card, padding: 22, textAlign: "center", gridColumn: "1 / -1" }}>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 8 }}>No new matches yet</h2>
                <p style={{ color: "var(--ink-soft)" }}>Your requests and accepted partners are hidden from Discover. Check Requests or Chat.</p>
              </div>
            )}
          </div>
        )}

        {tab === "requests" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            <RequestList
              title="Requests to you"
              empty="No incoming requests yet."
              rows={incoming}
              userId={userId}
              profileMap={profileMap}
              onAccept={id => updateConnection(id, "accepted")}
              onReject={id => updateConnection(id, "rejected")}
            />
            <RequestList
              title="Sent by you"
              empty="No sent requests."
              rows={outgoing}
              userId={userId}
              profileMap={profileMap}
              onCancel={id => updateConnection(id, "cancelled")}
            />
          </div>
        )}

        {tab === "chat" && (
          <div style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: 14, alignItems: "stretch" }}>
            <div style={{ ...glassCard, padding: 12, height: "min(78vh, 760px)", overflowY: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "6px 6px 12px" }}>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "var(--accent)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    Inbox
                  </p>
                  <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 22 }}>Private chats</h2>
                </div>
                <span style={{ ...chip(true), cursor: "default" }}>{activeChatCount}</span>
              </div>
              {accepted.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, padding: 8 }}>No private chats yet. Accept or send a request first.</p>}
              {accepted.map(conn => {
                const other = profileMap.get(otherUser(conn));
                const active = activeConnection?.id === conn.id;
                const threadCheckins = checkins.filter(item => item.connection_id === conn.id && item.checkin_date === todayKey());
                const threadDone = threadCheckins.length >= 2 && threadCheckins.every(item => item.completed);
                return (
                  <button key={conn.id} onClick={() => setActiveConnectionId(conn.id)} style={{
                    width: "100%", textAlign: "left", border: active ? "1.5px solid var(--accent)" : "1px solid rgba(120,80,30,0.10)",
                    background: active ? "linear-gradient(135deg, rgba(184,97,23,0.13), rgba(255,255,255,0.92))" : "rgba(255,255,255,0.58)", borderRadius: 18,
                    padding: 13, cursor: "pointer", marginBottom: 8,
                    boxShadow: active ? "0 12px 28px rgba(184,97,23,0.12)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <b style={{ color: "var(--ink-strong)" }}>{other?.display_name ?? "Partner"}</b>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 900,
                        color: threadDone ? "#15803d" : "var(--accent)",
                        background: threadDone ? "rgba(22,163,74,0.10)" : "rgba(184,97,23,0.10)",
                        borderRadius: 999,
                        padding: "3px 7px",
                      }}>
                        {threadDone ? "done" : "active"}
                      </span>
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>{other?.study_mode ?? "1:1 accountability"}</p>
                  </button>
                );
              })}
            </div>

            <div style={{ ...glassCard, height: "min(78vh, 760px)", minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {activeConnection ? (
                <>
                  <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(120,80,30,0.12)", background: "rgba(255,255,255,0.58)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 22 }}>
                          {profileMap.get(otherUser(activeConnection))?.display_name ?? "Study Partner"}
                        </h2>
                        <p style={{ color: "var(--muted)", fontSize: 12 }}>Separate private chat · daily pact · real accountability</p>
                      </div>
                      <span style={{ ...chip(pactComplete), cursor: "default" }}>{pactComplete ? "closed today" : "open today"}</span>
                    </div>
                  </div>
                  <DailyPact
                    partnerName={profileMap.get(otherUser(activeConnection))?.display_name ?? "Partner"}
                    targetText={targetText}
                    setTargetText={setTargetText}
                    focusMinutes={focusMinutes}
                    setFocusMinutes={setFocusMinutes}
                    mood={mood}
                    setMood={setMood}
                    myCheckin={myCheckin}
                    partnerCheckin={partnerCheckin}
                    checkins={checkins}
                    pairFocusMinutes={pairFocusMinutes}
                    pactComplete={pactComplete}
                    onSave={() => saveCheckin(false)}
                    onDone={() => saveCheckin(true)}
                    actionPending={actionPending}
                  />
                  <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {messages.length === 0 && (
                      <div style={{ textAlign: "center", padding: "28px 12px", color: "var(--muted)" }}>
                        <p style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 18, marginBottom: 6 }}>Start this private thread</p>
                        <p style={{ fontSize: 13, lineHeight: 1.6 }}>Send today&apos;s target, a mock score, or one topic you both must finish before sleeping.</p>
                      </div>
                    )}
                    {messages.map(msg => {
                      const mine = msg.sender_id === userId;
                      return (
                        <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                          <div style={{
                            maxWidth: "78%", borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            background: mine ? "var(--accent)" : "var(--chip)",
                            color: mine ? "#fff" : "var(--ink-strong)",
                            padding: "10px 13px", lineHeight: 1.5, fontSize: 14,
                          }}>
                            {msg.body}
                            <p style={{ opacity: 0.65, fontSize: 10, marginTop: 4 }}>{timeAgo(msg.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                  <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
                    <input
                      value={messageText}
                      onChange={event => setMessageText(event.target.value)}
                      onKeyDown={event => { if (event.key === "Enter") void sendMessage(); }}
                      placeholder="Send today's target, doubt, or mock score..."
                      style={{
                        flex: 1, border: "1px solid var(--line)", borderRadius: 14,
                        padding: "12px 13px", background: "var(--panel)", color: "var(--ink-strong)",
                      }}
                    />
                    <button onClick={sendMessage} style={{ border: "none", borderRadius: 14, background: "var(--accent)", color: "#fff", padding: "0 16px", fontWeight: 900 }}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 30 }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 8 }}>No chat selected</h2>
                    <p style={{ color: "var(--muted)" }}>Private chat opens only after a request is accepted.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <section style={{ ...card, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 24 }}>Your matching profile</h2>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>The better this is, the better the partner recommendations become.</p>
              </div>
              <div style={{ ...chip(true), cursor: "default" }}>{form.seriousness_score}/100 serious</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <SelectField label="Exam" value={form.exam_target} values={EXAMS} onChange={value => setForm({ ...form, exam_target: value })} />
              <SelectField label="Stage" value={form.stage} values={STAGES} onChange={value => setForm({ ...form, stage: value })} />
              <SelectField label="District" value={form.district} values={DISTRICTS} onChange={value => setForm({ ...form, district: value })} />
              <SelectField label="Language" value={form.language} values={LANGUAGES} onChange={value => setForm({ ...form, language: value })} />
              <SelectField label="Daily hours" value={form.daily_hours} values={HOURS} onChange={value => setForm({ ...form, daily_hours: value })} />
              <SelectField label="Study mode" value={form.study_mode} values={MODES} onChange={value => setForm({ ...form, study_mode: value })} />
              <SelectField label="Your preference" value={form.partner_gender_preference} values={GENDER_PREFS} onChange={value => setForm({ ...form, partner_gender_preference: value })} />
            </div>

            <MultiField label="Available slots" values={SLOTS} selected={form.slots} onToggle={value => toggleArray("slots", value)} />
            <MultiField label="Weak subjects" values={SUBJECTS} selected={form.weak_subjects} onToggle={value => toggleArray("weak_subjects", value)} />
            <MultiField label="Strong subjects" values={SUBJECTS} selected={form.strong_subjects} onToggle={value => toggleArray("strong_subjects", value)} />

            <label style={{ display: "block", marginTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Short bio</span>
              <textarea
                value={form.bio}
                onChange={event => setForm({ ...form, bio: event.target.value })}
                maxLength={220}
                rows={3}
                style={{
                  width: "100%", boxSizing: "border-box", marginTop: 7, border: "1px solid var(--line)",
                  borderRadius: 14, padding: 13, background: "var(--panel)", color: "var(--ink-strong)", resize: "vertical",
                }}
              />
            </label>

            <label style={{ display: "block", marginTop: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Seriousness score</span>
              <input
                type="range"
                min={30}
                max={100}
                value={form.seriousness_score}
                onChange={event => setForm({ ...form, seriousness_score: Number(event.target.value) })}
                style={{ width: "100%", marginTop: 8 }}
              />
            </label>

            <button onClick={saveProfile} disabled={saving} style={{
              marginTop: 18, border: "none", borderRadius: 15, padding: "14px 18px",
              background: "var(--accent)", color: "#fff", fontWeight: 900,
              fontFamily: "var(--font-display)", cursor: saving ? "wait" : "pointer",
            }}>
              {saving ? "Saving..." : myProfile ? "Update match profile" : "Create match profile"}
            </button>
          </section>
        )}
      </section>

      <style>{`
        @media (max-width: 760px) {
          main [style*="grid-template-columns: 340px minmax(0, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          main [style*="height: min(78vh, 760px)"] {
            height: auto !important;
            max-height: none !important;
          }
          main [style*="grid-template-columns: 1.4fr 0.8fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function DailyPact({
  partnerName,
  targetText,
  setTargetText,
  focusMinutes,
  setFocusMinutes,
  mood,
  setMood,
  myCheckin,
  partnerCheckin,
  checkins,
  pairFocusMinutes,
  pactComplete,
  onSave,
  onDone,
  actionPending,
}: {
  partnerName: string;
  targetText: string;
  setTargetText: (value: string) => void;
  focusMinutes: number;
  setFocusMinutes: (value: number) => void;
  mood: string;
  setMood: (value: string) => void;
  myCheckin: PartnerCheckin | null;
  partnerCheckin: PartnerCheckin | null;
  checkins: PartnerCheckin[];
  pairFocusMinutes: number;
  pactComplete: boolean;
  onSave: () => void;
  onDone: () => void;
  actionPending: string | null;
}) {
  const lastSevenDates = Array.from({ length: 7 }, (_, index) =>
    new Date(Date.now() - index * 86400000).toISOString().slice(0, 10)
  ).reverse();
  const perfectDays = lastSevenDates.filter(date => {
    const rows = checkins.filter(row => row.checkin_date === date);
    return rows.length >= 2 && rows.every(row => row.completed);
  }).length;

  return (
    <section style={{
      margin: 12,
      padding: 14,
      borderRadius: 22,
      background: "linear-gradient(135deg, #fff7ea, #ffffff 54%, #eefaf1)",
      border: "1px solid rgba(184,97,23,0.16)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 4 }}>
            Today&apos;s pact
          </p>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 20, letterSpacing: "-0.03em" }}>
            Finish one honest block together
          </h3>
        </div>
        <div style={{
          borderRadius: 16,
          padding: "8px 10px",
          background: pactComplete ? "rgba(22,163,74,0.12)" : "rgba(184,97,23,0.10)",
          color: pactComplete ? "#15803d" : "var(--accent)",
          fontWeight: 900,
          fontSize: 12,
          textAlign: "right",
          minWidth: 92,
        }}>
          {pactComplete ? "Pact closed" : "Pact open"}
          <p style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{perfectDays}/7 perfect days</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 10 }}>
        <input
          value={targetText}
          onChange={event => setTargetText(event.target.value)}
          placeholder="Example: Revise Polity articles + 25 CA facts"
          maxLength={220}
          style={{
            minWidth: 0,
            border: "1px solid rgba(120,80,30,0.14)",
            borderRadius: 14,
            padding: "12px 13px",
            background: "rgba(255,255,255,0.82)",
            color: "var(--ink-strong)",
            fontWeight: 700,
          }}
        />
        <input
          type="number"
          value={focusMinutes}
          min={15}
          max={600}
          onChange={event => setFocusMinutes(Number(event.target.value))}
          style={{
            minWidth: 0,
            border: "1px solid rgba(120,80,30,0.14)",
            borderRadius: 14,
            padding: "12px 13px",
            background: "rgba(255,255,255,0.82)",
            color: "var(--ink-strong)",
            fontWeight: 800,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
        {["locked in", "steady", "tired but showing up", "test mode"].map(item => (
          <button key={item} type="button" onClick={() => setMood(item)} style={chip(mood === item)}>
            {item}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 9, marginTop: 12 }}>
        <StatusTile
          title="You"
          subtitle={myCheckin?.target || "Target not locked"}
          strong={myCheckin?.completed ? "Done" : myCheckin ? `${myCheckin.focus_minutes} min locked` : "Waiting"}
          good={Boolean(myCheckin?.completed)}
        />
        <StatusTile
          title={partnerName}
          subtitle={partnerCheckin?.target || "No target yet"}
          strong={partnerCheckin?.completed ? "Done" : partnerCheckin ? `${partnerCheckin.focus_minutes} min locked` : "Waiting"}
          good={Boolean(partnerCheckin?.completed)}
        />
        <StatusTile
          title="Pair focus"
          subtitle="Total planned focus today"
          strong={`${Math.floor(pairFocusMinutes / 60)}h ${pairFocusMinutes % 60}m`}
          good={pairFocusMinutes >= 120}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" disabled={actionPending === "lock"} onClick={onSave} style={{
          flex: 1,
          border: "1px solid rgba(184,97,23,0.26)",
          background: "rgba(184,97,23,0.08)",
          color: "var(--accent)",
          borderRadius: 14,
          padding: "11px 12px",
          fontWeight: 900,
          cursor: "pointer",
          opacity: actionPending === "lock" ? 0.7 : 1,
        }}>
          {actionPending === "lock" ? "Locking..." : "Lock target"}
        </button>
        <button type="button" disabled={actionPending === "done"} onClick={onDone} style={{
          flex: 1,
          border: "none",
          background: "linear-gradient(135deg, #15803d, #16a34a)",
          color: "#fff",
          borderRadius: 14,
          padding: "11px 12px",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 10px 24px rgba(22,163,74,0.22)",
          opacity: actionPending === "done" ? 0.7 : 1,
        }}>
          {actionPending === "done" ? "Marking..." : "Mark done"}
        </button>
      </div>
    </section>
  );
}

function StatusTile({ title, subtitle, strong, good }: {
  title: string;
  subtitle: string;
  strong: string;
  good: boolean;
}) {
  return (
    <div style={{
      borderRadius: 16,
      padding: 11,
      background: good ? "rgba(22,163,74,0.08)" : "rgba(255,255,255,0.72)",
      border: good ? "1px solid rgba(22,163,74,0.18)" : "1px solid rgba(120,80,30,0.10)",
    }}>
      <p style={{ color: "var(--muted)", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</p>
      <p style={{ color: good ? "#15803d" : "var(--ink-strong)", fontWeight: 900, marginTop: 4 }}>{strong}</p>
      <p style={{ color: "var(--ink-soft)", fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>{subtitle}</p>
    </div>
  );
}

function SelectField({ label, value, values, onChange }: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span style={{ fontSize: 11, fontWeight: 900, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        style={{
          width: "100%", marginTop: 7, border: "1px solid var(--line)", borderRadius: 13,
          padding: "11px 12px", background: "var(--panel)", color: "var(--ink-strong)", fontWeight: 700,
        }}
      >
        {values.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

function MultiField({ label, values, selected, onToggle }: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 900, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 7 }}>{label}</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {values.map(item => (
          <button key={item} onClick={() => onToggle(item)} type="button" style={chip(selected.includes(item))}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function RequestList({ title, empty, rows, userId, profileMap, onAccept, onReject, onCancel }: {
  title: string;
  empty: string;
  rows: PartnerConnection[];
  userId: string;
  profileMap: Map<string, PartnerProfile>;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  return (
    <section style={{ ...card, padding: 16 }}>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", marginBottom: 12 }}>{title}</h2>
      {rows.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>{empty}</p>}
      {rows.map(row => {
        const otherId = row.requester_id === userId ? row.receiver_id : row.requester_id;
        const profile = profileMap.get(otherId);
        return (
          <article key={row.id} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 13, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <b style={{ color: "var(--ink-strong)" }}>{profile?.display_name ?? "Aspirant"}</b>
                <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 3 }}>{profile?.exam_target} · {profile?.stage}</p>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 11 }}>{timeAgo(row.created_at)}</p>
            </div>
            <p style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.55, marginTop: 9 }}>{row.opener}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
              {onAccept && <button onClick={() => onAccept(row.id)} style={{ ...chip(true), borderRadius: 12 }}>Accept</button>}
              {onReject && <button onClick={() => onReject(row.id)} style={{ ...chip(false), borderRadius: 12 }}>Reject</button>}
              {onCancel && <button onClick={() => onCancel(row.id)} style={{ ...chip(false), borderRadius: 12 }}>Cancel</button>}
            </div>
          </article>
        );
      })}
    </section>
  );
}
