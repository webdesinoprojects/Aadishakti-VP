import React, { useState } from "react";
import { X } from "lucide-react";

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [lightboxImg, setLightboxImg] = useState(null);

  const galleryItems = [
    { src: "/plant/Plant Pic 02.jpeg", category: "plant", title: "Mundra Plant Smelting Facility" },
    { src: "/plant/BBSU.jpeg", category: "plant", title: "Automated Battery Breaking & Separation Unit" },
    { src: "/plant/Rotary 1.jpeg", category: "plant", title: "Rotary Smelting Furnace Operational" },
    { src: "/plant/Pic 01.jpeg", category: "plant", title: "Ingot Casting Automated Line" },
    { src: "/plant/WhatsApp Image 2026-01-14 at 13.39.14.jpeg", category: "plant", title: "Mundra Environmental Air Filter System" },
    { src: "/plant/12 (2).jpeg", category: "plant", title: "Advanced Lead Refining Kettle" },
    { src: "/plant/12 (6).jpeg", category: "plant", title: "Metallurgical Slag Treatment Station" },
    { src: "/plant/R1 (8).jpeg", category: "plant", title: "High-Purity Lead Ingots Inventory" },
    
    { src: "/office/WhatsApp Image 2026-03-11 at 16.03.43.jpeg", category: "office", title: "Corporate Meeting Room - Roorkee" },
    { src: "/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg", category: "office", title: "Technical Engineering Office" },
    
    { src: "/images/XKFO7284.JPG", category: "event", title: "Annual General Meeting 2025" },
    { src: "/images/LDJY9705.JPG", category: "event", title: "Safety Awareness & Compliance Seminar" },
    { src: "/images/PMUD5812.JPG", category: "event", title: "Eco-Recycling Achievement Award" },
  ];

  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <section id="gallery" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// PHOTO ARCHIVE</div>
        <h2 className="section-title-large">INFRASTRUCTURE PORTFOLIO</h2>

        {/* Filter Switcher (Rajdhani upper tracked) */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          {["all", "plant", "office", "event"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="btn-spark"
              style={{
                backgroundColor: filter === cat ? "var(--color-scarlet)" : "var(--color-iron)",
                border: "1px solid var(--color-steel)",
                padding: "0.5rem 1.5rem",
                fontSize: "12px",
                transform: "none",
              }}
            >
              {cat === "all" ? "Show All" : cat === "plant" ? "Smelting Plants" : cat === "office" ? "Corporate Offices" : "Events & Awards"}
            </button>
          ))}
        </div>

        {/* Tight Masonry Grid */}
        <div className="masonry-gallery">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="gallery-card"
              onClick={() => setLightboxImg(item.src)}
            >
              <img src={item.src} alt={item.title} className="gallery-img" />
              <div className="gallery-overlay">
                <div className="gallery-caption">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Pop-up */}
        {lightboxImg && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(12px)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-steel)",
                borderRadius: "50%",
                padding: "0.5rem",
                color: "white",
                cursor: "pointer",
              }}
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImg}
              alt="Expanded view"
              style={{ maxWidth: "100%", maxHeight: "90vh", border: "1px solid var(--color-steel)" }}
            />
          </div>
        )}

      </div>
    </section>
  );
}
