import React, { useState } from "react";
import { Check } from "lucide-react";

export default function Import() {
  const [activeTab, setActiveTab] = useState("battery");

  return (
    <section id="import" className="section-padding">
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// PROCUREMENT & IMPORTS</div>
        <h2 className="section-title-large">TRANSBOUNDARY MATERIAL SOURCING</h2>

        {/* Introduction */}
        <div className="dominance-card" style={{ marginBottom: "4rem", borderLeft: "3px solid var(--color-scarlet)" }}>
          <div className="grid-2" style={{ alignItems: "center", gap: "4rem" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-scarlet)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                BASEL CONVENTION COMPLIANT
              </span>
              <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "24px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginTop: "0.5rem", marginBottom: "1rem" }}>
                RESPONSIBLE CIRCULAR RECOVERY
              </h3>
              <p style={{ color: "var(--color-silver)", fontSize: "15px", lineHeight: "1.7", marginBottom: "1.2rem" }}>
                Aadishakti Metal Recycling Pvt. Ltd. actively sources bulk quantities of lead battery scrap from global markets to power secondary metallurgical production.
              </p>
              <p style={{ color: "var(--color-silver)", fontSize: "15px", lineHeight: "1.7" }}>
                We cooperate strictly with global shipping fleets, transboundary hazard regulations, and customs audits, offering competitive scrap valuations and freight clearances.
              </p>
            </div>
            <div style={{ height: "240px", border: "1px solid var(--color-steel)", background: "var(--color-void)", position: "relative" }}>
              <img src="/plant/BBSU.jpeg" alt="Scrap Processing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* Tab Controls (Rajdhani Uppercase) */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
          <button
            onClick={() => setActiveTab("battery")}
            className="btn-spark"
            style={{
              backgroundColor: activeTab === "battery" ? "var(--color-scarlet)" : "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              transform: "none",
            }}
          >
            LEAD BATTERY SCRAP
          </button>
          <button
            onClick={() => setActiveTab("steel")}
            className="btn-spark"
            style={{
              backgroundColor: activeTab === "steel" ? "var(--color-scarlet)" : "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              transform: "none",
            }}
          >
            STAINLESS STEEL COILS/PIPES
          </button>
        </div>

        {/* Asymmetric Split Layout for Content and Contact Desk */}
        <div className="grid-2" style={{ gap: "4rem", alignItems: "stretch" }}>
          
          {/* Left: Tab Panel Details */}
          <div className="dominance-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {activeTab === "battery" ? (
              <div>
                <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "20px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1rem" }}>
                  BATTERY SCRAP PROCUREMENT
                </h4>
                <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  We import raw lead battery residues globally. We offer top rates, prompt container clearing audits, and transboundary logistical handling support.
                </p>

                <h5 style={{ fontFamily: "var(--font-subheading)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-scarlet)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  ACCEPTED METALS & SCRAP:
                </h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "14px", color: "var(--color-platinum)" }}>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span>Drained Lead-Acid Battery Scrap (ISRI RAINS codes)</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span>Used Car, Truck, and Vehicle Batteries Scrap</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span>Industrial Backup UPS Lead Batteries</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span>Solar Farm Storage & Telecom Lead Batteries</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "20px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1rem" }}>
                  STAINLESS STEEL PROCUREMENT
                </h4>
                <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  AadiShakti imports high-grade Stainless Steel Pipes and Coils matching tailored client dimensions and industrial specifications.
                </p>

                <h5 style={{ fontFamily: "var(--font-subheading)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--color-scarlet)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  IMPORT DATA DEETS:
                </h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "14px", color: "var(--color-platinum)" }}>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span><strong>Imported SS Pipes:</strong> 0.23 mm to 5.0 mm thickness, SS304/SS316.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span><strong>Imported SS Coils:</strong> 0.25 mm to 1.45 mm thickness, customizable width.</span>
                  </li>
                  <li style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <Check size={14} style={{ color: "var(--color-scarlet)", flexShrink: 0 }} />
                    <span><strong>Mill Certifications:</strong> Complete trace analysis certificates provided with every batch.</span>
                  </li>
                </ul>
              </div>
            )}

            <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-steel)", paddingTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-ash)" }}>
              // SECURED METALLURGICAL LOGISTICS GUARANTEED
            </div>
          </div>

          {/* Right: Import Desk Contact (styled in new theme) */}
          <div
            style={{
              background: "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              borderLeft: "3px solid var(--color-scarlet)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "20px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                INBOUND INQUIRY DESK
              </h4>
              <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "2rem" }}>
                Connect directly with our head of global procurement to establish pricing contracts, vessel clearing schedules, or transboundary scrap agreements.
              </p>

              <div style={{ background: "var(--color-void)", border: "1px solid var(--color-steel)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h5 style={{ fontFamily: "var(--font-subheading)", fontSize: "16px", fontWeight: "700", color: "var(--color-white)" }}>Mr. Rajesh Mehta</h5>
                  <p style={{ color: "var(--color-scarlet)", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    DIRECTOR OF GLOBAL PROCUREMENT
                  </p>
                </div>
                
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--color-platinum)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span><strong>Mobile:</strong> +91-9045585676</span>
                  <span><strong>Email:</strong> <a href="mailto:rajesh.mehta@aadishakti.com" style={{ textDecoration: "underline", color: "var(--color-scarlet)" }}>rajesh.mehta@aadishakti.com</a></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.open("mailto:rajesh.mehta@aadishakti.com?subject=Transboundary%20Lead%20Scrap%20Sourcing", "_blank");
              }}
              className="btn-forge-submit"
              style={{ marginTop: "2rem" }}
            >
              ENGAGE PROCUREMENT DESK
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
