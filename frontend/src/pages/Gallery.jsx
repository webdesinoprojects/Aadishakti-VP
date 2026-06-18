import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import { useCms } from "../context/CmsContext";

export default function Gallery() {
  const { cms } = useCms();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract category from query params
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category") || "office";

  // Mock data fallback if cms.json isn't loaded yet
  const defaultGallery = {
    office: [
      "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.15.jpeg",
      "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.43.jpeg"
    ],
    plants: [
      "/gallery/plants/Mundra/Plant_Pic_02.jpeg",
      "/gallery/plants/Mundra/Rotary_1.jpeg",
      "/gallery/plants/Mundra/IMG_20251228_113451171_HDR_AE.jpg",
      "/gallery/plants/Mundra/14_18.jpg"
    ],
    events: [
      "/gallery/events/HPOW7738.JPG",
      "/gallery/events/LDJY9705.JPG",
      "/gallery/events/PMUD5812.JPG",
      "/gallery/events/XKFO7284.JPG"
    ],
    celebration: [
      "/gallery/celebration/HPOW7738.JPG",
      "/gallery/celebration/PMUD5812.JPG"
    ]
  };

  const galleryData = cms?.gallery || defaultGallery;
  
  const allCategories = [
    { id: "office", title: "Corporate Office" },
    { id: "plants", title: "Manufacturing Plants" },
    { id: "events", title: "Corporate Events" },
    { id: "celebration", title: "Celebrations & Festivals" }
  ];

  const currentImages = galleryData[activeCategory] || [];
  const currentTitle = allCategories.find(c => c.id === activeCategory)?.title || "Gallery";

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="OUR GALLERY" activePage="GALLERY" />

      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          
          <div className="gallery-layout">
            
            {/* Main Gallery Grid */}
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "var(--font-primary)", fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", textTransform: "uppercase" }}>
                  {currentTitle}
                </h2>
                <div style={{ height: "3px", width: "40px", background: "var(--red-core)", marginTop: "1rem" }} />
              </div>

              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.5rem"
                }}
              >
                {currentImages.map((src, idx) => (
                  <div key={idx} className="dominance-card" style={{ padding: 0, overflow: "hidden", height: "200px" }}>
                    <img 
                      src={src} 
                      alt={`${currentTitle} ${idx + 1}`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                ))}
                {currentImages.length === 0 && (
                  <p style={{ color: "var(--text-secondary)" }}>No images found for this category.</p>
                )}
              </motion.div>
            </div>

            {/* SIDEBAR: OTHER CATEGORIES */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "1rem" }}>
                BROWSE CATEGORIES
              </h3>
              
              {allCategories.map(cat => {
                const isActive = cat.id === activeCategory;
                // Get the first image as a thumbnail if available
                const thumb = galleryData[cat.id]?.[0] || '/hero-gallery.jpg';
                
                return (
                  <div 
                    key={cat.id}
                    onClick={() => navigate(`/gallery?category=${cat.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem",
                      background: isActive ? "var(--bg-secondary)" : "transparent",
                      border: "1px solid",
                      borderColor: isActive ? "var(--red-core)" : "var(--border-light)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "var(--text-muted)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "var(--border-light)";
                    }}
                  >
                    <div style={{ width: "60px", height: "60px", flexShrink: 0, overflow: "hidden", border: "1px solid var(--border-light)" }}>
                      <img src={thumb} alt={cat.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-primary)", fontSize: "14px", fontWeight: "600", color: isActive ? "var(--red-core)" : "var(--text-primary)", margin: 0 }}>
                        {cat.title}
                      </h4>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {galleryData[cat.id]?.length || 0} ITEMS
                      </span>
                    </div>
                  </div>
                )
              })}
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
