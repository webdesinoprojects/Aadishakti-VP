import React from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../assets/assetMap";

export default function PageHero({ title, activePage }) {
  const heroBgByPage = {
    "ABOUT US": ASSETS.founders.anilGoel,
    BUSINESSES: ASSETS.mundraPlant[0],
    PRODUCTS: ASSETS.products.leadAlloys,
    SUSTAINABILITY: ASSETS.sustainabilityBg,
    INVESTORS: ASSETS.mundraPlant[2],
    CAREERS: ASSETS.roorkeeOffice[0],
    CONTACT: ASSETS.roorkeeOffice[1],
    SOURCING: ASSETS.mundraPlant[8],
  };

  const heroImage = heroBgByPage[activePage] || ASSETS.heroFallback;

  return (
    <div
      className="page-hero"
      style={{
        padding: "160px 0 80px 0",
        background: "#101010",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${heroImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.58,
          filter: "saturate(1.04) contrast(1.04)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(104deg, rgba(8,8,8,0.76) 0%, rgba(8,8,8,0.58) 42%, rgba(8,8,8,0.30) 100%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(204, 34, 0, 0.03) 0px, rgba(204, 34, 0, 0.03) 1px, transparent 1px, transparent 20px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          right: "clamp(-120px, -6vw, -40px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "56px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 3, textAlign: "left" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-small)",
            color: "#C9C9C6",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "1.5rem",
          }}
        >
          <Link to="/" style={{ color: "#DDDDD8" }}>HOME</Link>
          <span style={{ margin: "0 0.75rem", color: "var(--red-core)" }}>/</span>
          <span style={{ color: "#FFFFFF" }}>{activePage}</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "var(--fs-hero)",
            fontWeight: "900",
            letterSpacing: "0.05em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            lineHeight: "1.1",
            textShadow: "0 8px 30px rgba(0,0,0,0.30)",
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
