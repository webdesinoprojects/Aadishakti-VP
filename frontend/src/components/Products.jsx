import React, { useState } from "react";
import { Download } from "lucide-react";

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState("pure");

  const productData = {
    pure: {
      name: "Refined / Pure Lead Ingots",
      subtitle: "High Purity Secondary Smelted Ingots",
      img: "/product-pure-lead.png",
      purity: "99.97% - 99.985% Pb",
      overview: "Aadishakti Group manufactures high-purity Refined Lead Ingots utilizing cutting-edge secondary lead smelting and refining kettles. Automated casting systems ensure consistent ingot sizes, minimal dross formation, and a perfectly smooth top surface.",
      specs: [
        { elem: "Antimony (Sb)", val: "0.001% max" },
        { elem: "Arsenic (As)", val: "0.001% max" },
        { elem: "Tin (Sn)", val: "0.001% max" },
        { elem: "Copper (Cu)", val: "0.001% max" },
        { elem: "Bismuth (Bi)", val: "0.015% max" },
        { elem: "Silver (Ag)", val: "0.003% max" },
        { elem: "Iron (Fe)", val: "0.001% max" },
        { elem: "Lead (Pb)", val: "99.970% min" },
      ],
      applications: [
        "Automotive & industrial battery manufacturing",
        "Radiation shielding panels",
        "Cable sheathing & high-pressure extrusions",
        "Specialty chemicals & ballast weights",
      ],
      packaging: "Securely stacked and bound with high-strength metal straps into 42 ingots per striped bundle (approx 1 MT). Designed for safe handling and sea transit.",
    },
    alloy: {
      name: "Lead Alloys",
      subtitle: "Antimonial & Calcium Lead Alloys",
      img: "/product-lead-alloy.jpg",
      purity: "Antimony: 1% to 15%+",
      overview: "AADISHAKTI specializes in custom-compounded Lead Alloys including Antimonial Lead (grades: 2.5%, 3.0%, 4.5% Sb), Calcium-Lead, and Tin-based Alloys. Element additions enhance tensile strength, hardness, and mechanical longevity of pure lead.",
      specs: [
        { elem: "Antimonial Grade 2.5%", val: "2.3% - 2.7% Sb" },
        { elem: "Antimonial Grade 3.0%", val: "2.8% - 3.2% Sb" },
        { elem: "Antimonial Grade 4.5%", val: "4.2% - 4.8% Sb" },
        { elem: "Impurities Total", val: "0.05% max" },
      ],
      applications: [
        "Lead-acid storage battery grid plates",
        "Wheel balancing weights & heavy industrial ballasts",
        "Corrosion-resistant chemical storage tanks",
        "Ammunition & security ballast applications",
      ],
      packaging: "Standard metallurgical bundles strapped with heavy-duty steel bands. Customized weights available upon request.",
    },
    red: {
      name: "Red Lead Oxide",
      subtitle: "Formula: Pb₃O₄ | Fine Orange-Red Powder",
      img: "/product-red-lead.jpg",
      purity: "High Purity Battery/Glass Grade",
      overview: "Produced from minimum 99.97% purity lead ingots under strict thermal oxidation parameters. The facility integrates dust extraction plants, conveyors, pulverizers, and cyclone bag-house filtration units, yielding highly consistent chemical properties.",
      specs: [
        { elem: "Lead Dioxide (PbO₂)", val: "25% - 34%" },
        { elem: "Free Metallic Lead", val: "0.05% max" },
        { elem: "Moisture Content", val: "0.1% max" },
        { elem: "Oil Absorption", val: "6 - 9 g/100g" },
      ],
      applications: [
        "Active plate materials in backup power batteries",
        "Anti-corrosive priming paints for heavy steel structures",
        "Fireworks oxidizing agent & pyrotechnics",
        "Optical crystal glass & ceramic glaze flux",
      ],
      packaging: "Standard 25 Kg net dual-layer Polyethylene liners within outer woven HDPE sacks, or bulk 50 Kg net sturdy corrugated boxes.",
    },
    grey: {
      name: "Grey Lead Oxide",
      subtitle: "Formula: 2PbO·Pb | Lead Sub Oxide",
      img: "/product-grey-oxide.jpg",
      purity: "Purity: 99.98% Pure Lead Input",
      overview: "Commonly known as Grey Oxide, this material is produced through controlled dry ball mill processes. It consists of a precise stoichiometric mixture of lead monoxide and finely dispersed free metallic lead particles, designed for electrochemical cell activity.",
      specs: [
        { elem: "Free Metallic Lead (Pb)", val: "28% - 32%" },
        { elem: "Lead Monoxide (PbO)", val: "68% - 72%" },
        { elem: "Apparent Density", val: "1.2 - 1.4 g/cc" },
        { elem: "Acid Absorption", val: "180 - 210 mg/g" },
      ],
      applications: [
        "Primary active chemical material for battery plates",
        "Durable industrial paints & weatherproofing topcoats",
        "Refractive flux in specialized glass manufacturing",
        "Glazing agent for high-strength ceramic tiles",
      ],
      packaging: "Airtight 25 Kg net Polyethylene inner liners with high-strength outer HDPE woven sacks, palletized and shrink-wrapped.",
    },
  };

  const current = productData[selectedProduct];

  return (
    <section id="products" className="section-padding">
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// PRODUCT PORTFOLIO</div>
        <h2 className="section-title-large">METALLURGICAL ELEMENTS</h2>

        {/* Tab Buttons (Rajdhani Upper Tracked) */}
        <div className="grid-4" style={{ marginBottom: "4rem" }}>
          {Object.keys(productData).map((key) => (
            <div
              key={key}
              onClick={() => setSelectedProduct(key)}
              style={{
                background: selectedProduct === key ? "var(--color-iron)" : "var(--color-forge)",
                border: "1px solid var(--color-steel)",
                borderLeft: selectedProduct === key ? "3px solid var(--color-scarlet)" : "1px solid var(--color-steel)",
                padding: "1.5rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-left-color var(--transition-cubic)",
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-subheading)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  fontSize: "14px",
                  letterSpacing: "0.15em",
                  color: selectedProduct === key ? "var(--color-white)" : "var(--color-silver)",
                }}
              >
                {productData[key].name}
              </h4>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-ash)" }}>
                {productData[key].purity}
              </span>
            </div>
          ))}
        </div>

        {/* Asymmetric Product Details Block */}
        <div className="grid-2" style={{ gap: "4rem", alignItems: "start" }}>
          
          {/* Left Column: Image, Description, Packaging */}
          <div>
            {/* Image display */}
            <div
              style={{
                height: "360px",
                background: "var(--color-iron)",
                border: "1px solid var(--color-steel)",
                borderLeft: "3px solid var(--color-scarlet)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <img
                src={current.img}
                alt={current.name}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>

            <p style={{ color: "var(--color-platinum)", fontSize: "var(--fs-body)", lineHeight: "1.7", marginBottom: "2rem" }}>
              {current.overview}
            </p>

            <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
              <h5 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.15em", color: "var(--color-white)", marginBottom: "0.5rem" }}>
                PACKAGING AUDIT:
              </h5>
              <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.5" }}>{current.packaging}</p>
            </div>
          </div>

          {/* Right Column: Bloomberg Specs & Applications */}
          <div>
            <h4 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-white)", marginBottom: "1rem" }}>
              ANALYTICAL CERTIFICATE
            </h4>

            {/* Bloomberg Table */}
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>ELEMENT/ATTRIBUTE</th>
                  <th>SPECIFICATION VALUE</th>
                </tr>
              </thead>
              <tbody>
                {current.specs.map((s, idx) => (
                  <tr key={idx}>
                    <td className="prod-title">{s.elem}</td>
                    <td>{s.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Industrial uses */}
            <h4 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-white)", marginTop: "3rem", marginBottom: "1rem" }}>
              VERIFIED APPLICATIONS
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-platinum)", marginBottom: "2.5rem" }}>
              {current.applications.map((app, idx) => (
                <li key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "var(--color-scarlet)" }}></span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => alert(`Technical brochure for ${current.name} is being prepared for transboundary secure transfer.`)}
              className="btn-forge-submit"
            >
              DOWNLOAD METALLURGICAL DATASHEET (PDF)
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
