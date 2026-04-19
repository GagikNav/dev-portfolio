import { ImageResponse } from "next/og";

export const alt = "Gagik — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0D0C0B",
        position: "relative",
      }}
    >
      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: "#E8974A",
        }}
      />
      {/* Name */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#F5F2ED",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        Gagik
      </div>
      {/* Title */}
      <div
        style={{
          fontSize: 32,
          color: "#E8974A",
          marginBottom: 40,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Full-Stack Developer
      </div>
      {/* Description */}
      <div
        style={{
          fontSize: 22,
          color: "#A8A49E",
          maxWidth: 700,
          lineHeight: 1.5,
        }}
      >
        Building fast, accessible, and well-crafted web products with React,
        Next.js &amp; TypeScript.
      </div>
      {/* Domain */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          fontSize: 18,
          color: "#68635E",
          letterSpacing: "0.02em",
        }}
      >
        gagiknav.dev
      </div>
    </div>,
    { ...size },
  );
}
