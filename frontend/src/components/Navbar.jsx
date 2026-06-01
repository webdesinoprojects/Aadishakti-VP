import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ASSETS } from "../assets/assetMap";
import { useCms } from "../context/CmsContext";

const companyLinks = [
  { to: "/about",                    label: "About Us" },
  { to: "/businesses",               label: "Our Businesses" },
  { to: "/businesses?plant=mundra",  label: "AGRPL — Mundra Plant",  sub: true },
  { to: "/businesses?plant=roorkee", label: "AMRPL — Roorkee Plant", sub: true },
  { to: "/sustainability",            label: "Sustainability" },
  { to: "/careers",                  label: "Careers" },
];

export default function Navbar() {
  const { cms } = useCms();
  const navCtaText = cms?.nav?.ctaText || "GET IN TOUCH";
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileCo, setMobileCo]       = useState(false);
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
    setMobileCo(false);
  }, [location.pathname, location.search]);

  const companyActive = ["/about", "/businesses", "/sustainability", "/careers"].some(
    (p) => location.pathname.startsWith(p)
  );

  return (
    <header className={`top-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo-wrap" aria-label="Aadishakti Home">
          <img src={ASSETS.logo} alt="AadiShakti Logo" className="nav-logo" />
        </Link>

        {/* â”€â”€ Desktop Nav â”€â”€ */}
        <nav className="desktop-nav" aria-label="Primary">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>HOME</Link>

          {/* COMPANY â€” MEGA DROPDOWN */}
          <div
            className="company-wrap"
            onMouseEnter={() => setCompanyOpen(true)}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button type="button" className={`nav-link company-trigger ${companyActive ? "active" : ""}`}>
              COMPANY
              <svg className={`caret ${companyOpen ? "open" : ""}`} viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>

            <div className={`mega-dropdown ${companyOpen ? "open" : ""}`}>
              {/* Left â€” links */}
              <div className="mega-left">
                {companyLinks.map((item, idx) => (
                  <React.Fragment key={item.to + item.label}>
                    {idx === 1 && <div className="drop-divider" />}
                    <Link to={item.to} className={`drop-item ${item.sub ? "sub" : ""}`}>
                      {item.label}
                    </Link>
                  </React.Fragment>
                ))}
              </div>

              {/* Right â€” contextual panel */}
              <div className="mega-right">
                <img
                  src={ASSETS.megaMenuPhoto}
                  alt="Aadishakti Plant"
                  loading="lazy"
                />
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

          <Link to="/products"    className={`nav-link ${location.pathname === "/products"    ? "active" : ""}`}>PRODUCTS</Link>
          <Link to="/investors"   className={`nav-link ${location.pathname === "/investors"   ? "active" : ""}`}>INVESTORS</Link>
          <Link to="/sourcing"    className={`nav-link ${location.pathname === "/sourcing"    ? "active" : ""}`}>SOURCING</Link>
        </nav>

        <Link to="/contact" className="cta desktop-cta">{navCtaText}</Link>

        <button
          type="button"
          className={`hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* â”€â”€ Mobile Drawer â”€â”€ */}
      <aside className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <Link to="/" className="mobile-link">HOME</Link>

        <button type="button" className="mobile-link mobile-company" onClick={() => setMobileCo((v) => !v)}>
          COMPANY {mobileCo ? "▲" : "▼"}
        </button>
        {mobileCo && (
          <div className="mobile-submenu">
            {companyLinks.map((item) => (
              <Link key={item.to + item.label} to={item.to} className={`mobile-sub ${item.sub ? "sub" : ""}`}>
                {item.sub ? `→ ${item.label}` : item.label}
              </Link>
            ))}
          </div>
        )}

        <Link to="/products"  className="mobile-link">PRODUCTS</Link>
        <Link to="/investors" className="mobile-link">INVESTORS</Link>
        <Link to="/sourcing"  className="mobile-link">SOURCING</Link>
        <Link to="/contact"   className="mobile-link">CONTACT</Link>
        <Link to="/contact"   className="cta mobile-cta">{navCtaText}</Link>
      </aside>

      <style>{`
        .top-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 72px; background: rgba(255,255,255,0.97);
          border-bottom: 1px solid var(--border-light);
          backdrop-filter: blur(10px);
          transition: top 0.25s ease, box-shadow 0.25s ease;
        }
        .top-nav.scrolled { box-shadow: var(--shadow-sm); }
        .nav-inner { height: 100%; display: flex; align-items: center; gap: 24px; }
        .logo-wrap { display: inline-flex; }
        .nav-logo { height: 40px; transition: height 0.3s ease; }
        .top-nav.scrolled .nav-logo { height: 34px; }

        .desktop-nav { display: flex; align-items: center; gap: 32px; margin-left: auto; }

        .nav-link {
          position: relative; font: 600 13px var(--font-primary);
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-primary);
          transition: color 0.2s ease;
        }
        .nav-link:hover { color: var(--red-core); }
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -26px;
          height: 2px; background: var(--red-core);
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .nav-link.active { color: var(--red-core); }
        .nav-link.active::after { transform: scaleX(1); }

        .company-wrap { position: relative; padding: 24px 0; }
        .company-trigger { border: 0; background: transparent; display: inline-flex; gap: 7px; align-items: center; cursor: pointer; }
        .caret { width: 8px; color: var(--text-muted); transition: transform 0.2s ease; }
        .caret.open { transform: rotate(180deg); }

        /* Mega dropdown overrides drop-item */
        .drop-item { display: block; padding: 10px 24px; font: 500 13px var(--font-primary); color: var(--text-secondary); }
        .drop-item:hover { background: var(--red-subtle); color: var(--red-core); }
        .drop-item.sub { padding-left: 36px; font-size: 12px; color: var(--text-muted); }
        .drop-item.sub::before { content: "→ "; }
        .drop-divider { height: 1px; background: var(--border-light); margin: 6px 16px; }

        .cta {
          margin-left: 16px; background: var(--red-core); color: #fff; border-radius: 2px;
          padding: 10px 20px; font: 700 11px var(--font-primary); letter-spacing: 0.18em;
          text-transform: uppercase; transition: all 0.2s ease; white-space: nowrap;
        }
        .cta:hover { background: var(--red-bright); box-shadow: var(--shadow-red); }

        .hamburger { display: none; margin-left: auto; background: none; border: 0; width: 30px; cursor: pointer; }
        .hamburger span { display: block; width: 100%; height: 2px; background: var(--red-core); margin: 6px 0; transition: 0.25s ease; }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-drawer {
          position: fixed; top: 0; right: -100%; width: 100vw; height: 100dvh;
          background: #fff; border-left: 3px solid var(--red-core);
          padding: 80px 32px 40px; transition: right 0.3s ease;
          z-index: 999; display: flex; flex-direction: column; gap: 4px; overflow-y: auto;
        }
        .mobile-drawer.open { right: 0; }
        .mobile-link {
          font: 700 20px var(--font-primary); color: var(--text-primary);
          padding: 14px 0; border-bottom: 1px solid var(--border-light);
          text-transform: uppercase; transition: color 0.2s;
        }
        .mobile-link:hover { color: var(--red-core); }
        .mobile-company { width: 100%; text-align: left; background: none; border-left: 0; border-right: 0; border-top: 0; cursor: pointer; }
        .mobile-submenu { display: flex; flex-direction: column; gap: 2px; padding: 4px 0 8px; border-bottom: 1px solid var(--border-light); }
        .mobile-sub { display: block; padding: 8px 0 8px 12px; color: var(--text-secondary); font: 500 13px var(--font-primary); }
        .mobile-sub.sub { color: var(--text-muted); padding-left: 20px; }
        .mobile-cta { width: 100%; text-align: center; margin: auto 0 0; font-size: 13px; }

        @media (max-width: 1100px) {
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


