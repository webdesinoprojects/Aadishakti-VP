import React, { useState, useEffect } from "react";

export default function Header({ activeSection, setActiveSection, darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection to retract sticky header and change opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "products", label: "Products" },
    { id: "investors", label: "Investor's Corner" },
    { id: "import", label: "Imports" },
    { id: "gallery", label: "Gallery" },
    { id: "careers", label: "Careers" },
    { id: "contact", label: "Contact Us" },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsOpen(false);
    // Smooth scroll
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: scrolled ? "rgba(10, 10, 10, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(231, 76, 60, 0.2)" : "1px solid transparent",
        transition: "background var(--transition-cubic), border-bottom var(--transition-cubic)",
      }}
      className={scrolled ? "navbar-scrolled" : ""}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "80px" }}>
        
        {/* Logo Left */}
        <div className="logo-container" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }} onClick={() => handleNavClick("home")}>
          <img src="/logo.png" alt="AadiShakti Logo" className="navbar-logo" style={{ width: "auto", objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "28px", letterSpacing: "0.08em", color: "var(--color-white)" }}>AADISHAKTI</span>
        </div>

        {/* Desktop Links Center */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }} className="desktop-menu-only">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ENQUIRE NOW Pill button right */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="enquire-btn-container desktop-menu-only">
            <button onClick={() => handleNavClick("contact")} className="btn-spark">
              ENQUIRE NOW
            </button>
          </div>

          {/* Hamburger Menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-nav-toggle-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: "6px",
              width: "30px",
              zIndex: 1001,
            }}
          >
            <span style={{ width: "100%", height: "2px", backgroundColor: "var(--color-scarlet)", transform: isOpen ? "rotate(45deg) translate(6px, 5px)" : "none", transition: "transform 0.3s" }}></span>
            <span style={{ width: "100%", height: "2px", backgroundColor: "var(--color-scarlet)", opacity: isOpen ? 0 : 1, transition: "opacity 0.3s" }}></span>
            <span style={{ width: "100%", height: "2px", backgroundColor: "var(--color-scarlet)", transform: isOpen ? "rotate(-45deg) translate(6px, -5px)" : "none", transition: "transform 0.3s" }}></span>
          </button>
        </div>
      </div>

      {/* Full height drawer menu sliding from right */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-100%",
          width: "320px",
          height: "100vh",
          backgroundColor: "var(--color-iron)",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          padding: "5rem 2rem 2rem 2rem",
          gap: "1.5rem",
          zIndex: 999,
          transition: "right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.id);
            }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: activeSection === item.id ? "var(--color-scarlet)" : "var(--color-white)",
              display: "block",
            }}
          >
            {item.label}
          </a>
        ))}
        <button
          onClick={() => handleNavClick("contact")}
          className="btn-spark"
          style={{ width: "100%", marginTop: "2rem" }}
        >
          ENQUIRE NOW
        </button>
      </div>

      {/* CSS overrides for desktop/mobile and custom sparkle spans */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 901px) {
          .desktop-menu-only { display: flex !important; }
        }
        @media (max-width: 900px) {
          .desktop-menu-only { display: none !important; }
          .mobile-nav-toggle-btn { display: flex !important; }
        }
      `}} />
    </header>
  );
}
