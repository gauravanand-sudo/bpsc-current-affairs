import Link from "next/link";

const CA_SOURCES = [
  "PIB", "The Hindu", "Indian Express",
  "Hindustan Times", "Yojana", "Kurukshetra",
  "Down To Earth", "PRS India", "MOSPI / RBI Reports",
];

const STATIC_SOURCES = [
  "M. Laxmikant", "Spectrum", "NCERT 6–12",
  "Majid Husain", "Ramesh Singh", "Nitin Singhania",
  "G.C. Leong", "Shankar IAS",
];

const MONTHS_GRID = [
  { label: "Apr 2025", active: false }, { label: "May 2025", active: false },
  { label: "Jun 2025", active: false }, { label: "Jul 2025", active: false },
  { label: "Aug 2025", active: false }, { label: "Sep 2025", active: false },
  { label: "Oct 2025", active: false }, { label: "Nov 2025", active: false },
  { label: "Dec 2025", active: false }, { label: "Jan 2026", active: false },
  { label: "Feb 2026", active: false }, { label: "Mar 2026", active: false },
  { label: "Apr 2026", active: true  },
];

export default function HomePage() {
  return (
    <main style={{ color: "var(--ink)" }}>

      {/* ════════════ HERO ════════════ */}
      <section className="bpsc-hero" style={{ padding: "64px 20px 72px", textAlign: "center" }}>

        {/* Trust pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(192,96,16,0.1)", border: "1px solid var(--accent-border)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            UPSC/BPSC Qualified Experts · 15+ Years BPSC Prelims Data
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(2.2rem, 7vw, 4.2rem)",
          lineHeight: 1.04, letterSpacing: "-0.03em",
          color: "var(--ink-strong)",
          maxWidth: 780, margin: "0 auto 18px",
        }}>
          BPSC Prelims Crack करो —<br />
          <span style={{ color: "var(--accent)" }}>Smart पढ़ो, Less Time में.</span>
        </h1>

        <p style={{
          fontSize: "clamp(15px, 2.4vw, 18px)", lineHeight: 1.75,
          color: "var(--ink-soft)", maxWidth: 600, margin: "0 auto 6px",
        }}>
          हर Current Affair में — Static Linkage + Bihar Angle + BPSC MCQ.<br />
          <strong style={{ color: "var(--ink-strong)" }}>एक card में वो सब, जो Prelims में आता है.</strong>
        </p>

        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 36, fontStyle: "italic" }}>
          "Trained on 15+ Years of BPSC Prelims Questions using Deep Learning"
        </p>

        {/* ── PRIMARY CTA ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 48 }}>

          <Link href="/ca" style={{
            background: "linear-gradient(135deg, #c06010, #d97706)",
            color: "#fff",
            borderRadius: 14, padding: "17px 48px",
            fontSize: 18, fontWeight: 700,
            fontFamily: "var(--font-display)", letterSpacing: "0.01em",
            boxShadow: "0 6px 32px rgba(192,96,16,0.45)",
            display: "inline-block",
            textDecoration: "none",
          }}>
            अभी Free में पढ़ना शुरू करें →
          </Link>

          {/* Micro-proof */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              "✓ No signup needed",
              "✓ Hindi & English",
              "✓ ₹0 — Always Free",
              "✓ Quiz after every Study Set",
            ].map(t => (
              <span key={t} style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}>
                <span style={{ color: "var(--accent)" }}>{t.slice(0, 1)}</span>{t.slice(1)}
              </span>
            ))}
          </div>

          {/* Secondary */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/quizzes" style={{
              border: "2px solid var(--accent)", background: "var(--card)",
              color: "var(--accent)", borderRadius: 10, padding: "10px 22px",
              fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)",
              display: "inline-block", textDecoration: "none",
            }}>
              Quiz Sets →
            </Link>
            <Link href="/profile" style={{
              border: "1.5px solid var(--line-hi)", background: "rgba(255,253,248,0.85)",
              color: "var(--ink-soft)", borderRadius: 10, padding: "10px 22px",
              fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)",
              display: "inline-block", textDecoration: "none",
            }}>
              Track Progress
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "inline-grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid var(--line-hi)",
          borderRadius: 18, overflow: "hidden",
          background: "rgba(255,253,248,0.92)",
          boxShadow: "0 4px 24px rgba(120,80,30,0.1)",
        }}>
          {[
            { n: "195+",   sub: "Study Sets" },
            { n: "5,400+", sub: "Cards"      },
            { n: "195+",   sub: "Quiz Sets"  },
            { n: "₹0",     sub: "Always Free"},
          ].map(({ n, sub }, i) => (
            <div key={sub} style={{
              padding: "16px 20px", textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--line)" : "none",
            }}>
              <p className="stat-shimmer" style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                lineHeight: 1, marginBottom: 4,
              }}>{n}</p>
              <p style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ EMOTIONAL HOOK ════════════ */}
      <section style={{
        borderTop: "1px solid var(--line)",
        background: "var(--navy)",
        padding: "56px 20px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontFamily: "monospace", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
            Bihar का सपना
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(1.5rem, 4vw, 2.4rem)", lineHeight: 1.25,
            color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 20,
          }}>
            Bihar में 66 lakh+ aspirants —<br />
            <span style={{ color: "#fbbf24" }}>सिर्फ 1,000+ seats.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 28, maxWidth: 560, margin: "0 auto 28px" }}>
            यह race सिर्फ talent की नहीं, <strong style={{ color: "#f1f5f9" }}>consistency और smart preparation की है.</strong><br />
            जो रोज़ पढ़ता है — वो qualify करता है. जो skip करता है — वो regret करता है.
          </p>
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "18px 24px", marginBottom: 28, maxWidth: 560, margin: "0 auto 28px",
          }}>
            <p style={{ fontSize: 15, color: "#fbbf24", fontStyle: "italic", lineHeight: 1.75, fontFamily: "var(--font-display)", fontWeight: 600 }}>
              "तुम्हारी मेहनत कभी बेकार नहीं जाती —<br />
              बस direction सही होना चाहिए."
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/ca" style={{
              background: "linear-gradient(135deg, #c06010, #d97706)",
              color: "#fff", borderRadius: 10, padding: "12px 28px",
              fontSize: 14, fontWeight: 700,
              fontFamily: "var(--font-display)", textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 4px 20px rgba(192,96,16,0.4)",
            }}>
              Study Sets शुरू करो →
            </Link>
            <Link href="/quizzes" style={{
              border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)",
              color: "#e2e8f0", borderRadius: 10, padding: "12px 24px",
              fontSize: 14, fontWeight: 600,
              fontFamily: "var(--font-display)", textDecoration: "none",
              display: "inline-block",
            }}>
              Quiz Sets Try करो →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ SOURCES + TRAINING ════════════ */}
      <section style={{
        borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        background: "var(--panel)", padding: "52px 20px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Training badge */}
          <div style={{
            background: "linear-gradient(135deg, rgba(192,96,16,0.09), rgba(26,39,68,0.09))",
            border: "1px solid var(--accent-border)",
            borderRadius: 18, padding: "18px 20px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🏛️</span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--ink-strong)", marginBottom: 4 }}>
                Trained on 15+ Years of BPSC Prelims — Deep Learning Models
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
                Every MCQ direction, every static linkage, every Bihar angle shaped by what Bihar Prelims actually asks. Curated by UPSC/BPSC qualified professionals.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["UPSC Qualified", "BPSC Qualified", "Bihar-Focused", "Always Free"].map(b => (
                <span key={b} style={{
                  background: "var(--card)", border: "1px solid var(--line-hi)",
                  borderRadius: 20, padding: "4px 11px",
                  fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                }}>✓ {b}</span>
              ))}
            </div>
          </div>

          {/* Two-column sources */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 16, marginBottom: 16,
          }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📰</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>Current Affairs</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>Curated from 9 trusted sources</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {CA_SOURCES.map(s => (
                  <span key={s} style={{
                    background: "var(--surface)", border: "1px solid var(--line-hi)",
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                  }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "20px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📚</span>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-strong)" }}>Exhaustive Static Linked</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>Every card mapped to your books</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {STATIC_SOURCES.map(s => (
                  <span key={s} style={{
                    background: "var(--surface)", border: "1px solid var(--line-hi)",
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ THE PLAN ════════════ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 20px" }}>
        <p style={{
          fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 8, textAlign: "center",
        }}>
          The Complete BPSC Prelims Plan
        </p>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "var(--ink-strong)", textAlign: "center",
          letterSpacing: "-0.02em", marginBottom: 8,
        }}>
          13 × 15 Study Sets + 13 × 15 Quiz Sets<br />
          <span style={{ color: "var(--accent)" }}>= और तुम BPSC Prelims के लिए Ready.</span>
        </h2>
        <p style={{ textAlign: "center", fontSize: 15, color: "var(--ink-soft)", marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
          Apr 2025 → Apr 2026 complete coverage. Study a set, then immediately test yourself on it.
          <strong style={{ color: "var(--ink-strong)" }}> That's the loop that qualifies.</strong>
        </p>

        {/* Study Set + Quiz Set visual */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32, maxWidth: 600, margin: "0 auto 32px" }}>
          <div style={{
            background: "var(--card)", border: "1px solid var(--accent-border)",
            borderRadius: 18, padding: "22px 18px", textAlign: "center",
          }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📖</span>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-strong)", marginBottom: 4 }}>Study Set</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: 4 }}>195+</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>13 months × 15 sets</p>
            <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>
              News + Static + Bihar angle + MCQ per card
            </p>
          </div>
          <div style={{
            background: "var(--card)", border: "1px solid rgba(22,163,74,0.3)",
            borderRadius: 18, padding: "22px 18px", textAlign: "center",
          }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>🎯</span>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink-strong)", marginBottom: 4 }}>Quiz Set</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#16a34a", fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: 4 }}>195+</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>13 months × 15 quizzes</p>
            <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>
              30 min · −⅓ marking · Score /150
            </p>
          </div>
        </div>

        {/* Months grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
          gap: 8, marginBottom: 36,
        }}>
          {MONTHS_GRID.map(({ label, active }) => (
            <div key={label} style={{
              border: `1px solid ${active ? "var(--accent-border)" : "var(--line)"}`,
              borderRadius: 12, padding: "11px 8px",
              background: active ? "rgba(192,96,16,0.07)" : "var(--card)",
              textAlign: "center",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: active ? "var(--accent)" : "var(--ink-soft)", marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 10, color: active ? "var(--accent)" : "var(--muted)" }}>
                {active ? "Live ✓" : "15 sets"}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/ca" style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            color: "#fff", borderRadius: 12, padding: "13px 30px",
            fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
            textDecoration: "none", display: "inline-block",
            boxShadow: "0 4px 20px rgba(192,96,16,0.25)",
          }}>
            Browse Study Sets →
          </Link>
          <Link href="/quizzes" style={{
            border: "2px solid var(--accent)", background: "var(--card)",
            color: "var(--accent)", borderRadius: 12, padding: "13px 28px",
            fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
            textDecoration: "none", display: "inline-block",
          }}>
            Browse Quiz Sets →
          </Link>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{
        borderTop: "1px solid var(--line)", background: "var(--card)",
        padding: "32px 20px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 18, color: "var(--accent)", fontStyle: "italic", marginBottom: 12,
        }}>
          "पढ़ो, Practice करो, Qualify करो."
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          {["UPSC Qualified", "BPSC Qualified", "15+ Years Data", "Bihar-Focused", "Always Free"].map(b => (
            <span key={b} style={{
              background: "var(--surface)", border: "1px solid var(--line-hi)",
              borderRadius: 20, padding: "4px 11px",
              fontSize: 11, fontWeight: 600, color: "var(--ink-soft)",
            }}>✓ {b}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Made with <span style={{ color: "#e11d48" }}>❤️</span> for Bihar aspirants
        </p>
      </footer>

    </main>
  );
}
