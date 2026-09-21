import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import { useCms } from "../context/CmsContext";
import { DEFAULT_BUSINESSES_PAGE, mergeCmsContent } from "../data/publicCmsDefaults";

export default function Businesses() {
  const location = useLocation();
  const { cms } = useCms();
  const content = mergeCmsContent(DEFAULT_BUSINESSES_PAGE, cms?.businessesPage);

  useEffect(() => {
    const plant = new URLSearchParams(location.search).get("plant");
    if (!plant) return;
    const element = document.getElementById(plant);
    if (!element) return;
    const position = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 80;
    window.scrollTo({ top: position, behavior: "smooth" });
  }, [location.search, content.divisions]);

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title={content.heroTitle} activePage="BUSINESSES" image={content.heroImage} />

      {content.divisions.map((division, divisionIndex) => (
        <section
          id={division.id}
          key={division.id}
          style={{
            padding: "80px 0", position: "relative", display: "flex", alignItems: "center", minHeight: "560px",
            background: divisionIndex % 2 ? "#111111" : "#0d0d0d", borderBottom: "1px solid var(--steel)",
            overflow: "hidden", scrollMarginTop: "84px",
          }}
        >
          <div
            role="img"
            aria-label={`${division.company} facility`}
            style={{ position: "absolute", inset: 0, backgroundImage: `url("${division.image}")`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55, zIndex: 1, filter: "saturate(0.9) contrast(1.08)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.64) 45%, rgba(8,8,8,0.30) 100%)", zIndex: 2 }} />

          <div className="container" style={{ position: "relative", zIndex: 3 }}>
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
              <div>
                <SectionLabel text={division.label} light={true} />
                <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "var(--fs-h2)", color: "var(--text-white)", textTransform: "uppercase", marginBottom: "1rem" }}>{division.heading}</h2>
                <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: "16px", color: "#FF6B55", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem" }}>{division.company}</h3>
                <p style={{ color: "#E4E4E0", fontSize: "var(--fs-lead)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{division.lead}</p>
                <p style={{ color: "#D0D0CB", fontSize: "var(--fs-body)", lineHeight: 1.6, marginBottom: "2rem" }}>{division.body}</p>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: division.contactLines?.length ? "1.5rem" : 0 }}>
                  {(division.badges || []).map((badge) => <span key={badge} style={{ border: "1px solid var(--steel)", background: "rgba(8,8,8,0.72)", padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-white)" }}>{badge}</span>)}
                </div>

                {!!division.contactLines?.length && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#C4C4BF", lineHeight: 1.8 }}>
                    {division.contactLines.map((line) => <div key={line}>{line}</div>)}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {(division.metrics || []).map((metric) => (
                  <div key={`${metric.value}-${metric.label}`} style={{ background: "rgba(8,8,8,0.58)", backdropFilter: "blur(2px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(20px, 2vw, 28px)", color: "var(--text-white)", fontWeight: 700 }}>{metric.value}</div>
                    <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
