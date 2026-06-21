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

  const galleryData = Array.isArray(cms?.gallery) ? cms.gallery : defaultGallery;
  
  const allCategories = [
    { id: "office", title: "Corporate Office" },
    { id: "plants", title: "Manufacturing Plants" },
    { id: "events", title: "Corporate Events" },
    { id: "celebration", title: "Celebrations & Festivals" }
  ];

  const currentImages = Array.isArray(galleryData) ? galleryData.filter(item => item.category === activeCategory) : (galleryData[activeCategory] || []);
  const currentTitle = allCategories.find(c => c.id === activeCategory)?.title || "Gallery";

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="OUR GALLERY" activePage="GALLERY" />

            <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          
          {/* Tab Controls */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "4rem", flexWrap: "wrap", justifyContent: "center" }}>
            {allCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/gallery?category=${cat.id}`)}
                style={{
                  backgroundColor: activeCategory === cat.id ? "var(--red-core)" : "transparent",
                  color: activeCategory === cat.id ? "#fff" : "var(--text-primary)",
                  border: "1px solid",
                  borderColor: activeCategory === cat.id ? "var(--red-core)" : "var(--border-light)",
                  padding: "12px 32px",
                  fontFamily: "var(--font-primary)",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Main Gallery Grid */}
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
            {currentImages.map((item, idx) => {
              const imgSrc = typeof item === 'string' ? item : (item.image || item.img);
              return (
              <div key={idx} className="dominance-card" style={{ padding: 0, overflow: "hidden", height: "200px" }}>
                <img 
                  src={imgSrc} 
                  alt={`${currentTitle} ${idx + 1}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            )})}
            {currentImages.length === 0 && (
              <p style={{ color: "var(--text-secondary)" }}>No images found for this category.</p>
            )}
          </motion.div>

        </div>
      </section>
    </div>
  );
}