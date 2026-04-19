import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#B86B1A",
        borderRadius: 7,
        color: "#FAFAF7",
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: "-0.05em",
      }}
    >
      G
    </div>,
    { ...size },
  );
}
