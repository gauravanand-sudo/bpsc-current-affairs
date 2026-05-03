import Image from "next/image";

export default function GlowLogo({
  width = 180,
  height = 68,
  style,
}: {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <div style={{
        position: "absolute", inset: "-8px -24px",
        background: "radial-gradient(ellipse, rgba(192,96,16,0.28) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Image
        src="/logo3.png"
        alt="OneShot GS"
        width={width}
        height={height}
        style={{ objectFit: "contain", display: "block", mixBlendMode: "darken", position: "relative" }}
        priority
      />
    </div>
  );
}
