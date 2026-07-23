import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#12151b",
          padding: 64,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="#4fd6cc" strokeWidth="1" />
          <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#4fd6cc" strokeWidth="0.8" />
          <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#4fd6cc" strokeWidth="0.8" />
        </svg>
        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 700,
            color: "#eef0f3",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          AI Governance World Map
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: "#9aa3b0",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Policy, regulation, and governance across 43 jurisdictions
        </div>
      </div>
    ),
    { ...size }
  );
}
