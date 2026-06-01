import React, { useState, useEffect } from "react";

const BAR_TEXT =
  "ISO 9001:2015 Certified  ·  BIS Approved Pure Lead  ·  50,000 MT Annual Capacity  ·  " +
  "Plants: Mundra (Gujarat) & Roorkee (Uttarakhand)  ·  LME Grade Lead — 99.97% Pb Minimum  ·  " +
  "Enquiries: +91-8743000299  ·  marketing@aadishakti.com  ·  ";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    try { return localStorage.getItem("announceDismissed") !== "true"; } catch { return true; }
  });

  useEffect(() => {
    if (visible) {
      document.body.classList.add("bar-visible");
    } else {
      document.body.classList.remove("bar-visible");
    }
    return () => document.body.classList.remove("bar-visible");
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "36px",
        background: "var(--red-core)",
        zIndex: 1002,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Marquee track */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "inline-flex",
            animation: "marquee-left 38s linear infinite",
            width: "max-content",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-primary)",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.09em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              paddingRight: "80px",
            }}
          >
            {BAR_TEXT}
          </span>
          <span
            style={{
              fontFamily: "var(--font-primary)",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.09em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              paddingRight: "80px",
            }}
          >
            {BAR_TEXT}
          </span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => {
          try { localStorage.setItem("announceDismissed", "true"); } catch {}
          setVisible(false);
        }}
        aria-label="Dismiss announcement bar"
        style={{
          background: "rgba(0,0,0,0.18)",
          border: "none",
          color: "#FFFFFF",
          width: "36px",
          height: "36px",
          fontSize: "18px",
          lineHeight: 1,
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.18)")}
      >
        ×
      </button>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
