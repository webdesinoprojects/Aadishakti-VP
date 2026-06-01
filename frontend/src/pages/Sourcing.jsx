import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import LeadCalculator from "../components/LeadCalculator";
import { ASSETS } from "../assets/assetMap";

const whatWeBuy = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "Used Lead Acid Batteries (ULAB)",
    desc: "Automotive, industrial, and telecom batteries — VRLA, tubular, and flat plate types accepted.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6l9-3 9 3v6c0 5-4 9-9 10C7 18 3 14 3 12V6z" />
      </svg>
    ),
    title: "Battery Plates & Paste",
    desc: "Separated positive and negative plates, battery paste, and active material from dismantling operations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Lead Dross & Slag",
    desc: "Smelting by-products including dross, slag, and other secondary lead-bearing materials.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Scrap Lead Cable Sheathing",
    desc: "Lead cable sheathing, pipes, and other lead-containing industrial scrap in bulk quantities.",
  },
];

const criteria = [
  { grade: "Grade A", lead: "≥ 60% Pb", form: "Whole batteries, intact", min: "5 MT", notes: "Premium pricing" },
  { grade: "Grade B", lead: "50–60% Pb", form: "Drained, cracked cases", min: "10 MT", notes: "Standard pricing" },
  { grade: "Grade C", lead: "40–50% Pb", form: "Mixed, plates only", min: "20 MT", notes: "Negotiated pricing" },
  { grade: "Dross/Slag", lead: "25–45% Pb", form: "Loose material, bags", min: "5 MT", notes: "Assay required" },
];

export default function Sourcing() {
  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="SOURCING & PROCUREMENT" activePage="SOURCING" />

      {/* SECTION 1: WHAT WE BUY */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// WE BUY" />
            <div style={{ maxWidth: "700px", marginBottom: "48px" }}>
              <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "16px" }}>
                Procuring Lead-Rich Scrap <span style={{ color: "var(--red-core)" }}>Nationwide</span>
              </h2>
              <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Aadishakti Group is one of India's largest secondary lead processors. We actively procure
                used lead-acid batteries and scrap materials from dismantlers, dealers, and industrial
                generators across India and internationally through Mundra Port.
              </p>
            </div>

            <div className="grid-4" style={{ gap: "20px" }}>
              {whatWeBuy.map((item) => (
                <div key={item.title} className="strength-item" style={{ minHeight: "200px" }}>
                  <div style={{ color: "var(--red-core)", marginBottom: "14px" }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "10px" }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2: ACCEPTANCE CRITERIA TABLE */}
      <section className="section-padding bg-steel-grid">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// QUALITY STANDARDS" />
            <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "40px" }}>Acceptance Criteria</h2>

            <div style={{ overflowX: "auto" }}>
              <table className="sourcing-table">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Lead Content</th>
                    <th>Accepted Form</th>
                    <th>Min. Lot Size</th>
                    <th>Pricing</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((row) => (
                    <tr key={row.grade}>
                      <td style={{ fontFamily: "var(--font-primary)", fontWeight: 700, color: "var(--text-primary)" }}>{row.grade}</td>
                      <td style={{ color: "var(--red-core)", fontWeight: 700 }}>{row.lead}</td>
                      <td>{row.form}</td>
                      <td>{row.min}</td>
                      <td>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: IMPORT CAPABILITY + CALCULATOR */}
      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <ScrollReveal>
            <div className="grid-2" style={{ gridTemplateColumns: "1fr 340px", gap: "60px", alignItems: "start" }}>
              {/* Left: import info */}
              <div>
                <SectionLabel text="// IMPORT CAPABILITY" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "20px" }}>
                  International Scrap Procurement
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Our Mundra facility (AGRPL) operates adjacent to Adani Port — one of India's largest
                  private ports — enabling efficient customs clearance for international ULAB and lead
                  scrap consignments under the Basel Convention framework.
                </p>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "32px" }}>
                  We handle complete documentation: Pre-Shipment Inspection (PSI), Import NOC from
                  Central Pollution Control Board, CDSCO clearances, and all statutory compliance for
                  hazardous waste imports under Schedule IV of Hazardous Waste Rules.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                  {[
                    { label: "Import Port", value: "Mundra, Gujarat" },
                    { label: "Port Code", value: "INMUN" },
                    { label: "Compliance", value: "Basel Convention" },
                    { label: "Turnaround", value: "48–72 hrs clearance" },
                  ].map((item) => (
                    <div key={item.label} className="corporate-card" style={{ padding: "18px 20px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact for sourcing */}
                <div className="corporate-card" style={{ background: "var(--bg-secondary)", padding: "24px 28px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px" }}>
                    // SOURCING CONTACT
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>Import & Procurement Desk</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                    For bulk international procurement enquiries and pre-shipment discussions.
                  </p>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                    marketing@aadishakti.com · +91-8743000299
                  </div>
                </div>
              </div>

              {/* Right: Lead Calculator */}
              <div style={{ position: "sticky", top: "120px" }}>
                <LeadCalculator />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4: SOURCING CONTACT FORM */}
      <section className="section-padding bg-diagonal-hatch">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// GET IN TOUCH" />
            <div className="grid-2" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "start" }}>
              <div>
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "16px" }}>
                  Start a Sourcing Conversation
                </h2>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", marginBottom: "32px" }}>
                  Whether you are a battery dismantler, scrap dealer, municipal collector, or overseas
                  exporter — we invite you to connect. We offer competitive pricing, timely payment,
                  and complete documentation support.
                </p>

                <form
                  onSubmit={(e) => { e.preventDefault(); alert("Your enquiry has been received. Our sourcing team will contact you within 24 hours."); }}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div className="grid-2" style={{ gap: "16px" }}>
                    <div className="float-form-group">
                      <label className="float-form-label">Your Name</label>
                      <input className="float-form-control" type="text" placeholder="Full name" required />
                    </div>
                    <div className="float-form-group">
                      <label className="float-form-label">Company / Organisation</label>
                      <input className="float-form-control" type="text" placeholder="Company name" />
                    </div>
                  </div>
                  <div className="float-form-group">
                    <label className="float-form-label">Material Type</label>
                    <select className="float-form-control" style={{ cursor: "pointer" }}>
                      <option>Used Lead Acid Batteries (ULAB)</option>
                      <option>Battery Plates / Paste</option>
                      <option>Lead Dross / Slag</option>
                      <option>Cable Sheathing / Other</option>
                    </select>
                  </div>
                  <div className="grid-2" style={{ gap: "16px" }}>
                    <div className="float-form-group">
                      <label className="float-form-label">Estimated Quantity (MT/month)</label>
                      <input className="float-form-control" type="text" placeholder="e.g. 50 MT" />
                    </div>
                    <div className="float-form-group">
                      <label className="float-form-label">Location / Port of Origin</label>
                      <input className="float-form-control" type="text" placeholder="City or Port" />
                    </div>
                  </div>
                  <div className="float-form-group">
                    <label className="float-form-label">Contact (Phone or Email)</label>
                    <input className="float-form-control" type="text" placeholder="+91 or email address" required />
                  </div>
                  <button type="submit" className="btn-solid-red" style={{ alignSelf: "flex-start", paddingInline: "36px" }}>
                    Submit Sourcing Enquiry →
                  </button>
                </form>
              </div>

              <div>
                <img
                  src={ASSETS.mundraPlant[0]}
                  alt="Mundra Port AGRPL"
                  loading="lazy"
                  style={{ width: "100%", height: "240px", objectFit: "cover", marginBottom: "20px" }}
                />
                <div className="corporate-card" style={{ padding: "20px 22px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                    Why sell to Aadishakti?
                  </div>
                  {[
                    "Competitive market-linked pricing",
                    "Immediate payment terms available",
                    "Complete documentation support",
                    "ISO-certified processing facility",
                    "Basel Convention compliant import",
                    "Pan-India pickup network",
                  ].map((point) => (
                    <div key={point} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderBottom: "1px solid var(--border-light)" }}>
                      <span style={{ color: "var(--red-core)", fontSize: "10px", fontWeight: 700 }}>●</span>
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
