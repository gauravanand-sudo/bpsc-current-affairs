import Link from "next/link";
import Image from "next/image";

const PYQ_SETS = [
  { key: "72nd", label: "72nd BPSC",  year: "2025", sets: 3 },
  { key: "70th", label: "70th BPSC",  year: "2024", sets: 3 },
  { key: "69th", label: "69th BPSC",  year: "2023", sets: 3 },
  { key: "68th", label: "68th BPSC",  year: "2022", sets: 3 },
  { key: "67th", label: "67th BPSC",  year: "2021", sets: 3 },
  { key: "66th", label: "66th BPSC",  year: "2020", sets: 3 },
  { key: "65th", label: "65th BPSC",  year: "2019", sets: 3 },
  { key: "64th", label: "64th BPSC",  year: "2018", sets: 2 },
];

export default function PYQQuizPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 0", textAlign: "center", position: "relative" }}>
        <Link href="/quizzes" style={{ position: "absolute", right: 16, top: 20, fontSize: 12.5, fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>← Back</Link>
        <Image src="/logo3.png" alt="OneShot GS" width={180} height={68} style={{ objectFit: "contain", mixBlendMode: "darken", margin: "0 auto 6px" }} priority />
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.025em", color: "var(--ink-strong)", marginBottom: 4 }}>PYQ Quiz</h1>
        <p style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.01em" }}>Only what scores. Zero fluff, zero filler.</p>
      </div>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "14px 16px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PYQ_SETS.map((exam) => (
            <div key={exam.key}>
              {/* Exam header */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17, fontWeight: 800,
                  color: "var(--ink-strong)", letterSpacing: "-0.025em",
                }}>{exam.label}</p>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{exam.year}</span>
              </div>

              {/* Set cards */}
              <div className="sets-row">
                {Array.from({ length: exam.sets }, (_, i) => i + 1).map((set) => (
                  <div key={set} className="set-card">
                    <p style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15, fontWeight: 800,
                      color: "var(--ink-strong)", marginBottom: 4,
                    }}>Set {set}</p>
                    <p style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 12 }}>
                      {exam.label} · Paper {set}
                    </p>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700,
                      color: "var(--muted)", opacity: 0.6,
                      letterSpacing: "0.04em",
                    }}>Coming soon</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .sets-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
        }
        .set-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 16px 16px 14px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        @media (hover: hover) {
          .set-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(120,80,30,0.09); }
        }
      `}</style>
    </main>
  );
}
