export default function Loading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "linear-gradient(180deg, #fcf8f2 0%, #f7f2eb 100%)",
      }}
    >
      <div style={{ textAlign: "center", width: "min(100%, 320px)" }}>
        {/* Spinner */}
        <div
          aria-hidden="true"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "3px solid rgba(192,96,16,0.15)",
            borderTopColor: "#c06010",
            margin: "0 auto 20px",
            animation: "bpsc-spin 0.9s linear infinite",
          }}
        />

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8a7260",
            marginBottom: 10,
          }}
        >
          72nd BPSC
        </p>

        <p
          style={{
            fontSize: "clamp(1.1rem,4vw,1.35rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "#150e06",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Loading your set...
        </p>

        <p style={{ fontSize: 13, color: "#8a7260", lineHeight: 1.6 }}>
          Preparing your next revision screen
        </p>
      </div>

      {/* Inline keyframe — works even before globals.css loads */}
      <style>{`
        @keyframes bpsc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
