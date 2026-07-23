import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.5" stroke="#4fd6cc" strokeWidth="1.8" />
          <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#4fd6cc" strokeWidth="1.5" />
          <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#4fd6cc" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
