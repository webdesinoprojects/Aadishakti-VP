import { useState, useEffect } from "react";
import { buildApiUrl } from "../config/api";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Loader2, ShieldCheck } from "lucide-react";
import { useCms } from "../context/CmsContext";
import { DEFAULT_INVESTORS_PAGE, mergeCmsContent } from "../data/publicCmsDefaults";

export default function Investors() {
  const { cms } = useCms();
  const content = mergeCmsContent(DEFAULT_INVESTORS_PAGE, cms?.investorsPage);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(buildApiUrl("/api/financials"))
      .then((res) => {
        if (!res.ok) throw new Error("Could not fed projection feeds.");
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
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title={content.heroTitle} activePage="INVESTORS" image={content.heroImage} />

      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", color: "var(--red-core)" }}>
              <Loader2 className="animate-spin" size={36} />
              <span style={{ marginLeft: "1rem", fontFamily: "var(--font-mono)", fontWeight: "600" }}>LOADING FINANCIAL TABLES...</span>
            </div>
          ) : error ? (
            <div className="corporate-card" style={{ borderLeftColor: "red", padding: "2rem", textAlign: "center" }}>
              <h4 style={{ color: "red", marginBottom: "0.5rem" }}>API CONNECTION DISCONNECTED</h4>
              <p style={{ color: "var(--silver)" }}>{error}</p>
            </div>
          ) : (
            <div>
              {/* SECTION 1: KEY FINANCIALS (4 KPI Cards) */}
              <SectionLabel text={content.metricsLabel} />
              <h2 className="section-title-large" style={{ marginBottom: "4rem" }}>{content.metricsHeading}</h2>
              
              <div className="grid-4" style={{ marginBottom: "5rem" }}>
                {content.kpis.map((kpi, idx) => (
                  <div key={idx} className="corporate-card" style={{ borderLeftColor: kpi.highlighted ? "var(--red-core)" : "var(--steel)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                      {kpi.label}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "36px", color: "var(--text-primary)", fontWeight: "700", marginTop: "8px", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                      {kpi.value}
                    </h3>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: kpi.trend.includes("↑") ? "var(--red-core)" : "var(--silver)" }}>
                      {kpi.trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* SECTION 2: CHARTS */}
              <div className="grid-2" style={{ gap: "40px", marginBottom: "5rem" }}>
                
                {/* Revenue Chart (BarChart) */}
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", padding: "32px", borderTop: "2px solid var(--red-core)" }}>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "20px", color: "var(--white)", textTransform: "uppercase", marginBottom: "2rem" }}>
                    {content.revenueChartTitle}
                  </h3>
                  <div style={{ width: "100%", height: "240px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E6" />
                        <XAxis dataKey="year" stroke="#7A7A7A" fontSize={11} fontFamily="var(--font-mono)" />
                        <YAxis stroke="#7A7A7A" fontSize={11} fontFamily="var(--font-mono)" unit=" Cr" />
                        <Tooltip
                          contentStyle={{ background: "#FFFFFF", border: "1px solid #CC2200", borderRadius: "2px", fontFamily: "Montserrat", fontSize: "13px" }}
                          labelStyle={{ fontWeight: "700", color: "#0D0D0D" }}
                          itemStyle={{ color: "#CC2200" }}
                        />
                        <Bar dataKey="value" fill="var(--red-core)" name="Revenue (Cr)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Production Volume Chart (LineChart) */}
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", padding: "32px", borderTop: "2px solid var(--red-core)" }}>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "20px", color: "var(--white)", textTransform: "uppercase", marginBottom: "2rem" }}>
                    {content.productionChartTitle}
                  </h3>
                  <div style={{ width: "100%", height: "240px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.production} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E6" />
                        <XAxis dataKey="year" stroke="#7A7A7A" fontSize={11} fontFamily="var(--font-mono)" />
                        <YAxis stroke="#7A7A7A" fontSize={11} fontFamily="var(--font-mono)" unit=" MT" />
                        <Tooltip
                          contentStyle={{ background: "#FFFFFF", border: "1px solid #CC2200", borderRadius: "2px", fontFamily: "Montserrat", fontSize: "13px" }}
                          labelStyle={{ fontWeight: "700", color: "#0D0D0D" }}
                          itemStyle={{ color: "#CC2200" }}
                        />
                        <Line type="monotone" dataKey="value" stroke="var(--red-core)" strokeWidth={2} name="Output (MT)" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* SECTION 3: GOVERNANCE & BADGES */}
              <div className="dominance-card" style={{ borderLeftColor: "var(--red-core)" }}>
                <SectionLabel text={content.governanceLabel} />
                <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "22px", color: "var(--white)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  {content.governanceHeading}
                </h3>
                <p style={{ color: "var(--silver)", fontSize: "14px", lineHeight: "1.7", marginBottom: "2rem" }}>
                  {content.governanceText}
                </p>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {content.certifications.map((text) => (
                    <div
                      key={text}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--border-light)",
                        padding: "8px 16px",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        color: "var(--white)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <ShieldCheck size={14} style={{ color: "var(--red-core)" }} />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
}




