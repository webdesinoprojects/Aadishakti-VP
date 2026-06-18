import { useEffect, useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ASSETS } from "../assets/assetMap";
import { useCms } from "../context/CmsContext";

const companyLinks = [
  { to: "/about",                    label: "About Us" },
  { to: "/businesses",               label: "Our Businesses" },
  { to: "/businesses?plant=mundra",  label: "AGRPL — Mundra Plant",  sub: true },
  { to: "/businesses?plant=roorkee", label: "AMRPL — Roorkee Plant", sub: true },
  { to: "/sustainability",            label: "Sustainability" },
];

const mediaLinks = [
  { to: "/media?type=blogs", label: "Blogs" },
  { to: "/media?type=news",  label: "News" },
  { to: "/media?type=events", label: "Events" },
];

const galleryLinks = [
  { to: "/gallery?category=office",      label: "Office" },
  { to: "/gallery?category=plants",      label: "Plants" },
  { to: "/gallery?category=events",      label: "Events" },
  { to: "/gallery?category=celebration", label: "Celebration" },
];

export default function Navbar() {
  const { cms } = useCms();
  const navCtaText = cms?.nav?.ctaText || "GET IN TOUCH";
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mediaOpen, setMediaOpen]     = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [mobileCo, setMobileCo]       = useState(false);
  const [mobileMedia, setMobileMedia] = useState(false);
  const [mobileGallery, setMobileGallery] = useState(false);
  const [mobileCareers, setMobileCareers] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    setMobileOpen(false);
    setCompanyOpen(false);
    setMediaOpen(false);
    setGalleryOpen(false);
    setCareersOpen(false);
    setMobileCo(false);
    setMobileMedia(false);
    setMobileGallery(false);
    setMobileCareers(false);
  }, [location.pathname, location.search]);

  const companyActive = ["/about", "/businesses", "/sustainability"].some(p => location.pathname.startsWith(p));
  const mediaActive = location.pathname.startsWith("/media");
  const galleryActive = location.pathname.startsWith("/gallery");
  const careersActive = location.pathname.startsWith("/careers");

  return (
    <header className={`top-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="logo-wrap" aria-label="Aadishakti Home" style={{ marginRight: 'auto' }}>
          <img src={ASSETS.logo} alt="AadiShakti Logo" className="nav-logo" />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="desktop-nav" aria-label="Primary" style={{ gap: '20px' }}>
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
                {companyLinks.map((item, idx) => (
                  <Fragment key={item.to + item.label}>
                    {idx === 1 && <div className="drop-divider" />}
                    <Link to={item.to} className={`drop-item ${item.sub ? "sub" : ""}`}>{item.label}</Link>
                  </Fragment>
                ))}
              </div>
              <div className="mega-right">
                <img src={ASSETS.megaMenuPhoto} alt="Aadishakti Plant" loading="lazy" />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px" }}>
                    Est. 2004 · ISO 9001:2015
                  </div>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Two world-class plants. One standard of excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/products" className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}>PRODUCTS</Link>
          <Link to="/investors" className={`nav-link ${location.pathname === "/investors" ? "active" : ""}`}>INVESTORS</Link>
          <Link to="/sourcing" className={`nav-link ${location.pathname === "/sourcing" ? "active" : ""}`}>SOURCING</Link>
          <Link to="/import" className={`nav-link ${location.pathname === "/import" ? "active" : ""}`}>IMPORT</Link>

          {/* MEDIA DROPDOWN */}
          <div className="company-wrap" onMouseEnter={() => setMediaOpen(true)} onMouseLeave={() => setMediaOpen(false)}>
            <button type="button" className={`nav-link company-trigger ${mediaActive ? "active" : ""}`}>
              MEDIA
              <svg className={`caret ${mediaOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <div className={`mega-dropdown ${mediaOpen ? "open" : ""}`} style={{ width: '300px', minWidth: '300px' }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                {mediaLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item">{item.label}</Link>
                ))}
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
            <div className={`mega-dropdown ${galleryOpen ? "open" : ""}`} style={{ width: '300px', minWidth: '300px' }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                {galleryLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="drop-item">{item.label}</Link>
                ))}
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
            <div className={`mega-dropdown ${careersOpen ? "open" : ""}`} style={{ width: '250px', minWidth: '250px', left: 'auto', right: 0 }}>
              <div className="mega-left" style={{ width: '100%', paddingRight: '24px' }}>
                <Link to="/careers?category=factory" className="drop-item">Factory</Link>
                <Link to="/careers?category=office" className="drop-item">Office</Link>
              </div>
            </div>
          </div>
        </nav>

        <div style={{ display: 'flex', gap: '12px', marginLeft: '12px', alignItems: 'center' }} className="desktop-cta">
          <Link to="/login" className="btn-portal-login">PORTAL LOGIN</Link>
          <Link to="/contact" className="cta">{navCtaText}</Link>
        </div>

        <button type="button" className={`hamburger ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <aside className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <Link to="/" className="mobile-link">HOME</Link>

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileCo(v => !v)}>
          COMPANY {mobileCo ? "▲" : "▼"}
        </button>
        {mobileCo && (
          <div className="mobile-submenu">
            {companyLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className={`mobile-sub ${item.sub ? "sub" : ""}`}>{item.sub ? `→ ${item.label}` : item.label}</Link>
            ))}
          </div>
        )}

        <Link to="/products" className="mobile-link">PRODUCTS</Link>
        <Link to="/investors" className="mobile-link">INVESTORS</Link>
        <Link to="/sourcing" className="mobile-link">SOURCING</Link>
        <Link to="/import" className="mobile-link">IMPORT</Link>

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileMedia(v => !v)}>
          MEDIA {mobileMedia ? "▲" : "▼"}
        </button>
        {mobileMedia && (
          <div className="mobile-submenu">
            {mediaLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className="mobile-sub">{item.label}</Link>
            ))}
          </div>
        )}

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileGallery(v => !v)}>
          GALLERY {mobileGallery ? "▲" : "▼"}
        </button>
        {mobileGallery && (
          <div className="mobile-submenu">
            {galleryLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className="mobile-sub">{item.label}</Link>
            ))}
          </div>
        )}

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileCareers(v => !v)}>
          CAREERS {mobileCareers ? "▲" : "▼"}
        </button>
        {mobileCareers && (
          <div className="mobile-submenu">
            <Link to="/careers?category=factory" className="mobile-sub">Factory</Link>
            <Link to="/careers?category=office" className="mobile-sub">Office</Link>
          </div>
        )}

        <Link to="/contact" className="mobile-link">CONTACT</Link>
        <Link to="/login" className="mobile-link" style={{ color: 'var(--red-core)' }}>PORTAL LOGIN</Link>
        <Link to="/contact" className="cta mobile-cta" style={{ marginTop: '2rem' }}>{navCtaText}</Link>
      </aside>

      <style>{`
        .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; height: 72px; background: rgba(255,255,255,0.97); border-bottom: 1px solid var(--border-light); backdrop-filter: blur(10px); transition: top 0.25s ease, box-shadow 0.25s ease; }
        .top-nav.scrolled { box-shadow: var(--shadow-sm); }
        .nav-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 5vw; max-width: 100%; }
        .logo-wrap { display: inline-flex; margin-right: 20px; }
        .nav-logo { height: 40px; transition: height 0.3s ease; }
        .top-nav.scrolled .nav-logo { height: 34px; }
        .desktop-nav { display: flex; align-items: center; flex-wrap: nowrap; }
        .nav-link { position: relative; font: 600 12px var(--font-primary); letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-primary); transition: color 0.2s ease; white-space: nowrap; }
        .nav-link:hover { color: var(--red-core); }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -26px; height: 2px; background: var(--red-core); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
        .nav-link.active { color: var(--red-core); }
        .nav-link.active::after { transform: scaleX(1); }
        .company-wrap { position: relative; padding: 24px 0; }
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
          .nav-link { font-size: 11px; letter-spacing: 0.05em; }
          .desktop-nav { gap: 12px !important; }
        }
        @media (max-width: 1150px) {
          .desktop-nav, .desktop-cta { display: none; }
          .hamburger { display: block; }
          .top-nav { height: 60px; }
          .nav-logo { height: 34px; }
          .top-nav.scrolled .nav-logo { height: 32px; }
        }
      `}</style>
    </header>
  );
}
