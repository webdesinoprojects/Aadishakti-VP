import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export default function Hero({ setActiveSection }) {
  const [capacity, setCapacity] = useState(0);
  const [years, setYears] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // easeOutExpo counting animation
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo multiplier
      const easeMultiplier = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCapacity(Math.floor(easeMultiplier * 70));
      setYears(Math.floor(easeMultiplier * 29));
      setRevenue(Math.floor(easeMultiplier * 1200));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Generate 20 lead pellets drifting upward
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: `${3 + Math.random() * 4}px`,
  }));

  return (
    <section
      id="home"
      style={{
        height: "100vh",
        background: "var(--grad-hero)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Repeater diagonal industrial texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255, 59, 48, 0.02) 0px, rgba(255, 59, 48, 0.02) 1px, transparent 1px, transparent 15px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      ></div>

      {/* Floating Lead Pellet Particles */}
      <div style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="lead-pellet"
            style={{
              position: "absolute",
              bottom: "-20px",
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: "rgba(255,255,255,0.45)",
              borderRadius: "50%",
              animationName: "driftUp",
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
          ></div>
        ))}
      </div>

      <div className="container" style={{ position: "relative", zIndex: 3, paddingBottom: "3rem" }}>
        
        {/* Left Vertical Crimson Bar Block */}
        <div style={{ borderLeft: "4px solid var(--color-scarlet)", paddingLeft: "3.5rem", textAlign: "left" }}>
          
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-small)",
              letterSpacing: "0.3em",
              color: "var(--color-scarlet)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            // AN INDUSTRIAL METALLURGICAL CONGLOMERATE
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-hero)",
              lineHeight: "0.95",
              letterSpacing: "0.08em",
              color: "var(--color-white)",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              background: "var(--grad-text)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AADISHAKTI GROUP
          </h1>

          <h2
            style={{
              fontFamily: "var(--font-subheading)",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "0.3em",
              color: "var(--color-platinum)",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}
          >
            INDIA'S SOVEREIGN OF SECONDARY LEAD
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-body)",
              color: "var(--color-silver)",
              maxWidth: "600px",
              lineHeight: "1.7",
              marginBottom: "3rem",
            }}
          >
            Forging geological weight and environmental responsibility with unmatched scientific precision. We process 70,000+ metric tonnes of high-purity refined lead, custom alloys, and chemical oxides annually.
          </p>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button
              onClick={() => handleNavClick("contact")}
              className="btn-spark"
              style={{ padding: "1rem 2.5rem", fontSize: "14px" }}
            >
              ENQUIRE NOW
            </button>
            <button
              onClick={() => handleNavClick("products")}
              style={{
                background: "transparent",
                border: "1px solid var(--color-steel)",
                color: "var(--color-white)",
                fontFamily: "var(--font-subheading)",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "1rem 2.2rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "border-color 0.25s",
              }}
              onMouseEnter={(e) => e.target.style.borderColor = "var(--color-scarlet)"}
              onMouseLeave={(e) => e.target.style.borderColor = "var(--color-steel)"}
            >
              EXPLORE CATALOG <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Hero Proportions bottom of page */}
        <div
          style={{
            marginTop: "6rem",
            display: "flex",
            gap: "4rem",
            alignItems: "center",
            borderTop: "1px solid var(--color-steel)",
            paddingTop: "2.5rem",
          }}
        >
          {/* Stat 1 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", color: "var(--color-white)", letterSpacing: "0.05em", lineHeight: "1" }}>
              {capacity}K+ MTPA
            </div>
            <div style={{ fontFamily: "var(--font-subheading)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-scarlet)", textTransform: "uppercase", marginTop: "0.25rem" }}>
              SMELTING CAPACITY
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "var(--color-steel)" }}></div>

          {/* Stat 2 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", color: "var(--color-white)", letterSpacing: "0.05em", lineHeight: "1" }}>
              {years} YEARS
            </div>
            <div style={{ fontFamily: "var(--font-subheading)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-scarlet)", textTransform: "uppercase", marginTop: "0.25rem" }}>
              SUSTAINABLE LEGACY
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "var(--color-steel)" }}></div>

          {/* Stat 3 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", color: "var(--color-white)", letterSpacing: "0.05em", lineHeight: "1" }}>
              3 DIVISIONS
            </div>
            <div style={{ fontFamily: "var(--font-subheading)", fontSize: "12px", letterSpacing: "0.2em", color: "var(--color-scarlet)", textTransform: "uppercase", marginTop: "0.25rem" }}>
              OPERATIVE PLANTS
            </div>
          </div>
        </div>

      </div>

      {/* Floating pellet animation keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes driftUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-105vh) scale(0.8);
            opacity: 0;
          }
        }
      `}} />

    </section>
  );
}
