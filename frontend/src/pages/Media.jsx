import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import { useCms } from "../context/CmsContext";

export default function Media() {
  const { cms } = useCms();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract type from query params
  const searchParams = new URLSearchParams(location.search);
  const activeType = searchParams.get("type") || "blogs";
  const activeId = searchParams.get("id");

  // Mock data fallback if cms.json isn't loaded yet
  const defaultMedia = [
    { id: "1", type: "blogs", title: "The Future of Secondary Lead", date: "Oct 12, 2026", img: "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.15.jpeg", desc: "Exploring how sustainable battery recycling is changing the global supply chain." },
    { id: "2", type: "news", title: "Aadishakti Expands Mundra Plant", date: "Sep 28, 2026", img: "/gallery/plants/Mundra/Plant_Pic_02.jpeg", desc: "New rotary furnaces installed to boost pure lead output by 20%." },
    { id: "3", type: "events", title: "Annual Sustainability Summit", date: "Nov 05, 2026", img: "/gallery/events/PMUD5812.JPG", desc: "Join us for our yearly gathering of eco-conscious partners and suppliers." },
    { id: "4", type: "blogs", title: "Why BIS Certification Matters", date: "Aug 15, 2026", img: "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.43.jpeg", desc: "Understanding the rigorous standards behind IS 27:1992." }
  ];

  const mediaData = cms?.media || defaultMedia;
  const currentItems = mediaData.filter(m => m.type === activeType);
  const activeItem = activeId ? mediaData.find(m => m.id === activeId) : null;
  
  const types = [
    { id: "blogs", label: "BLOGS" },
    { id: "news", label: "NEWS" },
    { id: "events", label: "EVENTS" }
  ];

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="MEDIA & UPDATES" activePage="MEDIA" />

      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          
          {activeItem ? (
            <div className="reveal-item reveal-visible" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <button 
                onClick={() => navigate(`/media?type=${activeItem.type}`)}
                className="btn-ghost-steel"
                style={{ marginBottom: "2rem", border: "none", color: "var(--red-core)", padding: "0", cursor: "pointer" }}
              >
                ← BACK TO {activeItem.type.toUpperCase()}
              </button>

              <div style={{ width: "100%", height: "400px", marginBottom: "2rem", overflow: "hidden" }}>
                <img 
                  src={activeItem.img} 
                  alt={activeItem.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--red-core)", marginBottom: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                // {activeItem.date}
              </div>

              <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: "800", fontSize: "36px", color: "var(--text-primary)", marginBottom: "2rem", lineHeight: 1.2 }}>
                {activeItem.title}
              </h2>

              <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8", marginBottom: "2rem" }}>
                {activeItem.desc}
              </p>
            </div>
          ) : (
            <>
              {/* Tab Controls */}
              <div style={{ display: "flex", gap: "1rem", marginBottom: "4rem", flexWrap: "wrap", justifyContent: "center" }}>
                {types.map(t => (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/media?type=${t.id}`)}
                    style={{
                      backgroundColor: activeType === t.id ? "var(--red-core)" : "transparent",
                      color: activeType === t.id ? "#fff" : "var(--text-primary)",
                      border: "1px solid",
                      borderColor: activeType === t.id ? "var(--red-core)" : "var(--border-light)",
                      padding: "12px 32px",
                      fontFamily: "var(--font-primary)",
                      fontWeight: "600",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Grid Layout for Media Items */}
              <motion.div 
                key={activeType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid-3" 
                style={{ gap: "2rem" }}
              >
                {currentItems.map(item => (
                  <div 
                    key={item.id} 
                    className="dominance-card" 
                    onClick={() => navigate(`/media?type=${item.type}&id=${item.id}`)}
                    style={{ display: "flex", flexDirection: "column", padding: "0", overflow: "hidden", cursor: "pointer" }}
                  >
                    <div style={{ height: "200px", width: "100%", borderBottom: "1px solid var(--border-light)", overflow: "hidden" }}>
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} 
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>
                    <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--red-core)", marginBottom: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        // {item.date}
                      </div>
                      <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.4 }}>
                        {item.title}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "1.5rem", flex: 1 }}>
                        {item.desc}
                      </p>
                      <button className="btn-ghost-steel" style={{ padding: "8px 16px", alignSelf: "flex-start", fontSize: "11px", color: "var(--red-core)", borderColor: "var(--border-light)", cursor: "pointer" }}>
                        READ MORE →
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
              
              {currentItems.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>
                  <p>No {activeType} available at the moment.</p>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
}
