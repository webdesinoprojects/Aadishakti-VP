import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import { productsData } from "../data/products";
import { Download } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  
  // Find the product by its key (slug)
  const product = productsData.find(p => p.key === slug);

  // If no product matches the slug, redirect to main products page
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title={product.name.toUpperCase()} activePage={product.name.toUpperCase()} />

      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div className="product-layout" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "64px", alignItems: "start" }}>
            
            {/* Left Col: Image & Key Info */}
            <div className="product-image-col">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="image-wrapper" 
                style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", marginBottom: "32px", borderRadius: "2px" }}
              >
                <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 0, left: 0, padding: "16px", background: "var(--red-core)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 700 }}>
                  {product.num}
                </div>
              </motion.div>

              <div style={{ padding: "32px", background: "#fdfdfd", border: "1px solid var(--border-light)" }}>
                <SectionLabel text="// GRADE & PURITY" />
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Grade</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>{product.grade}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Purity / Formula</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{product.purity}</div>
                </div>
              </div>
            </div>

            {/* Right Col: Details & Specs */}
            <div className="product-content-col">
              <SectionLabel text={`// ${product.name}`} />
              <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--text-primary)", marginBottom: "24px", lineHeight: 1.1 }}>
                {product.name}
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "48px" }}>
                {product.overview}
              </p>

              <SectionLabel text="// TECHNICAL SPECIFICATIONS" />
              <div style={{ marginBottom: "48px", background: "#fff", border: "1px solid var(--border-light)", padding: "1px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={i} style={{ borderBottom: i !== product.specs.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                        <td style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-primary)", width: "40%", background: "#fafafa" }}>
                          {spec.elem}
                        </td>
                        <td style={{ padding: "16px 24px", color: "var(--text-secondary)" }}>
                          {spec.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SectionLabel text="// PACKAGING" />
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "48px", padding: "24px", background: "#fafafa", borderLeft: "3px solid var(--red-core)" }}>
                {product.packaging}
              </p>

              <SectionLabel text="// INDUSTRY APPLICATIONS" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "48px" }}>
                {product.applications.map((app, i) => (
                  <div key={i} style={{ padding: "8px 16px", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                    {app}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <Link to="/contact" className="btn-solid-red" style={{ height: "48px", paddingInline: "32px", fontSize: "13px" }}>
                  ENQUIRE NOW &rarr;
                </Link>
                <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "48px", paddingInline: "24px", background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <Download size={16} /> DATA SHEET
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
