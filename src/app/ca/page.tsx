import Link from "next/link";
import { CA_THEMES } from "@/lib/ca-structure";

export default function CALandingPage() {
  return (
    <main className="ca-hub">
      <section className="ca-hero">
        <div className="ca-shell">
          <span className="ca-kicker">CURRENT AFFAIRS</span>
          <h1>Study current affairs by theme</h1>
          <p>UPSC and BPSC current-affairs coverage organised with static linkages for revision, practice and answer enrichment.</p>
        </div>
      </section>

      <section className="ca-shell">
        <div className="ca-grid">
          {CA_THEMES.map((theme) => (
            <Link key={theme.slug} href={`/ca/theme/${theme.slug}`} className="ca-card">
              <div className="ca-card-head">
                <span aria-hidden="true">{theme.emoji}</span>
                <h3>{theme.title}</h3>
              </div>
              <p>{theme.shortTitle} + static linkages</p>
              <span className="ca-open">OPEN MONTHS →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
