import React, { useState } from "react";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import LeadCalculator from "../components/LeadCalculator";
import { Download } from "lucide-react";
import { ASSETS } from "../assets/assetMap";

const productList = [
  {
    key: "pure",
    num: "01",
    name: "Refined / Pure Lead Ingots",
    grade: "IS 27 : 1992 / BS 334 : 1982",
    purity: "99.97% – 99.985% Pb",
    img: ASSETS.products.pureLead,
    overview:
      "Aadishakti manufactures Refined Lead Ingots utilising high-temperature secondary refining kettles. Ideal for battery cell grids, acid-storage structures, radiation shields, and high-pressure extrusion sheaths.",
    specs: [
      { elem: "Antimony (Sb)",  val: "0.001% max" },
      { elem: "Arsenic (As)",   val: "0.001% max" },
      { elem: "Tin (Sn)",       val: "0.001% max" },
      { elem: "Copper (Cu)",    val: "0.001% max" },
      { elem: "Bismuth (Bi)",   val: "0.015% max" },
      { elem: "Silver (Ag)",    val: "0.003% max" },
      { elem: "Iron (Fe)",      val: "0.001% max" },
      { elem: "Lead (Pb)",      val: "99.970% min" },
    ],
    packaging: "Bound with steel bands into 42 ingots per striped bundle (approx 1,000 Kg).",
  },
  {
    key: "alloy",
    num: "02",
    name: "Lead Antimony Alloys",
    grade: "CUSTOM COMPONENT SPEC",
    purity: "Antimony: 1.5% to 12.0% Sb",
    img: ASSETS.products.leadAlloys,
    overview:
      "Compounded alloys utilising hard antimonial components to enhance tensile strength and grid hardness of soft pure lead. Primarily manufactured for automotive grid plates and wheel ballast counterweights.",
    specs: [
      { elem: "Antimonial Grade 2.5%", val: "2.3% – 2.7% Sb" },
      { elem: "Antimonial Grade 3.0%", val: "2.8% – 3.2% Sb" },
      { elem: "Antimonial Grade 4.5%", val: "4.2% – 4.8% Sb" },
      { elem: "Total Impurities",       val: "0.05% max" },
      { elem: "Lead (Pb) Balance",      val: "Remaining %" },
    ],
    packaging: "Heavy-duty metallurgical bundles strapped with carbon steel bands.",
  },
  {
    key: "red",
    num: "03",
    name: "Red Lead Oxide",
    grade: "Pb₃O₄ / BATTERY & GLASS GRADE",
    purity: "Formula: Pb₃O₄ | Soft Orange-Red Powder",
    img: ASSETS.products.redLead,
    overview:
      "Fine orange-red lead oxide powder produced from high-purity ingots. Advanced cyclone baghouse filtration ensures exceptional chemical consistency for backup power batteries and crystal glass flux.",
    specs: [
      { elem: "Lead Dioxide (PbO₂)", val: "25% – 34%" },
      { elem: "Free Metallic Lead",  val: "0.05% max" },
      { elem: "Moisture Content",    val: "0.1% max" },
      { elem: "Oil Absorption",      val: "6 – 9 g/100g" },
    ],
    packaging: "25 Kg double-layer Polyethylene bags within woven HDPE outer sacks.",
  },
  {
    key: "grey",
    num: "04",
    name: "Grey Lead Oxide",
    grade: "2PbO·Pb / LEAD SUB-OXIDE",
    purity: "Formula: 2PbO·Pb | Grey Monoxide Powder",
    img: ASSETS.products.greyOxide,
    overview:
      "Electrochemical sub-monoxide powder manufactured by dry ball mill process. Essential active plate chemical forming negative electrodes inside automotive battery cell grids.",
    specs: [
      { elem: "Free Metallic Lead (Pb)", val: "28% – 32%" },
      { elem: "Lead Monoxide (PbO)",     val: "68% – 72%" },
      { elem: "Apparent Density",        val: "1.2 – 1.4 g/cc" },
      { elem: "Acid Absorption",         val: "180 – 210 mg/g" },
    ],
    packaging: "Hermetically sealed 25 Kg net Polyethylene bags within woven HDPE outer sacks.",
  },
];

export default function Products() {
  const [activeKey, setActiveKey] = useState("pure");
  const current = productList.find((p) => p.key === activeKey);

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="METALLURGICAL CATALOG" activePage="PRODUCTS" />

      {/* ── Product detail sections — one per product ── */}
      {productList.map((prod, idx) => (
        <section
          key={prod.key}
          id={prod.key}
          className={idx % 2 === 0 ? "section-padding" : "section-padding bg-steel-grid"}
          style={{ minHeight: "520px" }}
        >
          <ScrollReveal>
            {/* Photo band */}
            <div className="product-photo-band" style={{ marginBottom: "48px", overflow: "hidden", maxHeight: "340px" }}>
              <div style={{ overflow: "hidden" }}>
                <motion.img
                  src={prod.img}
                  alt={prod.name}
                  loading="lazy"
                  style={{ width: "100%", height: "340px", objectFit: "cover", display: "block" }}
                  whileInView={{ scale: 1 }}
                  initial={{ scale: 1.06 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
              <div style={{ background: "#111111", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--red-core)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>
                  {prod.num} / {prod.grade}
                </div>
                <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(22px, 3vw, 36px)", color: "#FFFFFF", lineHeight: 1.1, marginBottom: "12px" }}>
                  {prod.name}
                </h2>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--red-core)", marginBottom: "16px" }}>
                  {prod.purity}
                </div>
                <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.6 }}>
                  {prod.overview.substring(0, 120)}…
                </p>
              </div>
            </div>

            <div className="container">
              <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
                {/* Left — overview + specs */}
                <div>
                  <SectionLabel text={`// PRODUCT ${prod.num}`} />
                  <h3 style={{ fontWeight: 800, fontSize: "var(--fs-h3)", marginBottom: "16px" }}>Metallurgical Batch Analysis</h3>
                  <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "28px" }}>
                    {prod.overview}
                  </p>

                  <table className="spec-terminal-table">
                    <thead>
                      <tr>
                        <th>Element / Property</th>
                        <th>Analysis Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prod.specs.map((spec) => (
                        <tr key={spec.elem}>
                          <td className="property-name">{spec.elem}</td>
                          <td>{spec.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right — packaging + download */}
                <div>
                  <div className="corporate-card" style={{ padding: "28px", marginBottom: "20px", background: "#FFFFFF" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                      // PACKAGING & DISPATCH
                    </div>
                    <h5 style={{ fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>Export Quantities</h5>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.65 }}>{prod.packaging}</p>
                  </div>

                  <button
                    onClick={() => alert(`Technical datasheet for ${prod.name} will be emailed on request. Contact us at marketing@aadishakti.com`)}
                    className="btn-ghost-steel"
                    style={{ width: "100%", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "16px" }}
                  >
                    <Download size={16} /> Download Datasheet (PDF)
                  </button>

                  <div style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-primary)" }}>
                    Need a custom spec? <a href="/contact" style={{ color: "var(--red-core)", fontWeight: 600 }}>Request formal analysis →</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* ── Lead Purity Calculator ── */}
      <section className="section-padding" style={{ background: "#111111" }}>
        <div className="container">
          <ScrollReveal>
            <div className="grid-2" style={{ gridTemplateColumns: "1fr 380px", gap: "60px", alignItems: "center" }}>
              <div>
                <SectionLabel text="// INTERACTIVE TOOL" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "#FFFFFF", marginBottom: "20px" }}>
                  Battery Scrap to Lead Estimator
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "#888", lineHeight: 1.7, marginBottom: "24px" }}>
                  Procurement managers: estimate your pure lead recovery from battery scrap before committing
                  to a formal assessment. Adjust battery type and grade for instant output.
                </p>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.65 }}>
                  No competitor in the Indian secondary lead market offers this calculator. It's built to give
                  procurement teams a reliable first-pass estimate — saving time before formal lab analysis.
                </p>
              </div>
              <LeadCalculator />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
