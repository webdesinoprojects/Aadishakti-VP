import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { useCms } from "../context/CmsContext";
import { DEFAULT_ABOUT_PAGE, mergeCmsContent } from "../data/publicCmsDefaults";

const certifications = [
  {
    icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7z"/><polyline points="9 12 11 14 15 10"/></svg>,
    name: "ISO 9001:2015",
    desc: "Quality Management System",
    scope: "Full manufacturing & dispatch cycle",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><path d="M3 6l9-3 9 3v6c0 5-4 9-9 10C7 18 3 14 3 12V6z"/></svg>,
    name: "ISO 14001:2015",
    desc: "Environmental Management System",
    scope: "Mundra & Roorkee facilities",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    name: "BIS Certified",
    desc: "Bureau of Indian Standards",
    scope: "IS 27:1992 — Pure Lead Grade",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    name: "Basel Convention",
    desc: "Transboundary Hazardous Waste",
    scope: "International compliance certified",
  },
];

export default function About() {
  const { cms } = useCms();
  const content = mergeCmsContent(DEFAULT_ABOUT_PAGE, cms?.aboutPage);
  const leaders = Array.isArray(cms?.team) && cms.team.length ? cms.team : content.leadership;
  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title={content.heroTitle} activePage="ABOUT US" image={content.heroImage} />

      {/* SECTION 1 — WHO WE ARE */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text={content.overviewLabel} />
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  {content.overviewHeading}
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  {content.overviewLead}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.7 }}>
                  {content.overviewBody}
                </p>
              </div>

              <div style={{ height: "340px", overflow: "hidden", position: "relative" }}>
                <img
                  src={content.overviewImage}
                  alt="Mundra Smelter"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", background: "rgba(10,10,10,0.84)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--red-core)", letterSpacing: "0.12em" }}>
                  {content.overviewImageCaption}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2 — PHILOSOPHY */}
      <section className="section-padding bg-diagonal-hatch">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text={content.principlesLabel} />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>{content.principlesHeading}</h2>
            <div className="grid-3">
              {content.principles.map((pr) => (
                <div key={pr.title} className="corporate-card" style={{ background: "#FFFFFF" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "var(--fs-h3)", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase" }}>
                    {pr.title}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.6 }}>{pr.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3 — FOUNDERS */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text={content.leadershipLabel} />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>{content.leadershipHeading}</h2>

            <div className="grid-2" style={{ gap: "40px" }}>
              {leaders.map((fd) => (
                <div
                  key={fd.name}
                  className="about-founder-card"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "36px", textAlign: "center", transition: "all var(--transition-normal)" }}
                >
                  <div style={{ width: "140px", height: "140px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", margin: "0 auto 24px auto" }}>
                    <img src={fd.image || fd.photo} alt={fd.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: "26px", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{fd.name}</h3>
                  <div style={{ fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: "11px", color: "var(--red-core)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px" }}>
                    {fd.role}
                  </div>
                  <div style={{ width: "80px", height: "1px", background: "var(--gold)", margin: "0 auto 24px" }} />
                  <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                    {fd.bio}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4 — TIMELINE */}
      <section className="section-padding bg-steel-grid">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text={content.timelineLabel} />
            <h2 className="section-title-large" style={{ marginBottom: "1rem" }}>{content.timelineHeading}</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", marginBottom: "4rem" }}>
              {content.timelineIntroduction}
            </p>

            <div style={{ position: "relative" }}>
              {/* Connecting line */}
              <div className="about-timeline-line" />

              <div className="grid-4" style={{ gap: "24px", paddingBottom: "16px" }}>
                {content.timeline.map((tm, idx) => (
                  <motion.div
                    key={tm.year}
                    className="about-timeline-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    viewport={{ once: true }}
                  >
                    {/* Timeline node */}
                    <div className="about-timeline-node" />

                    <div className="about-timeline-year" style={{ fontFamily: "var(--font-mono)", fontSize: "22px", fontWeight: 700, color: "var(--red-core)", marginBottom: "12px", paddingLeft: "24px" }}>
                      {tm.year}
                    </div>
                    <div className="corporate-card" style={{ flex: 1, padding: "24px", background: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        {tm.title}
                      </h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.5 }}>{tm.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5 — CERTIFICATIONS GRID */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text={content.certificationsLabel} />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>{content.certificationsHeading}</h2>
            <div className="grid-4" style={{ gap: "20px" }}>
              {content.certifications.map((cert, index) => (
                <div key={cert.name} className="cert-card">
                  <div style={{ marginBottom: "16px" }}>{certifications[index]?.icon || certifications[0].icon}</div>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {cert.name}
                  </h3>
                  <div style={{ fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                    {cert.description}
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{cert.scope}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        .about-founder-card:hover {
          box-shadow: 0 0 40px rgba(184,150,62,0.12) !important;
          border-color: var(--gold) !important;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
}
