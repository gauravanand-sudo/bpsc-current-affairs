import Link from "next/link";
import Image from "next/image";

const PRELIMS_SECTIONS = [
  {
    title: "Prelims",
    description:
      "All BPSC Prelims previous year question papers in one place. Add your PDF links here later.",
    badge: "Objective",
    placeholder: "Add Prelims PYQ PDF link",
  },
];

const MAINS_SECTIONS = [
  {
    title: "GS 1",
    description:
      "History, culture, geography and society related mains papers placeholder.",
    badge: "Mains",
    placeholder: "Add GS 1 PYQ PDF link",
  },
  {
    title: "GS 2",
    description:
      "Governance, polity, economy, science, Bihar and current affairs related mains papers placeholder.",
    badge: "Mains",
    placeholder: "Add GS 2 PYQ PDF link",
  },
  {
    title: "Essay",
    description:
      "Essay previous year papers placeholder for structured practice and topic trend tracking.",
    badge: "Mains",
    placeholder: "Add Essay PYQ PDF link",
  },
  {
    title: "Optional History",
    description:
      "History optional previous year papers placeholder for focused optional preparation.",
    badge: "Optional",
    placeholder: "Add History Optional PYQ PDF link",
  },
];

function PlaceholderCard({
  title,
  description,
  badge,
  placeholder,
}: {
  title: string;
  description: string;
  badge: string;
  placeholder: string;
}) {
  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: "22px 20px",
        boxShadow: "0 10px 30px rgba(120,80,30,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--ink-strong)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>
        <span
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid var(--accent-border)",
            borderRadius: 999,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      </div>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: "var(--ink-soft)",
          marginBottom: 18,
        }}
      >
        {description}
      </p>

      <div
        style={{
          border: "1px dashed var(--accent-border)",
          background: "rgba(192,96,16,0.05)",
          borderRadius: 16,
          padding: "16px 14px",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 8,
          }}
        >
          Placeholder
        </p>
        <p style={{ fontSize: 15, color: "var(--ink-strong)", fontWeight: 600 }}>
          {placeholder}
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-block",
            borderRadius: 10,
            padding: "10px 14px",
            background: "linear-gradient(135deg, #c06010, #d97706)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
          }}
        >
          PDF Link Coming Soon
        </span>
        <span
          style={{
            display: "inline-block",
            borderRadius: 10,
            padding: "10px 14px",
            background: "rgba(255,253,248,0.88)",
            border: "1px solid var(--line-hi)",
            color: "var(--ink-soft)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Year-wise / Paper-wise
        </span>
      </div>
    </article>
  );
}

export default function PyqPage() {
  return (
    <main style={{ color: "var(--ink)", background: "var(--bg)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 20px 0", textAlign: "center" }}>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 4px" }} priority />
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Only what scores. Zero fluff, zero filler.
        </p>
      </div>
      <section
        style={{
          padding: "32px 20px 48px",
          borderBottom: "1px solid var(--line)",
          background:
            "linear-gradient(180deg, rgba(192,96,16,0.08) 0%, rgba(244,239,232,0.3) 100%)",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(192,96,16,0.1)",
              border: "1px solid var(--accent-border)",
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Previous Year Questions
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.1rem, 6vw, 3.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ink-strong)",
              maxWidth: 760,
              marginBottom: 18,
            }}
          >
            BPSC PYQ Hub —
            <br />
            <span style={{ color: "var(--accent)" }}>Prelims + Mains, one clean place.</span>
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.85,
              color: "var(--ink-soft)",
              maxWidth: 700,
              marginBottom: 28,
            }}
          >
            Yahan par aap Prelims aur Mains ke previous year papers ke PDF links add kar sakte ho.
            Abhi ke liye maine placeholders bana diye hain for Prelims, GS 1, GS 2, Essay and Optional History.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                background: "linear-gradient(135deg, #c06010, #d97706)",
                color: "#fff",
                borderRadius: 12,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Home →
            </Link>
            <Link
              href="/ca"
              style={{
                border: "1.5px solid var(--line-hi)",
                background: "rgba(255,253,248,0.88)",
                color: "var(--ink-soft)",
                borderRadius: 12,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Study Sets →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "34px 20px 20px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              Prelims
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                color: "var(--ink-strong)",
                letterSpacing: "-0.02em",
              }}
            >
              Objective paper placeholders
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 42,
            }}
          >
            {PRELIMS_SECTIONS.map((item) => (
              <PlaceholderCard key={item.title} {...item} />
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              Mains
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                color: "var(--ink-strong)",
                letterSpacing: "-0.02em",
              }}
            >
              GS, Essay and Optional placeholders
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {MAINS_SECTIONS.map((item) => (
              <PlaceholderCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
