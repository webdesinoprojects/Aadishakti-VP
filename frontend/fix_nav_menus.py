import os
import re

nav_path = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src\components\Navbar.jsx"

with open(nav_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Insert megaContent dict and state variables
mega_content_str = """
const megaContent = {
  media: {
    "Blogs": { img: ASSETS.gallery[0] || ASSETS.megaMenuPhoto, eyebrow: "LATEST INSIGHTS", title: "Read our latest technical blogs on lead recycling." },
    "News": { img: ASSETS.gallery[1] || ASSETS.megaMenuPhoto, eyebrow: "COMPANY NEWS", title: "Stay updated with Aadishakti's latest announcements." },
    "Events": { img: ASSETS.gallery[2] || ASSETS.megaMenuPhoto, eyebrow: "INDUSTRY EVENTS", title: "Join us at upcoming global battery conferences." }
  },
  gallery: {
    "Office": { img: ASSETS.roorkeeOffice[0] || ASSETS.megaMenuPhoto, eyebrow: "CORPORATE HUB", title: "A glimpse inside our modern corporate headquarters." },
    "Plants": { img: ASSETS.mundraPlant[0] || ASSETS.megaMenuPhoto, eyebrow: "REFINING INFRASTRUCTURE", title: "State-of-the-art lead smelting and refining facilities." },
    "Events": { img: ASSETS.gallery[3] || ASSETS.megaMenuPhoto, eyebrow: "TEAM ENGAGEMENT", title: "Highlights from our recent team building and conferences." },
    "Celebration": { img: ASSETS.gallery[0] || ASSETS.megaMenuPhoto, eyebrow: "FESTIVITIES", title: "Celebrating success and culture at Aadishakti." }
  },
  careers: {
    "Factory": { img: ASSETS.mundraPlant[4] || ASSETS.megaMenuPhoto, eyebrow: "PLANT OPERATIONS", title: "Drive industrial excellence at our Mundra and Roorkee plants." },
    "Office": { img: ASSETS.roorkeeOffice[1] || ASSETS.megaMenuPhoto, eyebrow: "CORPORATE ROLES", title: "Shape the future of sustainable recycling from our HQ." }
  }
};
"""

content = content.replace("export default function Navbar() {", mega_content_str + "\nexport default function Navbar() {")

state_vars_str = """
  const [hoveredMedia, setHoveredMedia] = useState("Blogs");
  const [hoveredGallery, setHoveredGallery] = useState("Office");
  const [hoveredCareers, setHoveredCareers] = useState("Factory");
"""
content = content.replace("const location = useLocation();", state_vars_str + "  const location = useLocation();")

# 2. Update Media Dropdown
media_old = """            <div className={`mega-dropdown ${mediaOpen ? "open" : ""}`} style={{ width: '300px', minWidth: '300px' }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                {mediaLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item">{item.label}</Link>
                ))}
              </div>
            </div>"""

media_new = """            <div className={`mega-dropdown ${mediaOpen ? "open" : ""}`}>
              <div className="mega-left">
                {mediaLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredMedia(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={megaContent.media[hoveredMedia].img} alt={hoveredMedia} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {megaContent.media[hoveredMedia].eyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {megaContent.media[hoveredMedia].title}
                  </p>
                </div>
              </div>
            </div>"""
content = content.replace(media_old, media_new)

# 3. Update Gallery Dropdown
gallery_old = """            <div className={`mega-dropdown ${galleryOpen ? "open" : ""}`} style={{ width: '300px', minWidth: '300px' }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                {galleryLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item">{item.label}</Link>
                ))}
              </div>
            </div>"""

gallery_new = """            <div className={`mega-dropdown ${galleryOpen ? "open" : ""}`}>
              <div className="mega-left">
                {galleryLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredGallery(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={megaContent.gallery[hoveredGallery].img} alt={hoveredGallery} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {megaContent.gallery[hoveredGallery].eyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {megaContent.gallery[hoveredGallery].title}
                  </p>
                </div>
              </div>
            </div>"""
content = content.replace(gallery_old, gallery_new)

# 4. Update Careers Dropdown
careers_old = """            <div className={`mega-dropdown ${careersOpen ? "open" : ""}`} style={{ width: '250px', minWidth: '250px', left: 'auto', right: 0 }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                <Link to="/careers?category=factory" className="drop-item">Factory</Link>
                <Link to="/careers?category=office" className="drop-item">Office</Link>
              </div>
            </div>"""

careers_new = """            <div className={`mega-dropdown ${careersOpen ? "open" : ""}`} style={{ left: 'auto', right: 0 }}>
              <div className="mega-left">
                <Link to="/careers?category=factory" className="drop-item" onMouseEnter={() => setHoveredCareers("Factory")}>Factory</Link>
                <Link to="/careers?category=office" className="drop-item" onMouseEnter={() => setHoveredCareers("Office")}>Office</Link>
              </div>
              <div className="mega-right">
                <img src={megaContent.careers[hoveredCareers].img} alt={hoveredCareers} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {megaContent.careers[hoveredCareers].eyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {megaContent.careers[hoveredCareers].title}
                  </p>
                </div>
              </div>
            </div>"""
content = content.replace(careers_old, careers_new)


with open(nav_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Navbar.jsx mega menus updated!")
