import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { ASSETS } from "../assets/assetMap";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 6l9-3 9 3v6c0 5-4 9-9 10C7 18 3 14 3 12V6z" />
      </svg>
    ),
    title: "Environmental",
    points: [
      "Zero Liquid Discharge — 100% wastewater recycled",
      "Cyclone baghouse filtration on all smelting furnaces",
      "Lead dust suppression to sub-micron standards",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Social",
    points: [
      "Occupational health & safety for all plant workers",
      "Skill development and technical training programmes",
      "Community welfare initiatives near operating sites",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Governance",
    points: [
      "ISO 9001:2015 & ISO 14001:2015 certified systems",
      "Basel Convention compliance for all imports",
      "Transparent regulatory reporting to PCB authorities",
    ],
  },
];

const csrActivities = [
  {
    img: ASSETS.mundraPlant[6],
    title: "Clean Air Initiative",
    desc: "Investment in multi-stage baghouse filtration systems that capture particulate matter before release, maintaining air quality standards around both plants.",
  },
  {
    img: ASSETS.mundraPlant[10],
    title: "Wastewater Neutralisation",
    desc: "Sulphuric acid from battery electrolyte is neutralised in on-site chemical reaction chambers. Zero untreated effluent leaves our premises.",
  },
  {
    img: ASSETS.mundraPlant[7],
    title: "Worker Safety Systems",
    desc: "Personal protective equipment, regular blood lead monitoring for all staff, enclosed material handling, and documented emergency response protocols.",
  },
  {
    img: ASSETS.mundraPlant[3],
    title: "Circular Recovery Model",
    desc: "Every tonne of processed battery scrap returns fully to industrial supply chains as refined lead — preventing hazardous waste reaching landfills.",
  },
];

const esgCerts = [
  {
    icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><path d="M3 6l9-3 9 3v6c0 5-4 9-9 10C7 18 3 14 3 12V6z"/><polyline points="9 12 11 14 15 10"/></svg>,
    name: "ISO 14001:2015",
    desc: "Environmental Management System",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    name: "PCB Compliance",
    desc: "Pollution Control Board Authorisation",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    name: "ZLD Certified",
    desc: "Zero Liquid Discharge Operations",
  },
  {
    icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    name: "Basel Convention",
    desc: "Hazardous Waste Import Compliance",
  },
];

export default function Sustainability() {
  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="OUR COMMITMENT TO THE PLANET" activePage="SUSTAINABILITY" />

      {/* SECTION 1 — THREE PILLARS (dark photo background) */}
      <section className="dark-photo-section" style={{ minHeight: "580px" }}>
        <img className="dps-bg" src={ASSETS.mundraPlant[16]} alt="Aadishakti plant" loading="lazy" />
        <div className="dps-content container" style={{ padding: "90px 0" }}>
          <ScrollReveal>
            <SectionLabel text="// SUSTAINABILITY PILLARS" />
            <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, marginBottom: "48px", maxWidth: "560px" }}>
              Environmental, Social &amp; Governance
            </h2>
            <div className="grid-3" style={{ gap: "20px" }}>
              {pillars.map((p) => (
                <motion.div
                  key={p.title}
                  className="glass-card-dark"
                  style={{ padding: "32px 28px" }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div style={{ color: "rgba(255,255,255,0.9)", marginBottom: "16px" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "20px", color: "#FFFFFF", marginBottom: "16px" }}>
                    {p.title}
                  </h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {p.points.map((pt) => (
                      <li key={pt} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                        <span style={{ color: "var(--red-core)", flexShrink: 0, marginTop: "4px" }}>▪</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2 — ZLD HIGHLIGHT BAND */}
      <section style={{ background: "var(--red-deep)", padding: "56px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "16px" }}>
            // ZERO LIQUID DISCHARGE
          </div>
          <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(22px, 3.5vw, 42px)", color: "#FFFFFF", lineHeight: 1.2, maxWidth: "800px", margin: "0 auto 20px" }}>
            100% of wastewater recycled within plant premises — nothing reaches municipal drains.
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
            Our closed-circuit neutralisation systems convert battery acid into inert waste on-site.
            A commitment backed by Pollution Control Board authorisation at both facilities.
          </p>
        </div>
      </section>

      {/* SECTION 3 — CIRCULAR ECONOMY TEXT */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}>
              <div>
                <SectionLabel text="// CIRCULAR ECONOMY" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "24px" }}>
                  Zero Metallurgical Leakage
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "20px" }}>
                  Lead acid battery recovery protects delicate natural ecosystems by preventing raw mining
                  extractions and transboundary hazard leaks. Aadishakti Group utilises closed-circuit smelting
                  processes that return every atom of recoverable lead to productive use.
                </p>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "20px" }}>
                  By capturing battery acid and neutralising it inside secure chemical reaction wells, we yield
                  pure secondary lead ingots with zero hazard leaks. Our refineries operate under absolute
                  environmental permit approvals from state Pollution Control Boards.
                </p>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  Secondary lead refining consumes 35–40% less energy than primary lead production from ore —
                  making Aadishakti's operations inherently lower-carbon than mining-based alternatives.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { value: "100%",  label: "Recycling Focus", desc: "Every tonne of battery scrap returned as refined product." },
                  { value: "35–40%", label: "Less Energy",   desc: "vs. primary lead production from mined ore." },
                  { value: "ZLD",   label: "Zero Discharge",  desc: "Closed-circuit wastewater management at both sites." },
                ].map((s) => (
                  <div key={s.value} className="corporate-card" style={{ padding: "20px 24px", background: "var(--bg-secondary)" }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      <div style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "28px", color: "var(--text-primary)", lineHeight: 1, flexShrink: 0 }}>
                        {s.value}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4 — CSR ACTIVITIES */}
      <section className="section-padding bg-diagonal-hatch">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// CSR ACTIVITIES" />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>Environmental Initiatives</h2>
            <div className="grid-4" style={{ gap: "20px" }}>
              {csrActivities.map((act) => (
                <div key={act.title} className="corporate-card" style={{ padding: 0, overflow: "hidden", background: "#FFFFFF" }}>
                  <img
                    src={act.img}
                    alt={act.title}
                    loading="lazy"
                    style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "20px" }}>
                    <h4 style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "8px" }}>
                      {act.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5 — ESG CERTIFICATIONS */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// CERTIFICATIONS" />
            <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>ESG Compliance Framework</h2>
            <div className="grid-4" style={{ gap: "20px" }}>
              {esgCerts.map((cert) => (
                <div key={cert.name} className="cert-card">
                  <div style={{ marginBottom: "14px" }}>{cert.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {cert.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{cert.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6 — CTA DARK */}
      <section className="dark-photo-section" style={{ minHeight: "320px" }}>
        <img className="dps-bg" src={ASSETS.mundraPlant[15]} alt="Plant at dusk" loading="lazy" />
        <div className="dps-content container" style={{ padding: "80px 0", textAlign: "center" }}>
          <ScrollReveal>
            <SectionLabel text="// PARTNER WITH PURPOSE" />
            <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "#FFFFFF", marginBottom: "20px", maxWidth: "600px", margin: "0 auto 20px" }}>
              Work with an ISO-certified, ESG-committed lead recycler
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "var(--fs-body)", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.7 }}>
              Whether you're a buyer, seller, investor, or regulator — we welcome conversations about
              responsible industrial metal recovery.
            </p>
            <Link to="/contact" className="btn-solid-red">Get In Touch →</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
