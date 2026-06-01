import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2 } from "lucide-react";

export default function Investors() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => {
    fetch("http://localhost:5000/api/financials")
      .then((res) => {
        if (!res.ok) throw new Error("Could not feed projection models.");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="investors"
      className="section-padding"
      style={{
        position: "relative",
        background: "var(--color-forge)",
        overflow: "hidden",
      }}
    >
      {/* Subtle Crimson Radial Glow Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(139, 0, 0, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      ></div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// INVESTOR DESK</div>
        <h2 className="section-title-large">FINANCIAL MOMENTUM & SCALE</h2>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", color: "var(--color-scarlet)" }}>
            <Loader2 className="animate-spin" size={36} />
            <span style={{ marginLeft: "1rem", fontFamily: "var(--font-mono)", fontWeight: "700" }}>LOADING FINANCIAL DESKS...</span>
          </div>
        ) : error ? (
          <div className="dominance-card" style={{ borderLeft: "3px solid red", padding: "2rem", textAlign: "center" }}>
            <h4 style={{ color: "red", marginBottom: "0.5rem", fontFamily: "var(--font-subheading)" }}>PROJECTION FEED DISCONNECTED</h4>
            <p style={{ color: "var(--color-silver)" }}>{error}</p>
          </div>
        ) : (
          <div>
            {/* Stat Blocks */}
            <div className="grid-3" style={{ marginBottom: "4rem" }}>
              <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
                <span style={{ color: "var(--color-silver)", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                  REVENUE ESTIMATE FY25-26
                </span>
                <h3 style={{ fontSize: "3rem", color: "var(--color-white)", marginTop: "0.5rem" }}>
                  ₹1,200 Cr
                </h3>
                <p style={{ color: "var(--color-scarlet)", fontSize: "13px", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
                  +{data.growthRate.salesIncreasePercent} Y-o-Y GROWTH FEED
                </p>
              </div>

              <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
                <span style={{ color: "var(--color-silver)", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                  SMELTING MASS METRIC
                </span>
                <h3 style={{ fontSize: "3rem", color: "var(--color-white)", marginTop: "0.5rem" }}>
                  120,000 MT
                </h3>
                <p style={{ color: "var(--color-silver)", fontSize: "13px", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
                  EXPANDING FROM 70,000 MTPA
                </p>
              </div>

              <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
                <span style={{ color: "var(--color-silver)", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                  TRANSBOUNDARY EXPORT
                </span>
                <h3 style={{ fontSize: "3rem", color: "var(--color-white)", marginTop: "0.5rem" }}>
                  48% Share
                </h3>
                <p style={{ color: "var(--color-silver)", fontSize: "13px", fontFamily: "var(--font-mono)", marginTop: "0.25rem" }}>
                  GLOBAL MARITIME DISTRIBUTION
                </p>
              </div>
            </div>

            {/* Asymmetric Graph & Logistical Map Split */}
            <div className="grid-2" style={{ gap: "4rem", alignItems: "start" }}>
              
              {/* Graphic Chart Panel */}
              <div
                style={{
                  background: "var(--color-iron)",
                  border: "1px solid var(--color-steel)",
                  borderLeft: "3px solid var(--color-scarlet)",
                  padding: "2.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <h4 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-white)" }}>
                    GROWTH CHARTS
                  </h4>
                  
                  {/* Selector Toggles */}
                  <div style={{ display: "flex", gap: "0.5rem", background: "var(--color-void)", border: "1px solid var(--color-steel)", padding: "0.25rem" }}>
                    <button
                      onClick={() => setActiveTab("revenue")}
                      style={{
                        padding: "0.4rem 0.8rem",
                        fontSize: "11px",
                        fontFamily: "var(--font-subheading)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background: activeTab === "revenue" ? "var(--color-scarlet)" : "transparent",
                        color: "var(--color-white)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setActiveTab("production")}
                      style={{
                        padding: "0.4rem 0.8rem",
                        fontSize: "11px",
                        fontFamily: "var(--font-subheading)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background: activeTab === "production" ? "var(--color-scarlet)" : "transparent",
                        color: "var(--color-white)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Smelt Volume
                    </button>
                  </div>
                </div>

                {/* Recharts container */}
                <div style={{ width: "100%", height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === "revenue" ? (
                      <AreaChart data={data.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEmber" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-scarlet)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--color-scarlet)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        <XAxis dataKey="year" stroke="var(--color-silver)" fontSize={11} fontFamily="var(--font-mono)" />
                        <YAxis stroke="var(--color-silver)" fontSize={11} fontFamily="var(--font-mono)" unit=" Cr" />
                        <Tooltip
                          contentStyle={{ background: "#1A1A1A", border: "1px solid var(--color-scarlet)" }}
                          labelStyle={{ fontWeight: "700", color: "var(--color-white)", fontFamily: "var(--font-body)" }}
                          itemStyle={{ fontFamily: "var(--font-body)", color: "var(--color-platinum)" }}
                        />
                        <Area type="monotone" dataKey="value" stroke="var(--color-scarlet)" strokeWidth={2} fillOpacity={1} fill="url(#colorEmber)" name="Revenues (Cr INR)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={data.production} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        <XAxis dataKey="year" stroke="var(--color-silver)" fontSize={11} fontFamily="var(--font-mono)" />
                        <YAxis stroke="var(--color-silver)" fontSize={11} fontFamily="var(--font-mono)" unit=" MT" />
                        <Tooltip
                          contentStyle={{ background: "#1A1A1A", border: "1px solid var(--color-scarlet)" }}
                          labelStyle={{ fontWeight: "700", color: "var(--color-white)", fontFamily: "var(--font-body)" }}
                          itemStyle={{ fontFamily: "var(--font-body)", color: "var(--color-platinum)" }}
                        />
                        <Bar dataKey="value" fill="var(--color-plasma)" name="Smelter Outputs (MT)" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Logistical Grid Map */}
              <div
                style={{
                  background: "var(--color-iron)",
                  border: "1px solid var(--color-steel)",
                  borderLeft: "3px solid var(--color-scarlet)",
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <h4 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-white)" }}>
                  GLOBAL MARITIME DISTRIBUTION
                </h4>
                
                <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6" }}>
                  Aadishakti’s operations are supported by a resilient sourcing pipeline spanning Eastern Europe, Southeast Asia, and American maritime corridors. Raw drained battery vessel cargo docks at Mundra SEZ, Kutch.
                </p>

                <div style={{ position: "relative", height: "180px", border: "1px solid var(--color-steel)", background: "var(--color-forge)", borderRadius: "4px", overflow: "hidden" }}>
                  <img src="/plant/Gemini_Generated_Image_x65myex65myex65m.png" alt="Sourcing Hubs" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "var(--font-body)", fontSize: "13px" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-scarlet)", marginTop: "0.35rem", flexShrink: 0 }}></span>
                    <p style={{ color: "var(--color-silver)" }}><strong>Procurement:</strong> Inward battery hazard scrap vessels cleared via customs guidelines within 48 hours at Mundra port.</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-plasma)", marginTop: "0.35rem", flexShrink: 0 }}></span>
                    <p style={{ color: "var(--color-silver)" }}><strong>Fulfillment:</strong> High-purity refined ingots exported to international grids and battery corporations.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
