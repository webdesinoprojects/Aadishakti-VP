import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCms } from "../context/CmsContext";

export default function Import() {
  const { cms } = useCms();
  const [activeTab, setActiveTab] = useState(0);

  // Fallback data structure if CMS doesn't have it yet
  const defaultData = {
    title: "TRANSBOUNDARY MATERIAL SOURCING",
    overview: {
      paragraphs: [
        "Aadishakti Metal Recycling Pvt. Ltd. actively sources raw materials and industrial products from global markets to support its manufacturing operations and customer requirements.",
        "The company imports drained lead-acid battery scrap and used battery materials in bulk quantities from suppliers worldwide. These materials are responsibly processed through Aadishakti's recycling infrastructure to recover valuable metals and contribute to the circular economy.",
        "With a strong focus on sustainable recycling, transparent transactions, and long-term supplier partnerships, Aadishakti ensures competitive pricing and reliable procurement of recyclable battery materials. The company also provides bulk collection and logistics support for large consignments of scrap batteries, including car batteries, inverter batteries, solar batteries, and other lead-based batteries."
      ],
      image: "/plant/BBSU.jpeg"
    },
    tabs: [
      {
        id: "battery",
        label: "Scrap Battery Imports",
        title: "Scrap Battery Imports",
        intro: "Aadishakti purchases and imports various types of lead-based battery scrap for recycling, including:",
        items: [
          "Drained Lead-Acid Battery Scrap",
          "Used Car Battery Scrap",
          "Inverter Batteries",
          "Solar Batteries",
          "Industrial Lead-Based Batteries"
        ],
        summary: "The company procures large bulk quantities from global suppliers, ensuring responsible recycling and efficient metal recovery.",
        highlightsTitle: "Key highlights:",
        highlights: [
          "Global sourcing of battery scrap",
          "Competitive pricing for suppliers",
          "Reliable long-term procurement partnerships",
          "Sustainable recycling and disposal practices"
        ]
      }
    ],
    contact: {
      title: "Import Contact",
      subtitle: "For international suppliers or scrap battery procurement inquiries:",
      name: "Mr. Rajesh Mehta",
      mobile: "+91-9045585676",
      email: "rajesh.mehta@aadishakti.com"
    }
  };

  const importData = cms?.importPage || defaultData;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "100vh" }}>
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// PROCUREMENT & IMPORTS</div>
        <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>{importData.title}</h2>

        {/* Introduction */}
        <motion.div 
          className="dominance-card reveal-item" 
          style={{ marginBottom: "4rem", borderLeft: "3px solid var(--red-core)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid-2" style={{ alignItems: "center", gap: "4rem" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--red-core)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                OVERVIEW
              </span>
              <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", marginTop: "0.5rem", marginBottom: "1rem" }}>
                GLOBAL SUPPLY CHAIN
              </h3>
              {importData.overview.paragraphs.map((p, idx) => (
                <p key={idx} style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "1.2rem" }}>
                  {p}
                </p>
              ))}
            </div>
            <div style={{ height: "100%", minHeight: "300px", border: "1px solid var(--border-light)", position: "relative", overflow: "hidden" }}>
              <img src={importData.overview.image} alt="Scrap Processing" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            </div>
          </div>
        </motion.div>

        {/* Tab Controls (Rajdhani Uppercase) */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          {importData.tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className="btn-spark"
              style={{
                backgroundColor: activeTab === idx ? "var(--red-core)" : "transparent",
                color: activeTab === idx ? "#fff" : "var(--text-primary)",
                border: "1px solid",
                borderColor: activeTab === idx ? "var(--red-core)" : "var(--border-light)",
                transform: "none",
                cursor: "pointer",
                padding: "12px 24px",
                fontFamily: "var(--font-primary)",
                fontWeight: "600",
                letterSpacing: "0.1em"
              }}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Asymmetric Split Layout for Content and Contact Desk */}
        <div className="grid-2" style={{ gap: "4rem", alignItems: "stretch" }}>
          
          {/* Left: Tab Panel Details */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="dominance-card" 
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            {importData.tabs[activeTab] && (
              <div>
                <h4 style={{ fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "1rem" }}>
                  {importData.tabs[activeTab].title}
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  {importData.tabs[activeTab].intro}
                </p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "2rem", padding: 0 }}>
                  {importData.tabs[activeTab].items.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <Check size={16} style={{ color: "var(--red-core)", flexShrink: 0, marginTop: "2px" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  {importData.tabs[activeTab].summary}
                </p>

                <h5 style={{ fontFamily: "var(--font-primary)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--red-core)", textTransform: "uppercase", marginBottom: "1rem" }}>
                  {importData.tabs[activeTab].highlightsTitle}
                </h5>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "14px", color: "var(--text-secondary)", padding: 0 }}>
                  {importData.tabs[activeTab].highlights.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red-core)", marginTop: "6px", flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Right: Import Desk Contact */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              borderLeft: "3px solid var(--red-core)",
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 style={{ fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {importData.contact.title}
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "2rem" }}>
                {importData.contact.subtitle}
              </p>

              <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-light)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h5 style={{ fontFamily: "var(--font-primary)", fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                    {importData.contact.name}
                  </h5>
                </div>
                
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span><strong>Mobile:</strong> {importData.contact.mobile}</span>
                  <span><strong>Email:</strong> <a href={`mailto:${importData.contact.email}`} style={{ textDecoration: "none", color: "var(--red-core)" }}>{importData.contact.email}</a></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.open(`mailto:${importData.contact.email}?subject=Transboundary%20Lead%20Scrap%20Sourcing`, "_blank");
              }}
              className="cta"
              style={{ marginTop: "2rem", width: "100%", border: "none", cursor: "pointer", padding: "14px", display: "inline-block", textAlign: "center" }}
            >
              ENGAGE PROCUREMENT DESK
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
