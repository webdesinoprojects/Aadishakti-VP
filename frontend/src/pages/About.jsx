import React from "react";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { ASSETS } from "../assets/assetMap";

const principles = [
  { title: "Chemical Accuracy", desc: "Rigid laboratory analytics via OES spectrometers to deliver lead ingots of certified purity up to 99.985% Pb." },
  { title: "Safe Compliance",   desc: "Complete Basel Convention alignment. Safe recycling of hazardous wastes under regulatory authorisation." },
  { title: "Sovereign Volume",  desc: "Smelting capacity scaling up to 120,000 MTPA by April 2026 to capture domestic and export dominance." },
];

const founders = [
  {
    name: "Amit Goyal",
    img:  ASSETS.founders.amitGoyal,
    role: "CO-FOUNDER & DIRECTOR",
    bio:  "\"We engineered Aadishakti to finalise the loop of industrial metal recovery. Our secondary refineries deliver premium lead elements while protecting ecological grids from raw mining hazards.\"",
  },
  {
    name: "Anil Goel",
    img:  ASSETS.founders.anilGoel,
    role: "CO-FOUNDER & DIRECTOR",
    bio:  "\"Accuracy and volume are not contradictory metrics. Our upcoming automated smelting expansion in Mundra sets India's modern benchmark for clean metallurgical production.\"",
  },
];

const timeline = [
  { year: "2004", title: "First Operations",        desc: "Established administrative and sourcing desk in New Delhi." },
  { year: "2014", title: "AMRPL — Roorkee",          desc: "Acquired first secondary processing plant to service domestic battery manufacturers." },
  { year: "2023", title: "AGRPL — Mundra Flagship",  desc: "Launched major smelting hub at Mundra SEZ for transboundary scrap intake." },
  { year: "2026", title: "120,000 MT Scale-Up",      desc: "Automated smelter complex expansion slated for April 2026 completion." },
];

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
  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="CORPORATE OVERVIEW" activePage="ABOUT US" />

      {/* SECTION 1 — WHO WE ARE */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// WHO WE ARE" />
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  A ₹1000+ Crore Industrial Conglomerate
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  Through strategic smelting facilities in Mundra (AGRPL) and Roorkee (AMRPL), Aadishakti Group
                  has constructed a sovereign non-ferrous lead recycling ecosystem across India.
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.7 }}>
                  We import bulk battery waste residues (ISRI codes), refining them into 99.97%+ purified Refined
                  Lead Ingots, Calcium-Antimony Alloys, and Lead Monoxides. We serve domestic automobile battery
                  manufacturers and transboundary exporters with certified compliance.
                </p>
              </div>

              <div style={{ height: "340px", overflow: "hidden", position: "relative" }}>
                <img
                  src={ASSETS.mundraPlant[0]}
                  alt="Mundra Smelter"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", background: "rgba(10,10,10,0.84)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--red-core)", letterSpacing: "0.12em" }}>
                  MUNDRA PROCESSING HUB (AGRPL)
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
            <SectionLabel text="// OUR PHILOSOPHY" />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>The Metallurgical Principles</h2>
            <div className="grid-3">
              {principles.map((pr) => (
                <div key={pr.title} className="corporate-card" style={{ background: "#FFFFFF" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "var(--fs-h3)", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase" }}>
                    {pr.title}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-body)", lineHeight: 1.6 }}>{pr.desc}</p>
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
            <SectionLabel text="// BOARD OF DIRECTORS" />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>The Co-Founders</h2>

            <div className="grid-2" style={{ gap: "40px" }}>
              {founders.map((fd) => (
                <div
                  key={fd.name}
                  className="about-founder-card"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "36px", textAlign: "center", transition: "all var(--transition-normal)" }}
                >
                  <div style={{ width: "140px", height: "140px", borderRadius: "50%", border: "2px solid var(--gold)", overflow: "hidden", margin: "0 auto 24px auto" }}>
                    <img src={fd.img} alt={fd.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            <SectionLabel text="// COMPANY HISTORY" />
            <h2 className="section-title-large" style={{ marginBottom: "1rem" }}>The Chronological Roadmap</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", marginBottom: "4rem" }}>
              Critical milestones that scaled Aadishakti into a top secondary metallurgical group.
            </p>

            <div style={{ position: "relative" }}>
              {/* Connecting line */}
              <div style={{ position: "absolute", top: "40px", left: 0, width: "100%", height: "2px", background: "linear-gradient(90deg, var(--red-core) 0%, var(--red-bright) 100%)", zIndex: 1 }} />

              <div style={{ display: "flex", gap: "0", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "thin" }}>
                {timeline.map((tm, idx) => (
                  <motion.div
                    key={tm.year}
                    style={{ minWidth: "240px", flex: 1, position: "relative", paddingTop: "68px" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    viewport={{ once: true }}
                  >
                    {/* Timeline node */}
                    <div style={{ position: "absolute", top: "34px", left: "24px", width: "14px", height: "14px", borderRadius: "50%", background: "var(--red-core)", border: "3px solid var(--bg-secondary)", zIndex: 2 }} />

                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "22px", fontWeight: 700, color: "var(--red-core)", marginBottom: "12px", paddingLeft: "24px" }}>
                      {tm.year}
                    </div>
                    <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        {tm.title}
                      </h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.5 }}>{tm.desc}</p>
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
            <SectionLabel text="// QUALITY ASSURANCE" />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>Our Certifications</h2>
            <div className="grid-4" style={{ gap: "20px" }}>
              {certifications.map((cert) => (
                <div key={cert.name} className="cert-card">
                  <div style={{ marginBottom: "16px" }}>{cert.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {cert.name}
                  </h3>
                  <div style={{ fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                    {cert.desc}
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
