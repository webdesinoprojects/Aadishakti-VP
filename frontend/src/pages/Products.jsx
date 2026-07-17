import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Building2 } from "lucide-react";
import { productsData } from "../data/products";

export default function Products() {
  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="PRODUCTS" activePage="PRODUCTS" />

      {/* ── Product Catalog Grid ── */}
      <section className="section-padding bg-steel-grid">
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// OUR PORTFOLIO" />
            <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "40px" }}>
              High-Purity Lead & Alloys
            </h2>
            
            <div className="grid-3" style={{ gap: "32px" }}>
              {productsData.map((prod) => (
                <div key={prod.key} className="corporate-card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                  <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                    <Link to={`/products/${prod.key}`}>
                      <img
                        src={prod.img}
                        alt={prod.name}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    </Link>
                    <div style={{ position: "absolute", top: 0, left: 0, padding: "8px 12px", background: "var(--red-core)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 700 }}>
                      {prod.num}
                    </div>
                  </div>
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--red-core)", letterSpacing: "0.12em", marginBottom: "8px" }}>
                      {prod.grade}
                    </div>
                    <Link to={`/products/${prod.key}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                        {prod.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, flex: 1, marginBottom: "24px" }}>
                      {prod.overview.substring(0, 100)}...
                    </p>
                    <Link to={`/products/${prod.key}`} className="btn-ghost-steel" style={{ textAlign: "center" }}>
                      View Full Specifications &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

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
