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
        background: "radial-gradient(ellipse, rgba(36,89,161,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Image
        src="/logo4.png"
        alt="OneShot GS"
        width={width}
        height={height}
        style={{ objectFit: "contain", display: "block", position: "relative", filter: "brightness(1.06) saturate(1.05)" }}
        priority
      />
    </div>
  );
}
