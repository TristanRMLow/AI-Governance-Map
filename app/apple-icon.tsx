import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#12151b",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="#4fd6cc" strokeWidth="1.3" />
          <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#4fd6cc" strokeWidth="1" />
          <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#4fd6cc" strokeWidth="1" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
