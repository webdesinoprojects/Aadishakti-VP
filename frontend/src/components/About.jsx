import React, { useState } from "react";
import { Check } from "lucide-react";

export default function About() {
  const [activePlant, setActivePlant] = useState("mundra");

  const milestones = [
    { year: "1994", title: "INCEPTION & ESTABLISHMENT", desc: "AadiShakti Group founded operation units to introduce deep scientific recycling of secondary heavy non-ferrous metals." },
    { year: "2014", title: "DOMESTIC ROORKEE ACQUISITION", desc: "Acquired domestic smelting division in Haridwar district, Uttarakhand (AMRPL) to service North India's industrial grid." },
    { year: "2023", title: "MUNDRA FLAGSHIP LAUNCH (AGRPL)", desc: "Inaugurated flagship smelting division at Mundra commercial port, rapidly capturing transboundary metallurgical procurement." },
    { year: "2026", title: "AUTOMATED SMELTING SMARTHUB", desc: "Smelting complex expansion scheduled for completion in April 2026, scaling total capacity to 120,000 MT and revenue to ₹1200+ Crore." }
  ];

  return (
    <section id="about" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// CORPORATE PROFILE</div>
        <h2 className="section-title-large">METALLURGICAL HEGEMONY</h2>

        {/* Asymmetric Split: 60/40 Profile Overview */}
        <div className="grid-2" style={{ marginBottom: "6rem", alignItems: "start" }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--color-platinum)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
              Aadishakti Group is India's sovereign industrial conglomerate focused on secondary lead recovery, smelting precision, and heavy alloy development. Over three decades of growth, we have engineered closed-loop manufacturing ecosystems.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: "var(--color-silver)", lineHeight: "1.8" }}>
              Through flagship subsidiaries Aadishakti Green Recycling Pvt. Ltd. (Mundra) and Aadishakti Metal Recycling Pvt. Ltd. (Roorkee), we transform toxic industrial hazard scrap into high-purity metallurgical elements, catering to backup batteries, extrusion lines, crystal glass, and defense ballasts worldwide.
            </p>
          </div>
          
          <div className="dominance-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--font-subheading)", fontSize: "14px", fontWeight: "700", letterSpacing: "0.2em", color: "var(--color-scarlet)", textTransform: "uppercase" }}>
              OPERATIONAL AUDIT
            </span>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "40px", color: "var(--color-white)", lineHeight: "1" }}>
              70,000 MTPA
            </div>
            <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.5" }}>
              Active smelter output expanding to <strong>120,000 MTPA</strong> via the upcoming Mundra plant expansion in April 2026.
            </p>
          </div>
        </div>

        {/* Founders Section (60/40 asymmetric split layout) */}
        <div className="section-meta-label">// BOARD OF DIRECTORS</div>
        <h2 className="section-title-large" style={{ marginBottom: "4rem" }}>CO-FOUNDERS & DIRECTORS</h2>
        
        <div className="grid-2" style={{ gap: "4rem", marginBottom: "6rem" }}>
          
          {/* Founder 1 */}
          <div className="founder-card" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", background: "var(--color-iron)", border: "1px solid var(--color-steel)", padding: "2rem" }}>
            <div style={{ height: "100%", background: "var(--color-forge)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/images/LDJY9705.JPG" alt="Mr. Amit Goyal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div className="founder-quote">"Operational efficiency is the bedrock of industrial sustainability."</div>
              <h4 style={{ fontFamily: "var(--font-accent)", fontSize: "28px", color: "var(--color-gold-mid)", fontStyle: "italic", fontWeight: "400" }}>Mr. Amit Goyal</h4>
              <div className="founder-role">Co-Founder & Director</div>
              <div className="founder-divider"></div>
              <p className="founder-bio">
                Brings over 2 decades of deep field expertise in lead smelting dynamics. His execution strategies have powered Aadishakti's entry into international transboundary logistics hubs.
              </p>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="founder-card" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", background: "var(--color-iron)", border: "1px solid var(--color-steel)", padding: "2rem" }}>
            <div style={{ height: "100%", background: "var(--color-forge)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/images/PMUD5812.JPG" alt="Mr. Anil Goel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div className="founder-quote">"True prestige is earned by absolute chemical and metallurgical accuracy."</div>
              <h4 style={{ fontFamily: "var(--font-accent)", fontSize: "28px", color: "var(--color-gold-mid)", fontStyle: "italic", fontWeight: "400" }}>Mr. Anil Goel</h4>
              <div className="founder-role">Co-Founder & Director</div>
              <div className="founder-divider"></div>
              <p className="founder-bio">
                Bears 20+ years of operational mastery in non-ferrous alloy smelting. Instrumental in establishing Aadishakti's massive capacity scales with strict compliance systems.
              </p>
            </div>
          </div>

        </div>

        {/* Operating Plants (dominance-card LEFT border, no glassmorphism) */}
        <div className="section-meta-label">// INDUSTRIAL DIVISIONS</div>
        <h2 className="section-title-large" style={{ marginBottom: "1rem" }}>MANUFACTURING CAPABILITIES</h2>
        <p style={{ color: "var(--color-silver)", maxWidth: "600px", marginBottom: "3rem" }}>
          Aadishakti runs two heavy production centers engineered for domestic dominance and export processing.
        </p>

        {/* Toggles */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
          <button
            onClick={() => setActivePlant("mundra")}
            className="btn-spark"
            style={{
              backgroundColor: activePlant === "mundra" ? "var(--color-scarlet)" : "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              transform: "none",
            }}
          >
            MUNDRA FLAGSHIP (AGRPL)
          </button>
          <button
            onClick={() => setActivePlant("roorkee")}
            className="btn-spark"
            style={{
              backgroundColor: activePlant === "roorkee" ? "var(--color-scarlet)" : "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              transform: "none",
            }}
          >
            ROORKEE DIVISION (AMRPL)
          </button>
        </div>

        {/* Plant Details */}
        <div className="dominance-card" style={{ padding: "3rem" }}>
          {activePlant === "mundra" ? (
            <div className="grid-2" style={{ gap: "4rem", alignItems: "center" }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "24px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Aadishakti Green Recycling Pvt. Ltd. (Mundra)
                </h4>
                <p style={{ color: "var(--color-silver)", fontSize: "15px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                  AGRPL is our highly automated flagship smelting division. Strategically located within Mundra Port's maritime economic corridor, Kutch, Gujarat, it serves as our transboundary logistics gateway.
                </p>
                
                <h5 style={{ fontFamily: "var(--font-subheading)", fontSize: "14px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-scarlet)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  KEY DIVISIONS:
                </h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "14px", color: "var(--color-platinum)" }}>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>Smelting Automated Hub:</strong> Full rotary smelting furnace chambers, high-volume draft filters, and automated ingot casting lines.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>Mundra Port Advantage:</strong> Rapid transboundary vessel intake, enabling cut-off logistics times and low freight overheads.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>April 2026 Expansion:</strong> World-class automated smelter launching to elevate group output capacity to 120,000 MT.</span>
                  </li>
                </ul>
              </div>
              <div style={{ height: "300px", border: "1px solid var(--color-steel)", background: "var(--color-void)", position: "relative" }}>
                <img src="/plant/Plant Pic 02.jpeg" alt="Mundra Smelter" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, background: "rgba(0,0,0,0.8)", borderTop: "1px solid var(--color-steel)", padding: "1rem", width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-scarlet)" }}>FLAGSHIP PORT-Hub</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: "4rem", alignItems: "center" }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "24px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Aadishakti Metal Recycling Pvt. Ltd. (Roorkee)
                </h4>
                <p style={{ color: "var(--color-silver)", fontSize: "15px", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                  AMRPL (acquired 2014, restructured 2023) is situated in Haridwar industrial district, Uttarakhand. It acts as our domestic distribution core, serving primary manufacturing nodes in North India.
                </p>

                <h5 style={{ fontFamily: "var(--font-subheading)", fontSize: "14px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-scarlet)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  KEY DIVISIONS:
                </h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "14px", color: "var(--color-platinum)" }}>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>Licensed Recycler:</strong> Fully registered recycler of hazardous lead acid battery scrap with maximum compliance audit ratings.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>Spectrometry Lab:</strong> Optical Emission Spectrometers (OES) ensure refined output ingots meet exact battery grades.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem" }}>
                    <Check size={16} style={{ color: "var(--color-scarlet)", flexShrink: 0, marginTop: "0.25rem" }} />
                    <span><strong>Domestic Pipeline:</strong> Direct supply chain logistics connecting refined ingots to major domestic battery grids.</span>
                  </li>
                </ul>
              </div>
              <div style={{ height: "300px", border: "1px solid var(--color-steel)", background: "var(--color-void)", position: "relative" }}>
                <img src="/office/WhatsApp Image 2026-03-11 at 16.03.43.jpeg" alt="Roorkee Plant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, background: "rgba(0,0,0,0.8)", borderTop: "1px solid var(--color-steel)", padding: "1rem", width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-scarlet)" }}>DOMESTIC DIVISION</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legacy Timeline */}
        <div style={{ marginTop: "6rem" }}>
          <div className="section-meta-label">// HISTORICAL MILESTONES</div>
          <h2 className="section-title-large" style={{ marginBottom: "4rem" }}>CHRONOLOGICAL LEGACY</h2>
          
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-badge" style={{ backgroundColor: "var(--color-scarlet)" }}></div>
                <div className="timeline-year" style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--color-white)", letterSpacing: "0.05em" }}>{m.year}</div>
                <div className="dominance-card" style={{ padding: "1.5rem", borderLeft: "3px solid var(--color-scarlet)" }}>
                  <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "16px", fontWeight: "700", color: "var(--color-white)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{m.title}</h4>
                  <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.5" }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
