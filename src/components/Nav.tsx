import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(244,239,232,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
        padding: "0 20px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      {/* Wordmark */}
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 16, color: "var(--ink-strong)", letterSpacing: "-0.02em",
        }}>
          BPSC <span style={{ color: "var(--accent)" }}>365</span>
        </span>
      </Link>

      {/* Centre nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[
          { href: "/",        label: "Home"       },
          { href: "/ca",      label: "Study Sets" },
          { href: "/quizzes", label: "Quiz Sets"  },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: 13, fontWeight: 600,
              color: "var(--ink-soft)",
              textDecoration: "none",
              padding: "5px 11px",
              borderRadius: 8,
              letterSpacing: "0.01em",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {user ? (
          <>
            <Link href="/profile" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image} alt={user.name ?? "Profile"}
                  width={30} height={30}
                  style={{ borderRadius: "50%", border: "2px solid var(--accent)", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                }}>
                  {(user.name ?? "U")[0].toUpperCase()}
                </div>
              )}
            </Link>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" style={{
                fontSize: 11, color: "var(--muted)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.06em",
              }}>
                sign out
              </button>
            </form>
          </>
        ) : (
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/profile" }); }}>
            <button type="submit" style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: 8, padding: "6px 14px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-display)", letterSpacing: "0.02em",
            }}>
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
