import { auth, signIn } from "@/auth";
import Link from "next/link";
import ProgressChart from "@/components/ProgressChart";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            border: "1px solid var(--line)",
            borderRadius: 28,
            background: "var(--card)",
            padding: "44px 32px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 36, marginBottom: 16 }}>📚</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink-strong)",
              marginBottom: 10,
            }}
          >
            Sign in to track progress
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 28 }}>
            Save your progress across devices. See which topics you&apos;ve mastered.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/profile" });
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" opacity=".9"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".9"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" opacity=".9"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".9"/>
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 0 80px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <Link
          href="/ca"
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 32,
          }}
        >
          ← Browse Sets
        </Link>

        {/* User card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            padding: "20px 20px",
            marginBottom: 28,
          }}
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "User"}
              width={52}
              height={52}
              style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "var(--accent)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}
            >
              {(user.name ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--ink-strong)",
                marginBottom: 2,
              }}
            >
              {user.name}
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
          <span
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            BPSC 365
          </span>
        </div>

        {/* Progress */}
        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 20,
            background: "var(--card)",
            padding: "22px 20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 18,
            }}
          >
            Your Progress
          </p>
          <ProgressChart />
        </div>

        {/* Study tip */}
        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 16,
            background: "var(--panel)",
            padding: "16px 18px",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 4, fontFamily: "monospace", letterSpacing: "0.1em" }}>
            CONSISTENCY TIP
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>
            Complete 1 set every 3 days. A month of 10 sets = 300 current affairs + 1000+ static facts before your exam.
          </p>
        </div>

      </div>
    </main>
  );
}
