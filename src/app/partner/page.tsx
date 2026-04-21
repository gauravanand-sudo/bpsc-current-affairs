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

export default function PartnerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"discover" | "requests" | "chat" | "profile">("discover");
  const [profiles, setProfiles] = useState<PartnerProfile[]>([]);
  const [myProfile, setMyProfile] = useState<PartnerProfile | null>(null);
  const [connections, setConnections] = useState<PartnerConnection[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PartnerMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const candidates = useMemo(() => {
    const blocked = new Set(connections.flatMap(c => [c.requester_id, c.receiver_id]));
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
    if (!session) return;
    void loadAll();

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("study-partner-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_profiles" }, () => void loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "study_partner_connections" }, () => void loadAll())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "study_partner_messages" }, payload => {
        const next = payload.new as PartnerMessage;
        if (next.connection_id === activeConnectionId) {
          setMessages(prev => [...prev, next]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 40);
        }
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id, activeConnectionId]);

  useEffect(() => {
    if (activeConnection?.id) void loadMessages(activeConnection.id);
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
    const supabase = getSupabaseBrowserClient();
    const partner = profileMap.get(receiverId);
    const { error } = await (supabase as any).from("study_partner_connections").insert({
      requester_id: session.user.id,
      receiver_id: receiverId,
      opener: `Hi ${partner?.display_name ?? "there"}, let's do a 7-day BPSC accountability sprint.`,
    });
    if (error) {
      setNotice(error.message.includes("duplicate") ? "You already have a request with this student." : error.message);
      return;
    }
    setNotice("Request sent. Chat opens after they accept.");
    await loadAll();
    setTab("requests");
  }

  async function updateConnection(id: string, status: "accepted" | "rejected" | "cancelled") {
    const supabase = getSupabaseBrowserClient();
    await (supabase as any)
      .from("study_partner_connections")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", id);
    await loadAll();
    if (status === "accepted") {
      setActiveConnectionId(id);
      setTab("chat");
    }
  }

  async function sendMessage() {
    if (!session || !activeConnection || !messageText.trim()) return;
    const body = messageText.trim().slice(0, 600);
    setMessageText("");
    const supabase = getSupabaseBrowserClient();
    await (supabase as any).from("study_partner_messages").insert({
      connection_id: activeConnection.id,
      sender_id: session.user.id,
      body,
    });
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
          <div style={{ ...card, marginTop: 14, padding: "12px 14px", color: "var(--accent)", fontWeight: 800, fontSize: 13 }}>
            {notice}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "16px 0 12px" }}>
          {[
            ["discover", `Discover ${candidates.length}`],
            ["requests", `Requests ${incoming.length + outgoing.length}`],
            ["chat", `1:1 Chat ${accepted.length}`],
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
                  <button onClick={() => sendRequest(profile.user_id)} style={{
                    flex: 1, border: "none", borderRadius: 13, padding: "12px 14px",
                    background: "var(--accent)", color: "#fff", fontWeight: 900, cursor: "pointer",
                    fontFamily: "var(--font-display)",
                  }}>
                    Send private request
                  </button>
                  <button onClick={() => reportUser(profile.user_id)} style={{ ...chip(false), borderRadius: 13 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: 14 }}>
            <div style={{ ...card, padding: 12, minHeight: 420 }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", margin: "6px 6px 12px" }}>Accepted partners</h2>
              {accepted.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, padding: 8 }}>No private chats yet. Accept or send a request first.</p>}
              {accepted.map(conn => {
                const other = profileMap.get(otherUser(conn));
                const active = activeConnection?.id === conn.id;
                return (
                  <button key={conn.id} onClick={() => setActiveConnectionId(conn.id)} style={{
                    width: "100%", textAlign: "left", border: active ? "1.5px solid var(--accent)" : "1px solid transparent",
                    background: active ? "var(--accent-soft)" : "transparent", borderRadius: 14,
                    padding: 11, cursor: "pointer", marginBottom: 6,
                  }}>
                    <b style={{ color: "var(--ink-strong)" }}>{other?.display_name ?? "Partner"}</b>
                    <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 3 }}>{other?.study_mode ?? "1:1 chat"}</p>
                  </button>
                );
              })}
            </div>

            <div style={{ ...card, minHeight: 520, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {activeConnection ? (
                <>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink-strong)", fontSize: 18 }}>
                      {profileMap.get(otherUser(activeConnection))?.display_name ?? "Study Partner"}
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: 12 }}>Private 1:1 accountability chat</p>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
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
          main [style*="grid-template-columns: minmax(220px, 320px) 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
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
