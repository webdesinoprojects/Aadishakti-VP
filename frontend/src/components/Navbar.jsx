import { useEffect, useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ASSETS } from "../assets/assetMap";
import { useCms } from "../context/CmsContext";
import { DEFAULT_SITE_NAVIGATION, mergeCmsContent } from "../data/publicCmsDefaults";

const companyLinks = [
  { to: "/about",                    label: "About Us" },
  { to: "/businesses",               label: "Businesses" },
  { to: "/businesses?plant=mundra",  label: "AGRPL — Mundra Plant",  sub: true },
  { to: "/businesses?plant=roorkee", label: "AMRPL — Roorkee Plant", sub: true },
];

const esgLinks = [
  { to: "/sustainability?tab=environment", label: "Environment & Climate" },
  { to: "/sustainability?tab=social",      label: "Corporate Social Responsibility" },
  { to: "/sustainability?tab=governance",  label: "Governance & Policies" },
  { to: "/sustainability?tab=reports",     label: "Sustainability Reports" },
];

const mediaLinks = [
  { to: "/media?type=blogs", label: "Blogs" },
  { to: "/media?type=news",  label: "News" },
];

const galleryLinks = [
  { to: "/gallery?category=office",      label: "Office" },
  { to: "/gallery?category=plants",      label: "Plants" },
  { to: "/gallery?category=events",      label: "Events" },
  { to: "/gallery?category=celebration", label: "Celebration" },
];

export default function Navbar() {
  const { cms } = useCms();
  const navigation = mergeCmsContent(DEFAULT_SITE_NAVIGATION, cms?.siteNavigation);
  const navCtaText = navigation.ctaText;
  const liveCompanyLinks = navigation.companyLinks || companyLinks;
  const liveEsgLinks = navigation.esgLinks || esgLinks;
  const liveMediaLinks = navigation.mediaLinks || mediaLinks;
  const liveGalleryLinks = navigation.galleryLinks || galleryLinks;
  const liveCareerLinks = navigation.careerLinks || [];
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [esgOpen, setEsgOpen]         = useState(false);
  const [mediaOpen, setMediaOpen]     = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [mobileCo, setMobileCo]       = useState(false);
  const [mobileEsg, setMobileEsg]     = useState(false);
  const [mobileMedia, setMobileMedia] = useState(false);
  const [mobileGallery, setMobileGallery] = useState(false);
  const [mobileCareers, setMobileCareers] = useState(false);
  
  const [hoveredEsg, setHoveredEsg] = useState("Environment & Climate");
  const [hoveredMedia, setHoveredMedia] = useState("Blogs");
  const [hoveredGallery, setHoveredGallery] = useState("Office");
  const [hoveredCareers, setHoveredCareers] = useState("Factory");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCompanyOpen(false);
    setEsgOpen(false);
    setMediaOpen(false);
    setGalleryOpen(false);
    setCareersOpen(false);
    setMobileCo(false);
    setMobileEsg(false);
    setMobileMedia(false);
    setMobileGallery(false);
    setMobileCareers(false);
  }, [location.pathname, location.search]);

  const companyActive = ["/about", "/businesses"].some(p => location.pathname.startsWith(p));
  const esgActive = location.pathname.startsWith("/sustainability");
  const mediaActive = location.pathname.startsWith("/media");
  const galleryActive = location.pathname.startsWith("/gallery");
  const careersActive = location.pathname.startsWith("/careers");
  const esgPreview = liveEsgLinks.find((item) => item.label === hoveredEsg) || liveEsgLinks[0] || {};
  const mediaPreview = liveMediaLinks.find((item) => item.label === hoveredMedia) || liveMediaLinks[0] || {};
  const galleryPreview = liveGalleryLinks.find((item) => item.label === hoveredGallery) || liveGalleryLinks[0] || {};
  const careersPreview = liveCareerLinks.find((item) => item.label === hoveredCareers) || liveCareerLinks[0] || {};

  return (
    <header className={`top-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner" style={{ padding: '0 3vw' }}>
        <Link to="/" className="logo-wrap" aria-label="Aadishakti Home" style={{ marginRight: '2vw' }}>
          <img src={ASSETS.logo} alt="AadiShakti Logo" className="nav-logo" />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="desktop-nav" aria-label="Primary" style={{ flex: 1, justifyContent: "center", gap: "1.5vw", height: "100%" }}>
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>HOME</Link>

          {/* COMPANY — MEGA DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setCompanyOpen(true)} onMouseLeave={() => setCompanyOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${companyActive ? "active" : ""}`}>
              COMPANY
              <svg className={`caret ${companyOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${companyOpen ? "open" : ""}`}>
              <div className="mega-left">
                {liveCompanyLinks.map((item, idx) => (
                  <Fragment key={item.to + item.label}>
                    {idx === 1 && <div className="drop-divider" />}
                    <Link to={item.to} className={`drop-item ${item.sub ? "sub" : ""}`}>{item.label}</Link>
                  </Fragment>
                ))}
              </div>
              <div className="mega-right">
                <img src={navigation.companyPreviewImage || ASSETS.megaMenuPhoto} alt="Aadishakti Plant" loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {navigation.companyPreviewEyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {navigation.companyPreviewText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>PRODUCTS</Link>
          <Link to="/custom-alloy" className={`nav-link ${location.pathname === "/custom-alloy" ? "active" : ""}`}>ALLOY REQ</Link>

          {/* ESG — MEGA DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setEsgOpen(true)} onMouseLeave={() => setEsgOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${esgActive ? "active" : ""}`}>
              ESG
              <svg className={`caret ${esgOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${esgOpen ? "open" : ""}`} style={{ width: '420px', gridTemplateColumns: '1fr 220px' }}>
              <div className="mega-left">
                {liveEsgLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredEsg(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={esgPreview.previewImage || ASSETS.megaMenuPhoto} alt={esgPreview.label || hoveredEsg} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {esgPreview.previewEyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {esgPreview.previewText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/investors" className={`nav-link ${location.pathname === "/investors" ? "active" : ""}`}>INVESTORS</Link>
          <Link to="/sourcing" className={`nav-link ${location.pathname === "/sourcing" ? "active" : ""}`}>SOURCING</Link>

          {/* MEDIA DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setMediaOpen(true)} onMouseLeave={() => setMediaOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${mediaActive ? "active" : ""}`}>
              MEDIA
              <svg className={`caret ${mediaOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${mediaOpen ? "open" : ""}`} style={{ width: '420px', gridTemplateColumns: '1fr 220px' }}>
              <div className="mega-left">
                {liveMediaLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredMedia(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={mediaPreview.previewImage || ASSETS.megaMenuPhoto} alt={mediaPreview.label || hoveredMedia} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {mediaPreview.previewEyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mediaPreview.previewText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GALLERY DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setGalleryOpen(true)} onMouseLeave={() => setGalleryOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${galleryActive ? "active" : ""}`}>
              GALLERY
              <svg className={`caret ${galleryOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${galleryOpen ? "open" : ""}`} style={{ width: '420px', gridTemplateColumns: '1fr 220px' }}>
              <div className="mega-left">
                {liveGalleryLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredGallery(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={galleryPreview.previewImage || ASSETS.megaMenuPhoto} alt={galleryPreview.label || hoveredGallery} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {galleryPreview.previewEyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {galleryPreview.previewText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CAREERS DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setCareersOpen(true)} onMouseLeave={() => setCareersOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${careersActive ? "active" : ""}`}>
              CAREERS
              <svg className={`caret ${careersOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${careersOpen ? "open" : ""}`} style={{ width: '420px', gridTemplateColumns: '1fr 220px', left: 'auto', right: 0 }}>
              <div className="mega-left">
                {liveCareerLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item" onMouseEnter={() => setHoveredCareers(item.label)}>{item.label}</Link>
                ))}
              </div>
              <div className="mega-right">
                <img src={careersPreview.previewImage || ASSETS.megaMenuPhoto} alt={careersPreview.label || hoveredCareers} loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {careersPreview.previewEyebrow}
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {careersPreview.previewText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="desktop-cta" style={{ gap: '12px', marginLeft: 'auto', alignItems: 'center' }}>
          <Link to="/login" className="btn-portal-login">PORTAL LOGIN</Link>
          <Link to="/contact" className="cta" style={{ display: 'inline-flex', alignItems: 'center', height: '38px', boxSizing: 'border-box' }}>{navCtaText}</Link>
        </div>

        <button type="button" className={`hamburger ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <aside className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <button 
          type="button" 
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '32px', color: 'var(--text-primary)', cursor: 'pointer', zIndex: 10 }}
        >
          &times;
        </button>

        <Link to="/" className="mobile-link">HOME</Link>

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileCo(v => !v)}>
          COMPANY {mobileCo ? "▲" : "▼"}
        </button>
        {mobileCo && (
          <div className="mobile-submenu">
            {liveCompanyLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className={`mobile-sub ${item.sub ? "sub" : ""}`}>{item.sub ? `→ ${item.label}` : item.label}</Link>
            ))}
          </div>
        )}

        <Link to="/products" className="mobile-link">PRODUCTS</Link>
        <Link to="/custom-alloy" className="mobile-link">ALLOY REQ</Link>
        
        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileEsg(v => !v)}>
          ESG {mobileEsg ? "▲" : "▼"}
        </button>
        {mobileEsg && (
          <div className="mobile-submenu">
            {liveEsgLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className="mobile-sub">{item.label}</Link>
            ))}
          </div>
        )}

        <Link to="/investors" className="mobile-link">INVESTORS</Link>
        <Link to="/sourcing" className="mobile-link">SOURCING</Link>

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileMedia(v => !v)}>
          MEDIA {mobileMedia ? "▲" : "▼"}
        </button>
        {mobileMedia && (
          <div className="mobile-submenu">
            {liveMediaLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className="mobile-sub">{item.label}</Link>
            ))}
          </div>
        )}

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileGallery(v => !v)}>
          GALLERY {mobileGallery ? "▲" : "▼"}
        </button>
        {mobileGallery && (
          <div className="mobile-submenu">
            {liveGalleryLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className="mobile-sub">{item.label}</Link>
            ))}
          </div>
        )}

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileCareers(v => !v)}>
          CAREERS {mobileCareers ? "▲" : "▼"}
        </button>
        {mobileCareers && (
          <div className="mobile-submenu">
            {liveCareerLinks.map((item) => <Link key={item.to} to={item.to} className="mobile-sub">{item.label}</Link>)}
          </div>
        )}

        <Link to="/contact" className="mobile-link">CONTACT</Link>
        <Link to="/login" className="mobile-link" style={{ color: 'var(--red-core)' }}>PORTAL LOGIN</Link>
        <Link to="/contact" className="cta mobile-cta" style={{ marginTop: '2rem' }}>{navCtaText}</Link>
      </aside>

      <style>{`
        .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 72px; background: rgba(255,255,255,0.97); border-bottom: 1px solid var(--border-light); backdrop-filter: blur(10px); transition: top 0.25s ease, box-shadow 0.25s ease; }
        .top-nav.scrolled { box-shadow: var(--shadow-sm); }
        .nav-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 3vw; max-width: 100%; }
        .logo-wrap { display: inline-flex; margin-right: 20px; }
        .nav-logo { height: 40px; transition: height 0.3s ease; }
        .top-nav.scrolled .nav-logo { height: 34px; }
        .desktop-nav { display: flex; align-items: center; flex-wrap: nowrap; }
        .desktop-cta { display: flex; }
        .nav-link { position: relative; display: inline-flex; align-items: center; font: 600 11px var(--font-primary); letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-primary); transition: color 0.2s ease; white-space: nowrap; }
        .nav-link:hover { color: var(--red-core); }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -8px; height: 2px; background: var(--red-core); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
        .nav-link.active { color: var(--red-core); }
        .nav-link.active::after { transform: scaleX(1); }
        .company-wrap { position: relative; display: inline-flex; align-items: center; }
        .company-trigger { border: 0; background: transparent; display: inline-flex; gap: 4px; align-items: center; cursor: pointer; }
        .caret { width: 8px; color: var(--text-muted); transition: transform 0.2s ease; }
        .caret.open { transform: rotate(180deg); }
        .drop-item { display: block; padding: 10px 24px; font: 500 13px var(--font-primary); color: var(--text-secondary); }
        .drop-item:hover { background: var(--red-subtle); color: var(--red-core); }
        .drop-item.sub { padding-left: 36px; font-size: 12px; color: var(--text-muted); }
        .drop-item.sub::before { content: "→ "; }
        .drop-divider { height: 1px; background: var(--border-light); margin: 6px 16px; }
        .cta { background: var(--red-core); color: #fff; border-radius: 2px; padding: 10px 16px; font: 700 11px var(--font-primary); letter-spacing: 0.18em; text-transform: uppercase; transition: all 0.2s ease; white-space: nowrap; }
        .cta:hover { background: var(--red-bright); box-shadow: var(--shadow-red); }
        .hamburger { display: none; margin-left: auto; background: none; border: 0; width: 30px; cursor: pointer; }
        .hamburger span { display: block; width: 100%; height: 2px; background: var(--red-core); margin: 6px 0; transition: 0.25s ease; }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .mobile-drawer { position: fixed; top: 0; right: -100%; width: 100vw; height: 100dvh; background: #fff; border-left: 3px solid var(--red-core); padding: 80px 32px 40px; transition: right 0.3s ease; z-index: 999; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
        .mobile-drawer.open { right: 0; }
        .mobile-link { font: 700 18px var(--font-primary); color: var(--text-primary); padding: 12px 0; border-bottom: 1px solid var(--border-light); text-transform: uppercase; transition: color 0.2s; }
        .mobile-link:hover { color: var(--red-core); }
        .mobile-company { width: 100%; text-align: left; background: none; border-left: 0; border-right: 0; border-top: 0; cursor: pointer; }
        .mobile-submenu { display: flex; flex-direction: column; gap: 2px; padding: 4px 0 8px; border-bottom: 1px solid var(--border-light); }
        .mobile-sub { display: block; padding: 8px 0 8px 12px; color: var(--text-secondary); font: 500 13px var(--font-primary); }
        .mobile-sub.sub { color: var(--text-muted); padding-left: 20px; }
        .mobile-cta { width: 100%; text-align: center; margin: auto 0 0; font-size: 13px; }
        @media (max-width: 1400px) {
          .nav-link { font-size: 10px; letter-spacing: 0.05em; }
          .desktop-nav { gap: 10px !important; }
        }
        @media (max-width: 1250px) {
          .desktop-nav, .desktop-cta { display: none !important; }
          .hamburger { display: block; }
          .top-nav { height: 60px; }
          .nav-logo { height: 34px; }
          .top-nav.scrolled .nav-logo { height: 32px; }
        }
      `}</style>
    </header>
  );
}
