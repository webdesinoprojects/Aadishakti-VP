import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Download, Building2 } from "lucide-react";
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
      { elem: "Lead (Pb)",      val: "99.970% min" },
      { elem: "Antimony (Sb)",  val: "0.001% max" },
      { elem: "Arsenic (As)",   val: "0.001% max" },
      { elem: "Tin (Sn)",       val: "0.001% max" },
      { elem: "Copper (Cu)",    val: "0.001% max" },
      { elem: "Dimensions",     val: "Custom / Approx 25kg Ingots" },
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
      { elem: "Lead (Pb) Balance",      val: "Remaining %" },
      { elem: "Dimensions",             val: "Custom / Approx 25kg Ingots" },
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
      { elem: "Dimensions / Mesh",   val: "300 Mesh / 10-15 µm" },
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
      { elem: "Dimensions / Mesh",       val: "300 Mesh / 10-15 µm" },
    ],
    packaging: "Hermetically sealed 25 Kg net Polyethylene bags within woven HDPE outer sacks.",
  },
  {
    key: "sheet",
    num: "05",
    name: "Lead Sheet & Lead Plate",
    grade: "RADIATION SHIELDING & INDUSTRIAL",
    purity: "99.97% Pb / Alloy Options Available",
    img: ASSETS.megaMenuPhoto || "", 
    overview:
      "Highly malleable lead sheets and thick lead plates designed for acoustic insulation, medical radiation shielding, chemical tank linings, and roofing applications.",
    specs: [
      { elem: "Purity",             val: "99.97% min Pb" },
      { elem: "Sheet Dimensions",   val: "Thickness: 0.5mm - 10mm" },
      { elem: "Plate Dimensions",   val: "Thickness: 10mm - 50mm" },
      { elem: "Customization",      val: "Cut-to-size available" },
    ],
    packaging: "Rolled on wooden cores or flat-packed on heavy duty pallets depending on thickness.",
  },
  {
    key: "balls-anodes",
    num: "06",
    name: "Lead Balls & Lead Anodes",
    grade: "MILLING & ELECTROWINNING",
    purity: "Pure / Alloy Variants",
    img: ASSETS.mundraPlant ? ASSETS.mundraPlant[0] : "",
    overview:
      "Precision-cast lead balls used in fine chemical grinding ball mills, alongside high-performance extruded/cast lead anodes for electroplating and electrowinning cells.",
    specs: [
      { elem: "Ball Dimensions",    val: "12mm to 50mm Diameter" },
      { elem: "Anode Dimensions",   val: "Custom Lengths & Profiles" },
      { elem: "Alloys Available",   val: "Tin, Silver, Antimony" },
    ],
    packaging: "Drums for lead balls; strapped wooden crates for anodes.",
  },
  {
    key: "custom",
    num: "07",
    name: "Alloy Dust (Customised Product)",
    grade: "SPECIALTY LEAD DUST",
    purity: "As per Client Specification",
    img: ASSETS.roorkeeOffice ? ASSETS.roorkeeOffice[0] : "",
    overview:
      "Customised lead alloy dust tailored for specialized chemical reactions, powder metallurgy, and proprietary industrial friction formulations. Engineered to precise particle size distributions.",
    specs: [
      { elem: "Particle Size",      val: "Custom (10 µm to 500 µm)" },
      { elem: "Composition",        val: "Custom Alloy Formula" },
      { elem: "Dimensions / Mesh",  val: "As per client requirement" },
    ],
    packaging: "Sealed nitrogen-purged UN-rated steel drums or bulk bags.",
  },
  {
    key: "plastic",
    num: "08",
    name: "Plastic Granules",
    grade: "PP COPOLYMER GRANULES",
    purity: "High Impact Battery Grade",
    img: ASSETS.mundraPlant ? ASSETS.mundraPlant[4] : "",
    overview:
      "Recycled and compounded Polypropylene (PP) copolymer granules derived from battery casings. Extruded and pelletized for high-impact strength, suitable for molding new battery containers and automotive components.",
    specs: [
      { elem: "Melt Flow Index (MFI)", val: "2.0 - 5.0 g/10min" },
      { elem: "Impact Strength",       val: "High / Customisable" },
      { elem: "Dimensions",            val: "Standard Pellet Size (3mm)" },
      { elem: "Color",                 val: "Black / Grey / Custom" },
    ],
    packaging: "25 Kg bags or 1 MT Jumbo Bags.",
  }
];

export default function Products() {

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
                        <th>Analysis Value / Detail</th>
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
                    <h5 style={{ fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>Export Quantities & Formats</h5>
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
                    Need a custom spec? <a href="/custom-alloy" style={{ color: "var(--red-core)", fontWeight: 600 }}>Request formal analysis →</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* ── Industry Categories ── */}
      <section className="section-padding" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// INDUSTRIES WE SERVE" />
            <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "40px" }}>
              Global Applications
            </h2>
            <div className="grid-3" style={{ gap: "24px" }}>
              {[
                { title: "Energy Storage", desc: "Automotive, industrial, and UPS battery manufacturing." },
                { title: "Radiation Shielding", desc: "Medical X-ray rooms and nuclear facility protection." },
                { title: "Chemical Processing", desc: "Corrosion-resistant tank linings and piping." },
                { title: "Construction", desc: "Roofing sheets, acoustic soundproofing, and ballasts." },
                { title: "Glass & Ceramics", desc: "Crystal glass manufacturing and specialty glazes." },
                { title: "Plastics & Molding", desc: "Automotive components and robust battery casings." },
              ].map((ind, i) => (
                <div key={i} className="corporate-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Building2 size={32} color="var(--red-core)" strokeWidth={1.5} />
                  <h4 style={{ fontWeight: 800, fontSize: "16px", color: "var(--text-primary)" }}>{ind.title}</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{ind.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
